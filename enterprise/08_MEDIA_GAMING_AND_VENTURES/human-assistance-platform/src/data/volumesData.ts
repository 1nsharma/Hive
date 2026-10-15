export interface VolumeSection {
  heading: string;
  content: string;
}

export interface Volume {
  id: string;
  num: string;
  title: string;
  icon: string;
  summary: string;
  sections: VolumeSection[];
}

export const volumesData: Volume[] = [
  {
    id: "v00",
    num: "00",
    title: "Foundation & Research (Project SETU)",
    icon: "Compass",
    summary: "Strategic ground research of hunger mapping, existing welfare programs, community kitchen networks, and foundational mission criteria in India.",
    sections: [
      {
        heading: "Mission & Absolute Vision",
        content: "Project SETU (The Bridge) is designed as India's most resilient, trust-verified, and operationally precise human assistance platform. Our goal is to connect every calorie of food surplus with verified human needs in real-time, restoring human dignity and eliminating waste."
      },
      {
        heading: "India's Hunger Mapping and Field Realities",
        content: "India ranks 105th out of 127 in the Global Hunger Index 2024. Despite agricultural adequacy, severe logistical failures persist. In Tier-1/Tier-2 Indian cities, huge wedding banquets discard hundreds of kilograms of high-quality prepared food daily. Conversely, night shelters, construction hubs, and flyover communities sleep in acute caloric deficits, often less than 2 km away."
      },
      {
        heading: "The Cultural Ecosystem: Langars, Temples & Subsidized Kitchens",
        content: "India features a robust community kitchen ecosystem: (1) Gurudwara Langars (serving millions with absolute cleanliness); (2) Temple Trusts (ISKCON Food for Life, Tirupati Devastanam); (3) Subsidized schemes (Amma Canteens, Shiv Bhojan, Indira Rasoi). SETU coordinates with this existing infrastructure, acting as a logistics routing engine to supplement their supply chains rather than competing with them."
      }
    ]
  },
  {
    id: "v01",
    num: "01",
    title: "Product Strategy",
    icon: "TrendingUp",
    summary: "Defining the core product principles, MVP boundaries, North Star metrics, and expansion phases for Project SETU.",
    sections: [
      {
        heading: "The North Star Metric: Unified Caloric Security Rate",
        content: "Our success is defined by the volume of verified nutritious meals successfully routed from surplus points to beneficiary mouths within a 45-minute delivery window, maintaining a 0% contamination rate."
      },
      {
        heading: "Minimum Viable Product (MVP) Boundaries",
        content: "The MVP focuses on three target applications: (1) Donor App: Fast 30-second surplus submission; (2) Volunteer App: GPS-routed, gamified task dispatcher; (3) NGO Console: Secure receipt check-in using QR code scanning. This removes overhead and limits tech barriers."
      },
      {
        heading: "Strategic Product Assumptions & Risk Mitigation",
        content: "Assumptions: Volunteers have smartphones with active cellular data; restaurants are willing to package food cleanly; beneficiaries can be reached. Risks include food spoilage and volunteer fatigue, mitigated by our dynamic trust score fuel subsidies."
      }
    ]
  },
  {
    id: "v02",
    num: "02",
    title: "Market Intelligence",
    icon: "Users",
    summary: "Competitive landscape analysis (RHA, Feeding India), government schemes, and our strategic opportunity gap matrix.",
    sections: [
      {
        heading: "Review of Active Organizations",
        content: "• Robin Hood Army (RHA): Excellent volunteer scale, but lacks a digital tracking trail, real-time matching, and food safety validation.\n• Feeding India (by Zomato): Strong corporate partnerships, but lacks localized crowd-sourced flexibility and night-logistics matching models.\n• Goonj: Outstanding material/clothing recycling, but not optimized for perishable food logistics."
      },
      {
        heading: "Government and Open Welfare Ecosystem Gaps",
        content: "While PDS (Ration cards) and Mid-Day Meals feed millions, they exclude seasonal migrants who lack local residency documents. They also distribute dry grain, which is unusable for homeless individuals who have no cooking assets."
      },
      {
        heading: "Project SETU Opportunity Matrix",
        content: "SETU fills the gap by providing real-time, geofenced tracking, automated AI verification, and low-barrier digital onboarding to build a seamless last-mile bridge between food excess and hunger."
      }
    ]
  },
  {
    id: "v03",
    num: "03",
    title: "Brand System",
    icon: "Paintbrush",
    summary: "The visual system, trademark classification, naming frameworks, and accessible color tokens for Project SETU.",
    sections: [
      {
        heading: "The Naming & Trademark Checklist in India",
        content: "The name SETU representing a physical and symbolic bridge is registered under multiple Indian Trademark classes:\n• Class 43: Services for providing food and drink (NGO feeding lines).\n• Class 45: Social services rendered to meet the needs of individuals.\n• Class 39: Transport, packaging, and logistics routing."
      },
      {
        heading: "Design Tokens & Eye-Safe Color System",
        content: "Our design palette represents warmth, hygiene, and trust:\n• Primary: Emerald Green (#10B981) - signifying safety, freshness, and high sanitation standards.\n• Accent: Warm Amber (#F59E0B) - signifying nourishment, cultural giving, and energy.\n• Neutral: Warm Charcoal (#1F2937) - for grounded, high-legibility displays."
      },
      {
        heading: "Typography & Readability Standards",
        content: "We pair 'Plus Jakarta Sans' (for smooth layout rendering on affordable screens) with bold geometric headlines. Line spacing is kept at 1.6 to ensure readability under strong, outdoor daylight conditions."
      }
    ]
  },
  {
    id: "v04",
    num: "04",
    title: "UX Bible",
    icon: "Eye",
    summary: "On-the-road mobile UX, regional language localization, low-literacy iconographic designs, and offline caching patterns.",
    sections: [
      {
        heading: "Multilingual and Low-Literacy User Interfaces",
        content: "Many NGO coordinators and field volunteers operate in regional dialects. The client application utilizes large, descriptive icon blocks (e.g. food bowls, scooters, green checkmarks) and integrated speech-to-text input to bypass written language barriers."
      },
      {
        heading: "High-Contrast Mobile UX for Road Operations",
        content: "Volunteers ride scooters under blinding sunlight. The interface employs flat layouts, generous spacing, high-contrast dark modes, and minimum touch target sizes of 48px to prevent touch errors while in transit."
      },
      {
        heading: "Offline Resiliency & Token Handoffs",
        content: "When signals drop under flyovers or in basements, the app caches task statuses and GPS telemetry in IndexedDB. Completion is validated using a physical 4-digit code or offline token handoff, syncing as soon as cellular coverage returns."
      }
    ]
  },
  {
    id: "v04a",
    num: "04A",
    title: "Design System Foundation",
    icon: "Layers",
    summary: "Cross-platform design tokens, strict 8-point spatial rhythm grids, typography sizing, fluid responsive boundaries, and battery-friendly motion curves.",
    sections: [
      {
        heading: "Grounded HSL Warm Saturated Tokens",
        content: "To safeguard visual clarity under both high mid-day glare and pitch-black nocturnal cycles, Project SETU establishes precise, warm-saturated custom HSL color tokens, eliminating absolute grays or harsh white clinical frames."
      },
      {
        heading: "Mathematical 8-Point Layout Rhythm",
        content: "Every margin, padding, column gap, and border radius in our Next.js and Flutter UI components maps to a strict 8-point system, establishing a unified layout rhythm across different view architectures."
      },
      {
        heading: "Responsive Breakpoints & Corner Formula",
        content: "Specifying layout density ranges from xs to xl, and enforcing the Nested Corner Formula (Inner Radius = Outer Radius - Padding) to ensure pixel-perfect geometric symmetry."
      }
    ]
  },
  {
    id: "v05",
    num: "05",
    title: "Engineering Architecture",
    icon: "Cpu",
    summary: "Our modular, scale-to-zero microservices topology, API gateway layers, and real-time messaging structures.",
    sections: [
      {
        heading: "System Blueprint & Microservice Separation",
        content: "SETU relies on decoupled, containerized services to ensure system durability:\n• Auth Core: Coordinates security credentials and role-based permissions.\n• Dispatch Router: Haversine-based matching for surplus pickups.\n• AI Fraud Analyzer: Computes trust verification logs.\n• Notification Bus: Drives SMS, push notifications, and automated WhatsApp Business alerts."
      },
      {
        heading: "Ingress Routing & API Gateway Specs",
        content: "All inbound traffic enters via an Express-based gateway proxy. It blocks bad requests, parses JWT headers, and applies IP-based rate limiting to protect the internal core from Sybil or scraping exploits."
      },
      {
        heading: "Handling Seasonal Wedding Peaks",
        content: "During Indian wedding seasons (Oct-Feb), nightly food notifications skyrocket. A Redis Queue architecture buffers inbound requests, preventing peak traffic from overloading our backend servers."
      }
    ]
  },
  {
    id: "v06",
    num: "06",
    title: "Backend Bible",
    icon: "Terminal",
    summary: "Detailed engineering specifications of the private core APIs, background dispatch engines, and notification protocols.",
    sections: [
      {
        heading: "Core API Gateways & Service Communication",
        content: "Internal microservices communicate using ultra-fast, lightweight payloads. Public clients access the system through standardized REST endpoints (e.g., POST /api/v1/donations) with rigid payload validation schemas."
      },
      {
        heading: "Geodesic Matching and Routing Algorithms",
        content: "The dispatch microservice utilizes the Haversine mathematical model to locate suitable NGOs and active volunteers within a tight 5km radius of a donation point, optimizing pickup speed."
      },
      {
        heading: "Multi-Channel Notification Dispatcher",
        content: "When a surplus is approved, the notification engine pushes parallel alerts: (1) Push notification to high-trust local volunteers; (2) Instant WhatsApp Business API templates to target NGO coordinators; (3) Fallback SMS alerts for low-bandwidth devices."
      }
    ]
  },
  {
    id: "v07",
    num: "07",
    title: "Database Bible",
    icon: "Database",
    summary: "Relational table schemas, connection pooling optimization, telemetry caching, and historical data life-cycle policies.",
    sections: [
      {
        heading: "PostgreSQL Database Schema",
        content: "Relational tables enforce absolute data consistency:\n• Users (id, name, role, trust_score, gps_coords)\n• Donations (id, donor_id, servings, status, timestamp)\n• Tasks (id, donation_id, volunteer_id, ngo_id, progress, risk_score)\n• AuditTrails (id, timestamp, actor_id, metadata)"
      },
      {
        heading: "High-Frequency Caching with Redis",
        content: "Redis caches active, uncompleted task routes and volunteer location pins with an automatic 3-minute Time-To-Live (TTL). This minimizes expensive database write operations during heavy nocturnal runs."
      },
      {
        heading: "Data Archiving & Compliance Strategy",
        content: "Historical transaction logs are partitioned and compiled into cold storage tables after 90 days. Analytical dashboards read from pre-aggregated summary indexes, keeping performance lightning fast."
      }
    ]
  },
  {
    id: "v08",
    num: "08",
    title: "AI Bible",
    icon: "EyeOff",
    summary: "Under the hood of our Triple-Gated AI Fraud Engine: image analysis, EXIF timestamp verification, GPS fence matching, and trust score metrics.",
    sections: [
      {
        heading: "The Triple-Gated Verification Engine",
        content: "To guarantee operational integrity and prevent fraud, SETU implements three validation gates:\n1. NLP Text Classifier: Identifies duplicate or spam donation reports.\n2. Vision AI: Processes photos to confirm the presence of clean, packaged food.\n3. GPS Fence Audit: Matches delivery coordinates against NGO locations, flagging any variance over 50 meters."
      },
      {
        heading: "Dynamic Dynamic Trust and Risk Scores",
        content: "Volunteers and donors start with a Trust Score of 75/100. Successful runs increment scores (+2). Flags or suspicious variances trigger heavy reductions (-25). A score under 40 triggers account suspension to safeguard the pipeline."
      },
      {
        heading: "Demand & Supply Predictive Models",
        content: "By analyzing regional history, our AI models predict upcoming surplus hotspots (e.g. wedding zones on specific weekends), proactively alerting local volunteer groups to position themselves nearby."
      }
    ]
  },
  {
    id: "v09",
    num: "09",
    title: "Security Bible",
    icon: "Lock",
    summary: "Data encryption protocols, role-based controls, immutable audit trails, and automated abuse detection.",
    sections: [
      {
        heading: "Data Encryption Standards",
        content: "All network traffic is forced over secure TLS 1.3 channels. User data (including phone numbers, coordinates, and names) is encrypted at rest using AES-256 with key rotation cycles managed via an HSM."
      },
      {
        heading: "Role-Based Access Control (RBAC)",
        content: "Strict isolation policies prevent unauthorized actions:\n• Donors can only register and view their own surplus logs.\n• Volunteers are restricted to localized task queues.\n• NGOs are only allowed to view incoming shipments assigned to their center.\n• Admin accounts possess master override and security control capabilities."
      },
      {
        heading: "Tamper-Proof Immutable Audit Ledger",
        content: "All administrative actions, overrides, and trust adjustments are written to an append-only, HMAC-signed database log, preventing internal collusion or data manipulation."
      }
    ]
  },
  {
    id: "v10",
    num: "10",
    title: "DevOps Bible",
    icon: "Terminal",
    summary: "Containerization configurations, automated CI/CD security checks, monitoring pipelines, and failover recovery plans.",
    sections: [
      {
        heading: "Containerized Cloud Topology",
        content: "SETU microservices are packaged inside Docker containers and run on serverless platforms like Cloud Run. The infrastructure scales dynamically from zero to thousands of containers to handle peak midnight wedding rushes."
      },
      {
        heading: "Automated CI/CD Verification Gates",
        content: "Every code commit triggers an automated pipeline: (1) Standard code linting and type-safety audits; (2) Security scanning for leaked tokens or credentials; (3) Unit tests ensuring routing and trust engines maintain >85% coverage."
      },
      {
        heading: "Disaster Recovery & Multi-Region Backups",
        content: "Database state experiences continuous transaction log replication. In the event of an outage, automated DNS failover routes traffic to a secondary cloud region in under 4 minutes, ensuring zero downtime."
      }
    ]
  },
  {
    id: "v11",
    num: "11",
    title: "Operations Bible",
    icon: "Heart",
    summary: "Onboarding playbooks, sanitation SLA templates, nocturnal safety protocols, and contamination escalations.",
    sections: [
      {
        heading: "Donor Restaurant Sanitation SLA",
        content: "All partners must sign a strict food safety agreement: food must be packed immediately after service, cooled to safe holding temperatures, and stored in clean, thermal-insulated delivery containers."
      },
      {
        heading: "Nocturnal Volunteer Safety (Buddy System)",
        content: "Because many wedding pickups occur between 11 PM and 2 AM, the Operations Bible mandates the 'Buddy System'. Late-night runs must be claimed and executed by pairs of volunteers wearing high-visibility reflective gear."
      },
      {
        heading: "Contamination and Spillage Escalation",
        content: "If a volunteer identifies foul odor or visible spoilage at pickup, they must take a photo to log a 'Sanitation Violation' in the app, cancel the task, and discard the food, triggering an automatic safety audit of the donor restaurant."
      }
    ]
  },
  {
    id: "v12",
    num: "12",
    title: "Finance Bible",
    icon: "PieChart",
    summary: "Strategic unit economics, corporate CSR funding models, budget projections, and operational sustainability.",
    sections: [
      {
        heading: "Unit Economics of a Meal Run",
        content: "SETU runs an ultra-low operational budget:\n• Food Acquisition: ₹0 (surplus rescue)\n• Fuel Subsidy per run: ₹12 (incentivizing scooter volunteers)\n• Platform Technical & Operational Overhead: ₹3\n• Total Cost per Verified Meal: ₹15 (compared to ₹45-50 in traditional centralized NGO kitchens)"
      },
      {
        heading: "CSR Corporate Sponsorship Channels",
        content: "Under Section 135 of the Indian Companies Act, corporations must allocate 2% of profits to social impact. SETU offers a fully audited, live platform showing exact geographical delivery maps and receipt logs for corporate CSR reporting."
      },
      {
        heading: "Carbon Offset and Green Revenue",
        content: "Diverting organic food waste from landfills directly reduces methane emissions. SETU calculates carbon offsets based on diverted waste weight, generating certified green offsets to sell to corporate partners."
      }
    ]
  },
  {
    id: "v13",
    num: "13",
    title: "Legal Bible",
    icon: "Scale",
    summary: "Corporate registration options, Section 135 CSR compatibility, 80G tax rules, and DPDP compliance.",
    sections: [
      {
        heading: "Corporate Registration: Section 8 Non-Profit",
        content: "Project SETU operates as a Section 8 Not-For-Profit Company. This model maintains commercial speed, is overseen by a professional board, and is fully authorized to receive local and international charitable grants."
      },
      {
        heading: "80G and 12A Tax-Exempt Status",
        content: "The platform possesses 12A and 80G tax certifications. This automatically generates a 50% tax deduction receipt for individual and corporate donors, integrated directly into our donor checkout screens."
      },
      {
        heading: "DPDP Act compliance for Beneficiaries",
        content: "Under India's Digital Personal Data Protection (DPDP) Act 2023, we enforce absolute privacy for receivers. No names or photos of vulnerable individuals are stored, keeping all demographic telemetry strictly hashed and anonymous."
      }
    ]
  },
  {
    id: "v14",
    num: "14",
    title: "Analytics Bible",
    icon: "BarChart",
    summary: "Visualizing our operational KPIs, real-time transaction tracking, and interactive dashboards.",
    sections: [
      {
        heading: "Core Analytics Dashboard Architecture",
        content: "SETU maintains transparent operational telemetry: (1) Live tracking of meals successfully verified at NGO centers; (2) Average routing and transit speeds; (3) Geolocation density heatmaps; (4) Active volunteer engagement metrics."
      },
      {
        heading: "Live Auditing and Impact Reports",
        content: "The platform generates automated, dynamic PDF impact reports. Corporate sponsors can query their specific grant ID to see live distribution metrics, photos of handoffs, and carbon offset calculations."
      }
    ]
  },
  {
    id: "v15",
    num: "15",
    title: "Go-to-Market (Pilot Launch)",
    icon: "Map",
    summary: "Pilot launch strategy in Delhi-NCR, local outreach programs, and partner referral incentives.",
    sections: [
      {
        heading: "The Selected Pilot: Delhi-NCR",
        content: "Delhi-NCR is our ideal launch location due to its urban density. High-volume luxury banquet zones (e.g. Chattarpur, Dwarka, GT Karnal Road) operate adjacent to active construction sites and night shelters, minimizing transit distance."
      },
      {
        heading: "Sewa Champions College Network",
        content: "We recruit and train student leads (Sewa Champions) across major universities like Delhi University and IIT-Delhi to organize and execute local weekend distribution runs, creating a self-sustaining youth movement."
      },
      {
        heading: "Swiggy & Zomato Badging Incentives",
        content: "Partner restaurants receive a 'Zero Waste SETU Champion' badge on food-delivery platforms. This drives premium branding and consumer goodwill, encouraging other venues to join our food rescue pipeline."
      }
    ]
  },
  {
    id: "v16",
    num: "16",
    title: "Future Roadmap",
    icon: "Milestone",
    summary: "Five-year expansion strategy, introducing medicine, blood bank routing, and national emergency response coordination.",
    sections: [
      {
        heading: "Year 1: Core Food Redistribution Launch",
        content: "Establish robust, safe, real-time food redistribution operations across Delhi-NCR, Mumbai, and Bengaluru, aiming for a 45-minute delivery window."
      },
      {
        heading: "Year 2: Medicine and Surplus Essentials",
        content: "Introduce the 'SETU-Meds' module, matching unexpired, household prescription surplus with charitable medical clinics and elderly care homes."
      },
      {
        heading: "Year 3-5: National Welfare Logistics Network",
        content: "Expand to 30 cities and provide software licensing to local NGOs. Integrate with the National Disaster Response Force (NDRF) to leverage our routing platform for emergency disaster relief."
      }
    ]
  },
  {
    id: "vadr",
    num: "ADR",
    title: "Engineering Decisions (ADRs)",
    icon: "GitBranch",
    summary: "An active registry of Architectural Decision Records, stating our technical selections and justifications.",
    sections: [
      {
        heading: "ADR 01: Relational Postgres over NoSQL for Financial Logs",
        content: "Context: The platform manages tax exemption receipts, donor funds, and dynamic trust scores.\nDecision: We adopt PostgreSQL as our primary transactional database.\nJustification: PostgreSQL guarantees ACID transaction safety and strong relational schemas, preventing score anomalies or receipt duplicates."
      },
      {
        heading: "ADR 02: Redis for High-Frequency Spatial Telemetry",
        content: "Context: Volunteers transmit active GPS locations every 30 seconds while in transit.\nDecision: We cache active volunteer coordinates in Redis with an automatic 3-minute TTL.\nJustification: This prevents expensive write bottlenecks on PostgreSQL, maintaining high-speed routing calculations."
      },
      {
        heading: "ADR 03: React 19 & Tailwind for Low-Bandwidth Clients",
        content: "Context: Volunteers and NGO coordinators operate on entry-level Android devices with unstable cellular data.\nDecision: We utilize standard React 19 with Tailwind utility styling and client-side canvas image compression.\nJustification: This minimizes bundle sizes and lowers memory footprints, ensuring fast rendering in offline scenarios."
      }
    ]
  }
];
