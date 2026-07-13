'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useAuthStore, useCartStore, useAppStore } from '@/store/auth';
import { isSeller } from '@/lib/auth-utils';
import clsx from 'clsx';

const HIDE_NAV = ['/login', '/register'];

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
  badge?: number;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { itemCount } = useCartStore();
  const { mode } = useAppStore();

  if (HIDE_NAV.some((p) => pathname.startsWith(p))) return null;

  const isSellMode = mode === 'sell';
  const userIsSeller = isSeller(user);

  const shopNav: NavItem[] = [
    { href: '/', icon: Home, label: 'Асосӣ' },
    { href: '/categories', icon: Search, label: 'Каталог' },
    { href: '/wishlist', icon: Heart, label: 'Дӯст' },
    { href: '/cart', icon: ShoppingBag, label: 'Сабад', badge: itemCount },
    { href: '/profile', icon: User, label: 'Профил' },
  ];

  const sellNav: NavItem[] = userIsSeller
    ? [
        { href: '/sell', icon: Home, label: 'Dashboard' },
        { href: '/seller/products', icon: Search, label: 'Маҳсулот' },
        { href: '/seller/orders', icon: ShoppingBag, label: 'Фармоиш' },
        { href: '/profile', icon: User, label: 'Профил' },
      ]
    : [
        { href: '/', icon: Home, label: 'Асосӣ' },
        { href: '/products', icon: Search, label: 'Харид' },
        { href: '/sell', icon: ShoppingBag, label: 'Фурӯш' },
        { href: '/profile', icon: User, label: 'Профил' },
      ];

  const nav = isSellMode ? sellNav : shopNav;

  return (
    <nav
      className="app-chrome-bottom fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-[#E8ECF2] pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
      aria-label="Навигатсияи асосӣ"
    >
      <div className="flex items-stretch justify-around h-[3.25rem]">
        {nav.map(({ href, icon: Icon, label, badge }) => {
          const active = pathname === href
            || (href !== '/' && href !== '/sell' && pathname.startsWith(href));

          return (
            <Link
              key={href + label}
              href={href}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 pt-1"
            >
              <Icon
                className={clsx(
                  'h-[1.35rem] w-[1.35rem] transition-colors',
                  active ? 'text-[#005BFF]' : 'text-[#8B95A5]',
                )}
                strokeWidth={active ? 2.25 : 1.75}
                fill={active && Icon === Heart ? '#005BFF' : 'none'}
              />
              <span
                className={clsx(
                  'text-[10px] leading-none',
                  active ? 'font-semibold text-[#005BFF]' : 'font-medium text-[#8B95A5]',
                )}
              >
                {label}
              </span>
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-0.5 right-[calc(50%-1.25rem)] flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F91155] px-1 text-[9px] font-bold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
