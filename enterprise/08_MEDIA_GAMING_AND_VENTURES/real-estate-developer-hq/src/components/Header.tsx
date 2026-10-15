import React from "react";
import { AppView } from "../types";
import {
  Compass,
  Target,
  Calculator,
  Scale,
  Bot,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  Building2,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  userLevel: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  userLevel,
}) => {
  const navItems: { view: AppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      view: "developer-os",
      label: "AI Developer OS",
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: "7-Engine OS",
    },
    {
      view: "curriculum",
      label: "Master Curriculum",
      icon: <Compass className="w-4 h-4" />,
      badge: "L0-L10",
    },
    {
      view: "first-mission",
      label: "First Mission",
      icon: <Target className="w-4 h-4" />,
      badge: "Start Here",
    },
    {
      view: "deal-modeler",
      label: "Pro-Forma Modeler",
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      view: "deal-structuring",
      label: "Deal Structuring",
      icon: <Scale className="w-4 h-4" />,
    },
    {
      view: "copilot-chat",
      label: "Developer Copilot",
      icon: <Bot className="w-4 h-4" />,
      badge: "AI HQ",
    },
    {
      view: "agent-studio",
      label: "Agent Studio",
      icon: <Building2 className="w-4 h-4 text-sky-400" />,
    },
    {
      view: "legal-checklist",
      label: "Due Diligence & Legal",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      view: "portfolio",
      label: "Portfolio & Scale",
      icon: <Briefcase className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectView("curriculum")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-400/30">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  Real Estate Developer <span className="text-amber-400">HQ</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  Master Track
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans hidden sm:block">
                Foundation → Operator → Capital Structurer → Master Developer
              </p>
            </div>
          </div>

          {/* Level & Money Progression Indicator */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Level {userLevel} of 10</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Progression: <span className="font-mono text-emerald-400 font-semibold">₹0 → ₹100Cr+</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onSelectView(item.view)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono uppercase tracking-wider ${
                      isActive
                        ? "bg-amber-400 text-slate-950 font-bold"
                        : "bg-slate-800 text-amber-400/90 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
