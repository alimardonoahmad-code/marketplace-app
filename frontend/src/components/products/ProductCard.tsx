'use client';

import { memo } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { AppIcon } from '@/components/icons';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types';
import { getImageUrl, getDiscountPercent } from '@/lib/api';
import { getStoreLocation, getStoreName } from '@/lib/store-utils';
import clsx from 'clsx';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  variant?: 'default' | 'compact' | 'featured' | 'ozon';
  index?: number;
  showDescription?: boolean;
  animate?: boolean;
}

function ProductCard({
  product, onAddToCart, onBuyNow, variant = 'default', index = 0, showDescription = false, animate = true,
}: ProductCardProps) {
  const { isWishlisted, toggle } = useWishlist();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const inStock = product.stock > 0;
  const storeName = getStoreName(product.seller);
  const storeLocation = getStoreLocation(product.seller);

  if (variant === 'ozon') {
    return (
      <div className={clsx(
        'ozon-card group',
        animate && 'opacity-0 animate-fade-up',
        animate && `stagger-${Math.min(index + 1, 6)}`,
      )}>
        <Link href={`/products/${product.id}`} className="block relative">
          <div className="relative aspect-square bg-[#F2F5F8] dark:bg-surface-dark p-3">
            <AppImage
              src={getImageUrl(product.images?.[0])}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 16vw"
            />
            {hasDiscount && (
              <span className="absolute top-2 left-2 badge bg-accent text-white text-[10px] font-bold">
                -{getDiscountPercent(product.price, product.discountPrice!)}%
              </span>
            )}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.id); }}
              className={clsx(
                'absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-soft transition-colors',
                isWishlisted(product.id) ? 'text-accent' : 'text-text-muted hover:text-accent',
              )}
              aria-label="Дӯстдошта"
            >
              <AppIcon
                name="favorite"
                size="sm"
                variant="inherit"
                filled={isWishlisted(product.id)}
                className={isWishlisted(product.id) ? 'text-accent fill-accent' : undefined}
                aria-hidden
              />
            </button>
            {!inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                <span className="text-xs font-semibold text-text-secondary">Тамом шуд</span>
              </div>
            )}
          </div>
        </Link>
        <div className="p-2.5 pt-2">
          <div className="flex items-center gap-0.5 mb-1">
            <AppIcon name="star" size="sm" variant="warning" className="fill-amber-400 text-amber-400" aria-hidden />
            <span className="text-[11px] font-semibold text-text">{product.rating}</span>
            <span className="text-[10px] text-text-muted">({product.reviewCount})</span>
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xs sm:text-sm text-text line-clamp-2 leading-snug font-normal group-hover:text-primary transition-colors dark:text-gray-200">
              {product.name}
            </h3>
          </Link>
          <div className="mt-1.5 flex items-end justify-between gap-1">
            <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" />
            {onAddToCart && inStock && (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors shrink-0"
                aria-label="Ба сабад"
              >
                <AppIcon name="cart" size="sm" variant="inherit" className="text-white" animation="cart" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/products/${product.id}`}
        className={clsx('block card-hover overflow-hidden opacity-0 animate-fade-up', `stagger-${Math.min(index + 1, 6)}`)}
      >
        <div className="relative aspect-[4/3] lg:aspect-[3/2] overflow-hidden bg-surface-secondary">
          <AppImage src={getImageUrl(product.images?.[0])} alt={product.name} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="220px" />
          {hasDiscount && (
            <span className="absolute top-2 left-2 badge bg-accent text-white shadow-soft flex items-center gap-1 text-[10px]">
              -{getDiscountPercent(product.price, product.discountPrice!)}%
            </span>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 pt-6">
            {storeName && (
              <p className="text-[10px] text-white/80 truncate flex items-center gap-0.5">
                <AppIcon name="store" size="sm" variant="inherit" className="text-white/80" aria-hidden />
                {storeName}
              </p>
            )}
            <p className="text-white font-semibold text-xs line-clamp-2 mt-0.5">{product.name}</p>
            <div className="flex items-center justify-between mt-1">
              <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" className="[&_span]:text-white [&_.price-old]:text-white/60" />
              <div className="flex items-center gap-0.5 text-amber-300">
                <AppIcon name="star" size="sm" variant="inherit" className="text-amber-300 fill-amber-300" aria-hidden />
                <span className="text-[10px] font-semibold">{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/products/${product.id}`} className="flex gap-2.5 card p-2.5 card-hover">
        <div className="relative h-16 w-16 lg:h-14 lg:w-14 shrink-0 rounded-lg overflow-hidden bg-surface-secondary">
          <AppImage src={getImageUrl(product.images?.[0])} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xs lg:text-sm text-text line-clamp-2 dark:text-gray-100">{product.name}</h3>
          {storeName && product.seller && (
            <span className="text-[10px] text-primary font-medium truncate block mt-0.5">
              {storeName}
            </span>
          )}
          {storeLocation && (
            <p className="text-[10px] text-text-muted truncate flex items-center gap-0.5 mt-0.5">
              <AppIcon name="location" size="sm" aria-hidden />
              {storeLocation}
            </p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <AppIcon name="star" size="sm" variant="warning" className="fill-amber-400 text-amber-400" aria-hidden />
            <span className="text-[10px] text-text-secondary">{product.rating} ({product.reviewCount})</span>
          </div>
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" className="mt-0.5" />
        </div>
      </Link>
    );
  }

  return (
    <div className={clsx('card-hover overflow-hidden opacity-0 animate-fade-up group', `stagger-${Math.min(index + 1, 6)}`)}>
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden bg-surface-secondary">
          <AppImage
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 16vw"
          />
          {hasDiscount && (
            <span className="absolute top-1.5 left-1.5 badge bg-accent text-white text-[10px] py-0">
              -{getDiscountPercent(product.price, product.discountPrice!)}%
            </span>
          )}
          {product.category && (
            <span className="absolute top-1.5 right-1.5 badge bg-black/50 text-white text-[9px] py-0 backdrop-blur-sm hidden lg:inline-flex">
              {product.category.name}
            </span>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span className="badge bg-white text-text text-[10px]">Тамом шуд</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-2 lg:p-2.5">
        {product.seller && (
          <Link
            href={`/stores/${product.seller.id}`}
            className="flex items-center gap-1 text-[10px] lg:text-2xs text-primary font-semibold truncate hover:underline"
          >
            <AppIcon name="store" size="sm" variant="primary" aria-hidden />
            <span className="truncate">{storeName}</span>
          </Link>
        )}
        {storeLocation && (
          <p className="flex items-center gap-0.5 text-[10px] text-text-muted truncate mt-0.5">
            <AppIcon name="location" size="sm" aria-hidden />
            <span className="truncate">{storeLocation}</span>
          </p>
        )}

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-xs lg:text-sm text-text line-clamp-2 leading-snug mt-1 group-hover:text-primary transition-colors dark:text-gray-100">
            {product.name}
          </h3>
        </Link>

        {showDescription && product.description && (
          <p className="text-[10px] text-text-muted line-clamp-2 mt-1 hidden lg:block">{product.description}</p>
        )}

        <div className="flex items-center gap-1 mt-1">
          <AppIcon name="star" size="sm" variant="warning" className="fill-amber-400 text-amber-400" aria-hidden />
          <span className="text-[10px] font-semibold text-text">{product.rating}</span>
          <span className="text-[10px] text-text-muted">({product.reviewCount})</span>
          <span className="text-[10px] text-text-muted ml-auto">{inStock ? `${product.stock} дона` : 'Нест'}</span>
        </div>

        <div className="flex items-end justify-between mt-1.5 gap-1.5">
          <PriceDisplay price={product.price} discountPrice={product.discountPrice} size="sm" />
          {onAddToCart && inStock && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
              className="icon-btn h-8 w-8 bg-primary text-white shadow-soft hover:scale-105 active:scale-95"
              aria-label="Ба сабад илова кардан"
            >
              <AppIcon name="cart" size="default" variant="inherit" className="text-white" animation="cart" aria-hidden />
            </button>
          )}
        </div>

        {onBuyNow && inStock && (
          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="btn-primary w-full mt-1.5 text-[10px] h-8 rounded-lg lg:hidden"
          >
            Харидан
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(ProductCard);
