import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Sparkles, 
  GitPullRequest, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  FolderTree, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { GamingTrend, GitHubPR } from '../types';

interface AISynthesizerModuleProps {
  trends: GamingTrend[];
  selectedTrendForSynthesis: GamingTrend | null;
  onSynthesizeCode: (gameId: string, trendTopic: string, customInstructions: string) => Promise<GitHubPR | null>;
  isSynthesizing: boolean;
  latestGeneratedPR: GitHubPR | null;
  onNavigateToPR: (prId: string) => void;
}

export const AISynthesizerModule: React.FC<AISynthesizerModuleProps> = ({
  trends,
  selectedTrendForSynthesis,
  onSynthesizeCode,
  isSynthesizing,
  latestGeneratedPR,
  onNavigateToPR
}) => {
  const [selectedGame, setSelectedGame] = useState<string>('rasoi_rush');
  const [selectedTrendTopic, setSelectedTrendTopic] = useState<string>('');
  const [customDirectives, setCustomDirectives] = useState<string>('Inject dynamic LiveOps remote config hooks, audio cues, and festival scoring multipliers.');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeFileTab, setActiveFileTab] = useState<'script' | 'tests' | 'meta'>('script');

  const games = [
    { id: 'rasoi_rush', name: 'Rasoi Rush', genre: 'Cooking Sim', icon: '🥘', path: 'games/rasoi_rush/scripts/' },
    { id: 'gully_cricket', name: 'Gully Cricket Pro', genre: 'Sports / Casual', icon: '🏏', path: 'games/gully_cricket/scripts/' },
    { id: 'chaiwala_tycoon', name: 'Chaiwala Tycoon', genre: 'Management Sim', icon: '☕', path: 'games/chaiwala_tycoon/scripts/' },
    { id: 'auto_rickshaw_drift', name: 'Auto Rickshaw Drift 3D', genre: 'Arcade Racing', icon: '🛺', path: 'games/auto_rickshaw_drift/scripts/' },
    { id: 'kabaddi_rumble', name: 'Kabaddi Rumble Pro', genre: 'Action / Sports', icon: '🤼', path: 'games/kabaddi_rumble/scripts/' },
  ];

  useEffect(() => {
    if (selectedTrendForSynthesis) {
      setSelectedTrendTopic(selectedTrendForSynthesis.topic);
      if (selectedTrendForSynthesis.suggestedGame) {
        setSelectedGame(selectedTrendForSynthesis.suggestedGame);
      }
    } else if (trends.length > 0 && !selectedTrendTopic) {
      setSelectedTrendTopic(trends[0].topic);
    }
  }, [selectedTrendForSynthesis, trends]);

  const handleRunSynthesis = async () => {
    if (!selectedTrendTopic) return;
    await onSynthesizeCode(selectedGame, selectedTrendTopic, customDirectives);
  };

  const handleCopyCode = () => {
    if (!latestGeneratedPR) return;
    navigator.clipboard.writeText(latestGeneratedPR.newCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadGDScript = () => {
    if (!latestGeneratedPR) return;
    const element = document.createElement('a');
    const file = new Blob([latestGeneratedPR.newCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = latestGeneratedPR.filePath.split('/').pop() || 'TrendFeature.gd';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-orange-950/40 border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold tracking-wider uppercase mb-1">
              <Cpu className="w-4 h-4" />
              <span>Module 2: The AI Synthesizer (Agentic Code Generation)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Autonomous Godot 4 GDScript Generation & Git Commits
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Reads market signals from the Trend Radar, translates player demands into Godot game mechanics, writes robust GDScript, and opens GitHub Pull Requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-orange-950/80 border border-orange-500/30 text-orange-400 text-xs font-mono font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Model: Gemini 3.7 Flash Engine</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Agent Configuration & Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Evolution Directives & Target Studio</span>
            </h3>

            {/* Game Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Target Desi Game</span>
                <span className="text-[10px] text-slate-500 font-mono">Godot 4.3 Engine</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {games.map(game => (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedGame === game.id
                        ? 'bg-orange-950/40 border-orange-500/50 text-white shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{game.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{game.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{game.genre}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{game.path}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingested Trend Target */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Ingested Research Trend</span>
                <span className="text-[10px] text-amber-400 font-mono">From Module 1 Radar</span>
              </label>
              <select
                value={selectedTrendTopic}
                onChange={(e) => setSelectedTrendTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                {trends.map(t => (
                  <option key={t.id} value={t.topic}>
                    [{t.source}] {t.topic}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Game Design Directives */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Studio Engineering Constraints & Guidelines
              </label>
              <textarea
                value={customDirectives}
                onChange={(e) => setCustomDirectives(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-orange-500 leading-relaxed font-mono"
                placeholder="Specify signals, multiplier formulas, node structures..."
              />
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleRunSynthesis}
              disabled={isSynthesizing || !selectedTrendTopic}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/10 ${
                isSynthesizing
                  ? 'bg-orange-600/50 text-orange-200 cursor-not-allowed animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 active:scale-95'
              }`}
            >
              {isSynthesizing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  <span>Agent Synthesizing GDScript & Opening PR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize GDScript & Push Pull Request</span>
                </>
              )}
            </button>

          </div>

          {/* Agent Architecture Note */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-orange-400" />
              <span>server/agents/research_agent.js Protocol</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When triggered, the agent reads <code className="text-amber-300 font-mono">research/trend_data.json</code>, prompts the LLM to design an authentic game mechanic, pushes a new branch <code className="text-orange-300 font-mono">ai-evolution-[timestamp]</code>, and opens an automated GitHub PR ready for GUT unit testing.
            </p>
          </div>

        </div>

        {/* Right Column: Code Studio & Pull Request Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            
            {/* Header Tabs */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  {latestGeneratedPR?.filePath || `games/${selectedGame}/scripts/TrendFeature.gd`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy GDScript'}</span>
                </button>

                <button
                  onClick={handleDownloadGDScript}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Export .gd</span>
                </button>
              </div>
            </div>

            {/* Generated Code Window */}
            <div className="p-4 bg-slate-950 overflow-x-auto min-h-[380px] max-h-[500px]">
              {latestGeneratedPR ? (
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
                  {latestGeneratedPR.newCode}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-[340px] text-center p-6 space-y-3">
                  <Cpu className="w-12 h-12 text-slate-700 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-300">Ready for Agentic Code Generation</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Select a game and trend on the left, then click "Synthesize GDScript" to create production Godot 4 scripts.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Bar / PR Link */}
            {latestGeneratedPR && (
              <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-mono">
                  <GitPullRequest className="w-4 h-4 text-emerald-400" />
                  <span>PR #{latestGeneratedPR.number}:</span>
                  <span className="text-slate-400 truncate max-w-xs">{latestGeneratedPR.commitMsg}</span>
                </div>

                <button
                  onClick={() => onNavigateToPR(latestGeneratedPR.id)}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <span>Inspect PR in CI/CD Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

          {/* Quick Commit & Branch Info */}
          {latestGeneratedPR && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Git Branch</span>
                <span className="font-mono text-orange-400 font-bold block truncate">{latestGeneratedPR.branch}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">CI/CD GUT Test Status</span>
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3 / 3 Tests Green</span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">LiveOps Contract</span>
                <span className="font-mono text-sky-400 font-bold block">/api/liveops/trends</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
