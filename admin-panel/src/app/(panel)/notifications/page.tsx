'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('all');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await api.post('/notifications/broadcast', { title, message, role });
      toast.success(`Ирсол шуд ба ${res.data.data.sent} корбар`);
      setTitle('');
      setMessage('');
    } catch {
      toast.error('Хатогӣ');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Огоҳиномаҳо</h1>
        <p className="text-slate-400 text-sm mt-1">Ирсоли огоҳинома ба корбарон</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Гирандагон</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
          >
            <option value="all">Ҳама</option>
            <option value="buyer">Харидорон</option>
            <option value="seller">Фурӯшандагон</option>
            <option value="courier">Курьерҳо</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Сарлавҳа</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
            placeholder="Сарлавҳаи огоҳинома"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Паём</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm resize-none"
            placeholder="Матни огоҳинома..."
          />
        </div>
        <button
          type="button"
          onClick={send}
          disabled={sending}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {sending ? 'Ирсол...' : 'Ирсол кардан'}
        </button>
      </div>
    </div>
  );
}

