'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef, Suspense, type RefObject } from 'react';
import { LayoutGrid, User, Package, Heart, ShoppingCart, MapPin, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore, useCartStore, useAppStore } from '@/store/auth';
import { getLoginUrl } from '@/lib/auth-utils';
import OzonSubNav from './OzonSubNav';
import OzonSearch from './OzonSearch';
import OzonLogo from './OzonLogo';
import OzonPromoBar from './OzonPromoBar';

const HIDE_NAV = ['/login', '/register'];

function useHeaderHeight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      document.documentElement.style.setProperty('--app-header-h', `${el.offsetHeight}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);
}

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
    <Suspense fallback={<header className="app-chrome-top h-14 border-b border-border/60" />}>
      <TopBarInner />
    </Suspense>
  );
}

function TopBarInner() {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { mode } = useAppStore();
  const [search, setSearch] = useState('');

  const isSell = mode === 'sell';

  useHeaderHeight(headerRef);

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
      <header ref={headerRef} className="app-chrome-top border-b border-border/60 shadow-soft">
        <div className="app-container flex h-14 items-center justify-between gap-3">
          <OzonLogo size="sm" />
          <span className="text-sm font-semibold text-text-secondary">Режими фурӯш</span>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            ← Харид
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header ref={headerRef} className="app-chrome-top shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      {/* Mobile — мисли Ozon */}
      <div className="lg:hidden bg-primary">
        <div className="app-container pt-2.5 pb-3">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-white text-sm font-semibold"
              aria-label="Шаҳр"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span>Душанбе</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>
            {user ? (
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#001A34] px-3.5 py-2 text-xs font-bold text-white"
              >
                <User className="h-3.5 w-3.5" />
                {user.name.split(' ')[0]}
              </Link>
            ) : (
              <Link
                href={getLoginUrl('/')}
                className="inline-flex items-center rounded-xl bg-[#001A34] px-4 py-2 text-xs font-bold text-white"
              >
                Ворид шавед
              </Link>
            )}
          </div>
          <OzonSearch
            value={search}
            onChange={setSearch}
            onSubmit={onSearch}
            placeholder="Искать на Market"
            showExtras
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block bg-white border-b border-border/60">
        <OzonPromoBar />
        <div className="app-container">
          <div className="flex items-center gap-2 sm:gap-3 py-2 lg:py-2.5">
            <OzonLogo />
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-4 h-11 text-sm font-bold hover:bg-primary-600 transition-colors shrink-0 shadow-[0_2px_8px_rgba(0,91,255,0.25)]"
            >
              <LayoutGrid className="h-5 w-5" strokeWidth={2} />
              Каталог
            </Link>
            <OzonSearch
              value={search}
              onChange={setSearch}
              onSubmit={onSearch}
              placeholder="Искать на Market"
              className="flex-1 max-w-3xl"
            />
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <HeaderAction
                href={user ? '/profile' : getLoginUrl('/profile')}
                icon={User}
                label={user ? 'Профил' : 'Ворид'}
              />
              {user && (
                <HeaderAction href="/orders" icon={Package} label="Фармоиш" className="hidden md:flex" />
              )}
              <HeaderAction href="/wishlist" icon={Heart} label="Дӯст" />
              <HeaderAction href="/cart" icon={ShoppingCart} label="Сабад" badge={itemCount} />
            </div>
          </div>
        </div>
        <OzonSubNav />
      </div>
    </header>
  );
}
