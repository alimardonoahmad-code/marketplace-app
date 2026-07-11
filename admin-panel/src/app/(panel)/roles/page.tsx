'use client';

import { Shield, Check } from 'lucide-react';

const ROLES = [
  { id: 'admin', label: 'Super Admin', perms: ['read', 'create', 'update', 'delete', 'approve', 'export', 'settings'] },
  { id: 'manager', label: 'Manager', perms: ['read', 'create', 'update', 'approve'] },
  { id: 'support', label: 'Support', perms: ['read', 'update'] },
  { id: 'moderator', label: 'Moderator', perms: ['read', 'approve', 'delete'] },
  { id: 'accountant', label: 'Accountant', perms: ['read', 'export'] },
];

const ALL_PERMS = ['read', 'create', 'update', 'delete', 'approve', 'export', 'settings'];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Ролҳо ва иҷозатҳо</h1>
        <p className="text-slate-400 text-sm mt-1">RBAC — идоракунии дастрасӣ</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="text-left p-4">Рол</th>
              {ALL_PERMS.map((p) => <th key={p} className="p-4 text-center capitalize">{p}</th>)}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role) => (
              <tr key={role.id} className="border-b border-slate-800/50">
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />{role.label}
                </td>
                {ALL_PERMS.map((p) => (
                  <td key={p} className="p-4 text-center">
                    {role.perms.includes(p) ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
