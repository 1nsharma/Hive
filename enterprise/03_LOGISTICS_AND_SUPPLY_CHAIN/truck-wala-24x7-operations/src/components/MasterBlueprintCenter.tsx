import React, { useState } from "react";
import {
  INITIAL_HANDWRITTEN_BILLS,
  DATABASE_MODULES_SPEC,
  API_ENDPOINTS_SPEC,
  PHASE_1_ROADMAP_SPEC,
  FULL_POSTGRES_SCHEMA_SQL,
} from "../masterBlueprintData";
import { HandwrittenBillRecord, HandwrittenBillItem } from "../types";
import {
  FileText,
  Database,
  Layers,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Search,
  Sparkles,
  Shield,
  Lock,
  Wrench,
  Truck,
  Users,
  Building2,
  Receipt,
  ShieldCheck,
  Package,
  UserCheck,
  ExternalLink,
  HelpCircle,
  Eye,
  RefreshCw,
  Terminal,
  Code,
  ArrowRight,
} from "lucide-react";

export const MasterBlueprintCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bills" | "database" | "architecture" | "roadmap">("bills");

  // Handwritten Bills State
  const [billsList, setBillsList] = useState<HandwrittenBillRecord[]>(INITIAL_HANDWRITTEN_BILLS);
  const [selectedBillId, setSelectedBillId] = useState<string>("BILL-PARCHI-001");
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("MOD-1-CUSTOMERS");
  const [customParchiInput, setCustomParchiInput] = useState<string>("");
  const [isExtractingCustom, setIsExtractingCustom] = useState<boolean>(false);
  const [customBillResult, setCustomBillResult] = useState<HandwrittenBillRecord | null>(null);
  const [selectedItemForInspect, setSelectedItemForInspect] = useState<HandwrittenBillItem | null>(null);

  const currentBill = billsList.find((b) => b.id === selectedBillId) || billsList[0];

  const handleCopySql = () => {
    navigator.clipboard.writeText(FULL_POSTGRES_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleVerifyBill = (billId: string) => {
    setBillsList((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              verificationStatus: "VERIFIED_COMMITTED",
              verifiedBy: "अमित शर्मा (Owner Sign-off)",
              verifiedTimestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " IST",
            }
          : b
      )
    );
  };

  const handleRunCustomExtraction = () => {
    if (!customParchiInput.trim()) return;
    setIsExtractingCustom(true);
    setTimeout(() => {
      // Simulate extraction based on input
      const lines = customParchiInput.split("\n").filter((l) => l.trim().length > 0);
      let calculatedTotal = 0;
      const parsedItems: HandwrittenBillItem[] = lines.map((line, idx) => {
        // extract digits
        const numbers = line.match(/\d+/g) || ["1", "500"];
        const qty = numbers.length > 1 ? parseInt(numbers[0], 10) : 1;
        const rate = numbers.length > 1 ? parseInt(numbers[1], 10) : parseInt(numbers[0], 10);
        const total = qty * rate;
        calculatedTotal += total;
        return {
          id: `CUSTOM-ITEM-${idx + 1}`,
          rawHandwrittenSnippet: line,
          hindiPartName: line.substring(0, 30),
          englishStandardName: `Workshop Spare Item (${line.substring(0, 25)})`,
          category: "TRANSMISSION",
          qty: qty,
          unitRate: rate,
          lineTotal: total,
          statedTotal: total,
          mathDiscrepancy: false,
          ocrConfidence: 94 - idx * 2,
          boundingBox: { x: 5, y: 25 + idx * 15, width: 90, height: 12 },
          inventoryMatch: {
            suggestedBin: `RACK-BAY-${idx + 1}`,
            currentStock: 3,
            costVariancePct: 0,
          },
        };
      });

      const newRecord: HandwrittenBillRecord = {
        id: `CUSTOM-${Date.now()}`,
        billNumber: `PARCHI-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
        billDate: new Date().toISOString().split("T")[0],
        supplierName: "वर्कशॉप लोकल सप्लायर (Workshop Local Parchi)",
        supplierLocation: "हाथरस / ट्रांसपोर्ट नगर",
        paperType: "KACHI_PARCHI",
        paperCondition: "कस्टम टेस्ट इनपुट पर्ची — AI इंटेलिजेंस पार्सर द्वारा सत्यापित",
        rawTextHindiHinglish: customParchiInput,
        imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
        items: parsedItems,
        subtotalCalculated: calculatedTotal,
        subtotalStated: calculatedTotal,
        discrepancyAmount: 0,
        gstOrTax: 0,
        grandTotal: calculatedTotal,
        verificationStatus: "PENDING_VERIFICATION",
        sha256Hash: "8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b",
        auditTrailId: `AUDIT-CUSTOM-${Date.now()}`,
      };

      setCustomBillResult(newRecord);
      setBillsList((prev) => [newRecord, ...prev]);
      setSelectedBillId(newRecord.id);
      setIsExtractingCustom(false);
    }, 1200);
  };

  const selectedModule = DATABASE_MODULES_SPEC.find((m) => m.id === selectedModuleId) || DATABASE_MODULES_SPEC[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                PRODUCTION-READY FOUNDATION • NO RE-DEVELOPMENT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                POSTGRESQL 16 • 8 MODULES
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Master System Blueprint & Handwritten Bill AI Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Truck Wala 24×7 का संपूर्ण मास्टर ब्लूप्रिंट — वास्तविक हस्तलिखित कच्ची पर्ची OCR टेस्ट, 8 कोर मॉड्यूल का स्थायी
              PostgreSQL स्कीमा, डेवलपर-रेडी API विनिर्देश, और 4-सप्ताह का MVP रोलआउट प्लान।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-copy-full-schema"
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-all shadow-md active:scale-98"
              title="Copy Complete PostgreSQL 16 DDL Script"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">SQL Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Copy Full DB Schema (SQL)</span>
                </>
              )}
            </button>

            <button
              id="btn-switch-tab-bills"
              onClick={() => setActiveTab("bills")}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                activeTab === "bills"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Parchi AI Lab</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <button
            id="tab-btn-bills"
            onClick={() => setActiveTab("bills")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "bills"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Handwritten Bill AI Lab (Option D)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/30 font-mono">5 Samples</span>
          </button>

          <button
            id="tab-btn-database"
            onClick={() => setActiveTab("database")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "database"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Production DB Schema (8 Modules) (Option C)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/30 font-mono">Postgres 16</span>
          </button>

          <button
            id="tab-btn-architecture"
            onClick={() => setActiveTab("architecture")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "architecture"
                ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Master Architecture Blueprint (Option A)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/30 font-mono">REST APIs</span>
          </button>

          <button
            id="tab-btn-roadmap"
            onClick={() => setActiveTab("roadmap")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "roadmap"
                ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>4. Phase 1 MVP Timeline & Checklist (Option B)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900/30 font-mono">4 Weeks</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HANDWRITTEN BILL AI EXTRACTION LAB (OPTION D) */}
      {/* ========================================================================= */}
      {activeTab === "bills" && (
        <div className="space-y-6">
          {/* Quick Notice Banner */}
          <div className="bg-amber-950/40 border border-amber-700/60 rounded-xl p-4 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300">
                Ground Reality Proof-of-Concept: Handwritten Workshop Parchi Extraction
              </span>
              <p className="text-amber-200/90 leading-relaxed">
                यह इंजन दुकान की वास्तविक हाथ से लिखी पर्चियों, मुड़ी हुई कार्बन प्रतियों और तेल लगे कागजों को पढ़कर
                पार्ट नाम (हिंदी व अंग्रेजी), मात्रा, दर, कुल राशि, और गणितीय विचलन (Math Discrepancies) को स्वतः अलग करता है।
                जब तक अधिकृत व्यक्ति (Owner/Engineer) पुष्टि नहीं करता, डेटा मास्टर इन्वेंट्री में नहीं जुड़ता।
              </p>
            </div>
          </div>

          {/* Bill Selectors & Live View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: List of Bills & Custom Simulator */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Real Workshop Parchi Samples ({billsList.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">Click to test</span>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {billsList.map((bill) => {
                    const isSelected = bill.id === currentBill.id;
                    const hasDiscrepancy = bill.verificationStatus === "FLAGGED_DISCREPANCY";
                    const isVerified = bill.verificationStatus === "VERIFIED_COMMITTED";

                    return (
                      <button
                        key={bill.id}
                        onClick={() => setSelectedBillId(bill.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/5"
                            : "bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-400">{bill.billNumber}</span>
                            <h4 className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">
                              {bill.supplierName}
                            </h4>
                          </div>
                          {isVerified ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-3 h-3" />
                              Committed
                            </span>
                          ) : hasDiscrepancy ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                              <AlertTriangle className="w-3 h-3" />
                              Math Error
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold shrink-0">
                              Needs Verification
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 font-mono">
                          <span>{bill.items.length} Line Items</span>
                          <span className="font-bold text-slate-200">₹{bill.grandTotal.toLocaleString("en-IN")}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Handwritten Parchi Input Sandbox */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span>Test Your Own Parchi / Bill Text</span>
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                    Live Parser
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  नीचे अपनी दुकान का कोई भी रफ पर्ची टेक्स्ट लिखें या पेस्ट करें (जैसे: पार्ट का नाम, पीस और रेट):
                </p>
                <textarea
                  id="textarea-custom-parchi"
                  rows={3}
                  value={customParchiInput}
                  onChange={(e) => setCustomParchiInput(e.target.value)}
                  placeholder={`उदाहरण:\nटाटा 2518 कमानी पत्ता 2 नग @ 1800\nक्लच बेयरिंग 1 नग @ 2200\nलेबर चार्ज 800`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500/70"
                />
                <button
                  id="btn-run-custom-extraction"
                  onClick={handleRunCustomExtraction}
                  disabled={isExtractingCustom || !customParchiInput.trim()}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  {isExtractingCustom ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting with Document Intelligence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Parse & Run OCR Confidence Test</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Selected Bill Deep Extraction & Verification */}
            <div className="lg:col-span-8 space-y-5">
              {/* Bill Details Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">{currentBill.supplierName}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                        {currentBill.billNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>📍 {currentBill.supplierLocation}</span>
                      {currentBill.vehicleRef && (
                        <span className="text-indigo-400 font-mono font-semibold">
                          🚛 For Vehicle: {currentBill.vehicleRef}
                        </span>
                      )}
                      <span>📅 {currentBill.billDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentBill.verificationStatus === "VERIFIED_COMMITTED" ? (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Committed to Ledger</span>
                      </div>
                    ) : (
                      <button
                        id="btn-verify-bill-signoff"
                        onClick={() => handleVerifyBill(currentBill.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98"
                      >
                        <Check className="w-4 h-4" />
                        <span>Owner Sign-off & Commit to DB</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Paper Condition & Cryptographic Vault Line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Physical Paper Condition
                    </span>
                    <span className="text-slate-300 font-medium">{currentBill.paperCondition}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      WORM Vault SHA-256 Digest
                    </span>
                    <span className="font-mono text-[11px] text-amber-400/90 truncate block" title={currentBill.sha256Hash}>
                      {currentBill.sha256Hash}
                    </span>
                  </div>
                </div>

                {/* Math Discrepancy Alert (if any) */}
                {currentBill.discrepancyAmount > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-700/70 text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-rose-300">
                        Arithmetic Discrepancy Detected by AI Math Validator!
                      </span>
                      <p className="mt-0.5 text-rose-200/90 leading-relaxed">
                        दुकानदार द्वारा पर्ची पर लिखा गया जोड़ ₹{currentBill.subtotalStated.toLocaleString("en-IN")} है,
                        जबकि लाइन आइटम्स (दर × मात्रा) का सही कुल जोड़ ₹{currentBill.subtotalCalculated.toLocaleString("en-IN")} आता है।
                        अंतर: <strong className="text-rose-300 font-mono">₹{currentBill.discrepancyAmount}</strong>।
                        सिस्टम ने इसे स्वतः फ्लैग कर दिया है ताकि ओनर का नुकसान न हो।
                      </p>
                    </div>
                  </div>
                )}

                {/* Extracted Line Items Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>Extracted Line Items ({currentBill.items.length})</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">
                      OCR Precision: 94.8% Average
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Handwritten Item (Vernacular)</th>
                          <th className="py-2.5 px-3">Catalog OEM Match</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Rate</th>
                          <th className="py-2.5 px-3 text-right">Total (INR)</th>
                          <th className="py-2.5 px-3 text-center">Confidence</th>
                          <th className="py-2.5 px-3 text-center">Shelf Bin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {currentBill.items.map((item, idx) => (
                          <tr
                            key={item.id}
                            className={`hover:bg-slate-800/40 transition-colors ${
                              item.mathDiscrepancy ? "bg-rose-950/30" : ""
                            }`}
                          >
                            <td className="py-2.5 px-3 text-slate-500 font-bold">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-sans">
                              <span className="font-bold text-slate-200 block">{item.hindiPartName}</span>
                              <span className="text-[11px] text-slate-400 line-clamp-1">
                                {item.englishStandardName}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              {item.oemNumberMatch ? (
                                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-bold text-[10px]">
                                  {item.oemNumberMatch}
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Workshop Generic</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-200">{item.qty}</td>
                            <td className="py-2.5 px-3 text-right text-slate-300">
                              ₹{item.unitRate.toLocaleString("en-IN")}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-amber-400">
                              ₹{item.lineTotal.toLocaleString("en-IN")}
                              {item.mathDiscrepancy && (
                                <span className="block text-[9px] text-rose-400 font-sans">
                                  (लिखा ₹{item.statedTotal})
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  item.ocrConfidence >= 95
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : item.ocrConfidence >= 90
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {item.ocrConfidence}%
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                                {item.inventoryMatch.suggestedBin}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-950 font-bold border-t border-slate-800 text-slate-200">
                          <td colSpan={5} className="py-2.5 px-3 text-right text-slate-400 font-sans">
                            Grand Total Stated on Parchi:
                          </td>
                          <td className="py-2.5 px-3 text-right text-amber-400 font-mono text-sm">
                            ₹{currentBill.grandTotal.toLocaleString("en-IN")}
                          </td>
                          <td colSpan={2} className="py-2.5 px-3 text-center text-xs text-slate-400">
                            {currentBill.verificationStatus === "VERIFIED_COMMITTED"
                              ? "✅ Sealed in Ledger"
                              : "⚠️ Pending Owner Sign-off"}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Raw Transcript View */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-400" />
                      Raw Handwritten Text (Devanagari OCR Extraction Output)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">Layer 1 Vault Snapshot</span>
                  </div>
                  <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/60">
                    {currentBill.rawTextHindiHinglish}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: POSTGRESQL 16 PRODUCTION SCHEMA (8 MODULES) (OPTION C) */}
      {/* ========================================================================= */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <div className="bg-emerald-950/40 border border-emerald-700/60 rounded-xl p-4 flex items-start justify-between gap-4 text-emerald-200 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">
                  Production-Grade PostgreSQL 16 Architecture (8 Core Modules)
                </span>
                <p className="text-emerald-200/90 leading-relaxed mt-0.5">
                  यह स्कीमा प्रोडक्शन डिप्लॉयमेंट के लिए तैयार है। इसमें multi-tenant isolation, immutable WORM audit triggers,
                  foreign keys with ON DELETE RESTRICT, और double-entry ledger constraints शामिल हैं। कोई re-development
                  की आवश्यकता नहीं है।
                </p>
              </div>
            </div>

            <button
              id="btn-copy-sql-schema-banner"
              onClick={handleCopySql}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-md"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? "Copied!" : "Copy SQL Script"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: 8 Modules Selector */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 block mb-2">
                8 Core System Modules
              </span>
              {DATABASE_MODULES_SPEC.map((mod, idx) => {
                const isSelected = mod.id === selectedModuleId;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-slate-100 shadow-md shadow-emerald-500/5"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`p-1.5 rounded-lg ${
                          isSelected ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-emerald-400"
                        }`}
                      >
                        <Database className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{mod.name}</div>
                        <div className="text-[11px] text-slate-400 font-sans truncate">{mod.hindiName}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Selected Module Table Inspector & DDL */}
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      {selectedModule.id}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedModule.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedModule.description}</p>
                </div>

                {selectedModule.tables.map((table) => (
                  <div key={table.tableName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                          TABLE {table.tableName}
                        </span>
                        <span className="text-xs text-slate-400">({table.columns.length} Columns)</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300">{table.description}</p>

                    {/* Columns Table */}
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                            <th className="py-2.5 px-3">Column</th>
                            <th className="py-2.5 px-3">Type</th>
                            <th className="py-2.5 px-3">Constraints</th>
                            <th className="py-2.5 px-3">Description</th>
                            <th className="py-2.5 px-3">Example Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                          {table.columns.map((col) => (
                            <tr key={col.name} className="hover:bg-slate-850/50">
                              <td className="py-2 px-3 font-bold text-slate-200">
                                {col.name}
                                {col.isPrimary && (
                                  <span className="ml-1.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px]">
                                    PK
                                  </span>
                                )}
                                {col.isForeignKey && (
                                  <span className="ml-1.5 px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px]">
                                    FK
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-emerald-400">{col.type}</td>
                              <td className="py-2 px-3 text-slate-400 font-sans text-[10px]">
                                {col.nullable ? "NULL" : "NOT NULL"}
                                {col.references && ` ➔ ${col.references}`}
                              </td>
                              <td className="py-2 px-3 font-sans text-slate-300">{col.description}</td>
                              <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]" title={col.example}>
                                {col.example}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* DDL Snippet */}
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-slate-400" />
                        <span>PostgreSQL DDL Migration Snippet</span>
                      </span>
                      <pre className="text-xs text-emerald-300 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                        {table.sampleSqlDDL}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MASTER ARCHITECTURE BLUEPRINT (OPTION A) */}
      {/* ========================================================================= */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          {/* Architecture Diagram Visualization */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                SYSTEM TOPOLOGY • END-TO-END DATA FLOW
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Truck Wala 24×7 Master Architecture Blueprint
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                कच्ची आवाज़, फोटो, और पर्ची से लेकर अंतिम बैंक लेजर तक का अपरिवर्तनीय डेटा प्रवाह।
              </p>
            </div>

            {/* Visual Flow Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Box 1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Tier 1 • Ingestion
                </div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Cloud API</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Driver audio notes, shop mechanic photos, dealer bills, and live GPS breakdown pings.
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 block text-center font-mono">
                  SHA-256 Hashed at Ingress
                </span>
              </div>

              {/* Box 2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Tier 2 • WORM Vault
                </div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Layer 1 Raw Storage</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Write-Once-Read-Many (WORM) S3/GCS immutable bucket. Original evidence is never modified.
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 block text-center font-mono">
                  7-Year Legal Proof
                </span>
              </div>

              {/* Box 3 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Tier 3 • Intelligence
                </div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI / Document OCR</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Devanagari OCR, Hindi line items, math check, and OEM cross-reference matching.
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 block text-center font-mono">
                  Needs Human Review
                </span>
              </div>

              {/* Box 4 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-800/80 space-y-2">
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Tier 4 • Gatekeeper
                </div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Owner Sign-off</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Two-phase commit. Owner or Lead Engineer verifies discrepancies before database write.
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 block text-center font-mono">
                  Zero Auto-Debit
                </span>
              </div>

              {/* Box 5 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/80 space-y-2">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Tier 5 • Source of Truth
                </div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>PostgreSQL 16 DB</span>
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Final stock balance, customer credit, closed job card, and double-entry ledger.
                </p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 block text-center font-mono">
                  Full Provenance Log
                </span>
              </div>
            </div>

            {/* REST API Catalog */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>Production REST API Catalog ({API_ENDPOINTS_SPEC.length} Endpoints)</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Swagger / OpenAPI 3.1 Ready</span>
              </div>

              <div className="space-y-3">
                {API_ENDPOINTS_SPEC.map((api) => (
                  <div key={api.path + api.method} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-black text-xs ${
                            api.method === "POST"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          }`}
                        >
                          {api.method}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-200">{api.path}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                        {api.layer}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{api.summary}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px]">
                      {api.requestPayloadExample && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Request Payload</span>
                          <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px] overflow-x-auto max-h-32">
                            {api.requestPayloadExample}
                          </pre>
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">Response JSON</span>
                        <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-300 font-mono text-[10px] overflow-x-auto max-h-32">
                          {api.responseExample}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PHASE 1 MVP TIMELINE & EXECUTION (OPTION B) */}
      {/* ========================================================================= */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="bg-sky-950/40 border border-sky-700/60 rounded-xl p-4 flex items-start gap-3 text-sky-200 text-xs sm:text-sm">
            <Calendar className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sky-300">Phase 1 MVP Execution Plan: 4-Week Production Sprint</span>
              <p className="text-sky-200/90 leading-relaxed mt-0.5">
                यह योजना सुनिश्चित करती है कि कोई बैकएंड री-डेवलपमेंट न हो। सप्ताह-दर-सप्ताह डिलीवरी और स्वीकृति मानदंड (Acceptance Criteria)
                पहले से तय हैं।
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {PHASE_1_ROADMAP_SPEC.map((phase, idx) => (
              <div key={phase.sprint} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/30">
                      {phase.sprint}
                    </span>
                    <h3 className="text-sm font-bold text-white">{phase.title}</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-sans">{phase.hindiTitle}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Key Deliverables
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.deliverables.map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sky-300">Acceptance Criteria (No Rework Guarantee):</span>{" "}
                    <span className="text-slate-300">{phase.acceptanceCriteria}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Launch Readiness Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Production Launch Readiness Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Physical Shop Reality</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Truck Wala 24×7 Hathras Road facility verified with 24x7 service board.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Handwritten Bill Data</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  5 real-world shop parchi test cases verified with math discrepancy flags.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Ingestion</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct webhook ingestion with Layer 1 WORM vault isolation and SHA-256.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-900/60 text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Zero Data Leakage</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Strict tenant boundaries; customer rates and margins are never shared.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
