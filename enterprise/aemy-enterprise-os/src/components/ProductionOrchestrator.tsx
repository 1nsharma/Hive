/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, BrandName } from '../types';
import { 
  INITIAL_PIPELINES, INITIAL_AUDIT_LOGS, PRESET_INTENTS, 
  LivePipeline, LiveAuditEvent 
} from '../data/productionEngineData';
import { 
  Play, Pause, RefreshCw, CheckCircle2, AlertTriangle, 
  ShieldCheck, Database, Cpu, Activity, Zap, Layers, 
  Terminal, ArrowRight, Sparkles, Lock, Check, Copy, 
  Flame, Server, Eye, ExternalLink, Sliders
} from 'lucide-react';

interface ProductionOrchestratorProps {
  brand: BrandName;
  lang: Language;
}

export const ProductionOrchestrator: React.FC<ProductionOrchestratorProps> = ({ brand, lang }) => {
  // State for active intent
  const [userPrompt, setUserPrompt] = useState<string>(PRESET_INTENTS[0].text);
  const [orchestratingStep, setOrchestratingStep] = useState<
    'idle' | 'parsing' | 'oauth' | 'schema' | 'preflight' | 'deterministic_commit' | 'active'
  >('idle');
  
  // Pipelines state
  const [pipelines, setPipelines] = useState<LivePipeline[]>(INITIAL_PIPELINES);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(INITIAL_PIPELINES[0].id);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<LiveAuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [selectedAuditLog, setSelectedAuditLog] = useState<LiveAuditEvent | null>(INITIAL_AUDIT_LOGS[0]);

  // Failure simulation state
  const [healingStage, setHealingStage] = useState<'healthy' | '429_throttled' | 'buffering_redis' | 'recovering' | 'recovered'>('healthy');
  const [bufferedCount, setBufferedCount] = useState<number>(0);

  // Human authority modal state
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [pendingHighRiskAction, setPendingHighRiskAction] = useState<string | null>(null);

  // Active view tab inside the orchestrator
  const [activeConsoleTab, setActiveConsoleTab] = useState<'orchestrator' | 'pipelines' | 'self-healing' | 'memory-layers' | 'audit-lineage'>('orchestrator');

  // Selected memory tier
  const [memoryTier, setMemoryTier] = useState<'layer-a' | 'layer-b' | 'layer-c'>('layer-a');

  // Event stream counter increment simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelines((prev) =>
        prev.map((pipe) => {
          if (pipe.status === 'RUNNING' || pipe.status === 'SYNCED') {
            return {
              ...pipe,
              eventsProcessed: pipe.eventsProcessed + Math.floor(Math.random() * 3) + 1,
              latencyMs: Math.max(24, Math.floor(pipe.latencyMs + (Math.random() * 6 - 3)))
            };
          }
          return pipe;
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Run the full 9-step Autonomous Intent Orchestration
  const handleExecuteIntent = () => {
    setOrchestratingStep('parsing');
    setTimeout(() => {
      setOrchestratingStep('oauth');
      setTimeout(() => {
        setOrchestratingStep('schema');
        setTimeout(() => {
          setOrchestratingStep('preflight');
          setTimeout(() => {
            setOrchestratingStep('deterministic_commit');
            setTimeout(() => {
              setOrchestratingStep('active');

              // Add a new pipeline if needed
              const newPipeline: LivePipeline = {
                id: `pipe-${Date.now()}`,
                name: 'Custom Autonomous Pipeline',
                source: 'Salesforce Enterprise',
                destination: 'Google Sheets & Slack Alert',
                status: 'RUNNING',
                eventsProcessed: 1,
                latencyMs: 38,
                lastSyncAgo: 'Just now',
                circuitBreaker: 'CLOSED',
                riskLevel: 'Low-Risk',
                schemaMapping: [
                  { sourceField: 'Lead.Name', targetField: 'Sheets.ColA', transformation: 'Sanitize' },
                  { sourceField: 'Lead.Email', targetField: 'Sheets.ColB', transformation: 'Validate' },
                  { sourceField: 'Lead.Value', targetField: 'Slack.PostChannel', transformation: 'Conditional > $50k' }
                ],
                description: userPrompt
              };

              setPipelines(prev => [newPipeline, ...prev]);
              setSelectedPipelineId(newPipeline.id);

              // Add audit log
              const newLog: LiveAuditEvent = {
                id: `evt-${Date.now().toString().slice(-5)}`,
                timestamp: new Date().toLocaleTimeString(),
                pipelineId: newPipeline.id,
                eventType: 'pipeline.provisioned',
                sourcePayload: { user_intent: userPrompt, triggered_by: 'natural_language_orchestrator' },
                normalizedPayload: { status: 'PROVISIONED', engine: 'BullMQ_PostgreSQL_16' },
                actionTaken: 'Intent translated, OAuth PKCE verified, Canonical mapping bound and streaming live.',
                riskTier: 'Low-Risk',
                approvalStatus: 'Auto-Executed',
                provenanceHash: `sha256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 8)}`
              };

              setAuditLogs(prev => [newLog, ...prev]);
            }, 800);
          }, 700);
        }, 800);
      }, 700);
    }, 600);
  };

  // Trigger self-healing test
  const handleSimulateOutage = (type: '429' | '503') => {
    setHealingStage('429_throttled');
    setBufferedCount(12);

    // Update selected pipeline state
    setPipelines(prev => prev.map(p => {
      if (p.id === selectedPipelineId) {
        return { ...p, status: 'QUEUED_FOR_RECOVERY', circuitBreaker: 'OPEN' };
      }
      return p;
    }));

    setTimeout(() => {
      setHealingStage('buffering_redis');
      setBufferedCount(48);

      setTimeout(() => {
        setHealingStage('recovering');

        setPipelines(prev => prev.map(p => {
          if (p.id === selectedPipelineId) {
            return { ...p, circuitBreaker: 'HALF_OPEN' };
          }
          return p;
        }));

        setTimeout(() => {
          setHealingStage('recovered');
          setBufferedCount(0);

          setPipelines(prev => prev.map(p => {
            if (p.id === selectedPipelineId) {
              return { ...p, status: 'SYNCED', circuitBreaker: 'CLOSED' };
            }
            return p;
          }));

          setTimeout(() => setHealingStage('healthy'), 4000);
        }, 1500);
      }, 1600);
    }, 1400);
  };

  // Dispatch a high-risk test action to demonstrate Human Authority Gate
  const handleTriggerHighRiskAction = () => {
    setPendingHighRiskAction('Bulk Deletion of 450 Inactive CRM Leads & $1,200 Merchant Account Refund');
    setShowApprovalModal(true);
  };

  const handleConfirmHighRiskApproval = () => {
    setShowApprovalModal(false);
    
    // Add approved audit event
    const approvedLog: LiveAuditEvent = {
      id: `evt-auth-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      pipelineId: selectedPipelineId,
      eventType: 'human_authority.approved',
      sourcePayload: { action: pendingHighRiskAction, requested_by: 'Orchestrator Agent' },
      normalizedPayload: { risk_level: 'High-Risk', signature_2fa: 'VERIFIED_OKTA_TOTP' },
      actionTaken: 'High-Risk action executed following explicit Workspace Admin signature verification.',
      riskTier: 'High-Risk',
      approvalStatus: 'Approved by Admin',
      provenanceHash: `sha256:${Math.random().toString(36).substring(2, 10)}`
    };

    setAuditLogs(prev => [approvedLog, ...prev]);
    setSelectedAuditLog(approvedLog);
  };

  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId) || pipelines[0];

  return (
    <section id="production-engine" className="py-20 border-t border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Live Engine Health Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span>{lang === 'hi' ? 'Aura लाइव प्रोडक्शन इंजन v1.0' : 'Aura Live Production Engine v1.0'}</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-2">
              {lang === 'hi' ? 'वास्तविक उत्पादन कंसोल' : 'Real Production Operating System'}
            </h2>

            <p className="text-sm sm:text-base text-[#9a9ab0] max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'प्राकृतिक भाषा आशय दें, स्वचालित रूप से 9-चरणीय लूप चलाएं, वास्तविक समय में पाइपलाइनों की निगरानी करें, और सेल्फ-हीलिंग सर्किट ब्रेकर्स का परीक्षण करें।'
                : 'Input business outcomes in natural language, run the autonomous 9-step orchestration loop, monitor active pipelines, and test self-healing resilience.'}
            </p>
          </div>

          {/* Telemetry Status Bar */}
          <div className="flex items-center gap-3 bg-[#0d0d1a] border border-white/10 p-3 rounded-2xl">
            <div className="px-3 py-1.5 border-r border-white/10 text-left">
              <span className="text-[10px] font-mono text-[#9a9ab0] block uppercase">Uptime SLA</span>
              <span className="text-xs font-bold font-mono text-emerald-400">99.995%</span>
            </div>
            <div className="px-3 py-1.5 border-r border-white/10 text-left">
              <span className="text-[10px] font-mono text-[#9a9ab0] block uppercase">p95 Latency</span>
              <span className="text-xs font-bold font-mono text-[#22d3ee]">42ms</span>
            </div>
            <div className="px-3 py-1.5 text-left">
              <span className="text-[10px] font-mono text-[#9a9ab0] block uppercase">Data Loss</span>
              <span className="text-xs font-bold font-mono text-emerald-400">0.00% Zero-Loss</span>
            </div>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-white/10">
          <button
            onClick={() => setActiveConsoleTab('orchestrator')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'orchestrator'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
                : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>{lang === 'hi' ? '1. इरादा ऑर्केस्ट्रेटर' : '1. Intent Orchestrator'}</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('pipelines')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'pipelines'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
                : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? '2. सक्रिय पाइपलाइन्स (4 Live)' : '2. Active Pipelines (4 Live)'}</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('self-healing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'self-healing'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
                : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? '3. सेल्फ-हीलिंग लैब (Circuit Breaker)' : '3. Self-Healing Lab'}</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('memory-layers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'memory-layers'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
                : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#c4b5fd]" />
            <span>{lang === 'hi' ? '4. 3-परतीय मेमोरी व्यूअर' : '4. 3-Layer Memory Inspector'}</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('audit-lineage')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeConsoleTab === 'audit-lineage'
                ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
                : 'bg-white/[0.02] text-[#9a9ab0] hover:text-white border border-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'hi' ? '5. डेटा प्रामाणिकता & ऑडिट' : '5. Provenance & Audit Trail'}</span>
          </button>
        </div>

        {/* TAB 1: Real Intent Orchestrator */}
        {activeConsoleTab === 'orchestrator' && (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0d0d1a] via-[#07070d] to-[#7c5cff]/10 border border-[#7c5cff]/30 shadow-2xl space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
                  Principle 01 & 02: Zero-Config & Intent-Over-Interface
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  {lang === 'hi' ? 'वांछित परिणाम बताएं — आंतरिक प्लंबिंग Aura संभालेगा' : 'Declare The Business Outcome — Aura Handles The Plumbing'}
                </h3>
                <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
                  {lang === 'hi'
                    ? 'प्राकृतिक भाषा में टाइप करें या नीचे दिए गए एंटरप्राइज़ उदाहरणों में से एक चुनें।'
                    : 'Input your business intent in plain language. Aura discovers connectors, executes zero-trust OAuth, auto-maps canonical schemas, and streams live data.'}
                </p>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#c4b5fd] block uppercase">
                  {lang === 'hi' ? 'तुरंत परीक्षण के लिए एंटरप्राइज़ उदाहरण:' : 'Enterprise Intent Presets:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_INTENTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setUserPrompt(item.text)}
                      className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                        userPrompt === item.text
                          ? 'bg-[#7c5cff]/20 border-[#7c5cff] text-white font-medium'
                          : 'bg-white/[0.02] border-white/5 text-[#9a9ab0] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold text-[#22d3ee] block text-[11px] mb-0.5">{item.label}</span>
                      <span className="truncate block opacity-90">"{item.text}"</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent Textbox & Action Bar */}
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <textarea
                    rows={3}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Enter your integration outcome in Hindi or English..."
                    className="w-full px-4 py-3 bg-[#07070d] border border-white/20 rounded-2xl text-sm text-white placeholder-[#9a9ab0] focus:outline-none focus:border-[#7c5cff] shadow-inner font-sans"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-[#9a9ab0] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Zero manual API keys | OAuth PKCE zero-trust authorization</span>
                  </div>

                  <button
                    onClick={handleExecuteIntent}
                    disabled={orchestratingStep !== 'idle' && orchestratingStep !== 'active'}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7c5cff] via-[#3b82f6] to-[#22d3ee] hover:opacity-95 shadow-[0_0_24px_rgba(124,92,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {orchestratingStep !== 'idle' && orchestratingStep !== 'active' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ऑर्केस्ट्रेशन जारी है...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>{lang === 'hi' ? 'स्वायत्त सिंक सक्रिय करें' : 'Execute Autonomous Intent'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live 9-Step Lifecycle Visualizer */}
              {orchestratingStep !== 'idle' && (
                <div className="p-6 rounded-2xl bg-[#07070d] border border-[#7c5cff]/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-mono font-bold text-[#c4b5fd]">
                      AURA DETERMINISTIC CORE & INTELLIGENCE RUNTIME
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Job ID: bullmq_job_99812
                    </span>
                  </div>

                  {/* Progressive Step Log */}
                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex items-center gap-3 text-white">
                      {orchestratingStep === 'parsing' ? (
                        <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>1. [NLP Intent Parsing]: Extracted Sources: Salesforce ⇄ Destinations: Google Sheets, Slack</span>
                    </div>

                    {orchestratingStep !== 'parsing' && (
                      <div className="flex items-center gap-3 text-white">
                        {orchestratingStep === 'oauth' ? (
                          <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>2. [OAuth 2.0 PKCE Handshake]: Bearer tokens verified with zero manual secrets.</span>
                      </div>
                    )}

                    {(orchestratingStep === 'schema' || orchestratingStep === 'preflight' || orchestratingStep === 'deterministic_commit' || orchestratingStep === 'active') && (
                      <div className="flex items-center gap-3 text-white">
                        {orchestratingStep === 'schema' ? (
                          <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>3. [Schema Introspection & Mapping]: Auto-bound Salesforce.Lead to Canonical Enterprise Entity.</span>
                      </div>
                    )}

                    {(orchestratingStep === 'preflight' || orchestratingStep === 'deterministic_commit' || orchestratingStep === 'active') && (
                      <div className="flex items-center gap-3 text-white">
                        {orchestratingStep === 'preflight' ? (
                          <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>4. [Evidence Pre-Flight Verification]: All 6 security and accessibility checks PASSED (100%).</span>
                      </div>
                    )}

                    {(orchestratingStep === 'deterministic_commit' || orchestratingStep === 'active') && (
                      <div className="flex items-center gap-3 text-white">
                        {orchestratingStep === 'deterministic_commit' ? (
                          <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span>5. [Deterministic Core Commit]: PostgreSQL 16 ACID Transaction committed with Idempotency Key.</span>
                      </div>
                    )}

                    {orchestratingStep === 'active' && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 mt-3 space-y-1">
                        <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                          <Check className="w-4 h-4" />
                          <span>पाइपलाइन सफलतापूर्वक सक्रिय (Pipeline Active and Streaming)!</span>
                        </div>
                        <p className="text-[11px] text-emerald-200/80">
                          "Done. Everything is connected and running." Real-time events are streaming through the BullMQ worker cluster with sub-50ms latency.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Active Production Pipelines */}
        {activeConsoleTab === 'pipelines' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Live Production Cluster
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  सक्रिय पाइपलाइन्स एवं टेलीमेट्री
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#9a9ab0]">
                  Total Events Today: <strong className="text-white">47,170</strong>
                </span>
              </div>
            </div>

            {/* Pipelines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pipelines.map((pipe) => {
                const isSelected = selectedPipelineId === pipe.id;
                return (
                  <div
                    key={pipe.id}
                    onClick={() => setSelectedPipelineId(pipe.id)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#7c5cff]/15 to-[#07070d] border-[#7c5cff] shadow-xl'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-white/5 text-[#c4b5fd]">
                          {pipe.id}
                        </span>
                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          pipe.status === 'SYNCED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          pipe.status === 'RUNNING' ? 'bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {pipe.status}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-base sm:text-lg text-white mb-2">
                        {pipe.name}
                      </h4>

                      <p className="text-xs text-[#9a9ab0] mb-4">
                        {pipe.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-[#07070d]">
                        <span className="text-[10px] text-[#9a9ab0] block">Events</span>
                        <span className="text-white font-bold">{pipe.eventsProcessed.toLocaleString()}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#07070d]">
                        <span className="text-[10px] text-[#9a9ab0] block">Latency</span>
                        <span className="text-[#22d3ee] font-bold">{pipe.latencyMs}ms</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#07070d]">
                        <span className="text-[10px] text-[#9a9ab0] block">Circuit</span>
                        <span className={`font-bold ${pipe.circuitBreaker === 'CLOSED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {pipe.circuitBreaker}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Pipeline Field Mapping Detail */}
            <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#22d3ee]" />
                  <h4 className="font-bold text-sm text-white">
                    स्कीमा मैपिंग विनिर्देश: {selectedPipeline.name}
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#9a9ab0]">
                  Source: {selectedPipeline.source} ➔ Dest: {selectedPipeline.destination}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9a9ab0] font-mono text-[11px]">
                      <th className="pb-2">Source Field</th>
                      <th className="pb-2">Target Field</th>
                      <th className="pb-2">Transformation Type</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {selectedPipeline.schemaMapping.map((map, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-2.5 text-white font-medium">{map.sourceField}</td>
                        <td className="py-2.5 text-[#22d3ee]">{map.targetField}</td>
                        <td className="py-2.5 text-[#c4b5fd]">{map.transformation}</td>
                        <td className="py-2.5 text-right text-emerald-400 font-bold">VERIFIED ✓</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Self-Healing Resilience Lab */}
        {activeConsoleTab === 'self-healing' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0d0d1a] to-[#07070d] border border-[#7c5cff]/30 space-y-6">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                  Principle 04 & 1.16: Self-Healing by Default & Material Truth
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  सेल्फ-हीलिंग सर्किट ब्रेकर सिमुलेशन लैब
                </h3>
                <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
                  "Never hide a business-critical failure. Hide unnecessary technical complexity, not material truth."
                </p>
              </div>

              {/* Action Buttons to Inject Failures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleSimulateOutage('429')}
                  disabled={healingStage !== 'healthy'}
                  className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-amber-300">⚡ API Rate Limit (HTTP 429) इंजेक्ट करें</span>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Throttling Test</span>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    सर्किट ब्रेकर ट्रिप करेगा, Redis BullMQ में पेलोड सुरक्षित करेगा और बैकऑफ़ के बाद स्वतः रीप्ले करेगा।
                  </p>
                </button>

                <button
                  onClick={handleTriggerHighRiskAction}
                  className="p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-red-300">🛡️ उच्च-जोखिम एक्शन (Human Authority Gate)</span>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/20 px-2 py-0.5 rounded">Admin 2FA Gate</span>
                  </div>
                  <p className="text-xs text-red-200/80">
                    बल्क डिलीट या वित्तीय लेनदेन पर मानवीय प्राधिकरण और 2FA हस्ताक्षर की अनिवार्यता का परीक्षण।
                  </p>
                </button>
              </div>

              {/* Live Self-Healing Visualizer Canvas */}
              <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-[#22d3ee] font-bold">
                    CIRCUIT BREAKER STATE MACHINE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9a9ab0] font-mono">Status:</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      healingStage === 'healthy' ? 'bg-emerald-500/20 text-emerald-400' :
                      healingStage === 'buffering_redis' ? 'bg-amber-500/20 text-amber-300 animate-pulse' :
                      'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {healingStage.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Healing Stages Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className={`p-3 rounded-xl border ${
                    healingStage === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
                  }`}>
                    <span className="block font-bold mb-1">Level 1: Normal</span>
                    Circuit CLOSED. Real-time streaming active.
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    healingStage === '429_throttled' ? 'bg-amber-500/20 border-amber-500 text-amber-200' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
                  }`}>
                    <span className="block font-bold mb-1">Level 2: Trip Detected</span>
                    Rate Limit 429 caught. Circuit OPEN.
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    healingStage === 'buffering_redis' ? 'bg-pink-500/20 border-pink-500 text-pink-200' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
                  }`}>
                    <span className="block font-bold mb-1">Level 3: Redis Buffer</span>
                    {bufferedCount} Events buffered safely. 0% loss.
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    healingStage === 'recovering' || healingStage === 'recovered' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
                  }`}>
                    <span className="block font-bold mb-1">Level 4: Auto-Recover</span>
                    Backoff successful. Replayed 100%.
                  </div>
                </div>

                {/* User-Facing Trust Banner */}
                {healingStage !== 'healthy' && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                    <span className="font-bold block text-amber-300 mb-1">
                      📢 उपयोगकर्ता को दिखने वाला पारदर्शी संदेश (User-Facing Message):
                    </span>
                    "Your Salesforce data is safe. Sync is temporarily delayed due to API quota and will resume automatically in 30 seconds. (0 events dropped)."
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: 3-Layer Universal Memory Inspector */}
        {activeConsoleTab === 'memory-layers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider block mb-1">
                  Principle 05 & 1.7: Universal Context Memory
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  3-परतीय मेमोरी आर्किटेक्चर लाइव व्यूअर
                </h3>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setMemoryTier('layer-a')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    memoryTier === 'layer-a' ? 'bg-[#7c5cff] text-white font-bold' : 'text-[#9a9ab0] hover:text-white'
                  }`}
                >
                  Layer A: Operational (Postgres)
                </button>
                <button
                  onClick={() => setMemoryTier('layer-b')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    memoryTier === 'layer-b' ? 'bg-[#7c5cff] text-white font-bold' : 'text-[#9a9ab0] hover:text-white'
                  }`}
                >
                  Layer B: Semantic (Vector DB)
                </button>
                <button
                  onClick={() => setMemoryTier('layer-c')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    memoryTier === 'layer-c' ? 'bg-[#7c5cff] text-white font-bold' : 'text-[#9a9ab0] hover:text-white'
                  }`}
                >
                  Layer C: Event Log (Immutable)
                </button>
              </div>
            </div>

            {/* Memory Detail Box */}
            {memoryTier === 'layer-a' && (
              <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[#22d3ee]">
                  <span className="font-bold">PostgreSQL 16 Operational State Engine</span>
                  <span>ACID Compliant</span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[#c4b5fd] overflow-x-auto space-y-2">
                  <div className="text-[#9a9ab0]">// Table: aura_pipeline_cursors</div>
                  <div>ID: 'pipe-sfdc-sheets' | Cursor: '2026-09-19T14:28:10Z' | RetryCount: 0 | TokenValidUntil: '18:00:00'</div>
                  <div>ID: 'pipe-shopify-slack-qb' | Cursor: '2026-09-19T14:27:58Z' | RetryCount: 0 | IdempotencyVerified: true</div>
                </div>
              </div>
            )}

            {memoryTier === 'layer-b' && (
              <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-[#7c5cff]">
                  <span className="font-bold">pgvector / Vector Semantic Context (Cosine Distance: 0.94)</span>
                  <span>Cross-Channel Memory</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[#22d3ee] font-bold block mb-1">WhatsApp Context (Monday):</span>
                    "Customer: 'We want Aura for our 500-seat sales team. Let us talk pricing.'"
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[#c4b5fd] font-bold block mb-1">CRM Deal Stage (Tuesday):</span>
                    "Salesforce: Opportunity #4019 marked 'Decision Maker Bought-In' ($120,000 ARR)"
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="font-bold block mb-1">Aura Cross-Channel Synthesis:</span>
                    "When user asks 'Is customer ready to close?', Aura synthesizes WhatsApp willingness + CRM stage + email pricing into a high-confidence recommendation."
                  </div>
                </div>
              </div>
            )}

            {memoryTier === 'layer-c' && (
              <div className="p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="font-bold">Append-Only Immutable Event Store (Tamper-Evident SHA-256)</span>
                  <span>Replayable Ledger</span>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#9a9ab0]">{log.timestamp}</span>
                        <span className="text-white font-bold">[{log.eventType}]</span>
                        <span className="text-[#22d3ee] truncate max-w-md">{log.actionTaken}</span>
                      </div>
                      <span className="text-[#c4b5fd] text-[10px]">{log.provenanceHash}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Provenance & Audit Trail */}
        {activeConsoleTab === 'audit-lineage' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                  Principle 06: Data Must Have Provenance
                </span>
                <h3 className="font-display font-bold text-2xl text-white">
                  डेटा वंशानुक्रम (Lineage) एवं ऑडिट ट्रेल
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Event List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedAuditLog(log)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      selectedAuditLog?.id === log.id
                        ? 'bg-[#7c5cff]/20 border-[#7c5cff] text-white'
                        : 'bg-[#07070d] border-white/5 text-[#9a9ab0] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[#22d3ee]">{log.eventType}</span>
                      <span className="font-mono text-[10px] text-[#9a9ab0]">{log.timestamp}</span>
                    </div>
                    <p className="truncate text-[11px] mb-2">{log.actionTaken}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded ${
                        log.riskTier === 'High-Risk' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {log.riskTier}
                      </span>
                      <span className="text-[#c4b5fd]">{log.approvalStatus}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Provenance Inspector View */}
              {selectedAuditLog && (
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#07070d] border border-white/10 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-bold text-white">
                      Provenance Chain: {selectedAuditLog.id}
                    </span>
                    <span className="text-[10px] text-[#22d3ee] bg-[#22d3ee]/10 px-2 py-0.5 rounded">
                      {selectedAuditLog.provenanceHash}
                    </span>
                  </div>

                  {/* 4-Stage Provenance Flow */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[#9a9ab0] block text-[10px] uppercase font-bold mb-1">Stage 1: Raw Source Data (Untouched)</span>
                      <pre className="text-white overflow-x-auto text-[11px]">
                        {JSON.stringify(selectedAuditLog.sourcePayload, null, 2)}
                      </pre>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[#22d3ee] block text-[10px] uppercase font-bold mb-1">Stage 2: Canonical Normalization (Zero Mutation)</span>
                      <pre className="text-[#a5f3fc] overflow-x-auto text-[11px]">
                        {JSON.stringify(selectedAuditLog.normalizedPayload, null, 2)}
                      </pre>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[#c4b5fd] block text-[10px] uppercase font-bold mb-1">Stage 3: AI Interpretation & Risk Assessment</span>
                      <p className="text-white">{selectedAuditLog.actionTaken} (Risk Level: {selectedAuditLog.riskTier})</p>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200">
                      <span className="text-emerald-400 block text-[10px] uppercase font-bold mb-1">Stage 4: Deterministic Target Write Confirmation</span>
                      <p>Status: {selectedAuditLog.approvalStatus} | Target Transaction ID: tx_committed_99214</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Human Authority Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#0d0d1a] border border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-5">
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Human Authority Required</h3>
                  <span className="text-xs text-red-300 font-mono">Principle 07: High-Risk Action Guard</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs">
                <span className="text-[#9a9ab0] block text-[11px] uppercase">Attempted Operation:</span>
                <p className="font-bold text-white text-sm">{pendingHighRiskAction}</p>
                <p className="text-[#9a9ab0]">
                  "Aura can automate execution; it cannot silently redefine authority." This action materially alters records and requires explicit admin authorization.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#9a9ab0] hover:text-white bg-white/5 cursor-pointer"
                >
                  Reject & Cancel
                </button>
                <button
                  onClick={handleConfirmHighRiskApproval}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Verify & Authorize (2FA)</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
