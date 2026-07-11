'use client';

import { useEffect, useState } from 'react';
import api, { formatPrice } from '@/lib/api';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { DollarSign, ShoppingCart, Users, Package, Download } from 'lucide-react';

export default function ReportsPage() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data.data.stats));
  }, []);

  const exportOrders = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('/api/admin/export/orders', { headers: { Authorization: `Bearer ${token}` } });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'orders.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white dark:text-white">Ҳисоботҳо</h1>
          <p className="text-slate-400 text-sm mt-1">Ҳисоботҳои умумӣ ва export</p>
        </div>
        <button type="button" onClick={exportOrders} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
          <Download className="h-4 w-4" /> Export фармоишҳо
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Даромад" value={formatPrice(stats.totalRevenue || 0)} icon={DollarSign} />
        <AdminStatCard label="Фармоишҳо" value={stats.totalOrders || 0} icon={ShoppingCart} color="bg-orange-500/10 text-orange-400" />
        <AdminStatCard label="Корбарон" value={stats.totalUsers || 0} icon={Users} color="bg-purple-500/10 text-purple-400" />
        <AdminStatCard label="Маҳсулот" value={stats.activeProducts || 0} icon={Package} color="bg-emerald-500/10 text-emerald-400" />
      </div>
    </div>
  );
}
