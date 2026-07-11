'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/categories')
      .then((res) => setCategories(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return;
    try {
      await api.post('/categories', { name: name.trim() });
      toast.success('Илова шуд');
      setName('');
      setShowForm(false);
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Категорияро нест кунед?')) return;
    try {
      await api.delete(`/categories/${id}`);
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
          <h1 className="text-2xl font-bold text-white">Категорияҳо</h1>
          <p className="text-slate-400 text-sm mt-1">Идоракунии категорияҳо</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" /> Илова
        </button>
      </div>

      {showForm && (
        <div className="flex gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/60">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Номи категория"
            className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
          />
          <button type="button" onClick={create} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Сабт</button>
        </div>
      )}

      <AdminDataTable
        data={categories}
        loading={loading}
        columns={[
          { key: 'name', label: 'Ном', render: (c) => <span className="font-medium text-white">{c.name}</span> },
          { key: 'slug', label: 'Slug', render: (c) => <span className="font-mono text-xs text-slate-400">{c.slug}</span> },
          { key: 'description', label: 'Тавсиф', render: (c) => c.description || '—' },
          {
            key: 'actions',
            label: 'Амал',
            render: (c) => (
              <button type="button" onClick={() => remove(c.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}


