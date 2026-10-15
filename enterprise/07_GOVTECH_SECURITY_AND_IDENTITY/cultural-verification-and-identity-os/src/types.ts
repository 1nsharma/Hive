export type ClaimCategory = 'food' | 'craft' | 'oral_history' | 'ritual' | 'trade';
export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'DISPUTED' | 'DOCUMENTED' | 'RESTRICTED';
export type ConsentRule = 'PUBLIC' | 'COMMUNITY_RESTRICTED' | 'SACRED_ACCESS_CONTROL';

export interface EvidenceItem {
  id: string;
  type: 'gazetteer' | 'oral_audio' | 'archival_photo' | 'academic' | 'newspaper';
  title: string;
  source: string;
  year: string;
  excerpt: string;
  confidence: number;
}

export interface CommunityReview {
  id: string;
  name: string;
  designation: string;
  locality: string;
  action: 'CONFIRMED' | 'CORRECTED' | 'DISPUTED';
  notes: string;
  timestamp: string;
}

export interface ExpertReview {
  id: string;
  name: string;
  institution: string;
  field: string;
  verdict: 'ENDORSED' | 'QUALIFIED' | 'INSUFFICIENT_EVIDENCE';
  rationale: string;
}

export interface CulturalClaim {
  id: string;
  entityName: string;
  hindiName: string;
  category: ClaimCategory;
  locality: string;
  establishedEra: string;
  statement: string;
  statementHindi: string;
  evidence: EvidenceItem[];
  communityReviews: CommunityReview[];
  expertReviews: ExpertReview[];
  status: VerificationStatus;
  confidenceScore: number;
  consent: ConsentRule;
  lastReviewed: string;
  founderStory: string;
  traditionalMethod: string;
  economicOutcome: {
    experienceTitle: string;
    priceINR: number;
    artisanSharePercent: number;
    communityPreservationFundPercent: number;
    platformFeePercent: number;
    bookingActionText: string;
  };
}

export interface DayExperimentStatus {
  dayNumber: number;
  title: string;
  titleHindi: string;
  actionName: string;
  completed: boolean;
  notes: string;
}

export interface TrustExperimentVote {
  id: string;
  timestamp: string;
  userType: 'tourist' | 'local_resident' | 'food_historian' | 'student';
  selectedVersion: 'A' | 'B';
  trustScore: number; // 1 to 5
  feedback: string;
  actionTaken: boolean;
}

export interface ConversionEvent {
  id: string;
  claimId: string;
  version: 'A' | 'B';
  actionType: 'EXPERIENCE_BOOK' | 'MENU_ORDER' | 'DIRECTIONS_REQUEST' | 'ARTISAN_LEAD';
  valueINR: number;
  timestamp: string;
}

export interface KillGoMetrics {
  truthApprovalRate: number; // >= 80% needed
  trustPreferenceRate: number; // >= 70% needed
  conversionLift: number; // >= 20% needed
  sustainabilityRetention: number; // >= 60% needed
}

