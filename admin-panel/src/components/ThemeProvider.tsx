'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/auth';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dark = useThemeStore((s) => s.dark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return <>{children}</>;
}
