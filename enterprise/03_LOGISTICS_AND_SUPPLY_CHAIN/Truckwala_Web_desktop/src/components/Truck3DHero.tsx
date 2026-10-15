import React, { useState, useRef } from 'react';
import { Phone, MessageCircle, MapPin, ShieldAlert, Wrench, Zap, Clock, ShieldCheck, Navigation, Volume2 } from 'lucide-react';
import { Language, WorkshopConfig } from '../types';
import { trackClick, trackEvent } from '../utils/analytics';

interface Truck3DHeroProps {
  language: Language;
  workshopConfig: WorkshopConfig;
  onOpenSOSModal?: () => void;
}

export const Truck3DHero: React.FC<Truck3DHeroProps> = ({ 
  language, 
  workshopConfig,
  onOpenSOSModal 
}) => {
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [hazardOn, setHazardOn] = useState(true);
  const [hornActive, setHornActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handlePhoneClick = () => {
    trackClick('phone', workshopConfig.phoneClean);
    window.location.href = `tel:${workshopConfig.phoneClean}`;
  };

  const handleWhatsAppClick = () => {
    trackClick('whatsapp', 'hero');
    const text = encodeURIComponent('Hello TruckWala 24×7, I have a commercial vehicle breakdown on the highway and need emergency assistance.');
    window.open(`https://wa.me/${workshopConfig.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleGetHelpNow = () => {
    trackEvent('REQUEST_STARTED', 'hero_get_help_now');
    if (onOpenSOSModal) {
      onOpenSOSModal();
    } else {
      const el = document.getElementById('sos-desk');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePlayHorn = () => {
    setHornActive(true);
    trackEvent('SERVICE_SELECTED', 'interactive_air_horn');
    try {
      // Clean web audio synthesizer for commercial truck twin air horn (dual low tone)
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(185, ctx.currentTime); // F#3
      osc2.frequency.setValueAtTime(233, ctx.currentTime); // Bb3

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio fallback
    }
    setTimeout(() => setHornActive(false), 800);
  };

  return (
    <section 
      id="hero" 
      className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden night-highway-bg text-white border-b border-white/10"
    >
      {/* Background Highway Grid and Atmosphere */}
      <div className="absolute inset-0 highway-grid opacity-30 pointer-events-none"></div>
      
      {/* Subtle Luminous Highway Streaks */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-[#FF5A1F]/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-[#00D2FF]/15 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Operational Pill Banner */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#FF5A1F]/15 border border-[#FF5A1F]/40 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,90,31,0.2)]">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping"></span>
            <span className="text-xs font-black text-[#FF5A1F] tracking-wider uppercase">
              HIGHWAY RAPID DISPATCH ACTIVE
            </span>
          </div>

          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>4 Highway Rescue Vans on Patrol (NH-19 / NH-27)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Master Hero Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hero Headline */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] font-heading">
                <span className="block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  Truck Breakdown?
                </span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-[#FF5A1F] via-[#FF8A00] to-[#00D2FF] drop-shadow-[0_0_25px_rgba(255,90,31,0.35)]">
                  We're Ready 24×7.
                </span>
              </h1>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl">
              Fast roadside assistance, on-site repair, diagnostics, towing and complete commercial-vehicle support — under one roof.
            </p>

            {/* CTAs Bar (GET HELP NOW + WHATSAPP US + 24×7 CALL) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              
              {/* Primary CTA: GET HELP NOW */}
              <button
                id="hero-primary-cta"
                onClick={handleGetHelpNow}
                className="px-6 sm:px-8 py-4 bg-linear-to-r from-[#FF5A1F] to-[#E04810] hover:from-[#FF6E30] hover:to-[#FF5A1F] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-orange-500/25 border border-orange-400/40 emergency-pulse transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-3 cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-white" />
                <span className="tracking-wide">GET HELP NOW</span>
              </button>

              {/* Secondary CTA: WHATSAPP US */}
              <button
                id="hero-whatsapp-cta"
                onClick={handleWhatsAppClick}
                className="px-5 sm:px-6 py-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] hover:text-white font-bold text-sm sm:text-base rounded-2xl border border-[#25D366]/40 transition-all flex items-center space-x-2.5 backdrop-blur-md cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>WHATSAPP US</span>
              </button>

              {/* Additional Emergency CTA: 24×7 CALL */}
              <button
                id="hero-call-cta"
                onClick={handlePhoneClick}
                className="px-5 sm:px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm sm:text-base rounded-2xl border border-white/15 transition-all flex items-center space-x-2.5 backdrop-blur-md cursor-pointer"
              >
                <Phone className="w-5 h-5 text-[#FF5A1F] animate-bounce" />
                <span>24×7 CALL</span>
              </button>
            </div>

            {/* Trust Indicators Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Trust Indicator 1 */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#FF5A1F]/30 transition">
                <div className="flex items-center space-x-2 text-[#22C55E] mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-black tracking-wider uppercase">24×7 Availability</span>
                </div>
                <p className="text-xs text-gray-300 font-medium">
                  Day or night emergency support.
                </p>
              </div>

              {/* Trust Indicator 2 */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#FF5A1F]/30 transition">
                <div className="flex items-center space-x-2 text-[#FF5A1F] mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-black tracking-wider uppercase">Fast Response</span>
                </div>
                <p className="text-xs text-gray-300 font-medium">
                  On-road and near-highway assistance.
                </p>
              </div>

              {/* Trust Indicator 3 */}
              <div className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#00D2FF]/30 transition">
                <div className="flex items-center space-x-2 text-[#00D2FF] mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-black tracking-wider uppercase">Kanpur & Nearby</span>
                </div>
                <p className="text-xs text-gray-300 font-medium">
                  Kanpur, Unnao, Lucknow & routes.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Realistic Commercial Truck Night Visual Stage */}
          <div 
            className="lg:col-span-5 relative"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interactive Control Pill Box */}
            <div className="flex items-center justify-between mb-3 px-3 py-2 glass-panel rounded-2xl border border-white/10 text-xs">
              <span className="text-gray-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                Live Heavy Truck Rig
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHeadlightsOn(!headlightsOn)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    headlightsOn ? 'bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40' : 'bg-white/5 text-gray-400'
                  }`}
                  title="Toggle Night Headlights"
                >
                  <Zap className="w-3 h-3" />
                  LEDs {headlightsOn ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setHazardOn(!hazardOn)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                    hazardOn ? 'bg-[#FF5A1F]/20 text-[#FF5A1F] border border-[#FF5A1F]/40' : 'bg-white/5 text-gray-400'
                  }`}
                  title="Toggle Hazard Lights"
                >
                  Hazard {hazardOn ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={handlePlayHorn}
                  className={`p-1.5 rounded-lg text-[11px] font-bold transition ${
                    hornActive ? 'bg-amber-500 text-black scale-110' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                  title="Sound Air Horn"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Truck 3D Showcase Frame with Realistic Night Highway Depth */}
            <div className="relative glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden min-h-[380px] flex flex-col justify-between">
              
              {/* Background Wet Highway Asphalt Texture & Ambient Glow */}
              <div className="absolute inset-0 bg-radial from-[#121824] via-[#0A0D14] to-[#06080C] pointer-events-none"></div>

              {/* Wet Road Reflection Gradient */}
              <div className="wet-road-reflection"></div>

              {/* Headlight Beam Cone Simulation */}
              {headlightsOn && (
                <div 
                  className="absolute left-[30%] top-[40%] w-[380px] h-[160px] headlight-beam -rotate-6 pointer-events-none"
                  style={{
                    transform: `rotate(${-6 + mousePos.y * 8}deg) scale(${1 + mousePos.x * 0.1})`
                  }}
                ></div>
              )}

              {/* Realistic Commercial Truck Vector Illustration with Parallax */}
              <div 
                className="relative z-10 w-full h-[230px] flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: `perspective(1000px) rotateY(${-12 + mousePos.x * 16}deg) rotateX(${6 - mousePos.y * 10}deg)`
                }}
              >
                <svg 
                  viewBox="0 0 540 260" 
                  className="w-full h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.9)]"
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="cabinMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="50%" stopColor="#1E40AF" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="chromeGrill" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="50%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>
                    <linearGradient id="glassShield" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="cargoMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="60%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>
                    <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Road Shadow */}
                  <ellipse cx="270" cy="235" rx="240" ry="14" fill="#000000" opacity="0.85" />
                  
                  {/* Wet Road Light Reflectance Lines */}
                  {headlightsOn && (
                    <ellipse cx="380" cy="238" rx="100" ry="6" fill="#00D2FF" opacity="0.25" filter="url(#glowLight)" />
                  )}

                  {/* Heavy Cargo Container Section (Rear Body) */}
                  <rect x="35" y="42" width="280" height="148" rx="8" fill="url(#cargoMetal)" stroke="#334155" strokeWidth="2.5" />
                  
                  {/* Container Ribs */}
                  <line x1="75" y1="45" x2="75" y2="185" stroke="#1E293B" strokeWidth="3" />
                  <line x1="115" y1="45" x2="115" y2="185" stroke="#1E293B" strokeWidth="3" />
                  <line x1="155" y1="45" x2="155" y2="185" stroke="#1E293B" strokeWidth="3" />
                  <line x1="195" y1="45" x2="195" y2="185" stroke="#1E293B" strokeWidth="3" />
                  <line x1="235" y1="45" x2="235" y2="185" stroke="#1E293B" strokeWidth="3" />
                  <line x1="275" y1="45" x2="275" y2="185" stroke="#1E293B" strokeWidth="3" />

                  {/* TruckWala Brand Monogram on Cargo Box */}
                  <rect x="90" y="70" width="170" height="50" rx="8" fill="#080A0F" stroke="#FF5A1F" strokeWidth="1.5" opacity="0.9" />
                  <text x="175" y="94" fill="#FFFFFF" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
                    TRUCKWALA
                  </text>
                  <text x="175" y="110" fill="#22C55E" fontSize="11" fontWeight="800" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1.5">
                    24×7 HIGHWAY RESCUE
                  </text>

                  {/* Heavy Front Commercial Cabin */}
                  <path 
                    d="M310 190 L310 85 L350 48 L440 50 L465 110 L470 190 Z" 
                    fill="url(#cabinMetal)" 
                    stroke="#1D4ED8" 
                    strokeWidth="2" 
                  />

                  {/* Aerodynamic Wind Deflector Roof */}
                  <path d="M312 48 L350 25 L430 28 L440 48 Z" fill="#1E40AF" stroke="#3B82F6" strokeWidth="1.5" />

                  {/* Front Panoramic Windshield */}
                  <path d="M352 54 L435 55 L458 105 L356 103 Z" fill="url(#glassShield)" stroke="#0284C7" strokeWidth="1.5" />
                  
                  {/* Driver Side Window */}
                  <path d="M320 62 L348 62 L348 102 L320 102 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />

                  {/* High Mount Air Intake & Exhaust Snorkel */}
                  <rect x="306" y="25" width="8" height="60" rx="3" fill="#475569" />
                  
                  {/* Front Chrome Bumper & Massive Radiator Grille */}
                  <rect x="420" y="120" width="46" height="55" rx="4" fill="url(#chromeGrill)" />
                  <line x1="422" y1="130" x2="464" y2="130" stroke="#0F172A" strokeWidth="2" />
                  <line x1="422" y1="140" x2="464" y2="140" stroke="#0F172A" strokeWidth="2" />
                  <line x1="422" y1="150" x2="464" y2="150" stroke="#0F172A" strokeWidth="2" />
                  <line x1="422" y1="160" x2="464" y2="160" stroke="#0F172A" strokeWidth="2" />

                  {/* Lower Steel Crash Bumper */}
                  <rect x="400" y="180" width="75" height="20" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />

                  {/* Projector LED Headlights */}
                  <rect 
                    x="456" 
                    y="142" 
                    width="14" 
                    height="20" 
                    rx="3" 
                    fill={headlightsOn ? '#FFFFFF' : '#475569'} 
                    filter={headlightsOn ? 'url(#glowLight)' : 'none'}
                  />

                  {/* Hazard Flashers */}
                  <circle 
                    cx="463" 
                    cy="134" 
                    r="4.5" 
                    fill={hazardOn ? '#FF5A1F' : '#78350F'} 
                    className={hazardOn ? 'hazard-flash' : ''}
                  />
                  <circle 
                    cx="38" 
                    cy="60" 
                    r="4.5" 
                    fill={hazardOn ? '#FF5A1F' : '#78350F'} 
                    className={hazardOn ? 'hazard-flash' : ''}
                  />

                  {/* Chrome Rear View Mirrors */}
                  <rect x="466" y="70" width="6" height="24" rx="2" fill="#E2E8F0" />
                  <line x1="454" y1="80" x2="466" y2="80" stroke="#94A3B8" strokeWidth="2" />

                  {/* Heavy Dual Axle Multi-Wheels with Chrome Hubs */}
                  {/* Wheel 1 (Rear Outer) */}
                  <circle cx="85" cy="205" r="28" fill="#090D14" stroke="#334155" strokeWidth="4" />
                  <circle cx="85" cy="205" r="14" fill="#64748B" stroke="#CBD5E1" strokeWidth="2" />
                  
                  {/* Wheel 2 (Rear Inner Axle) */}
                  <circle cx="150" cy="205" r="28" fill="#090D14" stroke="#334155" strokeWidth="4" />
                  <circle cx="150" cy="205" r="14" fill="#64748B" stroke="#CBD5E1" strokeWidth="2" />

                  {/* Wheel 3 (Mid Bogie Axle) */}
                  <circle cx="215" cy="205" r="28" fill="#090D14" stroke="#334155" strokeWidth="4" />
                  <circle cx="215" cy="205" r="14" fill="#64748B" stroke="#CBD5E1" strokeWidth="2" />

                  {/* Wheel 4 (Front Steer Axle) */}
                  <circle cx="395" cy="205" r="28" fill="#090D14" stroke="#334155" strokeWidth="4" />
                  <circle cx="395" cy="205" r="14" fill="#94A3B8" stroke="#F8FAFC" strokeWidth="2" />

                  {/* Fuel Tank & Air Dryers */}
                  <rect x="255" y="175" width="48" height="22" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
                  <rect x="310" y="178" width="18" height="18" rx="3" fill="#3B82F6" />
                </svg>
              </div>

              {/* Side Floating Glass Diagnostic Overlay Cards */}
              <div className="relative z-20 grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#0B0E17]/85 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                  <div className="flex items-center space-x-1.5 text-xs text-[#22C55E] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                    <span>Kanpur Corridor</span>
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">NH-19 & NH-27</div>
                  <div className="text-[10px] text-gray-400">Avg. Arrival: 20-35 mins</div>
                </div>

                <div className="bg-[#0B0E17]/85 border border-[#FF5A1F]/30 rounded-2xl p-3 backdrop-blur-md">
                  <div className="flex items-center space-x-1.5 text-xs text-[#FF5A1F] font-bold">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Mobile Vans</span>
                  </div>
                  <div className="text-sm font-extrabold text-white mt-0.5">4 Units Active</div>
                  <div className="text-[10px] text-gray-400">Equipped with Air Compressor</div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
