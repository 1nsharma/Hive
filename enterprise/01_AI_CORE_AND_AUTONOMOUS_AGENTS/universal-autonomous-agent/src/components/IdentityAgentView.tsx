import React, { useState } from 'react';
import { 
  Fingerprint, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  XCircle, 
  Sparkles, 
  Send, 
  RefreshCw, 
  TrendingUp, 
  FileText, 
  Share2, 
  Users, 
  Brain, 
  ExternalLink, 
  Check, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  Award
} from 'lucide-react';
import { 
  IdentityEntity, 
  IdentityGeneratedContent, 
  IdentityGrowthProspect, 
  IdentityVerificationStatus, 
  IdentityPipelineRun,
  DigitalTwinProfile 
} from '../types';

interface IdentityAgentViewProps {
  profile: DigitalTwinProfile;
  entities: IdentityEntity[];
  generatedContent: IdentityGeneratedContent[];
  growthProspects: IdentityGrowthProspect[];
  pipelineRuns: IdentityPipelineRun[];
  onRunPipeline: () => Promise<void>;
  onVerifyEntity: (entityId: string, status: IdentityVerificationStatus) => Promise<void>;
  onNavigateToReview: () => void;
}

export const IdentityAgentView: React.FC<IdentityAgentViewProps> = ({
  profile,
  entities,
  generatedContent,
  growthProspects,
  pipelineRuns,
  onRunPipeline,
  onVerifyEntity,
  onNavigateToReview
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [selectedProspectCategory, setSelectedProspectCategory] = useState<string>('all');

  const handleRunPipeline = async () => {
    setIsRunning(true);
    try {
      await onRunPipeline();
    } finally {
      setIsRunning(false);
    }
  };

  const getVerificationBadge = (status: IdentityVerificationStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle className="w-3.5 h-3.5" /> CONFIRMED
          </span>
        );
      case 'POSSIBLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertCircle className="w-3.5 h-3.5" /> POSSIBLE
          </span>
        );
      case 'NOT_YOU':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <XCircle className="w-3.5 h-3.5" /> NOT YOU
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 border border-slate-600">
            <HelpCircle className="w-3.5 h-3.5" /> UNKNOWN
          </span>
        );
    }
  };

  const filteredContent = selectedFormat === 'all'
    ? generatedContent
    : generatedContent.filter(c => c.format === selectedFormat);

  const filteredProspects = selectedProspectCategory === 'all'
    ? growthProspects
    : growthProspects.filter(p => p.category === selectedProspectCategory);

  const stages = [
    { num: 1, label: '1. Discover', desc: 'Web, GitHub, Scholars, News', count: entities.length },
    { num: 2, label: '2. Verify', desc: 'Entity Reconcile & Guard', count: entities.filter(e => e.verificationStatus === 'CONFIRMED').length },
    { num: 3, label: '3. Understand', desc: 'Digital Identity Delta', count: 'Live' },
    { num: 4, label: '4. Generate', desc: 'Multi-Format Technical Thought', count: generatedContent.length },
    { num: 5, label: '5. Growth', desc: 'Founders, MSME, Investors', count: growthProspects.length },
    { num: 6, label: '6. Distribute', desc: 'Review & Policy Gate', count: 'HITL' },
    { num: 7, label: '7. Learn', desc: 'Strategy Recalibration', count: `${profile.heuristicWeights.learningAdaptability}%` }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/95 rounded-2xl border border-cyan-500/30 p-6 relative overflow-hidden backdrop-blur-md shadow-xl shadow-cyan-950/20">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Production Instance #1
              </span>
              <span className="text-xs text-slate-400">• Autonomous Digital Identity & Growth</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <Fingerprint className="w-7 h-7 text-cyan-400" />
              {profile.name} Identity Agent
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Operating system instance running continuous discovery, entity verification, daily delta analysis, content synthesis, founder outreach, and self-learning feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRunPipeline}
              disabled={isRunning}
              className={`px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg transition-all ${
                isRunning 
                  ? 'bg-cyan-700 text-cyan-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-900/40'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running 7-Stage Loop...' : 'Trigger Identity & Growth Loop'}
            </button>
          </div>
        </div>

        {/* 7-Stage Pipeline Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-6 pt-5 border-t border-slate-800">
          {stages.map((st) => (
            <button
              key={st.num}
              onClick={() => setActiveStage(st.num)}
              className={`text-left p-2.5 rounded-xl border transition-all ${
                activeStage === st.num
                  ? 'bg-cyan-500/20 border-cyan-500/60 shadow-sm shadow-cyan-900/30'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${activeStage === st.num ? 'text-cyan-300' : 'text-slate-200'}`}>
                  {st.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 font-mono">
                  {st.count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{st.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Stage-Specific Content Views */}

      {/* STAGE 1 & 2: Discover & Verify */}
      {(activeStage === 1 || activeStage === 2) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                {activeStage === 1 ? '1. Discovered Digital Identity Footprint' : '2. Disambiguation & Verification Engine'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeStage === 1 
                  ? 'Perception signals from GitHub, Google Scholar, News, X, and Web Registries.'
                  : 'Reconcile identity mentions into CONFIRMED, POSSIBLE, UNKNOWN, or NOT YOU to prevent identity drift.'}
              </p>
            </div>

            <div className="text-xs text-slate-400">
              {entities.filter(e => e.verificationStatus === 'CONFIRMED').length} Verified / {entities.length} Discovered
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entities.map((entity) => (
              <div
                key={entity.id}
                className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {entity.source}
                    </span>
                    <h4 className="font-semibold text-white text-sm mt-1.5 line-clamp-1">{entity.title}</h4>
                  </div>

                  <div className="shrink-0">
                    {getVerificationBadge(entity.verificationStatus)}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {entity.snippet}
                </p>

                {entity.deltaIdentified && (
                  <div className="bg-cyan-950/30 border border-cyan-800/40 p-2.5 rounded-lg text-xs text-cyan-300">
                    <span className="font-semibold block text-[11px] text-cyan-400 uppercase tracking-wider mb-0.5">
                      Delta Identified:
                    </span>
                    {entity.deltaIdentified}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {entity.discoveredAt}
                  </span>

                  {/* Verification Actions */}
                  <div className="flex items-center gap-1">
                    {(['CONFIRMED', 'POSSIBLE', 'NOT_YOU'] as IdentityVerificationStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => onVerifyEntity(entity.id, st)}
                        className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                          entity.verificationStatus === st
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {st === 'NOT_YOU' ? 'Not You' : st}
                      </button>
                    ))}

                    <a
                      href={entity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1"
                      title="Inspect Source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 3: Understand (Delta Analysis) */}
      {activeStage === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                3. "आज आपकी Digital Identity में क्या बदला?" (Delta Understanding)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Semantic synthesis of changes across web repos, mentions, invitations, and publications.
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-800/60">
              Live Synthesis
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Delta Card */}
            <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-6 space-y-4">
              <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">
                Key Shifts & Momentum Analysis
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <h5 className="font-semibold text-white">GitHub Repo Star Velocity Surge</h5>
                    <p className="text-slate-300 mt-0.5">
                      Your open-source repository <span className="text-cyan-300 font-mono">mcp-autonomous-orchestrator</span> received +68 stars in 48 hours following the release of streaming SSE transport.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <h5 className="font-semibold text-white">External Authority Citation</h5>
                    <p className="text-slate-300 mt-0.5">
                      Featured in <em>The AI Dispatch: Top 10 Multi-Agent Frameworks to Watch in 2026</em> with your direct perspective on asynchronous agent memory loops.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h5 className="font-semibold text-white">Keynote Speaker Invitation</h5>
                    <p className="text-slate-300 mt-0.5">
                      Received formal invitation for India AI Summit 2026 for session on "Building Resilient Agent Operating Systems with Zero-Trust".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div>
                    <h5 className="font-semibold text-white">Disambiguation Resolved</h5>
                    <p className="text-slate-300 mt-0.5">
                      Disambiguated and excluded "Amit Sharma Realty" to protect pure deep-tech positioning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Advice Card */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Next Strategic Move
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                Capitalize on the Hacker News & GitHub star surge by publishing our pre-drafted LinkedIn breakdown on Agent Operating Systems today.
              </p>

              <div className="space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Identity Heuristics
                </span>
                <div className="flex justify-between text-slate-300">
                  <span>Visionary Depth:</span>
                  <span className="text-cyan-400 font-bold">94 / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tech Credibility:</span>
                  <span className="text-emerald-400 font-bold">98 / 100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Network Gravity:</span>
                  <span className="text-indigo-400 font-bold">88 / 100</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStage(4)}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all mt-3"
              >
                Proceed to Content Generation
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: Generate (Content Generation) */}
      {activeStage === 4 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                4. Multi-Format Content Synthesis
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Auto-generated from recent GitHub commits, AI industry movements, and your architectural blueprints.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 text-xs">
              {['all', 'linkedin', 'dev_to', 'x_post', 'project_update'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedFormat === fmt
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {fmt.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredContent.map((post) => (
              <div
                key={post.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      Format: {post.format.toUpperCase()}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5">{post.title}</h4>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    post.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {post.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {post.body}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <span key={t} className="text-cyan-400 text-[11px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    {post.engagementMetrics && (
                      <div className="flex items-center gap-3 text-slate-400 text-xs">
                        <span>👀 {post.engagementMetrics.views.toLocaleString()}</span>
                        <span>❤️ {post.engagementMetrics.reactions}</span>
                        <span>💬 {post.engagementMetrics.replies}</span>
                      </div>
                    )}

                    {post.status === 'pending_approval' && (
                      <button
                        onClick={onNavigateToReview}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 transition-all"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Open Review Gate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 5: Growth (Prospects & Outreach) */}
      {activeStage === 5 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                5. Targeted Growth & High-Synergy Outreach
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Prospect discovery across AI founders, MSME leaders, developers, researchers, and investors.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {['all', 'ai_founder', 'msme_tech_leader', 'investor', 'researcher'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedProspectCategory(cat)}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    selectedProspectCategory === cat
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProspects.map((prospect) => (
              <div
                key={prospect.id}
                className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{prospect.name}</h4>
                    <p className="text-xs text-slate-400">{prospect.role} • <span className="text-cyan-300">{prospect.organization}</span></p>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Match: {prospect.relevanceScore}%
                  </span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-200">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Drafted {prospect.outreachChannel.toUpperCase()} Intro:
                  </span>
                  <p className="italic text-slate-300 leading-relaxed">
                    "{prospect.draftedOutreachMessage}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    prospect.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                    prospect.status === 'sent' ? 'bg-cyan-500/20 text-cyan-300' :
                    'bg-slate-800 text-amber-400'
                  }`}>
                    Status: {prospect.status}
                  </span>

                  <button
                    onClick={onNavigateToReview}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-medium flex items-center gap-1"
                  >
                    Authorize in Control Plane <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 6: Distribute */}
      {activeStage === 6 && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-white">Stage 6: Policy & Distribution Gate</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            All outbound broadcasts, social publications, and direct personalized emails pass through the centralized Agent Control Plane for verification.
          </p>

          <button
            onClick={onNavigateToReview}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
          >
            Open Agent Control Plane
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STAGE 7: Learn */}
      {activeStage === 7 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                7. Heuristic Self-Learning & Strategy Feedback Loop
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adapting weights and outreach templates based on reply sentiments and post engagement.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Attention Focus</span>
              <p className="text-sm font-bold text-cyan-300">Model Context Protocol 2.0 & Autonomous Swarms</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audience engagement metrics show 3.2x higher conversion when technical code snippets and AST diffs are provided.
              </p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Adaptability Score</span>
              <p className="text-2xl font-bold text-emerald-400">{profile.heuristicWeights.learningAdaptability}%</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Self-tuning weight calibrated automatically following 42 successful mission evaluations.
              </p>
            </div>

            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs text-slate-400 uppercase font-semibold block">Strategy Adjustment</span>
              <p className="text-sm font-bold text-indigo-300">Deep-Tech Founder Positioning</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Heuristic shifted from generic AI news reporting to proprietary benchmark breakdowns.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
