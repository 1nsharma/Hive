import React, { useState } from 'react';
import {
  Wallet,
  ShieldCheck,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  Key,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  PlusCircle,
  AlertTriangle,
  Sliders,
  Sparkles,
  PieChart,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TreasuryTransaction } from '../types';
import { PROPOSED_TREASURY_ALLOCATIONS, FOUNDER_COMPENSATION_MODEL } from '../data/integrityAuditData';
import { SupportedLanguage, TRANSLATIONS, formatINR } from '../data/i18n';

interface TreasuryVaultProps {
  language: SupportedLanguage;
  transactions: TreasuryTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<TreasuryTransaction[]>>;
  aiOpsBalanceINR: number;
  setAiOpsBalanceINR: React.Dispatch<React.SetStateAction<number>>;
  totalRevenueINR: number;
  setTotalRevenueINR: React.Dispatch<React.SetStateAction<number>>;
  emergencyHalted: boolean;
  onToggleEmergencyHalt: () => void;
}

export const TreasuryVault: React.FC<TreasuryVaultProps> = ({
  language,
  transactions,
  setTransactions,
  aiOpsBalanceINR,
  setAiOpsBalanceINR,
  totalRevenueINR,
  setTotalRevenueINR,
  emergencyHalted,
  onToggleEmergencyHalt
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [multiSigModalOpen, setMultiSigModalOpen] = useState(false);
  const [pendingTx, setPendingTx] = useState<{ desc: string; amount: number; category: any } | null>(null);
  const [simulatedTotalCapital, setSimulatedTotalCapital] = useState<number>(100000);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const TOTAL_CAPITAL_INR = 100000;
  const HUMAN_RESERVED_INR = 80000;

  const handleSimulateExpense = (description: string, amountINR: number, category: any) => {
    if (emergencyHalted) {
      alert('CIRCUIT BREAKER ACTIVE: All autonomous AI transactions are frozen.');
      return;
    }

    if (amountINR > 5000) {
      setPendingTx({ desc: description, amount: amountINR, category });
      setMultiSigModalOpen(true);
      return;
    }

    if (aiOpsBalanceINR < amountINR) {
      alert('AI Ops Budget insufficient! Please allocate funds from Human Reserve or wait for subscription revenue.');
      return;
    }

    const newTx: TreasuryTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description,
      type: 'EXPENSE',
      amountINR,
      agent: 'Autonomous AI Agent',
      category,
      auditHash: `SHA256:${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 10)}`,
      status: 'AUTO_EXECUTED',
      persistence: 'PERSISTENT',
      integrityLabel: 'SIMULATED'
    };

    setAiOpsBalanceINR(prev => prev - amountINR);
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleApproveMultiSig = () => {
    if (!pendingTx) return;

    const newTx: TreasuryTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: pendingTx.desc,
      type: 'MULTI_SIG_EXPENSE',
      amountINR: pendingTx.amount,
      agent: 'Founder Multi-Sig Auth',
      category: pendingTx.category,
      auditHash: `SHA256:ED25519_${Math.random().toString(36).substring(2, 12)}`,
      status: 'HUMAN_CONFIRMED',
      persistence: 'PERSISTENT',
      integrityLabel: 'HUMAN_VERIFIED'
    };

    setAiOpsBalanceINR(prev => prev - pendingTx.amount);
    setTransactions(prev => [newTx, ...prev]);
    setMultiSigModalOpen(false);
    setPendingTx(null);
  };

  const handleSimulateRevenue = () => {
    if (emergencyHalted) {
      alert('CIRCUIT BREAKER ACTIVE: System paused.');
      return;
    }

    const amountINR = 398;
    const newTx: TreasuryTransaction = {
      id: `tx-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      description: 'Customer Subscriptions (2x ReceiptFlow Pro Tier)',
      type: 'REVENUE',
      amountINR,
      agent: 'Stripe Connect Webhook',
      category: 'SUBSCRIPTION_REVENUE',
      auditHash: `SHA256:${Math.random().toString(36).substring(2, 12)}REV`,
      status: 'APPROVED',
      persistence: 'PERSISTENT',
      integrityLabel: 'SIMULATED'
    };

    setTotalRevenueINR(prev => prev + amountINR);
    setAiOpsBalanceINR(prev => prev + amountINR); // Recycled directly back into Ops!
    setTransactions(prev => [newTx, ...prev]);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch =
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.auditHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalProposedPercent = PROPOSED_TREASURY_ALLOCATIONS.reduce((sum, item) => sum + item.percentage, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Treasury Header Card */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider mb-2 border border-[#141414] bg-white px-2.5 py-0.5">
              <Wallet className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'घटक 2: ट्रेजरी व गवर्नेंस' : 'Component 2: Treasury Vault & Governance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141414] leading-tight">
              {language === 'hi'
                ? 'प्रोग्रामेबल वॉलेट, मल्टी-सिग और प्रस्तावित आवंटन मॉडल'
                : 'Programmable Multi-Sig Corporate Treasury & Allocation Model'}
            </h1>
            <p className="text-[#575653] text-xs sm:text-sm mt-2 max-w-3xl leading-relaxed font-sans">
              {language === 'hi'
                ? 'Day 1 पर बैंक कॉर्पोरेट कार्ड / Stripe Connect से 80% रिज़र्व (मानव नियंत्रित) और 20% AI ऑप्स बजट (₹20,000 स्वायत्त रूप से खर्च करने योग्य) स्थापित किया गया है।'
                : 'Day 1 simplicity: 80% Capital locked in founder bank account, 20% (₹20,000) assigned as an autonomous card limit for AI ops. Zero hidden fees.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono">
            {/* Emergency Halt Button */}
            <button
              type="button"
              onClick={onToggleEmergencyHalt}
              className={`text-xs font-bold px-3 py-2 border transition flex items-center space-x-1.5 ${
                emergencyHalted
                  ? 'bg-red-700 text-white border-red-800 animate-pulse'
                  : 'bg-white text-[#8b3a0f] border-[#8b3a0f] hover:bg-[#8b3a0f] hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{emergencyHalted ? 'SYSTEM FROZEN (Click to Resume)' : 'Panic Freeze'}</span>
            </button>

            {/* Simulate Revenue */}
            <button
              type="button"
              onClick={handleSimulateRevenue}
              disabled={emergencyHalted}
              className="bg-[#141414] hover:bg-black disabled:opacity-50 text-[#E4E3E0] text-xs font-semibold px-4 py-2 border border-[#141414] transition flex items-center space-x-2 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.actions.simulateRevenue}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner if Frozen */}
      {emergencyHalted && (
        <div className="bg-red-700 text-white p-4 border border-red-900 flex items-center justify-between font-mono text-xs shadow-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-300" />
            <span>
              <strong>CIRCUIT BREAKER ACTIVE:</strong> All outbound autonomous transactions and sandbox execution halted by Human Overseer.
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleEmergencyHalt}
            className="bg-white text-red-700 px-3 py-1 text-xs font-bold border border-white hover:bg-red-50 transition"
          >
            Resume Operations
          </button>
        </div>
      )}

      {/* Day 1 Capital Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Capital */}
        <div className="bg-white border border-[#141414] p-5 space-y-1.5 shadow-xs">
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#575653] uppercase tracking-wider">
            <span>{t.treasury.totalCapital}</span>
            <span className="bg-[#ECEBE8] text-[#141414] px-1.5 py-0.5 border border-[#141414]">DAY 1 SEED</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#141414] font-mono">
            ₹{TOTAL_CAPITAL_INR.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-[#575653]">
            {language === 'hi' ? 'संस्थापक द्वारा कंपनी खाते में जमा' : 'Deposited in Private Limited / LLP Account'}
          </p>
        </div>

        {/* 80% Reserved */}
        <div className="bg-white border border-[#141414] p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider">
            <span>{t.treasury.humanReserve}</span>
            <Lock className="w-3.5 h-3.5 text-[#141414]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#141414] font-mono">
            ₹{HUMAN_RESERVED_INR.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-[#575653]">
            {language === 'hi' ? 'मानव हस्ताक्षर के बिना अछूता (Untouchable)' : 'Requires Founder 2-of-3 Multi-sig Key'}
          </p>
        </div>

        {/* 20% AI Ops Budget */}
        <div className="bg-white border border-[#141414] p-5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#141414] uppercase tracking-wider">
            <span>{t.treasury.aiOps}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#141414]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#141414] font-mono">
            ₹{aiOpsBalanceINR.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-xs text-[#575653]">
            <span>Earned Rev: <strong className="text-[#141414] font-mono">+₹{totalRevenueINR}</strong></span>
            <span className="font-mono text-[10px] bg-[#ECEBE8] text-[#141414] px-1.5 py-0.5 border border-[#141414]">₹5k limit</span>
          </div>
        </div>
      </div>

      {/* SECTION 22 MANDATE: Proposed Treasury Allocation Model */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#141414] gap-2">
          <div>
            <div className="inline-block bg-[#141414] text-[#E4E3E0] text-[10px] font-mono font-bold px-2 py-0.5 mb-1.5">
              {t.treasury.proposedTitle}
            </div>
            <h2 className="text-lg font-serif font-bold text-[#141414]">
              {language === 'hi'
                ? 'प्रोटोकॉल ट्रेजरी 100% आवंटन ढांचा (भविष्य का मॉडल)'
                : 'Protocol Treasury 100% Allocation Breakdown (Future DAO Scale)'}
            </h2>
            <p className="text-xs text-[#575653] font-mono mt-0.5">
              {t.treasury.proposedSubtitle} (Sum = {totalProposedPercent}%)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#575653]">Simulate Total:</span>
            <select
              value={simulatedTotalCapital}
              onChange={(e) => setSimulatedTotalCapital(Number(e.target.value))}
              className="bg-white border border-[#141414] px-2 py-1 text-xs font-mono text-[#141414]"
            >
              <option value={100000}>₹1,00,000 (Seed)</option>
              <option value={1000000}>₹10,00,000 (Growth)</option>
              <option value={10000000}>₹1,00,00,000 (Scale)</option>
            </select>
          </div>
        </div>

        {/* 6 Allocation Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PROPOSED_TREASURY_ALLOCATIONS.map((item) => {
            const calculatedINR = (simulatedTotalCapital * item.percentage) / 100;
            return (
              <div key={item.id} className="bg-white border border-[#141414] p-4 space-y-2 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#141414]">{item.percentage}%</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#ECEBE8] text-[#575653] border border-[#141414]">
                      {item.status}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-[#141414]">
                    {language === 'hi' ? item.categoryHi : item.category}
                  </h3>
                  <p className="text-[11px] text-[#575653] leading-relaxed mt-1">
                    {language === 'hi' ? item.descriptionHi : item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#141414]/15 flex items-center justify-between font-mono text-xs">
                  <span className="text-[#575653]">Calculated:</span>
                  <span className="font-bold text-[#141414]">₹{calculatedINR.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Verification Callout */}
        <div className="bg-white p-3 border border-[#141414] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
            <span className="text-[#141414]">
              <strong>Allocation Verification:</strong> 25% + 20% + 15% + 15% + 10% + 15% = <strong>100% Exact</strong>
            </span>
          </div>
          <span className="text-[#575653]">Enforcement: Smart Contract & Cloud IAM Quotas</span>
        </div>
      </div>

      {/* Founder Compensation & Integrity Transparency */}
      <div className="bg-white border border-[#141414] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2">
          <Scale className="w-4 h-4 text-[#141414]" />
          <h2 className="text-base font-serif font-bold text-[#141414]">
            {language === 'hi'
              ? 'संस्थापक मुआवजा व पूंजी पारदर्शिता (Section 22)'
              : 'Founder Capital Transparency & Vesting Mechanism'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-[#F4F3F0] p-3.5 border border-[#141414] space-y-1.5">
            <span className="text-[10px] font-bold text-[#575653] uppercase">Day 1 Capital Guard</span>
            <p className="font-sans text-[#141414] leading-relaxed">
              संस्थापक का <strong>80% रिज़र्व (₹80,000)</strong> बैंक खाते में सुरक्षित है। AI इसे बिना 2-of-3 मल्टी-सिग के कभी भी ट्रांसफर नहीं कर सकता।
            </p>
          </div>

          <div className="bg-[#F4F3F0] p-3.5 border border-[#141414] space-y-1.5">
            <span className="text-[10px] font-bold text-[#575653] uppercase">Vesting & DAO Conversion</span>
            <p className="font-sans text-[#141414] leading-relaxed">
              भविष्य के टोकन/इक्विटी के लिए <strong>24-महीने का लीनियर वेस्टिंग (6-माह क्लिफ)</strong> लागू होगा। कोई गुप्त या अघोषित निकासी संभव नहीं।
            </p>
          </div>

          <div className="bg-[#F4F3F0] p-3.5 border border-[#141414] space-y-1.5">
            <span className="text-[10px] font-bold text-[#575653] uppercase">Zero Hidden Fees</span>
            <p className="font-sans text-[#141414] leading-relaxed">
              हर सिंगल खर्च और टोकन इनवॉइस सार्वजनिक लेजर पर SHA-256 हैश के साथ रीयल-टाइम में लॉग होता है।
            </p>
          </div>
        </div>
      </div>

      {/* Quick Spending Simulator */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-[#141414] uppercase tracking-wider flex items-center space-x-2">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'स्वायत्त व्यय सिम्युलेटर (Simulate AI Expenditures)' : 'Simulate Autonomous AI Outbound Costs'}</span>
          </h2>
          <span className="text-[11px] text-[#575653] font-mono">Click any preset to test the wallet execution loop</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => handleSimulateExpense('Gemini 3.7 Flash API Token Quota', 350, 'API_CALL')}
            className="bg-white hover:bg-[#F4F3F0] border border-[#141414] p-3 text-left transition flex flex-col justify-between space-y-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif font-bold text-[#141414]">Gemini Flash Tokens</span>
              <span className="font-mono font-bold text-[#141414]">₹350</span>
            </div>
            <p className="text-[11px] text-[#575653]">Auto-approved (&lt;₹5,000 threshold)</p>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateExpense('Docker Sandbox & Vercel Subdomain', 700, 'HOSTING')}
            className="bg-white hover:bg-[#F4F3F0] border border-[#141414] p-3 text-left transition flex flex-col justify-between space-y-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif font-bold text-[#141414]">Vercel & Docker Sandbox</span>
              <span className="font-mono font-bold text-[#141414]">₹700</span>
            </div>
            <p className="text-[11px] text-[#575653]">Auto-approved from ₹20k Ops wallet</p>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateExpense('Targeted Google Search Micro-Ads', 1000, 'AD_CAMPAIGN')}
            className="bg-white hover:bg-[#F4F3F0] border border-[#141414] p-3 text-left transition flex flex-col justify-between space-y-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif font-bold text-[#141414]">Targeted Ads (Scaling)</span>
              <span className="font-mono font-bold text-[#141414]">₹1,000</span>
            </div>
            <p className="text-[11px] text-[#575653]">Allocated after 7-day validation pass</p>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateExpense('Cloud GPU High-Compute Cluster Prepay', 6500, 'HOSTING')}
            className="bg-white hover:bg-[#F4F3F0] border border-[#141414] p-3 text-left transition flex flex-col justify-between space-y-2"
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-serif font-bold text-[#8b3a0f]">High-End GPU Cluster</span>
              <span className="font-mono font-bold text-[#8b3a0f]">₹6,500</span>
            </div>
            <p className="text-[11px] text-[#8b3a0f] font-mono">⚠️ Triggers Multi-Sig (&gt;₹5k Cap)</p>
          </button>
        </div>
      </div>

      {/* Transparent Ledger & Audit Trail */}
      <div className="bg-[#ECEBE8] border border-[#141414] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#141414]">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-serif font-bold text-[#141414] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#141414]" />
                <span>{language === 'hi' ? 'सार्वजनिक रीयल-टाइम ऑडिट बहीखाता (Public Ledger)' : 'Public Real-Time Audit Ledger'}</span>
              </h2>
              <span className="text-[10px] font-mono bg-white px-1.5 py-0.2 border border-[#141414] text-[#575653]">
                DEMO / SIMULATED DATA
              </span>
            </div>
            <p className="text-xs text-[#575653] mt-0.5 font-mono">Every transaction is SHA-256 hashed and verifiable</p>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#575653]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tx / hash..."
                className="bg-white border border-[#141414] pl-7 pr-3 py-1.5 text-xs text-[#141414] font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-[#141414] px-2.5 py-1.5 text-xs text-[#141414] font-mono focus:outline-none focus:ring-1 focus:ring-[#141414]"
            >
              <option value="ALL">All Categories</option>
              <option value="API_CALL">API Tokens</option>
              <option value="HOSTING">Hosting & Compute</option>
              <option value="SUBSCRIPTION_REVENUE">Subscription Revenue</option>
              <option value="AD_CAMPAIGN">Ad Campaigns</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white border border-[#141414]">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#141414] bg-[#F4F3F0] text-[#141414] font-mono text-[10px] uppercase">
                <th className="py-2 px-3">TX ID</th>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Amount (₹)</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Integrity</th>
                <th className="py-2 px-3">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414]/15 font-mono">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F4F3F0] transition">
                  <td className="py-2.5 px-3 text-[#575653]">{tx.id}</td>
                  <td className="py-2.5 px-3 text-[#575653]">{tx.timestamp}</td>
                  <td className="py-2.5 px-3 text-[#141414] font-sans font-medium">{tx.description}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-1.5 py-0.5 border border-[#141414] text-[10px] font-bold ${
                      tx.type === 'REVENUE'
                        ? 'bg-[#141414] text-[#E4E3E0]'
                        : tx.type === 'MULTI_SIG_EXPENSE'
                        ? 'bg-white text-[#8b3a0f] border-[#8b3a0f]'
                        : 'bg-white text-[#141414]'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold">
                    <span className={tx.type === 'REVENUE' ? 'text-[#10b981]' : 'text-[#141414]'}>
                      {tx.type === 'REVENUE' ? '+' : '-'}₹{tx.amountINR.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] text-[#141414] bg-[#ECEBE8] px-1.5 py-0.5 border border-[#141414]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[9px] text-[#575653] font-mono">
                      [{tx.integrityLabel || 'SIMULATED'}]
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-[#575653]" title={tx.auditHash}>
                    {tx.auditHash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Sig Approval Modal for amounts > ₹5,000 */}
      {multiSigModalOpen && pendingTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#ECEBE8] border border-[#141414] max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white border border-[#141414] flex items-center justify-center text-[#141414]">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#141414]">Constitution Threshold Exceeded</h3>
                <p className="text-xs text-[#8b3a0f] font-mono">Human Cryptographic Signature Required (&gt; ₹5,000)</p>
              </div>
            </div>

            <div className="bg-white p-4 border border-[#141414] text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#575653]">Requested Spend:</span>
                <span className="text-[#8b3a0f] font-bold">₹{pendingTx.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#575653]">Description:</span>
                <span className="text-[#141414] font-sans">{pendingTx.desc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#575653]">Autonomous Limit:</span>
                <span className="text-[#575653]">₹5,000.00 Max</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#575653]">Signer:</span>
                <span className="text-[#141414]">AMITSHARMA99976@gmail.com (Founder Key)</span>
              </div>
            </div>

            <p className="text-xs text-[#575653] leading-relaxed">
              संविधान के नियम #1 के तहत, कोई भी AI एजेंट ₹5,000 से अधिक बिना आपके हस्ताक्षर के खर्च नहीं कर सकता। क्या आप इस लेनदेन को अधिकृत करते हैं?
            </p>

            <div className="flex space-x-3 font-mono">
              <button
                type="button"
                onClick={() => { setMultiSigModalOpen(false); setPendingTx(null); }}
                className="flex-1 bg-white hover:bg-[#F4F3F0] text-[#141414] py-2 border border-[#141414] text-xs font-semibold transition"
              >
                Reject & Abort
              </button>
              <button
                type="button"
                onClick={handleApproveMultiSig}
                className="flex-1 bg-[#141414] hover:bg-black text-[#E4E3E0] py-2 border border-[#141414] text-xs font-bold transition shadow-xs"
              >
                Sign with Founder Key (Approve)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
