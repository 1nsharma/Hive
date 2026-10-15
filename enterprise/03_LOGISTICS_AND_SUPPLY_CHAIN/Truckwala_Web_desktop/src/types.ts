export type Language = 'en' | 'hi';

export type VehicleCategory = 
  | 'Multi-Axle Trailer (16+ Wheeler)'
  | '10–14 Wheeler Heavy Truck'
  | 'Heavy Tipper / Dumper'
  | 'Tipper / Dumper'
  | 'Container Carrier'
  | 'Container / Cargo Carrier'
  | 'Liquid / Gas Tanker'
  | 'Light Commercial Vehicle (LCV / Pick-up)'
  | 'Light Commercial Vehicle (LCV / Pickup)'
  | 'Commercial Bus / Coach'
  | 'Heavy Bus / Highway Coach';

export interface ServiceItem {
  id: string;
  priority: number;
  iconName: string;
  icon?: any;
  titleEn: string;
  titleHi: string;
  shortDescEn: string;
  shortDescHi: string;
  fullDescEn: string;
  fullDescHi: string;
  bulletPointsEn?: string[];
  bulletPointsHi?: string[];
  commonIssuesEn: string[];
  commonIssuesHi: string[];
  supportedVehicles: string[];
  estimatedTimeEn: string;
  estimatedTimeHi: string;
  priceNoteEn: string;
  priceNoteHi: string;
  actionTextEn: string;
  actionTextHi: string;
  colorClass: string;
}

export interface WorkshopConfig {
  name: string;
  phoneDisplay: string;
  phoneClean: string;
  whatsappNumber: string;
  addressEn: string;
  addressHi: string;
  googleMapsUrl: string;
  googleReviewUrl: string;
  emergencyRadiusKm: number;
  emergencyVanCount: number;
  specialties: string[];
  stats?: {
    vehiclesHelped: string;
    emergencySupport: string;
    happyCustomers: string;
    highwayCoverage: string;
  };
}

export interface LeadSubmission {
  id: string;
  receivedAt: string;
  formType: 'breakdown' | 'repair' | 'parts' | 'direct' | 'whatsapp';
  vehicleType?: string;
  vehicleNumber?: string;
  phone?: string;
  problem?: string;
  services?: string[];
  partName?: string;
  location?: {
    lat: number;
    lng: number;
    addressText?: string;
    accuracy?: number;
  };
  hasVoiceNote?: boolean;
  voiceNoteDuration?: number;
  voiceNoteBase64?: string;
  hasPhoto?: boolean;
  photoBase64?: string;
  photoName?: string;
  urgency?: 'emergency' | 'high' | 'normal';
  status: 'new' | 'contacted' | 'dispatched' | 'resolved';
  technicianNotes?: string;
  rlDispatchMetadata?: {
    action: RescueUnitAction;
    unitName: string;
    confidence: number;
    etaMinutes: number;
    recommendedKit: string[];
    stateKey: string;
  };
}

export type TrackingEventType =
  | 'PAGE_VIEW'
  | 'SERVICE_VIEW'
  | 'CALL_CLICK'
  | 'WHATSAPP_CLICK'
  | 'MAP_CLICK'
  | 'REVIEW_CLICK'
  | 'REQUEST_STARTED'
  | 'REQUEST_SUBMITTED'
  | 'LOCATION_SHARED'
  | 'VEHICLE_NUMBER_SUBMITTED'
  | 'PHOTO_UPLOADED'
  | 'VIDEO_UPLOADED'
  | 'VOICE_MESSAGE'
  | 'SERVICE_SELECTED'
  | 'DIRECTIONS_CLICK'
  | 'phone_click'
  | 'call'
  | 'whatsapp_click'
  | 'whatsapp'
  | 'directions_click'
  | 'directions'
  | 'review_click'
  | 'form_submission'
  | 'location_shared'
  | 'location_share'
  | 'tour_start'
  | 'voice_recorded'
  | 'photo_upload'
  | 'video_upload'
  | string;

export interface TrackingEvent {
  id: string;
  timestamp: string;
  eventType: TrackingEventType;
  label?: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalLeads: number;
  todayLeadsCount: number;
  emergencyCount: number;
  partsCount: number;
  totalCalls: number;
  totalWhatsApp: number;
  totalDirections: number;
  locationShares: number;
  photoUploads: number;
}

// Vehicle OS Pipeline & History types
export interface VehicleJobRecord {
  jobId: string;
  date: string;
  serviceCategory: string;
  problemSummary: string;
  technicianAssigned: string;
  status: 'In Progress' | 'Completed' | 'Van Dispatched' | 'Pending Parts';
  partsReplaced: string[];
  invoiceAmount?: string;
  invoiceId?: string;
  mileageKm?: string;
}

export interface VehicleRecord {
  vehicleNumber: string;
  model: string;
  fleetOwner: string;
  activeTicket?: {
    leadId: string;
    reportedIssue: string;
    status: string;
    locationName: string;
    etaMinutes: number;
    dispatchedVan: string;
  };
  history: VehicleJobRecord[];
}

// ----------------------------------------------------
// REINFORCEMENT LEARNING DISPATCH ENGINE TYPES
// ----------------------------------------------------

export type RescueUnitAction = 
  | 'VAN_1_RAPID'
  | 'VAN_2_HEAVY_AIR'
  | 'VAN_3_HYDRAULIC_CRANE'
  | 'VAN_4_ECU_DIAG';

export interface RescueUnitMetadata {
  id: RescueUnitAction;
  name: string;
  nameHi: string;
  callsign: string;
  vanNumber: string;
  primaryTech: string;
  equipment: string[];
  equipmentHi: string[];
  baseEtaMinutes: number;
  specialty: string;
  specialtyHi: string;
  color: string;
}

export interface RLDispatchState {
  vehicleCategory: string;
  problemTag: string;
  corridorZone: 'zone_a_near' | 'zone_b_corridor' | 'zone_c_remote';
  timeSlot: 'day' | 'night_peak';
}

export interface RLRecommendation {
  actionId: RescueUnitAction;
  unit: RescueUnitMetadata;
  confidence: number;
  qScore: number;
  qValues: Record<RescueUnitAction, number>;
  estimatedArrivalMin: number;
  estimatedFixMin: number;
  firstTimeFixProb: number;
  recommendedKit: string[];
  stateKey: string;
  explanationEn: string;
  explanationHi: string;
}

export interface RLEpisodeLog {
  episode: number;
  stateKey: string;
  action: RescueUnitAction;
  reward: number;
  resolutionTimeMin: number;
  firstTimeFix: boolean;
  transporterRating: number;
  timestamp: string;
}

export interface RLPolicyState {
  qTable: Record<string, Record<RescueUnitAction, number>>;
  totalEpisodes: number;
  avgReward: number;
  recentRewards: { episode: number; reward: number; action: RescueUnitAction; timestamp: string }[];
  hyperparams: {
    learningRate: number;
    discountFactor: number;
    epsilon: number;
  };
  lastTrainedAt: string;
  convergenceScore: number;
}

