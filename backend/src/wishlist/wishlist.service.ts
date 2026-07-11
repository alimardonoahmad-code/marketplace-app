import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { AddToWishlistDto } from './dto/wishlist.dto';
import { ProductStatus } from '../common/enums';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getWishlist(userId: string) {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product', 'product.seller', 'product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: string, dto: AddToWishlistDto) {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId, status: ProductStatus.APPROVED },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (existing) {
      throw new ConflictException('Product already in wishlist');
    }

    const item = this.wishlistRepository.create({ userId, productId: dto.productId });
    await this.wishlistRepository.save(item);
    return this.getWishlist(userId);
  }

  async remove(userId: string, productId: string) {
    const item = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (!item) {
      throw new NotFoundException('Item not in wishlist');
    }

    await this.wishlistRepository.remove(item);
    return this.getWishlist(userId);
  }
}
