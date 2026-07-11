import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsUUID()
  orderId: string;
}

export class ConfirmPaymentDto {
  @IsUUID()
  orderId: string;

  @IsOptional()
  @IsString()
  paymentId?: string;
}
