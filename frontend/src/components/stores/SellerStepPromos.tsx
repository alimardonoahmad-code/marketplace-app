'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SELLER_STEP_PROMOS } from '@/lib/store-meta';
import { formatPrice } from '@/lib/api';

export default function SellerStepPromos() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SELLER_STEP_PROMOS.map((item) => (
        <Link
          key={item.step}
          href={item.href}
          className="group card overflow-hidden card-hover transition-all hover:-translate-y-0.5"
        >
          <div className="relative h-16 sm:h-[4.5rem] bg-[#F2F5F8]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 33vw, 120px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute top-1 right-1 text-[9px] font-black text-white/70">{item.step}</span>
          </div>
          <div className="p-2">
            <h3 className="text-[10px] sm:text-2xs font-bold text-text leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-[9px] text-text-muted mt-0.5 line-clamp-1">{item.sub}</p>
            {'samplePrice' in item && item.samplePrice && (
              <p className="text-[9px] font-bold text-primary mt-0.5">{formatPrice(item.samplePrice)}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
