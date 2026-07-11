import clsx from 'clsx';

const STYLES: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  paid: 'bg-emerald-500/10 text-emerald-400',
  delivered: 'bg-emerald-500/10 text-emerald-400',
  inactive: 'bg-red-500/10 text-red-400',
  rejected: 'bg-red-500/10 text-red-400',
  cancelled: 'bg-red-500/10 text-red-400',
  failed: 'bg-red-500/10 text-red-400',
  pending: 'bg-amber-500/10 text-amber-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  packed: 'bg-indigo-500/10 text-indigo-400',
  shipped: 'bg-purple-500/10 text-purple-400',
  buyer: 'bg-slate-500/10 text-slate-300',
  seller: 'bg-blue-500/10 text-blue-400',
  admin: 'bg-red-500/10 text-red-400',
  courier: 'bg-orange-500/10 text-orange-400',
};

export default function AdminBadge({ children, status }: { children: React.ReactNode; status?: string }) {
  const style = status ? STYLES[status.toLowerCase()] || 'bg-slate-700 text-slate-300' : 'bg-slate-700 text-slate-300';
  return (
    <span className={clsx('inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize', style)}>
      {children}
    </span>
  );
}
