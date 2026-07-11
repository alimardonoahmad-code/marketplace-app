'use client';

import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/types';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminBadge from '@/components/admin/AdminBadge';
import toast from 'react-hot-toast';

const ROLES = ['buyer', 'seller', 'admin', 'courier'] as const;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '50' });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    api.get(`/users?${params}`)
      .then((res) => setUsers(res.data.data.items))
      .catch(() => toast.error('Хатогӣ'))
      .finally(() => setLoading(false));
  }, [search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      await api.put(`/users/${id}`, data);
      toast.success('Навсозӣ шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Корбарро нест кунед?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Нест карда шуд');
      load();
    } catch {
      toast.error('Хатогӣ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Корбарон</h1>
          <p className="text-slate-400 text-sm mt-1">Идоракунии ҳамаи корбарон</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:text-white"
          onClick={async () => {
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/export/users', {
              headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.csv';
            a.click();
          }}
        >
          Export CSV
        </button>
      </div>

      <AdminDataTable
        data={users}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Ном, email, телефон..."
        actions={
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white"
          >
            <option value="">Ҳамаи ролҳо</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        }
        columns={[
          { key: 'name', label: 'Ном', render: (u) => <span className="font-medium text-white">{u.name}</span> },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Телефон', render: (u) => u.phone || '—' },
          {
            key: 'role',
            label: 'Рол',
            render: (u) => (
              <select
                value={u.role}
                onChange={(e) => updateUser(u.id, { role: e.target.value as User['role'] })}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                disabled={u.role === 'admin'}
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            ),
          },
          {
            key: 'status',
            label: 'Ҳолат',
            render: (u) => <AdminBadge status={u.isActive ? 'active' : 'inactive'}>{u.isActive ? 'Фаъол' : 'Блок'}</AdminBadge>,
          },
          {
            key: 'actions',
            label: 'Амал',
            render: (u) => (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateUser(u.id, { isActive: !u.isActive })}
                  className="text-xs text-blue-400 hover:underline"
                >
                  {u.isActive ? 'Блок' : 'Фаъол'}
                </button>
                {u.role !== 'admin' && (
                  <button type="button" onClick={() => deleteUser(u.id)} className="text-xs text-red-400 hover:underline">
                    Нест
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}


