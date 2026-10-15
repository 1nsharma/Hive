import { DueDiligenceItem, ProjectPipelineItem } from "../types";

export const DUE_DILIGENCE_CHECKLIST: DueDiligenceItem[] = [
  // 1. Land & Title
  {
    id: "dd-1",
    category: "Land & Title",
    title: "30-Year Chain of Title Deeds (Sub-Registrar Search)",
    description: "Verify continuous sequence of registered sale deeds, gift deeds, partitions, and settlement deeds without gaps back at least 30 years.",
    riskIfIgnored: "Undiscovered co-heirs or historical sales can obtain court injunctions halting construction.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-2",
    category: "Land & Title",
    title: "Non-Encumbrance Certificate (Form 15 & Form 16)",
    description: "Obtain official nil-encumbrance certificate from the sub-registrar office covering minimum 30 years.",
    riskIfIgnored: "Pre-existing bank mortgages, court attachments, or statutory tax liens taking first priority over land.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-3",
    category: "Land & Title",
    title: "Revenue Records: 7/12 Extract, Khasra / Khatauni & Mutation Register",
    description: "Ensure current landowner's name is explicitly mutated and updated in the government revenue land records.",
    riskIfIgnored: "Registered sale deed without revenue mutation prevents obtaining municipal building sanctions.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-4",
    category: "Land & Title",
    title: "Public Notice in 2 Newspapers (English & Vernacular)",
    description: "Publish 14-day formal objection notice regarding title purchase / development rights in leading circulation dailies.",
    riskIfIgnored: "Protects against bona fide third-party claims and proves due diligence in future civil litigation.",
    status: "pending",
    mandatory: true
  },
  {
    id: "dd-5",
    category: "Land & Title",
    title: "Agricultural to Non-Agricultural (NA / CLU) Conversion",
    description: "Verify Change of Land Use (CLU) or formal NA order under the state Land Revenue Code.",
    riskIfIgnored: "Developing residential or commercial buildings on unconverted agricultural land is illegal and liable to demolition.",
    status: "pending",
    mandatory: true
  },

  // 2. Zoning & Municipal
  {
    id: "dd-6",
    category: "Zoning & Municipal",
    title: "Master Plan Alignment & Land Use Classification",
    description: "Confirm plot is zoned for Residential / Commercial / Industrial in the approved city Master Development Plan.",
    riskIfIgnored: "Land situated in Green Belt, agricultural preservation, or defense buffer cannot receive building permissions.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-7",
    category: "Zoning & Municipal",
    title: "Abutting Road Width & Proposed Right-of-Way (RoW)",
    description: "Physically and officially verify existing asphalt road width and master plan road widening reservations.",
    riskIfIgnored: "Permissible FAR is strictly capped by road width; road widening setbacks reduce usable plot footprint.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-8",
    category: "Zoning & Municipal",
    title: "Water Body / Nala / High-Tension Wire Buffers",
    description: "Verify mandatory 15m - 50m green buffer from lakes, secondary storm-water drains (nalas), and overhead HT electricity lines.",
    riskIfIgnored: "National Green Tribunal (NGT) or state pollution boards can cancel environmental clearances and freeze project accounts.",
    status: "verified",
    mandatory: true
  },

  // 3. Technical & Soil
  {
    id: "dd-9",
    category: "Technical & Soil",
    title: "Geotechnical Borehole Soil Investigation Report",
    description: "Minimum 3 to 5 boreholes down to hard rock strata to determine safe bearing capacity (SBC) and water table level.",
    riskIfIgnored: "Surprise low-bearing soil requires deep piling, escalating substructure costs by 15-30% of total budget.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-10",
    category: "Technical & Soil",
    title: "Topographical Total-Station & Contour Survey",
    description: "Verify physical boundary coordinates (DGPS), physical fencing alignment with revenue maps, and ground slope for stormwater.",
    riskIfIgnored: "Encroachments by neighbors or discrepancies between ground measurement and deed area lead to boundary disputes.",
    status: "verified",
    mandatory: true
  },

  // 4. RERA & Legal
  {
    id: "dd-11",
    category: "RERA & Legal",
    title: "RERA Registration & 70% Escrow Account Set-Up",
    description: "Mandatory project registration on state RERA portal with designated scheduled bank escrow account prior to marketing.",
    riskIfIgnored: "Up to 10% penalty on total project cost and prohibition from advertising or collecting buyer advances.",
    status: "pending",
    mandatory: true
  },
  {
    id: "dd-12",
    category: "RERA & Legal",
    title: "Drafting Registered JDA & Irrevocable Power of Attorney (POA)",
    description: "Registered Joint Development Agreement with clear milestone timelines, allocation matrix, and non-revocable development POA.",
    riskIfIgnored: "Unregistered JDA holds zero legal evidentiary value in title disputes under the Registration Act.",
    status: "pending",
    mandatory: true
  },
  {
    id: "dd-13",
    category: "RERA & Legal",
    title: "Statutory NOC Matrix (Fire, Airport AAI, MOEF Environmental)",
    description: "Obtain Height clearance from Airport Authority, Fire Department Provisional NOC, and State Environmental Impact Assessment (SEIAA).",
    riskIfIgnored: "Inability to obtain building commencement certificate (CC) or final occupancy certificate (OC).",
    status: "pending",
    mandatory: true
  },

  // 5. Financial & Tax
  {
    id: "dd-14",
    category: "Financial & Tax",
    title: "Income Tax Section 56(2)(x) & 43CA Circle Rate Gap Audit",
    description: "Verify transaction rate matches or exceeds statutory circle rate to avoid tax penalties on deemed income.",
    riskIfIgnored: "Both developer and seller penalized with 30%+ income tax on difference between circle rate and transaction price.",
    status: "verified",
    mandatory: true
  },
  {
    id: "dd-15",
    category: "Financial & Tax",
    title: "GST Anti-Profiteering & Input Tax Credit (ITC) Alignment",
    description: "Plan 1% (affordable) or 5% (regular residential) GST regime without ITC, or 18% commercial with full ITC offset.",
    riskIfIgnored: "Unbudgeted tax leakages reducing net developer profit margin.",
    status: "verified",
    mandatory: true
  }
];

