import { CityMarketBenchmark, PromptTemplateItem, PitchDeckSlide } from "../types";

export const INDIAN_CITY_BENCHMARKS: CityMarketBenchmark[] = [
  {
    id: "lko-shaheed-path",
    city: "Lucknow",
    locality: "Shaheed Path & Amar Shaheed Corridor",
    state: "Uttar Pradesh",
    zoneType: "Tier-2 Express Highway",
    standardFar: 2.25,
    purchasableFarMax: 1.25,
    avgCircleRateSqFt: 3200,
    avgMarketLandRateSqFt: 5800,
    avgApartmentSalePriceSqFt: 6200,
    avgCivilMepCostSqFt: 2250,
    typicalApprovalMonths: 4,
    reraAuthority: "UP RERA (Lucknow Bench)",
    typicalJdaRevenueShare: "68% Developer : 32% Landowner",
    demandDrivers: [
      "Proximity to Ekana Stadium, Phoenix Palassio & Lulu Mall",
      "Direct connect to Airport via Outer Ring Road",
      "Major healthcare hubs (Medanta, SGPGI expansion)",
      "High demand for 2.5 & 3 BHK gated communities",
    ],
  },
  {
    id: "lko-gomti-nagar-ext",
    city: "Lucknow",
    locality: "Gomti Nagar Extension (Sector 4 to 8)",
    state: "Uttar Pradesh",
    zoneType: "Suburban Infill",
    standardFar: 2.5,
    purchasableFarMax: 1.0,
    avgCircleRateSqFt: 3800,
    avgMarketLandRateSqFt: 7200,
    avgApartmentSalePriceSqFt: 7100,
    avgCivilMepCostSqFt: 2400,
    typicalApprovalMonths: 4,
    reraAuthority: "UP RERA",
    typicalJdaRevenueShare: "66% Developer : 34% Landowner",
    demandDrivers: [
      "Established high-income catchment & IT City proximity",
      "Well-planned LDA road grid (24m & 30m sector roads)",
      "High investor rental yields for 2 & 3 BHK apartments",
    ],
  },
  {
    id: "ggn-dwarka-exp",
    city: "Gurugram (NCR)",
    locality: "Dwarka Expressway (Sectors 102 - 109)",
    state: "Haryana",
    zoneType: "Emerging Growth Corridor",
    standardFar: 2.5,
    purchasableFarMax: 1.25,
    avgCircleRateSqFt: 7500,
    avgMarketLandRateSqFt: 18500,
    avgApartmentSalePriceSqFt: 15500,
    avgCivilMepCostSqFt: 3400,
    typicalApprovalMonths: 6,
    reraAuthority: "HRERA Gurugram",
    typicalJdaRevenueShare: "62% Developer : 38% Landowner",
    demandDrivers: [
      "Direct seamless 15-min link to IGI Airport Terminal 3",
      "Institutional luxury grade housing boom (3BHK+Servant format)",
      "High NRI & multinational corporate buyer density",
      "New commercial corridor & diplomatic enclave nearby",
    ],
  },
  {
    id: "ggn-golf-course-ext",
    city: "Gurugram (NCR)",
    locality: "Golf Course Extension Road (Sectors 62 - 66)",
    state: "Haryana",
    zoneType: "Prime Metro",
    standardFar: 2.75,
    purchasableFarMax: 1.5,
    avgCircleRateSqFt: 11000,
    avgMarketLandRateSqFt: 28000,
    avgApartmentSalePriceSqFt: 24000,
    avgCivilMepCostSqFt: 4200,
    typicalApprovalMonths: 6,
    reraAuthority: "HRERA Gurugram",
    typicalJdaRevenueShare: "58% Developer : 42% Landowner",
    demandDrivers: [
      "Established ultra-luxury corridor (DLF, M3M, Trump Towers)",
      "Hub of grade-A tech parks and Fortune 500 offices",
      "Rapid capital appreciation and high ticket transactions",
    ],
  },
  {
    id: "blr-whitefield",
    city: "Bengaluru",
    locality: "Whitefield (Hope Farm / ITPL Corridor)",
    state: "Karnataka",
    zoneType: "Prime Metro",
    standardFar: 2.5,
    purchasableFarMax: 1.0,
    avgCircleRateSqFt: 5200,
    avgMarketLandRateSqFt: 12500,
    avgApartmentSalePriceSqFt: 11200,
    avgCivilMepCostSqFt: 2900,
    typicalApprovalMonths: 5,
    reraAuthority: "K-RERA",
    typicalJdaRevenueShare: "65% Developer : 35% Landowner",
    demandDrivers: [
      "Operational Purple Line Metro connectivity",
      "Persistent IT engineering workforce housing demand",
      "Strong preference for 3BHK high-rise societies",
    ],
  },
  {
    id: "noida-sec-150",
    city: "Noida (NCR)",
    locality: "Sector 150 (Expressway Green Zone)",
    state: "Uttar Pradesh",
    zoneType: "Emerging Growth Corridor",
    standardFar: 2.75,
    purchasableFarMax: 1.0,
    avgCircleRateSqFt: 4800,
    avgMarketLandRateSqFt: 11500,
    avgApartmentSalePriceSqFt: 9800,
    avgCivilMepCostSqFt: 2750,
    typicalApprovalMonths: 4,
    reraAuthority: "UP RERA",
    typicalJdaRevenueShare: "67% Developer : 33% Landowner",
    demandDrivers: [
      "Low-density sports city master plan with 70% green cover",
      "Proximity to upcoming Noida International Airport (Jewar)",
      "Signal-free connectivity via Noida-Greater Noida Expressway",
    ],
  },
  {
    id: "mum-thane-ghodbunder",
    city: "Mumbai MMR",
    locality: "Thane West (Ghodbunder Road)",
    state: "Maharashtra",
    zoneType: "Suburban Infill",
    standardFar: 1.33,
    purchasableFarMax: 2.17, // TDR + Premium FSI
    avgCircleRateSqFt: 8500,
    avgMarketLandRateSqFt: 17000,
    avgApartmentSalePriceSqFt: 14200,
    avgCivilMepCostSqFt: 3600,
    typicalApprovalMonths: 7,
    reraAuthority: "MahaRERA",
    typicalJdaRevenueShare: "60% Developer : 40% Landowner",
    demandDrivers: [
      "Upcoming Metro Line 4 & Thane-Borivali underground twin tunnel",
      "Robust retail infrastructure and corporate offices",
      "Massive redevelopment & SRA potential",
    ],
  },
  {
    id: "hyd-kokapet",
    city: "Hyderabad",
    locality: "Kokapet Neopolis / Financial District",
    state: "Telangana",
    zoneType: "Prime Metro",
    standardFar: 4.5, // Unlimited/Flexible FAR regime with impact fees
    purchasableFarMax: 2.5,
    avgCircleRateSqFt: 6800,
    avgMarketLandRateSqFt: 22000,
    avgApartmentSalePriceSqFt: 12500,
    avgCivilMepCostSqFt: 3100,
    typicalApprovalMonths: 3,
    reraAuthority: "TS RERA",
    typicalJdaRevenueShare: "64% Developer : 36% Landowner",
    demandDrivers: [
      "High-rise skyscraper zoning with fast-track TS-bPASS single window",
      "Walking distance from global financial tech headquarters",
      "Direct connect to Outer Ring Road (ORR) & Airport",
    ],
  },
];

