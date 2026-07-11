'use client';

import Link from 'next/link';
import {
  PlusCircle, Package, BarChart3, Store, TrendingUp,
  ShoppingBag, ArrowRight, type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

export interface QuickAction {
  id: string;
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  sub?: string;
  badge?: number;
  gradient: string;
  highlight?: boolean;
}

interface SellQuickActionsProps {
  actions: QuickAction[];
}

export default function SellQuickActions({ actions }: SellQuickActionsProps) {
  const renderAction = (action: QuickAction, className?: string) => {
    const inner = (
      <>
        <div className={clsx(
          'icon-box shrink-0 text-white bg-gradient-to-br transition-transform group-hover:scale-110',
          action.highlight ? 'h-12 w-12 lg:h-11 lg:w-11 shadow-glow' : 'h-11 w-11 lg:h-10 lg:w-10',
          action.gradient,
        )}>
          <action.icon className={clsx(action.highlight ? 'h-6 w-6 lg:h-5 lg:w-5' : 'h-5 w-5')} strokeWidth={2} />
        </div>
        {action.badge !== undefined && action.badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
            {action.badge > 9 ? '9+' : action.badge}
          </span>
        )}
      </>
    );

    const labelBlock = (
      <span className="text-[10px] lg:text-xs font-bold text-text dark:text-gray-200 text-center leading-tight line-clamp-2 mt-1.5 lg:mt-0 lg:text-left">
        {action.label}
      </span>
    );

    const desktopContent = (
      <>
        {inner}
        <div className="hidden lg:block min-w-0">
          <p className="font-bold text-sm text-text dark:text-white truncate">{action.label}</p>
          {action.sub && <p className="text-[10px] text-text-muted truncate">{action.sub}</p>}
        </div>
        <ArrowRight className="hidden lg:block h-4 w-4 text-text-muted shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all ml-auto" />
      </>
    );

    const mobileContent = (
      <>
        <div className="relative">{inner}</div>
        {labelBlock}
      </>
    );

    const baseClass = clsx(
      'group relative transition-all duration-200',
      className,
    );

    if (action.onClick) {
      return (
        <button type="button" onClick={action.onClick} className={baseClass}>
          <span className="lg:hidden flex flex-col items-center">{mobileContent}</span>
          <span className="hidden lg:flex items-center gap-3 w-full">{desktopContent}</span>
        </button>
      );
    }

    return (
      <Link href={action.href!} className={baseClass}>
        <span className="lg:hidden flex flex-col items-center">{mobileContent}</span>
        <span className="hidden lg:flex items-center gap-3 w-full">{desktopContent}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile — icon dock */}
      <div className="lg:hidden">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {actions.map((action) => renderAction(
            action,
            clsx(
              'flex flex-col items-center p-2 rounded-xl active:scale-95',
              action.highlight && 'bg-primary-50 dark:bg-primary/10',
            ),
          ))}
        </div>
      </div>

      {/* Desktop — top toolbar */}
      <div className="hidden lg:block">
        <div className="card p-2 shadow-card">
          <div className="grid grid-cols-3 xl:grid-cols-6 gap-1">
            {actions.map((action) => renderAction(
              action,
              clsx(
                'flex items-center gap-3 p-3 rounded-xl hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary card-hover',
                action.highlight && 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary/10 dark:to-secondary/10 ring-1 ring-primary/20',
              ),
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
