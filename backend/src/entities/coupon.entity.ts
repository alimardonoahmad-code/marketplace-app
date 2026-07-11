import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum CouponType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'varchar', default: CouponType.PERCENT })
  type: CouponType;

  @Column('decimal', { precision: 12, scale: 2 })
  value: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  minOrder: number;

  @Column({ default: 0 })
  usedCount: number;

  @Column({ nullable: true })
  maxUses: number;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
