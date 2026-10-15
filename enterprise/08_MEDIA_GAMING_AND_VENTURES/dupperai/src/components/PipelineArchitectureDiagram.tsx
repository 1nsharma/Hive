import React, { useState } from 'react';
import {
  Workflow,
  Sparkles,
  Video,
  Image as ImageIcon,
  MessageSquare,
  UserCheck,
  Volume2,
  Share2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Cpu,
  Zap,
} from 'lucide-react';

export const PipelineArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('engines');

  const nodes = [
    {
      id: 'master',
      title: '1. Master Content Hub',
      sub: 'Single Source of Truth',
      desc: 'Takes one core product idea, blog link, or raw camera video as canonical input.',
      icon: Sparkles,
      color: 'border-teal-500 text-teal-400 bg-teal-950/60',
    },
    {
      id: 'engines',
      title: '2. Creation Engines',
      sub: 'Video, Visual, Copy, Avatar & Audio',
      desc: 'Specialized LLM and generative models process text, voice clone, 9:16 clips, and graphics simultaneously.',
      icon: Cpu,
      color: 'border-cyan-500 text-cyan-400 bg-cyan-950/60',
    },
    {
      id: 'rules',
      title: '3. Adaptation Rules Engine',
      sub: 'Platform Specs & Guardrails',
      desc: 'Applies character limits, video duration caps, hashtag strategies, and design tokens per platform.',
      icon: Layers,
      color: 'border-purple-500 text-purple-400 bg-purple-950/60',
    },
    {
      id: 'variants',
      title: '4. Platform Variants',
      sub: 'Instagram, TikTok, LinkedIn, FB, Headless',
      desc: 'Generates tailor-made native outputs for all channels in one click.',
      icon: Share2,
      color: 'border-blue-500 text-blue-400 bg-blue-950/60',
    },
    {
      id: 'governance',
      title: '5. Governance & Queue',
      sub: 'Personal vs Public Modes',
      desc: 'Role-based team approvals or one-tap personal scheduling across multi-accounts.',
      icon: ShieldCheck,
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/60',
    },
    {
      id: 'analytics',
      title: '6. Merged Analytics Feedback',
      sub: 'CTR & Predictive Tuning',
      desc: 'Cross-platform engagement data is fed back into creation templates to refine future hooks.',
      icon: BarChart3,
      color: 'border-amber-500 text-amber-400 bg-amber-950/60',
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Visual Pipeline Architecture Diagram</h2>
              <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">
                Interactive Modular Flow
              </span>
            </div>
            <p className="text-xs text-slate-400">End-to-end data flow: Master Content → Specialized Engines → Adaptation Rules → Unified Queue → API Connectors → Merged Analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-teal-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            <span>Create Once, Adapt Everywhere</span>
          </span>
        </div>
      </div>

      {/* Visual Pipeline Map */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Dupperai Multi-Platform Data Pipeline</span>
          <span className="text-teal-400 font-mono text-[11px]">Click any step to inspect technical details</span>
        </div>

        {/* Node Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? `${node.color} shadow-lg ring-1 ring-teal-500/50`
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    {node.id}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black text-white">{node.title}</h3>
                  <div className="text-[10px] text-slate-400 font-medium">{node.sub}</div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{node.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep Inspection Panel for Selected Node */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>Detailed Architecture Specifications for: {nodes.find((n) => n.id === selectedNode)?.title}</span>
        </h3>

        {selectedNode === 'master' && (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>The <strong>Canonical Content Hub</strong> acts as the single source of truth for every post, campaign, or product update. When you edit the master message, changes propagate downstream to all platform adaptations.</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-teal-300">
              Input Formats Supported: Plain Text Scripts, Article URLs, Camera Raw Video, Product Specs, Voice Memos
            </div>
          </div>
        )}

        {selectedNode === 'engines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Video Engine</div>
              <p className="text-slate-400 text-[11px]">Generates 9:16 vertical clips, auto-segments long-form content, applies kinetic subtitle bounce, and renders audio voiceovers.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-pink-400 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Visual Graphic Engine</div>
              <p className="text-slate-400 text-[11px]">Canva Magic Write integration that reformats on-brand graphics for 1:1, 9:16, 16:9, and 1.91:1 specs using active Brand Tokens.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5" /> Avatar/Dupper Engine</div>
              <p className="text-slate-400 text-[11px]">Learns voice clone, face model, speech cadence, and creator style fingerprints so output feels like an authentic creator replica.</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-teal-400 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Chatbot DM Engine</div>
              <p className="text-slate-400 text-[11px]">Dopple.ai persona integrations that auto-reply to customer comments, inquiries, and DMs across platforms.</p>
            </div>
          </div>
        )}

        {selectedNode === 'rules' && (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>The <strong>Adaptation Rules Engine</strong> enforces platform-specific character caps, video durations, hashtag rules, and brand token compliance.</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
              <li><strong>Instagram:</strong> Casual, emoji-rich caption with 8-12 strategic hashtags and 1:1 / 9:16 visual callout</li>
              <li><strong>TikTok:</strong> Hook-first script (under 3-second hook window), kinetic subtitles, viral sound cues, 9:16 vertical framing</li>
              <li><strong>LinkedIn:</strong> Thought-leadership headline, structured key takeaways, multi-slide PDF carousel layout</li>
              <li><strong>Facebook:</strong> Direct community link hook, preview banner concept, open discussion questions</li>
              <li><strong>Headless REST API:</strong> Structured JSON response with raw Markdown and ready-to-render React component snippets</li>
            </ul>
          </div>
        )}

        {selectedNode === 'variants' && (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>Every campaign produces 5 tailor-made platform variants simultaneously. Creators can tweak individual platform cards without altering the master source project.</p>
          </div>
        )}

        {selectedNode === 'governance' && (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>Supports both <strong>Personal Mode</strong> (one-tap instant scheduling) and <strong>Public/Brand Mode</strong> (team approval workflows, compliance validation, and multi-account dispatch).</p>
          </div>
        )}

        {selectedNode === 'analytics' && (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>Cross-platform engagement data feeds directly back into the LLM master prompt system, recommending optimized hooks for higher CTR before publishing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
