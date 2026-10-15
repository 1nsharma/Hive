import { CurriculumLevel } from "../types";

export const CURRICULUM_LEVELS: CurriculumLevel[] = [
  {
    level: 0,
    code: "FOUNDATION",
    title: "Level 0: Foundation & Industry Ecosystem",
    subtitle: "Understand How the Real Estate Business Actually Works",
    goal: "Understand the real estate ecosystem, key players, land economics, and the developer mindset before committing capital.",
    outcome: "You can look at any property or asset and understand the core commercial business model behind it.",
    keyMotto: "A broker sells units, an investor provides capital, a contractor pours concrete. A developer conceives the vision, orchestrates risk, and captures the spread.",
    estimatedCapitalRange: "₹0 to Learning Phase",
    topics: [
      {
        id: "l0-t1",
        title: "1. Real Estate Ecosystem & Value Chain",
        summary: "Real estate development is not construction; it is an orchestration of land control, municipal zoning, capital syndication, risk management, and market absorption.",
        keyInsights: [
          "Developers sit at the center of the wheel: connecting landowners, architects, municipal authorities, debt/equity financiers, EPC contractors, and end-buyers.",
          "Value creation occurs primarily during entitlement (getting permissions) and design optimization, not just physical construction.",
          "Every property transaction has three layers: physical asset, legal title/rights, and financial cash-flow structure."
        ],
        formulaOrRule: "Value Created = Finished Asset GDV - (Land Cost + Hard Costs + Soft Costs + Finance Costs + Entitlement Friction)",
        realWorldExample: "A 2-acre agricultural parcel bought at ₹2 Cr/acre converted into residential zoning with an approved layout can instantly be valued at ₹6 Cr/acre before a single brick is laid.",
        actionChecklist: [
          "Map the 8 primary stakeholders in your target micro-market (Authorities, Brokers, Land aggregators, Local EPCs, Banks, Architects, Liaisons, Buyers).",
          "Identify who currently commands the highest pricing power in your geography."
        ],
        quiz: {
          question: "What is the primary role of a real estate developer in the value chain?",
          options: [
            "To physically pour concrete and manage daily site labor",
            "To orchestrate land control, permissions, capital, and risk to create higher economic utility",
            "To act as a middleman collecting broker commissions on finished apartments",
            "To guarantee 100% risk-free returns to all equity investors"
          ],
          correctIndex: 1,
          explanation: "Developers orchestrate land, approvals, capital, design, and execution to transform underutilized assets into high-value developments."
        }
      },
      {
        id: "l0-t2",
        title: "2. Developer vs Broker vs Investor vs Contractor",
        summary: "Distinct economic roles, balance sheet exposure, and profit distributions across the real estate stack.",
        keyInsights: [
          "Broker: Zero balance-sheet risk, 1-3% transaction fee, transactional mindset.",
          "Contractor (EPC): Cost-plus or fixed-price fee (typically 10-15% gross margin), operational execution risk, zero asset risk.",
          "Investor (LP/Debt): Capital provider seeking targeted IRR (14-22% equity, 10-14% debt), passive or semi-active governance.",
          "Developer (GP): Takes residual equity risk, secures approvals, guarantees completion, captures highest upside multiple (25-40%+ IRR or 2x+ MOIC)."
        ],
        formulaOrRule: "Developer Residual Profit = Gross Realisation - (Land + Hard Costs + Soft Costs + Contractor Invoices + Debt Service + Investor Hurdle)",
        realWorldExample: "On a ₹50 Cr revenue building, a contractor makes ₹4 Cr fixed profit, a broker makes ₹1 Cr in fees, an LP investor gets 16% IRR, while the developer pockets ₹12 Cr residual upside.",
        actionChecklist: [
          "Clarify your current role and transition trajectory.",
          "Never confuse contractor profit (labor margin) with developer profit (equity residual)."
        ],
        quiz: {
          question: "Why does the developer earn the highest profit multiple compared to contractors and brokers?",
          options: [
            "Because developers charge the highest hourly consulting rates",
            "Because developers bear the residual risk across approvals, market absorption, and capital execution",
            "Because contractors are not allowed by law to take profit",
            "Because brokers pay developers a monthly retainer"
          ],
          correctIndex: 1,
          explanation: "Developer profit is residual: they take the first-loss and approval risks, which yields the highest equity upside when executed well."
        }
      },
      {
        id: "l0-t3",
        title: "3. Asset Classes: Residential vs Commercial vs Industrial vs Land",
        summary: "Understanding the risk-return profiles, cash-flow timelines, and buyer dynamics across property categories.",
        keyInsights: [
          "Residential: Fastest cash recovery via pre-sales / construction-linked payment plans (CLP), but subject to high customer management and retail marketing costs.",
          "Commercial Office / Retail: Heavy upfront capital required, longer gestation, but creates institutional rental yields (7-9%) and REIT exit opportunities.",
          "Industrial & Warehousing: Lower construction cost, faster turnaround (9-12 months), high institutional cap-rate demand (8-10% yields).",
          "Plotted Developments / Land Subdivisions: Lowest Capex, no high-rise structural risk, ultra-fast cash cycles (12-18 months), high IRR."
        ],
        formulaOrRule: "Capital Turnover Velocity: Plotted (Fastest: 1-1.5 yrs) > Residential Mid-rise (2-3 yrs) > High-rise Residential (3-5 yrs) > Commercial (4-6 yrs)",
        realWorldExample: "A beginner developer starts with a 3-acre gated plotted development to generate quick capital and track record before attempting a multi-storey tower.",
        actionChecklist: [
          "Select one asset class to master first (recommendation: Plotted or Mid-Rise Residential).",
          "Study the local demand drivers (IT corridors, manufacturing hubs, metro rail expansion)."
        ]
      },
      {
        id: "l0-t4",
        title: "4. Primary vs Secondary Market Dynamics & Cycles",
        summary: "How new launches (under-construction) interact with resale assets, liquidity cycles, and market timing.",
        keyInsights: [
          "Primary Market: Directly from developer. Governed by milestone payments, subvention schemes, launch hype, and RERA escrow.",
          "Secondary Market: Ready-to-move-in resales. Sets the baseline market price floor for your future primary launch.",
          "Market Cycles: Expansion (high presales, rising prices) -> Peak (aggressive land bids, easy credit) -> Contraction (inventory overhang, discounts) -> Recovery (distressed deals, low land costs).",
          "Golden Developer Rule: Buy land in the early recovery/contraction phase; launch sales in the expansion phase."
        ],
        formulaOrRule: "Absorption Rate (Months of Inventory) = Active Unsold Units / Average Monthly Sales Velocity",
        realWorldExample: "If a micro-market has 1,200 unsold apartments and sells 100/month, absorption is 12 months (healthy). If it reaches 36+ months, price stagnation is imminent."
      },
      {
        id: "l0-t5",
        title: "5. Land Economics & Location Infrastructure",
        summary: "Why all land is not created equal: Road width, frontage, zoning, utility access, and transit corridors.",
        keyInsights: [
          "Highest and Best Use (HBU): The legal, physically possible, financially feasible use that yields the highest land value.",
          "Infrastructure Arbitrage: Value does not grow linearly; it explodes when road connectivity (expressway, metro, highway widening) shrinks transit time to employment hubs.",
          "Frontage & Plot Depth: A 100-meter frontage on a 60-ft road yields vastly higher permissible FAR and commercial retail viability than a deep flag-lot with narrow access."
        ],
        formulaOrRule: "Road Width vs Permissible FAR: In many master plans, FAR jumps from 1.5 to 2.5+ once the abutting road width exceeds 18 meters (60 ft).",
        realWorldExample: "An investor bought land abutting a proposed 45m master plan road at agricultural rates; when the road was notified, FAR doubled, quadrupling land value."
      }
    ]
  },
  {
    level: 1,
    code: "DEAL_ANALYST",
    title: "Level 1: Beginner → Deal Analyst",
    subtitle: "Learn to Mathematically Evaluate & Model Every Opportunity",
    goal: "Master land valuation, circle vs market rates, FAR/FSI calculations, pro-forma cash flow modeling, IRR, ROI, and break-even analysis.",
    outcome: "You never say '₹2 Cr profit' blindly. You build the full institutional pro-forma model with time-value of money, IDC, contingencies, and waterfall yields.",
    keyMotto: "Amateurs guess profits on napkins; developers model monthly cash flows, cost escalations, and debt waterfalls.",
    estimatedCapitalRange: "₹0 - ₹10 Lakhs (Analytical Skills)",
    topics: [
      {
        id: "l1-t1",
        title: "1. Land Valuation: Circle Rate vs Market Rate",
        summary: "Understanding official government registry values versus true transaction economics, black-white component, and stamp duty implications.",
        keyInsights: [
          "Circle Rate (Ready Reckoner Rate / Guidance Value): Government-mandated minimum floor price for stamp duty and tax assessment.",
          "Market Rate: Actual transacted clearing price agreed between willing buyer and seller.",
          "Tax Risk (Section 56(2)(x) & 43CA in India): If market transaction is registered below circle rate, the difference is taxed as deemed income for both buyer and seller!",
          "High circle rate with low market demand creates cash-flow friction due to inflated stamp duty and upfront tax payments."
        ],
        formulaOrRule: "Stamp Duty & Registration = Circle Rate (or Transaction Value, whichever is higher) × 6% to 8%",
        realWorldExample: "Land circle rate is ₹5,000/sq.ft, but seller agrees to ₹4,200/sq.ft. Registering at ₹4,200 triggers Section 43CA tax notices unless circle rate variation is within statutory tolerance (typically 10%)."
      },
      {
        id: "l1-t2",
        title: "2. FAR / FSI, Ground Coverage & Development Potential",
        summary: "Floor Area Ratio (FAR) / Floor Space Index (FSI) determines the maximum built-up envelope you can legally construct on a given land parcel.",
        keyInsights: [
          "FAR = Gross Floor Area / Total Plot Area. (e.g. 10,000 sq.ft plot with 2.0 FAR allows 20,000 sq.ft built-up area).",
          "Base FAR vs Premium / Purchasable FAR / TDR: You can often buy additional FAR from the municipal authority or via Transferable Development Rights (TDR).",
          "Ground Coverage %: Maximum plot footprint the building base can occupy (e.g., 40% ground coverage means 60% remains open for setbacks/parking/greens).",
          "Efficiency (Carpet vs Built-Up vs Super Built-Up / Saleable Area): Common areas (lobbies, stairs, lifts, clubhouse) add 20-35% loading onto RERA carpet area."
        ],
        formulaOrRule: "Permissible Built-Up Area = Plot Area × (Base FAR + Purchasable FAR + TDR FAR)",
        realWorldExample: "A 1-acre plot (43,560 sq.ft) with 2.5 FAR yields 108,900 sq.ft built-up. With 1.25x super-built-up loading, total saleable area is 136,125 sq.ft."
      },
      {
        id: "l1-t3",
        title: "3. Construction Cost Stacks: Hard Costs, Soft Costs & Contingency",
        summary: "Deconstructing every rupee in the construction budget to prevent devastating cost overruns.",
        keyInsights: [
          "Hard Costs (60-70%): Civil structure (RCC, steel, cement), brickwork, plaster, flooring, MEP, lifts, façade, landscaping.",
          "Soft Costs (15-20%): Architectural fees, structural/MEP design, sanction & approval fees, liaisoning, legal, environmental clearance.",
          "Marketing & Sales (3-5%): Brokerage, digital lead gen, experience center, channel partner commissions.",
          "Financing Costs (IDC - Interest During Construction): Interest accrued on debt drawn before pre-sales achieve cash neutrality.",
          "Contingency Reserve: Non-negotiable 5% to 10% buffer for raw material inflation (steel/cement) and timeline delays."
        ],
        formulaOrRule: "Total Development Cost (TDC) = Land + Approvals + Hard Civil + Soft Architectural + Contingency (7.5%) + Finance (IDC) + Marketing (3%)",
        realWorldExample: "A residential project with ₹2,200/sq.ft civil cost actually costs ₹3,400/sq.ft all-in once sanction fees (₹300), MEP/Finishes (₹500), Marketing (₹200), and Finance/Contingency (₹200) are accounted for."
      },
      {
        id: "l1-t4",
        title: "4. Return Metrics: ROI vs IRR vs Equity Multiple vs Breakeven",
        summary: "Why simple ROI is dangerously misleading and why institutional developers track Annualized IRR and Equity Multiple (MOIC).",
        keyInsights: [
          "Simple ROI = (Total Net Profit / Total Investment) × 100. Ignores time completely! 50% ROI in 2 years is great (22% IRR); 50% ROI in 7 years is disastrous (6% IRR).",
          "IRR (Internal Rate of Return): Discount rate where Net Present Value of all monthly cash inflows and outflows equals zero. Reflects cash velocity.",
          "Equity Multiple (MOIC): Total Cash Returned / Total Equity Invested. Target for ground-up development is 1.8x to 2.5x.",
          "Breakeven Price & Sales %: The minimum sale price per sq.ft or % of inventory needed to pay back 100% of debt and land capital."
        ],
        formulaOrRule: "Breakeven Sales % = Total Project Cost / Total Expected Gross Revenue",
        realWorldExample: "Project cost is ₹30 Cr, Gross Revenue is ₹50 Cr. Breakeven is 60% sales (₹30 Cr / ₹50 Cr). Once 60% of inventory is sold, the rest is pure developer profit."
      }
    ]
  },
  {
    level: 2,
    code: "DEAL_SOURCING",
    title: "Level 2: Deal Sourcing",
    subtitle: "Find Opportunities Before Everyone Else",
    goal: "Master off-market deal sourcing, approaching landowners, investigating titles, evaluating distress, and controlling land without bidding wars.",
    outcome: "You build a continuous pipeline of proprietary off-market deals through systematic sourcing channels.",
    keyMotto: "Great developers don't compete in public bidding wars; they source off-market situations where they solve a landowner's specific liquidity or entitlement problem.",
    estimatedCapitalRange: "₹5 Lakhs - ₹25 Lakhs",
    topics: [
      {
        id: "l2-t1",
        title: "1. The 10 Proprietary Sourcing Channels",
        summary: "Where high-margin deals actually originate.",
        keyInsights: [
          "1. Multi-generation Inherited Parcels: Siblings/cousins wanting liquidity rather than fighting over physical division.",
          "2. Developers Exiting Projects: Stalled builders facing liquidity crunch or RERA deadlines needing a clean takeout or DM takeover.",
          "3. Industrialists with Surplus Urban Land: Factories moving out of city limits leaving prime zoned parcels.",
          "4. Bank / NCLT / SARFAESI Auctions: Distressed assets at 30-50% discount to market value.",
          "5. Institutional / Corporate Real Estate Disposals.",
          "6. Local Tier-1 Channel Partner Networks (Local brokers who know which family needs cash for a wedding, debt repayment, or business expansion)."
        ],
        formulaOrRule: "Off-Market Alpha = Fair Market Value - Negotiated Distressed Acquisition Price",
        realWorldExample: "A manufacturer had 4 acres in a suburb that got re-zoned for residential. The developer offered a Joint Development Agreement (JDA) giving the factory owner monthly advances plus 40% constructed inventory, closing off-market with zero broker bidding."
      },
      {
        id: "l2-t2",
        title: "2. The Approach → Investigate → Negotiate → Control Framework",
        summary: "The 4-step sequence to tie up land with minimal upfront capital using token advance and exclusivity agreements.",
        keyInsights: [
          "Approach: Never say 'I want to buy your land cheap'. Position as a solutions provider: 'We help you monetize your family asset at maximum tax efficiency without litigation risk.'",
          "Investigate: Run preliminary revenue checks (Khasra, Khata, Mutation, 7/12 extract, Master Plan alignment) before putting money down.",
          "Negotiate: Separate Price from Terms. If the seller demands top dollar, demand extended due-diligence periods (90-180 days) and milestone-based payments.",
          "Control: Use an Agreement to Sell (ATS) with strong Conditions Precedent (CPs), or a Memorandum of Understanding (MoU) with registered exclusivity."
        ],
        formulaOrRule: "Control Ratio = Value of Land Controlled / Upfront Earnest Money Deposited (Target: 10x to 25x leverage)",
        realWorldExample: "Paying a refundable ₹25 Lakh earnest deposit to secure 120-day exclusive development rights on a ₹10 Cr parcel while securing sanction approvals."
      }
    ]
  },
  {
    level: 3,
    code: "DEAL_STRUCTURING",
    title: "Level 3: Deal Structuring",
    subtitle: "Control Land Without Putting All Your Own Capital at Risk",
    goal: "Master Outright Purchase, Joint Ventures (JV), Joint Development Agreements (JDA), Revenue Sharing, and Development Management (DM).",
    outcome: "You structure win-win contracts that limit developer downside, eliminate land acquisition debt, and generate high return on equity (ROE).",
    keyMotto: "Never buy with 100% cash what you can control with a JDA or revenue share.",
    estimatedCapitalRange: "₹25 Lakhs - ₹1 Crore",
    topics: [
      {
        id: "l3-t1",
        title: "1. The 5 Real Estate Deal Structures Compared",
        summary: "Detailed breakdown of the 5 foundational commercial structures used across the globe.",
        keyInsights: [
          "1. Outright Purchase: Developer buys 100% freehold land. Maximum risk, maximum profit, high capital required.",
          "2. Joint Development Agreement (JDA - Area Sharing): Landowner contributes land; Developer builds. Units are divided (e.g. 40% Landowner / 60% Developer). No land purchase cost!",
          "3. Revenue Sharing JV: All customer collections pooled into an escrow account and split by percentage (e.g., 33% Landowner / 67% Developer). Eliminates unit-allocation friction.",
          "4. Profit Sharing JV: Landowner's land is valued as equity; net profits after all hard/soft costs are shared. (Requires deep trust and audit transparency).",
          "5. Development Management (DM): Developer acts as project manager for 8-12% fee of top-line revenue + performance bonus. Zero balance sheet equity risk!"
        ],
        formulaOrRule: "Developer ROE in JDA = (Developer Profit / Construction Equity) vs Outright = (Developer Profit / [Land Equity + Construction Equity])",
        realWorldExample: "A developer with ₹3 Cr equity can do ONE ₹10 Cr outright project, OR simultaneously execute THREE JDA projects controlling ₹30 Cr worth of land."
      },
      {
        id: "l3-t2",
        title: "2. JDA Terms & Waterfalls: Non-Refundable Security Deposit (NRSD) & Escrow",
        summary: "Crucial clauses that protect the developer from landowner default and vice versa.",
        keyInsights: [
          "Refundable vs Non-Refundable Security Deposit: Landowner gets upfront security deposit (e.g. ₹50 Lakhs - ₹2 Cr) which is adjusted against landowner's revenue share or refunded at completion.",
          "RERA Escrow Segregation (70:30 Rule): 70% of collections must strictly go into dedicated construction account; 30% goes to operational and land/developer distributions.",
          "Power of Attorney (POA) Protection: Clear irrevocable Power of Attorney to obtain sanctions, approvals, and mortgage development rights without landowner obstruction."
        ],
        formulaOrRule: "Landowner Revenue Share = Total Revenue × Agreed Share % (e.g., 35%) minus Advance adjusted proportionately per milestone.",
        realWorldExample: "In a 65:35 Revenue Share JDA on a ₹100 Cr project, the landowner receives ₹35 Cr over 3 years, while the developer uses customer presales to fund ₹45 Cr construction and nets ₹20 Cr profit on only ₹5 Cr seed equity."
      }
    ]
  },
  {
    level: 4,
    code: "CAPITAL_FUNDING",
    title: "Level 4: Capital & Funding",
    subtitle: "Where Development Money Comes From & Structuring the Capital Stack",
    goal: "Master equity syndication, family offices, NBFC/bank project debt, construction finance, customer pre-sale cash cycles, and investor protection terms.",
    outcome: "You can answer: 'Why should someone put money into this project, at what risk, at what return, and under what legal protections?'",
    keyMotto: "Money flows to structured deals with clear downside protections, not enthusiastic pitches.",
    estimatedCapitalRange: "₹1 Crore - ₹10 Crores (Fundraising & Stack Structuring)",
    topics: [
      {
        id: "l4-t1",
        title: "1. The Modern Capital Stack: Senior Debt to Common Equity",
        summary: "Layering capital to optimize Weighted Average Cost of Capital (WACC) while protecting developer control.",
        keyInsights: [
          "Senior Debt (Banks / Housing Finance Companies): Cheapest capital (9.5-12.5%), first mortgage charge on land and receivables, strictest covenants.",
          "Mezzanine / Structured Debt (NBFCs / Private Credit): 14-18% IRR, subordinate to bank, flexible repayment tied to project cash flow.",
          "Preferred Equity / Family Office: 18-22% target return with a hurdle rate and liquidation preference.",
          "Developer Common Equity (GP): Highest risk, residual cash flow, infinite return potential when leveraged responsibly.",
          "Customer Pre-Sales / Advances: Zero-interest capital permitted under RERA milestone billing once basic construction starts."
        ],
        formulaOrRule: "WACC = (Weight_Debt × Cost_Debt × [1 - Tax]) + (Weight_Equity × Cost_Equity)",
        realWorldExample: "A ₹40 Cr project funded with ₹8 Cr Developer Equity, ₹12 Cr Private Debt at 14%, and ₹20 Cr Customer Milestones achieves an ultra-low effective WACC of 4.2%."
      },
      {
        id: "l4-t2",
        title: "2. The Investor Pitch Deck: What Sophisticated Money Demands",
        summary: "The 6 core elements institutional investors and High Net-Worth Individuals (HNIs) evaluate.",
        keyInsights: [
          "1. Executive Summary & Site Micro-Market Fundamentals (Employment density, competitive supply, absorption velocity).",
          "2. Land Control & Entitlement Status (Freehold, Clean Title Search, Sanctions Timeline).",
          "3. Detailed Pro-Forma & Sensitivity Analysis (What happens if sales prices drop 10% or construction delays 6 months?).",
          "4. Downside Protections (Personal guarantee, mortgage charge, RERA escrow monitoring, step-in rights).",
          "5. Exit Waterfall & Distribution Schedule (Preferred return hurdle e.g., 12% before 80:20 GP/LP catchup).",
          "6. Developer Track Record & Team Capability."
        ],
        formulaOrRule: "Waterfall Distribution: Step 1: Return of Capital -> Step 2: 12% Preferred Hurdle -> Step 3: 80/20 Profit Split above hurdle.",
        realWorldExample: "Presenting a conservative sensitivity matrix where even in the worst-case scenario (15% cost inflation + 1-year delay), investor capital is returned with 10% IRR creates immediate credibility."
      }
    ]
  },
  {
    level: 5,
    code: "DEVELOPMENT",
    title: "Level 5: Development & Construction Execution",
    subtitle: "From Vision to Physical Asset — The Operator's Engine",
    goal: "Master the lifecycle: Land → Design → Approvals → Contractor Selection → Procurement → Quality Control → S-Curve Scheduling → Cost Overrun Mitigation → Handover.",
    outcome: "You manage project timelines like an industrial engineer, preventing delays, budget bleed, and contractor disputes.",
    keyMotto: "Money is made in land and design, but lost on site in construction overruns.",
    estimatedCapitalRange: "₹5 Crores - ₹25 Crores Operations",
    topics: [
      {
        id: "l5-t1",
        title: "1. The 12-Step Development Lifecycle",
        summary: "Step-by-step operational roadmap from initial survey to occupancy certificate (OC).",
        keyInsights: [
          "Phase 1: Concept & Topographical Survey (Soil testing, contour mapping).",
          "Phase 2: Architectural & Value Engineering (Optimizing structural grid, parking efficiency, MEP shaft alignments).",
          "Phase 3: Sanctions & Approvals (Master Plan, Environmental, Fire, Airport AAI, Tree authority, Local Municipal Sanction, RERA Registration).",
          "Phase 4: Tendering & Contractor Award (Item-rate vs Lump-sum EPC vs Cost-plus-incentive contracts).",
          "Phase 5: Substructure & Plinth (Excavation, piling, raft, waterproofing).",
          "Phase 6: Superstructure (RCC frame casting via Mivan / aluminium formwork or conventional shuttering).",
          "Phase 7: MEP & Finishing (Electrical conduits, plumbing, plaster, flooring, windows).",
          "Phase 8: Commissioning & Occupancy Certificate (OC) / Completion Certificate (CC).",
          "Phase 9: Snagging, Customer Handover & RERA 5-year defect liability warranty."
        ],
        formulaOrRule: "Structural Efficiency Ratio = Usable Carpet Area / Gross Structural Slab Area (Target: > 78%)",
        realWorldExample: "Switching from conventional timber shuttering to aluminium formwork (Mivan) increased upfront cost by 12%, but cut construction cycle from 36 months to 20 months, saving ₹2.4 Cr in finance cost and beating competitor deliveries."
      },
      {
        id: "l5-t2",
        title: "2. Cost Control & S-Curve Project Scheduling",
        summary: "How to track monthly physical progress against financial burn rate to detect delays early.",
        keyInsights: [
          "S-Curve: Cumulative capital expenditure starts slow (excavation), ramps up steeply (superstructure), and tapers during finishing.",
          "Quantity Surveying (QS) & Bill Verification: Never pay contractor invoices without independent Project Management Consultant (PMC) measurement sheets.",
          "Material Price Hedging: Bulk procurement contracts or escalation index clauses tied to wholesale price index for cement and TMT steel.",
          "Retention Money (5-10%): Held back from every contractor milestone payment and released only after 12 months defect liability period."
        ],
        formulaOrRule: "Cost Variance = Budgeted Cost of Work Performed - Actual Cost of Work Performed",
        realWorldExample: "A developer holding 5% retention money discovered terrace waterproofing leakage before final handover; the contractor repaired it promptly to release their ₹40 Lakh retention."
      }
    ]
  },
  {
    level: 6,
    code: "SALES_MARKETING",
    title: "Level 6: Sales & Marketing Engine",
    subtitle: "Build → Brand → Demand → Sell (Never Build and Hope)",
    goal: "Master positioning, launch pricing curves, broker/channel partner networks, digital lead generation, CRM pipelines, and inventory velocity.",
    outcome: "You engineer pre-launch hype and achieve 40-60% inventory sales before substructure completion, de-risking project cash flow.",
    keyMotto: "A beautiful project that doesn't sell is a bad business. Great developers build demand before they break ground.",
    estimatedCapitalRange: "₹10 Crores - ₹50 Crores Revenue Generation",
    topics: [
      {
        id: "l6-t1",
        title: "1. The 4-Phase Launch Strategy: Teaser → Soft Launch → Grand Launch → Sustenance",
        summary: "Structuring pricing escalation to reward early investors and maintain momentum.",
        keyInsights: [
          "1. Teaser / Loyalty Phase (Day 0-30): Exclusive preview to past investors and VIP buyers at introductory rates (e.g. ₹5,500/sq.ft). Generates initial seed cash and social proof.",
          "2. Channel Partner (CP) Meet: Aggressive broker commissions (2.5-4%) with milestone bonuses (cars, international trips, fast payment within 15 days).",
          "3. Grand Launch (Day 30-90): Price increases by 8-12% (₹6,100/sq.ft). Heavy digital marketing, experiential model apartment, high event urgency.",
          "4. Construction-Linked Price Escalation: Every 3 slabs cast, raise base sale price by ₹150-250/sq.ft to demonstrate tangible value appreciation.",
          "5. Ready Possession Premium: Last 10-15% units sold at 25-35% premium over launch rate to buyers seeking immediate possession."
        ],
        formulaOrRule: "Blended Realisation = Σ (Units Sold in Phase_i × Price_i) / Total Units Sold",
        realWorldExample: "A 200-unit project launched at ₹6,000/sq.ft (Phase 1), rose to ₹6,800/sq.ft (Phase 2), and closed at ₹7,800/sq.ft for ready units, achieving an average blended realization of ₹6,950/sq.ft (15% above initial pro-forma)."
      },
      {
        id: "l6-t2",
        title: "2. Channel Partner (Broker) Ecosystem & Digital Lead Engine",
        summary: "How top developers sell 70%+ of their inventory through mobilized channel partner networks.",
        keyInsights: [
          "Broker Loyalty Ladder: Bronze (1-2 deals: 2%), Silver (3-5 deals: 2.75%), Gold (6+ deals: 3.5% + direct developer hotline).",
          "Transparency & Fast Payouts: The #1 reason brokers sell for one developer over another is rapid commission release upon 10% agreement registration.",
          "Digital Performance Funnel: Google Search Ads (Intent) + Meta/Instagram Ads (Aspirational Visuals) + Virtual 3D Tours + AI Lead Scoring in CRM."
        ],
        formulaOrRule: "Customer Acquisition Cost (CAC) = (Total Marketing Spend + Total Brokerage Paid) / Total Units Sold (Target: < 3.5% of GDV)",
        realWorldExample: "Offering 1% advance brokerage upon first agreement signing motivated 50 top local channel partners to pitch this project first, selling out Phase 1 in 45 days."
      }
    ]
  },
  {
    level: 7,
    code: "LEGAL_TAX_RISK",
    title: "Level 7: Legal, Tax & Regulatory Mastery",
    subtitle: "RERA, 30-Year Title Search, Encumbrances & Tax Structuring",
    goal: "Master legal due diligence, title search, encumbrance verification, agricultural-to-non-agricultural (NA/CLU) conversion, RERA compliance, GST, and litigation mitigation.",
    outcome: "You can identify fatal legal flaws before signing any agreement, avoiding stalled projects, consumer court litigation, and tax penalties.",
    keyMotto: "One title defect or regulatory violation can erase 10 years of developer profit. Due diligence is your impenetrable fortress.",
    estimatedCapitalRange: "Risk Management & Compliance",
    topics: [
      {
        id: "l7-t1",
        title: "1. The 30-Year Title Due Diligence Protocol",
        summary: "The non-negotiable legal search for verifying absolute, marketable, and unencumbered land title.",
        keyInsights: [
          "30-Year Chain of Title Deeds: Trace every sale deed, gift deed, partition deed, and inheritance record back 30 years with the Sub-Registrar.",
          "Revenue Records: Verify 7/12 extract, Khasra/Khatauni, Jamabandi, Patta, and Mutation register entries (ensure seller name is updated in revenue records).",
          "Non-Encumbrance Certificate (EC): Issued for minimum 30 years to confirm no active bank mortgages, court attachments, or private liens.",
          "Public Notice: Publish legal notice in two leading newspapers (English and local vernacular) inviting objections within 14 days.",
          "Litigation Search: Check local District Court, High Court, and RERA tribunal portals for pending suits against the survey number or owners."
        ],
        formulaOrRule: "Golden Rule: Never rely on a photocopy; inspect original Title Deeds and verify with the Sub-Registrar records directly.",
        realWorldExample: "A public notice flushed out a hidden minor heir claim from a 15-year-old partition deed, allowing the developer to secure a legal relinquishment deed before paying the main purchase price."
      },
      {
        id: "l7-t2",
        title: "2. RERA Compliance & Consumer Protection Mandates",
        summary: "Navigating Real Estate (Regulation and Development) Act rules to ensure zero regulatory penalties.",
        keyInsights: [
          "Mandatory Registration: Any project with land > 500 sq.meters or > 8 apartments must be RERA registered before advertising or collecting bookings.",
          "70% Escrow Account: 70% of buyer collections must remain in dedicated project bank account and can only be withdrawn in proportion to certified construction completion by Architect, Engineer, and CA.",
          "Strict Timelines & 5-Year Defect Liability: Developer is legally bound to repair structural defects free of cost for 5 years post-handover.",
          "Standardized Carpet Area: Quoting super-built-up without disclosing RERA carpet area is a criminal violation."
        ],
        formulaOrRule: "Escrow Withdrawal % = (Actual Certified Construction Cost Incurred / Total Estimated Construction Cost) × Total Collections",
        realWorldExample: "A developer maintaining strict quarterly RERA disclosures achieved five-star credit rating from housing finance companies, lowering borrowing interest from 13% to 9.5%."
      }
    ]
  },
  {
    level: 8,
    code: "PORTFOLIO_BUILDER",
    title: "Level 8: Portfolio Builder & Scaling",
    subtitle: "From Single Project Operator to Multi-Asset Development Machine",
    goal: "Stop thinking about one project. Build a multi-project development pipeline, balance cash flows across stages, syndicate capital across different partners, and manage debt concentration.",
    outcome: "Your company operates an institutional asset-development machine with overlapping project lifecycles ensuring continuous cash flows.",
    keyMotto: "A one-project developer is a freelancer with high overheads; a portfolio developer is an enterprise asset manager.",
    estimatedCapitalRange: "₹50 Crores - ₹200 Crores Portfolio",
    topics: [
      {
        id: "l8-t1",
        title: "1. The Overlapping Pipeline Engine: Cash Flow Balancing",
        summary: "How to stagger projects so mature projects fund the land acquisition of upcoming projects.",
        keyInsights: [
          "Project 1 (Sales / Handover Phase): Generates massive positive cash flow from final buyer disbursements.",
          "Project 2 (Construction Peak): Consumes cash rapidly for structural slabs and MEP.",
          "Project 3 (Approvals & Pre-Launch): Requires seed capital for sanction fees and marketing launch.",
          "Project 4 (Sourcing & DD): Low cash expenditure, high negotiation leverage.",
          "Result: Operating cash flows from Project 1 directly finance the pre-construction stages of Projects 3 & 4 without diluting equity or taking expensive mezzanine debt."
        ],
        formulaOrRule: "Portfolio Cash Neutrality: Monthly Free Cash Flow from Deliveries ≥ Monthly Capital Deficit of Early-Stage Projects",
        realWorldExample: "A regional developer staggering three 150-unit projects across 18-month intervals maintained continuous internal rate of return above 32% without external debt."
      },
      {
        id: "l8-t2",
        title: "2. Organizational Architecture & Standard Operating Procedures (SOPs)",
        summary: "The leadership team and systems required to scale beyond founder-dependent management.",
        keyInsights: [
          "Tier 1: Land Acquisition & Legal Due Diligence Head.",
          "Tier 2: Chief Architect & Value Engineering Lead.",
          "Tier 3: VP of Project Management & Procurement (EPC oversight).",
          "Tier 4: Head of Sales, CRM & Channel Partner Relations.",
          "Tier 5: Chief Financial Officer (CFO) & Institutional Capital Relations.",
          "Centralized ERP: Live tracking of procurement, inventory sales, collection aging, and RERA compliance."
        ],
        formulaOrRule: "Enterprise Value Multiple = EBITDA × 8 to 12x when institutional processes replace founder dependency.",
        realWorldExample: "Implementing an integrated ERP system reduced procurement leakage by 6% and slashed billing cycle times from 21 days to 4 days across 4 active job sites."
      }
    ]
  },
  {
    level: 9,
    code: "LARGE_SCALE",
    title: "Level 9: Large-Scale Developer",
    subtitle: "Townships, Mixed-Use Districts & Institutional Syndication",
    goal: "Work with 50+ to 500+ acre land parcels, integrated townships, mixed-use commercial districts, industrial parks, warehousing/logistics, and public-private partnerships.",
    outcome: "You build strategic relationships with state governments, sovereign wealth funds, global private equity, and anchor institutional tenants.",
    keyMotto: "When you build at scale, you don't just respond to infrastructure; you define regional infrastructure corridors.",
    estimatedCapitalRange: "₹200 Crores - ₹1,000+ Crores",
    topics: [
      {
        id: "l9-t1",
        title: "1. Integrated Townships & Mixed-Use Zoning Synergy",
        summary: "How combining Residential + Commercial + Retail + Schools + Healthcare unlocks massive premium pricing.",
        keyInsights: [
          "Placemaking & The Halo Effect: Retail and social infrastructure (international schools, hospitals, high-street dining) create 25-40% pricing premiums for adjacent residential towers.",
          "Phased Land Monetization: Use Phase 1 plotted / villa sales to fund the internal arterial roads, water treatment plant (STP), and power substations for future high-density towers.",
          "Anchor Tenant Strategy: Pre-leasing 200,000 sq.ft of commercial office space to a major employer creates guaranteed housing demand for your residential phases."
        ],
        formulaOrRule: "Mixed-Use Synergy Value = GDV_Integrated - Σ(GDV_Standalone_Components) (Typically +20% to +35% upside)",
        realWorldExample: "A 100-acre township allocated 10 acres to a renowned hospital and school at cost; this anchor amenity increased the sale price of the surrounding 90 acres of residential plots by 45% in 24 months."
      },
      {
        id: "l9-t2",
        title: "2. Institutional Capital Partnerships (Private Equity & Sovereign Funds)",
        summary: "Structuring Platform Deals and Joint Ventures with institutional capital (Blackstone, GIC, Brookfield, ADIA).",
        keyInsights: [
          "Platform Joint Ventures: Foreign institutional investor commits $100M - $500M; local developer acts as operating partner contributing deal sourcing and local execution.",
          "Promote Structure (Super-Carried Interest): Developer earns standard 15-20% fee/profit, plus an accelerated 30-40% promote after achieving an agreed institutional IRR benchmark (e.g. 18%).",
          "Environmental, Social & Governance (ESG) Standards: Mandatory green building certifications (IGBC Platinum / LEED Gold), safety governance, and anti-corruption audit trails."
        ],
        formulaOrRule: "Developer Carry / Promote = 20% to 35% of all profits generated above the 18% LP hurdle rate.",
        realWorldExample: "A master developer partnered with an international pension fund to build a 2 million sq.ft tech park; on achieving a 21% exit IRR, the developer received a ₹85 Cr promote on top of regular management fees."
      }
    ]
  },
  {
    level: 10,
    code: "MASTER_DEVELOPER",
    title: "Level 10: Master Developer & City Builder",
    subtitle: "Developing Ecosystems, Urban Platforms & Future Cities",
    goal: "Transcend individual buildings. Develop complete urban ecosystems integrating Land + Housing + Commerce + Clean Energy + Smart Mobility + Digital Infrastructure + Community Governance.",
    outcome: "Your enterprise evolves from a traditional real estate developer into an Urban Development Platform and City Builder.",
    keyMotto: "We do not merely build structures; we curate the human habitats and economic engines of future generations.",
    estimatedCapitalRange: "₹1,000+ Crores to Multi-Billion Scale",
    topics: [
      {
        id: "l10-t1",
        title: "1. The Urban Development Platform (UDP) Model",
        summary: "Transforming from a vendor of square feet into an operator of smart, connected, self-sustaining city ecosystems.",
        keyInsights: [
          "Ecosystem Stack: Physical Land + Smart Grid Energy + Zero-Discharge Water Infrastructure + EV Mobility Corridors + High-Speed Fiber + Community Life Services.",
          "Perpetual Recurring Revenue: Retaining ownership of utility micro-grids, optical fiber backbones, district cooling systems, and commercial civic centers for multi-decade cash yield.",
          "Public-Private Partnerships (PPP): Partnering with state governments on Transit-Oriented Development (TOD) along high-speed rail, metro corridors, and industrial corridors."
        ],
        formulaOrRule: "City Platform Enterprise Value = Physical Development Profits + Discounted Net Present Value of 30-Year Utility & Community Cash Flows",
        realWorldExample: "Leading master developers in Asia retain master utilities (district cooling, fiber, solar power microgrid, retail leasing) generating hundreds of crores in perpetual high-margin annuity income alongside real estate sales."
      },
      {
        id: "l10-t2",
        title: "2. The Legacy of the City Builder: Designing for 100-Year Resilience",
        summary: "Master planning for climate resilience, demographic shifts, economic vitality, and civic identity.",
        keyInsights: [
          "15-Minute City Philosophy: Every resident is within 15 minutes of work, education, recreation, healthcare, and nature.",
          "Circular Economy: 100% on-site rainwater harvesting, solar generation, decentralized sewage treatment, and organic waste conversion.",
          "Economic Magnetism: Designing special economic zones (SEZs), innovation districts, and university hubs that generate 50,000+ high-paying jobs inside the master development.",
          "The Ultimate Developer Outcome: Shaping skyline, culture, and civilization itself."
        ],
        formulaOrRule: "Civic Economic Multiplier: Every $1 invested in Master City Infrastructure catalyses $7 to $12 in secondary regional economic output.",
        realWorldExample: "Iconic master planned developments like Canary Wharf (London), Irvine Ranch (California), and GIFT City / DLF CyberCity (India) fundamentally redefined their state economies for over half a century."
      }
    ]
  }
];

