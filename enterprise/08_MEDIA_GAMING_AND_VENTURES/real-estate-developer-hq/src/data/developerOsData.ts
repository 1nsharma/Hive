import {
  FullDeveloperOSOutput,
  MasterPipelineCandidate,
  LearnEngineLesson,
} from "../types";

export const SAMPLE_OS_PARCELS: FullDeveloperOSOutput[] = [
  {
    id: "lko-shaheed-path-4-5ac",
    dealName: "Gomti Heights Luxury High-Rise",
    timestamp: "2026-09-01T10:30:00Z",
    provenanceSummary: {
      verifiedCount: 14,
      userProvidedCount: 6,
      estimatedCount: 8,
      aiAssumptionCount: 4,
      requiresVerificationCount: 3,
    },
    propertyIntelligence: {
      parcelName: {
        value: "Plot 104-A, Shaheed Path Commercial & Mixed Corridor",
        tier: "VERIFIED_DATA",
        sourceAuthority: "LDA Master Plan 2031 / Registered Registry No. 4921/2022",
      },
      location: {
        value: "Shaheed Path, Adjacent to Phoenix Palassio & Ekana Stadium, Lucknow",
        tier: "VERIFIED_DATA",
        sourceAuthority: "Municipal GIS Ward 38",
      },
      city: { value: "Lucknow", tier: "VERIFIED_DATA" },
      state: { value: "Uttar Pradesh", tier: "VERIFIED_DATA" },
      plotAreaSqFt: {
        value: 196020,
        tier: "VERIFIED_DATA",
        sourceAuthority: "Tehsil Sarojini Nagar Khatoni Survey 2024",
      },
      plotAreaAcres: { value: 4.5, tier: "VERIFIED_DATA" },
      roadWidthMeters: {
        value: 45,
        tier: "VERIFIED_DATA",
        sourceAuthority: "NHAI / LDA Master Arterial Road Schedule",
      },
      zoningClassification: {
        value: "High-Density Mixed-Use Residential (R-4)",
        tier: "VERIFIED_DATA",
        sourceAuthority: "LDA Master Plan 2031 Gazette",
      },
      applicableMasterPlan: {
        value: "Lucknow Master Plan 2031 (Regulated by UP Housing & Development Board)",
        tier: "VERIFIED_DATA",
      },
      baseFar: {
        value: 2.5,
        tier: "VERIFIED_DATA",
        sourceAuthority: "UP Urban Planning and Development Act (Sec 14)",
      },
      purchasableFarMax: {
        value: 1.0,
        tier: "VERIFIED_DATA",
        sourceAuthority: "LDA Purchasable FAR Notification 2021 (Govt Gazette)",
      },
      groundCoverageMaxPercent: {
        value: 35,
        tier: "VERIFIED_DATA",
        sourceAuthority: "UP Building By-Laws (2018 Edition)",
      },
      circleRateSqFt: {
        value: 4800,
        tier: "VERIFIED_DATA",
        sourceAuthority: "DM Circle Rate Schedule Sarojini Nagar 2025-26",
      },
      marketLandRateSqFt: {
        value: 8200,
        tier: "ESTIMATED_DATA",
        sourceAuthority: "Local Brokerage Survey & Recent Sub-Registrar Transacted Deeds",
      },
      totalLandAskingPriceCr: {
        value: 38.5,
        tier: "USER_PROVIDED",
        note: "Asking quote from Landowner consortium represented by primary power of attorney holder.",
      },
      titleChainStatus: {
        value: "30-Year Continuous Single-Family Ownership; Khatoni Clean 143 Converted",
        tier: "REQUIRES_VERIFICATION",
        sourceAuthority: "Revenue Inspector (Tehsildar) Certificate required prior to advance deposit.",
        note: "Title deed inspected for 1994-2024; Pending certified non-encumbrance search certificate (Form 22).",
      },
      khasraNumbers: {
        value: ["412/1", "412/2", "413/Ka", "414/Gha"],
        tier: "VERIFIED_DATA",
        sourceAuthority: "UP Bhulekh Digital Portal 2026",
      },
      reraAuthorityName: {
        value: "UP RERA (Lucknow Bench)",
        tier: "VERIFIED_DATA",
      },
      comparableProjects: [
        {
          name: "Rishita Manhattan (Shaheed Path)",
          distanceKm: 1.2,
          launchPriceSqFt: 5200,
          currentPriceSqFt: 7800,
          absorptionVelocityQuarterly: "38 units/quarter",
          builderTier: "Tier 1 Regional",
        },
        {
          name: "Omaxe The Resort (Gomti Nagar Ext)",
          distanceKm: 2.8,
          launchPriceSqFt: 6100,
          currentPriceSqFt: 8400,
          absorptionVelocityQuarterly: "45 units/quarter",
          builderTier: "National Player",
        },
        {
          name: "MI Central Park",
          distanceKm: 3.5,
          launchPriceSqFt: 4800,
          currentPriceSqFt: 6900,
          absorptionVelocityQuarterly: "24 units/quarter",
          builderTier: "Tier 2 Local",
        },
      ],
      criticalZoningNotes: [
        "Road width exceeds 30m, enabling maximum permissible 1.0 purchasable FAR premium.",
        "Airport Authority Height Clearance: Max permissible elevation is 90m above ground (approx. 28 floors).",
        "UP RERA 70:30 bank escrow mandatory before any customer advance is recognized.",
      ],
    },
    developmentEngine: {
      totalUsableFar: {
        value: 3.5,
        tier: "VERIFIED_DATA",
        sourceAuthority: "Base FAR (2.5) + Purchasable FAR (1.0 via LDA Premium Payment)",
      },
      builtUpAreaSqFt: {
        value: 686070,
        tier: "VERIFIED_DATA",
        note: "196,020 sq.ft plot × 3.5 FAR = 686,070 sq.ft Gross BUA",
      },
      saleableCarpetEfficiencyPercent: {
        value: 130,
        tier: "AI_ASSUMPTION",
        note: "Standard Super Built-Up to Carpet efficiency factor for luxury high-rise with double-height lobby.",
      },
      totalSaleableAreaSqFt: {
        value: 891891,
        tier: "AI_ASSUMPTION",
        note: "686,070 BUA × 1.30 = 891,891 sq.ft Super Built-up Saleable Area",
      },
      unitMix: [
        {
          typology: "3 BHK Premium (1,850 sq.ft)",
          unitCarpetSqFt: 1280,
          unitSuperBuiltUpSqFt: 1850,
          unitCount: 280,
          targetPricePerUnitCr: 1.25,
          totalRevenueCr: 350.0,
        },
        {
          typology: "4 BHK Signature Sky Villa (2,600 sq.ft)",
          unitCarpetSqFt: 1820,
          unitSuperBuiltUpSqFt: 2600,
          unitCount: 120,
          targetPricePerUnitCr: 1.88,
          totalRevenueCr: 225.6,
        },
        {
          typology: "Exclusive Penthouse (4,200 sq.ft)",
          unitCarpetSqFt: 2950,
          unitSuperBuiltUpSqFt: 4200,
          unitCount: 14,
          targetPricePerUnitCr: 3.45,
          totalRevenueCr: 48.3,
        },
      ],
      civilConstructionCostSqFt: {
        value: 2350,
        tier: "ESTIMATED_DATA",
        sourceAuthority: "CPWD / UP State Schedule of Rates 2025 (Index adjusted for Mivans shuttering)",
      },
      mepFinishingCostSqFt: {
        value: 650,
        tier: "ESTIMATED_DATA",
        sourceAuthority: "Contractor Tender Benchmark Sarojini Nagar Corridor",
      },
      statutoryApprovalCostSqFt: {
        value: 380,
        tier: "ESTIMATED_DATA",
        sourceAuthority: "LDA Betterment Levy + Water & Sewerage Infrastructure Charges + Fire NOC",
      },
      contingencyPercent: {
        value: 6.0,
        tier: "AI_ASSUMPTION",
        note: "Contingency reserve for cement & steel volatility",
      },
      hardCostTotalCr: {
        value: 205.8,
        tier: "ESTIMATED_DATA",
        note: "686,070 sq.ft BUA × ₹3,000/sq.ft (Civil + MEP)",
      },
      softCostTotalCr: {
        value: 26.1,
        tier: "ESTIMATED_DATA",
        note: "LDA approval fees + Architect + Legal + Branding",
      },
      totalDevelopmentCostCr: {
        value: 270.4,
        tier: "ESTIMATED_DATA",
        note: "Land ₹38.5 Cr + Hard ₹205.8 Cr + Soft ₹26.1 Cr",
      },
      grossDevelopmentValueCr: {
        value: 623.9,
        tier: "ESTIMATED_DATA",
        note: "891,891 sq.ft saleable × ₹6,995/sq.ft blended rate",
      },
      projectDurationMonths: { value: 36, tier: "USER_PROVIDED" },
      projectRoiPercent: { value: 130.7, tier: "AI_ASSUMPTION" },
      equityIrrPercent: { value: 34.2, tier: "AI_ASSUMPTION" },
      breakevenSalePriceSqFt: {
        value: 3031,
        tier: "AI_ASSUMPTION",
        note: "Total Dev Cost ₹270.4 Cr / 891,891 sq.ft saleable area",
      },
      breakevenAbsorptionPercent: {
        value: 43.3,
        tier: "AI_ASSUMPTION",
        note: "Requires selling only 43.3% of inventory to recover entire project cost.",
      },
      quarterlyCashFlows: [
        { quarter: "Q1", outflowCr: 24.5, inflowCr: 12.0, netCashFlowCr: -12.5, cumulativeCr: -12.5 },
        { quarter: "Q2", outflowCr: 31.0, inflowCr: 45.0, netCashFlowCr: 14.0, cumulativeCr: 1.5 },
        { quarter: "Q3", outflowCr: 28.5, inflowCr: 62.0, netCashFlowCr: 33.5, cumulativeCr: 35.0 },
        { quarter: "Q4", outflowCr: 32.0, inflowCr: 75.0, netCashFlowCr: 43.0, cumulativeCr: 78.0 },
        { quarter: "Q5", outflowCr: 29.0, inflowCr: 80.0, netCashFlowCr: 51.0, cumulativeCr: 129.0 },
        { quarter: "Q6", outflowCr: 25.0, inflowCr: 72.0, netCashFlowCr: 47.0, cumulativeCr: 176.0 },
        { quarter: "Q7", outflowCr: 22.0, inflowCr: 65.0, netCashFlowCr: 43.0, cumulativeCr: 219.0 },
        { quarter: "Q8", outflowCr: 18.0, inflowCr: 55.0, netCashFlowCr: 37.0, cumulativeCr: 256.0 },
        { quarter: "Q9", outflowCr: 12.0, inflowCr: 40.0, netCashFlowCr: 28.0, cumulativeCr: 284.0 },
        { quarter: "Q10", outflowCr: 8.0, inflowCr: 30.0, netCashFlowCr: 22.0, cumulativeCr: 306.0 },
        { quarter: "Q11", outflowCr: 5.0, inflowCr: 25.0, netCashFlowCr: 20.0, cumulativeCr: 326.0 },
        { quarter: "Q12", outflowCr: 4.4, inflowCr: 62.9, netCashFlowCr: 58.5, cumulativeCr: 353.5 },
      ],
      sensitivityMatrix: [
        { salePriceVariationPercent: -10, costVariationPercent: 10, resultingIrrPercent: 21.8, resultingProfitCr: 198.2 },
        { salePriceVariationPercent: -5, costVariationPercent: 5, resultingIrrPercent: 27.5, resultingProfitCr: 265.4 },
        { salePriceVariationPercent: 0, costVariationPercent: 0, resultingIrrPercent: 34.2, resultingProfitCr: 353.5 },
        { salePriceVariationPercent: 5, costVariationPercent: -5, resultingIrrPercent: 41.6, resultingProfitCr: 441.8 },
        { salePriceVariationPercent: 10, costVariationPercent: -10, resultingIrrPercent: 48.9, resultingProfitCr: 530.1 },
      ],
    },
    dealStructuring: {
      recommendedStructure: {
        value: "REVENUE_SHARE_JDA",
        tier: "AI_ASSUMPTION",
        sourceAuthority: "AI Investment Committee Optimization Rule",
      },
      rationale:
        "Revenue Share JDA (68% Developer : 32% Landowner) protects the developer from upfront land acquisition debt, eliminates stamp duty on land purchase, and aligns landowner incentives with high launch pricing.",
      structureComparison: [
        {
          type: "Outright Land Purchase",
          developerCapitalCr: 64.5,
          developerProfitCr: 353.5,
          developerIrr: 28.4,
          landownerTotalPayoutCr: 38.5,
          landownerRiskProfile: "Zero post-sale risk (receives lump sum)",
          keyProtectiveClause: "100% Freehold Title Transfer with Registered Sale Deed",
        },
        {
          type: "Revenue Share JDA (68:32)",
          developerCapitalCr: 18.5,
          developerProfitCr: 192.4,
          developerIrr: 46.8,
          landownerTotalPayoutCr: 199.6,
          landownerRiskProfile: "Shared market risk; upside tied to sales velocity",
          keyProtectiveClause: "Dual-Escrow Mechanism with RERA 70:30 pass-through and ₹4.5 Cr Refundable Security Deposit",
        },
        {
          type: "Area Share JDA (66:34)",
          developerCapitalCr: 19.2,
          developerProfitCr: 178.6,
          developerIrr: 42.1,
          landownerTotalPayoutCr: 212.1,
          landownerRiskProfile: "Landowner takes unit handover risk & must self-liquidate inventory",
          keyProtectiveClause: "Non-compete clause preventing Landowner from discounting their units below developer's floor price",
        },
        {
          type: "Development Management (DM)",
          developerCapitalCr: 3.5,
          developerProfitCr: 52.8,
          developerIrr: 68.5,
          landownerTotalPayoutCr: 300.7,
          landownerRiskProfile: "Landowner carries full construction finance & cashflow exposure",
          keyProtectiveClause: "12% DM Fee on Gross Revenue + 20% Incentive Fee on profits above 25% hurdle",
        },
      ],
      proposedDeveloperSplitPercent: { value: 68, tier: "AI_ASSUMPTION" },
      proposedLandownerSplitPercent: { value: 32, tier: "AI_ASSUMPTION" },
      refundableSecurityDepositCr: {
        value: 4.5,
        tier: "USER_PROVIDED",
        note: "Refundable on completion of plinth level construction in 3 tranches.",
      },
      depositRecoveryMilestone: {
        value: "Adjustable against landowner's first 32% share of RERA 30% free cashflows.",
        tier: "AI_ASSUMPTION",
      },
      statutoryCostSharingRule:
        "Developer funds all sanction fees, betterment charges, and purchasable FAR premiums upfront, with 50% credited back from initial sales escrow.",
      reraEscrowOperationRule:
        "70% of all customer receipts directly into RERA Project Account. Remaining 30% distributed 68:32 automatically every 30 days.",
    },
    capitalArchitect: {
      totalFundingRequiredCr: { value: 270.4, tier: "ESTIMATED_DATA" },
      sponsorEquityCr: { value: 22.0, tier: "USER_PROVIDED" },
      sponsorEquityPercent: 8.1,
      seniorConstructionDebtCr: { value: 65.0, tier: "ESTIMATED_DATA" },
      seniorDebtInterestRatePercent: { value: 11.25, tier: "ESTIMATED_DATA" },
      partnerEquityOrSubDebtCr: { value: 15.0, tier: "ESTIMATED_DATA" },
      customerPreSaleCollectionCr: { value: 168.4, tier: "AI_ASSUMPTION" },
      rera7030EscrowDepositCr: 436.7,
      rera30FreeCashflowCr: 187.2,
      peakDebtDrawdownCr: 48.0,
      dscrRatio: { value: 2.84, tier: "AI_ASSUMPTION" },
      investorReturnMultiple: { value: 2.85, tier: "AI_ASSUMPTION" },
      fundingTrancheSchedule: [
        {
          stage: "Tranche 1: Approvals & Statutory Deposit",
          month: 1,
          drawdownAmountCr: 12.0,
          source: "Sponsor Equity",
          milestonePrecedent: "Execution of Registered JDA & Power of Attorney",
        },
        {
          stage: "Tranche 2: Excavation & Shoring",
          month: 6,
          drawdownAmountCr: 10.0,
          source: "Sponsor Equity + Angel Sub-Debt",
          milestonePrecedent: "LDA Sanction Plan & UP RERA Registration Number Received",
        },
        {
          stage: "Tranche 3: Podium & 5th Floor Slab",
          month: 12,
          drawdownAmountCr: 25.0,
          source: "Senior Bank Construction Loan",
          milestonePrecedent: "Architect 100% Plinth Certification + 25% Unit Pre-Sales",
        },
        {
          stage: "Tranche 4: Structure Topping Out",
          month: 24,
          drawdownAmountCr: 30.0,
          source: "Senior Debt + RERA 70% Account Withdrawals",
          milestonePrecedent: "CA/Engineer/Architect Joint RERA Withdrawal Certificate (Form 3)",
        },
      ],
    },
    developmentOS: {
      approvalsFlow: [
        {
          stepNumber: 1,
          approvalName: "Revenue Conversion (Section 143/80 UP Revenue Code)",
          issuingAuthority: "Sub-Divisional Magistrate (SDM)",
          typicalDays: 45,
          statutoryCostLakhs: 8.5,
          mandatoryPrecedent: "Clear Khatoni and No Dispute Certificate",
          status: "CLEARED",
        },
        {
          stepNumber: 2,
          approvalName: "Building Plan Sanction & FAR Allocation",
          issuingAuthority: "Lucknow Development Authority (LDA)",
          typicalDays: 90,
          statutoryCostLakhs: 185.0,
          mandatoryPrecedent: "Ownership verification + Structural Stability Certificate",
          status: "IN_PROGRESS",
        },
        {
          stepNumber: 3,
          approvalName: "State Environmental Impact Assessment (SEIAA)",
          issuingAuthority: "State Environmental Clearance Authority",
          typicalDays: 120,
          statutoryCostLakhs: 14.0,
          mandatoryPrecedent: "EIA Report & Public Hearing Exemption",
          status: "NOT_STARTED",
        },
        {
          stepNumber: 4,
          approvalName: "Fire Safety Provisional NOC",
          issuingAuthority: "UP Fire Services Directorate",
          typicalDays: 30,
          statutoryCostLakhs: 6.0,
          mandatoryPrecedent: "Hydrant layout & Dual Staircase Design complying with NBC 2016",
          status: "NOT_STARTED",
        },
        {
          stepNumber: 5,
          approvalName: "Airport Authority of India (AAI) NOC",
          issuingAuthority: "AAI NOCAS Portal",
          typicalDays: 20,
          statutoryCostLakhs: 2.0,
          mandatoryPrecedent: "Topographical Elevation Survey (WGS-84 Coordinates)",
          status: "CLEARED",
        },
        {
          stepNumber: 6,
          approvalName: "UP RERA Project Registration",
          issuingAuthority: "Real Estate Regulatory Authority (UP RERA)",
          typicalDays: 30,
          statutoryCostLakhs: 12.5,
          mandatoryPrecedent: "All prior sanctions + Escrow bank account opening",
          status: "NOT_STARTED",
        },
      ],
      constructionPhases: [
        {
          phase: "Phase 1: Sub-structure & 2 Level Basements",
          durationMonths: 8,
          budgetCr: 42.0,
          milestoneDeliverable: "Soil nailing, piling, raft casting, and basement slab completion.",
        },
        {
          phase: "Phase 2: RCC Superstructure (Ground to Floor 28)",
          durationMonths: 16,
          budgetCr: 110.0,
          milestoneDeliverable: "Mivan aluminum formwork 6-day slab cycle per floor.",
        },
        {
          phase: "Phase 3: MEP, Facade, Lifts & Interior Finishing",
          durationMonths: 10,
          budgetCr: 48.0,
          milestoneDeliverable: "HVAC shafts, Schindler high-speed lifts, double-glazed facade.",
        },
        {
          phase: "Phase 4: Club, Landscaping & OC Inspection",
          durationMonths: 2,
          budgetCr: 5.8,
          milestoneDeliverable: "50,000 sq.ft clubhouse, infinity pool, municipal completion certificate.",
        },
      ],
      riskRegister: [
        {
          category: "TITLE",
          severity: "HIGH",
          description: "Sub-division partition suit risks on ancestral agricultural Khasra.",
          mitigationStrategy: "Obtain registered family settlement deed + 30-year certified public notice in 2 newspapers.",
          contingencyAction: "Escrow ₹2 Cr of security deposit for 180 days until title insurance clears.",
        },
        {
          category: "RERA",
          severity: "MEDIUM",
          description: "Stagnant RERA 70% account preventing timely administrative overhead disbursements.",
          mitigationStrategy: "Structure contractor milestone billing to align precisely with Architect Form-1 certification.",
          contingencyAction: "Maintain ₹5 Cr standalone working capital line with local co-op bank.",
        },
        {
          category: "CONSTRUCTION_INFLATION",
          severity: "MEDIUM",
          description: "TMT Steel & Ready-Mix Concrete price swings over 36-month timeline.",
          mitigationStrategy: "Forward lock 40% of steel volume via back-to-back OEM agreements with Tata/JSW.",
          contingencyAction: "Incorporate 5% raw material escalation clause in customer Sale Agreement as permitted under RERA rules.",
        },
      ],
    },
    salesEngine: {
      positioningTagline: "Sky-High Living Overlooking the International Cricket Stadium",
      targetBuyerDemographic: "Senior IT Executives, Doctors, NRIs from Gulf/US, and High-Net-Worth Business Families in UP.",
      phaseReleaseStrategy: [
        {
          phaseName: "Phase 1: Founder Priority Launch",
          launchMonth: 1,
          unitsReleased: 100,
          launchPriceSqFt: 6250,
          expectedAbsorptionMonths: 3,
          revenueRealizationCr: 125.0,
        },
        {
          phaseName: "Phase 2: Plinth Milestone Release",
          launchMonth: 6,
          unitsReleased: 140,
          launchPriceSqFt: 6800,
          expectedAbsorptionMonths: 6,
          revenueRealizationCr: 198.0,
        },
        {
          phaseName: "Phase 3: Superstructure Elevation Release",
          launchMonth: 16,
          unitsReleased: 120,
          launchPriceSqFt: 7400,
          expectedAbsorptionMonths: 8,
          revenueRealizationCr: 192.4,
        },
        {
          phaseName: "Phase 4: Ready-To-Move Premium Inventory",
          launchMonth: 30,
          unitsReleased: 54,
          launchPriceSqFt: 8400,
          expectedAbsorptionMonths: 6,
          revenueRealizationCr: 108.5,
        },
      ],
      brokerCommissionPercent: { value: 3.5, tier: "USER_PROVIDED" },
      channelPartnerTiers: [
        {
          tier: "Platinum IPCs (JLL, Knight Frank, Anarock)",
          volumeTargetCr: 75.0,
          payoutRate: "4.0% + ₹50k international travel voucher per 5 bookings",
          incentivePerks: "Dedicated VIP sales lounge & exclusive floor inventory lock",
        },
        {
          tier: "Gold Regional Brokers",
          volumeTargetCr: 25.0,
          payoutRate: "3.25% standard",
          incentivePerks: "Bi-weekly commission settlement directly to bank",
        },
        {
          tier: "Direct Corporate Referral",
          volumeTargetCr: 5.0,
          payoutRate: "1.5% referral discount credited to buyer",
          incentivePerks: "Preferred allotment during pre-launch",
        },
      ],
      digitalLeadTargetMonthly: 450,
      targetCACPerBookingLakhs: 1.8,
    },
    masterDeveloper: {
      portfolioSynergyScore: 92,
      brandCapitalContribution: "Establishes institutional marquee footprint along Shaheed Path corridor.",
      longTermRecurringAssetPotential: "Ground floor 35,000 sq.ft retail high-street retained on 9-year triple-net lease to Starbucks & Westside (generating ₹4.2 Cr annual recurring NOI).",
      strategicAcquisitionRecommendations: [
        "Acquire adjacent 1.8 Acre agricultural parcel (Khasra 415) to expand future Phase 2 commercial tower.",
        "Secure early rights of first refusal on outer ring road junction plots before metro line phase 3 groundbreaking.",
      ],
      scalabilityVerdict: "Grade A Institutional asset profile eligible for future REIT rollup or Blackstone/Brookfield platform exit.",
    },
  },
  {
    id: "ggn-dwarka-exp-8-2ac",
    dealName: "Neo-Gurugram Cyber Residences",
    timestamp: "2026-09-01T11:00:00Z",
    provenanceSummary: {
      verifiedCount: 16,
      userProvidedCount: 5,
      estimatedCount: 9,
      aiAssumptionCount: 4,
      requiresVerificationCount: 2,
    },
    propertyIntelligence: {
      parcelName: {
        value: "Sector 104, Dwarka Expressway Integrated Zone",
        tier: "VERIFIED_DATA",
        sourceAuthority: "Gurugram-Manesar Urban Development Plan 2031",
      },
      location: {
        value: "Sector 104, Dwarka Expressway (NH 248-BB), Gurugram",
        tier: "VERIFIED_DATA",
        sourceAuthority: "GMDA Cadastral Database",
      },
      city: { value: "Gurugram", tier: "VERIFIED_DATA" },
      state: { value: "Haryana", tier: "VERIFIED_DATA" },
      plotAreaSqFt: { value: 357192, tier: "VERIFIED_DATA" },
      plotAreaAcres: { value: 8.2, tier: "VERIFIED_DATA" },
      roadWidthMeters: { value: 60, tier: "VERIFIED_DATA", sourceAuthority: "GMDA Master Sector Road" },
      zoningClassification: { value: "Group Housing Residential (GH-2)", tier: "VERIFIED_DATA" },
      applicableMasterPlan: { value: "Gurugram Master Plan 2031 (TCP Haryana)", tier: "VERIFIED_DATA" },
      baseFar: { value: 1.75, tier: "VERIFIED_DATA", sourceAuthority: "Haryana Building Code 2017" },
      purchasableFarMax: { value: 1.25, tier: "VERIFIED_DATA", sourceAuthority: "DTCP Purchasable FAR Notification" },
      groundCoverageMaxPercent: { value: 33, tier: "VERIFIED_DATA" },
      circleRateSqFt: { value: 7200, tier: "VERIFIED_DATA", sourceAuthority: "Gurugram DC Circle Rate 2025" },
      marketLandRateSqFt: { value: 14500, tier: "ESTIMATED_DATA" },
      totalLandAskingPriceCr: { value: 145.0, tier: "USER_PROVIDED" },
      titleChainStatus: { value: "Freehold CLU (Change of Land Use) Cleared by DTCP", tier: "VERIFIED_DATA" },
      khasraNumbers: { value: ["89//1", "89//2", "90//3/1"], tier: "VERIFIED_DATA" },
      reraAuthorityName: { value: "HRERA Gurugram Bench", tier: "VERIFIED_DATA" },
      comparableProjects: [
        { name: "Puri Diplomatic Greens", distanceKm: 0.8, launchPriceSqFt: 9500, currentPriceSqFt: 17500, absorptionVelocityQuarterly: "55 units/qtr", builderTier: "Tier 1 National" },
        { name: "Hero Homes Sector 104", distanceKm: 0.4, launchPriceSqFt: 7800, currentPriceSqFt: 14200, absorptionVelocityQuarterly: "40 units/qtr", builderTier: "Tier 1 Regional" },
      ],
      criticalZoningNotes: ["EDC/IDC charges must be paid upfront to DTCP Haryana before building plan release."],
    },
    developmentEngine: {
      totalUsableFar: { value: 3.0, tier: "VERIFIED_DATA" },
      builtUpAreaSqFt: { value: 1071576, tier: "VERIFIED_DATA" },
      saleableCarpetEfficiencyPercent: { value: 135, tier: "AI_ASSUMPTION" },
      totalSaleableAreaSqFt: { value: 1446627, tier: "AI_ASSUMPTION" },
      unitMix: [
        { typology: "3.5 BHK Luxury Suite (2,250 sq.ft)", unitCarpetSqFt: 1550, unitSuperBuiltUpSqFt: 2250, unitCount: 420, targetPricePerUnitCr: 3.15, totalRevenueCr: 1323.0 },
        { typology: "4.5 BHK Presidential Suite (3,400 sq.ft)", unitCarpetSqFt: 2350, unitSuperBuiltUpSqFt: 3400, unitCount: 150, targetPricePerUnitCr: 5.10, totalRevenueCr: 765.0 },
      ],
      civilConstructionCostSqFt: { value: 2950, tier: "ESTIMATED_DATA" },
      mepFinishingCostSqFt: { value: 850, tier: "ESTIMATED_DATA" },
      statutoryApprovalCostSqFt: { value: 650, tier: "ESTIMATED_DATA", sourceAuthority: "EDC/IDC to DTCP Haryana" },
      contingencyPercent: { value: 5.0, tier: "AI_ASSUMPTION" },
      hardCostTotalCr: { value: 407.2, tier: "ESTIMATED_DATA" },
      softCostTotalCr: { value: 69.6, tier: "ESTIMATED_DATA" },
      totalDevelopmentCostCr: { value: 621.8, tier: "ESTIMATED_DATA" },
      grossDevelopmentValueCr: { value: 2088.0, tier: "ESTIMATED_DATA" },
      projectDurationMonths: { value: 42, tier: "USER_PROVIDED" },
      projectRoiPercent: { value: 235.8, tier: "AI_ASSUMPTION" },
      equityIrrPercent: { value: 41.5, tier: "AI_ASSUMPTION" },
      breakevenSalePriceSqFt: { value: 4298, tier: "AI_ASSUMPTION" },
      breakevenAbsorptionPercent: { value: 29.8, tier: "AI_ASSUMPTION" },
      quarterlyCashFlows: [],
      sensitivityMatrix: [],
    },
    dealStructuring: {
      recommendedStructure: { value: "REVENUE_SHARE_JDA", tier: "AI_ASSUMPTION" },
      rationale: "Landowner consortium prefers 34% revenue share with ₹18 Cr refundable security deposit to avoid high initial outright land debt.",
      structureComparison: [],
      proposedDeveloperSplitPercent: { value: 66, tier: "AI_ASSUMPTION" },
      proposedLandownerSplitPercent: { value: 34, tier: "AI_ASSUMPTION" },
      refundableSecurityDepositCr: { value: 18.0, tier: "USER_PROVIDED" },
      depositRecoveryMilestone: { value: "50% at 10th floor slab, 50% at structure completion.", tier: "AI_ASSUMPTION" },
      statutoryCostSharingRule: "EDC/IDC shared proportionally 66:34 between Developer and Landowner.",
      reraEscrowOperationRule: "HRERA 70% separate escrow with ICICI Bank Project Account.",
    },
    capitalArchitect: {
      totalFundingRequiredCr: { value: 621.8, tier: "ESTIMATED_DATA" },
      sponsorEquityCr: { value: 45.0, tier: "USER_PROVIDED" },
      sponsorEquityPercent: 7.2,
      seniorConstructionDebtCr: { value: 150.0, tier: "ESTIMATED_DATA" },
      seniorDebtInterestRatePercent: { value: 10.75, tier: "ESTIMATED_DATA" },
      partnerEquityOrSubDebtCr: { value: 35.0, tier: "ESTIMATED_DATA" },
      customerPreSaleCollectionCr: { value: 391.8, tier: "AI_ASSUMPTION" },
      rera7030EscrowDepositCr: 1461.6,
      rera30FreeCashflowCr: 626.4,
      peakDebtDrawdownCr: 110.0,
      dscrRatio: { value: 3.15, tier: "AI_ASSUMPTION" },
      investorReturnMultiple: { value: 3.4, tier: "AI_ASSUMPTION" },
      fundingTrancheSchedule: [],
    },
    developmentOS: {
      approvalsFlow: [],
      constructionPhases: [],
      riskRegister: [
        {
          category: "ZONING",
          severity: "HIGH",
          description: "DTCP Haryana EDC (External Development Charges) installment default penal interest at 18%.",
          mitigationStrategy: "Deposit entire year 1 EDC installment upfront before license issuance.",
          contingencyAction: "Retain dedicated bank guarantee with State Bank of India.",
        },
      ],
    },
    salesEngine: {
      positioningTagline: "Diplomatic Living with 15-Minute Airport Access via 16-Lane Expressway",
      targetBuyerDemographic: "Cyber City VP/MDs, Aviation Captains, Corporate Founders.",
      phaseReleaseStrategy: [],
      brokerCommissionPercent: { value: 3.0, tier: "USER_PROVIDED" },
      channelPartnerTiers: [],
      digitalLeadTargetMonthly: 900,
      targetCACPerBookingLakhs: 2.5,
    },
    masterDeveloper: {
      portfolioSynergyScore: 96,
      brandCapitalContribution: "Places developer directly into Tier 1 National League.",
      longTermRecurringAssetPotential: "45,000 sq.ft fine-dining clubhouse and sports academy creating recurring club membership annuities.",
      strategicAcquisitionRecommendations: ["Accumulate contiguous 4 acres behind plot for phase 2 plotted villas."],
      scalabilityVerdict: "Flagship institutional project ready for international PE co-investment.",
    },
  },
];

