'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  href?: string | null;
  priority?: boolean;
}

const SIZES = {
  sm: { box: 'h-9 w-9', img: 36 },
  md: { box: 'h-11 w-11', img: 44 },
  lg: { box: 'h-16 w-16', img: 64 },
  hero: { box: 'h-24 w-24 sm:h-28 sm:w-28', img: 112 },
};

export default function BrandLogo({
  className,
  size = 'md',
  href = '/',
  priority = false,
}: BrandLogoProps) {
  const s = SIZES[size];
  const content = (
    <span
      className={clsx(
        'relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,26,52,0.08)] border border-white/80 shrink-0',
        s.box,
        className,
      )}
    >
      <Image
        src="/brand/market-logo.png"
        alt="Marketplace"
        width={s.img}
        height={s.img}
        className="object-contain p-1"
        priority={priority}
      />
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex shrink-0 group" aria-label="Marketplace">
      {content}
    </Link>
  );
}
