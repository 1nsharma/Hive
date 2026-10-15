import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Briefcase, 
  Network, 
  Bot, 
  Zap, 
  ArrowRight,
  Send,
  Layers,
  ShieldCheck,
  Activity,
  Terminal
} from 'lucide-react';
import { RecruitModule } from './RecruitModule';
import { McpModule } from './McpModule';
import { AgentsModule } from './AgentsModule';
import { AutomationModule } from './AutomationModule';
import { useToast } from './Toast';
import { AppViewMode } from './Navbar';
import { MessageSquare } from 'lucide-react';

type WorkspaceHub = 'recruit' | 'mcp' | 'agents' | 'automation';

interface WorkspaceViewProps {
  onSelectView?: (view: AppViewMode) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onSelectView }) => {
  const { showToast } = useToast();
  const [activeHub, setActiveHub] = useState<WorkspaceHub>('recruit');
  const [promptInput, setPromptInput] = useState('');

  const quickPrompts = [
    'Create a hiring workflow and connect my approved tools...',
    'Rank 15 candidates for Senior AI Platform Engineer role',
    'Connect Google Chat community spaces and check GitHub presence',
    'Audit GitHub MCP tool permissions for candidate screening'
  ];

  const handleSelectPrompt = (prompt: string) => {
    setPromptInput(prompt);
    if (prompt.includes('Google Chat') || prompt.includes('GitHub presence')) {
      if (onSelectView) {
        onSelectView('google-chat');
        showToast('Switched to Google Chat & Community', 'Opening live support spaces and presence monitor.', 'info');
      }
    } else if (prompt.includes('hiring workflow')) {
      setActiveHub('automation');
      showToast('Switched to Automation Engine', 'Loaded hiring workflow pipeline canvas.', 'info');
    } else if (prompt.includes('Rank 15 candidates')) {
      setActiveHub('recruit');
      showToast('Switched to AI Recruit', 'Displaying deterministic candidate scoring rankings.', 'info');
    } else if (prompt.includes('MCP tool')) {
      setActiveHub('mcp');
      showToast('Switched to MCP Connect', 'Opening tool permissions and JSON-RPC gateway.', 'info');
    }
  };

  const handleSubmitCommand = () => {
    if (!promptInput.trim()) {
      showToast('Enter a command', 'Please type an instruction or prompt for the orchestration engine.', 'info');
      return;
    }

    const lower = promptInput.toLowerCase();
    if (lower.includes('chat') || lower.includes('google') || lower.includes('community') || lower.includes('support')) {
      if (onSelectView) {
        onSelectView('google-chat');
        showToast('Switched to Google Chat & Community', 'Opening live support spaces and presence monitor.', 'info');
        return;
      }
    }

    if (lower.includes('work') || lower.includes('flow') || lower.includes('automate') || lower.includes('schedule')) {
      setActiveHub('automation');
      showToast('Orchestration Dispatched', `Routed to Automation Engine: "${promptInput}"`, 'success');
    } else if (lower.includes('mcp') || lower.includes('tool') || lower.includes('github') || lower.includes('postgres') || lower.includes('connect')) {
      setActiveHub('mcp');
      showToast('Orchestration Dispatched', `Routed to MCP Gateway: "${promptInput}"`, 'success');
    } else if (lower.includes('agent') || lower.includes('bot') || lower.includes('screen') || lower.includes('assess')) {
      setActiveHub('agents');
      showToast('Orchestration Dispatched', `Routed to Autonomous Agent Fleet: "${promptInput}"`, 'success');
    } else {
      setActiveHub('recruit');
      showToast('Orchestration Dispatched', `Parsed instruction in AI Recruitment Engine: "${promptInput}"`, 'success');
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto pt-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-800/80 text-indigo-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>WORKSPACE OVERVIEW · ENTERPRISE AI PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What would you like to build today?
        </h1>
        
        <p className="text-sm sm:text-base text-slate-300">
          Ask AI, connect tools, create agents or automate your business.
        </p>

        {/* Search & Prompt Box */}
        <div className="pt-2">
          <div className="relative flex items-center bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitCommand()}
              placeholder="Ask HireSaathi AI or enter a command (e.g., 'Create a hiring workflow and connect tools')..."
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={handleSubmitCommand}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-colors shrink-0"
              title="Submit command"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-slate-400">Suggestions:</span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(p)}
                className="text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Telemetry Pill Strip */}
      <section className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Domain Engine: <strong className="text-white">Sub-2ms Tests</strong></span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <Network className="w-3.5 h-3.5 text-cyan-400" />
          <span>MCP Transport: <strong className="text-white">JSON-RPC 2.0</strong></span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Anti-Bias Blinding: <strong className="text-white">100% Active</strong></span>
        </div>
      </section>

      {/* Google Chat Community & Support Banner */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">Google Chat Community &amp; Support Hub</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                CONNECTED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live Google Chat spaces for developer community discussions, applicant support desk, and real-time GitHub presence scanning.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectView?.('google-chat')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm shrink-0"
        >
          <span>Open Google Chat &amp; GitHub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* 4 Core Hub Cards (Interactive Switches) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: AI Recruit */}
        <button
          onClick={() => setActiveHub('recruit')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activeHub === 'recruit'
              ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeHub === 'recruit' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-indigo-400'
            }`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400">3 Active Jobs</span>
          </div>

          <h3 className="text-base font-bold text-white mt-4">AI Recruit</h3>
          <p className="text-xs text-slate-400 mt-1">Jobs and candidates</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Deterministic Scoring</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: MCP Connect */}
        <button
          onClick={() => setActiveHub('mcp')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activeHub === 'mcp'
              ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeHub === 'mcp' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-cyan-400'
            }`}>
              <Network className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-cyan-400">4 Servers</span>
          </div>

          <h3 className="text-base font-bold text-white mt-4">MCP Connect</h3>
          <p className="text-xs text-slate-400 mt-1">Tools and integrations</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Model Context Protocol</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: AI Agents */}
        <button
          onClick={() => setActiveHub('agents')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activeHub === 'agents'
              ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeHub === 'agents' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-amber-400'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-amber-400">3 Online</span>
          </div>

          <h3 className="text-base font-bold text-white mt-4">AI Agents</h3>
          <p className="text-xs text-slate-400 mt-1">Create and manage bots</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Autonomous Execution</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 4: Automation */}
        <button
          onClick={() => setActiveHub('automation')}
          className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
            activeHub === 'automation'
              ? 'bg-slate-850 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeHub === 'automation' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-emerald-400'
            }`}>
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-mono text-emerald-400">120 Runs</span>
          </div>

          <h3 className="text-base font-bold text-white mt-4">Automation</h3>
          <p className="text-xs text-slate-400 mt-1">Workflows and schedules</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Durable Event Orchestration</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </section>

      {/* Render Selected Hub Content */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {activeHub === 'recruit' && <RecruitModule />}
        {activeHub === 'mcp' && <McpModule />}
        {activeHub === 'agents' && <AgentsModule />}
        {activeHub === 'automation' && <AutomationModule />}
      </section>
    </div>
  );
};
