import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { Review } from '../entities/review.entity';
import { Coupon, CouponType } from '../entities/coupon.entity';
import { Category } from '../entities/category.entity';
import { Setting } from '../entities/setting.entity';
import { Banner } from '../entities/banner.entity';
import { FaqItem } from '../entities/faq.entity';
import { SupportTicket, TicketStatus, TicketPriority } from '../entities/support-ticket.entity';
import { NotificationType } from '../entities/notification.entity';
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
import { ProductStatus, UserRole, OrderStatus, PaymentStatus } from '../common/enums';
import { AdminActivityService } from './admin-activity.service';
import { OrdersService } from '../orders/orders.service';
import { CategoriesService } from '../categories/categories.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../categories/dto/category.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
    @InjectRepository(Banner)
    private bannerRepository: Repository<Banner>,
    @InjectRepository(FaqItem)
    private faqRepository: Repository<FaqItem>,
    @InjectRepository(SupportTicket)
    private ticketRepository: Repository<SupportTicket>,
    private activityService: AdminActivityService,
    private ordersService: OrdersService,
    private categoriesService: CategoriesService,
    private notificationsService: NotificationsService,
  ) {}

  private paginate<T>(items: T[], total: number, page: number, limit: number) {
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }

  private sanitizeUser(user: User) {
    const { password, ...rest } = user;
    return rest;
  }

  async getDashboard() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalSellers,
      totalBuyers,
      totalProducts,
      activeProducts,
      pendingProducts,
      rejectedProducts,
      totalOrders,
      completedOrders,
      cancelledOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.SELLER } }),
      this.userRepository.count({ where: { role: UserRole.BUYER } }),
      this.productRepository.count(),
      this.productRepository.count({ where: { status: ProductStatus.APPROVED } }),
      this.productRepository.count({ where: { status: ProductStatus.PENDING } }),
      this.productRepository.count({ where: { status: ProductStatus.REJECTED } }),
      this.orderRepository.count(),
      this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } }),
      this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } }),
      this.productRepository.count({ where: { stock: Between(0, 5) } }),
    ]);

    const revenueAll = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.paymentStatus = :status', { status: 'paid' })
      .getRawOne();

    const revenueMonth = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.paymentStatus = :status', { status: 'paid' })
      .andWhere('order.createdAt >= :from', { from: startOfMonth })
      .getRawOne();

    const revenueDay = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.totalPrice)', 'total')
      .where('order.paymentStatus = :status', { status: 'paid' })
      .andWhere('order.createdAt >= :from', { from: startOfDay })
      .getRawOne();

    const [recentOrders, recentUsers, usersByRole] = await Promise.all([
      this.orderRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: 8,
      }),
      this.userRepository.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.userRepository
        .createQueryBuilder('user')
        .select('user.role', 'role')
        .addSelect('COUNT(*)', 'count')
        .groupBy('user.role')
        .getRawMany(),
    ]);

    const paidOrders = await this.orderRepository.find({
      where: { paymentStatus: PaymentStatus.PAID },
      order: { createdAt: 'ASC' },
      select: ['totalPrice', 'createdAt'],
    });

    const chartMap: Record<string, { month: string; revenue: number; orders: number }> = {};
    for (const o of paidOrders) {
      const month = new Date(o.createdAt).toISOString().slice(0, 7);
      if (!chartMap[month]) chartMap[month] = { month, revenue: 0, orders: 0 };
      chartMap[month].revenue += Number(o.totalPrice);
      chartMap[month].orders += 1;
    }
    const revenueChart = Object.values(chartMap).slice(-6);

    const newRegistrations = await this.userRepository.count({
      where: { createdAt: MoreThanOrEqual(startOfMonth) },
    });

    return {
      stats: {
        totalUsers,
        totalSellers,
        totalBuyers,
        totalProducts,
        activeProducts,
        pendingProducts,
        rejectedProducts,
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: parseFloat(revenueAll?.total) || 0,
        monthlyRevenue: parseFloat(revenueMonth?.total) || 0,
        dailyRevenue: parseFloat(revenueDay?.total) || 0,
        lowStockProducts,
        newRegistrations,
        pendingSellerVerification: pendingProducts,
      },
      usersByRole,
      recentOrders,
      recentUsers: recentUsers.map((u) => this.sanitizeUser(u)),
      revenueChart: revenueChart.map((r) => ({
        month: r.month,
        revenue: r.revenue,
        orders: r.orders,
      })),
    };
  }

  async getUsers(query: AdminUsersQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      const s = `%${query.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(user.name) LIKE :s OR LOWER(user.email) LIKE :s OR LOWER(user.phone) LIKE :s)',
        { s },
      );
    }
    if (query.role) qb.andWhere('user.role = :role', { role: query.role });
    if (query.status === 'active') qb.andWhere('user.isActive = :active', { active: true });
    if (query.status === 'inactive') qb.andWhere('user.isActive = :active', { active: false });

    const sortBy = query.sortBy || 'createdAt';
    qb.orderBy(`user.${sortBy}`, query.sortOrder || 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [users, total] = await qb.getManyAndCount();
    return this.paginate(users.map((u) => this.sanitizeUser(u)), total, page, limit);
  }

  async getSellers(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.userRepository.createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.SELLER });

    if (query.search) {
      const s = `%${query.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(user.storeName) LIKE :s OR LOWER(user.name) LIKE :s OR LOWER(user.email) LIKE :s OR LOWER(user.storeCity) LIKE :s)',
        { s },
      );
    }

    qb.orderBy('user.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);
    const [sellers, total] = await qb.getManyAndCount();

    const counts = await this.productRepository
      .createQueryBuilder('p')
      .select('p.sellerId', 'sellerId')
      .addSelect('COUNT(*)', 'count')
      .where('p.status = :status', { status: ProductStatus.APPROVED })
      .groupBy('p.sellerId')
      .getRawMany();

    const countMap = new Map(counts.map((c) => [c.sellerId, parseInt(c.count, 10)]));

    const items = sellers.map((s) => ({
      ...this.sanitizeUser(s),
      productCount: countMap.get(s.id) || 0,
    }));

    return this.paginate(items, total, page, limit);
  }

  async updateUser(id: string, dto: AdminUpdateUserDto, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.ADMIN && dto.role && dto.role !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot demote admin');
    }
    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    await this.activityService.log({
      adminId,
      action: 'user.updated',
      entity: 'user',
      entityId: id,
      details: JSON.stringify(dto),
    });
    return this.sanitizeUser(saved);
  }

  async deleteUser(id: string, adminId: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role === UserRole.ADMIN) throw new BadRequestException('Cannot delete admin');
    await this.userRepository.remove(user);
    await this.activityService.log({
      adminId,
      action: 'user.deleted',
      entity: 'user',
      entityId: id,
    });
    return { message: 'User deleted' };
  }

  async getProducts(query: AdminProductsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category');

    if (query.status) qb.andWhere('product.status = :status', { status: query.status });
    if (query.search) {
      const s = `%${query.search.toLowerCase()}%`;
      qb.andWhere('LOWER(product.name) LIKE :s', { s });
    }

    qb.orderBy('product.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return this.paginate(items, total, page, limit);
  }

  async getPendingProducts() {
    return this.productRepository.find({
      where: { status: ProductStatus.PENDING },
      relations: ['seller', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async moderateProduct(id: string, status: ProductStatus, adminId: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (![ProductStatus.APPROVED, ProductStatus.REJECTED].includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    product.status = status;
    const saved = await this.productRepository.save(product);
    await this.activityService.log({
      adminId,
      action: `product.${status}`,
      entity: 'product',
      entityId: id,
    });
    return saved;
  }

  async bulkModerateProducts(ids: string[], status: ProductStatus, adminId: string) {
    for (const id of ids) {
      await this.moderateProduct(id, status, adminId);
    }
    return { message: `${ids.length} products updated` };
  }

  async deleteProduct(id: string, adminId: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepository.remove(product);
    await this.activityService.log({
      adminId,
      action: 'product.deleted',
      entity: 'product',
      entityId: id,
    });
    return { message: 'Product deleted' };
  }

  async getOrders(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.courier', 'courier')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (query.search) {
      const s = `%${query.search.toLowerCase()}%`;
      qb.andWhere('(LOWER(user.name) LIKE :s OR LOWER(user.email) LIKE :s)', { s });
    }

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return this.paginate(items, total, page, limit);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, adminId: string) {
    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');
    const result = await this.ordersService.updateStatus(orderId, { status }, admin);
    await this.activityService.log({
      adminId,
      action: 'order.status_updated',
      entity: 'order',
      entityId: orderId,
      details: status,
    });
    return result;
  }

  async getReviews(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const [items, total] = await this.reviewRepository.findAndCount({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return this.paginate(items, total, page, limit);
  }

  async deleteReview(id: string, adminId: string) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    await this.reviewRepository.remove(review);
    await this.activityService.log({
      adminId,
      action: 'review.deleted',
      entity: 'review',
      entityId: id,
    });
    return { message: 'Review deleted' };
  }

  async getCoupons() {
    return this.couponRepository.find({ order: { createdAt: 'DESC' } });
  }

  async createCoupon(dto: AdminCreateCouponDto, adminId: string) {
    const coupon = this.couponRepository.create({
      ...dto,
      code: dto.code.toUpperCase().trim(),
      type: dto.type as CouponType,
      minOrder: dto.minOrder ?? 0,
      active: dto.active ?? true,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
    });
    const saved = await this.couponRepository.save(coupon);
    await this.activityService.log({
      adminId,
      action: 'coupon.created',
      entity: 'coupon',
      entityId: saved.id,
    });
    return saved;
  }

  async updateCoupon(id: string, dto: AdminUpdateCouponDto, adminId: string) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (dto.code) dto.code = dto.code.toUpperCase().trim();
    Object.assign(coupon, dto);
    if (dto.expiresAt) coupon.expiresAt = new Date(dto.expiresAt);
    const saved = await this.couponRepository.save(coupon);
    await this.activityService.log({
      adminId,
      action: 'coupon.updated',
      entity: 'coupon',
      entityId: id,
    });
    return saved;
  }

  async deleteCoupon(id: string, adminId: string) {
    const coupon = await this.couponRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.couponRepository.remove(coupon);
    await this.activityService.log({
      adminId,
      action: 'coupon.deleted',
      entity: 'coupon',
      entityId: id,
    });
    return { message: 'Coupon deleted' };
  }

  async getCategories() {
    return this.categoriesService.findAll();
  }

  async createCategory(dto: CreateCategoryDto, adminId: string) {
    const cat = await this.categoriesService.create(dto);
    await this.activityService.log({
      adminId,
      action: 'category.created',
      entity: 'category',
      entityId: cat.id,
    });
    return cat;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, adminId: string) {
    const cat = await this.categoriesService.update(id, dto);
    await this.activityService.log({
      adminId,
      action: 'category.updated',
      entity: 'category',
      entityId: id,
    });
    return cat;
  }

  async deleteCategory(id: string, adminId: string) {
    const result = await this.categoriesService.remove(id);
    await this.activityService.log({
      adminId,
      action: 'category.deleted',
      entity: 'category',
      entityId: id,
    });
    return result;
  }

  async getSettings() {
    const rows = await this.settingRepository.find();
    const map: Record<string, string> = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    return {
      marketplaceName: map.marketplace_name || 'MARKET',
      currency: map.currency || 'TJS',
      commissionRate: parseFloat(map.commission_rate || '10'),
      maintenanceMode: map.maintenance_mode === 'true',
    };
  }

  async updateSettings(dto: AdminSettingsDto, adminId: string) {
    const updates: [string, string][] = [];
    if (dto.marketplaceName != null) updates.push(['marketplace_name', dto.marketplaceName]);
    if (dto.currency != null) updates.push(['currency', dto.currency]);
    if (dto.commissionRate != null) updates.push(['commission_rate', String(dto.commissionRate)]);
    if (dto.maintenanceMode != null) updates.push(['maintenance_mode', String(dto.maintenanceMode)]);

    for (const [key, value] of updates) {
      let row = await this.settingRepository.findOne({ where: { key } });
      if (row) {
        row.value = value;
      } else {
        row = this.settingRepository.create({ key, value });
      }
      await this.settingRepository.save(row);
    }

    await this.activityService.log({
      adminId,
      action: 'settings.updated',
      entity: 'settings',
      details: JSON.stringify(dto),
    });
    return this.getSettings();
  }

  async getActivityLogs(page = 1, limit = 30) {
    return this.activityService.getLogs(page, limit);
  }

  // ─── Phase 2: Payments ───
  async getPayments(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const qb = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .where('order.paymentStatus IS NOT NULL');

    if (query.search) {
      const s = `%${query.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(order.paymentReference) LIKE :s OR LOWER(user.email) LIKE :s)',
        { s },
      );
    }

    qb.orderBy('order.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return this.paginate(items, total, page, limit);
  }

  async getPaymentStats() {
    const paid = await this.orderRepository
      .createQueryBuilder('o')
      .select('SUM(o.totalPrice)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.paymentStatus = :s', { s: 'paid' })
      .getRawOne();
    const pending = await this.orderRepository.count({ where: { paymentStatus: PaymentStatus.PENDING } });
    const failed = await this.orderRepository.count({ where: { paymentStatus: PaymentStatus.FAILED } });
    return {
      totalPaid: parseFloat(paid?.total) || 0,
      paidCount: parseInt(paid?.count, 10) || 0,
      pendingCount: pending,
      failedCount: failed,
    };
  }

  // ─── Phase 2: Delivery / Couriers ───
  async getCouriers() {
    const couriers = await this.userRepository.find({
      where: { role: UserRole.COURIER },
      order: { name: 'ASC' },
    });
    return couriers.map((c) => this.sanitizeUser(c));
  }

  async getDeliveryOrders() {
    return this.orderRepository.find({
      where: [
        { status: OrderStatus.CONFIRMED },
        { status: OrderStatus.PACKED },
        { status: OrderStatus.SHIPPED },
      ],
      relations: ['user', 'courier'],
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  // ─── Phase 2: Notifications broadcast ───
  async broadcastNotification(
    title: string,
    message: string,
    role: UserRole | 'all',
    adminId: string,
  ) {
    const where = role === 'all' ? {} : { role };
    const users = await this.userRepository.find({ where, select: ['id'] });
    for (const u of users) {
      await this.notificationsService.create(
        u.id, title, message, NotificationType.SYSTEM,
      );
    }
    await this.activityService.log({
      adminId,
      action: 'notification.broadcast',
      entity: 'notification',
      details: `${title} → ${users.length} users`,
    });
    return { sent: users.length };
  }

  // ─── Phase 2: CMS Banners ───
  async getBanners() {
    return this.bannerRepository.find({ order: { sortOrder: 'ASC' } });
  }

  async getActiveBanners() {
    return this.bannerRepository.find({
      where: { active: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async createBanner(dto: Partial<Banner>, adminId: string) {
    const banner = this.bannerRepository.create(dto);
    const saved = await this.bannerRepository.save(banner);
    await this.activityService.log({ adminId, action: 'banner.created', entity: 'banner', entityId: saved.id });
    return saved;
  }

  async updateBanner(id: string, dto: Partial<Banner>, adminId: string) {
    const banner = await this.bannerRepository.findOne({ where: { id } });
    if (!banner) throw new NotFoundException('Banner not found');
    Object.assign(banner, dto);
    const saved = await this.bannerRepository.save(banner);
    await this.activityService.log({ adminId, action: 'banner.updated', entity: 'banner', entityId: id });
    return saved;
  }

  async deleteBanner(id: string, adminId: string) {
    await this.bannerRepository.delete(id);
    await this.activityService.log({ adminId, action: 'banner.deleted', entity: 'banner', entityId: id });
    return { message: 'Deleted' };
  }

  // ─── Phase 2: FAQ ───
  async getFaqItems() {
    return this.faqRepository.find({ order: { sortOrder: 'ASC' } });
  }

  async getActiveFaq() {
    return this.faqRepository.find({ where: { active: true }, order: { sortOrder: 'ASC' } });
  }

  async createFaq(dto: Partial<FaqItem>, adminId: string) {
    const item = this.faqRepository.create(dto);
    const saved = await this.faqRepository.save(item);
    await this.activityService.log({ adminId, action: 'faq.created', entity: 'faq', entityId: saved.id });
    return saved;
  }

  async updateFaq(id: string, dto: Partial<FaqItem>, adminId: string) {
    const item = await this.faqRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('FAQ not found');
    Object.assign(item, dto);
    const saved = await this.faqRepository.save(item);
    await this.activityService.log({ adminId, action: 'faq.updated', entity: 'faq', entityId: id });
    return saved;
  }

  async deleteFaq(id: string, adminId: string) {
    await this.faqRepository.delete(id);
    await this.activityService.log({ adminId, action: 'faq.deleted', entity: 'faq', entityId: id });
    return { message: 'Deleted' };
  }

  // ─── Phase 2: Support Tickets ───
  async getTickets(query: PaginationQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const [items, total] = await this.ticketRepository.findAndCount({
      relations: ['user', 'assignedTo'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return this.paginate(items, total, page, limit);
  }

  async updateTicket(
    id: string,
    dto: { status?: TicketStatus; priority?: TicketPriority; adminReply?: string; assignedToId?: string },
    adminId: string,
  ) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    Object.assign(ticket, dto);
    const saved = await this.ticketRepository.save(ticket);
    await this.activityService.log({ adminId, action: 'ticket.updated', entity: 'ticket', entityId: id });
    return saved;
  }

  // ─── Phase 2: Export CSV ───
  async exportUsersCsv(): Promise<string> {
    const users = await this.userRepository.find({ order: { createdAt: 'DESC' } });
    const header = 'id,name,email,phone,role,isActive,createdAt\n';
    const rows = users.map((u) =>
      `${u.id},"${u.name}","${u.email}","${u.phone || ''}",${u.role},${u.isActive},${u.createdAt}`,
    ).join('\n');
    return header + rows;
  }

  async exportOrdersCsv(): Promise<string> {
    const orders = await this.orderRepository.find({ relations: ['user'], order: { createdAt: 'DESC' }, take: 1000 });
    const header = 'id,customer,total,status,paymentStatus,paymentMethod,createdAt\n';
    const rows = orders.map((o) =>
      `${o.id},"${o.user?.name || ''}",${o.totalPrice},${o.status},${o.paymentStatus},${o.paymentMethod},${o.createdAt}`,
    ).join('\n');
    return header + rows;
  }
}
