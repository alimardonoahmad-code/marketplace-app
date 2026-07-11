import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto, ConfirmPaymentDto } from './dto/payment.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-intent')
  createIntent(@CurrentUser() user: User, @Body() dto: CreatePaymentIntentDto) {
    return this.paymentsService.createIntent(user.id, dto);
  }

  @Post('confirm')
  confirm(@CurrentUser() user: User, @Body() dto: ConfirmPaymentDto) {
    return this.paymentsService.confirm(user.id, dto);
  }
}
