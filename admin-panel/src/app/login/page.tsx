'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('admin@marketplace.com');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data.data;
      if (user.role !== 'admin') {
        toast.error('Танҳо админ ворид шавад');
        return;
      }
      setAuth(user, accessToken);
      toast.success(`Хуш омaded, ${user.name}`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Хатогӣ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-white">MARKET Admin</h1>
          <p className="text-slate-400 text-sm mt-2">Панели идоракунии маркетплейс</p>
        </div>
        <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 backdrop-blur">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-white text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Парол</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-12 text-white text-sm" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-500 disabled:opacity-50">
            {loading ? 'Воридшавӣ...' : 'Ворид шудан'}
          </button>
        </form>
      </div>
    </div>
  );
}
