import React from "react";
import { OSStage } from "../../types";
import {
  Eye,
  Calculator,
  Handshake,
  Coins,
  Building,
  TrendingUp,
  Crown,
  CheckCircle,
} from "lucide-react";

interface StageTabsProps {
  activeStage: OSStage;
  onSelectStage: (stage: OSStage) => void;
}

export const STAGES_CONFIG: {
  id: OSStage;
  number: number;
  name: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "PROPERTY_INTELLIGENCE",
    number: 1,
    name: "1. Property Intelligence",
    shortLabel: "Property Intel",
    icon: Eye,
    description: "Location, Khasra GIS, Zoning, FAR, & Market Signals",
  },
  {
    id: "DEVELOPMENT_ENGINE",
    number: 2,
    name: "2. Development Engine",
    shortLabel: "Dev Engine",
    icon: Calculator,
    description: "BUA, Unit Mix, Hard Costs, S-Curves, & IRR",
  },
  {
    id: "DEAL_STRUCTURING",
    number: 3,
    name: "3. Deal Structuring",
    shortLabel: "Deal Structuring",
    icon: Handshake,
    description: "Outright vs Revenue JDA vs Area JDA vs DM",
  },
  {
    id: "CAPITAL_ARCHITECT",
    number: 4,
    name: "4. Capital Architect",
    shortLabel: "Capital Stack",
    icon: Coins,
    description: "Equity, Senior Debt, Pre-Sales & RERA 70:30",
  },
  {
    id: "DEVELOPMENT_OS",
    number: 5,
    name: "5. Development OS",
    shortLabel: "Execution OS",
    icon: Building,
    description: "32 Approvals, Mivan Schedule, & Risk Matrix",
  },
  {
    id: "SALES_ENGINE",
    number: 6,
    name: "6. Sales Engine",
    shortLabel: "Sales Engine",
    icon: TrendingUp,
    description: "Phased Pricing, Broker Tiers, & Absorption",
  },
  {
    id: "MASTER_DEVELOPER",
    number: 7,
    name: "7. Master Developer",
    shortLabel: "Master Strategy",
    icon: Crown,
    description: "Portfolio Synergy, Retail NOI, & Institutional Scale",
  },
];

export const StageTabs: React.FC<StageTabsProps> = ({
  activeStage,
  onSelectStage,
}) => {
  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-xl">
      <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1 px-1">
        {STAGES_CONFIG.map((stage) => {
          const isActive = activeStage === stage.id;
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`flex-1 min-w-[130px] lg:min-w-0 text-left px-3 py-2.5 rounded-xl transition-all relative flex flex-col justify-between ${
                isActive
                  ? "bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-950/40"
                  : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                    isActive
                      ? "bg-amber-500 text-slate-950"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {stage.number}
                </div>
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-amber-400" : "text-slate-500"
                  }`}
                />
              </div>
              <div>
                <div className="font-semibold text-xs truncate">
                  {stage.shortLabel}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate opacity-80 hidden md:block">
                  {stage.description}
                </div>
              </div>

              {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
