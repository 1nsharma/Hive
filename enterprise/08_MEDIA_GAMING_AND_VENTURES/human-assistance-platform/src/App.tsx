import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  TrendingUp,
  Users,
  Paintbrush,
  ShieldAlert,
  FileText,
  Eye,
  Cpu,
  Database,
  Code,
  EyeOff,
  Lock,
  Scale,
  Heart,
  DollarSign,
  Map,
  Milestone,
  PieChart,
  Terminal,
  BarChart,
  GitBranch,
  Layers,
  Send,
  Plus,
  Check,
  AlertTriangle,
  X,
  Shield,
  Info,
  MapPin,
  User,
  Building,
  Truck,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  Search,
  ExternalLink,
  QrCode
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";

import { volumesData, Volume } from "./data/volumesData";
import { volume00Chapters } from "./data/volume00Deep";
import { volume01Chapters } from "./data/volume01Deep";
import { volume02Chapters } from "./data/volume02Deep";
import { volume03Chapters } from "./data/volume03Deep";
import { volume04Chapters } from "./data/volume04Deep";
import { volume04aChapters } from "./data/volume04aDeep";
import { architectureNodes } from "./data/architectureData";
import PrototypeView from "./components/PrototypeView";
import {
  Donation,
  VolunteerTask,
  NgoCenter,
  SystemAuditLog,
  FoodType,
  DonationStatus,
  TaskStatus
} from "./types";

// Icon mapping helper
const iconMap: Record<string, any> = {
  Compass,
  TrendingUp,
  Users,
  Paintbrush,
  ShieldAlert,
  FileText,
  Eye,
  Cpu,
  Database,
  Code,
  EyeOff,
  Lock,
  Scale,
  Heart,
  DollarSign,
  Map,
  Milestone,
  PieChart,
  Terminal,
  BarChart,
  GitBranch,
  Layers
};

