'use client';

import { useEffect, useState } from 'react';
import api, { formatPrice } from '@/lib/api';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import { DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Order } from '@/types';

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalPaid: 0, paidCount: 0, pendingCount: 0, failedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/payments?limit=50'),
      api.get('/payments/stats'),
    ]).then(([listRes, statsRes]) => {
      setOrders(listRes.data.data.items);
      setStats(statsRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Пардохтҳо</h1>
        <p className="text-slate-400 text-sm mt-1">Транзаксияҳо ва омори пардохт</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Пардохтшуда" value={formatPrice(stats.totalPaid)} icon={DollarSign} color="bg-emerald-500/10 text-emerald-400" />
        <AdminStatCard label="Муваффақ" value={stats.paidCount} icon={CheckCircle} color="bg-green-500/10 text-green-400" />
        <AdminStatCard label="Интизор" value={stats.pendingCount} icon={Clock} color="bg-amber-500/10 text-amber-400" />
        <AdminStatCard label="Ноком" value={stats.failedCount} icon={XCircle} color="bg-red-500/10 text-red-400" />
      </div>

      <AdminDataTable
        data={orders}
        loading={loading}
        columns={[
          { key: 'id', label: 'ID', render: (o) => <span className="font-mono text-xs">#{o.id.slice(0, 8)}</span> },
          { key: 'user', label: 'Мизоҷ', render: (o) => o.user?.name || '—' },
          { key: 'total', label: 'Сумма', render: (o) => formatPrice(o.totalPrice) },
          { key: 'method', label: 'Усул', render: (o) => o.paymentMethod },
          { key: 'status', label: 'Ҳолат', render: (o) => <AdminBadge status={o.paymentStatus}>{o.paymentStatus}</AdminBadge> },
          { key: 'ref', label: 'Референс', render: (o) => o.paymentReference || '—' },
          { key: 'date', label: 'Сана', render: (o) => new Date(o.createdAt).toLocaleDateString('ru-RU') },
        ]}
      />
    </div>
  );
}


