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
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-t-2xl py-8 px-6 text-center bg-gradient-to-r from-[#005BFF] via-[#0050E0] to-[#0047CC] text-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white mb-3">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-white">MARKET Admin</h1>
          <p className="text-white/85 text-sm mt-1">Панели идоракунии маркетплейс</p>
        </div>
        <form onSubmit={submit} className="rounded-b-2xl border border-[#E8ECF2] border-t-0 bg-white p-6 space-y-4 shadow-[0_4px_24px_rgba(0,26,52,0.1)]">
          <div>
            <label className="text-xs text-text-muted mb-1 block font-semibold">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-xl border border-[#E8ECF2] bg-[#F5F7FA] py-2.5 pl-10 pr-4 text-text text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block font-semibold">Парол</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full rounded-xl border border-[#E8ECF2] bg-[#F5F7FA] py-2.5 pl-10 pr-12 text-text text-sm" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-[#005BFF] py-3 text-white font-bold hover:bg-[#0047CC] disabled:opacity-50">
            {loading ? 'Воридшавӣ...' : 'Ворид шудан'}
          </button>
        </form>
      </div>
    </div>
  );
}
