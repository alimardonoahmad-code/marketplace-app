import {

  Injectable,

  NotFoundException,

  BadRequestException,

  ForbiddenException,

} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository, DataSource } from 'typeorm';

import { Order } from '../entities/order.entity';

import { OrderItem } from '../entities/order-item.entity';

import { OrderStatusHistory } from '../entities/order-status-history.entity';

import { Product } from '../entities/product.entity';

import { CartItem } from '../entities/cart-item.entity';

import { User } from '../entities/user.entity';

import { CreateOrderDto, UpdateOrderStatusDto, AssignCourierDto } from './dto/order.dto';

import {

  OrderStatus,

  PaymentMethod,

  PaymentStatus,

  UserRole,

  ProductStatus,

} from '../common/enums';

import { NotificationsService } from '../notifications/notifications.service';

import { NotificationType } from '../entities/notification.entity';

import { PaymentsService } from '../payments/payments.service';

import { CouponsService } from '../coupons/coupons.service';

import { normalizePhone } from '../payments/card-payment.util';



@Injectable()

export class OrdersService {

  constructor(

    @InjectRepository(Order)

    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)

    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(OrderStatusHistory)

    private historyRepository: Repository<OrderStatusHistory>,

    @InjectRepository(Product)

    private productRepository: Repository<Product>,

    @InjectRepository(CartItem)

    private cartRepository: Repository<CartItem>,

    @InjectRepository(User)

    private userRepository: Repository<User>,

    private notificationsService: NotificationsService,

    private paymentsService: PaymentsService,

    private couponsService: CouponsService,

