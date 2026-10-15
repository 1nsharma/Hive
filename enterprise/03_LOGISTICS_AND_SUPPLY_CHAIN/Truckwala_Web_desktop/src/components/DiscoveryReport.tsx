import React, { useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowDownRight,
  TrendingUp,
  Package,
  Users,
  Copy,
  Printer,
  Download,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { RealityReport, MissingBillRecord } from "../types";

interface DiscoveryReportProps {
  report: RealityReport;
  missingBills: MissingBillRecord[];
  onResolveMissingBill: (id: string) => void;
}

export const DiscoveryReport: React.FC<DiscoveryReportProps> = ({
  report,
  missingBills,
  onResolveMissingBill,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "missing-bills" | "duplicates" | "dormant">("overview");

  return (
    <div className="space-y-6 pb-12">
      {/* Report Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold uppercase tracking-wider">
                Month 1 Discovery Protocol
              </span>
              <span className="text-xs text-slate-400">Current Reality Report (Day {report.discoveryDaysElapsed} / 30)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Current Reality Report — <span className="text-sky-400">"आपके Shop में वास्तव में क्या है?"</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Discovers hidden inventory, identifies dealers, flags missing invoices, and surfaces dormant parts
              gradually without shutting down daily workshop operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Audit</span>
            </button>
            <button
              onClick={() => alert("Reality Report data exported to JSON/CSV for Owner records.")}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Reality Report</span>
            </button>
          </div>
        </div>

        {/* 30-Day Discovery Progress Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Discovery Window Progress: Day {report.discoveryDaysElapsed} of 30</span>
            <span className="text-sky-400 font-mono font-bold">60% Mapped</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full w-[60%] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Discovery Insights Grid (Key questions from Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Discovered Parts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Unique Parts Discovered</span>
            <Package className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{report.totalUniquePartsDiscovered}</div>
          <p className="text-[11px] text-slate-400">Across 24 godown shelf photo scans</p>
        </div>

        {/* Estimated Old Stock Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Old Stock Surfaced (Photos)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{report.uncountedStockEstimatedValue.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Captured without manual physical count</p>
        </div>

        {/* Missing Bills & Challans */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-rose-400 text-xs">
            <span>Missing Invoices / Parchi</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300">{report.missingBillsCount} Bills</div>
          <p className="text-[11px] text-rose-400/90 font-mono">₹{report.missingBillsTotalValue.toLocaleString()} pending GST</p>
        </div>

        {/* Dormant / Slow Moving Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-amber-400 text-xs">
            <span>Dormant Stock (&gt;90 Days)</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">₹{report.dormantStockValue.toLocaleString()}</div>
          <p className="text-[11px] text-slate-400">Unused parts lying in godown</p>
        </div>
      </div>

      {/* Sub-tab toggler */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === "overview"
              ? "bg-sky-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Audit Reality Questions (12 Points)
        </button>

        <button
          onClick={() => setActiveSubTab("missing-bills")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === "missing-bills"
              ? "bg-rose-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <span>Missing Bills & Parchi ({missingBills.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("duplicates")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeSubTab === "duplicates"
              ? "bg-amber-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Duplicates Merged (19)
        </button>
      </div>

      {/* Tab 1: Comprehensive 12 Questions Reality Breakdown */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>What Is Truly Inside the Workshop?</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun-kaun se parts hain:</strong>
                  412 unique items cataloged (Clutch assemblies: 48, Braking: 84, Bearings: 62, Filters/Oils: 110, Electricals: 36, Fasteners/Hardware: 72).
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kitna old stock hai:</strong>
                  Estimated ₹3,84,000 across Godown Racks A, B, C, D identified from initial photo scans.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun dealer hai:</strong>
                  37 regular suppliers mapped (Sharma Auto, Bajrang Commercial, Tata Genuine Hub, SKF Bearing Depot, etc.).
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-sky-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun se purchases hue:</strong>
                  ₹1,12,000 this week alone. 100% matched to invoice or delivery challan slips.
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Gaps, Discrepancies & Discovered Realities</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun se parts trucks me lage:</strong>
                  18 clutch sets & 24 brake liner sets fitted into fleet vehicles (Tata 1618, Signa 4825, Ashok Leyland 2820).
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun sa maal pada hua hai (Dormant):</strong>
                  ₹1,28,000 worth of old crown pinion gears and rusty leaf springs untouched for &gt;90 days.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-rose-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun se bills missing hain:</strong>
                  12 entries worth ₹64,200 brought via oral agreement or cash parchi without official GST tax invoice.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="font-bold text-emerald-400 min-w-4">•</span>
                <div>
                  <strong className="text-white block">Kaun si duplicate entries thin:</strong>
                  19 duplicate aliases merged (e.g., "Tata 1618 clutch" and "Valeo CP-380" resolved to single SKU).
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Missing Bills Tracker */}
      {activeSubTab === "missing-bills" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <span>Missing Bills & Handwritten Parchi Tracker</span>
              </h3>
              <p className="text-xs text-slate-400">
                Purchases received into workshop without formal GST tax invoice. Requires follow-up with supplier.
              </p>
            </div>
            <span className="text-xs text-rose-400 font-bold bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg font-mono">
              Total Pending: ₹{report.missingBillsTotalValue.toLocaleString()}
            </span>
          </div>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
            {missingBills.map((b) => (
              <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-rose-400 font-mono">#{b.id}</span>
                    <span className="text-slate-400">• Approx Date: {b.approxDate}</span>
                    <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800 text-[10px] font-semibold">
                      Challan / Parchi Only
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{b.partName}</h4>
                  <p className="text-slate-400 mt-0.5">Dealer: <strong className="text-slate-200">{b.dealerOrSupplier}</strong></p>
                  <p className="text-amber-300/80 italic mt-1">{b.notes}</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Amount</span>
                    <span className="font-black text-sm text-rose-400">₹{b.amount.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      onResolveMissingBill(b.id);
                      alert(`Bill for ${b.partName} uploaded and resolved!`);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow"
                  >
                    Attach GST Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Duplicates Merged */}
      {activeSubTab === "duplicates" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Copy className="w-5 h-5 text-amber-400" />
            <span>19 Duplicate Item Entries Merged & Cleaned</span>
          </h3>
          <p className="text-xs text-slate-400">
            AI matched different colloquial spellings and mechanic nicknames into single standardized SKUs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[10px]">MERGED CLUSTER #1</span>
              <h4 className="font-bold text-slate-200">Tata 1618 Clutch Plate 380mm</h4>
              <p className="text-slate-400 text-[11px]">
                Merged aliases: <em>"Bhai 1618 clutch"</em>, <em>"Valeo CP 380"</em>, <em>"Tata Tipper clutch plate"</em>
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[10px]">MERGED CLUSTER #2</span>
              <h4 className="font-bold text-slate-200">SKF Front Hub Bearing 32218</h4>
              <p className="text-slate-400 text-[11px]">
                Merged aliases: <em>"Front hub bearing SKF"</em>, <em>"32218 j2 roller"</em>, <em>"Dharuhera truck bearing"</em>
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[10px]">MERGED CLUSTER #3</span>
              <h4 className="font-bold text-slate-200">Rajdhani Commercial Spares Pvt Ltd</h4>
              <p className="text-slate-400 text-[11px]">
                Merged dealer aliases: <em>"Raju Auto"</em>, <em>"Rajdhani Spares Kashmere Gate"</em>, <em>"Rajdhani parts"</em>
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 font-mono text-[10px]">MERGED CLUSTER #4</span>
              <h4 className="font-bold text-slate-200">Jamna Auto Main Leaf Spring (Kamani Patti)</h4>
              <p className="text-slate-400 text-[11px]">
                Merged aliases: <em>"Main patta"</em>, <em>"16mm kamani patti"</em>, <em>"Jamna rear leaf"</em>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
