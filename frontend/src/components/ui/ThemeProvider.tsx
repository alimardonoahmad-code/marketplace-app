'use client';

import { useEffect } from 'react';
import { useThemeStore, applyTheme } from '@/store/theme';

export default function ThemeProvider() {
  const { mode } = useThemeStore();

  useEffect(() => {
    applyTheme(mode);
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  return null;
}
