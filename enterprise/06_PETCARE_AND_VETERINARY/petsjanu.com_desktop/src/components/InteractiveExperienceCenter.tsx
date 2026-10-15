import React, { useState, useMemo, lazy, Suspense } from 'react';
import {
  Box,
  Radar,
  Activity,
  FileText,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Printer,
  MapPin,
  Star,
  Phone,
  Clock,
  Filter,
  Check,
  Utensils,
  CreditCard,
  Mic
} from 'lucide-react';
import { audioService } from '../lib/audioService';

const AIPetTranslatorStudio = lazy(() => import('./AIPetTranslatorStudio').then(m => ({ default: m.AIPetTranslatorStudio })));
const SOSRadarMap = lazy(() => import('./SOSRadarMap').then(m => ({ default: m.SOSRadarMap })));
const AINutritionCalculator = lazy(() => import('./AINutritionCalculator').then(m => ({ default: m.AINutritionCalculator })));
const DigitalHealthPassport = lazy(() => import('./DigitalHealthPassport').then(m => ({ default: m.DigitalHealthPassport })));

function StationLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3 text-amber-400">
      <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-bold tracking-wider uppercase font-mono">Loading Interactive Station...</span>
    </div>
  );
}

interface InteractiveExperienceCenterProps {
  onOpenPosterModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  setToast?: (msg: string) => void;
  onAddToCart?: (item: any) => void;
}

type StationTab = 'ai-translator' | 'radar' | 'ai-triage' | 'nutrition' | 'passport' | 'poster' | 'vet-finder';

// ── Doctor.js pattern: Vet clinic data engine ─────────────────────────────────
interface VetClinic {
  id: string;
  name: string;
  specialty: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviews: number;
  openNow: boolean;
  hours: string;
  phone: string;
  tags: string[];
  emergency: boolean;
  fee: number;
}

const VET_DATABASE: VetClinic[] = [
  { id: 'v1', name: 'City Animal Hospital', specialty: 'General Practice', address: 'Linking Rd, Bandra W, Mumbai', distanceKm: 0.8, rating: 4.9, reviews: 312, openNow: true, hours: '24/7 Emergency', phone: '+91 98200 12345', tags: ['Dog', 'Cat', 'Surgery', 'Emergency'], emergency: true, fee: 450 },
  { id: 'v2', name: 'Paws & Care Clinic', specialty: 'Dermatology & Allergy', address: 'Juhu Tara Rd, Mumbai', distanceKm: 1.4, rating: 4.7, reviews: 189, openNow: true, hours: '9 AM – 8 PM', phone: '+91 98201 55678', tags: ['Dog', 'Cat', 'Skin', 'Allergy'], emergency: false, fee: 600 },
  { id: 'v3', name: 'VetCare Advanced Centre', specialty: 'Orthopedics & Radiology', address: 'S V Rd, Andheri W, Mumbai', distanceKm: 2.1, rating: 4.8, reviews: 427, openNow: false, hours: '10 AM – 7 PM', phone: '+91 98202 33456', tags: ['Dog', 'Cat', 'Bird', 'X-Ray', 'Surgery'], emergency: false, fee: 800 },
  { id: 'v4', name: 'Dr. Meena\'s Pet Wellness', specialty: 'Homeopathy & Nutrition', address: 'DN Nagar, Andheri W, Mumbai', distanceKm: 2.6, rating: 4.6, reviews: 98, openNow: true, hours: '10 AM – 6 PM', phone: '+91 98203 77890', tags: ['Dog', 'Cat', 'Diet', 'Holistic'], emergency: false, fee: 350 },
  { id: 'v5', name: 'PetCare24 Emergency Clinic', specialty: 'Emergency & Critical Care', address: 'JVLR, Jogeshwari E, Mumbai', distanceKm: 3.2, rating: 4.9, reviews: 521, openNow: true, hours: '24/7 Emergency', phone: '+91 98204 99001', tags: ['Dog', 'Cat', 'Rabbit', 'Emergency', 'ICU'], emergency: true, fee: 500 },
  { id: 'v6', name: 'Green Leaf Veterinary', specialty: 'Exotic Pets & Birds', address: 'Goregaon W, Mumbai', distanceKm: 4.1, rating: 4.5, reviews: 73, openNow: true, hours: '9 AM – 5 PM', phone: '+91 98205 44123', tags: ['Bird', 'Rabbit', 'Reptile', 'Exotic'], emergency: false, fee: 700 },
];