export interface CulturalHealthMetric {
  district: string;
  coveragePercent: number;
  communityParticipation: number;
  evidenceQuality: number;
  authenticityScore: number;
  digitalAccessibility: number;
  economicActivation: number;
  preservationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface IdentityProfileItem {
  platform: string;
  handle: string;
  url: string;
  currentRole: string;
  auditStatus: 'CONFIRMED' | 'NEEDS_FIX' | 'REMOVE' | 'CREATE';
  notes: string;
}

export interface HomeFoodCandidateClaim {
  id: string;
  claim: string;
  claimHindi: string;
  claimType: string;
  geographicScope: string;
  peopleCommunityAssociated: string;
  evidence: string;
  source: string;
  evidenceTypeNeeded: string;
  contradictoryEvidence: string;
  communityTestimony: string;
  consentStatus: 'PENDING' | 'OBTAINED' | 'RESTRICTED' | 'N/A';
  accessLevel: 'PUBLIC' | 'RESTRICTED' | 'SACRED';
  currentStatus: 'UNVERIFIED_HYPOTHESIS' | 'FIELD_IN_PROGRESS' | 'VERIFIED' | 'DISPUTED';
  humanVerificationRequired: boolean;
  questionsForNextInterview: string;
  isPrimaryBusinessHypothesis?: boolean;
}

export interface EvidenceLedgerRow {
  id: string;
  claimSummary: string;
  source: string;
  evidenceType: string;
  communityFeedback: string;
  conflictFlag: string;
  consentStatus: 'Pending' | 'Obtained' | 'Refused' | 'N/A';
  currentStatus: 'Unverified' | 'In Field Review' | 'Corroborated' | 'Disputed';
  dateAdded?: string;
  verifiedBy?: string;
}

export interface PluralityInterviewRecord {
  id: string;
  practitionerName: string;
  familyElder: string;
  locality: string;
  dishFocused: string;
  originNarrative: string;
  keyVariation: string;
  culturalMeaning: string;
  transmissionMode: string;
  whoProperlyRepresents: string;
  corroborationWithOthers: 'Identical' | 'Minor Variation' | 'Distinct Plural Tradition' | 'Conflicting';
}

// Cultural Intelligence Core v0.1 Types
export type CulturalEntityType =
  | 'FOOD_TRADITION'
  | 'CRAFT'
  | 'RITUAL'
  | 'ORAL_HISTORY'
  | 'PLACE_PRACTICE'
  | 'LANGUAGE_FORM';

export interface CulturalEntity {
  entity_id: string;
  entity_type: CulturalEntityType;
  name: string;
  geographic_scope: string;
  description: string;
  created_at: string;
  created_by: string;
}

export type ClaimVerificationStatus =
  | 'UNVERIFIED'
  | 'UNDER_REVIEW'
  | 'COMMUNITY_CONFIRMED'
  | 'EVIDENCE_SUPPORTED'
  | 'PARTIALLY_SUPPORTED'
  | 'DISPUTED'
  | 'RESTRICTED';

export type CoreClaimType =
  | 'ORIGIN'
  | 'PRACTICE'
  | 'TEMPORAL'
  | 'TRANSMISSION'
  | 'ASSOCIATION'
  | 'DIVERSITY'
  | 'EROSION'
  | 'DIGITAL_GAP'
  | 'BUSINESS_HYPOTHESIS';

export interface CoreClaim {
  claim_id: string;
  entity_id: string;
  statement: string;
  claim_type: CoreClaimType;
  geographic_scope: string;
  verification_status: ClaimVerificationStatus;
  created_at: string;
  created_by: string;
}

export type EvidenceSourceType =
  | 'ORAL_INTERVIEW'
  | 'ARCHIVAL_DOCUMENT'
  | 'PHOTOGRAPH'
  | 'AUDIO_RECORDING'
  | 'VIDEO'
  | 'GAZETTEER'
  | 'ACADEMIC_PAPER'
  | 'GI_DOCUMENTATION'
  | 'MATERIAL_ARTIFACT';

export interface CoreEvidence {
  evidence_id: string;
  claim_id: string;
  evidence_type: EvidenceSourceType;
  source: string;
  source_reference: string;
  captured_at: string;
  captured_by: string;
  notes: string;
}

export interface CoreTestimony {
  testimony_id: string;
  claim_id: string;
  contributor_id: string;
  statement: string;
  language: string;
  captured_at: string;
  captured_by: string;
  consent_id: string;
}

export type ReviewerType =
  | 'COMMUNITY_ELDER'
  | 'PRACTITIONER'
  | 'DOMAIN_EXPERT'
  | 'HISTORIAN'
  | 'PEER_REVIEWER';

export type ReviewDecision =
  | 'CONFIRMS'
  | 'CORRECTS'
  | 'DISPUTES'
  | 'REQUESTS_CLARIFICATION'
  | 'RESTRICTS';

export interface CoreReview {
  review_id: string;
  claim_id: string;
  reviewer_id: string;
  reviewer_type: ReviewerType;
  decision: ReviewDecision;
  correction: string | null;
  rationale: string;
  reviewed_at: string;
}

export type ConsentScope = 'SPECIFIC_CLAIM' | 'ALL_CONTRIBUTIONS' | 'ENTITY_LEVEL';
export type ConsentAccessLevel = 'PUBLIC' | 'RESTRICTED' | 'SACRED_PRIVATE';
export type ConsentGrantedVia = 'verbal_recorded' | 'written' | 'digital_form';
export type ConsentWithdrawalStatus = 'ACTIVE' | 'WITHDRAWN';

export interface CoreConsent {
  consent_id: string;
  contributor_id: string;
  scope: ConsentScope;
  ai_processing: boolean;
  public_attribution: boolean;
  commercial_use: boolean;
  access_level: ConsentAccessLevel;
  granted_at: string;
  granted_via: ConsentGrantedVia;
  withdrawal_status: ConsentWithdrawalStatus;
  withdrawal_at: string | null;
}

export type ContributorRole =
  | 'PRACTITIONER'
  | 'ELDER'
  | 'HISTORIAN'
  | 'RESEARCHER'
  | 'BUSINESS_OWNER';

export interface CoreContributor {
  contributor_id: string;
  role: ContributorRole;
  anonymized: boolean;
  contact_reference: string;
  first_contribution_at: string;
}

export type PluralityStatus = 'UNKNOWN' | 'NO_VARIANTS' | 'POSSIBLE' | 'CONFIRMED';

export interface CorePlurality {
  plurality_id: string;
  claim_id: string;
  tradition_variant: string;
  community_scope: string;
  supporting_testimonies: string[];
  conflict_notes: string;
  plurality_status: PluralityStatus;
  recorded_at: string;
}

export interface CoreAuditLogEntry {
  log_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  timestamp: string;
  before_state: any;
  after_state: any;
  rationale: string;
}

export interface CoreState {
  entities: CulturalEntity[];
  claims: CoreClaim[];
  evidence: CoreEvidence[];
  testimonies: CoreTestimony[];
  reviews: CoreReview[];
  consent: CoreConsent[];
  plurality: CorePlurality[];
  contributors: CoreContributor[];
  auditLog: CoreAuditLogEntry[];
}

