import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType } from '../entities/coupon.entity';
import { ValidateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.findActiveCoupon(dto.code);
    const discount = this.calculateDiscount(coupon, dto.cartTotal);
    return {
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount,
      finalTotal: Math.max(0, dto.cartTotal - discount),
    };
  }

  async apply(code: string, cartTotal: number) {
    const coupon = await this.findActiveCoupon(code);
    const discount = this.calculateDiscount(coupon, cartTotal);
    coupon.usedCount += 1;
    await this.couponRepository.save(coupon);
    return { code: coupon.code, discount };
  }

  private async findActiveCoupon(code: string) {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase().trim(), active: true },
    });
    if (!coupon) {
      throw new NotFoundException('Промокод ёфт нашуд');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Промокод мӯҳлаташ гузаштааст');
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Промокод аллакай истифода шудааст');
    }
    return coupon;
  }

  private calculateDiscount(coupon: Coupon, cartTotal: number) {
    if (cartTotal < Number(coupon.minOrder)) {
      throw new BadRequestException(
        `Минималӣ ${Number(coupon.minOrder)} смн барои ин промокод`,
      );
    }
    if (coupon.type === CouponType.PERCENT) {
      return Math.round(cartTotal * (Number(coupon.value) / 100));
    }
    return Math.min(Number(coupon.value), cartTotal);
  }
}
