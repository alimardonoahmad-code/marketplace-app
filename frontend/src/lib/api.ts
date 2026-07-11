import axios from 'axios';

const SERVER_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'
).replace(/\/api\/?$/, '');

/** API URL — дар браузер тавассути Next.js proxy (/api), дар сервер — мустақим */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '';
  }
  return SERVER_API_BASE;
}

let cachedToken: string | null | undefined;

export function syncApiToken(token: string | null) {
  cachedToken = token;
}

export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api';
  }
  return `${SERVER_API_BASE}/api`;
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiUrl();
  if (typeof window !== 'undefined') {
    if (cachedToken === undefined) {
      cachedToken = localStorage.getItem('token');
    }
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === 'undefined') return Promise.reject(error);

    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      cachedToken = null;
    }

    if (status === 403) {
      error.handled = true;
    }

    return Promise.reject(error);
  },
);

export default api;

export function getImageUrl(path?: string): string {
  if (!path || path.trim() === '') return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `/uploads/${path.replace(/^\/+/, '')}`;
}

export const CURRENCY_SYMBOL = 'смн';

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (!Number.isFinite(num)) return `0 ${CURRENCY_SYMBOL}`;
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
  return `${formatted} ${CURRENCY_SYMBOL}`;
}

export function getDiscountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100);
}
