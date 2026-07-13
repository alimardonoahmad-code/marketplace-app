'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

interface OzonProductFeedProps {
  onAddToCart?: (product: Product) => void;
}

export default function OzonProductFeed({ onAddToCart }: OzonProductFeedProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=24&sortBy=createdAt&sortOrder=DESC')
      .then((res) => setProducts(res.data.data?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="app-container pb-4">
        <ProductGridSkeleton count={8} />
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="app-container pb-4">
      <div className="ozon-product-grid">
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            index={i}
            variant="ozon"
            onAddToCart={onAddToCart}
            animate={i < 8}
          />
        ))}
      </div>
    </section>
  );
}
