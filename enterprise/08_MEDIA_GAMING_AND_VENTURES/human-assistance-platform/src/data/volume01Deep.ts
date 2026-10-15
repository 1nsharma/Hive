import { DeepChapter } from "./volume00Deep";

export const volume01Chapters: DeepChapter[] = [
  {
    id: "v01_ch1",
    chapterNumber: 1,
    title: "Minimum Viable Product (MVP) Boundaries & App Scopes",
    summary: "A crisp operational definition of the three core software clients: the Donor Rapid-Logging Interface, the Volunteer Gamified Dispatcher, and the NGO Gate-Inbound Console.",
    sections: [
      {
        subheading: "1.1 The Donor App: 30-Second Surplus Logging",
        paragraphs: [
          "To secure participation from busy restaurant managers, wedding caterers, and banquet hall staff, the Donor portal enforces an absolute 'frictionless onboarding' paradigm. Typical commercial kitchens operate under high-intensity stress, meaning any form containing more than 3 fields is discarded.",
          "The MVP Donor module provides a single-tap logging interface. By leveraging predefined portion calculators (e.g., matching common Indian utensils like '1 large deg/deghchi' to estimated servings) and automated geofencing, donors can broadcast surplus prepared food in under 30 seconds."
        ],
        bulletPoints: [
          "One-Click Servings Estimation: Tap 'Small/Medium/Large' corresponding to 25, 50, or 100+ servings of hot food.",
          "Auto-Expiration SLA: The platform automatically applies a 6-hour default shelf-life timestamp for cooked Indian dishes containing dairy (e.g., paneer) or gravy, preventing spoilage risks.",
          "Image-First Logging: Uploading a photo of the packed food is mandatory; this feeds into the AI verification layer to validate packaging cleanliness before dispatch."
        ],
        keyMetrics: [
          { label: "Target Logging Time", value: "< 30 Seconds", source: "Product SLA" },
          { label: "Mandatory Fields", value: "3 Fields (Servings, Type, Expiry)", source: "Core Spec" }
        ]
      },
      {
        subheading: "1.2 The Volunteer App: Gamified GPS Routing & Task Dispatcher",
        paragraphs: [
          "The Volunteer interface is optimized for on-the-road navigation using affordable, entry-level smartphones. It translates complex geodesic routing into simple, bite-sized tasks. Since many runs occur late at night (11 PM - 2 AM) during wedding peaks, safety and clear directions are paramount.",
          "To maintain high retention and resolve volunteer burnout, the MVP incorporates a robust gamification framework. Successful deliveries award 'Sewa Points' and unlock tiered badges. These points map directly to real-world corporate-sponsored rewards (e.g., fuel subsidies or food coupons)."
        ],
        bulletPoints: [
          "Gamified Progression: Unlock volunteer tiers from 'Sewa Rookie' to 'Sewa Champion' with distinct visual badges.",
          "Integrated Geofence Safety: Visual indicators highlight safe travel routes, high-contrast night screens, and automated buddy-system pairing for late-night banquets.",
          "Offline Verification: Displays a physical 4-digit confirmation backup alongside QR scan triggers for locations with weak cellular signals."
        ],
        keyMetrics: [
          { label: "Minimum Target Touch Target", value: "48px (Fitts's Law Optimized)", source: "UX Bible" },
          { label: "Sewa Points per Completed Run", value: "+100 Points", source: "Gamification Logic" }
        ]
      },
      {
        subheading: "1.3 The NGO Console: Double-Blind QR Gate Ledger",
        paragraphs: [
          "The NGO interface is designed as an immutable verification ledger. NGO coordinators are the final gatekeepers who check in the meals and distribute them directly to the beneficiaries. In many urban shelter settings, coordinators are semi-literate, necessitating simple visual cues.",
          "The console utilizes a double-blind QR code scan. The NGO coordinator scans the volunteer's batch QR code, confirming receipt, while the volunteer scans the NGO's gateway code. This ensures physical presence at the designated site, establishing 100% audit compliance for CSR audits."
        ],
        bulletPoints: [
          "Zero-Text Interface: Large green checkmarks and visual icons represent 'verified receipt' and 'correct portion weight'.",
          "Dignified Distribution Log: Tracks aggregate headcounts distributed (split by adult/child) to optimize calorie balance dynamically.",
          "Instant Discard Escalation: Red 'Sanitation Spoil' button immediately flags contaminated shipments, automatically alert-blacklisting the source kitchen and triggering manual admin review."
        ],
        keyMetrics: [
          { label: "Handoff Resolution Latency", value: "< 15 Seconds", source: "Field Audit" },
          { label: "Verification Success Rate", value: "99.8% Compliant", source: "Product Target" }
        ]
      }
    ]
  },
  {
    id: "v01_ch2",
    chapterNumber: 2,
    title: "Granular User Stories & Acceptance Criteria",
    summary: "Documented agile user stories for the MVP roles, defining exactly 'who' needs 'what' and 'why' along with strict programmatic constraints.",
    sections: [
      {
        subheading: "2.1 Donor Stories (Sourcing and Safety Assurance)",
        paragraphs: [
          "Story: As a Banquet/Restaurant Manager, I want to report excess food from weddings effortlessly, so that I don't feel guilty discarding high-quality meals while securing clean carbon offset and CSR credits for my brand.",
          "Acceptance Criteria:\n1. The system must automatically fetch the restaurant's geofenced location, requiring zero address typing.\n2. The system must enforce photo upload of the food containers, rejecting empty images.\n3. A clear digital liability-release disclaimer under the Food Safety Standards Authority of India (FSSAI) guidelines must be checked on first submission."
        ],
        callout: "CSR reporting is a huge motivator for donor corporate entities. The donor dashboard must auto-calculate 'CO2 equivalent diverted from landfills' based on kilograms of food donated."
      },
      {
        subheading: "2.2 Volunteer Stories (Routing and Trust Mechanics)",
        paragraphs: [
          "Story: As a College Student/Volunteer, I want to claim a food pickup task near my current location, so that I can deliver meals efficiently within my travel route and earn trust points towards college social credits.",
          "Acceptance Criteria:\n1. The active dashboard must only display tasks within a 5km radius of the volunteer's current GPS ping.\n2. Claiming a task must lock it for other volunteers for a maximum of 25 minutes.\n3. Uploading proof of delivery (both a handoff photo and double QR scan) is required to release the 'Sewa points' bounty."
        ]
      },
      {
        subheading: "2.3 NGO Coordinator Stories (Calorie Intake and Safety)",
        paragraphs: [
          "Story: As an NGO Shelter Coordinator, I want to scan incoming food deliveries instantly, so that I can quickly log the meal quantity and serve hot, safe, and nutritious food to our shelter residents.",
          "Acceptance Criteria:\n1. The dashboard must show a clear, color-coded countdown timer of the food's remaining freshness hours.\n2. Scanning must verify the cryptographic signature of the volunteer's dispatch task.\n3. The coordinator must be able to flag a delivery as 'Spoiled' in a single tap, which cancels the task and immediately prompts a safety incident report."
        ]
      }
    ]
  },
  {
    id: "v01_ch3",
    chapterNumber: 3,
    title: "North Star Metrics & Core Analytics Model",
    summary: "Mapping the statistical indicators that guide the engineering direction of Project SETU, moving beyond vanity metrics into verifiable impact telemetry.",
    sections: [
      {
        subheading: "3.1 The Primary Metric: Meals Delivered with Dignity (MDD)",
        paragraphs: [
          "Traditional non-profits measure 'meals cooked' or 'funds raised'. However, these are vanity outputs. Project SETU establishes a compound primary metric: Meals Delivered with Dignity (MDD). This is defined as a meal that is successfully sourced, verified through our triple-gated AI fraud engine, delivered to the NGO within its freshness window, and distributed under our strict ethical, seated-queue guideline.",
          "Formally: MDD = Sourced Portions × AI Validation Factor × Temperature/Freshness Compliance × Ethical Handoff Rate. If a volunteer violates receiver dignity by uploading close-up beneficiary photos, the run's validation factor falls to 0, completely wiping out the MDD credit."
        ],
        keyMetrics: [
          { label: "Target MDD per Month (Delhi Pilot)", value: "50,000+ Verified Meals", source: "Year 1 Business Plan" },
          { label: "AI Verification Confidence Threshold", value: ">= 85% Accuracy", source: "AI Core Spec" }
        ],
        callout: "By mapping success to MDD, we prioritize the human experience of the beneficiary over raw operational scale, preserving our absolute core value: unconditional dignity."
      },
      {
        subheading: "3.2 Secondary Core Operational Telemetry",
        paragraphs: [
          "To keep the logistics machinery humming, the team monitors four engineering and logistical metrics closely:",
          "1. Surplus-to-Delivery Latency: The absolute duration from the donor hitting 'Submit' to the NGO scanning 'Receive'. The national target is under 45 minutes to avoid cold-chain degradation.",
          "2. Volunteer Retention Index: The fraction of registered volunteers who complete at least 3 runs per month. This indicates health in our gamification and reward loop.",
          "3. Landfill Diversion Rate: Kilograms of organic food waste diverted from landfill pits, mapped to methane reduction credits."
        ],
        bulletPoints: [
          "Latency Threshold: Maximum 60 minutes for cooked rice/dairy gravy; up to 120 minutes for dry staples.",
          "Geodesic Path Deviation: Telemetry must align within a 15% tolerance of the Google Maps API suggested route to avoid unauthorized detours."
        ]
      }
    ]
  },
  {
    id: "v01_ch4",
    chapterNumber: 4,
    title: "Phase-wise Growth & Scale Roadmap",
    summary: "A three-phase execution plan for Project SETU, scaling from a highly localized hyper-pilot in Delhi to a national operating system for food rescue.",
    sections: [
      {
        subheading: "4.1 Phase 1: The Delhi-NCR Core Hyper-Pilot",
        paragraphs: [
          "The first 6 months focus strictly on perfecting the logistics engine in Delhi-NCR, targeting the high-density South Delhi and Okhla banquet corridors. During this phase, we establish direct integration with 50 premium wedding banquets and 15 local NGO shelter hubs.",
          "Success in Phase 1 is defined by reaching a consistent run rate of 1,500 meals rescued daily, maintaining a perfect 0% food safety incident rate, and validating our volunteer trust algorithm."
        ],
        keyMetrics: [
          { label: "Phase 1 Duration", value: "Months 1 - 6", source: "GTM Plan" },
          { label: "Daily Sourced Target", value: "1,500 Meals/Day", source: "Ops Model" }
        ]
      },
      {
        subheading: "4.2 Phase 2: Tier-1 Indian Metro Expansion",
        paragraphs: [
          "In Months 7 to 18, SETU expands to Mumbai (focusing on corporate offices, tiffin networks, and suburban slums) and Bengaluru (focusing on tech park excess, student networks, and construction pockets). During this phase, we introduce the 'Sewa Champion' college micro-grant program.",
          "We also launch official partnerships with major food-delivery platforms (like Swiggy and Zomato) to display 'Zero Waste partner' badges on restaurant menus, driving donor acquisition organically."
        ],
        bulletPoints: [
          "Regional Adaptations: Deploying Mumbai 'Dabbawala' coordination modules for mid-day logistics.",
          "Automated Fuel Subsidies: Direct wallet payouts to volunteers based on geo-verified scooter run distances."
        ],
        keyMetrics: [
          { label: "Target Cities", value: "Delhi, Mumbai, Bengaluru, Indore", source: "Scale Plan" },
          { label: "Active Volunteer Network", value: "10,000+ Registered", source: "Scale Plan" }
        ]
      },
      {
        subheading: "4.3 Phase 3: The National Operating System for Welfare",
        paragraphs: [
          "Year 2 onwards, SETU open-sources its core geodesic dispatch routing SDK, allowing local independent NGOs across India to deploy their own localized networks.",
          "Additionally, the platform integrates with the National Disaster Response Force (NDRF) and state disaster boards, serving as the default logistics dispatcher for hot meals and emergency supplies during floods, earthquakes, or seasonal crises."
        ],
        callout: "Phase 3 transforms SETU from an application into a public digital utility—the national operating system for humanitarian logistics in India."
      }
    ]
  }
];
