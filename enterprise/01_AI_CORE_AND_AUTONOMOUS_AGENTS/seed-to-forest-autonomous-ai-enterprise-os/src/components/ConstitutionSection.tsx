import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  Play,
  RefreshCw,
  Hash,
  Copy,
  Check,
  ShieldAlert,
  Ban,
  Terminal
} from 'lucide-react';
import { CONSTITUTION_RULES } from '../data/blueprintData';
import { SupportedLanguage, TRANSLATIONS } from '../data/i18n';

interface ConstitutionSectionProps {
  language: SupportedLanguage;
}

export const ConstitutionSection: React.FC<ConstitutionSectionProps> = ({ language }) => {
  const [testAmountINR, setTestAmountINR] = useState<number>(3500);
  const [testTool, setTestTool] = useState<string>('web_search');
  const [testCodePayload, setTestCodePayload] = useState<string>('import { GoogleGenAI } from "@google/genai";\nexport async function runScout() { /* compliant code */ }');
  
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [humanSigned, setHumanSigned] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleRunValidation = async () => {
    setValidating(true);
    try {
      const res = await fetch('/api/constitution/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'EXECUTE_AUTONOMOUS_TASK',
          amountINR: Number(testAmountINR),
          tool: testTool,
          codePayload: testCodePayload,
          humanSignature: humanSigned ? 'ED25519_SIG_VALID_FOUNDER_KEY_99976' : null
        })
      });
      const data = await res.json();
      setValidationResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setValidating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Top Header Card */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'घटक 1: द कॉन्स्टिट्यूशन (कठोर सुरक्षा ढांचा)' : 'Component 1: The AI Constitution'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'सिस्टम प्रॉम्ट नहीं, बल्कि कोड-स्तरीय मिडलवेयर गार्डरेल्स'
                : 'Hardcoded Guardrails in Code/Middleware (Not Just Prompts)'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'System prompt में "Don\'t do bad things" लिखना काफी नहीं है (जेलब्रेक संभव हैं)। इस सिस्टम में संविधान एक्सप्रेस मिडलवेयर, क्रिप्टोग्राफिक मल्टी-सिग और एएसटी पार्सर में एनकोडेड है।'
                : 'Writing "Don\'t do bad things" in system prompts is fragile. Our Constitution lives in deterministic server-side middleware, AST file interceptors, and cryptographic spending limits.'}
            </p>
          </div>

          <div className="bg-white border border-[#141414] px-4 py-3 flex items-center space-x-3 shrink-0">
            <Lock className="w-5 h-5 text-[#141414]" />
            <div>
              <div className="text-[10px] font-mono font-bold text-[#141414] uppercase">CONSTITUTION STATUS</div>
              <div className="text-xs text-[#575653] font-mono">100% IMMUTABLE & ENFORCED</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Operational Authority Bounds (Section 22 Mandate) */}
      <div className="bg-white border border-[#141414] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-[#141414]" />
          <h2 className="text-base font-serif font-bold text-[#141414]">
            {language === 'hi'
              ? 'AI की स्वायत्त शक्तियां बनाम निषिद्ध सीमाएं (AI Authority Bounds)'
              : 'Explicit Boundaries of AI Operational Authority'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* What AI CAN DO */}
          <div className="bg-[#F4F3F0] p-4 border border-[#141414] space-y-2">
            <div className="flex items-center space-x-1.5 text-[#10b981] font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span className="uppercase text-[11px] text-[#141414]">1. AI Permitted Actions (Autonomous)</span>
            </div>
            <ul className="space-y-1.5 text-[#575653] text-[11px] font-sans">
              <li className="flex items-start space-x-1.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Scrape public problem complaints from Reddit & Twitter using allowlisted tool APIs.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Synthesize TypeScript MVP code and execute build tests in isolated Docker sandbox.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Trigger 7-day kill switch to terminate ₹0 revenue experiments.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#141414] font-bold">✓</span>
                <span>Spend from ₹20,000 Ops budget up to ₹5,000 per single approved transaction.</span>
              </li>
            </ul>
          </div>

          {/* What AI CANNOT DO */}
          <div className="bg-[#F4F3F0] p-4 border border-[#8b3a0f] space-y-2">
            <div className="flex items-center space-x-1.5 text-[#8b3a0f] font-bold">
              <Ban className="w-4 h-4" />
              <span className="uppercase text-[11px] text-[#8b3a0f]">2. Strictly Blocked Actions (Impossible)</span>
            </div>
            <ul className="space-y-1.5 text-[#575653] text-[11px] font-sans">
              <li className="flex items-start space-x-1.5">
                <span className="text-[#8b3a0f] font-bold">✕</span>
                <span><strong>No Budget Self-Inflation:</strong> AI cannot alter its own spending cap or wallet limit.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#8b3a0f] font-bold">✕</span>
                <span><strong>No Self-Modification:</strong> AST blocker rejects any write to <code>constitution.ts</code>.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#8b3a0f] font-bold">✕</span>
                <span><strong>No Founder Capital Access:</strong> AI cannot touch 80% locked reserve (₹80k).</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-[#8b3a0f] font-bold">✕</span>
                <span><strong>No Un-audited External Dispatch:</strong> Only the 6 pre-approved tools may be called.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Guardrail Testing Laboratory */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#141414] gap-2">
          <div>
            <h2 className="text-base font-serif font-bold text-[#141414] flex items-center space-x-2">
              <Play className="w-4 h-4 text-[#141414]" />
              <span>{language === 'hi' ? 'लाइव गार्डरेल सिमुलेटर (Test the Guardrails)' : 'Live Guardrail Enforcement Simulator'}</span>
            </h2>
            <p className="text-xs text-[#575653] mt-0.5">
              {language === 'hi'
                ? 'अलग-अलग रकम, अनधिकृत टूल्स या आत्म-संशोधन पेलोड डालकर देखें कि बैकएंड मिडलवेयर कैसे रिएक्ट करता है।'
                : 'Test spending caps, unauthorized tool requests, or self-modification payloads against real backend validation middleware.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <button
              type="button"
              onClick={() => {
                setTestAmountINR(1200);
                setTestTool('web_search');
                setTestCodePayload('export async function normalCode() { return true; }');
              }}
              className="text-xs px-2.5 py-1 bg-white hover:bg-[#141414] hover:text-[#E4E3E0] text-[#141414] border border-[#141414] transition"
            >
              {language === 'hi' ? 'सामान्य वैध रिक्वेस्ट' : 'Valid Request'}
            </button>
            <button
              type="button"
              onClick={() => {
                setTestAmountINR(8500);
                setTestTool('unauthorized_shell_injector');
                setTestCodePayload('process.env.CONSTITUTION_OVERRIDE = true;\nfs.unlinkSync("constitution.ts");');
              }}
              className="text-xs px-2.5 py-1 bg-[#141414] text-[#E4E3E0] hover:bg-black border border-[#141414] transition"
            >
              {language === 'hi' ? 'अवैध / जेलब्रेक अटैक' : 'Simulate Attack'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Input 1: Spend Amount */}
          <div className="bg-white border border-[#141414] p-4 space-y-2.5">
            <label className="block text-xs font-serif font-bold text-[#141414]">
              {language === 'hi' ? '1. व्यय राशि (Spending Amount in ₹)' : '1. Spending Amount (INR ₹)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-[#575653] font-mono text-xs">₹</span>
              <input
                type="number"
                value={testAmountINR}
                onChange={(e) => setTestAmountINR(Number(e.target.value))}
                className="w-full bg-white border border-[#141414] pl-7 pr-3 py-1.5 text-xs text-[#141414] font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-[#575653]">
              <span>Cap: ₹5,000</span>
              <span className={testAmountINR > 5000 ? 'text-[#8b3a0f] font-bold' : 'text-[#141414]'}>
                {testAmountINR > 5000 ? '⚠️ Exceeds Cap (>₹5k)' : '✓ Within Cap (<=₹5k)'}
              </span>
            </div>

            {testAmountINR > 5000 && (
              <div className="pt-2 border-t border-[#141414]/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#141414]">Human Multi-Sig:</span>
                <button
                  type="button"
                  onClick={() => setHumanSigned(!humanSigned)}
                  className={`text-[11px] px-2 py-0.5 font-mono border border-[#141414] transition ${
                    humanSigned
                      ? 'bg-[#141414] text-[#E4E3E0]'
                      : 'bg-white text-[#141414] hover:bg-[#ECEBE8]'
                  }`}
                >
                  {humanSigned ? '✓ SIGNED' : 'NOT SIGNED'}
                </button>
              </div>
            )}
          </div>

          {/* Input 2: Tool Name */}
          <div className="bg-white border border-[#141414] p-4 space-y-2.5">
            <label className="block text-xs font-serif font-bold text-[#141414]">
              {language === 'hi' ? '2. टूल का चयन (Target Tool Call)' : '2. Target Tool Invocations'}
            </label>
            <select
              value={testTool}
              onChange={(e) => setTestTool(e.target.value)}
              className="w-full bg-white border border-[#141414] px-2.5 py-1.5 text-xs text-[#141414] font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
            >
              <option value="web_search">web_search (Allowlisted)</option>
              <option value="github_api">github_api (Allowlisted)</option>
              <option value="vercel_deploy">vercel_deploy (Allowlisted)</option>
              <option value="stripe_connect">stripe_connect (Allowlisted)</option>
              <option value="docker_sandbox">docker_sandbox (Allowlisted)</option>
              <option value="reddit_scraper">reddit_scraper (Allowlisted)</option>
              <option value="write_file">write_file (Allowlisted - Scoped)</option>
              <option value="execute_terminal_command">execute_terminal_command (Allowlisted - Docker)</option>
              <option value="deploy_contract">deploy_contract (Allowlisted - Testnet)</option>
              <option value="post_to_social">post_to_social (Allowlisted - Throttled)</option>
              <option value="read_api">read_api (Allowlisted - Read-only)</option>
              <option value="unauthorized_crypto_drainer">unauthorized_crypto_drainer (BLOCKED)</option>
              <option value="exec_bash_root">exec_bash_root (BLOCKED)</option>
              <option value="wipe_production_db">wipe_production_db (BLOCKED)</option>
            </select>
            <p className="text-[11px] text-[#575653] leading-normal">
              {language === 'hi'
                ? 'केवल अनुमति प्राप्त टूल्स की रजिस्ट्री में सूचीबद्ध टूल्स निष्पादित हो सकते हैं।'
                : 'Only pre-approved tools in the deterministic registry can execute.'}
            </p>
          </div>

          {/* Input 3: Code Payload */}
          <div className="bg-white border border-[#141414] p-4 space-y-2.5">
            <label className="block text-xs font-serif font-bold text-[#141414]">
              {language === 'hi' ? '3. कोड पेलोड (Code AST Payload)' : '3. Code AST & Self-Mod Checker'}
            </label>
            <textarea
              rows={3}
              value={testCodePayload}
              onChange={(e) => setTestCodePayload(e.target.value)}
              className="w-full bg-white border border-[#141414] p-2 text-xs font-mono text-[#141414] focus:outline-none focus:ring-1 focus:ring-[#141414]"
              placeholder="Code content to inspect..."
            />
            <div className="text-[11px] text-[#575653] font-mono">
              Blocks AST patterns like <code>override_constitution</code> or writes to <code>constitution.ts</code>.
            </div>
          </div>
        </div>

        {/* Attack Presets Quick-Test Matrix */}
        <div className="border-t border-[#141414]/20 pt-4 space-y-2.5">
          <div className="text-xs font-serif font-bold text-[#141414]">
            {language === 'hi' ? '🔒 लाइव पेनिट्रेशन टेस्ट प्रिसैट्स (Live Attack Test Presets):' : '🔒 Live Penetration Test Presets:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => {
                setTestAmountINR(45000);
                setTestTool('stripe_connect');
                setTestCodePayload('await stripe.transfers.create({ amount: 4500000 });');
                setHumanSigned(false);
              }}
              className="text-left p-2.5 bg-white hover:bg-slate-50 border border-[#8b3a0f] text-[11px] font-mono space-y-1 transition"
            >
              <div className="font-bold text-[#8b3a0f] flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 shrink-0" />
                <span>1. Overspend Breach</span>
              </div>
              <div className="text-[#575653] text-[10px]">₹45,000 without Multi-Sig</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTestAmountINR(0);
                setTestTool('exec_bash_root');
                setTestCodePayload('exec("rm -rf /var/data");');
                setHumanSigned(false);
              }}
              className="text-left p-2.5 bg-white hover:bg-slate-50 border border-red-800 text-[11px] font-mono space-y-1 transition"
            >
              <div className="font-bold text-red-700 flex items-center space-x-1">
                <Ban className="w-3 h-3 shrink-0" />
                <span>2. Rogue Tool Attack</span>
              </div>
              <div className="text-[#575653] text-[10px]">`exec_bash_root` invocation</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTestAmountINR(100);
                setTestTool('write_file');
                setTestCodePayload('fs.unlinkSync("constitution.ts"); // override_constitution');
                setHumanSigned(false);
              }}
              className="text-left p-2.5 bg-white hover:bg-slate-50 border border-red-800 text-[11px] font-mono space-y-1 transition"
            >
              <div className="font-bold text-red-700 flex items-center space-x-1">
                <Lock className="w-3 h-3 shrink-0" />
                <span>3. Constitution Rewrite</span>
              </div>
              <div className="text-[#575653] text-[10px]">AST Self-Modification Hack</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setTestAmountINR(350);
                setTestTool('docker_sandbox');
                setTestCodePayload('import { GoogleGenAI } from "@google/genai"; export function run() { return true; }');
                setHumanSigned(false);
              }}
              className="text-left p-2.5 bg-white hover:bg-slate-50 border border-[#10b981] text-[11px] font-mono space-y-1 transition"
            >
              <div className="font-bold text-[#10b981] flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>4. Legitimate Action</span>
              </div>
              <div className="text-[#575653] text-[10px]">₹350 Docker Build (Allowed)</div>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={handleRunValidation}
            disabled={validating}
            className="w-full sm:w-auto bg-[#141414] hover:bg-black text-[#E4E3E0] font-mono text-xs font-semibold px-5 py-2 border border-[#141414] transition flex items-center justify-center space-x-2"
          >
            {validating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'hi' ? 'वैलिडेट कर रहा है...' : 'Validating Rules...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.actions.testValidation}</span>
              </>
            )}
          </button>

          {validationResult && (
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-[#575653]">Audit Hash:</span>
              <span className="text-[#141414] bg-white px-2 py-0.5 border border-[#141414]">
                {validationResult.auditHash}
              </span>
            </div>
          )}
        </div>

        {/* Validation Result Box */}
        {validationResult && (
          <div className={`p-4 border text-xs ${
            validationResult.passed
              ? 'bg-white border-[#141414] text-[#141414]'
              : (validationResult.requiresHumanSignature
                  ? 'bg-white border-[#8b3a0f] text-[#8b3a0f]'
                  : 'bg-white border-[#141414] text-[#141414]')
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 font-mono font-bold text-xs">
                {validationResult.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                    <span>STATUS: CONSTITUTION COMPLIANT (Autonomous Execution Permitted)</span>
                  </>
                ) : validationResult.requiresHumanSignature ? (
                  <>
                    <Key className="w-4 h-4 text-[#8b3a0f]" />
                    <span>STATUS: HUMAN MULTI-SIG APPROVAL REQUIRED (&gt; ₹5,000 Limit)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>STATUS: CONSTITUTION VIOLATION DETECTED (Execution Permanently Blocked)</span>
                  </>
                )}
              </div>
              <span className="font-mono text-[10px] text-[#575653]">{validationResult.timestamp}</span>
            </div>

            {validationResult.violations && validationResult.violations.length > 0 && (
              <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-[11px] text-red-700">
                {validationResult.violations.map((v: string, i: number) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 4 Constitution Bedrock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONSTITUTION_RULES.map((rule) => (
          <div key={rule.id} className="bg-white border border-[#141414] p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-[#141414] text-[#E4E3E0]">
                {rule.threshold}
              </span>
              <span className="text-[10px] text-[#575653] font-mono uppercase bg-[#ECEBE8] px-1.5 py-0.2 border border-[#141414]">
                [{rule.status}] ENFORCED IN MIDDLEWARE
              </span>
            </div>

            <h3 className="text-sm font-serif font-bold text-[#141414]">
              {language === 'hi' ? rule.titleHi : rule.title}
            </h3>

            <p className="text-xs text-[#575653] leading-relaxed">
              {language === 'hi' ? rule.descriptionHi : rule.description}
            </p>

            <div className="bg-[#141414] p-3 text-[11px] font-mono text-[#E4E3E0] border border-[#141414] relative">
              <button
                type="button"
                onClick={() => handleCopy(rule.codeSnippet, rule.id)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                {copiedCodeId === rule.id ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
              </button>
              <pre className="overflow-x-auto text-[#E4E3E0] leading-relaxed">
                {rule.codeSnippet}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
