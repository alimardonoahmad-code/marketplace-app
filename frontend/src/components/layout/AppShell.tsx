'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import AuthSync from './AuthSync';
import PwaRegister from '@/components/PwaRegister';
import PwaInstallBanner from '@/components/PwaInstallBanner';
import { WishlistProvider } from '@/hooks/useWishlist';
import { useAppStore } from '@/store/auth';

const SELL_ROUTES = ['/sell', '/seller'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setMode } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onRejection = (event: PromiseRejectionEvent) => {
      const status = (event.reason as { response?: { status?: number } })?.response?.status;
      if (status === 403 || status === 401) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', onRejection);
    return () => window.removeEventListener('unhandledrejection', onRejection);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onSellRoute = SELL_ROUTES.some((r) => pathname.startsWith(r));
    const skip = pathname.startsWith('/login') || pathname.startsWith('/register')
      || pathname.startsWith('/admin') || pathname.startsWith('/courier');
    if (skip) return;
    setMode(onSellRoute ? 'sell' : 'shop');
  }, [pathname, setMode, mounted]);

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/courier');

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-secondary dark:bg-surface-dark">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isAdminPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <WishlistProvider>
      <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-surface-dark">
        <AuthSync />
        <PwaRegister />
        <PwaInstallBanner />
        <TopBar />
        <main className="flex-1 safe-bottom app-main-with-header">{children}</main>
        <BottomNav />
      </div>
    </WishlistProvider>
  );
}
