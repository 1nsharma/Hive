import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DeepDiveStudio } from './components/DeepDiveStudio';
import { OpportunityEngineSimulator } from './components/OpportunityEngineSimulator';
import { ConstitutionSection } from './components/ConstitutionSection';
import { TreasuryVault } from './components/TreasuryVault';
import { MicroBusinessIncubator } from './components/MicroBusinessIncubator';
import { TechStackMatrix } from './components/TechStackMatrix';
import { LegalAndRoadmapSection } from './components/LegalAndRoadmapSection';
import { ExportCodeModal } from './components/ExportCodeModal';
import { IntegrityAuditModal } from './components/IntegrityAuditModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { INITIAL_TRANSACTIONS } from './data/blueprintData';
import { TreasuryTransaction, MicroBusinessIdea } from './types';
import { SupportedLanguage, TRANSLATIONS, isRTL } from './data/i18n';
import { loadPersistentState, savePersistentState, resetPersistentState, PersistentAppState, DEFAULT_APP_STATE } from './utils/storage';
import { Sprout, ShieldCheck, Wallet, Terminal } from 'lucide-react';

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('deep_dive');
  const [language, setLanguage] = useState<SupportedLanguage>('hi');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isIntegrityAuditOpen, setIsIntegrityAuditOpen] = useState<boolean>(false);

  // Live Treasury State
  const [aiOpsBalanceINR, setAiOpsBalanceINR] = useState<number>(18830);
  const [totalRevenueINR, setTotalRevenueINR] = useState<number>(398);
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>(INITIAL_TRANSACTIONS);
  const [emergencyHalted, setEmergencyHalted] = useState<boolean>(false);

  // Initialize from storage
  useEffect(() => {
    const { state } = loadPersistentState();
    setActiveTab(state.activeTab || 'deep_dive');
    setLanguage(state.language || 'hi');
    setAiOpsBalanceINR(state.aiOpsBalanceINR ?? 18830);
    setTotalRevenueINR(state.totalRevenueINR ?? 398);
    if (Array.isArray(state.transactions) && state.transactions.length > 0) {
      setTransactions(state.transactions);
    }
    setEmergencyHalted(!!state.emergencyHalted);
    setIsLoaded(true);
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (!isLoaded) return;
    const currentState: PersistentAppState = {
      version: 'v1.1',
      activeTab,
      language,
      aiOpsBalanceINR,
      totalRevenueINR,
      transactions,
      completedTasks: {
        't-0-0': true,
        't-0-1': true,
        't-0-2': true,
        't-1-0': true,
        't-1-1': true
      },
      emergencyHalted,
      lastUpdated: new Date().toISOString()
    };
    savePersistentState(currentState);
  }, [activeTab, language, aiOpsBalanceINR, totalRevenueINR, transactions, emergencyHalted, isLoaded]);

  const handleExpenseDeducted = (amount: number, desc: string) => {
    if (emergencyHalted) return;
    setAiOpsBalanceINR(prev => Math.max(0, prev - amount));
    const newTx: TreasuryTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: desc,
      type: 'EXPENSE',
      amountINR: amount,
      agent: 'Autonomous Agent Engine',
      category: 'API_CALL',
      auditHash: `SHA256:${Math.random().toString(36).substring(2, 12)}`,
      status: 'AUTO_EXECUTED',
      persistence: 'PERSISTENT',
      integrityLabel: 'SIMULATED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleRevenueAdded = (amount: number, desc: string) => {
    setTotalRevenueINR(prev => prev + amount);
    setAiOpsBalanceINR(prev => prev + amount);
    const newTx: TreasuryTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: desc,
      type: 'REVENUE',
      amountINR: amount,
      agent: 'Stripe Connect Webhook',
      category: 'SUBSCRIPTION_REVENUE',
      auditHash: `SHA256:${Math.random().toString(36).substring(2, 12)}REV`,
      status: 'APPROVED',
      persistence: 'PERSISTENT',
      integrityLabel: 'SIMULATED'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleSelectIdeaForSimulation = (idea: MicroBusinessIdea) => {
    setActiveTab('simulator');
  };

  const handleResetState = () => {
    if (window.confirm('Reset local application state, treasury ledger, and cashflow to initial defaults?')) {
      const reset = resetPersistentState();
      setActiveTab(reset.activeTab);
      setLanguage(reset.language);
      setAiOpsBalanceINR(reset.aiOpsBalanceINR);
      setTotalRevenueINR(reset.totalRevenueINR);
      setTransactions(reset.transactions);
      setEmergencyHalted(reset.emergencyHalted);
    }
  };

  const handleToggleEmergencyHalt = () => {
    setEmergencyHalted(prev => !prev);
  };

  const rtl = isRTL(language);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <ErrorBoundary>
      <div
        dir={rtl ? 'rtl' : 'ltr'}
        className={`min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0] flex flex-col antialiased ${
          rtl ? 'font-arabic' : ''
        }`}
      >
        {/* Top Navigation */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          setLanguage={setLanguage}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenIntegrityAudit={() => setIsIntegrityAuditOpen(true)}
          treasuryBalanceINR={aiOpsBalanceINR}
          emergencyHalted={emergencyHalted}
          onToggleEmergencyHalt={handleToggleEmergencyHalt}
          onResetState={handleResetState}
        />

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
          {activeTab === 'deep_dive' && (
            <DeepDiveStudio
              language={language}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'simulator' && (
            <OpportunityEngineSimulator
              language={language}
              onExpenseDeducted={handleExpenseDeducted}
              onRevenueAdded={handleRevenueAdded}
            />
          )}

          {activeTab === 'constitution' && (
            <ConstitutionSection language={language} />
          )}

          {activeTab === 'treasury' && (
            <TreasuryVault
              language={language}
              transactions={transactions}
              setTransactions={setTransactions}
              aiOpsBalanceINR={aiOpsBalanceINR}
              setAiOpsBalanceINR={setAiOpsBalanceINR}
              totalRevenueINR={totalRevenueINR}
              setTotalRevenueINR={setTotalRevenueINR}
              emergencyHalted={emergencyHalted}
              onToggleEmergencyHalt={handleToggleEmergencyHalt}
            />
          )}

          {activeTab === 'micro_business' && (
            <MicroBusinessIncubator
              language={language}
              onSelectForSimulation={handleSelectIdeaForSimulation}
            />
          )}

          {activeTab === 'tech_stack' && (
            <TechStackMatrix language={language} />
          )}

          {activeTab === 'roadmap' && (
            <LegalAndRoadmapSection language={language} />
          )}
        </main>

        {/* Export Code Modal */}
        <ExportCodeModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          language={language}
        />

        {/* 10-Point Intellectual Integrity Audit Modal */}
        <IntegrityAuditModal
          isOpen={isIntegrityAuditOpen}
          onClose={() => setIsIntegrityAuditOpen(false)}
          language={language}
        />

        {/* High Density Footer */}
        <footer className="bg-[#ECEBE8] border-t border-[#141414] text-[#575653] py-4 px-4 text-xs mt-10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px]">
            <div className="flex items-center space-x-2">
              <Sprout className="w-3.5 h-3.5 text-[#141414]" />
              <span className="font-bold text-[#141414] font-serif text-sm">Seed to Forest (बीज से जंगल)</span>
              <span className="text-[#141414]/30">|</span>
              <span className="text-[#575653]">AUTONOMOUS VENTURE OS • DAY 1-90 SEED PHASE</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5 px-2 py-0.5 border border-[#141414]/30 bg-white/60 text-[#141414]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CONSTITUTION: ENFORCED</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 border border-[#141414]/30 bg-white/60 text-[#141414]">
                <Wallet className="w-3.5 h-3.5" />
                <span>TREASURY: ₹20,000 CAP</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
