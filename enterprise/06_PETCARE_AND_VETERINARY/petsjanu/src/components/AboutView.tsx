import React from 'react';
import { Heart, Mail, Phone, MapPin, Shield, Award, Users, CheckCircle } from 'lucide-react';

interface AboutViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab, onOpenAuth }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0A21E]/20 text-amber-900 border border-[#F0A21E]/30">
          🐾 OUR MISSION &amp; STORY
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Every Pet Deserves <span className="text-[#175741]">to Come Home</span>
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-medium">
          PetJanu (petsjanu.com) was built by pet parents in India who experienced the heartbreak of missing pets and fragmented care.
        </p>
      </div>

      {/* Mission Statement Box */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#175741] text-white shadow-xl space-y-4 text-center">
        <Heart className="w-10 h-10 text-[#F0A21E] mx-auto animate-pulse" />
        <h2 className="font-serif text-2xl md:text-3xl font-bold">Pet Parents Helping Pet Parents</h2>
        <p className="text-sm text-stone-200 leading-relaxed max-w-2xl mx-auto font-medium">
          In India, millions of dogs and cats wander away during Diwali fireworks, unlatched gate moments, or street chases. Without a unified public identity layer, reunions depend purely on luck. We created PetJanu to give every pet an instant digital ID, scannable QR collar tag, and 24/7 AI health guidance.
        </p>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-xl">
            🤝
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C2B23]">Trust &amp; Privacy First</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            We protect owner privacy while enabling finders to connect instantly via masked calling and WhatsApp relays.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl">
            🐕
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C2B23]">Love for Indie Pets</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            We actively support rescue groups, Indie dog adoption drives, and free smart tag distribution to community feeders.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#175741] flex items-center justify-center font-bold text-xl">
            🩺
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1C2B23]">Responsible AI</h3>
          <p className="text-xs text-stone-600 leading-relaxed font-medium">
            Our AI health guidance provides clear symptom triage with strict veterinary guardrails — never diagnosing, always guiding safely.
          </p>
        </div>
      </div>

      {/* Team / Founder Section */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">Leadership &amp; Founder Team</h3>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
          <div className="w-12 h-12 rounded-2xl bg-[#175741] text-white font-bold flex items-center justify-center text-xl shrink-0">
            AS
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-base">Amit Sharma</h4>
            <p className="text-xs text-[#175741] font-bold">Junior Founder &amp; Product Architect</p>
            <p className="text-xs text-stone-600 mt-1 font-medium">Leading PetJanu's mission to protect pets across India through accessible smart tags and 24/7 AI care guidance.</p>
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">Get in Touch with PetJanu</h3>
          <p className="text-xs text-stone-500">We respond to pet parents within 2 hours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <Mail className="w-5 h-5 text-[#175741]" />
            <h4 className="font-bold text-stone-900 text-sm">Email Support</h4>
            <p className="font-mono text-[#175741]">support@petsjanu.com</p>
            <p className="text-[10px] text-stone-400">Available 24/7 for lost pet emergencies</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <Phone className="w-5 h-5 text-[#175741]" />
            <h4 className="font-bold text-stone-900 text-sm">Direct Helpline</h4>
            <p className="font-mono text-[#175741]">+91 63937 41171</p>
            <p className="text-[10px] text-stone-400">Mon–Sat, 9:00 AM – 8:00 PM IST</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <MapPin className="w-5 h-5 text-[#175741]" />
            <h4 className="font-bold text-stone-900 text-sm">Headquarters</h4>
            <p className="text-stone-700">HSR Layout, Sector 1, Bengaluru, Karnataka 560102, India</p>
          </div>
        </div>
      </div>

    </div>
  );
};
