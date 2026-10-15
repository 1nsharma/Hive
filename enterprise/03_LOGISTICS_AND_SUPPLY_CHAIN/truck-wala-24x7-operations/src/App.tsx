import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
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
import {
  IngestionMessage,
  DetectedShelfItem,
  EmergencyJob,
  RealityReport,
  MissingBillRecord,
  ControlledLearningRule,
  VehicleRecord,
  PurchaseOrderRecord,
} from "./types";

export default function App() {
  // Application Data States
  const [messages, setMessages] = useState<IngestionMessage[]>(INITIAL_MESSAGES);
  const [shelfItems, setShelfItems] = useState<DetectedShelfItem[]>(INITIAL_DETECTED_SHELVES);
  const [emergencyJobs, setEmergencyJobs] = useState<EmergencyJob[]>(INITIAL_EMERGENCY_JOBS);
  const [realityReport, setRealityReport] = useState<RealityReport>(INITIAL_REALITY_REPORT);
  const [missingBills, setMissingBills] = useState<MissingBillRecord[]>(INITIAL_MISSING_BILLS);
  const [learningRules, setLearningRules] = useState<ControlledLearningRule[]>(INITIAL_LEARNING_RULES);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(INITIAL_VEHICLES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);

  // UI View States
  const [activeView, setActiveView] = useState<
    "dashboard" | "whatsapp" | "job-flow" | "blueprint" | "purchase-orders" | "audit-queue" | "discovery" | "shelf-scanner" | "evidence" | "vehicles" | "learning" | "data-trust"
  >("blueprint");
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [auditModalMessage, setAuditModalMessage] = useState<IngestionMessage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Derived counts
  const pendingAuditsCount = messages.filter((m) => m.auditStatus === "NEEDS_REVIEW").length;
  const missingBillsCount = missingBills.filter((b) => !b.resolved).length;
  const emergencyCount = emergencyJobs.filter((j) => j.status !== "Resolved").length;

  // Ingestion handler: sends message to /api/ingest
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

          // If it was an emergency, also add to emergency jobs
          if (data.record.classification === "EMERGENCY" && data.record.extracted?.vehicleNumber) {
            const newJob: EmergencyJob = {
              id: "EMG-" + Date.now().toString().slice(-4),
              vehicleNumber: data.record.extracted.vehicleNumber,
              vehicleModel: "Commercial Heavy Transport",
              highwayLocation: "Reported via WhatsApp Live",
              driverName: data.record.sender,
              driverPhone: "+91 98120 XXXXX",
              reportedAt: "Just now",
              status: "Dispatched",
              urgency: "EMERGENCY",
              problemSummary: data.record.rawText,
              level1DriverReport: data.record.rawText,
              level2TechnicianAssigned: "Ramesh Ustad (Mobile Van 4)",
              level2InspectionNotes: "Mobile unit en route with diagnostic tools and replacement parts.",
              level3EngineerEscalated: false,
              level3EngineerDiagnosis: "Check wheel hub torque and air line pressure before clearance.",
              requiredParts: [
                { name: data.record.extracted.partName || "Replacement Bearing Set", qty: 1, inStock: true }
              ],
              evidenceMessageId: data.record.id,
            };
            setEmergencyJobs((prev) => [newJob, ...prev]);
          }
        }
      } else {
        createLocalFallbackMessage(payload);
      }
    } catch (err) {
      console.warn("API ingest error, falling back locally:", err);
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
    const isPurchase = payload.mediaType === "bill" || payload.text.toLowerCase().includes("maal") || payload.text.toLowerCase().includes("aaya");
    const isEmergency = payload.text.toLowerCase().includes("emergency") || payload.text.toLowerCase().includes("breakdown");

    const fallbackMsg: IngestionMessage = {
      id: "msg-" + Date.now().toString().slice(-6),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: payload.sender || "Rajesh Sharma (Owner)",
      senderRole: "Owner",
      rawText: payload.text,
      mediaType: payload.mediaType || null,
      mediaUrl: payload.mediaUrl,
      fileName: payload.fileName,
      classification: isEmergency ? "EMERGENCY" : isPurchase ? "PURCHASE" : "INVENTORY",
      confidence: 88,
      auditStatus: "NEEDS_REVIEW",
      evidenceHash: "SHA256-LOC-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      extracted: {
        partName: payload.text.slice(0, 36),
        partNumber: null,
        quantity: isPurchase ? 4 : 1,
        rate: isPurchase ? 850 : null,
        totalAmount: isPurchase ? 3400 : null,
        dealerName: isPurchase ? "Sharma Auto Spares & Bearing Co." : null,
        vehicleNumber: isEmergency ? "RJ14-GB-4412" : null,
        vehicleModel: isEmergency ? "Tata Signa 4825.TK" : null,
        issueDescription: isEmergency ? payload.text : null,
        urgency: isEmergency ? "EMERGENCY" : "MEDIUM",
        reviewNotes: isPurchase
          ? "⚠️ Purchase detected from message. Quantity and rate extracted; requires Owner verification."
          : "Operational update captured.",
        auditChecklist: [
          { item: "Original Evidence Attached", status: "VERIFIED", detail: "Preserved in operations log" },
          { item: "Part Identification", status: "VERIFIED", detail: "Extracted from text description" },
          { item: "Quantity & Rate Check", status: isPurchase ? "UNCERTAIN" : "VERIFIED", detail: "Check against invoice" },
          { item: "Supplier Matched", status: "VERIFIED", detail: "Mapped in dealer registry" },
        ],
      },
    };
    setMessages((prev) => [fallbackMsg, ...prev]);
  };

  // Shelf Scanner handler: calls /api/scan-shelf
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
      console.warn("Scan shelf error, adding demo item:", err);
      const demoItem: DetectedShelfItem = {
        id: "shelf-" + Date.now(),
        rack: rackLabel,
        shelfLocation: `${rackLabel} — Box Stack 4`,
        photoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
        partName: "Front Brake Caliper Repair Kits (BBL Genuine)",
        category: "Braking System",
        estimatedQty: 6,
        confidence: 84,
        verificationStatus: "Pending",
        packagingStatus: "Original Sealed Box",
        notes: "Found during shelf discovery run",
        lastUpdated: new Date().toISOString().split("T")[0],
      };
      setShelfItems((prev) => [demoItem, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  // Audit Approval
  const handleApproveAudit = (updated: IngestionMessage) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  // Audit Flag as Missing Bill
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

  // Audit Reject
  const handleRejectMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              auditStatus: "REJECTED",
              auditVerifiedBy: "Rajesh Sharma (Owner)",
              extracted: {
                ...m.extracted,
                reviewNotes: "Rejected by Owner Admin — Duplicate or invalid entry.",
              },
            }
          : m
      )
    );
  };

  // Shelf item verification
  const handleVerifyShelfItem = (id: string, actualQty: number) => {
    setShelfItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              actualQty,
              verificationStatus: "Verified",
            }
          : item
      )
    );
  };

  // Missing bill resolution
  const handleResolveMissingBill = (id: string) => {
    setMissingBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, resolved: true } : b))
    );
  };

  // Controlled learning rule addition
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

  // Emergency resolution
  const handleResolveEmergency = (id: string) => {
    setEmergencyJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: "Resolved",
            }
          : j
      )
    );
  };

  // Purchase order update handler
  const handleUpdatePurchaseOrder = (updatedOrder: PurchaseOrderRecord) => {
    setPurchaseOrders((prev) =>
      prev.map((o) => (o.orderId === updatedOrder.orderId ? updatedOrder : o))
    );
  };

  // Simulate WhatsApp Delivery Receipt Message for a PO
  const handleSimulateDeliveryMessage = (orderId: string) => {
    const deliveryMsg: IngestionMessage = {
      id: "msg-" + Date.now().toString().slice(-6),
      timestamp: "Just now",
      sender: "Ramesh Ustad (Head Mechanic)",
      senderRole: "Head Mechanic",
      rawText: `${orderId} maal aa gaya! 17/17 items received from Sharma Auto Spares. Viscus T, UC Pads, Relay sab physical inventory me check karke godown me rakh diya hai.`,
      mediaType: "bill",
      mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60",
      fileName: `${orderId.toLowerCase()}_delivery_challan.jpg`,
      classification: "PURCHASE",
      confidence: 99,
      auditStatus: "VERIFIED",
      evidenceHash: "SHA256-WHATSAPP-PO-001-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      extracted: {
        partName: "Viscus T, UC Pads, Relay & 14 other parts",
        quantity: 17,
        rate: 50600,
        totalAmount: 50600,
        dealerName: "Sharma Auto Spares & Bearing Co.",
        vehicleNumber: null,
        vehicleModel: null,
        issueDescription: null,
        urgency: "MEDIUM",
        reviewNotes: "✅ 17/17 Line items matched against handwritten PO-2024-001. All checklist rules passed.",
        auditChecklist: [
          { item: "Bill matches purchase order", status: "VERIFIED", detail: "17 items match PO-2024-001" },
          { item: "Quantity received = Quantity ordered", status: "VERIFIED", detail: "17/17 parts verified" },
          { item: "Rate matches agreed rate", status: "VERIFIED", detail: "₹50,600 verified" },
          { item: "Quality check passed", status: "VERIFIED", detail: "Ramesh Ustad verified good condition" },
        ],
      },
    };
    setMessages((prev) => [deliveryMsg, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Navigation & Status Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        splitMode={splitMode}
        setSplitMode={setSplitMode}
        pendingAuditsCount={pendingAuditsCount}
        missingBillsCount={missingBillsCount}
        emergencyCount={emergencyCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Body Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {splitMode ? (
          /* Split Screen: WhatsApp Operations Feed on Left, Admin Portal on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[680px]">
            {/* Left Col: Live WhatsApp Feed (5 cols) */}
            <div className="lg:col-span-5 h-full">
              <WhatsAppFeed
                messages={messages}
                onSendMessage={handleSendMessage}
                onSelectForAudit={(msg) => setAuditModalMessage(msg)}
                isLoading={isLoading}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                searchTerm={searchTerm}
              />
            </div>

            {/* Right Col: Admin Operations Core (7 cols) */}
            <div className="lg:col-span-7 h-full overflow-y-auto pr-1">
              {activeView === "dashboard" && (
                <AdminDashboard
                  onOpenAudit={(msg) => setAuditModalMessage(msg)}
                  onNavigateTab={(tab) => setActiveView(tab)}
                  pendingMessages={messages.filter((m) => m.auditStatus === "NEEDS_REVIEW")}
                  emergencyJobs={emergencyJobs}
                />
              )}
              {activeView === "purchase-orders" && (
                <PurchaseOrderSystem
                  orders={purchaseOrders}
                  onUpdateOrder={handleUpdatePurchaseOrder}
                  onSimulateDeliveryMessage={handleSimulateDeliveryMessage}
                />
              )}
              {activeView === "audit-queue" && (
                <AuditQueue
                  messages={messages}
                  onOpenAudit={(msg) => setAuditModalMessage(msg)}
                  searchTerm={searchTerm}
                />
              )}
              {activeView === "discovery" && (
                <DiscoveryReport
                  report={realityReport}
                  missingBills={missingBills.filter((b) => !b.resolved)}
                  onResolveMissingBill={handleResolveMissingBill}
                />
              )}
              {activeView === "shelf-scanner" && (
                <ShelfInventoryScanner
                  shelfItems={shelfItems}
                  onVerifyItem={handleVerifyShelfItem}
                  onScanNewShelf={handleScanNewShelf}
                  isScanning={isLoading}
                />
              )}
              {activeView === "evidence" && (
                <EvidenceExplorer
                  messages={messages}
                  onOpenAudit={(msg) => setAuditModalMessage(msg)}
                />
              )}
              {activeView === "vehicles" && (
                <VehicleEmergencyHub
                  emergencyJobs={emergencyJobs}
                  vehicles={vehicles}
                  onResolveEmergency={handleResolveEmergency}
                />
              )}
              {activeView === "learning" && (
                <ControlledLearning
                  rules={learningRules}
                  onAddRule={handleAddLearningRule}
                  onDeleteRule={(id) => setLearningRules((prev) => prev.filter((r) => r.id !== id))}
                />
              )}
              {activeView === "data-trust" && (
                <DataTrustCenter />
              )}
              {activeView === "job-flow" && (
                <JobLifecycleEngine />
              )}
              {activeView === "blueprint" && (
                <MasterBlueprintCenter />
              )}
            </div>
          </div>
        ) : (
          /* Single View Mode */
          <div className="w-full">
            {activeView === "dashboard" && (
              <AdminDashboard
                onOpenAudit={(msg) => setAuditModalMessage(msg)}
                onNavigateTab={(tab) => setActiveView(tab)}
                pendingMessages={messages.filter((m) => m.auditStatus === "NEEDS_REVIEW")}
                emergencyJobs={emergencyJobs}
              />
            )}

            {activeView === "blueprint" && (
              <MasterBlueprintCenter />
            )}

            {activeView === "job-flow" && (
              <JobLifecycleEngine />
            )}

            {activeView === "whatsapp" && (
              <div className="h-[calc(100vh-160px)] min-h-[640px] max-w-4xl mx-auto">
                <WhatsAppFeed
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onSelectForAudit={(msg) => setAuditModalMessage(msg)}
                  isLoading={isLoading}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  searchTerm={searchTerm}
                />
              </div>
            )}

            {activeView === "purchase-orders" && (
              <PurchaseOrderSystem
                orders={purchaseOrders}
                onUpdateOrder={handleUpdatePurchaseOrder}
                onSimulateDeliveryMessage={handleSimulateDeliveryMessage}
              />
            )}

            {activeView === "audit-queue" && (
              <AuditQueue
                messages={messages}
                onOpenAudit={(msg) => setAuditModalMessage(msg)}
                searchTerm={searchTerm}
              />
            )}

            {activeView === "discovery" && (
              <DiscoveryReport
                report={realityReport}
                missingBills={missingBills.filter((b) => !b.resolved)}
                onResolveMissingBill={handleResolveMissingBill}
              />
            )}

            {activeView === "shelf-scanner" && (
              <ShelfInventoryScanner
                shelfItems={shelfItems}
                onVerifyItem={handleVerifyShelfItem}
                onScanNewShelf={handleScanNewShelf}
                isScanning={isLoading}
              />
            )}

            {activeView === "evidence" && (
              <EvidenceExplorer
                messages={messages}
                onOpenAudit={(msg) => setAuditModalMessage(msg)}
              />
            )}

            {activeView === "vehicles" && (
              <VehicleEmergencyHub
                emergencyJobs={emergencyJobs}
                vehicles={vehicles}
                onResolveEmergency={handleResolveEmergency}
              />
            )}

            {activeView === "learning" && (
              <ControlledLearning
                rules={learningRules}
                onAddRule={handleAddLearningRule}
                onDeleteRule={(id) => setLearningRules((prev) => prev.filter((r) => r.id !== id))}
              />
            )}

            {activeView === "data-trust" && (
              <DataTrustCenter />
            )}
          </div>
        )}
      </main>

      {/* Audit Review Modal */}
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
