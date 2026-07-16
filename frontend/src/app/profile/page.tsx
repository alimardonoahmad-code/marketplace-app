'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut, Package, Heart, Settings, Store, ShoppingBag,
  Shield, ChevronRight, Bell, MessageCircle, Moon, Sun, Monitor,
  MapPin, Mail, Phone, BadgeCheck, Sparkles, Save,
} from 'lucide-react';
import clsx from 'clsx';
import api from '@/lib/api';
import { useAuthStore, useAppStore } from '@/store/auth';
import { useThemeStore, applyTheme, ThemeMode } from '@/store/theme';
import { getStoreLocation, getStoreName } from '@/lib/store-utils';
import { isSeller, getLoginUrl, getRegisterUrl } from '@/lib/auth-utils';
import { BRAND } from '@/lib/brand-theme';
import BrandLogo from '@/components/layout/BrandLogo';
import toast from 'react-hot-toast';

const ROLE_LABELS: Record<string, string> = {
  seller: 'Фурӯшанда',
  buyer: 'Харидор',
  admin: 'Админ',
  courier: 'Курьер',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const { setMode } = useAppStore();
  const { mode: themeMode, setMode: setThemeMode } = useThemeStore();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name, phone: user.phone || '', address: user.address || '' });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      updateUser(res.data.data);
      toast.success('Профил нав карда шуд!');
      setEditMode(false);
    } catch {
      toast.error('Хатогӣ');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="pb-8 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
        <section className="ozon-promo-bar">
          <div className="app-container relative py-10 text-center">
            <div className="mx-auto flex flex-col items-center justify-center gap-3">
              <BrandLogo size="hero" href="/" />
              <p className="text-white/90 text-xs font-semibold tracking-wide uppercase">
                Marketplace
              </p>
            </div>
            <h1 className="text-2xl font-black mt-4">Меҳмон</h1>
            <p className="text-white/80 text-sm mt-2 max-w-sm mx-auto">
              Шумо бе ворид шавӣ дар маркетплейс гардиш мекунед. Email танҳо барои харид ё кушодани мағоза лозим аст.
            </p>
          </div>
        </section>
        <div className="app-container py-6 space-y-4">
          <Link href={getLoginUrl('/profile')} className="btn-primary w-full inline-flex justify-center">
            <LogOut className="h-4 w-4 rotate-180" /> Ворид шавед
          </Link>
          <Link href={getRegisterUrl('/profile')} className="btn-outline-brand w-full inline-flex justify-center">
            Бақайд гиред
          </Link>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/products" className="card p-4 text-center card-hover">
              <ShoppingBag className="h-6 w-6 text-success mx-auto" />
              <p className="text-xs font-bold mt-2">Маҳсулот</p>
            </Link>
            <Link href="/stores" className="card p-4 text-center card-hover">
              <Store className="h-6 w-6 text-success mx-auto" />
              <p className="text-xs font-bold mt-2">Мағозаҳо</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userIsSeller = isSeller(user);
  const storeName = getStoreName(user);
  const storeLocation = getStoreLocation(user);

  const quickLinks = [
    { icon: Package, label: 'Фармоиш', href: '/orders' },
    { icon: Heart, label: 'Дӯстдошта', href: '/wishlist' },
    { icon: Bell, label: 'Огоҳиҳо', href: '/notifications' },
    { icon: MessageCircle, label: 'Паёмҳо', href: '/chat' },
  ];

  const menuItems = [
    ...(userIsSeller ? [
      { icon: Store, label: 'Мағозаи ман', sub: storeName, href: `/stores/${user.id}` },
      { icon: Settings, label: 'Маълумоти мағоза', sub: 'Суроға, ном, тавсиф', href: '/seller/store' },
      { icon: Sparkles, label: 'Режими фурӯш', sub: 'Dashboard фурӯш', action: () => { setMode('sell'); router.push('/sell'); } },
    ] : [
      { icon: Store, label: 'Фурӯшанда шавед', sub: 'Мағоза кушоед', action: () => { setMode('sell'); router.push('/sell'); } },
    ]),
    { icon: ShoppingBag, label: 'Режими харид', sub: 'Ба маркетплейс', action: () => { setMode('shop'); router.push('/'); } },
    ...(user.role === 'admin' ? [
      { icon: Shield, label: 'Admin Panel', sub: 'Идоракунӣ', href: 'http://localhost:3002' },
    ] : []),
  ];

  return (
    <div className="pb-8 bg-[#F5F7FA] dark:bg-surface-dark min-h-screen">
      {/* Hero */}
      <section className="ozon-promo-bar">
        <div className="app-container relative py-8 lg:py-10">
          <div className="flex flex-col items-center sm:flex-row sm:items-center gap-5">
            <div className="relative shrink-0">
              <BrandLogo size="hero" href={null} />
              {userIsSeller && (
                <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-soft">
                  <BadgeCheck className="h-4 w-4 text-success" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <span className="badge bg-white/20 text-white text-[10px] backdrop-blur-sm">
                {ROLE_LABELS[user.role] || user.role}
              </span>
              <h1 className="text-2xl lg:text-3xl font-black mt-2 truncate">{user.name}</h1>
              <p className="text-white/85 text-sm flex items-center justify-center sm:justify-start gap-1.5 mt-1 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" /> {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditMode(!editMode)}
              className="shrink-0 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/25 rounded-xl px-4 h-10 text-sm font-semibold transition-colors self-center sm:self-center"
            >
              <Settings className="h-4 w-4" />
              {editMode ? 'Бекор' : 'Таҳрир'}
            </button>
          </div>
        </div>
      </section>

      {/* Quick links — floating */}
      <div className="app-container -mt-5 relative z-10">
        <div className="grid grid-cols-4 gap-2">
          {quickLinks.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              className="card p-3 flex flex-col items-center gap-2 card-hover shadow-[0_2px_8px_rgba(0,26,52,0.04)] bg-white dark:bg-surface-dark-secondary border border-[#E8ECF2] dark:border-border-dark group"
            >
              <div className={clsx('icon-box h-10 w-10 rounded-xl group-hover:scale-110 transition-transform', BRAND.iconSoft)}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary dark:text-gray-300 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="app-container py-6 space-y-6">
        {/* Edit form / info */}
        {editMode ? (
          <form onSubmit={handleSubmit} className="card p-5 space-y-4 animate-fade-up">
            <h2 className="section-title flex items-center gap-2">
              <Settings className="h-5 w-5 text-success" /> Таҳрири профил
            </h2>
            <div>
              <label className="text-xs font-semibold text-text-muted">Ном</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input mt-1" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted">Телефон</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input mt-1" placeholder="+992 90 000 0000" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted">Суроға</label>
              <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input mt-1 min-h-[80px]" placeholder="Душанбе, кӯчаи..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              <Save className="h-4 w-4" />
              {loading ? 'Сабт мешавад...' : 'Сабт кардан'}
            </button>
          </form>
        ) : (
          <div className="card p-5">
            <h2 className="section-title mb-3">Маълумоти шахсӣ</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary dark:bg-surface-dark-secondary">
                <Phone className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-[10px] text-text-muted font-semibold">Телефон</p>
                  <p className="text-sm font-bold">{user.phone || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary dark:bg-surface-dark-secondary">
                <MapPin className="h-5 w-5 text-success shrink-0" />
                <div>
                  <p className="text-[10px] text-text-muted font-semibold">Суроға</p>
                  <p className="text-sm font-bold truncate">{user.address || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu grid */}
        <section>
          <h2 className="section-title mb-3">Идоракунӣ</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {menuItems.map(({ icon: Icon, label, sub, href, action }) => {
              const content = (
                <div className="card p-4 flex items-center gap-4 card-hover group h-full">
                  <div className={clsx('icon-box h-12 w-12 rounded-xl shrink-0 group-hover:scale-105 transition-transform', BRAND.iconSoft)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-text dark:text-white group-hover:text-primary transition-colors">{label}</p>
                    {sub && <p className="text-2xs text-text-muted truncate mt-0.5">{sub}</p>}
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-muted shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              );
              if (href) return <Link key={label} href={href}>{content}</Link>;
              return (
                <button key={label} type="button" onClick={action} className="w-full text-left">
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {/* Theme */}
        <div className="card p-5">
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" /> Мавзӯъ
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: 'light' as ThemeMode, icon: Sun, label: 'Равшан' },
              { id: 'dark' as ThemeMode, icon: Moon, label: 'Торик' },
              { id: 'system' as ThemeMode, icon: Monitor, label: 'Система' },
            ]).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => { setThemeMode(id); applyTheme(id); }}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl text-xs font-semibold transition-all',
                  themeMode === id
                    ? 'bg-primary-50 text-primary ring-2 ring-primary/30 dark:bg-primary/20'
                    : 'bg-surface-secondary text-text-secondary hover:bg-primary-50/50 dark:bg-surface-dark-secondary',
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => { logout(); router.push('/login'); }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-danger/20 text-danger font-bold text-sm hover:bg-danger-50 dark:hover:bg-danger/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Баромад аз ҳисоб
        </button>
      </div>
    </div>
  );
}
