import React from 'react';
import { Shield, Database, Lock, Server, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { UserProfile, Shop } from '../types/database';

interface HeaderProps {
  user: UserProfile;
  shop: Shop;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  passedCount?: number;
  totalTests?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  shop,
  activeTab,
  setActiveTab,
  passedCount = 12,
  totalTests = 12,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Merchant Dashboard', badge: 'MRC' },
    { id: 'staff', label: 'Staff Portal /staff', badge: 'MRC-04' },
    { id: 'admin-approvals', label: 'Admin Approvals /admin/approvals', badge: 'AUTH' },
    { id: 'menu', label: 'Public Menu /s/[slug]', badge: 'ORD-01' },
    { id: 'tracking', label: 'Live Tracking /o/[id]', badge: 'ORD-07' },
    { id: 'test-payments', label: 'Payment Risk & Webhook Lab', badge: 'RSK' },
    { id: 'overview', label: 'Architecture & Boundary' },
    { id: 'privileged-studio', label: 'Privileged Actions Studio' },
    { id: 'audit-logs', label: 'Audit Log Stream' },
    { id: 'multi-tenant', label: 'Multi-Tenant Data & RBAC' },
    { id: 'test-suite', label: 'RLS Security Suite' },
    { id: 'schema-sql', label: 'Postgres Schema & SQL' },
    { id: 'nextjs-code', label: 'Next.js 14 Handlers' },
  ];

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Project Info */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-zinc-100 tracking-tight">
                  Aether Commerce Engine
                </h1>
                <span className="text-xs font-mono text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  M03: Payment Verification & Fraud Engine
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs text-zinc-400">GCP Cloud Run + Cloud SQL</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Next.js 14 App Router</span>
                <span aria-hidden="true">·</span>
                <span>Firestore Realtime</span>
                <span aria-hidden="true">·</span>
                <span>Cloud Storage Bucket</span>
                <span aria-hidden="true">·</span>
                <span>58mm Thermal KOT</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Tenant Context */}
          <div className="flex items-center gap-4 text-xs">
            {/* Active Tenant Context */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Layers className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-zinc-500">Tenant:</span>
              <span className="font-medium text-zinc-200">{shop.name}</span>
              <span className="font-mono text-zinc-500 text-[11px]">({shop.slug})</span>
            </div>

            {/* Active Actor Role */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-500">Actor:</span>
              <span className="font-medium text-zinc-200">{user.full_name}</span>
              <span className="font-mono text-indigo-400 uppercase text-[10px] tracking-wide">
                [{user.system_role}]
              </span>
            </div>

            {/* Security Suite Status */}
            <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-mono text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>RLS Enforced ({passedCount}/{totalTests})</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Functional interactive segmented bar) */}
        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {tab.id === 'test-suite' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
