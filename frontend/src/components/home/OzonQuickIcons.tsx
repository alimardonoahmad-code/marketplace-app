'use client';

import Link from 'next/link';
import {
  LayoutGrid, Percent, Truck, Store, Tag,
} from 'lucide-react';
import clsx from 'clsx';

const ITEMS = [
  {
    href: '/categories',
    label: 'Каталог',
    icon: LayoutGrid,
    bg: 'bg-[#EEF3FF]',
    color: 'text-[#005BFF]',
  },
  {
    href: '/products?hasDiscount=true',
    label: 'Тахфифҳо',
    icon: Percent,
    bg: 'bg-[#FFF0F5]',
    color: 'text-[#F91155]',
  },
  {
    href: '/products',
    label: 'Доставка',
    icon: Truck,
    bg: 'bg-[#F0F7FF]',
    color: 'text-[#0077CC]',
  },
  {
    href: '/stores',
    label: 'Мағозаҳо',
    icon: Store,
    bg: 'bg-[#F5F0FF]',
    color: 'text-[#6B4FBB]',
  },
  {
    href: '/sell',
    label: 'Фурӯш',
    icon: Tag,
    bg: 'bg-[#FFF8ED]',
    color: 'text-[#D97706]',
  },
];

export default function OzonQuickIcons() {
  return (
    <section className="app-container py-2.5">
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-0.5">
        {ITEMS.map(({ href, label, icon: Icon, bg, color }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1.5 shrink-0 w-[4.25rem] group"
          >
            <span
              className={clsx(
                'h-11 w-11 rounded-full flex items-center justify-center border border-white shadow-[0_1px_4px_rgba(0,26,52,0.06)] transition-transform group-active:scale-95',
                bg,
              )}
            >
              <Icon className={clsx('h-[1.35rem] w-[1.35rem]', color)} strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-medium text-[#4B5563] text-center leading-tight line-clamp-2">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