// Pre-Populated Master Mode Multi-Deal Portfolio Pipeline
export const SAMPLE_MASTER_PIPELINE: MasterPipelineCandidate[] = [
  {
    id: "pipe-1",
    dealName: "Gomti Heights Luxury High-Rise (Lucknow)",
    location: "Shaheed Path, Lucknow",
    city: "Lucknow",
    plotSizeAcres: 4.5,
    structure: "JDA_REV_SHARE",
    requiredEquityCr: 18.5,
    projectedProfitCr: 192.4,
    projectedIrrPercent: 46.8,
    executionMonths: 36,
    riskScore: "BALANCED",
    reraStatus: "Clear Title / In-Zoning",
    selectedForAllocation: true,
    allocatedEquityCr: 18.5,
  },
  {
    id: "pipe-2",
    dealName: "Amar Shaheed Plotted Enclave (Lucknow)",
    location: "Sultanpur Road Corridor",
    city: "Lucknow",
    plotSizeAcres: 12.0,
    structure: "DM_AGREEMENT",
    requiredEquityCr: 4.2,
    projectedProfitCr: 38.6,
    projectedIrrPercent: 54.2,
    executionMonths: 18,
    riskScore: "LOW",
    reraStatus: "Ready for Launch",
    selectedForAllocation: true,
    allocatedEquityCr: 4.2,
  },
  {
    id: "pipe-3",
    dealName: "Dwarka Expressway Cyber Tower (Gurugram)",
    location: "Sector 104, Gurugram",
    city: "Gurugram",
    plotSizeAcres: 8.2,
    structure: "JDA_REV_SHARE",
    requiredEquityCr: 45.0,
    projectedProfitCr: 480.0,
    projectedIrrPercent: 41.5,
    executionMonths: 42,
    riskScore: "BALANCED",
    reraStatus: "CLU Cleared",
    selectedForAllocation: false,
    allocatedEquityCr: 0,
  },
  {
    id: "pipe-4",
    dealName: "Whitefield Tech Park Infill (Bengaluru)",
    location: "Hope Farm Junction, Whitefield",
    city: "Bengaluru",
    plotSizeAcres: 3.2,
    structure: "OUTRIGHT",
    requiredEquityCr: 32.0,
    projectedProfitCr: 115.0,
    projectedIrrPercent: 32.8,
    executionMonths: 30,
    riskScore: "LOW",
    reraStatus: "RERA Registered",
    selectedForAllocation: false,
    allocatedEquityCr: 0,
  },
  {
    id: "pipe-5",
    dealName: "Ghodbunder Mountain View (Thane MMR)",
    location: "Ghodbunder Road, Thane",
    city: "Mumbai MMR",
    plotSizeAcres: 5.0,
    structure: "JDA_REV_SHARE",
    requiredEquityCr: 24.0,
    projectedProfitCr: 165.0,
    projectedIrrPercent: 38.0,
    executionMonths: 36,
    riskScore: "BALANCED",
    reraStatus: "TDR Loading Approved",
    selectedForAllocation: false,
    allocatedEquityCr: 0,
  },
];

