'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppIcon, type IconName } from '@/components/icons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  icon?: IconName;
  badge?: React.ReactNode;
}

export default function SectionHeader({
  title, subtitle, href, linkLabel = 'Ҳама', icon, badge,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <div className="flex items-center gap-2">
          {icon && <AppIcon name={icon} size="default" variant="primary" aria-hidden />}
          <h2 className="section-title">{title}</h2>
          {badge}
        </div>
        {subtitle && <p className="section-subtitle mt-0.5">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-primary text-xs font-bold flex items-center gap-0.5 hover:gap-1.5 transition-all shrink-0"
        >
          {linkLabel} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
