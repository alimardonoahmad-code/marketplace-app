import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Setting } from '../entities/setting.entity';
import { DushanbePricesBootstrap } from './dushanbe-prices.bootstrap';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order, OrderItem, Category, Setting])],
  providers: [DushanbePricesBootstrap],
})
export class CommonModule {}
