import Link from 'next/link';
import clsx from 'clsx';

export default function OzonLogo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Link href="/" className={clsx('inline-flex items-center gap-1.5 shrink-0 group', className)}>
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-xl bg-primary text-white font-black shadow-soft transition-transform group-hover:scale-[1.02]',
          size === 'sm' && 'h-8 w-8 text-sm',
          size === 'md' && 'h-9 w-9 sm:h-10 sm:w-10 text-base',
          size === 'lg' && 'h-11 w-11 text-lg',
        )}
      >
        M
      </span>
      <span
        className={clsx(
          'font-black tracking-tight text-primary leading-none',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl sm:text-2xl',
          size === 'lg' && 'text-2xl sm:text-3xl',
        )}
      >
        ARKET
      </span>
    </Link>
  );
}
