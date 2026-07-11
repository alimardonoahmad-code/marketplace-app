'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, CreditCard, Banknote, Wallet, Smartphone } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { PAYMENT_LABELS, type PaymentMethodType } from '@/lib/payment';
import { Order } from '@/types';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import { AppIcon } from '@/components/icons';
import clsx from 'clsx';

const statusConfig: Record<string, { label: string; color: string; icon: 'pending' | 'confirmed' | 'truck' | 'delivered' | 'cancelled' }> = {
  pending: { label: 'Интизор', color: 'badge-accent', icon: 'pending' },
  confirmed: { label: 'Тасдиқ', color: 'badge-brand', icon: 'confirmed' },
  shipped: { label: 'Дар роҳ', color: 'bg-purple-100 text-purple-700', icon: 'truck' },
  delivered: { label: 'Доставка', color: 'badge-success', icon: 'delivered' },
  cancelled: { label: 'Бекор', color: 'badge-danger', icon: 'cancelled' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/orders/user')
      .then((res) => setOrders(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <AuthPrompt
        title="Барои дидани фармоишҳо ворид шавед"
        description="Таърихи фармоишҳои шумо пас аз воридшавӣ дастрас мешавад."
        nextPath="/orders"
        icon="buy"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="app-container py-4">
      <h1 className="text-xl font-black mb-1">Фармоишҳои ман</h1>
      <p className="text-sm text-gray-500 mb-5">{orders.length} фармоиш</p>

      {orders.length === 0 ? (
        <div className="card p-12 text-center animate-fade-up">
          <Package className="h-14 w-14 text-gray-300 mx-auto" />
          <p className="font-bold mt-4">Фармоише нест</p>
          <Link href="/products" className="btn-brand mt-4 inline-flex">Харид кунед</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const st = statusConfig[order.status] || statusConfig.pending;
            return (
              <Link key={order.id} href={`/orders/${order.id}`} className={clsx('card p-4 block card-hover opacity-0 animate-fade-up', `stagger-${Math.min(i + 1, 6)}`)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="icon-box h-11 w-11 icon-box-brand">
                      <AppIcon name={st.icon} size="default" variant="primary" aria-hidden />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('tg-TJ')}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        {order.paymentMethod === 'cod' && <><Banknote className="h-3 w-3" /> Offline</>}
                        {order.paymentMethod === 'online' && <><CreditCard className="h-3 w-3" /> Онлайн</>}
                        {order.paymentMethod === 'alif' && <><Wallet className="h-3 w-3" /> Alif</>}
                        {order.paymentMethod === 'eskhata' && <><Smartphone className="h-3 w-3" /> Эсхата</>}
                        {!['cod', 'online', 'alif', 'eskhata'].includes(order.paymentMethod) && order.paymentMethod}
                        {order.paymentStatus === 'paid' ? ' · Пардохтшуда' : order.paymentStatus === 'pending' ? ' · Интизор' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <p className="font-black text-brand-600">{formatPrice(order.totalPrice)}</p>
                      <span className={clsx('badge text-[10px]', st.color)}>{st.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
