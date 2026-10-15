import React, { useState, useEffect } from "react";
import { Download, Copy, Check, Table, Code, Link as LinkIcon, ShieldAlert, Award, FileSpreadsheet, RefreshCw, BarChart3 as BarChartIcon } from "lucide-react";
import { ResearchReport } from "../types";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ResultsViewerProps {
  report: ResearchReport;
}

export default function ResultsViewer({ report }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState<"table" | "visual" | "raw" | "citations">("table");
  const [copied, setCopied] = useState(false);

  const { query, format, fields, records, formattedRawData, citations, validation, engine } = report;

  // Determine initial categorization field
  const findCategoryField = () => {
    const priorityFields = ["Sector", "Industry", "HQ Location", "HQ Country", "Location", "Funding Stage", "Industry Vertical", "Core Focus Area"];
    for (const pf of priorityFields) {
      if (fields.includes(pf)) return pf;
    }
    if (fields.length > 1) return fields[1];
    if (fields.length > 0) return fields[0];
    return "";
  };

  const [selectedField, setSelectedField] = useState<string>("");

  useEffect(() => {
    setSelectedField(findCategoryField());
  }, [report, fields]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedRawData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Could not copy:", err);
    }
  };

  const handleDownload = () => {
    const mimeTypes = {
      json: "application/json",
      csv: "text/csv",
      markdown: "text/markdown"
    };

    const extensions = {
      json: "json",
      csv: "csv",
      markdown: "md"
    };

    const blob = new Blob([formattedRawData], { type: mimeTypes[format] || "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Clean query to construct filename
    const sanitizedQuery = query
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .substring(0, 30);
    
    link.href = url;
    link.download = `agent_research_${sanitizedQuery}.${extensions[format]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Extract chart data based on the selected field
  const getChartData = () => {
    if (!selectedField || !records || records.length === 0) return [];
    
    const counts: Record<string, number> = {};
    records.forEach((rec) => {
      const val = rec[selectedField];
      const categoryName = val && val !== "N/A" && val !== "n/a" ? String(val).trim() : "Other / Unspecified";
      
      // Group similar or truncate extremely long names to keep chart clean
      const displayLabel = categoryName.length > 28 ? categoryName.substring(0, 25) + "..." : categoryName;
      counts[displayLabel] = (counts[displayLabel] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const chartData = getChartData();

  // Premium Indigo Palette Shades for Recharts Bar Coloring
  const BAR_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#93c5fd", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

  return (
    <div id="results-viewer-card" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
            Valuable Verified Dataset {engine ? `• ${engine === "qwen" ? "Qwen AI Engine" : "Gemini 2.5"}` : ""}
          </span>
          <h2 className="text-base font-bold text-slate-800 truncate max-w-lg" title={query}>
            {query}
          </h2>
        </div>
        
        {/* Export Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Raw"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Stats Summary Banner */}
      <div className="px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total found */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Extracted</span>
            <span className="text-lg font-bold text-slate-800">{records.length} records</span>
          </div>
        </div>

        {/* Duplicates removed */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Duplicates Cleared</span>
            <span className="text-lg font-bold text-slate-800">{validation.duplicatesRemoved} items</span>
          </div>
        </div>

        {/* Data Quality index */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3 col-span-1">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Completeness Score</span>
            <span className="text-lg font-bold text-slate-800">{validation.completenessPercentage}%</span>
          </div>
        </div>

        {/* References list count */}
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-3 col-span-1">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <LinkIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Grounded Sources</span>
            <span className="text-lg font-bold text-slate-800">{citations.length} domains</span>
          </div>
        </div>
      </div>

      {/* Validation Quality Report Block */}
      <div className="mx-6 p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-2">
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">Agent Validation Summary</h4>
        </div>
        <p className="text-xs text-indigo-900 leading-relaxed font-medium">
          {validation.qualityReport || "Records extracted from real web search indices and validated for structural accuracy."}
        </p>
      </div>

      {/* Viewer Tabs */}
      <div className="px-6 border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === "table" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Table className="w-4 h-4" />
            Interactive Grid
          </button>
          <button
            onClick={() => setActiveTab("visual")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === "visual" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <BarChartIcon className="w-4 h-4" />
            Visual Summary
          </button>
          <button
            onClick={() => setActiveTab("raw")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === "raw" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Code className="w-4 h-4" />
            Raw clean output ({format.toUpperCase()})
          </button>
          <button
            onClick={() => setActiveTab("citations")}
            className={`flex items-center gap-1.5 pb-3 text-xs font-bold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === "citations" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Grounded Citations ({citations.length})
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="px-6 pb-6">
        {activeTab === "table" && (
          <div className="border border-slate-150 rounded-lg overflow-hidden bg-slate-50">
            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 border-collapse">
                  <thead className="bg-white border-b border-slate-200 text-slate-700 font-semibold">
                    <tr>
                      <th className="px-4 py-3 border-r border-slate-150 w-12 text-center bg-slate-50">#</th>
                      {fields.map((header, idx) => (
                        <th key={idx} className="px-4 py-3 font-semibold text-slate-800">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {records.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-indigo-50/20 bg-white transition-colors">
                        <td className="px-4 py-3 border-r border-slate-150 text-center text-[10px] font-bold text-slate-400 bg-slate-50">
                          {rowIndex + 1}
                        </td>
                        {fields.map((field, cellIndex) => {
                          const val = row[field];
                          const isNA = val === undefined || val === null || val === "N/A" || val === "n/a" || val === "";
                          const valStr = String(isNA ? "N/A" : val);
                          const isLink = valStr.startsWith("http://") || valStr.startsWith("https://");

                          return (
                            <td key={cellIndex} className="px-4 py-3 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
                              {isLink ? (
                                <a
                                  href={valStr}
                                  target="_blank"
                                  referrerPolicy="no-referrer"
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 font-semibold"
                                >
                                  {valStr}
                                  <LinkIcon className="w-2.5 h-2.5 inline shrink-0" />
                                </a>
                              ) : (
                                <span className={isNA ? "text-slate-350 italic" : "text-slate-700"}>
                                  {valStr}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-300" />
                <p className="text-xs text-slate-500 font-semibold">No records could be extracted from this run.</p>
                <p className="text-[11px] text-slate-400">Try loosening your query constraints or changing search terms.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "visual" && (
          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Visual Insights & Data Distribution</h3>
                <p className="text-xs text-slate-500">Categorize metrics and view counts across key fields.</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Analyze Column:</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {fields.map((f, i) => (
                    <option key={i} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="space-y-6">
                <div className="h-80 w-full bg-white border border-slate-150 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                      />
                      <YAxis tick={{ fill: "#64748b", fontSize: 10 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: "#0f172a",
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "11px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                        cursor={{ fill: "rgba(99, 102, 241, 0.04)" }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {chartData.map((item, index) => (
                    <div key={index} className="bg-white p-3 border border-slate-150 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div
                          className="w-3 h-3 rounded shrink-0"
                          style={{ backgroundColor: BAR_COLORS[index % BAR_COLORS.length] }}
                        />
                        <span className="text-xs font-semibold text-slate-700 truncate" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.count} row{item.count > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-300" />
                <p className="text-xs text-slate-500 font-semibold">Not enough structured categorical data to build visualization.</p>
                <p className="text-[11px] text-slate-400">Select another column to build insights.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "raw" && (
          <div className="relative border border-slate-200 rounded-lg overflow-hidden bg-slate-900 text-slate-100 p-4 font-mono text-[11px] leading-relaxed">
            {/* Overlay Copy Button */}
            <div className="absolute top-2 right-2">
              <button
                onClick={handleCopy}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <pre className="overflow-x-auto whitespace-pre-wrap max-h-96">{formattedRawData}</pre>
          </div>
        )}

        {activeTab === "citations" && (
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verified Source references</h3>
            {citations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {citations.map((cite, index) => (
                  <a
                    key={index}
                    href={cite.url}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="p-3 bg-white border border-slate-150 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all flex items-start gap-2.5 group cursor-pointer"
                  >
                    <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md group-hover:bg-indigo-100 transition-colors mt-0.5">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                        {cite.title || "Web Reference Source"}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate">{cite.url}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No citations mapped for this specific query run.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
