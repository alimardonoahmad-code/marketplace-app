'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { HOME_BANNERS } from '@/lib/home-banners';

const AUTO_MS = 8000;

export default function HomeHero() {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [slideKey, setSlideKey] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const banner = HOME_BANNERS[bannerIdx];

  const goTo = useCallback((idx: number) => {
    setBannerIdx(idx);
    setSlideKey((k) => k + 1);
    setProgressKey((k) => k + 1);
  }, []);

  const prev = () => goTo((bannerIdx - 1 + HOME_BANNERS.length) % HOME_BANNERS.length);
  const next = () => goTo((bannerIdx + 1) % HOME_BANNERS.length);

  useEffect(() => {
    const t = setInterval(() => {
      setBannerIdx((i) => (i + 1) % HOME_BANNERS.length);
      setSlideKey((k) => k + 1);
      setProgressKey((k) => k + 1);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const n = HOME_BANNERS[(bannerIdx + 1) % HOME_BANNERS.length];
    const img = new window.Image();
    img.src = n.image;
  }, [bannerIdx]);

  return (
    <section className="app-container pt-2 pb-1 lg:pt-4">
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-[#001A34] shadow-[0_4px_16px_rgba(0,91,255,0.12)]">
        <Link
          href={banner.href}
          className="block relative min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] overflow-hidden"
        >
          {/* Background image with Ken Burns */}
          <div key={`img-${slideKey}`} className="absolute inset-0 overflow-hidden">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover animate-hero-ken-burns motion-reduce:animate-none motion-reduce:scale-105"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={bannerIdx === 0}
            />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#001A34]/90 via-[#001A34]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Shine sweep */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden"
          >
            <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-hero-shine" />
          </div>

          {/* Floating accent orbs */}
          <div aria-hidden className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl animate-pulse-soft motion-reduce:hidden" />
          <div aria-hidden className="pointer-events-none absolute bottom-4 right-1/4 h-16 w-16 rounded-full bg-accent/15 blur-xl animate-pulse-soft motion-reduce:hidden" style={{ animationDelay: '1s' }} />

          {/* Text content — re-animates on each slide */}
          <div
            key={`content-${slideKey}`}
            className="relative z-10 flex items-center h-full min-h-[inherit] px-5 sm:px-10 lg:px-14 py-7 sm:py-8"
          >
            <div className="max-w-md sm:max-w-lg">
              <span className="inline-block opacity-0 animate-hero-badge-in motion-reduce:opacity-100 motion-reduce:animate-none mb-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[10px] font-bold text-white tracking-wider uppercase">
                Market
              </span>
              <h2 className="opacity-0 animate-hero-title-in motion-reduce:opacity-100 motion-reduce:animate-none text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {banner.title}
              </h2>
              <p className="opacity-0 animate-hero-sub-in motion-reduce:opacity-100 motion-reduce:animate-none text-white/90 text-sm sm:text-base mt-2 font-medium drop-shadow-sm max-w-sm">
                {banner.sub}
              </p>
              <span className="opacity-0 animate-hero-cta-in motion-reduce:opacity-100 motion-reduce:animate-none inline-flex items-center gap-1.5 mt-4 rounded-xl bg-white/95 px-4 py-2 text-sm font-bold text-primary shadow-lg hover:bg-white transition-colors">
                Муфассал
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Nav arrows — desktop/tablet */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); prev(); }}
          aria-label="Пештар"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 shadow-lg hidden sm:flex items-center justify-center text-text hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); next(); }}
          aria-label="Бадтар"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/95 shadow-lg hidden sm:flex items-center justify-center text-text hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots + progress bar */}
        <div className="absolute bottom-0 inset-x-0 z-20">
          <div
            key={`progress-${progressKey}`}
            className="h-0.5 origin-left bg-white/90 animate-hero-progress motion-reduce:hidden"
            style={{ animationDuration: `${AUTO_MS}ms` }}
          />
          <div className="flex justify-center gap-1.5 py-2.5">
            {HOME_BANNERS.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Слайд ${i + 1}`}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === bannerIdx ? 'w-7 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
