import React from 'react';
import { MapPin, Navigation, Star, ShieldCheck, Clock, Phone, MessageCircle, ExternalLink, Award, Sparkles } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick } from '../utils/analytics';
import { AiReviewAssistant } from './AiReviewAssistant';

interface GoogleBusinessSectionProps {
  language: Language;
  workshopConfig: WorkshopConfig;
}

export const GoogleBusinessSection: React.FC<GoogleBusinessSectionProps> = ({ 
  language, 
  workshopConfig 
}) => {
  const handleDirections = () => {
    trackClick('directions', 'visit_section');
    window.open(workshopConfig.googleMapsUrl, '_blank');
  };

  const handleReviewClick = () => {
    trackClick('review', 'google_business');
    const el = document.getElementById('ai-review-booster');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open(workshopConfig.googleReviewUrl, '_blank');
    }
  };

  const handlePhoneCall = () => {
    trackClick('phone', 'google_business');
    window.location.href = `tel:${workshopConfig.phoneClean}`;
  };

  const handleWhatsApp = () => {
    trackClick('whatsapp', 'google_business');
    const msg = encodeURIComponent('Hello TruckWala 24×7, I would like to visit or enquire about workshop bay service in Kanpur.');
    window.open(`https://wa.me/${workshopConfig.whatsappNumber}?text=${msg}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#080A0F] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Workshop Location & Info */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FF5A1F]/15 text-[#FF5A1F] rounded-full text-xs font-black border border-[#FF5A1F]/30 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Commercial Workshop & Google Business Profile</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight">
                WORKSHOP & GOOGLE PROFILE
              </h2>
              <p className="mt-3 text-base sm:text-lg text-gray-300 font-medium">
                Visit our central heavy vehicle engineering hub at Gadan Khera Bypass Flyover, Unnao (Kanpur–Lucknow Highway Corridor) or summon our mobile rescue team.
              </p>
            </div>

            {/* Address & Operational Hours Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
              
              {/* Address in English */}
              <div className="flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-[#FF5A1F] shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Workshop Address (English)
                  </div>
                  <div className="font-bold text-sm sm:text-base text-white">
                    {workshopConfig.addressEn}
                  </div>
                </div>
              </div>

              {/* Address in Hindi */}
              <div className="flex items-start space-x-3.5 pt-3 border-t border-white/10">
                <MapPin className="w-5 h-5 text-[#38BDF8] shrink-0 mt-1" />
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    वर्कशॉप पता (हिन्दी)
                  </div>
                  <div className="font-bold text-sm sm:text-base text-gray-200">
                    {workshopConfig.addressHi}
                  </div>
                </div>
              </div>

              {/* Direct Phone & Operating Hours Strip */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#22C55E]" />
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase">Operating Hours</div>
                    <div className="text-sm font-black text-white font-mono">24 Hours Open (Always On-Duty)</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#FF5A1F]" />
                  <div>
                    <div className="text-xs text-gray-400 font-semibold uppercase">Direct Hotline</div>
                    <div className="text-sm font-black text-white font-mono">{workshopConfig.phoneDisplay}</div>
                  </div>
                </div>
              </div>

              {/* Yard Amenities */}
              <div className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-gray-300">
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  🅿️ 12-Trailer Hard-stand Yard
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  🛠️ Heavy Pit & Hydraulic Lift Bay
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  ☕ 24×7 Driver Rest Room & Water
                </span>
              </div>

            </div>

            {/* 4 Required Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              
              {/* Button 1: Get Directions */}
              <button
                onClick={handleDirections}
                className="px-4 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>

              {/* Button 2: Write a Review */}
              <button
                onClick={handleReviewClick}
                className="px-4 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Write 5★ Review (AI)</span>
              </button>

              {/* Button 3: Call Workshop */}
              <button
                onClick={handlePhoneCall}
                className="px-4 py-3 bg-[#FF5A1F] hover:bg-[#E04810] text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Workshop</span>
              </button>

              {/* Button 4: WhatsApp Workshop */}
              <button
                onClick={handleWhatsApp}
                className="px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] hover:text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>

            </div>

          </div>

          {/* Right Column: Interactive Google Map & Verified Workshop Badge */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Interactive Embedded Google Map */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
              <div className="p-3.5 bg-[#0E121B] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] animate-pulse"></span>
                  <span className="text-xs font-black uppercase tracking-wider text-gray-200">
                    Live Workshop GPS Location
                  </span>
                </div>
                <a
                  href={workshopConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#38BDF8] hover:text-[#00D2FF] flex items-center gap-1 transition"
                >
                  <span>Open Full Map</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Responsive Google Maps Iframe */}
              <div className="w-full h-[240px] sm:h-[270px] bg-[#111622] relative">
                <iframe
                  title="TruckWala 24×7 Workshop Location Map"
                  src={`https://maps.google.com/maps?q=26.5158,80.4829&hl=en&z=15&output=embed`}
                  className="w-full h-full border-0 filter contrast-105"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-3.5 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5A1F] shrink-0" />
                  <span className="truncate font-mono text-[11px]">26.5158° N, 80.4829° E • Gadan Khera Bypass, Unnao</span>
                </div>
                <button
                  onClick={handleDirections}
                  className="px-2.5 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg font-bold text-[11px] shrink-0 ml-2 transition cursor-pointer flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Navigate</span>
                </button>
              </div>
            </div>

            {/* Google Verified Workshop Badge Card */}
            <div className="glass-panel rounded-3xl p-5 border border-white/10 text-center space-y-3.5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 flex items-center justify-center text-[#FF5A1F] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-heading text-white">
                      TRUCKWALA 24×7 WORKSHOP HUB
                    </h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Verified Highway Workshop
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">
                  NH-27 Bypass
                </span>
              </div>

              {/* Real Google Rating Guarantee Notice */}
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-left space-y-1">
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-200">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.9★ Real Transporter & Driver Ratings</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Real Google customer reviews only. Check verified driver turnaround times, genuine bills, and mechanical repair feedback directly on Google Maps.
                </p>
              </div>

              <button
                onClick={handleDirections}
                className="w-full py-2.5 bg-linear-to-r from-[#2563EB] to-[#1E40AF] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps App</span>
              </button>
            </div>
          </div>

        </div>

        {/* AI 1-Tap 5-Star Review Generator & Auto-Poster */}
        <AiReviewAssistant workshopConfig={workshopConfig} />

      </div>
    </section>
  );
};