// Learn Mode 7-Stage Curriculum Engine
export const LEARN_ENGINE_LESSONS: LearnEngineLesson[] = [
  {
    id: "learn-property-intel",
    stage: "PROPERTY_INTELLIGENCE",
    stageName: "1. Property Intelligence & Data Provenance",
    iconName: "Eye",
    headline: "The First Rule of Real Estate: Never Trust Verbal Claims Without Provenance",
    corePrinciple:
      "A developer does not buy land; they buy the legal rights, municipal zoning permissions, and road access attached to that parcel. Missing road width by 2 meters can cut your buildable FAR by 40%.",
    howTopDevelopersThink:
      "Institutional developers audit 5 layers before spending a single rupee: 1) Cadastral survey map (Khasra boundary check), 2) 30-Year non-encumbrance title chain, 3) Master Plan gazetted road width, 4) Circle rate vs market rate delta, and 5) RERA litigation history of the landowners.",
    indianMarketHeuristic:
      "If a broker says 'FAR is 3.5', your immediate response must be: 'Show me the gazetted Master Plan notification, road width survey, and purchasable FAR receipt from the development authority.'",
    formulaOrRule:
      "Buildable BUA = Plot Area (sq.ft) × Permissible FAR (Base + Purchasable based on Road Width)",
    pitfallsToAvoid: [
      "Buying agricultural land without Section 143 / non-agricultural conversion.",
      "Assuming high FAR on a narrow access road (<12m road often caps FAR at 1.5 in UP/Karnataka/Maharashtra).",
      "Ignoring high-tension power line corridors or water-body buffer zones (NGT 50m green buffer).",
    ],
    sampleRealWorldCase: {
      city: "Lucknow / Amar Shaheed Path",
      dealScenario: "A 3-acre plot offered at ₹25 Cr with broker claiming 3.5 FAR.",
      whatHappened:
        "Due diligence revealed the road was officially recorded as 18m on municipal records despite being physically 24m wide. Base FAR was capped at 2.0 instead of 2.5 until municipal road widening was notified.",
      lessonLearned:
        "The developer renegotiated the price down by ₹4.5 Cr and made ₹2 Cr of the deposit contingent upon LDA notifying the widened arterial road.",
    },
    interactiveExercise: {
      prompt:
        "You are evaluating a 20,000 sq.ft plot in an Indian Tier-1 corridor. Base FAR is 2.0. Purchasable FAR is 0.75, but requires a minimum 24-meter road width. The physical road is 30m, but the municipal Master Plan records it as 18m. What is the verified permissible FAR today?",
      options: [
        "3.5 FAR because the physical road is 30 meters wide.",
        "2.0 FAR (Base only), because the official municipal gazette governs until formal notification.",
        "2.75 FAR with automatic approval.",
        "Zero FAR because 18m road cannot support any high-rise.",
      ],
      correctIndex: 1,
      explanation:
        "Correct! Under Indian municipal laws, authorities approve building plans strictly according to gazetted master plans, regardless of physical measurements. You must model 2.0 Base FAR or secure official widening gazette notifications first.",
    },
  },
  {
    id: "learn-dev-engine",
    stage: "DEVELOPMENT_ENGINE",
    stageName: "2. Development Engine & Financial Pro-Forma",
    iconName: "Calculator",
    headline: "Translating FSI into Free Cash Flow, Unit Mix & S-Curves",
    corePrinciple:
      "Super Built-Up Area (Saleable) is an economic output; Carpet Area is the legal RERA deliverable. Your civil cost is spent on Gross Built-Up Area (BUA), while your revenue is earned on Saleable Area.",
    howTopDevelopersThink:
      "Master developers never look only at Gross Margin; they focus on Breakeven Absorption % and Peak Debt Requirement. If you can breakeven at 40% sales, you are practically immune to real estate market crashes.",
    indianMarketHeuristic:
      "Hard Civil Construction in North/South India runs ₹2,200–₹3,200/sq.ft for Mivan luxury high-rise. Approvals, architecture, and marketing add ₹500–₹800/sq.ft. Everything else is land & profit.",
    formulaOrRule:
      "Breakeven Price (₹/sqft) = Total Project Cost (Land + Hard + Soft) / Total Saleable Area (sq.ft)",
    pitfallsToAvoid: [
      "Confusing Carpet Area with Super Built-Up Area when calculating civil construction cost.",
      "Omitting 5-8% GST input tax credit friction and 6% inflation on steel/cement.",
      "Failing to model RERA 70% escrow lockup during early construction stages.",
    ],
    sampleRealWorldCase: {
      city: "Gurugram / Sector 104",
      dealScenario: "High-rise luxury project with ₹12,000/sq.ft expected sale price.",
      whatHappened:
        "Developer priced civil cost at ₹2,100/sq.ft but forgot ₹650/sq.ft Haryana EDC/IDC and ₹400/sq.ft MEP finishing, resulting in a ₹1,050/sq.ft cost underestimation.",
      lessonLearned:
        "A rigorous 3-line cost breakdown (Civil Hard + MEP/Finishes + Statutory Approvals) saved the project by adjusting unit sizes from 3BHK to 3.5BHK.",
    },
    interactiveExercise: {
      prompt:
        "If a project has a Total Development Cost of ₹100 Crore and total Saleable Super Built-up Area of 200,000 sq.ft, what is the breakeven sale price per sq.ft?",
      options: [
        "₹2,500 per sq.ft",
        "₹5,000 per sq.ft",
        "₹7,500 per sq.ft",
        "₹10,000 per sq.ft",
      ],
      correctIndex: 1,
      explanation:
        "Correct! ₹100 Crore (₹100,00,00,000) ÷ 200,000 sq.ft = ₹5,000/sq.ft. Any sale price achieved above ₹5,000/sq.ft directly generates developer gross profit.",
    },
  },
  {
    id: "learn-deal-structuring",
    stage: "DEAL_STRUCTURING",
    stageName: "3. Deal Structuring Engine (JDA vs Outright vs DM)",
    iconName: "Handshake",
    headline: "How Developers Control ₹100 Cr of Land with ₹5 Cr Equity",
    corePrinciple:
      "Amateur developers buy land with expensive debt. Professional developers structure Joint Development Agreements (JDA) or Development Management (DM) contracts where the landowner provides the asset and shares the upside.",
    howTopDevelopersThink:
      "A 68:32 Revenue Share JDA gives the developer an infinite equity multiple on land cost, eliminates stamp duty on land purchase, and creates a joint partnership where the landowner actively assists in local municipal clearances.",
    indianMarketHeuristic:
      "Never do an Area Share JDA if you can do a Revenue Share JDA. In Area Share, the landowner may sell their 34% units at a discount, competing directly against your own sales team.",
    formulaOrRule:
      "Developer Return on Equity (ROE) in JDA = Developer Net Profit / (Approvals Equity + Refundable Deposit)",
    pitfallsToAvoid: [
      "Paying an un-recoverable non-refundable deposit to the landowner.",
      "Allowing the landowner to mortgage project land to third-party lenders.",
      "Not inserting an arbitration & time-is-the-essence penalty clause for delayed land handover.",
    ],
    sampleRealWorldCase: {
      city: "Bengaluru / Whitefield",
      dealScenario: "Landowner demanded ₹40 Cr outright cash for a 3-acre prime parcel.",
      whatHappened:
        "Developer offered a 67:33 Revenue Share JDA with ₹4 Cr refundable security deposit. The landowner earned ₹58 Cr over 3 years instead of ₹40 Cr, while the developer saved ₹36 Cr in upfront equity.",
      lessonLearned: "Win-win structuring turns hesitant landowners into enthusiastic partners.",
    },
    interactiveExercise: {
      prompt:
        "Why is a Revenue Share JDA generally preferred over an Area Share JDA in modern Indian real estate?",
      options: [
        "Because Revenue Share is exempt from GST, whereas Area Share is taxed at 50%.",
        "Because in Area Share, the landowner controls physical units and might undercut your sales price, whereas in Revenue Share, the developer controls 100% of pricing and inventory.",
        "Because Revenue Share eliminates the need for RERA registration.",
        "Because Area Share requires approval from the Supreme Court of India.",
      ],
      correctIndex: 1,
      explanation:
        "Correct! In Revenue Share JDA, the developer maintains total exclusivity over marketing, pricing, and buyer contracts, preventing landowner discounting.",
    },
  },
  {
    id: "learn-capital-architect",
    stage: "CAPITAL_ARCHITECT",
    stageName: "4. Capital Architect & RERA 70:30 Cashflow Engineering",
    iconName: "Coins",
    headline: "Navigating the RERA 70:30 Escrow Rule & Senior Construction Debt",
    corePrinciple:
      "Under Section 4(2)(l)(D) of RERA, 70% of all customer collections must be deposited in a designated escrow account and can ONLY be withdrawn in proportion to construction progress certified by an Architect, Engineer, and Chartered Accountant.",
    howTopDevelopersThink:
      "Smart developers use senior construction debt to fund the initial excavation and plinth. Once plinth is achieved, customer pre-sales kick in, and the 70% RERA account becomes self-sustaining.",
    indianMarketHeuristic:
      "Your peak equity is needed between Month 1 and Month 9 (Approvals + Excavation + Plinth). After 25% construction milestone, pre-sales fund 75% of remaining project cost.",
    formulaOrRule:
      "RERA Escrow Available = Customer Receipts × 70% × (% Construction Completion Certified by CA Form-3)",
    pitfallsToAvoid: [
      "Assuming customer booking advances can be freely used for marketing or buying new land.",
      "Over-leveraging with NBFC mezzanine debt at 16-18% interest before RERA registration.",
      "Failing to maintain a DSCR (Debt Service Coverage Ratio) above 1.75x for senior bank lenders.",
    ],
    sampleRealWorldCase: {
      city: "Noida / Expressway",
      dealScenario: "Mid-size builder raised ₹30 Cr expensive debt at 17% to fund land acquisition.",
      whatHappened:
        "Approval delays caused interest meter to run for 14 months before launch. Once launched, RERA locked 70% of sales, leaving insufficient free cash flow to service the 17% debt.",
      lessonLearned:
        "Always sync debt drawdowns with statutory approval milestones, never draw full loan upfront.",
    },
    interactiveExercise: {
      prompt:
        "If a customer pays ₹1 Crore towards a flat, how much money goes into the dedicated RERA construction escrow account?",
      options: [
        "₹30 Lakhs (30%)",
        "₹50 Lakhs (50%)",
        "₹70 Lakhs (70%)",
        "₹100 Lakhs (100%)",
      ],
      correctIndex: 2,
      explanation:
        "Correct! Section 4(2)(l)(D) mandates exactly 70% of all real estate project receivables to be deposited into the separate RERA escrow account for construction and land costs.",
    },
  },
  {
    id: "learn-dev-os",
    stage: "DEVELOPMENT_OS",
    stageName: "5. Development OS (Statutory Approvals & Execution)",
    iconName: "Building",
    headline: "The 32-Step Indian Approval Ladder & Mivan Construction Cycles",
    corePrinciple:
      "Time is the developer's most expensive commodity. Every month of delay in municipal clearance burns 1-1.5% in cost of capital and overheads.",
    howTopDevelopersThink:
      "Master developers run parallel approval tracks (Fire NOC + Airport AAI + Pollution Control PCB while LDA/DTCP examines building plans) rather than sequential submissions.",
    indianMarketHeuristic:
      "Mivan aluminum formwork cuts slab cycle time from 18 days (traditional ply shuttering) to 6-7 days per floor, saving 6 to 9 months on a 25-floor tower.",
    formulaOrRule:
      "Project Velocity = Total Structural Height (Floors) ÷ Average Slab Casting Cycle (Days/Floor)",
    pitfallsToAvoid: [
      "Starting physical excavation before receiving formal RERA registration certificate.",
      "Violating National Building Code (NBC 2016) fire driveway widths (minimum 6m clear turning radius).",
      "Awarding EPC contracts without performance bank guarantees and liquidated damages clauses.",
    ],
    sampleRealWorldCase: {
      city: "Thane / Mumbai MMR",
      dealScenario: "High-density 32-story tower faced a 6-month stop-work notice.",
      whatHappened:
        "Fire Department rejected the driveway because the developer encroached on the 6-meter peripheral open space for decorative landscaping.",
      lessonLearned: "Never compromise statutory setback dimensions for aesthetic landscaping.",
    },
    interactiveExercise: {
      prompt:
        "Can a developer advertise, market, or take booking advances for a residential project before obtaining a RERA Registration Number?",
      options: [
        "Yes, if they state 'RERA Applied For' in small print.",
        "Yes, up to 10% advance from friends and family.",
        "Strictly NO. Section 3 of RERA imposes severe penal liabilities (up to 10% of project cost) for pre-RERA marketing.",
        "Yes, in Tier-2 cities only.",
      ],
      correctIndex: 2,
      explanation:
        "Correct! Under Section 3 of the Real Estate (Regulation and Development) Act, 2016, no promoter can advertise, market, book, sell, or offer for sale any plot or apartment without registered RERA approval.",
    },
  },
  {
    id: "learn-sales-engine",
    stage: "SALES_ENGINE",
    stageName: "6. Sales Engine & Price Escalation Ladders",
    iconName: "TrendingUp",
    headline: "Step-Up Pricing, Channel Partner Loyalty & Absorption Velocity",
    corePrinciple:
      "Never sell your best inventory at launch. Sell 25% at launch to achieve breakeven and create market buzz, then escalate prices by 5-8% at each structural slab milestone.",
    howTopDevelopersThink:
      "Top developers don't rely on random newspaper ads. They build institutional Channel Partner (broker) tiers with guaranteed 15-day commission settlements and digital retargeting funnels for NRI buyers.",
    indianMarketHeuristic:
      "A project should increase its price per sq.ft by 25-35% between groundbreaking and occupancy certificate (OC). The late buyers pay for the early risk taken by pre-launch investors.",
    formulaOrRule:
      "Weighted Average Price (WAP) = Σ(Units in Phase × Launch Price in Phase) / Total Units",
    pitfallsToAvoid: [
      "Overpaying brokers upfront before buyer completes 20% registration agreement.",
      "Releasing upper-floor premium penthouse inventory at standard base prices.",
      "Failing to track Digital Lead-to-Site-Visit conversion ratios (industry benchmark: 4-6%).",
    ],
    sampleRealWorldCase: {
      city: "Hyderabad / Kokapet",
      dealScenario: "High-rise luxury project launched at ₹7,200/sq.ft.",
      whatHappened:
        "Developer sold 100% of inventory in 45 days at launch price. The project was celebrated, but the developer lost ₹85 Crore in potential price appreciation as market rates hit ₹11,500/sq.ft by year 2.",
      lessonLearned: "Selling out too fast is a failure of pricing strategy. Phase your inventory.",
    },
    interactiveExercise: {
      prompt:
        "Why is it dangerous for a developer to sell 100% of project inventory in the first 60 days of launch?",
      options: [
        "Because the government will cancel the RERA license.",
        "Because the developer loses all future price appreciation during the 3-year construction cycle, while remaining 100% exposed to construction cost inflation.",
        "Because buyers will refuse to pay their installments.",
        "Because bank interest rates will automatically double.",
      ],
      correctIndex: 1,
      explanation:
        "Correct! Selling out immediately locks in revenue while leaving the developer exposed to steel/cement inflation and missing out on 25-40% price appreciation during the build.",
    },
  },
  {
    id: "learn-master-developer",
    stage: "MASTER_DEVELOPER",
    stageName: "7. Master Developer & Capital Allocation",
    iconName: "Crown",
    headline: "How Single-Project Builders Scale into Multi-City Urban Platforms",
    corePrinciple:
      "A builder does construction; a Developer allocates capital; a Master Developer shapes urban ecosystems and retains recurring cash flow assets.",
    howTopDevelopersThink:
      "Master developers never keep all capital in high-rise residential. They balance their portfolio with 50% High-velocity residential (for fast cash), 30% Plotted townships (for zero-debt quick turnarounds), and 20% Commercial retail lease assets (for perpetual rental annuities).",
    indianMarketHeuristic:
      "Retain 15-20% of ground-floor retail in every residential project on 9-year corporate leases. That retail NOI creates an unshakeable balance sheet that banks lend against at low rates (LRD - Lease Rental Discounting).",
    formulaOrRule:
      "Blended Portfolio IRR = Σ(Project Equity Allocated × Project IRR) / Total Portfolio Capital",
    pitfallsToAvoid: [
      "Over-concentrating 100% of equity into a single mega-project.",
      "Neglecting geographic diversification across high-growth secondary corridors.",
      "Expanding into new cities without local regulatory and liaison joint venture partners.",
    ],
    sampleRealWorldCase: {
      city: "National Platform / Lucknow & NCR",
      dealScenario: "Developer had ₹25 Cr surplus capital.",
      whatHappened:
        "Instead of putting all ₹25 Cr into one 10-acre high-rise, they split: ₹18 Cr into a 68:32 JDA high-rise and ₹7 Cr into a 15-acre plotted development DM agreement. Plotted cash flow self-funded the high-rise equity requirements.",
      lessonLearned: "Portfolio sequencing creates self-funding development flywheels.",
    },
    interactiveExercise: {
      prompt:
        "You have ₹10 Crore in equity capital. Which allocation strategy provides the highest risk-adjusted portfolio return?",
      options: [
        "Invest all ₹10 Cr into buying 1 small piece of land outright.",
        "Allocate ₹6.5 Cr as refundable deposit/approvals for a 68:32 Revenue Share high-rise, and ₹3.5 Cr into a 12-month Plotted Development with quick cash turnaround.",
        "Keep all ₹10 Cr in a fixed deposit at 7% interest.",
        "Purchase 5 luxury penthouses in another builder's project.",
      ],
      correctIndex: 1,
      explanation:
        "Correct! Splitting capital between a high-margin high-rise JDA and a fast-turnaround plotted development diversifies risk, accelerates cash returns, and maximizes blended ROE.",
    },
  },
];