export const MONEY_PROGRESSION_TIERS = [
  {
    tier: 1,
    range: "₹0 Capital",
    focus: "Learn + Source Opportunities",
    strategy: "Master deal analysis, identify off-market distress, tie up land with small option/token deposits, package deals for established developers.",
    targetVehicle: "Bird-dogging / Deal wholesaling / Sourcing brokerage / Advisory"
  },
  {
    tier: 2,
    range: "₹10L – ₹1 Crore",
    focus: "Small Transactions & Micro-JVs",
    strategy: "Boutique residential floor redevelopments, plotted land subdivisons (1-2 acres), Joint Development Agreements (JDA) with small landowners.",
    targetVehicle: "JDA / Plotted Colony / Floor-by-floor development"
  },
  {
    tier: 3,
    range: "₹1Cr – ₹10 Crore",
    focus: "Mid-scale Residential / Commercial",
    strategy: "Mid-rise residential towers (25-80 units), boutique commercial retail buildings, small industrial warehousing sheds.",
    targetVehicle: "Area Share JDA + Customer Presales + Private Equity syndication"
  },
  {
    tier: 4,
    range: "₹10Cr – ₹100 Crore",
    focus: "Scale Developer & Branded Projects",
    strategy: "High-rise residential communities (150-500 units), prime commercial office parks, master plotted townships (15-50 acres).",
    targetVehicle: "NBFC Construction Finance + Revenue Share JDA + Institutional LP Equity"
  },
  {
    tier: 5,
    range: "₹100Cr+ Scale",
    focus: "Institutional Large-Scale Platforms",
    strategy: "Large integrated townships (50-200 acres), mixed-use urban centers, logistics parks, institutional REIT portfolios.",
    targetVehicle: "Sovereign Wealth Funds / Global PE Platform JVs / Public Listings"
  },
  {
    tier: 6,
    range: "₹1,000Cr+ Level",
    focus: "Master Developer & City Builder",
    strategy: "Megacity expansion zones, Transit-Oriented Developments (TOD), smart city platforms, integrated utility & industrial ecosystems.",
    targetVehicle: "State Government PPPs / Global Consortia / Infrastructure Funds"
  }
];
