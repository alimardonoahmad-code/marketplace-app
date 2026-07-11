'use client';

import clsx from 'clsx';
import AppIcon, { type IconName } from './AppIcon';
import type { IconSize, IconVariant, IconAnimation } from './types';

export interface IconButtonProps {
  name: IconName;
  label: string;
  onClick?: () => void;
  href?: string;
  size?: IconSize;
  variant?: IconVariant;
  active?: boolean;
  animation?: IconAnimation;
  badge?: number | boolean;
  disabled?: boolean;
  className?: string;
  as?: 'button' | 'link';
}

/**
 * Interactive icon with hover scale 105%, click scale 95%, 200ms transition.
 */
export default function IconButton({
  name,
  label,
  onClick,
  size = 'default',
  variant = 'default',
  active = false,
  animation = 'none',
  badge,
  disabled = false,
  className,
}: IconButtonProps) {
  const inner = (
    <>
      <AppIcon
        name={name}
        size={size}
        variant={active ? 'primary' : variant}
        active={active}
        animation={animation}
        aria-hidden
      />
      {badge !== undefined && badge !== false && (
        typeof badge === 'number' && badge > 0 ? (
          <span className="icon-badge">{badge > 9 ? '9+' : badge}</span>
        ) : badge === true ? (
          <span className="icon-badge-dot" />
        ) : null
      )}
    </>
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={clsx(
        'icon-btn',
        active && 'icon-btn-active',
        disabled && 'icon-btn-disabled',
        className,
      )}
    >
      {inner}
    </button>
  );
}
