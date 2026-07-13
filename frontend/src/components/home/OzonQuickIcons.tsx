'use client';

import Link from 'next/link';
import {
  LayoutGrid, Percent, Truck, Store, Tag,
} from 'lucide-react';

const ITEMS = [
  { href: '/categories', label: 'Каталог', icon: LayoutGrid },
  { href: '/products?hasDiscount=true', label: 'Тахфифҳо', icon: Percent },
  { href: '/products', label: 'Доставка', icon: Truck },
  { href: '/stores', label: 'Мағозаҳо', icon: Store },
  { href: '/sell', label: 'Фурӯш', icon: Tag },
];

export default function OzonQuickIcons() {
  return (
    <section className="app-container relative z-10 -mt-2 pb-2 lg:mt-0 lg:pb-3">
      <div className="rounded-2xl bg-white border border-[#E8ECF2] shadow-[0_2px_10px_rgba(0,26,52,0.05)] overflow-hidden">
        <div className="grid grid-cols-5">
          {ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center justify-center gap-1.5 py-3 px-1 min-h-[4.25rem] hover:bg-[#F8FAFC] active:bg-[#F3F6F9] transition-colors border-r border-[#F0F2F5] last:border-r-0"
            >
              <Icon
                className="h-[1.15rem] w-[1.15rem] text-[#8B95A5] group-hover:text-[#005BFF] transition-colors"
                strokeWidth={1.75}
              />
              <span className="text-[9px] sm:text-[10px] font-semibold text-[#4B5563] text-center leading-tight line-clamp-2 px-0.5">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
