import React, { useState } from "react";
import { ProvenanceTier } from "../../types";
import { ProvenanceBadge } from "./ProvenanceBadge";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Search,
  ExternalLink,
  RefreshCw,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ParsedDocumentField {
  label: string;
  extractedValue: string;
  tier: ProvenanceTier;
  sourceAuthority: string;
  confidence: number;
  verificationUpgradeSteps?: string[];
}

interface PresetDocument {
  id: string;
  name: string;
  docType: string;
  jurisdiction: string;
  description: string;
  extractedFields: ParsedDocumentField[];
}

const PRESET_DOCUMENTS: PresetDocument[] = [
  {
    id: "khatauni-442",
    name: "UP Revenue Board Khatoni Extract (Form B)",
    docType: "Land Revenue Record",
    jurisdiction: "Tehsil Sarojini Nagar, Lucknow",
    description: "Certified land title record showing agricultural conversion (Section 143) status, ancestral ownership, and co-tenure shares.",
    extractedFields: [
      {
        label: "Khasra Survey Numbers",
        extractedValue: "442/1, 442/2, 443/A",
        tier: "VERIFIED_DATA",
        sourceAuthority: "UP Revenue Board / Tehsil Sarojini Nagar",
        confidence: 99,
        verificationUpgradeSteps: ["Certified copy issued under seal of Sub-Divisional Magistrate (SDM)."],
      },
      {
        label: "Sanctioned Plot Area",
        extractedValue: "87,120 sq.ft (2.00 Acres / 3.2 Bighas)",
        tier: "VERIFIED_DATA",
        sourceAuthority: "Revenue Settlement Record 2021",
        confidence: 98,
      },
      {
        label: "Land Use Conversion Status",
        extractedValue: "Section 143 Non-Agricultural Conversion Declared",
        tier: "VERIFIED_DATA",
        sourceAuthority: "SDM Order No. 492/Rev/2022",
        confidence: 96,
      },
      {
        label: "Encumbrances / Bank Charge",
        extractedValue: "No active mortgage noted in Column 7-12",
        tier: "REQUIRES_VERIFICATION",
        sourceAuthority: "Sub-Registrar Form 15 Non-Encumbrance Search",
        confidence: 45,
        verificationUpgradeSteps: [
          "Mandatory 30-year sub-registrar manual ledger search required to verify no unregistered equitably deposited mortgage deeds.",
        ],
      },
    ],
  },
  {
    id: "masterplan-zonal-extract",
    name: "Master Plan 2031 Zonal Land Use Gazette Excerpt",
    docType: "Statutory Master Plan",
    jurisdiction: "Lucknow Development Authority (LDA)",
    description: "Official Zonal Development Plan gazette showing Sector 45 fronting 45-metre arterial corridor with High Density Mixed-Use zoning.",
    extractedFields: [
      {
        label: "Statutory Zoning Classification",
        extractedValue: "Commercial / High-Density Mixed-Use Corridor",
        tier: "VERIFIED_DATA",
        sourceAuthority: "LDA Master Plan 2031 Gazette Notification Sec 45",
        confidence: 99,
      },
      {
        label: "Base Permissible FAR",
        extractedValue: "2.50 Base FAR",
        tier: "VERIFIED_DATA",
        sourceAuthority: "LDA Building Byelaws Schedule IV Table 2",
        confidence: 98,
      },
      {
        label: "Max Purchasable FAR (Betterment Levy)",
        extractedValue: "1.00 Additional FAR (@ 35% Circle Rate Charge)",
        tier: "ESTIMATED_DATA",
        sourceAuthority: "LDA Betterment Premium Schedule 2024",
        confidence: 85,
      },
      {
        label: "Abutting Right-of-Way (Road Width)",
        extractedValue: "45.00 Metres (150 Feet Master Plan Road)",
        tier: "VERIFIED_DATA",
        sourceAuthority: "NHAI / LDA Zonal Road Alignment Plan",
        confidence: 95,
      },
    ],
  },
  {
    id: "registered-sale-deed",
    name: "Registered Sale Deed & Mutation Certificate",
    docType: "Title Deed",
    jurisdiction: "Sub-Registrar Office IV, Lucknow",
    description: "Previous transaction deed registered in 2017 with clear boundary descriptions, consideration receipt, and stamp duty paid.",
    extractedFields: [
      {
        label: "Registered Title Holders",
        extractedValue: "Suresh Kumar Shukla & 2 Co-parceners",
        tier: "VERIFIED_DATA",
        sourceAuthority: "Sub-Registrar Book 1 Vol 4092 Page 112",
        confidence: 97,
      },
      {
        label: "Historical Circle Rate Paid",
        extractedValue: "₹2,200 per sq.ft (2017 Valuation)",
        tier: "VERIFIED_DATA",
        sourceAuthority: "UP Stamp & Registration Dept",
        confidence: 99,
      },
      {
        label: "Minor / Coparcenary Rights",
        extractedValue: "Clear NOC executed by all surviving Class-1 heirs",
        tier: "REQUIRES_VERIFICATION",
        sourceAuthority: "Genealogy Tree (Shajra-e-Nasab) Notary Affidavit",
        confidence: 40,
        verificationUpgradeSteps: [
          "Publish 15-day Public Notice in 2 vernacular daily newspapers inviting title claims before entering JDA.",
        ],
      },
    ],
  },
  {
    id: "broker-teaser-sheet",
    name: "Broker Proposal & Commercial Asking Sheet",
    docType: "Market Proposal",
    jurisdiction: "Gomti Nagar Extension Broker Consortium",
    description: "Unverified broker mandate claiming ₹18.5 Cr asking price, 65:35 JDA openness, and immediate builder possession.",
    extractedFields: [
      {
        label: "Asking Land Price",
        extractedValue: "₹18.50 Crores (₹9,250/sq.ft)",
        tier: "USER_PROVIDED",
        sourceAuthority: "Broker Mandate Sheet / Landowner Representative",
        confidence: 70,
      },
      {
        label: "Proposed JDA Revenue Ratio",
        extractedValue: "65% Developer : 35% Landowner",
        tier: "USER_PROVIDED",
        sourceAuthority: "Broker Term Teaser",
        confidence: 65,
      },
      {
        label: "Requested Security Deposit",
        extractedValue: "₹2.00 Crores Refundable Deposit on Sanction",
        tier: "USER_PROVIDED",
        sourceAuthority: "Broker Term Teaser",
        confidence: 65,
      },
      {
        label: "Adjacent Plot Market Absorptions",
        extractedValue: "₹7,200 - ₹7,800/sq.ft residential launches",
        tier: "AI_ASSUMPTION",
        sourceAuthority: "Micro-Market Absorption Index Gomti Nagar Ext",
        confidence: 60,
      },
    ],
  },
];

