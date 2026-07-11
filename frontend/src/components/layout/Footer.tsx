import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-secondary dark:bg-surface-dark-secondary border-t border-border dark:border-border-dark mt-8">
      <div className="app-container py-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="icon-box h-8 w-8 bg-gradient-primary text-white rounded-lg text-xs font-bold">M</div>
          <span className="font-bold text-text dark:text-gray-100">Market</span>
        </div>
        <p className="text-sm text-text-secondary max-w-md">
          Premium marketplace — харид ва фурӯш бо сифати ҷаҳонӣ. Минимал, зуд, бехатар.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-sm">
          {[
            { label: 'Маҳсулот', href: '/products' },
            { label: 'Категорияҳо', href: '/categories' },
            { label: 'Фурӯш', href: '/sell' },
            { label: 'Профил', href: '/profile' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="text-text-secondary hover:text-primary transition-colors font-medium">
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark flex items-center justify-between text-2xs text-text-muted">
          <span>© 2026 Market. Premium Marketplace Platform.</span>
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
    </footer>
  );
}
