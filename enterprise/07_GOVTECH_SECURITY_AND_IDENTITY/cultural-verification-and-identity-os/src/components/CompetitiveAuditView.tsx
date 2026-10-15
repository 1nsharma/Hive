import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { COMPETITOR_AUDIT_DATA } from '../data/mockData';

interface CompetitiveAuditViewProps {
  lang: 'hi' | 'en';
}

export const CompetitiveAuditView: React.FC<CompetitiveAuditViewProps> = ({ lang }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <Target className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'प्रतिस्पर्धी ऑडिट v1.1' : 'Competitive Teardown & White-Space Audit v1.1'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100 mt-2">
              {lang === 'hi'
                ? 'बाजार और प्रौद्योगिकी विश्लेषण: सिद्ध श्वेत-स्थान (Defensible White-Space)'
                : 'Market & Tech Landscape: The Defensible White-Space'}
            </h2>
            <p className="text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              {lang === 'hi'
                ? 'हम "संस्कृति" या "एआई" का सामान्य दावा नहीं करते। मौजूदा खिलाड़ी या तो अकादमिक संग्रहालय हैं या साधारण ई-कॉमर्स कैटलॉग। हमारा स्पष्ट अंतर: सामुदायिक सहमति, साक्ष्य-आधारित ऑडिट लेयर और स्थानीय कारीगरों के लिए सीधा आर्थिक चक्र।'
                : 'We avoid hype terms like "first in market". Incumbents are either top-down static museum archives or generic commodity marketplaces. The provable white-space is community-governed verification + transparent economic activation.'}
            </p>
          </div>
        </div>

        {/* The Formal White-Space Thesis Definition */}
        <div className="mt-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-xs space-y-1.5">
          <div className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {lang === 'hi' ? 'कोर परिकल्पना (The Validated Thesis)' : 'The Validated Market Thesis'}
          </div>
          <p className="text-stone-100 text-sm font-serif leading-relaxed">
            "{lang === 'hi'
              ? 'सामुदायिक-शासित सांस्कृतिक बुद्धिमत्ता अवसंरचना जो सत्यापित सांस्कृतिक ज्ञान को खोजने-योग्य, कार्रवाई-योग्य और आर्थिक रूप से उपयोगी एआई अनुभवों में बदलती है।'
              : 'Community-governed cultural intelligence infrastructure that turns verified cultural knowledge into discoverable, actionable and economically useful AI experiences.'}"
          </p>
        </div>
      </div>

      {/* Teardown Matrix Table */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-stone-100">
            {lang === 'hi' ? 'प्रमुख वैश्विक व भारतीय प्रणालियों का तुलनात्मक विच्छेदन' : 'Comparative Systems Teardown'}
          </h3>
          <span className="text-xs text-stone-400">
            {COMPETITOR_AUDIT_DATA.length} {lang === 'hi' ? 'प्रणालियों का विश्लेषण' : 'Models Audited'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">{lang === 'hi' ? 'प्रणाली / खिलाड़ी' : 'Entity / System'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'दायरा एवं फोकस' : 'Core Focus'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'सामुदायिक शासन' : 'Community Governance'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'साक्ष्य / CVR गुणवत्ता' : 'Evidence Provenance'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'आर्थिक चक्र' : 'Economic Loop'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'कहाँ चूकते हैं? (Gap)' : 'Structural Gap'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {COMPETITOR_AUDIT_DATA.map((comp, idx) => (
                <tr key={idx} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-stone-100 whitespace-nowrap">
                    {comp.name}
                  </td>
                  <td className="py-3.5 px-4 text-stone-300">{comp.scope}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-300">{comp.communityGovernance}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-300">{comp.provenanceQuality}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-stone-300">{comp.commercialLoop}</span>
                  </td>
                  <td className="py-3.5 px-4 text-amber-300/90 italic">{comp.whiteSpaceGap}</td>
                </tr>
              ))}

              {/* Our Layer row */}
              <tr className="bg-amber-500/10 border-t-2 border-amber-500/50">
                <td className="py-4 px-4 font-bold text-amber-300 flex items-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  Cultural Verification Layer
                </td>
                <td className="py-4 px-4 text-stone-100 font-medium">
                  Verified Provenance Graph & Economic Experiences
                </td>
                <td className="py-4 px-4 text-emerald-400 font-bold">
                  High (Elders, Karigars, Oral Disputes)
                </td>
                <td className="py-4 px-4 text-emerald-400 font-bold">
                  Audited (District Gazetteers + Audio Tapes)
                </td>
                <td className="py-4 px-4 text-emerald-400 font-bold">
                  High (75% Direct Artisan Payout + Heritage Fund)
                </td>
                <td className="py-4 px-4 text-emerald-300 font-bold">
                  ✓ Fills the gap between raw data, user trust, and artisan livelihood
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Pillars of Structural Moat */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="font-semibold text-amber-400 uppercase tracking-wider">
            1. The Provenance Moat
          </div>
          <p className="text-stone-300 leading-relaxed">
            Generic LLMs hallucinate dates and recipes. The CVR ties every claim to physical gazetteers and primary audio recordings that cannot be scraped on the surface web.
          </p>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="font-semibold text-amber-400 uppercase tracking-wider">
            2. Community Consent Architecture
          </div>
          <p className="text-stone-300 leading-relaxed">
            Access rules (Public, Restricted, Sacred) protect indigenous rights and give local guilds veto power, ensuring ethical AI compliance.
          </p>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="font-semibold text-amber-400 uppercase tracking-wider">
            3. Sovereign Economic Loop
          </div>
          <p className="text-stone-300 leading-relaxed">
            A verified claim is immediately linked to an economic experience (₹499 tasting, ₹1,299 workshop) where 75-85% of revenue reaches the artisan directly.
          </p>
        </div>
      </div>
    </div>
  );
};
