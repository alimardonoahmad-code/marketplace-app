import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { ProductStatus } from '../common/enums';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getCart(userId: string) {
    const items = await this.cartRepository.find({
      where: { userId },
      relations: ['product', 'product.seller', 'product.category'],
      order: { createdAt: 'DESC' },
    });

    const total = items.reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, total, itemCount };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.productRepository.findOne({
      where: { id: dto.productId, status: ProductStatus.APPROVED },
    });

    if (!product) {
      throw new NotFoundException('Product not found or not available');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(`Only ${product.stock} items available`);
    }

    let cartItem = await this.cartRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (cartItem) {
      const newQty = cartItem.quantity + dto.quantity;
      if (newQty > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items available`);
      }
      cartItem.quantity = newQty;
    } else {
      cartItem = this.cartRepository.create({
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      });
    }

    await this.cartRepository.save(cartItem);
    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, userId },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.quantity > cartItem.product.stock) {
      throw new BadRequestException(`Only ${cartItem.product.stock} items available`);
    }

    cartItem.quantity = dto.quantity;
    await this.cartRepository.save(cartItem);
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);
    return this.getCart(userId);
  }

  async clearCart(userId: string) {
    await this.cartRepository.delete({ userId });
    return { items: [], total: 0, itemCount: 0 };
  }
}
