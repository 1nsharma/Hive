import React, { useState } from "react";
import {
  Wrench,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  Shield,
  MessageSquare,
  Camera,
  Cpu,
  ArrowRight,
  Send,
  Eye,
  Layers,
  Sparkles,
  Search,
  Check,
  X,
  Lock,
  ChevronRight,
  HelpCircle,
  FileSpreadsheet,
  Zap,
} from "lucide-react";
import {
  OperationalJob,
  JobStage,
  WhatsAppCandidateEvent,
  EvidenceAttachment,
} from "../types";
import {
  INITIAL_OPERATIONAL_JOBS,
  INITIAL_CANDIDATE_EVENTS,
} from "../jobLifecycleData";

const STAGES_ORDER: { key: JobStage; label: string; hindi: string; icon: any }[] = [
  { key: "ISSUE", label: "Issue", hindi: "समस्या", icon: AlertTriangle },
  { key: "INSPECTION", label: "Inspection", hindi: "जांच", icon: Search },
  { key: "ESTIMATE", label: "Estimate", hindi: "अनुमानित", icon: DollarSign },
  { key: "APPROVAL", label: "Approval", hindi: "सहमति", icon: CheckCircle2 },
  { key: "PARTS", label: "Parts", hindi: "पार्ट्स", icon: Layers },
  { key: "MECHANIC_WORK", label: "Work", hindi: "कारीगरी", icon: Wrench },
  { key: "TEST", label: "Test", hindi: "टेस्ट", icon: Zap },
  { key: "FINAL", label: "Final", hindi: "अंतिम", icon: Lock },
];

