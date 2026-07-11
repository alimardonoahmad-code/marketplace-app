'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { isSeller, getLoginUrl } from '@/lib/auth-utils';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      router.replace(getLoginUrl(pathname || '/sell'));
      return;
    }
    if (!isSeller(user)) {
      router.replace('/sell');
    }
  }, [user, router]);

  if (!user || !isSeller(user)) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
