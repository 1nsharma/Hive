import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Award,
  Globe,
  FileText,
  UserCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { AMIT_SHARMA_IDENTITY_PROFILE } from '../data/mockData';
import { IdentityProfileItem } from '../types';

interface IdentityRoadmapViewProps {
  lang: 'hi' | 'en';
}

export const IdentityRoadmapView: React.FC<IdentityRoadmapViewProps> = ({ lang }) => {
  const [profileItems, setProfileItems] = useState<IdentityProfileItem[]>(AMIT_SHARMA_IDENTITY_PROFILE);
  const [activeStrategyIndex, setActiveStrategyIndex] = useState<number>(0);

  const completedAuditCount = profileItems.filter((p) => p.auditStatus === 'CONFIRMED').length;
  const auditCompletionPct = Math.round((completedAuditCount / profileItems.length) * 100);

  const toggleStatus = (handle: string) => {
    setProfileItems((prev) =>
      prev.map((item) => {
        if (item.handle === handle) {
          return {
            ...item,
            auditStatus: item.auditStatus === 'CONFIRMED' ? 'NEEDS_FIX' : 'CONFIRMED'
          };
        }
        return item;
      })
    );
  };

  const strategicPillars = [
    {
      id: 1,
      titleEn: '1. Niche Identification (विशिष्ट क्षेत्र की पहचान)',
      titleHi: '१. विशिष्ट क्षेत्र की पहचान (Niche Identification)',
      targetYear: '2026',
      icon: '🎯',
      descEn:
        'Avoid competing in generic AI wrappers. Dominate the intersection of "Autonomous AI Agents + Cultural Knowledge Provenance + Indian SME Systems".',
      descHi:
        'सामान्य चैटबॉट या रैपर से बचें। "एआई एजेंट्स + सांस्कृतिक सत्यापन अवसंरचना + भारतीय एमएसएमई" के अनूठे संगम में निर्विवाद विशेषज्ञता स्थापित करें।'
    },
    {
      id: 2,
      titleEn: '2. Practical Proof & Prototyping (व्यावहारिक प्रमाण)',
      titleHi: '२. व्यावहारिक प्रमाण एवं प्रोटोटाइपिंग (Proof & Prototyping)',
      targetYear: '2026',
      icon: '🧪',
      descEn:
        'Ideas mean nothing without execution. The 7-Day Kanpur Pilot provides verified data, 10 CVR records, and a mathematical Kill/Go decision.',
      descHi:
        'केवल विचार पर्याप्त नहीं हैं। ७-दिवसीय कानपुर पायलट के माध्यम से १० सत्यापित सीवीआर रिकॉर्ड्स एवं डेटा-आधारित किल/गो परिणाम तैयार करें।'
    },
    {
      id: 3,
      titleEn: '3. Thought Leadership & Writing (विचारक नेतृत्व)',
      titleHi: '३. विचारक नेतृत्व एवं तकनीकी लेखन (Thought Leadership)',
      targetYear: '2027',
      icon: '✍️',
      descEn:
        'Publish in-depth technical architectural whitepapers on Dev.to, Hashnode, and ArXiv explaining "Why Cultural AI needs Living Provenance Graphs".',
      descHi:
        'Dev.to, Hashnode और अकादमिक मंचों पर गहन तकनीकी शोधपत्र प्रकाशित करें कि कैसे सांस्कृतिक ज्ञान को बिना मतिभ्रम (hallucination) के संरक्षित किया जाए।'
    },
    {
      id: 4,
      titleEn: '4. Build in Public (खुले मंच पर निर्माण)',
      titleHi: '४. सार्वजनिक निर्माण एवं खुला स्रोत (Build in Public)',
      targetYear: '2027',
      icon: '🌐',
      descEn:
        'Open-source the Cultural Verification Record (CVR) JSON-LD schema on GitHub (1nsharma). Share daily experiment logs and lessons learned.',
      descHi:
        'GitHub (1nsharma) पर CVR स्कीमा को ओपन-सोर्स करें। प्रयोग के दैनिक निष्कर्ष और डेटा सार्वजनिक करें ताकि समुदाय का विश्वास बने।'
    },
    {
      id: 5,
      titleEn: '5. Strategic Networking (रणनीतिक नेटवर्किंग)',
      titleHi: '५. रणनीतिक नेटवर्किंग एवं संस्थागत सहयोग (Strategic Networks)',
      targetYear: '2027-2028',
      icon: '🤝',
      descEn:
        'Build deep institutional alliances with BHASHINI, INTACH, UP Tourism, CSJMU History Dept, and artisanal karigar guilds.',
      descHi:
        'भाषिणी (Bhashini), इंटैक (INTACH), राज्य पर्यटन विभागों एवं पारंपरिक कारीगर मंडलों के साथ औपचारिक साझेदारी स्थापित करें।'
    },
    {
      id: 6,
      titleEn: '6. Continuous Credentialing (निरंतर साख अर्जन)',
      titleHi: '६. निरंतर साख अर्जन एवं प्रमाणन (Continuous Credentialing)',
      targetYear: '2028+',
      icon: '🏛️',
      descEn:
        'Formalize patents/trade-secrets around the Cultural Health Index (CHI) and represent India on international ethical AI provenance boards.',
      descHi:
        'सांस्कृतिक स्वास्थ्य सूचकांक (CHI) को मानकीकृत करें और अंतरराष्ट्रीय नैतिक एआई मंचों पर भारतीय सांस्कृतिक संप्रभुता के प्रमुख सूत्रधार बनें।'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Strategic Header */}
      <div className="rounded-xl border border-stone-800 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/20 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <Compass className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'रणनीतिक रोडमैप २०२६ → २०२८+' : 'Strategic Trajectory 2026 → 2028+'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-2">
              {lang === 'hi'
                ? 'उभरते क्षेत्रों में अग्रणी और प्रामाणिक नेतृत्व का निर्माण'
                : 'Establishing Unassailable Authority in Emerging AI Frontiers'}
            </h2>
            <p className="text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              {lang === 'hi'
                ? 'केवल दावे करना पर्याप्त नहीं है। २०२८ के बाद के कृत्रिम बुद्धिमत्ता, नए व्यवसाय मॉडल और ज्ञान संप्रभुता के युग में श्रेष्ठ बनने हेतु ठोस कार्यों, स्पष्ट पहचान और छह-चरणीय कार्ययोजना की रूपरेखा।'
                : 'Mere claims are insufficient. Building pre-eminent leadership for the 2028+ AI landscape requires verifiable proof, canonical digital identity architecture, and structured execution.'}
            </p>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 min-w-[220px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {lang === 'hi' ? 'डिजिटल पहचान ऑडिट स्कोर' : 'Digital Identity Readiness'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400">{auditCompletionPct}%</span>
              <span className="text-xs text-stone-500">
                ({completedAuditCount}/{profileItems.length} Cleaned)
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${auditCompletionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Part 1: The 6 Strategic Pillars (2026 → 2028+) */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-100 flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber-400" />
              {lang === 'hi' ? '६ रणनीतिक स्तंभ: विचार से प्रामाणिक नेतृत्व तक' : 'The 6 Strategic Pillars: Vision to Authority'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi'
                ? 'प्रत्येक स्तंभ पर क्लिक करके कार्ययोजना और समयसीमा देखें'
                : 'Sequential roadmap to establish undisputed authority by 2028'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategicPillars.map((pillar, idx) => {
            const isSelected = activeStrategyIndex === idx;
            return (
              <div
                key={pillar.id}
                onClick={() => setActiveStrategyIndex(idx)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/5 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-900/80 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{pillar.icon}</span>
                  <span className="font-mono text-xs font-bold rounded bg-stone-800 px-2 py-0.5 text-amber-300">
                    {pillar.targetYear}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-stone-100 mt-2">
                  {lang === 'hi' ? pillar.titleHi : pillar.titleEn}
                </h4>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                  {lang === 'hi' ? pillar.descHi : pillar.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Amit Sharma Personal Footprint & Canonical Identity Architecture */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Canonical Architecture
              </span>
              <span className="text-xs text-stone-400 font-mono">AMITSHARMA99976@GMAIL.COM</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-100 mt-1">
              अमित शर्मा (Amit Sharma) • Digital Footprint Audit Console
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Target Canonical Positioning: <strong className="text-amber-300">AI Systems Builder & Technology Architect</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">{lang === 'hi' ? 'कार्रवाई स्थिति:' : 'Status Legend:'}</span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">KEEP</span>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">FIX</span>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">REMOVE</span>
            <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-400">CREATE</span>
          </div>
        </div>

        {/* 4 Action Buckets Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-1">
            <div className="font-bold text-emerald-400 uppercase tracking-wider">KEEP (बनाए रखें)</div>
            <p className="text-stone-300">
              Dev.to लेख (DukaanMitra), Google Scholar अनुसंधान, GitHub (1nsharma) रेपॉजिटरी।
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-1">
            <div className="font-bold text-amber-400 uppercase tracking-wider">FIX (सुधारें)</div>
            <p className="text-stone-300">
              LinkedIn पर नाम "Amit S." को पूरा "Amit Sharma" करें। फेसबुक पर +1 फोन नंबर हटाएँ।
            </p>
          </div>
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-1">
            <div className="font-bold text-rose-400 uppercase tracking-wider">REMOVE (हटाएँ)</div>
            <p className="text-stone-300">
              पुराने व अप्रचलित एग्रीगेटर प्रोफाइल (OpenTalent आदि) जो सर्च परिणामों को खंडित करते हैं।
            </p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-3 space-y-1">
            <div className="font-bold text-sky-400 uppercase tracking-wider">CREATE (सृजित करें)</div>
            <p className="text-stone-300">
              कैनोनिकल व्यक्तिगत डोमेन <strong className="text-sky-300">amitsharma.dev</strong> जो सभी परियोजनाओं का केंद्रीय हब बने।
            </p>
          </div>
        </div>

        {/* Interactive Channel-by-Channel Audit Table */}
        <div className="overflow-x-auto rounded-lg border border-stone-800">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase font-semibold border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">{lang === 'hi' ? 'मंच / चैनल' : 'Platform & Handle'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'संबद्ध भूमिका / कार्य' : 'Associated Role'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'ऑडिट स्थिति' : 'Audit Action'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'रणनीतिक विश्लेषण व निर्देश' : 'Strategic Action Notes'}</th>
                <th className="py-3 px-4 text-right">{lang === 'hi' ? 'टॉगल' : 'Toggle'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {profileItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-100">{item.platform}</div>
                    <div className="font-mono text-stone-400 text-[11px]">{item.handle}</div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-300">{item.currentRole}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                        item.auditStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.auditStatus === 'NEEDS_FIX'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : item.auditStatus === 'REMOVE'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {item.auditStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-300 max-w-xs">{item.notes}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(item.handle)}
                      className="rounded bg-stone-800 hover:bg-stone-700 px-2.5 py-1 text-[11px] font-medium text-stone-200 transition-colors"
                    >
                      {item.auditStatus === 'CONFIRMED' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
