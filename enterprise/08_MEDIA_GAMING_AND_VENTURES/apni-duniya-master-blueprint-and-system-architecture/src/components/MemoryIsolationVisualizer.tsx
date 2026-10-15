import React, { useState } from 'react';
import { 
  Database, 
  Lock, 
  ShieldCheck, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Globe, 
  Users,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MemoryIsolationVisualizerProps {
  activeLanguage: 'en' | 'hi';
}

export const MemoryIsolationVisualizer: React.FC<MemoryIsolationVisualizerProps> = ({ activeLanguage }) => {
  const [testLeakSimulated, setTestLeakSimulated] = useState<boolean>(false);
  const [activeWorld, setActiveWorld] = useState<'private' | 'public' | 'community'>('private');

  const handleSimulateCrossDomainQuery = () => {
    setTestLeakSimulated(true);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-teal-950/40 to-stone-900 border border-teal-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              SECTION IV &bull; 3-WORLD DATA ISOLATION LAW
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? '3-लोक स्मृति पृथक्करण आर्किटेक्चर' : 'The 3-World Memory Isolation & Sovereignty Engine'}
          </h2>
          <p className="text-stone-300 text-sm">
            Core Invariant Rule: <code className="text-teal-300 font-mono bg-stone-950 px-2 py-0.5 rounded">User Private Data ≠ Public Data ≠ Community Data</code>. Cryptographically enforced zero-knowledge air-gap.
          </p>
        </div>

        <button
          id="simulate-leak-btn"
          onClick={handleSimulateCrossDomainQuery}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/20 transition-all flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Test Cross-Domain Firewall</span>
        </button>
      </div>

      {/* 3 Worlds Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WORLD 1: PRIVATE */}
        <div className={`p-6 rounded-2xl border transition-all ${
          activeWorld === 'private' ? 'bg-stone-900 border-teal-500 shadow-xl' : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
              WORLD 01
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Private World (User Data)
          </h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            Personalization, reading habits, custom notes, and bookmarks.
          </p>

          <div className="space-y-2 text-xs text-stone-300 bg-stone-950 p-3.5 rounded-xl border border-stone-800/80 font-mono">
            <div>&bull; Storage: <span className="text-teal-300">Client IndexedDB / SQLite</span></div>
            <div>&bull; Encryption: <span className="text-teal-300">AES-256-GCM (Client-Only)</span></div>
            <div>&bull; Telemetry: <span className="text-rose-400">0 KB Harvested</span></div>
            <div>&bull; Export: <span className="text-emerald-400">1-Click JSON/SQLite</span></div>
          </div>
        </div>

        {/* WORLD 2: PUBLIC */}
        <div className={`p-6 rounded-2xl border transition-all ${
          activeWorld === 'public' ? 'bg-stone-900 border-sky-500 shadow-xl' : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
              WORLD 02
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Public World (Sources & Metadata)
          </h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            Official gazettes, academic papers, economic indices, and open knowledge graphs.
          </p>

          <div className="space-y-2 text-xs text-stone-300 bg-stone-950 p-3.5 rounded-xl border border-stone-800/80 font-mono">
            <div>&bull; Storage: <span className="text-sky-300">Edge Distributed Graph (IPFS)</span></div>
            <div>&bull; Lineage: <span className="text-sky-300">SHA-256 Content Signatures</span></div>
            <div>&bull; Access: <span className="text-emerald-400">Public Read-Only API</span></div>
            <div>&bull; Auditing: <span className="text-amber-400">C2PA Verified</span></div>
          </div>
        </div>

        {/* WORLD 3: COMMUNITY */}
        <div className={`p-6 rounded-2xl border transition-all ${
          activeWorld === 'community' ? 'bg-stone-900 border-purple-500 shadow-xl' : 'bg-stone-900/60 border-stone-800'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
              WORLD 03
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            Community World (Lenses & Reviews)
          </h3>
          <p className="text-xs text-stone-400 mt-1 mb-4">
            Peer ratings, dispute logs, consensus tags, and collective intelligence.
          </p>

          <div className="space-y-2 text-xs text-stone-300 bg-stone-950 p-3.5 rounded-xl border border-stone-800/80 font-mono">
            <div>&bull; Storage: <span className="text-purple-300">Decentralized Dispute Ledger</span></div>
            <div>&bull; Privacy: <span className="text-purple-300">Zero-Knowledge Vote Proofs</span></div>
            <div>&bull; Governance: <span className="text-purple-300">Quadratic Guild Oversight</span></div>
            <div>&bull; Provenance: <span className="text-emerald-400">Author Cryptographic DID</span></div>
          </div>
        </div>
      </div>

      {/* Cross-Domain Attack Defense Log */}
      {testLeakSimulated && (
        <div className="p-6 rounded-2xl bg-stone-950 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Firewall Security Simulation: Cross-World Query Intercepted</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              DEFENSE SUCCESSFUL
            </span>
          </div>

          <div className="p-3 rounded-lg bg-stone-900 text-xs font-mono text-stone-300 space-y-1.5 overflow-x-auto">
            <div className="text-rose-400">INBOUND ATTEMPT: SELECT * FROM UserPrivateReadingHistory JOIN PublicAdBrokers;</div>
            <div className="text-emerald-400">✓ INTERCEPTED: Rule ARCH-SOUL-09 triggered (Memory Isolation Invariant).</div>
            <div>✓ ACTION: Query rejected at Database Proxy level with HTTP 403 Forbidden.</div>
            <div>✓ AUDIT: Incident logged to local tamper-evident security ledger. 0 bytes leaked.</div>
          </div>
        </div>
      )}
    </div>
  );
};