    private dataSource: DataSource,

  ) {}



  private async addHistory(orderId: string, status: OrderStatus, changedById?: string, note?: string) {

    const entry = this.historyRepository.create({ orderId, status, changedById, note });

    return this.historyRepository.save(entry);

  }



  private async notifyOrder(userId: string, title: string, message: string, orderId: string) {

    await this.notificationsService.create(

      userId, title, message, NotificationType.ORDER, `/orders/${orderId}`,

    );

  }



  async create(userId: string, dto: CreateOrderDto) {

    const cartItems = await this.cartRepository.find({

      where: { userId },

      relations: ['product'],

    });



    if (!cartItems.length) {

      throw new BadRequestException('Cart is empty');

    }



    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();



    try {

      let totalPrice = 0;

      const orderItems: Partial<OrderItem>[] = [];



      for (const cartItem of cartItems) {

        const product = cartItem.product;



        if (product.status !== ProductStatus.APPROVED) {

          throw new BadRequestException(`Product "${product.name}" is not available`);

        }



        if (product.stock < cartItem.quantity) {

          throw new BadRequestException(

            `Insufficient stock for "${product.name}". Available: ${product.stock}`,

          );

        }



        const price = Number(product.discountPrice || product.price);

        totalPrice += price * cartItem.quantity;



        orderItems.push({

          productId: product.id,

          quantity: cartItem.quantity,

          price,

        });



        product.stock -= cartItem.quantity;

        await queryRunner.manager.save(product);

      }



      let discountAmount = 0;
      let couponCode: string | undefined;
      if (dto.couponCode?.trim()) {
        const applied = await this.couponsService.apply(dto.couponCode.trim(), totalPrice);
        discountAmount = applied.discount;
        couponCode = applied.code;
        totalPrice = Math.max(0, totalPrice - discountAmount);
      }

      const paymentPhone = normalizePhone(dto.paymentPhone);
      let paymentStatus = PaymentStatus.PENDING;
      let cardLast4: string | undefined;
      let paymentReference: string | undefined;
      let paymentProvider: string | undefined;

      if (dto.paymentMethod === PaymentMethod.ONLINE) {
        const cardResult = this.paymentsService.processOnlineCardPayment(
          dto.cardNumber!,
          dto.cardExpiry!,
          dto.cardCvv!,
          dto.cardHolder!,
          totalPrice,
        );
        paymentStatus = PaymentStatus.PAID;
        cardLast4 = cardResult.last4;
        paymentReference = cardResult.reference;
        paymentProvider = 'card';
      } else if (dto.paymentMethod === PaymentMethod.ALIF) {
        const wallet = this.paymentsService.processAlifPayment(paymentPhone, totalPrice);
        paymentStatus = PaymentStatus.PAID;
        paymentReference = wallet.reference;
        paymentProvider = wallet.provider;
      } else if (dto.paymentMethod === PaymentMethod.ESKHATA) {
        const wallet = this.paymentsService.processEskhataPayment(paymentPhone, totalPrice);
        paymentStatus = PaymentStatus.PAID;
        paymentReference = wallet.reference;
        paymentProvider = wallet.provider;
      }



      const order = queryRunner.manager.create(Order, {

        userId,

        totalPrice,

        shippingAddress: dto.shippingAddress,

        paymentMethod: dto.paymentMethod,

        paymentStatus,
        paymentPhone,
        cardLast4,
        paymentReference,
        paymentProvider,
        couponCode,
        discountAmount,

        notes: dto.notes,

        status: OrderStatus.PENDING,

      });



      const savedOrder = await queryRunner.manager.save(order);



      for (const item of orderItems) {

        const orderItem = queryRunner.manager.create(OrderItem, {

          ...item,

          orderId: savedOrder.id,

        });

        await queryRunner.manager.save(orderItem);

      }



      await queryRunner.manager.delete(CartItem, { userId });

      await queryRunner.commitTransaction();



      await this.addHistory(savedOrder.id, OrderStatus.PENDING, userId, 'Order created');

      await this.notifyOrder(userId, 'Фармоиши нав', `Фармоиши #${savedOrder.id.slice(0, 8)} сабт шуд`, savedOrder.id);



      return this.findOne(savedOrder.id, { id: userId, role: UserRole.BUYER } as User);

    } catch (error) {

      await queryRunner.rollbackTransaction();

      throw error;

    } finally {

      await queryRunner.release();

    }

  }



  async findUserOrders(userId: string) {

    return this.orderRepository.find({

      where: { userId },

      relations: ['items', 'items.product', 'courier'],

      order: { createdAt: 'DESC' },

    });

  }



  async findSellerOrders(sellerId: string) {

    return this.orderRepository

      .createQueryBuilder('order')

      .leftJoinAndSelect('order.items', 'item')

      .leftJoinAndSelect('item.product', 'product')

      .leftJoinAndSelect('order.user', 'user')

      .where('product.sellerId = :sellerId', { sellerId })

      .orderBy('order.createdAt', 'DESC')

      .getMany();

  }



  async findAll() {

    return this.orderRepository.find({

      relations: ['items', 'items.product', 'user', 'courier'],

      order: { createdAt: 'DESC' },

    });

  }



  async findOne(id: string, user: User) {

    const order = await this.orderRepository.findOne({

      where: { id },

      relations: ['items', 'items.product', 'items.product.seller', 'user', 'courier'],

    });



    if (!order) {

      throw new NotFoundException('Order not found');

    }



    const isBuyer = order.userId === user.id;

    const isAdmin = user.role === UserRole.ADMIN;

    const isCourier = user.role === UserRole.COURIER && order.courierId === user.id;

    const isSeller = order.items.some((item) => item.product.sellerId === user.id);



    if (!isBuyer && !isAdmin && !isCourier && !isSeller) {

      throw new ForbiddenException('Access denied');

    }



    return order;

  }



  async getHistory(id: string, user: User) {

    await this.findOne(id, user);

    return this.historyRepository.find({

      where: { orderId: id },

      relations: ['changedBy'],

      order: { createdAt: 'ASC' },

    });

  }



  private validTransitions: Record<OrderStatus, OrderStatus[]> = {

    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],

    [OrderStatus.CONFIRMED]: [OrderStatus.PACKED, OrderStatus.CANCELLED],

    [OrderStatus.PACKED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],

    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],

    [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],

    [OrderStatus.CANCELLED]: [],

    [OrderStatus.REFUNDED]: [],

  };



  private async applyStatusChange(order: Order, newStatus: OrderStatus, userId?: string, note?: string) {

    if (!this.validTransitions[order.status]?.includes(newStatus)) {

      throw new BadRequestException(`Cannot transition from ${order.status} to ${newStatus}`);

    }



    if (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.REFUNDED) {

      for (const item of order.items) {

        const product = await this.productRepository.findOne({ where: { id: item.productId } });

        if (product) {

          product.stock += item.quantity;

          await this.productRepository.save(product);

        }

      }

    }



    order.status = newStatus;



    if (newStatus === OrderStatus.DELIVERED) {

      order.paymentStatus = PaymentStatus.PAID;

    }



    const saved = await this.orderRepository.save(order);

    await this.addHistory(order.id, newStatus, userId, note);

    await this.notifyOrder(

      order.userId,

      'Статуси фармоиш',

      `Фармоиш #${order.id.slice(0, 8)}: ${newStatus}`,

      order.id,

    );



    return saved;

  }



  async updateStatus(id: string, dto: UpdateOrderStatusDto, user: User) {

    const order = await this.orderRepository.findOne({

      where: { id },

      relations: ['items', 'items.product'],

    });

    if (!order) throw new NotFoundException('Order not found');



    const isSeller = order.items.some((item) => item.product.sellerId === user.id);



    if (user.role !== UserRole.ADMIN && user.role !== UserRole.SELLER) {

      throw new ForbiddenException('Only admin or seller can update order status');

    }

    if (user.role === UserRole.SELLER && !isSeller) {

      throw new ForbiddenException('Not your order');

    }



    if (dto.trackingNumber) {

      order.trackingNumber = dto.trackingNumber;

    }



    return this.applyStatusChange(order, dto.status, user.id, dto.trackingNumber ? `Tracking: ${dto.trackingNumber}` : undefined);

  }



  async cancelOrder(id: string, user: User) {

    const order = await this.orderRepository.findOne({

      where: { id },

      relations: ['items'],

    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.userId !== user.id) throw new ForbiddenException('Access denied');

    if (order.status !== OrderStatus.PENDING) {

      throw new BadRequestException('Only pending orders can be cancelled');

    }

    return this.applyStatusChange(order, OrderStatus.CANCELLED, user.id, 'Cancelled by buyer');

  }



  async deliverOrder(id: string, user: User) {

    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items'] });

    if (!order) throw new NotFoundException('Order not found');

    if (user.role !== UserRole.COURIER || order.courierId !== user.id) {

      throw new ForbiddenException('Only assigned courier can deliver');

    }

    if (order.status !== OrderStatus.SHIPPED) {

      throw new BadRequestException('Order must be shipped first');

    }

    return this.applyStatusChange(order, OrderStatus.DELIVERED, user.id, 'Delivered by courier');

  }



  async assignCourier(id: string, dto: AssignCourierDto) {

    const order = await this.orderRepository.findOne({ where: { id }, relations: ['items'] });

    if (!order) throw new NotFoundException('Order not found');



    const courier = await this.userRepository.findOne({

      where: { id: dto.courierId, role: UserRole.COURIER },

    });

    if (!courier) throw new BadRequestException('Invalid courier');



    order.courierId = dto.courierId;

    if ([OrderStatus.CONFIRMED, OrderStatus.PACKED].includes(order.status)) {

      order.status = OrderStatus.SHIPPED;

      await this.addHistory(order.id, OrderStatus.SHIPPED, undefined, `Courier assigned: ${courier.name}`);

    }



    const saved = await this.orderRepository.save(order);

    await this.notificationsService.create(

      dto.courierId,

      'Вазифаи нав',

      `Фармоиши #${id.slice(0, 8)} барои доставка`,

      NotificationType.DELIVERY,

      `/courier`,

    );

    return saved;

  }



  async getCourierOrders(courierId: string) {

    return this.orderRepository.find({

      where: { courierId },

      relations: ['items', 'items.product', 'user'],

      order: { createdAt: 'DESC' },

    });

  }

}


