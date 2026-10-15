import React, { useState } from 'react';
import { 
  Eye, 
  Github, 
  Linkedin, 
  Mail, 
  Calendar, 
  Globe, 
  Webhook, 
  Radio, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { PerceptionEvent, DigitalTwinProfile } from '../types';

interface PerceptionStreamProps {
  activeProfile: DigitalTwinProfile;
  perceptions: PerceptionEvent[];
  onTriggerPerception: (event: Partial<PerceptionEvent>) => Promise<void>;
}

export const PerceptionStream: React.FC<PerceptionStreamProps> = ({
  activeProfile,
  perceptions,
  onTriggerPerception
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedSource, setSelectedSource] = useState<'github' | 'linkedin' | 'gmail' | 'web_scraper' | 'webhook'>('github');
  const [customTitle, setCustomTitle] = useState('');
  const [customSummary, setCustomSummary] = useState('');

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    setIsSimulating(true);
    await onTriggerPerception({
      source: selectedSource,
      title: customTitle,
      summary: customSummary || 'Simulated incoming data event ingested by perception listener.',
      importanceScore: 8,
      payload: { simulated: true, timestamp: new Date().toISOString() }
    });
    setCustomTitle('');
    setCustomSummary('');
    setIsSimulating(false);
  };

  const quickSimulations = [
    {
      source: 'github' as const,
      title: 'GitHub Commit: Added Streaming MCP Client',
      summary: 'Commit 8b10f24 on branch main: Implemented SSE stream transport for MCP tools'
    },
    {
      source: 'linkedin' as const,
      title: 'LinkedIn Network: 12 VC & AI Founder Connection Requests',
      summary: 'Sudden surge of connection requests following the Autonomous Multi-Agent paper share.'
    },
    {
      source: 'web_scraper' as const,
      title: 'Competitor Intelligence: Anthropic Releases MCP 2.0 Spec',
      summary: 'New protocol enhancements for stateful agent memory and zero-trust sandboxes announced.'
    }
  ];

  const getSourceIcon = (source: PerceptionEvent['source']) => {
    switch (source) {
      case 'github':
        return <Github className="w-4 h-4 text-purple-400" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-400" />;
      case 'gmail':
        return <Mail className="w-4 h-4 text-rose-400" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'web_scraper':
        return <Globe className="w-4 h-4 text-amber-400" />;
      default:
        return <Webhook className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Pillar 1: Perception Layer</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-medium">Digital Environment Radar</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Real-time Perception & Digital Environment Sensors</h2>
            <p className="text-sm text-slate-400 mt-1">
              Continuously listens to digital activity across GitHub, LinkedIn, Gmail, web scrapers, and webhooks. Feeds fresh signals into the agent's memory for autonomous trigger evaluation.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>5 Active Ingestion Streams</span>
          </div>
        </div>

        {/* Connected Sources Status Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-slate-800">
          {Object.entries(activeProfile.connectedSources).map(([source, isConnected]) => (
            <div 
              key={source}
              className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                isConnected 
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200' 
                  : 'bg-slate-950/30 border-slate-900 text-slate-500'
              }`}
            >
              <span className="capitalize font-medium">{source}</span>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Live Stream + Injection Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ingested Signals Stream */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Ingested Signals Feed</span>
            </h3>
            <span className="text-xs text-slate-500">{perceptions.length} events buffered</span>
          </div>

          <div className="space-y-3">
            {perceptions.map((evt) => (
              <div 
                key={evt.id} 
                className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mt-0.5">
                      {getSourceIcon(evt.source)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">{evt.title}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {evt.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{evt.summary}</p>
                    </div>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="text-[10px] text-slate-500 block">{evt.timestamp}</span>
                    <span className="text-[10px] font-bold text-cyan-400 block mt-0.5">
                      Significance: {evt.importanceScore}/10
                    </span>
                  </div>
                </div>

                {evt.payload && Object.keys(evt.payload).length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <pre className="text-[11px] font-mono text-slate-400 bg-slate-950/80 p-2 rounded overflow-x-auto">
                      {JSON.stringify(evt.payload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Signal Injector Simulator */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Simulate Perception Ingestion</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Inject synthetic data signals to test how the autonomous agent detects and plans actions.
            </p>

            <form onSubmit={handleSimulate} className="space-y-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Source Sensor</label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="github">GitHub Webhook</option>
                  <option value="linkedin">LinkedIn Notification</option>
                  <option value="gmail">Gmail Inbound</option>
                  <option value="web_scraper">Web Scraper / SerpAPI</option>
                  <option value="webhook">Custom API Webhook</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Signal Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. New issue opened: Benchmark latency test"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Event Summary</label>
                <textarea
                  rows={2}
                  value={customSummary}
                  onChange={(e) => setCustomSummary(e.target.value)}
                  placeholder="Details of the event..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSimulating || !customTitle}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSimulating || !customTitle
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950'
                }`}
              >
                {isSimulating ? 'Injecting Signal...' : 'Inject Perception Signal'}
              </button>
            </form>

            {/* Quick Templates */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                Quick Simulation Templates:
              </span>
              <div className="space-y-2">
                {quickSimulations.map((sim, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedSource(sim.source);
                      setCustomTitle(sim.title);
                      setCustomSummary(sim.summary);
                    }}
                    className="w-full text-left p-2 rounded bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-xs transition-all"
                  >
                    <span className="font-semibold text-slate-200 block text-[11px]">{sim.title}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sim.summary}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