export const SAAS_DATABASE_SCHEMA_SPEC = {
  version: "v2.4-production",
  dbEngine: "PostgreSQL 16 with PostGIS & pgvector",
  tables: [
    {
      name: "organizations",
      description: "Developer companies, family offices, prop-tech brokerages, and fund managers.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Unique Org Identifier" },
        { name: "name", type: "VARCHAR(255)", notes: "Company Name (e.g., Apex Infra Developers)" },
        { name: "plan_tier", type: "ENUM('starter', 'pro', 'institutional')", notes: "SaaS Subscription Tier" },
        { name: "rera_registration_no", type: "VARCHAR(100)", notes: "Promoter RERA Registration" },
        { name: "primary_city", type: "VARCHAR(100)", notes: "Headquarters market" },
        { name: "created_at", type: "TIMESTAMPTZ", notes: "Default NOW()" },
      ],
    },
    {
      name: "land_parcels",
      description: "Raw land intake with geo-coordinates, municipal zoning, and legal tags.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Parcel UUID" },
        { name: "org_id", type: "UUID REFERENCES organizations", notes: "Multi-tenant tenant key" },
        { name: "title", type: "VARCHAR(255)", notes: "Deal nickname (e.g. 5 Acre Plot Shaheed Path)" },
        { name: "geom", type: "GEOMETRY(Polygon, 4326)", notes: "PostGIS boundary polygon" },
        { name: "plot_area_sqft", type: "NUMERIC(14,2)", notes: "Total plot area in Sq Ft" },
        { name: "frontage_width_meters", type: "NUMERIC(8,2)", notes: "Road width determining FAR eligibility" },
        { name: "khasra_numbers", type: "TEXT[]", notes: "Revenue survey numbers" },
        { name: "circle_rate_sqft", type: "NUMERIC(10,2)", notes: "Government stamp circle rate" },
        { name: "asking_price_cr", type: "NUMERIC(12,2)", notes: "Owner's total ask in Crores" },
        { name: "status", type: "ENUM('intake', 'evaluated', 'term_sheet', 'live', 'rejected')", notes: "Pipeline phase" },
      ],
    },
    {
      name: "deal_models",
      description: "Institutional pro-forma financial models with live scenario branching.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Model Run ID" },
        { name: "parcel_id", type: "UUID REFERENCES land_parcels", notes: "Target land" },
        { name: "base_far", type: "NUMERIC(4,2)", notes: "Permissible standard FAR" },
        { name: "purchasable_far", type: "NUMERIC(4,2)", notes: "Additional FAR via betterment fee" },
        { name: "saleable_efficiency_factor", type: "NUMERIC(4,2)", notes: "Super built-up multiplier (1.25 - 1.35)" },
        { name: "civil_cost_sqft", type: "NUMERIC(10,2)", notes: "Hard construction baseline" },
        { name: "target_sale_price_sqft", type: "NUMERIC(10,2)", notes: "Target realization" },
        { name: "gdv_cr", type: "NUMERIC(14,2)", notes: "Gross Development Value in ₹ Cr" },
        { name: "tdc_cr", type: "NUMERIC(14,2)", notes: "Total Development Cost in ₹ Cr" },
        { name: "net_profit_cr", type: "NUMERIC(14,2)", notes: "Net developer pre-tax profit" },
        { name: "irr_annualized", type: "NUMERIC(6,2)", notes: "Calculated equity IRR %" },
        { name: "equity_multiple", type: "NUMERIC(4,2)", notes: "MOIC (e.g. 2.45x)" },
      ],
    },
    {
      name: "deal_structures",
      description: "Commercial term structures comparing Outright, Area JDA, Rev-Share, DM.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Structure ID" },
        { name: "model_id", type: "UUID REFERENCES deal_models", notes: "Parent model" },
        { name: "structure_type", type: "ENUM('outright', 'jda_area', 'revenue_share', 'dm_fee', 'jv_equity')", notes: "Deal format" },
        { name: "developer_split_pct", type: "NUMERIC(5,2)", notes: "e.g. 68.00%" },
        { name: "landowner_split_pct", type: "NUMERIC(5,2)", notes: "e.g. 32.00%" },
        { name: "refundable_deposit_cr", type: "NUMERIC(10,2)", notes: "Security deposit paid at signing" },
        { name: "upfront_equity_required_cr", type: "NUMERIC(10,2)", notes: "Developer cash outlay" },
        { name: "projected_developer_roe", type: "NUMERIC(6,2)", notes: "Return on Equity %" },
      ],
    },
    {
      name: "documents_vault",
      description: "OCR-indexed title deeds, master plans, soil reports with pgvector embeddings for RAG.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Document ID" },
        { name: "parcel_id", type: "UUID REFERENCES land_parcels", notes: "Linked parcel" },
        { name: "doc_type", type: "ENUM('sale_deed', 'khasra_farad', 'master_plan', 'soil_test', 'rera_draft', 'other')", notes: "Classification" },
        { name: "file_url", type: "TEXT", notes: "Encrypted Cloud Storage path" },
        { name: "extracted_text", type: "TEXT", notes: "OCR extracted raw text" },
        { name: "embedding", type: "VECTOR(768)", notes: "Gemini embedding vector for Q&A search" },
        { name: "ai_risk_flags", type: "JSONB", notes: "Automated encumbrance/title warnings" },
      ],
    },
    {
      name: "ai_deal_memos",
      description: "Exportable 1-page investment committee memos generated by the AI co-developer.",
      fields: [
        { name: "id", type: "UUID PRIMARY KEY", notes: "Memo ID" },
        { name: "model_id", type: "UUID REFERENCES deal_models", notes: "Linked model" },
        { name: "memo_json", type: "JSONB", notes: "Full structured evaluation output" },
        { name: "recommendation", type: "VARCHAR(50)", notes: "PROCEED_AGGRESSIVELY / JDA / REJECT" },
        { name: "created_by_agent", type: "VARCHAR(100)", notes: "Gemini 3.7 Agent Orchestrator" },
        { name: "version", type: "INTEGER", notes: "Draft iteration number" },
      ],
    },
  ],
  apiWorkflows: [
    {
      step: 1,
      name: "POST /api/v1/deals/ingest",
      role: "Deal Analyst",
      input: "Plot size, location string, asking price, asset type, title PDF",
      process: "Extracts coordinates via GeoCoder, queries State DCR database for base FAR, runs OCR on document.",
      output: "Standardized Parcel Entity + Initial Zoning Bounds.",
    },
    {
      step: 2,
      name: "POST /api/v1/deals/model-engine",
      role: "Pro-Forma Math Core",
      input: "Parcel Entity + Local Cost Benchmarks",
      process: "Calculates BUA, Saleable Area, Land/Civil/Approval/Contingency costs, GDV, S-Curve monthly cashflows.",
      output: "Multi-scenario financial matrix (Conservative, Base, Aggressive).",
    },
    {
      step: 3,
      name: "POST /api/v1/deals/ai-memo",
      role: "Investment Committee AI",
      input: "Financial Matrix + Due Diligence Flags",
      process: "Gemini 3.7 synthesizes executive summary, risk audit, JDA revenue split, and strategic scaling thesis.",
      output: "1-Page Downloadable Deal Memo + Term Sheet template.",
    },
  ],
};

