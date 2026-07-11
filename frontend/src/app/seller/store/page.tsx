'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, MapPin, Save } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { isSeller, getApiErrorMessage } from '@/lib/auth-utils';
import toast from 'react-hot-toast';

export default function SellerStoreSettingsPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    storeAddress: '',
    storeCity: '',
    storeDescription: '',
  });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isSeller(user)) { router.push('/sell'); return; }
    setForm({
      storeName: user.storeName || user.name || '',
      storeAddress: user.storeAddress || '',
      storeCity: user.storeCity || '',
      storeDescription: user.storeDescription || '',
    });
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.data);
      toast.success('Мағоза нав карда шуд!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Хатогӣ'));
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isSeller(user)) return null;

  return (
    <div className="app-container py-4 max-w-xl">
      <Link href="/sell" className="text-xs text-text-secondary hover:text-primary">← Бозгашт</Link>
      <div className="flex items-center gap-3 mt-3 mb-5">
        <div className="icon-box h-12 w-12 bg-gradient-primary text-white">
          <Store className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-black">Танзимоти мағоза</h1>
          <p className="text-xs text-text-secondary">Маълумоти мағоза барои харидорон намоён мешавад</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary">Номи мағоза</label>
          <input
            className="input mt-1"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            placeholder="Масalan: Tech Store Dushanbe"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> Суроға (кӯча)
          </label>
          <input
            className="input mt-1"
            value={form.storeAddress}
            onChange={(e) => setForm({ ...form, storeAddress: e.target.value })}
            placeholder="кӯчаи Рӯдакӣ, 45"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Шаҳр</label>
          <input
            className="input mt-1"
            value={form.storeCity}
            onChange={(e) => setForm({ ...form, storeCity: e.target.value })}
            placeholder="Душанбе"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary">Тавсифи мағоза</label>
          <textarea
            className="input mt-1 min-h-[100px] resize-y"
            value={form.storeDescription}
            onChange={(e) => setForm({ ...form, storeDescription: e.target.value })}
            placeholder="Маҳсулот ва хидматҳои мағоза..."
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          <Save className="h-4 w-4" />
          {loading ? 'Сабт мешавад...' : 'Сабт кардан'}
        </button>
      </form>

      <p className="text-xs text-text-muted mt-4 text-center">
        Мағозаи шумо дар <Link href={`/stores/${user.id}`} className="text-primary hover:underline">/internet-магазин</Link> барои харидорон намоён аст
      </p>
    </div>
  );
}
