import {
  IsEnum, IsString, IsNotEmpty, IsOptional, ValidateIf,
} from 'class-validator';
import { PaymentMethod, OrderStatus } from '../../common/enums';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentPhone: string;

  @ValidateIf((o) => o.paymentMethod === PaymentMethod.ONLINE)
  @IsString()
  @IsNotEmpty()
  cardNumber?: string;

  @ValidateIf((o) => o.paymentMethod === PaymentMethod.ONLINE)
  @IsString()
  @IsNotEmpty()
  cardExpiry?: string;

  @ValidateIf((o) => o.paymentMethod === PaymentMethod.ONLINE)
  @IsString()
  @IsNotEmpty()
  cardCvv?: string;

  @ValidateIf((o) => o.paymentMethod === PaymentMethod.ONLINE)
  @IsString()
  @IsNotEmpty()
  cardHolder?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

export class AssignCourierDto {
  @IsString()
  @IsNotEmpty()
  courierId: string;
}
