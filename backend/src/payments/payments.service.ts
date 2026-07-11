import {
  Injectable, NotFoundException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { PaymentMethod, PaymentStatus } from '../common/enums';
import { CreatePaymentIntentDto, ConfirmPaymentDto } from './dto/payment.dto';
import { processCardPayment } from './card-payment.util';
import { processWalletPayment } from './wallet-payment.util';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createIntent(userId: string, dto: CreatePaymentIntentDto) {
    const order = await this.orderRepository.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');
    if (order.paymentMethod !== PaymentMethod.ONLINE) {
      throw new BadRequestException('Order is not online payment');
    }
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Already paid');
    }

    const paymentId = order.paymentReference || `pay_${uuidv4().slice(0, 8)}`;
    return {
      paymentId,
      amount: Number(order.totalPrice),
      currency: 'TJS',
      orderId: order.id,
      clientSecret: `${paymentId}_secret`,
      message: 'Пардохт бо сомонӣ (TJS)',
    };
  }

  async confirm(userId: string, dto: ConfirmPaymentDto) {
    const order = await this.orderRepository.findOne({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');

    order.paymentStatus = PaymentStatus.PAID;
    await this.orderRepository.save(order);

    return {
      success: true,
      orderId: order.id,
      paymentId: dto.paymentId || order.paymentReference || `pay_${uuidv4().slice(0, 8)}`,
      paymentStatus: PaymentStatus.PAID,
      currency: 'TJS',
    };
  }

  processOnlineCardPayment(
    cardNumber: string,
    cardExpiry: string,
    cardCvv: string,
    cardHolder: string,
    amount: number,
  ) {
    return processCardPayment({ cardNumber, cardExpiry, cardCvv, cardHolder, amount });
  }

  processAlifPayment(phone: string, amount: number) {
    return processWalletPayment('alif', phone, amount);
  }

  processEskhataPayment(phone: string, amount: number) {
    return processWalletPayment('eskhata', phone, amount);
  }
}