type FilterTag = 'All' | 'Emergency' | 'Open Now' | 'Dog' | 'Cat' | 'Bird' | 'Surgery';

function doctorSearch(clinics: VetClinic[], query: string, filter: FilterTag): VetClinic[] {
  let results = clinics;
  if (filter === 'Emergency') results = results.filter(c => c.emergency);
  else if (filter === 'Open Now') results = results.filter(c => c.openNow);
  else if (filter !== 'All') results = results.filter(c => c.tags.some(t => t === filter));
  if (query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.specialty.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  return results.sort((a, b) => a.distanceKm - b.distanceKm);
}

const SYMPTOM_PRESETS: Record<string, { label: string; icon: string; risk: 'low' | 'monitor' | 'vet' | 'urgent'; summary: string; advice: string; immediateAction: string }> = {
  vomit: {
    icon: '🤮',
    label: 'Repeated Vomiting & Lethargy',
    risk: 'vet',
    summary: 'Moderate to High Clinical Concern',
    advice: 'Persistent vomiting causes rapid dehydration. Withhold solid food for 4 hours, monitor water intake, and consult a registered vet within 12–24 hours.',
    immediateAction: 'Withhold food · Offer small sips of ORS water · Check gum color'
  },
  chocolate: {
    icon: '🍫',
    label: 'Ingested Dark Chocolate (50g)',
    risk: 'urgent',
    summary: 'Acute Toxic Emergency',
    advice: 'Theobromine in chocolate is highly cardiotoxic to dogs. Do NOT wait for symptoms. Rush to the nearest 24/7 emergency vet trauma center immediately.',
    immediateAction: 'RUSH TO CLINIC NOW · Do not induce vomiting without vet instruction'
  },
  appetite: {
    icon: '🥣',
    label: 'Skipped One Morning Meal',
    risk: 'monitor',
    summary: 'Mild / Observational Phase',
    advice: 'Occasional missed meals are common in warm weather. Offer a bland portion (boiled chicken or curd rice) and observe energy levels over the next 12 hours.',
    immediateAction: 'Observe hydration · Offer curd rice · Note bathroom activity'
  },
  tick: {
    icon: '🕷️',
    label: 'Tick / Flea Found on Neck',
    risk: 'low',
    summary: 'Preventative Care Routine',
    advice: 'Remove tick with fine-tipped tweezers from the skin base without crushing the abdomen. Disinfect the bite area and apply vet-recommended spot-on treatment.',
    immediateAction: 'Tweeze out intact · Disinfect bite site · Apply Fipronil spot-on'
  },
  fever: {
    icon: '🌡️',
    label: 'Warm Ears & Heavy Shivering',
    risk: 'vet',
    summary: 'Possible Pyrexia / Infection',
    advice: 'Canine body temperature above 39.5°C indicates fever. Do not give Paracetamol (fatal to pets). Place a damp cool cloth on paws and visit a vet.',
    immediateAction: 'Cool damp cloth on paws · Check rectal temp · NO human fever pills'
  }
};

export const InteractiveExperienceCenter: React.FC<InteractiveExperienceCenterProps> = ({
  onOpenPosterModal,
  onNavigateTab,
  setToast,
  onAddToCart
}) => {
  const [activeStation, setActiveStation] = useState<StationTab>('ai-translator');
  const [selectedSymptom, setSelectedSymptom] = useState('vomit');

  // Poster Lab interactive state
  const [posterReward, setPosterReward] = useState('₹5,000');
  const [posterTheme, setPosterTheme] = useState<'red' | 'amber' | 'dark'>('red');

  // Doctor.js state
  const [vetSearch, setVetSearch] = useState('');
  const [vetFilter, setVetFilter] = useState<FilterTag>('All');
  const [bookedVet, setBookedVet] = useState<string | null>(null);

  const filteredVets = useMemo(
    () => doctorSearch(VET_DATABASE, vetSearch, vetFilter),
    [vetSearch, vetFilter]
  );

  const handleStationChange = (s: StationTab) => {
    setActiveStation(s);
    if (s === 'radar') audioService.playRadarPing();
    else audioService.playSuccess();
  };

  const getRiskBadge = (risk: 'low' | 'monitor' | 'vet' | 'urgent') => ({
    urgent: <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40">🚨 URGENT EMERGENCY</span>,
    vet:    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30">⚠️ VET RECOMMENDED</span>,
    monitor:<span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500 text-white shadow-lg shadow-blue-500/30">🟡 MONITOR 12–24 HRS</span>,
    low:    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">🟢 LOW RISK</span>,
  }[risk]);

  const currentTriage = SYMPTOM_PRESETS[selectedSymptom] || SYMPTOM_PRESETS.vomit;

  const STATIONS = [
    { id: 'ai-translator', label: 'AI Pet Voice Translator', icon: Mic,         tag: 'VOICE AI',    color: 'from-emerald-400 to-teal-600' },
    { id: 'radar',         label: 'SOS Radar',               icon: Radar,       tag: 'LIVE GPS',    color: 'from-cyan-400 to-blue-600' },
    { id: 'ai-triage',     label: 'AI Triage Engine',        icon: Activity,    tag: '24/7 AI',     color: 'from-emerald-400 to-teal-600' },
    { id: 'nutrition',     label: 'AI Diet Planner',         icon: Utensils,    tag: 'CALORIES',    color: 'from-lime-400 to-emerald-600' },
    { id: 'passport',      label: 'Health Passport',         icon: CreditCard,  tag: 'QR WALLET',   color: 'from-purple-400 to-indigo-600' },
    { id: 'vet-finder',    label: 'Doctor.js Finder',        icon: Stethoscope, tag: 'CLINICS',     color: 'from-emerald-400 to-green-600' },
    { id: 'poster',        label: 'Lost Poster Lab',         icon: FileText,    tag: '300 DPI',     color: 'from-rose-400 to-red-600' },
  ] as const;

  return (
    <section
      id="experience-center"
      className="w-full my-12 border border-emerald-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-white relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% -20%, #113627 0%, #07150F 55%, #030806 100%)',
        boxShadow: '0 25px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(240,162,30,0.15)'
      }}
    >
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #10B981, transparent 70%)', filter: 'blur(90px)' }} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold rounded-full mb-3 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          PETJANU FLAGSHIP INTERACTIVE LABS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif leading-tight">
          Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Future of Pet Safety</span> Live
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
          Test drive CNC tag customization, AI nutrition intelligence, emergency passports, live radar dispatch, and Doctor.js vet finder in real-time.
        </p>
      </div>

      {/* Station Navigation Tabs */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mb-8 relative z-10 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md max-w-5xl mx-auto">
        {STATIONS.map(({ id, label, icon: Icon, tag }) => {
          const active = activeStation === id;
          return (
            <button
              key={id}
              onClick={() => handleStationChange(id as StationTab)}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer border relative group ${
                active
                  ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xl shadow-amber-400/20 scale-105'
                  : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-stone-950' : 'text-amber-400'}`} />
              <span>{label}</span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                active ? 'bg-stone-950 text-amber-400' : 'bg-stone-800 text-stone-400'
              }`}>
                {tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Station Rendering with Suspense */}
      <Suspense fallback={<StationLoader />}>
      {/* ── Station 1: AI Pet Voice & Training Translator ────────────── */}
      {activeStation === 'ai-translator' && (
        <div className="relative z-10">
          <AIPetTranslatorStudio
            initialPet={{ name: 'BRUNO', species: 'Dog', breed: 'Indian Pariah / Desi Dog', weight: 18 }}
            setToast={setToast}
          />
        </div>
      )}

      {/* ── Station 2: SOS Radar Incident Map ───────────────────────── */}
      {activeStation === 'radar' && (
        <div className="relative z-10">
          <SOSRadarMap />
        </div>
      )}

      {/* ── Station 3: AI Symptom Triage ────────────────────────────── */}
      {activeStation === 'ai-triage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 bg-slate-950/90 p-6 rounded-3xl border border-emerald-700/60 shadow-2xl space-y-5 backdrop-blur-md">
            {/* Telemetry header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Bruno's AI Telemetry Simulator</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">PULSE: 92 BPM · SpO2: 99%</span>
                {getRiskBadge(currentTriage.risk)}
              </div>
            </div>

            {/* Risk Gauge Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>CLINICAL RISK LEVEL:</span>
                <span className="uppercase text-amber-400">{currentTriage.risk}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-2 rounded-full overflow-hidden bg-slate-900 p-0.5 border border-slate-800">
                <div className={`rounded-sm transition-all ${['low', 'monitor', 'vet', 'urgent'].includes(currentTriage.risk) ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-slate-800'}`} />
                <div className={`rounded-sm transition-all ${['monitor', 'vet', 'urgent'].includes(currentTriage.risk) ? 'bg-blue-500 shadow-sm shadow-blue-500' : 'bg-slate-800'}`} />
                <div className={`rounded-sm transition-all ${['vet', 'urgent'].includes(currentTriage.risk) ? 'bg-amber-500 shadow-sm shadow-amber-500' : 'bg-slate-800'}`} />
                <div className={`rounded-sm transition-all ${currentTriage.risk === 'urgent' ? 'bg-red-600 shadow-sm shadow-red-600 animate-pulse' : 'bg-slate-800'}`} />
              </div>
            </div>

            {/* Symptom selector buttons */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Select Sample Scenario:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(SYMPTOM_PRESETS).map(key => {
                  const item = SYMPTOM_PRESETS[key];
                  const isSelected = selectedSymptom === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedSymptom(key);
                        if (item.risk === 'urgent') audioService.playSosAlarm();
                        else audioService.playSuccess();
                      }}
                      className={`p-3 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-[#175741] text-white border-emerald-400 shadow-lg shadow-emerald-900/50 scale-[1.02]'
                          : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Assessment card */}
            <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">AI Assessment: {currentTriage.summary}</div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Verified Protocol</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentTriage.advice}</p>
              
              <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-amber-200">
                <span className="font-bold text-amber-400 shrink-0">⚡ First Step:</span>
                <span>{currentTriage.immediateAction}</span>
              </div>
            </div>
          </div>

          {/* Right column description */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" /> 24/7 MULTILINGUAL TRIAGE
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-snug font-serif">
              Calm Guidance When Every Minute Counts
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Categorizes symptoms into 4 clear levels in Hindi, English, and Hinglish. Hard guardrails route emergency cases directly to veterinary trauma centers.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero guesswork — strict clinical guardrails prevent incorrect advice</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Trained on Veterinary Council of India toxicity protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>1-tap handover to Doctor.js emergency vet finder</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTab?.('health')}
                className="px-6 py-3 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 cursor-pointer border border-emerald-500 shadow-xl hover:opacity-90 transition-all"
                style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}
              >
                Open Full Health Suite <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
              <button
                onClick={() => handleStationChange('vet-finder')}
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border border-slate-700 bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-amber-400" /> Find Nearby Clinic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Station 4: AI Nutrition & Calorie Lab ────────────────────── */}
      {activeStation === 'nutrition' && (
        <div className="relative z-10 text-stone-900">
          <AINutritionCalculator
            initialPetName="Bruno"
            initialSpecies="Dog"
            initialBreed="Indian Pariah / Desi Dog"
            initialWeight={18}
            onNavigateTab={onNavigateTab}
            setToast={setToast}
          />
        </div>
      )}

      {/* ── Station 5: Digital Health Passport Wallet Card ──────────── */}
      {activeStation === 'passport' && (
        <div className="relative z-10 text-stone-900">
          <DigitalHealthPassport
            setToast={setToast}
          />
        </div>
      )}

      {/* ── Station 6: Lost Poster Lab ──────────────────────────────── */}
      {activeStation === 'poster' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Interactive Poster Mockup */}
          <div className="lg:col-span-6 bg-slate-950/80 p-6 rounded-3xl border border-emerald-800/80 flex flex-col items-center gap-4">
            <div
              className={`w-72 bg-white rounded-xl p-3.5 text-slate-950 space-y-2.5 poster-paper-shadow border-4 transition-all duration-300 ${
                posterTheme === 'red' ? 'border-red-600 shadow-red-950/40' :
                posterTheme === 'amber' ? 'border-amber-500 shadow-amber-950/40' :
                'border-slate-900 shadow-black/80'
              }`}
            >
              {/* Header Banner */}
              <div className={`text-white text-[11px] font-black py-1 px-2 text-center uppercase tracking-wider rounded-sm ${
                posterTheme === 'red' ? 'bg-red-600' :
                posterTheme === 'amber' ? 'bg-amber-500 text-slate-950' :
                'bg-slate-950'
              }`}>
                MISSING PET EMERGENCY ALERT
              </div>

              {/* Photo */}
              <div className="w-full h-32 rounded-lg overflow-hidden relative border border-slate-200">
                <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500" alt="Bruno" className="w-full h-full object-cover" />
                <div className="absolute top-1.5 right-1.5 bg-black/80 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                  LAST SEEN: ANDHERI W
                </div>
              </div>

              {/* Pet Info */}
              <div className="text-center">
                <div className="text-base font-black uppercase tracking-tight text-slate-900">BRUNO</div>
                <div className="text-[10px] text-slate-600 font-bold">Desi Indie / Pariah · Male · 3 Yrs · Microchipped</div>
              </div>

              {/* Reward Banner */}
              <div className="bg-amber-400 text-slate-950 text-xs font-black py-1.5 text-center rounded-lg shadow-sm border border-amber-300">
                REWARD: {posterReward} OFFERED
              </div>

              {/* Contact & QR */}
              <div className="p-2 rounded-lg text-center font-bold text-white space-y-1" style={{ background: '#175741' }}>
                <div className="text-[10px]">Call Owner: +91 63937 41171</div>
                <div className="text-[9px] text-emerald-200 font-mono">Scan QR with phone camera to file instant sighting</div>
              </div>

              {/* Footer print stamp */}
              <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                <span>PETJANU REUNITE ID: IND-10293</span>
                <span>300 DPI CERTIFIED</span>
              </div>
            </div>

            {/* Poster Customization Controls */}
            <div className="w-full max-w-sm space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>REWARD VALUE:</span>
                <div className="flex gap-1.5">
                  {['₹2,000', '₹5,000', '₹10,000', '₹25,000'].map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        setPosterReward(r);
                        audioService.playSuccess();
                        setToast?.(`Reward updated to ${r}`);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        posterReward === r ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>FLYER COLOR:</span>
                <div className="flex gap-1.5">
                  {[
                    { id: 'red', label: '🚨 Crimson' },
                    { id: 'amber', label: '⚠️ Amber' },
                    { id: 'dark', label: '🖤 Noir' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPosterTheme(t.id as any)}
                      className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        posterTheme === t.id ? 'bg-white text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right description */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <FileText className="w-4 h-4" /> ONE-CLICK 300DPI FLYER
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white leading-snug font-serif">
              Print-Ready A4 Lost Pet Posters with Scannable QR
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              When a pet goes missing, every second counts. Generate and download a high-resolution, full-color A4 flyer with photo, direct recovery QR, and reward badge in 1 click.
            </p>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zero graphic design skills needed — pre-formatted with high-visibility fonts</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Unique scannable QR routes directly to the owner's encrypted emergency relay</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Ready to print at home or any local print shop in standard A4 size</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  audioService.playSuccess();
                  onOpenPosterModal?.();
                }}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
              >
                <Printer className="w-4 h-4" /> Customize &amp; Download Free
              </button>
              <button
                onClick={() => {
                  audioService.playSuccess();
                  setToast?.('📄 High-resolution A4 lost flyer generated and ready for print!');
                }}
                className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border border-slate-700 bg-stone-900/80 text-stone-300 hover:text-white hover:bg-stone-800 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> Quick 1-Click Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Station 7: 🩺 Doctor.js — Find a Vet ────────────────────── */}
      {activeStation === 'vet-finder' && (
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search input */}
            <div className="relative flex-1">
              <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={vetSearch}
                onChange={e => setVetSearch(e.target.value)}
                placeholder="Search by clinic name, specialty, or pet type…"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-700"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {(['All', 'Emergency', 'Open Now', 'Dog', 'Cat', 'Bird', 'Surgery'] as FilterTag[]).map(f => (
                <button
                  key={f}
                  onClick={() => setVetFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                    vetFilter === f
                      ? 'bg-amber-400 text-stone-950 border-amber-300'
                      : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Results header */}
          <div className="text-xs text-slate-400 font-medium">
            {filteredVets.length} clinic{filteredVets.length !== 1 ? 's' : ''} found near Andheri W, Mumbai
          </div>

          {/* Clinic cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVets.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
                No clinics match your search. Try a different filter.
              </div>
            ) : (
              filteredVets.map(clinic => (
                <div
                  key={clinic.id}
                  className="p-4 rounded-2xl border transition-all space-y-3"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: bookedVet === clinic.id ? '#F0A21E' : 'rgba(255,255,255,0.08)',
                    boxShadow: bookedVet === clinic.id ? '0 0 0 1px #F0A21E' : 'none',
                  }}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white">{clinic.name}</h4>
                        {clinic.emergency && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white uppercase">24/7 Emergency</span>
                        )}
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium mt-0.5">{clinic.specialty}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {clinic.rating}
                      </div>
                      <div className="text-[10px] text-slate-500">({clinic.reviews})</div>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span>{clinic.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className={clinic.openNow ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{clinic.openNow ? '🟢 ' : '🔴 '}{clinic.hours}</span>
                      </div>
                      <span className="text-slate-300 font-bold">₹{clinic.fee} consult</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">{clinic.distanceKm} km away</span>
                      <span className="text-slate-700">·</span>
                      <div className="flex gap-1 flex-wrap">
                        {clinic.tags.slice(0, 3).map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-bold">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        audioService.playSuccess();
                        setBookedVet(clinic.id);
                        setToast?.(`📅 Appointment requested at ${clinic.name}! Confirmation via WhatsApp in 2 mins.`);
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-all ${
                        bookedVet === clinic.id
                          ? 'bg-amber-400 text-stone-950'
                          : 'text-white hover:opacity-90'
                      }`}
                      style={{ background: bookedVet === clinic.id ? undefined : '#175741' }}
                    >
                      {bookedVet === clinic.id ? (
                        <span className="flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5" /> Booked!</span>
                      ) : 'Book Appointment'}
                    </button>
                    <a
                      href={`tel:${clinic.phone}`}
                      onClick={() => setToast?.(`📞 Calling ${clinic.name}…`)}
                      className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:border-amber-400 hover:text-amber-400 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Powered by footer */}
          <div className="text-center text-[10px] font-mono text-slate-600 pt-2">
            DOCTOR.JS ENGINE · LIVE VET DATABASE · PETJANU PARTNER CLINICS ACROSS INDIA
          </div>
        </div>
      )}
      </Suspense>
    </section>
  );
};
