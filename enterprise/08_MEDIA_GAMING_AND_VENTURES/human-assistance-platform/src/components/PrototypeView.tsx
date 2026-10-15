import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Users,
  Building,
  CheckCircle,
  MapPin,
  Bell,
  Shield,
  ArrowLeft,
  Camera,
  ClipboardList,
  AlertTriangle,
  RefreshCw,
  Award,
  PlusCircle,
  X,
  Smartphone,
  CreditCard,
  Utensils,
  Lock,
  Send,
  UserCheck,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  QrCode,
  Scan,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as ReBarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Donation, VolunteerTask, NgoCenter, SystemAuditLog, FoodType, DonationStatus } from "../types";

interface PrototypeViewProps {
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
  tasks: VolunteerTask[];
  setTasks: React.Dispatch<React.SetStateAction<VolunteerTask[]>>;
  ngos: NgoCenter[];
  setNgos: React.Dispatch<React.SetStateAction<NgoCenter[]>>;
  auditLogs: SystemAuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<SystemAuditLog[]>>;
  volunteerTrustScore: number;
  setVolunteerTrustScore: React.Dispatch<React.SetStateAction<number>>;
  isSuspended: boolean;
  setIsSuspended: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PrototypeView({
  donations,
  setDonations,
  tasks,
  setTasks,
  ngos,
  setNgos,
  auditLogs,
  setAuditLogs,
  volunteerTrustScore,
  setVolunteerTrustScore,
  isSuspended,
  setIsSuspended
}: PrototypeViewProps) {
  // Inner tabs: public, mobile, admin, donor
  const [activeSubTab, setActiveSubTab] = useState<"public" | "mobile" | "admin" | "donor">("public");

  // Modals state
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" | "info" } | null>(null);

  // Stats Counters
  const [publicDonationsCount, setPublicDonationsCount] = useState(12450);
  const [publicVolunteersCount, setPublicVolunteersCount] = useState(856);
  const [publicFundsCount, setPublicFundsCount] = useState(850000);

  // Donation Form inside Modal
  const [donateAmount, setDonateAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donatePurpose, setDonatePurpose] = useState("Food Security");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Volunteer Mobile App mock states
  const [mobileScreen, setMobileScreen] = useState<"login" | "dashboard" | "report">("login");
  const [mobilePhoneNum, setMobilePhoneNum] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileIsLoggedIn, setMobileIsLoggedIn] = useState(false);
  
