'use client';

import { useEffect, useState } from 'react';
import { Trash2, Star } from 'lucide-react';
import api from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { name: string };
  product?: { name: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/reviews?limit=50')
      .then((res) => setReviews(res.data.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Баҳогузориро нест кунед?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Нест карда шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Баҳогузориҳо</h1>
        <p className="text-slate-400 text-sm mt-1">Модератсияи шарҳҳо</p>
      </div>

      <AdminDataTable
        data={reviews}
        loading={loading}
        columns={[
          { key: 'product', label: 'Маҳсулот', render: (r) => r.product?.name || '—' },
          { key: 'user', label: 'Корбар', render: (r) => r.user?.name || '—' },
          {
            key: 'rating',
            label: 'Баҳо',
            render: (r) => (
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="h-3.5 w-3.5 fill-current" /> {r.rating}
              </span>
            ),
          },
          { key: 'comment', label: 'Шарҳ', render: (r) => <span className="line-clamp-2 max-w-xs">{r.comment || '—'}</span> },
          { key: 'date', label: 'Сана', render: (r) => new Date(r.createdAt).toLocaleDateString('ru-RU') },
          {
            key: 'actions',
            label: 'Амал',
            render: (r) => (
              <button type="button" onClick={() => remove(r.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />
    </div>
  );
}


