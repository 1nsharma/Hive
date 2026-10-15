import React from 'react';
import { Truck, Phone, MessageCircle, MapPin, Database, ShieldCheck, Heart, Lock } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick } from '../utils/analytics';

interface FooterProps {
  language: Language;
  onOpenLeadsModal: () => void;
  leadsCount: number;
  workshopConfig: WorkshopConfig;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenLeadsModal,
  leadsCount,
  workshopConfig
}) => {
  const servicesList = [
    'Emergency Roadside Assistance',
    'On-Site Truck Repair',
    'Heavy Towing & Recovery',
    'Truck Electrical & Wiring',
    'Commercial Tyre Service',
    'Battery Replacement & Jump Start',
    'Genuine Truck Spare Parts',
    'Computer Diagnostics (OBD)',
    'Fleet Maintenance',
    'Major Engine & Gearbox Repair',
    'Driver Technical Assistance',
    'Other Emergency Commercial Help'
  ];

  return (
    <footer className="bg-[#06080C] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#2563EB] to-[#FF5A1F] rounded-xl flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#0E121B] rounded-[10px] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#FF5A1F]" />
                </div>
              </div>
              <div className="text-xl font-black font-heading tracking-tight flex items-center">
                <span className="text-[#3B82F6]">TRUCK</span>
                <span className="text-[#FF5A1F] ml-1">WALA</span>
                <span className="bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-[10px] font-black px-1.5 py-0.5 rounded-md ml-2 tracking-wider">
                  24×7
                </span>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Complete Commercial Vehicle Solution Under One Roof
            </p>

            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Dedicated commercial vehicle breakdown and fleet maintenance platform supporting truck drivers, fleet operators, and transport corporations.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenLeadsModal}
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-400 hover:text-gray-200 rounded-xl transition"
                title="Internal Management Portal (Requires Security PIN)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Internal OS Hub</span>
                {leadsCount > 0 && (
                  <span className="bg-[#FF5A1F] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {leadsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Emergency Hotlines
            </h4>

            <div className="space-y-3">
              <a
                href={`tel:${workshopConfig.phoneClean}`}
                onClick={() => trackClick('phone', 'footer_emergency')}
                className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#FF5A1F]/20 text-[#FF5A1F] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-gray-400 font-semibold uppercase">24×7 Emergency Phone</div>
                  <div className="text-sm font-black text-white font-mono group-hover:text-[#FF5A1F] transition">
                    {workshopConfig.phoneDisplay}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/${workshopConfig?.whatsappNumber || '919876543210'}?text=${encodeURIComponent('Hello TruckWala 24×7, I need commercial vehicle assistance.')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('whatsapp', 'footer')}
                className="flex items-center space-x-3 p-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-emerald-400 font-semibold uppercase">WhatsApp Breakdown Desk</div>
                  <div className="text-sm font-black text-white font-mono group-hover:text-emerald-400 transition">
                    +91 {(workshopConfig?.whatsappNumber || '9876543210').slice(-10)}
                  </div>
                </div>
              </a>
            </div>

            <div className="text-xs text-gray-400">
              <strong className="text-white">Workshop Address:</strong>
              <p className="mt-1 font-normal leading-relaxed">{workshopConfig.addressEn}</p>
            </div>
          </div>

          {/* Service Area Summary */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Service Area Summary
            </h4>

            <ul className="space-y-2 text-xs text-gray-300 font-medium">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]"></span>
                <span>Kanpur Central Hub & Transport Nagar</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
                <span>NH-19 (Delhi – Agra – Kanpur – Kolkata)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                <span>NH-27 (East-West Highway Corridor)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Kanpur – Lucknow Highway Corridor</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Unnao Bypass & Industrial Belt</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                <span>Rania Industrial Zone & Weighbridges</span>
              </li>
            </ul>
          </div>

          {/* 12 Services List */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
              Services
            </h4>

            <ul className="grid grid-cols-1 gap-1.5 text-xs text-gray-400 font-normal">
              {servicesList.map((service, i) => (
                <li key={i}>
                  <a 
                    href="#services" 
                    className="hover:text-[#FF5A1F] transition truncate block"
                    onClick={() => trackClick('internal-link', '#services')}
                  >
                    • {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal, Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            © {new Date().getFullYear()} TruckWala 24×7. All rights reserved.
          </div>

          {/* Professional Disclaimer */}
          <div className="text-center md:text-right text-gray-400 font-normal">
            Commercial vehicle roadside assistance and independent repair provider.
          </div>
        </div>

      </div>
    </footer>
  );
};
