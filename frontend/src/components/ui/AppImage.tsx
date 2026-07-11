'use client';

import { useState, memo } from 'react';
import Image from 'next/image';

interface AppImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function isOptimizableUrl(url: string): boolean {
  if (!url || url === '/placeholder.svg') return true;
  if (url.startsWith('/')) return true;
  if (url.includes('images.unsplash.com')) return true;
  return false;
}

function AppImage({ src, alt, fill, className, sizes, priority }: AppImageProps) {
  const [imgSrc, setImgSrc] = useState(src || '/placeholder.svg');
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setImgSrc('/placeholder.svg');
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes ?? '(max-width: 768px) 50vw, 16vw'}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      unoptimized={!isOptimizableUrl(imgSrc)}
      onError={handleError}
    />
  );
}

export default memo(AppImage);
