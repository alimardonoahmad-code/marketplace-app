import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { syncApiToken } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (user.role !== 'admin') throw new Error('Access denied');
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        syncApiToken(token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        syncApiToken(null);
        set({ user: null, token: null });
      },
    }),
    { name: 'admin-auth-storage' },
  ),
);

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: true,
      toggle: () => set({ dark: !get().dark }),
    }),
    { name: 'admin-theme' },
  ),
);
