import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { SellerModule } from './seller/seller.module';
import { PaymentsModule } from './payments/payments.module';
import { CouponsModule } from './coupons/coupons.module';
import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
  Review,
  Wishlist,
  CartItem,
  Notification,
  Conversation,
  Message,
  OrderStatusHistory,
  Coupon,
  ActivityLog,
  Setting,
  Banner,
  FaqItem,
  SupportTicket,
} from './entities';

const ALL_ENTITIES = [
  User, Category, Product, Order, OrderItem, Review, Wishlist, CartItem,
  Notification, Conversation, Message, OrderStatusHistory, Coupon,
  ActivityLog, Setting, Banner, FaqItem, SupportTicket,
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbType = config.get<string>('DB_TYPE', 'sqlite');

        if (dbType === 'postgres') {
          const ssl =
            config.get<string>('DB_SSL') === 'false'
              ? false
              : { rejectUnauthorized: false };

          const dbHost = config.get<string>('DB_HOST');
          if (dbHost) {
            return {
              type: 'postgres' as const,
              host: dbHost,
              port: config.get<number>('DB_PORT', 5432),
              username: config.get<string>('DB_USERNAME', 'marketplace'),
              password: config.get<string>('DB_PASSWORD', 'marketplace_secret'),
              database: config.get<string>('DB_DATABASE', 'marketplace'),
              ssl,
              entities: ALL_ENTITIES,
              synchronize: true,
              logging: config.get('NODE_ENV') === 'development',
            };
          }

          const databaseUrl = config.get<string>('DATABASE_URL');
          if (databaseUrl) {
            return {
              type: 'postgres' as const,
              url: databaseUrl,
              ssl,
              entities: ALL_ENTITIES,
              synchronize: true,
              logging: config.get('NODE_ENV') === 'development',
            };
          }

          return {
            type: 'postgres' as const,
            host: 'localhost',
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USERNAME', 'marketplace'),
            password: config.get<string>('DB_PASSWORD', 'marketplace_secret'),
            database: config.get<string>('DB_DATABASE', 'marketplace'),
            ssl,
            entities: ALL_ENTITIES,
            synchronize: true,
            logging: config.get('NODE_ENV') === 'development',
          };
        }

        return {
          type: 'sqljs' as const,
          location: join(process.cwd(), config.get<string>('DB_PATH', 'marketplace.db')),
          autoSave: true,
          entities: ALL_ENTITIES,
          synchronize: true,
          logging: config.get('NODE_ENV') === 'development',
        };
      },
      inject: [ConfigService],
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 1000,
      max: 100,
    }),

    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    WishlistModule,
    AdminModule,
    NotificationsModule,
    ChatModule,
    SellerModule,
    PaymentsModule,
    CouponsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
