import React from 'react';
import {
  Sparkles,
  Video,
  Image as ImageIcon,
  MessageSquare,
  Sliders,
  Palette,
  Share2,
  BarChart3,
  Split,
  Layers,
  Cpu,
  UserCheck,
  Workflow,
  Smartphone,
} from 'lucide-react';

export type TabType =
  | 'publicApp'
  | 'pipeline'
  | 'video'
  | 'graphic'
  | 'avatar'
  | 'chatbot'
  | 'adaptive'
  | 'brand'
  | 'distribution'
  | 'abtest'
  | 'analytics'
  | 'architecture';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  campaignCount: number;
  scheduledCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  campaignCount,
  scheduledCount,
}) => {
  const menuGroups = [
    {
      group: 'Core Pipeline',
      items: [
        {
          id: 'publicApp' as TabType,
          label: 'Dupperai Creator App',
          subLabel: 'Live Interactive App',
          icon: Smartphone,
          badge: 'NEW',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        },
        {
          id: 'pipeline' as TabType,
          label: 'Master Pipeline',
          subLabel: 'Create Once, Adapt Everywhere',
          icon: Sparkles,
          badge: `${campaignCount}`,
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        },
        {
          id: 'architecture' as TabType,
          label: 'Architecture Flow Diagram',
          subLabel: 'System Data Pipeline',
          icon: Workflow,
        },
      ],
    },
    {
      group: 'Specialized Engines',
      items: [
        {
          id: 'avatar' as TabType,
          label: 'Avatar Persona Engine',
          subLabel: 'The "Dupper" Digital Twin',
          icon: UserCheck,
        },
        {
          id: 'video' as TabType,
          label: 'Video Engine',
          subLabel: 'Clips, Subtitles & Voice TTS',
          icon: Video,
        },
        {
          id: 'graphic' as TabType,
          label: 'Graphic Engine',
          subLabel: 'Magic Canvas & Formats',
          icon: ImageIcon,
        },
        {
          id: 'chatbot' as TabType,
          label: 'Interactive Chatbot',
          subLabel: 'Dopple.ai Personas & DMs',
          icon: MessageSquare,
        },
        {
          id: 'adaptive' as TabType,
          label: 'Adaptive Design',
          subLabel: 'Real-time Variation AI',
          icon: Sliders,
        },
      ],
    },
    {
      group: 'Merge & Distribution',
      items: [
        {
          id: 'distribution' as TabType,
          label: 'Headless & Calendar',
          subLabel: 'Multi-Channel API Hub',
          icon: Share2,
          badge: `${scheduledCount} queued`,
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        },
        {
          id: 'brand' as TabType,
          label: 'Central Brand Hub',
          subLabel: 'Design Tokens & Kit',
          icon: Palette,
        },
      ],
    },
    {
      group: 'Intelligence & Quality',
      items: [
        {
          id: 'abtest' as TabType,
          label: 'Predictive A/B Lab',
          subLabel: 'Engagement Scoring',
          icon: Split,
        },
        {
          id: 'analytics' as TabType,
          label: 'Unified Analytics',
          subLabel: 'Orchestration & Credits',
          icon: BarChart3,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {group.group}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500/15 to-emerald-500/10 text-white border border-teal-500/30 font-semibold shadow-md shadow-teal-950/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 group-hover:text-teal-400 group-hover:bg-slate-700/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold leading-tight">{item.label}</div>
                        <div className="text-[10px] text-slate-500 leading-tight font-normal">
                          {item.subLabel}
                        </div>
                      </div>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-teal-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Gemini 3.6 Flash</div>
              <div className="text-[10px] text-slate-400">Server-Side Active</div>
            </div>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
