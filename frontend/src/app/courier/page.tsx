'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, Package } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { Order } from '@/types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

export default function CourierDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'courier') { router.push('/login'); return; }
    api.get('/orders/courier').then((res) => setOrders(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [user, router]);

  const markDelivered = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/deliver`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: 'delivered' } : o));
      toast.success('Доставка анҷом ёфт!');
    } catch {
      toast.error('Хатогӣ');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Courier Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your deliveries</p>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Truck className="h-16 w-16 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-4">No deliveries assigned</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.items.length} items — {formatPrice(order.totalPrice)}</p>
                </div>
                <span className={clsx('badge capitalize',
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                  'bg-yellow-100 text-yellow-700'
                )}>{order.status}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{order.shippingAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>Customer: {order.user?.name} — {order.user?.phone}</span>
                </div>
              </div>

              {order.status === 'shipped' && (
                <button onClick={() => markDelivered(order.id)} className="btn-primary mt-4 text-sm">
                  <Truck className="h-4 w-4" /> Mark as Delivered
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
