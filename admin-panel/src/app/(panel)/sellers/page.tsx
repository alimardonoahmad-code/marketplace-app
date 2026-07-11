'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { User } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';

interface Seller extends User {
  productCount?: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('search', search);
    api.get(`/sellers?${params}`)
      .then((res) => setSellers(res.data.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Фурӯшандагон</h1>
        <p className="text-slate-400 text-sm mt-1">Мағозаҳо ва омори фурӯш</p>
      </div>

      <AdminDataTable
        data={sellers}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Номи мағоза, шаҳр..."
        columns={[
          {
            key: 'storeName',
            label: 'Мағоза',
            render: (s) => (
              <Link href={`/stores/${s.id}`} className="font-medium text-blue-400 hover:underline">
                {s.storeName || s.name}
              </Link>
            ),
          },
          { key: 'email', label: 'Email' },
          { key: 'storeCity', label: 'Шаҳр', render: (s) => s.storeCity || '—' },
          { key: 'storeAddress', label: 'Суроға', render: (s) => s.storeAddress || '—' },
          { key: 'products', label: 'Маҳсулот', render: (s) => s.productCount ?? 0 },
          {
            key: 'status',
            label: 'Ҳолат',
            render: (s) => <AdminBadge status={s.isActive ? 'active' : 'inactive'}>{s.isActive ? 'Фаъол' : 'Блок'}</AdminBadge>,
          },
        ]}
      />
    </div>
  );
}


