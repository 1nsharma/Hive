import React from "react";
import { History, Trash2, Calendar, Database, ArrowRight, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import { ResearchReport } from "../types";

interface HistorySidebarProps {
  reports: ResearchReport[];
  selectedId?: string;
  onSelectReport: (report: ResearchReport) => void;
  onDeleteReport: (id: string) => void;
  onClearHistory: () => void;
}

export default function HistorySidebar({
  reports,
  selectedId,
  onSelectReport,
  onDeleteReport,
  onClearHistory
}: HistorySidebarProps) {
  
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  const getFormatIcon = (format: "json" | "csv" | "markdown") => {
    switch (format) {
      case "json":
        return <FileJson className="w-3.5 h-3.5 text-amber-500" />;
      case "csv":
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />;
      case "markdown":
        return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div id="history-sidebar-card" className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full max-h-[640px]">
      {/* Title section */}
      <div className="p-4 border-b border-slate-150 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-800">Research Campaigns</h3>
        </div>
        {reports.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wide cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Reports list */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-[160px]">
        {reports.length > 0 ? (
          reports.map((r) => {
            const isSelected = r.id === selectedId;
            return (
              <div
                key={r.id}
                className={`group relative p-4 transition-all hover:bg-slate-50 cursor-pointer flex gap-3 items-start justify-between ${
                  isSelected ? "bg-indigo-50/40 border-l-4 border-indigo-600 pl-3" : ""
                }`}
                onClick={() => onSelectReport(r)}
              >
                <div className="space-y-1.5 flex-1 pr-4 min-w-0">
                  <div className="flex items-center gap-2">
                    {getFormatIcon(r.format)}
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {r.format.toUpperCase()} • {r.records.length} items
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-700 truncate block" title={r.query}>
                    {r.query}
                  </h4>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(r.timestamp)}</span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteReport(r.id);
                  }}
                  className="text-slate-350 hover:text-rose-600 p-1 rounded hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-1.5 h-full">
            <Database className="w-7 h-7 text-slate-300" />
            <p className="text-xs text-slate-500 font-semibold">No active campaigns</p>
            <p className="text-[10px] text-slate-400 max-w-[180px] leading-relaxed mx-auto">
              Your generated sheets and verified databases will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
