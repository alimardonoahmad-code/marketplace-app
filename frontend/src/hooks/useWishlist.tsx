'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { getLoginUrl } from '@/lib/auth-utils';
import toast from 'react-hot-toast';

interface WishlistContextValue {
  ready: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setIds(new Set());
      setReady(true);
      return;
    }
    setReady(false);
    api.get('/wishlist')
      .then((res) => {
        const list = res.data.data as { product: { id: string } }[];
        setIds(new Set(list.map((w) => w.product.id)));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [user]);

  const isWishlisted = useCallback((productId: string) => ids.has(productId), [ids]);

  const toggle = useCallback(async (productId: string) => {
    if (!user) {
      toast.error('Барои дӯстдошта ворид шавед');
      router.push(getLoginUrl('/wishlist'));
      return;
    }
    const inList = ids.has(productId);
    try {
      if (inList) {
        await api.delete(`/wishlist/${productId}`);
        setIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success('Аз дӯстдошта хориҷ шуд');
      } else {
        await api.post('/wishlist', { productId });
        setIds((prev) => new Set(prev).add(productId));
        toast.success('Ба дӯстдошта илова шуд');
      }
    } catch {
      toast.error('Хатогӣ');
    }
  }, [user, ids, router]);

  const value = useMemo(
    () => ({ ready, isWishlisted, toggle }),
    [ready, isWishlisted, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return ctx;
}
