import {

  Controller,

  Get,

  Post,

  Put,

  Body,

  Param,

  ParseUUIDPipe,

} from '@nestjs/common';

import { OrdersService } from './orders.service';

import { CreateOrderDto, UpdateOrderStatusDto, AssignCourierDto } from './dto/order.dto';

import { CurrentUser } from '../common/decorators/current-user.decorator';

import { Roles } from '../common/decorators';

import { UserRole } from '../common/enums';

import { User } from '../entities/user.entity';



@Controller('orders')

export class OrdersController {

  constructor(private ordersService: OrdersService) {}



  @Post()

  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {

    return this.ordersService.create(user.id, dto);

  }



  @Get('user')

  findUserOrders(@CurrentUser() user: User) {

    return this.ordersService.findUserOrders(user.id);

  }



  @Roles(UserRole.SELLER, UserRole.ADMIN)

  @Get('seller')

  findSellerOrders(@CurrentUser() user: User) {

    return this.ordersService.findSellerOrders(user.id);

  }



  @Roles(UserRole.COURIER)

  @Get('courier')

  findCourierOrders(@CurrentUser() user: User) {

    return this.ordersService.getCourierOrders(user.id);

  }



  @Get(':id/history')

  getHistory(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {

    return this.ordersService.getHistory(id, user);

  }



  @Put(':id/cancel')

  cancelOrder(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {

    return this.ordersService.cancelOrder(id, user);

  }



  @Roles(UserRole.COURIER)

  @Put(':id/deliver')

  deliverOrder(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {

    return this.ordersService.deliverOrder(id, user);

  }



  @Get(':id')

  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {

    return this.ordersService.findOne(id, user);

  }



  @Roles(UserRole.ADMIN, UserRole.SELLER)

  @Put(':id/status')

  updateStatus(

    @Param('id', ParseUUIDPipe) id: string,

    @Body() dto: UpdateOrderStatusDto,

    @CurrentUser() user: User,

  ) {

    return this.ordersService.updateStatus(id, dto, user);

  }



  @Roles(UserRole.ADMIN)

  @Put(':id/courier')

  assignCourier(

    @Param('id', ParseUUIDPipe) id: string,

    @Body() dto: AssignCourierDto,

  ) {

    return this.ordersService.assignCourier(id, dto);

  }

}


