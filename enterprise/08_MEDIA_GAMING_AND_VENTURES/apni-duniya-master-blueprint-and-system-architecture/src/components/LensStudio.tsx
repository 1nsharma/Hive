import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  Play, 
  CheckCircle2, 
  UploadCloud, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  AlertTriangle,
  Key,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LensStudioProps {
  activeLanguage: 'en' | 'hi';
}

export const LensStudio: React.FC<LensStudioProps> = ({ activeLanguage }) => {
  const [lensName, setLensName] = useState<string>('Renewable Energy & Climate Claims Lens');
  const [lensSlug, setLensSlug] = useState<string>('climate-energy-verifier');
  const [category, setCategory] = useState<string>('science');
  const [triggerKeywords, setTriggerKeywords] = useState<string>('solar efficiency, carbon neutral, 100% green, net zero, fusion energy');
  const [sourceName, setSourceName] = useState<string>('Intergovernmental Panel on Climate Change (IPCC) AR6');
  const [sourceUrl, setSourceUrl] = useState<string>('https://www.ipcc.ch/report/ar6/wg3/');
  const [logicScript, setLogicScript] = useState<string>(`// Sandboxed QuickJS Context Evaluator
export default function evaluate(contentContext) {
  const text = contentContext.extractedText;
  const mentionsZeroCarbon = /(net zero|carbon neutral|zero emissions)/i.test(text);

  if (!mentionsZeroCarbon) return { match: false };

  return {
    match: true,
    confidence: 0.93,
    pill: "🌿 IPCC Verified Climate Context",
    verdict: "context-needed",
    insights: [
      "Target claims must distinguish between Scope 1 (Direct), Scope 2 (Electricity), and Scope 3 (Supply Chain) emissions.",
      "IPCC AR6 WG3 guidelines mandate verified offset additionality."
    ],
    metrics: [
      { label: "Standard", value: "GHG Protocol", diff: "Scope 1-3" },
      { label: "IPCC Baseline", value: "1.5°C Budget", diff: "Global Target" }
    ]
  };
}`);

  const [testResult, setTestResult] = useState<{
    matched: boolean;
    confidence: number;
    pill: string;
    verdict: string;
  } | null>(null);

  const [published, setPublished] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ npx context-lens create climate-energy-verifier',
    '✓ Scaffolded TypeScript Lens package in ./climate-energy-verifier',
    '✓ Initialized Sandboxed QuickJS Wasm runtime',
    '✓ Loaded IPCC verified dataset cache',
    'Ready for testing.'
  ]);

  const runTestSimulation = () => {
    setTestResult({
      matched: true,
      confidence: 0.93,
      pill: '🌿 IPCC Verified Climate Context',
      verdict: 'context-needed'
    });
    setTerminalOutput(prev => [
      ...prev,
      '$ context-lens test --input="Company announces net zero emissions by 2030 across operations."',
      '→ Evaluating trigger regex: MATCH [net zero]',
      '→ Querying verified IPCC datasource: PASS (Status 200, Hash: 0x9f3a...)',
      '→ Sandbox compliance check: PASS (Zero raw DOM access, 0 leaked tokens)',
      '✓ Test completed in 14ms: Match confidence 0.93'
    ]);
  };

  const handlePublish = () => {
    setPublished(true);
    setTerminalOutput(prev => [
      ...prev,
      '$ context-lens publish --sign=DID:KEY:0x498a72...',
      '→ Compiling Wasm bundle...',
      '→ Running Soul Constitution Linter against 9 Prohibitions: 100% PASS',
      '→ Generating C2PA Cryptographic Signature: VALID',
      '✓ Lens published to Apni Duniya Community Registry as climate-energy-verifier@1.0.0'
    ]);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-sky-950/30 to-stone-900 border border-sky-500/30 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono">
              CREATION LAYER WORKBENCH
            </span>
            <span className="text-stone-400 text-xs font-mono">
              CLI & SANDBOX SDK
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {activeLanguage === 'hi' ? 'लेंस निर्माता स्टूडियो और डेवलपर SDK' : 'Lens Creator Studio & Developer Workbench'}
          </h2>
          <p className="text-stone-300 text-sm">
            Build, test, and publish custom context lenses with sandboxed WebAssembly execution and immutable cryptographic provenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <code className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-sky-300 text-xs font-mono">
            npx context-lens create
          </code>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lens Manifest Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Lens Manifest Configuration</span>
              </h3>
              <span className="text-xs font-mono text-stone-400">manifest.json</span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">
                  Lens Display Name
                </label>
                <input
                  type="text"
                  value={lensName}
                  onChange={(e) => setLensName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    Package Identifier (Slug)
                  </label>
                  <input
                    type="text"
                    value={lensSlug}
                    onChange={(e) => setLensSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-sky-300 font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-stone-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-sky-500"
                  >
                    <option value="science">STEM & Climate</option>
                    <option value="economics">Economics & Finance</option>
                    <option value="fact-check">Fact-Checking</option>
                    <option value="history">Indian History & Culture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">
                  Trigger Keywords / Entity Patterns (Comma separated)
                </label>
                <input
                  type="text"
                  value={triggerKeywords}
                  onChange={(e) => setTriggerKeywords(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Data Source Configuration */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Verified Data Source (Mandatory Provenance)</span>
                </div>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Data Source Name (e.g. IPCC, MoSPI)"
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="Provenance URL"
                  className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Sandboxed Logic Code */}
              <div>
                <label className="text-xs font-mono text-stone-400 block mb-1">
                  Sandboxed Evaluation Script (QuickJS TypeScript)
                </label>
                <textarea
                  value={logicScript}
                  onChange={(e) => setLogicScript(e.target.value)}
                  rows={8}
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-800 text-sky-300 font-mono text-xs focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id="run-lens-test-btn"
                  onClick={runTestSimulation}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Run Sandbox Test</span>
                </button>

                <button
                  id="publish-lens-btn"
                  onClick={handlePublish}
                  disabled={published}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    published
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
                  }`}
                >
                  {published ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Published (Hash: 0x9f3a)</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Sign & Publish Lens</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sandbox Terminal & Live Preview */}
        <div className="lg:col-span-6 space-y-4">
          {/* CLI Terminal Output */}
          <div className="rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden shadow-xl">
            <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Lens Developer Terminal</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">QuickJS Sandbox v2.4</span>
            </div>

            <div className="p-4 space-y-1.5 max-h-64 overflow-y-auto font-mono text-xs text-stone-300 scrollbar-thin scrollbar-thumb-stone-800">
              {terminalOutput.map((line, idx) => (
                <div 
                  key={idx} 
                  className={line.startsWith('$') ? 'text-sky-300 font-bold' : line.startsWith('✓') ? 'text-emerald-400' : 'text-stone-400'}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Test Preview Output */}
          {testResult && (
            <div className="p-5 rounded-2xl bg-stone-900 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="text-xs font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sandbox Test Output Preview</span>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Confidence {(testResult.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    {testResult.pill}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {testResult.verdict}
                  </span>
                </div>

                <div className="text-xs text-stone-300 space-y-1 pt-1">
                  <div>&bull; Verified Data Lineage: <span className="text-white font-medium">{sourceName}</span></div>
                  <div>&bull; Sandbox Isolation: <span className="text-emerald-400">Zero host memory leakage</span></div>
                  <div>&bull; Economic Payout Rule: <span className="text-sky-300">72% Creator Share Active</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
