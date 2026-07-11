'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  sortOrder: number;
  active: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  active: boolean;
}

export default function AdminCmsPage() {
  const [tab, setTab] = useState<'banners' | 'faq'>('banners');
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/banners'), api.get('/faq')])
      .then(([bRes, fRes]) => {
        setBanners(bRes.data.data);
        setFaq(fRes.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addBanner = async () => {
    try {
      await api.post('/banners', {
        title: 'Баннери нав',
        subtitle: 'Тавсиф',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=75',
        href: '/products',
        sortOrder: banners.length,
        active: true,
      });
      toast.success('Илова шуд');
      load();
    } catch { toast.error('Хатогӣ'); }
  };

  const addFaq = async () => {
    try {
      await api.post('/faq', {
        question: 'Саволи нав?',
        answer: 'Ҷавоб...',
        sortOrder: faq.length,
        active: true,
      });
      toast.success('Илова шуд');
      load();
    } catch { toast.error('Хатогӣ'); }
  };

  const removeBanner = async (id: string) => {
    await api.delete(`/banners/${id}`);
    load();
  };

  const removeFaq = async (id: string) => {
    await api.delete(`/faq/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CMS</h1>
          <p className="text-slate-400 text-sm mt-1">Баннерҳо ва FAQ</p>
        </div>
        <div className="flex gap-2">
          {(['banners', 'faq'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold ${tab === t ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {t === 'banners' ? 'Баннерҳо' : 'FAQ'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'banners' && (
        <>
          <button type="button" onClick={addBanner} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            <Plus className="h-4 w-4" /> Баннер илова
          </button>
          <AdminDataTable
            data={banners}
            loading={loading}
            columns={[
              { key: 'title', label: 'Сарлавҳа', render: (b) => <span className="font-medium text-white">{b.title}</span> },
              { key: 'subtitle', label: 'Тавсиф', render: (b) => b.subtitle || '—' },
              { key: 'href', label: 'Линк', render: (b) => b.href },
              { key: 'status', label: 'Ҳолат', render: (b) => <AdminBadge status={b.active ? 'active' : 'inactive'}>{b.active ? 'Фаъол' : 'Хомӯш'}</AdminBadge> },
              { key: 'actions', label: '', render: (b) => (
                <button type="button" onClick={() => removeBanner(b.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4" /></button>
              )},
            ]}
          />
        </>
      )}

      {tab === 'faq' && (
        <>
          <button type="button" onClick={addFaq} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            <Plus className="h-4 w-4" /> FAQ илова
          </button>
          <AdminDataTable
            data={faq}
            loading={loading}
            columns={[
              { key: 'question', label: 'Савол', render: (f) => <span className="font-medium text-white">{f.question}</span> },
              { key: 'answer', label: 'Ҷавоб', render: (f) => <span className="line-clamp-2 max-w-md">{f.answer}</span> },
              { key: 'status', label: 'Ҳолат', render: (f) => <AdminBadge status={f.active ? 'active' : 'inactive'}>{f.active ? 'Фаъол' : 'Хомӯш'}</AdminBadge> },
              { key: 'actions', label: '', render: (f) => (
                <button type="button" onClick={() => removeFaq(f.id)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><Trash2 className="h-4 w-4" /></button>
              )},
            ]}
          />
        </>
      )}
    </div>
  );
}


