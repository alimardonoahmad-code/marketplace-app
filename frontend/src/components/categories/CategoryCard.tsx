'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { Category } from '@/types';
import { CategoryMeta } from '@/lib/category-meta';

interface CategoryCardProps {
  category: Category;
  meta: CategoryMeta;
  productCount?: number;
  variant?: 'featured' | 'default';
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}

function CategoryThumb({
  meta,
  size = 'md',
  className,
}: {
  meta: CategoryMeta;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const Icon = meta.icon;
  const [imgError, setImgError] = useState(false);
  const px = size === 'md' ? 64 : 48;

  if (imgError) {
    return (
      <div
        className={clsx(
          'bg-primary/10 flex items-center justify-center shrink-0 rounded-xl',
          size === 'md' ? 'h-16 w-16' : 'h-12 w-12',
          className,
        )}
      >
        <Icon className={clsx(size === 'md' ? 'h-7 w-7' : 'h-5 w-5', 'text-primary')} strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'relative overflow-hidden shrink-0 bg-[#F2F5F8] rounded-xl',
        size === 'md' ? 'h-16 w-16' : 'h-12 w-12',
        className,
      )}
    >
      <Image
        src={meta.coverImage}
        alt={meta.nameTj}
        fill
        className="object-cover"
        sizes={`${px}px`}
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export default function CategoryCard({
  category, meta, productCount = 0, variant = 'default', index = 0, className, style,
}: CategoryCardProps) {
  const Icon = meta.icon;
  const [bannerError, setBannerError] = useState(false);

  if (variant === 'featured') {
    return (
      <Link
        href={`/products?category=${category.slug}`}
        className={clsx(
          'group card overflow-hidden card-hover transition-all duration-300 hover:-translate-y-0.5',
          className,
        )}
        style={{ animationDelay: `${index * 0.06}s`, ...style }}
      >
        <div className="flex min-h-[120px] sm:min-h-[132px]">
          <div className="relative w-[84px] sm:w-[96px] shrink-0 self-stretch bg-[#F2F5F8]">
            {!bannerError ? (
              <Image
                src={meta.coverImage}
                alt={meta.nameTj}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="96px"
                onError={() => setBannerError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.75} />
              </div>
            )}
          </div>

          <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-black text-text leading-tight group-hover:text-primary transition-colors">
                  {meta.nameTj}
                </h3>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{meta.descTj}</p>
              </div>
              {productCount > 0 && (
                <span className="badge bg-primary/10 text-primary text-[10px] shrink-0">
                  {productCount}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2 group-hover:gap-2 transition-all">
              Харид кунед <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className={clsx(
        'group card overflow-hidden card-hover transition-all duration-300 hover:-translate-y-0.5',
        className,
      )}
      style={{ animationDelay: `${index * 0.05}s`, ...style }}
    >
      <div className="p-3 flex items-center gap-3">
        <CategoryThumb meta={meta} size="sm" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-text group-hover:text-primary transition-colors">
            {meta.nameTj}
          </h3>
          <p className="text-2xs text-text-muted mt-0.5 line-clamp-1">{meta.descTj}</p>
          {productCount > 0 && (
            <span className="text-[10px] font-semibold text-primary mt-0.5 inline-block">
              {productCount} маҳсулот
            </span>
          )}
        </div>
        <ChevronRight className="h-4 w-4 text-text-muted shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
