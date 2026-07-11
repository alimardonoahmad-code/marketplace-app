'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import api, { formatPrice, getImageUrl } from '@/lib/api';
import { Cart, CartItem } from '@/types';
import { useAuthStore, useCartStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { user } = useAuthStore();
  const { setItemCount } = useCartStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    api.get('/cart').then((res) => {
      setCart(res.data.data);
      setItemCount(res.data.data.itemCount);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCart();
  }, [user]);

  const updateQuantity = async (item: CartItem, quantity: number) => {
    const res = await api.put(`/cart/${item.id}`, { quantity });
    setCart(res.data.data);
    setItemCount(res.data.data.itemCount);
  };

  const removeItem = async (itemId: string) => {
    const res = await api.delete(`/cart/${itemId}`);
    setCart(res.data.data);
    setItemCount(res.data.data.itemCount);
    toast.success('Хазф шуд');
  };

  if (!user) {
    return (
      <AuthPrompt
        title="Барои харид ворид шавед"
        description="Сабад ва фармоишҳо танҳо барои корбарони бақайдшуда. Шумо метавонед маҳсулотро бе воридшавӣ тамошо кунед."
        nextPath="/cart"
        icon="buy"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="app-container py-16 text-center animate-fade-up">
        <div className="icon-box h-24 w-24 bg-brand-50 text-brand-300 mx-auto rounded-3xl">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-black mt-6">Сабад холӣ аст</h2>
        <p className="text-gray-500 mt-2 text-sm">Маҳсулот илова кунед</p>
        <Link href="/products" className="btn-brand mt-6 inline-flex">Харид кунед</Link>
      </div>
    );
  }

  return (
    <div className="app-container py-4">
      <h1 className="text-xl font-black mb-1">Сабади харид</h1>
      <p className="text-sm text-gray-500 mb-5">{cart.itemCount} маҳсулот</p>

      <div className="space-y-3 mb-6">
        {cart.items.map((item) => {
          const price = item.product.discountPrice || item.product.price;
          return (
            <div key={item.id} className="card p-3 flex gap-3 card-hover animate-fade-up">
              <Link href={`/products/${item.product.id}`} className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-brand-50">
                <Image src={getImageUrl(item.product.images?.[0])} alt="" fill className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} className="font-bold text-sm line-clamp-2 hover:text-brand-600">{item.product.name}</Link>
                <p className="font-black text-brand-600 mt-1">{formatPrice(price)}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center bg-gray-100 rounded-xl">
                    <button onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))} className="p-2"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="px-3 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item, item.quantity + 1)} className="p-2"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="icon-box h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5 sticky bottom-20 bg-white/95 backdrop-blur-xl shadow-float">
        <div className="flex justify-between mb-2"><span className="text-gray-500">Ҷамъ</span><span className="font-bold">{formatPrice(cart.total)}</span></div>
        <div className="flex justify-between mb-4"><span className="text-gray-500">Доставка</span><span className="badge-success">Ройгон</span></div>
        <div className="flex justify-between text-lg font-black border-t border-gray-100 pt-3 mb-4">
          <span>Умумӣ</span><span className="gradient-text">{formatPrice(cart.total)}</span>
        </div>
        <Link href="/checkout" className="btn-brand w-full py-4 text-center flex">
          Харидро анҷом диҳед <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
