import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  TrendingUp,
  Award,
  AlertCircle,
  FileCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';
import { CulturalClaim, KillGoMetrics, TrustExperimentVote, ConversionEvent } from '../types';

interface ExperimentSuiteProps {
  claims: CulturalClaim[];
  metrics: KillGoMetrics;
  setMetrics: React.Dispatch<React.SetStateAction<KillGoMetrics>>;
  votes: TrustExperimentVote[];
  conversions: ConversionEvent[];
  onNavigateTab: (tab: string) => void;
  lang: 'hi' | 'en';
}

export const ExperimentSuite: React.FC<ExperimentSuiteProps> = ({
  claims,
  metrics,
  setMetrics,
  votes,
  conversions,
  onNavigateTab,
  lang,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const isTruthPass = metrics.truthApprovalRate >= 80;
  const isTrustPass = metrics.trustPreferenceRate >= 70;
  const isConversionPass = metrics.conversionLift >= 20;
  const isSustainabilityPass = metrics.sustainabilityRetention >= 60;
  const isOverallGo = isTruthPass && isTrustPass && isConversionPass && isSustainabilityPass;

  const verifiedClaimsCount = claims.filter((c) => c.status === 'VERIFIED').length;
  const totalClaimsCount = claims.length;

  const daysProtocol = [
    {
      day: 1,
      nameEn: 'Day 1: Claim Identification',
      nameHi: 'पहला दिन: दावों की पहचान',
      taglineEn: 'Identify 10 testable micro-cultural claims in Kanpur',
      taglineHi: 'कानपुर के 10 परीक्षण-योग्य सांस्कृतिक दावों की पहचान',
      status: 'COMPLETED',
      deliverable: '10 Structured Claims Registry (Food, Saddlery, River Ballads)',
      actionTab: 'claims',
      actionLabelEn: 'Inspect Identified Claims',
      actionLabelHi: 'पहचाने गए दावों की समीक्षा करें',
      detailsEn:
        'Selected Kanpur micro-cluster covering Thaggu Ke Laddu (1945), Badnam Kulfi (1948), Banarasi Misthan Bhandar Chura-Matar (1952), Jajmau Saddlery (1890s), Bithoor Brahmavart Ghat Boatmen Oral Chants, and Lal Bangla Makhan Malai.',
      detailsHi:
        'कानपुर के विशिष्ट सांस्कृतिक धरोहरों का चयन: ठग्गू के लड्डू (1945), बदनाम कुल्फी, नयागंज बनारसी चूड़ा-मटर, जाजमऊ वनस्पति सैडलरी, बिठूर ब्रह्मावर्त घाट लोकगीत एवं लाल बंगला मक्खन मलाई।'
    },
    {
      day: 2,
      nameEn: 'Day 2: Evidence Mapping',
      nameHi: 'दूसरा दिन: साक्ष्य मानचित्रण',
      taglineEn: 'Link primary evidence to each claim (Gazetteers, Archives, Oral Tapes)',
      taglineHi: 'प्रत्येक दावे को मूल साक्ष्यों (गजेटियर, अभिलेखागार, मौखिक टेप) से जोड़ना',
      status: 'COMPLETED',
      deliverable: 'Evidence Graph & Cultural Verification Records (CVRs)',
      actionTab: 'claims',
      actionLabelEn: 'Open Evidence Graph',
      actionLabelHi: 'साक्ष्य ग्राफ़ खोलें',
      detailsEn:
        'Gathered 1908 Imperial Gazetteer citations, 1968 UP District Gazetteer records, 3rd generation audio testimonies, and municipal market records.',
      detailsHi:
        '1908 का इम्पीरियल गजेटियर, 1968 का कानपुर जिला गजेटियर, तीसरी पीढ़ी के हलवाइयों व दस्तकारों के मौखिक ऑडियो साक्ष्य एकत्र किए गए।'
    },
    {
      day: 3,
      nameEn: 'Day 3: Practitioner Review ("बोलिए")',
      nameHi: 'तीसरा दिन: कारीगर व हलवाई समीक्षा ("बोलिए")',
      taglineEn: 'Take claims back to living practitioners for audio confirmation or correction',
      taglineHi: 'जीवित कारीगरों के पास जाकर मौखिक ऑडियो गवाही व सत्यापन प्राप्त करना',
      status: 'COMPLETED',
      deliverable: 'Audio Testimonies & Karigar Guild Approvals',
      actionTab: 'voice_intake',
      actionLabelEn: 'Test Voice Intake Simulator',
      actionLabelHi: 'मौखिक गवाही सिमुलेटर आज़माएँ',
      detailsEn:
        'Conducted oral review with Prakash Ram Tiwari family, Ustad Rafiq Ahmed in Jajmau, and Bithoor boatmen. 1 correction noted regarding modern eco-tanning.',
      detailsHi:
        'प्रकाश राम तिवारी परिवार, जाजमऊ के उस्ताद रफीक अहमद और बिठूर के मल्लाहों से ऑडियो संवाद। एक शुद्धि पत्र दर्ज किया गया।'
    },
    {
      day: 4,
      nameEn: 'Day 4: Asset Creation (Version A vs Version B)',
      nameHi: 'चौथा दिन: एसेट निर्माण (संस्करण A बनाम B)',
      taglineEn: 'Create Control (generic Google Maps) vs Intervention (CVR + Provenance)',
      taglineHi: 'नियंत्रण (साधारण गूगल मैप्स) बनाम हस्तक्षेप (सत्यापित CVR + साक्ष्य)',
      status: 'COMPLETED',
      deliverable: 'Side-by-Side Comparative Interfaces for Testing',
      actionTab: 'ab_test',
      actionLabelEn: 'Open A/B Comparison Sandbox',
      actionLabelHi: 'A/B तुलनात्मक सैंडबॉक्स खोलें',
      detailsEn:
        'Built Version A (generic star rating and basic address) vs Version B (Gold Verified Badge, archival narrative, gazetteer citations, 75% artisan revenue split, ₹499 tasting booking).',
      detailsHi:
        'संस्करण A (साधारण स्टार रेटिंग व पता) और संस्करण B (स्वर्ण सत्यापन बैज, गांधीजी के स्वदेशी इतिहास का संदर्भ, गजेटियर साक्ष्य एवं 75% कारीगर लाभांश) तैयार किया गया।'
    },
    {
      day: 5,
      nameEn: 'Day 5: User Exposure & Trust Testing',
      nameHi: 'पाँचवाँ दिन: उपयोगकर्ता विश्वास परीक्षण',
      taglineEn: 'Expose 50+ users to Version A vs Version B and measure trust metrics',
      taglineHi: 'उपयोगकर्ताओं को A और B दिखाकर विश्वास सूचकांक का मापन',
      status: 'COMPLETED',
      deliverable: 'Trust Preference Ratio & Qualitative Feedback Logs',
      actionTab: 'ab_test',
      actionLabelEn: 'View Live Trust Analytics',
      actionLabelHi: 'लाइव ट्रस्ट एनालिटिक्स देखें',
      detailsEn:
        'Target was ≥70% preference for verified provenance. Current result: 80% preference rate for Version B across tourists and heritage enthusiasts.',
      detailsHi:
        'लक्ष्य था ≥70% उपयोगकर्ताओं का सत्यापन को वरीयता देना। वास्तविक परिणाम: 80% ने संस्करण B की प्रामाणिकता को चुना।'
    },
    {
      day: 6,
      nameEn: 'Day 6: Economic Action Tracking',
      nameHi: 'छठा दिन: आर्थिक कार्रवाई ट्रैकिंग',
      taglineEn: 'Track actual booking intent, tasting orders, and artisan conversion',
      taglineHi: 'वास्तविक बुकिंग इरादा, चखने का ऑर्डर व कारीगर रूपांतरण ट्रैक करना',
      status: 'COMPLETED',
      deliverable: 'Conversion Differential & Artisan Direct Revenue Split',
      actionTab: 'ab_test',
      actionLabelEn: 'View Conversion Lift Data',
      actionLabelHi: 'रूपांतरण वृद्धि डेटा देखें',
      detailsEn:
        'Tracked +34% conversion lift in bookings when cultural provenance and direct artisan share were made transparent.',
      detailsHi:
        'जब सांस्कृतिक प्रमाण और कारीगर को मिलने वाले 75% हिस्से को पारदर्शी किया गया, तो बुकिंग में +34% की वृद्धि दर्ज हुई।'
    },
    {
      day: 7,
      nameEn: 'Day 7: Stakeholder Feedback & Kill/Go Matrix',
      nameHi: 'सातवाँ दिन: स्टेकहोल्डर प्रतिक्रिया व किल/गो निर्णय',
      taglineEn: 'Strict evaluation against 4 thresholds to decide: Build or Kill',
      taglineHi: '4 कड़े मानदंडों पर मूल्यांकन: क्या ऐप का कोड लिखना है या विचार त्यागना है?',
      status: 'COMPLETED',
      deliverable: 'Formal Go/Kill Decision Memo & Execution Authorization',
      actionTab: 'experiment',
      actionLabelEn: 'Review Kill/Go Metrics Below',
      actionLabelHi: 'नीचे किल/गो मेट्रिक्स की समीक्षा करें',
      detailsEn:
        'All 4 thresholds passed: Truth (83.3% >= 80%), Trust (80% >= 70%), Economic Lift (+34% >= +20%), Sustainability (75% >= 60%). The project receives a GO verdict.',
      detailsHi:
        'सभी 4 सीमाएं पार हुईं: सत्यता (83.3% >= 80%), विश्वास (80% >= 70%), आर्थिक उछाल (+34% >= +20%), स्थिरता (75% >= 60%)। परियोजना को आगे बढ़ने (GO) की अनुमति मिली।'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner: Scientific Experiment Protocol */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/20 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Compass className="h-3.5 w-3.5" />
              <span>{lang === 'hi' ? 'नो-कोड सत्यापन प्रोटोकॉल v1.0 • कानपुर पायलट' : '7-Day No-Code Experiment Protocol v1.0 • Kanpur Pilot'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
              {lang === 'hi' ? 'परिकल्पना → साक्ष्य → प्रयोग → परिणाम → निर्णय' : 'Hypothesis → Evidence → Experiment → Result → Decision'}
            </h2>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              {lang === 'hi'
                ? 'हम तब तक ऐप का व्यापक कोड नहीं लिखते जब तक कि 7 दिनों का यह सख्त डेटा-चालित प्रयोग स्पष्ट "GO" का संकेत न दे। कानपुर के खाद्य, चमड़ा शिल्प एवं गंगा घाटों के 10 सांस्कृतिक दावों का वास्तविक परीक्षण।'
                : 'We write zero application code until this strict 7-day data-driven experiment yields an unambiguous "GO" signal. Real-world validation of 10 Kanpur cultural claims across food, leathercraft, and river traditions.'}
            </p>
          </div>

          {/* Kill / Go Status Box */}
          <div className="flex flex-col items-start md:items-end justify-center rounded-xl border border-stone-800 bg-stone-900/90 p-4 min-w-[240px]">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              {lang === 'hi' ? 'डे 7 किल/गो अंतिम निर्णय' : 'Day 7 Kill/Go Decision'}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div
                className={`text-3xl font-extrabold tracking-tight ${
                  isOverallGo ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isOverallGo ? 'VERDICT: GO' : 'VERDICT: PIVOT'}
              </div>
            </div>
            <div className="mt-1 text-xs text-stone-400">
              {isOverallGo
                ? lang === 'hi'
                  ? '4/4 कड़े मानक पूरे हुए (कोड निर्माण अनुमोदित)'
                  : '4/4 Strict Criteria Passed (Build Authorized)'
                : lang === 'hi'
                ? 'मानक अपूर्ण (पुनः परीक्षण अपेक्षित)'
                : 'Criteria unmet (Further tests required)'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Strict Kill/Go Thresholds Live Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg font-semibold text-stone-100 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            {lang === 'hi' ? 'चार अनिवार्य किल/गो सीमाएँ (Thresholds)' : 'The 4 Mandatory Kill/Go Thresholds'}
          </h3>
          <span className="text-xs text-stone-400">
            {lang === 'hi' ? 'नीचे स्लाइडर या डेटा से लाइव समायोजित करें' : 'Interactive evaluation criteria'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Threshold 1: Truth */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              isTruthPass
                ? 'border-emerald-500/40 bg-stone-900/90'
                : 'border-rose-500/40 bg-stone-900/90'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">
                1. {lang === 'hi' ? 'सत्यता मानक (Truth)' : 'Truth Metric'}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  isTruthPass ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isTruthPass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {isTruthPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {metrics.truthApprovalRate.toFixed(1)}%
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi' ? 'लक्ष्य: ≥ 80% दावे साक्ष्यों से पुष्ट' : 'Target: ≥ 80% claims verified'}
            </div>
            <div className="mt-3 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isTruthPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(metrics.truthApprovalRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Threshold 2: Trust */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              isTrustPass
                ? 'border-emerald-500/40 bg-stone-900/90'
                : 'border-rose-500/40 bg-stone-900/90'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">
                2. {lang === 'hi' ? 'विश्वास मानक (Trust)' : 'Trust Metric'}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  isTrustPass ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isTrustPass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {isTrustPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {metrics.trustPreferenceRate.toFixed(1)}%
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi' ? 'लक्ष्य: ≥ 70% उपयोगकर्ता B को चुनें' : 'Target: ≥ 70% prefer verified B'}
            </div>
            <div className="mt-3 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isTrustPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(metrics.trustPreferenceRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Threshold 3: Economic Action */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              isConversionPass
                ? 'border-emerald-500/40 bg-stone-900/90'
                : 'border-rose-500/40 bg-stone-900/90'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">
                3. {lang === 'hi' ? 'आर्थिक उछाल (Conversion)' : 'Economic Lift'}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  isConversionPass ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isConversionPass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {isConversionPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              +{metrics.conversionLift.toFixed(1)}%
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi' ? 'लक्ष्य: ≥ +20% रूपांतरण वृद्धि' : 'Target: ≥ +20% over control'}
            </div>
            <div className="mt-3 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isConversionPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(metrics.conversionLift * 2, 100)}%` }}
              />
            </div>
          </div>

          {/* Threshold 4: Sustainability */}
          <div
            className={`rounded-xl border p-4 transition-all ${
              isSustainabilityPass
                ? 'border-emerald-500/40 bg-stone-900/90'
                : 'border-rose-500/40 bg-stone-900/90'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-semibold uppercase tracking-wider">
                4. {lang === 'hi' ? 'स्थिरता (Sustainability)' : 'Retention'}
              </span>
              <span
                className={`flex items-center gap-1 font-bold ${
                  isSustainabilityPass ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isSustainabilityPass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                {isSustainabilityPass ? 'PASS' : 'FAIL'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-bold text-stone-100">
              {metrics.sustainabilityRetention.toFixed(1)}%
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {lang === 'hi' ? 'लक्ष्य: ≥ 60% प्रतिष्ठान सक्रिय' : 'Target: ≥ 60% merchant retention'}
            </div>
            <div className="mt-3 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${isSustainabilityPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(metrics.sustainabilityRetention, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Stepper Navigation & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7 Days Navigation List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            {lang === 'hi' ? 'दिन-प्रतिदिन का प्रोटोकॉल चरण' : 'Day-by-Day Experiment Protocol'}
          </div>
          {daysProtocol.map((p) => {
            const isSelected = selectedDay === p.day;
            return (
              <button
                key={p.day}
                id={`day-selector-${p.day}`}
                onClick={() => setSelectedDay(p.day)}
                className={`w-full text-left rounded-xl p-3.5 border transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-amber-500/60 bg-stone-900 shadow-md ring-1 ring-amber-500/20'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-900/60 hover:border-stone-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {p.day}
                    </span>
                    <span className="text-sm font-semibold text-stone-100">
                      {lang === 'hi' ? p.nameHi : p.nameEn}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-1 ml-8">
                    {lang === 'hi' ? p.taglineHi : p.taglineEn}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium shrink-0 mt-1">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Day Deep-Dive */}
        <div className="lg:col-span-7">
          {(() => {
            const current = daysProtocol.find((p) => p.day === selectedDay) || daysProtocol[0];
            return (
              <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-6 space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      {lang === 'hi' ? `चरण ${current.day} विवरण` : `Phase ${current.day} Execution`}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-stone-100 mt-0.5">
                      {lang === 'hi' ? current.nameHi : current.nameEn}
                    </h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {lang === 'hi' ? 'सफलतापूर्वक पूर्ण' : 'Completed'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      {lang === 'hi' ? 'उद्देश्य एवं विधि' : 'Objective & Methodology'}
                    </h5>
                    <p className="text-sm text-stone-200 mt-1 leading-relaxed">
                      {lang === 'hi' ? current.detailsHi : current.detailsEn}
                    </p>
                  </div>

                  <div className="rounded-lg border border-stone-800 bg-stone-950/60 p-4">
                    <div className="text-xs font-medium text-stone-400">
                      {lang === 'hi' ? 'मुख्य मूर्त परिणाम (Key Deliverable)' : 'Key Artifact Generated'}
                    </div>
                    <div className="text-sm font-semibold text-amber-300 mt-0.5">
                      {current.deliverable}
                    </div>
                  </div>

                  {/* Day-specific quick stats */}
                  {current.day === 1 && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3">
                        <div className="text-xs text-stone-400">{lang === 'hi' ? 'कुल पहचाने गए दावे' : 'Claims Identified'}</div>
                        <div className="text-xl font-bold text-stone-100 mt-0.5">{claims.length} / 10</div>
                      </div>
                      <div className="rounded-lg border border-stone-800 bg-stone-950/40 p-3">
                        <div className="text-xs text-stone-400">{lang === 'hi' ? 'क्षेत्र कवरेज' : 'Categories'}</div>
                        <div className="text-sm font-semibold text-stone-200 mt-0.5">मिष्ठान, चमड़ा शिल्प, मौखिक गाथाएं</div>
                      </div>
                    </div>
                  )}

                  {current.day === 4 && (
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-stone-300 leading-relaxed">
                      💡 {lang === 'hi'
                        ? 'संस्करण A बनाम B परीक्षण सीधे यह सिद्ध करता है कि क्या लोग केवल 4.5 स्टार रेटिंग की बजाय ऐतिहासिक प्रमाणों और कारीगर को मिलने वाले प्रत्यक्ष लाभांश के आधार पर ₹499 का हेरिटेज वॉक या प्रामाणिक उत्पाद खरीदने को तैयार हैं।'
                        : 'The A/B test directly proves whether consumers are willing to book a ₹499 heritage tasting when presented with verified provenance and direct artisan revenue transparency vs a standard sterile map listing.'}
                    </div>
                  )}

                  {current.day === 7 && (
                    <div className="space-y-3 pt-2">
                      <div className="text-xs font-medium text-stone-300">
                        {lang === 'hi' ? 'इंटरएक्टिव परिदृश्य सिमुलेटर (Sensitivity Test):' : 'Interactive Sensitivity Test:'}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-stone-400">
                          <span>{lang === 'hi' ? 'रूपांतरण वृद्धि (Conversion Lift)' : 'Simulate Conversion Lift'}: {metrics.conversionLift}%</span>
                          <span className={metrics.conversionLift >= 20 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {metrics.conversionLift >= 20 ? '>= 20% (OK)' : '< 20% (KILL/PIVOT)'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          value={metrics.conversionLift}
                          onChange={(e) =>
                            setMetrics((prev) => ({ ...prev, conversionLift: Number(e.target.value) }))
                          }
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Button to jump to corresponding tool */}
                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    {lang === 'hi' ? 'संबंधित मॉड्यूल में गहराई से देखें:' : 'Interact with this day’s tooling:'}
                  </span>
                  <button
                    id={`jump-to-tab-${current.day}`}
                    onClick={() => onNavigateTab(current.actionTab)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-amber-400 transition-colors shadow"
                  >
                    <span>{lang === 'hi' ? current.actionLabelHi : current.actionLabelEn}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
