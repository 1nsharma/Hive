import React from "react";
import { ProvenanceTier } from "../../types";
import { CheckCircle2, User, HelpCircle, Sparkles, AlertTriangle, ExternalLink } from "lucide-react";

interface ProvenanceBadgeProps {
  tier: ProvenanceTier;
  sourceAuthority?: string;
  note?: string;
  compact?: boolean;
  codeOnly?: boolean;
  onClick?: () => void;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  tier,
  sourceAuthority,
  note,
  compact = false,
  codeOnly = false,
  onClick,
}) => {
  const getBadgeConfig = () => {
    switch (tier) {
      case "VERIFIED_DATA":
        return {
          label: "VERIFIED DATA",
          code: "[V]",
          icon: CheckCircle2,
          bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20",
          dot: "bg-emerald-500",
        };
      case "USER_PROVIDED":
        return {
          label: "USER-PROVIDED",
          code: "[U]",
          icon: User,
          bg: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/20",
          dot: "bg-blue-500",
        };
      case "ESTIMATED_DATA":
        return {
          label: "ESTIMATED DATA",
          code: "[E]",
          icon: HelpCircle,
          bg: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20",
          dot: "bg-amber-500",
        };
      case "AI_ASSUMPTION":
        return {
          label: "AI ASSUMPTION",
          code: "[A]",
          icon: Sparkles,
          bg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/20",
          dot: "bg-purple-500",
        };
      case "REQUIRES_VERIFICATION":
        return {
          label: "REQUIRES VERIFICATION",
          code: "[!]",
          icon: AlertTriangle,
          bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/40 hover:border-rose-400 hover:bg-rose-500/20 font-semibold animate-pulse",
          dot: "bg-rose-500",
        };
      default:
        return {
          label: "UNCLASSIFIED",
          code: "[?]",
          icon: HelpCircle,
          bg: "bg-slate-100 text-slate-700 border-slate-300",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  if (codeOnly) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`${config.label} - Click to inspect provenance and verification path`}
        className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded font-mono text-[10px] font-bold border transition-all cursor-pointer ${config.bg}`}
      >
        {config.code}
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={sourceAuthority || note || config.label}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border transition-all ${
          onClick ? "cursor-pointer" : "cursor-default"
        } ${config.bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="font-bold">{config.code}</span>
        <span>{config.label}</span>
      </button>
    );
  }

  return (
    <div className="group relative inline-block">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider border ${config.bg} ${
          onClick ? "cursor-pointer" : "cursor-help"
        } transition-all shadow-xs`}
      >
        <Icon className="w-3 h-3 shrink-0" />
        <span className="font-bold">{config.code}</span>
        <span className="font-semibold">{config.label}</span>
      </button>

      {(sourceAuthority || note) && (
        <div className="hidden group-hover:block absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-2xl border border-slate-700 leading-relaxed pointer-events-none">
          {sourceAuthority && (
            <div className="mb-1.5 flex items-start gap-1.5 text-slate-200">
              <ExternalLink className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">
                  Grounding Authority
                </span>
                <span className="font-medium text-amber-200">
                  {sourceAuthority}
                </span>
              </div>
            </div>
          )}
          {note && (
            <div className="text-slate-300 text-[11px] pt-1.5 border-t border-slate-800">
              {note}
            </div>
          )}
          <div className="text-[9px] font-mono text-emerald-400 pt-1 text-right">
            Click to inspect verification path &gt;
          </div>
          <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
