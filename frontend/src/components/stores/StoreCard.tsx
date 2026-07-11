'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin, Package, Phone, Clock, BadgeCheck } from 'lucide-react';
import { Store } from '@/types';
import { getStoreCoords, getStoreLocation, getStoreName } from '@/lib/store-utils';
import { getStorePromoMeta } from '@/lib/store-meta';
import { formatPrice } from '@/lib/api';
import StoreMiniMap from '@/components/stores/StoreMiniMap';

interface StoreCardProps {
  store: Store;
  index?: number;
  variant?: 'default' | 'compact';
  style?: React.CSSProperties;
}

export default function StoreCard({
  store, index = 0, variant = 'default', style,
}: StoreCardProps) {
  const name = getStoreName(store);
  const location = getStoreLocation(store);
  const coords = getStoreCoords(store);
  const promo = getStorePromoMeta(store);
  const count = store.productCount ?? 0;
  const [imgError, setImgError] = useState(false);

  if (variant === 'compact') {
    return (
      <Link
        href={`/stores/${store.id}`}
        className="card p-2.5 flex items-center gap-2.5 card-hover group"
        style={style}
      >
        <div className="relative h-11 w-11 rounded-lg overflow-hidden shrink-0 bg-[#F2F5F8]">
          {!imgError ? (
            <Image src={promo.coverImage} alt={name} fill className="object-cover" sizes="44px" onError={() => setImgError(true)} />
          ) : (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary font-bold">{name.charAt(0)}</div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xs truncate group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-[10px] text-primary font-semibold">{formatPrice(promo.samplePrice)}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      href={`/stores/${store.id}`}
      className="group card overflow-hidden card-hover transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
      style={{ animationDelay: `${index * 0.04}s`, ...style }}
    >
      {coords && (
        <StoreMiniMap lat={coords.lat} lng={coords.lng} label={name} height={88} className="rounded-none border-0 border-b border-border/60" />
      )}

      <div className="flex min-h-[88px] flex-1">
        <div className="relative w-[72px] sm:w-20 shrink-0 self-stretch bg-[#F2F5F8]">
          {!imgError ? (
            <Image
              src={promo.coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="80px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 p-2.5 sm:p-3 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-text truncate group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-600 mt-0.5">
                  <BadgeCheck className="h-3 w-3" /> Верификатсияшуда
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-text-muted shrink-0 group-hover:text-primary transition-all" />
            </div>
            {location && (
              <p className="flex items-center gap-0.5 text-[10px] text-text-muted mt-1 truncate">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                {location}
              </p>
            )}
            {store.storeDescription && (
              <p className="text-[10px] text-text-secondary mt-1 line-clamp-2">{store.storeDescription}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[9px] text-text-muted">
            {store.phone && (
              <span className="inline-flex items-center gap-0.5">
                <Phone className="h-3 w-3 text-primary" />
                {store.phone}
              </span>
            )}
            <span className="inline-flex items-center gap-0.5">
              <Clock className="h-3 w-3 text-primary" />
              09:00 – 21:00
            </span>
            <span className="inline-flex items-center gap-0.5 font-semibold text-primary ml-auto">
              <Package className="h-3 w-3" />
              {count} маҳсулот
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
