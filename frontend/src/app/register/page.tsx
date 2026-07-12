'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Phone, ShoppingBag, Store, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success('Хуш омaded! Ҳам харид, ҳам фурӯш!');
      router.push(next.startsWith('/') ? next : '/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Хатогӣ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <div className="ozon-promo-bar py-6 px-6 text-center">
        <h1 className="text-xl font-black text-white">Бақайд гиред</h1>
        <p className="text-white/85 text-sm mt-1">Барои харид ё кушодани мағоза</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 -mt-4">
        <div className="w-full max-w-sm animate-scale-in rounded-2xl bg-white border border-[#E8ECF2] p-6 shadow-[0_4px_24px_rgba(0,26,52,0.1)]">
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="flex flex-col items-center gap-2 rounded-xl p-3 border-2 border-primary bg-primary-50 text-primary">
              <ShoppingBag className="h-5 w-5" />
              <span className="text-[10px] font-bold">Харидор</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl p-3 border-2 border-accent/30 bg-accent/5 text-accent">
              <Store className="h-5 w-5" />
              <span className="text-[10px] font-bold">Фурӯшанда</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-12" placeholder="Ном" required />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-12" placeholder="Email" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-12" placeholder="Парол (6+)" minLength={6} required />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input pl-12" placeholder="Телефон" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 font-bold rounded-xl">
              {loading ? 'Сабт...' : <>Сохтан <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-5">
            Ҳисоб доред? <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-primary font-bold">Ворид шавед</Link>
          </p>

          <button type="button" onClick={() => router.push('/')} className="block w-full text-center text-text-muted text-sm mt-4 hover:text-primary">
            ← Бе бақайдгирӣ идома диҳед
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA]" />}>
      <RegisterForm />
    </Suspense>
  );
}