export const AGENT_PROMPTS_SPEC: PromptTemplateItem[] = [
  {
    id: "deal-analyst-memo",
    tag: "DEAL",
    roleTitle: "Deal Analyst & 1-Page Memo Generator",
    description: "Evaluates raw land, verifies circle vs market rates, calculates buildable density, and produces an IC investment memo.",
    curriculumLevels: "Level 0 & 1",
    keyFocusAreas: ["Residual Land Valuation", "FAR/FSI Optimization", "Cost Stack Slicing", "Breakeven Realization"],
    defaultInput: `Evaluate this 4.5 Acre land parcel on Shaheed Path, Lucknow:
- Asking Price: ₹38.5 Crores
- Circle Rate: ₹3,200/sq.ft
- Road Width: 30 meters (Permissible FAR: 2.5 + Purchasable 1.0)
- Proposed Product: 2.5 & 3 BHK High-rise Residential (320 units)
- Expected Market Sale Price: ₹6,500/sq.ft
- Civil Construction: ₹2,350/sq.ft`,
    systemPrompt: `You are the Principal Real Estate Deal Analyst for an Indian Real Estate Developer.
Given raw plot dimensions, municipal zoning, and market rates:
1. Calculate Total Built-Up Area (BUA = Plot Area × Total FAR) and Saleable Area (BUA × Super Built-up Loading).
2. Deconstruct Total Development Cost (TDC) into: Land Cost, Stamp Duty (7%), Approvals & Betterment (₹350/sqft), Civil & MEP (₹/sqft), Marketing/Brokerage (3%), Contingency (5%), and Finance IDC.
3. Calculate Gross Development Value (GDV = Saleable Area × Sale Price/sqft).
4. Compute Net Developer Margin (%), Equity IRR (%), and Breakeven Sale Price (₹/sqft).
5. Output an executive 1-Page Investment Memo with clear verdict: [PROCEED], [PROCEED_WITH_JDA], or [REJECT].`,
    outputFormat: `Structured JSON + Formatted Markdown Memo containing: Executive Verdict, Financial Scorecard, Cost Distribution, Revenue Sensitivity, and Key Downside Mitigations.`,
  },
  {
    id: "land-zoning-eval",
    tag: "LAND",
    roleTitle: "Land & Zoning Optimization Specialist",
    description: "Interprets State Master Plans, DCR zoning rules, road-width FAR multipliers, and TDR potential.",
    curriculumLevels: "Level 1 & 2",
    keyFocusAreas: ["Ground Coverage", "Setbacks", "Purchasable FSI Fees", "Environmental Buffer"],
    defaultInput: `Analyze a 65,000 sq.ft corner plot in Sector 150, Noida abutting a 45-meter sector road and 24-meter internal road. How can we maximize permissible FAR and what is the statutory green area constraint?`,
    systemPrompt: `You are a Municipal Master Planner and Zoning Architect in India.
Analyze road width regulations, front/rear/side setbacks, fire tender access clearances, and TOD (Transit-Oriented Development) incentives.
Detail the cost-benefit trade-off between purchasing extra FAR from the local authority vs buying TDR from the open market.`,
    outputFormat: `Zoning Matrix: Base FAR, Max Permissible FAR, Land Dedication %, Maximum Height Ceiling, and Authority Impact Fees breakdown.`,
  },
  {
    id: "capital-architect",
    tag: "MONEY",
    roleTitle: "Capital Architect & Funding Structurer",
    description: "Designs the optimal capital stack, balances founder equity vs senior debt vs customer presales under RERA 70:30 rules.",
    curriculumLevels: "Level 4",
    keyFocusAreas: ["RERA 70:30 Escrow Model", "Construction Finance (CF)", "Mezzanine Equity", "DSCR Modeling"],
    defaultInput: `We have a ₹120 Crore residential project in Gurugram. We have ₹25 Crore developer equity. Design the optimal capital stack using senior bank debt at 10.75%, customer presale advances, and a ₹15 Crore landowner refundable deposit.`,
    systemPrompt: `You are an Institutional Real Estate Chief Financial Officer.
Design a risk-insulated capital stack complying with RERA 70:30 Escrow mandates.
Ensure:
1. Upfront approval and land costs are funded via Developer Equity + Early-Bird Mezzanine.
2. Construction cash flows are paced against RERA-compliant customer milestone collections.
3. Senior Debt draws occur strictly as construction advances, maintaining a Minimum DSCR of 1.45x.
4. Calculate Project IRR vs Equity IRR under varying presale velocity assumptions (20%, 40%, 70% sold at launch).`,
    outputFormat: `Capital Stack Waterfall Table (Source, ₹ Cr, % of TDC, Cost of Capital, Security Collateral), S-Curve Drawdown Schedule, and Sensitivity Table.`,
  },
  {
    id: "deal-structuring-jda",
    tag: "STRATEGY",
    roleTitle: "Deal Structurer & JDA Strategist",
    description: "Compares Outright acquisition vs Area Sharing vs Revenue Sharing vs Development Management (DM).",
    curriculumLevels: "Level 3",
    keyFocusAreas: ["Area vs Revenue Share", "Security Deposit Terms", "Section 45(5A) Income Tax", "GST on Landowner Share"],
    defaultInput: `Landowner owns a ₹50 Crore plot in Bengaluru. They refuse an outright discount. Structure a 65:35 Revenue Share JDA with ₹5 Crore refundable deposit and draft key commercial covenants protecting the developer against title encumbrances and sales delays.`,
    systemPrompt: `You are an elite Real Estate Transaction Structurer and Legal Strategist in India.
Model the landowner's net realization vs developer's Return on Equity across:
- Option A: Outright Purchase at ₹50 Cr (High equity, 100% upside)
- Option B: Revenue Share (65% Developer : 35% Landowner with ₹5 Cr Deposit)
- Option C: Development Management (DM) (12% top-line fee + 20% incentive above hurdle)
Provide the exact commercial clauses for: Escrow Waterfall, Landowner Marketing Restrictions, Possession Handover Milestones, and Force Majeure.`,
    outputFormat: `Comparative Economics Table (Developer Outlay, Landowner Net, Developer IRR, Downside Risk) + 5 Essential Term Sheet Clauses.`,
  },
  {
    id: "risk-rera-officer",
    tag: "LEGAL",
    roleTitle: "RERA & Legal Compliance Auditor",
    description: "Runs 30-year title searches, Section 79A agricultural restrictions, environmental clearances, and RERA registration checklists.",
    curriculumLevels: "Level 7",
    keyFocusAreas: ["30-Year Title Chain", "Farad/7-12 Verification", "RERA Section 4/14/15", "Encumbrance Certificates"],
    defaultInput: `Audit the legal title risk for a 10-Acre agricultural land conversion in Haryana under DDJAY (Deen Dayal Jan Awas Yojna). What are the critical title traps and CLU (Change of Land Use) prerequisites?`,
    systemPrompt: `You are a Senior Real Estate Advocate and Due Diligence Specialist practicing before High Courts and RERA Tribunals.
Provide a zero-compromise legal title audit:
1. Trace 30-year genealogical flow of title (Khatoni/Jamabandi/Mutation records).
2. Check for ancestral coparcenary claims, Section 143/CLU conversion validity, and litigation stay orders.
3. List the 12 mandatory statutory NOCs (Fire, Airport Height, MOEF Environmental, Pollution Control, Forest buffer, Drainage).
4. Detail RERA registration filing covenants and penal liabilities for promoter deviation.`,
    outputFormat: `Red Flag Audit Matrix (Item, Risk Severity, Verification Document Required, Legal Safeguard / Indemnity Clause).`,
  },
  {
    id: "gtm-sales-operator",
    tag: "SELL",
    roleTitle: "Go-to-Market & Sales Velocity Strategist",
    description: "Crafts unit mix, pricing escalation ladders, channel partner broker incentives, and digital lead generation funnels.",
    curriculumLevels: "Level 6",
    keyFocusAreas: ["Unit Mix Optimization", "Price Step-Up Matrix", "Channel Partner 3-Tier Payouts", "Pre-Launch Velocity"],
    defaultInput: `We are launching 250 luxury apartments in Whitefield, Bengaluru at ₹11,500/sq.ft. Design the pre-launch pricing step-up curve, broker incentive structure, and marketing budget allocation to achieve 40% bookings within 60 days.`,
    systemPrompt: `You are a Chief Commercial Officer and Real Estate Marketing Architect.
Design a high-velocity Go-To-Market blueprint:
1. Unit Mix & Carpet Sizing (e.g. 2 BHK 820 sqft vs 3 BHK 1,250 sqft) mapped to micro-market demographic buyer cohorts.
2. Step-up Pricing Strategy: Early-bird Phase 1 (₹10,800/sqft for first 50 units) -> Launch (₹11,500/sqft) -> Tower 2 (₹12,400/sqft).
3. Channel Partner (CP) Strategy: Tiered brokerage (2.5% base + 1% kicker for 5+ bookings) + CP meet collateral.
4. Digital + BTL Funnel: Budget breakdown (2.5% of GDV) spanning Google Search, Meta Ads, Model Apartment Experience Center, and Broker App.`,
    outputFormat: `Launch Playbook: Unit Matrix, Pricing Escalation Schedule, Broker Incentive Table, and 60-Day Milestone Execution Calendar.`,
  },
];

