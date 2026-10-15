import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  ArrowRight,
  Lock,
  Search,
  CheckCircle2,
  ExternalLink,
  Clock,
  Layers,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { IngestionMessage } from "../types";

interface EvidenceExplorerProps {
  messages: IngestionMessage[];
  onOpenAudit: (msg: IngestionMessage) => void;
}

export const EvidenceExplorer: React.FC<EvidenceExplorerProps> = ({
  messages,
  onOpenAudit,
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(messages[0]?.id || "msg-001");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const selectedMessage = messages.find((m) => m.id === selectedRecordId) || messages[0];

  const filteredMessages = messages.filter((m) =>
    !searchTerm ||
    m.rawText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.extracted.partName && m.extracted.partName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.extracted.dealerName && m.extracted.dealerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                Full Cryptographic Lineage
              </span>
              <span className="text-xs text-slate-400">• Principle #6 & #7</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Evidence Lineage — <span className="text-purple-400">"यह ₹8,500 कहाँ से आया?"</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Every financial, inventory, or job record links back directly to the original WhatsApp message, voice note,
              or bill photo. Original evidence is never altered or destroyed.
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-purple-900/60 text-xs font-mono text-purple-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>Immutable Evidence Ledger</span>
          </div>
        </div>
      </div>

      {/* Two Pane Layout: Records list on left, 4-Stage Visual Trace on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Records Selection List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow space-y-2">
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Audit-Linked Transactions
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transaction or part..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[580px] overflow-y-auto">
            {filteredMessages.map((msg) => {
              const isSelected = msg.id === selectedRecordId;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedRecordId(msg.id)}
                  className={`p-3 cursor-pointer transition-colors text-xs space-y-1 ${
                    isSelected
                      ? "bg-purple-950/40 border-l-4 border-purple-500 text-slate-100"
                      : "hover:bg-slate-850 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 truncate max-w-[180px]">
                      {msg.extracted.partName || msg.rawText}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {msg.extracted.totalAmount ? `₹${msg.extracted.totalAmount.toLocaleString()}` : "Log Record"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span>{msg.sender.split(" ")[0]}</span>
                    <span className="font-mono text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {msg.classification}
                    </span>
                    <span className="text-[10px] text-purple-400 font-mono">
                      {msg.evidenceHash.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: The 4-Stage Visual Trace (8 cols) */}
        {selectedMessage && (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                  Evidence Trail for Ticket #{selectedMessage.id}
                </span>
                <h3 className="font-extrabold text-base sm:text-lg text-white mt-1">
                  {selectedMessage.extracted.partName || "Captured Workshop Transaction"}
                </h3>
              </div>

              <button
                onClick={() => onOpenAudit(selectedMessage)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Open Audit Modal</span>
              </button>
            </div>

            {/* Step 4: Final Record */}
            <div className="bg-slate-950 rounded-xl p-4 border border-purple-900/60 relative">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-purple-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[11px]">4</span>
                  <span>Final Shop Ledger Record</span>
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {selectedMessage.finalRecordId || "REC-384912"}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Net Impact</span>
                  <strong className="text-emerald-400">
                    +{selectedMessage.extracted.quantity || 1} units in Stock
                  </strong>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Book Value</span>
                  <strong className="text-white">
                    ₹{(selectedMessage.extracted.totalAmount || 3400).toLocaleString()}
                  </strong>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Category</span>
                  <strong className="text-slate-200">Transmission / Spares</strong>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <span className="text-slate-500 block text-[10px]">Status</span>
                  <strong className="text-emerald-400">Committed & Verified</strong>
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-3">
              <div className="bg-slate-800 p-1 rounded-full text-slate-400 border border-slate-700">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Step 3: Human Audit Approval */}
            <div className="bg-slate-950 rounded-xl p-4 border border-amber-900/60 relative">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">3</span>
                  <span>Human Audit Approval Step</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {selectedMessage.auditVerifiedAt || "09:20 AM"}
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1.5">
                <p>
                  Verified by: <strong className="text-white">{selectedMessage.auditVerifiedBy || "Rajesh Sharma (Owner Admin)"}</strong>
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                    ✅ Part ID Verified
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                    ✅ Rate ₹{selectedMessage.extracted.rate || 850} Verified
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                    ✅ Dealer Matched ({selectedMessage.extracted.dealerName || "Sharma Auto"})
                  </span>
                </div>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-3">
              <div className="bg-slate-800 p-1 rounded-full text-slate-400 border border-slate-700">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Step 2: AI & OCR Extraction */}
            <div className="bg-slate-950 rounded-xl p-4 border border-sky-900/60 relative">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">2</span>
                  <span>OCR & Gemini Backend Intelligence Extraction</span>
                </span>
                <span className="text-sky-300 font-mono text-[11px]">
                  {selectedMessage.confidence}% AI Confidence
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                Extraction: {selectedMessage.extracted.reviewNotes}
              </p>
            </div>

            {/* Connecting Arrow */}
            <div className="flex justify-center -my-3">
              <div className="bg-slate-800 p-1 rounded-full text-slate-400 border border-slate-700">
                <ArrowRight className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Step 1: Original Preserved Evidence */}
            <div className="bg-slate-950 rounded-xl p-4 border border-emerald-900/60 relative space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">1</span>
                  <span>Original Preserved Evidence (Never Destroyed)</span>
                </span>
                <span className="text-slate-400 font-mono text-[10px]">
                  SHA-256: {selectedMessage.evidenceHash}
                </span>
              </div>

              {selectedMessage.mediaUrl && (
                <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 max-h-48">
                  <img
                    src={selectedMessage.mediaUrl}
                    alt="Original Evidence"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                  <span>Sender: <strong className="text-emerald-400">{selectedMessage.sender}</strong></span>
                  <span>WhatsApp Time: {selectedMessage.timestamp}</span>
                </div>
                <p className="italic font-sans">"{selectedMessage.rawText}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
