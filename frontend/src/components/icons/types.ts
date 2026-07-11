/** Icon sizes per TZ §3 */
export type IconSize = 'sm' | 'default' | 'standard' | 'lg' | 'hero';

export const ICON_SIZE_PX: Record<IconSize, number> = {
  sm: 16,
  default: 20,
  standard: 24,
  lg: 28,
  hero: 32,
};

export const ICON_SIZE_CLASS: Record<IconSize, string> = {
  sm: 'icon-sm',
  default: 'icon-default',
  standard: 'icon-standard',
  lg: 'icon-lg',
  hero: 'icon-hero',
};

/** Icon color variants per TZ §4 */
export type IconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'disabled'
  | 'inherit';

export const ICON_VARIANT_CLASS: Record<IconVariant, string> = {
  default: 'icon-variant-default',
  primary: 'icon-variant-primary',
  secondary: 'icon-variant-secondary',
  success: 'icon-variant-success',
  warning: 'icon-variant-warning',
  danger: 'icon-variant-danger',
  disabled: 'icon-variant-disabled',
  inherit: '',
};

/** Context presets per TZ §3 */
export type IconContext =
  | 'nav'
  | 'sidebar'
  | 'button'
  | 'card'
  | 'dashboard'
  | 'inline';

export const ICON_CONTEXT_SIZE: Record<IconContext, IconSize> = {
  nav: 'standard',
  sidebar: 'default',
  button: 'default',
  card: 'default',
  dashboard: 'standard',
  inline: 'default',
};

/** Special animation types per TZ §5 */
export type IconAnimation =
  | 'none'
  | 'favorite'
  | 'notification'
  | 'cart'
  | 'loading'
  | 'success'
  | 'delete';

export const ICON_ANIMATION_CLASS: Record<IconAnimation, string> = {
  none: '',
  favorite: 'icon-anim-favorite',
  notification: 'icon-anim-bell',
  cart: 'icon-anim-cart',
  loading: 'icon-anim-spin',
  success: 'icon-anim-success',
  delete: 'icon-anim-fade',
};
