import { DataSource } from 'typeorm';
import { join } from 'path';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Review } from './entities/review.entity';
import { Wishlist } from './entities/wishlist.entity';
import { CartItem } from './entities/cart-item.entity';
import { Coupon, CouponType } from './entities/coupon.entity';
import { Banner } from './entities/banner.entity';
import { FaqItem } from './entities/faq.entity';
import { UserRole, ProductStatus } from './common/enums';
import { getCategorySlugForName, getImageForProductName } from './common/product-images';

config();

const ALL_ENTITIES = [User, Category, Product, Order, OrderItem, Review, Wishlist, CartItem, Coupon, Banner, FaqItem];

async function seed() {
  const dbType = process.env.DB_TYPE || 'sqlite';

  const dataSourceOptions =
    dbType === 'postgres'
      ? {
          type: 'postgres' as const,
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME || 'marketplace',
          password: process.env.DB_PASSWORD || 'marketplace_secret',
          database: process.env.DB_DATABASE || 'marketplace',
          entities: ALL_ENTITIES,
          synchronize: true,
        }
      : {
          type: 'sqljs' as const,
          location: join(process.cwd(), process.env.DB_PATH || 'marketplace.db'),
          autoSave: true,
          entities: [join(__dirname, 'entities', '*.entity.{ts,js}')],
          synchronize: true,
        };

  const AppDataSource = new DataSource(dataSourceOptions);
  await AppDataSource.initialize();
  console.log('📦 Database connected, seeding...');

  const userRepo = AppDataSource.getRepository(User);
  const categoryRepo = AppDataSource.getRepository(Category);
  const productRepo = AppDataSource.getRepository(Product);

  const password = await bcrypt.hash('password123', 12);

  let admin = await userRepo.findOne({ where: { email: 'admin@marketplace.com' } });
  if (!admin) {
    admin = userRepo.create({
      name: 'Admin User',
      email: 'admin@marketplace.com',
      password,
      role: UserRole.ADMIN,
      phone: '+992900000001',
    });
    await userRepo.save(admin);
    console.log('✅ Admin created: admin@marketplace.com / password123');
  }

  let seller = await userRepo.findOne({ where: { email: 'seller@marketplace.com' } });
  const sellerProfile = {
    storeName: 'Tech Store Dushanbe',
    storeAddress: 'кӯчаи Рӯдакӣ, 45',
    storeCity: 'Душанбе',
    storeDescription: 'Техника ва гаджетҳои нав — мағозаи онлайн дар маркази шаҳр',
    storeLatitude: 38.5612,
    storeLongitude: 68.7798,
  };
  if (!seller) {
    seller = userRepo.create({
      name: 'Tech Store',
      email: 'seller@marketplace.com',
      password,
      role: UserRole.SELLER,
      phone: '+992900000002',
      address: 'Dushanbe, Tajikistan',
      ...sellerProfile,
    });
    await userRepo.save(seller);
    console.log('✅ Seller created: seller@marketplace.com / password123');
  } else {
    Object.assign(seller, sellerProfile);
    await userRepo.save(seller);
  }

  const extraSellers = [
    {
      name: 'Fashion Boutique',
      email: 'fashion@marketplace.com',
      storeName: 'Fashion Boutique',
      storeAddress: 'кӯчаи Айнӣ, 12',
      storeCity: 'Душанбе',
      storeDescription: 'Либос ва пӯшиҳои мода — мағозаи онлайн',
      storeLatitude: 38.5575,
      storeLongitude: 68.7712,
    },
    {
      name: 'Home Comfort',
      email: 'home@marketplace.com',
      storeName: 'Home Comfort',
      storeAddress: 'кӯчаи Бохтар, 78',
      storeCity: 'Душанбе',
      storeDescription: 'Мебел ва декор барои хона',
      storeLatitude: 38.5538,
      storeLongitude: 68.7855,
    },
    {
      name: 'Sport Zone',
      email: 'sport@marketplace.com',
      storeName: 'Sport Zone',
      storeAddress: 'кӯчаи Садриддин Айнӣ, 33',
      storeCity: 'Хуҷанд',
      storeDescription: 'Маҳсулоти варзишӣ ва фитнес',
      storeLatitude: 40.2831,
      storeLongitude: 69.6184,
    },
  ];

  const savedSellers = [seller!];
  for (const s of extraSellers) {
    let existing = await userRepo.findOne({ where: { email: s.email } });
    if (!existing) {
      existing = userRepo.create({
        ...s,
        password,
        role: UserRole.SELLER,
        phone: '+992900000099',
      });
      await userRepo.save(existing);
      console.log(`✅ Seller created: ${s.email}`);
    } else {
      Object.assign(existing, s);
      await userRepo.save(existing);
    }
    savedSellers.push(existing);
  }

  let buyer = await userRepo.findOne({ where: { email: 'buyer@marketplace.com' } });
  if (!buyer) {
    buyer = userRepo.create({
      name: 'John Buyer',
      email: 'buyer@marketplace.com',
      password,
      role: UserRole.BUYER,
      phone: '+992900000003',
      address: 'Dushanbe, Rudaki 10',
    });
    await userRepo.save(buyer);
    console.log('✅ Buyer created: buyer@marketplace.com / password123');
  }

  let courier = await userRepo.findOne({ where: { email: 'courier@marketplace.com' } });
  if (!courier) {
    courier = userRepo.create({
      name: 'Fast Courier',
      email: 'courier@marketplace.com',
      password,
      role: UserRole.COURIER,
      phone: '+992900000004',
    });
    await userRepo.save(courier);
    console.log('✅ Courier created: courier@marketplace.com / password123');
  }

  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, gadgets' },
    { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture and decor' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment' },
    { name: 'Books', slug: 'books', description: 'Books and literature' },
  ];

  const savedCategories: Category[] = [];
  for (const cat of categories) {
    let category = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!category) {
      category = categoryRepo.create(cat);
      await categoryRepo.save(category);
    }
    savedCategories.push(category);
  }
  console.log(`✅ ${savedCategories.length} categories created`);

  const products = [
    {
      name: 'iPhone 15 Pro',
      description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system.',
      price: 12500,
      discountPrice: 11200,
      stock: 50,
      categoryId: savedCategories[0].id,
      images: ['https://picsum.photos/seed/iphone/400/400'],
      rating: 4.8,
      reviewCount: 128,
    },
    {
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone with AI features and stunning display.',
      price: 10800,
      stock: 35,
      categoryId: savedCategories[0].id,
      images: ['https://picsum.photos/seed/samsung/400/400'],
      rating: 4.6,
      reviewCount: 89,
    },
    {
      name: 'MacBook Air M3',
      description: 'Ultra-thin laptop with M3 chip, 18-hour battery life.',
      price: 15200,
      discountPrice: 13900,
      stock: 20,
      categoryId: savedCategories[0].id,
      images: ['https://picsum.photos/seed/macbook/400/400'],
      rating: 4.9,
      reviewCount: 256,
    },
    {
      name: 'Nike Air Max 90',
      description: 'Classic Nike sneakers with Air cushioning technology.',
      price: 850,
      stock: 100,
      categoryId: savedCategories[1].id,
      images: ['https://picsum.photos/seed/nike/400/400'],
      rating: 4.5,
      reviewCount: 342,
    },
    {
      name: "Levi's 501 Jeans",
      description: 'Original fit jeans, timeless style and comfort.',
      price: 520,
      discountPrice: 390,
      stock: 200,
      categoryId: savedCategories[1].id,
      images: ['https://picsum.photos/seed/jeans/400/400'],
      rating: 4.3,
      reviewCount: 178,
    },
    {
      name: 'Modern Sofa',
      description: 'Comfortable 3-seater sofa with premium fabric upholstery.',
      price: 4800,
      stock: 15,
      categoryId: savedCategories[2].id,
      images: ['https://picsum.photos/seed/sofa/400/400'],
      rating: 4.4,
      reviewCount: 45,
    },
    {
      name: 'Yoga Mat Pro',
      description: 'Non-slip yoga mat with carrying strap, 6mm thickness.',
      price: 120,
      stock: 150,
      categoryId: savedCategories[3].id,
      images: ['https://picsum.photos/seed/yoga/400/400'],
      rating: 4.7,
      reviewCount: 92,
    },
    {
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald.',
      price: 45,
      stock: 500,
      categoryId: savedCategories[4].id,
      images: ['https://picsum.photos/seed/book/400/400'],
      rating: 4.8,
      reviewCount: 1024,
    },
  ];

  for (const prod of products) {
    const existing = await productRepo.findOne({ where: { name: prod.name } });
    if (existing) {
      Object.assign(existing, {
        price: prod.price,
        discountPrice: prod.discountPrice ?? null,
      });
      await productRepo.save(existing);
    } else if (seller) {
      const product = productRepo.create({
        ...prod,
        sellerId: seller.id,
        status: ProductStatus.APPROVED,
      });
      await productRepo.save(product);
    }
  }

  const sellerProducts = [
    { name: 'Summer Dress', description: 'Light cotton dress for summer.', price: 280, stock: 80, categoryIdx: 1, sellerIdx: 1, images: ['https://picsum.photos/seed/dress/400/400'], rating: 4.4, reviewCount: 56 },
    { name: 'Winter Jacket', description: 'Warm jacket for cold season.', price: 650, discountPrice: 520, stock: 40, categoryIdx: 1, sellerIdx: 1, images: ['https://picsum.photos/seed/jacket/400/400'], rating: 4.6, reviewCount: 34 },
    { name: 'Coffee Table', description: 'Modern wooden coffee table.', price: 1850, stock: 25, categoryIdx: 2, sellerIdx: 2, images: ['https://picsum.photos/seed/table/400/400'], rating: 4.5, reviewCount: 21 },
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness.', price: 180, stock: 60, categoryIdx: 2, sellerIdx: 2, images: ['https://picsum.photos/seed/lamp/400/400'], rating: 4.3, reviewCount: 18 },
    { name: 'Football Ball', description: 'Professional size 5 football.', price: 150, stock: 120, categoryIdx: 3, sellerIdx: 3, images: ['https://picsum.photos/seed/football/400/400'], rating: 4.7, reviewCount: 67 },
    { name: 'Dumbbells Set', description: 'Adjustable dumbbells 2x10kg.', price: 720, stock: 30, categoryIdx: 3, sellerIdx: 3, images: ['https://picsum.photos/seed/dumbbells/400/400'], rating: 4.8, reviewCount: 42 },
  ];

  for (const prod of sellerProducts) {
    const existing = await productRepo.findOne({ where: { name: prod.name } });
    const targetSeller = savedSellers[prod.sellerIdx];
    if (existing) {
      Object.assign(existing, {
        price: prod.price,
        discountPrice: prod.discountPrice ?? null,
      });
      await productRepo.save(existing);
    } else if (targetSeller) {
      const { categoryIdx, sellerIdx, ...data } = prod;
      const product = productRepo.create({
        ...data,
        categoryId: savedCategories[categoryIdx].id,
        sellerId: targetSeller.id,
        status: ProductStatus.APPROVED,
      });
      await productRepo.save(product);
    }
  }
  console.log(`✅ ${products.length + sellerProducts.length} products created`);

  const moreProducts = [
    { name: 'iPad Air', description: 'Tablet for work and study.', price: 8900, stock: 25, categoryIdx: 0, sellerIdx: 0, images: ['https://picsum.photos/seed/ipad/400/400'], rating: 4.7, reviewCount: 88 },
    { name: 'Bluetooth Speaker', description: 'Portable speaker with deep bass.', price: 420, stock: 70, categoryIdx: 0, sellerIdx: 0, images: ['https://picsum.photos/seed/speaker/400/400'], rating: 4.4, reviewCount: 45 },
    { name: 'Smart Watch', description: 'Fitness tracker and notifications.', price: 980, discountPrice: 850, stock: 55, categoryIdx: 0, sellerIdx: 0, images: ['https://picsum.photos/seed/watch/400/400'], rating: 4.5, reviewCount: 62 },
    { name: 'Cotton T-Shirt', description: 'Soft everyday t-shirt.', price: 120, stock: 200, categoryIdx: 1, sellerIdx: 1, images: ['https://picsum.photos/seed/tshirt/400/400'], rating: 4.2, reviewCount: 90 },
    { name: 'Sneakers Classic', description: 'Comfortable casual sneakers.', price: 480, stock: 90, categoryIdx: 1, sellerIdx: 1, images: ['https://picsum.photos/seed/sneakers/400/400'], rating: 4.6, reviewCount: 77 },
    { name: 'Leather Belt', description: 'Genuine leather belt.', price: 180, stock: 60, categoryIdx: 1, sellerIdx: 1, images: ['https://picsum.photos/seed/belt/400/400'], rating: 4.3, reviewCount: 33 },
    { name: 'Dining Chair', description: 'Ergonomic dining chair.', price: 950, stock: 40, categoryIdx: 2, sellerIdx: 2, images: ['https://picsum.photos/seed/chair/400/400'], rating: 4.4, reviewCount: 28 },
    { name: 'Wall Clock', description: 'Modern wall clock.', price: 140, stock: 80, categoryIdx: 2, sellerIdx: 2, images: ['https://picsum.photos/seed/clock/400/400'], rating: 4.1, reviewCount: 19 },
    { name: 'Plant Pot Set', description: 'Ceramic pots for home garden.', price: 95, stock: 100, categoryIdx: 2, sellerIdx: 2, images: ['https://picsum.photos/seed/pots/400/400'], rating: 4.5, reviewCount: 41 },
    { name: 'Running Shoes', description: 'Lightweight running shoes.', price: 620, stock: 65, categoryIdx: 3, sellerIdx: 3, images: ['https://picsum.photos/seed/running/400/400'], rating: 4.7, reviewCount: 54 },
    { name: 'Tennis Racket', description: 'Professional tennis racket.', price: 380, stock: 35, categoryIdx: 3, sellerIdx: 3, images: ['https://picsum.photos/seed/tennis/400/400'], rating: 4.6, reviewCount: 29 },
    { name: 'Fitness Gloves', description: 'Gym training gloves.', price: 75, stock: 120, categoryIdx: 3, sellerIdx: 3, images: ['https://picsum.photos/seed/gloves/400/400'], rating: 4.4, reviewCount: 38 },
    { name: 'Tajik Poetry Book', description: 'Classic Tajik literature.', price: 55, stock: 150, categoryIdx: 4, sellerIdx: 0, images: ['https://picsum.photos/seed/poetry/400/400'], rating: 4.9, reviewCount: 210 },
    { name: 'English Dictionary', description: 'English-Tajik dictionary.', price: 85, stock: 200, categoryIdx: 4, sellerIdx: 0, images: ['https://picsum.photos/seed/dictionary/400/400'], rating: 4.7, reviewCount: 145 },
    { name: 'Children Story Book', description: 'Illustrated stories for kids.', price: 40, stock: 300, categoryIdx: 4, sellerIdx: 0, images: ['https://picsum.photos/seed/kidsbook/400/400'], rating: 4.8, reviewCount: 320 },
  ];

  for (const prod of moreProducts) {
    const existing = await productRepo.findOne({ where: { name: prod.name } });
    const targetSeller = savedSellers[prod.sellerIdx];
    if (!existing && targetSeller) {
      const { categoryIdx, sellerIdx, ...data } = prod;
      const product = productRepo.create({
        ...data,
        categoryId: savedCategories[categoryIdx].id,
        sellerId: targetSeller.id,
        status: ProductStatus.APPROVED,
      });
      await productRepo.save(product);
    }
  }
  console.log('✅ Extra category products ensured');

  const TARGET_PRODUCT_COUNT = 1050;
  const currentCount = await productRepo.count();
  if (currentCount < TARGET_PRODUCT_COUNT) {
    const need = TARGET_PRODUCT_COUNT - currentCount;
    const namePrefixes = [
      'Телефон', 'Ноутбук', 'Планшет', 'Наушник', 'Смарт-саат', 'Камера', 'Монитор', 'Клавиатура',
      'Курта', 'Пойабар', 'Куртка', 'Шим', 'Платок', 'Кофта', 'Пӯшише', 'Капот',
      'Миз', 'Курсӣ', 'Чароғ', 'Диван', 'Гилос', 'Оина', 'Шкаф', 'Декор',
      'Тӯб', 'Гантель', 'Велосипед', 'Мат', 'Ракетка', 'Кроссовка', 'Форма', 'Сумка',
      'Китоб', 'Роман', 'Дастур', 'Атлас', 'Журнал', 'Дафтар', 'Ручка', 'Блокнот',
    ];
    const descTemplates = [
      'Маҳсулоти босифа барои истифодаи ҳаррӯза.',
      'Сифати баланд, нархи мувофиқ дар Тоҷикистон.',
      'Барои хонадон ва офис мувофиқ.',
      'Дизайни муосир ва материали устувор.',
      'Интиқоли ройгон дар Душанбе.',
    ];

    const batch: Product[] = [];
    const categoriesBySlug = Object.fromEntries(savedCategories.map((c) => [c.slug, c]));
    for (let i = 0; i < need; i++) {
      const sellerIdx = i % savedSellers.length;
      const prefix = namePrefixes[i % namePrefixes.length];
      const num = currentCount + i + 1;
      const name = `${prefix} LakMarket #${num}`;
      const slug = getCategorySlugForName(name) || savedCategories[i % savedCategories.length].slug;
      const category = categoriesBySlug[slug] || savedCategories[0];
      const basePrice = 50 + ((i * 37) % 15000);
      const hasDiscount = i % 4 === 0;
      const discountPrice = hasDiscount ? Math.round(basePrice * 0.85) : undefined;

      batch.push(
        productRepo.create({
          name,
          description: descTemplates[i % descTemplates.length],
          price: basePrice,
          discountPrice,
          stock: 10 + (i % 200),
          categoryId: category.id,
          sellerId: savedSellers[sellerIdx].id,
          images: [getImageForProductName(name, num)],
          rating: Math.round((3.5 + (i % 15) / 10) * 10) / 10,
          reviewCount: i % 500,
          status: ProductStatus.APPROVED,
        }),
      );
    }

    const CHUNK = 100;
    for (let i = 0; i < batch.length; i += CHUNK) {
      await productRepo.save(batch.slice(i, i + CHUNK));
    }
    console.log(`✅ Bulk seed: +${need} products (total ≥ ${TARGET_PRODUCT_COUNT})`);
  } else {
    console.log(`✅ Products already ${currentCount} (≥ ${TARGET_PRODUCT_COUNT})`);
  }

  const couponRepo = AppDataSource.getRepository(Coupon);
  const defaultCoupons = [
    { code: 'SALE10', type: CouponType.PERCENT, value: 10, minOrder: 100 },
    { code: 'WELCOME50', type: CouponType.FIXED, value: 50, minOrder: 200 },
    { code: 'SUMMER20', type: CouponType.PERCENT, value: 20, minOrder: 500, maxUses: 1000 },
    { code: 'VIP100', type: CouponType.FIXED, value: 100, minOrder: 1000, maxUses: 200 },
  ];
  for (const c of defaultCoupons) {
    let existing = await couponRepo.findOne({ where: { code: c.code } });
    if (!existing) {
      existing = couponRepo.create({ ...c, active: true });
      await couponRepo.save(existing);
    }
  }
  console.log('✅ Promo coupons ensured');

  // Ислоҳи суратҳо ва категорияҳо барои маҳсулоти LakMarket
  const categoriesBySlug = Object.fromEntries(
    (await categoryRepo.find()).map((c) => [c.slug, c]),
  );
  const allProducts = await productRepo.find();
  let fixed = 0;
  for (const p of allProducts) {
    const slug = getCategorySlugForName(p.name);
    if (!slug || !categoriesBySlug[slug]) continue;
    const correctImage = getImageForProductName(p.name);
    const needsFix =
      p.categoryId !== categoriesBySlug[slug].id ||
      !p.images?.[0] ||
      p.images[0].includes('picsum.photos');
    if (needsFix) {
      p.categoryId = categoriesBySlug[slug].id;
      p.images = [correctImage];
      await productRepo.save(p);
      fixed++;
    }
  }
  if (fixed > 0) console.log(`✅ Fixed ${fixed} product images/categories`);

  // Convert legacy USD prices (if DB still has old values)
  const orderRepo = AppDataSource.getRepository(Order);
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  const maxRow = await productRepo.createQueryBuilder('p').select('MAX(p.price)', 'max').getRawOne();
  const maxPrice = Number(maxRow?.max || 0);
  if (maxPrice > 0 && maxPrice < 2000) {
    const rate = 11;
    const allProducts = await productRepo.find();
    for (const p of allProducts) {
      p.price = Math.round(Number(p.price) * rate);
      if (p.discountPrice) p.discountPrice = Math.round(Number(p.discountPrice) * rate);
      await productRepo.save(p);
    }
    const allOrders = await orderRepo.find({ relations: ['items'] });
    for (const o of allOrders) {
      o.totalPrice = Math.round(Number(o.totalPrice) * rate);
      await orderRepo.save(o);
      for (const item of o.items || []) {
        item.price = Math.round(Number(item.price) * rate);
        await orderItemRepo.save(item);
      }
    }
    console.log('✅ Legacy USD prices converted to somoni');
  }

  await seedCms(AppDataSource);

  await AppDataSource.destroy();
  console.log('🎉 Seeding complete!');
}

