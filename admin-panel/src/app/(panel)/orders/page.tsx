'use client';

import { useCallback, useEffect, useState } from 'react';
import api, { formatPrice } from '@/lib/api';
import { Order } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('search', search);
    api.get(`/orders?${params}`)
      .then((res) => setOrders(res.data.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Статус навсозӣ шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Фармоишҳо</h1>
        <p className="text-slate-400 text-sm mt-1">Идоракунии ҳамаи фармоишҳо</p>
      </div>

      <AdminDataTable
        data={orders}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Мизоҷ, email..."
        columns={[
          { key: 'id', label: 'ID', render: (o) => <span className="font-mono text-xs">#{o.id.slice(0, 8)}</span> },
          { key: 'user', label: 'Мизоҷ', render: (o) => o.user?.name || '—' },
          { key: 'total', label: 'Сумма', render: (o) => <span className="font-semibold text-white">{formatPrice(o.totalPrice)}</span> },
          { key: 'payment', label: 'Пардохт', render: (o) => <AdminBadge status={o.paymentStatus}>{o.paymentStatus}</AdminBadge> },
          {
            key: 'status',
            label: 'Статус',
            render: (o) => (
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ),
          },
          { key: 'date', label: 'Сана', render: (o) => new Date(o.createdAt).toLocaleDateString('ru-RU') },
        ]}
      />
    </div>
  );
}


