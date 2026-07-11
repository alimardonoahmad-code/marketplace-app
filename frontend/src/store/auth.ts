import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { syncApiToken } from '@/lib/api';

export type AppMode = 'shop' | 'sell';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        syncApiToken(token);
        set({ user, token });
      },
      updateUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        syncApiToken(null);
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'auth-storage' },
  ),
);

interface CartState {
  itemCount: number;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  setItemCount: (count) => set({ itemCount: count }),
}));

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'shop',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'shop' ? 'sell' : 'shop' }),
    }),
    { name: 'app-mode' },
  ),
);
