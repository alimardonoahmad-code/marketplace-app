'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order, User } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

export default function AdminDeliveryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [couriers, setCouriers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      api.get('/delivery'),
      api.get('/couriers'),
    ]).then(([ordersRes, couriersRes]) => {
      setOrders(ordersRes.data.data);
      setCouriers(couriersRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const assignCourier = async (orderId: string, courierId: string) => {
    try {
      await api.put(`/orders/${orderId}/courier`, { courierId });
      toast.success('Курьер таъин шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Доставка</h1>
        <p className="text-slate-400 text-sm mt-1">Курьерҳо ва фармоишҳои фаъол</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-2xl font-bold text-white">{couriers.length}</p>
          <p className="text-sm text-slate-400">Курьерҳо</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-2xl font-bold text-white">{orders.length}</p>
          <p className="text-sm text-slate-400">Фармоишҳои фаъол</p>
        </div>
      </div>

      <AdminDataTable
        data={orders}
        loading={loading}
        columns={[
          { key: 'id', label: 'Фармоиш', render: (o) => `#${o.id.slice(0, 8)}` },
          { key: 'user', label: 'Мизоҷ', render: (o) => o.user?.name || '—' },
          { key: 'address', label: 'Суроға', render: (o) => o.shippingAddress || '—' },
          { key: 'status', label: 'Статус', render: (o) => <AdminBadge status={o.status}>{o.status}</AdminBadge> },
          {
            key: 'courier',
            label: 'Курьер',
            render: (o) => couriers.length > 0 ? (
              <select
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                value={o.courier?.id || ''}
                onChange={(e) => e.target.value && assignCourier(o.id, e.target.value)}
              >
                <option value="">Интихоб...</option>
                {couriers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            ) : '—',
          },
        ]}
      />
    </div>
  );
}


