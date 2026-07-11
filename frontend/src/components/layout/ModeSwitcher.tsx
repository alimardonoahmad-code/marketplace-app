'use client';

import { useRouter } from 'next/navigation';
import { useAppStore, useAuthStore } from '@/store/auth';
import { AppIcon, type IconName } from '@/components/icons';
import clsx from 'clsx';

interface ModeSwitcherProps {
  compact?: boolean;
  className?: string;
}

export default function ModeSwitcher({ compact, className }: ModeSwitcherProps) {
  const router = useRouter();
  const { mode, setMode } = useAppStore();
  const { user } = useAuthStore();
  const isShop = mode === 'shop';

  const goShop = () => {
    setMode('shop');
    router.replace('/');
  };
  const goSell = () => {
    setMode('sell');
    router.replace('/sell');
  };

  if (compact) {
    return (
      <div className={clsx('flex rounded-xl bg-surface-secondary p-0.5 gap-0.5 dark:bg-surface-dark-secondary', className)} role="tablist" aria-label="Режим">
        {([
          { id: 'shop', icon: 'shopping-bag' as IconName, label: 'Харид', active: isShop, onClick: goShop },
          { id: 'sell', icon: 'store' as IconName, label: 'Фурӯш', active: !isShop, onClick: goSell },
        ]).map(({ id, icon, label, active, onClick }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-2xs font-semibold transition-all duration-200',
              active ? 'bg-primary-50 text-primary shadow-soft dark:bg-primary/20 dark:text-primary-300' : 'text-text-secondary hover:scale-105 active:scale-95',
            )}
          >
            <AppIcon name={icon} size="sm" variant={active ? 'primary' : 'default'} active={active} aria-hidden />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx('card p-1.5', className)}>
      <div className="grid grid-cols-2 gap-1.5">
        <button type="button" onClick={goShop} className={clsx(
          'flex flex-col items-center gap-2 rounded-card p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
          isShop ? 'bg-gradient-nav text-white shadow-soft' : 'hover:bg-surface-secondary text-text-secondary',
        )}>
          <AppIcon name="shopping-bag" size="standard" variant={isShop ? 'inherit' : 'default'} className={isShop ? 'text-white' : ''} aria-hidden />
          <div className="text-center">
            <p className="font-bold text-sm">Харид</p>
            <p className={clsx('text-2xs mt-0.5', isShop ? 'text-white/80' : 'text-text-muted')}>Маҳсулот харид кунед</p>
          </div>
        </button>
        <button type="button" onClick={goSell} className={clsx(
          'flex flex-col items-center gap-2 rounded-card p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
          !isShop ? 'bg-gradient-nav text-white shadow-soft' : 'hover:bg-surface-secondary text-text-secondary',
        )}>
          <AppIcon name="store" size="standard" variant={!isShop ? 'inherit' : 'default'} className={!isShop ? 'text-white' : ''} aria-hidden />
          <div className="text-center">
            <p className="font-bold text-sm">Фурӯш</p>
            <p className={clsx('text-2xs mt-0.5', !isShop ? 'text-white/80' : 'text-text-muted')}>
              {user ? 'Мағозаи худро идора кунед' : 'Фурӯшанда шавед'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
