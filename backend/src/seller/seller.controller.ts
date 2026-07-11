import { Controller, Get } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators';
import { UserRole } from '../common/enums';
import { User } from '../entities/user.entity';

@Controller('seller')
export class SellerController {
  constructor(private sellerService: SellerService) {}

  @Roles(UserRole.SELLER, UserRole.ADMIN)
  @Get('analytics')
  getAnalytics(@CurrentUser() user: User) {
    return this.sellerService.getAnalytics(user.id);
  }
}
