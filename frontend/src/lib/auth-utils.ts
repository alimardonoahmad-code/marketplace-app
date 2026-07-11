import { User } from '@/types';

/** Redirect to login only when needed — with return URL */
export function getLoginUrl(nextPath = '/'): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export function getRegisterUrl(nextPath = '/'): string {
  return `/register?next=${encodeURIComponent(nextPath)}`;
}

export function getAuthNextPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname + window.location.search;
}

/** Фурӯшанда ё admin — ҳамаи корбарони нав ҳам харидор, ҳам фурӯшанда */
export function isSeller(user: User | null | undefined): boolean {
  return user?.role === 'seller' || user?.role === 'admin';
}

export function canBuy(user: User | null | undefined): boolean {
  return !!user && user.role !== 'courier';
}

export function getApiErrorMessage(error: unknown, fallback = 'Хатогӣ'): string {
  const err = error as { response?: { data?: { message?: string | string[] } } };
  const msg = err.response?.data?.message;
  if (Array.isArray(msg)) return msg[0] || fallback;
  return msg || fallback;
}
