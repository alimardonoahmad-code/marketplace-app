import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../common/enums';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column('decimal', { precision: 12, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Column({ type: 'varchar', default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true })
  paymentPhone: string;

  @Column({ nullable: true })
  cardLast4: string;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({ nullable: true })
  paymentProvider: string;

  @Column({ nullable: true })
  couponCode: string;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discountAmount: number;

  @Column('text')
  shippingAddress: string;

  @Column({ nullable: true })
  courierId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'courierId' })
  courier: User;

  @Column({ nullable: true })
  trackingNumber: string;

  @Column({ nullable: true })
  notes: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
