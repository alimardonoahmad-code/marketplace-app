'use client';

import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function AdminTopBar() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[#E8ECF2] bg-white/95 px-4 backdrop-blur dark:border-[#0D2D52] dark:bg-[#001A34]/95 lg:px-6">
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Ҷустуҷӯ дар панел..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button type="button" className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5" />
        </button>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
          <p className="text-xs text-slate-500">Administrator</p>
        </div>
      </div>
    </header>
  );
}
