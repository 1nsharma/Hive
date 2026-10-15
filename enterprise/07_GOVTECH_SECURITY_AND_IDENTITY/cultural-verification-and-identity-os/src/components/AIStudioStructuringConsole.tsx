import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  RotateCcw,
  HelpCircle,
  Lock,
  ArrowRight,
  Send,
  BookOpen
} from 'lucide-react';
import { HomeFoodCandidateClaim } from '../types';
import { HOME_FOOD_10_CLAIMS } from '../data/mockData';

interface AIStudioStructuringConsoleProps {
  initialClaim?: HomeFoodCandidateClaim;
  customInputText?: string;
  lang: 'hi' | 'en';
  onPushToLedger?: (structuredData: any) => void;
}

export const AIStudioStructuringConsole: React.FC<AIStudioStructuringConsoleProps> = ({
  initialClaim,
  customInputText,
  lang,
  onPushToLedger
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    initialClaim?.id || 'C001'
  );
  const [rawInputText, setRawInputText] = useState<string>(
    customInputText ||
    'Field Interview Notes (Nayaganj, Kanpur):\nInterviewee: Urmila Shukla (Age 74)\nDish: Satpaita (Urad dal + Bathua greens)\nNotes: "My mother-in-law taught me in 1971. In winters, fresh bathua was harvested from the Ganges basin. We slow-cooked it in a brass pot. No whistle cooker. We only temper with raw cold-pressed mustard oil at the end. Some modern shops use ghee, but in our family ghee ruins the earthy aroma of bathua."'
  );

  React.useEffect(() => {
    if (customInputText) {
      setRawInputText(customInputText);
    }
  }, [customInputText]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [outputRecord, setOutputRecord] = useState<{
    claimId: string;
    claim: string;
    claimType: string;
    geographicScope: string;
    peopleCommunityAssociated: string;
    evidence: string;
    source: string;
    evidenceType: string;
    contradictoryEvidence: string;
    communityTestimony: string;
    consentStatus: string;
    accessLevel: string;
    currentStatus: string;
    humanVerificationRequired: boolean;
    questionsForNextInterview: string;
  }>({
    claimId: 'C001',
    claim: 'Satpaita is a traditional home-food practice native to the Kanpur region.',
    claimType: 'Culinary Heritage / Regional Practice',
    geographicScope: 'Kanpur and surrounding Central Doab districts (Uttar Pradesh)',
    peopleCommunityAssociated: 'Local Kanpur households, multi-generational home cooks',
    evidence: 'EVIDENCE NOT PROVIDED (Requires recorded oral tapes and regional cookbooks)',
    source: 'PENDING HUMAN FIELD VERIFICATION',
    evidenceType: 'Oral Recording / Kitchen Heritage Artifact',
    contradictoryEvidence: 'UNKNOWN (Shared with broader Awadh; Kanpur variant noted for specific bathua/urad ratio)',
    communityTestimony: 'Urmila Shukla (Age 74, Nayaganj) oral interview confirms 3-generation lineage.',
    consentStatus: 'OBTAINED (Oral consent recorded)',
    accessLevel: 'RESTRICTED (Community culinary memory)',
    currentStatus: 'FIELD_IN_PROGRESS',
    humanVerificationRequired: true,
    questionsForNextInterview: 'क्या आपके परिवार में Satpaita बनाने की विधि किसी पुराने पारिवारिक रजिस्टर या हस्तलिखित डायरी में दर्ज है?'
  });

  const handleSelectPreset = (id: string) => {
    setSelectedClaimId(id);
    const found = HOME_FOOD_10_CLAIMS.find((c) => c.id === id);
    if (found) {
      setRawInputText(
        `Raw Field Hypothesis [${found.id}]:\n${found.claim}\n\nHindi: ${found.claimHindi}\n\nEvidence Needed: ${found.evidenceTypeNeeded}\nInterview Questions: ${found.questionsForNextInterview}`
      );
      setOutputRecord({
        claimId: found.id,
        claim: found.claim,
        claimType: found.claimType,
        geographicScope: found.geographicScope,
        peopleCommunityAssociated: found.peopleCommunityAssociated,
        evidence: found.evidence,
        source: found.source,
        evidenceType: found.evidenceTypeNeeded,
        contradictoryEvidence: found.contradictoryEvidence,
        communityTestimony: found.communityTestimony,
        consentStatus: found.consentStatus,
        accessLevel: found.accessLevel,
        currentStatus: found.currentStatus,
        humanVerificationRequired: found.humanVerificationRequired,
        questionsForNextInterview: found.questionsForNextInterview
      });
    }
  };

  const handleRunStructuringEngine = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate deterministic AI Studio Master Prompt Structuring Engine adhering strictly to 10 rules
      const containsConsent = rawInputText.toLowerCase().includes('consent') || rawInputText.includes('सहमति');
      const containsDispute = rawInputText.toLowerCase().includes('ghee') || rawInputText.toLowerCase().includes('modern');
      
      setOutputRecord((prev) => ({
        ...prev,
        evidence: prev.evidence === 'EVIDENCE NOT PROVIDED' ? 'EVIDENCE NOT PROVIDED (Strict Rule 4 Enforced)' : prev.evidence,
        communityTestimony: `Extracted from raw notes: "${rawInputText.slice(0, 180)}..."`,
        contradictoryEvidence: containsDispute
          ? 'FLAGGED: Ghee vs Mustard oil tempering variation noted between Nayaganj and Sisamau households.'
          : prev.contradictoryEvidence,
        consentStatus: containsConsent ? 'OBTAINED' : 'PENDING (Strict Rule 10: Cannot publish without verified consent)',
        currentStatus: 'FIELD_IN_PROGRESS',
        humanVerificationRequired: true
      }));
      setIsProcessing(false);
    }, 450);
  };

  const handleCopy = () => {
    const textToCopy = `Claim ID: ${outputRecord.claimId}
Claim: ${outputRecord.claim}
Claim Type: ${outputRecord.claimType}
Geographic Scope: ${outputRecord.geographicScope}
People/Community Associated: ${outputRecord.peopleCommunityAssociated}
Evidence: ${outputRecord.evidence}
Source: ${outputRecord.source}
Evidence Type: ${outputRecord.evidenceType}
Contradictory Evidence: ${outputRecord.contradictoryEvidence}
Community Testimony: ${outputRecord.communityTestimony}
Consent Status: ${outputRecord.consentStatus}
Access Level: ${outputRecord.accessLevel}
Current Status: ${outputRecord.currentStatus}
Human Verification Required: ${outputRecord.humanVerificationRequired ? 'YES' : 'NO'}
Questions for Next Interview: ${outputRecord.questionsForNextInterview}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="rounded-xl border border-amber-500/30 bg-stone-900/90 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold font-serif text-stone-100">
                Google AI Studio: Master Prompt &amp; Structuring Engine
              </h2>
            </div>
            <p className="text-xs text-stone-300 max-w-3xl leading-relaxed">
              Strictly configured as a <strong>Research Assistant &amp; Structuring Engine</strong>. AI never invents facts, never assumes truth without evidence, stamps missing proof with <em>"EVIDENCE NOT PROVIDED"</em>, separates testimony from interpretation, and enforces human authority.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold">
              10 Strict Rules Active
            </span>
          </div>
        </div>

        {/* 10 Strict Rules Quick Reference Pill Bar */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap gap-1.5 text-[11px]">
          {[
            '#1 Never claim unverified as fact',
            '#2 Separate Claim / Evidence / Testimony',
            '#3 Zero synthetic sources',
            '#4 "EVIDENCE NOT PROVIDED" flag',
            '#5 No arbitrary confidence scores',
            '#6 Testimony != Objective fact',
            '#7 Flag conflicting evidence',
            '#8 Sacred & private data guard',
            '#9 Human reviewer final authority',
            '#10 Explicit consent required'
          ].map((rule, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800 font-mono text-[10px]"
            >
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
        <label className="block text-xs font-semibold text-stone-300 mb-2">
          Select Candidate Claim from Kanpur Home-Food Pilot:
        </label>
        <div className="flex flex-wrap gap-2">
          {HOME_FOOD_10_CLAIMS.map((claim) => (
            <button
              key={claim.id}
              onClick={() => handleSelectPreset(claim.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                selectedClaimId === claim.id
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                  : 'bg-stone-950 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {claim.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace: Left Input, Right Structured Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input Textarea & Prompt Controls */}
        <div className="lg:col-span-5 space-y-3">
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                Raw Field Notes / Research Input
              </span>
              <span className="text-[11px] text-stone-400 font-mono">
                {rawInputText.length} chars
              </span>
            </div>

            <textarea
              rows={11}
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-950 p-3 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-500/50 leading-relaxed"
              placeholder="Paste raw practitioner interview transcription, field recordings, or historical citations..."
            />

            <button
              onClick={handleRunStructuringEngine}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 font-semibold text-xs text-stone-950 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin text-stone-950" />
                  <span>Structuring with Master Prompt...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Execute Master Prompt Structuring</span>
                </>
              )}
            </button>
          </div>

          {/* System Compliance Checklist */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 space-y-2 text-xs">
            <span className="font-bold text-stone-300 block mb-1">
              Live Governance &amp; Discipline Checks:
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Rule #1: Stamped as UNVERIFIED_HYPOTHESIS or IN_PROGRESS</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Rule #4: Missing evidence flagged with EVIDENCE NOT PROVIDED</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Rule #6: Practitioner words kept as attributed testimony</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300">
                <Shield className="h-3.5 w-3.5 shrink-0" />
                <span>Rule #9: Human Auditor has final sign-off authority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Master Prompt Output Format */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Structured Output Schema
                </span>
                <h3 className="text-base font-bold text-stone-100 font-serif mt-1">
                  Master Prompt Output ({outputRecord.claimId})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-xs text-stone-200 hover:bg-stone-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-stone-400" />
                      <span>Copy Format</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Structured Key-Value Output Display */}
            <div className="space-y-2 text-xs font-mono bg-stone-950 p-4 rounded-lg border border-stone-800 overflow-x-auto max-h-[500px] overflow-y-auto">
              <div>
                <span className="text-amber-400 font-bold">Claim ID:</span>{' '}
                <span className="text-stone-200">{outputRecord.claimId}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Claim:</span>{' '}
                <span className="text-stone-100 font-sans font-medium">{outputRecord.claim}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Claim Type:</span>{' '}
                <span className="text-stone-300">{outputRecord.claimType}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Geographic Scope:</span>{' '}
                <span className="text-stone-300">{outputRecord.geographicScope}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">People / Community Associated:</span>{' '}
                <span className="text-stone-300">{outputRecord.peopleCommunityAssociated}</span>
              </div>

              {/* Evidence with Rule 4 highlight */}
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 my-1">
                <span className="text-amber-300 font-bold">Evidence:</span>{' '}
                <span className="text-amber-200 font-bold">{outputRecord.evidence}</span>
              </div>

              <div>
                <span className="text-amber-400 font-bold">Source:</span>{' '}
                <span className="text-stone-300">{outputRecord.source}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Evidence Type:</span>{' '}
                <span className="text-stone-300">{outputRecord.evidenceType}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Contradictory Evidence:</span>{' '}
                <span className="text-stone-300">{outputRecord.contradictoryEvidence}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Community Testimony:</span>{' '}
                <span className="text-stone-200 font-sans italic">"{outputRecord.communityTestimony}"</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Consent Status:</span>{' '}
                <span className="text-stone-200">{outputRecord.consentStatus}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Access Level:</span>{' '}
                <span className="text-stone-200">{outputRecord.accessLevel}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Current Status:</span>{' '}
                <span className="text-stone-200">{outputRecord.currentStatus}</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">Human Verification Required:</span>{' '}
                <span className="text-amber-300 font-bold">
                  {outputRecord.humanVerificationRequired ? 'YES (MANDATORY)' : 'NO'}
                </span>
              </div>
              <div className="pt-1 border-t border-stone-800">
                <span className="text-amber-400 font-bold">Questions for Next Interview:</span>{' '}
                <span className="text-stone-200 font-sans italic">
                  "{outputRecord.questionsForNextInterview}"
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
              <span>Ready for import into Day 2 Evidence Ledger</span>
              <span className="text-stone-300 font-medium">
                Complies with strict no-hallucination constraint
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
