'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { LayoutGrid, User, Package, Heart, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore, useCartStore, useAppStore } from '@/store/auth';
import { getLoginUrl } from '@/lib/auth-utils';
import OzonSubNav from './OzonSubNav';
import OzonSearch from './OzonSearch';

const HIDE_NAV = ['/login', '/register'];

function HeaderAction({
  href, icon: Icon, label, badge, className = '',
}: {
  href: string;
  icon: typeof User;
  label: string;
  badge?: number | boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx('flex flex-col items-center gap-0.5 min-w-[3rem] group', className)}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary group-hover:text-primary transition-colors">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
        {typeof badge === 'number' && badge > 0 && (
          <span className="icon-badge">{badge > 9 ? '9+' : badge}</span>
        )}
        {badge === true && <span className="icon-badge-dot" />}
      </span>
      <span className="text-[10px] font-medium text-text-secondary group-hover:text-primary hidden sm:block leading-tight text-center">
        {label}
      </span>
    </Link>
  );
}

export default function TopBar() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-50 h-14 bg-white border-b border-border/60" />}>
      <TopBarInner />
    </Suspense>
  );
}

function TopBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { mode } = useAppStore();
  const [search, setSearch] = useState('');

  const isSell = mode === 'sell';

  useEffect(() => {
    if (pathname.startsWith('/products')) {
      setSearch(searchParams.get('search') || '');
    } else if (pathname.startsWith('/stores')) {
      setSearch(searchParams.get('search') || '');
    }
  }, [pathname, searchParams]);

  if (HIDE_NAV.some((p) => pathname.startsWith(p))) return null;

  const onSearch = () => {
    const q = search.trim();
    if (pathname.startsWith('/products')) {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set('search', q);
      else params.delete('search');
      params.delete('page');
      router.replace(`/products?${params.toString()}`);
      return;
    }
    if (pathname.startsWith('/stores')) {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set('search', q);
      else params.delete('search');
      router.replace(params.toString() ? `/stores?${params.toString()}` : '/stores');
      return;
    }
    if (q) router.push(`/products?search=${encodeURIComponent(q)}`);
  };

  if (isSell) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-border/60 shadow-soft">
        <div className="app-container flex h-14 items-center justify-between gap-3">
          <Link href="/sell" className="text-xl font-black text-primary tracking-tight shrink-0">
            MARKET
          </Link>
          <span className="text-sm font-semibold text-text-secondary">Режими фурӯш</span>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Харид
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/60">
      {/* Row 1 — мисли Ozon */}
      <div className="app-container">
        <div className="flex items-center gap-2 sm:gap-3 py-2.5 lg:py-3">
          <Link href="/" className="shrink-0 group">
            <span className="text-xl sm:text-2xl font-black text-primary tracking-tighter group-hover:opacity-90 transition-opacity">
              MARKET
            </span>
          </Link>

          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-2 bg-primary text-white rounded-xl px-4 h-11 text-sm font-semibold hover:bg-primary-600 transition-colors shrink-0"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={2} />
            Каталог
          </Link>

          <OzonSearch
            value={search}
            onChange={setSearch}
            onSubmit={onSearch}
            placeholder="Ҷустуҷӯ дар Market..."
            className="flex-1 max-w-3xl"
          />

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <HeaderAction
              href={user ? '/profile' : getLoginUrl('/profile')}
              icon={User}
              label={user ? 'Профил' : 'Ворид'}
              className="hidden sm:flex"
            />
            {user && (
              <HeaderAction href="/orders" icon={Package} label="Фармоиш" className="hidden md:flex" />
            )}
            <HeaderAction href="/wishlist" icon={Heart} label="Дӯст" className="hidden sm:flex" />
            <HeaderAction href="/cart" icon={ShoppingCart} label="Сабад" badge={itemCount} className="hidden sm:flex" />
          </div>
        </div>

        {/* Mobile: catalog + search row */}
        <div className="flex sm:hidden gap-2 pb-2.5">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 bg-primary text-white rounded-xl px-3 h-10 text-xs font-semibold shrink-0"
          >
            <LayoutGrid className="h-4 w-4" />
            Каталог
          </Link>
        </div>
      </div>

      <OzonSubNav />
    </header>
  );
}
