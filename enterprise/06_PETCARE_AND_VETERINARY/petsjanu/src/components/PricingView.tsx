import React from 'react';
import { Check, Shield, Tag, Sparkles, ArrowRight, Star } from 'lucide-react';

interface PricingViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenPreorder: (type: string, price: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigateTab, onOpenAuth, onOpenPreorder }) => {
  return (
    <div className="space-y-12 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div id="tour-pricing-header" className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#F0A21E]/20 text-amber-900 border border-[#F0A21E]/30">
          🏷️ TRANSPARENT INDIAN PRICING
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-[#1C2B23]">
          Simple, Affordable <span className="text-[#175741]">Pet Safety Plans</span>
        </h1>
        <p className="text-base text-stone-600 leading-relaxed font-medium">
          Start 100% free with a Digital Pet ID. Upgrade to smart tags or unlimited AI care anytime. GST included, no hidden fees.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Tier 1: Free Starter */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">FREE FOREVER</span>
              <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">Digital Pet ID</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#1C2B23]">₹0</span>
              <span className="text-xs text-stone-500">/ forever</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Perfect for every dog and cat parent in India to create a digital safety passport.
            </p>
            <ul className="text-xs text-stone-700 space-y-2.5 border-t border-stone-100 pt-4">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Public Pet Profile Web Page</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Digital ID Card with QR Code</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> 1-Tap Lost Pet SOS Toggle</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Vaccination &amp; Deworming Reminders</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Basic AI Health Chat Assistant</li>
            </ul>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-xl border border-[#175741] text-[#175741] font-extrabold text-xs hover:bg-emerald-50 cursor-pointer transition-all"
          >
            Create Free Profile
          </button>
        </div>

        {/* Tier 2: Smart Tag Hardware */}
        <div className="p-8 rounded-3xl bg-[#175741] text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden border-2 border-[#F0A21E]">
          <div className="absolute top-0 right-0 bg-[#F0A21E] text-stone-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            RECOMMENDED
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">ONE-TIME HARDWARE</span>
              <h3 className="font-serif text-2xl font-bold text-white">Smart QR / NFC Tag</h3>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#F0A21E]">₹149 – ₹999</span>
                <span className="text-xs text-stone-300">/ one-time</span>
              </div>
              <p className="text-[10px] text-stone-300">Free delivery across India · No monthly fee</p>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-medium">
              Physical collar tag that connects anyone who finds your pet directly to your profile.
            </p>
            <ul className="text-xs text-stone-100 space-y-2.5 border-t border-[#175741]/80 pt-4">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F0A21E] shrink-0" /> <strong>QR Sticker Pack:</strong> ₹149 (Pack of 3)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F0A21E] shrink-0" /> <strong>NFC + QR Smart Tag:</strong> ₹499 (Popular)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F0A21E] shrink-0" /> <strong>Laser Metal Tag:</strong> ₹999 (Premium)</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F0A21E] shrink-0" /> Finder Photo &amp; Map Sighting Reports</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#F0A21E] shrink-0" /> Free replacement if damaged</li>
            </ul>
          </div>

          <button
            onClick={() => onOpenPreorder("NFC + QR Collar Tag", "₹499")}
            className="w-full py-3 rounded-xl bg-[#F0A21E] text-stone-900 font-extrabold text-xs hover:bg-amber-400 cursor-pointer transition-all shadow-md"
          >
            Pre-order Smart Tag (₹499)
          </button>
        </div>

        {/* Tier 3: Premium Membership */}
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">PETJANU PLUS</span>
              <h3 className="font-serif text-2xl font-bold text-[#1C2B23]">Premium AI Subscription</h3>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[#1C2B23]">₹99</span>
              <span className="text-xs text-stone-500">/ month</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              Unlimited AI consultation, skin &amp; stool photo analysis, and multi-family care access.
            </p>
            <ul className="text-xs text-stone-700 space-y-2.5 border-t border-stone-100 pt-4">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Unlimited AI Health Guidance Sessions</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> AI Photo Symptom Analysis</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Multi-Family Account Sharing</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> 10% Off All Shop Orders &amp; Vet Visits</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#175741] shrink-0" /> Priority 24/7 Tele-Vet Call Line</li>
            </ul>
          </div>

          <button
            onClick={() => onOpenPreorder("PetJanu Plus Membership", "₹99/mo")}
            className="w-full py-3 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 cursor-pointer transition-all"
          >
            Start 14-Day Free Trial
          </button>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4 pt-8">
        <h3 className="font-serif text-2xl font-bold text-center text-[#1C2B23]">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-[#E5DFD3] space-y-1">
            <h4 className="font-bold text-sm text-[#1C2B23]">Does the finder need the PetJanu app to scan my pet's tag?</h4>
            <p className="text-xs text-stone-600">No! Any mobile camera or browser can scan the QR code or tap the NFC tag instantly without installing any app.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E5DFD3] space-y-1">
            <h4 className="font-bold text-sm text-[#1C2B23]">Is my personal phone number exposed on the public page?</h4>
            <p className="text-xs text-stone-600">You can choose to mask your phone number using our relay calling system, or display emergency contact numbers directly.</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#E5DFD3] space-y-1">
            <h4 className="font-bold text-sm text-[#1C2B23]">How fast is delivery across India?</h4>
            <p className="text-xs text-stone-600">Smart tags ship within 24 hours from our Mumbai &amp; Bengaluru hubs and arrive in 3-5 business days via Blue Dart / Speed Post.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
