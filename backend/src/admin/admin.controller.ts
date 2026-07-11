import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminService } from './admin.service';
import { Roles } from '../common/decorators';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, ProductStatus, OrderStatus } from '../common/enums';
import {
  AdminUpdateUserDto,
  AdminCreateCouponDto,
  AdminUpdateCouponDto,
  AdminSettingsDto,
} from './dto/admin.dto';
import {
  AdminUsersQueryDto,
  AdminProductsQueryDto,
  PaginationQueryDto,
} from './dto/admin-query.dto';
import { IsEnum, IsArray, IsString } from 'class-validator';
import { User } from '../entities/user.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../categories/dto/category.dto';

class ModerateProductDto {
  @IsEnum(ProductStatus)
  status: ProductStatus;
}

class BulkModerateDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @IsEnum(ProductStatus)
  status: ProductStatus;
}

class UpdateOrderStatusAdminDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

@Controller('admin')
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  getUsers(@Query() query: AdminUsersQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Put('users/:id')
  updateUser(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.adminService.updateUser(id, dto, admin.id);
  }

  @Delete('users/:id')
  deleteUser(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id, admin.id);
  }

  @Get('sellers')
  getSellers(@Query() query: PaginationQueryDto) {
    return this.adminService.getSellers(query);
  }

  @Get('products')
  getProducts(@Query() query: AdminProductsQueryDto) {
    return this.adminService.getProducts(query);
  }

  @Get('products/pending')
  getPendingProducts() {
    return this.adminService.getPendingProducts();
  }

  @Put('products/:id/moderate')
  moderateProduct(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerateProductDto,
  ) {
    return this.adminService.moderateProduct(id, dto.status, admin.id);
  }

  @Post('products/bulk-moderate')
  bulkModerate(
    @CurrentUser() admin: User,
    @Body() dto: BulkModerateDto,
  ) {
    return this.adminService.bulkModerateProducts(dto.ids, dto.status, admin.id);
  }

  @Delete('products/:id')
  deleteProduct(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteProduct(id, admin.id);
  }

  @Get('orders')
  getOrders(@Query() query: PaginationQueryDto) {
    return this.adminService.getOrders(query);
  }

  @Put('orders/:id/status')
  updateOrderStatus(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusAdminDto,
  ) {
    return this.adminService.updateOrderStatus(id, dto.status, admin.id);
  }

  @Get('reviews')
  getReviews(@Query() query: PaginationQueryDto) {
    return this.adminService.getReviews(query);
  }

  @Delete('reviews/:id')
  deleteReview(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteReview(id, admin.id);
  }

  @Get('coupons')
  getCoupons() {
    return this.adminService.getCoupons();
  }

  @Post('coupons')
  createCoupon(@CurrentUser() admin: User, @Body() dto: AdminCreateCouponDto) {
    return this.adminService.createCoupon(dto, admin.id);
  }

  @Put('coupons/:id')
  updateCoupon(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateCouponDto,
  ) {
    return this.adminService.updateCoupon(id, dto, admin.id);
  }

  @Delete('coupons/:id')
  deleteCoupon(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteCoupon(id, admin.id);
  }

  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  createCategory(@CurrentUser() admin: User, @Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto, admin.id);
  }

  @Put('categories/:id')
  updateCategory(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.adminService.updateCategory(id, dto, admin.id);
  }

  @Delete('categories/:id')
  deleteCategory(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteCategory(id, admin.id);
  }

  @Get('settings')
  getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  updateSettings(@CurrentUser() admin: User, @Body() dto: AdminSettingsDto) {
    return this.adminService.updateSettings(dto, admin.id);
  }

  @Get('activity-logs')
  getActivityLogs(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getActivityLogs(page || 1, limit || 30);
  }

  @Get('payments')
  getPayments(@Query() query: PaginationQueryDto) {
    return this.adminService.getPayments(query);
  }

  @Get('payments/stats')
  getPaymentStats() {
    return this.adminService.getPaymentStats();
  }

  @Get('couriers')
  getCouriers() {
    return this.adminService.getCouriers();
  }

  @Get('delivery')
  getDeliveryOrders() {
    return this.adminService.getDeliveryOrders();
  }

  @Post('notifications/broadcast')
  broadcast(
    @CurrentUser() admin: User,
    @Body() dto: { title: string; message: string; role?: UserRole | 'all' },
  ) {
    return this.adminService.broadcastNotification(
      dto.title, dto.message, dto.role || 'all', admin.id,
    );
  }

  @Get('banners')
  getBanners() {
    return this.adminService.getBanners();
  }

  @Post('banners')
  createBanner(@CurrentUser() admin: User, @Body() dto: Record<string, unknown>) {
    return this.adminService.createBanner(dto, admin.id);
  }

  @Put('banners/:id')
  updateBanner(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.adminService.updateBanner(id, dto, admin.id);
  }

  @Delete('banners/:id')
  deleteBanner(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteBanner(id, admin.id);
  }

  @Get('faq')
  getFaq() {
    return this.adminService.getFaqItems();
  }

  @Post('faq')
  createFaq(@CurrentUser() admin: User, @Body() dto: Record<string, unknown>) {
    return this.adminService.createFaq(dto, admin.id);
  }

  @Put('faq/:id')
  updateFaq(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.adminService.updateFaq(id, dto, admin.id);
  }

  @Delete('faq/:id')
  deleteFaq(@CurrentUser() admin: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteFaq(id, admin.id);
  }

  @Get('tickets')
  getTickets(@Query() query: PaginationQueryDto) {
    return this.adminService.getTickets(query);
  }

  @Put('tickets/:id')
  updateTicket(
    @CurrentUser() admin: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Record<string, unknown>,
  ) {
    return this.adminService.updateTicket(id, dto as never, admin.id);
  }

  @Get('export/users')
  async exportUsers(@Res() res: Response) {
    const csv = await this.adminService.exportUsersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  }

  @Get('export/orders')
  async exportOrders(@Res() res: Response) {
    const csv = await this.adminService.exportOrdersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
    res.send(csv);
  }
}
