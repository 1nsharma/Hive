import React, { useState } from 'react';
import { UserProfile, Shop, PrivilegedActionResult } from '../types/database';
import { 
  ShieldAlert, 
  Server, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lock, 
  Play, 
  FileText,
  Clock,
  Key
} from 'lucide-react';

interface PrivilegedActionStudioProps {
  currentUser: UserProfile;
  currentShop: Shop;
  onActionCompleted: () => void;
}

export const PrivilegedActionStudio: React.FC<PrivilegedActionStudioProps> = ({
  currentUser,
  currentShop,
  onActionCompleted,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('shop.update_stripe_payout');
  const [payoutSchedule, setPayoutSchedule] = useState<'daily' | 'weekly' | 'manual'>('daily');
  const [stripeAccountId, setStripeAccountId] = useState<string>('acct_stripe_prod_9981');
  const [memberRole, setMemberRole] = useState<'owner' | 'staff'>('staff');
  const [loading, setLoading] = useState<boolean>(false);
  const [browserResult, setBrowserResult] = useState<any>(null);
  const [serverResult, setServerResult] = useState<PrivilegedActionResult | null>(null);

  const privilegedOperations = [
    {
      id: 'shop.update_stripe_payout',
      title: 'Update Stripe Financial Payout Route',
      target: `shop:${currentShop.id}:billing`,
      minRole: 'Shop Owner or Super Admin',
      description: 'Changes banking payout frequency and merchant Stripe Connect routing destination.',
    },
    {
      id: 'member.invite_or_promote',
      title: 'Elevate / Invite Store Member Role',
      target: `shop:${currentShop.id}:memberships`,
      minRole: 'Shop Owner or Super Admin',
      description: 'Grants store administrative privileges to another user account.',
    },
    {
      id: 'shop.change_plan',
      title: 'Override Tenant Subscription Tier',
      target: `shop:${currentShop.id}:tier`,
      minRole: 'Operations or Super Admin',
      description: 'Upgrades tenant plan to enterprise with custom billing overrides.',
    },
    {
      id: 'security.emergency_tenant_lock',
      title: 'Emergency Tenant Quarantine Lockdown',
      target: `shop:${currentShop.id}:status`,
      minRole: 'Operations or Super Admin',
      description: 'Immediately suspends store operations and freezes payment gateways.',
    },
  ];

  const currentOp = privilegedOperations.find((op) => op.id === selectedAction) || privilegedOperations[0];

  // Vector A: Direct Browser Attempt (simulates client-side direct DB bypass)
  const handleDirectBrowserAttempt = async () => {
    setLoading(true);
    setBrowserResult(null);
    setServerResult(null);

    try {
      const res = await fetch('/api/security/simulate-direct-browser-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackType: selectedAction === 'shop.update_stripe_payout' ? 'direct_payout_steal' : 'tamper_audit_logs',
        }),
      });

      const data = await res.json();
      setBrowserResult(data);
    } catch (err: any) {
      setBrowserResult({ error: err.message, status: 500 });
    } finally {
      setLoading(false);
    }
  };

  // Vector B: Server-Side Next.js Route Handler using service_role
  const handleServerRouteHandler = async () => {
    setLoading(true);
    setBrowserResult(null);
    setServerResult(null);

    let payload: Record<string, unknown> = {};
    if (selectedAction === 'shop.update_stripe_payout') {
      payload = { payout_schedule: payoutSchedule, stripe_account_id: stripeAccountId };
    } else if (selectedAction === 'member.invite_or_promote') {
      payload = { role: memberRole, target_user_id: 'usr-customer-001', permissions: ['products.write', 'orders.read'] };
    } else if (selectedAction === 'shop.change_plan') {
      payload = { plan: 'enterprise', reason: 'Annual Enterprise Agreement Executed' };
    } else if (selectedAction === 'security.emergency_tenant_lock') {
      payload = { reason: 'Suspected chargeback fraud anomaly detected' };
    }

    try {
      const res = await fetch('/api/privileged-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: selectedAction,
          target: currentOp.target,
          shopId: currentShop.id,
          payload,
        }),
      });

      const data = await res.json();
      setServerResult({
        ...data,
        actor_id: currentUser.id,
        action: selectedAction,
        target: currentOp.target,
        timestamp: new Date().toISOString(),
      });
      onActionCompleted();
    } catch (err: any) {
      setServerResult({
        success: false,
        message: err.message,
        actor_id: currentUser.id,
        action: selectedAction,
        target: currentOp.target,
        timestamp: new Date().toISOString(),
        executionMode: 'server_service_role',
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
              <Lock className="h-4 w-4 text-indigo-400" />
              Privileged Actions & Service Role Security Studio
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Compare direct browser access (which is rejected by PostgreSQL RLS) against verified server-side route handlers using the <code className="text-indigo-300 font-mono">service_role</code> key.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800">
            Active: <span className="text-indigo-400 font-medium">{currentUser.full_name}</span> ({currentUser.system_role})
          </div>
        </div>
      </div>

      {/* Action Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {privilegedOperations.map((op) => {
          const isSelected = selectedAction === op.id;
          return (
            <button
              key={op.id}
              onClick={() => {
                setSelectedAction(op.id);
                setBrowserResult(null);
                setServerResult(null);
              }}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-zinc-800 border-indigo-500/80 ring-1 ring-indigo-500/40'
                  : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-900'
              }`}
            >
              <div className="text-xs font-semibold text-zinc-200 mb-1">{op.title}</div>
              <div className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-2">
                {op.description}
              </div>
              <div className="text-[10px] font-mono text-indigo-400/90 flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span>Required: {op.minRole}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Operation Configuration Box */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-200">{currentOp.title}</span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-zinc-400">Target: {currentOp.target}</span>
          </div>
          <span className="text-zinc-500 font-mono">Tenant ID: {currentShop.id}</span>
        </div>

        {/* Dynamic payload fields */}
        {selectedAction === 'shop.update_stripe_payout' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-zinc-400 mb-1">Stripe Connected Account ID</label>
              <input
                type="text"
                value={stripeAccountId}
                onChange={(e) => setStripeAccountId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Payout Frequency</label>
              <select
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="daily">Daily Automatic</option>
                <option value="weekly">Weekly Friday Batch</option>
                <option value="manual">Manual Merchant Hold</option>
              </select>
            </div>
          </div>
        )}

        {selectedAction === 'member.invite_or_promote' && (
          <div className="pt-1">
            <label className="block text-zinc-400 mb-1">Grant Membership Role</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="memRole"
                  checked={memberRole === 'staff'}
                  onChange={() => setMemberRole('staff')}
                  className="accent-indigo-500"
                />
                <span>Staff Member (Scoped Inventory & Orders)</span>
              </label>
              <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="memRole"
                  checked={memberRole === 'owner'}
                  onChange={() => setMemberRole('owner')}
                  className="accent-indigo-500"
                />
                <span>Store Co-Owner (Full Financial & Team Authority)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Dual Execution Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card A: Direct Browser Attempt */}
        <div className="bg-zinc-950 border border-zinc-800/90 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-rose-400" />
                <h3 className="text-xs font-semibold text-zinc-200">
                  Vector A: Direct Browser Client Attempt
                </h3>
              </div>
              <span className="text-[11px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Untrusted Client
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Simulates client code attempting direct elevation or writing straight to Postgres using the public Anon Key.
            </p>

            <div className="bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300 mb-4 overflow-x-auto">
              <div className="text-zinc-500">// Direct browser execution (unauthorized elevation)</div>
              <div>await supabase.from('shops')</div>
              <div className="pl-4">.update({`{ settings: { stripe_id: '...' } }`})</div>
              <div className="pl-4">.eq('id', '{currentShop.id}')</div>
            </div>
          </div>

          <div>
            <button
              onClick={handleDirectBrowserAttempt}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Simulate Direct Browser Elevation</span>
            </button>
          </div>
        </div>

        {/* Card B: Server-Side Route Handler */}
        <div className="bg-zinc-950 border border-indigo-500/40 rounded-xl p-5 flex flex-col justify-between ring-1 ring-indigo-500/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-semibold text-zinc-200">
                  Vector B: Server-Side Next.js Route Handler
                </h3>
              </div>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                service_role Key
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Routes via Next.js Route Handler: validates session JWT, enforces role check, executes via <code className="text-indigo-300 font-mono">service_role</code>, and writes immutable audit log.
            </p>

            <div className="bg-zinc-900/90 p-3 rounded-lg border border-zinc-800 text-[11px] font-mono text-zinc-300 mb-4 overflow-x-auto">
              <div className="text-zinc-500">// Server-side Route Handler with Audit Log</div>
              <div>POST /api/privileged-action</div>
              <div className="text-zinc-400 pl-4">{`{ action: '${selectedAction}', target: '${currentOp.target}' }`}</div>
              <div className="text-indigo-400/90 pl-4">➔ Logs actor_id, action, target, timestamp</div>
            </div>
          </div>

          <div>
            <button
              onClick={handleServerRouteHandler}
              disabled={loading}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Execute via Server Route (service_role)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Execution Results Inspector */}
      {browserResult && (
        <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-5 text-xs animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-rose-900/40 mb-3">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <XCircle className="h-4 w-4 text-rose-400" />
              <span>Direct Browser Elevation Blocked by PostgreSQL RLS</span>
            </div>
            <span className="font-mono text-rose-400 text-xs">
              HTTP {browserResult.status || 403} {browserResult.errorCode ? `[PG: ${browserResult.errorCode}]` : ''}
            </span>
          </div>

          <div className="space-y-2 text-zinc-300">
            <div>
              <span className="text-zinc-500 font-mono">Violation Error:</span>{' '}
              <span className="font-mono text-rose-300">{browserResult.error}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono">Policy Enforced:</span>{' '}
              <span className="text-zinc-200">{browserResult.ruleEnforced}</span>
            </div>
            <div>
              <span className="text-zinc-500 font-mono">Simulated SQL:</span>{' '}
              <code className="bg-zinc-950 px-2 py-0.5 rounded text-zinc-400 font-mono">
                {browserResult.simulatedSql}
              </code>
            </div>
          </div>
        </div>
      )}

      {serverResult && (
        <div
          className={`border rounded-xl p-5 text-xs animate-in fade-in ${
            serverResult.success
              ? 'bg-emerald-950/20 border-emerald-900/50'
              : 'bg-amber-950/20 border-amber-900/50'
          }`}
        >
          <div
            className={`flex items-center justify-between pb-3 border-b mb-3 ${
              serverResult.success ? 'border-emerald-900/40' : 'border-amber-900/40'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-semibold ${
                serverResult.success ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {serverResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-amber-400" />
              )}
              <span>
                {serverResult.success
                  ? 'Server-Side Action Executed & Audit Trail Logged'
                  : 'Server-Side RBAC Guard Blocked Action'}
              </span>
            </div>
            <span className="font-mono text-zinc-400">
              Execution Mode: {serverResult.executionMode}
            </span>
          </div>

          {serverResult.success ? (
            <div className="space-y-2 text-zinc-300">
              <div className="text-emerald-300">{serverResult.message}</div>
              {serverResult.auditLog && (
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-1 font-mono text-[11px]">
                  <div className="text-zinc-500">// Generated Immutable Audit Record:</div>
                  <div>
                    <span className="text-zinc-500">id:</span> {serverResult.auditLog.id}
                  </div>
                  <div>
                    <span className="text-zinc-500">actor_id:</span>{' '}
                    <span className="text-indigo-400">{serverResult.auditLog.actor_id}</span> ({serverResult.auditLog.actor_role})
                  </div>
                  <div>
                    <span className="text-zinc-500">action:</span>{' '}
                    <span className="text-amber-400">{serverResult.auditLog.action}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">target:</span> {serverResult.auditLog.target}
                  </div>
                  <div>
                    <span className="text-zinc-500">timestamp:</span>{' '}
                    <span className="text-cyan-400">{serverResult.auditLog.timestamp}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-amber-300 font-mono">
              Error: {serverResult.error || serverResult.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
