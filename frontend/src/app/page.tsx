'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import HomeHero from '@/components/home/HomeHero';
import OzonQuickIcons from '@/components/home/OzonQuickIcons';
import OzonProductFeed from '@/components/home/OzonProductFeed';
import Footer from '@/components/layout/Footer';
import { getLoginUrl } from '@/lib/auth-utils';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store/auth';
import { Product } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setItemCount = useCartStore((s) => s.setItemCount);

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
    <div className="pb-2 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      <HomeHero />
      <OzonQuickIcons />
      <OzonProductFeed onAddToCart={handleAddToCart} />
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
