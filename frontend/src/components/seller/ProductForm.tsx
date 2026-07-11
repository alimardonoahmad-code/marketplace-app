'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Package, DollarSign, Hash, ImagePlus, Video } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { isSeller, getApiErrorMessage } from '@/lib/auth-utils';
import { Category } from '@/types';
import toast from 'react-hot-toast';

interface ProductFormProps {
  productId?: string;
  initial?: {
    name: string; description: string; price: string;
    discountPrice: string; stock: string; categoryId: string; video: string;
  };
}

export default function ProductForm({ productId, initial }: ProductFormProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState(initial || {
    name: '', description: '', price: '', discountPrice: '', stock: '', categoryId: '', video: '',
  });

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    if (!isSeller(user)) { router.replace('/sell'); return; }
    api.get('/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('stock', form.stock);
      if (form.discountPrice) fd.append('discountPrice', form.discountPrice);
      if (form.categoryId) fd.append('categoryId', form.categoryId);
      if (form.video) fd.append('video', form.video);
      images.forEach((img) => fd.append('images', img));

      if (isEdit) {
        await api.put(`/products/${productId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('✅ Навсозӣ шуд!');
      } else {
        await api.post('/products', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('🎉 Маҳсулот илова шуд!');
      }
      router.push('/seller/products');
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isSeller(user)) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Package className="h-3.5 w-3.5" /> Ном
        </label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="iPhone 15 Pro" required />
      </div>

      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Категория</label>
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input" required>
          <option value="">Интихоб кунед...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Тавсиф</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" rows={4} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <DollarSign className="h-3.5 w-3.5" /> Нарх (сомонӣ)
          </label>
          <input type="number" step="1" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input" placeholder="1250" required />
        </div>
        <div className="card p-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Тахфиф (сомонӣ)</label>
          <input type="number" step="1" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input" placeholder="990" />
        </div>
      </div>

      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Hash className="h-3.5 w-3.5" /> Stock
        </label>
        <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input" required />
      </div>

      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <ImagePlus className="h-3.5 w-3.5" /> Суратҳо (то 5)
        </label>
        <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []))} className="input file:mr-3 file:rounded-xl file:border-0 file:bg-brand-50 file:px-3 file:py-1 file:text-sm file:font-bold file:text-brand-600" />
        {images.length > 0 && <p className="text-xs text-gray-500 mt-2">{images.length} файл интихоб шуд</p>}
      </div>

      <div className="card p-4">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Video className="h-3.5 w-3.5" /> Видео (URL)
        </label>
        <input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} className="input" placeholder="https://youtube.com/..." />
      </div>

      <button type="submit" disabled={loading} className="btn-accent w-full py-4 text-base">
        {loading ? 'Сабт...' : isEdit ? '✅ Навсозӣ' : '✨ Маҳсулот илова кунед'}
      </button>
    </form>
  );
}
