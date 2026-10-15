import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  Edit3,
  Save,
  Trash2,
  Info,
} from "lucide-react";
import { IngestionMessage, AuditCheckItem } from "../types";

interface AuditReviewModalProps {
  message: IngestionMessage | null;
  onClose: () => void;
  onApprove: (updatedMessage: IngestionMessage) => void;
  onFlag: (messageId: string, reason: string) => void;
  onReject: (messageId: string) => void;
}

export const AuditReviewModal: React.FC<AuditReviewModalProps> = ({
  message,
  onClose,
  onApprove,
  onFlag,
  onReject,
}) => {
  if (!message) return null;

  const [partName, setPartName] = useState(message.extracted.partName || "");
  const [partNumber, setPartNumber] = useState(message.extracted.partNumber || "");
  const [quantity, setQuantity] = useState<number | "">(message.extracted.quantity ?? 1);
  const [rate, setRate] = useState<number | "">(message.extracted.rate ?? 850);
  const [dealerName, setDealerName] = useState(message.extracted.dealerName || "Sharma Auto Spares & Bearing Co.");
  const [vehicleNumber, setVehicleNumber] = useState(message.extracted.vehicleNumber || "");
  const [category, setCategory] = useState("Clutch & Transmission");
  const [shelfDestination, setShelfDestination] = useState("Rack A — Shelf 2");

  // Checklist state
  const [checklist, setChecklist] = useState<AuditCheckItem[]>(
    message.extracted.auditChecklist || [
      { item: "Original Evidence Attached", status: "VERIFIED", detail: "Image/Chat preserved" },
      { item: "Part Identification", status: "VERIFIED", detail: "Part model confirmed" },
      { item: "Quantity & Rate Check", status: "VERIFIED", detail: "Pricing matches invoice" },
      { item: "Supplier Matched", status: "VERIFIED", detail: "Dealer verified in registry" },
    ]
  );

  const numQty = typeof quantity === "number" ? quantity : 0;
  const numRate = typeof rate === "number" ? rate : 0;
  const totalCalculated = numQty * numRate;

  const handleToggleCheck = (index: number) => {
    const updated = [...checklist];
    updated[index].status = updated[index].status === "VERIFIED" ? "UNCERTAIN" : "VERIFIED";
    setChecklist(updated);
  };

  const handleApprove = () => {
    const updated: IngestionMessage = {
      ...message,
      auditStatus: "VERIFIED",
      auditVerifiedBy: "Rajesh Sharma (Owner Admin)",
      auditVerifiedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      finalRecordId: "REC-" + Date.now().toString().slice(-6),
      extracted: {
        ...message.extracted,
        partName,
        partNumber,
        quantity: numQty,
        rate: numRate,
        totalAmount: totalCalculated,
        dealerName,
        vehicleNumber: vehicleNumber || null,
        auditChecklist: checklist,
      },
    };
    onApprove(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Owner Audit Verification</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Ticket #{message.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect original evidence, verify extracted items, and commit to inventory or job cards.
              </p>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Architecture Banner */}
        <div className="bg-slate-950/60 px-5 py-2.5 border-b border-slate-800/80 text-xs flex items-center justify-between overflow-x-auto no-scrollbar gap-4 text-slate-400">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="font-bold text-emerald-400">1. Original Evidence</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-sky-400">2. OCR & AI Extraction</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-amber-400">3. Human Audit Approval</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-purple-400">4. Final Shop Record</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
            <Lock className="w-3 h-3" />
            <span>Original Never Destroyed</span>
          </div>
        </div>

        {/* Main Content: Split Two-Pane View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto flex-1 p-5 gap-6">
          {/* LEFT PANE: Immutable Original Evidence */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Original Evidence (Immutable)</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {message.evidenceHash}
              </span>
            </div>

            {/* Media Viewer */}
            {message.mediaUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 relative group">
                <img
                  src={message.mediaUrl}
                  alt="Original Document Evidence"
                  className="w-full max-h-72 object-contain bg-slate-950"
                  referrerPolicy="no-referrer"
                />
                <div className="p-2.5 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>File: {message.fileName || "whatsapp_attachment.jpg"}</span>
                  <a
                    href={message.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Open Full Size</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : message.mediaType === "voice" ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  🎤
                </div>
                <div>
                  <h5 className="font-semibold text-xs text-slate-200">Voice Note Audio Preserved</h5>
                  <p className="text-[11px] text-slate-400">Duration: {message.voiceDuration || "0:18 sec"}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Text-only message received in WhatsApp operations group.
              </div>
            )}

            {/* WhatsApp Raw Context */}
            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">{message.sender}</span>
                <span>{message.timestamp}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 text-xs text-slate-100 border border-slate-800 font-sans italic">
                "{message.rawText}"
              </div>
              <p className="text-[11px] text-slate-500">
                WhatsApp Channel: <strong>Truck Wala 24×7 — Owner Operations Group</strong>
              </p>
            </div>

            {/* AI Diagnosis Warning Notes */}
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>AI Auditor Warning:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {message.extracted.reviewNotes}
              </p>
            </div>
          </div>

          {/* RIGHT PANE: Extracted Data & Audit Verification */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Extracted Data & Verification</span>
              </h4>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                AI Confidence: {message.confidence}%
              </span>
            </div>

            {/* Editable Form */}
            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
              {/* Part Name */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Part Name / Item Description</label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Tata 1618 Clutch Plate 380mm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Part Number */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Part Number (Optional)</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="e.g. VAL-380-T1618"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Clutch & Transmission">Clutch & Transmission</option>
                    <option value="Braking System">Braking System</option>
                    <option value="Axle & Bearings">Axle & Bearings</option>
                    <option value="Engine & Filters">Engine & Filters</option>
                    <option value="Lubricants">Lubricants</option>
                    <option value="Electricals">Electricals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Quantity */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Quantity (Pcs)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Rate per Unit (₹)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Total */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Total Amount</label>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-black text-emerald-400">
                    ₹{totalCalculated.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Dealer / Supplier */}
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Supplier / Dealer Name</label>
                <input
                  type="text"
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Shelf Rack Destination */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Shelf / Rack Placement</label>
                  <input
                    type="text"
                    value={shelfDestination}
                    onChange={(e) => setShelfDestination(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Vehicle Number (if applicable) */}
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Truck Number (If Fitted)</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                    placeholder="e.g. NL01-K-8821"
                  />
                </div>
              </div>
            </div>

            {/* Audit Verification Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Verification Checklist (Click to Toggle)
              </label>
              <div className="space-y-1.5">
                {checklist.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                      c.status === "VERIFIED"
                        ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-200"
                        : "bg-amber-950/40 border-amber-800/60 text-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          c.status === "VERIFIED" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      />
                      <span className="font-semibold">{c.item}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{c.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Approving updates inventory (+{numQty} items, ₹{totalCalculated.toLocaleString()}) with immutable evidence link.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="modal-reject-btn"
              onClick={() => {
                onReject(message.id);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold border border-slate-700 transition-colors"
            >
              Reject Entry
            </button>

            <button
              id="modal-flag-missing-bill-btn"
              onClick={() => {
                onFlag(message.id, "Missing official GST tax invoice");
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold border border-amber-800/60 transition-colors"
            >
              Flag as Missing Bill
            </button>

            <button
              id="modal-approve-btn"
              onClick={handleApprove}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Commit Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
