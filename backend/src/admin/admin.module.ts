import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CmsController } from './cms.controller';
import { AdminActivityService } from './admin-activity.service';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { Review } from '../entities/review.entity';
import { Coupon } from '../entities/coupon.entity';
import { Setting } from '../entities/setting.entity';
import { ActivityLog } from '../entities/activity-log.entity';
import { Banner } from '../entities/banner.entity';
import { FaqItem } from '../entities/faq.entity';
import { SupportTicket } from '../entities/support-ticket.entity';
import { OrdersModule } from '../orders/orders.module';
import { CategoriesModule } from '../categories/categories.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Product, Order, Review, Coupon, Setting, ActivityLog,
      Banner, FaqItem, SupportTicket,
    ]),
    OrdersModule,
    CategoriesModule,
    NotificationsModule,
  ],
  controllers: [AdminController, CmsController],
  providers: [AdminService, AdminActivityService],
})
export class AdminModule {}
