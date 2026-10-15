import React, { useState } from "react";
import { AppView, DealInput, DeveloperTag } from "./types";
import { SAMPLE_DEALS } from "./data/sampleDeals";
import { Header } from "./components/Header";
import { DeveloperOSView } from "./components/DeveloperOSView";
import { FirstMissionView } from "./components/FirstMissionView";
import { CurriculumView } from "./components/CurriculumView";
import { DealModelerView } from "./components/DealModelerView";
import { DealStructuringView } from "./components/DealStructuringView";
import { CopilotChatView } from "./components/CopilotChatView";
import { LegalChecklistView } from "./components/LegalChecklistView";
import { PortfolioView } from "./components/PortfolioView";
import { AgentStudioView } from "./components/AgentStudioView";
import { Building2, Compass, ShieldCheck, TrendingUp, Heart } from "lucide-react";

export function App() {
  const [currentView, setCurrentView] = useState<AppView>("developer-os");
  const [activeDeal, setActiveDeal] = useState<DealInput>(SAMPLE_DEALS[0]);
  const [copilotInitialTopic, setCopilotInitialTopic] = useState<string | undefined>(undefined);
  const [copilotInitialTag, setCopilotInitialTag] = useState<DeveloperTag>("LEARN");
  const [userLevel, setUserLevel] = useState<number>(1);

  // Cross-view handlers
  const handleOpenModelerWithDeal = (deal: DealInput) => {
    setActiveDeal(deal);
    setCurrentView("deal-modeler");
  };

  const handleOpenStructuring = (deal: DealInput) => {
    setActiveDeal(deal);
    setCurrentView("deal-structuring");
  };

  const handleOpenChatWithTopic = (topicTitle: string, tag: DeveloperTag) => {
    setCopilotInitialTopic(topicTitle);
    setCopilotInitialTag(tag);
    setCurrentView("copilot-chat");
  };

  const handleAskCopilotAboutStructuring = (structureName: string) => {
    setCopilotInitialTopic(`Explain the contractual risks, term sheet clauses, and RERA compliance considerations for: ${structureName}`);
    setCopilotInitialTag("LEGAL");
    setCurrentView("copilot-chat");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        userLevel={userLevel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === "developer-os" && <DeveloperOSView />}

        {currentView === "curriculum" && (
          <CurriculumView
            onOpenChatWithTopic={handleOpenChatWithTopic}
            onOpenModeler={() => setCurrentView("deal-modeler")}
          />
        )}

        {currentView === "first-mission" && (
          <FirstMissionView
            onOpenModelerWithDeal={handleOpenModelerWithDeal}
            onAdvanceToCurriculum={() => setCurrentView("curriculum")}
          />
        )}

        {currentView === "deal-modeler" && (
          <DealModelerView
            initialDeal={activeDeal}
            onOpenCopilotWithDeal={(deal) => {
              setActiveDeal(deal);
              setCurrentView("copilot-chat");
            }}
            onOpenStructuring={handleOpenStructuring}
          />
        )}

        {currentView === "deal-structuring" && (
          <DealStructuringView
            currentDeal={activeDeal}
            onOpenModelerWithDeal={handleOpenModelerWithDeal}
            onAskCopilotAboutStructuring={handleAskCopilotAboutStructuring}
          />
        )}

        {currentView === "copilot-chat" && (
          <CopilotChatView
            initialTopic={copilotInitialTopic}
            initialTag={copilotInitialTag}
            activeDeal={activeDeal}
          />
        )}

        {currentView === "legal-checklist" && <LegalChecklistView />}

        {currentView === "portfolio" && <PortfolioView />}

        {currentView === "agent-studio" && <AgentStudioView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-slate-400">
              Real Estate Developer HQ
            </span>
            <span>— Master Track Curriculum & Financial Intelligence</span>
          </div>

          <div className="text-center sm:text-right font-mono text-[11px] text-slate-500">
            "Development is the art of orchestrating risk, capital, and urban vision."
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
