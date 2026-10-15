export type AppView =
  | "developer-os"
  | "curriculum"
  | "first-mission"
  | "deal-modeler"
  | "deal-structuring"
  | "copilot-chat"
  | "legal-checklist"
  | "portfolio"
  | "agent-studio";

export type DeveloperTag =
  | "LEARN"
  | "DEAL"
  | "LAND"
  | "MONEY"
  | "LEGAL"
  | "BUILD"
  | "SELL"
  | "FINANCE"
  | "STRATEGY"
  | "MASTER"
  | "RISK"
  | "PORTFOLIO";

// The 3 Core Operating Modes of the Developer OS
export type OperatingMode = "LEARN_MODE" | "DEVELOPER_MODE" | "MASTER_MODE";

// The 7-Stage Architectural Pipeline
export type OSStage =
  | "PROPERTY_INTELLIGENCE"
  | "DEVELOPMENT_ENGINE"
  | "DEAL_STRUCTURING"
  | "CAPITAL_ARCHITECT"
  | "DEVELOPMENT_OS"
  | "SALES_ENGINE"
  | "MASTER_DEVELOPER";

// Provenance Tiers to ensure the AI NEVER invents facts
export type ProvenanceTier =
  | "VERIFIED_DATA"
  | "USER_PROVIDED"
  | "ESTIMATED_DATA"
  | "AI_ASSUMPTION"
  | "REQUIRES_VERIFICATION";

export interface ProvenanceField<T = any> {
  value: T;
  tier: ProvenanceTier;
  sourceAuthority?: string; // e.g. "Lucknow Master Plan 2031 / LDA", "UP RERA Portal", "Khatoni Tehsil Record"
  note?: string;
}

// 1. Property Intelligence Data Model
export interface PropertyIntelligenceData {
  parcelName: ProvenanceField<string>;
  location: ProvenanceField<string>;
  city: ProvenanceField<string>;
  state: ProvenanceField<string>;
  plotAreaSqFt: ProvenanceField<number>;
  plotAreaAcres: ProvenanceField<number>;
  roadWidthMeters: ProvenanceField<number>;
  zoningClassification: ProvenanceField<string>;
  applicableMasterPlan: ProvenanceField<string>;
  baseFar: ProvenanceField<number>;
  purchasableFarMax: ProvenanceField<number>;
  groundCoverageMaxPercent: ProvenanceField<number>;
  circleRateSqFt: ProvenanceField<number>;
  marketLandRateSqFt: ProvenanceField<number>;
  totalLandAskingPriceCr: ProvenanceField<number>;
  titleChainStatus: ProvenanceField<string>;
  khasraNumbers: ProvenanceField<string[]>;
  reraAuthorityName: ProvenanceField<string>;
  comparableProjects: {
    name: string;
    distanceKm: number;
    launchPriceSqFt: number;
    currentPriceSqFt: number;
    absorptionVelocityQuarterly: string;
    builderTier: string;
  }[];
  criticalZoningNotes: string[];
}

// 2. Development Engine Data Model
export interface DevelopmentEngineData {
  totalUsableFar: ProvenanceField<number>;
  builtUpAreaSqFt: ProvenanceField<number>;
  saleableCarpetEfficiencyPercent: ProvenanceField<number>;
  totalSaleableAreaSqFt: ProvenanceField<number>;
  unitMix: {
    typology: string; // e.g., "3BHK Luxury", "2BHK Smart", "Penthouse"
    unitCarpetSqFt: number;
    unitSuperBuiltUpSqFt: number;
    unitCount: number;
    targetPricePerUnitCr: number;
    totalRevenueCr: number;
  }[];
  civilConstructionCostSqFt: ProvenanceField<number>;
  mepFinishingCostSqFt: ProvenanceField<number>;
  statutoryApprovalCostSqFt: ProvenanceField<number>;
  contingencyPercent: ProvenanceField<number>;
  hardCostTotalCr: ProvenanceField<number>;
  softCostTotalCr: ProvenanceField<number>;
  totalDevelopmentCostCr: ProvenanceField<number>;
  grossDevelopmentValueCr: ProvenanceField<number>;
  projectDurationMonths: ProvenanceField<number>;
  projectRoiPercent: ProvenanceField<number>;
  equityIrrPercent: ProvenanceField<number>;
  breakevenSalePriceSqFt: ProvenanceField<number>;
  breakevenAbsorptionPercent: ProvenanceField<number>;
  quarterlyCashFlows: {
    quarter: string;
    outflowCr: number;
    inflowCr: number;
    netCashFlowCr: number;
    cumulativeCr: number;
  }[];
  sensitivityMatrix: {
    salePriceVariationPercent: number;
    costVariationPercent: number;
    resultingIrrPercent: number;
    resultingProfitCr: number;
  }[];
}