interface DocumentIntelligenceStudioProps {
  onApplyExtractedData?: (extractedData: any) => void;
  onInspectField?: (field: ParsedDocumentField) => void;
}

export const DocumentIntelligenceStudio: React.FC<DocumentIntelligenceStudioProps> = ({
  onApplyExtractedData,
  onInspectField,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>("khatauni-442");
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<"PRESET_LIBRARY" | "CUSTOM_UPLOAD">("PRESET_LIBRARY");
  const [customFileText, setCustomFileText] = useState("");
  const [appliedNotification, setAppliedNotification] = useState(false);

  const currentDoc =
    PRESET_DOCUMENTS.find((d) => d.id === selectedDocId) || PRESET_DOCUMENTS[0];

  const handleSimulateCustomOCR = () => {
    if (!customFileText.trim()) return;
    setIsProcessingUpload(true);
    setTimeout(() => {
      setIsProcessingUpload(false);
      alert("Custom document OCR extraction complete. 4 statutory attributes extracted and epistemically tagged.");
    }, 1500);
  };

  const handleApplyToPipeline = () => {
    if (onApplyExtractedData) {
      onApplyExtractedData(currentDoc);
    }
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
              DOCUMENT INTELLIGENCE OCR
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Stage 1 Property Intelligence Ingestion
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Land Deed & Statutory Document Extraction Chamber</span>
          </h2>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("PRESET_LIBRARY")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "PRESET_LIBRARY"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Statutory Document Vault
          </button>
          <button
            onClick={() => setActiveTab("CUSTOM_UPLOAD")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "CUSTOM_UPLOAD"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Upload New Deed / Sanction
          </button>
        </div>
      </div>

      {activeTab === "PRESET_LIBRARY" && (
        <div className="space-y-6">
          {/* Preset Document Picker Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {PRESET_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedDocId === doc.id
                    ? "bg-indigo-950/40 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/40"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                    {doc.docType}
                  </span>
                  <FileCheck
                    className={`w-4 h-4 ${
                      selectedDocId === doc.id ? "text-indigo-400" : "text-slate-600"
                    }`}
                  />
                </div>
                <div className="font-semibold text-xs text-white line-clamp-1">
                  {doc.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {doc.jurisdiction}
                </div>
              </button>
            ))}
          </div>

          {/* Active Document Analysis Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="font-bold text-sm text-white">{currentDoc.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {currentDoc.jurisdiction} • {currentDoc.description}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApplyToPipeline}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {appliedNotification
                      ? "Merged into 7-Stage OS!"
                      : "Sync Extracted Attributes into OS"}
                  </span>
                </button>
              </div>
            </div>

            {/* Extracted Fields Table with Epistemic Badges */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-800/80 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Extracted Attribute</th>
                    <th className="p-3">Parsed Value</th>
                    <th className="p-3">Data Provenance Tier</th>
                    <th className="p-3">Cited Authority</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {currentDoc.extractedFields.map((field, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-all">
                      <td className="p-3 font-semibold text-white">
                        {field.label}
                      </td>
                      <td className="p-3 font-mono text-emerald-300 font-bold">
                        {field.extractedValue}
                      </td>
                      <td className="p-3">
                        <ProvenanceBadge
                          tier={field.tier}
                          sourceAuthority={field.sourceAuthority}
                          compact
                          onClick={() => onInspectField && onInspectField(field)}
                        />
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        {field.sourceAuthority}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-mono text-[11px] font-bold ${
                            field.confidence >= 90
                              ? "text-emerald-400"
                              : field.confidence >= 70
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {field.confidence}%
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onInspectField && onInspectField(field)}
                          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono border border-slate-800 transition-all"
                        >
                          Inspect Path
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "CUSTOM_UPLOAD" && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl p-8 text-center space-y-3 cursor-pointer transition-all bg-slate-900/40">
            <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
            <div>
              <div className="font-bold text-sm text-white">
                Drag & Drop Sale Deed, 7/12 Extract, or Master Plan PDF
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Supports PDF, scanned JPG/PNG, GeoJSON boundary files up to 25MB
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 uppercase">
              Or Paste OCR Text / Broker Teaser Excerpt:
            </label>
            <textarea
              rows={4}
              value={customFileText}
              onChange={(e) => setCustomFileText(e.target.value)}
              placeholder="Paste raw text from sale agreement, municipal boundary order, or Khasra record..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none font-mono"
            />
          </div>

          <button
            onClick={handleSimulateCustomOCR}
            disabled={isProcessingUpload || !customFileText.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isProcessingUpload ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Structured OCR Entity Extraction...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute AI Document Extraction & Provenance Tagging</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
