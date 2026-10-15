import React, { useState } from "react";
import { PublicWebsite } from "./components/PublicWebsite";
import { PrivateApp } from "./components/PrivateApp";
import { LoginModal } from "./components/LoginModal";
import { EmergencyModal } from "./components/EmergencyModal";
import { BookServiceModal } from "./components/BookServiceModal";
import { VoiceInputModal } from "./components/VoiceInputModal";
import { WorkTimelineModal } from "./components/WorkTimelineModal";
import { PhotoEvidenceModal } from "./components/PhotoEvidenceModal";
import { NewVehicleEntryModal } from "./components/NewVehicleEntryModal";

import { WhatsAppFeed } from "./components/WhatsAppFeed";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuditQueue } from "./components/AuditQueue";
import { AuditReviewModal } from "./components/AuditReviewModal";
import { DiscoveryReport } from "./components/DiscoveryReport";
import { ShelfInventoryScanner } from "./components/ShelfInventoryScanner";
import { EvidenceExplorer } from "./components/EvidenceExplorer";
import { VehicleEmergencyHub } from "./components/VehicleEmergencyHub";
import { ControlledLearning } from "./components/ControlledLearning";
import { PurchaseOrderSystem } from "./components/PurchaseOrderSystem";
import { DataTrustCenter } from "./components/DataTrustCenter";
import { JobLifecycleEngine } from "./components/JobLifecycleEngine";
import { MasterBlueprintCenter } from "./components/MasterBlueprintCenter";

import {
  INITIAL_MESSAGES,
  INITIAL_DETECTED_SHELVES,
  INITIAL_EMERGENCY_JOBS,
  INITIAL_REALITY_REPORT,
  INITIAL_MISSING_BILLS,
  INITIAL_LEARNING_RULES,
  INITIAL_VEHICLES,
  INITIAL_PURCHASE_ORDERS,
} from "./mockData";
import { INITIAL_WORK_ITEMS } from "./truckWalaData";

import {
  IngestionMessage,
  DetectedShelfItem,
  EmergencyJob,
  RealityReport,
  MissingBillRecord,
  ControlledLearningRule,
  VehicleRecord,
  PurchaseOrderRecord,
  UserRole,
  WorkItem,
  TimelineEvent,
} from "./types";

