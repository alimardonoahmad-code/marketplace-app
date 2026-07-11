import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { IsOptional, IsString } from 'class-validator';
import { UserRole, ProductStatus } from '../common/enums';
import { matchesStoreCity, matchesStoreSearch } from '../common/store-search';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  storeAddress?: string;

  @IsOptional()
  @IsString()
  storeCity?: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;
}

export class BecomeSellerDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  storeAddress?: string;

  @IsOptional()
  @IsString()
  storeCity?: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  private sanitize(user: User) {
    const { password, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  async becomeSeller(userId: string, dto?: BecomeSellerDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === UserRole.SELLER || user.role === UserRole.ADMIN) {
      throw new BadRequestException('Already a seller');
    }
    if (user.role !== UserRole.BUYER) {
      throw new BadRequestException('Cannot change role');
    }

    user.role = UserRole.SELLER;
    if (dto?.storeName) user.storeName = dto.storeName;
    if (dto?.storeAddress) user.storeAddress = dto.storeAddress;
    if (dto?.storeCity) user.storeCity = dto.storeCity;
    if (dto?.storeDescription) user.storeDescription = dto.storeDescription;
    if (!user.storeName) user.storeName = user.name;

    const saved = await this.userRepository.save(user);
    return this.sanitize(saved);
  }

  async getStores(search?: string, city?: string) {
    const sellers = await this.userRepository.find({
      where: { role: In([UserRole.SELLER, UserRole.ADMIN]), isActive: true },
      order: { createdAt: 'DESC' },
    });

    const counts = await this.productRepository
      .createQueryBuilder('product')
      .select('product.sellerId', 'sellerId')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.APPROVED })
      .groupBy('product.sellerId')
      .getRawMany<{ sellerId: string; count: string }>();

    const countMap = new Map(counts.map((c) => [c.sellerId, parseInt(c.count, 10)]));

    return sellers
      .filter((seller) => seller.storeName?.trim() || (countMap.get(seller.id) || 0) > 0)
      .filter((seller) => matchesStoreSearch(seller, search))
      .filter((seller) => matchesStoreCity(seller, city))
      .map((seller) => ({
        ...this.sanitize(seller),
        productCount: countMap.get(seller.id) || 0,
        storeLatitude: seller.storeLatitude ? Number(seller.storeLatitude) : null,
        storeLongitude: seller.storeLongitude ? Number(seller.storeLongitude) : null,
      }));
  }

  async getStoreById(id: string) {
    const seller = await this.userRepository.findOne({ where: { id } });
    if (!seller || (seller.role !== UserRole.SELLER && seller.role !== UserRole.ADMIN)) {
      throw new NotFoundException('Store not found');
    }

    const productCount = await this.productRepository.count({
      where: { sellerId: id, status: ProductStatus.APPROVED },
    });

    return {
      ...this.sanitize(seller),
      productCount,
      storeLatitude: seller.storeLatitude ? Number(seller.storeLatitude) : null,
      storeLongitude: seller.storeLongitude ? Number(seller.storeLongitude) : null,
    };
  }
}
