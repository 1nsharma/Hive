import React from 'react';
import { summaryTable } from '../data';
import { Table2 } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-900 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Table2 className="w-5 h-5" />
        </div>
        <h3 className="font-display text-xl font-bold text-slate-100">Key Difference Summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800">
              <th className="p-4 pl-6 text-xs font-mono tracking-wider uppercase text-slate-400 font-semibold w-1/4">Area</th>
              <th className="p-4 text-xs font-mono tracking-wider uppercase text-blue-400 font-bold w-1/4">AIOps</th>
              <th className="p-4 text-xs font-mono tracking-wider uppercase text-fuchsia-400 font-bold w-1/4">LLMOps</th>
              <th className="p-4 pr-6 text-xs font-mono tracking-wider uppercase text-emerald-400 font-bold w-1/4">MLOps</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {summaryTable.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 pl-6 text-sm font-medium text-slate-300">{row.area}</td>
                <td className="p-4 text-sm text-slate-400">{row.aiops}</td>
                <td className="p-4 text-sm text-slate-400">{row.llmops}</td>
                <td className="p-4 pr-6 text-sm text-slate-400">{row.mlops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
