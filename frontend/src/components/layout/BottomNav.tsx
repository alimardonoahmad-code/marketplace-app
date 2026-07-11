'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useCartStore, useAppStore } from '@/store/auth';
import { isSeller } from '@/lib/auth-utils';
import { AppIcon, type IconName } from '@/components/icons';
import clsx from 'clsx';

const HIDE_NAV = ['/login', '/register'];

interface NavItem {
  href: string;
  icon: IconName;
  label: string;
  badge?: number;
  accent?: boolean;
}

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { mode } = useAppStore();

  if (HIDE_NAV.some((p) => pathname.startsWith(p))) return null;

  const isSellMode = mode === 'sell';
  const userIsSeller = isSeller(user);

  const shopNav: NavItem[] = [
    { href: '/', icon: 'home', label: 'Асосӣ' },
    { href: '/stores', icon: 'store', label: 'Мағозаҳо' },
    { href: '/products', icon: 'search', label: 'Ҷустуҷӯ' },
    { href: '/cart', icon: 'cart', label: 'Сабад', badge: itemCount },
    { href: '/profile', icon: 'profile', label: 'Профил' },
  ];

  const sellNavBuyer: NavItem[] = [
    { href: '/', icon: 'home', label: 'Асосӣ' },
    { href: '/products', icon: 'search', label: 'Харид' },
    { href: '/sell', icon: 'sparkles', label: 'Фурӯш', accent: true },
    { href: '/seller/analytics', icon: 'analytics', label: 'Stats' },
    { href: '/profile', icon: 'profile', label: 'Профил' },
  ];

  const sellNavSeller: NavItem[] = [
    { href: '/sell', icon: 'store', label: 'Dashboard' },
    { href: '/seller/products', icon: 'product', label: 'Маҳсулот' },
    { href: '/seller/products/new', icon: 'add', label: 'Илова', accent: true },
    { href: '/seller/orders', icon: 'orders', label: 'Фармоиш' },
    { href: '/profile', icon: 'profile', label: 'Профил' },
  ];

  const nav = isSellMode
    ? (userIsSeller ? sellNavSeller : sellNavBuyer)
    : shopNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass pb-[env(safe-area-inset-bottom,0px)] lg:hidden" aria-label="Навигатсияи асосӣ">
      <div className="app-container">
        <div className="flex items-center justify-around h-[4rem]">
          {nav.map(({ href, icon, label, badge, accent }) => {
            const active = pathname === href || (href !== '/' && href !== '/sell' && pathname.startsWith(href));
            const isAccentSell = accent && !userIsSeller && isSellMode;

            if (isAccentSell) {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => router.push('/sell')}
                  aria-label={label}
                  className="relative flex flex-col items-center justify-center gap-0.5 min-w-[3.25rem] py-1"
                >
                  <div className="icon-box h-11 w-11 -mt-4 bg-gradient-nav text-white shadow-float rounded-card">
                    <AppIcon name={icon} size="default" variant="inherit" className="text-white" aria-hidden />
                  </div>
                  <span className="text-2xs font-semibold text-text-secondary mt-0.5">{label}</span>
                </button>
              );
            }

            return (
              <Link
                key={href + label}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className="relative flex flex-col items-center justify-center gap-0.5 min-w-[3.25rem] py-1 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {accent ? (
                  <div className="icon-box h-11 w-11 -mt-4 bg-gradient-nav text-white shadow-float rounded-card">
                    <AppIcon name={icon} size="default" variant="inherit" className="text-white" aria-hidden />
                  </div>
                ) : (
                  <AppIcon
                    name={icon}
                    context="nav"
                    variant={active ? 'primary' : 'default'}
                    active={active}
                  />
                )}
                <span className={clsx(
                  'text-2xs font-semibold',
                  active ? 'nav-active-label' : 'text-text-secondary',
                  accent && 'mt-0.5',
                )}>
                  {label}
                </span>
                {badge !== undefined && badge > 0 && (
                  <span className="absolute top-0 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
