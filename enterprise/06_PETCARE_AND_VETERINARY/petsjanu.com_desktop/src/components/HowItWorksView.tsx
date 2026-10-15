import React from 'react';
import { ArrowRight, QrCode, Shield, Sparkles, CheckCircle2, PhoneCall, AlertTriangle, Heart, ChevronRight } from 'lucide-react';

interface HowItWorksViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

const STEPS = [
  {
    num: '01',
    emoji: '🐕',
    title: 'Create a Free Pet Profile',
    desc: "Fill in your pet's name, photo, breed, age, allergies, and emergency contact. Your pet instantly gets a unique public link like petsjanu.com/p/BRUNO-1029.",
    features: ['100% free digital ID card', 'Medical notes & allergy log', 'Owner phone number masking'],
    accent: '#175741',
    badge: 'FREE FOREVER',
  },
  {
    num: '02',
    emoji: '🏷️',
    title: 'Attach a Smart NFC + QR Tag',
    desc: "Clip your waterproof NFC + QR tag to the collar. Any smartphone tap or camera scan opens Bruno's encrypted profile and pings your phone instantly.",
    features: ['Zero app needed for finders', 'Works on iPhone & Android', 'IP68 waterproof, 5-year lifetime'],
    accent: '#F0A21E',
    badge: '₹499 ONE-TIME',
  },
  {
    num: '03',
    emoji: '🚨',
    title: 'Activate SOS if Bruno Goes Missing',
    desc: 'One tap marks Bruno as Lost. The platform broadcasts a hyper-local SOS alert to 148 nearby pet parents and 6 partner vet clinics within 5km.',
    features: ['148 volunteer pet parents notified', 'Community sighting report map', 'Lost poster generator (PDF/PNG)'],
    accent: '#D5472C',
    badge: 'INSTANT BROADCAST',
  },
  {
    num: '04',
    emoji: '💊',
    title: 'AI Health Guidance, Always On',
    desc: 'Ask about symptoms in Hindi, English, or Hinglish. Our AI triages into 4 risk levels and recommends next steps — including emergency vet routing.',
    features: ['4-tier risk classification', 'Vaccination reminders auto-set', 'Multilingual: Hindi & English'],
    accent: '#175741',
    badge: '24/7 FREE',
  },
];

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  return (
    <div className="view-enter pb-16">
      {/* Dark hero header */}
      <div
        className="dark-section -mx-4 px-4 py-16 text-center relative mb-12"
        style={{ marginTop: '-1rem' }}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            ✨ SIMPLE & DEPENDABLE
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            How <span className="text-amber-400">PetJanu</span> keeps your pet safe
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Four easy steps to give your dog or cat a lifelong digital safety net across India.
          </p>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48L480 16L960 40L1440 4V48H0Z" fill="#FBF6EC" />
        </svg>
      </div>

      {/* Steps */}
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {STEPS.map(({ num, emoji, title, desc, features, accent, badge }, i) => (
          <div
            key={num}
            className="group card-premium p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start"
          >
            {/* Step number */}
            <div className="shrink-0 flex flex-col items-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                style={{ background: accent + '20', border: `2px solid ${accent}40` }}
              >
                {emoji}
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block w-0.5 h-full min-h-[3rem] mt-3" style={{ background: `linear-gradient(to bottom, ${accent}40, transparent)` }} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-black text-stone-400">STEP {num}</span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                  style={{ background: accent + '15', color: accent, border: `1px solid ${accent}30` }}
                >
                  {badge}
                </span>
              </div>
              <h3 className="font-serif font-black text-xl sm:text-2xl text-stone-900">{title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">{desc}</p>
              <ul className="space-y-1.5 pt-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: accent }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="max-w-xl mx-auto mt-12 px-4 text-center space-y-4">
        <h2 className="font-serif text-3xl font-black text-stone-900">Ready to protect <span className="text-[#175741]">your pet?</span></h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-7 py-3.5 rounded-2xl font-black text-sm text-white cursor-pointer flex items-center gap-2 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}
          >
            Start Free — No Credit Card <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
          <button
            onClick={() => onNavigateTab('safety')}
            className="px-7 py-3.5 rounded-2xl font-black text-sm text-[#175741] border-2 border-[#175741]/30 hover:border-[#175741] hover:bg-emerald-50 cursor-pointer transition-all"
          >
            Explore Smart Tags →
          </button>
        </div>
      </div>
    </div>
  );
};