export const PRE_SEED_PITCH_DECK: PitchDeckSlide[] = [
  {
    id: 1,
    tagline: "THE VISION",
    title: "AI Co-Developer for Real Estate",
    subtitle: "The Operating System for the $1.4 Trillion Indian Real Estate Development Industry",
    badge: "Cover Slide",
    keyPoints: [
      {
        heading: "The Premise",
        description: "Every plot of land in India requires 100+ hours of manual calculations across zoning, RERA legalities, pro-forma cash flows, and capital structuring.",
      },
      {
        heading: "Our Solution",
        description: "An autonomous AI agent that ingests any plot or project and instantly produces institutional feasibility, optimal deal structures (JDA/JV), and RERA compliance memos in 60 seconds.",
      },
      {
        heading: "Category Creation",
        description: "Transforming real estate development from fragmented relationship-based guesswork into precision AI-driven financial engineering.",
      },
    ],
    metricsSummary: [
      { label: "Target Market", value: "India ($1.4T by 2035)", sublabel: "Real Estate Market" },
      { label: "Time to Feasibility", value: "60 Seconds", sublabel: "vs 3-4 Weeks manual" },
      { label: "Gross Margin", value: "88%", sublabel: "Pure SaaS Model" },
    ],
    strategicTakeaway: "We are building the 'Bloomberg + Palantir' for real estate developers, funds, and land aggregators.",
  },
  {
    id: 2,
    tagline: "THE PROBLEM",
    title: "Developers Are Flying Blind on ₹100Cr+ Bets",
    subtitle: "High Stakes, Opaque Data, and Fragmented Execution Kill Developer Margins",
    badge: "Market Pain",
    keyPoints: [
      {
        heading: "Fragmented Municipal Rules",
        description: "India has 50+ different state DCR zoning regimes (MahaRERA, HRERA, UP RERA, TS-bPASS) with complex FAR, TDR, and setback rules hidden across archaic PDF gazettes.",
        stat: "72% of mid-market developers miss purchasable FAR upside.",
      },
      {
        heading: "Excel Errors & Stalled Projects",
        description: "Pro-forma models built by junior analysts lack dynamic S-curve cash flow balancing and RERA 70:30 escrow compliance, leading to unexpected liquidity traps.",
        stat: "Over ₹4.8 Lakh Crores stuck in stalled Indian projects.",
      },
      {
        heading: "Opaque Land Deals & Title Traps",
        description: "Landowners demand unrealistic prices because neither party has an objective, data-backed Residual Land Valuation model.",
      },
    ],
    strategicTakeaway: "Developers lose months and crores because they lack an institutional-grade feasibility and structuring engine.",
  },
  {
    id: 3,
    tagline: "THE SOLUTION",
    title: "The AI Developer HQ Agent OS",
    subtitle: "From Raw Khasra to Bankable Deal Memo in 4 Clicks",
    badge: "Product Demo",
    keyPoints: [
      {
        heading: "1. Instant Land Ingestion & Zoning Engine",
        description: "Input location or survey number; our system auto-fetches road width, base FAR, permissible density, and local circle rate benchmarks.",
      },
      {
        heading: "2. Real Estate Financial Engine",
        description: "Live calculation of TDC, GDV, S-Curve monthly cash flows, Equity IRR, and sensitivity matrices without touching Excel.",
      },
      {
        heading: "3. JDA Structuring & Term Sheet Drafter",
        description: "Automatically compares Outright vs Area Share vs Revenue Share (68:32) and generates bulletproof commercial covenants.",
      },
      {
        heading: "4. Multi-Agent HQ Copilot",
        description: "Multi-agent roles (Deal Analyst, Capital Architect, RERA Risk Auditor, GTM Strategist) advising promoters 24/7.",
      },
    ],
    metricsSummary: [
      { label: "Analysis Speed", value: "98% Faster", sublabel: "Instant IC memos" },
      { label: "Accuracy", value: "Zero Math Error", sublabel: "Standardized logic" },
      { label: "Cost Savings", value: "₹15L+ / deal", sublabel: "Saved on consultants" },
    ],
    strategicTakeaway: "Empowering developers to evaluate 20x more deals with 10x higher conviction.",
  },
  {
    id: 4,
    tagline: "MARKET OPPORTUNITY",
    title: "$1.4 Trillion Market Driven by Urbanization",
    subtitle: "Tier-1 & Rapidly Growing Tier-2/3 Indian Cities Are Booming",
    badge: "TAM / SAM / SOM",
    keyPoints: [
      {
        heading: "Total Addressable Market (TAM)",
        description: "Indian Real Estate is projected to reach $1 Trillion by 2030 and $1.4 Trillion by 2035 (18-20% of India's GDP). Over 15,000 active RERA-registered developers and 85,000+ land aggregators/brokers.",
        stat: "$2.5B+ Annual Prop-Tech Software Spend TAM",
      },
      {
        heading: "Serviceable Addressable Market (SAM)",
        description: "5,000 Tier-1 and Tier-2 developers across top 12 metropolitan corridors (Delhi-NCR, Mumbai MMR, Bengaluru, Hyderabad, Pune, Chennai, Lucknow, Ahmedabad, Jaipur, Kolkata).",
        stat: "$450M Annual SAM in India",
      },
      {
        heading: "Serviceable Obtainable Market (SOM)",
        description: "Year 1-3 target: 650 mid-market developers and institutional family offices in North & South India paying an average ARR of ₹5 Lakhs.",
        stat: "₹32.5 Crore ($4M) ARR Beachhead SOM",
      },
    ],
    strategicTakeaway: "India's real estate transformation from unorganized to institutional RERA compliance creates an unprecedented software wedge.",
  },
  {
    id: 5,
    tagline: "BUSINESS MODEL",
    title: "High-Margin B2B SaaS + Deal Syndication",
    subtitle: "Predictable Software Recurring Revenue with Transaction Expansion",
    badge: "Monetization",
    keyPoints: [
      {
        heading: "Starter Tier (₹15,000 / month)",
        description: "For Land Aggregators & Brokers. Up to 15 Deal Feasibility Memos/mo, Circle Rate vs Market Comparables, basic JDA templates.",
      },
      {
        heading: "Developer Pro (₹45,000 / month)",
        description: "For Active Mid-Market Developers. Unlimited models, S-Curve Cash Flows, Multi-Scenario Structuring, RERA Due Diligence, AI Copilot.",
      },
      {
        heading: "Institutional Suite (₹1,25,000 / month)",
        description: "For Funds, Family Offices & Large Promoters. Multi-project Portfolio Risk Engine, Custom State DCR Parsers, API Access, Dedicated Dedicated Model Architect.",
      },
      {
        heading: "Expansion Revenue (Deal Syndication)",
        description: "0.10% - 0.25% finder fee on debt/equity capital syndication facilitated through our verified deal room portal.",
      },
    ],
    metricsSummary: [
      { label: "ARPU (Blended)", value: "₹4.8 Lakhs", sublabel: "Per Client / Year" },
      { label: "Gross Margin", value: "88%", sublabel: "Software economics" },
      { label: "Net Revenue Retention", value: "135%", sublabel: "Seat & project expansion" },
    ],
    strategicTakeaway: "A SaaS-first business model with high stickiness, zero churn on active developers, and massive deal transaction upside.",
  },
  {
    id: 6,
    tagline: "COMPETITIVE MOAT",
    title: "Why Generic Tools & PropTech Fail",
    subtitle: "Built Specifically for Indian Real Estate Realities",
    badge: "Defensibility",
    keyPoints: [
      {
        heading: "Hyper-Local State DCR & RERA Engine",
        description: "Global tools (Argus, Procore) fail in India because they do not comprehend Circle Rates, Purchasable FAR, TDR, Farad/Khatoni title chains, or RERA 70:30 escrow laws.",
      },
      {
        heading: "Proprietary Financial Math Core",
        description: "Pre-modeled S-curve milestone cash flows, waterfall equity hurdles, and JDA revenue split dynamics fine-tuned for Indian tax (Section 45(5A)) and GST rules.",
      },
      {
        heading: "Master Track Curriculum Embedded",
        description: "Our software doesn't just calculate; it acts as a strategic co-developer, educating and guiding promoters from Level 0 to Level 10 city-scale development.",
      },
    ],
    strategicTakeaway: "Our localized Indian regulatory moat and developer-first workflow create an impenetrable barrier to entry for generic SaaS players.",
  },
  {
    id: 7,
    tagline: "GO-TO-MARKET",
    title: "Beachhead Strategy: Tier-2 Express Corridors",
    subtitle: "Starting with High-Growth Markets (Lucknow, NCR, Kanpur, Bengaluru)",
    badge: "GTM Playbook",
    keyPoints: [
      {
        heading: "1. Wedge into Lucknow & NCR Developer Clusters",
        description: "Partner with CREDAI and NAREDCO regional chapters. 100 pilot developers onboarded with free 1-page deal memo audits of their active land opportunities.",
      },
      {
        heading: "2. The 'Broker-to-Developer' Flywheel",
        description: "Land aggregators use our Starter plan to generate institutional PDF memos, bringing our software directly onto the desks of decision-making promoters.",
      },
      {
        heading: "3. Master Class Content Marketing",
        description: "Hosting the 'Real Estate Developer HQ Master Track' webinars, establishing authority and driving organic inbound pipeline for the SaaS product.",
      },
    ],
    metricsSummary: [
      { label: "CAC Payback", value: "< 3 Months", sublabel: "High viral word-of-mouth" },
      { label: "Target Pilots", value: "50 Developers", sublabel: "Letter of Intents in Q1" },
      { label: "Conversion", value: "35%", sublabel: "From Trial to Pro Plan" },
    ],
    strategicTakeaway: "By solving the painful land valuation deadlock between brokers and developers, our product spreads virally through deal discussions.",
  },
  {
    id: 8,
    tagline: "FINANCIAL PROJECTIONS",
    title: "Clear Path to ₹65 Crore ARR in 3 Years",
    subtitle: "High-Margin, Capital Efficient SaaS Growth",
    badge: "Financials",
    keyPoints: [
      {
        heading: "Year 1 (Foundation & Regional Domination)",
        description: "75 Paying Developers (Lucknow, NCR, Bengaluru) @ ₹35k/mo avg = ₹3.15 Cr ARR. Team of 8 engineers & real estate analysts.",
      },
      {
        heading: "Year 2 (National Scale across Top 10 Cities)",
        description: "320 Developers + 20 Institutional Funds = ₹16.8 Cr ARR. Launch of Deal Syndication & Capital Stack Marketplace.",
      },
      {
        heading: "Year 3 (Market Leadership & Enterprise Platform)",
        description: "950 Developers + 60 Institutional Funds = ₹62.5 Cr ARR ($7.5M ARR). EBITDA positive with 38% net margin.",
      },
    ],
    metricsSummary: [
      { label: "Year 1 ARR", value: "₹3.15 Cr", sublabel: "75 Customers" },
      { label: "Year 2 ARR", value: "₹16.8 Cr", sublabel: "340 Customers" },
      { label: "Year 3 ARR", value: "₹62.5 Cr", sublabel: "1,010 Customers" },
    ],
    strategicTakeaway: "Rapid, capital-efficient growth driven by high annual contract values and zero customer churn.",
  },
  {
    id: 9,
    tagline: "THE TEAM",
    title: "Full-Stack Software Engineering + RE Masters",
    subtitle: "Deep Domain Expertise in Prop-Tech, Financial Modeling, and AI Architecture",
    badge: "Execution Power",
    keyPoints: [
      {
        heading: "World-Class Tech & AI Architecture",
        description: "Full-stack SaaS veterans experienced in high-performance microservices, Postgres PostGIS geospatial modeling, and LLM agent orchestration.",
      },
      {
        heading: "Institutional Real Estate Advisory",
        description: "Ex-Chief Investment Officers, CREDAI mentors, and RERA advocates guiding the deterministic financial and regulatory engines.",
      },
      {
        heading: "Execution Velocity",
        description: "Shipped fully functional Level 0-10 developer engine, pro-forma modelers, and multi-agent systems in record time.",
      },
    ],
    strategicTakeaway: "The rare combination of technical excellence and authentic real estate domain mastery.",
  },
  {
    id: 10,
    tagline: "THE ASK",
    title: "Raising ₹6.25 Crores ($750K) Pre-Seed",
    subtitle: "18-Month Runway to Reach ₹5 Crore ARR & Dominate Indian Prop-Tech",
    badge: "Investment Ask",
    keyPoints: [
      {
        heading: "Use of Funds: 45% AI & Product Engineering",
        description: "Building automated state DCR parsers, expanding OCR title extraction pipeline, and deepening multi-agent financial reasoning.",
      },
      {
        heading: "Use of Funds: 35% Go-To-Market & City Pilots",
        description: "Regional sales leads across NCR, Mumbai, Bengaluru, Lucknow, and Hyderabad; CREDAI sponsorship and broker partner network.",
      },
      {
        heading: "Use of Funds: 20% Data Partnerships & Regulatory Benchmarking",
        description: "Integrating verified RERA APIs, circle rate gazettes, and municipal cadastral GIS parcel maps.",
      },
    ],
    metricsSummary: [
      { label: "Round Size", value: "₹6.25 Cr ($750K)", sublabel: "Pre-Seed Round" },
      { label: "Runway", value: "18 Months", sublabel: "To ₹5Cr ARR" },
      { label: "Target Series A", value: "Q4 2027", sublabel: "At ₹15Cr+ ARR" },
    ],
    strategicTakeaway: "Join us in digitizing and powering the largest wealth-creation engine in modern India.",
  },
];
