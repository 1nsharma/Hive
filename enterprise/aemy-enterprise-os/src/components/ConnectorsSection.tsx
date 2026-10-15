import React, { useState, useMemo } from 'react';
import { Connector, Language } from '../types';
import { 
  Search, Filter, CheckCircle2, Shield, Activity, 
  ExternalLink, X, Zap, Database, Cloud, MessageSquare, 
  Layers, Code2, RefreshCw, Radio
} from 'lucide-react';

interface ConnectorsSectionProps {
  connectors: Connector[];
  lang: Language;
}

export const ConnectorsSection: React.FC<ConnectorsSectionProps> = ({
  connectors,
  lang,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeConnector, setActiveConnector] = useState<Connector | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [latency, setLatency] = useState<number>(0);

  const categories = useMemo(() => [
    { id: 'all', labelHi: 'सभी (25)', labelEn: 'All (25)' },
    { id: 'database', labelHi: 'डेटाबेस (5)', labelEn: 'Databases (5)' },
    { id: 'crm', labelHi: 'CRM (3)', labelEn: 'CRM (3)' },
    { id: 'communication', labelHi: 'कम्युनिकेशन (6)', labelEn: 'Communication (6)' },
    { id: 'productivity', labelHi: 'स्प्रेडशीट व उत्पादकता (3)', labelEn: 'Productivity (3)' },
    { id: 'cloud', labelHi: 'क्लाउड व स्टोरेज (3)', labelEn: 'Cloud & Storage (3)' },
    { id: 'finance', labelHi: 'पेमेंट व कॉमर्स (3)', labelEn: 'Finance & Commerce (3)' },
    { id: 'dev', labelHi: 'डेवलपमेंट (2)', labelEn: 'Dev (2)' },
  ], []);

  const filteredConnectors = useMemo(() => {
    return connectors.filter((conn) => {
      const matchesSearch = 
        conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.descriptionHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conn.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'cloud' && (conn.category === 'cloud' || conn.category === 'storage')) ||
        (selectedCategory === 'finance' && (conn.category === 'finance' || conn.category === 'commerce')) ||
        conn.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [connectors, searchQuery, selectedCategory]);

  const handleTestConnection = (conn: Connector) => {
    setTestStatus('testing');
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 25) + 12);
      setTestStatus('success');
    }, 900);
  };

  return (
    <section id="connectors" className="py-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7c5cff]/10 border border-[#7c5cff]/30 text-xs font-semibold tracking-wider text-[#c4b5fd] uppercase mb-4">
            <Radio className="w-3.5 h-3.5 text-[#22d3ee] animate-pulse" />
            <span>{lang === 'hi' ? 'MVP कनेक्टर्स' : 'MVP Connector Framework'}</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            {lang === 'hi' ? 'शीर्ष 25 उच्च-मांग वाले कनेक्टर्स' : 'Top 25 High-Demand Connectors'}
          </h2>

          <p className="text-base sm:text-lg text-[#9a9ab0] leading-relaxed">
            {lang === 'hi'
              ? 'वे टूल्स और प्लेटफ़ॉर्म जो वैश्विक व्यापार में सबसे अधिक उपयोग किए जाते हैं — Aura के प्लग-एंड-प्ले एडाप्टर से सीधे कनेक्ट होंगे।'
              : 'The core ecosystems dominating enterprise and web workflows — connected seamlessly via standardized adapters with zero configuration.'}
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/10 p-3 sm:p-4 rounded-2xl">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a9ab0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'कनेक्टर खोजें (जैसे: Postgres, Slack)...' : 'Search connectors...'}
              className="w-full pl-10 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-white placeholder-[#9a9ab0] focus:outline-none focus:border-[#7c5cff] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9a9ab0] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-[0_2px_12px_rgba(124,92,255,0.3)]'
                    : 'text-[#9a9ab0] hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                {lang === 'hi' ? cat.labelHi : cat.labelEn}
              </button>
            ))}
          </div>

        </div>

        {/* 25 Connectors Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredConnectors.map((conn) => (
            <div
              key={conn.id}
              onClick={() => {
                setActiveConnector(conn);
                setTestStatus('idle');
              }}
              className="group relative p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#7c5cff]/50 transition-all duration-200 cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1 shadow-sm hover:shadow-[0_8px_24px_rgba(124,92,255,0.15)]"
            >
              {/* Connector Icon Symbol */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#3b82f6] flex items-center justify-center text-white font-display font-bold text-lg mb-3 shadow-[0_4px_16px_rgba(124,92,255,0.35)] group-hover:scale-110 transition-transform">
                {conn.symbol}
              </div>

              {/* Name */}
              <h4 className="font-semibold text-sm text-white group-hover:text-[#22d3ee] transition-colors mb-1">
                {conn.name}
              </h4>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-[#9a9ab0] border border-white/5">
                  {conn.category}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#22d3ee]/10 text-[#22d3ee]">
                  {lang === 'hi' ? conn.priority : conn.priorityEn}
                </span>
              </div>

              {/* Hover inspect hint */}
              <div className="mt-3 text-[11px] text-[#7c5cff] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span>{lang === 'hi' ? 'एडाप्टर स्पेक' : 'Inspect'}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {filteredConnectors.length === 0 && (
          <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-white/5">
            <p className="text-sm text-[#9a9ab0]">
              {lang === 'hi' ? 'कोई कनेक्टर नहीं मिला।' : 'No connectors matched your query.'}
            </p>
          </div>
        )}

        {/* Modal / Inspector Drawer for selected connector */}
        {activeConnector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-xl rounded-2xl bg-[#0d0d1a] border border-[#7c5cff]/40 p-6 sm:p-7 shadow-2xl overflow-hidden">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveConnector(null)}
                className="absolute top-4 right-4 text-[#9a9ab0] hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#3b82f6] flex items-center justify-center text-white font-display font-extrabold text-2xl shadow-[0_0_24px_rgba(124,92,255,0.4)]">
                  {activeConnector.symbol}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold text-2xl text-white">
                      {activeConnector.name}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#22d3ee]/15 border border-[#22d3ee]/30 text-[#22d3ee] font-medium">
                      MVP Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-[#9a9ab0] mt-0.5">
                    {lang === 'hi' ? activeConnector.descriptionHi : activeConnector.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4 mb-6">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="text-xs font-semibold text-[#c4b5fd] mb-1 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#22d3ee]" />
                    <span>{lang === 'hi' ? 'प्रोटोकॉल एवं सुरक्षा' : 'Protocol & Security'}</span>
                  </div>
                  <div className="text-xs font-mono text-[#e7e7f0]">
                    {activeConnector.protocol}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] text-[#9a9ab0] block">
                      {lang === 'hi' ? 'जटिलता (Complexity)' : 'Complexity'}
                    </span>
                    <span className="text-xs font-semibold text-white mt-0.5 block">
                      {lang === 'hi' ? activeConnector.complexity : activeConnector.complexityEn}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] text-[#9a9ab0] block">
                      {lang === 'hi' ? 'प्राथमिकता (Priority)' : 'Priority'}
                    </span>
                    <span className="text-xs font-semibold text-[#22d3ee] mt-0.5 block">
                      {lang === 'hi' ? activeConnector.priority : activeConnector.priorityEn}
                    </span>
                  </div>
                </div>

                {/* Sample JSON payload */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#9a9ab0] mb-1.5">
                    <span className="font-mono">{lang === 'hi' ? 'मानकीकृत एडाप्टर स्कीमा' : 'Canonical Adapter Config'}</span>
                    <span className="text-[10px] text-[#22d3ee]">CommonSchema.v1</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#07070d] border border-white/10 text-[11px] font-mono text-[#a5f3fc] overflow-x-auto max-h-36">
                    {JSON.stringify(activeConnector.samplePayload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Live Test Connection Simulator */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-[#9a9ab0]">
                  {testStatus === 'idle' && (
                    <span>{lang === 'hi' ? 'सिमुलेशन तैयार है' : 'Simulation ready'}</span>
                  )}
                  {testStatus === 'testing' && (
                    <span className="text-[#22d3ee] flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      {lang === 'hi' ? 'हैंडशेक एवं टोकन सत्यापन...' : 'Handshake & Token Verification...'}
                    </span>
                  )}
                  {testStatus === 'success' && (
                    <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lang === 'hi' ? `कनेक्ट सफल! लेटेंसी: ${latency}ms` : `Connected! Latency: ${latency}ms`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(activeConnector)}
                    disabled={testStatus === 'testing'}
                    className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:from-[#8b6fff] hover:to-[#4f92ff] rounded-xl shadow-[0_4px_16px_rgba(124,92,255,0.3)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {testStatus === 'testing' 
                      ? (lang === 'hi' ? 'जांच जारी...' : 'Testing...') 
                      : (lang === 'hi' ? 'कनेक्शन टेस्ट करें' : 'Test Connection')}
                  </button>
                  <button
                    onClick={() => setActiveConnector(null)}
                    className="px-3 py-2 text-xs font-medium text-[#9a9ab0] hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    {lang === 'hi' ? 'बंद करें' : 'Close'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
