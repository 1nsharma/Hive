import React from 'react';
import { UserProfile, Shop, UserRole } from '../types/database';
import { UserCheck, Store, ShieldAlert, Key, Check, X, Info } from 'lucide-react';

interface IdentitySwitcherProps {
  currentUser: UserProfile;
  currentShop: Shop;
  users: UserProfile[];
  shops: Shop[];
  onSwitchUser: (userId: string) => void;
  onSwitchShop: (shopId: string) => void;
  isShopOwner: boolean;
  isOperations: boolean;
  isSuperAdmin: boolean;
}

export const IdentitySwitcher: React.FC<IdentitySwitcherProps> = ({
  currentUser,
  currentShop,
  users,
  shops,
  onSwitchUser,
  onSwitchShop,
  isShopOwner,
  isOperations,
  isSuperAdmin,
}) => {
  // Role descriptions
  const roleBadges: Record<UserRole, { label: string; desc: string; color: string }> = {
    customer: {
      label: 'Customer (Anon / Authenticated)',
      desc: 'Storefront browsing, customer order history only. Blocked from admin or shop management.',
      color: 'text-zinc-400 border-zinc-700'
    },
    merchant: {
      label: 'Merchant (Tenant Owner)',
      desc: 'Full control over owned shop (products, orders, staff invitations, billing via service_role).',
      color: 'text-indigo-400 border-indigo-500/40'
    },
    staff: {
      label: 'Staff (Store Employee)',
      desc: 'Scoped shop permissions (products, orders). Cannot modify billing, remove members, or view audit logs.',
      color: 'text-cyan-400 border-cyan-500/40'
    },
    operations: {
      label: 'Operations (Platform Ops)',
      desc: 'Platform-level support, cross-tenant auditing, customer support dispute resolution.',
      color: 'text-amber-400 border-amber-500/40'
    },
    super_admin: {
      label: 'Super Admin (Root Authority)',
      desc: 'Unrestricted global platform access, security overrides, global tenant administration.',
      color: 'text-rose-400 border-rose-500/40'
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Identity & Multi-Tenant Simulation Control
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              [JWT Context: {currentUser.id}]
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Switch actors to observe how PostgreSQL RLS dynamically restricts queries and how server-side route handlers enforce RBAC.
          </p>
        </div>

        {/* Quick Tenant Selector */}
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-zinc-400" />
          <span className="text-xs text-zinc-400">Target Tenant:</span>
          <select
            value={currentShop.id}
            onChange={(e) => onSwitchShop(e.target.value)}
            className="bg-zinc-950 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} [{s.status.toUpperCase()}] {s.is_internal_test ? '• 🧪 Internal' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actor Persona Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 mt-4">
        {users.map((u) => {
          const isSelected = u.id === currentUser.id;
          const badge = roleBadges[u.system_role];

          return (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u.id)}
              className={`text-left p-3 rounded-lg border transition-all relative ${
                isSelected
                  ? 'bg-zinc-800/90 border-indigo-500/80 ring-1 ring-indigo-500/40'
                  : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="text-xs font-semibold text-zinc-200 truncate">
                  {u.full_name.split(' (')[0]}
                </span>
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                {u.system_role}
              </div>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                {badge.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Effective Capabilities Matrix */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Key className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-300">Effective Capabilities for {currentUser.full_name}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {isShopOwner || isSuperAdmin ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <X className="h-3.5 w-3.5 text-zinc-600" />
            )}
            <span className={isShopOwner || isSuperAdmin ? 'text-zinc-200' : 'text-zinc-500'}>
              Shop Owner Privileges
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isShopOwner || isOperations || isSuperAdmin ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <X className="h-3.5 w-3.5 text-zinc-600" />
            )}
            <span className={isShopOwner || isOperations || isSuperAdmin ? 'text-zinc-200' : 'text-zinc-500'}>
              Audit Log SELECT
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {currentUser.system_role === 'merchant' || isSuperAdmin ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <X className="h-3.5 w-3.5 text-zinc-600" />
            )}
            <span className={currentUser.system_role === 'merchant' || isSuperAdmin ? 'text-zinc-200' : 'text-zinc-500'}>
              Provision New Tenant
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <X className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-zinc-400">
              Direct Browser Elevated Write <span className="text-rose-400 font-mono">(RLS BLOCKED)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
