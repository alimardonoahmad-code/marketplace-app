'use client';

import { useEffect, useState } from 'react';
import {
  Users, Package, ShoppingCart, DollarSign, AlertCircle, TrendingUp, Store, UserPlus,
} from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import AdminStatCard from '@/components/admin/AdminStatCard';
import SimpleBarChart from '@/components/admin/SimpleBarChart';
import AdminBadge from '@/components/admin/AdminBadge';
import { Order, User } from '@/types';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalSellers: number;
    totalBuyers: number;
    totalProducts: number;
    activeProducts: number;
    pendingProducts: number;
    rejectedProducts: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    dailyRevenue: number;
    lowStockProducts: number;
    newRegistrations: number;
  };
  revenueChart: { month: string; revenue: number; orders: number }[];
  recentOrders: Order[];
  recentUsers: User[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  }

  const s = data?.stats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Дашборд</h1>
        <p className="text-slate-400 text-sm mt-1">Хулосаи умумии маркетплейс</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard label="Корбарон" value={s?.totalUsers ?? 0} icon={Users} />
        <AdminStatCard label="Фурӯшандагон" value={s?.totalSellers ?? 0} icon={Store} color="bg-purple-500/10 text-purple-400" />
        <AdminStatCard label="Маҳсулот" value={s?.activeProducts ?? 0} icon={Package} color="bg-emerald-500/10 text-emerald-400" sub={`${s?.pendingProducts ?? 0} интизор`} />
        <AdminStatCard label="Фармоишҳо" value={s?.totalOrders ?? 0} icon={ShoppingCart} color="bg-orange-500/10 text-orange-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <AdminStatCard label="Даромади умумӣ" value={formatPrice(s?.totalRevenue ?? 0)} icon={DollarSign} color="bg-green-500/10 text-green-400" />
        <AdminStatCard label="Даромади моҳ" value={formatPrice(s?.monthlyRevenue ?? 0)} icon={TrendingUp} color="bg-cyan-500/10 text-cyan-400" />
        <AdminStatCard label="Даромади имрӯз" value={formatPrice(s?.dailyRevenue ?? 0)} icon={DollarSign} color="bg-teal-500/10 text-teal-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <AdminStatCard label="Интизори тасдиқ" value={s?.pendingProducts ?? 0} icon={AlertCircle} color="bg-amber-500/10 text-amber-400" />
        <AdminStatCard label="Захираи кам" value={s?.lowStockProducts ?? 0} icon={Package} color="bg-red-500/10 text-red-400" />
        <AdminStatCard label="Бақайдгирӣи нав" value={s?.newRegistrations ?? 0} icon={UserPlus} color="bg-blue-500/10 text-blue-400" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="font-semibold text-white mb-4">Даромад (6 моҳ)</h2>
          <SimpleBarChart
            data={(data?.revenueChart || []).map((r) => ({
              label: r.month,
              value: r.revenue,
            }))}
            valueLabel=""
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="font-semibold text-white mb-4">Фармоишҳои охирин</h2>
          <div className="space-y-3">
            {data?.recentOrders.map((o) => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">#{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-500">{o.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatPrice(o.totalPrice)}</p>
                  <AdminBadge status={o.status}>{o.status}</AdminBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white mb-4">Корбарони нав</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data?.recentUsers.map((u) => (
            <div key={u.id} className="p-3 rounded-xl bg-slate-800/50">
              <p className="text-sm font-medium text-white truncate">{u.name}</p>
              <p className="text-xs text-slate-500 truncate">{u.email}</p>
              <AdminBadge status={u.role}>{u.role}</AdminBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


