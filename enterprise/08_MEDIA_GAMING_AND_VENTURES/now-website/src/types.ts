export type ClassificationType =
  | "INFORMATION"
  | "REQUEST"
  | "PURCHASE"
  | "SALE"
  | "INVENTORY"
  | "VEHICLE_ISSUE"
  | "EMERGENCY"
  | "PAYMENT"
  | "DEALER"
  | "CUSTOMER"
  | "TECHNICAL"
  | "OTHER";

export type AuditStatus = "NEEDS_REVIEW" | "VERIFIED" | "FLAGGED" | "REJECTED";

export interface AuditCheckItem {
  item: string;
  status: "VERIFIED" | "UNCERTAIN" | "PENDING" | "FLAGGED";
  detail: string;
}

export interface IngestionMessage {
  id: string;
  timestamp: string;
  sender: string;
  senderRole: "Owner" | "Head Mechanic" | "Driver" | "Shop Boy" | "Dealer";
  rawText: string;
  mediaType: "image" | "pdf" | "bill" | "voice" | "video" | null;
  mediaUrl?: string | null;
  mediaThumbnail?: string;
  voiceDuration?: string;
  fileName?: string | null;
  evidenceHash: string;
  classification: ClassificationType;
  confidence: number;
  extracted: {
    partName: string | null;
    partNumber?: string | null;
    quantity: number | null;
    rate: number | null;
    totalAmount: number | null;
    dealerName: string | null;
    vehicleNumber: string | null;
    vehicleModel: string | null;
    issueDescription: string | null;
    urgency: "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";
    reviewNotes: string;
    auditChecklist: AuditCheckItem[];
  };
  auditStatus: AuditStatus;
  auditVerifiedBy?: string;
  auditVerifiedAt?: string;
  finalRecordId?: string;
  linkedJobCardId?: string;
}

export interface DetectedShelfItem {
  id: string;
  rack: string;
  shelfLocation: string;
  partName: string;
  category: string;
  estimatedQty: number;
  actualQty?: number;
  confidence: number;
  verificationStatus: "Pending" | "Verified" | "Manual Check Required";
  packagingStatus: "Original Sealed Box" | "Unboxed / Loose" | "Dusty Old Stock" | "Handwritten Tag";
  photoUrl: string;
  notes?: string;
  lastUpdated: string;
}

export interface InventoryItem {
  id: string;
  partName: string;
  partNumber: string;
  category: string;
  stockQty: number;
  minThreshold: number;
  avgCost: number;
  lastDealer: string;
  shelfLocation: string;
  evidenceId: string;
  status: "Verified Stock" | "Discovery Audit" | "Unverified Estimate";
}

export interface VehicleRecord {
  id: string;
  vehicleNumber: string;
  model: string;
  vehicleType: "Truck" | "Bus" | "Trailer" | "LCV" | "Pickup" | "Tipper" | "Hauler";
  clientOrFleet: string;
  driverName: string;
  driverPhone: string;
  currentLocation: string;
  status: "On Road" | "In Workshop" | "Highway Breakdown" | "Job Completed";
  totalJobs: number;
  lastServiceDate: string;
}

export interface EmergencyJob {
  id: string;
  vehicleNumber: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  highwayLocation: string;
  gpsCoords?: string;
  problemSummary: string;
  urgency: "EMERGENCY" | "HIGH" | "CRITICAL";
  level1DriverReport: string;
  level2TechnicianAssigned: string;
  level2InspectionNotes?: string;
  level3EngineerEscalated?: boolean;
  level3EngineerDiagnosis?: string;
  requiredParts: { name: string; qty: number; inStock: boolean; partId?: string }[];
  status: "Dispatched" | "Diagnosing" | "Parts In Transit" | "Repair In Progress" | "Resolved";
  reportedAt: string;
  evidenceMessageId: string;
}

export interface MissingBillRecord {
  id: string;
  partName: string;
  amount: number;
  approxDate: string;
  dealerOrSupplier: string;
  sourceMessageId: string;
  resolved: boolean;
  notes: string;
}

export interface ControlledLearningRule {
  id: string;
  rawInputPattern: string;
  correctedOutput: string;
  context: "Part Mapping" | "Dealer Alias" | "Vehicle Model" | "Category";
  learnedFrom: string;
  dateLearned: string;
  appliedCount: number;
  status: "Active" | "Under Review" | "Disabled";
}

