'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Store, Sparkles, Percent, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const LINKS = [
  { href: '/products?hasDiscount=true', label: 'Тахфифҳо', icon: Percent },
  { href: '/stores', label: 'Мағозаҳо', icon: Store },
  { href: '/products?sortBy=createdAt&sortOrder=DESC', label: 'Нав', icon: Sparkles },
  { href: '/sell', label: 'Фурӯш', icon: TrendingUp },
];

export default function OzonSubNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isActive = (href: string) => {
    const [path, query] = href.split('?');
    if (!pathname.startsWith(path)) return false;
    if (!query) return pathname === path || pathname.startsWith(path);
    const expected = new URLSearchParams(query);
    let match = true;
    expected.forEach((value, key) => {
      if (searchParams.get(key) !== value) match = false;
    });
    return match;
  };

  return (
    <nav className={clsx('border-t border-[#E8ECF2] bg-white dark:bg-surface-dark-secondary dark:border-border-dark', className)}>
      <div className="app-container">
        <ul className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-2">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href} className="shrink-0">
                <Link
                  href={href}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                    active
                      ? 'text-primary font-semibold bg-primary-50'
                      : 'text-text-secondary hover:text-primary hover:bg-primary-50/60',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
