'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, User, Mail, Lock, Phone, ShoppingBag, Store, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-8">
            <div className="icon-box h-16 w-16 bg-gradient-brand text-white mx-auto shadow-glow rounded-3xl">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-black text-white mt-5">Бақайд гиред</h1>
            <p className="text-purple-300 text-sm mt-1">Барои харид ё кушодани мағоза</p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="flex flex-col items-center gap-2 rounded-2xl p-4 border-2 border-brand-400 bg-brand-500/20 text-white">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs font-bold">Харидор</span>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl p-4 border-2 border-accent-400 bg-accent-500/20 text-white">
              <Store className="h-6 w-6" />
              <span className="text-xs font-bold">Фурӯшанда</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400" placeholder="Ном" required />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400" placeholder="Email" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400" placeholder="Парол (6+)" minLength={6} required />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400" placeholder="Телефон" />
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-4 mt-2">
              {loading ? 'Сабт...' : <>Сохтан <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-purple-300 text-sm mt-6">
            Ҳисоб доред? <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-white font-bold">Ворид шавед</Link>
          </p>

          <button type="button" onClick={() => router.push('/')} className="block w-full text-center text-purple-400 text-sm mt-4 hover:text-white">
            ← Бе бақайдгирӣ идома диҳед
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-dark" />}>
      <RegisterForm />
    </Suspense>
  );
}