// 3. Deal Structuring Engine Data Model
export interface DealStructuringData {
  recommendedStructure: ProvenanceField<"OUTRIGHT_PURCHASE" | "AREA_SHARE_JDA" | "REVENUE_SHARE_JDA" | "DEVELOPMENT_MANAGEMENT">;
  rationale: string;
  structureComparison: {
    type: string;
    developerCapitalCr: number;
    developerProfitCr: number;
    developerIrr: number;
    landownerTotalPayoutCr: number;
    landownerRiskProfile: string;
    keyProtectiveClause: string;
  }[];
  proposedDeveloperSplitPercent: ProvenanceField<number>;
  proposedLandownerSplitPercent: ProvenanceField<number>;
  refundableSecurityDepositCr: ProvenanceField<number>;
  depositRecoveryMilestone: ProvenanceField<string>;
  statutoryCostSharingRule: string;
  reraEscrowOperationRule: string;
}

// 4. Capital Architect Data Model
export interface CapitalArchitectData {
  totalFundingRequiredCr: ProvenanceField<number>;
  sponsorEquityCr: ProvenanceField<number>;
  sponsorEquityPercent: number;
  seniorConstructionDebtCr: ProvenanceField<number>;
  seniorDebtInterestRatePercent: ProvenanceField<number>;
  partnerEquityOrSubDebtCr: ProvenanceField<number>;
  customerPreSaleCollectionCr: ProvenanceField<number>;
  rera7030EscrowDepositCr: number;
  rera30FreeCashflowCr: number;
  peakDebtDrawdownCr: number;
  dscrRatio: ProvenanceField<number>;
  investorReturnMultiple: ProvenanceField<number>;
  fundingTrancheSchedule: {
    stage: string;
    month: number;
    drawdownAmountCr: number;
    source: string;
    milestonePrecedent: string;
  }[];
}

// 5. Development OS (Execution, Approvals & Risk)
export interface DevelopmentOSData {
  approvalsFlow: {
    stepNumber: number;
    approvalName: string;
    issuingAuthority: string;
    typicalDays: number;
    statutoryCostLakhs: number;
    mandatoryPrecedent: string;
    status: "NOT_STARTED" | "IN_PROGRESS" | "CLEARED" | "HIGH_RISK";
  }[];
  constructionPhases: {
    phase: string;
    durationMonths: number;
    budgetCr: number;
    milestoneDeliverable: string;
  }[];
  riskRegister: {
    category: "TITLE" | "ZONING" | "CASHFLOW" | "RERA" | "CONSTRUCTION_INFLATION" | "MARKET_ABSORPTION";
    severity: "HIGH" | "MEDIUM" | "LOW";
    description: string;
    mitigationStrategy: string;
    contingencyAction: string;
  }[];
}

// 6. Sales Engine Data Model
export interface SalesEngineData {
  positioningTagline: string;
  targetBuyerDemographic: string;
  phaseReleaseStrategy: {
    phaseName: string;
    launchMonth: number;
    unitsReleased: number;
    launchPriceSqFt: number;
    expectedAbsorptionMonths: number;
    revenueRealizationCr: number;
  }[];
  brokerCommissionPercent: ProvenanceField<number>;
  channelPartnerTiers: {
    tier: string;
    volumeTargetCr: number;
    payoutRate: string;
    incentivePerks: string;
  }[];
  digitalLeadTargetMonthly: number;
  targetCACPerBookingLakhs: number;
}

// 7. Master Developer & Portfolio Engine
export interface MasterDeveloperData {
  portfolioSynergyScore: number; // 0-100
  brandCapitalContribution: string;
  longTermRecurringAssetPotential: string; // e.g. "Commercial retail podium retaining 20% carpet for lease yield"
  strategicAcquisitionRecommendations: string[];
  scalabilityVerdict: string;
}

