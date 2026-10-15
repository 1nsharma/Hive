import React, { useState } from "react";
import { DUE_DILIGENCE_CHECKLIST } from "../data/checklistData";
import { DueDiligenceItem } from "../types";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  BookOpen,
  Filter,
  Download,
  Building2,
} from "lucide-react";

export const LegalChecklistView: React.FC = () => {
  const [items, setItems] = useState<DueDiligenceItem[]>(DUE_DILIGENCE_CHECKLIST);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStateGuide, setSelectedStateGuide] = useState<"pan-india" | "haryana" | "maharashtra" | "karnataka" | "up">("pan-india");

  const categories = ["All", "Land & Title", "Zoning & Municipal", "Technical & Soil", "RERA & Legal", "Financial & Tax"];

  const handleStatusChange = (id: string, newStatus: "pending" | "verified" | "flagged") => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it))
    );
  };

  const filteredItems = items.filter((it) => {
    const matchesCat = selectedCategory === "All" || it.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.riskIfIgnored.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const verifiedCount = items.filter((it) => it.status === "verified").length;
  const flaggedCount = items.filter((it) => it.status === "flagged").length;
  const pendingCount = items.filter((it) => it.status === "pending").length;
  const totalCount = items.length;
  const complianceScore = Math.round((verifiedCount / totalCount) * 100);

  return (
    <div className="space-y-8 pb-16 text-slate-100">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Level 4 Mastery: Legal & Due Diligence Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              30-Year Title Search & RERA Due Diligence Protocol
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              In real estate development, a single missing revenue mutation, an unregistered JDA, or an unaddressed lake buffer can freeze projects indefinitely.
            </p>
          </div>

          {/* Compliance Score Gauge */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center space-x-4 shrink-0">
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Due Diligence Audit</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                {complianceScore}% Clear
              </div>
              <span className="text-[11px] text-slate-400">
                {verifiedCount}/{totalCount} Items Verified
              </span>
            </div>
            <div className="h-10 w-px bg-slate-700" />
            <div className="space-y-1 text-[11px] font-mono">
              <div className="text-emerald-400">{verifiedCount} Verified</div>
              <div className="text-amber-400">{pendingCount} Pending</div>
              <div className="text-red-400">{flaggedCount} Flagged</div>
            </div>
          </div>
        </div>

        {/* Filter Category Tabs & Search */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex space-x-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-amber-400 text-slate-950 font-bold"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, RERA, zoning..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* State-Specific Regulatory Guidelines Panel */}
      <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              State-Specific Regulatory Playbooks
            </h3>
          </div>

          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "pan-india", label: "Pan-India RERA" },
              { id: "haryana", label: "Haryana (Gurgaon / NCR)" },
              { id: "maharashtra", label: "Maharashtra (MahaRERA/MMR)" },
              { id: "karnataka", label: "Karnataka (Bengaluru)" },
              { id: "up", label: "Uttar Pradesh (Noida/UP-RERA)" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStateGuide(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedStateGuide === st.id
                    ? "bg-slate-700 text-amber-300 font-bold border border-amber-500/30"
                    : "bg-slate-900 text-slate-400 hover:text-slate-300"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* State Guide Content */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed space-y-2">
          {selectedStateGuide === "pan-india" && (
            <div>
              <strong className="text-amber-400 block mb-1">Pan-India RERA Statutory Mandates (Act of 2016):</strong>
              <p className="text-slate-300">
                1. <strong>70% Escrow Rule:</strong> 70% of all customer collections must be deposited into a designated scheduled bank escrow account. Withdrawals are permitted strictly in proportion to construction completion certified by an Engineer, Architect, and Chartered Accountant (CA Form 1, 2, 3).
                <br />
                2. <strong>Carpet Area Standard:</strong> All advertising and sale agreements must strictly quote RERA Net Usable Carpet Area (internal walls + usable space), not super built-up area.
                <br />
                3. <strong>5-Year Structural Defect Liability:</strong> Developer is legally obligated to rectify any structural or quality defects without charge for 5 years post-handover.
              </p>
            </div>
          )}

          {selectedStateGuide === "haryana" && (
            <div>
              <strong className="text-amber-400 block mb-1">Haryana Town & Country Planning (DTCP / HRERA):</strong>
              <p className="text-slate-300">
                1. <strong>Deen Dayal Jan Awas Yojna (DDJAY):</strong> High-demand low-rise plotted scheme allowing stilt + 4 floors on independent residential plots with fast approval cycles.
                <br />
                2. <strong>EDC / IDC Payments:</strong> External Development Charges & Infrastructure Development Charges must be factored upfront (₹300 - ₹600/sq.ft of built-up area) payable to HSVP.
                <br />
                3. <strong>Transit Oriented Development (TOD):</strong> Upto 3.0+ FAR along the 500m Metro corridor influence zones in Gurgaon.
              </p>
            </div>
          )}

          {selectedStateGuide === "maharashtra" && (
            <div>
              <strong className="text-amber-400 block mb-1">Maharashtra (MahaRERA / BMC / MMRDA):</strong>
              <p className="text-slate-300">
                1. <strong>Redevelopment Regulations (DCR 33(7), 33(9), 33(10)):</strong> Massive cluster redevelopment opportunities in Mumbai with incentive FSI for providing rehabilitation tenements.
                <br />
                2. <strong>TDR & Premium FSI:</strong> Base FSI of 1.0 supplemented by 0.50 Premium FSI (payable to BMC at 50% ASR) and 0.50 Transferable Development Rights (TDR).
                <br />
                3. <strong>Section 79A Strict Timelines:</strong> Societies require 51% consent with bank guarantees for alternate accommodation rent during construction.
              </p>
            </div>
          )}

          {selectedStateGuide === "karnataka" && (
            <div>
              <strong className="text-amber-400 block mb-1">Karnataka (BMRDA / BBMP / K-RERA):</strong>
              <p className="text-slate-300">
                1. <strong>Lake Buffer & Nala Demarcation:</strong> NGT mandates 75m buffer from lake boundaries, 50m from primary storm drains (Raja Kaluve), and 25m from secondary drains.
                <br />
                2. <strong>Khata Bifurcation (A-Khata vs B-Khata):</strong> A-Khata signifies property with full layout sanction and DC conversion; B-Khata properties face municipal building license restrictions.
              </p>
            </div>
          )}

          {selectedStateGuide === "up" && (
            <div>
              <strong className="text-amber-400 block mb-1">Uttar Pradesh (UP RERA / Noida / Greater Noida Authority):</strong>
              <p className="text-slate-300">
                1. <strong>Leasehold Land Premium:</strong> Most institutional parcels in Noida are 90-year leaseholds from development authorities. Builders must ensure zero pending authority lease dues before sub-lease registry to buyers.
                <br />
                2. <strong>Farmer Abadi Settlement:</strong> Verify 64.7% enhanced compensation and 5% developed plot allocations are settled to avoid physical site obstruction.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Due Diligence Checklist Matrix */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Comprehensive Due Diligence Protocol ({filteredItems.length} Checklist Items)
        </h3>

        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isVerified = item.status === "verified";
            const isFlagged = item.status === "flagged";
            const isPending = item.status === "pending";

            return (
              <div
                key={item.id}
                className={`p-5 rounded-xl border transition-all ${
                  isVerified
                    ? "bg-slate-900/90 border-emerald-500/30"
                    : isFlagged
                    ? "bg-slate-900/90 border-red-500/40"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                      {item.mandatory && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-red-400 bg-red-500/10 border border-red-500/20">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-semibold text-base text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Risk If Ignored */}
                    <div className="pt-2 flex items-start space-x-2 text-xs text-red-300 bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-red-200">Disaster Scenario if Overlooked: </strong>
                        {item.riskIfIgnored}
                      </span>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex sm:flex-col items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStatusChange(item.id, "verified")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1.5 w-full justify-center ${
                        isVerified
                          ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(item.id, "pending")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1.5 w-full justify-center ${
                        isPending
                          ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-700"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Pending</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(item.id, "flagged")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center space-x-1.5 w-full justify-center ${
                        isFlagged
                          ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/20"
                          : "bg-slate-800 text-slate-400 hover:text-red-300 border border-slate-700"
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Flag Risk</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
