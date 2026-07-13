'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Category } from '@/types';
import HomeHero from '@/components/home/HomeHero';
import TrustStrip from '@/components/home/TrustStrip';
import ProductRail from '@/components/home/ProductRail';
import { CategoryChipRow } from '@/components/categories/CategoryChip';
import Footer from '@/components/layout/Footer';
import { getLoginUrl } from '@/lib/auth-utils';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store/auth';
import { Product } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setItemCount = useCartStore((s) => s.setItemCount);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => {});
  }, []);

  const handleAddToCart = useCallback(async (product: Product) => {
    if (!user) {
      toast.error('Барои харид ворид шавед');
      router.push(getLoginUrl('/cart'));
      return;
    }
    try {
      const res = await api.post('/cart', { productId: product.id, quantity: 1 });
      setItemCount(res.data.data.itemCount);
      toast.success('Ба сабад илова шуд!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Хатогӣ');
    }
  }, [user, router, setItemCount]);

  return (
    <div className="pb-4 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      <HomeHero />

      <TrustStrip />

      {categories.length > 0 && (
        <section className="app-container pt-4 pb-2">
          <CategoryChipRow categories={categories} />
        </section>
      )}

      <ProductRail
        title="Тахфифҳои интихобшуда"
        subtitle="Маҳсулоти махсус бо нархи хуб"
        href="/products?hasDiscount=true"
        icon="flash-sale"
        fetchUrl="/products?hasDiscount=true&limit=8&sortBy=rating&sortOrder=DESC"
        limit={6}
        onAddToCart={handleAddToCart}
      />

      <ProductRail
        title="Барои шумо"
        subtitle="Маҳсулоти беҳтарин аз рейтинг"
        href="/products?sortBy=rating&sortOrder=DESC"
        icon="star"
        fetchUrl="/products/recommended"
        onAddToCart={handleAddToCart}
      />

      <ProductRail
        title="Навтарин"
        subtitle="Маҳсулоти нав ба маркетплейс"
        href="/products?sortBy=createdAt&sortOrder=DESC"
        icon="new-arrival"
        fetchUrl="/products?limit=12&sortBy=createdAt&sortOrder=DESC"
        onAddToCart={handleAddToCart}
      />

      <section className="app-container py-6">
        <div className="text-center">
          <Link href="/products" className="btn-outline-brand inline-flex px-10">
            Ҳамаи 1000+ маҳсулот
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
