import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ShieldAlert, Phone, ExternalLink, CheckCircle } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick } from '../utils/analytics';

interface ServiceAreaSectionProps {
  language: Language;
  workshopConfig: WorkshopConfig;
}

export const ServiceAreaSection: React.FC<ServiceAreaSectionProps> = ({
  language,
  workshopConfig
}) => {
  const [selectedRoute, setSelectedRoute] = useState<string>('nh19');

  const routes = [
    {
      id: 'nh19',
      name: 'NH-19 (Delhi – Kolkata Highway)',
      coverage: 'KM 30 to KM 180 Kanpur Segment',
      status: 'Active Patrol (2 Mobile Vans)',
      eta: '20-30 min',
      color: 'border-[#FF5A1F] text-[#FF5A1F]'
    },
    {
      id: 'nh27',
      name: 'NH-27 (East-West Corridor)',
      coverage: 'Barabanki - Kanpur - Jhansi Link',
      status: 'Active Patrol (1 Mobile Van)',
      eta: '25-35 min',
      color: 'border-[#00D2FF] text-[#00D2FF]'
    },
    {
      id: 'knp-lko',
      name: 'Kanpur – Lucknow Highway',
      coverage: 'Ganga Bridge to Nawabganj Expressway',
      status: 'Dedicated Highway Unit',
      eta: '18-25 min',
      color: 'border-[#22C55E] text-[#22C55E]'
    },
    {
      id: 'tp-nagar',
      name: 'Transport Nagar, Kanpur',
      coverage: 'Central Workshop Hub & Heavy Bays',
      status: 'Main Bay Open 24×7',
      eta: 'Immediate / In-Bay',
      color: 'border-[#FFB703] text-[#FFB703]'
    },
    {
      id: 'rania',
      name: 'Rania Industrial Area',
      coverage: 'Industrial Corridor & Weighbridges',
      status: 'On-Call Mobile Mechanic',
      eta: '20-30 min',
      color: 'border-purple-400 text-purple-400'
    },
    {
      id: 'unnao',
      name: 'Unnao Bypass & Industrial Belt',
      coverage: 'Leather Complex & Highway Ring',
      status: 'Active Patrol Van #3',
      eta: '20-30 min',
      color: 'border-rose-400 text-rose-400'
    },
    {
      id: 'fatehpur',
      name: 'Fatehpur / Prayagraj Route',
      coverage: 'Extended Highway Heavy Towing Support',
      status: 'Heavy Winch Tow Truck on Standby',
      eta: '35-50 min',
      color: 'border-cyan-400 text-cyan-400'
    }
  ];

  return (
    <section id="service-area" className="py-20 md:py-28 bg-[#0A0D14] text-white border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#00D2FF]/15 border border-[#00D2FF]/30 rounded-full text-xs font-black text-[#00D2FF] uppercase tracking-wider mb-4">
            <Navigation className="w-3.5 h-3.5" />
            <span>Highway Fleet Coverage Map</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white">
            SERVICE AREA & HIGHWAY COVERAGE
          </h2>
          
          <p className="mt-3 text-base sm:text-lg text-gray-300 font-medium">
            Primary Arterial Corridor: <strong className="text-[#FF5A1F]">Kanpur → Unnao → Lucknow Highway</strong> (NH-19 & NH-27) with rapid 24×7 mobile repair vans & 40T crane units.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Routes & Corridors List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
              Select Corridor for Rapid Dispatch Details
            </h3>

            {routes.map((route) => {
              const isSelected = selectedRoute === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'glass-panel-orange border-[#FF5A1F] shadow-lg shadow-orange-500/10' 
                      : 'glass-panel border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-black text-white font-heading">
                      {route.name}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-[#22C55E] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      ETA: {route.eta}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-2">
                    {route.coverage}
                  </p>

                  <div className="flex items-center text-[11px] font-semibold text-gray-300 gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                    <span>{route.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Highway Map & Primary Hub Card */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Visual Highway Route Graphic Box */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden min-h-[380px] flex flex-col justify-between shadow-2xl">
              
              {/* Background Map Grid */}
              <div className="absolute inset-0 highway-grid opacity-20 pointer-events-none"></div>

              {/* Luminous Highway Artery Graphic (SVG) */}
              <div className="relative z-10 w-full h-[220px]">
                <svg viewBox="0 0 600 240" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle terrain routes */}
                  <path d="M 50 120 Q 200 80 300 120 T 550 120" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 300 20 L 300 220" stroke="#1E293B" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 120 40 L 480 200" stroke="#1E293B" strokeWidth="8" strokeLinecap="round" />

                  {/* NH-19 Luminous Arterial Line */}
                  <path d="M 50 120 Q 200 80 300 120 T 550 120" stroke="#FF5A1F" strokeWidth="4" strokeDasharray="8 6" className="animate-pulse" />
                  <text x="70" y="105" fill="#FF5A1F" fontSize="11" fontWeight="800" fontFamily="sans-serif">NH-19 (Delhi-Agra-Kanpur-Kolkata)</text>

                  {/* NH-27 Corridor */}
                  <path d="M 300 20 L 300 220" stroke="#00D2FF" strokeWidth="3" strokeDasharray="6 4" />
                  <text x="315" y="45" fill="#00D2FF" fontSize="11" fontWeight="800" fontFamily="sans-serif">NH-27 (East-West)</text>

                  {/* Kanpur Lucknow Expressway Line */}
                  <path d="M 300 120 Q 420 80 520 60" stroke="#22C55E" strokeWidth="3.5" />
                  <text x="430" y="50" fill="#22C55E" fontSize="11" fontWeight="800" fontFamily="sans-serif">To Lucknow</text>

                  {/* Central Node: Kanpur Primary Hub */}
                  <circle cx="300" cy="120" r="26" fill="#FF5A1F" fillOpacity="0.2" className="animate-ping" />
                  <circle cx="300" cy="120" r="16" fill="#0E121B" stroke="#FF5A1F" strokeWidth="3" />
                  <circle cx="300" cy="120" r="6" fill="#FF5A1F" />
                  <text x="300" y="160" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
                    KANPUR CENTRAL HUB
                  </text>
                  <text x="300" y="175" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" textAnchor="middle">
                    Transport Nagar Phase-2
                  </text>

                  {/* Peripheral Nodes: Unnao, Rania, Fatehpur */}
                  <circle cx="420" cy="95" r="7" fill="#0E121B" stroke="#22C55E" strokeWidth="2" />
                  <text x="420" y="115" fill="#94A3B8" fontSize="9" textAnchor="middle">Unnao Bypass</text>

                  <circle cx="160" cy="105" r="7" fill="#0E121B" stroke="#A855F7" strokeWidth="2" />
                  <text x="160" y="125" fill="#94A3B8" fontSize="9" textAnchor="middle">Rania Industrial</text>

                  <circle cx="480" cy="165" r="7" fill="#0E121B" stroke="#38BDF8" strokeWidth="2" />
                  <text x="480" y="185" fill="#94A3B8" fontSize="9" textAnchor="middle">Fatehpur/Prayagraj</text>
                </svg>
              </div>

              {/* Primary Hub Operational Details */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black text-[#FF5A1F] uppercase mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Primary Hub: Gadan Khera Bypass Flyover, Unnao (Kanpur–Lucknow Corridor)</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Equipped with 6 heavy hydraulic service bays, computer diagnostics lab, and Wabco spare parts depot.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={workshopConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('directions', 'service_area_map')}
                    className="px-4 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </a>

                  <a
                    href={`tel:${workshopConfig.phoneClean}`}
                    onClick={() => trackClick('phone', 'service_area_call')}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Call Hub</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
