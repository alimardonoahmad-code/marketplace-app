'use client';

import clsx from 'clsx';

interface StoreMiniMapProps {
  lat: number;
  lng: number;
  label?: string;
  className?: string;
  height?: number;
  zoom?: number;
}

export default function StoreMiniMap({
  lat,
  lng,
  label = 'Мағоза',
  className,
  height = 100,
  zoom = 15,
}: StoreMiniMapProps) {
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      className={clsx('relative overflow-hidden rounded-lg border border-border/60 bg-[#F2F5F8]', className)}
      style={{ height }}
    >
      <iframe
        title={label}
        src={src}
        className="absolute inset-0 h-full w-full border-0 pointer-events-none"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`${label} дар харита`}
      />
    </div>
  );
}
