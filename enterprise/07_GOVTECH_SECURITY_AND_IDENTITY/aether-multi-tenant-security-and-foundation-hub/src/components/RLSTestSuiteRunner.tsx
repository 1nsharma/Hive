import React, { useState } from 'react';
import { RLSTestCase } from '../types/database';
import { 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  Filter, 
  ChevronDown, 
  ChevronRight,
  Database,
  Lock,
  Layers
} from 'lucide-react';

interface RLSTestSuiteRunnerProps {
  tests: RLSTestCase[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    passRate: string;
    timestamp: string;
  };
  onRunTests: () => Promise<void>;
  loading: boolean;
}

export const RLSTestSuiteRunner: React.FC<RLSTestSuiteRunnerProps> = ({
  tests,
  summary,
  onRunTests,
  loading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Tests' },
    { id: 'Multi-Tenant Isolation', label: 'Multi-Tenant Isolation' },
    { id: 'Role Boundary', label: 'Role Boundary (RBAC)' },
    { id: 'Audit Log Protection', label: 'Audit Log Protection' },
    { id: 'Browser Bypass Prevention', label: 'Browser Bypass Prevention' },
  ];

  const filteredTests = tests.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="space-y-4">
      {/* Test Suite Summary Banner */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-zinc-100">
                Automated Row Level Security (RLS) & Multi-Tenant Verification Suite
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Live automated test runner validating PostgreSQL RLS enforcement, role boundaries, immutable audit logging, and direct browser elevation rejection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 font-mono text-xs">
              <span className="text-zinc-500">Pass Rate:</span>
              <span className="text-emerald-400 font-semibold">{summary.passRate}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">
                {summary.passed}/{summary.total} Verified
              </span>
            </div>

            <button
              onClick={onRunTests}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Play className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Executing Suite...' : 'Re-Run Security Suite'}</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-zinc-800 text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/80 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Security Assertion</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Role Tested</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {filteredTests.map((t) => {
                const isExpanded = expandedTestId === t.id;
                return (
                  <React.Fragment key={t.id}>
                    <tr className="hover:bg-zinc-850/40 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {t.passed ? (
                          <div className="flex items-center gap-1 text-emerald-400 font-sans font-medium text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>PASS</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-400 font-sans font-medium text-xs">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>FAIL</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-indigo-400 whitespace-nowrap">{t.id}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-zinc-200">
                        {t.title}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 whitespace-nowrap font-sans text-[11px]">
                        {t.category}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-300 whitespace-nowrap uppercase text-[10px]">
                        [{t.testedRole}]
                      </td>
                      <td className="py-2.5 px-3 text-zinc-500 whitespace-nowrap text-[10px]">
                        {t.latencyMs}ms
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                          className="text-zinc-400 hover:text-zinc-200 transition-colors font-sans text-xs inline-flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-zinc-950/70">
                        <td colSpan={7} className="p-4 border-t border-zinc-800/80">
                          <div className="space-y-2 text-zinc-300">
                            <div className="text-xs font-sans text-zinc-300">
                              <span className="font-semibold text-zinc-200">Objective:</span> {t.description}
                            </div>
                            <div className="text-[11px]">
                              <span className="text-zinc-500 font-mono">Policy Verified:</span>{' '}
                              <code className="text-indigo-300 font-mono">{t.ruleVerified}</code>
                            </div>
                            <div className="text-[11px] text-emerald-300 font-sans">
                              {t.detail}
                            </div>
                            <div className="pt-1">
                              <span className="text-[10px] text-zinc-500 font-mono uppercase">Simulated SQL / Query:</span>
                              <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto mt-1">
                                {t.sqlSnippet}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
