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
    <section className="app-container py-2 lg:py-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-2.5 px-3 py-3 rounded-2xl bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark shadow-[0_2px_8px_rgba(0,26,52,0.04)]"
          >
            <div className="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
              <AppIcon name={item.icon} size="sm" variant="primary" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-text leading-tight">{item.title}</p>
              <p className="text-[10px] text-text-muted leading-tight">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
