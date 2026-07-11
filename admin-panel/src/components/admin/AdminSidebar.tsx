'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, Store, Package, ShoppingCart, FolderTree,
  Ticket, Star, Settings, ScrollText, LogOut, Moon, Sun, Menu, X,
  CreditCard, Truck, Bell, Layout, MessageSquare, BarChart3, FileText, Shield,
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuthStore, useThemeStore } from '@/store/auth';

const MARKETPLACE_URL = process.env.NEXT_PUBLIC_MARKETPLACE_URL || 'http://localhost:3000';

const NAV = [
  { href: '/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/users', label: 'Корбарон', icon: Users },
  { href: '/sellers', label: 'Фурӯшандагон', icon: Store },
  { href: '/products', label: 'Маҳсулот', icon: Package },
  { href: '/orders', label: 'Фармоишҳо', icon: ShoppingCart },
  { href: '/payments', label: 'Пардохтҳо', icon: CreditCard },
  { href: '/delivery', label: 'Доставка', icon: Truck },
  { href: '/categories', label: 'Категорияҳо', icon: FolderTree },
  { href: '/coupons', label: 'Промокодҳо', icon: Ticket },
  { href: '/reviews', label: 'Баҳогузориҳо', icon: Star },
  { href: '/cms', label: 'CMS', icon: Layout },
  { href: '/support', label: 'Дастгирӣ', icon: MessageSquare },
  { href: '/notifications', label: 'Огоҳинома', icon: Bell },
  { href: '/reports', label: 'Ҳисоботҳо', icon: FileText },
  { href: '/analytics', label: 'Аналитика', icon: BarChart3 },
  { href: '/roles', label: 'Ролҳо', icon: Shield },
  { href: '/settings', label: 'Танзимот', icon: Settings },
  { href: '/logs', label: 'Журнал', icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { dark, toggle } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white">
        <Menu className="h-5 w-5" />
      </button>
      {open && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-slate-950 border-r border-slate-800 transition-transform lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <div>
            <p className="text-lg font-black text-white tracking-tight">MARKET</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="lg:hidden text-slate-400"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60')}>
                <Icon className="h-4 w-4 shrink-0" />{label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="px-3 py-2">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <button type="button" onClick={toggle} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {dark ? 'Режими равшан' : 'Режими торик'}
          </button>
          <a href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800">
            → Marketplace
          </a>
          <button type="button" onClick={() => { logout(); router.push('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-950/30">
            <LogOut className="h-4 w-4" /> Баромад
          </button>
        </div>
      </aside>
    </>
  );
}
