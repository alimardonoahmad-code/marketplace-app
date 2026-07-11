'use client';

import { formatPrice } from '@/lib/api';
import clsx from 'clsx';

interface PriceDisplayProps {
  price: number;
  discountPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({ price, discountPrice, size = 'md', className }: PriceDisplayProps) {
  const hasDiscount = discountPrice && discountPrice < price;
  const displayPrice = hasDiscount ? discountPrice : price;

  const sizeClasses = {
    sm: { main: 'text-sm', old: 'text-2xs' },
    md: { main: 'text-lg', old: 'text-xs' },
    lg: { main: 'text-2xl', old: 'text-sm' },
  };

  return (
    <div className={clsx('flex flex-col gap-0.5', className)}>
      <span className={clsx(
        'font-bold tracking-tight',
        sizeClasses[size].main,
        hasDiscount ? 'price-discount' : 'text-text dark:text-gray-100',
      )}>
        {formatPrice(displayPrice!)}
      </span>
      {hasDiscount && (
        <span className={clsx('price-old', sizeClasses[size].old)}>
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}
