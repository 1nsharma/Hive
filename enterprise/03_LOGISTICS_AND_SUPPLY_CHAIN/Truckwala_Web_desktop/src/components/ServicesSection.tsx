import React, { useState } from 'react';
import { 
  AlertTriangle, Wrench, Truck, Zap, Disc, Battery, Package, 
  Cpu, ShieldCheck, Cog, Headphones, LifeBuoy, ArrowRight, 
  CheckCircle2, Clock, Phone, MessageCircle, X
} from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { SERVICES_DATA, WORKSHOP_CONFIG } from '../data/servicesData';
import { trackClick, trackEvent } from '../utils/analytics';

interface ServicesSectionProps {
  language: Language;
  onSelectServiceForRepair?: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  onSelectServiceForRepair
}) => {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(null);

  const renderIcon = (name: string, className = "w-6 h-6 text-white") => {
    switch (name) {
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Disc': return <Disc className={className} />;
      case 'Battery': return <Battery className={className} />;
      case 'Package': return <Package className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Cog': return <Cog className={className} />;
      case 'Headphones': return <Headphones className={className} />;
      case 'LifeBuoy': return <LifeBuoy className={className} />;
      default: return <Wrench className={className} />;
    }
  };

  const handleRequestService = (service: ServiceItem) => {
    trackEvent('SERVICE_SELECTED', service.titleEn);
    if (onSelectServiceForRepair) {
      onSelectServiceForRepair(service.titleEn);
    }
    const el = document.getElementById('sos-desk');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCallNow = (service: ServiceItem) => {
    trackClick('phone', `service_${service.id}`);
    window.location.href = `tel:${WORKSHOP_CONFIG.phoneClean}`;
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#0A0D14] text-white border-b border-white/10 relative">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#FF5A1F]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 rounded-full text-xs font-black text-[#FF5A1F] uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Complete 360° Commercial Vehicle Coverage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
            COMMERCIAL VEHICLE SERVICES
          </h2>
          
          <p className="mt-3 text-base sm:text-lg text-gray-400 font-medium">
            Everything your commercial vehicle fleet needs on the road — 24 hours a day, 365 days a year.
          </p>
        </div>

        {/* 12 Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, index) => {
            const isEmergency = service.id === 'emergency-roadside' || service.id === 'heavy-towing';
            
            return (
              <div
                key={service.id}
                className="glass-panel glass-card-hover rounded-2xl sm:rounded-3xl p-6 border border-white/10 flex flex-col justify-between relative group"
              >
                {/* Luminous Top Accent for Emergency Services */}
                {isEmergency && (
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-linear-to-r from-transparent via-[#FF5A1F] to-transparent"></div>
                )}

                <div>
                  {/* Icon & Category Indicator */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF5A1F]/50 transition duration-300">
                      {renderIcon(service.iconName || (service as any).icon, "w-6 h-6 text-[#FF5A1F]")}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-lg">
                      #{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-black font-heading text-white group-hover:text-[#FF5A1F] transition mb-2.5">
                    {language === 'hi' ? service.titleHi : service.titleEn}
                  </h3>

                  {/* Service Description */}
                  <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed mb-4">
                    {language === 'hi' ? service.shortDescHi : service.shortDescEn}
                  </p>

                  {/* Feature Highlights Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {((language === 'hi' 
                      ? (service.bulletPointsHi || service.commonIssuesHi || []) 
                      : (service.bulletPointsEn || service.commonIssuesEn || [])
                    ) || []).slice(0, 2).map((b, i) => (
                      <span key={i} className="text-[10px] bg-white/5 border border-white/5 text-gray-300 px-2 py-0.5 rounded-md">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions: 'Request Service' and 'Call Now' */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleRequestService(service)}
                    className="w-full py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCallNow(service)}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Call Now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner Strip */}
        <div className="mt-16 glass-panel-orange rounded-3xl p-6 sm:p-8 border border-[#FF5A1F]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-xl font-black font-heading text-white">
              Need custom technical assistance or fleet contract?
            </h4>
            <p className="text-xs sm:text-sm text-gray-300">
              Speak directly with our Chief Commercial Vehicle Engineer for NH-19, NH-27, and Kanpur region.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${WORKSHOP_CONFIG.phoneClean}`}
              onClick={() => trackClick('phone', 'services_banner')}
              className="px-6 py-3.5 bg-linear-to-r from-[#FF5A1F] to-[#E04810] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{WORKSHOP_CONFIG.phoneDisplay}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
