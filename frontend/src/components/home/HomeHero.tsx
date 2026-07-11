'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { HOME_BANNERS } from '@/lib/home-banners';

export default function HomeHero() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const banner = HOME_BANNERS[bannerIdx];
  const prev = () => setBannerIdx((i) => (i - 1 + HOME_BANNERS.length) % HOME_BANNERS.length);
  const next = () => setBannerIdx((i) => (i + 1) % HOME_BANNERS.length);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % HOME_BANNERS.length), 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const n = HOME_BANNERS[(bannerIdx + 1) % HOME_BANNERS.length];
    const img = new window.Image();
    img.src = n.image;
  }, [bannerIdx]);

  return (
    <section className="app-container pt-3 lg:pt-4">
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-surface-secondary">
        <Link
          href={banner.href}
          className="block relative min-h-[140px] sm:min-h-[180px] lg:min-h-[220px]"
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority={bannerIdx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="relative z-10 flex items-center h-full min-h-[inherit] px-6 sm:px-10 lg:px-14 py-8">
            <div className="max-w-md sm:max-w-lg">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
                {banner.title}
              </h2>
              <p className="text-white/95 text-sm sm:text-base mt-2 font-medium drop-shadow-sm">
                {banner.sub}
              </p>
            </div>
          </div>
        </Link>

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); prev(); }}
          aria-label="Пештар"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 shadow-card flex items-center justify-center text-text hover:bg-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); next(); }}
          aria-label="Бадтар"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 shadow-card flex items-center justify-center text-text hover:bg-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {HOME_BANNERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setBannerIdx(i)}
              aria-label={`Слайд ${i + 1}`}
              className={clsx(
                'h-1.5 rounded-full transition-all',
                i === bannerIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/50',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
