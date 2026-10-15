import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Star, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Check, 
  Search,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick } from '../utils/analytics';

interface BrandEntitySectionProps {
  language: Language;
  workshopConfig: WorkshopConfig;
}

export const BrandEntitySection: React.FC<BrandEntitySectionProps> = ({
  language,
  workshopConfig
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const entityNodes = [
    {
      id: 'gbp',
      name: 'Google Business Profile',
      handle: 'TruckWala 24×7 — Kanpur–Unnao Hub',
      category: 'Local Search & Google Maps Entity',
      status: 'Live & Search Verified',
      actionUrl: workshopConfig.googleMapsUrl,
      actionLabel: 'View on Google Maps',
      icon: MapPin,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Official Google Knowledge Panel & local map pack anchor. Powers "truck mechanic near me", "highway breakdown Unnao", and "24x7 commercial vehicle repair Kanpur-Lucknow".'
    },
    {
      id: 'domain',
      name: 'Official Domains',
      handle: 'truckwala24x7.in / .com',
      category: 'Authoritative Web Footprint',
      status: 'SSL Secured & Cloud Hosted',
      actionUrl: 'https://truckwala24x7.in',
      actionLabel: 'truckwala24x7.in',
      icon: Globe,
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Single authoritative root domain for commercial vehicle telematics, driver dispatch, instant WhatsApp SOS, and parts catalogue.'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      handle: '+91 98765 43210',
      category: 'Instant Driver & Fleet SOS Line',
      status: '24×7 Instant Dispatch',
      actionUrl: `https://wa.me/${workshopConfig.whatsappNumber}?text=${encodeURIComponent('Hello TruckWala 24×7, I need assistance on Kanpur-Unnao-Lucknow Highway.')}`,
      actionLabel: 'Chat on WhatsApp',
      icon: MessageCircle,
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      description: 'Zero-friction GPS location drop, photographic inspection of broken parts, and live mechanics deployment tracking for stranded drivers.'
    },
    {
      id: 'phone',
      name: '24×7 Hotline & IVR',
      handle: '+91 98765 43210 (Clean: 9876543210)',
      category: 'Voice Highway Dispatch Desk',
      status: 'Always On Duty (0.2s Pick)',
      actionUrl: `tel:${workshopConfig.phoneClean}`,
      actionLabel: 'Call Toll-Free / Mobile',
      icon: Phone,
      badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      description: 'Toll-patrol and emergency response coordinator dispatching 4 equipped mobile units across NH-19 and Kanpur-Unnao-Lucknow corridor.'
    },
    {
      id: 'citations',
      name: 'Local Citations & Transport Directories',
      handle: 'NAP Consistency: 100% Match',
      category: 'National Highway & Logistics Directories',
      status: 'Unified Across 18+ Portals',
      actionUrl: workshopConfig.googleMapsUrl,
      actionLabel: 'Inspect NAP Record',
      icon: Layers,
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Exact matching Name, Address, and Phone (NAP) across JustDial, IndiaMart, VAHAN vendor lists, and regional transport association registers.'
    },
    {
      id: 'reviews',
      name: 'Verified Customer Reviews',
      handle: '4.9 ★ Rating (1,240+ Verified Drivers)',
      category: 'Transporter Trust & Social Proof',
      status: 'Google Review Verified',
      actionUrl: workshopConfig.googleReviewUrl,
      actionLabel: 'Write a Review',
      icon: Star,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      description: 'Transparent driver reviews with uploaded vehicle photos and turnaround times, building unshakeable algorithmic and human trust.'
    }
  ];

  const napRecord = {
    name: 'TruckWala 24×7',
    tagline: 'Complete Commercial Vehicle Solution Under One Roof',
    address: 'Truckwala, GF8M+85W, Gadan Khera Bypass Flyover, Nirala Nagar, Unnao, Uttar Pradesh 209801',
    phone: '+91 98765 43210',
    website: 'https://truckwala24x7.in',
    geo: '26.5158° N, 80.4829° E (Gadan Khera Bypass Flyover, Unnao)',
    corridor: 'Kanpur → Unnao → Lucknow Highway (NH-27 & NH-19)'
  };

  return (
    <section id="brand-entity" className="py-20 md:py-28 bg-[#07090E] text-white border-b border-white/10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-linear-to-r from-blue-600/10 via-[#FF5A1F]/10 to-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 rounded-full text-xs font-black text-[#FF5A1F] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Brand Identity & Highway Footprint</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white uppercase leading-tight">
            TRUCKWALA 24×7 <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF5A1F] via-[#38BDF8] to-[#22C55E]">
              Consistent Brand Entity
            </span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-gray-300 font-medium">
            {language === 'hi' 
              ? 'एक मजबूत और प्रमाणित पहचान: Google Business Profile, ऑफिशियल वेबसाइट, WhatsApp हेल्पलाइन, फोन, मैप्स और लोकल सिटेशन्स — एक ही भरोसेमंद नाम से।'
              : 'Building a consistent, trustworthy commercial entity across every touchpoint: Google Business Profile, truckwala24x7.in, WhatsApp, hotline, local citations, and structured SEO.'}
          </p>
        </div>

        {/* 6 Entity Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {entityNodes.map((node) => {
            const Icon = node.icon;
            return (
              <div 
                key={node.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-black/60"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5A1F] group-hover:scale-110 transition shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full border ${node.badgeColor}`}>
                      {node.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white font-heading">
                    {node.name}
                  </h3>
                  
                  <div className="text-xs font-mono text-cyan-300 font-bold mt-0.5 mb-2">
                    {node.handle}
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed font-normal">
                    {node.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">
                    {node.category}
                  </span>

                  <a
                    href={node.actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('entity_link', node.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#FF5A1F] transition"
                  >
                    <span>{node.actionLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Master NAP (Name-Address-Phone) Consistency Card */}
        <div className="bg-linear-to-br from-[#0E131F] to-[#0A0D15] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                  Canonical NAP & Entity Record (Kanpur → Unnao → Lucknow)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Uniform data citation verified across Google Search, Maps, Logistics Boards, and Schema.org structured data.
              </p>
            </div>

            <button
              onClick={() => handleCopy(JSON.stringify(napRecord, null, 2), 'nap_json')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs font-bold text-gray-200 flex items-center gap-2 transition cursor-pointer shrink-0"
            >
              {copiedKey === 'nap_json' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy Canonical NAP</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                Official Entity Name
              </span>
              <div className="text-base font-black text-white flex items-center gap-2">
                <span>{napRecord.name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">100% Matched</span>
              </div>
              <div className="text-xs text-gray-400 font-medium">
                {napRecord.tagline}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                Physical Workshop Hub & Bays
              </span>
              <div className="text-xs sm:text-sm font-bold text-gray-200 leading-snug">
                {napRecord.address}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono">
                {napRecord.geo}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold block">
                Direct Contact & Web Anchors
              </span>
              <div className="text-sm font-black text-white font-mono flex items-center gap-2">
                <span>{napRecord.phone}</span>
                <span className="text-[10px] text-gray-400">/ 24×7</span>
              </div>
              <div className="text-xs font-mono text-[#38BDF8] pt-0.5">
                {napRecord.website}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold pt-0.5">
                {napRecord.corridor}
              </div>
            </div>

          </div>

          {/* Structured SEO JSON-LD preview */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-gray-400">
              <FileText className="w-4 h-4 text-[#FF5A1F]" />
              <span>Embedded Schema.org `AutoRepair` + `LocalBusiness` JSON-LD on page</span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={workshopConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Google Review Profile</span>
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href={workshopConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline font-bold flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Profile</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
