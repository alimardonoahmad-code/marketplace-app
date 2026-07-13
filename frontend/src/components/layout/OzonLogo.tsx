import Link from 'next/link';
import clsx from 'clsx';

export default function OzonLogo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Link href="/" className={clsx('inline-flex items-center shrink-0 group', className)}>
      <span
        className={clsx(
          'font-black tracking-tight text-primary leading-none',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl sm:text-2xl',
          size === 'lg' && 'text-2xl sm:text-3xl',
        )}
      >
        Market
      </span>
    </Link>
  );
}