// Simulated locations in Delhi
const DELHI_HUBS = [
  { id: "hub-cp", name: "Connaught Place", x: 200, y: 150, lat: 28.6139, lon: 77.2090 },
  { id: "hub-kb", name: "Karol Bagh", x: 120, y: 130, lat: 28.6142, lon: 77.1888 },
  { id: "hub-cc", name: "Chandni Chowk", x: 220, y: 70, lat: 28.6562, lon: 77.2300 },
  { id: "hub-okhla", name: "Okhla Industrial Area", x: 320, y: 280, lat: 28.5355, lon: 77.2736 },
  { id: "hub-noida", name: "Noida Sector 15", x: 380, y: 190, lat: 28.5833, lon: 77.3111 },
  { id: "hub-southext", name: "South Extension", x: 240, y: 240, lat: 28.5670, lon: 77.2185 },
  { id: "hub-chanakya", name: "Chanakyapuri", x: 100, y: 220, lat: 28.5910, lon: 77.1905 },
  { id: "hub-dwarka", name: "Dwarka Hub", x: 40, y: 260, lat: 28.5823, lon: 77.0500 }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"bible" | "sandbox" | "architecture" | "prototype">("bible");

  // Tab 1: Engineering Bible States
  const [selectedVolume, setSelectedVolume] = useState<Volume>(volumesData[0]);
  const [v00ActiveChapterIdx, setV00ActiveChapterIdx] = useState<number>(0);
  const [chapterCommentInput, setChapterCommentInput] = useState<string>("");
  const [signedOffChapters, setSignedOffChapters] = useState<Record<string, boolean>>({
    "v00_ch1": true,
    "v00_ch2": false,
    "v00_ch3": false,
    "v00_ch4": false,
    "v00_ch5": false,
    "v01_ch1": false,
    "v01_ch2": false,
    "v01_ch3": false,
    "v01_ch4": false,
    "v02_ch1": false,
    "v02_ch2": false,
    "v02_ch3": false,
    "v03_ch1": false,
    "v03_ch2": false,
    "v03_ch3": false,
    "v03_ch4": false,
    "v03_ch5": false,
    "v04_ch1": false,
    "v04_ch2": false,
    "v04_ch3": false,
    "v04_ch4": false,
    "v04_ch5": false,
    "v04_ch6": false,
    "v04_ch7": false,
    "v04a_ch1": false,
    "v04a_ch2": false,
    "v04a_ch3": false,
    "v04a_ch4": false,
    "v04a_ch5": false,
    "v04a_ch6": false
  });
  const [chapterFeedbackList, setChapterFeedbackList] = useState<Record<string, { author: string; text: string; date: string }[]>>({
    "v00_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "The state-wise poverty and child wasting data is outstanding. It matches our focus on regional hotspots perfectly. Let's seal this and move to chapter 2.",
        date: "Aug 02, 2026, 11:15 AM"
      }
    ],
    "v00_ch2": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Important observation about PDS excluding seasonal migrants. The localized community kitchens network is indeed a goldmine of pre-existing infrastructure.",
        date: "Aug 02, 2026, 11:45 AM"
      }
    ],
    "v01_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "30-second surplus logging is key. Keeping the donor form to 3 fields will secure massive catering participation during the busy wedding season.",
        date: "Aug 02, 2026, 12:45 PM"
      }
    ],
    "v01_ch2": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "User stories cover the full lifecycle. I like how we handle FSSAI liability releases for restaurants—it makes them feel safe to participate.",
        date: "Aug 02, 2026, 01:02 PM"
      }
    ],
    "v02_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "RHA vs Feeding India comparison is spot-on. We are exactly positioning SETU to fill the nocturnal, volatile banquet food waste gap that both miss.",
        date: "Aug 02, 2026, 01:15 PM"
      }
    ],
    "v02_ch2": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Documenting the FSSAI Good Samaritan protection is brilliant. This completely removes the risk fear from luxury hotel chains.",
        date: "Aug 02, 2026, 01:25 PM"
      }
    ],
    "v03_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Setting Project SETU as the internal architecture and auditing trademark conflicts is a masterstroke. Let's secure our Class 39 & 43 filings early.",
        date: "Aug 02, 2026, 10:45 PM"
      }
    ],
    "v03_ch2": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "The Dignity Vocabulary policy is exactly what was missing. Words matter. Saying 'Guests at the partner shelter' instead of 'poor people' preserves respect.",
        date: "Aug 02, 2026, 10:50 PM"
      }
    ],
    "v03_ch4": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Emerald, Saffron and Dignity Clay colors look incredibly polished. Saffron provides urgency while Emerald and Clay feel sanitary and comforting. Excellent tokens.",
        date: "Aug 02, 2026, 11:00 PM"
      }
    ],
    "v04_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Adding the District Operations Manager (DOM) as a persona is perfect for scaling! It completes our command-center logic.",
        date: "Aug 02, 2026, 11:15 PM"
      }
    ],
    "v04_ch3": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Outstanding safety integrations for nighttime runs! The SOS protocol and female curfew restrictions are highly responsible.",
        date: "Aug 02, 2026, 11:20 PM"
      }
    ],
    "v04a_ch1": [
      {
        author: "Amit Sharma (Co-founder)",
        text: "Saturated warm HSL tokens look beautiful and reduce glare during sunny street pickups. High-contrast ratio conformance is perfect.",
        date: "Aug 02, 2026, 11:30 PM"
      }
    ]
  });
  const [searchVolumeQuery, setSearchVolumeQuery] = useState("");
  const [coachInput, setCoachInput] = useState("");
  const [coachHistory, setCoachHistory] = useState<{ role: "user" | "coach"; text: string }[]>([
    {
      role: "coach",
      text: "Namaste! I am your Project SETU Strategic Advisor and Engineering Coach. Ask me anything about our 18-volume Startup Bible (v2.0), ground hunger statistics, or the Triple-Gated AI Fraud Engine."
    }
  ]);
  const [coachLoading, setCoachLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Tab 2: Operational Sandbox States
  const [sandboxRole, setSandboxRole] = useState<"donor" | "volunteer" | "ngo" | "admin">("donor");
  
  // Simulated State Database (local storage persistence or fresh fallback)
  const [ngos, setNgos] = useState<NgoCenter[]>([
    { id: "ngo-01", name: "Delhi Seva Ashram", address: "South Extension Flyover Block", lat: 28.5670, lon: 77.2185, mealsReceived: 215 },
    { id: "ngo-02", name: "Annapurna Shishu Griha", address: "Chandni Chowk Slum Shelter", lat: 28.6562, lon: 77.2300, mealsReceived: 140 },
    { id: "ngo-03", name: "Yamuna Migrant Welfare", address: "Noida Border Camp Sector 15", lat: 28.5833, lon: 77.3111, mealsReceived: 310 }
  ]);

  const [donations, setDonations] = useState<Donation[]>([
    {
      id: "don-01",
      donorName: "Taj Palace Wedding Banquet",
      foodType: "veg",
      servings: 180,
      freshnessHours: 8,
      address: "Okhla Banquet Corridor",
      lat: 28.5355,
      lon: 77.2736,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      status: "pending",
      notes: "High-grade Paneer Butter Masala, Roti, and Rice from a grand reception. Stored in clean, hot steel insulated containers.",
      photoUrl: "fresh_food_tag"
    },
    {
      id: "don-02",
      donorName: "Haldirams CP",
      foodType: "veg",
      servings: 45,
      freshnessHours: 4,
      address: "Connaught Place Inner Circle",
      lat: 28.6139,
      lon: 77.2090,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      status: "claimed",
      notes: "Daily fresh Chole Bhature surplus packs. Checked and sealed.",
      photoUrl: "fresh_food_tag"
    }
  ]);

  const [tasks, setTasks] = useState<VolunteerTask[]>([
    {
      id: "task-01",
      donationId: "don-02",
      donation: {
        id: "don-02",
        donorName: "Haldirams CP",
        foodType: "veg",
        servings: 45,
        freshnessHours: 4,
        address: "Connaught Place Inner Circle",
        lat: 28.6139,
        lon: 77.2090,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: "claimed",
        notes: "Daily fresh Chole Bhature surplus packs. Checked and sealed."
      },
      volunteerName: "Rohan Verma",
      status: "claimed",
      ngoId: "ngo-01",
      ngoName: "Delhi Seva Ashram",
      riskScore: 8,
      timestamp: new Date().toISOString(),
      distanceMetres: 4800,
      progress: 40
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([
    { id: "log-01", timestamp: new Date(Date.now() - 500000).toISOString(), category: "Ops", message: "Taj Palace Banquet reported surplus: 180 servings", status: "ok" },
    { id: "log-02", timestamp: new Date(Date.now() - 400000).toISOString(), category: "AI", message: "NLP Similarity Check: don-01 has 98% uniqueness. Approved.", status: "ok" },
    { id: "log-03", timestamp: new Date(Date.now() - 300000).toISOString(), category: "Ops", message: "Volunteer Rohan Verma claimed task CP -> South Ext", status: "ok" },
    { id: "log-04", timestamp: new Date(Date.now() - 200000).toISOString(), category: "Security", message: "Rate limit: Token bucket replenished for IP 103.88.22.41", status: "ok" }
  ]);

  // Volunteer form state
  const [selectedTaskToComplete, setSelectedTaskToComplete] = useState<string>("");
  const [simulatedPhotoType, setSimulatedPhotoType] = useState<"valid" | "spoiled" | "blank">("valid");
  const [simulatedGpsType, setSimulatedGpsType] = useState<"match" | "spoof">("match");

  // QR Code Scanner Simulation States
  const [isScanningQr, setIsScanningQr] = useState<boolean>(false);
  const [qrScanResult, setQrScanResult] = useState<"valid" | "invalid" | null>(null);
  const [isQrVerified, setIsQrVerified] = useState<boolean>(false);

  // Reset QR state when changing target tasks
  useEffect(() => {
    setIsQrVerified(false);
    setQrScanResult(null);
  }, [selectedTaskToComplete]);

  // Donor form state
  const [donorName, setDonorName] = useState("");
  const [foodType, setFoodType] = useState<FoodType>("veg");
  const [servings, setServings] = useState(50);
  const [freshnessHours, setFreshnessHours] = useState(6);
  const [pickupHubId, setPickupHubId] = useState(DELHI_HUBS[0].id);
  const [donorNotes, setDonorNotes] = useState("");
  const [donorLoading, setDonorLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  // Volunteer stats & trust states
  const [volunteerTrustScore, setVolunteerTrustScore] = useState(85);
  const [isSuspended, setIsSuspended] = useState(false);

  // Tab 3: Architecture Node States
  const [selectedArchNode, setSelectedArchNode] = useState(architectureNodes[0]);

  // General state triggers
  const [activeMapPin, setActiveMapPin] = useState<any>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachHistory, coachLoading]);

  // Dynamic Metrics derived from simulated state
  const metrics = useMemo(() => {
    const totalDistributed = ngos.reduce((acc, curr) => acc + curr.mealsReceived, 0);
    const pendingCount = donations.filter(d => d.status === "pending").length;
    const claimedCount = donations.filter(d => d.status === "claimed").length;
    
    // Fake analytics charts data based on state sizes
    const mealsOverTime = [
      { day: "Mon", meals: totalDistributed - 60 },
      { day: "Tue", meals: totalDistributed - 45 },
      { day: "Wed", meals: totalDistributed - 30 },
      { day: "Thu", meals: totalDistributed - 15 },
      { day: "Fri", meals: totalDistributed }
    ];

    const fraudCategories = [
      { name: "Clean Request", value: donations.filter(d => d.status !== "flagged").length },
      { name: "Flagged Suspicious", value: donations.filter(d => d.status === "flagged").length + (isSuspended ? 1 : 0) }
    ];

    return {
      totalDistributed,
      pendingCount,
      claimedCount,
      mealsOverTime,
      fraudCategories
    };
  }, [donations, ngos, isSuspended]);

  // Search volumes filter
  const filteredVolumes = useMemo(() => {
    if (!searchVolumeQuery) return volumesData;
    return volumesData.filter(v =>
      v.title.toLowerCase().includes(searchVolumeQuery.toLowerCase()) ||
      v.summary.toLowerCase().includes(searchVolumeQuery.toLowerCase()) ||
      v.sections.some(s => s.heading.toLowerCase().includes(searchVolumeQuery.toLowerCase()) || s.content.toLowerCase().includes(searchVolumeQuery.toLowerCase()))
    );
  }, [searchVolumeQuery]);

  // Active deep chapters for selected volume
  const activeChapters = useMemo(() => {
    if (selectedVolume.id === "v00") return volume00Chapters;
    if (selectedVolume.id === "v01") return volume01Chapters;
    if (selectedVolume.id === "v02") return volume02Chapters;
    if (selectedVolume.id === "v03") return volume03Chapters;
    if (selectedVolume.id === "v04") return volume04Chapters;
    if (selectedVolume.id === "v04a") return volume04aChapters;
    return null;
  }, [selectedVolume.id]);

  // Reset chapter selection when switching volumes
  useEffect(() => {
    setV00ActiveChapterIdx(0);
  }, [selectedVolume.id]);

  // --- Handlers & API integration ---

  // Handle Strategy Coach Q&A
  const handleAskCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim() || coachLoading) return;

    const userMsg = coachInput;
    setCoachInput("");
    setCoachHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setCoachLoading(true);

    try {
      const historyPayload = coachHistory.map(h => ({
        role: h.role === "coach" ? "model" : "user",
        text: h.text
      }));

      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, chatHistory: historyPayload })
      });

      const data = await res.json();
      if (data.reply) {
        setCoachHistory(prev => [...prev, { role: "coach", text: data.reply }]);
      } else if (data.error) {
        setCoachHistory(prev => [...prev, { role: "coach", text: `Error: ${data.error}` }]);
      }
    } catch (error: any) {
      console.error(error);
      setCoachHistory(prev => [
        ...prev,
        { role: "coach", text: "Offline Strategy Simulator: The AI Platform Coach recommends prioritizing Delhi-NCR due to weddings. Please check your secrets configurations for full integration." }
      ]);
    } finally {
      setCoachLoading(false);
    }
  };

  // Pre-packaged Q&A trigger
  const triggerSuggestedQuestion = (question: string) => {
    setCoachInput(question);
  };

  // Submit Donation from Donor
  const handleDonorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || donorLoading) return;

    setDonorLoading(true);
    setEvaluationResult(null);

    const selectedHub = DELHI_HUBS.find(h => h.id === pickupHubId) || DELHI_HUBS[0];
    const newDonationId = `don-${Date.now().toString().slice(-4)}`;

    const donationPayload = {
      donorName,
      foodType,
      servings,
      freshnessHours,
      address: selectedHub.name,
      lat: selectedHub.lat,
      lon: selectedHub.lon,
      notes: donorNotes
    };

    try {
      // Direct call to our AI Fraud Gate in the server
      const res = await fetch("/api/evaluate-donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donationPayload)
      });

      const auditResult = await res.json();
      setEvaluationResult(auditResult);

      const status: DonationStatus = auditResult.action === "MANUAL_REVIEW_FLAGGED" ? "flagged" : "pending";

      const newDonation: Donation = {
        id: newDonationId,
        donorName,
        foodType,
        servings,
        freshnessHours,
        address: selectedHub.name,
        lat: selectedHub.lat,
        lon: selectedHub.lon,
        timestamp: new Date().toISOString(),
        status,
        notes: donorNotes
      };

      setDonations(prev => [newDonation, ...prev]);

      // Add to System Logs
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          category: "AI",
          message: `AI Gate [${auditResult.category.toUpperCase()}]: Risk rating ${auditResult.riskScore}%. Action: ${auditResult.action}. Verdict: ${auditResult.assessment}`,
          status: status === "flagged" ? "danger" : "ok"
        },
        {
          id: `log-don-${Date.now()}`,
          timestamp: new Date().toISOString(),
          category: "Donation",
          message: `Donation ${newDonationId} reported at ${selectedHub.name} (${servings} servings)`,
          status: status === "flagged" ? "warning" : "ok"
        },
        ...prev
      ]);

      // Reset Donor Form on success
      if (status !== "flagged") {
        setDonorName("");
        setDonorNotes("");
        setServings(50);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackDonation: Donation = {
        id: newDonationId,
        donorName,
        foodType,
        servings,
        freshnessHours,
        address: selectedHub.name,
        lat: selectedHub.lat,
        lon: selectedHub.lon,
        timestamp: new Date().toISOString(),
        status: "pending",
        notes: donorNotes
      };
      setDonations(prev => [fallbackDonation, ...prev]);
    } finally {
      setDonorLoading(false);
    }
  };

  // Claim Donation by Volunteer
  const claimDonation = (donationId: string) => {
    if (isSuspended) return;

    // Pick a random NGO to route to
    const randomNgo = ngos[Math.floor(Math.random() * ngos.length)];

    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: "claimed" } : d))
    );

    const targetDonation = donations.find(d => d.id === donationId);
    if (!targetDonation) return;

    const newTask: VolunteerTask = {
      id: `task-${Date.now().toString().slice(-4)}`,
      donationId,
      donation: { ...targetDonation, status: "claimed" },
      volunteerName: "Simulated User",
      status: "claimed",
      ngoId: randomNgo.id,
      ngoName: randomNgo.name,
      riskScore: 0,
      timestamp: new Date().toISOString(),
      distanceMetres: 2400,
      progress: 50
    };

    setTasks(prev => [newTask, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Ops",
        message: `Volunteer claimed donation ${donationId}. Routing towards ${randomNgo.name}`,
        status: "ok"
      },
      ...prev
    ]);
  };

  // Complete & Verify Delivery (Gated by Volume 10 Verification Mechanics)
  const submitVerificationProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToComplete) return;

    const activeTask = tasks.find(t => t.id === selectedTaskToComplete);
    if (!activeTask) return;

    // Evaluate risks based on simulation settings
    let finalRisk = 5;
    let comments = "Verification Success. Photo matching neural edge indicators. Coordinate matches registered target.";
    let statusOutcome: TaskStatus = "delivered";

    if (simulatedPhotoType === "spoiled") {
      finalRisk += 45;
      comments = "WARNING: Image analysis models detected structural anomaly (potential biological spoilage/unhygienic pack).";
    } else if (simulatedPhotoType === "blank") {
      finalRisk += 30;
      comments = "WARNING: Blank or extremely low resolution image detected.";
    }

    if (simulatedGpsType === "spoof") {
      finalRisk += 50;
      comments += " CRITICAL: Volunteer coordinates are 1.4km outside target geofence constraint.";
    }

    if (!isQrVerified) {
      finalRisk += 25;
      comments += " WARNING: Pickup completed without secure QR cryptographic confirmation.";
    } else if (qrScanResult === "invalid") {
      finalRisk += 40;
      comments += " CRITICAL: Decoded QR signature mismatch. Possible duplicate or tampered donor token.";
    }

    const isFlagged = finalRisk >= 45;
    statusOutcome = isFlagged ? "flagged" : "delivered";

    // Adjust volunteer trust scores
    let trustImpact = 2;
    setVolunteerTrustScore(prev => {
      let nextScore = prev;
      if (isFlagged) {
        nextScore = Math.max(0, prev - 25);
        trustImpact = -25;
      } else {
        nextScore = Math.min(100, prev + 2);
        trustImpact = 2;
      }
      if (nextScore < 40) {
        setIsSuspended(true);
      }
      return nextScore;
    });

    // Update Tasks
    setTasks(prev =>
      prev.map(t =>
        t.id === selectedTaskToComplete
          ? {
              ...t,
              status: statusOutcome,
              riskScore: finalRisk,
              riskReason: comments,
              progress: 100
            }
          : t
      )
    );

    // Update original donation status
    setDonations(prev =>
      prev.map(d =>
        d.id === activeTask.donationId
          ? { ...d, status: isFlagged ? "flagged" : "delivered" }
          : d
      )
    );

    // If successful, update NGO meals received
    if (!isFlagged) {
      setNgos(prev =>
        prev.map(n =>
          n.id === activeTask.ngoId
            ? { ...n, mealsReceived: n.mealsReceived + activeTask.donation.servings }
            : n
        )
      );
    }

    setAuditLogs(prev => [
      {
        id: `log-eval-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "AI",
        message: `Proof Evaluated: Risk ${finalRisk}%. Outcome: ${statusOutcome.toUpperCase()}. Trust Impact: ${trustImpact > 0 ? "+" : ""}${trustImpact}. Detail: ${comments}`,
        status: isFlagged ? "danger" : "ok"
      },
      ...prev
    ]);

    // Reset selection
    setSelectedTaskToComplete("");
  };

  // Admin Override Flagged Donation
  const approveFlaggedDonation = (donationId: string) => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: "pending" } : d))
    );

    setAuditLogs(prev => [
      {
        id: `log-override-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Security",
        message: `Admin Override: Force approved flagged donation ${donationId}. Resetting to pending pool.`,
        status: "warning"
      },
      ...prev
    ]);
  };

  // Force reinstate suspended volunteer
  const reinstateVolunteer = () => {
    setVolunteerTrustScore(80);
    setIsSuspended(false);
    setAuditLogs(prev => [
      {
        id: `log-reinstate-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: "Security",
        message: "Admin Action: Volunteer account reinstated. Trust reset to 80/100.",
        status: "ok"
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Dynamic Header */}
      <header className="border-b border-[#F1ECE4] bg-[#FCFAF5] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-600">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  PLATFORM CORE V1.0
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  AI RISK GATE ACTIVE
                </span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                🇮🇳 Project SETU — Human Assistance Platform
              </h1>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex bg-[#F3ECE0] p-1 rounded-xl border border-[#E9E1D5] self-start md:self-center">
            <button
              id="nav-bible"
              onClick={() => setActiveTab("bible")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "bible"
                  ? "bg-white text-amber-800 shadow-xs border border-amber-200/50"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              <FileText className="h-4 w-4" />
              Engineering Bible
            </button>
            <button
              id="nav-sandbox"
              onClick={() => setActiveTab("sandbox")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "sandbox"
                  ? "bg-white text-amber-800 shadow-xs border border-amber-200/50"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              <Compass className="h-4 w-4" />
              Operations Sandbox
            </button>
            <button
              id="nav-prototype"
              onClick={() => setActiveTab("prototype")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "prototype"
                  ? "bg-white text-amber-800 shadow-xs border border-amber-200/50"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Interactive Prototype
            </button>
            <button
              id="nav-architecture"
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "architecture"
                  ? "bg-white text-amber-800 shadow-xs border border-amber-200/50"
                  : "text-gray-600 hover:text-gray-950"
              }`}
            >
              <Cpu className="h-4 w-4" />
              System Architecture
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ENGINEERING BIBLE */}
          {activeTab === "bible" && (
            <motion.div
              key="bible-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left sidebar: Volume Selection */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[#F1ECE4] p-4 flex flex-col h-[750px] overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Startup Volume Ledger</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Explore the 18-volume Project SETU (v2.0) ledger.</p>
                  
                  {/* Search bar */}
                  <div className="relative mt-3">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search across volumes..."
                      value={searchVolumeQuery}
                      onChange={(e) => setSearchVolumeQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-800"
                    />
                  </div>
                </div>

                {/* Volumes Scroll Container */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredVolumes.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400 bg-[#FAF8F5] rounded-xl border border-dashed border-[#E9E1D5]">
                      No volumes match your search.
                    </div>
                  ) : (
                    filteredVolumes.map((vol) => {
                      const IconComponent = iconMap[vol.icon] || FileText;
                      const isSelected = selectedVolume.id === vol.id;
                      return (
                        <button
                          key={vol.id}
                          onClick={() => setSelectedVolume(vol)}
                          className={`w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all duration-200 border ${
                            isSelected
                              ? "bg-amber-50/75 border-amber-300 text-amber-950"
                              : "bg-[#FAFAF9] border-transparent hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isSelected ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600">
                                Vol {vol.num}
                              </span>
                              {isSelected && (
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                              )}
                            </div>
                            <h4 className="text-xs font-semibold truncate mt-0.5">{vol.title}</h4>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{vol.summary}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Center: Volume Details Panel */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F1ECE4] p-6 h-[750px] flex flex-col overflow-hidden">
                <div className="flex items-start justify-between border-b border-[#F1ECE4] pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                      {(() => {
                        const IconComponent = iconMap[selectedVolume.icon] || FileText;
                        return <IconComponent className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                        VOLUME {selectedVolume.num}
                      </span>
                      <h2 className="text-base font-bold text-gray-900 mt-0.5">{selectedVolume.title}</h2>
                    </div>
                  </div>
                </div>

                {/* Scrollable volume pages or Chapter Deep Dive */}
                {activeChapters ? (
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Horizontal Chapter Navigation Pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#F1ECE4]">
                      {activeChapters.map((ch, idx) => {
                        const isChapterSelected = v00ActiveChapterIdx === idx;
                        const isSignedOff = signedOffChapters[ch.id];
                        return (
                          <button
                            key={ch.id}
                            id={`ch-btn-${ch.id}`}
                            onClick={() => setV00ActiveChapterIdx(idx)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl whitespace-nowrap transition-all border cursor-pointer ${
                              isChapterSelected
                                ? "bg-amber-600 border-amber-600 text-white shadow-xs"
                                : "bg-[#FAF8F5] border-[#E9E1D5] text-gray-600 hover:text-gray-950"
                            }`}
                          >
                            <span>Ch {ch.chapterNumber}</span>
                            {isSignedOff && (
                              <span className={`h-1.5 w-1.5 rounded-full ${isChapterSelected ? "bg-white" : "bg-emerald-500"}`}></span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Chapter Content (scrollable container) */}
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-6">
                      {(() => {
                        const safeIdx = v00ActiveChapterIdx < activeChapters.length ? v00ActiveChapterIdx : 0;
                        const activeChapter = activeChapters[safeIdx];
                        if (!activeChapter) return null;
                        const comments = chapterFeedbackList[activeChapter.id] || [];
                        const isSignedOff = signedOffChapters[activeChapter.id];
                        return (
                          <div className="space-y-5">
                            {/* Chapter Title Header */}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                  Chapter {activeChapter.chapterNumber}
                                </span>
                                {isSignedOff ? (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Approved
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                                    Drafting Review
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-gray-950 mt-2 leading-snug">
                                {activeChapter.title}
                              </h3>
                              <p className="text-xs text-gray-500 italic mt-1 leading-relaxed">
                                {activeChapter.summary}
                              </p>
                            </div>

                            {/* Chapter Sections */}
                            {activeChapter.sections.map((sec, sIdx) => (
                              <div key={sIdx} className="space-y-3 pt-2 border-t border-[#F1ECE4]/40 first:border-0 first:pt-0">
                                <h4 className="text-xs font-bold text-gray-900 border-l-2 border-amber-500 pl-2">
                                  {sec.subheading}
                                </h4>
                                
                                {sec.paragraphs.map((para, pIdx) => (
                                  <p key={pIdx} className="text-xs text-gray-600 leading-relaxed text-justify">
                                    {para}
                                  </p>
                                ))}

                                {/* Optional Key Metrics Table */}
                                {sec.keyMetrics && sec.keyMetrics.length > 0 && (
                                  <div className="bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl overflow-hidden mt-2">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-[#F1ECE4]/40 border-b border-[#E9E1D5]">
                                          <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Metric Indicator</th>
                                          <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Value</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sec.keyMetrics.map((met, mIdx) => (
                                          <tr key={mIdx} className="border-b border-[#F1ECE4]/40 last:border-0">
                                            <td className="px-3 py-1.5 text-xs text-gray-700 font-medium">
                                              {met.label}
                                              {met.source && (
                                                <span className="block text-[9px] text-gray-400 font-normal">Source: {met.source}</span>
                                              )}
                                            </td>
                                            <td className="px-3 py-1.5 text-xs font-bold text-amber-700 text-right font-mono">
                                              {met.value}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}

                                {/* Optional Bullet Points */}
                                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                                  <ul className="space-y-1.5 pl-4 list-disc mt-2">
                                    {sec.bulletPoints.map((bp, bIdx) => {
                                      const parts = bp.split(":");
                                      return (
                                        <li key={bIdx} className="text-xs text-gray-600 leading-relaxed">
                                          {parts.length > 1 ? (
                                            <>
                                              <strong className="text-gray-800">{parts[0]}:</strong>
                                              {parts.slice(1).join(":")}
                                            </>
                                          ) : (
                                            bp
                                          )}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}

                                {/* Optional Callout Box */}
                                {sec.callout && (
                                  <div className="p-3 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-xl text-xs text-amber-950 leading-relaxed mt-2 font-medium">
                                    {sec.callout}
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Co-founder sign-off & review interactive section */}
                            <div className="pt-4 border-t border-[#F1ECE4] space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                                <Shield className="h-4 w-4 text-amber-700" />
                                Startup Review & Sign-off Panel
                              </h4>

                              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E9E1D5]">
                                <div>
                                  <p className="text-[11px] font-bold text-gray-800">Co-founder Sign-off Status</p>
                                  <p className="text-[10px] text-gray-500 mt-0.5">Seal this chapter as verified for the platform strategy deck.</p>
                                </div>
                                <button
                                  id="btn-signoff-chapter"
                                  onClick={() => {
                                    const nextSigned = !isSignedOff;
                                    setSignedOffChapters(prev => ({ ...prev, [activeChapter.id]: nextSigned }));
                                    
                                    // Add to audit logs
                                    setAuditLogs(prev => [
                                      {
                                        id: `log-signoff-${Date.now()}`,
                                        timestamp: new Date().toISOString(),
                                        category: "Security",
                                        message: nextSigned 
                                          ? `Co-founder APPROVED and sealed Volume ${selectedVolume.num} - Chapter ${activeChapter.chapterNumber} ("${activeChapter.title}") into startup ledger.`
                                          : `Co-founder REVOKED sign-off on Volume ${selectedVolume.num} - Chapter ${activeChapter.chapterNumber}. Returned to drafting mode.`,
                                        status: nextSigned ? "ok" : "warning"
                                      },
                                      ...prev
                                    ]);
                                  }}
                                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isSignedOff
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                      : "bg-amber-600 hover:bg-amber-700 text-white"
                                  }`}
                                >
                                  {isSignedOff ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" />
                                      Signed-off & Active
                                    </>
                                  ) : (
                                    <>
                                      <span>Sign-off Draft</span>
                                    </>
                                  )}
                                </button>
                                                            {/* Collaborative Discussion Comments Timeline */}
                              <div className="space-y-3 bg-[#FCFAFB] p-4 rounded-xl border border-[#F1ECE4]/50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Chapter Collaborative Notes ({comments.length})</span>
                                
                                {comments.length === 0 ? (
                                  <p className="text-[11px] text-gray-400 italic">No notes added yet for this chapter. Share your suggestions below.</p>
                                ) : (
                                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                                    {comments.map((comment, cIdx) => (
                                      <div key={cIdx} className="text-[11px] bg-white border border-[#F1ECE4]/40 p-2.5 rounded-lg shadow-2xs">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-bold text-gray-800">{comment.author}</span>
                                          <span className="text-[9px] text-gray-400">{comment.date}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{comment.text}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Add comment input */}
                                <div className="flex gap-2 mt-2">
                                  <input
                                    type="text"
                                    id="input-chapter-comment"
                                    value={chapterCommentInput}
                                    onChange={(e) => setChapterCommentInput(e.target.value)}
                                    placeholder="Add co-founder suggestion, edit request, or validation note..."
                                    className="flex-1 px-3 py-1.5 text-[11px] bg-white border border-[#E9E1D5] rounded-lg focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none text-gray-800"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && chapterCommentInput.trim()) {
                                        e.preventDefault();
                                        const newComment = {
                                          author: "Co-founder (Reviewer)",
                                          text: chapterCommentInput.trim(),
                                          date: new Date().toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true
                                          })
                                        };

                                        setChapterFeedbackList(prev => ({
                                          ...prev,
                                          [activeChapter.id]: [...(prev[activeChapter.id] || []), newComment]
                                        }));

                                        setAuditLogs(prev => [
                                          {
                                            id: `log-comment-${Date.now()}`,
                                            timestamp: new Date().toISOString(),
                                            category: "Ops",
                                            message: `Added new collaborative review note on Volume ${selectedVolume.num}, Chapter ${activeChapter.chapterNumber}.`,
                                            status: "ok"
                                          },
                                          ...prev
                                        ]);

                                        setChapterCommentInput("");
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    id="btn-add-chapter-comment"
                                    onClick={() => {
                                      if (!chapterCommentInput.trim()) return;
                                      const newComment = {
                                        author: "Co-founder (Reviewer)",
                                        text: chapterCommentInput.trim(),
                                        date: new Date().toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true
                                        })
                                      };

                                      setChapterFeedbackList(prev => ({
                                        ...prev,
                                        [activeChapter.id]: [...(prev[activeChapter.id] || []), newComment]
                                      }));

                                      setAuditLogs(prev => [
                                        {
                                          id: `log-comment-${Date.now()}`,
                                          timestamp: new Date().toISOString(),
                                          category: "Ops",
                                          message: `Added new collaborative review note on Volume ${selectedVolume.num}, Chapter ${activeChapter.chapterNumber}.`,
                                          status: "ok"
                                        },
                                        ...prev
                                      ]);

                                      setChapterCommentInput("");
                                    }}
                                    disabled={!chapterCommentInput.trim()}
                                    className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-[11px] font-bold rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer"
                                  >
                                    Add Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>  </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {/* Executive Abstract Card */}
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/50">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        Executive Abstract
                      </h4>
                      <p className="text-xs text-amber-950 leading-relaxed mt-1.5">
                        {selectedVolume.summary}
                      </p>
                    </div>

                    {/* Sections list */}
                    {selectedVolume.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-900 border-l-2 border-amber-500 pl-2">
                          {sec.heading}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-[#FAF9F6] p-3 rounded-xl border border-[#F1ECE4]/50">
                          {sec.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Sidebar: AI Strategy Coach */}
              <div className="lg:col-span-3 bg-white rounded-2xl border border-[#F1ECE4] p-4 h-[750px] flex flex-col justify-between overflow-hidden shadow-xs">
                
                <div className="border-b border-[#F1ECE4] pb-3 mb-3">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Sparkles className="h-4.5 w-4.5" />
                    <h3 className="text-xs font-bold uppercase tracking-widest">AI Platform Coach</h3>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">Query the Startup Bible for strategic & ops advice.</p>
                </div>

                {/* Chat window */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-xs custom-scrollbar">
                  {coachHistory.map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col max-w-[90%] rounded-xl p-3 ${
                        h.role === "user"
                          ? "bg-amber-600 text-white self-end ml-auto"
                          : "bg-gray-100 text-gray-800 self-start"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase opacity-75 mb-1">
                        {h.role === "user" ? "You" : "AI Coach"}
                      </span>
                      <p className="leading-relaxed whitespace-pre-line">{h.text}</p>
                    </div>
                  ))}
                  {coachLoading && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl self-start">
                      <RefreshCw className="h-3.5 w-3.5 text-amber-600 animate-spin" />
                      <span className="text-[11px] text-gray-500">Formulating platform strategy...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Suggested prompts helper */}
                <div className="mb-3 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Suggested Questions:</span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => triggerSuggestedQuestion("Explain the triple-gated fraud check under Volume 08.")}
                      className="text-[10px] text-left text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md max-w-full truncate cursor-pointer"
                    >
                      Explain Vol 08 Fraud Detection
                    </button>
                    <button
                      onClick={() => triggerSuggestedQuestion("Why was Delhi-NCR selected as the pilot city in Volume 15?")}
                      className="text-[10px] text-left text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md max-w-full truncate cursor-pointer"
                    >
                      Why Delhi Pilot?
                    </button>
                    <button
                      onClick={() => triggerSuggestedQuestion("What are the unit economics per meal detailed in Volume 12?")}
                      className="text-[10px] text-left text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md max-w-full truncate cursor-pointer"
                    >
                      Explain Meal Economics (₹15)
                    </button>
                  </div>
                </div>

                {/* Input form */}
                <form onSubmit={handleAskCoach} className="flex gap-2">
                  <input
                    type="text"
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    placeholder="Ask Strategy Coach..."
                    className="flex-1 px-3 py-2 text-xs bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={coachLoading || !coachInput.trim()}
                    className="p-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl transition-colors duration-150"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

              </div>
            </motion.div>
          )}

          {/* TAB 2: OPERATIONAL SANDBOX */}
          {activeTab === "sandbox" && (
            <motion.div
              key="sandbox-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              
              {/* Sandbox Header Controllers */}
              <div className="bg-white rounded-2xl border border-[#F1ECE4] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">National Operations Simulation sandbox</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Step into the roles of Donors, Volunteers, NGOs, or Admin to live-test our core engines.</p>
                </div>
                
                {/* Role Switcher */}
                <div className="flex bg-[#F3ECE0] p-1 rounded-xl border border-[#E9E1D5] self-start md:self-center">
                  <button
                    onClick={() => setSandboxRole("donor")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      sandboxRole === "donor" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
                    }`}
                  >
                    <Building className="h-3.5 w-3.5" />
                    Donor
                  </button>
                  <button
                    onClick={() => setSandboxRole("volunteer")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      sandboxRole === "volunteer" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
                    }`}
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Volunteer
                  </button>
                  <button
                    onClick={() => setSandboxRole("ngo")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      sandboxRole === "ngo" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
                    }`}
                  >
                    <Heart className="h-3.5 w-3.5" />
                    NGO Center
                  </button>
                  <button
                    onClick={() => setSandboxRole("admin")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      sandboxRole === "admin" ? "bg-white text-amber-800 shadow-xs" : "text-gray-600 hover:text-gray-950"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Admin Command
                  </button>
                </div>
              </div>

              {/* Layout: Interactive Delhi Router Map + Role Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left pane: Custom SVG Map of Delhi Router */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-[#F1ECE4] p-5 flex flex-col min-h-[500px] h-[550px]">
                  <div className="flex justify-between items-center border-b border-[#F1ECE4] pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Map className="h-4.5 w-4.5 text-amber-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Delhi Operations Map Router</h3>
                    </div>
                    <span className="text-[10px] text-gray-500 italic">Delhi-NCR Pilot Area</span>
                  </div>

                  {/* SVG Map Screen */}
                  <div className="flex-1 bg-amber-50/25 border border-amber-200/40 rounded-xl relative overflow-hidden flex items-center justify-center">
                    
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 450 350"
                      className="absolute inset-0 select-none"
                    >
                      {/* Grid background lines */}
                      <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#F1ECE4" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Schematic Transit Route Connections */}
                      {donations.map((don) => {
                        const targetNgo = ngos[0]; // Delhi Seva Ashram
                        const donHub = DELHI_HUBS.find(h => h.name === don.address);
                        if (!donHub) return null;
                        
                        return (
                          <line
                            key={`route-${don.id}`}
                            x1={donHub.x}
                            y1={donHub.y}
                            x2={targetNgo.lat === 28.5670 ? 240 : 200} // Simple mapping index
                            y2={targetNgo.lon === 77.2185 ? 240 : 200}
                            stroke={don.status === "claimed" ? "#3B82F6" : don.status === "flagged" ? "#EF4444" : "#F59E0B"}
                            strokeWidth="1.5"
                            strokeDasharray={don.status === "claimed" ? "4 4" : "1 0"}
                            className="opacity-40"
                          />
                        );
                      })}

                      {/* Map Pins */}
                      {DELHI_HUBS.map((hub) => {
                        const isNgoPoint = ngos.some(n => n.lat === hub.lat && n.lon === hub.lon);
                        const hasDonation = donations.find(d => d.address === hub.name);
                        
                        let fillCol = "#9CA3AF"; // Standard gray
                        if (isNgoPoint) fillCol = "#10B981"; // Emerald Green for NGO
                        else if (hasDonation) {
                          if (hasDonation.status === "flagged") fillCol = "#EF4444"; // Red for Flagged
                          else if (hasDonation.status === "claimed") fillCol = "#3B82F6"; // Blue for claimed
                          else fillCol = "#F59E0B"; // Saffron for fresh pending
                        }

                        return (
                          <g
                            key={hub.id}
                            className="cursor-pointer group"
                            onClick={() => setActiveMapPin(hub)}
                          >
                            {/* Hover halo ring */}
                            <circle
                              cx={hub.x}
                              cy={hub.y}
                              r="15"
                              fill={fillCol}
                              className="opacity-0 group-hover:opacity-15 transition-opacity duration-200"
                            />
                            {/* Target Center */}
                            <circle
                              cx={hub.x}
                              cy={hub.y}
                              r={isNgoPoint || hasDonation ? "8" : "5"}
                              fill={fillCol}
                              stroke="#FFF"
                              strokeWidth="1.5"
                              className="transition-all duration-300"
                            />
                            {/* Text labeling */}
                            <text
                              x={hub.x}
                              y={hub.y - 12}
                              textAnchor="middle"
                              fill="#4B5563"
                              fontSize="9"
                              fontWeight="600"
                              className="pointer-events-none drop-shadow-sm select-none"
                            >
                              {hub.name.split(" ")[0]}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Left overlay: Active Map Pin Diagnostics Card */}
                    {activeMapPin && (
                      <div className="absolute bottom-3 left-3 right-3 bg-white p-3 rounded-xl border border-[#F1ECE4] shadow-md flex items-start justify-between">
                        <div className="text-xs">
                          <h4 className="font-bold text-gray-900 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-amber-600" />
                            {activeMapPin.name}
                          </h4>
                          <div className="mt-1 text-gray-500 space-y-0.5">
                            <p>Lat: {activeMapPin.lat.toFixed(4)} | Lon: {activeMapPin.lon.toFixed(4)}</p>
                            {(() => {
                              const associatedNgo = ngos.find(n => n.lat === activeMapPin.lat);
                              const associatedDon = donations.find(d => d.address === activeMapPin.name);
                              
                              if (associatedNgo) {
                                return (
                                  <p className="text-emerald-700 font-medium">
                                    🏥 NGO Center: {associatedNgo.name} (Served: {associatedNgo.mealsReceived} meals)
                                  </p>
                                );
                              }
                              if (associatedDon) {
                                return (
                                  <div className="mt-1.5 p-1 px-2 rounded bg-amber-50 text-amber-950 font-medium">
                                    🍛 Food Surplus: {associatedDon.servings} Servings ({associatedDon.foodType.toUpperCase()})
                                    <p className="text-[10px] text-gray-400">Status: {associatedDon.status.toUpperCase()}</p>
                                  </div>
                                );
                              }
                              return <p>Status: No active alerts on this coordinate.</p>;
                            })()}
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveMapPin(null)}
                          className="text-gray-400 hover:text-gray-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bottom Map Legend */}
                  <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-gray-500 justify-center">
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>🏥 Active NGO</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span>🍛 Surplus Food Reported</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500"></span>🛵 Claimed in Transit</span>
                    <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500"></span>⚠️ Suspicious/Fraud Alert</span>
                  </div>

                </div>

                {/* Right pane: Roles Operations Interface */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-[#F1ECE4] p-5 h-[550px] flex flex-col justify-between overflow-y-auto custom-scrollbar">
                  
                  {/* DONOR PORTAL VIEW */}
                  {sandboxRole === "donor" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#F1ECE4] pb-3">
                        <Building className="h-5 w-5 text-amber-600" />
                        <h3 className="text-sm font-bold text-gray-900">Surplus Sourcing Portal (Donor)</h3>
                      </div>

                      <form onSubmit={handleDonorSubmit} className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase">Donor Name / Banquet Outlet</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Radisson Blu Caterers"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                            className="w-full mt-1 px-3 py-2 bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase">Food Type Indicator</label>
                            <div className="flex gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => setFoodType("veg")}
                                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                                  foodType === "veg"
                                    ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                                    : "bg-white border-gray-200 text-gray-600"
                                }`}
                              >
                                Veg (Emerald Green)
                              </button>
                              <button
                                type="button"
                                onClick={() => setFoodType("non-veg")}
                                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                                  foodType === "non-veg"
                                    ? "bg-red-50 border-red-400 text-red-800"
                                    : "bg-white border-gray-200 text-gray-600"
                                }`}
                              >
                                Non-Veg (Red)
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase">Pickup Location</label>
                            <select
                              value={pickupHubId}
                              onChange={(e) => setPickupHubId(e.target.value)}
                              className="w-full mt-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl outline-none"
                            >
                              {DELHI_HUBS.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase">Servings ({servings})</label>
                            <input
                              type="range"
                              min="10"
                              max="1000"
                              step="10"
                              value={servings}
                              onChange={(e) => setServings(Number(e.target.value))}
                              className="w-full mt-2 accent-amber-600"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Simulate huge quantities (e.g. &gt;800) to trigger AI alert.</p>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase">Freshness Window ({freshnessHours} hrs)</label>
                            <input
                              type="range"
                              min="2"
                              max="24"
                              value={freshnessHours}
                              onChange={(e) => setFreshnessHours(Number(e.target.value))}
                              className="w-full mt-2 accent-amber-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase">Food Description / Notes</label>
                          <textarea
                            placeholder="Describe freshness, storage conditions, packaging..."
                            value={donorNotes}
                            onChange={(e) => setDonorNotes(e.target.value)}
                            className="w-full mt-1 p-2 h-16 bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl outline-none resize-none"
                          />
                          <p className="text-[10px] text-gray-400 mt-0.5">Tip: Write garbage phrases to test NLP Duplicate & Spam engine.</p>
                        </div>

                        <button
                          type="submit"
                          disabled={donorLoading}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all duration-150 flex items-center justify-center gap-2"
                        >
                          {donorLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Running Private AI Fraud Evaluation...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Submit Surplus to Platform
                            </>
                          )}
                        </button>
                      </form>

                      {evaluationResult && (
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-[11px] space-y-1">
                          <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            AI Risk Gate Assessment Result:
                          </h4>
                          <p><strong>Action:</strong> <span className={evaluationResult.action === "APPROVED" ? "text-emerald-700 font-bold" : "text-red-700 font-bold"}>{evaluationResult.action}</span></p>
                          <p><strong>Risk Rating:</strong> {evaluationResult.riskScore}% ({evaluationResult.category.toUpperCase()})</p>
                          <p className="text-gray-600"><strong>Verdict:</strong> {evaluationResult.assessment}</p>
                        </div>
                      )}

                    </div>
                  )}

                  {/* VOLUNTEER PORTAL VIEW */}
                  {sandboxRole === "volunteer" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F1ECE4] pb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-amber-600" />
                          <h3 className="text-sm font-bold text-gray-900">Logistics & Proof Verification (Volunteer)</h3>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isSuspended ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}>
                            Trust: {volunteerTrustScore}/100 {isSuspended ? "(Suspended)" : ""}
                          </span>
                        </div>
                      </div>

                      {isSuspended ? (
                        <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-xs text-red-950 space-y-3">
                          <h4 className="font-bold flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            Account Suspended
                          </h4>
                          <p>Your Trust Score has fallen below the 40 limit mandated by Volume 10 guidelines due to suspicious GPS or image validation checks.</p>
                          <button
                            onClick={reinstateVolunteer}
                            className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg transition-colors"
                          >
                            Admin Override: Reinstate Account
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 text-xs">
                          {/* Part A: Claimable Tasks */}
                          <div>
                            <h4 className="font-semibold text-gray-500 uppercase text-[10px] mb-2">Available Food Sourcing Tasks</h4>
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                              {donations.filter(d => d.status === "pending").length === 0 ? (
                                <p className="text-gray-400 text-[11px] text-center italic py-4">No unassigned food pools reported near CP or Okhla.</p>
                              ) : (
                                donations.filter(d => d.status === "pending").map(d => (
                                  <div key={d.id} className="p-3 bg-[#FAF8F5] border border-[#E9E1D5] rounded-xl flex justify-between items-center">
                                    <div>
                                      <p className="font-bold text-gray-900">{d.donorName}</p>
                                      <p className="text-[10px] text-gray-400">{d.address} • {d.servings} Servings ({d.foodType.toUpperCase()})</p>
                                    </div>
                                    <button
                                      onClick={() => claimDonation(d.id)}
                                      className="px-3 py-1 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
                                    >
                                      Accept Route
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Part B: Active Tasks Verification Submission */}
                          <div>
                            <h4 className="font-semibold text-gray-500 uppercase text-[10px] mb-2">Active Shipments - Submit Proof Verification</h4>
                            {tasks.filter(t => t.status === "claimed").length === 0 ? (
                              <p className="text-gray-400 text-center italic py-4">You have no active routes. Claim a food task above.</p>
                            ) : (
                              <>
                                <form onSubmit={submitVerificationProof} className="bg-amber-50/25 border border-amber-200/40 p-3 rounded-xl space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase">Select Active Shipment</label>
                                  <select
                                    required
                                    value={selectedTaskToComplete}
                                    onChange={(e) => setSelectedTaskToComplete(e.target.value)}
                                    className="w-full mt-1 px-2 py-1.5 bg-white border border-[#E9E1D5] rounded-lg outline-none"
                                  >
                                    <option value="">-- Choose Task --</option>
                                    {tasks.filter(t => t.status === "claimed").map(t => (
                                      <option key={t.id} value={t.id}>
                                        {t.donation.donorName} ➔ {t.ngoName}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {selectedTaskToComplete && (
                                  <div className="p-3 bg-white border border-[#E9E1D5]/60 rounded-xl space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-gray-400 uppercase">Donor Handover Verification</span>
                                      {isQrVerified ? (
                                        <span className={`text-[10px] font-bold uppercase flex items-center gap-1 ${qrScanResult === "valid" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-red-700 bg-red-50 border border-red-200"} px-2 py-0.5 rounded-full`}>
                                          <Check className="h-3 w-3" /> {qrScanResult === "valid" ? "QR Verified" : "QR Mismatch"}
                                        </span>
                                      ) : (
                                        <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                          Awaiting QR Scan
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setIsScanningQr(true)}
                                        className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <QrCode className="h-4 w-4" />
                                        Scan Donor QR Code
                                      </button>
                                      {isQrVerified && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setIsQrVerified(false);
                                            setQrScanResult(null);
                                          }}
                                          className="px-2 py-2 text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 rounded-lg text-xs cursor-pointer"
                                          title="Reset QR"
                                        >
                                          Reset
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-gray-400">
                                      Scan the donor's digital handoff receipt to confirm pickup. Eliminates manual log spoofing.
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Simulate Photo Upload</label>
                                    <select
                                      value={simulatedPhotoType}
                                      onChange={(e) => setSimulatedPhotoType(e.target.value as any)}
                                      className="w-full mt-1 px-2 py-1.5 bg-white border border-[#E9E1D5] rounded-lg outline-none"
                                    >
                                      <option value="valid">Fresh Food Pack (Match)</option>
                                      <option value="spoiled">Spoiled / Molded Food (High Risk)</option>
                                      <option value="blank">Blank Image / Garbage (Warning)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase">Simulate Location Check</label>
                                    <select
                                      value={simulatedGpsType}
                                      onChange={(e) => setSimulatedGpsType(e.target.value as any)}
                                      className="w-full mt-1 px-2 py-1.5 bg-white border border-[#E9E1D5] rounded-lg outline-none"
                                    >
                                      <option value="match">Match GPS (Within 10m Geofence)</option>
                                      <option value="spoof">Spoof Location (1.4km Away - Risk Flag)</option>
                                    </select>
                                  </div>
                                </div>

                                <button
                                  type="submit"
                                  className="w-full py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700"
                                >
                                  Submit Proof Coordinates & Image
                                </button>
                              </form>

                              {/* QR Code Scanner Overlay Modal */}
                              <AnimatePresence>
                                {isScanningQr && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
                                  >
                                    <motion.div
                                      initial={{ scale: 0.95, y: 15 }}
                                      animate={{ scale: 1, y: 0 }}
                                      exit={{ scale: 0.95, y: 15 }}
                                      className="bg-white rounded-3xl border border-[#F1ECE4] shadow-xl max-w-sm w-full overflow-hidden p-5 space-y-4"
                                    >
                                      <div className="flex justify-between items-center border-b border-[#F1ECE4] pb-2">
                                        <div className="flex items-center gap-1.5">
                                          <QrCode className="h-5 w-5 text-amber-600 animate-pulse" />
                                          <h4 className="text-sm font-bold text-gray-900">SETU QR Handoff Scanner</h4>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => setIsScanningQr(false)}
                                          className="text-gray-400 hover:text-gray-900 cursor-pointer"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>

                                      {/* Scanning Viewport Simulation */}
                                      <div className="relative aspect-square w-full bg-gray-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-[#E9E1D5]">
                                        {/* Pulsing scanning beam */}
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500/70 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-[bounce_2s_infinite]" />
                                        
                                        {/* Targeting corner lines */}
                                        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-sm" />
                                        <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-sm" />
                                        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-sm" />
                                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-sm" />

                                        {/* Simulation Mock QR Image */}
                                        <div className="p-4 bg-white rounded-xl border-4 border-gray-900 shadow-lg scale-90">
                                          <div className="grid grid-cols-4 gap-1 w-24 h-24">
                                            <div className="bg-gray-950 col-span-2 row-span-2"></div>
                                            <div className="bg-gray-100"></div>
                                            <div className="bg-gray-950"></div>
                                            <div className="bg-gray-100"></div>
                                            <div className="bg-gray-950"></div>
                                            <div className="bg-gray-100"></div>
                                            <div className="bg-gray-950"></div>
                                            <div className="bg-gray-950 col-span-2 row-span-2"></div>
                                            <div className="bg-gray-100"></div>
                                            <div className="bg-gray-950"></div>
                                            <div className="bg-gray-100"></div>
                                            <div className="bg-gray-950"></div>
                                          </div>
                                        </div>

                                        {/* Camera simulation watermark */}
                                        <span className="absolute bottom-3 text-[10px] font-mono uppercase tracking-widest text-gray-500 bg-black/40 px-2 py-0.5 rounded-full">
                                          [ Camera Sim Active ]
                                        </span>
                                      </div>

                                      {/* QR Scan Actions */}
                                      <div className="space-y-3 text-xs">
                                        <div className="text-center">
                                          <p className="text-xs font-bold text-gray-800">
                                            {(() => {
                                              const tObj = tasks.find(t => t.id === selectedTaskToComplete);
                                              return tObj ? `Scanning: ${tObj.donation.donorName}` : "Confirming donor handoff";
                                            })()}
                                          </p>
                                          <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-relaxed">
                                            Simulate direct scanning or payload mismatch warnings for test scenarios.
                                          </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsQrVerified(true);
                                              setQrScanResult("valid");
                                              setIsScanningQr(false);
                                              
                                              // Log scan event
                                              setAuditLogs(prev => [
                                                {
                                                  id: `log-qr-${Date.now()}`,
                                                  timestamp: new Date().toISOString(),
                                                  category: "Ops",
                                                  message: `QR code scan SUCCESS: Cryptographic signature verified for task ${selectedTaskToComplete}.`,
                                                  status: "ok"
                                                },
                                                ...prev
                                              ]);
                                            }}
                                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                                          >
                                            Scan Valid QR
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsQrVerified(true);
                                              setQrScanResult("invalid");
                                              setIsScanningQr(false);

                                              // Log scan event
                                              setAuditLogs(prev => [
                                                {
                                                  id: `log-qr-${Date.now()}`,
                                                  timestamp: new Date().toISOString(),
                                                  category: "Security",
                                                  message: `QR code scan FAIL: Payload signature mismatch detected on task ${selectedTaskToComplete}.`,
                                                  status: "danger"
                                                },
                                                ...prev
                                              ]);
                                            }}
                                            className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                                          >
                                            Scan Invalid QR
                                          </button>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* NGO CONSOLE VIEW */}
                  {sandboxRole === "ngo" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#F1ECE4] pb-3">
                        <Heart className="h-5 w-5 text-amber-600" />
                        <h3 className="text-sm font-bold text-gray-900">Regional Distribution Center (NGO console)</h3>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <h4 className="font-semibold text-gray-500 uppercase text-[10px] mb-2">Receiving Centers Capacity</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {ngos.map(n => (
                              <div key={n.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex justify-between items-center">
                                <div>
                                  <p className="font-bold text-emerald-950">{n.name}</p>
                                  <p className="text-[10px] text-emerald-700">{n.address}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-emerald-950">{n.mealsReceived} Meals</p>
                                  <span className="text-[9px] text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full uppercase">Verified</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-500 uppercase text-[10px] mb-2">Transit Verification Logs</h4>
                          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                            {tasks.length === 0 ? (
                              <p className="text-gray-400 text-center italic py-4">No active deliveries tracked on this route.</p>
                            ) : (
                              tasks.map(t => (
                                <div key={t.id} className="p-2 border border-gray-100 rounded-lg flex justify-between items-center">
                                  <div>
                                    <span className="text-[9px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">TASK {t.id}</span>
                                    <p className="font-semibold mt-0.5">{t.donation.donorName} ➔ {t.ngoName}</p>
                                  </div>
                                  <span className={`text-[10px] font-bold ${
                                    t.status === "delivered" ? "text-emerald-600" : t.status === "flagged" ? "text-red-600" : "text-amber-600 animate-pulse"
                                  }`}>
                                    {t.status.toUpperCase()}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* ADMIN COMMAND CORE VIEW */}
                  {sandboxRole === "admin" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#F1ECE4] pb-3">
                        <Shield className="h-5 w-5 text-amber-600" />
                        <h3 className="text-sm font-bold text-gray-900">Platform Command & Control (Admin)</h3>
                      </div>

                      <div className="space-y-4 text-xs">
                        {/* Interactive Metrics row */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                            <span className="text-[9px] font-semibold text-amber-700 uppercase">Distributed</span>
                            <p className="text-lg font-extrabold text-amber-950 mt-1">{metrics.totalDistributed}</p>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                            <span className="text-[9px] font-semibold text-amber-700 uppercase">Unassigned Pool</span>
                            <p className="text-lg font-extrabold text-amber-950 mt-1">{metrics.pendingCount}</p>
                          </div>
                          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                            <span className="text-[9px] font-semibold text-amber-700 uppercase">Transit Shipments</span>
                            <p className="text-lg font-extrabold text-amber-950 mt-1">{metrics.claimedCount}</p>
                          </div>
                        </div>

                        {/* Audit Log Screen */}
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-semibold text-gray-500 uppercase text-[10px]">Live Core AI Telemetry Log</h4>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          </div>
                          <div className="bg-gray-950 text-emerald-400 font-mono text-[9px] p-3 rounded-xl h-120 overflow-y-auto space-y-1 custom-scrollbar leading-relaxed">
                            {auditLogs.map(l => (
                              <p key={l.id} className={l.status === "danger" ? "text-red-400" : l.status === "warning" ? "text-amber-400" : "text-emerald-400"}>
                                [{new Date(l.timestamp).toLocaleTimeString()}] [{l.category}] {l.message}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Force Overrides control */}
                        <div>
                          <h4 className="font-semibold text-gray-500 uppercase text-[10px] mb-2">Dynamic Override Interventions</h4>
                          <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                            {donations.filter(d => d.status === "flagged").length === 0 ? (
                              <p className="text-gray-400 text-center italic py-2 text-[11px]">No active security violations or flagged donations detected.</p>
                            ) : (
                              donations.filter(d => d.status === "flagged").map(d => (
                                <div key={d.id} className="p-2 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
                                  <div>
                                    <p className="font-bold text-red-950">{d.donorName}</p>
                                    <p className="text-[9px] text-red-700">Flagged servings: {d.servings}</p>
                                  </div>
                                  <button
                                    onClick={() => approveFlaggedDonation(d.id)}
                                    className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white font-semibold rounded text-[10px]"
                                  >
                                    Force Force-Approve Route
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>

              </div>

              {/* Dynamic Analytics dashboard metrics panel */}
              <div className="bg-white rounded-2xl border border-[#F1ECE4] p-6 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">National Platform Impact Metrics (Volume 19 Dashboard)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Audited metrics updated live as meals are verified and distributed through the sandbox.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                  
                  {/* Left Chart: Meals Delivered Over Time */}
                  <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#F1ECE4]/75 p-4 rounded-xl h-[280px] flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Verified Meals Sourced & Distributed</h4>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metrics.mealsOverTime}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ECE5DA" />
                          <XAxis dataKey="day" stroke="#78716C" fontSize={10} />
                          <YAxis stroke="#78716C" fontSize={10} />
                          <Tooltip contentStyle={{ background: "#FFF", borderRadius: "12px", border: "1px solid #E9E1D5", fontSize: "11px" }} />
                          <Line type="monotone" dataKey="meals" stroke="#F59E0B" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right Chart: Fraud Detection Risk Metrics */}
                  <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#F1ECE4]/75 p-4 rounded-xl h-[280px] flex flex-col">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Fraud Gate & Quality Indicators</h4>
                    <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={metrics.fraudCategories}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#10B981" />
                            <Cell fill="#EF4444" />
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                      
                      {/* Central readouts */}
                      <div className="absolute text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase">Audit Rating</p>
                        <p className="text-xl font-black text-emerald-700">A+</p>
                      </div>
                    </div>

                    <div className="mt-2 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>Clean Deliveries</span>
                        <span className="font-bold">{metrics.fraudCategories[0].value}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>Security Flags</span>
                        <span className="font-bold">{metrics.fraudCategories[1].value}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: SYSTEM ARCHITECTURE */}
          {activeTab === "architecture" && (
            <motion.div
              key="architecture-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* Left pane: Visual interactive layout diagram */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F1ECE4] p-6 h-[720px] flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">National platform System Architecture Map</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Click any operational tier to inspect microservice parameters, security configurations, and schemas.</p>
                </div>

                {/* Nodes Layout Grid */}
                <div className="flex-1 flex flex-col justify-around my-6 relative">
                  
                  {/* Central linking backbone line */}
                  <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-amber-100 -translate-x-1/2 pointer-events-none z-0"></div>

                  {architectureNodes.map((node) => {
                    const isSelected = selectedArchNode.id === node.id;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setSelectedArchNode(node)}
                        className={`w-full max-w-lg mx-auto p-4 rounded-xl border text-left transition-all duration-200 relative z-10 flex justify-between items-center ${
                          isSelected
                            ? "bg-amber-50 border-amber-300 shadow-md text-amber-950 translate-x-1"
                            : "bg-white border-[#F1ECE4] text-gray-700 hover:border-amber-200"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-600">
                            {node.tier.toUpperCase()} TIER
                          </span>
                          <h4 className="text-xs font-bold mt-0.5">{node.title}</h4>
                          <p className="text-[11px] text-gray-500 truncate max-w-md mt-0.5">{node.role}</p>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? "text-amber-600 translate-x-1" : "text-gray-400"}`} />
                      </button>
                    );
                  })}

                </div>

                {/* Microservice Specs Footer Callout */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-amber-950 flex gap-2.5 items-center">
                  <Terminal className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p><strong>Architecture Mandate:</strong> Core calculations (Fraud Scoring, Matching Geofencing, Cryptographic receipts) execute privately in the secure Backend Core to preserve business integrity.</p>
                </div>

              </div>

              {/* Right pane: Selected Node Specifications & code viewer */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#F1ECE4] p-6 h-[720px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold tracking-widest text-amber-600 uppercase">
                    {selectedArchNode.tier.toUpperCase()} SPECIFICATION
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-0.5">{selectedArchNode.title}</h3>
                  
                  <div className="mt-4 space-y-3.5 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Operational Role</span>
                      <p className="text-gray-600 leading-relaxed mt-1">{selectedArchNode.role}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Technology Stack</span>
                        <p className="text-gray-800 font-semibold mt-1">{selectedArchNode.techStack}</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Operational Benchmark</span>
                        <p className="text-gray-800 font-semibold mt-1">{selectedArchNode.spec}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Payload / Code Container Terminal */}
                <div className="flex-1 flex flex-col justify-end mt-4">
                  <div className="flex justify-between items-center bg-gray-900 px-4 py-2 rounded-t-xl text-[11px] font-mono text-gray-400 border-b border-gray-800">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-amber-500" />
                      API_ENDPOINT_PAYLOAD_SCHEMA.JSON
                    </span>
                    <span className="text-[10px] text-emerald-400 uppercase">Secure Connection</span>
                  </div>
                  <pre className="bg-gray-950 text-emerald-400 font-mono text-[10px] p-4 rounded-b-xl overflow-x-auto border border-gray-900 max-h-[280px] leading-relaxed select-text">
                    {selectedArchNode.simulatedPayload}
                  </pre>
                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 4: INTERACTIVE FRONTEND PROTOTYPE */}
          {activeTab === "prototype" && (
            <motion.div
              key="prototype-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <PrototypeView
                donations={donations}
                setDonations={setDonations}
                tasks={tasks}
                setTasks={setTasks}
                ngos={ngos}
                setNgos={setNgos}
                auditLogs={auditLogs}
                setAuditLogs={setAuditLogs}
                volunteerTrustScore={volunteerTrustScore}
                setVolunteerTrustScore={setVolunteerTrustScore}
                isSuspended={isSuspended}
                setIsSuspended={setIsSuspended}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-[#F1ECE4] bg-[#FCFAF5] py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© 2026 Human Assistance Platform. Licensed Section 8 (Not-For-Profit) Entity.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-800 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-800 transition-colors">CSR Compliance Audits</a>
            <span>•</span>
            <a href="#" className="hover:text-amber-800 transition-colors">Volunteers SLA</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
