import React, { useState, useEffect } from "react";
import { Sparkles, Database, History, HelpCircle, Brain, Info, AlertCircle, RefreshCw } from "lucide-react";
import ResearchForm from "./components/ResearchForm";
import AgentStatusBoard from "./components/AgentStatusBoard";
import ResultsViewer from "./components/ResultsViewer";
import HistorySidebar from "./components/HistorySidebar";
import SdkIntegrationGuide from "./components/SdkIntegrationGuide";
import { ResearchReport, AgentStage } from "./types";
import { PRESET_REPORTS } from "./presets";

export default function App() {
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [activeReport, setActiveReport] = useState<ResearchReport | undefined>(undefined);
  const [stage, setStage] = useState<AgentStage>("idle");
  const [activeQuery, setActiveQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load history from localStorage on mount or fall back to default presets
  useEffect(() => {
    const saved = localStorage.getItem("deepdata_research_reports");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
          setActiveReport(parsed[0]);
          return;
        }
      } catch (err) {
        console.error("Failed to parse local storage:", err);
      }
    }
    
    // Fall back to pre-configured campaign presets
    setReports(PRESET_REPORTS);
    setActiveReport(PRESET_REPORTS[0]);
  }, []);

  // Save reports helper
  const saveReports = (newReports: ResearchReport[]) => {
    setReports(newReports);
    localStorage.setItem("deepdata_research_reports", JSON.stringify(newReports));
  };

  const handleLaunchAgent = async (params: {
    query: string;
    purpose: string;
    format: "json" | "csv" | "markdown";
    fields: string[];
    limit: number;
    engine: "gemini" | "qwen";
    qwenApiKey?: string;
    qwenApiBase?: string;
    qwenModel?: string;
  }) => {
    setIsProcessing(true);
    setErrorMessage(undefined);
    setActiveQuery(params.query);
    setStage("planning");

    // Timeline simulation timers for UI responsiveness while API runs
    const planTimer = setTimeout(() => setStage("searching"), 2500);
    const searchTimer = setTimeout(() => setStage("scraping"), 6500);
    const scrapeTimer = setTimeout(() => setStage("validating"), 11000);
    const validateTimer = setTimeout(() => setStage("formatting"), 14500);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      // Clear the UI simulation timers
      clearTimeout(planTimer);
      clearTimeout(searchTimer);
      clearTimeout(scrapeTimer);
      clearTimeout(validateTimer);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "The Research Agent encountered an issue collecting the requested data.");
      }

      setStage("formatting");
      
      const newReport: ResearchReport = {
        id: `rep_${Date.now()}`,
        timestamp: new Date().toISOString(),
        query: data.query,
        purpose: data.purpose,
        format: data.format,
        fields: data.fields,
        plan: data.plan,
        citations: data.citations || [],
        validation: data.validation,
        records: data.records || [],
        formattedRawData: data.formattedRawData,
        engine: params.engine
      };

      // Wait a brief moment for formatting animation, then complete
      setTimeout(() => {
        setStage("completed");
        const updatedReports = [newReport, ...reports];
        saveReports(updatedReports);
        setActiveReport(newReport);
        setIsProcessing(false);
      }, 1000);

    } catch (err: any) {
      clearTimeout(planTimer);
      clearTimeout(searchTimer);
      clearTimeout(scrapeTimer);
      clearTimeout(validateTimer);

      console.error(err);
      setStage("error");
      setErrorMessage(err.message || "An unexpected error occurred during research execution.");
      setIsProcessing(false);
    }
  };

  const handleSelectReport = (report: ResearchReport) => {
    setActiveReport(report);
    setStage("idle");
    setErrorMessage(undefined);
  };

  const handleDeleteReport = (id: string) => {
    const updated = reports.filter(r => r.id !== id);
    saveReports(updated);
    if (activeReport?.id === id) {
      setActiveReport(updated[0] || undefined);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire campaign history? This cannot be undone.")) {
      saveReports([]);
      setActiveReport(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans">
      
      {/* Premium Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Brain className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">AI Data Research Agent</h1>
              <p className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">Deep Research • Real Extraction • Verified Output</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Server Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Autonomous Engine Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Core Description Board */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold">Step 1</span>
              <h3 className="text-sm font-bold text-slate-800">Autonomous Strategy</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Define what you want. The agent breaks down the criteria and formulates precision keywords targeting directories, portals, and reports.
            </p>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold">Step 2</span>
              <h3 className="text-sm font-bold text-slate-800">Scrape & Harvest</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Using real Google Search Grounding capabilities, the AI browses search indexes and pulls direct raw references, keeping tracking URLs.
            </p>
          </div>
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold">Step 3</span>
              <h3 className="text-sm font-bold text-slate-800">Validate & Package</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Data is deduplicated, fact-checked for relevancy, and packaged into standard structures (JSON, CSV, Table) ready for direct export.
            </p>
          </div>
        </div>

        {/* Dashboard Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Input panel (8 columns on large screens) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* The Config Form */}
            <ResearchForm onSubmit={handleLaunchAgent} isProcessing={isProcessing} />

            {/* Stage tracker */}
            {stage !== "idle" && (
              <AgentStatusBoard stage={stage} query={activeQuery} errorMessage={errorMessage} />
            )}

            {/* Results output section */}
            {stage !== "planning" && stage !== "searching" && stage !== "scraping" && activeReport && (
              <ResultsViewer report={activeReport} />
            )}
          </div>

          {/* Right / History panel (4 columns on large screens) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <HistorySidebar
              reports={reports}
              selectedId={activeReport?.id}
              onSelectReport={handleSelectReport}
              onDeleteReport={handleDeleteReport}
              onClearHistory={handleClearHistory}
            />

            {/* Quick tips */}
            <div className="bg-indigo-950 text-white rounded-xl p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-200">Scraping Best Practices</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-indigo-100">
                <li className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>Be specific with <b>geographic</b> locations (e.g., &quot;in India&quot;, &quot;in Bengaluru&quot;, &quot;remote&quot;).</span>
                </li>
                <li className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>Choose target fields that correspond to real public metrics (e.g. Website URL, Sector, Founder Name, Email).</span>
                </li>
                <li className="flex items-start gap-1.5 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>Set Depth Limit according to how niche the topic is. Common topics support up to 20 records.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Integration and SDK Playbook */}
        <SdkIntegrationGuide />

      </main>

      {/* Elegant Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-1">
          <p className="font-semibold">AI Data Research Agent — Powered by Gemini-3.6-Flash with Google Search Grounding.</p>
          <p>Delivers clean, vetted, valuable raw data. Do not use for automated high-volume spamming.</p>
        </div>
      </footer>

    </div>
  );
}
