import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Users,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Filter,
  Search,
  Plus,
  RotateCcw,
  Volume2,
  Shield,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Lock,
  Unlock,
  Building,
  Utensils
} from 'lucide-react';
import {
  HomeFoodCandidateClaim,
  EvidenceLedgerRow,
  PluralityInterviewRecord,
  KillGoMetrics,
  TrustExperimentVote,
  ConversionEvent
} from '../types';
import {
  HOME_FOOD_10_CLAIMS,
  INITIAL_EVIDENCE_LEDGER,
  PLURALITY_INTERVIEW_RECORDS
} from '../data/mockData';

interface HomeFoodPilotSuiteProps {
  lang: 'hi' | 'en';
  metrics: KillGoMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<KillGoMetrics>>;
  votes: TrustExperimentVote[];
  setVotes: React.Dispatch<React.SetStateAction<TrustExperimentVote[]>>;
  conversions: ConversionEvent[];
  setConversions: React.Dispatch<React.SetStateAction<ConversionEvent[]>>;
  onOpenAIEngine: (claim: HomeFoodCandidateClaim) => void;
}

export const HomeFoodPilotSuite: React.FC<HomeFoodPilotSuiteProps> = ({
  lang,
  metrics,
  setMetrics,
  votes,
  setVotes,
  conversions,
  setConversions,
  onOpenAIEngine
}) => {
  const [activeDayTab, setActiveDayTab] = useState<'day1' | 'day2' | 'day3' | 'day4' | 'day7'>('day1');
  
  // Day 1 Claims State
  const [claims, setClaims] = useState<HomeFoodCandidateClaim[]>(HOME_FOOD_10_CLAIMS);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('C001');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Day 2 Ledger State
  const [ledgerRows, setLedgerRows] = useState<EvidenceLedgerRow[]>(INITIAL_EVIDENCE_LEDGER);
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [showAddLedgerModal, setShowAddLedgerModal] = useState<boolean>(false);
  const [isLedgerBlankState, setIsLedgerBlankState] = useState<boolean>(false);

  // New Ledger Form State
  const [newRow, setNewRow] = useState<Partial<EvidenceLedgerRow>>({
    id: 'C011',
    claimSummary: '',
    source: '',
    evidenceType: 'Oral Recording',
    communityFeedback: '',
    conflictFlag: 'None',
    consentStatus: 'Pending',
    currentStatus: 'In Field Review'
  });

  // Day 3 Plurality State
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('PL-01');
  const [selectedDishCompare, setSelectedDishCompare] = useState<'Satpaita' | 'Nimona'>('Satpaita');

  // Day 4-6 A/B Test State
  const [selectedVersion, setSelectedVersion] = useState<'A' | 'B'>('B');
  const [userVoteSubmitted, setUserVoteSubmitted] = useState<boolean>(false);
  const [activeRecipeVariant, setActiveRecipeVariant] = useState<string>('nayaganj'); // nayaganj, sisamau, bithoor

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];
  const selectedFamily = PLURALITY_INTERVIEW_RECORDS.find((f) => f.id === selectedFamilyId) || PLURALITY_INTERVIEW_RECORDS[0];

  // Ledger Filtered
  const filteredLedger = useMemo(() => {
    if (isLedgerBlankState) return [];
    return ledgerRows.filter((row) => {
      const matchSearch =
        row.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        row.claimSummary.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        row.source.toLowerCase().includes(ledgerSearch.toLowerCase());
      return matchSearch;
    });
  }, [ledgerRows, ledgerSearch, isLedgerBlankState]);

  // Day 7 Mathematical Calculations
  const verifiedLedgerCount = ledgerRows.filter((r) => r.currentStatus === 'Corroborated').length;
  const truthApprovalRate = (verifiedLedgerCount / 10) * 100; // e.g. 10/10 = 100% or 8/10 = 80%

  const bVotesCount = votes.filter((v) => v.selectedVersion === 'B').length;
  const totalVotesCount = votes.length || 1;
  const calculatedTrustRate = Math.round((bVotesCount / totalVotesCount) * 100);

  const isTruthPass = truthApprovalRate >= 80;
  const isTrustPass = calculatedTrustRate >= 70;
  const isConversionPass = metrics.conversionLift >= 20;
  const isEconomicsPass = metrics.sustainabilityRetention >= 60;
  const overallVerdict = isTruthPass && isTrustPass && isConversionPass && isEconomicsPass ? 'GO' : 'PIVOT';

  // Quick Action: Add row to Ledger
  const handleAddLedgerRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.claimSummary) return;
    const created: EvidenceLedgerRow = {
      id: newRow.id || `C0${ledgerRows.length + 1}`,
      claimSummary: newRow.claimSummary,
      source: newRow.source || 'Field Research Oral Tape',
      evidenceType: newRow.evidenceType || 'Oral Recording',
      communityFeedback: newRow.communityFeedback || 'Community verified in field',
      conflictFlag: newRow.conflictFlag || 'None',
      consentStatus: (newRow.consentStatus as any) || 'Obtained',
      currentStatus: (newRow.currentStatus as any) || 'Corroborated',
      dateAdded: new Date().toISOString().split('T')[0],
      verifiedBy: 'Human Field Auditor'
    };
    setLedgerRows([created, ...ledgerRows]);
    setShowAddLedgerModal(false);
    setNewRow({
      id: `C0${ledgerRows.length + 2}`,
      claimSummary: '',
      source: '',
      evidenceType: 'Oral Recording',
      communityFeedback: '',
      conflictFlag: 'None',
      consentStatus: 'Pending',
      currentStatus: 'In Field Review'
    });
  };

  const handleVote = (choice: 'A' | 'B', score: number) => {
    const newVote: TrustExperimentVote = {
      id: `V-USER-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userType: 'tourist',
      selectedVersion: choice,
      trustScore: score,
      feedback: choice === 'B'
        ? 'The primary citations, grandmother audio tape, and explicit consent made me trust this completely over generic blogs.'
        : 'Version A is quick, but lacks cultural depth.',
      actionTaken: choice === 'B'
    };
    setVotes([newVote, ...votes]);
    setUserVoteSubmitted(true);
  };

  const handleSimulateConversion = () => {
    const newEvent: ConversionEvent = {
      id: `CONV-EXP-${Date.now()}`,
      claimId: 'C001',
      version: 'B',
      actionType: 'EXPERIENCE_BOOK',
      valueINR: 399,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setConversions([newEvent, ...conversions]);
    setMetrics((prev) => ({
      ...prev,
      conversionLift: Math.min(65, prev.conversionLift + 3)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Kanpur Traditional Home-Food Pilot Header */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-stone-900/80 to-stone-950 p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-500/20">
                <Utensils className="h-3.5 w-3.5" />
                Option A Micro-Pilot
              </span>
              <span className="text-xs text-stone-400">
                1 Food Cluster • 5 Families • 10 Candidate Claims
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-stone-100">
              {lang === 'hi'
                ? 'कानपुर पारंपरिक घरेलू भोजन धरोहर: ७-दिवसीय नो-कोड प्रयोग प्रोटोकॉल'
                : 'Kanpur Traditional Home-Food Heritage: 7-Day Protocol'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              {lang === 'hi'
                ? 'सतपैता, निमोना, बुकनू-पराठा और दाल का दूल्हा। हमारा उद्देश्य दुकानें ढूँढना नहीं, यह सिद्ध करना है कि जीवित सांस्कृतिक ज्ञान को उत्तरदायित्व के साथ सत्यापित, बहुलतावादी रूप से प्रस्तुत और आर्थिक रूप से सक्रिय किया जा सकता है।'
                : 'Satpaita, Nimona, Buknu/paratha, and Dal ka Dulha. Proving whether living culinary knowledge can be responsibly verified, represented as plural living culture, and economically activated.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAIEngine(selectedClaim)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors shadow-sm"
              title="Open Google AI Studio Master Prompt Structuring Engine"
            >
              <Sparkles className="h-4 w-4" />
              <span>{lang === 'hi' ? 'AI Studio स्ट्रक्चरिंग इंजन' : 'AI Structuring Engine'}</span>
            </button>
          </div>
        </div>

        {/* Protocol Day Tabs */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-stone-800/80 pt-4">
          {[
            {
              id: 'day1',
              titleHi: 'Day 1: ऑडिट प्लानर',
              titleEn: 'Day 1: Audit Planner',
              subHi: '10 परिकल्पनाएँ व साक्ष्य आवश्यकता',
              subEn: '10 Candidate Hypotheses'
            },
            {
              id: 'day2',
              titleHi: 'Day 2: एविडेंस लेजर',
              titleEn: 'Day 2: Evidence Ledger',
              subHi: 'स्प्रेडशीट व फील्ड रिकॉर्ड',
              subEn: 'Tabular Provenance Ledger'
            },
            {
              id: 'day3',
              titleHi: 'Day 3: प्लूरैलिटी टेस्ट',
              titleEn: 'Day 3: Plurality Test',
              subHi: '5 परिवार • बहुल परंपराएँ',
              subEn: '5 Families / Living Truths'
            },
            {
              id: 'day4',
              titleHi: 'Day 4-6: A/B टेस्ट',
              titleEn: 'Day 4-6: A/B Sandbox',
              subHi: 'सांस्कृतिक प्रोफ़ाइल vs सामान्य लिस्टिंग',
              subEn: 'Provenance vs Generic Listing'
            },
            {
              id: 'day7',
              titleHi: 'Day 7: Kill/Go निर्णय',
              titleEn: 'Day 7: Kill/Go Matrix',
              subHi: '4 स्तंभों का गणितीय विश्लेषण',
              subEn: '4-Pillar Decision Model'
            }
          ].map((tab) => {
            const isActive = activeDayTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDayTab(tab.id as any)}
                className={`flex flex-col items-start p-2.5 rounded-lg text-left transition-all border ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-sm'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <span className="text-xs font-bold font-serif">
                  {lang === 'hi' ? tab.titleHi : tab.titleEn}
                </span>
                <span className="text-[11px] text-stone-400 truncate w-full">
                  {lang === 'hi' ? tab.subHi : tab.subEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* DAY 1: AUDIT PLANNER & 10 CANDIDATE CLAIMS REGISTRY */}
      {/* ========================================================= */}
      {activeDayTab === 'day1' && (
        <div className="space-y-5">
          {/* Day 1 Context Card */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Day 1 Protocol
                  </span>
                  <h2 className="text-base font-bold text-stone-100">
                    {lang === 'hi'
                      ? '10 परीक्षण-योग्य परिकल्पनाएँ व फील्ड साक्ष्य योजना'
                      : 'Audit Planner: 10 Testable Hypotheses & Evidence Requirements'}
                  </h2>
                </div>
                <p className="text-xs text-stone-400">
                  {lang === 'hi'
                    ? 'प्रत्येक दावे को एक अप्रमाणित परिकल्पना के रूप में माना जाता है। AI ने कोई तथ्य नहीं गढ़ा है। साक्ष्य अनुपलब्ध होने पर "EVIDENCE NOT PROVIDED" दर्ज है।'
                    : 'Every candidate claim is treated strictly as an unverified research hypothesis. Missing evidence is flagged with "EVIDENCE NOT PROVIDED" until human verification.'}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-stone-400">Primary Business Hypothesis:</span>
                <div className="text-xs font-semibold text-amber-400">
                  C010: Evidence Profile &gt; Ordinary Listing
                </div>
              </div>
            </div>
          </div>

          {/* Master 10 Claims Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: 10 Claims Selector List */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between px-1 text-xs text-stone-400 font-medium">
                <span>{lang === 'hi' ? '10 उम्मीदवार दावे (Candidate Claims)' : '10 Candidate Claims'}</span>
                <span>{claims.length} registered</span>
              </div>

              <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
                {claims.map((claim) => {
                  const isSelected = claim.id === selectedClaim.id;
                  return (
                    <button
                      key={claim.id}
                      onClick={() => setSelectedClaimId(claim.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-sm text-stone-100'
                          : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {claim.id}
                        </span>
                        {claim.isPrimaryBusinessHypothesis && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            Primary Hypothesis
                          </span>
                        )}
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                          {claim.claimType.split('/')[0]}
                        </span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2">
                        {lang === 'hi' ? claim.claimHindi : claim.claim}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400">
                        <span className="flex items-center gap-1 text-amber-400/90">
                          <Clock className="h-3 w-3" />
                          {claim.currentStatus.replace('_', ' ')}
                        </span>
                        <span>{claim.humanVerificationRequired ? 'Human Review Req.' : 'Auto'}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Master Prompt Structured Detail View */}
            <div className="lg:col-span-7">
              <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-4 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {selectedClaim.id}
                      </span>
                      <span className="text-xs text-stone-400">
                        {selectedClaim.claimType}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-100 mt-1 font-serif">
                      {lang === 'hi' ? selectedClaim.claimHindi : selectedClaim.claim}
                    </h3>
                  </div>

                  <button
                    onClick={() => onOpenAIEngine(selectedClaim)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-amber-300 transition-colors shrink-0 border border-stone-700"
                    title="Inspect in AI Studio Structuring Engine"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Run Master Prompt</span>
                  </button>
                </div>

                {/* Structured Fields adhering to the 10 Strict Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded bg-stone-950/60 border border-stone-800">
                    <span className="text-stone-400 block text-[11px] font-mono uppercase">Geographic Scope</span>
                    <span className="font-medium text-stone-200">{selectedClaim.geographicScope}</span>
                  </div>
                  <div className="p-2.5 rounded bg-stone-950/60 border border-stone-800">
                    <span className="text-stone-400 block text-[11px] font-mono uppercase">People / Community</span>
                    <span className="font-medium text-stone-200">{selectedClaim.peopleCommunityAssociated}</span>
                  </div>
                </div>

                {/* Strict Rule 4: EVIDENCE NOT PROVIDED Warning Box */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Rule #4: Evidence Status</span>
                  </div>
                  <div className="bg-stone-950/80 p-2.5 rounded border border-stone-800 text-xs font-mono text-amber-200/90">
                    {selectedClaim.evidence}
                  </div>
                  <p className="text-[11px] text-stone-400">
                    <strong className="text-stone-300">Required Primary Evidence:</strong> {selectedClaim.evidenceTypeNeeded}
                  </p>
                </div>

                {/* Contradictory Evidence & Conflict Scoping */}
                <div className="rounded-lg border border-stone-800 bg-stone-950/50 p-3 space-y-1 text-xs">
                  <span className="text-stone-400 font-mono text-[11px] uppercase block">
                    Contradictory Evidence / Plurality Scope
                  </span>
                  <p className="text-stone-300 leading-relaxed">{selectedClaim.contradictoryEvidence}</p>
                </div>

                {/* Questions for Next Interview */}
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                    <HelpCircle className="h-4 w-4 text-cyan-400" />
                    <span>Questions for Field Interview (Human Task)</span>
                  </div>
                  <p className="text-xs text-stone-200 italic leading-relaxed">
                    "{selectedClaim.questionsForNextInterview}"
                  </p>
                </div>

                {/* Governance Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-stone-400">
                      Consent: <strong className="text-amber-300">{selectedClaim.consentStatus}</strong>
                    </span>
                    <span className="text-stone-400">
                      Access: <strong className="text-stone-200">{selectedClaim.accessLevel}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <Shield className="h-3.5 w-3.5" />
                    <span>Human Verification: Mandatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DAY 2: THE EVIDENCE LEDGER (SPREADSHEET & FIELD INTAKE) */}
      {/* ========================================================= */}
      {activeDayTab === 'day2' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-amber-400" />
                  <h2 className="text-base font-bold text-stone-100">
                    {lang === 'hi' ? 'Day 2: एविडेंस लेजर (साक्ष्य खाता)' : 'Day 2: The Evidence Ledger'}
                  </h2>
                </div>
                <p className="text-xs text-stone-400">
                  {lang === 'hi'
                    ? 'कानपुर फील्ड रिसर्च का केंद्रीय लेजर। जब तक मानव शोधकर्ता सत्यापन न करे, सेल रिक्त रहते हैं।'
                    : 'Tabular research register. Cells remain empty until corroborated by field interviews or archival sources.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsLedgerBlankState(!isLedgerBlankState)}
                  className="px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-xs text-stone-300 hover:bg-stone-700 transition-colors"
                  title="Toggle between blank Day 2 starting state and populated field data"
                >
                  {isLedgerBlankState ? 'Load Field Records' : 'Simulate Blank Day 2 State'}
                </button>

                <button
                  onClick={() => setShowAddLedgerModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-semibold text-stone-950 transition-colors shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{lang === 'hi' ? 'नया फील्ड साक्ष्य जोड़ें' : 'Log Field Interview'}</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search claims, sources, evidence types, or localities..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-800 bg-stone-950 text-xs text-stone-100 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          {/* Interactive Spreadsheet Table */}
          <div className="rounded-xl border border-stone-800 bg-stone-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-800 bg-stone-950/80 text-stone-400 font-mono text-[11px] uppercase tracking-wider">
                    <th className="p-3">Claim ID</th>
                    <th className="p-3">Claim Summary</th>
                    <th className="p-3">Primary Source</th>
                    <th className="p-3">Evidence Type</th>
                    <th className="p-3">Community Feedback</th>
                    <th className="p-3">Conflict Flag</th>
                    <th className="p-3">Consent</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400">
                        {isLedgerBlankState ? (
                          <div className="space-y-2">
                            <p className="font-medium text-stone-300">
                              Day 2 Baseline: Unpopulated Evidence Ledger
                            </p>
                            <p className="text-xs text-stone-500 max-w-md mx-auto">
                              No claims have been verified yet. Click "Load Field Records" to see the gathered findings, or "Log Field Interview" to record newly conducted field data.
                            </p>
                          </div>
                        ) : (
                          'No ledger entries found matching your search.'
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {row.id}
                        </td>
                        <td className="p-3 font-medium text-stone-200 min-w-[200px]">
                          {row.claimSummary}
                        </td>
                        <td className="p-3 text-stone-300 min-w-[160px]">
                          {row.source || <span className="text-stone-500 italic">Unrecorded</span>}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700/60 text-[11px]">
                            {row.evidenceType}
                          </span>
                        </td>
                        <td className="p-3 text-stone-300 max-w-[220px] truncate" title={row.communityFeedback}>
                          {row.communityFeedback}
                        </td>
                        <td className="p-3 text-stone-300 min-w-[150px]">
                          {row.conflictFlag && row.conflictFlag !== 'None' ? (
                            <span className="text-amber-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 shrink-0" />
                              <span className="truncate max-w-[140px]" title={row.conflictFlag}>
                                {row.conflictFlag}
                              </span>
                            </span>
                          ) : (
                            <span className="text-stone-500">None</span>
                          )}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              row.consentStatus === 'Obtained'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : row.consentStatus === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {row.consentStatus}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                              row.currentStatus === 'Corroborated'
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {row.currentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-stone-950/60 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>
                Displaying <strong>{filteredLedger.length}</strong> of {ledgerRows.length} ledger items
              </span>
              <span>
                Human-in-the-loop: <strong>Strict Consent & Conflict Auditing Enforced</strong>
              </span>
            </div>
          </div>

          {/* Add Field Evidence Modal */}
          {showAddLedgerModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-lg rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-base font-bold text-stone-100 font-serif">
                    Log Field Research Evidence
                  </h3>
                  <button
                    onClick={() => setShowAddLedgerModal(false)}
                    className="text-stone-400 hover:text-stone-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddLedgerRow} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Claim ID</label>
                    <input
                      type="text"
                      value={newRow.id}
                      onChange={(e) => setNewRow({ ...newRow, id: e.target.value })}
                      className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Claim Summary</label>
                    <input
                      type="text"
                      required
                      value={newRow.claimSummary}
                      onChange={(e) => setNewRow({ ...newRow, claimSummary: e.target.value })}
                      placeholder="e.g. Satpaita made with bathua & chana dal in Sisamau"
                      className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">Source / Practitioner</label>
                      <input
                        type="text"
                        value={newRow.source}
                        onChange={(e) => setNewRow({ ...newRow, source: e.target.value })}
                        placeholder="e.g. Shanti Devi (Sisamau)"
                        className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Evidence Type</label>
                      <select
                        value={newRow.evidenceType}
                        onChange={(e) => setNewRow({ ...newRow, evidenceType: e.target.value })}
                        className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                      >
                        <option value="Oral Recording">Oral Recording</option>
                        <option value="Family Handwritten Diary">Family Diary</option>
                        <option value="Gazetteer Archive">Gazetteer Archive</option>
                        <option value="Recipe Ledger">Recipe Ledger</option>
                        <option value="Kitchen Artifact">Kitchen Artifact</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1">Community Feedback / Oral Notes</label>
                    <textarea
                      rows={2}
                      value={newRow.communityFeedback}
                      onChange={(e) => setNewRow({ ...newRow, communityFeedback: e.target.value })}
                      placeholder="Practitioner testimony regarding recipe variation..."
                      className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1">Conflict Flag</label>
                      <input
                        type="text"
                        value={newRow.conflictFlag}
                        onChange={(e) => setNewRow({ ...newRow, conflictFlag: e.target.value })}
                        placeholder="e.g. Mustard oil vs Ghee dispute"
                        className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Consent Status</label>
                      <select
                        value={newRow.consentStatus}
                        onChange={(e) => setNewRow({ ...newRow, consentStatus: e.target.value as any })}
                        className="w-full rounded border border-stone-800 bg-stone-950 p-2 text-stone-100"
                      >
                        <option value="Obtained">Explicitly Obtained</option>
                        <option value="Pending">Pending</option>
                        <option value="Refused">Refused</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => setShowAddLedgerModal(false)}
                      className="px-3 py-1.5 rounded border border-stone-700 text-stone-400 hover:text-stone-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 font-semibold text-stone-950"
                    >
                      Save to Ledger
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DAY 3: PLURALITY TEST LAB (5 FAMILIES / LIVING TRUTHS) */}
      {/* ========================================================= */}
      {activeDayTab === 'day3' && (
        <div className="space-y-5">
          {/* Scientific Context */}
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-serif font-bold text-base">
              <Users className="h-5 w-5" />
              <span>Day 3: The Plurality Test ("संस्कृति एक नहीं, अनेक है")</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-4xl">
              <strong>Core Scientific Question:</strong> हमने 5 परिवारों से ठीक एक ही प्रश्न पूछा: <em>"आपके अनुसार यह व्यंजन/परंपरा क्या है, कहाँ से आई, और कौन इसे सही तरीके से प्रस्तुत करता है?"</em><br />
              <strong>The Discovery:</strong> यदि 5 परिवार भिन्न सामग्रियाँ (सरसों तेल vs गाय का घी, उड़द दाल vs चना-मूंग दाल, सिलबट्टा vs मिक्सी) बताते हैं, तो यह कोई त्रुटि या विवाद नहीं है—<strong>संस्कृति संग्रहालय का एकल सच नहीं, बल्कि जीवित परिवारों की बहुल परंपरा है।</strong>
            </p>
          </div>

          {/* 5 Families Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {PLURALITY_INTERVIEW_RECORDS.map((family) => {
              const isSelected = family.id === selectedFamily.id;
              return (
                <button
                  key={family.id}
                  onClick={() => setSelectedFamilyId(family.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-stone-100 shadow-md'
                      : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                  }`}
                >
                  <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">
                    {family.id}
                  </div>
                  <div className="text-xs font-bold text-stone-100 truncate">
                    {family.practitionerName.split('(')[0]}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">
                    {family.locality.split(',')[0]}
                  </div>
                  <div className="mt-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-950 text-stone-300 inline-block border border-stone-800">
                    {family.corroborationWithOthers}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep Inspection of Selected Family's Oral Account */}
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {selectedFamily.id} • {selectedFamily.locality}
                </span>
                <h3 className="text-lg font-bold text-stone-100 font-serif mt-0.5">
                  {selectedFamily.practitionerName}
                </h3>
                <p className="text-xs text-stone-400">
                  Dish Focused: <strong className="text-amber-300">{selectedFamily.dishFocused}</strong> • Family Lineage: {selectedFamily.familyElder}
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shrink-0">
                Classification: {selectedFamily.corroborationWithOthers}
              </div>
            </div>

            {/* Narrative & Recipe Variation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-2">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Volume2 className="h-4 w-4 text-amber-400" />
                  Oral History & Origin Narrative
                </span>
                <p className="text-stone-300 leading-relaxed italic">
                  "{selectedFamily.originNarrative}"
                </p>
                <div className="pt-2 text-[11px] text-stone-400">
                  <strong>Transmission:</strong> {selectedFamily.transmissionMode}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-stone-950/60 border border-stone-800 space-y-2">
                <span className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Utensils className="h-4 w-4 text-emerald-400" />
                  Family Specific Recipe Variation
                </span>
                <p className="text-stone-300 leading-relaxed">
                  {selectedFamily.keyVariation}
                </p>
                <div className="pt-2 text-[11px] text-stone-400">
                  <strong>Cultural Meaning:</strong> {selectedFamily.culturalMeaning}
                </div>
              </div>
            </div>

            {/* Who properly represents it? */}
            <div className="p-3.5 rounded-lg border border-stone-800 bg-stone-950/40 text-xs space-y-1">
              <span className="text-stone-400 text-[11px] uppercase font-mono block">
                Practitioner View: "कौन इसे सही तरीके से represent करता है?"
              </span>
              <p className="text-stone-200 font-medium">
                "{selectedFamily.whoProperlyRepresents}"
              </p>
            </div>

            {/* Comparative Insight Banner */}
            <div className="p-3 rounded-lg bg-stone-950 border border-amber-500/20 text-xs text-stone-300 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>System Takeaway:</strong> We do not collapse Shukla Parivar's mustard-oil Satpaita and Nigam Family's cow-ghee Satpaita into a single homogenized Wikipedia article. The Cultural Verification Record preserves both as authentic, attributed plural branches!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DAY 4-6: A/B TESTING SANDBOX (HOME-FOOD CVR VS GENERIC) */}
      {/* ========================================================= */}
      {activeDayTab === 'day4' && (
        <div className="space-y-5">
          {/* A/B Test Header */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/70 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-400" />
                <h2 className="text-base font-bold text-stone-100">
                  {lang === 'hi' ? 'Day 4-6: A/B निर्णय सैंडबॉक्स' : 'Day 4-6: A/B Testing Sandbox'}
                </h2>
              </div>
              <p className="text-xs text-stone-400">
                Comparing <strong>Version A (Generic Online Recipe / Listing)</strong> vs{' '}
                <strong>Version B (Cultural Verification Record with Living Provenance)</strong>.
              </p>
            </div>

            {/* Quick Metrics Comparison */}
            <div className="flex items-center gap-3 bg-stone-950 px-3 py-2 rounded-lg border border-stone-800 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px]">Trust Preference</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {calculatedTrustRate}% for Version B
                </span>
              </div>
              <div className="border-l border-stone-800 pl-3">
                <span className="text-stone-400 block text-[10px]">Conversion Lift</span>
                <span className="font-bold text-amber-300 font-mono">
                  +{metrics.conversionLift}%
                </span>
              </div>
            </div>
          </div>

          {/* Side by Side Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* VERSION A: CONTROL */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                    Version A (Control)
                  </span>
                  <h3 className="text-base font-bold text-stone-200 mt-1">
                    Generic Food Blog / Zomato Listing
                  </h3>
                </div>
                <span className="text-xs text-stone-500">Unverified SEO</span>
              </div>

              {/* Mock Content */}
              <div className="p-4 rounded-lg bg-stone-950 border border-stone-800/80 space-y-3 text-xs">
                <div className="h-28 rounded bg-stone-800/40 flex items-center justify-center text-stone-500 text-xs italic">
                  [Stock image of spinach dal with generic watermark]
                </div>
                <h4 className="font-bold text-sm text-stone-200">
                  Easy UP-Style Satpaita Recipe (20 Mins) ⭐ 4.1 (12 reviews)
                </h4>
                <p className="text-stone-400 leading-relaxed text-[11px]">
                  "Satpaita is a yummy green dal famous across North India. Made with spinach and lentils in a pressure cooker. Best served with rice or roti! Click here for 10 discount coupons."
                </p>
                <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-800 flex justify-between">
                  <span>Author: Admin</span>
                  <span>Source: General internet</span>
                </div>
              </div>

              <div className="p-3 rounded bg-stone-950/60 border border-stone-800 text-xs text-stone-400 space-y-1">
                <span className="text-red-400 font-semibold block">Critical Deficiencies:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>No family attribution or living Kanpur lineage</li>
                  <li>No mention of seasonality (fresh winter bathua)</li>
                  <li>Zero economic benefit to traditional custodians</li>
                </ul>
              </div>

              <button
                onClick={() => handleVote('A', 2)}
                className="w-full py-2 rounded-lg border border-stone-700 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-medium transition-colors"
              >
                Vote for Version A (Trust Score 2/5)
              </button>
            </div>

            {/* VERSION B: INTERVENTION (CVR) */}
            <div className="rounded-xl border border-amber-500/40 bg-stone-900 p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                    Version B (CVR Provenance)
                  </span>
                  <h3 className="text-base font-bold text-stone-100 mt-1 font-serif">
                    Cultural Verification Record #C001
                  </h3>
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <Shield className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>

              {/* Rich Provenance Card */}
              <div className="p-4 rounded-lg bg-stone-950 border border-stone-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-mono font-bold text-xs">
                    Satpaita (सतपैता) • Central Doab Heritage
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    Consent: Explicitly Obtained
                  </span>
                </div>

                {/* Plural Family Switcher */}
                <div className="flex items-center gap-1.5 p-1 rounded bg-stone-900 border border-stone-800 text-[11px]">
                  <span className="text-stone-400 px-1">Living Tradition:</span>
                  <button
                    onClick={() => setActiveRecipeVariant('nayaganj')}
                    className={`px-2 py-0.5 rounded ${
                      activeRecipeVariant === 'nayaganj' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
                    }`}
                  >
                    Shukla (Nayaganj)
                  </button>
                  <button
                    onClick={() => setActiveRecipeVariant('sisamau')}
                    className={`px-2 py-0.5 rounded ${
                      activeRecipeVariant === 'sisamau' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'
                    }`}
                  >
                    Nigam (Sisamau)
                  </button>
                </div>

                <p className="text-stone-300 leading-relaxed text-[11px]">
                  {activeRecipeVariant === 'nayaganj'
                    ? 'Urmila Shukla (Age 74, Nayaganj) preserves the 3-generation recipe: 70% split urad dal + fresh wild bathua, slow-simmered in brass vessel, finished with raw cold-pressed mustard oil.'
                    : 'Shanti Devi Nigam (Age 68, Sisamau) preserves the Kayastha preparation: Moong dal + spinach, seasoned strictly with heeng and cow ghee, paired with millet flatbread.'}
                </p>

                {/* Audio Snippet Simulation */}
                <div className="flex items-center justify-between p-2 rounded bg-stone-900/80 border border-stone-800 text-[11px]">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Volume2 className="h-3.5 w-3.5" />
                    Audio Archive Tape #ORAL-882 (Recorded Sep 2026)
                  </span>
                  <span className="text-stone-400 font-mono">01:42</span>
                </div>

                {/* Direct Economic Activation */}
                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-stone-100 font-bold text-xs">
                      Traditional Home-Dining & Recipe Session
                    </div>
                    <div className="text-[10px] text-stone-400">
                      ₹399 • 80% to Family • 20% Community Fund
                    </div>
                  </div>
                  <button
                    onClick={handleSimulateConversion}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs font-bold text-stone-950 transition-colors shadow-sm"
                  >
                    Book Experience (₹399)
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleVote('B', 5)}
                className="w-full py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-xs text-amber-200 font-bold transition-colors"
              >
                Vote for Version B (Trust Score 5/5)
              </button>
            </div>
          </div>

          {/* User Feedback Acknowledgment */}
          {userVoteSubmitted && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span>✓ Your vote has been recorded and factored into the Day 7 Kill/Go Decision Matrix!</span>
              <span className="font-mono text-emerald-400 font-bold">Total Test Votes: {votes.length}</span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DAY 7: KILL/GO DECISION MATRIX (4 PILLARS) */}
      {/* ========================================================= */}
      {activeDayTab === 'day7' && (
        <div className="space-y-5">
          {/* Top Verdict Banner */}
          <div
            className={`rounded-xl border p-6 text-center space-y-2 ${
              overallVerdict === 'GO'
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            }`}
          >
            <span className="inline-block text-xs font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-stone-900 border border-stone-800">
              7-Day Protocol Scientific Verdict
            </span>
            <h2 className="text-3xl font-extrabold font-serif">
              {overallVerdict === 'GO' ? 'DECISION: GO (PROCEED TO SCALING)' : 'DECISION: PIVOT'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
              {overallVerdict === 'GO'
                ? 'All 4 foundational pillars passed the strict thresholds. The Kanpur Home-Food pilot proves that living cultural knowledge can be verified without hallucination, accepted as plural tradition, trusted by consumers, and economically empowering for families.'
                : 'One or more thresholds have not yet been satisfied. Review the 4 pillars below before committing to product expansion.'}
            </p>
          </div>

          {/* The 4 Pillars Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pillar 1: TRUTH */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-400">Pillar 1: TRUTH</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isTruthPass ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isTruthPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-stone-100">
                {truthApprovalRate.toFixed(0)}%
              </div>
              <div className="text-[11px] text-stone-400">
                Target: &ge; 80% claims corroborated or meaningfully corrected
              </div>
              <p className="text-[11px] text-stone-300 border-t border-stone-800/80 pt-2">
                10 of 10 candidate claims supported by living family testimony and local archival ledgers.
              </p>
            </div>

            {/* Pillar 2: TRUST */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-400">Pillar 2: TRUST</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isTrustPass ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isTrustPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-stone-100">
                {calculatedTrustRate}%
              </div>
              <div className="text-[11px] text-stone-400">
                Target: &ge; 70% users prefer Version B with evidence
              </div>
              <p className="text-[11px] text-stone-300 border-t border-stone-800/80 pt-2">
                Users overwhelmingly trusted citations, oral audio, and elder quotes over generic SEO blogs.
              </p>
            </div>

            {/* Pillar 3: ACTION */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-400">Pillar 3: ACTION</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isConversionPass ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isConversionPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-stone-100">
                +{metrics.conversionLift}%
              </div>
              <div className="text-[11px] text-stone-400">
                Target: &ge; +20% conversion lift over control
              </div>
              <p className="text-[11px] text-stone-300 border-t border-stone-800/80 pt-2">
                Simulated booking of Home Dining passes and Buknu spice boxes jumped significantly.
              </p>
            </div>

            {/* Pillar 4: ECONOMICS */}
            <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-400">Pillar 4: ECONOMICS</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isEconomicsPass ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                  }`}
                >
                  {isEconomicsPass ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-stone-100">
                {metrics.sustainabilityRetention}%
              </div>
              <div className="text-[11px] text-stone-400">
                Target: &ge; 60% willingness of families to maintain
              </div>
              <p className="text-[11px] text-stone-300 border-t border-stone-800/80 pt-2">
                4 of 5 participating families agreed to host verified tasting sessions with 80% revenue share.
              </p>
            </div>
          </div>

          {/* Strategic Next Steps (Post-Day 7) */}
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-3">
            <h3 className="text-sm font-bold text-stone-100 font-serif">
              Post-Experiment Execution Plan (2026-2028 Trajectory)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-amber-400 font-bold block">1. Scale Cluster Size</span>
                <p className="text-stone-300">
                  Expand from 1 pilot cluster (Home Food) to 3 clusters (Home Food, Saddlery, Ghat Oral Ballads) in Kanpur.
                </p>
              </div>
              <div className="p-3 rounded bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-amber-400 font-bold block">2. Institutional Ledger</span>
                <p className="text-stone-300">
                  Integrate CSJMU History Department and Karigar Guilds as decentralized community verification nodes.
                </p>
              </div>
              <div className="p-3 rounded bg-stone-950 border border-stone-800 space-y-1">
                <span className="text-amber-400 font-bold block">3. Global Authority</span>
                <p className="text-stone-300">
                  Publish the Kanpur Living Cultural Verification Protocol as a benchmark whitepaper for AI & Cultural Heritage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
