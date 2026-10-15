import React, { useState } from 'react';
import { Database, FileCode, Copy, Check, Download, ShieldCheck, Key, Table } from 'lucide-react';

export const SchemaInspector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'tables' | 'policies' | 'sql'>('tables');

  const tables = [
    {
      name: 'shops',
      desc: 'Core multi-tenant entity representing storefronts and businesses',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Unique tenant shop identifier (gen_random_uuid())' },
        { name: 'name', type: 'TEXT', desc: 'Business brand name' },
        { name: 'slug', type: 'TEXT', key: 'UQ', desc: 'URL slug for storefront routing' },
        { name: 'owner_id', type: 'UUID', key: 'FK', desc: 'References profiles(id) on delete restrict' },
        { name: 'status', type: 'TEXT', desc: "'active' | 'suspended' | 'archived'" },
        { name: 'plan', type: 'TEXT', desc: "'starter' | 'growth' | 'enterprise'" },
        { name: 'currency', type: 'TEXT', desc: 'Default currency (USD, EUR, GBP)' },
        { name: 'settings', type: 'JSONB', desc: 'Tenant configurations (tax, stripe_account_id)' },
        { name: 'created_at', type: 'TIMESTAMPTZ', desc: 'Creation timestamp' },
      ],
      policies: [
        { type: 'SELECT', name: 'shops_select_public_policy', rule: "status = 'active' OR is_shop_member(id) OR is_operations_or_admin()" },
        { type: 'INSERT', name: 'shops_insert_policy', rule: "(current_user_role() = 'merchant' AND owner_id = auth.uid()) OR is_super_admin()" },
        { type: 'UPDATE', name: 'shops_update_policy', rule: 'is_shop_owner(id) OR is_super_admin()' },
        { type: 'DELETE', name: 'shops_delete_policy', rule: 'is_super_admin()' },
      ]
    },
    {
      name: 'profiles',
      desc: 'Application user profiles mirrored 1:1 with auth.users',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK & FK', desc: 'References auth.users(id) on delete cascade' },
        { name: 'email', type: 'TEXT', key: 'UQ', desc: 'User primary email address' },
        { name: 'full_name', type: 'TEXT', desc: 'User full display name' },
        { name: 'system_role', type: 'user_role', desc: "'customer' | 'merchant' | 'staff' | 'operations' | 'super_admin'" },
        { name: 'avatar_url', type: 'TEXT', desc: 'Optional avatar profile picture' },
        { name: 'created_at', type: 'TIMESTAMPTZ', desc: 'Creation timestamp' },
      ],
      policies: [
        { type: 'SELECT', name: 'profiles_select_policy', rule: 'id = auth.uid() OR is_operations_or_admin() OR shared_shop_membership' },
        { type: 'UPDATE', name: 'profiles_update_self_policy', rule: 'id = auth.uid() (Guards system_role changes: only service_role)' },
      ]
    },
    {
      name: 'memberships',
      desc: 'Multi-tenant shop membership associating users with shops (owner vs staff)',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Membership relationship identifier' },
        { name: 'shop_id', type: 'UUID', key: 'FK', desc: 'References shops(id) on delete cascade' },
        { name: 'user_id', type: 'UUID', key: 'FK', desc: 'References profiles(id) on delete cascade' },
        { name: 'role', type: 'membership_role', desc: "'owner' | 'staff'" },
        { name: 'permissions', type: 'TEXT[]', desc: "Array of granular permissions (e.g. ['products.write'])" },
        { name: 'invited_by', type: 'UUID', key: 'FK', desc: 'Actor that extended invitation' },
        { name: 'created_at', type: 'TIMESTAMPTZ', desc: 'Creation timestamp' },
      ],
      policies: [
        { type: 'SELECT', name: 'memberships_select_policy', rule: 'is_shop_member(shop_id) OR is_operations_or_admin()' },
        { type: 'INSERT', name: 'memberships_insert_policy', rule: 'is_shop_owner(shop_id) OR is_super_admin()' },
        { type: 'UPDATE', name: 'memberships_update_policy', rule: 'is_shop_owner(shop_id) OR is_super_admin()' },
        { type: 'DELETE', name: 'memberships_delete_policy', rule: '(is_shop_owner(shop_id) AND user_id != auth.uid()) OR is_super_admin()' },
      ]
    },
    {
      name: 'audit_logs',
      desc: 'Indelible record of privileged actions. Read-restricted, immutable, server-only write',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Audit entry UUID' },
        { name: 'actor_id', type: 'UUID', key: 'FK', desc: 'Actor user profile who initiated action' },
        { name: 'actor_role', type: 'TEXT', desc: 'Actor role at moment of execution' },
        { name: 'shop_id', type: 'UUID', key: 'FK', desc: 'Tenant shop UUID or null for platform-wide' },
        { name: 'action', type: 'TEXT', desc: "Privileged action verb (e.g. 'shop.update_billing')" },
        { name: 'target', type: 'TEXT', desc: "Resource target affected (e.g. 'shop:123')" },
        { name: 'metadata', type: 'JSONB', desc: 'Before/after diff payload and execution context' },
        { name: 'ip_address', type: 'TEXT', desc: 'Caller IP address' },
        { name: 'timestamp', type: 'TIMESTAMPTZ', desc: 'Indelible UTC event timestamp' },
      ],
      policies: [
        { type: 'SELECT', name: 'audit_logs_select_policy', rule: 'is_shop_owner(shop_id) OR is_operations_or_admin()' },
        { type: 'INSERT', name: 'audit_logs_insert_block_client', rule: 'WITH CHECK (false) -- BROWSER BLOCKED! Written ONLY via service_role' },
        { type: 'UPDATE', name: 'audit_logs_update_block_all', rule: 'USING (false) WITH CHECK (false) -- IMMUTABLE' },
        { type: 'DELETE', name: 'audit_logs_delete_block_all', rule: 'USING (false) -- IMMUTABLE' },
      ]
    },
    {
      name: 'products',
      desc: 'Tenant catalog items strictly bound by shop_id foreign key',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Product identifier' },
        { name: 'shop_id', type: 'UUID', key: 'FK', desc: 'Mandatory tenant partition foreign key' },
        { name: 'name', type: 'TEXT', desc: 'Item title' },
        { name: 'sku', type: 'TEXT', key: 'UQ', desc: 'Unique SKU per shop' },
        { name: 'price_cents', type: 'INTEGER', desc: 'Item price in cents (non-negative)' },
        { name: 'stock_quantity', type: 'INTEGER', desc: 'Current available inventory' },
        { name: 'is_published', type: 'BOOLEAN', desc: 'Visible on public storefront' },
      ],
      policies: [
        { type: 'SELECT', name: 'products_select_policy', rule: 'is_published = true OR is_shop_member(shop_id) OR is_operations_or_admin()' },
        { type: 'INSERT', name: 'products_insert_policy', rule: 'is_shop_member(shop_id) OR is_super_admin()' },
        { type: 'UPDATE', name: 'products_update_policy', rule: 'is_shop_member(shop_id) OR is_super_admin()' },
        { type: 'DELETE', name: 'products_delete_policy', rule: 'is_shop_owner(shop_id) OR is_super_admin()' },
      ]
    },
    {
      name: 'orders',
      desc: 'Customer purchases partitionable by tenant shop_id and customer_id',
      rlsEnabled: true,
      columns: [
        { name: 'id', type: 'UUID', key: 'PK', desc: 'Order identifier' },
        { name: 'shop_id', type: 'UUID', key: 'FK', desc: 'Mandatory tenant partition foreign key' },
        { name: 'customer_id', type: 'UUID', key: 'FK', desc: 'Buyer profile ID (or null for guest)' },
        { name: 'order_number', type: 'TEXT', key: 'UQ', desc: 'Human-readable order tracking number' },
        { name: 'total_cents', type: 'INTEGER', desc: 'Order total in cents' },
        { name: 'status', type: 'TEXT', desc: "'pending' | 'processing' | 'completed' | 'cancelled'" },
      ],
      policies: [
        { type: 'SELECT', name: 'orders_select_policy', rule: 'customer_id = auth.uid() OR is_shop_member(shop_id) OR is_operations_or_admin()' },
        { type: 'INSERT', name: 'orders_insert_policy', rule: 'customer_id = auth.uid() OR is_shop_member(shop_id) OR is_super_admin()' },
        { type: 'UPDATE', name: 'orders_update_policy', rule: 'is_shop_member(shop_id) OR is_operations_or_admin()' },
      ]
    }
  ];

  const rawMigrationSql = `-- ==============================================================================
-- MILESTONE 01: FOUNDATION & SECURITY - POSTGRESQL + SUPABASE RLS MIGRATION
-- Multi-Tenant Schema with Row Level Security (RLS) on all tables
-- ==============================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'merchant', 'staff', 'operations', 'super_admin');
CREATE TYPE membership_role AS ENUM ('owner', 'staff');

-- 2. SHOPS TABLE
CREATE TABLE public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    status TEXT NOT NULL DEFAULT 'active',
    plan TEXT NOT NULL DEFAULT 'starter',
    currency TEXT NOT NULL DEFAULT 'USD',
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. MEMBERSHIPS TABLE
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'staff',
    permissions TEXT[] NOT NULL DEFAULT ARRAY['products.read', 'orders.read'],
    invited_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_shop_user_membership UNIQUE (shop_id, user_id)
);

-- 4. AUDIT LOGS TABLE (IMMUTABLE, SERVER-ONLY INSERT)
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_role TEXT NOT NULL,
    shop_id UUID REFERENCES public.shops(id),
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ENABLE RLS ON ALL TABLES
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 6. AUDIT LOGS POLICIES
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (is_shop_owner(shop_id) OR is_operations_or_admin());

CREATE POLICY "audit_logs_insert_block_client" ON public.audit_logs
    FOR INSERT TO anon, authenticated
    WITH CHECK (false); -- BLOCK DIRECT CLIENT WRITES

CREATE POLICY "audit_logs_update_block_all" ON public.audit_logs
    FOR UPDATE TO anon, authenticated
    USING (false) WITH CHECK (false); -- IMMUTABLE

CREATE POLICY "audit_logs_delete_block_all" ON public.audit_logs
    FOR DELETE TO anon, authenticated
    USING (false); -- IMMUTABLE`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rawMigrationSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSql = () => {
    const blob = new Blob([rawMigrationSql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '20261009000000_milestone_01_foundation_security.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                PostgreSQL Multi-Tenant Schema & RLS Policy Catalog
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Production schema definition featuring mandatory <code className="text-emerald-300 font-mono">shop_id</code> foreign keys and Row Level Security on every table.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied SQL' : 'Copy Migration'}</span>
            </button>
            <button
              onClick={downloadSql}
              className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .sql</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveView('tables')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeView === 'tables' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Table className="h-3.5 w-3.5" />
            <span>Tables & Columns ({tables.length})</span>
          </button>
          <button
            onClick={() => setActiveView('policies')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeView === 'policies' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>RLS Security Policies</span>
          </button>
          <button
            onClick={() => setActiveView('sql')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeView === 'sql' ? 'bg-zinc-800 text-zinc-100 font-medium' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Raw SQL Migration</span>
          </button>
        </div>
      </div>

      {/* View 1: Tables & Columns */}
      {activeView === 'tables' && (
        <div className="grid grid-cols-1 gap-4">
          {tables.map((t) => (
            <div key={t.name} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-zinc-100 text-sm">{t.name}</span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span className="text-xs text-zinc-400">{t.desc}</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  RLS ACTIVE
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-zinc-500 text-[10px] uppercase border-b border-zinc-800/60">
                    <tr>
                      <th className="py-1.5 px-2">Column</th>
                      <th className="py-1.5 px-2">Type</th>
                      <th className="py-1.5 px-2">Constraint</th>
                      <th className="py-1.5 px-2 font-sans">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40 text-[11px]">
                    {t.columns.map((c) => (
                      <tr key={c.name} className="hover:bg-zinc-850/30">
                        <td className="py-1.5 px-2 font-medium text-zinc-200">{c.name}</td>
                        <td className="py-1.5 px-2 text-indigo-400">{c.type}</td>
                        <td className="py-1.5 px-2 text-amber-400 text-[10px]">{c.key || '-'}</td>
                        <td className="py-1.5 px-2 font-sans text-zinc-400">{c.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 2: RLS Policies Catalog */}
      {activeView === 'policies' && (
        <div className="space-y-4">
          {tables.map((t) => (
            <div key={t.name} className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
                <span className="font-mono text-sm font-semibold text-zinc-200">
                  Table: public.{t.name}
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  {t.policies.length} Policies Configured
                </span>
              </div>
              <div className="space-y-2">
                {t.policies.map((p, idx) => (
                  <div key={idx} className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-indigo-400 uppercase text-[10px] bg-indigo-500/10 px-1.5 py-0.5 rounded">
                          {p.type}
                        </span>
                        <span className="font-mono text-zinc-200 text-xs font-medium">
                          {p.name}
                        </span>
                      </div>
                    </div>
                    <code className="block text-[11px] font-mono text-zinc-400 overflow-x-auto bg-zinc-900 p-2 rounded border border-zinc-800/60">
                      {p.rule}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View 3: Raw SQL */}
      {activeView === 'sql' && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
          <pre className="text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
            {rawMigrationSql}
          </pre>
        </div>
      )}
    </div>
  );
};