// Full 7-Stage Aggregated Package
export interface FullDeveloperOSOutput {
  id: string;
  dealName: string;
  timestamp: string;
  provenanceSummary: {
    verifiedCount: number;
    userProvidedCount: number;
    estimatedCount: number;
    aiAssumptionCount: number;
    requiresVerificationCount: number;
  };
  propertyIntelligence: PropertyIntelligenceData;
  developmentEngine: DevelopmentEngineData;
  dealStructuring: DealStructuringData;
  capitalArchitect: CapitalArchitectData;
  developmentOS: DevelopmentOSData;
  salesEngine: SalesEngineData;
  masterDeveloper: MasterDeveloperData;
}

// Master Mode Portfolio Allocation Models
export interface MasterPipelineCandidate {
  id: string;
  dealName: string;
  location: string;
  city: string;
  plotSizeAcres: number;
  structure: "OUTRIGHT" | "JDA_REV_SHARE" | "DM_AGREEMENT";
  requiredEquityCr: number;
  projectedProfitCr: number;
  projectedIrrPercent: number;
  executionMonths: number;
  riskScore: "LOW" | "BALANCED" | "HIGH";
  reraStatus: string;
  selectedForAllocation?: boolean;
  allocatedEquityCr?: number;
}

export interface MasterPortfolioResult {
  totalAvailableCapitalCr: number;
  allocatedCapitalCr: number;
  remainingCashReserveCr: number;
  blendedPortfolioIrrPercent: number;
  totalProjectedProfitCr: number;
  pipelineAllocations: {
    dealId: string;
    dealName: string;
    recommendedStructure: string;
    allocatedEquityCr: number;
    seniorDebtLeveragedCr: number;
    totalGDVCr: number;
    phaseSequencing: string;
    strategicRole: string;
  }[];
  capitalStackOptimizationThesis: string;
  macroRiskDiversificationNotes: string[];
}

