'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  usedCount: number;
  maxUses?: number;
  active: boolean;
  expiresAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent', value: 10, minOrder: 0 });

  const load = () => {
    setLoading(true);
    api.get('/coupons')
      .then((res) => setCoupons(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    try {
      await api.post('/coupons', form);
      toast.success('Промокод илова шуд');
      setShowForm(false);
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const toggle = async (c: Coupon) => {
    try {
      await api.put(`/coupons/${c.id}`, { active: !c.active });
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Промокодро нест кунед?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Нест карда шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Промокодҳо</h1>
          <p className="text-slate-400 text-sm mt-1">Купонҳо ва тахфифҳо</p>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
          <Plus className="h-4 w-4" /> Илова
        </button>
      </div>

      {showForm && (
        <div className="grid sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
          <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="Код" className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
            <option value="percent">%</option>
            <option value="fixed">Фикс</option>
          </select>
          <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} placeholder="Қиммат" className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
          <button type="button" onClick={create} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Сабт</button>
        </div>
      )}

      <AdminDataTable
        data={coupons}
        loading={loading}
        columns={[
          { key: 'code', label: 'Код', render: (c) => <span className="font-mono font-bold text-white">{c.code}</span> },
          { key: 'type', label: 'Навъ', render: (c) => c.type === 'percent' ? `${c.value}%` : `${c.value} смн` },
          { key: 'used', label: 'Истифода', render: (c) => `${c.usedCount}${c.maxUses ? `/${c.maxUses}` : ''}` },
          { key: 'status', label: 'Ҳолат', render: (c) => <AdminBadge status={c.active ? 'active' : 'inactive'}>{c.active ? 'Фаъол' : 'Хомӯш'}</AdminBadge> },
          {
            key: 'actions',
            label: 'Амал',
            render: (c) => (
              <div className="flex gap-2">
                <button type="button" onClick={() => toggle(c)} className="text-xs text-blue-400 hover:underline">
                  {c.active ? 'Хомӯш' : 'Фаъол'}
                </button>
                <button type="button" onClick={() => remove(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
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


