import axios from 'axios';

const SERVER_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api'
).replace(/\/api\/?$/, '');

export function getApiUrl(): string {
  if (typeof window !== 'undefined') return '/api';
  return `${SERVER_API_BASE}/api`;
}

let cachedToken: string | null | undefined;

export function syncApiToken(token: string | null) {
  cachedToken = token;
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiUrl();
  if (typeof window !== 'undefined') {
    if (cachedToken === undefined) cachedToken = localStorage.getItem('admin_token');
    if (cachedToken) config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === 'undefined') return Promise.reject(error);
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      cachedToken = null;
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;

export const CURRENCY_SYMBOL = 'смн';

export function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (!Number.isFinite(num)) return `0 ${CURRENCY_SYMBOL}`;
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(num)} ${CURRENCY_SYMBOL}`;
}
