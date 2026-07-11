'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { syncApiToken } from '@/lib/api';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    const u = localStorage.getItem('admin_user');
    if (t) syncApiToken(t);
    if (!user && u && t) {
      try { useAuthStore.setState({ user: JSON.parse(u), token: t }); } catch { /* */ }
    }
    setReady(true);
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user || !token || user.role !== 'admin') {
      router.replace('/login');
    }
  }, [ready, user, token, router]);

  if (!ready || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
