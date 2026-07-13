import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Setting } from '../entities/setting.entity';
import { syncDushanbePrices } from './dushanbe-prices';

@Injectable()
export class DushanbePricesBootstrap implements OnModuleInit {
  private readonly logger = new Logger(DushanbePricesBootstrap.name);

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
  ) {}

  async onModuleInit() {
    try {
      await syncDushanbePrices(
        this.productRepo,
        this.orderRepo,
        this.orderItemRepo,
        this.categoryRepo,
        this.settingRepo,
      );
    } catch (err) {
      this.logger.error('Failed to sync Dushanbe prices', err instanceof Error ? err.stack : err);
    }
  }
}
