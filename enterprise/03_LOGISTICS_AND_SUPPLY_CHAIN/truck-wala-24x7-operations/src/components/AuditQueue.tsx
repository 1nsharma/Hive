import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Filter,
  Eye,
  ArrowUpRight,
  Clock,
  Layers,
  Search,
  ExternalLink,
} from "lucide-react";
import { IngestionMessage, AuditStatus } from "../types";

interface AuditQueueProps {
  messages: IngestionMessage[];
  onOpenAudit: (msg: IngestionMessage) => void;
  searchTerm: string;
}

export const AuditQueue: React.FC<AuditQueueProps> = ({
  messages,
  onOpenAudit,
  searchTerm,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("NEEDS_REVIEW");

  const filtered = messages.filter((m) => {
    const matchesStatus =
      statusFilter === "ALL" || m.auditStatus === statusFilter;
    const matchesSearch =
      !searchTerm ||
      m.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.extracted.partName &&
        m.extracted.partName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.extracted.dealerName &&
        m.extracted.dealerName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const needsReviewCount = messages.filter((m) => m.auditStatus === "NEEDS_REVIEW").length;
  const verifiedCount = messages.filter((m) => m.auditStatus === "VERIFIED").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
              Human In The Loop
            </span>
            <span className="text-xs text-slate-400">Owner Verification Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Audit Review Queue</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            "AI anumaan lagayega, lekin bina verification inventory me final entry nahi karega."
            Inspect evidence, adjust details, and approve items.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="audit-filter-needs-review"
            onClick={() => setStatusFilter("NEEDS_REVIEW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === "NEEDS_REVIEW"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs Review ({needsReviewCount})</span>
          </button>

          <button
            id="audit-filter-verified"
            onClick={() => setStatusFilter("VERIFIED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              statusFilter === "VERIFIED"
                ? "bg-emerald-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified ({verifiedCount})</span>
          </button>

          <button
            id="audit-filter-all"
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === "ALL"
                ? "bg-slate-700 text-white font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>All ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 mb-3" />
            <h4 className="text-base font-semibold text-slate-200">No items in this audit filter</h4>
            <p className="text-xs text-slate-400 mt-1">All current items have been processed or matched.</p>
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                  {msg.mediaType === "bill" ? "🧾" : msg.mediaType === "voice" ? "🎤" : "📸"}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {msg.classification}
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      {msg.sender}
                    </span>
                    <span className="text-xs text-slate-500">• {msg.timestamp}</span>

                    {msg.auditStatus === "NEEDS_REVIEW" ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Pending Audit
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified by {msg.auditVerifiedBy || "Owner"}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-100">
                    {msg.extracted.partName || msg.rawText}
                  </h3>

                  <p className="text-xs text-amber-300/90 italic flex items-center gap-1">
                    <span>{msg.extracted.reviewNotes}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                    {msg.extracted.quantity !== null && (
                      <span>
                        Qty: <strong className="text-slate-200">{msg.extracted.quantity}</strong>
                      </span>
                    )}
                    {msg.extracted.rate !== null && (
                      <span>
                        Rate: <strong className="text-slate-200">₹{msg.extracted.rate}</strong>
                      </span>
                    )}
                    {msg.extracted.totalAmount !== null && (
                      <span>
                        Total: <strong className="text-emerald-400">₹{msg.extracted.totalAmount.toLocaleString()}</strong>
                      </span>
                    )}
                    {msg.extracted.dealerName && (
                      <span>
                        Dealer: <strong className="text-slate-200">{msg.extracted.dealerName}</strong>
                      </span>
                    )}
                    {msg.extracted.vehicleNumber && (
                      <span>
                        Vehicle: <strong className="text-amber-400">{msg.extracted.vehicleNumber}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-2.5 shrink-0 self-end lg:self-center">
                <button
                  id={`btn-audit-item-${msg.id}`}
                  onClick={() => onOpenAudit(msg)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-102"
                >
                  <Eye className="w-4 h-4" />
                  <span>Inspect & Verify</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
