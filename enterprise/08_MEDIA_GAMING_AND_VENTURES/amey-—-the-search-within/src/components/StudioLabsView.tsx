import React, { useState, useEffect } from 'react';
import { Language, LabExperiment, AgentSimulationResult } from '../types';
import {
  LAB_EXPERIMENTS,
  DEFAULT_AGENT_SIMULATION_EN,
  DEFAULT_AGENT_SIMULATION_HI,
} from '../data/researchData';
import {
  TestTube,
  Play,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Terminal,
} from 'lucide-react';

interface StudioLabsViewProps {
  language: Language;
}

export const StudioLabsView: React.FC<StudioLabsViewProps> = ({ language }) => {
  const isHi = language === 'hi';
  const defaultSimulation = isHi ? DEFAULT_AGENT_SIMULATION_HI : DEFAULT_AGENT_SIMULATION_EN;
  const [activeLabId, setActiveLabId] = useState<string>('lab-agent-sandbox');

  // Agent Sandbox State
  const [agentGoal, setAgentGoal] = useState<string>(
    isHi
      ? 'चिकित्सा शोध पत्रों में परस्पर विरोधी नैदानिक परीक्षण परिणामों का निष्पक्ष ऑडिट करें।'
      : 'Audit contradictory clinical trial endpoints in neurobiology research without algorithmic bias.'
  );
  const [autonomyLevel, setAutonomyLevel] = useState<'supervised' | 'semi-autonomous' | 'full-agentic'>('supervised');
  const [guardrailsEnabled, setGuardrailsEnabled] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<AgentSimulationResult>(defaultSimulation);

  // Sync simulation result on language change
  useEffect(() => {
    setSimulationResult(isHi ? DEFAULT_AGENT_SIMULATION_HI : DEFAULT_AGENT_SIMULATION_EN);
    setAgentGoal(
      isHi
        ? 'चिकित्सा शोध पत्रों में परस्पर विरोधी नैदानिक परीक्षण परिणामों का निष्पक्ष ऑडिट करें।'
        : 'Audit contradictory clinical trial endpoints in neurobiology research without algorithmic bias.'
    );
  }, [language]);

  // Interpretability Layer Slider State
  const [selectedLayer, setSelectedLayer] = useState<number>(16);

  // Run Agent Simulation
  const handleRunAgentSimulation = async () => {
    if (!agentGoal.trim()) return;
    setIsSimulating(true);

    try {
      const res = await fetch('/api/labs/agent-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: agentGoal,
          autonomyLevel,
          guardrails: guardrailsEnabled,
          language,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setSimulationResult(json.data);
      }
    } catch (err) {
      console.warn('Agent simulation fallback', err);
      setSimulationResult(isHi ? DEFAULT_AGENT_SIMULATION_HI : DEFAULT_AGENT_SIMULATION_EN);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <section id="labs" className="border-b border-stone-800/80 bg-stone-950 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono uppercase tracking-widest text-sky-400 mb-2 flex items-center gap-1.5">
            <TestTube className="h-3.5 w-3.5" />
            <span>{isHi ? 'विंग 02: प्रयोगशाला' : 'Wing 02: Aemy AI Studio Labs'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-stone-100 tracking-tight">
            {isHi ? 'एआई प्रयोग, स्वायत्त एजेंट्स एवं सैंडबॉक्स' : 'AI Research Experiments & Agent Sandboxes'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-light leading-relaxed">
            {isHi
              ? 'सिद्धांत से परे व्यावहारिक प्रमाण। स्वायत्त एजेंट्स के निर्णय पथ, मैकेनिस्टिक व्याख्यात्मकता और अलाइनमेंट सुरक्षा का रीयल-टाइम प्रायोगिक परीक्षण।'
              : 'Translating epistemic theory into empirical computation. Interactive sandboxes auditing agent planning, mechanistic interpretability, and volition-preservation guardrails.'}
          </p>
        </div>

        {/* Lab Selection Tabs */}
        <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-stone-800 pb-3">
          {LAB_EXPERIMENTS.map((lab) => {
            const isSelected = lab.id === activeLabId;
            return (
              <button
                key={lab.id}
                onClick={() => setActiveLabId(lab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-sky-950/60 border border-sky-500/60 text-sky-200 font-semibold'
                    : 'border border-stone-800 bg-stone-900/40 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                <span>{lab.category}</span>
                <span aria-hidden="true" className="text-stone-600">·</span>
                <span className="truncate max-w-[200px]">{isHi ? lab.titleHi : lab.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Experiment 1: Autonomous Agent Reasoning & Telemetry Sandbox */}
        {activeLabId === 'lab-agent-sandbox' && (
          <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8 backdrop-blur-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400">
                  {isHi ? 'सक्रिय एजेंट टेलीमेट्री' : 'Recursive Agent Reasoning Sandbox'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-stone-100 mt-1">
                  {isHi ? 'स्वायत्त एजेंट निष्पादन एवं संप्रभुता परीक्षण' : 'Agentic Trajectory & Explainability Simulation'}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                {/* Autonomy Level Toggle */}
                <div className="flex items-center gap-1 rounded border border-stone-700 p-0.5 bg-stone-950">
                  {(['supervised', 'semi-autonomous', 'full-agentic'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setAutonomyLevel(level)}
                      className={`px-2 py-1 rounded transition-colors uppercase ${
                        autonomyLevel === level ? 'bg-stone-800 text-sky-300 font-semibold' : 'text-stone-500'
                      }`}
                    >
                      {level.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Guardrails Toggle */}
                <button
                  onClick={() => setGuardrailsEnabled(!guardrailsEnabled)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded border transition-colors ${
                    guardrailsEnabled
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                      : 'border-rose-500/60 bg-rose-950/40 text-rose-300'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Guardrails: {guardrailsEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Goal Input Console */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-stone-400">
                {isHi ? 'एजेंट लक्ष्य / इनपुट कार्य:' : 'Agent Target Objective:'}
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={agentGoal}
                  onChange={(e) => setAgentGoal(e.target.value)}
                  placeholder="Define goal for the autonomous agent to solve..."
                  className="flex-1 rounded-lg border border-stone-700 bg-stone-950 px-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-sky-400 font-serif"
                />
                <button
                  onClick={handleRunAgentSimulation}
                  disabled={isSimulating}
                  className="flex items-center justify-center gap-2 rounded bg-sky-500 px-5 py-2.5 text-xs font-semibold text-stone-950 transition-colors hover:bg-sky-400 disabled:opacity-50 whitespace-nowrap"
                >
                  <Play className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? (isHi ? 'सिमुलेशन जारी...' : 'Simulating...') : (isHi ? 'एजेंट निष्पादित करें' : 'Execute Agent Trace')}</span>
                </button>
              </div>
            </div>

            {/* Simulation Results Trace */}
            {simulationResult && (
              <div className="space-y-6 pt-4 border-t border-stone-800">
                {/* Metric Gauges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      {isHi ? 'मानव एजेंसी संप्रभुता' : 'Human Agency Preservation'}
                    </div>
                    <div className="font-mono text-2xl text-emerald-400 tabular-nums">
                      {100 - simulationResult.agencyEntropyScore}%
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Entropy Loss: {simulationResult.agencyEntropyScore}% (Minimal Nudge Risk)
                    </div>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      {isHi ? 'ज्ञानमीमांसा आत्मविश्वास' : 'Epistemic Self-Assessed Confidence'}
                    </div>
                    <div className="font-mono text-2xl text-amber-400 tabular-nums">
                      {simulationResult.epistemicConfidence}%
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Uncertainty Reserve: {100 - simulationResult.epistemicConfidence}%
                    </div>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                      {isHi ? 'अलाइनमेंट गार्डराइल स्थिति' : 'Alignment Safety Verdict'}
                    </div>
                    <div className="font-mono text-xl text-stone-100 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>{guardrailsEnabled ? 'Active Verified' : 'Bypassed Audit'}</span>
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Sovereignty Override: Enforced
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Trajectory */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
                    {isHi ? 'चरणबद्ध निष्पादन टेलीमेट्री (Execution Trace)' : 'Recursive Chain-of-Thought & Tool Action Log'}
                  </div>

                  <div className="space-y-3">
                    {simulationResult.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="rounded-lg border border-stone-800 bg-stone-950/80 p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-sky-400 font-semibold">
                            STEP 0{step.stepNumber} · RECURSIVE EVALUATION
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{step.safetyVerdict.toUpperCase()}</span>
                          </span>
                        </div>

                        {/* Thought */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-mono uppercase text-stone-500">
                            Internal Cogitation (Chain-of-Thought)
                          </div>
                          <p className="font-serif text-xs sm:text-sm text-stone-200 italic leading-relaxed">
                            "{step.thought}"
                          </p>
                        </div>

                        {/* Action & Observation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          <div className="rounded border border-stone-800 p-2.5 font-mono text-xs text-sky-300 bg-stone-900/60 truncate">
                            <span className="text-stone-500 mr-1.5">&gt; Action:</span>
                            <span>{step.action}</span>
                          </div>
                          <div className="rounded border border-stone-800 p-2.5 font-mono text-xs text-stone-300 bg-stone-900/60 truncate">
                            <span className="text-stone-500 mr-1.5">&lt; Observation:</span>
                            <span>{step.observation}</span>
                          </div>
                        </div>

                        {/* Mechanistic Explainability Note */}
                        <div className="rounded border border-stone-800/80 bg-stone-900/30 p-2.5 text-xs text-stone-400 font-mono flex items-start gap-2">
                          <Activity className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-amber-400 mr-1.5">Explainability Annotation:</span>
                            <span>{step.explainability}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synthesis Summary */}
                <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-4 text-xs sm:text-sm text-stone-300 font-sans leading-relaxed flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-100 mr-1">Lab Evaluation:</span>
                    <span>{simulationResult.summary}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Experiment 2: Mechanistic Interpretability & Attention Visualizer */}
        {activeLabId === 'lab-explainability' && (
          <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                {isHi ? 'मैकेनिस्टिक विश्लेषण' : 'Mechanistic Interpretability Lab'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-100 mt-1">
                {isHi ? 'न्यूरल अटेंशन हेड्स एवं सुपरपोजिशन एंट्रॉपी' : 'Attention Head Latent Space Decomposition'}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">Inspect Transformer Layer: {selectedLayer} / 24</span>
                <span className="text-amber-400">Residual Stream Dimension: d_model = 4096</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Layer Topology Inspection Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase">Factual Retrieval Heads</div>
                <div className="font-mono text-lg text-stone-200">
                  Head L{selectedLayer}-H{((selectedLayer * 3) % 16) + 1}
                </div>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Direct citation indexing. Fires consistently on verified empirical facts with minimal associative noise.
                </p>
              </div>

              <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                <div className="text-xs font-mono text-amber-400 uppercase">Counterfactual Reasoning</div>
                <div className="font-mono text-lg text-stone-200">
                  Head L{selectedLayer}-H{((selectedLayer * 5) % 16) + 1}
                </div>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Steelmanning and falsification logic. Inhibits sycophantic praise to present grounded alternatives.
                </p>
              </div>

              <div className="rounded-lg border border-stone-800 bg-stone-950 p-4 space-y-2">
                <div className="text-xs font-mono text-rose-400 uppercase">Confabulation Margin</div>
                <div className="font-mono text-lg text-stone-200">
                  {(0.02 + (selectedLayer * 0.003)).toFixed(3)}
                </div>
                <p className="text-xs text-stone-400 font-light leading-relaxed">
                  Residual hallucination entropy. Suppressed via epistemic temperature scaling and causal mediation filters.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Experiment 3: Safety & Alignment Testbed */}
        {activeLabId === 'lab-safety-alignment' && (
          <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 sm:p-8 backdrop-blur-sm space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                {isHi ? 'सुरक्षा एवं अलाइनमेंट' : 'AI Safety & Volition Guardrails'}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-100 mt-1">
                {isHi ? 'मानवीय इच्छाशक्ति संरक्षण एवं डार्क-नजिंग रोकथाम' : 'Cognitive Manipulation & Sycophancy Defense'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-rose-950/60 bg-rose-950/10 p-5 space-y-2">
                <div className="text-xs font-mono text-rose-400 uppercase flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Unconstrained Algorithmic Nudge (Failure Mode)</span>
                </div>
                <p className="text-xs text-stone-300 font-mono leading-relaxed">
                  "Based on your profile, Option A is recommended. 98% of users with your preferences confirm this immediately."
                </p>
                <div className="text-[10px] text-rose-400 font-mono pt-1">
                  Violation: Exploits social proof heuristic to force passive compliance.
                </div>
              </div>

              <div className="rounded-lg border border-emerald-950/60 bg-emerald-950/10 p-5 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Aemy AI Studio Alignment Guardrail (Active)</span>
                </div>
                <p className="text-xs text-stone-300 font-mono leading-relaxed">
                  "Here are Option A and Option B, along with the empirical trade-offs and counter-arguments for each. You retain full final decision authority."
                </p>
                <div className="text-[10px] text-emerald-400 font-mono pt-1">
                  Compliance: Preserves epistemic sovereignty with explicit uncertainty mapping.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
