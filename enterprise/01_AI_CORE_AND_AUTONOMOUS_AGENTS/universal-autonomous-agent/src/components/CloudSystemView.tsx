import React from 'react';
import { 
  Cloud, 
  Cpu, 
  Database, 
  Key, 
  ShieldCheck, 
  HardDrive, 
  Activity, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Layers,
  Lock
} from 'lucide-react';
import { CloudSystemState } from '../types';

interface CloudSystemViewProps {
  cloudState: CloudSystemState;
}

export const CloudSystemView: React.FC<CloudSystemViewProps> = ({
  cloudState
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                Cloud Architecture & Vector Memory
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Cloud Run Port 3000 Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-tenant container infrastructure, semantic memory vector store, and zero-trust credential vault.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Cloud Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vector Footprint</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {cloudState.vectorMemoryTokens.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 block">
            Indexed tokens across episodic & semantic graph
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Documents Indexed</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-300 font-mono">
            {cloudState.indexedDocumentsCount} docs
          </p>
          <span className="text-[11px] text-slate-500 block">
            Source papers, commits, transcripts, and posts
          </span>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Compute Load</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-emerald-400 font-mono">
              {cloudState.computeLoadPercentage}%
            </p>
            <span className="text-xs text-slate-400">vCPU container</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all" 
              style={{ width: `${cloudState.computeLoadPercentage}%` }} 
            />
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Persistent Storage</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-mono">
            {cloudState.storageUsedMb} <span className="text-xs text-slate-400 font-normal">/ {cloudState.storageLimitMb} MB</span>
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all" 
              style={{ width: `${(cloudState.storageUsedMb / cloudState.storageLimitMb) * 100}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Cloud Workloads & Daemon Containers */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          Active Workload Daemons
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cloudState.activeWorkloads.map((workload) => (
            <div
              key={workload.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700/60 p-3.5 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="font-semibold text-white">{workload.name}</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[10px] border border-slate-700">
                  {workload.runtime}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500 block text-[10px]">CPU:</span>
                  <span className="text-slate-200 font-mono">{workload.cpuUsage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RAM:</span>
                  <span className="text-slate-200 font-mono">{workload.memoryUsage}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">UPTIME:</span>
                  <span className="text-slate-200 font-mono">{workload.uptime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials & Vault Tokens */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Zero-Trust Credentials Vault
          </h3>
          <span className="text-xs text-slate-400">
            {cloudState.credentialsVault.length} Connected Gateways
          </span>
        </div>

        <div className="space-y-3">
          {cloudState.credentialsVault.map((cred) => (
            <div
              key={cred.id}
              className="bg-slate-800/40 rounded-xl border border-slate-700/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{cred.service}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                    {cred.authType.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {cred.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {cred.scopes.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500 shrink-0">
                <span>Verified: {cred.lastRotated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
