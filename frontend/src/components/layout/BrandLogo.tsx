'use client';

import Link from 'next/link';
import clsx from 'clsx';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  href?: string | null;
}

const SIZES = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
  hero: 'h-36 w-36 sm:h-44 sm:w-44 lg:h-52 lg:w-52',
};

export default function BrandLogo({
  className,
  size = 'md',
  href = '/',
}: BrandLogoProps) {
  const content = (
    <span
      className={clsx(
        'relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,26,52,0.12)] border border-white shrink-0',
        SIZES[size],
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/market-logo.png"
        alt="Marketplace"
        className="h-full w-full object-contain p-2 sm:p-3"
        decoding="async"
      />
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="Marketplace">
      {content}
    </Link>
  );
}
