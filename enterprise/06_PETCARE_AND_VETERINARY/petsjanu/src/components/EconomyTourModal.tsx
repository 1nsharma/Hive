import React from 'react';
import { 
  Compass, X, Sparkles, Tag, ShieldCheck, HeartPulse, ShoppingBag, 
  Stethoscope, Lock, Terminal, ArrowRight, Play, CheckCircle2, Award, Zap
} from 'lucide-react';
import { 
  startFullEconomyTour, 
  startRadarTour, 
  startAiSafetyTour, 
  startCommerceTour, 
  startSecurityTour 
} from '../lib/tour/driverTour';

interface EconomyTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const EconomyTourModal: React.FC<EconomyTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const handleLaunchTour = (tourRunner: (nav: (tab: string) => void) => void) => {
    onClose();
    setTimeout(() => {
      tourRunner(onNavigateTab);
    }, 200);
  };

  const pillars = [
    {
      id: 'full',
      title: 'Complete PetJanu Economy Tour',
      subtitle: '8-Pillar Ecosystem Overview · 90 secs',
      desc: 'Tour the entire circular economy: hardware smart tags, zero-paywall radar, clinical AI triage, commerce, and verified services.',
      icon: '✨',
      badge: 'RECOMMENDED',
      badgeColor: 'bg-[#F0A21E] text-stone-900',
      action: () => handleLaunchTour(startFullEconomyTour),
      highlight: true
    },
    {
      id: 'radar',
      title: 'Smart NFC Tag & Lost Pet Radar',
      subtitle: 'Hardware Anchor & Emergency Flow',
      desc: 'Explore the zero-battery collar tags, public QR pages, and fuzzed GPS sighting beacons with zero paywalls.',
      icon: '🏷️',
      badge: 'HARDWARE & SOS',
      badgeColor: 'bg-emerald-100 text-[#175741]',
      action: () => handleLaunchTour(startRadarTour),
      highlight: false
    },
    {
      id: 'ai',
      title: 'AI Safety & Clinical Guardrails',
      subtitle: '24/7 Triage & Safety Policies',
      desc: 'See our strict No-Diagnosis / No-Dosage guardrail, emergency escalation, and multi-lingual Indian symptom analyzer.',
      icon: '🤖',
      badge: 'HEALTHCARE AI',
      badgeColor: 'bg-blue-100 text-blue-900',
      action: () => handleLaunchTour(startAiSafetyTour),
      highlight: false
    },
    {
      id: 'commerce',
      title: 'Marketplace & Services Economy',
      subtitle: 'Curated Products & Tele-Vet Network',
      desc: 'Browse laser-engraved tags, health gear, verified groomers, and instant Razorpay UPI checkout.',
      icon: '🛍️',
      badge: 'COMMERCE & BOOKING',
      badgeColor: 'bg-amber-100 text-amber-900',
      action: () => handleLaunchTour(startCommerceTour),
      highlight: false
    },
    {
      id: 'security',
      title: 'Privacy & Open MCP Developer Network',
      subtitle: 'Model Context Protocol & Trust',
      desc: 'Inspect SHA-256 IP hashing, coordinate fuzzing, and live MCP tool endpoints for external AI agents.',
      icon: '🔒',
      badge: 'PRIVACY & DEVELOPER',
      badgeColor: 'bg-purple-100 text-purple-900',
      action: () => handleLaunchTour(startSecurityTour),
      highlight: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFFDF6] border border-[#E3D9C4] shadow-2xl p-6 md:p-8 space-y-6 text-[#1C2B23]"
        style={{
          boxShadow: '0 25px 60px -15px rgba(28, 43, 35, 0.4)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#175741] border border-emerald-200">
            <Compass className="w-3.5 h-3.5 text-[#175741]" />
            <span>INTERACTIVE DRIVER.JS WALKTHROUGH</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-black text-[#0E3D2F]">
            Explore the PetJanu Economy
          </h2>
          <p className="text-xs md:text-sm text-stone-600 leading-relaxed font-medium">
            Learn how our hardware anchor, zero-paywall lost pet network, responsible clinical AI, and vetted service marketplace create India's most sustainable pet care ecosystem.
          </p>
        </div>

        {/* Tour Pillars List */}
        <div className="space-y-3">
          {pillars.map((p) => (
            <div
              key={p.id}
              onClick={p.action}
              className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                p.highlight
                  ? 'bg-gradient-to-r from-[#175741] to-[#0E3D2F] text-white border-[#104231] shadow-md hover:shadow-lg'
                  : 'bg-white hover:bg-stone-50 border-[#E3D9C4] shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                  p.highlight ? 'bg-white/10 text-white' : 'bg-stone-100 text-stone-800'
                }`}>
                  {p.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-serif font-extrabold text-base ${p.highlight ? 'text-white' : 'text-[#0E3D2F]'}`}>
                      {p.title}
                    </h3>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${p.highlight ? 'text-emerald-100' : 'text-stone-600'}`}>
                    {p.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    p.highlight
                      ? 'bg-[#F0A21E] text-stone-900 group-hover:bg-amber-300'
                      : 'bg-[#175741] text-white group-hover:bg-[#0E3D2F]'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Launch Tour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Economic Model Footer Stats */}
        <div className="pt-4 border-t border-[#E3D9C4] grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="font-serif font-black text-lg text-[#175741] block">₹0</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase">Zero-Paywall SOS</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="font-serif font-black text-lg text-[#175741] block">10,000+</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase">Protected Pets</span>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200">
            <span className="font-serif font-black text-lg text-[#0E3D2F] block">100%</span>
            <span className="text-[10px] text-stone-500 font-bold uppercase">Privacy-Guarded</span>
          </div>
        </div>

      </div>
    </div>
  );
};
