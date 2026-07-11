import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, MoreThanOrEqual } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { ProductStatus, UserRole } from '../common/enums';
import { User } from '../entities/user.entity';
import { applySearchFilter } from '../common/search-keywords';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto, seller: User) {
    if (seller.role !== UserRole.SELLER && seller.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only sellers can create products');
    }

    const product = this.productRepository.create({
      ...dto,
      sellerId: seller.id,
      status: seller.role === UserRole.ADMIN ? ProductStatus.APPROVED : ProductStatus.PENDING,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: ProductQueryDto, user?: User) {
    const {
      search,
      categoryId,
      sellerId,
      minPrice,
      maxPrice,
      minRating,
      hasDiscount,
      page = 1,
      limit: rawLimit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const limit = Math.min(Math.max(rawLimit, 1), 48);

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .leftJoinAndSelect('product.category', 'category');

    const isAdminOrSeller =
      user && (user.role === UserRole.ADMIN || user.role === UserRole.SELLER);

    if (!isAdminOrSeller) {
      qb.where('product.status = :status', { status: ProductStatus.APPROVED });
    }

    if (search?.trim()) {
      applySearchFilter(qb, search.trim());
    }

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (sellerId) {
      qb.andWhere('product.sellerId = :sellerId', { sellerId });
    }

    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    if (minRating !== undefined) {
      qb.andWhere('product.rating >= :minRating', { minRating });
    }

    if (hasDiscount) {
      qb.andWhere('product.discountPrice IS NOT NULL')
        .andWhere('product.discountPrice < product.price');
    }

    const allowedSortFields = ['createdAt', 'price', 'rating', 'name', 'reviewCount'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    qb.orderBy(`product.${sortField}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: this.sanitizeProducts(items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user?: User) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller', 'category', 'reviews', 'reviews.user'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const isOwner = user && product.sellerId === user.id;
    const isAdmin = user && user.role === UserRole.ADMIN;

    if (product.status !== ProductStatus.APPROVED && !isOwner && !isAdmin) {
      throw new NotFoundException('Product not found');
    }

    return this.sanitizeProduct(product);
  }

  private sanitizeProduct(product: Product): Product {
    if (product.seller) {
      const { password, ...seller } = product.seller;
      product.seller = seller as User;
    }
    if (product.reviews) {
      product.reviews = product.reviews.map((r) => {
        if (r.user) {
          const { password, ...user } = r.user;
          r.user = user as User;
        }
        return r;
      });
    }
    return product;
  }

  private sanitizeProducts(products: Product[]): Product[] {
    return products.map((p) => {
      const sanitized = this.sanitizeProduct(p);
      delete (sanitized as Partial<Product>).description;
      return sanitized;
    });
  }

  async update(id: string, dto: UpdateProductDto, user: User) {
    const product = await this.findOne(id, user);

    if (product.sellerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own products');
    }

    if (dto.status && user.role !== UserRole.ADMIN) {
      delete dto.status;
    }

    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string, user: User) {
    const product = await this.findOne(id, user);

    if (product.sellerId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async approve(id: string, status: ProductStatus) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.status = status;
    return this.productRepository.save(product);
  }

  async updateRating(productId: string) {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.reviews', 'review')
      .select('AVG(review.rating)', 'avgRating')
      .addSelect('COUNT(review.id)', 'count')
      .where('product.id = :productId', { productId })
      .getRawOne();

    await this.productRepository.update(productId, {
      rating: parseFloat(result.avgRating) || 0,
      reviewCount: parseInt(result.count) || 0,
    });
  }

  async getRecommended(_userId?: string, limit = 8) {
    const items = await this.productRepository.find({
      where: { status: ProductStatus.APPROVED },
      relations: ['seller', 'category'],
      order: { rating: 'DESC', reviewCount: 'DESC' },
      take: limit,
    });
    return this.sanitizeProducts(items);
  }

  async getSuggestions(search: string, limit = 8) {
    const term = search?.trim();
    if (!term || term.length < 2) {
      return [];
    }

    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.status = :status', { status: ProductStatus.APPROVED });

    applySearchFilter(qb, term, 'sug');

    const items = await qb
      .orderBy('product.reviewCount', 'DESC')
      .take(limit)
      .getMany();

    return items.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
      image: p.images?.[0] || null,
      category: p.category?.name || null,
    }));
  }
}
