'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Order } from '@/types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function SellerOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'seller' && user.role !== 'admin') {
      router.replace('/sell');
      return;
    }
    api.get('/orders/seller')
      .then((res) => setOrders(res.data.data))
      .catch(() => toast.error('Дастрасӣ нест'))
      .finally(() => setLoading(false));
  }, [user, router]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: status as Order['status'] } : o));
      toast.success('Статус нав карда шуд');
    } catch { toast.error('Хатогӣ'); }
  };

  const statusIcon = (s: string) => {
    if (s === 'pending') return Clock;
    if (s === 'delivered') return CheckCircle;
    return Truck;
  };

  return (
    <div className="app-container py-4">
      <h1 className="text-xl font-black mb-1">Фармоишҳо</h1>
      <p className="text-sm text-gray-500 mb-6">{orders.length} фармоиш</p>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-28 shimmer-bg" />)}</div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center">
          <Package className="h-14 w-14 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-4">Фармоише нест</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const Icon = statusIcon(order.status);
            return (
              <div key={order.id} className="card p-4 card-hover">
                <div className="flex items-start gap-3">
                  <div className={clsx('icon-box h-11 w-11 shrink-0',
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-brand-100 text-brand-600'
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-extrabold text-sm">#{order.id.slice(0, 8)}</p>
                      <p className="font-black text-brand-600">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{order.user?.name} • {order.items.length} маҳсулот</p>
                    <span className="badge-brand text-[10px] mt-2 capitalize">{order.status}</span>
                    <div className="flex gap-2 mt-3">
                      {order.status === 'pending' && (
                        <button onClick={() => updateStatus(order.id, 'confirmed')} className="btn-brand text-xs py-2 px-3">Тасдиқ</button>
                      )}
                      {order.status === 'confirmed' && (
                        <button onClick={() => updateStatus(order.id, 'packed')} className="btn-accent text-xs py-2 px-3">Банд кардан</button>
                      )}
                      {order.status === 'packed' && (
                        <button onClick={() => updateStatus(order.id, 'shipped')} className="btn-accent text-xs py-2 px-3">Ирсол</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
