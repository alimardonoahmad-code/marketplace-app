'use client';

import { useMemo } from 'react';
import clsx from 'clsx';
import { MapPin, Navigation, Maximize2, Minimize2 } from 'lucide-react';

export interface StoreMiniMapProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
  height?: number;
  zoom?: number;
  /** card = list thumbnail, hero = full store header, floating = corner mini map */
  mode?: 'card' | 'hero' | 'floating';
  onMinimize?: () => void;
  onExpand?: () => void;
}

function staticMapUrl(lat: number, lng: number, width: number, height: number, zoom = 15) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},red`;
}

function navigationUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function mapsSearchUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export default function StoreMiniMap({
  lat,
  lng,
  label = 'Мағоза',
  className,
  height = 100,
  zoom = 15,
  mode = 'card',
  onMinimize,
  onExpand,
}: StoreMiniMapProps) {
  const mapSize = useMemo(() => {
    if (mode === 'floating') return { w: 160, h: 112 };
    if (mode === 'hero') return { w: 640, h: Math.max(height, 200) };
    return { w: 400, h: height };
  }, [mode, height]);

  const mapSrc = staticMapUrl(lat, lng, mapSize.w, mapSize.h, zoom);
  const navHref = navigationUrl(lat, lng);
  const openHref = mapsSearchUrl(lat, lng);

  if (mode === 'floating') {
    return (
      <div
        className={clsx(
          'fixed z-[90] right-3 rounded-2xl overflow-hidden border border-[#E8ECF2] bg-white shadow-[0_8px_32px_rgba(0,26,52,0.18)]',
          'bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:bottom-4',
          className,
        )}
        style={{ width: mapSize.w }}
      >
        <div className="relative" style={{ height: mapSize.h }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mapSrc}
            alt={label}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <button
            type="button"
            onClick={onExpand}
            className="absolute top-1.5 left-1.5 h-7 w-7 rounded-lg bg-white/95 flex items-center justify-center text-text shadow-sm"
            aria-label="Харитаро калон кардан"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={navHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 left-2 right-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-[11px] font-bold text-white"
          >
            <Navigation className="h-3.5 w-3.5" />
            Масир
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-[#E8EDF2]',
        mode === 'hero'
          ? 'rounded-2xl border border-[#E8ECF2] shadow-[0_2px_12px_rgba(0,26,52,0.08)]'
          : 'rounded-lg border border-border/60',
        className,
      )}
      style={{ height: mode === 'hero' ? Math.max(height, 200) : height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapSrc}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {mode === 'hero' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-3 right-3 flex gap-2">
            {onMinimize && (
              <button
                type="button"
                onClick={onMinimize}
                className="h-9 w-9 rounded-xl bg-white/95 flex items-center justify-center text-text shadow-sm"
                aria-label="Харитаро хурд кардан"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex gap-2">
            <a
              href={navHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md"
            >
              <Navigation className="h-4 w-4" />
              Масир гирифтан
            </a>
            <a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-bold text-text shadow-sm"
            >
              <MapPin className="h-4 w-4 text-primary" />
              Харита
            </a>
          </div>
        </>
      )}

      {mode === 'card' && (
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`${label} дар харита`}
        />
      )}
    </div>
  );
}
