'use client';

import Link from 'next/link';
import { LayoutGrid, Percent, Truck, Store, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const ITEMS = [
  { href: '/categories', label: 'Каталог', icon: LayoutGrid, bg: 'bg-primary' },
  { href: '/products?hasDiscount=true', label: 'Тахфифҳо', icon: Percent, bg: 'bg-accent' },
  { href: '/products', label: 'Доставка', icon: Truck, bg: 'bg-[#00A8FF]' },
  { href: '/stores', label: 'Мағозаҳо', icon: Store, bg: 'bg-[#7B61FF]' },
  { href: '/sell', label: 'Фурӯш', icon: Sparkles, bg: 'bg-warning' },
];

export default function OzonQuickIcons() {
  return (
    <section className="app-container py-3">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {ITEMS.map(({ href, label, icon: Icon, bg }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 shrink-0 w-[4.5rem]"
          >
            <span className={clsx('h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-sm', bg)}>
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-[10px] font-semibold text-text text-center leading-tight line-clamp-2">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
