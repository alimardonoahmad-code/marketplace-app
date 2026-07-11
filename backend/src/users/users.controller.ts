import { Controller, Put, Post, Get, Body, Param, Query } from '@nestjs/common';
import { UsersService, UpdateUserDto, BecomeSellerDto } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { Public } from '../common/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put('profile')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('become-seller')
  becomeSeller(@CurrentUser() user: User, @Body() dto: BecomeSellerDto) {
    return this.usersService.becomeSeller(user.id, dto);
  }

  @Public()
  @Get('stores')
  getStores(
    @Query('search') search?: string,
    @Query('city') city?: string,
  ) {
    return this.usersService.getStores(search, city);
  }

  @Public()
  @Get('stores/:id')
  getStore(@Param('id') id: string) {
    return this.usersService.getStoreById(id);
  }
}
