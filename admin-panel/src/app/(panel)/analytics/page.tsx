'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import SimpleBarChart from '@/components/admin/SimpleBarChart';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { TrendingUp, UserPlus, Store } from 'lucide-react';
import { formatPrice } from '@/lib/api';

export default function AnalyticsPage() {
  const [data, setData] = useState<{
    stats: Record<string, number>;
    revenueChart: { month: string; revenue: number }[];
    usersByRole: { role: string; count: string }[];
  } | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Аналитика</h1>
        <p className="text-slate-400 text-sm mt-1">Омори фурӯш ва ростии корбарон</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <AdminStatCard label="Даромади моҳ" value={formatPrice(data?.stats.monthlyRevenue || 0)} icon={TrendingUp} />
        <AdminStatCard label="Бақайдгирӣи нав" value={data?.stats.newRegistrations || 0} icon={UserPlus} color="bg-blue-500/10 text-blue-400" />
        <AdminStatCard label="Фурӯшандагон" value={data?.stats.totalSellers || 0} icon={Store} color="bg-purple-500/10 text-purple-400" />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white mb-4">Даромад (6 моҳ)</h2>
        <SimpleBarChart data={(data?.revenueChart || []).map((r) => ({ label: r.month, value: r.revenue }))} />
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="font-semibold text-white mb-4">Корбарон ба рол</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          {data?.usersByRole.map((r) => (
            <div key={r.role} className="p-4 rounded-xl bg-slate-800/50">
              <p className="text-2xl font-bold text-white">{r.count}</p>
              <p className="text-sm text-slate-400 capitalize">{r.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
