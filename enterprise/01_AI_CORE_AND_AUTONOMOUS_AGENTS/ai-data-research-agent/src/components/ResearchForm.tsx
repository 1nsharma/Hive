import React, { useState } from "react";
import { Search, Plus, X, Sparkles, Database, FileJson, FileSpreadsheet, FileText, Cpu, Key, Globe } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (data: {
    query: string;
    purpose: string;
    format: "json" | "csv" | "markdown";
    fields: string[];
    limit: number;
    engine: "gemini" | "qwen";
    qwenApiKey?: string;
    qwenApiBase?: string;
    qwenModel?: string;
  }) => void;
  isProcessing: boolean;
}

const PRESETS = [
  {
    name: "Tech Startups in India",
    query: "Active AI and Tech startups founded in India between 2024 and 2026",
    purpose: "Analyze emerging direct-to-consumer and AI models in the Indian startup landscape",
    fields: ["Company Name", "Sector", "HQ Location", "Founder", "Website", "Latest Funding / Valuation"],
    format: "json" as const,
    limit: 8
  },
  {
    name: "AI Newsletters & Blogs",
    query: "Popular active artificial intelligence newsletters, blogs, or publications",
    purpose: "Compile potential media channels for marketing outreach and content partnerships",
    fields: ["Publication Name", "Website", "Core Focus Area", "Est. Subscribers", "Primary Contact Email"],
    format: "csv" as const,
    limit: 10
  },
  {
    name: "B2B SaaS Founders",
    query: "Founders of high-growth remote B2B SaaS companies globally in 2025/2026",
    purpose: "Identify key decision-makers for lead generation and executive networking",
    fields: ["Founder Name", "Company", "Website", "LinkedIn URL", "Industry Vertical", "HQ Country"],
    format: "markdown" as const,
    limit: 6
  }
];

const SUGGESTED_FIELDS = [
  "Email", "Phone", "Website", "Location", "LinkedIn URL", "HQ", "Founder Name",
  "Funding Stage", "Valuation", "Industry", "Description", "Est. Revenue"
];

