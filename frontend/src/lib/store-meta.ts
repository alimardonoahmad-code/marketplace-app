import { BRAND } from '@/lib/brand-theme';
import { Store } from '@/types';
import { getStoreName } from '@/lib/store-utils';

export interface StoreGradient {
  gradient: string;
  glow: string;
  accent: string;
}

export interface StorePromoMeta {
  coverImage: string;
  tagline: string;
  sampleLabel: string;
  samplePrice: number;
}

/** Ягона стили мағоза — ҳама як ранг */
export const STORE_STYLE: StoreGradient = {
  gradient: BRAND.gradient,
  glow: BRAND.glow,
  accent: BRAND.accent,
};

export function getStoreGradient(_id?: string): StoreGradient {
  return STORE_STYLE;
}

export const STORE_CITIES = ['Душанбе', 'Хуҷанд', 'Бохтар', 'Кулоб'];

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Душанбе: { lat: 38.5598, lng: 68.7738 },
  Хуҷанд: { lat: 40.2854, lng: 69.62 },
  Бохтар: { lat: 37.8364, lng: 68.7803 },
  Кулоб: { lat: 37.9146, lng: 69.7845 },
};

type StoreTheme = 'home' | 'sport' | 'tech' | 'fashion' | 'books' | 'general';

const STORE_THEME_META: Record<StoreTheme, StorePromoMeta> = {
  home: {
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&q=80&auto=format&fit=crop',
    tagline: 'Мебел ва декор барои хона',
    sampleLabel: 'Мебели муосир',
    samplePrice: 1850,
  },
  sport: {
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=320&q=80&auto=format&fit=crop',
    tagline: 'Маҳсулоти варзишӣ ва фитнес',
    sampleLabel: 'Таҷҳизоти варзиш',
    samplePrice: 720,
  },
  tech: {
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&q=80&auto=format&fit=crop',
    tagline: 'Техника ва гаджетҳои нав',
    sampleLabel: 'Смартфон',
    samplePrice: 10800,
  },
  fashion: {
    coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=320&q=80&auto=format&fit=crop',
    tagline: 'Либос ва пӯшиҳои мода',
    sampleLabel: 'Либоси мода',
    samplePrice: 520,
  },
  books: {
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80&auto=format&fit=crop',
    tagline: 'Китобҳо ва адабиёт',
    sampleLabel: 'Китоби нав',
    samplePrice: 85,
  },
  general: {
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=320&q=80&auto=format&fit=crop',
    tagline: 'Маҳсулоти гуногун',
    sampleLabel: 'Маҳсулот',
    samplePrice: 450,
  },
};

function detectStoreTheme(store: Store): StoreTheme {
  const text = `${getStoreName(store)} ${store.storeDescription || ''} ${store.name} ${store.email}`.toLowerCase();

  if (/sport|варзиш|fitness|zone/.test(text)) return 'sport';
  if (/home|comfort|мебел|декор|боғ|хона/.test(text)) return 'home';
  if (/tech|техник|gadget|электрон|phone|store dushanbe/.test(text)) return 'tech';
  if (/fashion|boutique|либос|пӯши|dress/.test(text)) return 'fashion';
  if (/book|китоб|literature/.test(text)) return 'books';

  return 'general';
}

export function getStorePromoMeta(store: Store): StorePromoMeta {
  const theme = detectStoreTheme(store);
  const base = STORE_THEME_META[theme];

  if (store.storeDescription?.trim()) {
    return { ...base, tagline: store.storeDescription.trim() };
  }

  return base;
}

export const SELLER_STEP_PROMOS = [
  {
    step: '01',
    title: 'Мағоза кушоед',
    sub: 'Фурӯшанда шавед',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=320&q=80&auto=format&fit=crop',
    href: '/sell',
  },
  {
    step: '02',
    title: 'Маҳсулот илова',
    sub: 'Акс, нарх, тавсиф',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=320&q=80&auto=format&fit=crop',
    sampleLabel: 'Маҳсулоти нав',
    samplePrice: 850,
    href: '/sell',
  },
  {
    step: '03',
    title: 'Фурӯш кунед',
    sub: 'Харидорон меёбанд',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=320&q=80&auto=format&fit=crop',
    href: '/sell',
  },
] as const;
