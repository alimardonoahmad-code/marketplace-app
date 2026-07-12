'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || searchParams.get('redirect') || '/';
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Хуш омaded, ${user.name}!`);
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
      <div className="ozon-promo-bar py-8 px-6 text-center">
        <h1 className="text-2xl font-black text-white">Market</h1>
        <p className="text-white/85 text-sm mt-1">Ворид шавед барои идома</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 -mt-6">
        <div className="w-full max-w-sm animate-scale-in rounded-2xl bg-white border border-[#E8ECF2] p-6 shadow-[0_4px_24px_rgba(0,26,52,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12 pr-12"
                placeholder="Парол"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base font-bold rounded-xl">
              {loading ? 'Ворид мешавед...' : <>Ворид шавед <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-5">
            Ҳисоб надоред?{' '}
            <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-primary font-bold hover:underline">Бақайд гиред</Link>
          </p>

          <button type="button" onClick={() => router.push('/')} className="block w-full text-center text-text-muted text-sm mt-4 hover:text-primary">
            ← Бе ворид шавӣ идома диҳед
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA]" />}>
      <LoginForm />
    </Suspense>
  );
}
