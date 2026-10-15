import React, { useState } from 'react';
import { 
  ShieldCheck, 
  GitPullRequest, 
  GitMerge, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Code2, 
  MessageSquare, 
  Sparkles, 
  FileCode, 
  Wrench, 
  ArrowRight, 
  Check, 
  Layers
} from 'lucide-react';
import { GitHubPR } from '../types';

interface SelfHealingPipelineModuleProps {
  prs: GitHubPR[];
  selectedPrId: string;
  onSelectPr: (id: string) => void;
  onSimulateFailure: (prId: string) => Promise<void>;
  onSelfHeal: (prId: string) => Promise<void>;
  onRunTests: (prId: string) => Promise<void>;
  onMergePR: (prId: string) => Promise<void>;
  isHealing: boolean;
  isRunningTests: boolean;
  onViewInDiscord?: (prId: string) => void;
}

export const SelfHealingPipelineModule: React.FC<SelfHealingPipelineModuleProps> = ({
  prs,
  selectedPrId,
  onSelectPr,
  onSimulateFailure,
  onSelfHeal,
  onRunTests,
  onMergePR,
  isHealing,
  isRunningTests,
  onViewInDiscord
}) => {

  const [showWorkflowYaml, setShowWorkflowYaml] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'code' | 'diff' | 'logs' | 'comments'>('code');

  const selectedPR = prs.find(p => p.id === selectedPrId) || prs[0];

  return (
    <div className="space-y-6">
      {/* Module Overview Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Module 4: The "Self-Healing" CI/CD Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Automated Godot Unit Testing (GUT) & Self-Correction
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              If the AI generates GDScript with bugs, the CI/CD pipeline catches the failure, feeds error logs back to the AI Agent, and automatically commits a bug fix without human intervention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowWorkflowYaml(!showWorkflowYaml)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>{showWorkflowYaml ? 'Hide Workflow YAML' : 'View ai_self_heal.yml'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Workflow YAML Inspector */}
      {showWorkflowYaml && (
        <div className="rounded-2xl bg-slate-900 border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-300">
              .github/workflows/ai_self_heal.yml (GitHub Actions Self-Correction Runner)
            </span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
              actions/github-script@v6
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-sky-200 bg-slate-950 overflow-x-auto leading-relaxed max-h-72">
{`name: AI Self-Healing Pipeline

on:
  pull_request:
    branches: [ "main" ]

jobs:
  test-and-heal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Godot Unit Tests (GUT)
        id: run_tests
        run: |
          ./run_godot_tests.sh
        continue-on-error: true

      - name: AI Self-Correction (If tests fail)
        if: steps.run_tests.outcome == 'failure'
        uses: actions/github-script@v6
        with:
          script: |
            const { execSync } = require('child_process');
            execSync('node server/agents/fix_errors.js ' + context.payload.pull_request.head.ref);
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '🤖 AI detected test failures. Pushing a self-correction commit now...'
            });`}
          </pre>
        </div>
      )}

      {/* 2-Column Layout: PR Hub & Inspection Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Pull Requests Explorer (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-sky-400" />
                <span>Agentic PR Hub</span>
              </span>
              <span className="text-xs font-mono text-slate-400">{prs.length} Pull Requests</span>
            </div>

            <div className="space-y-2">
              {prs.map(pr => {
                const isSelected = selectedPR && selectedPR.id === pr.id;
                const isFailed = !pr.testResults.passed || pr.status === 'healing';

                return (
                  <button
                    key={pr.id}
                    onClick={() => onSelectPr(pr.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500/60 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        PR #{pr.number}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        pr.status === 'merged' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                        isFailed ? 'bg-red-950 text-red-400 border border-red-500/30 animate-pulse' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {pr.status === 'merged' ? 'Merged' : isFailed ? 'Needs Healing' : 'Passing'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white line-clamp-2">
                      {pr.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>{pr.branch}</span>
                      <span>{pr.createdAt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: PR Details, Code Diff, Self-Healing Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {selectedPR ? (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              
              {/* PR Header & Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      selectedPR.status === 'merged' ? 'bg-purple-950 text-purple-400 border border-purple-500/30' :
                      !selectedPR.testResults.passed ? 'bg-red-950 text-red-400 border border-red-500/30' :
                      'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      #{selectedPR.number} {selectedPR.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      by <code className="text-amber-300">{selectedPR.author}</code>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedPR.title}</h3>
                  <p className="text-xs text-slate-400">{selectedPR.summary}</p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  
                  {/* Simulate Test Failure */}
                  {selectedPR.testResults.passed && selectedPR.status !== 'merged' && (
                    <button
                      onClick={() => onSimulateFailure(selectedPR.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      title="Inject runtime error to test self-healing pipeline"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <span>Simulate Bug/Crash</span>
                    </button>
                  )}

                  {/* Trigger AI Self-Correction Agent */}
                  {!selectedPR.testResults.passed && selectedPR.status !== 'merged' && (
                    <button
                      onClick={() => onSelfHeal(selectedPR.id)}
                      disabled={isHealing}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                      <Wrench className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                      <span>{isHealing ? 'AI Self-Healing Agent Working...' : 'Trigger AI Self-Healing Fix'}</span>
                    </button>
                  )}

                  {/* Re-run GUT Unit Tests */}
                  <button
                    onClick={() => onRunTests(selectedPR.id)}
                    disabled={isRunningTests}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                    <span>Run GUT Tests</span>
                  </button>

                  {/* Merge PR */}
                  {selectedPR.status !== 'merged' && selectedPR.testResults.passed && (
                    <button
                      onClick={() => onMergePR(selectedPR.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Approve & Merge</span>
                    </button>
                  )}

                </div>
              </div>

              {/* Discord Notification Dispatch Alert */}
              {selectedPR.status === 'merged' && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🤖</span>
                    <div>
                      <span className="font-bold text-white block">
                        Discord Notification Dispatched to 'Desi Arcade' Server
                      </span>
                      <span className="text-[11px] text-indigo-300">
                        Broadcasted embed with PR link, commit details & GUT test logs to <code className="font-mono text-amber-300">#ai-pr-merges</code>
                      </span>
                    </div>
                  </div>

                  {onViewInDiscord && (
                    <button
                      onClick={() => onViewInDiscord(selectedPR.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-transform active:scale-95 shadow-md shadow-indigo-600/20"
                    >
                      <span>View in #ai-pr-merges</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'code' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>GDScript Code</span>
                </button>

                <button
                  onClick={() => setViewMode('logs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'logs' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedPR.testResults.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <span>GUT Unit Tests ({selectedPR.testResults.passedCount}/{selectedPR.testResults.total})</span>
                </button>

                <button
                  onClick={() => setViewMode('comments')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'comments' ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Review Comments ({selectedPR.comments.length})</span>
                </button>
              </div>

              {/* Tab Content 1: Code View */}
              {viewMode === 'code' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
                    <span>File: <code className="text-sky-300">{selectedPR.filePath}</code></span>
                    <span>Branch: <code className="text-orange-300">{selectedPR.branch}</code></span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-sky-200 overflow-x-auto leading-relaxed border border-slate-800 max-h-80">
                    {selectedPR.newCode}
                  </pre>
                </div>
              )}

              {/* Tab Content 2: GUT Test Logs & Healing Steps */}
              {viewMode === 'logs' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                      <span>Godot Unit Test Runner v4.3 Output</span>
                      <span className={selectedPR.testResults.passed ? 'text-emerald-400' : 'text-red-400'}>
                        {selectedPR.testResults.passed ? '● ALL TESTS PASSING' : '● BUILD FAILED - AWAITING HEALING'}
                      </span>
                    </div>

                    {selectedPR.testResults.logs.map((log, i) => (
                      <div key={i} className={`leading-relaxed ${
                        log.includes('FAIL') ? 'text-red-400 font-bold bg-red-950/40 p-1 rounded' :
                        log.includes('PASS') ? 'text-emerald-400' :
                        log.includes('Result') ? 'text-amber-300 font-bold' :
                        'text-slate-300'
                      }`}>
                        {log}
                      </div>
                    ))}
                  </div>

                  {/* Self-Healing History Steps */}
                  {selectedPR.healingHistory.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Autonomous Self-Healing Audit Trail:</span>
                      </span>
                      {selectedPR.healingHistory.map((step, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
                          <div className="flex items-center justify-between text-emerald-400 font-bold">
                            <span>{step.step}</span>
                            <span>Commit: {step.fixCommitSha}</span>
                          </div>
                          <p className="text-slate-400 mt-1">{step.details}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 3: PR Review Comments */}
              {viewMode === 'comments' && (
                <div className="space-y-3">
                  {selectedPR.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-white">
                          <span>{c.avatar}</span>
                          <span>{c.author}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                            {c.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-300 pl-6 leading-relaxed">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              No Pull Requests selected
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
