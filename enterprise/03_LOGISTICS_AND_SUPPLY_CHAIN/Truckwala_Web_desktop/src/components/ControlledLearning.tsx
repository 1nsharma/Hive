import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  Layers,
} from "lucide-react";
import { ControlledLearningRule } from "../types";

interface ControlledLearningProps {
  rules: ControlledLearningRule[];
  onAddRule: (rule: Omit<ControlledLearningRule, "id" | "appliedCount" | "status">) => void;
  onDeleteRule: (id: string) => void;
}

export const ControlledLearning: React.FC<ControlledLearningProps> = ({
  rules,
  onAddRule,
  onDeleteRule,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [rawInputPattern, setRawInputPattern] = useState("");
  const [correctedOutput, setCorrectedOutput] = useState("");
  const [context, setContext] = useState<"Part Mapping" | "Dealer Alias" | "Vehicle Model" | "Category">("Dealer Alias");
  const [learnedFrom, setLearnedFrom] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawInputPattern.trim() || !correctedOutput.trim()) return;

    onAddRule({
      rawInputPattern: rawInputPattern.trim(),
      correctedOutput: correctedOutput.trim(),
      context,
      learnedFrom: learnedFrom.trim() || "Owner manually defined operational rule in Admin Portal",
      dateLearned: new Date().toISOString().split("T")[0],
    });

    setRawInputPattern("");
    setCorrectedOutput("");
    setLearnedFrom("");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Principle #10 Banner */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-slate-900 border border-teal-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider">
                Controlled & Auditable Learning
              </span>
              <span className="text-xs text-slate-400">• Principle #10</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Improve Every Time — <span className="text-teal-400">Owner-Supervised Rules</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "Owner ko bar-bar ek hi cheez theek na karni pade. System apne aap rules nahi badlega —
              owner ya admin confirmation par rule save hoga."
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Cancel" : "Add New Learning Rule"}</span>
          </button>
        </div>
      </div>

      {/* Add Form if toggled */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Define Controlled Learning Rule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Rule Category</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
              >
                <option value="Dealer Alias">Dealer Alias</option>
                <option value="Part Mapping">Part Mapping</option>
                <option value="Vehicle Model">Vehicle Model</option>
                <option value="Category">Category</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">When Staff Writes / Sends (Raw Trigger)</label>
              <input
                type="text"
                value={rawInputPattern}
                onChange={(e) => setRawInputPattern(e.target.value)}
                placeholder='e.g., "Sharma Auto" or "1618 clutch"'
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Always Map To (Correct Output)</label>
              <input
                type="text"
                value={correctedOutput}
                onChange={(e) => setCorrectedOutput(e.target.value)}
                placeholder='e.g., "Sharma Auto Spares & Bearing Co."'
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 text-xs block mb-1">Learned From / Reason</label>
            <input
              type="text"
              value={learnedFrom}
              onChange={(e) => setLearnedFrom(e.target.value)}
              placeholder="Why this mapping should occur..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow"
            >
              Save Rule into Learning Engine
            </button>
          </div>
        </form>
      )}

      {/* Rules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <h3 className="font-bold text-sm text-slate-200">
              Active Controlled Rules ({rules.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Rules apply during background WhatsApp message ingestion
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Raw Staff Input</th>
                <th className="py-3 px-2"></th>
                <th className="py-3 px-4">System Mapped Value</th>
                <th className="py-3 px-4">Learned From</th>
                <th className="py-3 px-4 text-center">Times Applied</th>
                <th className="py-3 px-4 text-center">Owner Supervised</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-teal-400">
                      {rule.context}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-300">
                    "{rule.rawInputPattern}"
                  </td>
                  <td className="py-3 px-2 text-slate-500">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {rule.correctedOutput}
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs truncate">
                    {rule.learnedFrom}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">
                    {rule.appliedCount}×
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
