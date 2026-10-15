import React, { useState } from 'react';
import { Header } from './components/Header';
import { CulturalIntelligenceCore } from './components/CulturalIntelligenceCore';
import { HomeFoodPilotSuite } from './components/HomeFoodPilotSuite';
import { AIStudioStructuringConsole } from './components/AIStudioStructuringConsole';
import { ExperimentSuite } from './components/ExperimentSuite';
import { ClaimInspector } from './components/ClaimInspector';
import { ABComparisonSandbox } from './components/ABComparisonSandbox';
import { VoiceIntakeSimulator } from './components/VoiceIntakeSimulator';
import { CulturalHealthIndexView } from './components/CulturalHealthIndexView';
import { CompetitiveAuditView } from './components/CompetitiveAuditView';
import { IdentityRoadmapView } from './components/IdentityRoadmapView';
import {
  INITIAL_CLAIMS,
  DISTRICT_HEALTH_METRIC,
  INITIAL_VOTES,
  HOME_FOOD_10_CLAIMS
} from './data/mockData';
import {
  CulturalClaim,
  KillGoMetrics,
  TrustExperimentVote,
  ConversionEvent,
  HomeFoodCandidateClaim
} from './types';
import { exportAuditReportJSON } from './utils/exportReport';
import { CheckCircle2, Award, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('core_v01');
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [claims, setClaims] = useState<CulturalClaim[]>(INITIAL_CLAIMS);
  const [selectedHomeFoodClaim, setSelectedHomeFoodClaim] = useState<HomeFoodCandidateClaim>(
    HOME_FOOD_10_CLAIMS[0]
  );
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string | undefined>(undefined);
  const [votes, setVotes] = useState<TrustExperimentVote[]>(INITIAL_VOTES);
  const [conversions, setConversions] = useState<ConversionEvent[]>([
    {
      id: 'CONV-101',
      claimId: 'C-0001',
      version: 'B',
      actionType: 'EXPERIENCE_BOOK',
      valueINR: 499,
      timestamp: '2026-09-14 11:30'
    },
    {
      id: 'CONV-102',
      claimId: 'C-0001',
      version: 'B',
      actionType: 'EXPERIENCE_BOOK',
      valueINR: 499,
      timestamp: '2026-09-14 12:15'
    },
    {
      id: 'CONV-103',
      claimId: 'C-0002',
      version: 'B',
      actionType: 'EXPERIENCE_BOOK',
      valueINR: 299,
      timestamp: '2026-09-14 15:10'
    },
    {
      id: 'CONV-104',
      claimId: 'C-0001',
      version: 'A',
      actionType: 'MENU_ORDER',
      valueINR: 250,
      timestamp: '2026-09-14 16:30'
    },
    {
      id: 'CONV-105',
      claimId: 'C-0004',
      version: 'B',
      actionType: 'EXPERIENCE_BOOK',
      valueINR: 1299,
      timestamp: '2026-09-15 09:45'
    }
  ]);

  const [metrics, setMetrics] = useState<KillGoMetrics>({
    truthApprovalRate: 83.3, // 5 of 6 pilot claims verified fully
    trustPreferenceRate: 80.0, // 80% prefer Version B
    conversionLift: 34.0, // +34% lift over control
    sustainabilityRetention: 75.0 // 75% merchants engaged
  });

  const [bookingNotice, setBookingNotice] = useState<{
    open: boolean;
    claim?: CulturalClaim;
  }>({ open: false });

  const handleExport = () => {
    exportAuditReportJSON(claims, metrics, DISTRICT_HEALTH_METRIC);
  };

  const handleReset = () => {
    setClaims(INITIAL_CLAIMS);
    setVotes(INITIAL_VOTES);
    setMetrics({
      truthApprovalRate: 83.3,
      trustPreferenceRate: 80.0,
      conversionLift: 34.0,
      sustainabilityRetention: 75.0
    });
  };

  const handleBookExperience = (claim: CulturalClaim) => {
    setBookingNotice({ open: true, claim });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Persistent Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        metrics={metrics}
        onExport={handleExport}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'core_v01' && (
          <CulturalIntelligenceCore
            lang={lang}
            onOpenAIEngine={(claimStatement) => {
              setAiCustomPrompt(
                `Raw Claim to Verify & Structure:\n"${claimStatement}"\n\nTask: Extract structured claims, assess verification status (default UNVERIFIED), identify potential cultural variants/plurality, and evaluate provenance basis.`
              );
              setActiveTab('ai_engine');
            }}
          />
        )}

        {(activeTab === 'home_food' || activeTab === 'experiment') && (
          <HomeFoodPilotSuite
            lang={lang}
            metrics={metrics}
            setMetrics={setMetrics}
            votes={votes}
            setVotes={setVotes}
            conversions={conversions}
            setConversions={setConversions}
            onOpenAIEngine={(claim) => {
              setSelectedHomeFoodClaim(claim);
              setActiveTab('ai_engine');
            }}
          />
        )}

        {activeTab === 'ai_engine' && (
          <AIStudioStructuringConsole
            initialClaim={selectedHomeFoodClaim}
            customInputText={aiCustomPrompt}
            lang={lang}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimInspector
            claims={claims}
            setClaims={setClaims}
            lang={lang}
            onBookExperience={handleBookExperience}
          />
        )}

        {activeTab === 'ab_test' && (
          <ABComparisonSandbox
            claims={claims}
            votes={votes}
            setVotes={setVotes}
            conversions={conversions}
            setConversions={setConversions}
            metrics={metrics}
            setMetrics={setMetrics}
            lang={lang}
          />
        )}

        {activeTab === 'voice_intake' && (
          <VoiceIntakeSimulator
            claims={claims}
            setClaims={setClaims}
            lang={lang}
          />
        )}

        {activeTab === 'health_index' && (
          <CulturalHealthIndexView
            healthMetric={DISTRICT_HEALTH_METRIC}
            lang={lang}
          />
        )}

        {activeTab === 'competitive' && (
          <CompetitiveAuditView lang={lang} />
        )}

        {activeTab === 'roadmap' && (
          <IdentityRoadmapView lang={lang} />
        )}
      </main>

      {/* Booking Modal (Simulated Verified Payout) */}
      {bookingNotice.open && bookingNotice.claim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-stone-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-100">
                  {lang === 'hi' ? 'सत्यापित अनुभव बुकिंग पुष्टि' : 'Verified Experience Booking'}
                </h4>
                <p className="text-xs text-stone-400">
                  {lang === 'hi' ? bookingNotice.claim.hindiName : bookingNotice.claim.entityName}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-300">
                <span>{lang === 'hi' ? 'अनुभव पास मूल्य' : 'Total Experience Fee'}:</span>
                <span className="font-mono font-bold text-stone-100">
                  ₹{bookingNotice.claim.economicOutcome.priceINR}
                </span>
              </div>
              <div className="flex justify-between text-emerald-400 pt-1 border-t border-stone-800">
                <span>
                  {lang === 'hi' ? 'कारीगर / हलवाई सीधा भुगतान' : 'Direct Artisan Transfer'} (
                  {bookingNotice.claim.economicOutcome.artisanSharePercent}%):
                </span>
                <span className="font-mono font-bold">
                  ₹{(
                    (bookingNotice.claim.economicOutcome.priceINR *
                      bookingNotice.claim.economicOutcome.artisanSharePercent) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>
                  {lang === 'hi' ? 'कानपुर धरोहर संरक्षण कोष' : 'Heritage Preservation Fund'} (
                  {bookingNotice.claim.economicOutcome.communityPreservationFundPercent}%):
                </span>
                <span className="font-mono font-bold">
                  ₹{(
                    (bookingNotice.claim.economicOutcome.priceINR *
                      bookingNotice.claim.economicOutcome.communityPreservationFundPercent) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>
                  {lang === 'hi' ? 'मंच अवसंरचना शुल्क' : 'Platform Operations'} (
                  {bookingNotice.claim.economicOutcome.platformFeePercent}%):
                </span>
                <span className="font-mono font-bold">
                  ₹{(
                    (bookingNotice.claim.economicOutcome.priceINR *
                      bookingNotice.claim.economicOutcome.platformFeePercent) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>
                {lang === 'hi'
                  ? 'डिजिटल साक्ष्य प्रमाणपत्र व क्यूआर कोड पंजीकृत मोबाइल पर प्रेषित किया गया।'
                  : 'Digital Provenance Certificate & QR Entry Pass dispatched to registered mobile.'}
              </span>
            </div>

            <button
              onClick={() => setBookingNotice({ open: false })}
              className="w-full rounded-lg bg-amber-500 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-colors"
            >
              {lang === 'hi' ? 'समाप्त करें (Close)' : 'Done'}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-6 text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-stone-400">
              Kanpur Pilot v1.0 • Cultural Verification Operating System
            </span>
          </div>
          <div className="text-stone-400 text-center sm:text-right">
            <span>2026-2028 Strategic Protocol • Community Governance • Provenance Moat</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
