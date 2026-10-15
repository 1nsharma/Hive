import React, { useState } from 'react';
import { Check, Shield, Tag, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';

interface PricingViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenPreorder: (type: string, price: string) => void;
}

const TIERS = [
  {
    name: 'Digital Pet ID',
    badge: 'FREE FOREVER',
    price: '₹0',
    per: '/ forever',
    desc: 'Every dog and cat parent in India deserves a free digital safety passport.',
    featured: false,
    features: [
      'Public Pet Profile Web Page',
      'Digital ID Card with QR Code',
      '1-Tap Lost Pet SOS Toggle',
      'Vaccination & Deworming Reminders',
      'Basic AI Health Chat',
      'Community Sighting Reports',
    ],
    cta: 'Get Started Free',
    ctaAction: 'auth',
  },
  {
    name: 'Smart Tag Bundle',
    badge: 'MOST POPULAR ★',
    price: '₹499',
    per: '/ tag (one-time)',
    desc: 'Complete protection: digital profile + physical NFC/QR collar tag + unlimited AI care.',
    featured: true,
    features: [
      'Everything in Free, plus:',
      'Dual NFC + QR Collar Tag (waterproof)',
      'Real-Time Scan Alert on WhatsApp',
      'Lost Pet Poster Generator (A4 PDF)',
      'Unlimited AI Symptom Triage',
      'Priority Vet Finder Access',
    ],
    cta: 'Pre-order Smart Tag',
    ctaAction: 'preorder-smart',
  },
  {
    name: 'Metal Premium Tag',
    badge: 'FOUNDER EDITION',
    price: '₹999',
    per: '/ tag (one-time)',
    desc: 'CNC-milled brass or steel tag — adventure-proof, IP68 waterproof, with founder badge.',
    featured: false,
    features: [
      'Everything in Smart Tag Bundle, plus:',
      'CNC-milled brass or steel body',
      'Laser-etched QR + dual NFC',
      'IP68 Waterproof (adventure-proof)',
      'Founding Pet Parent Badge (forever)',
      'Premium gift box packaging',
    ],
    cta: 'Pre-order Metal Tag',
    ctaAction: 'preorder-metal',
  },
];

const FAQS = [
  { q: 'Is the Digital Pet ID really free forever?', a: 'Yes — the digital profile, QR code, public page, SOS toggle, and basic AI chat are 100% free and always will be. We make revenue on tags, tele-vet commissions, and marketplace.' },
  { q: 'What happens if the tag is lost or damaged?', a: 'The Smart Tag comes with a free replacement guarantee. If your NFC + QR tag is lost or physically damaged within 12 months, we send a replacement at no charge.' },
  { q: 'Do finders need to download an app?', a: 'No — that is a core design principle. Any smartphone camera (iOS or Android) can scan the QR code. NFC phones just tap. Zero app installation required.' },
  { q: 'Is my phone number hidden from strangers?', a: 'Yes. PetJanu uses masked call relay and WhatsApp relay. The finder sees a relay button, not your actual number. Your privacy is always protected.' },
  { q: 'Are there monthly subscription fees?', a: 'No monthly fees whatsoever. The digital profile is free forever. Tags are one-time purchases. Tele-vet consultations (₹299) and grooming are pay-per-use only.' },
];

export const PricingView: React.FC<PricingViewProps> = ({ onNavigateTab, onOpenAuth, onOpenPreorder }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCta = (action: string) => {
    if (action === 'auth') onOpenAuth();
    else if (action === 'preorder-smart') onOpenPreorder('NFC + QR Collar Tag', '₹499');
    else if (action === 'preorder-metal') onOpenPreorder('Metal Premium Tag', '₹999');
  };

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
            🏷️ TRANSPARENT INDIAN PRICING
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-black text-white tracking-tight leading-tight">
            Simple, affordable <br /><span className="text-amber-400">pet safety plans</span>
          </h1>
          <p className="text-slate-300 text-base font-medium">
            Start 100% free. Upgrade to smart tags anytime. GST included, no hidden fees.
          </p>
        </div>

        <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0 48L480 16L960 40L1440 4V48H0Z" fill="#FBF6EC" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map(({ name, badge, price, per, desc, featured, features, cta, ctaAction }) => (
            <div
              key={name}
              className={`relative rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all ${
                featured ? 'shadow-2xl scale-105' : 'card-premium'
              }`}
              style={featured ? {
                background: 'linear-gradient(145deg, #0A1F17, #175741)',
                border: '1px solid rgba(240,162,30,0.4)',
              } : {}}
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {badge}
                </div>
              )}
              {!featured && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-stone-100 text-stone-500 self-start">
                  {badge}
                </div>
              )}

              <div className="space-y-3">
                <h3 className={`font-serif font-bold text-xl ${featured ? 'text-white' : 'text-stone-900'}`}>{name}</h3>
                <div className={`text-4xl font-black ${featured ? 'text-amber-400' : 'text-stone-900'}`}>
                  {price}
                  <span className={`text-xs font-normal ml-1 ${featured ? 'text-emerald-300' : 'text-stone-400'}`}>{per}</span>
                </div>
                <p className={`text-xs leading-relaxed font-medium ${featured ? 'text-emerald-100' : 'text-stone-500'}`}>{desc}</p>
                <ul className={`space-y-2 pt-2 border-t ${featured ? 'border-white/15' : 'border-stone-100'}`}>
                  {features.map(f => (
                    <li key={f} className={`flex items-start gap-2 text-xs ${featured ? 'text-emerald-100' : 'text-stone-700'}`}>
                      <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${featured ? 'text-amber-400' : 'text-[#175741]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCta(ctaAction)}
                className={`w-full py-3.5 rounded-2xl font-black text-sm cursor-pointer transition-all ${
                  featured
                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                    : 'border-2 border-[#175741] text-[#175741] hover:bg-emerald-50'
                }`}
              >
                {cta} →
              </button>
            </div>
          ))}
        </div>

        {/* All plans include */}
        <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900">All plans include:</h3>
          <div className="flex flex-wrap justify-center gap-3 text-xs font-bold text-[#175741]">
            {['Free Profile Forever', 'QR Works on All Phones', 'DPDP Act 2023 Compliant', 'SSL 256-bit Encrypted', 'No Monthly Fees', 'Cancel Anytime'].map(f => (
              <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-black text-stone-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border border-stone-200 rounded-2xl bg-white overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <span className="font-bold text-sm text-stone-900">{q}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-1 text-xs text-stone-600 leading-relaxed font-medium border-t border-stone-100 bg-stone-50/50">{a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
