'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  adminReply?: string;
  createdAt: string;
  user?: { name: string; email: string };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/tickets?limit=50')
      .then((res) => setTickets(res.data.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateTicket = async (id: string, data: Record<string, string>) => {
    try {
      await api.put(`/tickets/${id}`, data);
      toast.success('Навсозӣ шуд');
      setReplyId(null);
      setReply('');
      load();
    } catch { toast.error('Хатогӣ'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Дастгирӣ</h1>
        <p className="text-slate-400 text-sm mt-1">Тикетҳои дастгирӣ</p>
      </div>

      <AdminDataTable
        data={tickets}
        loading={loading}
        emptyText="Тикет нест"
        columns={[
          { key: 'subject', label: 'Мавзӯъ', render: (t) => <span className="font-medium text-white">{t.subject}</span> },
          { key: 'user', label: 'Корбар', render: (t) => t.user?.name || '—' },
          { key: 'priority', label: 'Афзалият', render: (t) => <AdminBadge status={t.priority}>{t.priority}</AdminBadge> },
          {
            key: 'status',
            label: 'Статус',
            render: (t) => (
              <select
                value={t.status}
                onChange={(e) => updateTicket(t.id, { status: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
              >
                {['open', 'in_progress', 'resolved', 'closed'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ),
          },
          { key: 'date', label: 'Сана', render: (t) => new Date(t.createdAt).toLocaleDateString('ru-RU') },
          {
            key: 'actions',
            label: 'Ҷавоб',
            render: (t) => replyId === t.id ? (
              <div className="flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-white w-40"
                  placeholder="Ҷавоб..."
                />
                <button type="button" onClick={() => updateTicket(t.id, { adminReply: reply, status: 'resolved' })} className="text-xs text-blue-400">Ирсол</button>
              </div>
            ) : (
              <button type="button" onClick={() => { setReplyId(t.id); setReply(t.adminReply || ''); }} className="text-xs text-blue-400 hover:underline">Ҷавоб додан</button>
            ),
          },
        ]}
      />
    </div>
  );
}


