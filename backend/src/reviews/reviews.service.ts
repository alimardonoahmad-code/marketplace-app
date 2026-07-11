import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Product } from '../entities/product.entity';
import { CreateReviewDto } from './dto/review.dto';
import { ProductsService } from '../products/products.service';
import { ProductStatus } from '../common/enums';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId, status: ProductStatus.APPROVED },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.reviewRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (existing) {
      throw new ConflictException('You have already reviewed this product');
    }

    const review = this.reviewRepository.create({ ...dto, userId });
    const saved = await this.reviewRepository.save(review);

    await this.productsService.updateRating(dto.productId);

    return this.reviewRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async findByProduct(productId: string) {
    return this.reviewRepository.find({
      where: { productId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string, userId: string, isAdmin: boolean) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId && !isAdmin) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    const productId = review.productId;
    await this.reviewRepository.remove(review);
    await this.productsService.updateRating(productId);

    return { message: 'Review deleted successfully' };
  }
}
