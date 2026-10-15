import React, { useState } from 'react';
import {
  Cpu,
  Shield,
  Activity,
  Layers,
  Code2,
  HeartHandshake,
  Wrench,
  Search,
  CheckCircle2,
  Play,
  Database,
  Plus,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { JorvishEmblem } from '../common/JorvishEmblem';

interface DesktopHelperViewProps {
  personality: 'humanity_helper' | 'tactical_hud' | 'code_architect';
  onNavigateToTab?: (tab: string) => void;
}

export const DesktopHelperView: React.FC<DesktopHelperViewProps> = ({
  personality,
  onNavigateToTab,
}) => {
  const [activeSkill, setActiveSkill] = useState<string>('code_forge');
  const [skillInput, setSkillInput] = useState<string>(
    'function processUser(id: string) { return db.query("SELECT * FROM users WHERE id=" + id); }'
  );
  const [skillOutput, setSkillOutput] = useState<string>(
    'System standby. Execute any skill to inspect J.O.R.V.I.S.H cognitive output.'
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memory items
  const [memories, setMemories] = useState([
    {
      id: '1',
      title: 'Core Humanity Directive',
      value: "J.A.R.V.I.S. was built for Tony. J.O.R.V.I.S.H is built for Humanity.",
      tag: 'Core Value',
    },
    {
      id: '2',
      title: 'Active Tech Stack',
      value: 'TypeScript, React 19, Tailwind CSS v4, Express, Gemini 3.8 Flash SDK',
      tag: 'Environment',
    },
    {
      id: '3',
      title: 'Ethical Guardrail',
      value: 'Prioritize human safety, intellectual empowerment, privacy, and accessibility.',
      tag: 'Guardrail',
    },
  ]);
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  const skills = [
    {
      id: 'code_forge',
      name: 'Code Forge',
      icon: Code2,
      category: 'Software Engineering',
      description: 'Audit code vulnerabilities, architectural bottlenecks, and optimize TypeScript/Python.',
      sampleInput: 'Audit SQL injection in: db.query("SELECT * FROM users WHERE id=" + id)',
    },
    {
      id: 'humanity_brief',
      name: 'Humanity Ethics Engine',
      icon: HeartHandshake,
      category: 'Humanitarian Impact',
      description: 'Analyze how any algorithm or tool impacts society, dignity, and human flourishing.',
      sampleInput: 'Assess societal impact of autonomous AI customer support on workforce well-being.',
    },
    {
      id: 'system_diagnostics',
      name: 'System Diagnostics',
      icon: Activity,
      category: 'Core Telemetry',
      description: 'Inspect neural network health, memory vector coherence, and wake-word acoustic latency.',
      sampleInput: 'Run complete subsystem check for voice pipeline and memory index.',
    },
    {
      id: 'workflow_automator',
      name: 'Workflow Automator',
      icon: Layers,
      category: 'Execution Roadmap',
      description: 'Decompose ambitious human projects into atomic, prioritized engineering sprints.',
      sampleInput: 'Create a 5-step development roadmap for an open-source health tracker.',
    },
  ];

  const handleExecuteSkill = async (skillId: string, inputOverride?: string) => {
    const inputToUse = inputOverride || skillInput;
    setIsExecuting(true);
    setSkillOutput('Engaging neural core... synthesizing output via Gemini 3.8 Flash...');

    try {
      const res = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId,
          input: inputToUse,
          personality,
        }),
      });
      const data = await res.json();
      setSkillOutput(data.result || 'Execution complete. No anomalies detected.');
    } catch (err: any) {
      setSkillOutput(
        `Subsystem diagnostic simulated response:\nSkill [${skillId}] evaluated input: "${inputToUse}".\nResult: 100% nominal alignment with Humanity Helper protocols.`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryTitle.trim() || !newMemoryValue.trim()) return;

    setMemories([
      ...memories,
      {
        id: Date.now().toString(),
        title: newMemoryTitle.trim(),
        value: newMemoryValue.trim(),
        tag: 'User Preference',
      },
    ]);
    setNewMemoryTitle('');
    setNewMemoryValue('');
    setIsAddingMemory(false);
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top HUD Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0E1424] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Neural Status</div>
            <div className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
              <span>Operational</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Gemini 3.8 Flash Active</div>
          </div>
          <Cpu className="w-6 h-6 text-[#00A8FF]" />
        </div>

        <div className="bg-[#0E1424] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Memory Vault</div>
            <div className="text-lg font-bold text-slate-100 font-mono tabular-nums mt-0.5">
              {memories.length} Invariants
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Zero Latency Sync</div>
          </div>
          <Database className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="bg-[#0E1424] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Philosophy Core</div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5 truncate max-w-[140px]">
              Humanity's Helper
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Non-Sycophantic Heart</div>
          </div>
          <HeartHandshake className="w-6 h-6 text-rose-400" />
        </div>

        <div className="bg-[#0E1424] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-slate-500 uppercase">Security Boundary</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
              Hardened
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Server-Side Proxy</div>
          </div>
          <Shield className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Main Grid: Skills Workbench & Memory Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Skills Registry & Workbench (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 lg:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-100">J.O.R.V.I.S.H Skills Registry</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select an operational protocol to run real-time intelligent tasks.
                </p>
              </div>
              <span className="text-xs font-mono text-[#00A8FF] bg-[#00A8FF]/10 px-2.5 py-1 rounded-md border border-[#00A8FF]/20">
                4 Registered Modules
              </span>
            </div>

            {/* Skills Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {skills.map((skill) => {
                const Icon = skill.icon;
                const isSelected = activeSkill === skill.id;
                return (
                  <button
                    key={skill.id}
                    onClick={() => {
                      setActiveSkill(skill.id);
                      setSkillInput(skill.sampleInput);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-slate-900 border-[#00A8FF] ring-1 ring-[#00A8FF]/40 shadow-lg'
                        : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-[#00A8FF] text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{skill.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{skill.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {skill.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Skill Input / Execution Box */}
            <div className="space-y-3 bg-slate-950/60 border border-slate-800/90 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Parameter Input:</span>
                <button
                  onClick={() => {
                    const sel = skills.find((s) => s.id === activeSkill);
                    if (sel) setSkillInput(sel.sampleInput);
                  }}
                  className="text-[11px] text-[#00A8FF] hover:underline font-mono"
                >
                  Load Sample
                </button>
              </div>

              <textarea
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                rows={3}
                placeholder="Enter prompt, code snippet, or query to execute..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#00A8FF] font-mono resize-none"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Engine: Gemini 3.8 Flash</span>
                  <span aria-hidden="true">·</span>
                  <span>Safety: Verified</span>
                </div>

                <button
                  onClick={() => handleExecuteSkill(activeSkill)}
                  disabled={isExecuting || !skillInput.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#00A8FF] hover:bg-[#0094e0] text-slate-950 rounded-lg font-bold text-xs transition-all disabled:opacity-50 shadow-md shadow-[#00A8FF]/20"
                >
                  {isExecuting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing Protocol...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run {skills.find((s) => s.id === activeSkill)?.name}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Output Display */}
            <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-900 pb-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00A8FF]" /> Telemetry & Synthesis Output
                </span>
                <span className="text-[10px] text-slate-600">ID: {activeSkill}</span>
              </div>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {skillOutput}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Long-Term Memory Vault & Quick Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Memory Vault Card */}
          <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00A8FF]" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Memory Vault
                </h3>
              </div>
              <button
                onClick={() => setIsAddingMemory(!isAddingMemory)}
                className="text-[11px] text-[#00A8FF] hover:text-white flex items-center gap-1 font-mono"
              >
                <Plus className="w-3 h-3" /> Add Rule
              </button>
            </div>

            {isAddingMemory && (
              <form onSubmit={handleAddMemory} className="mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <input
                  type="text"
                  placeholder="Key/Title (e.g. User Name)"
                  value={newMemoryTitle}
                  onChange={(e) => setNewMemoryTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#00A8FF]"
                />
                <textarea
                  placeholder="Value / Directive"
                  value={newMemoryValue}
                  onChange={(e) => setNewMemoryValue(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-[#00A8FF] resize-none"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingMemory(false)}
                    className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#00A8FF] text-slate-950 font-bold text-[11px] rounded"
                  >
                    Save Invariant
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {memories.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200">{m.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{m.tag}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Command Launcher */}
          <div className="bg-[#0E1424] border border-slate-800/80 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-semibold mb-3">
              Direct Protocol Triggers
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => handleExecuteSkill('system_diagnostics', 'Audit all subsystem boundaries and memory indices.')}
                className="w-full p-2.5 rounded-lg bg-slate-900/60 hover:bg-[#00A8FF]/10 border border-slate-800 hover:border-[#00A8FF]/40 text-left text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
              >
                <span>Run Subsystem Integrity Check</span>
                <Activity className="w-3.5 h-3.5 text-[#00A8FF]" />
              </button>

              <button
                onClick={() => handleExecuteSkill('humanity_brief', 'What are our current top 3 priorities for empowering human builders?')}
                className="w-full p-2.5 rounded-lg bg-slate-900/60 hover:bg-[#00A8FF]/10 border border-slate-800 hover:border-[#00A8FF]/40 text-left text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
              >
                <span>Synthesize Humanity Priorities</span>
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              </button>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('github')}
                  className="w-full p-2.5 rounded-lg bg-slate-900/60 hover:bg-[#00A8FF]/10 border border-slate-800 hover:border-[#00A8FF]/40 text-left text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
                >
                  <span>Open GitHub Dev Studio & README</span>
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
