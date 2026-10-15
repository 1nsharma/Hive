import React from 'react';
import { Heart, Mail, Phone, MapPin, Shield, Award, Users, ArrowRight, Star } from 'lucide-react';

interface AboutViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

const VALUES = [
  { icon: '🤝', title: 'Trust & Privacy First',   desc: 'We protect owner privacy while enabling finders to connect instantly via masked calling and WhatsApp relays.',               color: 'border-emerald-200 bg-emerald-50', iconBg: 'bg-emerald-100 text-[#175741]' },
  { icon: '🐕', title: 'Built for Indian Streets', desc: 'India has 62M+ free-roaming dogs. PetJanu is architected for Tier-1 to Tier-3 cities, in Hindi, English, and Hinglish.', color: 'border-amber-200 bg-amber-50',   iconBg: 'bg-amber-100 text-amber-900' },
  { icon: '🩺', title: 'Vet-Verified Intelligence', desc: 'Every AI triage rule is reviewed by veterinary professionals. We apply guardrails that prevent dangerous home treatment.', color: 'border-blue-200 bg-blue-50',   iconBg: 'bg-blue-100 text-blue-800' },
];

const MILESTONES = [
  { year: '2023', event: 'Founded — Bruno got lost in Andheri and came home only by luck. The idea was born.' },
  { year: 'Q1 2024', event: 'Built the first public pet profile prototype. 100 beta pets registered in 2 weeks.' },
  { year: 'Q3 2024', event: 'Launched NFC + QR tag supply chain. First physical tag dispatched in Mumbai.' },
  { year: 'Q4 2024', event: 'Crossed 10,000 registered pets. SOS radar coverage launched across 5 cities.' },
  { year: '2025', event: 'Doctor.js vet finder, AI telemetry, and full platform launch — currently in Waitlist Access.' },
];

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  return (
    <div className="view-enter pb-16">
      {/* Dark hero header */}
      <div
        className="dark-section -mx-4 px-4 py-16 text-center relative mb-12"
        style={{ marginTop: '-1rem' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E, transparent 70%)', filter: 'blur(70px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            🐾 OUR MISSION & STORY
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Every pet deserves <br /><span className="text-amber-400">to come home</span>
          </h1>
          <p className="text-slate-300 text-base font-medium leading-relaxed max-w-lg mx-auto">
            PetJanu was built by pet parents in India who experienced the heartbreak of a missing pet and fragmented veterinary care.
          </p>
        </div>

        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48L480 16L960 40L1440 4V48H0Z" fill="#FBF6EC" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-12">

        {/* Mission banner */}
        <div
          className="rounded-3xl p-8 sm:p-12 text-center text-white space-y-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0A1F17, #175741)' }}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <Heart className="w-10 h-10 text-amber-400 mx-auto relative z-10" />
          <h2 className="font-serif text-2xl sm:text-4xl font-bold relative z-10">Pet Parents Helping Pet Parents</h2>
          <p className="text-sm text-emerald-100 leading-relaxed max-w-2xl mx-auto font-medium relative z-10">
            In India, millions of dogs and cats wander away during Diwali fireworks, unlatched gate moments, or street chases. Without a unified public identity layer, reunions depend purely on luck. We created PetJanu to give every pet an instant digital ID, scannable QR collar tag, and 24/7 AI health guidance — so no family has to experience that heartbreak again.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-sm font-bold relative z-10">
            <div className="text-center"><div className="text-2xl font-black text-amber-400">10,000+</div><div className="text-emerald-200 text-xs font-medium">Pets Protected</div></div>
            <div className="text-center"><div className="text-2xl font-black text-amber-400">50+</div><div className="text-emerald-200 text-xs font-medium">Cities Covered</div></div>
            <div className="text-center"><div className="text-2xl font-black text-amber-400">247</div><div className="text-emerald-200 text-xs font-medium">Partner Vets</div></div>
            <div className="text-center"><div className="text-2xl font-black text-amber-400">4.9★</div><div className="text-emerald-200 text-xs font-medium">Trust Rating</div></div>
          </div>
        </div>

        {/* Core values */}
        <div className="space-y-4">
          <h2 className="font-serif text-3xl font-black text-stone-900 text-center">What we stand for</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map(({ icon, title, desc, color, iconBg }) => (
              <div key={title} className={`card-premium p-6 space-y-3 border ${color}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${iconBg}`}>{icon}</div>
                <h3 className="font-serif font-bold text-lg text-stone-900">{title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder card */}
        <div className="card-premium p-8 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#175741] to-[#0A1F17] flex items-center justify-center text-4xl shrink-0 shadow-md">
            👨‍💻
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-widest">
              Founder & CEO
            </div>
            <h3 className="font-serif font-black text-xl text-stone-900">Amit Sharma</h3>
            <p className="text-xs text-stone-500 font-medium">HSR Layout, Bengaluru · Building PetJanu since 2023</p>
            <p className="text-sm text-stone-600 leading-relaxed font-medium max-w-lg">
              "I built PetJanu after my own dog Bruno was missing for 18 hours. A stranger found him — but had no way to reach me. That day I decided India needed a unified pet safety layer that works for any finder, any pet, any city — without any app."
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="mailto:amit@petsjanu.com" className="flex items-center gap-1.5 text-xs text-[#175741] font-bold hover:underline cursor-pointer">
                <Mail className="w-3.5 h-3.5" /> amit@petsjanu.com
              </a>
              <span className="text-stone-300">·</span>
              <a href="tel:+916393741171" className="flex items-center gap-1.5 text-xs text-[#175741] font-bold hover:underline cursor-pointer">
                <Phone className="w-3.5 h-3.5" /> +91 63937 41171
              </a>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          <h2 className="font-serif text-3xl font-black text-stone-900 text-center">Our journey</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#175741] via-amber-400 to-stone-200" />
            <div className="space-y-4 pl-10">
              {MILESTONES.map(({ year, event }) => (
                <div key={year} className="relative">
                  <div className="absolute -left-10 top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
                  <div className="card-premium p-4">
                    <div className="font-mono text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">{year}</div>
                    <p className="text-sm text-stone-700 font-medium">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pt-4">
          <h2 className="font-serif text-3xl font-black text-stone-900">Join the pack. <span className="text-[#175741] italic">Protect your pet today.</span></h2>
          <button onClick={onOpenAuth} className="px-8 py-4 rounded-2xl font-black text-white text-sm cursor-pointer shadow-lg" style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}>
            Create Free Pet Profile <ArrowRight className="inline w-4 h-4 text-amber-400 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
