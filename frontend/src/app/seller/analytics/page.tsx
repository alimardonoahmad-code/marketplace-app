'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, DollarSign, Package, TrendingUp, ArrowLeft } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { isSeller } from '@/lib/auth-utils';

interface Analytics {
  totalRevenue: number;
  netRevenue: number;
  commission: number;
  commissionRate: number;
  totalOrders: number;
  totalProducts: number;
  approvedProducts: number;
  pendingOrders: number;
  topProducts: { id: string; name: string; sold: number; revenue: number }[];
}

export default function SellerAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isSeller(user)) { router.push('/sell'); return; }
    api.get('/seller/analytics').then((res) => setData(res.data.data)).catch(() => {});
  }, [user, router]);

  if (!data) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="app-container py-4">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/sell" className="icon-box h-10 w-10"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-xl font-black flex items-center gap-2"><BarChart3 className="h-5 w-5 text-brand-600" /> Analytics</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: DollarSign, label: 'Даромад', value: formatPrice(data.totalRevenue), color: 'from-emerald-500 to-teal-500' },
          { icon: TrendingUp, label: 'Соф', value: formatPrice(data.netRevenue), color: 'from-brand-500 to-purple-500' },
          { icon: Package, label: 'Фармоиш', value: String(data.totalOrders), color: 'from-blue-500 to-cyan-500' },
          { icon: BarChart3, label: 'Маҳсулот', value: String(data.approvedProducts), color: 'from-orange-500 to-red-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-4">
            <div className={`icon-box h-10 w-10 bg-gradient-to-br ${color} text-white mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-xl font-black">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-4">
        <p className="text-sm text-gray-500">Комиссияи платформа ({(data.commissionRate * 100).toFixed(0)}%)</p>
        <p className="text-lg font-black text-red-500">-{formatPrice(data.commission)}</p>
      </div>

      <h2 className="section-title mb-3">Беhtarin маҳсулот</h2>
      <div className="space-y-2">
        {data.topProducts.map((p, i) => (
          <div key={p.id} className="card p-4 flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-xs text-gray-500">{p.sold} фурӯхта</p>
            </div>
            <p className="font-black text-emerald-600">{formatPrice(p.revenue)}</p>
          </div>
        ))}
        {data.topProducts.length === 0 && <p className="text-sm text-gray-400">Ҳоло маълумот нест</p>}
      </div>
    </div>
  );
}