export interface RealityReport {
  generatedDate: string;
  discoveryDaysElapsed: number;
  totalUniquePartsDiscovered: number;
  uncountedStockEstimatedValue: number;
  identifiedDealersCount: number;
  missingBillsCount: number;
  missingBillsTotalValue: number;
  duplicateEntriesResolved: number;
  handwrittenRecordsDigitized: number;
  dormantStockValue: number;
  shelfPhotosScanned: number;
}

export interface PurchaseOrderItem {
  itemId: number;
  partName: string;
  code?: string;
  quantityOrdered: number;
  quantityReceived: number;
  ratePerUnit: number;
  totalAmount: number;
  status: "PENDING" | "RECEIVED" | "PARTIAL" | "DAMAGED";
  condition: "GOOD" | "DAMAGED" | "WRONG_ITEM" | "PENDING_CHECK";
  receivedDate?: string;
  verifiedBy?: string;
}

export interface POAuditStep {
  check: string;
  passed: boolean;
  note: string;
}

export interface POAuditTrailEntry {
  timestamp: string;
  action: "ORDER_CREATED" | "GOODS_RECEIVED" | "PARTIAL_RECEIVED" | "QUALITY_CHECKED" | "PAYMENT_RECORDED" | "INVENTORY_SYNCED";
  actionBy: string;
  details: string;
  evidenceType?: "WHATSAPP_PHOTO" | "BILL_PDF" | "TRANSACTION_RECEIPT" | "VOICE_NOTE";
  evidenceUrl?: string;
}

export interface PurchaseOrderRecord {
  orderId: string; // e.g. "PO-2024-001"
  dealerId: string;
  dealerName: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  status: "PENDING" | "PARTIAL" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
  paymentMode: "Credit" | "Cash" | "UPI" | "Bank Transfer";
  transactionId?: string;
  createdBy: string;
  items: PurchaseOrderItem[];
  auditChecklist: POAuditStep[];
  auditTrail: POAuditTrailEntry[];
  evidencePhotos: string[];
  billPdf?: string;
}

export type UserRole = "owner" | "worker" | "engineer" | "admin" | "OWNER" | "TECHNICIAN" | "CUSTOMER" | "AI_WORKER";

export interface DataTrustPrinciple {
  id: number;
  title: string;
  hindiTitle: string;
  description: string;
  technicalEnforcement: string;
  status: "ACTIVE_ENFORCED";
}

export interface DataPrivacyBoundary {
  entity: string;
  hindiName: string;
  classification: "INTERNAL_PROPRIETARY" | "OPERATIONAL" | "CUSTOMER_SCOPED";
  ownerAccess: "FULL_READ_WRITE";
  technicianAccess: "MASKED" | "SCOPED_VIEW" | "NO_ACCESS";
  customerAccess: "NO_ACCESS" | "OWN_VEHICLE_ONLY";
  aiAccess: "EPHEMERAL_TASK_ONLY" | "PROMPT_MASKED" | "ZERO_RETENTION";
  leakageProtection: string;
}

export interface AccessAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  targetResource: string;
  dataScope: string;
  privacyShieldStatus: "PASSED_RESTRICTED" | "ENCRYPTED_ISOLATED" | "MASKED_APPLIED";
  hash: string;
}

export type JobStage =
  | "ISSUE"
  | "INSPECTION"
  | "ESTIMATE"
  | "APPROVAL"
  | "PARTS"
  | "MECHANIC_WORK"
  | "TEST"
  | "FINAL";

export interface EvidenceAttachment {
  id: string;
  type: "PHOTO" | "VIDEO" | "VOICE" | "WHATSAPP_MESSAGE" | "BILL" | "INVOICE" | "TECHNICIAN_REPORT";
  title: string;
  content: string;
  author: string;
  timestamp: string;
  fileUrl?: string;
  sha256: string;
}

export interface JobStageEvent {
  stage: JobStage;
  title: string;
  hindiTitle: string;
  description: string;
  actor: string;
  role: string;
  timestamp: string;
  status: "COMPLETED" | "ACTIVE" | "PENDING";
  evidence: EvidenceAttachment[];
  metadata?: Record<string, any>;
}