export default function ResearchForm({ onSubmit, isProcessing }: ResearchFormProps) {
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState("");
  const [format, setFormat] = useState<"json" | "csv" | "markdown">("json");
  const [fields, setFields] = useState<string[]>(["Company Name", "Website", "Founder", "Industry"]);
  const [customField, setCustomField] = useState("");
  const [limit, setLimit] = useState(10);

  // Model selection and config state
  const [engine, setEngine] = useState<"gemini" | "qwen">("gemini");
  const [qwenApiKey, setQwenApiKey] = useState("");
  const [qwenApiBase, setQwenApiBase] = useState("https://dashscope.aliyuncs.com/compatible-mode/v1");
  const [qwenModel, setQwenModel] = useState("qwen-plus");

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customField.trim();
    if (clean && !fields.includes(clean)) {
      setFields([...fields, clean]);
      setCustomField("");
    }
  };

  const handleToggleSuggestedField = (field: string) => {
    if (fields.includes(field)) {
      setFields(fields.filter(f => f !== field));
    } else {
      setFields([...fields, field]);
    }
  };

  const handleRemoveField = (field: string) => {
    setFields(fields.filter(f => f !== field));
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setQuery(preset.query);
    setPurpose(preset.purpose);
    setFields(preset.fields);
    setFormat(preset.format);
    setLimit(preset.limit);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (fields.length === 0) return;
    onSubmit({
      query: query.trim(),
      purpose: purpose.trim(),
      format,
      fields,
      limit,
      engine,
      qwenApiKey: engine === "qwen" ? qwenApiKey.trim() : undefined,
      qwenApiBase: engine === "qwen" ? qwenApiBase.trim() : undefined,
      qwenModel: engine === "qwen" ? qwenModel.trim() : undefined,
    });
  };

  return (
    <div id="research-form-card" className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Launch Research Campaign</h2>
            <p className="text-xs text-slate-500">Define requirements; the Agent will search, scrape, and validate.</p>
          </div>
        </div>
      </div>

      {/* Quick Start Presets */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Quick Start Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              disabled={isProcessing}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* MODEL ENGINE SELECTION */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-slate-500" />
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Choose AI Processing Engine
              </label>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
              {engine === "gemini" ? "Google Gemini Powered" : "Alibaba Qwen Powered"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setEngine("gemini")}
              disabled={isProcessing}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                engine === "gemini"
                  ? "bg-white border-indigo-600 text-indigo-700 shadow-sm"
                  : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-600"
              }`}
            >
              <Sparkles className="w-4 h-4 mb-1 text-indigo-600" />
              <span className="text-xs font-bold">Gemini 2.5 Flash</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Recommended (Grounded Search)</span>
            </button>
            <button
              type="button"
              onClick={() => setEngine("qwen")}
              disabled={isProcessing}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all cursor-pointer ${
                engine === "qwen"
                  ? "bg-white border-indigo-600 text-indigo-700 shadow-sm"
                  : "bg-slate-50/50 hover:bg-white border-slate-200 text-slate-600"
              }`}
            >
              <Cpu className="w-4 h-4 mb-1 text-indigo-600" />
              <span className="text-xs font-bold">Qwen AI Engine</span>
              <span className="text-[9px] text-slate-400 mt-0.5">Compatible Setup Mode</span>
            </button>
          </div>

          {/* Expanded Qwen Config Parameters */}
          {engine === "qwen" && (
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Globe className="w-3 h-3 text-slate-400" />
                  API Endpoint Base URL
                </label>
                <input
                  type="text"
                  value={qwenApiBase}
                  onChange={(e) => setQwenApiBase(e.target.value)}
                  disabled={isProcessing}
                  placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1"
                  className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Cpu className="w-3 h-3 text-slate-400" />
                  Qwen Model Name
                </label>
                <input
                  type="text"
                  value={qwenModel}
                  onChange={(e) => setQwenModel(e.target.value)}
                  disabled={isProcessing}
                  placeholder="qwen-plus"
                  className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <Key className="w-3 h-3 text-slate-400" />
                  Qwen / DashScope API Key
                </label>
                <input
                  type="password"
                  value={qwenApiKey}
                  onChange={(e) => setQwenApiKey(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Paste your API key (leave empty to use server environment variables)"
                  className={`w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 ${
                    engine === "qwen" && !qwenApiKey ? "border-amber-400 bg-amber-50/20" : "border-slate-200"
                  }`}
                />
                {engine === "qwen" && !qwenApiKey && (
                  <p className="text-[10px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
                    ⚠️ Enter an API key here, or ensure QWEN_API_KEY is defined in your environment variables.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Core Query */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            What data do you need the Agent to find? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isProcessing}
            required
            placeholder="e.g. Find all early-stage Web3 game studios based in Europe, with active website URLs."
            className="w-full h-24 px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Business Purpose */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Purpose / Context <span className="text-xs text-slate-400">(Helps refine the search context)</span>
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={isProcessing}
            placeholder="e.g. Sales prospecting, market analysis, competitor mapping..."
            className="w-full px-3.5 py-2 text-sm text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Target Columns / Fields */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Target Fields to Collect <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">{fields.length} field(s) selected</span>
          </div>

          {/* Active Field Tags */}
          <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
            {fields.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-md"
              >
                {f}
                <button
                  type="button"
                  onClick={() => handleRemoveField(f)}
                  disabled={isProcessing}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {fields.length === 0 && (
              <span className="text-xs text-slate-400 m-auto">Add fields below to construct your dataset.</span>
            )}
          </div>

          {/* Suggested additions */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested Additions</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_FIELDS.map((sf, idx) => {
                const isSelected = fields.includes(sf);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleSuggestedField(sf)}
                    disabled={isProcessing}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {sf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom field adder */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customField}
              onChange={(e) => setCustomField(e.target.value)}
              disabled={isProcessing}
              placeholder="Or add custom field (e.g., Year Founded)"
              className="flex-1 px-3 py-1.5 text-xs text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomField}
              disabled={isProcessing || !customField.trim()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        {/* Lower Row: Format & Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Format Picker */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Export Format</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setFormat("json")}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  format === "json" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <FileJson className="w-3.5 h-3.5" />
                JSON
              </button>
              <button
                type="button"
                onClick={() => setFormat("csv")}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  format === "csv" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                type="button"
                onClick={() => setFormat("markdown")}
                disabled={isProcessing}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  format === "markdown" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Table
              </button>
            </div>
          </div>

          {/* Row Limit Picker */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Record Depth Limit</label>
            <div className="flex items-center gap-3 h-[38px] px-3 bg-slate-50 border border-slate-200 rounded-lg">
              <input
                type="range"
                min="3"
                max="20"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                disabled={isProcessing}
                className="flex-1 accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700 min-w-[24px] text-right">
                {limit} items
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !query.trim() || fields.length === 0}
          className={`w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Search className="w-4 h-4" />
          {isProcessing ? "Agent is Researching & Scouring the Web..." : "Deploy Research & Extraction Agent"}
        </button>
      </form>
    </div>
  );
}
