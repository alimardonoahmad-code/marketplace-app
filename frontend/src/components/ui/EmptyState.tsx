import { AppIcon, type IconName } from '@/components/icons';
import Link from 'next/link';

interface EmptyStateProps {
  icon: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon, title, description, actionLabel, actionHref, onAction,
}: EmptyStateProps) {
  return (
    <div className="card p-10 text-center animate-scale-in">
      <div className="icon-box h-20 w-20 bg-surface-secondary text-text-muted mx-auto rounded-card mb-5 dark:bg-surface-dark">
        <AppIcon name={icon} size="hero" variant="default" aria-hidden />
      </div>
      <h3 className="text-lg font-bold text-text dark:text-gray-100">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary mt-2 max-w-xs mx-auto">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6 inline-flex">{actionLabel}</Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <button type="button" onClick={onAction} className="btn-primary mt-6">{actionLabel}</button>
      )}
    </div>
  );
}