export interface OperationalJob {
  id: string;
  jobNumber: string;
  vehicleNumber: string;
  vehicleModel: string;
  fleetOwner: string;
  driverName?: string;
  driverPhone?: string;
  currentStage: JobStage;
  stages: Record<JobStage, JobStageEvent>;
  estimate: {
    parts: { name: string; qty: number; unitPrice: number; total: number }[];
    labour: number;
    totalEstimate: number;
    status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED";
    approvedBy?: string;
    approvalTimestamp?: string;
  };
  actual: {
    parts: { name: string; partNumber: string; qty: number; actualCost: number; supplier: string; issuedTimestamp: string }[];
    labour: { mechanic: string; workHours: number; cost: number }[];
    totalActual: number;
    testReport?: { tester: string; result: "PASSED" | "FAILED"; notes: string; testTimestamp: string };
    finalStatus: "WORK_COMPLETED" | "IN_PROGRESS";
    variance: number;
    committedTimestamp?: string;
  };
  provenanceTrail: {
    step: string;
    source: string;
    evidenceRef: string;
    who: string;
    when: string;
  }[];
}

export interface WhatsAppCandidateEvent {
  id: string;
  rawMessage: string;
  sender: string;
  senderPhone: string;
  senderRole: "DRIVER" | "MECHANIC" | "FLEET_OWNER" | "PARTS_STORE";
  timestamp: string;
  mediaType: "text" | "photo" | "voice";
  imageUrl?: string;
  aiInterpretation: {
    detectedVehicle?: string;
    detectedIntent: string;
    suggestedWorkItem: string;
    suggestedPart?: string;
    confidence: number;
    status: "NEEDS_VERIFICATION" | "HUMAN_CONFIRMED" | "REJECTED";
  };
}

// Master Blueprint & Extraction Test Types
export interface HandwrittenBillItem {
  id: string;
  rawHandwrittenSnippet: string;
  hindiPartName: string;
  englishStandardName: string;
  oemNumberMatch?: string;
  category: "ENGINE" | "TRANSMISSION" | "SUSPENSION" | "BRAKES" | "ELECTRICAL" | "CONSUMABLES";
  qty: number;
  unitRate: number;
  lineTotal: number;
  statedTotal: number;
  mathDiscrepancy: boolean;
  ocrConfidence: number; // e.g. 96
  boundingBox: { x: number; y: number; width: number; height: number }; // percentage coords
  inventoryMatch: {
    matchedId?: string;
    suggestedBin: string;
    currentStock: number;
    costVariancePct?: number;
  };
}

export interface HandwrittenBillRecord {
  id: string;
  billNumber: string;
  billDate: string;
  supplierName: string;
  supplierLocation: string;
  supplierPhone?: string;
  vehicleRef?: string;
  paperType: "KACHI_PARCHI" | "PRINTED_STAMPED_BILL" | "DIARY_NOTE" | "CARBON_COPY";
  paperCondition: string;
  rawTextHindiHinglish: string;
  imageUrl: string;
  items: HandwrittenBillItem[];
  subtotalCalculated: number;
  subtotalStated: number;
  discrepancyAmount: number;
  gstOrTax: number;
  grandTotal: number;
  verificationStatus: "PENDING_VERIFICATION" | "VERIFIED_COMMITTED" | "FLAGGED_DISCREPANCY";
  verifiedBy?: string;
  verifiedTimestamp?: string;
  sha256Hash: string;
  auditTrailId: string;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary?: boolean;
  isForeignKey?: boolean;
  references?: string;
  description: string;
  example: string;
}

export interface DatabaseTableDefinition {
  tableName: string;
  module: string;
  description: string;
  columns: DatabaseColumn[];
  indexes: string[];
  constraints: string[];
  sampleSqlDDL: string;
}

export interface DatabaseModule {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  description: string;
  tables: DatabaseTableDefinition[];
}

export interface ApiEndpointSpec {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  summary: string;
  authRequired: boolean;
  requestPayloadExample?: string;
  responseExample: string;
  layer: "LAYER_1_RAW" | "LAYER_2_AI" | "LAYER_3_MASTER";
}

export interface UserProfile {
  name: string;
  role: UserRole;
  phone: string;
  initial: string;
  title: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  detail?: string;
  iconType: "mic" | "cpu" | "wrench" | "check" | "package" | "settings" | "camera" | "clock" | "shield";
  completed: boolean;
  statusBadge?: string;
  stockChange?: string;
  evidenceUrl?: string;
}

export interface WorkItem {
  id: string;
  vehicleNumber: string;
  vehicleModel: string;
  issue: string;
  category: "Clutch" | "Engine" | "Brake" | "Diagnostics" | "Suspension" | "Electrical";
  status: "Needs Action" | "In Process" | "Assigned" | "Completed";
  partsStatus: "OK" | "Pending" | "Issued";
  estimateAmount: number;
  actualAmount?: number;
  assignedTechnician?: string;
  reportedTime: string;
  totalEvents: number;
  evidenceCount: number;
  lastUpdate: string;
  timeline: TimelineEvent[];
}



