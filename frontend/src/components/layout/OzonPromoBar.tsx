'use client';

const MESSAGES = [
  '🚚 Доставкаи ройгон ба Душанбе',
  '💳 Пардохт бо Alif, корт ва нақд',
  '⭐ 1000+ маҳсулот — бехтарин нарх',
];

export default function OzonPromoBar() {
  return (
    <div className="ozon-promo-bar hidden sm:block">
      <div className="app-container">
        <div className="flex items-center justify-center gap-6 py-1.5 text-[11px] font-semibold text-white/95 overflow-hidden">
          {MESSAGES.map((msg) => (
            <span key={msg} className="shrink-0 whitespace-nowrap">
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