  // Interactive QR Scanner states
  const [activeScanningTaskId, setActiveScanningTaskId] = useState<string | null>(null);
  const [scanningType, setScanningType] = useState<"pickup" | "delivery">("pickup");
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scannerViewMode, setScannerViewMode] = useState<"camera" | "manual">("camera");
  const [manualCodeInput, setManualCodeInput] = useState("");
  const [scanningErrorMessage, setScanningErrorMessage] = useState("");
  
  // Submit Help Request from Mobile
  const [reqType, setReqType] = useState<"food" | "medicine" | "essentials">("food");
  const [reqLocation, setReqLocation] = useState("Karol Bagh Slum");
  const [reqServings, setReqServings] = useState(30);
  const [reqQualityType, setReqQualityType] = useState<"clean" | "suspicious" | "blurred">("clean");
  const [reqNotes, setReqNotes] = useState("");

  // Contact Form inside Public View
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "Partnership Inquiry", message: "" });

  const triggerNotification = (message: string, type: "success" | "warning" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerNotification(`Thank you ${contactForm.name || "there"}! Your partnership inquiry has been dispatched to Project SETU Team.`, "success");
    setContactForm({ name: "", email: "", subject: "Partnership Inquiry", message: "" });
  };

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    setPublicVolunteersCount(prev => prev + 1);
    triggerNotification("Swastika! You have registered as a Sewa Volunteer. Login to the mobile simulator now!", "success");
    setShowVolunteerModal(false);
    
    // Log to system audit trail
    setAuditLogs(prev => [
      {
        id: `log-reg-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: "New volunteer registered through Public Portal.",
        status: "ok"
      },
      ...prev
    ]);
  };

  const handleMockDonationSubmit = () => {
    const finalAmount = customAmount ? parseInt(customAmount) : donateAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      triggerNotification("Please enter a valid donation amount.", "warning");
      return;
    }

    setPublicFundsCount(prev => prev + finalAmount);
    // 1 meal approx ₹15
    const mealsFunded = Math.floor(finalAmount / 15);
    setPublicDonationsCount(prev => prev + mealsFunded);

    // Create a physical donation object as a tracking entry in history
    const newDonation: Donation = {
      id: `don-donor-${Date.now().toString().slice(-4)}`,
      donorName: "Priya Mehta (Public Donor)",
      foodType: "veg",
      servings: mealsFunded > 0 ? mealsFunded : 10,
      freshnessHours: 12,
      address: "Connaught Place Inner Circle",
      lat: 28.6139,
      lon: 77.2090,
      timestamp: new Date().toISOString(),
      status: "pending",
      notes: `CSR contribution of ₹${finalAmount} assigned to ${donatePurpose}.`
    };

    setDonations(prev => [newDonation, ...prev]);
    triggerNotification(`Dhanyawaad! ₹${finalAmount} received! This funds approximately ${mealsFunded} nutritious meals.`, "success");
    setShowDonateModal(false);

    setAuditLogs(prev => [
      {
        id: `log-don-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Donation",
        message: `Fund donation of ₹${finalAmount} registered. Sourced ${mealsFunded} meals.`,
        status: "ok"
      },
      ...prev
    ]);
  };

  // Mobile App - Login Trigger
  const handleSendOtp = () => {
    if (mobilePhoneNum.length < 10) {
      triggerNotification("Please enter a valid 10-digit mobile number.", "warning");
      return;
    }
    setMobileOtpSent(true);
    triggerNotification("Demo OTP '1234' sent to " + mobilePhoneNum, "info");
  };

  const handleVerifyOtp = () => {
    if (mobileOtp === "1234" || mobileOtp === "123456") {
      setMobileIsLoggedIn(true);
      setMobileScreen("dashboard");
      triggerNotification("Logged in successfully as Sewa Volunteer!", "success");
    } else {
      triggerNotification("Invalid OTP. Try '1234'.", "warning");
    }
  };

  // Mobile App - Claim task
  const handleClaimDonation = (donId: string) => {
    const matchedDon = donations.find(d => d.id === donId);
    if (!matchedDon) return;

    // Change status to claimed
    setDonations(prev =>
      prev.map(d => (d.id === donId ? { ...d, status: "claimed" } : d))
    );

    const newTask: VolunteerTask = {
      id: `task-mob-${Date.now().toString().slice(-4)}`,
      donationId: donId,
      donation: matchedDon,
      volunteerName: "Rahul Sharma",
      status: "claimed",
      ngoId: "ngo-01",
      ngoName: "Delhi Seva Ashram",
      riskScore: matchedDon.id.includes("suspect") ? 65 : 12,
      timestamp: new Date().toISOString(),
      distanceMetres: 2400,
      progress: 50
    };

    setTasks(prev => [newTask, ...prev]);
    triggerNotification(`Task claimed! Deliver to Delhi Seva Ashram.`, "success");

    setAuditLogs(prev => [
      {
        id: `log-claim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: `Volunteer Rahul Sharma claimed surplus shipment from ${matchedDon.donorName}`,
        status: "ok"
      },
      ...prev
    ]);
  };

  // Mobile App - Complete/Deliver task
  const handleDeliverTask = (taskId: string) => {
    const matchedTask = tasks.find(t => t.id === taskId);
    if (!matchedTask) return;

    // Deliver task and update donation status
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: "delivered", progress: 100 } : t))
    );

    setDonations(prev =>
      prev.map(d => (d.id === matchedTask.donationId ? { ...d, status: "delivered" } : d))
    );

    // Update target NGO meals received count
    setNgos(prev =>
      prev.map(n => (n.id === matchedTask.ngoId ? { ...n, mealsReceived: n.mealsReceived + matchedTask.donation.servings } : n))
    );

    // Dynamic trust score adjustments
    setVolunteerTrustScore(prev => Math.min(100, prev + 3));

    triggerNotification("Clean delivery verified via QR Code handoff! Trust score updated.", "success");

    setAuditLogs(prev => [
      {
        id: `log-delv-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: `Shipment successfully delivered to ${matchedTask.ngoName}. Total ${matchedTask.donation.servings} meals distributed.`,
        status: "ok"
      },
      ...prev
    ]);
  };

  // Web Audio API Synthesized Audio Feedback for Haptic Realism
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6 Note
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 100);
    } catch (e) {
      console.warn("Audio blocked by gesture or not supported", e);
    }
  };

  const playBuzz = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); // low buzz
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 250);
    } catch (e) {
      console.warn("Audio feedback blocked", e);
    }
  };

  // Mobile App - Confirm Pickup via QR Code
  const handlePickupTask = (taskId: string) => {
    const matchedTask = tasks.find(t => t.id === taskId);
    if (!matchedTask) return;

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, pickupVerified: true, progress: 75 } : t))
    );

    triggerNotification(`Pickup verified from ${matchedTask.donation.donorName}! Run is now active.`, "success");

    setAuditLogs(prev => [
      {
        id: `log-pickup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: `Volunteer verified pickup for run ${matchedTask.donationId} from ${matchedTask.donation.donorName} via secure QR code.`,
        status: "ok"
      },
      ...prev
    ]);
  };

  // Handles verification of scanned QR code or manually typed code
  const handleVerifyScannedCode = (code: string) => {
    if (!activeScanningTaskId) return;
    const task = tasks.find(t => t.id === activeScanningTaskId);
    if (!task) return;

    setScanningStatus("scanning");
    setScanningErrorMessage("");

    setTimeout(() => {
      const sanitizedCode = code.trim().toLowerCase();
      
      if (scanningType === "pickup") {
        const expectedDonorCode = task.donationId.toLowerCase();
        // Allow full match, or a demo placeholder code, or short matches to be user friendly
        if (sanitizedCode === expectedDonorCode || sanitizedCode === "demo-donor" || sanitizedCode === "setu-donor" || sanitizedCode === "setu-don-01") {
          playBeep();
          setScanningStatus("success");
          setTimeout(() => {
            handlePickupTask(task.id);
            setIsScanningActive(false);
            setActiveScanningTaskId(null);
            setScanningStatus("idle");
            setManualCodeInput("");
          }, 800);
        } else {
          playBuzz();
          setScanningStatus("error");
          setScanningErrorMessage(`Security Mismatch: Scanned code "${code}" does not match Donor Verification Key "${task.donationId}".`);
          
          setAuditLogs(prev => [
            {
              id: `log-sec-${Date.now()}`,
              timestamp: new Date().toISOString(),
              category: "Security",
              message: `AI Risk Guard: Failed QR authentication signature for run ${task.donationId}. Attempted Code: "${code}"`,
              status: "warning"
            },
            ...prev
          ]);
        }
      } else {
        // Delivery verification
        const expectedNgoCode = task.ngoId.toLowerCase();
        if (sanitizedCode === expectedNgoCode || sanitizedCode === "demo-ngo" || sanitizedCode === "setu-ngo" || sanitizedCode === "ngo-01") {
          playBeep();
          setScanningStatus("success");
          setTimeout(() => {
            handleDeliverTask(task.id);
            setIsScanningActive(false);
            setActiveScanningTaskId(null);
            setScanningStatus("idle");
            setManualCodeInput("");
          }, 800);
        } else {
          playBuzz();
          setScanningStatus("error");
          setScanningErrorMessage(`Security Mismatch: Scanned code "${code}" does not match NGO Verification Key "${task.ngoId}".`);
          
          setAuditLogs(prev => [
            {
              id: `log-sec-${Date.now()}`,
              timestamp: new Date().toISOString(),
              category: "Security",
              message: `AI Risk Guard: Failed QR delivery check-in signature for NGO ${task.ngoId}. Attempted Code: "${code}"`,
              status: "warning"
            },
            ...prev
          ]);
        }
      }
    }, 600); // realistic scanning delay
  };

  // Mobile App - Submit help request
  const handleMobileHotspotReport = (e: React.FormEvent) => {
    e.preventDefault();

    // AI gate classification modeling
    let finalStatus: DonationStatus = "pending";
    let message = "Hotspot needs assessment reported to the platform.";
    let category: "Ops" | "AI" | "Security" = "Ops";
    let isFlagged = false;

    if (reqQualityType === "blurred") {
      finalStatus = "flagged";
      message = "AI Fraud Warning: Photo is highly blurred/obfuscated. Flagged for review.";
      category = "AI";
      isFlagged = true;
    } else if (reqQualityType === "suspicious") {
      finalStatus = "flagged";
      message = "AI Risk Guard: Suspected duplicate request template detected. Flagged.";
      category = "AI";
      isFlagged = true;
    }

    const newDonation: Donation = {
      id: isFlagged ? `don-suspect-${Date.now().toString().slice(-4)}` : `don-mob-${Date.now().toString().slice(-4)}`,
      donorName: `Reported Hotspot (${reqLocation})`,
      foodType: "veg",
      servings: reqServings,
      freshnessHours: 6,
      address: reqLocation,
      lat: 28.6142,
      lon: 77.1888,
      timestamp: new Date().toISOString(),
      status: finalStatus,
      notes: reqNotes || `Need reported for approximately ${reqServings} homeless beneficiaries.`
    };

    setDonations(prev => [newDonation, ...prev]);
    
    if (isFlagged) {
      triggerNotification(message, "warning");
    } else {
      triggerNotification("Report registered! Our AI routing matching is allocating volunteers.", "success");
    }

    setMobileScreen("dashboard");

    setAuditLogs(prev => [
      {
        id: `log-ai-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: category,
        message: message,
        status: isFlagged ? "danger" : "ok"
      },
      ...prev
    ]);
  };

  // Admin Dashboard - Action buttons
  const handleAdminApprove = (donId: string) => {
    setDonations(prev =>
      prev.map(d => (d.id === donId ? { ...d, status: "pending" } : d))
    );
    triggerNotification("Request approved and returned to dispatch queue.", "success");
    setAuditLogs(prev => [
      {
        id: `log-adm-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: `Admin override: Request ${donId} cleared of flags.`,
        status: "ok"
      },
      ...prev
    ]);
  };

  const handleAdminReject = (donId: string) => {
    setDonations(prev => prev.filter(d => d.id !== donId));
    triggerNotification("Request rejected and deleted from ledger.", "warning");
    setAuditLogs(prev => [
      {
        id: `log-adm-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Security",
        message: `Admin override: Deleted suspicious request ${donId}.`,
        status: "danger"
      },
      ...prev
    ]);
  };

  // Recharts Data Sets
  const fundUtilizationData = [
    { name: "Direct Food Sourcing", value: 65, color: "#10B981" }, // Emerald Green
    { name: "Cold-Chain Logistics", value: 15, color: "#F59E0B" }, // Warm Amber
    { name: "Admin & Support", value: 12, color: "#4B5563" },     // Sophisticated Gray
    { name: "Platform Cloud Engine", value: 8, color: "#3B82F6" } // Warm Blue
  ];

  const impactTrendsData = [
    { month: "Mar", meals: 2100 },
    { month: "Apr", meals: 4800 },
    { month: "May", meals: 7200 },
    { month: "Jun", meals: 9400 },
    { month: "Jul", meals: 12450 }
  ];

  const requestDistributionData = [
    { category: "Food Rescue", count: 245 },
    { category: "Meds Sourcing", count: 89 },
    { category: "Warm Clothes", count: 67 },
    { category: "Disaster S.O.S", count: 34 }
  ];

  const volunteerPerformanceData = [
    { subject: "SLA Pickup Speed", score: 85 },
    { subject: "Photo Accuracy", score: 92 },
    { subject: "Route Efficiency", score: 88 },
    { subject: "GPS Verification", score: 95 },
    { subject: "Handoff Compliance", score: 90 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Dynamic Floating Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center gap-3 max-w-sm ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-950 border-emerald-200"
                : notification.type === "warning"
                ? "bg-rose-50 text-rose-950 border-rose-200"
                : "bg-amber-50 text-amber-950 border-amber-200"
            }`}
          >
            {notification.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />}
            {notification.type === "warning" && <AlertTriangle className="h-5 w-5 text-rose-600 flex-shrink-0" />}
            {notification.type === "info" && <Bell className="h-5 w-5 text-amber-600 flex-shrink-0" />}
            <p>{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Subtab Navigator */}
      <div className="bg-white rounded-2xl border border-[#F1ECE4] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600 animate-spin-slow" />
            Interactive Frontend Prototypes (v0.1)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Test the on-road field flows, donor web triggers, and real-time AI security safeguards.
          </p>
        </div>

        {/* Outer view swapper */}
        <div className="flex flex-wrap bg-[#F3ECE0] p-1 rounded-xl border border-[#E9E1D5] self-start sm:self-center gap-1">
          <button
            onClick={() => setActiveSubTab("public")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "public" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            Public Website
          </button>
          <button
            onClick={() => setActiveSubTab("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "mobile" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile App
          </button>
          <button
            onClick={() => setActiveSubTab("admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "admin" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            Admin Panel
          </button>
          <button
            onClick={() => setActiveSubTab("donor")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeSubTab === "donor" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            Donor Portal
          </button>
        </div>
      </div>

      {/* ----------------- SUB-VIEW: PUBLIC WEBSITE ----------------- */}
      {activeSubTab === "public" && (
        <motion.div
          key="public-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-12"
        >
          {/* Hero segment */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center gap-8 shadow-xl">
            {/* Soft geometric accent */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="flex-1 space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                🇮🇳 PROJECT SETU INDIA PILOT
              </span>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight text-white tracking-tight">
                Bridging the Gap Between <span className="text-emerald-400">Surplus & Hunger</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Connect surplus wedding banquets, canteens, and individual surplus with registered community shelters in Delhi-NCR in under 45 minutes. Pure logistics, trust-verified.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setShowDonateModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-emerald-950/20 cursor-pointer flex items-center gap-2"
                >
                  <Heart className="h-4 w-4 fill-white" />
                  Donate Fund (Tax-Exempt)
                </button>
                <button
                  onClick={() => setShowVolunteerModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Register as Sewa Volunteer
                </button>
              </div>
            </div>

            {/* Core counters panel */}
            <div className="w-full md:w-80 grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/50">
                <p className="text-2xl font-black text-emerald-400">{publicDonationsCount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Meals Sourced</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/50">
                <p className="text-2xl font-black text-amber-400">{publicVolunteersCount.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Active Volunteers</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/50">
                <p className="text-2xl font-black text-blue-400">{ngos.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Registered NGOs</p>
              </div>
              <div className="bg-slate-800/60 backdrop-blur-xs p-4 rounded-2xl border border-slate-700/50">
                <p className="text-2xl font-black text-purple-400">₹{(publicFundsCount / 100000).toFixed(1)}L</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Funds Secured</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-lg font-black text-gray-950">Strategic Logistics Workflow</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Decoupled microservice triggers verify, pack, route, and distribute safely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: "01", icon: Utensils, title: "Surplus Logged", desc: "Restaurants or wedding venues submit available servings under 30 seconds." },
                { step: "02", icon: Shield, title: "AI Fraud Screened", desc: "NLP and computer vision systems scan submissions to reject duplicates and check freshness." },
                { step: "03", icon: MapPin, title: "Volunteer Picked", desc: "Haversine engine dispatch targets regional scooter-riders to collect the sealed hotbox." },
                { step: "04", icon: CheckCircle, title: "Trust Verified", desc: "NGO checks-in delivery using QR codes, immediately refreshing live public charts." }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#F1ECE4] rounded-2xl p-5 hover:shadow-xs transition relative">
                  <span className="absolute top-4 right-4 text-[10px] font-black text-amber-600/35 bg-amber-50 px-2 py-0.5 rounded-full">{item.step}</span>
                  <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200/50 text-amber-700">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs font-black text-gray-900 mt-4">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live requests state feed */}
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-[#F1ECE4] pb-3">
              <div>
                <h3 className="text-sm font-black text-gray-950">Live Operational Feed (Active Delhi Runs)</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Real-time status of rescued surplus packages and volunteer routing.</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">LIVE ACTIVITY FEED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {donations.slice(0, 6).map((don) => (
                <div key={don.id} className="bg-white border border-[#F1ECE4] rounded-2xl p-4 flex flex-col justify-between hover:border-amber-200 transition">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{don.id}</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                        don.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : don.status === "claimed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : don.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {don.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-gray-900 line-clamp-1">{don.donorName}</h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-amber-600 flex-shrink-0" />
                        {don.address}
                      </p>
                    </div>

                    {don.notes && (
                      <p className="text-[10px] text-gray-400 bg-[#FCFAF5] p-2 rounded-lg line-clamp-2 border border-[#F1ECE4]/50 leading-normal">
                        {don.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#F1ECE4]/70 mt-3 text-[10px]">
                    <span className="font-bold text-gray-700">{don.servings} Servings</span>
                    <span className="text-gray-400 italic">
                      {new Date(don.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Analytics */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-black text-gray-950">Dynamic Ledger Audit & Transparency</h3>
              <p className="text-xs text-gray-500 mt-1">Live accounting charts generated from transactional server events.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doughnut Chart */}
              <div className="bg-[#FAF8F5] border border-[#F1ECE4]/80 p-5 rounded-2xl flex flex-col h-[300px]">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Fund Utilization Allocation</h4>
                <div className="flex-1 min-h-0 flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={fundUtilizationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {fundUtilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${(Number(value) * (publicFundsCount / 100)).toLocaleString()}`} />
                    </RePieChart>
                  </ResponsiveContainer>
                  
                  {/* Central Text HUD */}
                  <div className="absolute text-center">
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Platform CSR</p>
                    <p className="text-sm font-black text-gray-900">100% Secure</p>
                  </div>
                </div>

                {/* Custom Legend */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 mt-3 border-t border-[#F1ECE4] pt-2">
                  {fundUtilizationData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name} ({item.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Line Chart */}
              <div className="bg-[#FAF8F5] border border-[#F1ECE4]/80 p-5 rounded-2xl flex flex-col h-[300px]">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sustained Monthly Deliveries Trend</h4>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={impactTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ECE5DA" />
                      <XAxis dataKey="month" stroke="#78716C" fontSize={10} />
                      <YAxis stroke="#78716C" fontSize={10} />
                      <Tooltip contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #E9E1D5", fontSize: "11px" }} />
                      <Line type="monotone" dataKey="meals" stroke="#10B981" strokeWidth={3} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 text-center">
                  *Caloric security volume is monitored through physical QR audit vouchers at reception gates.
                </p>
              </div>
            </div>
          </div>

          {/* Contact segment */}
          <div className="bg-white border border-[#F1ECE4] rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xs">
            <h3 className="text-sm font-black text-gray-950 text-center">Contact Strategic Partnership Desk</h3>
            <p className="text-xs text-gray-500 text-center mt-1">
              Connect with Section 8 board members to establish CSR matching programs.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4 mt-6 text-xs text-gray-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="name@organization.org"
                    className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Subject Matrix</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                >
                  <option>Partnership Inquiry</option>
                  <option>CSR Fund Allocations</option>
                  <option>Restaurant Integration</option>
                  <option>NGO Onboarding Help</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Inquiry Details</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Detail your request, city density, and proposed logistics matching model..."
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Dispatch Inquiry to Core Committee
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* ----------------- SUB-VIEW: MOBILE APP SIMULATOR ----------------- */}
      {activeSubTab === "mobile" && (
        <motion.div
          key="mobile-simulator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex gap-2.5 items-center max-w-2xl mx-auto">
            <Smartphone className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p>
              <strong>Interactive Mockups:</strong> This simulates three typical smartphone layouts on budget Android devices. Click through the <strong>OTP Login Flow</strong> or report a <strong>Spam/Blurred Photo Proof</strong> in Screen 3 to watch the <strong>AI Fraud Engine</strong> instantly flag it!
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 items-start">
            
            {/* PHONE SCREEN 1: OTP LOGIN */}
            <div className="flex flex-col items-center">
              <div className="w-[300px] h-[550px] border-[8px] border-slate-900 rounded-[32px] overflow-hidden bg-slate-50 shadow-lg relative flex flex-col justify-between">
                {/* Speaker pill notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>

                <div className="flex-1 bg-gradient-to-b from-emerald-800 to-slate-900 p-5 pt-10 flex flex-col justify-center text-white text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full mx-auto flex items-center justify-center border border-white/20 mb-4">
                    <Heart className="h-8 w-8 text-emerald-300 fill-emerald-300" />
                  </div>
                  <h3 className="text-xl font-extrabold tracking-tight">Project SETU</h3>
                  <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mt-1">Sewa Volunteer App</p>

                  <div className="mt-8 space-y-3.5 text-xs text-left">
                    {mobileIsLoggedIn ? (
                      <div className="text-center space-y-3 bg-white/10 p-4 rounded-xl border border-white/15">
                        <CheckCircle className="h-8 w-8 text-emerald-300 mx-auto" />
                        <p className="font-bold">Rahul Sharma Logged In</p>
                        <button
                          onClick={() => {
                            setMobileIsLoggedIn(false);
                            setMobileScreen("login");
                            setMobileOtpSent(false);
                            setMobileOtp("");
                            setMobilePhoneNum("");
                          }}
                          className="px-4 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-bold"
                        >
                          Reset Simulation
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-[9px] text-emerald-300 font-bold uppercase tracking-wider mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="e.g. 9988776655"
                            value={mobilePhoneNum}
                            onChange={(e) => setMobilePhoneNum(e.target.value.replace(/\D/g, ""))}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-emerald-300 text-white placeholder-slate-400 text-xs"
                          />
                        </div>

                        {mobileOtpSent && (
                          <div>
                            <label className="block text-[9px] text-emerald-300 font-bold uppercase tracking-wider mb-1">Enter OTP</label>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="Type '1234'"
                              value={mobileOtp}
                              onChange={(e) => setMobileOtp(e.target.value.replace(/\D/g, ""))}
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl outline-none focus:border-emerald-300 text-white placeholder-slate-400 text-xs font-mono text-center tracking-widest"
                            />
                          </div>
                        )}

                        {!mobileOtpSent ? (
                          <button
                            onClick={handleSendOtp}
                            className="w-full py-2 bg-white hover:bg-slate-50 text-emerald-950 font-bold rounded-xl transition text-[11px]"
                          >
                            Send OTP Code
                          </button>
                        ) : (
                          <button
                            onClick={handleVerifyOtp}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition text-[11px]"
                          >
                            Verify & Proceed
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Simulated Home pill indicator */}
                <div className="bg-slate-100 py-1.5 flex justify-center border-t border-slate-200">
                  <span className="w-16 h-1 bg-slate-400 rounded-full"></span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-2">Screen 1: Safe OTP Verification</p>
            </div>

            {/* PHONE SCREEN 2: ACTIVE VOLUNTEER DASHBOARD */}
            <div className="flex flex-col items-center">
              <div className="w-[300px] h-[550px] border-[8px] border-slate-900 rounded-[32px] overflow-hidden bg-slate-50 shadow-lg relative flex flex-col justify-between">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 flex flex-col bg-slate-100">
                  {/* App Header bar */}
                  <div className="bg-emerald-800 p-4 text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-emerald-300">Resilient Gateway</p>
                        <h4 className="text-xs font-black">Rahul Sharma (Sewa Unit)</h4>
                      </div>
                      <div className="bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-[9px] font-bold text-amber-300 flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Score: {volunteerTrustScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="p-3 space-y-4 flex-1 text-left">
                    {/* Action Panel */}
                    <button
                      onClick={() => setMobileScreen("report")}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl shadow-xs text-left cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-black">Report Hunger Hotspot</h4>
                        <p className="text-[10px] text-amber-50 mt-0.5">Report local areas needing emergency rations.</p>
                      </div>
                      <PlusCircle className="h-5 w-5" />
                    </button>

                    {/* Pending tasks to claim */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available runs near you</h4>
                      
                      {donations.filter(d => d.status === "pending").length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic text-center py-2">No active pending runs.</p>
                      ) : (
                        donations.filter(d => d.status === "pending").slice(0, 2).map(don => (
                          <div key={don.id} className="bg-white p-2.5 rounded-xl border border-gray-200/80 shadow-xs flex justify-between items-center">
                            <div>
                              <h5 className="text-[11px] font-extrabold text-gray-900 truncate max-w-[150px]">{don.donorName}</h5>
                              <p className="text-[9px] text-gray-500 flex items-center gap-0.5">
                                <MapPin className="h-2.5 w-2.5 text-amber-600" />
                                {don.address}
                              </p>
                              <p className="text-[9px] text-emerald-700 font-bold mt-0.5">{don.servings} Servings</p>
                            </div>
                            <button
                              onClick={() => handleClaimDonation(don.id)}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[9px] rounded-md transition cursor-pointer"
                            >
                              Claim Run
                            </button>
                          </div>
                        ))
                      )}
                {/* INTERACTIVE QR CODE SCANNER IN-APP OVERLAY */}
                <AnimatePresence>
                  {isScanningActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute inset-0 bg-slate-950 z-30 flex flex-col text-white select-none p-4 pt-10"
                    >
                      {/* Top App Bar inside Phone */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setIsScanningActive(false);
                            setActiveScanningTaskId(null);
                            setScanningStatus("idle");
                            setScanningErrorMessage("");
                          }}
                          className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] font-bold"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" /> Back
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                          {scanningType === "pickup" ? "Donor Verification" : "NGO Gate Inbound"}
                        </span>
                        <div className="w-6 h-1 bg-transparent"></div>
                      </div>

                      {/* View mode toggle tabs (Camera vs Manual) */}
                      <div className="grid grid-cols-2 bg-slate-900 p-0.5 rounded-lg border border-slate-800 mt-3 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setScannerViewMode("camera")}
                          className={`py-1 rounded font-bold transition-all ${
                            scannerViewMode === "camera"
                              ? "bg-slate-800 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <Camera className="h-3 w-3 inline mr-1" />
                          Camera Scan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setScannerViewMode("manual");
                            setScanningErrorMessage("");
                            setScanningStatus("idle");
                          }}
                          className={`py-1 rounded font-bold transition-all ${
                            scannerViewMode === "manual"
                              ? "bg-slate-800 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <ClipboardList className="h-3 w-3 inline mr-1" />
                          Manual Entry
                        </button>
                      </div>

                      {/* Main Viewer Body */}
                      <div className="flex-1 flex flex-col justify-between mt-3 text-center min-h-0">
                        {scannerViewMode === "camera" ? (
                          <div className="flex-1 flex flex-col justify-center items-center py-2 relative">
                            {/* Scanning overlay bracket target */}
                            <div className="w-36 h-36 border border-slate-800 bg-slate-900/40 rounded-xl relative flex items-center justify-center overflow-hidden">
                              
                              {/* Corner Brackets */}
                              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm"></div>
                              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm"></div>
                              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm"></div>
                              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-500 rounded-br-sm"></div>
                              
                              {/* Scanning sweep laser line */}
                              {(scanningStatus === "scanning" || scanningStatus === "idle") && (
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-500/70 shadow-[0_0_8px_#10B981] animate-bounce"></div>
                              )}

                              {/* Scanning Icons/HUD based on Status */}
                              <AnimatePresence mode="wait">
                                {scanningStatus === "scanning" && (
                                  <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-amber-400 space-y-1"
                                  >
                                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-amber-500" />
                                    <p className="text-[9px] font-bold">Matching Key...</p>
                                  </motion.div>
                                )}

                                {scanningStatus === "success" && (
                                  <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-emerald-400 space-y-1"
                                  >
                                    <CheckCircle className="h-8 w-8 mx-auto text-emerald-400" />
                                    <p className="text-[9px] font-bold">Verified!</p>
                                  </motion.div>
                                )}

                                {scanningStatus === "error" && (
                                  <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-rose-400 space-y-1"
                                  >
                                    <AlertTriangle className="h-6 w-6 mx-auto text-rose-500" />
                                    <p className="text-[9px] font-bold">Check Failed</p>
                                  </motion.div>
                                )}

                                {scanningStatus === "idle" && (
                                  <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-500 text-[9px] max-w-[100px] text-center"
                                  >
                                    <QrCode className="h-6 w-6 mx-auto text-gray-500 mb-1 animate-pulse" />
                                    Align QR signature
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Prompt text */}
                            <div className="mt-2 space-y-1 px-3">
                              <p className="text-[10px] text-gray-300 font-semibold leading-snug">
                                {scanningType === "pickup" 
                                  ? "Position donor's receipt QR inside the active scan window" 
                                  : "Align NGO inbound ledger gate QR to complete run"}
                              </p>
                              
                              {scanningErrorMessage && (
                                <p className="text-[9px] text-rose-400 bg-rose-950/40 border border-rose-900/35 p-1 rounded font-medium leading-normal">
                                  {scanningErrorMessage}
                                </p>
                              )}
                            </div>

                            {/* Simulation triggers tray inside phone */}
                            <div className="mt-auto w-full pt-2 border-t border-slate-900 space-y-1.5">
                              <p className="text-[8px] text-amber-500 font-bold uppercase tracking-wider">Simulator Scan Triggers</p>
                              <div className="grid grid-cols-2 gap-1 px-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const t = tasks.find(x => x.id === activeScanningTaskId);
                                    if (t) {
                                      const validCode = scanningType === "pickup" ? t.donationId : t.ngoId;
                                      handleVerifyScannedCode(validCode);
                                    }
                                  }}
                                  className="py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] rounded-lg transition"
                                >
                                  Scan Correct QR
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleVerifyScannedCode("SPOOF_INVALID_SIGNATURE")}
                                  className="py-1 bg-rose-900 hover:bg-rose-800 text-white font-black text-[9px] rounded-lg transition"
                                >
                                  Scan Spoofed QR
                                </button>
                              </div>
                              <p className="text-[7.5px] text-gray-500 italic">
                                *Go to the "Donor Portal" sub-tab to see Priya's pickup QR code!
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Manual Code Entry Fallback Form */
                          <div className="flex-1 flex flex-col justify-between py-4 text-left px-3">
                            <div className="space-y-3">
                              <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[9px] text-gray-400 flex items-start gap-2 leading-relaxed">
                                <Info className="h-3 w-3 text-amber-400 flex-shrink-0 mt-0.5" />
                                <span>
                                  As backup, type the cryptographic confirmation code printed below the QR code.
                                </span>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Verification Code</label>
                                <input
                                  type="text"
                                  placeholder={scanningType === "pickup" ? "e.g. don-02" : "e.g. ngo-01"}
                                  value={manualCodeInput}
                                  onChange={(e) => setManualCodeInput(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-lg outline-none text-[11px] font-mono uppercase tracking-widest placeholder:text-gray-600 focus:border-emerald-500"
                                />
                              </div>

                              {scanningErrorMessage && (
                                <p className="text-[9px] text-rose-400 bg-rose-950/40 border border-rose-900/35 p-1 rounded font-medium leading-normal">
                                  {scanningErrorMessage}
                                </p>
                              )}

                              {scanningStatus === "scanning" && (
                                <div className="text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                  <RefreshCw className="h-3 w-3 animate-spin" /> Cryptographic validation active...
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleVerifyScannedCode(manualCodeInput)}
                              disabled={!manualCodeInput || scanningStatus === "scanning"}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-gray-600 text-white font-bold text-[10px] rounded-lg transition"
                            >
                              Verify Code Entry
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                              {/* Active tasks progress */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your Claimed Transit Deliveries</h4>
                      
                      {tasks.filter(t => t.status === "claimed").length === 0 ? (
                        <p className="text-[10px] text-gray-400 italic text-center py-2">No active transit tasks claimed.</p>
                      ) : (
                        tasks.filter(t => t.status === "claimed").map(task => (
                          <div key={task.id} className={`bg-white p-2.5 rounded-xl border-l-4 ${task.pickupVerified ? 'border-emerald-500' : 'border-amber-500'} border-y border-r border-gray-200 shadow-xs space-y-2`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-[11px] font-extrabold text-gray-900 truncate max-w-[140px]">{task.donation.donorName}</h5>
                                <p className="text-[9px] text-blue-700 font-bold uppercase mt-0.5">Dest: {task.ngoName}</p>
                              </div>
                              <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                                task.pickupVerified 
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}>
                                {task.pickupVerified ? "In Transit" : "Claimed (Pending Pickup)"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-100">
                              <span className="text-[8px] text-gray-400 flex items-center gap-0.5">
                                <QrCode className="h-2.5 w-2.5 text-gray-400" />
                                {task.pickupVerified ? "Handoff Code Match" : "Scan to Pickup"}
                              </span>
                              
                              {!task.pickupVerified ? (
                                <button
                                  onClick={() => {
                                    setActiveScanningTaskId(task.id);
                                    setScanningType("pickup");
                                    setIsScanningActive(true);
                                    setScanningStatus("idle");
                                    setScanningErrorMessage("");
                                    setScannerViewMode("camera");
                                  }}
                                  className="ml-auto px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-[9px] rounded transition cursor-pointer flex items-center gap-1"
                                >
                                  <Scan className="h-2.5 w-2.5" />
                                  Scan Pickup QR
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveScanningTaskId(task.id);
                                    setScanningType("delivery");
                                    setIsScanningActive(true);
                                    setScanningStatus("idle");
                                    setScanningErrorMessage("");
                                    setScannerViewMode("camera");
                                  }}
                                  className="ml-auto px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] rounded transition cursor-pointer flex items-center gap-1"
                                >
                                  <Check className="h-2.5 w-2.5" />
                                  Scan Delivery QR
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>            </div>

                  </div>
                </div>

                {/* Simulated Home indicator */}
                <div className="bg-slate-100 py-1.5 flex justify-center border-t border-slate-200">
                  <span className="w-16 h-1 bg-slate-400 rounded-full"></span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-2">Screen 2: Dispatch Duty Board</p>
            </div>

            {/* PHONE SCREEN 3: SUBMIT HELP REQUEST */}
            <div className="flex flex-col items-center">
              <div className="w-[300px] h-[550px] border-[8px] border-slate-900 rounded-[32px] overflow-hidden bg-slate-50 shadow-lg relative flex flex-col justify-between">
                {/* Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 flex flex-col bg-slate-100 text-left">
                  {/* Back button and head */}
                  <div className="bg-white p-3 border-b border-gray-200 flex items-center gap-3">
                    <button onClick={() => setMobileScreen("dashboard")} className="text-gray-500 hover:text-gray-900">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h4 className="text-xs font-black text-gray-900">Report Hotspot Need</h4>
                  </div>

                  <form onSubmit={handleMobileHotspotReport} className="p-3.5 space-y-3.5 text-xs text-gray-800">
                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Requirement Type</label>
                      <select
                        value={reqType}
                        onChange={(e) => setReqType(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none"
                      >
                        <option value="food">Perishable Food Surplus</option>
                        <option value="medicine">Surplus Prescription Meds</option>
                        <option value="essentials">Blankets & Shelter Essentials</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Estimated Beneficiaries</label>
                      <input
                        type="number"
                        min={5}
                        max={500}
                        value={reqServings}
                        onChange={(e) => setReqServings(parseInt(e.target.value) || 10)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Location GPS Area</label>
                      <input
                        type="text"
                        required
                        value={reqLocation}
                        onChange={(e) => setReqLocation(e.target.value)}
                        placeholder="e.g. Karol Bagh flyover cluster"
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg outline-none"
                      />
                    </div>

                    {/* Interactive photo verification simulator */}
                    <div>
                      <label className="block text-[9px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Photo upload verification</label>
                      <div className="bg-white border border-gray-300 rounded-lg p-2.5 text-center space-y-2">
                        <div className="flex gap-1 justify-center">
                          <button
                            type="button"
                            onClick={() => setReqQualityType("clean")}
                            className={`px-2 py-1 text-[9px] font-bold rounded ${
                              reqQualityType === "clean" ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Clean Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setReqQualityType("suspicious")}
                            className={`px-2 py-1 text-[9px] font-bold rounded ${
                              reqQualityType === "suspicious" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Spam Photo
                          </button>
                          <button
                            type="button"
                            onClick={() => setReqQualityType("blurred")}
                            className={`px-2 py-1 text-[9px] font-bold rounded ${
                              reqQualityType === "blurred" ? "bg-rose-100 text-rose-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            Blurred Proof
                          </button>
                        </div>
                        <div className="h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-slate-50">
                          {reqQualityType === "clean" && (
                            <div className="text-[10px] text-emerald-700 flex items-center gap-1">
                              <Camera className="h-4 w-4" /> Photo: Clean Package (Auto-Clear)
                            </div>
                          )}
                          {reqQualityType === "suspicious" && (
                            <div className="text-[10px] text-yellow-700 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" /> Photo: Template Match (Duplication)
                            </div>
                          )}
                          {reqQualityType === "blurred" && (
                            <div className="text-[10px] text-rose-700 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" /> Photo: Blurred EXIF (Obfuscation)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer text-[11px]"
                    >
                      Audit & Submit Spot
                    </button>
                  </form>
                </div>

                {/* Simulated Home indicator */}
                <div className="bg-slate-100 py-1.5 flex justify-center border-t border-slate-200">
                  <span className="w-16 h-1 bg-slate-400 rounded-full"></span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-2">Screen 3: AI Fraud Gate Simulator</p>
            </div>

          </div>
        </motion.div>
      )}

      {/* ----------------- SUB-VIEW: ADMIN COMMAND PANEL ----------------- */}
      {activeSubTab === "admin" && (
        <motion.div
          key="admin-command"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-left"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1ECE4] pb-4">
            <div>
              <h3 className="text-sm font-black text-gray-950">Project SETU Central Control Panel</h3>
              <p className="text-xs text-gray-500 mt-0.5">National level operations matching diagnostics and AI Fraud warnings review.</p>
            </div>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-extrabold">ADMIN CORE DISPATCH</span>
          </div>

          {/* Quick HUD row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#F1ECE4] p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Shipments</span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {donations.filter(d => d.status === "pending" || d.status === "claimed").length}
              </p>
              <p className="text-[9px] text-emerald-700 font-bold mt-1">✓ Matching dispatch optimal</p>
            </div>
            <div className="bg-white border border-[#F1ECE4] p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Volunteers On-Road</span>
              <p className="text-2xl font-black text-gray-900 mt-1">128</p>
              <p className="text-[9px] text-blue-700 font-bold mt-1">🛵 Connected via Socket Bus</p>
            </div>
            <div className="bg-white border border-[#F1ECE4] p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Meals Fed Today</span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {donations.filter(d => d.status === "delivered").reduce((acc, curr) => acc + curr.servings, 1240)}
              </p>
              <p className="text-[9px] text-purple-700 font-bold mt-1">✓ Audit vouchers received</p>
            </div>
            <div className="bg-white border border-[#F1ECE4] p-4 rounded-2xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Fraud Alerts Pending</span>
              <p className="text-2xl font-black text-rose-600 mt-1">
                {donations.filter(d => d.status === "flagged").length}
              </p>
              <p className="text-[9px] text-rose-700 font-bold mt-1">⚠ Requires security override</p>
            </div>
          </div>

          {/* Main admin actions grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Requests Ledger */}
            <div className="lg:col-span-8 bg-white border border-[#F1ECE4] p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4 border-b border-[#F1ECE4]/70 pb-2">
                <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Live Sourcing & Delivery Ledger</h4>
                <span className="text-[10px] text-gray-400">Total: {donations.length} records</span>
              </div>

              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 text-[10px] font-bold uppercase">
                      <th className="py-2">Run ID</th>
                      <th className="py-2">Source / Outlet</th>
                      <th className="py-2">Locality</th>
                      <th className="py-2">Size</th>
                      <th className="py-2">Gate Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {donations.map((don) => (
                      <tr key={don.id} className="hover:bg-[#FCFAF5] transition">
                        <td className="py-3 font-mono text-[10px] text-gray-500">{don.id}</td>
                        <td className="py-3 font-bold text-gray-900 truncate max-w-[150px]">{don.donorName}</td>
                        <td className="py-3 text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {don.address.split(" ")[0]}
                        </td>
                        <td className="py-3 font-black text-slate-800">{don.servings} servings</td>
                        <td className="py-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            don.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : don.status === "claimed"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : don.status === "delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {don.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Fraud Inspector Warnings */}
            <div className="lg:col-span-4 bg-white border border-[#F1ECE4] p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 border-b border-[#F1ECE4]/70 pb-2 mb-4 text-rose-700">
                  <Shield className="h-4.5 w-4.5" />
                  <h4 className="text-xs font-black uppercase tracking-wider">AI Fraud override desk</h4>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto">
                  {donations.filter(d => d.status === "flagged").length === 0 ? (
                    <div className="text-center py-10 space-y-2 text-gray-400">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                      <p className="text-[11px] font-bold">0 Active Security Warnings</p>
                      <p className="text-[10px]">All hotspot submissions approved by computer vision gates.</p>
                    </div>
                  ) : (
                    donations.filter(d => d.status === "flagged").map((don) => (
                      <div key={don.id} className="bg-rose-50/50 border border-rose-200/60 p-3 rounded-xl space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono font-bold text-rose-950">{don.id}</span>
                          <span className="font-bold text-gray-400">Just Now</span>
                        </div>
                        
                        <div>
                          <p className="text-[11px] font-bold text-rose-950">{don.donorName}</p>
                          <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                            Reason: {don.id.includes("suspect") ? "Blurred proof photo fails OCR timestamp matching." : "EXIF Geolocation spoof warning triggered."}
                          </p>
                        </div>

                        <div className="flex gap-1 pt-1.5 border-t border-rose-200/30">
                          <button
                            onClick={() => handleAdminApprove(don.id)}
                            className="flex-1 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] rounded transition cursor-pointer"
                          >
                            Approve Override
                          </button>
                          <button
                            onClick={() => handleAdminReject(don.id)}
                            className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-[9px] rounded transition cursor-pointer"
                          >
                            Reject & Purge
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Bottom SLA disclaimer */}
              <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-[10px] text-amber-950 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
                <span>Rejected listings instantly update on-road volunteer routers.</span>
              </div>
            </div>

          </div>

          {/* High-End Admin Analytics Row (Recharts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: Request type stats */}
            <div className="bg-[#FAF8F5] border border-[#F1ECE4]/80 p-5 rounded-2xl flex flex-col h-[300px]">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rescued Supplies by Category</h4>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={requestDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECE5DA" />
                    <XAxis dataKey="category" stroke="#78716C" fontSize={10} />
                    <YAxis stroke="#78716C" fontSize={10} />
                    <Tooltip contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #E9E1D5", fontSize: "11px" }} />
                    <Bar dataKey="count" fill="#F59E0B" radius={4} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Volunteer SLA parameters */}
            <div className="bg-[#FAF8F5] border border-[#F1ECE4]/80 p-5 rounded-2xl flex flex-col h-[300px]">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Volunteer SLA & Trust Performance</h4>
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={volunteerPerformanceData}>
                    <PolarGrid stroke="#ECE5DA" />
                    <PolarAngleAxis dataKey="subject" fontSize={10} stroke="#78716C" />
                    <PolarRadiusAxis fontSize={9} stroke="#78716C" />
                    <Radar name="Rahul S." dataKey="score" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </motion.div>
      )}

      {/* ----------------- SUB-VIEW: DONOR PORTAL ----------------- */}
      {activeSubTab === "donor" && (
        <motion.div
          key="donor-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 text-left"
        >
          {/* Priya Mehta Welcome card */}
          <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl relative overflow-hidden border border-slate-800">
            {/* Glow background */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Resigned Member Profile</p>
              <h3 className="text-xl sm:text-2xl font-black">Pranam, Priya Mehta</h3>
              <p className="text-xs text-slate-300 max-w-md">Your registered Section 135 corporate grants are matching regional Delhi-NCR food rescue clusters.</p>
            </div>

            <div className="relative z-10 bg-white/10 p-4 rounded-2xl border border-white/15 min-w-[150px] text-right">
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Total CSR Funded</p>
              <p className="text-2xl font-black text-amber-300 mt-1">₹{publicFundsCount.toLocaleString()}</p>
              <p className="text-[9px] text-slate-300 mt-1">Section 80G tax receipt ready</p>
            </div>
          </div>

          {/* Quick audit parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-[#F1ECE4] p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <Utensils className="h-6 w-6 text-emerald-600" />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+14% MoM</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-semibold">Rescued Meals Supported</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {(publicFundsCount / 15).toFixed(0)} meals
              </p>
            </div>

            <div className="bg-white border border-[#F1ECE4] p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Active</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-semibold">Vulnerable Lives Impacted</p>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {(publicFundsCount / 40).toFixed(0)} individuals
              </p>
            </div>

            <div className="bg-white border border-[#F1ECE4] p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <Award className="h-6 w-6 text-amber-600" />
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">80G Clear</span>
              </div>
              <p className="text-xs text-gray-500 mt-3 font-semibold">Tax Exemption Audits</p>
              <p className="text-2xl font-black text-gray-900 mt-1">100% Tax Free</p>
            </div>
          </div>

          {/* Ledger History & Impact Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Ledger */}
            <div className="lg:col-span-7 bg-white border border-[#F1ECE4] p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Your Transacted Donations Ledger</h4>
              
              <div className="space-y-3">
                {[
                  { title: "Sewa Emergency Hunger Fund", date: "Today, 11:30 AM", amount: "₹2,500", status: "completed" },
                  { title: "Noida Slum Cluster Food Aid", date: "Jul 28, 2026", amount: "₹10,000", status: "completed" },
                  { title: "GT Karnal Banquet Surplus Matching", date: "Jul 15, 2026", amount: "₹12,500", status: "completed" }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#FCFAF5] border border-[#F1ECE4]/85 p-3 rounded-xl text-xs">
                    <div className="space-y-1">
                      <p className="font-extrabold text-gray-900">{item.title}</p>
                      <p className="text-[10px] text-gray-400">{item.date}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-gray-900">{item.amount}</p>
                      <span className="text-[9px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Impact Stories */}
            <div className="lg:col-span-5 bg-white border border-[#F1ECE4] p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Your Impact Stories</h4>
              
              <div className="space-y-3 text-xs">
                <div className="bg-emerald-50/40 border-l-4 border-emerald-500 p-3 rounded-r-xl space-y-1.5">
                  <span className="text-[9px] text-emerald-700 font-black block">50 MEALS DELIVERED</span>
                  <p className="text-gray-700 leading-relaxed font-medium text-[11px]">
                    Your donation successfully funded the diesel & safety equipment for 2 volunteer scooters, delivering 180 servings of wedding surplus to Okhla Shelter night-dwellers.
                  </p>
                  <a href="#" className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 mt-1">
                    Inspect Photo Proof Audit <ChevronRight className="h-3 w-3" />
                  </a>
                </div>

                <div className="bg-amber-50/40 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1.5">
                  <span className="text-[9px] text-amber-700 font-black block">MEDICINE ROUTING ACTIVE</span>
                  <p className="text-gray-700 leading-relaxed font-medium text-[11px]">
                    Funded regional medicine checks at Karol Bagh Old Age shelter, matching unexpired family medical surpluses for 14 elderly citizens.
                  </p>
                  <a href="#" className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 mt-1">
                    Review Verification Receipt <ChevronRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Sourcing button */}
          <div className="text-center pt-4">
            <button
              onClick={() => setShowDonateModal(true)}
              className="px-10 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-2xl transition shadow-md shadow-emerald-900/10 cursor-pointer flex items-center gap-2 mx-auto"
            >
              <PlusCircle className="h-5 w-5" />
              Make Another CSR Donation
            </button>
          </div>
        </motion.div>
      )}

      {/* ----------------- MODAL: MAKE DONATION ----------------- */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#F1ECE4] rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-6 text-left"
          >
            <button
              onClick={() => setShowDonateModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-gray-950">Sewa CSR Donation</h3>
              <p className="text-xs text-gray-500 mt-1">Secure transactional donation to Section 8 tax-free matching funds.</p>
            </div>

            <div className="space-y-4 text-xs text-gray-800">
              
              {/* Preset buttons */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Preset Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setDonateAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        donateAmount === amt && !customAmount
                          ? "bg-emerald-50 text-emerald-800 border-emerald-400"
                          : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom input */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Custom Amount (₹)</label>
                <input
                  type="number"
                  placeholder="Enter custom rupees"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-emerald-500 font-mono text-sm"
                />
              </div>

              {/* Purpose select */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Purpose Designation</label>
                <select
                  value={donatePurpose}
                  onChange={(e) => setDonatePurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-emerald-500"
                >
                  <option value="Food Security">Food Security (Surplus Logistics Sourcing)</option>
                  <option value="Emergency Relief">Emergency Relief & Disaster SOS</option>
                  <option value="Cold Chain Systems">Cold Chain Systems Development</option>
                </select>
              </div>

              {/* Mock payment methods */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Mechanism</label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border border-[#E9E1D5] bg-[#FCFAF5] rounded-xl cursor-pointer hover:border-emerald-400 transition">
                    <input
                      type="radio"
                      name="paymethod"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="mr-3 accent-emerald-600"
                    />
                    <Smartphone className="h-4.5 w-4.5 text-emerald-700 mr-2" />
                    <span className="font-extrabold text-[11px]">UPI (Paytm / GPay / PhonePe)</span>
                  </label>

                  <label className="flex items-center p-3 border border-[#E9E1D5] bg-[#FCFAF5] rounded-xl cursor-pointer hover:border-emerald-400 transition">
                    <input
                      type="radio"
                      name="paymethod"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-3 accent-emerald-600"
                    />
                    <CreditCard className="h-4.5 w-4.5 text-emerald-700 mr-2" />
                    <span className="font-extrabold text-[11px]">Corporate Debit/Credit Card</span>
                  </label>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleMockDonationSubmit}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Lock className="h-4 w-4" />
                Authorize Payment & Fund Meals
              </button>

              <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                🔒 AES-256 TLS Bank Gate. Section 80G Tax certificate auto-generated.
              </p>

            </div>
          </motion.div>
        </div>
      )}

      {/* ----------------- MODAL: BECOME A VOLUNTEER ----------------- */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-[#F1ECE4] rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-6 text-left"
          >
            <button
              onClick={() => setShowVolunteerModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-gray-950">Register as Sewa Volunteer</h3>
              <p className="text-xs text-gray-500 mt-1">Join our dynamic delivery fleet matching surplus to night shelters.</p>
            </div>

            <form onSubmit={handleRegisterVolunteer} className="space-y-4 text-xs text-gray-800">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Delhi Locality / Sector</label>
                <input
                  type="text"
                  required
                  placeholder="Karol Bagh, South Extension..."
                  className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Transit Asset</label>
                <select className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#E9E1D5] rounded-xl outline-none focus:border-amber-500">
                  <option>Scooter / Two-Wheeler (Optimal for bypass)</option>
                  <option>Automobile (Bulk canteens)</option>
                  <option>None (Local walker fleet)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Register & Initialize Onboarding Code
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
