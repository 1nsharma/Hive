import React from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  Brain, 
  Wrench, 
  ScrollText, 
  Compass, 
  Sparkles, 
  AlertTriangle,
  Fingerprint,
  MessageSquare,
  Smartphone,
  Workflow,
  Terminal,
  ShoppingBag,
  Cloud,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { DigitalTwinProfile, OperatingMode, ReviewControlItem } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeProfile: DigitalTwinProfile;
  profiles: DigitalTwinProfile[];
  onSelectProfile: (id: string) => void;
  reviewItems: ReviewControlItem[];
  operatingMode: OperatingMode;
  onModeChange: (mode: OperatingMode) => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  profiles,
  onSelectProfile,
  reviewItems,
  operatingMode,
  onModeChange,
  hasGeminiKey
}) => {
  const pendingReviewCount = reviewItems.filter(r => r.status === 'pending').length;

  const navTabs = [
    { 
      id: 'work_os', 
      label: 'Universal Work OS', 
      icon: Sparkles,
      highlightBadge: 'Local-First'
    },
    { id: 'agents', label: 'Agents Swarm', icon: Bot },
    { 
      id: 'identity_agent', 
      label: 'Amit Identity Agent', 
      icon: Fingerprint,
      highlightBadge: 'Production #1'
    },
    { 
      id: 'policy_engine', 
      label: 'Policy & Permissions', 
      icon: ShieldAlert,
      highlightBadge: 'Option A'
    },
    { 
      id: 'tool_runtime', 
      label: 'Tool Runtime & MCP', 
      icon: Wrench,
      highlightBadge: 'Phase 4'
    },
    { 
      id: 'orchestrator', 
      label: 'Core Orchestrator', 
      icon: Workflow,
      highlightBadge: 'Option B'
    },
    { 
      id: 'control_plane', 
      label: 'Review (Control Plane)', 
      icon: ShieldCheck, 
      badge: pendingReviewCount 
    },
    { id: 'channels', label: 'Bot / Channels', icon: MessageSquare },
    { id: 'mobile', label: 'Mobile Remote', icon: Smartphone },
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'cli', label: 'CLI Terminal', icon: Terminal },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'cloud', label: 'Cloud & Memory', icon: Cloud },
    { id: 'audit', label: 'Audit Traces', icon: ScrollText },
    { id: 'roadmap', label: 'OS Roadmap', icon: Compass },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-900/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Agent OS</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  v2.4 Core
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Work Operating System • Zero-Trust</p>
            </div>
          </div>

          {/* Center & Right Controls: Operating Mode & Digital Twin */}
          <div className="flex items-center space-x-3">
            {/* Operating Mode Selector */}
            <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 p-1 text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-medium hidden sm:inline">Mode:</span>
              {(['COPILOT', 'SUPERVISED', 'AUTONOMOUS'] as OperatingMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onModeChange(mode)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    operatingMode === mode
                      ? mode === 'AUTONOMOUS'
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-900/40'
                        : mode === 'COPILOT'
                        ? 'bg-amber-600 text-white'
                        : 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}

              {/* Emergency Lockdown Toggle */}
              <button
                onClick={() => onModeChange(operatingMode === 'LOCKDOWN' ? 'SUPERVISED' : 'LOCKDOWN')}
                className={`ml-1 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  operatingMode === 'LOCKDOWN'
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'text-rose-400 hover:bg-rose-950/40'
                }`}
                title={operatingMode === 'LOCKDOWN' ? 'Exit Lockdown' : 'Emergency Lockdown: Freezes all autonomous workers'}
              >
                <ShieldAlert className="w-3 h-3" />
                {operatingMode === 'LOCKDOWN' ? 'LOCKED' : 'LOCK'}
              </button>
            </div>

            {/* Active Digital Twin Selector */}
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 hidden md:inline">Profile:</span>
              <select
                aria-label="Select Tenant Profile"
                value={activeProfile.id}
                onChange={(e) => onSelectProfile(e.target.value)}
                className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    {p.name} ({p.role.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/80">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>

                {tab.highlightBadge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    {tab.highlightBadge}
                  </span>
                )}

                {tab.badge && tab.badge > 0 ? (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
