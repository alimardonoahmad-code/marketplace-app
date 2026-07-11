'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { getCategoryMeta } from '@/lib/category-meta';
import { Category } from '@/types';

interface CategoryChipProps {
  cat: Category;
  theme?: 'light' | 'dark';
}

export default function CategoryChip({ cat, theme = 'light' }: CategoryChipProps) {
  const meta = getCategoryMeta(cat.slug, cat.name);
  const Icon = meta.icon;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="group flex flex-col items-center gap-1.5 shrink-0 w-[4.5rem] sm:w-20"
    >
      <div className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] rounded-2xl overflow-hidden border border-border/80 bg-white shadow-soft transition-all group-hover:border-primary/50 group-hover:shadow-card">
        {!imgError ? (
          <>
            <Image
              src={meta.coverImage}
              alt={meta.nameTj}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="72px"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          </>
        ) : (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
            <Icon className="h-7 w-7 text-primary" strokeWidth={1.75} />
          </div>
        )}
      </div>
      <span
        className={clsx(
          'text-2xs font-medium text-center w-full line-clamp-2 transition-colors',
          theme === 'dark'
            ? 'text-white/90 group-hover:text-white'
            : 'text-text-secondary group-hover:text-primary',
        )}
      >
        {meta.nameTj}
      </span>
    </Link>
  );
}

export function CategoryChipRow({
  categories,
  theme = 'light',
  className,
}: {
  categories: Category[];
  theme?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={clsx('flex gap-3 overflow-x-auto hide-scrollbar py-1', className)}>
      {categories.map((cat) => (
        <CategoryChip key={cat.id} cat={cat} theme={theme} />
      ))}
    </div>
  );
}