export default function App() {
  // Top-level Navigation Mode: Public Website vs Private Operations
  const [appSection, setAppSection] = useState<"public" | "private">("public");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("owner");

  // Workshop Data States
  const [workItems, setWorkItems] = useState<WorkItem[]>(INITIAL_WORK_ITEMS);
  const [messages, setMessages] = useState<IngestionMessage[]>(INITIAL_MESSAGES);
  const [shelfItems, setShelfItems] = useState<DetectedShelfItem[]>(INITIAL_DETECTED_SHELVES);
  const [emergencyJobs, setEmergencyJobs] = useState<EmergencyJob[]>(INITIAL_EMERGENCY_JOBS);
  const [realityReport, setRealityReport] = useState<RealityReport>(INITIAL_REALITY_REPORT);
  const [missingBills, setMissingBills] = useState<MissingBillRecord[]>(INITIAL_MISSING_BILLS);
  const [learningRules, setLearningRules] = useState<ControlledLearningRule[]>(INITIAL_LEARNING_RULES);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);

  // Private Sub-module view state
  const [activePrivateView, setActivePrivateView] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [bookServiceModalOpen, setBookServiceModalOpen] = useState(false);
  const [selectedBookingService, setSelectedBookingService] = useState<string | undefined>(undefined);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [timelineModalItem, setTimelineModalItem] = useState<WorkItem | null>(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);
  const [auditModalMessage, setAuditModalMessage] = useState<IngestionMessage | null>(null);

  // Quick Action Handlers
  const handleOpenBooking = (serviceId?: string) => {
    setSelectedBookingService(serviceId);
    setBookServiceModalOpen(true);
  };

  const handleLogin = (role: UserRole, _phone: string) => {
    setCurrentUserRole(role);
    setAppSection("private");
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    setAppSection("public");
    setActivePrivateView("dashboard");
  };

  // Timeline & Work Item updates
  const handleOpenTimeline = (item: WorkItem) => {
    // Keep updated ref
    const fresh = workItems.find((w) => w.id === item.id) || item;
    setTimelineModalItem(fresh);
  };

  const handleAddTimelineNote = (workItemId: string, note: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id === workItemId) {
          const newEvent: TimelineEvent = {
            id: "tl-note-" + Date.now(),
            time: timeStr,
            title: "Technician Update",
            description: note,
            iconType: "wrench",
            completed: true,
          };
          const updated = {
            ...item,
            totalEvents: item.totalEvents + 1,
            lastUpdate: timeStr,
            timeline: [...item.timeline, newEvent],
          };
          if (timelineModalItem?.id === workItemId) {
            setTimelineModalItem(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleCompleteTimelineStep = (workItemId: string, eventId: string) => {
    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id === workItemId) {
          const updatedTimeline = item.timeline.map((ev) =>
            ev.id === eventId ? { ...ev, completed: true } : ev
          );
          const allDone = updatedTimeline.every((ev) => ev.completed);
          const updated = {
            ...item,
            status: allDone ? ("Completed" as const) : item.status,
            timeline: updatedTimeline,
            lastUpdate: "Just now",
          };
          if (timelineModalItem?.id === workItemId) {
            setTimelineModalItem(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddWorkItem = (newItem: WorkItem) => {
    setWorkItems((prev) => [newItem, ...prev]);
  };

  const handlePhotoUpload = (evidence: {
    workItemId: string;
    photoUrl: string;
    caption: string;
    category: string;
  }) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setWorkItems((prev) =>
      prev.map((item) => {
        if (item.id === evidence.workItemId) {
          const newEvent: TimelineEvent = {
            id: "tl-photo-" + Date.now(),
            time: timeStr,
            title: evidence.category,
            description: evidence.caption,
            evidenceUrl: evidence.photoUrl,
            iconType: "camera",
            completed: true,
          };
          const updated = {
            ...item,
            evidenceCount: item.evidenceCount + 1,
            totalEvents: item.totalEvents + 1,
            lastUpdate: timeStr,
            timeline: [...item.timeline, newEvent],
          };
          if (timelineModalItem?.id === item.id) {
            setTimelineModalItem(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleVoiceProcessed = (result: {
    text: string;
    vehicle: string;
    part: string;
    action: string;
    confidence: number;
  }) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const isPurchase = result.action.includes("Stock") || result.text.toLowerCase().includes("aa gaya");

    const newMsg: IngestionMessage = {
      id: "msg-voice-" + Date.now().toString().slice(-5),
      timestamp: timeStr,
      sender: currentUserRole === "worker" ? "Amit Singh (Technician)" : "Workshop Floor Voice Input",
      senderRole: currentUserRole === "worker" ? "Head Mechanic" : "Owner",
      rawText: result.text,
      mediaType: "voice",
      classification: isPurchase ? "PURCHASE" : "INVENTORY",
      confidence: result.confidence,
      auditStatus: "NEEDS_REVIEW",
      evidenceHash: "SHA256-VOICE-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      extracted: {
        partName: result.part,
        partNumber: null,
        quantity: 1,
        rate: null,
        totalAmount: null,
        dealerName: null,
        vehicleNumber: result.vehicle,
        vehicleModel: result.vehicle,
        issueDescription: result.action,
        urgency: "MEDIUM",
        reviewNotes: `Voice recorded & parsed. Vehicle: ${result.vehicle}, Part: ${result.part}.`,
        auditChecklist: [
          { item: "Voice message preserved", status: "VERIFIED", detail: "Audio waveform archived" },
          { item: "Symptom / Part matched", status: "VERIFIED", detail: result.part },
          { item: "Vehicle identifier check", status: "VERIFIED", detail: result.vehicle },
        ],
      },
    };

    setMessages((prev) => [newMsg, ...prev]);

    // If matches an active work item, attach step
    const targetWork = workItems.find(
      (w) =>
        result.vehicle.toLowerCase().includes(w.vehicleNumber.toLowerCase().replace(/\s+/g, "")) ||
        w.vehicleNumber.toLowerCase().includes(result.vehicle.toLowerCase())
    );

    if (targetWork) {
      handleAddTimelineNote(targetWork.id, `Voice Update: "${result.text}"`);
    }
  };

  const handleEmergencyDispatch = (ticket: {
    vehicleNumber: string;
    location: string;
    problem: string;
  }) => {
    const newEmergency: EmergencyJob = {
      id: "EMG-" + Date.now().toString().slice(-4),
      vehicleNumber: ticket.vehicleNumber,
      vehicleModel: "Commercial Transport Vehicle",
      highwayLocation: ticket.location,
      driverName: "Highway Driver (SOS)",
      driverPhone: "+91 98765 43210",
      reportedAt: "Just now",
      status: "Dispatched",
      urgency: "EMERGENCY",
      problemSummary: ticket.problem,
      level1DriverReport: ticket.problem,
      level2TechnicianAssigned: "Ramesh Ustad (Mobile Van 2)",
      level2InspectionNotes: "Van dispatched on highway with safety cones, jack, and tools.",
      level3EngineerEscalated: false,
      requiredParts: [{ name: "Taper Roller Wheel Bearings", qty: 2, inStock: true }],
      evidenceMessageId: "SOS-MSG-" + Date.now().toString().slice(-4),
    };

    setEmergencyJobs((prev) => [newEmergency, ...prev]);
  };

  // WhatsApp and Ingestion handlers
  const handleSendMessage = async (payload: {
    text: string;
    mediaType?: "image" | "pdf" | "bill" | "voice" | "video";
    mediaUrl?: string;
    fileName?: string;
    sender?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: payload.text,
          mediaType: payload.mediaType,
          mediaUrl: payload.mediaUrl,
          fileName: payload.fileName,
          sender: payload.sender || "Rajesh Sharma (Owner)",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.record) {
          setMessages((prev) => [data.record, ...prev]);
        }
      } else {
        createLocalFallbackMessage(payload);
      }
    } catch (err) {
      console.warn("API ingest fallback:", err);
      createLocalFallbackMessage(payload);
    } finally {
      setIsLoading(false);
    }
  };

  const createLocalFallbackMessage = (payload: {
    text: string;
    mediaType?: "image" | "pdf" | "bill" | "voice" | "video";
    mediaUrl?: string;
    fileName?: string;
    sender?: string;
  }) => {
    const isPurchase =
      payload.mediaType === "bill" ||
      payload.text.toLowerCase().includes("maal") ||
      payload.text.toLowerCase().includes("aaya");
    const isEmergency =
      payload.text.toLowerCase().includes("emergency") ||
      payload.text.toLowerCase().includes("breakdown");

    const fallbackMsg: IngestionMessage = {
      id: "msg-" + Date.now().toString().slice(-6),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: payload.sender || "Rajesh Kumar (Owner)",
      senderRole: "Owner",
      rawText: payload.text,
      mediaType: payload.mediaType || null,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      classification: isEmergency ? "EMERGENCY" : isPurchase ? "PURCHASE" : "INVENTORY",
      confidence: 90,
      auditStatus: "NEEDS_REVIEW",
      evidenceHash: "SHA256-LOC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      extracted: {
        partName: payload.text.slice(0, 36),
        partNumber: null,
        quantity: isPurchase ? 2 : 1,
        rate: isPurchase ? 850 : null,
        totalAmount: isPurchase ? 1700 : null,
        dealerName: isPurchase ? "Sharma Auto Spares & Bearing Co." : null,
        vehicleNumber: isEmergency ? "UP32-XX-1234" : null,
        vehicleModel: isEmergency ? "Tata 1618 LPT" : null,
        issueDescription: isEmergency ? payload.text : null,
        urgency: isEmergency ? "EMERGENCY" : "MEDIUM",
        reviewNotes: "Operational update captured.",
        auditChecklist: [
          { item: "Evidence Recorded", status: "VERIFIED", detail: "Archived in operations stream" },
          { item: "Identification", status: "VERIFIED", detail: "Extracted from text description" },
        ],
      },
    };
    setMessages((prev) => [fallbackMsg, ...prev]);
  };

  const handleScanNewShelf = async (rackLabel: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/scan-shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rackLabel,
          photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.detectedItems && data.detectedItems.length > 0) {
          setShelfItems((prev) => [...data.detectedItems, ...prev]);
        }
      }
    } catch (err) {
      console.warn("Scan shelf error, adding local item:", err);
      const demoItem: DetectedShelfItem = {
        id: "shelf-" + Date.now(),
        rack: rackLabel,
        shelfLocation: `${rackLabel} — Rack Tier 2`,
        photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        partName: "Clutch Friction Disks (380mm Tata Genuine)",
        category: "Clutch System",
        estimatedQty: 7,
        confidence: 93,
        verificationStatus: "Verified",
        packagingStatus: "Original Sealed Box",
        notes: "Shelf discovery barcode verified",
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setShelfItems((prev) => [demoItem, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAudit = (updated: IngestionMessage) => {
    setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleFlagMissingBill = (messageId: string, reason: string) => {
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg) return;

    const newBill: MissingBillRecord = {
      id: "mb-" + Date.now().toString().slice(-4),
      partName: targetMsg.extracted.partName || targetMsg.rawText.slice(0, 30),
      dealerOrSupplier: targetMsg.extracted.dealerName || "Unknown Supplier",
      amount: targetMsg.extracted.totalAmount || 1800,
      approxDate: targetMsg.timestamp,
      notes: reason,
      sourceMessageId: targetMsg.id,
      resolved: false,
    };

    setMissingBills((prev) => [newBill, ...prev]);
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              auditStatus: "NEEDS_REVIEW",
              extracted: {
                ...m.extracted,
                reviewNotes: `⚠️ Flagged: ${reason}`,
              },
            }
          : m
      )
    );
  };

  const handleRejectMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              auditStatus: "REJECTED",
              auditVerifiedBy: "Rajesh Kumar (Owner)",
              extracted: {
                ...m.extracted,
                reviewNotes: "Rejected by Owner Admin — Duplicate entry.",
              },
            }
          : m
      )
    );
  };

  const handleVerifyShelfItem = (id: string, actualQty: number) => {
    setShelfItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, actualQty, verificationStatus: "Verified" } : item
      )
    );
  };

  const handleResolveMissingBill = (id: string) => {
    setMissingBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, resolved: true } : b))
    );
  };

  const handleAddLearningRule = (
    ruleData: Omit<ControlledLearningRule, "id" | "appliedCount" | "status">
  ) => {
    const newRule: ControlledLearningRule = {
      id: "rule-" + Date.now(),
      ...ruleData,
      appliedCount: 1,
      status: "Active",
    };
    setLearningRules((prev) => [newRule, ...prev]);
  };

  const handleResolveEmergency = (id: string) => {
    setEmergencyJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Resolved" } : j))
    );
  };

  const handleUpdatePurchaseOrder = (updatedOrder: PurchaseOrderRecord) => {
    setPurchaseOrders((prev) =>
      prev.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o))
    );
  };

  const handleSimulateDeliveryMessage = (orderId: string) => {
    const deliveryMsg: IngestionMessage = {
      id: "msg-" + Date.now().toString().slice(-6),
      timestamp: "Just now",
      sender: "Ramesh Ustad (Head Mechanic)",
      senderRole: "Head Mechanic",
      rawText: `${orderId} delivery verified! Viscus T, UC Pads, and Relay parts racked in godown.`,
      mediaType: "bill",
      mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
      fileName: `${orderId.toLowerCase()}_delivery_challan.jpg`,
      classification: "PURCHASE",
      confidence: 99,
      auditStatus: "VERIFIED",
      evidenceHash: "SHA256-WHATSAPP-PO-001-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      extracted: {
        partName: "Viscus T, UC Pads, Relay & Spares",
        quantity: 17,
        rate: 50600,
        totalAmount: 50600,
        dealerName: "Sharma Auto Spares & Bearing Co.",
        vehicleNumber: null,
        vehicleModel: null,
        issueDescription: null,
        urgency: "MEDIUM",
        reviewNotes: "✅ Verified against purchase order checklist.",
        auditChecklist: [
          { item: "PO Reference Matched", status: "VERIFIED", detail: orderId },
          { item: "Quantity Received Verified", status: "VERIFIED", detail: "17/17 Parts" },
        ],
      },
    };
    setMessages((prev) => [deliveryMsg, ...prev]);
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-secondary antialiased selection:bg-red-500 selection:text-white">
      {/* Top Section Switching */}
      {appSection === "public" ? (
        <PublicWebsite
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
          onOpenBooking={handleOpenBooking}
        />
      ) : (
        <PrivateApp
          currentRole={currentUserRole}
          onChangeRole={(r) => setCurrentUserRole(r)}
          onLogout={handleLogout}
          workItems={workItems}
          onOpenTimeline={handleOpenTimeline}
          onOpenVoiceInput={() => setVoiceModalOpen(true)}
          onOpenPhotoEvidence={() => setPhotoModalOpen(true)}
          onOpenEmergency={() => setEmergencyModalOpen(true)}
          onOpenNewJob={() => setNewJobModalOpen(true)}
          activeView={activePrivateView}
          onChangeActiveView={(view) => setActivePrivateView(view)}
        >
          {/* Sub-view switcher for specialized modules */}
          {activePrivateView === "audit" && (
            <AuditQueue
              messages={messages}
              onOpenAudit={(msg) => setAuditModalMessage(msg)}
              searchTerm={searchTerm}
            />
          )}

          {activePrivateView === "inventory" && (
            <ShelfInventoryScanner
              shelfItems={shelfItems}
              onVerifyItem={handleVerifyShelfItem}
              onScanNewShelf={handleScanNewShelf}
              isScanning={isLoading}
            />
          )}

          {activePrivateView === "emergency" && (
            <VehicleEmergencyHub
              emergencyJobs={emergencyJobs}
              vehicles={vehicles}
              onResolveEmergency={handleResolveEmergency}
            />
          )}

          {activePrivateView === "whatsapp" && (
            <WhatsAppFeed
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenAudit={(msg) => setAuditModalMessage(msg)}
              isProcessing={isLoading}
            />
          )}

          {activePrivateView === "lifecycle" && (
            <JobLifecycleEngine
              onSelectJobId={(id) => {
                const it = workItems.find((w) => w.id === id);
                if (it) setTimelineModalItem(it);
              }}
            />
          )}

          {activePrivateView === "learning" && (
            <ControlledLearning
              rules={learningRules}
              onAddRule={handleAddLearningRule}
              onDeleteRule={(id) => setLearningRules((prev) => prev.filter((r) => r.id !== id))}
            />
          )}

          {activePrivateView === "blueprint" && <MasterBlueprintCenter />}

          {activePrivateView === "trust" && <DataTrustCenter />}

          {activePrivateView === "purchase-orders" && (
            <PurchaseOrderSystem
              orders={purchaseOrders}
              onUpdateOrder={handleUpdatePurchaseOrder}
              onSimulateDeliveryMessage={handleSimulateDeliveryMessage}
            />
          )}

          {activePrivateView === "discovery" && (
            <DiscoveryReport
              report={realityReport}
              missingBills={missingBills.filter((b) => !b.resolved)}
              onResolveMissingBill={handleResolveMissingBill}
            />
          )}

          {activePrivateView === "evidence" && (
            <EvidenceExplorer
              messages={messages}
              onOpenAudit={(msg) => setAuditModalMessage(msg)}
            />
          )}
        </PrivateApp>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <EmergencyModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onDispatchTicket={handleEmergencyDispatch}
      />

      <BookServiceModal
        isOpen={bookServiceModalOpen}
        onClose={() => setBookServiceModalOpen(false)}
        initialServiceId={selectedBookingService}
      />

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onVoiceProcessed={handleVoiceProcessed}
      />

      <WorkTimelineModal
        item={timelineModalItem}
        isOpen={!!timelineModalItem}
        onClose={() => setTimelineModalItem(null)}
        onAddNote={handleAddTimelineNote}
        onCompleteStep={handleCompleteTimelineStep}
      />

      <PhotoEvidenceModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        workItems={workItems}
        onUploadPhoto={handlePhotoUpload}
      />

      <NewVehicleEntryModal
        isOpen={newJobModalOpen}
        onClose={() => setNewJobModalOpen(false)}
        onAddWorkItem={handleAddWorkItem}
      />

      {auditModalMessage && (
        <AuditReviewModal
          message={auditModalMessage}
          onClose={() => setAuditModalMessage(null)}
          onApprove={handleApproveAudit}
          onFlag={handleFlagMissingBill}
          onReject={handleRejectMessage}
        />
      )}
    </div>
  );
}
