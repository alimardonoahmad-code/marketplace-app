import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';

import { OrdersController } from './orders.controller';

import { Order } from '../entities/order.entity';

import { OrderItem } from '../entities/order-item.entity';

import { OrderStatusHistory } from '../entities/order-status-history.entity';

import { Product } from '../entities/product.entity';

import { CartItem } from '../entities/cart-item.entity';

import { User } from '../entities/user.entity';

import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';
import { CouponsModule } from '../coupons/coupons.module';



@Module({

  imports: [

    TypeOrmModule.forFeature([Order, OrderItem, OrderStatusHistory, Product, CartItem, User]),

    NotificationsModule,
    PaymentsModule,
    CouponsModule,

  ],

  controllers: [OrdersController],

  providers: [OrdersService],

  exports: [OrdersService],

})

export class OrdersModule {}


