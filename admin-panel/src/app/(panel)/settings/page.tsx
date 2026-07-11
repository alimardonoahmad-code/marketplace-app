'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Settings {
  marketplaceName: string;
  currency: string;
  commissionRate: number;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    marketplaceName: 'MARKET',
    currency: 'TJS',
    commissionRate: 10,
    maintenanceMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setSettings(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data.data);
      toast.success('Танзимот сабт шуд');
    } catch {
      toast.error('Хатогӣ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Танзимот</h1>
        <p className="text-slate-400 text-sm mt-1">Танзимоти умумии маркетплейс</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Номи маркетплейс</label>
          <input
            value={settings.marketplaceName}
            onChange={(e) => setSettings({ ...settings, marketplaceName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Асъор</label>
          <input
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Комиссия (%)</label>
          <input
            type="number"
            value={settings.commissionRate}
            onChange={(e) => setSettings({ ...settings, commissionRate: +e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            className="h-4 w-4 rounded"
          />
          <span className="text-sm text-slate-300">Режими нигоҳдорӣ (Maintenance)</span>
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? 'Сабт...' : 'Сабт кардан'}
        </button>
      </div>
    </div>
  );
}

