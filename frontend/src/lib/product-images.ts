/** Суратҳои мувофиқ барои намоиши fallback дар frontend */

const SLUG_IMAGES: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80&auto=format&fit=crop',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop',
  ],
  'home-garden': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80&auto=format&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80&auto=format&fit=crop',
  ],
  books: [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80&auto=format&fit=crop',
  ],
};

const PREFIX_SLUG: Record<string, string> = {
  Кроссовка: 'sports', Курта: 'clothing', Телефон: 'electronics', Китоб: 'books',
  Ноутбук: 'electronics', Гантель: 'sports', Диван: 'home-garden',
};

export function getFallbackImage(productName: string, categorySlug?: string): string {
  const prefix = productName.split(' ')[0];
  const slug = PREFIX_SLUG[prefix] || categorySlug || 'electronics';
  const pool = SLUG_IMAGES[slug] || SLUG_IMAGES.electronics;
  const n = parseInt(productName.match(/#(\d+)/)?.[1] || '0', 10);
  return pool[n % pool.length];
}
