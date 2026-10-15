import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Award,
  ShieldCheck,
  Compass,
  MapPin,
  FileText,
  Users,
  Layers
} from 'lucide-react';
import { CulturalHealthMetric } from '../types';

interface CulturalHealthIndexViewProps {
  healthMetric: CulturalHealthMetric;
  lang: 'hi' | 'en';
}

export const CulturalHealthIndexView: React.FC<CulturalHealthIndexViewProps> = ({
  healthMetric,
  lang,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Kanpur Nagar');

  const districtData: Record<string, CulturalHealthMetric> = {
    'Kanpur Nagar': healthMetric,
    'Varanasi (Banaras)': {
      district: 'Varanasi (वाराणसी)',
      coveragePercent: 88,
      communityParticipation: 84,
      evidenceQuality: 92,
      authenticityScore: 90,
      digitalAccessibility: 78,
      economicActivation: 71,
      preservationRisk: 'MODERATE'
    },
    'Lucknow (Awadh)': {
      district: 'Lucknow (लखनऊ)',
      coveragePercent: 79,
      communityParticipation: 81,
      evidenceQuality: 85,
      authenticityScore: 84,
      digitalAccessibility: 72,
      economicActivation: 64,
      preservationRisk: 'MODERATE'
    },
    'Bundelkhand (Jhansi/Banda)': {
      district: 'Bundelkhand (बुंदेलखंड)',
      coveragePercent: 44,
      communityParticipation: 73,
      evidenceQuality: 52,
      authenticityScore: 86,
      digitalAccessibility: 29,
      economicActivation: 22,
      preservationRisk: 'CRITICAL'
    }
  };

  const current = districtData[selectedDistrict] || healthMetric;

  const compositeScore = Math.round(
    (current.coveragePercent +
      current.communityParticipation +
      current.evidenceQuality +
      current.authenticityScore +
      current.digitalAccessibility +
      current.economicActivation) /
      6
  );

  const metricsList = [
    {
      id: 'coverage',
      labelEn: 'Documentation Coverage',
      labelHi: 'दस्तावेजीकरण कवरेज',
      value: current.coveragePercent,
      descEn: 'Proportion of living traditional practices mapped to verified claims',
      descHi: 'सत्यापित दावों के रूप में दर्ज पारंपरिक प्रथाओं का प्रतिशत'
    },
    {
      id: 'participation',
      labelEn: 'Community Participation',
      labelHi: 'सामुदायिक व कारीगर सहभागिता',
      value: current.communityParticipation,
      descEn: 'Active involvement of living craftsmen, elders, and shopkeepers',
      descHi: 'जीवित कारीगरों, बुजुर्गों और हलवाइयों की सक्रिय भागीदारी'
    },
    {
      id: 'evidence',
      labelEn: 'Evidence & Provenance Quality',
      labelHi: 'साक्ष्य एवं स्रोत गुणवत्ता',
      value: current.evidenceQuality,
      descEn: 'Corroboration with district gazetteers, primary audio, and archives',
      descHi: 'जिला गजेटियर, मौखिक ऑडियो टेप और अभिलेखागार से पुष्टि'
    },
    {
      id: 'authenticity',
      labelEn: 'Authenticity Confidence',
      labelHi: 'प्रामाणिकता आत्मविश्वास',
      value: current.authenticityScore,
      descEn: 'Algorithmic confidence rating across community reviews and experts',
      descHi: 'सामुदायिक समीक्षाओं और विशेषज्ञों द्वारा पुष्ट रेटिंग'
    },
    {
      id: 'accessibility',
      labelEn: 'Digital Accessibility',
      labelHi: 'डिजिटल उपलब्धता एवं खोज',
      value: current.digitalAccessibility,
      descEn: 'Discoverability by AI agents, cultural tourists, and consumers',
      descHi: 'एआई एजेंटों, सांस्कृतिक पर्यटकों और उपभोक्ताओं द्वारा खोज-योग्यता'
    },
    {
      id: 'economic',
      labelEn: 'Economic Activation',
      labelHi: 'आर्थिक चक्र एवं कारीगर लाभांश',
      value: current.economicActivation,
      descEn: 'Direct monetization returning revenue into artisan hands',
      descHi: 'कारीगरों के हाथों में प्रत्यक्ष राजस्व वापस लौटने का अनुपात'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-xs font-semibold text-amber-300">
              <Activity className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'सांस्कृतिक स्वास्थ्य सूचकांक (CHI)' : 'Cultural Health Index (CHI) Observatory'}</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100 mt-2">
              {lang === 'hi'
                ? 'क्षेत्रीय सांस्कृतिक स्वास्थ्य एवं संकट वेधशाला'
                : 'Regional Cultural Health & Preservation Observatory'}
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl mt-1 leading-relaxed">
              {lang === 'hi'
                ? 'सांस्कृतिक स्वास्थ्य का अर्थ केवल संग्रहालय बनाना नहीं है। यह मापता है कि क्या जीवित परंपराएं प्रलेखित हैं, समुदाय द्वारा संचालित हैं, और अपने वाहक कारीगरों के लिए आर्थिक रूप से आत्मनिर्भर हैं।'
                : 'Cultural Health is not merely preservation in passive museum glass. It measures living provenance, practitioner participation, and direct economic sustenance for artisanal communities.'}
            </p>
          </div>

          {/* District Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(districtData).map((distKey) => (
              <button
                key={distKey}
                onClick={() => setSelectedDistrict(distKey)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                  selectedDistrict === distKey
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold'
                    : 'border-stone-800 bg-stone-950 text-stone-400 hover:text-stone-200'
                }`}
              >
                {distKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* District Overall Score & Risk Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {lang === 'hi' ? 'समग्र सांस्कृतिक स्वास्थ्य स्कोर' : 'Overall Cultural Health (CHI)'}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-amber-400">{compositeScore}</span>
            <span className="text-stone-500 text-sm">/ 100</span>
          </div>
          <div className="text-xs text-stone-400">
            {lang === 'hi' ? '6 प्रमुख संकेतकों का भारांकित औसत' : 'Weighted composite across 6 vitality vectors'}
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {lang === 'hi' ? 'धरोहर विलुप्ति संकट स्तर' : 'Preservation Risk Rating'}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-bold px-3 py-1 rounded-lg border ${
                current.preservationRisk === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : current.preservationRisk === 'HIGH'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {current.preservationRisk}
            </span>
          </div>
          <div className="text-xs text-stone-400">
            {current.preservationRisk === 'HIGH' || current.preservationRisk === 'CRITICAL'
              ? lang === 'hi'
                ? 'आर्थिक लाभ की कमी के कारण युवा पीढ़ी विमुख हो रही है'
                : 'Youth disengagement due to acute economic disparity'
              : lang === 'hi'
              ? 'पर्यटन सक्रिय, किंतु मौखिक साक्ष्य दस्तावेजीकरण अपेक्षित'
              : 'Tourism active, ongoing provenance required'}
          </div>
        </div>

        <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            {lang === 'hi' ? 'सबसे गंभीर अंतर (Critical Gap)' : 'Primary Vulnerability'}
          </div>
          <div className="text-lg font-bold text-rose-400">
            {lang === 'hi' ? 'आर्थिक चक्र (Economic Activation: 41%)' : 'Economic Loop Failure (41%)'}
          </div>
          <div className="text-xs text-stone-400">
            {lang === 'hi'
              ? 'ज्ञान तो जीवित है, लेकिन बिचौलियों के कारण कारीगरों को पारदर्शी लाभांश नहीं मिलता।'
              : 'Living memory is intact, but lack of direct revenue split threatens generational continuity.'}
          </div>
        </div>
      </div>

      {/* 6 Radar / Vector Progress Bars */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-6 shadow-xl">
        <h3 className="font-serif text-lg font-semibold text-stone-100 flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          {lang === 'hi' ? '6 प्रमुख सांस्कृतिक स्वास्थ्य घटक (Vitality Dimensions)' : '6 Core Vitality Dimensions'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metricsList.map((item) => {
            const isLow = item.value < 50;
            const isMedium = item.value >= 50 && item.value < 75;
            return (
              <div key={item.id} className="space-y-2 rounded-lg border border-stone-800/80 bg-stone-950/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-200">
                    {lang === 'hi' ? item.labelHi : item.labelEn}
                  </span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isLow ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLow ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="text-[11px] text-stone-400 leading-normal">
                  {lang === 'hi' ? item.descHi : item.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Urgent Kanpur Field Action Alerts */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <span>{lang === 'hi' ? 'कानपुर पायलट: तत्काल साक्ष्य संकलन प्राथमिकताएँ' : 'Kanpur Pilot Priority Action Alerts'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg border border-stone-800 bg-stone-900/90 p-3">
            <div className="font-semibold text-stone-200">1. जाजमऊ वनस्पति टैनिंग</div>
            <div className="text-stone-400 mt-1">
              केवल 4 वृद्ध उस्ताद मोची जीवित। बबूल की छाल के सटीक रासायनिक अनुपात का तत्काल ऑडियो रिकॉर्डिंग अनिवार्य।
            </div>
          </div>
          <div className="rounded-lg border border-stone-800 bg-stone-900/90 p-3">
            <div className="font-semibold text-stone-200">2. बिठूर 1857 नौका मल्हार</div>
            <div className="text-stone-400 mt-1">
              82 वर्षीय राम चरन निषाद के मौखिक गीतों का डिजिटल साउंडक्लाउड / सीवीआर अभिलेख तैयार करना।
            </div>
          </div>
          <div className="rounded-lg border border-stone-800 bg-stone-900/90 p-3">
            <div className="font-semibold text-stone-200">3. ठग्गू / बदनाम कुल्फी अनुभव</div>
            <div className="text-stone-400 mt-1">
              गांधीजी के स्वदेशी प्रसंग पर आधारित ₹499 का हेरिटेज फूड वॉक प्रत्यक्ष रूप से 75% लाभांश दुकानदार को सौंपे।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