export const JobLifecycleEngine: React.FC = () => {
  const [jobs, setJobs] = useState<OperationalJob[]>(INITIAL_OPERATIONAL_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>("job-tata-1618");
  const [selectedStageKey, setSelectedStageKey] = useState<JobStage>("ISSUE");
  const [candidateEvents, setCandidateEvents] = useState<WhatsAppCandidateEvent[]>(INITIAL_CANDIDATE_EVENTS);

  // New WhatsApp Simulator Message
  const [testMessageText, setTestMessageText] = useState<string>("");
  const [testSenderRole, setTestSenderRole] = useState<"MECHANIC" | "DRIVER" | "PARTS_STORE">("MECHANIC");

  // Selected Evidence for Modal Preview
  const [previewEvidence, setPreviewEvidence] = useState<EvidenceAttachment | null>(null);

  // Show Provenance Trail Modal
  const [showProvenanceModal, setShowProvenanceModal] = useState<boolean>(false);

  // Active View inside this module: "job-lifecycle" | "candidate-stream" | "architecture-layers"
  const [activeModuleTab, setActiveModuleTab] = useState<"job-lifecycle" | "candidate-stream" | "architecture-layers">("job-lifecycle");

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const currentStageEvent = currentJob.stages[selectedStageKey];

  // Advance stage for in-flight job (e.g. UPXX1234)
  const handleAdvanceStage = () => {
    if (selectedJobId !== "job-ashok-2820") return;

    setJobs((prevJobs) =>
      prevJobs.map((job) => {
        if (job.id !== "job-ashok-2820") return job;

        if (job.currentStage === "PARTS") {
          return {
            ...job,
            currentStage: "MECHANIC_WORK",
            stages: {
              ...job.stages,
              PARTS: { ...job.stages.PARTS, status: "COMPLETED" },
              MECHANIC_WORK: {
                ...job.stages.MECHANIC_WORK,
                status: "ACTIVE",
                timestamp: "Just now (03:45 PM)",
                description: "New Valeo 380mm clutch plate & release bearing fitted to flywheel with alignment mandrel. Torquing pressure plate bolts.",
                evidence: [
                  {
                    id: "ev-clutch-adv-01",
                    type: "WHATSAPP_MESSAGE",
                    title: "Ramesh Ustad WhatsApp Update",
                    content: "Parts receive ho gaye. Clutch plate fit ho gayi hai, ab bellhousing jod rahe hain.",
                    author: "Ramesh Ustad (+91 94120 11223)",
                    timestamp: "Just now",
                    sha256: "7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
                  },
                ],
              },
            },
            provenanceTrail: [
              ...job.provenanceTrail,
              {
                step: "6. Mechanic Work In Progress",
                source: "WhatsApp Bay 1 Update",
                evidenceRef: "ev-clutch-adv-01",
                who: "Ramesh Ustad",
                when: "Just now",
              },
            ],
          };
        } else if (job.currentStage === "MECHANIC_WORK") {
          return {
            ...job,
            currentStage: "TEST",
            stages: {
              ...job.stages,
              MECHANIC_WORK: { ...job.stages.MECHANIC_WORK, status: "COMPLETED" },
              TEST: {
                ...job.stages.TEST,
                status: "ACTIVE",
                timestamp: "Just now (04:15 PM)",
                description: "Bite point calibrated. Test drive on loaded flyover to confirm zero slip and smooth pedal engagement.",
                evidence: [
                  {
                    id: "ev-clutch-test-01",
                    type: "TECHNICIAN_REPORT",
                    title: "Road Test Checklist",
                    content: "Gear shifts smooth from 1st to 8th. Bite point at 40% pedal travel. Zero friction smell.",
                    author: "Suresh Mehra (Engineer)",
                    timestamp: "Just now",
                    sha256: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
                  },
                ],
              },
            },
          };
        } else if (job.currentStage === "TEST") {
          return {
            ...job,
            currentStage: "FINAL",
            stages: {
              ...job.stages,
              TEST: { ...job.stages.TEST, status: "COMPLETED" },
              FINAL: {
                ...job.stages.FINAL,
                status: "COMPLETED",
                timestamp: "Just now (04:45 PM)",
                description: "Work completed and verified. Final invoice generated. Actual parts match estimate.",
                evidence: [
                  {
                    id: "ev-clutch-fin-01",
                    type: "INVOICE",
                    title: "Invoice #TW-INV-2026-0849",
                    content: "Grand Total: ₹14,200. Paid via UPI. Work signed off by Owner Balwinder Singh.",
                    author: "Rajesh Sharma",
                    timestamp: "Just now",
                    sha256: "1234567890abcdefabcdefabcdef1234567890abcdefabcdefabcdef1234567890",
                  },
                ],
              },
            },
            actual: {
              parts: [
                {
                  name: "Clutch Plate 380mm (Valeo Genuine)",
                  partNumber: "VAL-380-HD",
                  qty: 1,
                  actualCost: 8500,
                  supplier: "Sanjay Auto Spares",
                  issuedTimestamp: "06 Sep 2026, 03:30 PM",
                },
                {
                  name: "Clutch Release Bearing (SKF Heavy Duty)",
                  partNumber: "SKF-CRB-991",
                  qty: 1,
                  actualCost: 2200,
                  supplier: "Truck Wala Central Bay",
                  issuedTimestamp: "06 Sep 2026, 03:35 PM",
                },
              ],
              labour: [
                { mechanic: "Ramesh Ustad", workHours: 4, cost: 3500 },
              ],
              totalActual: 14200,
              testReport: {
                tester: "Suresh Mehra",
                result: "PASSED",
                notes: "Bite point exact, no slippage on grade climb.",
                testTimestamp: "Just now",
              },
              finalStatus: "WORK_COMPLETED",
              variance: 0,
              committedTimestamp: "Just now",
            },
          };
        }
        return job;
      })
    );
  };

  // Simulate ingesting a new WhatsApp message through the AI Intelligence layer
  const handleIngestTestMessage = () => {
    if (!testMessageText.trim()) return;

    let detectedVehicle = "Unknown Vehicle";
    let detectedIntent = "GENERAL_COMMUNICATION";
    let suggestedWorkItem = "Evaluate request";
    let confidence = 75;

    const lower = testMessageText.toLowerCase();
    if (lower.includes("1234") || lower.includes("upxx")) {
      detectedVehicle = "UPXX1234 (Ashok Leyland 2820)";
    } else if (lower.includes("1618") || lower.includes("tata") || lower.includes("bt-1234")) {
      detectedVehicle = "UP14-BT-1234 (Tata 1618)";
    }

    if (lower.includes("bearing")) {
      detectedIntent = "WORK_ITEM_ADDITION";
      suggestedWorkItem = "Bearing inspection & replacement";
      confidence = 94;
    } else if (lower.includes("clutch")) {
      detectedIntent = "CLUTCH_OVERHAUL";
      suggestedWorkItem = "Clutch plate check / replacement";
      confidence = 91;
    } else if (lower.includes("filter") || lower.includes("oil")) {
      detectedIntent = "LUBRICATION_SERVICE";
      suggestedWorkItem = "Filter & Oil servicing";
      confidence = 88;
    } else if (lower.includes("brakes") || lower.includes("brake")) {
      detectedIntent = "BRAKE_SERVICE";
      suggestedWorkItem = "Brake liner replacement";
      confidence = 89;
    }

    const newCandidate: WhatsAppCandidateEvent = {
      id: `cand-${Date.now()}`,
      rawMessage: testMessageText,
      sender: testSenderRole === "MECHANIC" ? "Ramesh Ustad (Mechanic)" : testSenderRole === "DRIVER" ? "Gurdeep Singh (Driver)" : "Sharma Auto Store",
      senderPhone: "+91 94120 11223",
      senderRole: testSenderRole,
      timestamp: "Just now",
      mediaType: "text",
      aiInterpretation: {
        detectedVehicle,
        detectedIntent,
        suggestedWorkItem,
        confidence,
        status: "NEEDS_VERIFICATION",
      },
    };

    setCandidateEvents([newCandidate, ...candidateEvents]);
    setTestMessageText("");
  };

  // Approve a candidate event into actual work item
  const handleApproveCandidate = (candId: string) => {
    setCandidateEvents((prev) =>
      prev.map((c) =>
        c.id === candId
          ? {
              ...c,
              aiInterpretation: {
                ...c.aiInterpretation,
                status: "HUMAN_CONFIRMED",
              },
            }
          : c
      )
    );
  };

  const handleRejectCandidate = (candId: string) => {
    setCandidateEvents((prev) =>
      prev.map((c) =>
        c.id === candId
          ? {
              ...c,
              aiInterpretation: {
                ...c.aiInterpretation,
                status: "REJECTED",
              },
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Module Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>PRIVATE OPERATIONAL CONTROL LAYER</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30">
                WHATSAPP = NATURAL INTERFACE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>🚛 Truck Wala Private Operation Engine</span>
              <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-normal font-mono">
                Estimate → Work → Final
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Workers/engineers/owners WhatsApp पर रोज़ की तरह communicate करते हैं। Truck Wala का private control layer हर interaction को <strong>Event-Driven Lifecycle</strong> में बदलता है—जहाँ हर stage पर प्रमाण (Evidence) जुड़ता है और AI सिर्फ intelligence देता है, अधिकार (Authority) नहीं।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="op-engine-provenance-modal-btn"
              onClick={() => setShowProvenanceModal(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>Audit Chain: "यह Part कैसे आया?"</span>
            </button>
          </div>
        </div>

        {/* 3 Core Architecture Tenets Banner */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">1. Raw Communication</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Original WhatsApp text, voice note & photos immutable vault me rehti hain.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">2. Extracted Data (AI)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">AI suggests work & parts. Status always 'Needs Verification'—never auto-deducts inventory.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">3. Approved / Final Data</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Human confirms ➔ Master DB written with WHO, WHAT, WHEN and cryptographic hash.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          id="op-tab-job-lifecycle"
          onClick={() => setActiveModuleTab("job-lifecycle")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeModuleTab === "job-lifecycle"
              ? "bg-indigo-600 text-white font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>8-Stage Job Flow (Estimate → Work → Final)</span>
        </button>

        <button
          id="op-tab-candidate-stream"
          onClick={() => setActiveModuleTab("candidate-stream")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeModuleTab === "candidate-stream"
              ? "bg-indigo-600 text-white font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>WhatsApp Event Ingestion & AI Intelligence Sandbox</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
            {candidateEvents.filter((c) => c.aiInterpretation.status === "NEEDS_VERIFICATION").length} Needs Review
          </span>
        </button>

        <button
          id="op-tab-architecture-layers"
          onClick={() => setActiveModuleTab("architecture-layers")}
          className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeModuleTab === "architecture-layers"
              ? "bg-indigo-600 text-white font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Three-Layer Architecture (Separation of Truth)</span>
        </button>
      </div>

      {/* VIEW 1: 8-STAGE JOB LIFECYCLE */}
      {activeModuleTab === "job-lifecycle" && (
        <div className="space-y-6">
          {/* Job Selector Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              const isDone = job.currentStage === "FINAL";
              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setSelectedStageKey("ISSUE");
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-lg shadow-indigo-950/40"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-white">{job.vehicleNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {job.jobNumber}
                        </span>
                        {isDone ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            COMPLETED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                            <Clock className="w-3 h-3" />
                            STAGE: {job.currentStage}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 mt-1 font-semibold">{job.vehicleModel}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Owner: {job.fleetOwner}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Total Estimate:</div>
                      <div className="text-sm font-bold text-amber-400 font-mono">₹{job.estimate.totalEstimate.toLocaleString()}</div>
                      {isDone && (
                        <div className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">
                          Actual: ₹{job.actual.totalActual.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      Driver: {job.driverName}
                    </span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      Click to view workflow <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stepper Bar: The 8 Stages */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                  Lifecycle of {currentJob.vehicleNumber} ({currentJob.vehicleModel})
                </div>
                <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                  <span>8-Stage Event Pipeline</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                    {currentJob.currentStage === "FINAL" ? "100% Completed" : `Currently at: ${currentJob.currentStage}`}
                  </span>
                </h3>
              </div>

              {currentJob.currentStage !== "FINAL" && (
                <button
                  id="advance-stage-simulate-btn"
                  onClick={handleAdvanceStage}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate Next WhatsApp Event ➔</span>
                </button>
              )}
            </div>

            {/* Stepper Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {STAGES_ORDER.map((stageItem, idx) => {
                const stageData = currentJob.stages[stageItem.key];
                const isSelected = selectedStageKey === stageItem.key;
                const isCompleted = stageData.status === "COMPLETED";
                const isActive = stageData.status === "ACTIVE";
                const isPending = stageData.status === "PENDING";
                const IconComponent = stageItem.icon;

                return (
                  <button
                    key={stageItem.key}
                    id={`stage-step-btn-${stageItem.key}`}
                    onClick={() => setSelectedStageKey(stageItem.key)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-indigo-950/80 border-indigo-400 ring-2 ring-indigo-500/40"
                        : isCompleted
                        ? "bg-slate-950/80 border-emerald-800/40 hover:border-emerald-700/60"
                        : isActive
                        ? "bg-amber-950/40 border-amber-500/60 hover:border-amber-400"
                        : "bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">0{idx + 1}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isActive ? (
                        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center gap-1.5">
                        <IconComponent
                          className={`w-3.5 h-3.5 ${
                            isSelected
                              ? "text-indigo-300"
                              : isCompleted
                              ? "text-emerald-400"
                              : isActive
                              ? "text-amber-400"
                              : "text-slate-500"
                          }`}
                        />
                        <span className="text-xs font-bold text-white">{stageItem.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{stageItem.hindi}</div>
                    </div>

                    <div className="mt-2 text-[10px] font-mono">
                      {isCompleted ? (
                        <span className="text-emerald-400">Completed</span>
                      ) : isActive ? (
                        <span className="text-amber-400 font-bold">In Progress</span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Stage Detail & Evidence Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Stage Details & Evidence */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                        STAGE {selectedStageKey}
                      </span>
                      <span className="text-xs text-slate-400">Timestamp: {currentStageEvent.timestamp}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{currentStageEvent.title}</h3>
                    <div className="text-xs text-indigo-400 font-semibold">{currentStageEvent.hindiTitle}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                      Actor: <strong className="text-white">{currentStageEvent.actor}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  {currentStageEvent.description}
                </div>

                {/* Evidence Attached Section */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>Attached Evidence ({currentStageEvent.evidence.length})</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">WORM Immutable Storage • Zero tampering</span>
                  </div>

                  {currentStageEvent.evidence.length === 0 ? (
                    <div className="text-xs text-slate-500 italic p-4 bg-slate-950/40 rounded-xl text-center border border-dashed border-slate-800">
                      No evidence submitted yet for this pending stage.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {currentStageEvent.evidence.map((ev) => (
                        <div
                          key={ev.id}
                          className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                                {ev.type}
                              </span>
                              <span className="text-xs font-bold text-white">{ev.title}</span>
                              <span className="text-[10px] text-slate-500">• {ev.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 line-clamp-2">{ev.content}</p>
                            <div className="text-[10px] font-mono text-slate-500 truncate max-w-md">
                              SHA-256: <span className="text-slate-400">{ev.sha256}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {ev.fileUrl && (
                              <button
                                onClick={() => setPreviewEvidence(ev)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/60 text-xs font-semibold flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Preview Photo</span>
                              </button>
                            )}
                            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              VERIFIED
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Estimate vs Actual Financial Card */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Estimate vs. Actual Ledger</span>
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {currentJob.estimate.status}
                  </span>
                </div>

                {/* Estimate Breakdown */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Estimated Cost (Quoted)
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    {currentJob.estimate.parts.map((p, i) => (
                      <div key={i} className="flex justify-between text-slate-300">
                        <span>
                          {p.name} ({p.qty}x)
                        </span>
                        <span className="font-mono text-slate-200">₹{p.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-slate-300">
                      <span>Labour & Fitment</span>
                      <span className="font-mono text-slate-200">₹{currentJob.estimate.labour.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-amber-400 text-sm">
                      <span>Total Estimated:</span>
                      <span className="font-mono">₹{currentJob.estimate.totalEstimate.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actual Incurred Cost */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Actual Cost Incurred</span>
                    {currentJob.actual.finalStatus === "WORK_COMPLETED" && (
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">COMMITTED TO DB</span>
                    )}
                  </div>

                  {currentJob.actual.totalActual > 0 ? (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                      {currentJob.actual.parts.map((p, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>
                            {p.name} ({p.qty}x)
                          </span>
                          <span className="font-mono text-emerald-300">₹{p.actualCost.toLocaleString()}</span>
                        </div>
                      ))}
                      {currentJob.actual.labour.map((l, i) => (
                        <div key={i} className="flex justify-between text-slate-300">
                          <span>{l.mechanic} ({l.workHours}h)</span>
                          <span className="font-mono text-emerald-300">₹{l.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                        <span>Actual Total:</span>
                        <span className="font-mono text-emerald-400">₹{currentJob.actual.totalActual.toLocaleString()}</span>
                      </div>
                      <div className="pt-1 flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Variance (Actual - Est):</span>
                        <span className={currentJob.actual.variance <= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                          {currentJob.actual.variance < 0 ? `-₹${Math.abs(currentJob.actual.variance)} (Saved)` : currentJob.actual.variance === 0 ? "Exact Match (₹0)" : `+₹${currentJob.actual.variance}`}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-xs text-slate-500 italic text-center">
                      Actual costs will be committed upon completion of testing & final sign-off.
                    </div>
                  )}
                </div>

                {/* Audit provenance trigger */}
                <div className="pt-2">
                  <button
                    id="open-audit-trail-inline-btn"
                    onClick={() => setShowProvenanceModal(true)}
                    className="w-full py-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>View Provenance Audit Trail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: WHATSAPP EVENT INGESTION & AI SANDBOX */}
      {activeModuleTab === "candidate-stream" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                  <span>WhatsApp Candidate Event Stream</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Incoming WhatsApp messages are parsed by the AI intelligence layer. AI classifies items as "NEEDS VERIFICATION" and will NEVER auto-modify inventory or final bills.
                </p>
              </div>

              <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                AI Rule: <strong>Suggestion Only, No Auto-Commit</strong>
              </div>
            </div>

            {/* Test WhatsApp Message Simulator Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Test WhatsApp Message Ingestion</span>
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Sender:</span>
                  <select
                    value={testSenderRole}
                    onChange={(e) => setTestSenderRole(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 text-slate-200"
                  >
                    <option value="MECHANIC">🔧 Ramesh Ustad (Mechanic)</option>
                    <option value="DRIVER">🚛 Gurdeep (Driver)</option>
                    <option value="PARTS_STORE">📦 Sharma Auto (Supplier)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 'Bhai iska bearing bhi change kar dena' or 'Tata 1618 radiator received ₹18000'"
                  value={testMessageText}
                  onChange={(e) => setTestMessageText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleIngestTestMessage()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  id="simulate-ingest-whatsapp-btn"
                  onClick={handleIngestTestMessage}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="text-slate-500">Quick Test Presets:</span>
                <button
                  onClick={() => setTestMessageText("Bhai iska bearing bhi change kar dena")}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  "Bhai iska bearing bhi change kar dena"
                </button>
                <button
                  onClick={() => setTestMessageText("UP14-BT-1234 clutch problem highway pe slip ho raha hai")}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  "UP14-BT-1234 clutch problem"
                </button>
                <button
                  onClick={() => setTestMessageText("Radiator received — 1 pc bill attached ₹18,000")}
                  className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                >
                  "Radiator received — 1 pc bill attached ₹18,000"
                </button>
              </div>
            </div>

            {/* Candidate List Cards */}
            <div className="space-y-3">
              {candidateEvents.map((candidate) => {
                const isPending = candidate.aiInterpretation.status === "NEEDS_VERIFICATION";
                const isConfirmed = candidate.aiInterpretation.status === "HUMAN_CONFIRMED";
                const isRejected = candidate.aiInterpretation.status === "REJECTED";

                return (
                  <div
                    key={candidate.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isPending
                        ? "bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-950/20"
                        : isConfirmed
                        ? "bg-slate-950/80 border-emerald-800/40"
                        : "bg-slate-950/40 border-slate-800 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left: Raw WhatsApp Message */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            WHATSAPP
                          </span>
                          <span className="text-xs font-bold text-white">{candidate.sender}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({candidate.senderPhone})</span>
                          <span className="text-[10px] text-slate-500">• {candidate.timestamp}</span>
                        </div>

                        <div className="text-xs text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono italic">
                          "{candidate.rawMessage}"
                        </div>

                        {candidate.imageUrl && (
                          <div className="mt-1">
                            <img
                              src={candidate.imageUrl}
                              alt="Worn part evidence"
                              className="h-20 w-32 object-cover rounded-lg border border-slate-800"
                            />
                          </div>
                        )}
                      </div>

                      {/* Middle: AI Extraction Engine Result */}
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 lg:min-w-[280px] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Recommendation
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                            {candidate.aiInterpretation.confidence}% Match
                          </span>
                        </div>

                        <div className="text-slate-300">
                          Context: <strong className="text-white">{candidate.aiInterpretation.detectedVehicle || "General"}</strong>
                        </div>
                        <div className="text-slate-300">
                          Work Item: <span className="text-indigo-300 font-semibold">{candidate.aiInterpretation.suggestedWorkItem}</span>
                        </div>
                        {candidate.aiInterpretation.suggestedPart && (
                          <div className="text-slate-400 text-[11px]">
                            Part: <span className="text-slate-200">{candidate.aiInterpretation.suggestedPart}</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Human Verification Actions */}
                      <div className="flex lg:flex-col items-center justify-end gap-2 shrink-0">
                        {isPending ? (
                          <>
                            <button
                              id={`approve-candidate-${candidate.id}`}
                              onClick={() => handleApproveCandidate(candidate.id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Human Approve</span>
                            </button>
                            <button
                              id={`reject-candidate-${candidate.id}`}
                              onClick={() => handleRejectCandidate(candidate.id)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs rounded-lg transition-all flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Ignore</span>
                            </button>
                          </>
                        ) : isConfirmed ? (
                          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold font-mono flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>APPROVED & LOGGED</span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-500 text-xs font-mono">
                            REJECTED / IGNORED
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: THREE-LAYER DATA ARCHITECTURE */}
      {activeModuleTab === "architecture-layers" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Three-Layer Architectural Separation (Strict Data Boundary)</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                <strong>"Raw communication alag, extracted data alag, approved/final data alag."</strong>
                <br />
                Is principle ke tahat, AI ki koi bhi mistake original WhatsApp/photo ko corrupt nahi karegi aur pura self-auditing provenance trail barkarar rahega.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Layer 1 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-blue-900/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    LAYER 01
                  </span>
                  <span className="text-xs font-mono text-emerald-400">IMMUTABLE WORM</span>
                </div>
                <h4 className="text-sm font-bold text-white">Raw Communication & Evidence Vault</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Original WhatsApp chats, audio notes, camera snaps, driver selfies, supplier parchis.
                </p>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                  <div>• Read-Only Append</div>
                  <div>• SHA-256 Cryptographic Hash</div>
                  <div>• Never modified or deleted by AI</div>
                  <div>• Acts as legal proof in disputes</div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-amber-900/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    LAYER 02
                  </span>
                  <span className="text-xs font-mono text-amber-400">EPHEMERAL / AI</span>
                </div>
                <h4 className="text-sm font-bold text-white">Extracted Intelligence & Candidates</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  AI parsing layer: intent identification, part classification, confidence score, suggestion generation.
                </p>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                  <div>• AI ≠ Authority</div>
                  <div>• Status: Needs Verification</div>
                  <div>• Zero memory retention policy</div>
                  <div>• Cannot debit inventory or invoice</div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-900/50 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LAYER 03
                  </span>
                  <span className="text-xs font-mono text-emerald-400">FINAL TRUTH</span>
                </div>
                <h4 className="text-sm font-bold text-white">Approved Master Operational DB</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized owner transactions: work orders, inventory consumption, mechanic ledger, customer bills.
                </p>
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] space-y-1 font-mono text-slate-400">
                  <div>• Two-Phase Human Commit</div>
                  <div>• Full Audit Log (WHO, WHAT, WHEN)</div>
                  <div>• Estimate vs Actual variance</div>
                  <div>• Locked for cross-customer leakage</div>
                </div>
              </div>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                Complete Provenance Chain Guarantee
              </div>
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 flex flex-wrap items-center gap-2 sm:gap-3 leading-loose">
                <span className="px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                  WhatsApp Message
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">Work Request</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Estimate (Quotation)
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Owner Approval
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">Part Issued</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-slate-800 text-slate-200">Mechanic Installation</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Road / Heat Test
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  Final Work Ledger
                </span>
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Agar kal ko koi fleet owner ya auditor puche ki "Yeh part is truck me kyu laga?", system second me upar di gayi unbroken chain saboot ke saath open kar dega.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROVENANCE MODAL: "यह Part इस Truck में कैसे गया?" */}
      {showProvenanceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold">
                  SELF-AUDITING PROVENANCE CHAIN
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  "यह Part इस Truck ({currentJob.vehicleNumber}) में कैसे गया?"
                </h3>
                <p className="text-xs text-slate-400">
                  Unbroken audit trail verifying the complete causal path from raw WhatsApp to ledger deduction.
                </p>
              </div>
              <button
                onClick={() => setShowProvenanceModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
              {currentJob.provenanceTrail.map((step, idx) => (
                <div key={idx} className="relative space-y-1">
                  <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-indigo-500 border-2 border-slate-900"></div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{step.step}</span>
                    <span className="text-[10px] font-mono text-slate-400">{step.when}</span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <span>Source: <strong className="text-indigo-300">{step.source}</strong></span>
                    <span>• Actor: <strong className="text-slate-200">{step.who}</strong></span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80 inline-block">
                    Evidence Ref: {step.evidenceRef}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowProvenanceModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close Audit Chain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVIDENCE PHOTO MODAL PREVIEW */}
      {previewEvidence && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>{previewEvidence.title}</span>
              </h3>
              <button
                onClick={() => setPreviewEvidence(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewEvidence.fileUrl && (
              <img
                src={previewEvidence.fileUrl}
                alt={previewEvidence.title}
                className="w-full h-64 object-cover rounded-xl border border-slate-800"
              />
            )}

            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div><strong>Content:</strong> {previewEvidence.content}</div>
              <div><strong>Author:</strong> {previewEvidence.author}</div>
              <div className="text-[10px] font-mono text-slate-500">
                SHA-256: {previewEvidence.sha256}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewEvidence(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
