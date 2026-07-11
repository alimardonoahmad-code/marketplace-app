'use client';

import { useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

const PROFILE_SYNC_KEY = 'auth-profile-synced';
const PROFILE_SYNC_TTL_MS = 5 * 60 * 1000;

/** Sync user role from server so localStorage never shows stale seller/buyer state */
export default function AuthSync() {
  const { token, user, updateUser, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const lastSync = sessionStorage.getItem(PROFILE_SYNC_KEY);
    if (lastSync && Date.now() - Number(lastSync) < PROFILE_SYNC_TTL_MS) return;

    api.get('/auth/profile')
      .then((res) => {
        updateUser(res.data.data);
        sessionStorage.setItem(PROFILE_SYNC_KEY, String(Date.now()));
      })
      .catch(() => {
        if (!user) logout();
      });
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
