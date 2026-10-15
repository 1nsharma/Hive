import React, { useState, useEffect } from "react";
import {
  Truck,
  AlertCircle,
  Clock,
  Users,
  Cpu,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Monitor,
  Package,
  Shield,
  Settings,
  ClipboardCheck,
  Headphones,
  Phone,
  MessageCircle,
  MapPin,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Compass,
  Star,
  Sparkles,
  Bot,
  RotateCcw,
  Zap,
} from "lucide-react";
import { WORKSHOP_SERVICES } from "../truckWalaData";
import { startPublicWebsiteTour, stopActiveTour } from "../utils/tours";
import { AeoFaqSection } from "./public/AeoFaqSection";
import { LlmsTxtModal } from "./public/LlmsTxtModal";
import { RealEvidenceGallery } from "./public/RealEvidenceGallery";
import { EmergencyWorkflowSection } from "./public/EmergencyWorkflowSection";
import { VehicleCoverageSection } from "./public/VehicleCoverageSection";
import { MobileBottomBar } from "./public/MobileBottomBar";

interface PublicWebsiteProps {
  onOpenLogin: () => void;
  onOpenEmergency: () => void;
  onOpenBooking: (serviceId?: string) => void;
}

const TOUR_STORAGE_KEY = "truck_wala_first_tour_shown_v2";

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  onOpenLogin,
  onOpenEmergency,
  onOpenBooking,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [showTourDoneBanner, setShowTourDoneBanner] = useState(false);
  const [isLlmsModalOpen, setIsLlmsModalOpen] = useState(false);

  // Auto-run tour ONLY on first visit to URL
  useEffect(() => {
    const hasSeenTour = localStorage.getItem(TOUR_STORAGE_KEY);

    if (!hasSeenTour) {
      // First visit to URL -> run tour once, then mark completed
      const timer = setTimeout(() => {
        runTour();
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
      }, 700);

      return () => {
        clearTimeout(timer);
        stopActiveTour();
      };
    }
    // Subsequent visits / reloads -> tour DOES NOT show automatically
  }, []);

  const runTour = () => {
    setIsTourRunning(true);
    setShowTourDoneBanner(false);
    startPublicWebsiteTour(() => {
      setIsTourRunning(false);
      setShowTourDoneBanner(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleSkipTour = () => {
    stopActiveTour();
    setIsTourRunning(false);
    setShowTourDoneBanner(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetTourPreference = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    runTour();
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "wrench":
        return <Wrench className="w-6 h-6 text-red-600" />;
      case "alert-triangle":
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case "monitor":
        return <Monitor className="w-6 h-6 text-blue-600" />;
      case "package":
        return <Package className="w-6 h-6 text-emerald-600" />;
      case "shield":
        return <Shield className="w-6 h-6 text-purple-600" />;
      case "settings":
        return <Settings className="w-6 h-6 text-amber-600" />;
      case "clipboard-check":
        return <ClipboardCheck className="w-6 h-6 text-indigo-600" />;
      case "headphones":
        return <Headphones className="w-6 h-6 text-pink-600" />;
      default:
        return <Wrench className="w-6 h-6 text-red-600" />;
    }
  };

  return (
    <div id="publicSection" className="min-h-screen bg-slate-50 text-slate-900 font-sans has-bottom-bar selection:bg-red-600 selection:text-white">
      {/* Top Emergency & Verified Numbers Ticker */}
      <div className="bg-slate-950 text-white text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-dot shrink-0"></span>
            <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[11px]">HIGHWAY SOS ACTIVE:</span>
            <span className="text-slate-300 hidden sm:inline">NH-48, NH-19, NH-44 & Expressways Mobile Rescue Vans On Duty</span>
            <span className="text-slate-300 sm:hidden">24×7 Mobile Highway Vans Active</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-300 hidden md:inline">
              📞 H.O. Helpline:{" "}
              <a href="tel:9140889473" className="text-white font-bold hover:text-red-400 transition">
                9140889473
              </a>
            </span>
            <span className="text-slate-300 hidden lg:inline">
              📞 B.O. Helpline:{" "}
              <a href="tel:9140109825" className="text-white font-bold hover:text-red-400 transition">
                9140109825
              </a>
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Avg Highway ETA: ~38 Mins</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Brand Logo & Tagline */}
            <div id="tour-brand" className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-600/20 text-white shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">TRUCK WALA</h1>
                  <span className="px-1.5 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
                    24×7
                  </span>
                </div>
                <p className="text-[11px] font-bold text-amber-700 tracking-wide">
                  Tata & Cummins Specialist • BS-III, IV, VI
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-700">
              <a href="#services" className="hover:text-red-600 transition">
                Services
              </a>
              <a href="#emergency" className="hover:text-red-600 transition flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>24×7 Highway SOS</span>
              </a>
              <a href="#evidence" className="hover:text-red-600 transition">
                Workshop Proof
              </a>
              <a href="#vehicles" className="hover:text-red-600 transition">
                Vehicles
              </a>
              <a href="#faq" className="hover:text-red-600 transition">
                AEO FAQs
              </a>
              <button
                onClick={() => setIsLlmsModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-200 transition cursor-pointer"
                title="View machine-readable LLM layer (/llms.txt)"
              >
                <Bot className="w-3.5 h-3.5 text-amber-600" />
                <span>/llms.txt</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                id="btn-public-tour"
                onClick={runTour}
                className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 rounded-xl transition font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Launch interactive tour"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Interactive Tour</span>
              </button>
              <button
                id="tour-emergency-sos"
                onClick={onOpenEmergency}
                className="px-3.5 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-sm shadow-red-600/30"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Roadside SOS</span>
              </button>
              <button
                id="tour-staff-login"
                onClick={onOpenLogin}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition font-bold text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Operations Portal</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={onOpenEmergency}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black"
              >
                SOS
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-800 hover:bg-slate-100"
              >
                Services
              </a>
              <a
                href="#emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100"
              >
                24×7 Highway SOS
              </a>
              <a
                href="#evidence"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-800 hover:bg-slate-100"
              >
                Workshop Proof
              </a>
              <a
                href="#vehicles"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-800 hover:bg-slate-100"
              >
                Vehicles
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 rounded-xl text-slate-800 hover:bg-slate-100"
              >
                AEO FAQs
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLlmsModalOpen(true);
                }}
                className="p-2.5 bg-amber-50 text-amber-900 rounded-xl hover:bg-amber-100 text-left flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-amber-700" />
                <span>/llms.txt</span>
              </button>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  runTour();
                }}
                className="w-full py-2.5 bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-700" />
                <span>Start Interactive Tour</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEmergency();
                }}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Request 24×7 Highway SOS</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs text-center"
              >
                Login to Workshop Operations
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Active Tour Banner */}
      {isTourRunning && (
        <div className="bg-amber-400 text-slate-950 px-4 py-2 text-xs sm:text-sm font-bold shadow-md relative z-30 border-b border-amber-500">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-slate-950 animate-spin shrink-0" />
              <span>Interactive Website Tour Active — Walking through key features</span>
            </div>
            <button
              onClick={handleSkipTour}
              className="px-3 py-1 bg-slate-950 text-white hover:bg-black rounded-lg text-xs font-bold cursor-pointer transition shrink-0"
            >
              Skip Tour ✕
            </button>
          </div>
        </div>
      )}

      {/* Tour Done Welcome Banner */}
      {showTourDoneBanner && (
        <div className="bg-emerald-600 text-white px-4 py-3 shadow-md relative z-30 border-b border-emerald-700">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-black text-xs shrink-0">
                ✓
              </span>
              <div>
                <p className="font-bold text-sm leading-tight flex items-center gap-2">
                  <span>Interactive Tour Completed!</span>
                  <span className="text-[10px] uppercase font-extrabold bg-emerald-800 text-emerald-100 px-2 py-0.5 rounded-md">
                    Home
                  </span>
                </p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Explore our Tata & Cummins services, view real workshop evidence, or test staff login.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#services"
                onClick={() => setShowTourDoneBanner(false)}
                className="px-3 py-1.5 bg-white text-emerald-900 rounded-lg text-xs font-bold transition shadow-xs"
              >
                Explore Services
              </a>
              <button
                onClick={runTour}
                className="px-3 py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
              <button
                onClick={() => setShowTourDoneBanner(false)}
                className="p-1 hover:bg-white/20 rounded text-white/80 hover:text-white cursor-pointer ml-1"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Specialized Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 pulse-dot"></span>
                <span>Tata & Cummins Commercial Vehicle Specialist</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                TRUCK WALA <span className="text-red-500">24×7</span>
              </h1>

              {/* Tagline */}
              <p className="text-xl sm:text-2xl font-bold text-amber-400">
                Complete Truck Solution Under One Roof
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                24×7 Commercial Vehicle Service • Computerized Laptop Diagnostics • Heavy Engine & Transmission Repairs • 100% Genuine Spare Parts • Emergency Roadside Assistance.
              </p>

              {/* Core Specialization Pill Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-slate-200">
                  BS-III • BS-IV • BS-VI Systems
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-slate-200">
                  Laptop OBD Diagnostics
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 font-bold text-slate-200">
                  SCR / DEF Dosing Recovery
                </span>
              </div>

              {/* 3 Prominent CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
                <button
                  id="btn-hero-emergency"
                  onClick={onOpenEmergency}
                  className="w-full sm:w-auto px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm sm:text-base transition shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span>🚨 24×7 Emergency Service</span>
                </button>
                <a
                  href="https://wa.me/917070709082?text=Hello%20Truck%20Wala%2024x7,%20I%20need%20commercial%20vehicle%20assistance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm sm:text-base transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>💬 WhatsApp Us</span>
                </a>
                <a
                  href="tel:9140889473"
                  className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-sm sm:text-base transition shadow-xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-emerald-400" />
                  <span>📞 Call Now (9140889473)</span>
                </a>
              </div>
            </div>

            {/* Right Card — Live Capability Dashboard */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white">Verified Ground Facility</h3>
                    <p className="text-xs text-slate-400">NH-48 Corridor Transport Hub</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/40">
                    Live Operations
                  </span>
                </div>

                <div className="space-y-3.5 mt-5 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-300">Central Helpline (H.O.)</span>
                    <a href="tel:9140889473" className="font-mono font-bold text-amber-400 hover:underline">
                      +91-9140889473
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-300">Workshop Floor (B.O.)</span>
                    <a href="tel:9140109825" className="font-mono font-bold text-amber-400 hover:underline">
                      +91-9140109825
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-300">Emergency & WhatsApp Direct</span>
                    <a href="https://wa.me/917070709082" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-emerald-400 hover:underline">
                      +91-7070709082
                    </a>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-slate-300">Active Mobile Rescue Vans</span>
                    <span className="font-bold text-emerald-400">4 Vans on Patrol</span>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
                  <button
                    id="tour-book-service"
                    onClick={() => onOpenBooking()}
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Schedule Workshop Bay Maintenance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFIED SIGNBOARD NUMBERS STRIP */}
      <div className="bg-amber-400 text-slate-950 py-3.5 px-4 border-b border-amber-500 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-slate-950 shrink-0" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-wide">
              Official Signboard Helplines:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 font-bold text-xs sm:text-sm">
            <div>
              <span className="text-slate-800 text-[11px] block font-semibold">Head Office (H.O.):</span>
              <a href="tel:9140889473" className="font-mono font-extrabold hover:underline">
                9140889473
              </a>
            </div>
            <div>
              <span className="text-slate-800 text-[11px] block font-semibold">Branch Office (B.O.):</span>
              <a href="tel:9140109825" className="font-mono font-extrabold hover:underline">
                9140109825
              </a>
            </div>
            <div>
              <span className="text-slate-800 text-[11px] block font-semibold">24×7 Emergency & WhatsApp:</span>
              <a href="tel:7070709082" className="font-mono font-extrabold hover:underline">
                7070709082
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 24×7 EMERGENCY HIGHWAY BREAKDOWN WORKFLOW */}
      <EmergencyWorkflowSection onOpenEmergency={onOpenEmergency} />

      {/* SERVICES ARCHITECTURE ("What We Do") */}
      <section id="services" className="py-20 bg-white">
        <div id="tour-services-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <span className="text-red-600 font-black text-xs tracking-wider uppercase mb-2 block">
              Commercial Fleet Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
              Complete Commercial Services Under One Roof
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Precision computer diagnostics, heavy engine rebuilding, genuine spare parts, and highway roadside rescue for Indian transporters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKSHOP_SERVICES.map((srv) => (
              <div
                key={srv.id}
                onClick={() => onOpenBooking(srv.id)}
                className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200 hover:border-red-500 hover:bg-white transition cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-lg"
              >
                <div>
                  <div className={`w-12 h-12 ${srv.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    {getServiceIcon(srv.icon)}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-0.5">{srv.title}</h3>
                  <p className="text-xs text-red-600 font-bold mb-3">{srv.hindiTitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{srv.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80">
                  <ul className="space-y-1.5 mb-4">
                    {srv.points.slice(0, 2).map((pt, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Book Service</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REAL WORKSHOP EVIDENCE & GROUND REALITY */}
      <RealEvidenceGallery />

      {/* VEHICLE COVERAGE MATRIX */}
      <VehicleCoverageSection />

      {/* 4-STAGE HOW IT WORKS */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-200">
        <div id="tour-how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-red-600 font-black text-xs tracking-wider uppercase mb-2 block">
              Transparent Operations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
              How Truck Wala 24×7 Operates
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every job—whether a roadside clutch fix or an in-bay engine rebuild—follows a transparent, photo-verified lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-lg font-black mx-auto mb-3 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Issue Reported</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Driver or fleet manager reports issue via WhatsApp voice note, call, or web form.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-lg font-black mx-auto mb-3 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Diagnostics & Triage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master ustad and systems engineer analyze fault codes or mechanical symptoms.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-lg font-black mx-auto mb-3 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Itemized Estimate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Owner approves exact labor and OEM spare parts pricing prior to teardown.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center text-lg font-black mx-auto mb-3 shadow-sm shadow-red-600/30">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Trial & Gate Pass</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Work completed with photo evidence, highway road test, and digital GST bill.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AEO (ANSWER ENGINE OPTIMIZATION) & TRANSPORTER FAQS */}
      <AeoFaqSection />

      {/* TESTIMONIALS / TRANSPORTER TRUST */}
      <section id="testimonials" className="py-20 bg-slate-50 border-t border-slate-200">
        <div id="tour-testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="text-red-600 font-black text-xs tracking-wider uppercase mb-2 block">
              Transporter Community
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3 tracking-tight">
              Trusted Along National Freight Routes
            </h2>
            <p className="text-sm text-slate-600">
              Real feedback from fleet owners, logistics operators, and highway drivers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "Our 16-wheel container truck had an air brake line rupture at 2 AM on NH-48. Truck Wala mobile van reached in 38 minutes with genuine Wabco parts. Consignment arrived on time."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                  HS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Harpreet Singh Dhillon</h4>
                  <p className="text-[11px] text-slate-500">Dhillon Logistics (38 Multi-Axle Fleet)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "Other mechanics kept guessing on our BS-VI Cummins SCR AdBlue fault code. Truck Wala connected their laptop, cleared the DPF derate and recalibrated the dosing unit on the spot."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  MK
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Mukesh Kumar Yadav</h4>
                  <p className="text-[11px] text-slate-500">Yadav Bulk Carriers, Jaipur-Delhi Route</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "Transparent rates and itemized bills. Replaced parts are photographed and verified. As a fleet director managing 24 trucks, this level of honesty is rare in highway maintenance."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  SS
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Satnam Singh</h4>
                  <p className="text-[11px] text-slate-500">Kisan Express Transport, Punjab-NCR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1: Brand & Purpose */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-md text-white">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">TRUCK WALA</h3>
                  <p className="text-xs text-red-500 font-bold uppercase">24×7 Service</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Tata & Cummins Commercial Vehicle Specialist. Providing laptop diagnostics, engine/gearbox overhauls, 100% genuine spare parts, and 24×7 highway roadside assistance.
              </p>
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Operations Portal (Admin / Staff)</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Column 2: Services */}
            <div>
              <h4 className="font-black text-xs mb-4 text-white uppercase tracking-wider">Services</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><button onClick={() => onOpenBooking("repair")} className="hover:text-red-400 transition text-left cursor-pointer">Truck Repair & Bay Overhaul</button></li>
                <li><button onClick={onOpenEmergency} className="hover:text-red-400 transition text-left cursor-pointer">24×7 Highway Emergency Breakdown</button></li>
                <li><button onClick={() => onOpenBooking("diagnostics")} className="hover:text-red-400 transition text-left cursor-pointer">BS-III, IV, VI Laptop OBD Diagnostics</button></li>
                <li><button onClick={() => onOpenBooking("parts")} className="hover:text-red-400 transition text-left cursor-pointer">100% Genuine Spare Parts Counter</button></li>
                <li><button onClick={() => onOpenBooking("maintenance")} className="hover:text-red-400 transition text-left cursor-pointer">Preventive Fleet Maintenance Schedules</button></li>
              </ul>
            </div>

            {/* Column 3: Vehicles */}
            <div>
              <h4 className="font-black text-xs mb-4 text-white uppercase tracking-wider">Vehicles Supported</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Tata Motors (Signa, Prima, 1613, 2518)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Cummins Diesel (ISBe 5.9 / 6.7, 4BT)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>Ashok Leyland (AVTR, Ecomet, 2820)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>BharatBenz, Eicher Pro, Mahindra Blazo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>BS-VI SCR / DPF / DEF AdBlue Dosing</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Verified Numbers & LLM */}
            <div>
              <h4 className="font-black text-xs mb-4 text-white uppercase tracking-wider">Direct Verified Contacts</h4>
              <ul className="space-y-2.5 text-slate-400 text-xs">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <span>H.O. Direct: <a href="tel:9140889473" className="text-white font-bold hover:underline font-mono">9140889473</a></span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>B.O. Support: <a href="tel:9140109825" className="text-white font-bold hover:underline font-mono">9140109825</a></span>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Emergency SOS: <a href="tel:7070709082" className="text-emerald-400 font-bold hover:underline font-mono">7070709082</a></span>
                </li>
                <li className="flex items-start space-x-2 pt-1">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>National Highway Junction, Transport Corridor</span>
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => setIsLlmsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-500" />
                  <span>View /llms.txt</span>
                </button>
                <button
                  onClick={handleResetTourPreference}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] font-bold flex items-center gap-1 border border-slate-800 transition cursor-pointer"
                  title="Clear tour memory to test first-visit experience again"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Tour</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-wrap items-center justify-between gap-4 text-slate-500 text-xs">
            <p>&copy; 2026 Truck Wala 24×7. Complete Commercial Vehicle Support Under One Roof.</p>
            <p className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All 4 Highway Mobile Vans Operational</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Guided Tour Launcher */}
      <div className="fixed bottom-18 md:bottom-5 right-5 z-30">
        <button
          id="btn-floating-tour"
          onClick={runTour}
          className="bg-slate-900 hover:bg-black text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-slate-700 text-xs sm:text-sm font-bold cursor-pointer group transition transform hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Compass className="w-4 h-4" />
          </div>
          <span>Interactive Tour</span>
        </button>
      </div>

      {/* Mobile Persistent Action Bar (Call / WhatsApp / Emergency) */}
      <MobileBottomBar onOpenEmergency={onOpenEmergency} />

      {/* Machine-Readable /llms.txt Modal */}
      <LlmsTxtModal isOpen={isLlmsModalOpen} onClose={() => setIsLlmsModalOpen(false)} />
    </div>
  );
};
