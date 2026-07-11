'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/products/ProductCard';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';

interface WishlistItem {
  id: string;
  product: Product;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/wishlist').then((res) => setItems(res.data.data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <AuthPrompt
        title="Барои дӯстдошта ворид шавед"
        description="Маҳсулоти дӯстдоштаро нигоҳ доштан танҳо барои корбарони бақайдшуда."
        nextPath="/wishlist"
        icon="buy"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="app-container py-4">
      <h1 className="text-xl font-black mb-1">Дӯстдошта</h1>
      <p className="text-sm text-gray-500 mb-5">{items.length} маҳсулот</p>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="h-14 w-14 text-pink-300 mx-auto" />
          <p className="font-bold mt-4">Холӣ аст</p>
          <Link href="/products" className="btn-brand mt-4 inline-flex">Харид кунед</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, i) => <ProductCard key={item.id} product={item.product} index={i} />)}
        </div>
      )}
    </div>
  );
}
