'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import AdminDataTable from '@/components/admin/AdminDataTable';

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  createdAt: string;
  admin?: { name: string };
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/activity-logs?limit=50')
      .then((res) => setLogs(res.data.data.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Журнали амалҳо</h1>
        <p className="text-slate-400 text-sm mt-1">Таърихи амалҳои админ</p>
      </div>

      <AdminDataTable
        data={logs}
        loading={loading}
        columns={[
          { key: 'time', label: 'Вақт', render: (l) => new Date(l.createdAt).toLocaleString('ru-RU') },
          { key: 'admin', label: 'Админ', render: (l) => l.admin?.name || '—' },
          { key: 'action', label: 'Амал', render: (l) => <span className="font-mono text-xs text-blue-400">{l.action}</span> },
          { key: 'entity', label: 'Объект', render: (l) => `${l.entity}${l.entityId ? ` #${l.entityId.slice(0, 8)}` : ''}` },
          { key: 'details', label: 'Тафсилот', render: (l) => <span className="text-xs text-slate-500 truncate max-w-[200px] block">{l.details || '—'}</span> },
        ]}
      />
    </div>
  );
}


