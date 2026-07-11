'use client';

import clsx from 'clsx';
import { ICON_REGISTRY, ICON_LABELS, type IconName } from './registry';
import {
  type IconSize,
  type IconVariant,
  type IconContext,
  type IconAnimation,
  ICON_SIZE_PX,
  ICON_SIZE_CLASS,
  ICON_VARIANT_CLASS,
  ICON_CONTEXT_SIZE,
  ICON_ANIMATION_CLASS,
} from './types';

export interface AppIconProps {
  name: IconName;
  size?: IconSize;
  context?: IconContext;
  variant?: IconVariant;
  active?: boolean;
  animation?: IconAnimation;
  filled?: boolean;
  className?: string;
  label?: string;
  'aria-hidden'?: boolean;
}

/**
 * Premium Icon System — single wrapper for all Lucide icons.
 * TZ: Modern Outline, 2px stroke, optically centered, 24×24 grid.
 */
export default function AppIcon({
  name,
  size,
  context,
  variant = 'default',
  active = false,
  animation = 'none',
  filled = false,
  className,
  label,
  'aria-hidden': ariaHidden,
}: AppIconProps) {
  const LucideIcon = ICON_REGISTRY[name];
  if (!LucideIcon) return null;

  const resolvedSize = size ?? (context ? ICON_CONTEXT_SIZE[context] : 'standard');
  const px = ICON_SIZE_PX[resolvedSize];
  const ariaLabel = label ?? ICON_LABELS[name];

  return (
    <LucideIcon
      size={px}
      strokeWidth={2}
      aria-hidden={ariaHidden ?? !ariaLabel}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      className={clsx(
        'icon-base shrink-0',
        ICON_SIZE_CLASS[resolvedSize],
        active ? 'icon-variant-active' : ICON_VARIANT_CLASS[variant],
        ICON_ANIMATION_CLASS[animation],
        filled && name === 'favorite' && 'icon-filled',
        filled && name === 'wishlist' && 'icon-filled',
        className,
      )}
    />
  );
}

export { type IconName } from './registry';
