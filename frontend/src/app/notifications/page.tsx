'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import AuthPrompt from '@/components/auth/AuthPrompt';
import clsx from 'clsx';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api.get('/notifications')
      .then((res) => setItems(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const markAll = async () => {
    await api.put('/notifications/read-all');
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markOne = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  if (!user) {
    return (
      <AuthPrompt
        title="Барои огоҳиҳо ворид шавед"
        description="Огоҳиҳои фармоиш ва маҳсулот пас аз воридшавӣ дастрас мешаванд."
        nextPath="/notifications"
        icon="default"
      />
    );
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="app-container py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-black flex items-center gap-2"><Bell className="h-5 w-5 text-brand-600" /> Огоҳиҳо</h1>
        {items.some((n) => !n.isRead) && (
          <button type="button" onClick={markAll} className="text-xs font-bold text-brand-600 flex items-center gap-1">
            <CheckCheck className="h-4 w-4" /> Ҳама хонда шуд
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto" />
          <p className="text-gray-500 mt-4">Огоҳие нест</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const inner = (
              <div className={clsx('card p-4 card-hover', !n.isRead && 'border-brand-200 bg-brand-50/30')}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-sm">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString('tg-TJ')}</p>
                  </div>
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0 mt-1" />}
                </div>
              </div>
            );
            if (n.link) {
              return (
                <Link key={n.id} href={n.link} onClick={() => markOne(n.id)}>{inner}</Link>
              );
            }
            return <div key={n.id} onClick={() => markOne(n.id)} role="button">{inner}</div>;
          })}
        </div>
      )}
    </div>
  );
}
