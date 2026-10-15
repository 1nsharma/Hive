import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Wrench,
  Truck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  FileCheck,
  Layers,
  Key,
  Flame,
  FileText,
  Activity,
  History,
  Terminal,
  Sparkles,
  Info,
} from "lucide-react";
import {
  DATA_TRUST_PRINCIPLES,
  DATA_PRIVACY_BOUNDARIES,
  INITIAL_ACCESS_AUDIT_LOGS,
} from "../mockData";
import { UserRole } from "../types";

export const DataTrustCenter: React.FC = () => {
  const [simulatedRole, setSimulatedRole] = useState<UserRole>("OWNER");
  const [activeSubView, setActiveSubView] = useState<"principles" | "simulator" | "boundary-matrix" | "ai-pipeline" | "audit-log">("principles");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>("ALL");

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero: The Core Privacy Declaration */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Leakage Architecture Core
              </span>
              <span className="text-xs text-slate-400">• Truck Wala Enterprise Security</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>TRUCK WALA — DATA PRIVACY CORE</span>
            </h1>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-800/40 max-w-3xl">
              <p className="text-sm font-semibold text-emerald-200 leading-relaxed">
                "Truck Wala का internal data कभी बाहर share नहीं होगा।"
              </p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                और इसका मतलब केवल "data sell नहीं करेंगे" नहीं है। इसका मतलब <strong>architecture level</strong> पर strict data boundary होगी — internal purchase records, supplier rates, inventory, selling price, margins, customer profiles, aur WhatsApp messages कभी किसी दूसरे business ya customer ko expose nahi honge.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[240px]">
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Architecture Status:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ENFORCED
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>AI Data Retention:</span>
                <span className="text-slate-200 font-mono font-semibold">0 Days (Ephemeral)</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Cross-Customer Leakage:</span>
                <span className="text-emerald-400 font-mono font-semibold">0% (Tenant Blocked)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="data-trust-hero-simulator-btn"
                onClick={() => setActiveSubView("simulator")}
                className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Test Role Simulator</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          id="data-trust-tab-principles"
          onClick={() => setActiveSubView("principles")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubView === "principles"
              ? "bg-emerald-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>8 Data Trust Principles</span>
        </button>

        <button
          id="data-trust-tab-simulator"
          onClick={() => setActiveSubView("simulator")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubView === "simulator"
              ? "bg-emerald-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Role-Based Access Simulator (RBAC)</span>
        </button>

        <button
          id="data-trust-tab-ai-pipeline"
          onClick={() => setActiveSubView("ai-pipeline")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubView === "ai-pipeline"
              ? "bg-emerald-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI Boundary Pipeline (AI ≠ Authority)</span>
        </button>

        <button
          id="data-trust-tab-boundary-matrix"
          onClick={() => setActiveSubView("boundary-matrix")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubView === "boundary-matrix"
              ? "bg-emerald-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>12 Internal Data Entities Matrix</span>
        </button>

        <button
          id="data-trust-tab-audit-log"
          onClick={() => setActiveSubView("audit-log")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubView === "audit-log"
              ? "bg-emerald-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time Access Audit Log</span>
        </button>
      </div>

      {/* VIEW 1: The 8 TRUCK WALA DATA TRUST PRINCIPLES */}
      {activeSubView === "principles" && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>The 8 Fixed Data Trust Principles</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                  All 8 Active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                These rules are hardcoded into database schemas, API gateways, and worker tokens. No code change can bypass them.
              </p>
            </div>

            <div className="bg-slate-950 px-3.5 py-2 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Owner UX: <strong>Simple ("Photo ➔ Samjho ➔ Done")</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DATA_TRUST_PRINCIPLES.map((principle) => (
              <div
                key={principle.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-black text-xs flex items-center justify-center">
                      0{principle.id}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {principle.title}
                      </h3>
                      <span className="text-[11px] text-amber-400/90 font-medium block mt-0.5">
                        {principle.hindiTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex-shrink-0">
                    ENFORCED
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {principle.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="text-slate-400 truncate">
                    Control: <strong className="text-slate-200 font-normal">{principle.technicalEnforcement}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Owner Simple UX Assurance Card */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 rounded-xl p-5 shadow space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Owner Experience: Simple But Powerful</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Owner ko privacy ya cryptography ki engineering nahi dekhni padegi. Unka daily experience sirf itna hi rahega:
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 py-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                1. 📸 Photo bhejo
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                2. 🤖 System samjhe
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200">
                3. ✅ Review karo
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                4. 🎉 Done
              </span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              Security, permissions, evidence, encryption, audit, database aur AI controls backend me quietly kaam karte rahenge.
            </p>
          </div>
        </div>
      )}

      {/* VIEW 2: ROLE-BASED ACCESS SIMULATOR (RBAC) */}
      {activeSubView === "simulator" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  <span>Role-Based Access Control (RBAC) Live Simulator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a persona to see exactly what that person is permitted to see vs. what is strictly blocked or redacted.
                </p>
              </div>

              {/* Persona Selector Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button
                  id="rbac-role-owner-btn"
                  onClick={() => setSimulatedRole("OWNER")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    simulatedRole === "OWNER"
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>👑 Owner</span>
                </button>

                <button
                  id="rbac-role-technician-btn"
                  onClick={() => setSimulatedRole("TECHNICIAN")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    simulatedRole === "TECHNICIAN"
                      ? "bg-indigo-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>🔧 Head Mechanic</span>
                </button>

                <button
                  id="rbac-role-customer-btn"
                  onClick={() => setSimulatedRole("CUSTOMER")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    simulatedRole === "CUSTOMER"
                      ? "bg-emerald-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>🚛 Fleet Customer</span>
                </button>

                <button
                  id="rbac-role-ai-worker-btn"
                  onClick={() => setSimulatedRole("AI_WORKER")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    simulatedRole === "AI_WORKER"
                      ? "bg-rose-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>🤖 AI Worker</span>
                </button>
              </div>
            </div>

            {/* Current Active Persona Scope Banner */}
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                simulatedRole === "OWNER"
                  ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                  : simulatedRole === "TECHNICIAN"
                  ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-200"
                  : simulatedRole === "CUSTOMER"
                  ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/20 border-rose-500/40 text-rose-200"
              }`}
            >
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-sm block">
                  Simulating View as:{" "}
                  {simulatedRole === "OWNER"
                    ? "Shop Owner (Rajesh Sharma)"
                    : simulatedRole === "TECHNICIAN"
                    ? "Technician / Head Mechanic (Ramesh Ustad)"
                    : simulatedRole === "CUSTOMER"
                    ? "Vehicle / Fleet Owner (Harpreet Singh, Truck RJ14-GB-4412)"
                    : "AI Scoped Task Worker #81"}
                </strong>
                <p className="mt-1 text-[11px] opacity-90">
                  {simulatedRole === "OWNER" &&
                    "Full executive access. Can view supplier purchase price (₹4,400), workshop profit margins (35%), full dealer credit ledger, and authorize commits."}
                  {simulatedRole === "TECHNICIAN" &&
                    "Operational access ONLY. Sees parts to fit ('Viscus T'), rack locations ('Rack A-2'), and fitment specs. ALL DEALER PURCHASE RATES & MARGINS ARE DYNAMICALLY MASKED."}
                  {simulatedRole === "CUSTOMER" &&
                    "Zero internal access. Sees ONLY their own truck RJ14-GB-4412 repair status and verified customer bill. Cannot see supplier costs, workshop inventory, or other customers' trucks."}
                  {simulatedRole === "AI_WORKER" &&
                    "Ephemeral scoped token. Only receives the document payload to extract text/JSON. CANNOT modify ledger, cannot see full DB, payload auto-purged after execution."}
                </p>
              </div>
            </div>

            {/* Live Data Simulation Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {/* Card 1: Sample Purchase Record (PO-2024-001 Line Item) */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-slate-300">
                    Resource: Purchase Order #PO-2024-001 (Line Item #1)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Internal Supplier Record
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Part Description:</span>
                    <span className="font-bold text-slate-100">Viscus T (Code 3/86)</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Quantity Ordered / Recv:</span>
                    <span className="font-mono font-bold text-slate-100">2 Units / 2 Received</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Physical Godown Rack:</span>
                    <span className="font-mono text-emerald-400">Rack A-2 (Bin 04)</span>
                  </div>

                  {/* SENSITIVE FIELD: Dealer Purchase Rate */}
                  <div className="flex justify-between items-center py-2 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Wholesale Dealer Rate:</span>
                    </span>
                    {simulatedRole === "OWNER" ? (
                      <span className="font-mono font-bold text-amber-400">₹4,400 / unit</span>
                    ) : simulatedRole === "AI_WORKER" ? (
                      <span className="font-mono text-slate-300">₹4,400 (In OCR Task Scope)</span>
                    ) : (
                      <span className="font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-800">
                        🔒 [MASKED / RESTRICTED]
                      </span>
                    )}
                  </div>

                  {/* SENSITIVE FIELD: Profit Margin */}
                  <div className="flex justify-between items-center py-2 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Workshop Profit Margin:</span>
                    </span>
                    {simulatedRole === "OWNER" ? (
                      <span className="font-mono font-bold text-emerald-400">+38.5% (₹1,700)</span>
                    ) : (
                      <span className="font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-800">
                        🔒 [CONFIDENTIAL - OWNER ONLY]
                      </span>
                    )}
                  </div>

                  {/* SENSITIVE FIELD: Supplier Credit Balance */}
                  <div className="flex justify-between items-center py-2 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sharma Auto Total Ledger Balance:</span>
                    </span>
                    {simulatedRole === "OWNER" ? (
                      <span className="font-mono font-bold text-amber-400">₹1,25,000 (Current Credit)</span>
                    ) : (
                      <span className="font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded text-[11px] font-bold border border-rose-800">
                        🚫 [NO ACCESS / HIDDEN]
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Sample Cross-Tenant Customer Record */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-slate-300">
                    Resource: Fleet Ledger - Harpreet Singh (Truck RJ14-GB-4412)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Tenant Partition
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Active Job Status:</span>
                    <span className="font-bold text-amber-400">Wheel Hub Bearing Replacement</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-900">
                    <span className="text-slate-400">Estimated Delivery:</span>
                    <span className="font-mono text-slate-200">Today, 04:30 PM (Highway Mobile Van)</span>
                  </div>

                  {/* CROSS TENANT CHECK: Fleet B Data Access */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-300">
                        Attempt Accessing Fleet B (Haryana Cargo, HR55-AK-9001):
                      </span>
                    </div>
                    {simulatedRole === "OWNER" ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Owner has full master visibility over all workshop clients.</span>
                      </div>
                    ) : simulatedRole === "CUSTOMER" ? (
                      <div className="text-[11px] text-rose-400 bg-rose-950/60 p-2 rounded border border-rose-800 flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                        <span>HTTP 403 Forbidden: Tenant Isolation Enforced. Customer cannot access another fleet's data!</span>
                      </div>
                    ) : simulatedRole === "TECHNICIAN" ? (
                      <div className="text-[11px] text-slate-400">
                        Technician only assigned to Job #EMG-774. Other fleet jobs inaccessible without dispatch order.
                      </div>
                    ) : (
                      <div className="text-[11px] text-rose-400">
                        AI worker blocked from cross-tenant aggregation.
                      </div>
                    )}
                  </div>

                  {/* AI Authority Gate */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>Can this persona edit ledger without approval?</span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          simulatedRole === "OWNER"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : "bg-rose-950 text-rose-400 border border-rose-800"
                        }`}
                      >
                        {simulatedRole === "OWNER" ? "AUTHORIZED (WITH LOG)" : "BLOCKED BY PRINCIPLE 4"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      {simulatedRole === "AI_WORKER"
                        ? "AI is NOT an authority. AI can only extract and recommend; human approval is strictly mandatory."
                        : "All state modifications append an immutable entry to the cryptographic audit trail."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: AI BOUNDARY PIPELINE (AI ≠ AUTHORITY) */}
      {activeSubView === "ai-pipeline" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <span>AI Data Boundary & Secure Ingestion Pipeline</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                "AI can access only what it is authorized to process." No 'AI knows everything' architecture.
              </p>
            </div>

            {/* Pipeline Architecture Diagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-emerald-400">STEP 1</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">WhatsApp / Photo</div>
                <p className="text-[10px] text-slate-400">Incoming raw parchi, bill PDF, or mechanic voice</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-indigo-400">STEP 2</span>
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">Secure Ingestion</div>
                <p className="text-[10px] text-slate-400">SHA-256 hash locked, WORM storage preserved</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-800/40 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-amber-400">STEP 3 (AI)</span>
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">Private Processing</div>
                <p className="text-[10px] text-slate-400">Scoped token, 0-day retention, zero training</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-slate-400">STEP 4</span>
                <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mx-auto">
                  <Database className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">Structured Data</div>
                <p className="text-[10px] text-slate-400">Extracted JSON with rates, qty & confidence %</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-800/40 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-emerald-400">STEP 5</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">Human Approval</div>
                <p className="text-[10px] text-slate-400">Owner or Ustad Ramesh validates</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-800/40 text-center space-y-2 relative">
                <span className="text-[10px] font-mono font-bold text-emerald-400">STEP 6</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-100">Truck Wala DB</div>
                <p className="text-[10px] text-slate-400">Committed only to private workshop database</p>
              </div>
            </div>

            {/* AI Do's vs Don'ts Comparison Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI का काम (Authorized Tasks):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-200/90 pl-5 list-disc">
                  <li><strong>समझना (Understand):</strong> Understand messy workshop Hindi, Hinglish, voice notes & oil-stained parchis.</li>
                  <li><strong>Extract करना:</strong> Parse line items (part name, quantity, dealer invoice number).</li>
                  <li><strong>Classify करना:</strong> Classify message as Purchase, Sale, Emergency Breakdown, or Payment.</li>
                  <li><strong>Recommendation देना:</strong> Highlight price variances and suggest missing bill matching.</li>
                </ul>
              </div>

              <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-sm text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>AI का काम नहीं (Strictly Forbidden):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-rose-200/90 pl-5 list-disc">
                  <li><strong>Business data बाहर ले जाना:</strong> Proprietary dealer discounts or margins never leave the private enclave.</li>
                  <li><strong>दूसरे customer को दिखाना:</strong> Fleet A data is strictly blocked from ever being visible to Fleet B.</li>
                  <li><strong>बिना approval record बदलना:</strong> AI cannot debit accounts or increment physical stock on its own.</li>
                  <li><strong>Public model training:</strong> Data is never used to train external public foundation models.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: 12 INTERNAL DATA ENTITIES MATRIX */}
      {activeSubView === "boundary-matrix" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Internal Business Data — Boundary & Visibility Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  12 sensitive internal data assets mapped against authorized visibility levels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">0% External Exposure</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Internal Asset / Entity</th>
                    <th className="py-3 px-3 text-center">Owner</th>
                    <th className="py-3 px-3 text-center">Technician</th>
                    <th className="py-3 px-3 text-center">Customer</th>
                    <th className="py-3 px-3 text-center">AI Worker</th>
                    <th className="py-3 px-4">Architectural Boundary Enforcement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {DATA_PRIVACY_BOUNDARIES.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-100">{item.entity}</div>
                        <div className="text-[11px] text-amber-400/80 mt-0.5">{item.hindiName}</div>
                      </td>

                      {/* Owner Column */}
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          FULL ACCESS
                        </span>
                      </td>

                      {/* Technician Column */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.technicianAccess === "SCOPED_VIEW"
                              ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                              : item.technicianAccess === "MASKED"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {item.technicianAccess === "SCOPED_VIEW"
                            ? "👀 Scoped"
                            : item.technicianAccess === "MASKED"
                            ? "🔒 Masked"
                            : "🚫 No Access"}
                        </span>
                      </td>

                      {/* Customer Column */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.customerAccess === "OWN_VEHICLE_ONLY"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : "bg-rose-950 text-rose-400 border border-rose-800"
                          }`}
                        >
                          {item.customerAccess === "OWN_VEHICLE_ONLY"
                            ? "🚛 Own Truck"
                            : "🚫 No Access"}
                        </span>
                      </td>

                      {/* AI Worker Column */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.aiAccess === "EPHEMERAL_TASK_ONLY"
                              ? "bg-slate-800 text-slate-300 border border-slate-700"
                              : item.aiAccess === "PROMPT_MASKED"
                              ? "bg-amber-950 text-amber-300 border border-amber-800"
                              : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          }`}
                        >
                          {item.aiAccess === "EPHEMERAL_TASK_ONLY"
                            ? "⏳ Task Token"
                            : item.aiAccess === "PROMPT_MASKED"
                            ? "🔒 Masked"
                            : "♻️ Zero Retention"}
                        </span>
                      </td>

                      {/* Leakage Protection Details */}
                      <td className="py-3 px-4 text-slate-300 text-[11px] leading-relaxed">
                        {item.leakageProtection}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: REAL-TIME ACCESS AUDIT LOG */}
      {activeSubView === "audit-log" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Immutable Access Audit Log (Principle #6: Every Action Tracked)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Every reading, masking, and verification event is cryptographically sealed with SHA-256 signatures.
                </p>
              </div>

              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                Log Stream Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {INITIAL_ACCESS_AUDIT_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{log.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{log.timestamp}</span>
                      <span className="text-slate-500">•</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                        {log.role}
                      </span>
                      <strong className="text-white">{log.actor}</strong>
                    </div>

                    <div className="text-slate-300">
                      Action: <span className="font-mono text-amber-300">{log.action}</span> on{" "}
                      <span className="text-slate-100 font-semibold">{log.targetResource}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      Scope: {log.dataScope}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-1 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        log.privacyShieldStatus === "ENCRYPTED_ISOLATED"
                          ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                          : log.privacyShieldStatus === "MASKED_APPLIED"
                          ? "bg-amber-950 text-amber-300 border border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}
                    >
                      🛡️ {log.privacyShieldStatus}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{log.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
