import React, { useState } from "react";
import { 
  Sparkles, Shield, QrCode, Phone, MessageSquare, MapPin, 
  AlertCircle, Check, ArrowRight, Heart, ExternalLink, Camera,
  ChevronDown, Search, Lock, HelpCircle, Activity, Tag, Star, Compass
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
  onOpenTourModal?: () => void;
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
  onOpenTourModal,
}: LandingPageProps) {
  // Demo phone lost toggle state
  const [isHeroPetLost, setIsHeroPetLost] = useState(false);

  // Intent router state
  const [intentInput, setIntentInput] = useState("");
  const [detectedIntentKey, setDetectedIntentKey] = useState("protect");

  // Demo panel tab state
  const [activeDemoTab, setActiveDemoTab] = useState<"owner" | "public" | "ai">("owner");

  // AI chat demo state
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: "user" | "ai"; risk?: "low" | "mon" | "vet" | "urg" }>>([
    {
      text: "Namaste! 🐾 I'm Bruno's AI care companion. Tell me a symptom ('kha nahi raha', vomiting…) or ask about food, vaccines, behavior. I'll triage calmly and tell you the risk level.",
      sender: "ai",
      risk: "low"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Risk Accordion state
  const [openRiskCard, setOpenRiskCard] = useState<number | null>(0);

  // Demo Vaccinations state
  const [demoVaccs, setDemoVaccs] = useState([
    { id: 1, name: "Rabies Vaccine", meta: "Done · 4 Jan 2025 · City Vet Clinic", done: true },
    { id: 2, name: "DHPPi Booster", meta: "Due · 12 Oct 2025 · reminder on", done: false },
    { id: 3, name: "Deworming", meta: "Due · 2 Nov 2025 · reminder on", done: false },
    { id: 4, name: "Annual Health Checkup", meta: "Scheduled · 20 Oct 2025", done: false }
  ]);

  // Demo Sightings state
  const [demoSightings, setDemoSightings] = useState([
    { name: "Ravi (neighbour)", area: "Bakery lane, Andheri W", note: "Saw him near the bakery around 6 pm, looked fine.", time: "26 min ago", verified: true }
  ]);
  const [sightingName, setSightingName] = useState("");
  const [sightingArea, setSightingArea] = useState("");
  const [sightingNote, setSightingNote] = useState("");

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
  };

  const handleAIChatSubmit = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setChatInput("");

    setChatMessages(prev => [...prev, { text: userMsg, sender: "user" }]);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let risk: "low" | "mon" | "vet" | "urg" = "low";
      let aiResponse = "";

      if (lower.includes("seizure") || lower.includes("breath") || lower.includes("bleed") || lower.includes("poison") || lower.includes("collapse")) {
        risk = "urg";
        aiResponse = "🚨 URGENT RISK DETECTED\n\nImmediate steps: Contact a vet or emergency clinic right now — do not wait. Keep Bruno calm, warm, and still while traveling. Do not give human medicine.";
      } else if (lower.includes("vomit") || lower.includes("ulti") || lower.includes("diarrhea") || lower.includes("fever") || lower.includes("pain")) {
        risk = "vet";
        aiResponse = "⚠️ VET RECOMMENDED\n\nPersistent symptoms like this need a professional check — could be an infection or dietary issue. Book a vet visit within 24 hours. Carry vaccination records.";
      } else if (lower.includes("khana nahi") || lower.includes("not eating") || lower.includes("tired") || lower.includes("scratch")) {
        risk = "mon";
        aiResponse = "🟡 MONITOR CLOSELY (12-24 HRS)\n\nObserve food, water, and energy. Try a bland, familiar meal in a quiet spot. If refusal of food or water continues past 24 hrs, consult a vet.";
      } else {
        risk = "low";
        aiResponse = "🟢 RISK LEVEL: LOW\n\nGood news — nothing in what you described looks alarming. Ensure fresh water is available and log any updates in Bruno's health passport.";
      }

      setChatMessages(prev => [...prev, { text: aiResponse, sender: "ai", risk }]);
    }, 600);
  };

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sightingName || !sightingArea) return;

    setDemoSightings(prev => [
      { name: sightingName, area: sightingArea, note: sightingNote || "Spotted near landmark.", time: "Just now", verified: false },
      ...prev
    ]);

    setSightingName("");
    setSightingArea("");
    setSightingNote("");
    setToast("📍 Live Sighting Report sent to Bruno's owner!");
  };

  return (
    <div className="space-y-16 text-gray-900 pb-12">
      
      {/* ===================================================================
          1. HERO SECTION WITH DYNAMIC LIVE PHONE DEMO
          =================================================================== */}
      <section className="relative pt-6 pb-12 overflow-hidden border-b border-amber-200/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Copy & Trust Signals */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-[#175741] border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              India's Most Trusted Pet Safety Service
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight leading-tight text-gray-900">
              Keep your pet safe with <span className="text-[#175741] underline decoration-[#F0A21E] underline-offset-4">one smart tag</span> &amp; <span className="text-[#F0A21E] italic font-serif">24/7 AI care.</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium max-w-xl">
              Give your pet a digital ID, QR/NFC safety collar tag, automated vaccination reminders, and 24/7 AI health guidance — so your furry family member always comes home.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                id="tour-hero-protect-btn"
                onClick={() => onNavigateTab("dashboard")}
                className="px-6 py-3.5 rounded-full font-bold text-sm text-white hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: '#175741' }}
              >
                Protect Your Pet — Start Free <ArrowRight className="w-4 h-4 text-[#F0A21E]" />
              </button>
              <button 
                id="tour-hero-tag-cta"
                onClick={() => onOpenPreorder("NFC + QR Collar Tag", "₹499")}
                className="px-6 py-3.5 rounded-full font-bold text-sm border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
              >
                <Tag className="w-4 h-4 text-amber-700" /> Pre-order Smart Tag (₹499)
              </button>
              {onOpenTourModal && (
                <button
                  id="tour-hero-economy-walkthrough"
                  onClick={onOpenTourModal}
                  className="px-5 py-3 rounded-full font-extrabold text-xs border border-emerald-300 bg-emerald-50 text-[#175741] hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <Compass className="w-4 h-4 text-[#B87A08]" /> Guided Economy Tour ✨
                </button>
              )}
            </div>

            <div className="pt-2 font-mono text-xs text-stone-500 flex items-center gap-2">
              <span>Public Profile URL:</span>
              <strong className="text-[#175741] bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                petsjanu.com/p/IND-PET-10293
              </strong>
            </div>

            {/* Trust Signals Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-amber-200/60 text-xs">
              <div>
                <div className="font-serif text-2xl font-black text-[#175741]">10,000+</div>
                <div className="text-gray-500 font-medium">Pets Protected</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-[#F0A21E]">4.8 ★</div>
                <div className="text-gray-500 font-medium">Pet Parent Rating</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-[#175741]">Vet-Reviewed</div>
                <div className="text-gray-500 font-medium">Medical Content</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-black text-[#F0A21E]">24 / 7</div>
                <div className="text-gray-500 font-medium">Emergency Care</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Phone Device Frame */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div id="tour-phone-demo-card" className="w-full max-w-xs bg-gray-900 p-3 rounded-[36px] shadow-2xl border-4 border-gray-800 relative">
              
              {/* Floating Badges */}
              <div className="absolute -top-3 -left-4 bg-white border border-amber-300 shadow-md rounded-full px-3 py-1 text-[10px] font-bold font-mono text-emerald-800 flex items-center gap-1.5 z-10">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                LIVE QR SCANNER
              </div>
              <div className="absolute -bottom-3 -right-4 bg-emerald-900 text-white shadow-md rounded-full px-3 py-1 text-[10px] font-bold font-mono flex items-center gap-1 z-10">
                <Check className="w-3 h-3 text-amber-400" /> REUNITED IN 6 HRS
              </div>

              {/* Screen Content */}
              <div className="bg-gradient-to-b from-amber-50/80 to-white rounded-[28px] p-4 text-left space-y-3 overflow-hidden border border-amber-100">
                
                {/* Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>PETGUARDIAN PUBLIC ID</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold uppercase ${isHeroPetLost ? "bg-red-600 text-white animate-pulse" : "bg-emerald-100 text-emerald-800"}`}>
                    {isHeroPetLost ? "🚨 LOST SOS" : "🟢 SAFE · HOME"}
                  </span>
                </div>

                {/* Pet Photo */}
                <div className="relative rounded-2xl overflow-hidden aspect-video border border-amber-200 shadow-xs">
                  <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600" 
                    alt="Bruno Indian indie dog" 
                    className="w-full h-full object-cover"
                  />
                  {isHeroPetLost && (
                    <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center p-2 text-center">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow uppercase tracking-wider">
                        EMERGENCY LOST PET ALERT
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & Slug */}
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-black text-gray-900">Bruno</h3>
                    <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      IND-PET-10293
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">Indie · Male · 3 yrs · 18 kg · Andheri W, Mumbai</p>
                </div>

                {/* Lost Banner if Lost */}
                {isHeroPetLost && (
                  <div className="p-2.5 rounded-xl bg-red-600 text-white text-xs font-bold text-center space-y-0.5 shadow-sm">
                    <div>🚨 THIS PET IS LOST!</div>
                    <div className="text-[10px] font-normal opacity-90">Please contact Rahul Sharma or file a sighting report below.</div>
                  </div>
                )}

                {/* Relayed Call & WhatsApp */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => setToast("📞 Connecting via secure masked number +91 ••••• 43210")}
                    className="py-2 px-2 rounded-xl text-xs font-bold bg-emerald-800 text-white flex items-center justify-center gap-1 hover:bg-emerald-900 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" /> Call Owner
                  </button>
                  <button 
                    onClick={() => setToast("💬 Opening secure WhatsApp relay session")}
                    className="py-2 px-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                    style={{ backgroundColor: "#25D366" }}
                  >
                    <MessageSquare className="w-3 h-3" /> WhatsApp
                  </button>
                </div>

                {/* Allergy Box */}
                <div className="p-2 rounded-xl bg-amber-100/70 text-amber-900 border border-amber-200 text-[10px] font-semibold flex items-center gap-1">
                  ⚠️ Medical Alert: Sensitive Stomach &amp; Chicken Allergy
                </div>

                {/* QR Code */}
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 border rounded flex items-center justify-center text-xs font-mono font-bold text-gray-700">
                    <QrCode className="w-8 h-8 text-gray-800" />
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium leading-snug">
                    <strong className="block text-gray-900 font-bold">SCAN TO REUNITE</strong>
                    QR + NFC collar tag · Owner privacy protected
                  </div>
                </div>

                {/* Sighting Button */}
                <button 
                  onClick={() => onNavigateTab("publicPage")}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  📍 File Sighting Report
                </button>
              </div>
            </div>

            {/* Segmented Lost/Safe Toggle Control */}
            <div className="mt-4 bg-amber-100/80 p-1 rounded-full border border-amber-300 flex items-center gap-1 text-xs font-bold">
              <button 
                onClick={() => { setIsHeroPetLost(false); setToast("🏠 Marked safe. Welcome home Bruno!"); }}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${!isHeroPetLost ? "bg-emerald-800 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
              >
                🏠 Mark Safe
              </button>
              <button 
                onClick={() => { setIsHeroPetLost(true); setToast("🚨 SOS LIVE — public page now broadcasts Lost Alert!"); }}
                className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${isHeroPetLost ? "bg-red-600 text-white shadow-xs" : "text-gray-600 hover:text-gray-900"}`}
              >
                🚨 Mark Lost
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. INTENT ROUTER ARCHITECTURE SECTION
          =================================================================== */}
      <section id="tour-intent-router" className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl space-y-8 shadow-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
            INTENT-BASED ARCHITECTURE
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-white">
            One Intent. One AI. <span className="text-amber-400 italic">Every Pet Need.</span>
          </h2>
          <p className="text-sm md:text-base text-emerald-200/90 leading-relaxed font-medium">
            Users don't hunt for features — they express an intent. The PetGuardian router detects it and activates the right modules, services, and guidance instantly.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="space-y-4 max-w-3xl bg-emerald-900/50 p-6 rounded-2xl border border-emerald-800">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={intentInput}
              onChange={e => setIntentInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleRouteIntent(intentInput || "Mera pet kho gaya hai"); }}
              placeholder='Type anything… e.g. "Mera pet kho gaya hai" or "Vaccination schedule"' 
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-white placeholder-emerald-500 text-sm focus:outline-none focus:border-amber-400"
            />
            <button 
              onClick={() => handleRouteIntent(intentInput || "Mera pet kho gaya hai")}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-500 text-emerald-950 hover:bg-amber-400 cursor-pointer transition-all"
            >
              Route Intent →
            </button>
          </div>

          {/* Preset Chips */}
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
                onClick={() => { setIntentInput(chip); handleRouteIntent(chip); }}
                className="px-3 py-1.5 rounded-full border border-emerald-700 hover:border-amber-400 text-emerald-200 hover:text-amber-300 text-[11px] font-medium transition-all cursor-pointer bg-emerald-950/40"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Detected Intent Output Box */}
          <div className="pt-4 border-t border-dashed border-emerald-800/80 space-y-3">
            <span className="inline-block px-2.5 py-0.5 rounded bg-amber-500 text-emerald-950 font-mono font-bold text-[10px] tracking-wider uppercase">
              INTENT DETECTED: {INTENT_DATA[detectedIntentKey].title}
            </span>
            <p className="text-xs md:text-sm text-emerald-100 leading-relaxed font-medium">
              {INTENT_DATA[detectedIntentKey].desc}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {INTENT_DATA[detectedIntentKey].modules.map((m, mIdx) => (
                <span 
                  key={mIdx} 
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300"
                >
                  ✓ {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. THE PROBLEM LEDGER
          =================================================================== */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">THE PROBLEM</span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-gray-900">
            Every pet deserves safety. Every pet parent deserves <span className="text-emerald-800 italic">peace of mind.</span>
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Pets get lost. Vaccinations get missed. Symptoms get confusing. Pet records are scattered. Pet parents need one simple system that helps them protect, track, and care for their pet.
          </p>
        </div>

        <div className="border-t border-gray-900 divide-y divide-amber-200/80">
          {[
            { num: "01", title: "Pets get lost", desc: "No unified identity means a found pet is a stranger. Reunions depend on luck and paper tags.", tag: "NO IDENTITY LAYER" },
            { num: "02", title: "Vaccinations get missed", desc: "Records live in clinic slips and WhatsApp photos. Boosters slip silently.", tag: "SCATTERED RECORDS" },
            { num: "03", title: "Symptoms create panic", desc: "3 am googling, conflicting advice, and no sense of 'how urgent is this, really?'", tag: "NO TRIAGE" },
            { num: "04", title: "Care is fragmented", desc: "Vet, groomer, trainer, shop, NGO — five apps, zero memory of your pet.", tag: "ZERO CONTINUITY" },
            { num: "05", title: "Help arrives too late", desc: "When a pet is lost, there's no public, scannable way for a stranger to help reunite.", tag: "NO SOS NETWORK" },
          ].map((item, idx) => (
            <div key={idx} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-amber-50/50 px-3 rounded-xl transition-all">
              <div className="flex items-start gap-4">
                <span className="font-serif font-black text-3xl text-amber-800">{item.num}</span>
                <div>
                  <h4 className="font-bold text-base text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 max-w-xl">{item.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full whitespace-nowrap self-start md:self-center">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          4. FIVE CORE PLATFORM SOLUTIONS
          =================================================================== */}
      <section className="space-y-8 bg-amber-50/60 p-8 rounded-3xl border border-amber-200">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">THE SOLUTION</span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-gray-900">
            One platform for pet <span className="text-emerald-800 italic">safety &amp; care.</span>
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Five core systems, wired together by one digital pet identity and one responsible AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "🪪",
              title: "Digital Pet Identity",
              desc: "Create a smart profile for your pet with photo, breed, medical alerts, and emergency contact. Every pet gets a unique public page — owner-controlled, privacy-first.",
              chips: ["app.com/p/IND-PET-XXXXX", "Medical Alerts", "Masked Contact"]
            },
            {
              icon: "🏷️",
              title: "QR / NFC Smart Tag",
              desc: "Attach a tag to your pet's collar. If someone finds your pet, they scan it and contact you instantly. QR works on every phone; NFC is the magic tap.",
              chips: ["QR Sticker", "NFC + QR Tag", "Premium Metal"]
            },
            {
              icon: "🚨",
              title: "Lost Pet SOS",
              desc: "Mark your pet as lost in one tap. The public page flips to a red SOS banner. Anyone scanning can call, WhatsApp, report a sighting with photo and location.",
              chips: ["1-Tap Lost Mode", "Sighting Reports", "GPS Pins"]
            },
            {
              icon: "💉",
              title: "Vaccination Reminders",
              desc: "Never miss important vaccines, deworming, or vet checkups. Due-date engine with app push today — email and WhatsApp next.",
              chips: ["Vaccine Schedule", "Deworming", "Medicine Logs"]
            },
            {
              icon: "🤖",
              title: "AI Pet Care Guidance",
              desc: "Ask about food, symptoms, behavior, and care. Get responsible AI guidance with four risk levels — and vet-first guardrails.",
              chips: ["Symptom Triage", "Low → Urgent Levels", "Always Disclaimed"]
            }
          ].map((f, fIdx) => (
            <div key={fIdx} className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="font-serif font-bold text-lg text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{f.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {f.chips.map((c, cIdx) => (
                  <span key={cIdx} className="text-[10px] font-mono font-semibold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          5. INTERACTIVE LIVE DEMO EXPERIENCE TABS
          =================================================================== */}
      <section className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl space-y-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">LIVE MVP INTERACTIVE DEMO</span>
            <h2 className="font-serif text-3xl md:text-4xl font-black text-white mt-1">
              Try the product, <span className="text-amber-400 italic">right here.</span>
            </h2>
            <p className="text-xs md:text-sm text-emerald-200/90 font-medium max-w-lg mt-1">
              Owner dashboard, public scan page, and AI health guide — wired together on one shared pet identity.
            </p>
          </div>

          {/* Interactive Demo Selector Tabs */}
          <div className="flex gap-2 bg-emerald-900/60 p-1 rounded-2xl border border-emerald-800 text-xs font-bold">
            <button 
              onClick={() => setActiveDemoTab("owner")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeDemoTab === "owner" ? "bg-amber-500 text-emerald-950 shadow-sm" : "text-emerald-200 hover:text-white"}`}
            >
              🏠 Owner Dashboard
            </button>
            <button 
              onClick={() => setActiveDemoTab("public")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeDemoTab === "public" ? "bg-amber-500 text-emerald-950 shadow-sm" : "text-emerald-200 hover:text-white"}`}
            >
              📱 Public Scan Page
            </button>
            <button 
              onClick={() => setActiveDemoTab("ai")}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeDemoTab === "ai" ? "bg-amber-500 text-emerald-950 shadow-sm" : "text-emerald-200 hover:text-white"}`}
            >
              🤖 AI Health Guide
            </button>
          </div>
        </div>

        {/* DEMO TAB 1: OWNER DASHBOARD */}
        {activeDemoTab === "owner" && (
          <div className="bg-white text-gray-900 rounded-2xl p-6 space-y-6 shadow-inner">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div>
                <h4 className="font-serif text-lg font-bold text-gray-900">Bruno's Safety Status</h4>
                <p className="text-xs text-gray-500">Toggle lost mode to watch the public scan page adapt live.</p>
              </div>
              <button 
                onClick={() => {
                  const nextState = !isHeroPetLost;
                  setIsHeroPetLost(nextState);
                  setToast(nextState ? "🚨 Lost SOS activated!" : "🏠 Bruno marked safe!");
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${isHeroPetLost ? "bg-red-600 text-white" : "bg-emerald-800 text-white"}`}
              >
                {isHeroPetLost ? "🚨 LOST SOS ACTIVE (Click to Safe)" : "🟢 SAFE · HOME (Click to Lost)"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pet Card */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">BOUND PHYSICAL SMART TAG</span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center font-bold text-amber-800 text-xl">🐕</div>
                  <div>
                    <h5 className="font-bold text-base text-gray-900">Bruno (IND-PET-10293)</h5>
                    <p className="text-xs text-gray-500">TAG CODE: TAG-BRUNO-0143 · NTAG213 Active</p>
                  </div>
                </div>
                <div className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded border border-emerald-200">
                  ✓ Public QR URL: app.com/p/IND-PET-10293
                </div>
              </div>

              {/* Vaccinations List */}
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">VACCINATION &amp; CARE TIMELINE</span>
                <div className="space-y-2 text-xs">
                  {demoVaccs.map(v => (
                    <div key={v.id} className="flex items-center justify-between p-2 rounded bg-white border border-gray-200">
                      <div>
                        <div className="font-bold text-gray-800">{v.name}</div>
                        <div className="text-[10px] text-gray-400">{v.meta}</div>
                      </div>
                      {!v.done ? (
                        <button 
                          onClick={() => {
                            setDemoVaccs(prev => prev.map(item => item.id === v.id ? { ...item, done: true, meta: "Done · Logged" } : item));
                            setToast(`💉 ${v.name} marked completed!`);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-[10px] hover:bg-amber-200 cursor-pointer"
                        >
                          Mark Done ✓
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">✓ Done</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEMO TAB 2: PUBLIC SCAN PAGE */}
        {activeDemoTab === "public" && (
          <div id="tour-demo-sighting-panel" className="bg-white text-gray-900 rounded-2xl p-6 space-y-6">
            <div className={`p-4 rounded-xl text-center space-y-1 ${isHeroPetLost ? "bg-red-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-900 border border-emerald-200"}`}>
              <h4 className="font-serif text-xl font-bold">{isHeroPetLost ? "🚨 LOST PET SOS BROADCAST ACTIVE" : "🟢 VERIFIED SAFE REGISTERED TAG"}</h4>
              <p className="text-xs opacity-90">
                {isHeroPetLost ? "Bruno is currently missing in Mumbai. File a sighting or contact Rahul Sharma below." : "Bruno is accounted for in PetGuardian global network."}
              </p>
            </div>

            {/* Sighting Reports Feed */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider">Verified Sighting Feed ({demoSightings.length})</h4>
              <div className="space-y-2">
                {demoSightings.map((s, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between font-bold text-gray-800">
                      <span>📍 {s.area} ({s.name})</span>
                      <span className="text-[10px] text-gray-400">{s.time}</span>
                    </div>
                    <p className="text-gray-600">{s.note}</p>
                  </div>
                ))}
              </div>

              {/* Sighting Form */}
              <form onSubmit={handleSightingSubmit} className="p-4 border border-amber-200 rounded-xl bg-amber-50/50 space-y-3">
                <h5 className="font-bold text-xs uppercase text-amber-900">File a Live Sighting</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input 
                    type="text" required value={sightingName} onChange={e => setSightingName(e.target.value)}
                    placeholder="Your Name" className="px-3 py-2 text-xs rounded border border-gray-300 bg-white"
                  />
                  <input 
                    type="text" required value={sightingArea} onChange={e => setSightingArea(e.target.value)}
                    placeholder="Landmark / Location" className="px-3 py-2 text-xs rounded border border-gray-300 bg-white"
                  />
                </div>
                <textarea 
                  value={sightingNote} onChange={e => setSightingNote(e.target.value)}
                  placeholder="Sighting details (e.g., direction of travel, condition)" rows={2}
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 bg-white"
                />
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-gray-950 shadow-xs cursor-pointer hover:bg-amber-400">
                  Send Immediate Sighting Alert →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* DEMO TAB 3: AI HEALTH GUIDE */}
        {activeDemoTab === "ai" && (
          <div className="bg-white text-gray-900 rounded-2xl p-6 space-y-4">
            <div className="h-64 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-xl text-xs max-w-lg ${msg.sender === "user" ? "bg-emerald-800 text-white ml-auto" : "bg-white border border-gray-200 text-gray-800"}`}>
                  {msg.risk && (
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase mb-1.5 ${
                      msg.risk === "urg" ? "bg-red-600 text-white" :
                      msg.risk === "vet" ? "bg-amber-600 text-white" :
                      msg.risk === "mon" ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      RISK LEVEL: {msg.risk.toUpperCase()}
                    </span>
                  )}
                  <p className="whitespace-pre-line leading-relaxed font-medium">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={e => { e.preventDefault(); handleAIChatSubmit(chatInput); }} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)}
                placeholder="Describe a symptom or care question..." 
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white cursor-pointer hover:bg-emerald-900">
                Ask AI →
              </button>
            </form>
          </div>
        )}
      </section>

      {/* ===================================================================
          6. SMART TAGS & PRICING PRE-ORDERS
          =================================================================== */}
      <section className="space-y-8" id="tags-section">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">SMART HARDWARE</span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-gray-900">
            Sell safety, <span className="text-emerald-800 italic">not technology.</span>
          </h2>
          <p className="text-sm text-gray-600 font-medium">
            Every tag binds to one unique pet URL for life. QR works on every phone in India; NFC adds the magic tap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">QR Sticker Pack</h3>
              <div className="text-3xl font-black text-gray-900">₹149 <span className="text-xs font-normal text-gray-400">/ pack of 3</span></div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-1.5">✓ Weatherproof stickers for collar &amp; gate</li>
                <li className="flex items-center gap-1.5">✓ Unique pet URL per sticker</li>
                <li className="flex items-center gap-1.5">✓ Public profile + SOS included</li>
                <li className="flex items-center gap-1.5">✓ Works on every smartphone camera</li>
              </ul>
            </div>
            <button 
              onClick={() => onOpenPreorder("QR Sticker Pack", "₹149")}
              className="mt-6 w-full py-2.5 rounded-xl border border-emerald-800 text-emerald-800 text-xs font-bold hover:bg-emerald-50 cursor-pointer"
            >
              Pre-order Pack
            </button>
          </div>

          {/* Plan 2 */}
          <div className="p-6 rounded-2xl bg-emerald-950 text-white shadow-xl flex flex-col justify-between relative overflow-hidden border border-emerald-800">
            <div className="absolute top-0 right-0 bg-amber-500 text-emerald-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
              MOST LOVED
            </div>
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-white">NFC + QR Collar Tag</h3>
              <div className="text-3xl font-black text-amber-400">₹499 <span className="text-xs font-normal text-emerald-300">/ tag</span></div>
              <ul className="text-xs text-emerald-100 space-y-2">
                <li className="flex items-center gap-1.5">✓ Tap-to-open on NFC phones, QR fallback</li>
                <li className="flex items-center gap-1.5">✓ Engraved paw ID, lifetime binding</li>
                <li className="flex items-center gap-1.5">✓ Lost-mode banner + sighting alerts</li>
                <li className="flex items-center gap-1.5">✓ Free replacement if tag breaks</li>
              </ul>
            </div>
            <button 
              onClick={() => onOpenPreorder("NFC + QR Collar Tag", "₹499")}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 text-emerald-950 text-xs font-bold hover:bg-amber-400 cursor-pointer shadow-md"
            >
              Pre-order Smart Tag
            </button>
          </div>

          {/* Plan 3 */}
          <div className="p-6 rounded-2xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-gray-900">Metal Premium Tag</h3>
              <div className="text-3xl font-black text-gray-900">₹999 <span className="text-xs font-normal text-gray-400">/ tag</span></div>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-center gap-1.5">✓ CNC-milled brass or steel body</li>
                <li className="flex items-center gap-1.5">✓ Dual NFC + laser-etched QR</li>
                <li className="flex items-center gap-1.5">✓ Waterproof, adventure-proof</li>
                <li className="flex items-center gap-1.5">✓ Gift box + founding pet parent badge</li>
              </ul>
            </div>
            <button 
              onClick={() => onOpenPreorder("Metal Premium Tag", "₹999")}
              className="mt-6 w-full py-2.5 rounded-xl border border-emerald-800 text-emerald-800 text-xs font-bold hover:bg-emerald-50 cursor-pointer"
            >
              Pre-order Metal Tag
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          7. RESPONSIBLE AI SAFETY & RISK ACCORDION
          =================================================================== */}
      <section className="bg-amber-50/60 p-8 rounded-3xl border border-amber-200 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">RESPONSIBLE BY DESIGN</span>
          <h2 className="font-serif text-3xl font-black text-gray-900">
            An assistant, <span className="text-emerald-800 italic">never a doctor.</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            PetGuardian AI is a smart care assistant with hard guardrails. It triages, calms, and routes to vets — it never replaces them.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl">
          {[
            {
              level: "LOW",
              title: "Active, eating normally, mild issue",
              color: "bg-emerald-100 text-emerald-800 border-emerald-300",
              details: "Monitor at home. Keep fresh water available, note food intake & energy, and log a health update in the app."
            },
            {
              level: "MONITOR",
              title: "Mild but unclear symptoms",
              color: "bg-amber-100 text-amber-900 border-amber-300",
              details: "Observe for 12–24 hours. Track food, water, toilet, and energy. Consult a vet if anything worsens."
            },
            {
              level: "VET RECOMMENDED",
              title: "Persistent or moderate symptoms",
              color: "bg-amber-500 text-emerald-950 font-bold border-amber-600",
              details: "Visit a vet within 24 hours. Carry vaccination records. Do not self-medicate or give human pills."
            },
            {
              level: "URGENT",
              title: "Emergency signs — act now",
              color: "bg-red-600 text-white font-bold border-red-700",
              details: "Contact a vet immediately. Go to an emergency clinic. Seizures, breathing trouble, poisoning, collapse, or bleeding require immediate hands-on emergency care."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-amber-200 rounded-xl bg-white overflow-hidden shadow-xs">
              <button 
                onClick={() => setOpenRiskCard(openRiskCard === idx ? null : idx)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-50/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${item.color}`}>
                    {item.level}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-gray-900">{item.title}</h4>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openRiskCard === idx ? "rotate-180" : ""}`} />
              </button>

              {openRiskCard === idx && (
                <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed font-medium border-t border-gray-100 bg-gray-50/50">
                  {item.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          8. REUNITE STORIES
          =================================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">REUNITE STORIES</span>
          <h2 className="font-serif text-3xl font-black text-gray-900">
            Scanned by strangers. <span className="text-emerald-800 italic">Brought home by everyone.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-3">
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600" alt="Reunited dog" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-bold text-base text-gray-900">Sheru came home</h4>
            <p className="text-xs text-gray-600">A delivery rider scanned the collar tag outside Jaipur metro station. Family reached in 20 minutes.</p>
            <span className="text-[10px] font-mono font-bold text-emerald-800 block">CASE #IND-11842 · JAIPUR · REUNITED IN 9 HRS</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-3">
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600" alt="Bruno indie dog" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-bold text-base text-gray-900">Bruno's bakery sighting</h4>
            <p className="text-xs text-gray-600">Three sighting reports with location pins in one evening. Found asleep near his favourite bakery.</p>
            <span className="text-[10px] font-mono font-bold text-emerald-800 block">CASE #IND-10293 · MUMBAI · 3 SIGHTINGS</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-3">
            <div className="rounded-xl overflow-hidden aspect-video">
              <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600" alt="Mithu cat" className="w-full h-full object-cover" />
            </div>
            <h4 className="font-serif font-bold text-base text-gray-900">Mithu's balcony escape</h4>
            <p className="text-xs text-gray-600">Lost-mode banner went live at 7 pm. A neighbour two floors down scanned and WhatsApped by 7:40.</p>
            <span className="text-[10px] font-mono font-bold text-emerald-800 block">CASE #IND-20881 · PUNE · REUNITED IN 40 MIN</span>
          </div>
        </div>
      </section>

      {/* ===================================================================
          9. THE INTENT ROADMAP
          =================================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">THE INTENT ROADMAP</span>
          <h2 className="font-serif text-3xl font-black text-gray-900">
            Every startup begins with a feature. <span className="text-emerald-800 italic">Ours begins with an intent.</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            Today: Protect My Pet. Then, one intent at a time — the complete pet operating system.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { phase: "01", title: "Protect My Pet", desc: "Digital identity · QR/NFC tag · lost-pet SOS · vaccination reminders · basic AI guidance · tag pre-orders.", status: "IN BUILD · MVP", bg: "bg-emerald-950 text-white" },
            { phase: "02", title: "Keep My Pet Healthy", desc: "Advanced triage · photo analysis · health, weight & mood logs · vet documents · WhatsApp reminders.", status: "NEXT", bg: "bg-white text-gray-900 border border-amber-200" },
            { phase: "03", title: "Train My Pet", desc: "Behavior plans · training tips · trainer marketplace · community challenges.", status: "PLANNED", bg: "bg-amber-50 text-gray-900 border border-amber-200" },
            { phase: "04", title: "Find the Best Vet", desc: "Verified clinic listings · reviews · booking · consultation commissions.", status: "PLANNED", bg: "bg-white text-gray-900 border border-amber-200" },
            { phase: "05", title: "Buy Pet Food", desc: "Curated marketplace · AI food recommendations · subscriptions · sponsored products.", status: "VISION", bg: "bg-amber-100/60 text-gray-900 border border-amber-200" },
            { phase: "06", title: "Manage My Pet's Entire Life", desc: "GPS & smart collars · IoT health · insurance · NGO/municipal dashboards · city-level pet safety network.", status: "VISION", bg: "bg-emerald-900 text-white" },
          ].map((p, idx) => (
            <div key={idx} className={`p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${p.bg} shadow-xs`}>
              <div className="flex items-center gap-4">
                <span className="font-serif font-black text-3xl opacity-80">{p.phase}</span>
                <div>
                  <h3 className="font-serif font-bold text-lg">{p.title}</h3>
                  <p className="text-xs opacity-85 font-medium">{p.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold border border-current px-3 py-1 rounded-full whitespace-nowrap self-start md:self-center">
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================
          9.5 PUBLIC TRUST & CERTIFICATIONS SHOWCASE
          =================================================================== */}
      <section className="p-8 md:p-10 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Lock className="w-3.5 h-3.5 text-[#175741]" /> PUBLIC TRUST GUARANTEE
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-[#1C2B23]">
            Why 10,000+ Indian Pet Parents <span className="text-[#175741]">Trust PetJanu</span>
          </h2>
          <p className="text-xs md:text-sm text-stone-600 font-medium">
            Built with uncompromising privacy, bank-grade encryption, and verified veterinary oversight.
          </p>
        </div>

        {/* 5 Core Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#175741] flex items-center justify-center mx-auto text-sm font-bold">
              🐾
            </div>
            <h4 className="font-bold text-xs text-stone-900">10,000+ Pet Parents</h4>
            <p className="text-[10px] text-stone-500">Active community across Mumbai, Bengaluru &amp; Delhi</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto text-sm font-bold">
              🩺
            </div>
            <h4 className="font-bold text-xs text-stone-900">Vet-Verified Rules</h4>
            <p className="text-[10px] text-stone-500">Curated with Veterinary Council guidelines</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#175741] flex items-center justify-center mx-auto text-sm font-bold">
              🔒
            </div>
            <h4 className="font-bold text-xs text-stone-900">256-Bit Encrypted</h4>
            <p className="text-[10px] text-stone-500">Bank-grade data protection at rest and in transit</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto text-sm font-bold">
              🛡️
            </div>
            <h4 className="font-bold text-xs text-stone-900">Zero Data Selling</h4>
            <p className="text-[10px] text-stone-500">We never share your personal phone with advertisers</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#175741] flex items-center justify-center mx-auto text-sm font-bold">
              ⚡
            </div>
            <h4 className="font-bold text-xs text-stone-900">Open &amp; Transparent</h4>
            <p className="text-[10px] text-stone-500">Public roadmap, clear pricing, 24-hr SLA</p>
          </div>
        </div>

        {/* Badges Bar */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-stone-600">
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> SSL 256-bit Encrypted</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Razorpay PCI DSS Level 1</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> India DPDP Act 2023 Compliant</span>
          <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> 4.9★ Trust Rating</span>
        </div>
      </section>

      {/* ===================================================================
          10. WAITLIST FORM & RESERVATION SECTION
          =================================================================== */}
      <section id="waitlist-section" className="bg-emerald-950 text-white p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-xl">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">JOIN THE WAITLIST</span>
        <h2 className="font-serif text-3xl md:text-5xl font-black text-white max-w-2xl mx-auto leading-tight">
          Keep your pet safe, identified, <span className="text-amber-400 italic">&amp; loved.</span>
        </h2>
        <p className="text-xs md:text-sm text-emerald-200/90 max-w-md mx-auto font-medium">
          Free digital pet profile for early joiners. Early-bird tag discounts. Founding pet parent badge forever.
        </p>

        <div className="max-w-md mx-auto">
          {waitlistStatus === "success" ? (
            <div className="p-6 rounded-2xl bg-emerald-900 border border-emerald-700 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto text-emerald-950 font-bold text-xl">
                🐾
              </div>
              <h3 className="font-serif text-xl font-bold text-white">{waitlistPetName} is reserved!</h3>
              <p className="text-xs text-emerald-200">
                We'll WhatsApp you at <strong className="text-white">{waitlistPhone}</strong> as soon as batch 1 tags dispatch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleJoinWaitlist} className="space-y-3 bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800 text-left">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1">Mobile Phone (India)</label>
                <input 
                  type="tel" 
                  required
                  value={waitlistPhone}
                  onChange={e => setWaitlistPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                  className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 mb-1">Pet's Name 🐾</label>
                <input 
                  type="text" 
                  required
                  value={waitlistPetName}
                  onChange={e => setWaitlistPetName(e.target.value)}
                  placeholder="e.g. Bruno / Luna" 
                  className="w-full px-3 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-amber-400"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl font-bold text-xs bg-amber-500 text-emerald-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md mt-2"
              >
                Join Waitlist →
              </button>
            </form>
          )}
        </div>

        <p className="text-[10px] font-mono text-emerald-400">
          1,247 PET PARENTS ALREADY IN LINE · NO SPAM, ONLY SAFETY
        </p>
      </section>

    </div>
  );
}
