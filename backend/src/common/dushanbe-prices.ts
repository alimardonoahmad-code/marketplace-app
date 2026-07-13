import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Setting } from '../entities/setting.entity';

export const DUSHANBE_PRICE_SETTING_KEY = 'dushanbe_price_version';
export const DUSHANBE_PRICE_VERSION = '1';

/** Диапазони нарх барои бозори Душанбе (сомонӣ) */
export const CATEGORY_PRICE_RANGE: Record<string, [number, number]> = {
  electronics: [450, 7200],
  clothing: [45, 420],
  'home-garden': [85, 2200],
  sports: [35, 780],
  books: [10, 75],
};

export const CURATED_PRICES: Array<{ name: string; price: number; discountPrice?: number }> = [
  { name: 'iPhone 15 Pro', price: 8500, discountPrice: 7600 },
  { name: 'Samsung Galaxy S24', price: 7300 },
  { name: 'MacBook Air M3', price: 10300, discountPrice: 9400 },
  { name: 'Nike Air Max 90', price: 580 },
  { name: "Levi's 501 Jeans", price: 350, discountPrice: 265 },
  { name: 'Modern Sofa', price: 3200 },
  { name: 'Yoga Mat Pro', price: 80 },
  { name: 'The Great Gatsby', price: 30 },
  { name: 'Summer Dress', price: 190 },
  { name: 'Winter Jacket', price: 440, discountPrice: 350 },
  { name: 'Coffee Table', price: 1250 },
  { name: 'Desk Lamp', price: 120 },
  { name: 'Football Ball', price: 100 },
  { name: 'Dumbbells Set', price: 490 },
  { name: 'iPad Air', price: 6000 },
  { name: 'Bluetooth Speaker', price: 285 },
  { name: 'Smart Watch', price: 650, discountPrice: 560 },
  { name: 'Cotton T-Shirt', price: 80 },
  { name: 'Sneakers Classic', price: 320 },
  { name: 'Leather Belt', price: 120 },
  { name: 'Dining Chair', price: 640 },
  { name: 'Wall Clock', price: 95 },
  { name: 'Plant Pot Set', price: 65 },
  { name: 'Running Shoes', price: 420 },
  { name: 'Tennis Racket', price: 260 },
  { name: 'Fitness Gloves', price: 50 },
  { name: 'Tajik Poetry Book', price: 38 },
  { name: 'English Dictionary', price: 58 },
  { name: 'Children Story Book', price: 28 },
];

export function roundSomoni(n: number): number {
  if (n < 100) return Math.max(5, Math.round(n / 5) * 5);
  if (n < 1000) return Math.round(n / 10) * 10;
  return Math.round(n / 50) * 50;
}

export function priceFromCategory(slug: string, seed: number): number {
  const [min, max] = CATEGORY_PRICE_RANGE[slug] || [30, 500];
  return roundSomoni(min + (seed % (max - min + 1)));
}

export async function adjustPricesToDushanbeMarket(
  productRepo: Repository<Product>,
  orderRepo: Repository<Order>,
  orderItemRepo: Repository<OrderItem>,
): Promise<number> {
  const avgRow = await productRepo.createQueryBuilder('p').select('AVG(p.price)', 'avg').getRawOne();
  const average = Number(avgRow?.avg || 0);
  if (average <= 0 || average < 2200) return 0;

  const factor = 0.68;
  const allProducts = await productRepo.find();
  for (const p of allProducts) {
    p.price = roundSomoni(Number(p.price) * factor);
    if (p.discountPrice) {
      p.discountPrice = roundSomoni(Number(p.discountPrice) * factor);
    }
  }
  const CHUNK = 100;
  for (let i = 0; i < allProducts.length; i += CHUNK) {
    await productRepo.save(allProducts.slice(i, i + CHUNK));
  }

  const allOrders = await orderRepo.find({ relations: ['items'] });
  for (const o of allOrders) {
    o.totalPrice = roundSomoni(Number(o.totalPrice) * factor);
    await orderRepo.save(o);
    for (const item of o.items || []) {
      item.price = roundSomoni(Number(item.price) * factor);
      await orderItemRepo.save(item);
    }
  }
  return allProducts.length;
}

export async function applyCuratedPrices(productRepo: Repository<Product>): Promise<number> {
  let updated = 0;
  for (const prod of CURATED_PRICES) {
    const existing = await productRepo.findOne({ where: { name: prod.name } });
    if (!existing) continue;
    existing.price = prod.price;
    existing.discountPrice = (prod.discountPrice ?? null) as unknown as number;
    await productRepo.save(existing);
    updated++;
  }
  return updated;
}

export async function repriceLakMarketProducts(
  productRepo: Repository<Product>,
  categories: Category[],
): Promise<number> {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c.slug]));
  const lakProducts = await productRepo
    .createQueryBuilder('p')
    .where('p.name LIKE :pattern', { pattern: '%LakMarket%' })
    .getMany();

  const toSave: Product[] = [];
  for (const p of lakProducts) {
    const slug = byId[p.categoryId] || 'electronics';
    const hash = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const newPrice = priceFromCategory(slug, hash + p.name.length * 13);
    const oldPrice = Number(p.price);
    const oldDiscount = p.discountPrice ? Number(p.discountPrice) : null;
    const hadRealDiscount = oldDiscount && oldPrice > 0 && (oldPrice - oldDiscount) / oldPrice >= 0.2;

    p.price = newPrice;
    p.discountPrice = (hadRealDiscount ? roundSomoni(newPrice * 0.8) : null) as unknown as number;
    toSave.push(p);
  }

  if (toSave.length > 0) {
    const CHUNK = 100;
    for (let i = 0; i < toSave.length; i += CHUNK) {
      await productRepo.save(toSave.slice(i, i + CHUNK));
    }
  }
  return toSave.length;
}

export async function syncDushanbePrices(
  productRepo: Repository<Product>,
  orderRepo: Repository<Order>,
  orderItemRepo: Repository<OrderItem>,
  categoryRepo: Repository<Category>,
  settingRepo: Repository<Setting>,
): Promise<void> {
  const flag = await settingRepo.findOne({ where: { key: DUSHANBE_PRICE_SETTING_KEY } });
  if (flag?.value === DUSHANBE_PRICE_VERSION) return;

  const adjusted = await adjustPricesToDushanbeMarket(productRepo, orderRepo, orderItemRepo);
  const categories = await categoryRepo.find();
  const lak = await repriceLakMarketProducts(productRepo, categories);
  const curated = await applyCuratedPrices(productRepo);

  if (flag) {
    flag.value = DUSHANBE_PRICE_VERSION;
    await settingRepo.save(flag);
  } else {
    await settingRepo.save(
      settingRepo.create({ key: DUSHANBE_PRICE_SETTING_KEY, value: DUSHANBE_PRICE_VERSION }),
    );
  }

  console.log(
    `✅ Dushanbe prices synced (adjusted=${adjusted}, lak=${lak}, curated=${curated})`,
  );
}