async function seedCms(dataSource: DataSource) {
  const bannerRepo = dataSource.getRepository(Banner);
  const faqRepo = dataSource.getRepository(FaqItem);

  const bannerCount = await bannerRepo.count();
  if (bannerCount === 0) {
    const banners = [
      { title: 'Вот это скидки!', subtitle: 'Тахфифи то 70%', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=75', href: '/products?hasDiscount=true', sortOrder: 0 },
      { title: 'Доставкаи ройгон', subtitle: 'Дар Душанбе', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=75', href: '/products', sortOrder: 1 },
      { title: 'Мағозаҳои маҳаллӣ', subtitle: '1000+ маҳсулот', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=75', href: '/stores', sortOrder: 2 },
    ];
    for (const b of banners) await bannerRepo.save(bannerRepo.create(b));
    console.log('✅ CMS banners seeded');
  }

  const faqCount = await faqRepo.count();
  if (faqCount === 0) {
    const faqs = [
      { question: 'Чӣ тавр фармоиш диҳам?', answer: 'Маҳсулотро ба сабад илова кунед ва checkout-ро анҷом диҳед.', sortOrder: 0 },
      { question: 'Доставка чанд рӯз мегирад?', answer: 'Дар Душанбе 1-2 рӯз, дар дигар шаҳрҳо 3-5 рӯз.', sortOrder: 1 },
      { question: 'Пардохт чӣ гуна аст?', answer: 'Корт, COD, Alif ва Eskhata дастгирӣ мешавад.', sortOrder: 2 },
    ];
    for (const f of faqs) await faqRepo.save(faqRepo.create(f));
    console.log('✅ FAQ seeded');
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
