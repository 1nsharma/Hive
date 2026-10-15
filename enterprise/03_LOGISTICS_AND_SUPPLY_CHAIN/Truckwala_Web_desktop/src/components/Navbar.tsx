import React, { useState } from 'react';
import { Truck, Phone, Menu, X, Database, ShieldAlert, Cpu, Lock, Sparkles } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick } from '../utils/analytics';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenLeadsModal: () => void;
  onOpenEmergencyModal?: () => void;
  leadsCount: number;
  workshopConfig: WorkshopConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onOpenLeadsModal,
  onOpenEmergencyModal,
  leadsCount,
  workshopConfig
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePhoneCall = () => {
    trackClick('phone', workshopConfig.phoneClean);
    window.location.href = `tel:${workshopConfig.phoneClean}`;
  };

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'SERVICES', href: '#services' },
    { name: 'WRITE REVIEW 5★', href: '#ai-review-booster' },
    { name: 'WHY US', href: '#why-us' },
    { name: 'BRAND ENTITY', href: '#brand-entity' },
    { name: 'SERVICE AREA', href: '#service-area' },
    { name: 'ABOUT', href: '#about' },
    { name: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Brand Lockup & Tagline */}
          <a 
            id="nav-brand"
            href="#hero" 
            className="flex items-center space-x-3.5 group cursor-pointer"
            onClick={() => trackClick('internal-link', '#hero')}
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-[#2563EB] to-[#FF5A1F] p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#0E121B] rounded-[10px] flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#FF5A1F] drop-shadow-[0_0_8px_rgba(255,90,31,0.5)]" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <div className="text-xl md:text-2xl font-black tracking-tight font-heading flex items-center">
                  <span className="text-[#3B82F6] drop-shadow-[0_0_12px_rgba(59,130,246,0.4)]">TRUCK</span>
                  <span className="text-[#FF5A1F] ml-1 drop-shadow-[0_0_12px_rgba(255,90,31,0.4)]">WALA</span>
                </div>
                <span className="bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-[11px] font-black px-2 py-0.5 rounded-full tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                  24×7
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold tracking-wider uppercase hidden sm:block">
                Complete Commercial Vehicle Solution Under One Roof
              </p>
            </div>
          </a>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold tracking-wider text-gray-300">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="hover:text-[#FF5A1F] transition duration-200 py-1 relative group"
                onClick={() => trackClick('internal-link', link.href)}
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF5A1F] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>

          {/* Right: Actions (Owner Hub, 24×7 CALL) */}
          <div className="hidden sm:flex items-center space-x-3.5">
            {/* Owner Hub / Internal Telemetry Portal (Restricted / Non-Public) */}
            <button
              id="owner-hub-btn"
              onClick={onOpenLeadsModal}
              className="relative p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition flex items-center gap-1.5"
              title="TruckWala Internal OS Hub (Restricted Access)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-gray-300 hidden md:inline">Internal Hub</span>
              {leadsCount > 0 && (
                <span className="bg-[#FF5A1F] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {leadsCount}
                </span>
              )}
            </button>

            {/* 24×7 CALL (Right Header Element) */}
            <button
              id="header-call-btn"
              onClick={handlePhoneCall}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-linear-to-r from-[#FF5A1F] to-[#E04810] hover:from-[#FF6B35] hover:to-[#FF5A1F] text-white text-xs md:text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 border border-orange-400/30 transition-all transform active:scale-95"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span className="tracking-wide">24×7 CALL</span>
            </button>
          </div>

          {/* Mobile Right Controls: SOS + Hamburger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={handlePhoneCall}
              className="p-2 bg-[#FF5A1F] text-white rounded-xl shadow-md shadow-orange-500/30"
              title="24×7 Emergency Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-300 hover:text-white bg-white/5 rounded-xl border border-white/10"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-4/5 max-w-sm bg-[#0E121B] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-5 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black font-heading">
                    <span className="text-[#3B82F6]">TRUCK</span>
                    <span className="text-[#FF5A1F]">WALA</span>
                  </span>
                  <span className="bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-black px-1.5 py-0.5 rounded-full border border-[#22C55E]/40">
                    24×7
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-[11px] text-gray-400 font-medium py-3 border-b border-white/10">
                Complete Commercial Vehicle Solution Under One Roof
              </p>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3 py-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      trackClick('internal-link', link.href);
                    }}
                    className="text-base font-bold text-gray-200 hover:text-[#FF5A1F] py-2 px-3 rounded-lg hover:bg-white/5 transition"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLeadsModal();
                  }}
                  className="text-left text-sm font-bold text-gray-400 hover:text-amber-400 py-2 px-3 rounded-lg hover:bg-white/5 transition flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Internal OS Hub (Staff Only)</span>
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono text-gray-400">PIN</span>
                </button>
              </nav>
            </div>

            {/* Persistent Mobile Drawer Emergency Action */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenEmergencyModal) onOpenEmergencyModal();
                  else {
                    window.location.hash = '#sos-desk';
                  }
                }}
                className="w-full py-3.5 bg-linear-to-r from-red-600 to-[#FF5A1F] text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-red-500/30"
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                <span>REQUEST EMERGENCY SOS</span>
              </button>

              <button
                onClick={handlePhoneCall}
                className="w-full py-3.5 bg-[#FF5A1F] text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>24×7 CALL NOW</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
