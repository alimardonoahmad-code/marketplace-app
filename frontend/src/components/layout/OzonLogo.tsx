import Link from 'next/link';
import clsx from 'clsx';

export default function OzonLogo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Link href="/" className={clsx('inline-flex items-center gap-2 shrink-0 group', className)}>
      <span
        className={clsx(
          'relative overflow-hidden rounded-xl bg-white border border-[#E8ECF2] shadow-sm shrink-0',
          size === 'sm' && 'h-8 w-8',
          size === 'md' && 'h-9 w-9 sm:h-10 sm:w-10',
          size === 'lg' && 'h-11 w-11',
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/market-logo.png"
          alt="Marketplace"
          className="h-full w-full object-contain p-0.5"
        />
      </span>
      <span
        className={clsx(
          'font-black tracking-tight leading-none',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl sm:text-2xl',
          size === 'lg' && 'text-2xl sm:text-3xl',
        )}
      >
        <span className="text-[#0B1B2B]">Market</span>
        <span className="text-[#FF7A00]">place</span>
      </span>
    </Link>
  );
}
