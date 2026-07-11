'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';
import api, { formatPrice } from '@/lib/api';
import { Product } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    api.get(`/products?${params}`)
      .then((res) => setProducts(res.data.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const moderate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/products/${id}/moderate`, { status: newStatus });
      toast.success(newStatus === 'approved' ? 'Тасдиқ шуд' : 'Рад шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Маҳсулотро нест кунед?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Нест карда шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Маҳсулот</h1>
        <p className="text-slate-400 text-sm mt-1">Модератсия ва идоракунӣ</p>
      </div>

      <AdminDataTable
        data={products}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        actions={
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
          >
            <option value="">Ҳама</option>
            <option value="pending">Интизор</option>
            <option value="approved">Тасдиқшуда</option>
            <option value="rejected">Радшуда</option>
          </select>
        }
        columns={[
          { key: 'name', label: 'Ном', render: (p) => <span className="font-medium text-white">{p.name}</span> },
          { key: 'seller', label: 'Фурӯшанда', render: (p) => p.seller?.name || '—' },
          { key: 'price', label: 'Нарх', render: (p) => formatPrice(p.price) },
          { key: 'stock', label: 'Захира' },
          { key: 'status', label: 'Ҳолат', render: (p) => <AdminBadge status={p.status}>{p.status}</AdminBadge> },
          {
            key: 'actions',
            label: 'Амал',
            render: (p) => (
              <div className="flex gap-1">
                {p.status === 'pending' && (
                  <>
                    <button type="button" onClick={() => moderate(p.id, 'approved')} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                      <Check className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => moderate(p.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => remove(p.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}


