import type { SelectQueryBuilder } from 'typeorm';
import type { Product } from '../entities/product.entity';

/** Калимаҳои ҷустуҷӯ (тоҷикӣ/русӣ/англисӣ) → категория ва префиксҳои ном */

interface SearchExpand {
  slugs: string[];
  prefixes: string[];
  aliases: string[];
}

const RULES: { keys: string[]; slugs?: string[]; prefixes?: string[] }[] = [
  {
    keys: ['либос', 'либосе', 'пӯшише', 'одежда', 'clothing', 'clothes', 'fashion', 'мода'],
    slugs: ['clothing'],
    prefixes: ['Курта', 'Пойабар', 'Куртка', 'Шим', 'Платок', 'Кофта', 'Пӯшише', 'Капот'],
  },
  {
    keys: ['китоб', 'китобҳо', 'books', 'book', 'адабиёт', 'роман'],
    slugs: ['books'],
    prefixes: ['Китоб', 'Роман', 'Дастур', 'Атлас', 'Журнал', 'Дафтар', 'Ручка', 'Блокнот'],
  },
  {
    keys: ['варзиш', 'sport', 'sports', 'фитнес', 'кроссовка', 'кроссовки', 'sneaker'],
    slugs: ['sports'],
    prefixes: ['Тӯб', 'Гантель', 'Велосипед', 'Мат', 'Ракетка', 'Кроссовка', 'Форма', 'Сумка'],
  },
  {
    keys: ['электроника', 'electronics', 'гаджет', 'техника', 'телефон', 'phone', 'ноутбук', 'laptop'],
    slugs: ['electronics'],
    prefixes: ['Телефон', 'Ноутбук', 'Планшет', 'Наушник', 'Смарт-саат', 'Камера', 'Монитор', 'Клавиатура'],
  },
  {
    keys: ['хона', 'мебел', 'декор', 'home', 'garden', 'боғ', 'диван', 'миз'],
    slugs: ['home-garden'],
    prefixes: ['Миз', 'Курсӣ', 'Чароғ', 'Диван', 'Гилос', 'Оина', 'Шкаф', 'Декор'],
  },
  {
    keys: ['iphone', 'samsung', 'apple', 'macbook', 'ipad'],
    slugs: ['electronics'],
    prefixes: [],
  },
  {
    keys: ['nike', 'курта', 'футболка', 'tshirt', 'джинс'],
    slugs: ['clothing'],
    prefixes: ['Курта', 'Кофта', 'Шим'],
  },
];

export function expandSearchQuery(raw: string): SearchExpand {
  const q = raw.toLowerCase().trim();
  const slugs = new Set<string>();
  const prefixes = new Set<string>();
  const aliases = new Set<string>([q]);

  for (const rule of RULES) {
    const matched = rule.keys.some(
      (k) => q === k || q.includes(k) || k.includes(q),
    );
    if (matched) {
      rule.slugs?.forEach((s) => slugs.add(s));
      rule.prefixes?.forEach((p) => prefixes.add(p));
      rule.keys.forEach((k) => aliases.add(k));
    }
  }

  for (const rule of RULES) {
    for (const p of rule.prefixes || []) {
      if (p.toLowerCase().startsWith(q) || (q.length >= 3 && p.toLowerCase().includes(q))) {
        rule.slugs?.forEach((s) => slugs.add(s));
        prefixes.add(p);
      }
    }
  }

  return {
    slugs: [...slugs],
    prefixes: [...prefixes],
    aliases: [...aliases],
  };
}

export function applySearchFilter(
  qb: SelectQueryBuilder<Product>,
  search: string,
  paramPrefix = 'srch',
): void {
  const { slugs, prefixes, aliases } = expandSearchQuery(search);
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  aliases.forEach((alias, i) => {
    const key = `${paramPrefix}a${i}`;
    const like = `%${alias}%`;
    conditions.push(`LOWER(product.name) LIKE :${key}`);
    conditions.push(`LOWER(product.description) LIKE :${key}`);
    conditions.push(`LOWER(category.name) LIKE :${key}`);
    conditions.push(`LOWER(category.slug) LIKE :${key}`);
    params[key] = like;
  });

  prefixes.forEach((prefix, i) => {
    const key = `${paramPrefix}p${i}`;
    conditions.push(`product.name LIKE :${key}`);
    params[key] = `${prefix}%`;
  });

  slugs.forEach((slug, i) => {
    const key = `${paramPrefix}c${i}`;
    conditions.push(`category.slug = :${key}`);
    params[key] = slug;
  });

  if (conditions.length > 0) {
    qb.andWhere(`(${conditions.join(' OR ')})`, params);
  }
}
