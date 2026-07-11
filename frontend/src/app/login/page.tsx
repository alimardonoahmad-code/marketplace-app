'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-scale-in">
          <div className="text-center mb-10">
            <div className="icon-box h-20 w-20 bg-gradient-brand text-white mx-auto shadow-glow rounded-3xl animate-bounce-soft">
              <Sparkles className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black text-white mt-6">Market</h1>
            <p className="text-purple-300 text-sm mt-2 font-medium">Ворид шавед барои идома</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-brand-400 focus:ring-brand-500/20"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12 pr-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                placeholder="Парол"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn-brand w-full py-4 text-base mt-2">
              {loading ? 'Ворид мешавед...' : <>Ворид шавед <ArrowRight className="h-5 w-5" /></>}
            </button>
          </form>

          <p className="text-center text-purple-300 text-sm mt-6">
            Ҳисоб надоред?{' '}
            <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-white font-bold hover:underline">Бақайд гиред</Link>
          </p>

          <button type="button" onClick={() => router.push('/')} className="block w-full text-center text-purple-400 text-sm mt-4 hover:text-white">
            ← Бе ворид шавӣ идома диҳед
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-dark" />}>
      <LoginForm />
    </Suspense>
  );
}
