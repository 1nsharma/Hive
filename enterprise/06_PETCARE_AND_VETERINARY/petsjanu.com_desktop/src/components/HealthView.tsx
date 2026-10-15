import React, { useState } from 'react';
import { Sparkles, Calendar, Stethoscope, Scissors, Check, ArrowRight, Activity } from 'lucide-react';
import { PetHealthAnalytics } from './PetHealthAnalytics';

interface HealthViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

const RISK_LEVELS = [
  { level: 'LOW',             color: '#16A34A', bg: 'bg-emerald-50 border-emerald-200',    label: 'Monitor at Home',         desc: 'Observe for 24 hours. Ensure fresh water. Log energy and appetite.' },
  { level: 'MONITOR',         color: '#D97706', bg: 'bg-amber-50 border-amber-200',         label: 'Watch Closely (12–24h)',   desc: 'Mild concern. Track symptoms and consult a vet if anything worsens.' },
  { level: 'VET RECOMMENDED', color: '#B45309', bg: 'bg-orange-50 border-orange-300',       label: 'Visit Vet Within 24h',    desc: 'Persistent or moderate symptoms. Bring vaccination records. No self-medication.' },
  { level: 'URGENT',          color: '#DC2626', bg: 'bg-red-50 border-red-300',             label: 'Go to Emergency Vet Now', desc: 'Seizures, collapse, heavy bleeding, or poisoning. Do not wait.' },
];

const SERVICES = [
  {
    emoji: '🤖',
    title: 'AI Health Guidance',
    desc: 'Ask anything about symptoms, diet, vomiting, tick fever, or food allergies. Get instant 4-level risk triage with hard vet guardrails.',
    features: ['Free 24/7 access', 'Hinglish & English support', 'Emergency clinic locator'],
    action: 'ai',
    actionLabel: 'Open AI Chat',
    accentBg: 'bg-[#175741]',
  },
  {
    emoji: '🩺',
    title: 'Tele-Vet Consultations',
    desc: 'Book a video or phone call with a verified Indian vet. Secure, affordable, and dispatched from your city.',
    features: ['Verified Indian vets', 'Video & phone call options', '₹299 per consultation'],
    action: 'services',
    actionLabel: 'Book a Vet Call',
    accentBg: 'bg-amber-500',
  },
  {
    emoji: '✂️',
    title: 'Home Grooming Service',
    desc: 'Professional groomers dispatched to your home. Bath, trim, ear cleaning, and nail filing for dogs and cats.',
    features: ['Home visit convenience', 'Certified groomers', 'From ₹499 per session'],
    action: 'services',
    actionLabel: 'Book Grooming',
    accentBg: 'bg-blue-600',
  },
];

export const HealthView: React.FC<HealthViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  const [activeRisk, setActiveRisk] = useState(0);

  return (
    <div className="view-enter pb-16">
      {/* Dark hero header */}
      <div
        className="dark-section -mx-4 px-4 py-16 text-center relative mb-12"
        style={{ marginTop: '-1rem' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5" /> 24/7 PET HEALTH & CARE
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Expert healthcare <br /><span className="text-amber-400">& care</span> for your pet
          </h1>
          <p className="text-slate-300 text-base font-medium leading-relaxed max-w-lg mx-auto">
            Combine instant AI symptom guidance with trusted tele-vets, home grooming, and medical history tracking.
          </p>
        </div>

        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48L480 16L960 40L1440 4V48H0Z" fill="#FBF6EC" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICES.map(({ emoji, title, desc, features, action, actionLabel, accentBg }) => (
            <div key={title} className="card-premium p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${accentBg} text-white flex items-center justify-center text-2xl shadow-md`}>{emoji}</div>
                <h3 className="font-serif font-bold text-xl text-stone-900">{title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">{desc}</p>
                <ul className="space-y-1.5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs text-stone-700">
                      <Check className="w-3.5 h-3.5 text-[#175741] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => onNavigateTab(action)}
                className="w-full py-2.5 rounded-2xl text-xs font-black text-white cursor-pointer transition-all flex items-center justify-center gap-1.5"
                style={{ background: accentBg.includes('175741') ? '#175741' : accentBg.includes('amber') ? '#F0A21E' : '#2563EB' }}
              >
                {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* AI Risk Level System */}
        <div
          className="rounded-3xl p-8 space-y-6 border"
          style={{ background: 'linear-gradient(145deg, #071410, #0A1F17)', borderColor: 'rgba(23,87,65,0.4)' }}
        >
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/25">
              <Activity className="w-3.5 h-3.5" /> AI TRIAGE RISK SYSTEM
            </div>
            <h2 className="text-2xl font-serif font-black text-white">4-level risk classification — <span className="text-amber-400">calm & clear.</span></h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {RISK_LEVELS.map(({ level, color }, i) => (
              <button
                key={level}
                onClick={() => setActiveRisk(i)}
                className={`py-3 px-2 rounded-2xl text-xs font-black uppercase cursor-pointer transition-all border text-center ${
                  activeRisk === i ? 'text-white border-transparent' : 'border-white/10 text-slate-400 hover:bg-white/5'
                }`}
                style={activeRisk === i ? { background: color } : {}}
              >
                {level}
              </button>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border space-y-2 transition-all ${RISK_LEVELS[activeRisk].bg}`}>
            <div className="font-bold text-sm" style={{ color: RISK_LEVELS[activeRisk].color }}>
              {RISK_LEVELS[activeRisk].label}
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">{RISK_LEVELS[activeRisk].desc}</p>
          </div>

          <p className="text-center text-[11px] text-slate-500 font-medium">
            PetJanu AI never replaces a vet — it triages, calms, and routes. Always consult a vet for MONITOR+ cases.
          </p>
        </div>

        {/* Live Health Analytics */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-black text-stone-900">24-Hour <span className="text-[#175741]">Health Telemetry</span></h2>
            <p className="text-xs text-stone-500 font-medium">Real-time biometric tracking for Bruno</p>
          </div>
          <PetHealthAnalytics petName="Bruno" />
        </div>
      </div>
    </div>
  );
};