export const INITIAL_PIPELINE: ProjectPipelineItem[] = [
  {
    id: "pip-1",
    title: "The Grand Horizon",
    location: "Sector 82, Gurgaon NCR",
    assetClass: "Residential Mid-Rise",
    stage: "Approvals",
    projectSizeSqFt: 136000,
    estimatedCostCr: 38.5,
    expectedRevenueCr: 58.0,
    targetMarginPercent: 33.6,
    status: "active",
    structure: "65:35 Revenue Share JDA"
  },
  {
    id: "pip-2",
    title: "Silicon Square Tech Hub",
    location: "Whitefield, Bengaluru",
    assetClass: "Boutique Commercial",
    stage: "Under Construction",
    projectSizeSqFt: 85000,
    estimatedCostCr: 42.0,
    expectedRevenueCr: 68.5,
    targetMarginPercent: 38.7,
    status: "active",
    structure: "Outright Purchase + Debt"
  },
  {
    id: "pip-3",
    title: "Pine Valley Plotted Woods",
    location: "Dehradun Highway",
    assetClass: "Plotted Development",
    stage: "Sales & Marketing",
    projectSizeSqFt: 218000,
    estimatedCostCr: 16.5,
    expectedRevenueCr: 31.0,
    targetMarginPercent: 46.8,
    status: "active",
    structure: "Area Share JDA (60:40)"
  },
  {
    id: "pip-4",
    title: "Metro Gateway Mixed-Use",
    location: "Noida Expressway",
    assetClass: "Mixed-Use Retail & Living",
    stage: "Due Diligence",
    projectSizeSqFt: 350000,
    estimatedCostCr: 110.0,
    expectedRevenueCr: 175.0,
    targetMarginPercent: 37.1,
    status: "pipeline",
    structure: "Institutional Platform JV"
  }
];
