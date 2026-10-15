import React from 'react';
import { AlertCircle, Phone, Navigation, ShieldCheck, Clock } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { trackClick } from '../utils/analytics';

interface EmergencySectionProps {
  language: Language;
  workshopConfig: WorkshopConfig;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ language, workshopConfig }) => {
  const t = TRANSLATIONS[language];

  const handleCall = () => {
    trackClick('phone', workshopConfig.phoneClean);
    window.location.href = `tel:${workshopConfig.phoneClean}`;
  };

  return (
    <section 
      id="emergency" 
      className="relative py-14 sm:py-16 bg-linear-to-r from-[#D32F2F] via-[#C62828] to-[#B71C1C] text-white overflow-hidden shadow-inner"
    >
      {/* Visual background diagonal warning stripes */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Pulsing Emergency Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 animate-pulse shadow-lg">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>

        {/* Emergency Title */}
        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-3">
          {t.emergencyBanner}
        </h2>
        
        <p className="text-base sm:text-xl text-red-100 max-w-2xl mx-auto font-medium mb-8 leading-relaxed">
          {t.emergencySub}
        </p>

        {/* Emergency Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8 text-left">
          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs text-red-200 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'समय सीमा' : 'Availability'}</span>
            </div>
            <div className="font-extrabold text-sm sm:text-base">24×7 Non-Stop</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs text-red-200 mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'हाईवे कवरेज' : 'Coverage Radius'}</span>
            </div>
            <div className="font-extrabold text-sm sm:text-base">50 KM Radius</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs text-red-200 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'मोबाइल वैन' : 'Mobile Vans'}</span>
            </div>
            <div className="font-extrabold text-sm sm:text-base">4 Field Vans</div>
          </div>

          <div className="bg-black/20 backdrop-blur-xs p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center space-x-1.5 text-xs text-red-200 mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कॉलआउट' : 'Response'}</span>
            </div>
            <div className="font-extrabold text-sm sm:text-base">20 - 45 Min</div>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#fast-help-desk"
            onClick={() => trackClick('internal-link', '#fast-help-desk')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#D32F2F] hover:bg-gray-100 rounded-xl transition font-black text-base sm:text-lg shadow-xl hover:shadow-2xl active:scale-95"
          >
            {language === 'hi' ? '🚨 तुरंत ऑन-रोड सहायता मांगें' : '🚨 GET EMERGENCY ROAD HELP'}
          </a>

          <button
            onClick={handleCall}
            className="w-full sm:w-auto px-8 py-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl transition font-black text-base sm:text-lg flex items-center justify-center space-x-2.5 shadow-xl active:scale-95 cursor-pointer"
          >
            <Phone className="w-5 h-5 animate-bounce" />
            <span>{t.call247}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
