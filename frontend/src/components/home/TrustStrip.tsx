'use client';

import { AppIcon } from '@/components/icons';

const ITEMS = [
  { icon: 'truck' as const, title: 'Доставка ройгон', sub: 'Душанбе' },
  { icon: 'shield' as const, title: 'Пардохт бехатар', sub: 'Корт · Alif · нақд' },
  { icon: 'verified-seller' as const, title: '1000+ маҳсулот', sub: 'Тасдиқшуда' },
  { icon: 'flash-sale' as const, title: 'Тахфифҳо', sub: 'То 50%' },
];

export default function TrustStrip() {
  return (
    <section className="app-container py-2">
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2 shrink-0 px-3 py-2 rounded-xl bg-white dark:bg-surface-dark-secondary border border-border/40 shadow-soft"
          >
            <AppIcon name={item.icon} size="sm" variant="primary" aria-hidden />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-text leading-tight whitespace-nowrap">{item.title}</p>
              <p className="text-[9px] text-text-muted leading-tight whitespace-nowrap">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
