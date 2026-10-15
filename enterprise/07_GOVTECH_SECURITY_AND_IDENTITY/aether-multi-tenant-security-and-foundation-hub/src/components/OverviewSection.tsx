import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  FileText, 
  Lock, 
  Server, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  AlertOctagon,
  KeyRound,
  Layers,
  Cpu
} from 'lucide-react';

export const OverviewSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Security Foundation Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-2">
            <span>SPECIFICATION COMPLIANCE</span>
            <span>·</span>
            <span>ENTERPRISE GRADE MULTI-TENANCY</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight mb-2">
            Milestone 01: Multi-Tenant Foundation & Security Architecture
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Engineered for bulletproof multi-tenant isolation with Supabase PostgreSQL Row Level Security (RLS), 
            hierarchical role-based access control, zero-trust server-side route handlers using the <code className="text-indigo-300 font-mono">service_role</code> key, 
            and an append-only immutable audit trail.
          </p>
        </div>
      </div>

      {/* Visual Architectural Diagram: Browser vs Service-Role Boundary */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              Security Architecture & Data Flow Boundary
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Strict isolation preventing direct browser database elevation and guaranteeing audit non-repudiation.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            Zero Direct Elevated DB Access
          </span>
        </div>

        {/* Diagram Flow Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 relative">
          {/* Node 1: Browser Client */}
          <div className="p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 relative">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs mb-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>1. Browser Client</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 space-y-1">
              <div>· Public Anon Key</div>
              <div>· User JWT Token</div>
              <div>· Read-only or scoped inserts</div>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              Direct elevated writes or audit log inserts are <span className="text-rose-400 font-medium">unconditionally blocked</span> by PostgreSQL RLS.
            </div>
          </div>

          {/* Node 2: Next.js 14 Route Handler */}
          <div className="p-4 rounded-lg bg-zinc-950/70 border border-indigo-500/40 relative ring-1 ring-indigo-500/20">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs mb-2">
              <Server className="h-4 w-4 text-indigo-400" />
              <span>2. Next.js Route Handler</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 space-y-1">
              <div>· <span className="text-indigo-300">/api/privileged-action</span></div>
              <div>· Session JWT validation</div>
              <div>· Strict RBAC authorization</div>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
              Only verified server handlers hold the secret <span className="text-indigo-400 font-mono">SUPABASE_SERVICE_ROLE_KEY</span>.
            </div>
          </div>

          {/* Node 3: Supabase Postgres */}
          <div className="p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 relative">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs mb-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <span>3. Supabase Postgres DB</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 space-y-1">
              <div>· Multi-tenant tables</div>
              <div>· Mandatory <span className="text-emerald-400">shop_id</span> foreign key</div>
              <div>· Active Row Level Security</div>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              RLS applies to all anon and user sessions. Service role safely executes verified operations.
            </div>
          </div>

          {/* Node 4: Immutable Audit Trail */}
          <div className="p-4 rounded-lg bg-zinc-950/70 border border-zinc-800 relative">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs mb-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>4. Immutable Audit Logs</span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 space-y-1">
              <div>· <span className="text-amber-300">actor_id</span>, <span className="text-amber-300">action</span></div>
              <div>· <span className="text-amber-300">target</span>, <span className="text-amber-300">timestamp</span></div>
              <div>· <span className="text-rose-400">WITH CHECK (false)</span></div>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              Zero client insert, update, or delete. Non-repudiation audit trail recorded on every privileged event.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">
                1. Multi-Tenant Schema & shop_id Isolation
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                All tenant entities (<code className="text-zinc-300 font-mono">products</code>, <code className="text-zinc-300 font-mono">orders</code>, <code className="text-zinc-300 font-mono">memberships</code>, <code className="text-zinc-300 font-mono">audit_logs</code>) feature a mandatory, indexed <code className="text-indigo-400 font-mono">shop_id UUID</code> foreign key.
              </p>
              <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Cascade deletion on shop tear-down</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Compound unique constraints (e.g. shop_id + sku, shop_id + user_id)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">
                2. 5 Distinct System Roles + Shop Membership RBAC
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Comprehensive separation of concerns across 5 roles:
              </p>
              <div className="mt-2 text-[11px] font-mono grid grid-cols-2 gap-1 text-zinc-300">
                <div>· <span className="text-zinc-400">customer</span> (anon or shopper)</div>
                <div>· <span className="text-indigo-300">merchant</span> (shop owner)</div>
                <div>· <span className="text-cyan-300">staff</span> (delegated member)</div>
                <div>· <span className="text-amber-300">operations</span> (platform support)</div>
                <div className="col-span-2">· <span className="text-rose-300">super_admin</span> (global root authority)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">
                3. Immutable Audit Logs Table
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Every privileged action writes an indelible entry: <code className="text-zinc-300 font-mono">actor_id</code>, <code className="text-zinc-300 font-mono">action</code>, <code className="text-zinc-300 font-mono">target</code>, and <code className="text-zinc-300 font-mono">timestamp</code>.
              </p>
              <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>RLS <code className="text-rose-400 font-mono">WITH CHECK (false)</code> blocks all client inserts</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span><code className="text-rose-400 font-mono">USING (false)</code> prevents UPDATE and DELETE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">
                4. Zero Direct Elevated Browser Access
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                The browser client receives ONLY the public Anon key and session JWT. Privileged operations are strictly routed through Next.js 14 Route Handlers with the <code className="text-indigo-400 font-mono">service_role</code> key.
              </p>
              <div className="mt-3 text-[11px] text-zinc-500 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Sensitive secrets never leak to the client bundle</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Server-side authorization verifies session before mutating data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
