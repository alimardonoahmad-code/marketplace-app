/** Маппинги ном → категория ва суратҳои мувофиқ барои маҳсулоти seed */

const PREFIX_TO_SLUG: Record<string, string> = {
  Телефон: 'electronics',
  Ноутбук: 'electronics',
  Планшет: 'electronics',
  Наушник: 'electronics',
  'Смарт-саат': 'electronics',
  Камера: 'electronics',
  Монитор: 'electronics',
  Клавиатура: 'electronics',
  Курта: 'clothing',
  Пойабар: 'clothing',
  Куртка: 'clothing',
  Шим: 'clothing',
  Платок: 'clothing',
  Кофта: 'clothing',
  Пӯшише: 'clothing',
  Капот: 'clothing',
  Миз: 'home-garden',
  Курсӣ: 'home-garden',
  Чароғ: 'home-garden',
  Диван: 'home-garden',
  Гилос: 'home-garden',
  Оина: 'home-garden',
  Шкаф: 'home-garden',
  Декор: 'home-garden',
  Тӯб: 'sports',
  Гантель: 'sports',
  Велосипед: 'sports',
  Мат: 'sports',
  Ракетка: 'sports',
  Кроссовка: 'sports',
  Форма: 'sports',
  Сумка: 'sports',
  Китоб: 'books',
  Роман: 'books',
  Дастур: 'books',
  Атлас: 'books',
  Журнал: 'books',
  Дафтар: 'books',
  Ручка: 'books',
  Блокнот: 'books',
};

const SLUG_IMAGES: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80&auto=format&fit=crop',
  ],
  'home-garden': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61e9bc7?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616046229476-63ddf3f7f986?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80&auto=format&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80&auto=format&fit=crop',
  ],
  books: [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80&auto=format&fit=crop',
  ],
};

export function getProductPrefix(name: string): string {
  const first = name.split(' ')[0];
  return PREFIX_TO_SLUG[first] ? first : '';
}

export function getCategorySlugForName(name: string): string | null {
  const prefix = getProductPrefix(name);
  return prefix ? PREFIX_TO_SLUG[prefix] : null;
}

export function getImageForProductName(name: string, index = 0): string {
  const slug = getCategorySlugForName(name) || 'electronics';
  const pool = SLUG_IMAGES[slug] || SLUG_IMAGES.electronics;
  const numMatch = name.match(/#(\d+)/);
  const n = numMatch ? parseInt(numMatch[1], 10) : index;
  return pool[n % pool.length];
}

export { PREFIX_TO_SLUG, SLUG_IMAGES };
