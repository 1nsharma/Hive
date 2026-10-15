import React, { useState, useMemo } from 'react';
import { SAMPLE_LENSES, SIMULATED_CONTENTS } from '../data/sampleLenses';
import { ContextLens, SimulatedContent } from '../types/blueprint';
import { 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  HelpCircle, 
  DollarSign, 
  Play, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface ContextInjectorSimulatorProps {
  activeLanguage: 'en' | 'hi';
}

export const ContextInjectorSimulator: React.FC<ContextInjectorSimulatorProps> = ({ activeLanguage }) => {
  const [selectedContentId, setSelectedContentId] = useState<string>('content-yt-gdp');
  const [activeLensId, setActiveLensId] = useState<string>('lens-india-gdp');
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(true);
  const [activeTransparencyTab, setActiveTransparencyTab] = useState<'source' | 'logic' | 'reason' | 'distribution'>('source');

  const selectedContent = SIMULATED_CONTENTS.find(c => c.id === selectedContentId) || SIMULATED_CONTENTS[0];
  const activeLens = SAMPLE_LENSES.find(l => l.id === activeLensId) || SAMPLE_LENSES[0];

  // Check if active lens matches current content
  const isLensTriggered = useMemo(() => {
    return selectedContent.applicableLenses.includes(activeLens.id);
  }, [selectedContent, activeLens]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-emerald-950/30 to-stone-900 border border-emerald-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
              FIRST TECHNOLOGICAL ORGAN
            </span>
            <span className="text-stone-400 text-xs font-mono">
              MULTI-SURFACE RUNTIME
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'संदर्भ इंजेक्टर और लेंस रनटाइम सिम्युलेटर' : 'Context Injector & Lens Runtime Sandbox'}
          </h2>
          <p className="text-stone-300 text-sm">
            Simulating real-time context injection across YouTube, X, News, and Reddit with 4-Way Transparency guarantees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-xs font-mono text-stone-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sandbox Latency: 42ms</span>
          </div>
        </div>
      </div>

      {/* Surface Selector & Active Lens Controller */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Content Surface Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Host Platform Surface Simulation
            </h3>
            <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800">
              {SIMULATED_CONTENTS.map((content) => (
                <button
                  key={content.id}
                  id={`select-content-${content.id}`}
                  onClick={() => {
                    setSelectedContentId(content.id);
                    // auto-select first applicable lens
                    if (content.applicableLenses.length > 0) {
                      setActiveLensId(content.applicableLenses[0]);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedContentId === content.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {content.platform.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Browser / Host UI */}
          <div className="rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-2xl">
            {/* Fake Browser Top bar */}
            <div className="px-4 py-2 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-stone-300 ml-2 truncate max-w-xs">{selectedContent.url}</span>
              </div>
              <span className="text-stone-500 text-[10px]">Viewport Observer Active</span>
            </div>

            {/* Platform Render */}
            <div className="p-5 md:p-6 space-y-4">
              {/* YouTube Style */}
              {selectedContent.platform === 'youtube' && (
                <div className="space-y-4">
                  {/* Fake Video Player Box */}
                  <div className="aspect-video w-full rounded-xl bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900 border border-stone-800 flex flex-col items-center justify-center text-stone-500 relative group cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 ml-0.5" />
                    </div>
                    <span className="text-xs font-mono text-stone-400 mt-2">1080p 60fps &bull; 18:42</span>

                    {/* LIVE CONTEXT INJECTION PILL INSIDE VIDEO */}
                    {isLensTriggered && (
                      <div className="absolute top-4 left-4 z-20">
                        <button
                          id="toggle-video-context-pill"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOverlayOpen(!isOverlayOpen);
                          }}
                          className="px-3 py-1.5 rounded-full bg-stone-900/95 hover:bg-stone-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce duration-1000"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{activeLens.uiOutput.pillLabel}</span>
                          <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded text-emerald-300">
                            Verified
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  <h1 className="text-lg md:text-xl font-bold text-white leading-snug">
                    {selectedContent.title}
                  </h1>

                  <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-bold text-stone-300">
                        F
                      </div>
                      <div>
                        <div className="font-semibold text-stone-200">{selectedContent.creator}</div>
                        <div className="text-[11px] text-stone-400">{selectedContent.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 rounded-full bg-stone-800 text-stone-300 flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" /> 84K
                      </button>
                      <button className="px-3 py-1.5 rounded-full bg-stone-800 text-stone-300 flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-300 font-light leading-relaxed bg-stone-900/60 p-4 rounded-xl border border-stone-800/80">
                    {selectedContent.bodySnippet}
                  </p>
                </div>
              )}

              {/* X / Twitter Style */}
              {selectedContent.platform === 'x' && (
                <div className="p-5 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-sm font-bold text-stone-300">
                        BH
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{selectedContent.creator}</div>
                        <div className="text-xs text-stone-400">{selectedContent.date}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-stone-500">Post</span>
                  </div>

                  <p className="text-base text-stone-200 leading-relaxed font-light">
                    {selectedContent.bodySnippet}
                  </p>

                  {/* Context Pill in Tweet */}
                  {isLensTriggered && (
                    <div className="pt-2">
                      <button
                        id="toggle-tweet-context-pill"
                        onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                        className="w-full p-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 text-left transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-xs font-bold text-rose-200">{activeLens.uiOutput.pillLabel}</span>
                        </div>
                        <span className="text-xs font-mono text-rose-300 underline">Inspect Evidence &rarr;</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* News / Reddit Styles */}
              {(selectedContent.platform === 'news' || selectedContent.platform === 'reddit') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                    <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 uppercase">
                      {selectedContent.platform}
                    </span>
                    <span>&bull; {selectedContent.creator} &bull; {selectedContent.date}</span>
                  </div>

                  <h1 className="text-xl font-bold text-white">
                    {selectedContent.title}
                  </h1>

                  <p className="text-stone-300 text-sm leading-relaxed bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                    {selectedContent.bodySnippet}
                  </p>

                  {isLensTriggered && (
                    <button
                      id="toggle-news-context-pill"
                      onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                      className="px-3.5 py-2 rounded-xl bg-stone-900 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{activeLens.uiOutput.pillLabel}</span>
                      <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">View Deep Context</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Injected Context Card & 4-Way Transparency Drawer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Active Context Lens
            </h3>
            {/* Lens Switcher */}
            <select
              id="active-lens-select"
              value={activeLensId}
              onChange={(e) => setActiveLensId(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
            >
              {SAMPLE_LENSES.map((lens) => (
                <option key={lens.id} value={lens.id}>
                  {lens.name} (v{lens.version})
                </option>
              ))}
            </select>
          </div>

          {/* Injected Overlay Card */}
          {isOverlayOpen ? (
            <div className="p-6 rounded-2xl bg-stone-900 border border-emerald-500/40 shadow-xl space-y-5">
              {/* Card Title & Verdict */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Injected Context Lens Payload</span>
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {activeLens.uiOutput.cardTitle}
                  </h4>
                  <p className="text-xs text-stone-400">
                    Authored by <span className="text-stone-300 font-medium">{activeLens.author}</span>
                  </p>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md uppercase shrink-0 ${
                  activeLens.uiOutput.verdict === 'misleading'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : activeLens.uiOutput.verdict === 'supported'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {activeLens.uiOutput.verdict || 'VERIFIED'}
                </span>
              </div>

              {/* Counter Metrics Grid */}
              {activeLens.uiOutput.counterMetrics && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeLens.uiOutput.counterMetrics.map((cm, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-center">
                      <div className="text-[10px] text-stone-400 truncate">{cm.label}</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">{cm.value}</div>
                      {cm.diff && (
                        <div className="text-[9px] font-mono text-emerald-400">{cm.diff}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Insights List */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-stone-400 uppercase">Contextual Insights:</div>
                <div className="space-y-1.5">
                  {activeLens.uiOutput.insights.map((insight, iIdx) => (
                    <div key={iIdx} className="text-xs text-stone-200 flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Way Transparency Tabs */}
              <div className="pt-2 border-t border-stone-800 space-y-3">
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Transparency Engine (No Black Boxes)
                </div>

                <div className="grid grid-cols-4 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                  <button
                    id="transparency-btn-source"
                    onClick={() => setActiveTransparencyTab('source')}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      activeTransparencyTab === 'source'
                        ? 'bg-stone-800 text-emerald-300 font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    View Source
                  </button>

                  <button
                    id="transparency-btn-logic"
                    onClick={() => setActiveTransparencyTab('logic')}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      activeTransparencyTab === 'logic'
                        ? 'bg-stone-800 text-sky-300 font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    View Logic
                  </button>

                  <button
                    id="transparency-btn-reason"
                    onClick={() => setActiveTransparencyTab('reason')}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      activeTransparencyTab === 'reason'
                        ? 'bg-stone-800 text-amber-300 font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    View Reason
                  </button>

                  <button
                    id="transparency-btn-distribution"
                    onClick={() => setActiveTransparencyTab('distribution')}
                    className={`py-1.5 rounded-lg font-medium transition-all ${
                      activeTransparencyTab === 'distribution'
                        ? 'bg-stone-800 text-rose-300 font-bold'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    View Flow
                  </button>
                </div>

                {/* Transparency Content Details */}
                <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs space-y-2">
                  {activeTransparencyTab === 'source' && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
                        Primary Data Provenance & Citations:
                      </div>
                      {activeLens.dataSources.map((ds, dIdx) => (
                        <div key={dIdx} className="p-2 rounded bg-stone-900 border border-stone-800 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <div className="font-semibold text-stone-200 truncate">{ds.name}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{ds.provenanceUrl}</div>
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                            Trust {(ds.trustScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTransparencyTab === 'logic' && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-sky-400 uppercase font-semibold">
                        Sandboxed Trigger Logic & QuickJS Runtime:
                      </div>
                      <pre className="text-[11px] font-mono text-sky-300 bg-stone-900 p-2.5 rounded overflow-x-auto max-h-36">
                        {activeLens.logicCode}
                      </pre>
                    </div>
                  )}

                  {activeTransparencyTab === 'reason' && (
                    <div className="space-y-1.5 text-stone-300 leading-relaxed">
                      <div className="text-[11px] font-mono text-amber-400 uppercase font-semibold">
                        Why this context was injected:
                      </div>
                      <p>
                        The viewport contained keywords matching active trigger rules: <code className="text-amber-300 font-mono">[{selectedContent.matchingKeywords.join(', ')}]</code>. 
                        Confidence score calculated at <strong className="text-white">94.2%</strong> based on semantic proximity to macro-economic indicator knowledge nodes.
                      </p>
                    </div>
                  )}

                  {activeTransparencyTab === 'distribution' && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-rose-400 uppercase font-semibold">
                        4-Way Value Circulation Breakdown:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-stone-300">
                        <div className="p-2 rounded bg-stone-900 border border-stone-800">
                          <div className="text-[10px] text-stone-400">Creator Reward</div>
                          <div className="text-sm font-bold font-mono text-emerald-400">{activeLens.economicDistribution.creatorShare}%</div>
                        </div>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800">
                          <div className="text-[10px] text-stone-400">Infra & Reserve</div>
                          <div className="text-sm font-bold font-mono text-indigo-400">{activeLens.economicDistribution.infraReserveShare}%</div>
                        </div>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800">
                          <div className="text-[10px] text-stone-400">Curator Guild</div>
                          <div className="text-sm font-bold font-mono text-purple-400">{activeLens.economicDistribution.curatorShare}%</div>
                        </div>
                        <div className="p-2 rounded bg-stone-900 border border-stone-800">
                          <div className="text-[10px] text-stone-400">Audit & Safety Pool</div>
                          <div className="text-sm font-bold font-mono text-amber-400">{activeLens.economicDistribution.auditFundShare}%</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-stone-900/60 border border-stone-800 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-stone-600 mx-auto" />
              <div className="text-sm font-medium text-stone-300">
                Context Overlay Hidden
              </div>
              <p className="text-xs text-stone-500">
                Click on the floating context pill on the left to inspect verified evidence and transparency traces.
              </p>
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Open Context Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
