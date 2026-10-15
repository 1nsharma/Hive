import React, { useState, useEffect, useRef } from "react";
import { audioService } from "../lib/audioService";
import { guidedTour } from "../lib/guidedTour";
import { InteractiveExperienceCenter } from "./InteractiveExperienceCenter";
import {
  Sparkles, Shield, QrCode, Phone, MessageSquare, MapPin,
  AlertCircle, Check, ArrowRight, Heart, ExternalLink, Camera,
  ChevronDown, Search, Lock, HelpCircle, Activity, Tag, Star, Compass,
  Zap, Wifi, Globe, Users, Clock, Award, ChevronRight, ShieldCheck, Printer
} from "lucide-react";

interface LandingPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenPreorder: (type: string, price: string) => void;
  setToast: (msg: string) => void;
  waitlistPhone: string;
  setWaitlistPhone: (val: string) => void;
  waitlistPetName: string;
  setWaitlistPetName: (val: string) => void;
  waitlistStatus: "idle" | "success";
  handleJoinWaitlist: (e: React.FormEvent) => void;
  onOpenPosterModal?: () => void;
  onAddToCart?: (item: any) => void;
}

// Animated counter hook
function useCountUp(target: number, duration = 1400, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return val;
}

export default function LandingPage({
  onNavigateTab,
  onOpenPreorder,
  setToast,
  waitlistPhone,
  setWaitlistPhone,
  waitlistPetName,
  setWaitlistPetName,
  waitlistStatus,
  handleJoinWaitlist,
  onOpenPosterModal,
  onAddToCart,
}: LandingPageProps) {
  // Demo phone lost toggle state
  const [isHeroPetLost, setIsHeroPetLost] = useState(false);

  // Dynamic Typewriter Taglines
  const [taglineIdx, setTaglineIdx] = useState(0);
  const heroTaglines = [
    "one smart NFC/QR tag",
    "instant GPS scan alerts",
    "24/7 emergency AI care",
    "printable lost pet posters",
    "zero-app finder scans"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx(prev => (prev + 1) % heroTaglines.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [heroTaglines.length]);

  // Stats visibility on scroll
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.25 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCountUp(10000, 1400, statsVisible);
  const c2 = useCountUp(48, 1200, statsVisible);
  const c3 = useCountUp(94, 1000, statsVisible);
  const c4 = useCountUp(247, 1100, statsVisible);

  // Intent router state
  const [intentInput, setIntentInput] = useState("");
  const [detectedIntentKey, setDetectedIntentKey] = useState("protect");

  // Risk Accordion state
  const [openRiskCard, setOpenRiskCard] = useState<number | null>(0);

  // Intent mappings
  const INTENT_DATA: Record<string, { title: string; desc: string; modules: string[] }> = {
    protect: {
      title: "Protect My Pet",
      desc: "Lost pet guidance, tag activation, public SOS broadcasting, real-time scanning notifications and emergency backup contacts — activated instantly.",
      modules: ["Mark Lost / SOS Trigger", "Public Pet Profile Update", "Smart Tag Scanner Activation", "Emergency Contacts Backup", "Sighting Report Triggers"]
    },
    healthy: {
      title: "Keep My Pet Healthy",
      desc: "Automated symptom triage, professional food allergy matching, custom vaccination scheduler and wellness records logs — linked to vet routing.",
      modules: ["AI Care Chatbot", "Urgency Symptom Check", "Vaccination Schedule Timeline", "Deworming Alerts", "Veterinary Clinic Dispatch"]
    },
    train: {
      title: "Train My Pet",
      desc: "Step-by-step behavior charts, positive reinforcement tips, custom puppy progress boards, and trainer dispatch.",
      modules: ["Training Advice", "Positive Reinforcement Plans", "Trainer Marketplace Match (soon)"]
    },
    vet: {
      title: "Find the Best Vet",
      desc: "Verified nearby clinics and hospital locations with reviews and instant booking, linked to your pet's vaccination passport history.",
      modules: ["Clinic Geographic Listings", "Review Boards", "Appointment Scheduler (soon)"]
    },
    food: {
      title: "Buy Pet Food",
      desc: "Curated nutrition shop offering customized AI food picks that respect your dog's breed, age, weight, and existing allergies.",
      modules: ["Marketplace Cart (soon)", "Allergy-Aware Dietary Checks", "Subscription Deliveries"]
    },
    life: {
      title: "Manage My Pet's Entire Life",
      desc: "The unified pet cloud — medical files passport, pet insurance coverage, professional grooming booking, and city safety network.",
      modules: ["Lifetime Records Repository", "Insurance Binders", "Grooming & Daycare Planner", "Municipal Pet Net"]
    }
  };

  const handleRouteIntent = (queryText: string) => {
    const t = queryText.toLowerCase();
    const has = (...keys: string[]) => keys.some(k => t.includes(k));

    let key = "protect";
    if (has("kho", "lost", "missing", "gum", "sos", "scan", "tag", "reunite")) key = "protect";
    else if (has("train", "trick", "behav", "bite", "naughty", "bark")) key = "train";
    else if (has("vet", "doctor", "clinic", "hospital")) key = "vet";
    else if (has("order", "buy", "kharid", "treat", "food", "khareed", "shop")) key = "food";
    else if (has("manage", "entire", "record", "everything", "life", "insurance")) key = "life";
    else if (has("khana", "eat", "vaccin", "sick", "health", "vomit", "ulti", "weight", "bimar", "tired", "fever", "diarrhea")) key = "healthy";

    setDetectedIntentKey(key);
    audioService.playSuccess();
  };

  return (
    <div id="main-landing-content" className="space-y-16 text-gray-900 pb-12">

      {/* ===================================================================
          1. CINEMATIC DARK HERO WITH INTERACTIVE LIVE PHONE DEMO
          =================================================================== */}
      <section
        className="relative pt-12 pb-20 px-4 sm:px-8 rounded-3xl overflow-hidden shadow-2xl border border-emerald-900/80"
        style={{ background: 'linear-gradient(160deg, #030A07 0%, #081711 40%, #0D261C 100%)' }}
      >
        {/* Ambient mesh glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #F0A21E 0%, transparent 70%)', filter: 'blur(90px)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)', filter: 'blur(90px)' }} />

        {/* Animated grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-7">
            {/* Live Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>India's Most Advanced Pet Safety Platform</span>
            </div>

            {/* Giant Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-white leading-[1.05] tracking-tight">
                Your pet. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
                  Always safe.
                </span>
              </h1>

              {/* Dynamic Typewriter / Tagline Flip */}
              <div className="flex items-center gap-2.5 h-9">
                <span className="text-slate-400 text-xs sm:text-sm font-mono uppercase tracking-wider">PROTECTED BY:</span>
                <span
                  key={taglineIdx}
                  className="text-amber-300 font-extrabold text-sm sm:text-lg bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/30 transition-all shadow-sm"
                >
                  ⚡ {heroTaglines[taglineIdx]}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium max-w-xl">
              Give your pet a permanent digital identity, laser-engraved NFC/QR safety collar tag, automated vaccination reminders, and 24/7 AI health guidance — so your furry family always comes home.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  audioService.playSuccess();
                  onNavigateTab("dashboard");
                }}
                className="group px-7 py-4 rounded-2xl font-black text-sm text-white transition-all shadow-2xl cursor-pointer flex items-center gap-2.5 hover:scale-105 border border-emerald-400/30"
                style={{ background: 'linear-gradient(135deg, #175741, #248B68)' }}
              >
                <span>Protect Your Pet — Start Free</span>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <button
                onClick={() => {
                  audioService.playSuccess();
                  onOpenPreorder("NFC + QR Collar Tag", "₹499");
                }}
                className="px-7 py-4 rounded-2xl font-black text-sm border border-amber-400/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-2 hover:scale-105 shadow-lg"
              >
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Pre-order Tag (₹499)</span>
              </button>
            </div>

            {/* Micro Trust Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-App Finder Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Instant GPS SOS Relay</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Works Across All India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic iPhone 16 Style Device Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm">

              {/* Floating Live Event Badges */}
              <div className="absolute -top-4 -left-6 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl text-[11px] font-mono font-bold z-20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 shadow-2xl bg-stone-950/90 animate-float-slow">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>LIVE SCAN EVENT · MUMBAI</span>
              </div>
              <div className="absolute -bottom-4 -right-4 hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[11px] font-mono font-bold z-20 backdrop-blur-md border border-amber-400/40 text-amber-300 shadow-2xl bg-stone-950/90 animate-float-slow" style={{ animationDelay: '1.5s' }}>
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>REUNITED IN 6 HRS</span>
              </div>

              {/* Phone Device Bezel */}
              <div
                className="bg-gray-950 p-3 rounded-[44px] shadow-2xl border-2 border-slate-700/60 relative overflow-hidden"
                style={{ boxShadow: '0 40px 90px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)' }}
              >
                {/* Screen Reflection Highlight */}
                <div className="absolute inset-0 device-reflection pointer-events-none z-30" />

                {/* Inner Screen */}
                <div className="bg-gradient-to-b from-[#FFFDF8] to-[#F7F2E7] rounded-[34px] p-4 text-left space-y-3 overflow-hidden border border-amber-200/60 shadow-inner relative z-10">

                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                    <span className="font-bold">petsjanu.com/p/IND-10293</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                      isHeroPetLost ? "bg-red-600 text-white animate-pulse shadow-md shadow-red-600/40" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {isHeroPetLost ? "🚨 SOS LOST" : "🟢 SAFE · HOME"}
                    </span>
                  </div>

                  {/* Pet Photo Card */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-amber-200 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600"
                      alt="Bruno Indian dog"
                      className="w-full h-full object-cover"
                    />
                    {isHeroPetLost && (
                      <div className="absolute inset-0 bg-red-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center">
                        <span className="bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-lg shadow-lg uppercase tracking-wider animate-bounce">
                          EMERGENCY LOST PET ALERT
                        </span>
                        <span className="text-[10px] text-white/90 font-mono mt-1 font-bold">148 NEARBY PARENTS NOTIFIED</span>
                      </div>
                    )}
                    {/* Tag badge overlay */}
                    <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/20">
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[9px] font-mono font-black text-white">NFC + QR</span>
                    </div>
                  </div>

                  {/* Name & ID Slug */}
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-2xl font-black text-gray-900">Bruno</h3>
                      <span className="font-mono text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                        IND-PET-10293
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                      Desi Indie · Male · 3 Yrs · 18 kg · Andheri W, Mumbai
                    </p>
                  </div>

                  {/* Medical Alert Badge */}
                  <div className="p-2 rounded-xl bg-amber-100/80 text-amber-900 border border-amber-300/80 text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                    <span>⚠️ Medical Alert:</span> Sensitive Stomach &amp; Chicken Allergy
                  </div>

                  {/* Direct Encrypted Calling & WhatsApp Relay */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        audioService.playSuccess();
                        setToast("📞 Masked Relay Active: Connecting to Bruno's owner via +91 ••••• 43210");
                      }}
                      className="py-2.5 px-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: '#175741' }}
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-300" />
                      <span>Call Owner</span>
                    </button>
                    <button
                      onClick={() => {
                        audioService.playSuccess();
                        setToast("💬 Opening secure WhatsApp relay session for Bruno's owner");
                      }}
                      className="py-2.5 px-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm hover:opacity-90 transition-all cursor-pointer"
                      style={{ backgroundColor: "#25D366" }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  {/* Sighting button */}
                  <button
                    onClick={() => {
                      audioService.playRadarPing();
                      onNavigateTab("publicPage");
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-slate-950" />
                    <span>File Instant Sighting Report</span>
                  </button>
                </div>
              </div>

              {/* Interactive Simulation Toggle */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="text-slate-400 text-xs font-mono font-bold uppercase">Simulator:</span>
                <div className="flex items-center gap-1.5 p-1 rounded-full border border-slate-700 bg-slate-900/90 shadow-lg">
                  <button
                    onClick={() => {
                      setIsHeroPetLost(false);
                      audioService.playSuccess();
                      setToast("🏠 Marked safe. Bruno is home!");
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      !isHeroPetLost ? "bg-emerald-700 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🏠 Safe Mode
                  </button>
                  <button
                    onClick={() => {
                      setIsHeroPetLost(true);
                      audioService.playSosAlarm();
                      setToast("🚨 SOS LIVE — Public profile now broadcasts emergency lost alert!");
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      isHeroPetLost ? "bg-red-600 text-white shadow-md animate-pulse" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    🚨 Lost SOS
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================
          2. ANIMATED LIVE METRICS ROW
          =================================================================== */}
      <section ref={statsRef} className="px-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: c1, suffix: "+", label: "Pets Protected Across India", color: "text-[#175741]" },
            { value: c2 / 10, suffix: "★", label: "Pet Parent Rating (10k+ Reviews)", color: "text-amber-600" },
            { value: c3, suffix: "%", label: "Reunite Recovery Rate", color: "text-[#175741]" },
            { value: c4, suffix: "+", label: "Cities with Active Coverage", color: "text-amber-600" },
          ].map(({ value, suffix, label, color }, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl text-center border border-amber-200/70 bg-white shadow-sm hover:shadow-md transition-all space-y-1"
            >
              <div className={`font-serif text-3xl sm:text-5xl font-black ${color}`}>
                {suffix === "★" ? `${value.toFixed(1)}` : Math.floor(value as number).toLocaleString()}{suffix}
              </div>
              <div className="text-xs text-stone-600 font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          3. HOW IT WORKS — 3-STEP VISUAL FLOW
          =================================================================== */}
      <section className="py-6 px-2">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-full border border-amber-300">
            SIMPLE &amp; BULLETPROOF
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight">
            Three steps to <span className="text-[#175741] italic">total pet safety.</span>
          </h2>
          <p className="text-stone-500 text-sm font-medium">From unboxing your tag to lifelong safety network — takes under 3 minutes.</p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              step: "01",
              icon: QrCode,
              title: "Attach Your Smart Tag",
              desc: "Clip the NFC + laser-etched QR tag to your pet's collar. Tap with your phone to bind it to a free lifetime profile in seconds.",
              color: "bg-amber-50 border-amber-200 text-amber-700",
              accentBg: "bg-amber-500",
            },
            {
              step: "02",
              icon: Shield,
              title: "Build the Digital Profile",
              desc: "Add photos, emergency contact backup, medical alerts, and vaccine schedule. Automated reminders alert you before boosters are due.",
              color: "bg-emerald-50 border-emerald-200 text-emerald-700",
              accentBg: "bg-[#175741]",
            },
            {
              step: "03",
              icon: Heart,
              title: "Stay Protected Everywhere",
              desc: "If your pet ever gets lost, broadcast an instant SOS. Anyone with a smartphone can scan the tag with zero app download needed.",
              color: "bg-amber-50 border-amber-200 text-amber-700",
              accentBg: "bg-amber-500",
            },
          ].map(({ step, icon: Icon, title, desc, color, accentBg }, i) => (
            <div key={i} className={`relative p-7 rounded-3xl border text-center space-y-4 ${color} shadow-sm hover:shadow-md transition-all`}>
              <div className={`w-14 h-14 rounded-2xl ${accentBg} text-white flex items-center justify-center mx-auto shadow-md`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="font-mono text-xs font-black opacity-60">STEP {step}</div>
              <h3 className="font-serif font-black text-xl text-stone-900">{title}</h3>
              <p className="text-xs leading-relaxed text-stone-600 font-semibold">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          4. FLAGSHIP 7-STATION INTERACTIVE EXPERIENCE CENTER
          =================================================================== */}
      <InteractiveExperienceCenter
        onOpenPosterModal={onOpenPosterModal}
        onNavigateTab={onNavigateTab}
        setToast={setToast}
        onAddToCart={onAddToCart}
      />

      {/* ===================================================================
          5. 6-CARD FEATURE BENTO GRID
          =================================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-stone-100 text-stone-800 text-xs font-black rounded-full border border-stone-300">
            THE PETJANU ECOSYSTEM
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-stone-900">
            Engineered for <span className="text-[#175741] italic">real-world pet emergencies.</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">Every tool you need to protect, care for, and recover your pet.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: QrCode,
              title: "Smart NFC + QR Collar Tag",
              desc: "Zero battery, weatherproof IP68, laser-etched paw ID that works on every iPhone and Android camera without installing any app.",
              badge: "Hardware",
              accent: "amber",
            },
            {
              icon: AlertCircle,
              title: "Lost Pet SOS Radar",
              desc: "Instant multi-channel broadcast to all verified pet parents within 5 km, with live GPS sighting map and WhatsApp alerts.",
              badge: "Emergency",
              accent: "red",
            },
            {
              icon: Activity,
              title: "24/7 AI Clinical Triage",
              desc: "Evidence-backed symptom checker in Hindi, English & Hinglish that gives calm guidance and immediate hospital routing.",
              badge: "Health AI",
              accent: "blue",
            },
            {
              icon: Shield,
              title: "Digital Health Passport",
              desc: "Permanent vaccine records, deworming calendar, allergy records, and microchip numbers shareable with any vet via QR.",
              badge: "Records",
              accent: "emerald",
            },
            {
              icon: Printer,
              title: "Lost Poster Lab (300 DPI)",
              desc: "Generate high-resolution printable A4 lost flyers with photo, scannable QR, and reward badge in 1 click ready for print.",
              badge: "Print Ready",
              accent: "amber",
            },
            {
              icon: Users,
              title: "Community Safety Network",
              desc: "Over 10,000 active pet parents and vetted clinics connected to form India's fastest lost pet recovery network.",
              badge: "Community",
              accent: "emerald",
            },
          ].map(({ icon: Icon, title, desc, badge, accent }, i) => {
            const accentMap: Record<string, string> = {
              amber: "bg-amber-100 text-amber-800 border-amber-200",
              red: "bg-red-100 text-red-800 border-red-200",
              blue: "bg-blue-100 text-blue-800 border-blue-200",
              emerald: "bg-emerald-100 text-[#175741] border-emerald-200",
            };
            const iconBgMap: Record<string, string> = {
              amber: "bg-amber-500 text-white",
              red: "bg-red-500 text-white",
              blue: "bg-blue-600 text-white",
              emerald: "bg-[#175741] text-white",
            };
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-stone-200 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all space-y-4 group"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${iconBgMap[accent]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${accentMap[accent]}`}>
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-stone-900 mb-1">{title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-semibold">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================
          6. INTENT ROUTER ARCHITECTURE COMMAND BAR
          =================================================================== */}
      <section className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl space-y-8 shadow-2xl border border-emerald-800/70">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            ⚡ AI COMMAND CENTER
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-white">
            One Intent. One AI. <span className="text-amber-400 italic">Every Pet Need.</span>
          </h2>
          <p className="text-sm md:text-base text-emerald-200/90 leading-relaxed font-medium">
            Users don't hunt for complex menus — they express an intent in plain language. The PetJanu AI router detects it and activates the right modules instantly.
          </p>
        </div>

        {/* Command Search Input */}
        <div className="space-y-4 max-w-4xl bg-emerald-900/60 p-6 rounded-2xl border border-emerald-700/80 shadow-inner">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={intentInput}
              onChange={e => setIntentInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleRouteIntent(intentInput || "Mera pet kho gaya hai"); }}
              placeholder='Type in Hindi or English… e.g. "Mera pet kho gaya hai" or "Puppy vaccine schedule"'
              className="flex-1 px-4 py-3.5 rounded-xl bg-emerald-950 border border-emerald-700 text-white placeholder-emerald-500 text-sm focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <button
              onClick={() => handleRouteIntent(intentInput || "Mera pet kho gaya hai")}
              className="px-7 py-3.5 rounded-xl font-black text-xs bg-amber-400 text-stone-950 hover:bg-amber-300 cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Route Intent</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Sample Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "Mera pet kho gaya hai",
              "Khana nahi kha raha",
              "Train my puppy",
              "Best vet nearby",
              "Order pet food",
              "Manage entire life"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIntentInput(chip);
                  handleRouteIntent(chip);
                }}
                className="px-3.5 py-1.5 rounded-full border border-emerald-700 hover:border-amber-400 text-emerald-200 hover:text-amber-300 text-[11px] font-bold transition-all cursor-pointer bg-emerald-950/60"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Detected Intent Feedback */}
          <div className="pt-4 border-t border-dashed border-emerald-800 space-y-3">
            <span className="inline-block px-3 py-1 rounded-md bg-amber-400 text-stone-950 font-mono font-black text-xs uppercase tracking-wider shadow-sm">
              INTENT DETECTED: {INTENT_DATA[detectedIntentKey].title}
            </span>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed font-semibold">
              {INTENT_DATA[detectedIntentKey].desc}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {INTENT_DATA[detectedIntentKey].modules.map((m, mIdx) => (
                <span
                  key={mIdx}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================================
          9. RESPONSIBLE AI SAFETY & RISK ACCORDION
          =================================================================== */}
      <section className="bg-amber-50/70 p-8 sm:p-12 rounded-3xl border border-amber-200/80 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800">CLINICAL TRIAGE STANDARDS</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">
            An assistant, <span className="text-[#175741] italic">never a doctor.</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            PetJanu AI is a certified emergency care triage companion with hard guardrails. It calms parents, triages symptoms, and routes immediately to registered vets — it never prescribes or replaces clinical diagnosis.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {[
            {
              level: "LOW RISK",
              title: "Active, eating normally, minor superficial issue",
              color: "bg-emerald-100 text-emerald-800 border-emerald-300",
              details: "Monitor at home. Ensure fresh water is available, log daily intake in the health passport, and observe energy levels."
            },
            {
              level: "MONITOR",
              title: "Mild or unclear symptoms (missed 1 meal, mild scratching)",
              color: "bg-blue-100 text-blue-900 border-blue-300",
              details: "Observe for 12–24 hours. Track hydration, bowel movements, and body temperature. Consult a vet if condition deteriorates."
            },
            {
              level: "VET RECOMMENDED",
              title: "Persistent vomiting, severe diarrhea, limp, ear hematoma",
              color: "bg-amber-400 text-stone-950 font-black border-amber-500",
              details: "Book an appointment at a nearby clinic within 24 hours. Carry digital vaccination passport. Never administer human paracetamol or painkillers."
            },
            {
              level: "URGENT EMERGENCY",
              title: "Toxic ingestion (chocolate/grapes), seizures, acute dyspnea, collapse",
              color: "bg-red-600 text-white font-black border-red-700 animate-pulse",
              details: "Contact an emergency clinic immediately. Keep pet calm and warm while traveling. Immediate hands-on veterinary trauma care is critical."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-amber-200 rounded-2xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenRiskCard(openRiskCard === idx ? null : idx)}
                className="w-full p-4.5 flex items-center justify-between text-left hover:bg-amber-50/50 cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold ${item.color}`}>
                    {item.level}
                  </span>
                  <h4 className="font-serif font-black text-sm text-gray-900">{item.title}</h4>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openRiskCard === idx ? "rotate-180" : ""}`} />
              </button>

              {openRiskCard === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed font-semibold border-t border-gray-100 bg-gray-50/60">
                  {item.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          10. REUNITE STORIES
          =================================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-800">REAL RECOVERY STORIES</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-900">
            Scanned by strangers. <span className="text-[#175741] italic">Brought home safely.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3 hover:shadow-lg transition-all">
            <div className="rounded-2xl overflow-hidden aspect-video border border-stone-200">
              <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600" alt="Reunited dog" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-black text-lg text-gray-900">Sheru came home</h4>
            <p className="text-xs text-gray-600 font-medium">A delivery partner scanned the collar tag outside Jaipur metro station. The family reached within 20 minutes.</p>
            <span className="text-[10px] font-mono font-black text-[#175741] block pt-1 border-t border-stone-100">
              CASE #IND-11842 · JAIPUR · REUNITED IN 9 HRS
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3 hover:shadow-lg transition-all">
            <div className="rounded-2xl overflow-hidden aspect-video border border-stone-200">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600" alt="Bruno indie dog" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-black text-lg text-gray-900">Bruno's bakery sighting</h4>
            <p className="text-xs text-gray-600 font-medium">Three sighting reports with location pins in one evening. Found asleep safely near his favourite bakery.</p>
            <span className="text-[10px] font-mono font-black text-[#175741] block pt-1 border-t border-stone-100">
              CASE #IND-10293 · MUMBAI · 3 SIGHTINGS REPORTED
            </span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-3 hover:shadow-lg transition-all">
            <div className="rounded-2xl overflow-hidden aspect-video border border-stone-200">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600" alt="Mithu cat" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-black text-lg text-gray-900">Mithu's balcony escape</h4>
            <p className="text-xs text-gray-600 font-medium">Lost-mode banner went live at 7 pm. A neighbour two floors down scanned and WhatsApped by 7:40 pm.</p>
            <span className="text-[10px] font-mono font-black text-[#175741] block pt-1 border-t border-stone-100">
              CASE #IND-20881 · PUNE · REUNITED IN 40 MIN
            </span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          11. PUBLIC TRUST & CERTIFICATIONS SHOWCASE
          =================================================================== */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-8 max-w-6xl mx-auto">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Lock className="w-3.5 h-3.5 text-[#175741]" /> PUBLIC TRUST GUARANTEE
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-black text-[#1C2B23]">
            Why 10,000+ Indian Pet Parents <span className="text-[#175741]">Trust PetJanu</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Built with uncompromising privacy, bank-grade encryption, and registered veterinary oversight.
          </p>
        </div>

        {/* 5 Core Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { icon: "🐾", title: "10,000+ Pet Parents", desc: "Active community across Mumbai, Bengaluru & Delhi" },
            { icon: "🩺", title: "Vet-Verified Rules", desc: "Curated with Veterinary Council of India guidelines" },
            { icon: "🔒", title: "256-Bit Encrypted", desc: "Bank-grade data protection at rest and in transit" },
            { icon: "🛡️", title: "Zero Data Selling", desc: "We never sell or share your phone with third parties" },
            { icon: "⚡", title: "Open & Transparent", desc: "Public roadmap, clear pricing, 24-hr resolution SLA" }
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1.5 hover:border-amber-300 transition-all">
              <div className="text-2xl mb-1">{item.icon}</div>
              <h4 className="font-black text-xs text-stone-900">{item.title}</h4>
              <p className="text-[10px] text-stone-500 font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Badges Bar */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-stone-600">
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> SSL 256-bit Encrypted</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Razorpay PCI DSS Level 1</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> India DPDP Act 2023 Compliant</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> 4.9★ Verified Trust Score</span>
        </div>
      </section>

      {/* ===================================================================
          12. WAITLIST FORM & RESERVATION SECTION
          =================================================================== */}
      <section id="waitlist-section" className="bg-emerald-950 text-white p-8 sm:p-14 rounded-3xl text-center space-y-6 shadow-2xl border border-emerald-800 max-w-5xl mx-auto">
        <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400">JOIN 1,200+ FOUNDING PET PARENTS</span>
        <h2 className="font-serif text-3xl sm:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
          Keep your pet safe, identified, <span className="text-amber-400 italic">&amp; loved.</span>
        </h2>
        <p className="text-xs sm:text-sm text-emerald-200/90 max-w-md mx-auto font-medium">
          Free lifetime digital profile. Early-bird hardware discounts. Founding pet parent badge forever.
        </p>

        <div className="max-w-md mx-auto">
          {waitlistStatus === "success" ? (
            <div className="p-6 rounded-2xl bg-emerald-900 border border-emerald-700 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mx-auto text-stone-950 font-black text-2xl">
                🐾
              </div>
              <h3 className="font-serif text-xl font-black text-white">{waitlistPetName} is reserved!</h3>
              <p className="text-xs text-emerald-200 font-medium">
                We'll WhatsApp you at <strong className="text-white">{waitlistPhone}</strong> as soon as batch 1 tags dispatch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="space-y-3.5 bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800 text-left shadow-inner">
              <div>
                <label className="block text-[10px] font-mono font-black uppercase tracking-wider text-emerald-300 mb-1">Mobile Phone (India)</label>
                <input
                  type="tel"
                  required
                  value={waitlistPhone}
                  onChange={e => setWaitlistPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-black uppercase tracking-wider text-emerald-300 mb-1">Pet's Name 🐾</label>
                <input
                  type="text"
                  required
                  value={waitlistPetName}
                  onChange={e => setWaitlistPetName(e.target.value)}
                  placeholder="e.g. Bruno / Luna / Simba"
                  className="w-full px-4 py-3 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-black text-xs bg-amber-400 hover:bg-amber-300 text-stone-950 transition-all cursor-pointer shadow-xl mt-2 hover:scale-[1.02]"
              >
                Join Waitlist Free →
              </button>
            </form>
          )}
        </div>

        <p className="text-[10px] font-mono text-emerald-400 font-bold">
          1,247 PET PARENTS ALREADY IN LINE · ZERO SPAM, ONLY SAFETY
        </p>
      </section>

    </div>
  );
}
