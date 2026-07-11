'use client';

import Link from 'next/link';
import { LogIn, UserPlus, ShoppingBag, Store, Sparkles } from 'lucide-react';
import { getLoginUrl, getRegisterUrl } from '@/lib/auth-utils';

interface AuthPromptProps {
  title: string;
  description: string;
  nextPath: string;
  icon?: 'buy' | 'sell' | 'default';
}

export default function AuthPrompt({ title, description, nextPath, icon = 'default' }: AuthPromptProps) {
  const Icon = icon === 'buy' ? ShoppingBag : icon === 'sell' ? Store : Sparkles;

  return (
    <div className="app-container py-10">
      <div className="card p-8 text-center max-w-md mx-auto animate-scale-in">
        <div className="icon-box h-20 w-20 bg-gradient-nav text-white mx-auto shadow-float rounded-3xl">
          <Icon className="h-10 w-10" />
        </div>
        <h1 className="text-xl font-black mt-6 text-text dark:text-white">{title}</h1>
        <p className="text-text-secondary mt-2 text-sm leading-relaxed">{description}</p>
        <p className="text-2xs text-text-muted mt-3">
          Бе ворид шавӣ метавонед маҳсулот ва мағозаҳоро тамошо кунед
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <Link href={getLoginUrl(nextPath)} className="btn-primary w-full inline-flex">
            <LogIn className="h-4 w-4" /> Ворид шавед
          </Link>
          <Link href={getRegisterUrl(nextPath)} className="btn-outline-brand w-full inline-flex">
            <UserPlus className="h-4 w-4" /> Бақайд гиред
          </Link>
        </div>
      </div>
    </div>
  );
}
