import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Product } from '../entities/product.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderStatus, ProductStatus } from '../common/enums';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAnalytics(sellerId: string) {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .where('product.sellerId = :sellerId', { sellerId })
      .getMany();

    const totalRevenue = orders
      .filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.REFUNDED)
      .reduce((sum, o) => {
        const sellerTotal = o.items
          .filter((i) => i.product?.sellerId === sellerId)
          .reduce((s, i) => s + Number(i.price) * i.quantity, 0);
        return sum + sellerTotal;
      }, 0);

    const products = await this.productRepository.find({ where: { sellerId } });
    const approvedProducts = products.filter((p) => p.status === ProductStatus.APPROVED).length;

    const statusCounts = Object.values(OrderStatus).reduce((acc, status) => {
      acc[status] = orders.filter((o) => o.status === status).length;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = await this.orderItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.product', 'product')
      .select('product.id', 'id')
      .addSelect('product.name', 'name')
      .addSelect('SUM(item.quantity)', 'sold')
      .addSelect('SUM(item.price * item.quantity)', 'revenue')
      .where('product.sellerId = :sellerId', { sellerId })
      .groupBy('product.id')
      .addGroupBy('product.name')
      .orderBy('sold', 'DESC')
      .limit(5)
      .getRawMany();

    const commissionRate = 0.1;
    const commission = totalRevenue * commissionRate;
    const netRevenue = totalRevenue - commission;

    return {
      totalRevenue,
      netRevenue,
      commission,
      commissionRate,
      totalOrders: orders.length,
      totalProducts: products.length,
      approvedProducts,
      pendingOrders: statusCounts.pending || 0,
      statusCounts,
      topProducts: topProducts.map((p) => ({
        id: p.id,
        name: p.name,
        sold: parseInt(p.sold) || 0,
        revenue: parseFloat(p.revenue) || 0,
      })),
    };
  }
}