// Learn Mode Lesson Model
export interface LearnEngineLesson {
  id: string;
  stage: OSStage;
  stageName: string;
  iconName: string;
  headline: string;
  corePrinciple: string;
  howTopDevelopersThink: string;
  indianMarketHeuristic: string;
  formulaOrRule: string;
  pitfallsToAvoid: string[];
  sampleRealWorldCase: {
    city: string;
    dealScenario: string;
    whatHappened: string;
    lessonLearned: string;
  };
  interactiveExercise: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CityMarketBenchmark {
  id: string;
  city: string;
  locality: string;
  state: string;
  zoneType: "Prime Metro" | "Emerging Growth Corridor" | "Tier-2 Express Highway" | "Suburban Infill";
  standardFar: number;
  purchasableFarMax: number;
  avgCircleRateSqFt: number;
  avgMarketLandRateSqFt: number;
  avgApartmentSalePriceSqFt: number;
  avgCivilMepCostSqFt: number;
  typicalApprovalMonths: number;
  reraAuthority: string;
  typicalJdaRevenueShare: string; // e.g. "68% Developer : 32% Landowner"
  demandDrivers: string[];
}

export interface DealMemoData {
  dealName: string;
  location: string;
  city: string;
  assetType: string;
  plotAreaSqFt: number;
  permissibleFar: number;
  builtUpAreaSqFt: number;
  saleableAreaSqFt: number;
  landValuationCr: number;
  hardCostCr: number;
  softAndApprovalCostCr: number;
  financeAndContingencyCr: number;
  totalDevelopmentCostCr: number;
  expectedGrossRevenueCr: number;
  netDeveloperProfitCr: number;
  developerMarginPercent: number;
  projectRoiPercent: number;
  equityIrrPercent: number;
  breakevenPricePerSqFt: number;
  recommendedStructure: string;
  equityRequirementCr: number;
  seniorDebtCr: number;
  customerPresaleTargetCr: number;
  keyRisks: string[];
  recommendedAction: "PROCEED_AGGRESSIVELY" | "PROCEED_WITH_JDA" | "RENEGOTIATE_LAND_PRICE" | "REJECT_DEAL";
  executiveSummary: string;
}

export interface PromptTemplateItem {
  id: string;
  tag: DeveloperTag;
  roleTitle: string;
  description: string;
  curriculumLevels: string;
  defaultInput: string;
  systemPrompt: string;
  outputFormat: string;
  keyFocusAreas: string[];
}

export interface PitchDeckSlide {
  id: number;
  tagline: string;
  title: string;
  subtitle: string;
  badge: string;
  keyPoints: {
    heading: string;
    description: string;
    stat?: string;
  }[];
  metricsSummary?: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
  strategicTakeaway: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  summary: string;
  keyInsights: string[];
  formulaOrRule?: string;
  realWorldExample: string;
  actionChecklist?: string[];
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface MoneyProgressionTier {
  tier: number;
  range: string;
  focus: string;
  strategy: string;
  targetVehicle: string;
}

export interface CurriculumLevel {
  level: number;
  code: string;
  title: string;
  subtitle: string;
  goal: string;
  outcome: string;
  topics: CurriculumTopic[];
  keyMotto: string;
  estimatedCapitalRange: string;
}

export interface DealInput {
  id: string;
  name: string;
  location: string;
  assetType: "residential" | "commercial" | "plotted" | "mixed-use" | "industrial";
  currencyUnit: "crore" | "lakh" | "million";
  plotAreaSqFt: number;
  baseFar: number;
  purchasableFar: number;
  tdrFar: number;
  groundCoveragePercent: number;
  superBuiltUpEfficiencyPercent: number; // e.g. 130% for super built-up vs carpet
  circleRatePerSqFt: number;
  marketAskPriceTotal: number; // in Crores or Lakhs
  stampDutyRegistrationPercent: number; // typically 6-8%
  approvalAndLiaisonCostPerSqFt: number;
  constructionCostPerSqFt: number;
  mepAndFinishingPerSqFt: number;
  contingencyPercent: number; // 5-10%
  expectedSalePricePerSqFt: number;
  expectedRentalYieldPercent: number;
  projectDurationMonths: number;
  equityContributionPercent: number; // e.g. 30%
  debtInterestRateAnnualPercent: number; // e.g. 11%
  marketingBrokeragePercent: number; // e.g. 3%
  taxesGstPercent: number; // e.g. 5% for residential
  notes?: string;
}

export interface CalculatedFinancials {
  totalFar: number;
  totalBuiltUpAreaSqFt: number;
  totalSaleableAreaSqFt: number;
  actualLandCost: number;
  stampDutyCost: number;
  approvalCost: number;
  hardConstructionCost: number;
  mepCost: number;
  contingencyCost: number;
  marketingCost: number;
  debtAmount: number;
  equityAmount: number;
  financeCostEst: number;
  totalProjectCost: number;
  expectedGrossRevenue: number;
  netDeveloperProfit: number;
  developerMarginPercent: number;
  projectRoiPercent: number;
  equityMultiple: number;
  annualizedIrrPercent: number;
  breakevenSalePricePerSqFt: number;
  breakevenSalePercent: number;
  costPerSqFtSaleable: number;
}

export interface DealStructureOption {
  type: "outright_purchase" | "jda_area_share" | "revenue_share" | "profit_share" | "development_management";
  title: string;
  description: string;
  developerCapitalRequired: number;
  developerExpectedProfit: number;
  developerIrr: number;
  landownerReturn: number;
  riskProfile: "High" | "Medium-High" | "Balanced" | "Low";
  keySafeguard: string;
  bestFor: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  tag?: DeveloperTag;
  timestamp: string;
}

export interface DueDiligenceItem {
  id: string;
  category: "Land & Title" | "Zoning & Municipal" | "Technical & Soil" | "RERA & Legal" | "Financial & Tax";
  title: string;
  description: string;
  riskIfIgnored: string;
  status: "verified" | "flagged" | "pending" | "not_applicable";
  mandatory: boolean;
}

export interface ProjectPipelineItem {
  id: string;
  title: string;
  location: string;
  assetClass: string;
  stage: "Sourcing" | "Due Diligence" | "Approvals" | "Under Construction" | "Sales & Marketing" | "Handover";
  projectSizeSqFt: number;
  estimatedCostCr: number;
  expectedRevenueCr: number;
  targetMarginPercent: number;
  status: "active" | "pipeline" | "completed";
  structure: string;
}
