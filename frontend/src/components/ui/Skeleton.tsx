import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'shimmer-bg',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded-lg h-4',
        variant === 'rectangular' && 'rounded-card',
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3.5 space-y-2.5">
        <Skeleton variant="text" className="w-full h-3.5" />
        <Skeleton variant="text" className="w-2/3 h-3.5" />
        <Skeleton variant="text" className="w-1/2 h-5 mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
