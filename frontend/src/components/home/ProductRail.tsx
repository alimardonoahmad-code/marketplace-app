'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import SectionHeader from '@/components/home/SectionHeader';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

interface ProductRailProps {
  title: string;
  subtitle?: string;
  href: string;
  icon?: 'star' | 'flash-sale' | 'new-arrival' | 'trending';
  fetchUrl: string;
  onAddToCart?: (product: Product) => void;
  limit?: number;
}

export default function ProductRail({
  title, subtitle, href, icon, fetchUrl, onAddToCart, limit = 12,
}: ProductRailProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(fetchUrl)
      .then((res) => {
        const data = res.data.data;
        const items = Array.isArray(data) ? data : data?.items;
        setProducts(Array.isArray(items) ? items.slice(0, limit) : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [fetchUrl]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="app-container py-4">
      <SectionHeader title={title} subtitle={subtitle} href={href} icon={icon} />
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="ozon-product-grid">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              variant="ozon"
              onAddToCart={onAddToCart}
              animate={i < 6}
            />
          ))}
        </div>
      )}
    </section>
  );
}
