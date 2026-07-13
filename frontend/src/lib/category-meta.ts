import {
  Smartphone, Shirt, Home, Dumbbell, BookOpen, Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { IconName } from '@/components/icons';
import { BRAND } from '@/lib/brand-theme';

export interface CategoryMeta {
  icon: LucideIcon;
  coverImage: string;
  nameTj: string;
  descTj: string;
  gradient: string;
  glow: string;
  iconBg: string;
}

const sharedStyle = {
  gradient: BRAND.gradient,
  glow: BRAND.glow,
  iconBg: BRAND.iconBg,
};

export const CATEGORY_META: Record<string, CategoryMeta> = {
  electronics: {
    icon: Smartphone,
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=256&q=80&auto=format&fit=crop',
    nameTj: 'Электроника',
    descTj: 'Телефон, ноутбук, гаджетҳо',
    ...sharedStyle,
  },
  clothing: {
    icon: Shirt,
    coverImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=256&q=80&auto=format&fit=crop',
    nameTj: 'Либос',
    descTj: 'Мода, пӯшиҳо, аксессуар',
    ...sharedStyle,
  },
  'home-garden': {
    icon: Home,
    coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=256&q=80&auto=format&fit=crop',
    nameTj: 'Хона ва боғ',
    descTj: 'Мебел, декор, ташкили хона',
    ...sharedStyle,
  },
  sports: {
    icon: Dumbbell,
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=256&q=80&auto=format&fit=crop',
    nameTj: 'Варзиш',
    descTj: 'Таҷҳизоти варзишӣ ва фитнес',
    ...sharedStyle,
  },
  books: {
    icon: BookOpen,
    coverImage: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=256&q=80&auto=format&fit=crop',
    nameTj: 'Китобҳо',
    descTj: 'Адабиёт, таълим, китобҳои нав',
    ...sharedStyle,
  },
};

export function getCategoryMeta(slug: string, fallbackName: string): CategoryMeta {
  return CATEGORY_META[slug] ?? {
    icon: Sparkles,
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=256&q=80&auto=format&fit=crop',
    nameTj: fallbackName,
    descTj: 'Маҳсулоти гуногун',
    ...sharedStyle,
  };
}

export const QUICK_LINKS: { href: string; label: string; icon: IconName }[] = [
  { href: '/products?hasDiscount=true', label: 'Тахфифҳо', icon: 'flash-sale' },
  { href: '/products?sortBy=createdAt&sortOrder=DESC', label: 'Нав', icon: 'new-arrival' },
  { href: '/sell', label: 'Фурӯш', icon: 'store' },
];
