import { DeepChapter } from "./volume00Deep";

export const volume04Chapters: DeepChapter[] = [
  {
    id: "v04_ch1",
    chapterNumber: 1,
    title: "Multi-Stakeholder Personas & Deep Journeys",
    summary: "Deep dive into our 5 primary user personas, mapping their specific digital constraints, technical environments, and core happy paths through the SETU ecosystem.",
    sections: [
      {
        subheading: "1.1 The Five Core Ecosystem Personas",
        paragraphs: [
          "Project SETU serves a highly heterogeneous user base. To build interfaces that feel intuitive to all, we must design specifically for their disparate technical literacies, devices, and operational environments:",
          "1. Rahul (The Volunteer): 22, active college student, urban. Uses a mid-range Android device with erratic mobile data. Motivated by immediate social impact, gamified trust badges, and verified college service hours. Frustrated by heavy bundle downloads, slow OTP check-ins, and high battery consumption.",
          "2. Sunita (The NGO Coordinator): 48, runs a registered local night shelter. Uses an entry-level smartphone with low digital literacy; relies heavily on WhatsApp and voice-notes. Motivated by securing a predictable food supply for her 60+ shelter guests. Frustrated by dense English-only forms, multi-nested menus, and typing on small touchscreens.",
          "3. Vikram (The Restaurant Manager): 32, F&B operations lead in a busy commercial hotel. Extremely time-poor, uses a shared staff tablet or mobile device. Motivated by rapid kitchen clearance at closing, positive corporate PR, and absolute legal/sanitation protection. Frustrated by delayed pickups, complicated app logins, and lack of verified handoff proof.",
          "4. Priya (The CSR Sponsor): 35, Corporate HR Head and Social Responsibility director. Operates primarily on high-end laptops or iPhones. Demands high-fidelity financial audit reports, automated 80G tax exemptions, and direct geographical maps showing where corporate funds were routed. Frustrated by 'black-box' charities and manual document collecting.",
          "5. Rajesh (The District Operations Manager / City Lead): 38, full-time regional coordinator. Uses a laptop and mid-range Android phone, responsible for managing 200+ active volunteers and 50+ shelters in Delhi-NCR. Motivated by maintaining high delivery fulfillment rates and rapid incident resolution. Frustrated by lack of live driver tracking, manual escalation sheets, and fragmented communications."
        ],
        keyMetrics: [
          { label: "Target NGO Literacy Cap", value: "Basic WhatsApp level", source: "Ecosystem Audit" },
          { label: "Volunteer Device Share", value: "85% Mid-tier Android", source: "Telemetry Field Study" }
        ]
      },
      {
        subheading: "1.2 End-to-End Happy Path: The Perishable Surplus Run",
        paragraphs: [
          "The primary operational transaction must proceed with absolute synchronicity and minimal friction:",
          "• Initiation: Vikram (Restaurant) has 30 servings of paneer butter masala. He taps 'List Surplus' on the SETU dashboard (or messages the automated WhatsApp bot). AI parses the request, verifies safety criteria, and approves the listing in under 10 seconds.",
          "• Dispatch: The engine identifies the optimal route and broadcasts a push notification to volunteers within a 3km radius: '30 Hot Meals | 1.8km away | Destination: Karol Bagh Shelter'.",
          "• Claim: Rahul (Volunteer) accepts the route. The app caches GPS coordinates, maps, and offline digital QR signatures.",
          "• Handoff: Rahul arrives at the kitchen, scans a dynamic QR code on the hotel tablet. The hotel's status shifts to 'Picked Up'.",
          "• Delivery: Rahul reaches Sunita's shelter, hands over the thermal-insulated crates, and Sunita scans Rahul's QR code or inputs a 4-digit voice-guided OTP.",
          "• Completion: Sunita validates food temperature and container counts. The ledger registers a successful run, updating Vikram's CSR panel and granting Rahul 15 trust points."
        ]
      }
    ]
  },
  {
    id: "v04_ch2",
    chapterNumber: 2,
    title: "Dignity by Design & Mobile Accessibility",
    summary: "Guiding principles for building low-literacy interfaces, regional localization scales, voice-driven inputs, and inclusive, eye-safe layouts.",
    sections: [
      {
        subheading: "2.1 Designing for Low-Literacy Users",
        paragraphs: [
          "Traditional forms and text-heavy menus represent a psychological barrier for grassroots NGO coordinators like Sunita. SETU enforces a strict 'Icon-First' layout strategy:",
          "• Semantic Color Associations: Every key action features a high-contrast icon and color pair (e.g., a green bowl for meals, an orange truck for transport, a yellow shield for verification). This allows users to navigate the system without needing to read or parse instructions.",
          "• Voice Notes over Keyboards: Instead of typing guest names or dietary updates, coordinators can tap a prominent microphone icon to record a short voice note. The local NLP parser transcribes, registers, and categorizes the audio.",
          "• Voice-Guided OTPs: Standard text OTPs are backed up by audio playbacks in the user's preferred language, speaking out the confirmation code."
        ],
        callout: "Accessibility is not a cosmetic feature. For an NGO coordinator managing an active shelter under weak lighting, an icon-driven, voice-guided app is the difference between a successful meal and a system rejection."
      },
      {
        subheading: "2.2 Fluid Regional Localization Scales",
        paragraphs: [
          "Translating text into Hindi, Tamil, or Marathi frequently causes layout breaking because Indic scripts require up to 40% more vertical space and feature taller line-height profiles compared to English.",
          "• Fluid Layout Boundaries: Buttons and text containers use flexible height constraints (Figma auto-layout / Tailwind 'h-auto py-3') rather than hardcoded pixel limits. Standardized texts use 'white-space: normal' to allow clean line wraps without label truncating.",
          "• Dynamic Type Scaling: Text elements adjust down by 2px dynamically if the locale is shifted to non-Latin scripts, maintaining typographic balance without clipping margins."
        ]
      }
    ]
  },
  {
    id: "v04_ch3",
    chapterNumber: 3,
    title: "Volunteer Safety & Quick Actions",
    summary: "Enforcing safety protocols on nighttime runs, integrating emergency SOS flows, and standardizing frictionless quick actions for busy kitchen staff.",
    sections: [
      {
        subheading: "3.1 Nighttime Safety protocols & SOS Engineering",
        paragraphs: [
          "Because 70% of high-volume wedding and banquet surplus becomes available between 11:00 PM and 2:00 AM, nocturnal volunteer safety is a non-negotiable architectural priority:",
          "• One-Tap SOS Button: A persistent, high-contrast red emergency button is present on the Active Task screen. Tapping it triggers an automated protocol: sending the volunteer's real-time GPS coordinates, route history, and companion details to the District Operations Manager, the local police coordinator, and predefined emergency contacts via SMS and high-priority WebSocket alerts.",
          "• The Safety Buddy System: Late-night tasks (assigned after 10:00 PM) cannot be claimed by a single volunteer. The dispatch server requires dual-signups, automatically matching pairs of local volunteers to execute the run together.",
          "• Female-Volunteer Curfews: Out of respect for safety realities, the app restricts female volunteers from claiming solo late-night runs, suggesting verified daytime distribution runs or administrative hub roles instead, unless they are checked-in as a team."
        ],
        keyMetrics: [
          { label: "SOS Response Goal", value: "< 120 Seconds", source: "Ops Escalation SLA" },
          { label: "Night Run Minimum Team", value: "2 Registered Buddies", source: "Safety Mandate" }
        ]
      },
      {
        subheading: "3.2 Restaurant Quick Actions (The 3-Tap Rule)",
        paragraphs: [
          "Kitchen staff work in chaotic, high-heat, and high-speed environments. They will reject any platform that requires extensive attention. We enforce a strict 3-Tap UI guideline for the Restaurant Portal:",
          "• Tap 1: Select 'List Surplus' directly from the main tab.",
          "• Tap 2: Tap a preset portion size button (e.g., '10-20 servings', '20-50 servings', '50+ servings').",
          "• Tap 3: Tap 'Approve & Broadcast' to launch the dispatch process.",
          "This completes the registration in under 8 seconds without requiring the chef to type, enter weights, or configure complex routing parameters."
        ],
        callout: "The Restaurant app must respect the physical constraints of a commercial kitchen. If the chef has to type, the app is dead on arrival."
      }
    ]
  },
  {
    id: "v04_ch4",
    chapterNumber: 4,
    title: "NGO Inventory & Live Capacity UX",
    summary: "Visualizing daily shelter capacities, structuring expected delivery arrivals, and managing real-time inventory to prevent food gluts.",
    sections: [
      {
        subheading: "4.1 Real-Time Capacity Tracking",
        paragraphs: [
          "A major failure of uncoordinated food rescue is food dumping—where one night shelter receives three separate unannounced shipments of biryani, leading to massive waste, while a shelter 1km away goes hungry.",
          "• The Live Shelter Grid: Sunita's shelter dashboard features a clean, high-contrast capacity visualizer showing her active guest count, current food inventory, and maximum storage capacity.",
          "• Scheduled Delivery Log: The UI lists 'Expected Deliveries' in a timeline grid, showing incoming portion counts, volunteer names, and real-time ETA countdowns. If a planned delivery exceeds her remaining capacity, the dispatch engine automatically prompts the volunteer to split the route and deliver the excess to a nearby shelter in need."
        ],
        bulletPoints: [
          "Daily Cap Metrics: Maximum Capacity (e.g., 100 guests), Current Meals Count, Remaining Gap (Meals Needed).",
          "Expected Food Schedule: Broken down clearly by Breakfast, Lunch, and Dinner slots with color-coded arrival states."
        ]
      }
    ]
  },
  {
    id: "v04_ch5",
    chapterNumber: 5,
    title: "Offline Cache & Resiliency Architecture",
    summary: "Structuring our client-side IndexedDB databases, caching essential routing maps, and managing offline cryptographic tokens.",
    sections: [
      {
        subheading: "5.1 The Robust Offline Caching Layer",
        paragraphs: [
          "Field operations regularly run into network dead-zones under flyovers, in basement commercial kitchens, or in dense urban slums. The SETU mobile client treats network connectivity as a temporary luxury, not a dependency:",
          "• Local IndexedDB Schema: The app caches five critical data modules locally upon task acceptance: (1) Assigned route maps with vector geodata; (2) Detailed shelter addresses and contacts; (3) The volunteer's trust profile and verification logs; (4) Localized translation and language resource files; (5) Offline dynamic QR tokens.",
          "• Cryptographic Handoff: If both the volunteer and the NGO are offline during delivery, validation is executed using a secure, time-sensitive TOTP token generated locally on Rahul's app and validated on Sunita's offline screen, which is cryptographically written to their local queues and uploaded to the server once network connectivity returns."
        ],
        callout: "Offline first means the app behaves identically whether the user has 5G or zero network bars. The completion animation triggers locally instantly, keeping the field flow moving."
      }
    ]
  },
  {
    id: "v04_ch6",
    chapterNumber: 6,
    title: "UX Error States, Notification Priority & Invisible AI",
    summary: "Designing supportive error states for field anomalies, mapping our push notification priority matrices, and establishing invisible AI UX parameters.",
    sections: [
      {
        subheading: "6.1 Comprehensive Error States and Recovery",
        paragraphs: [
          "When an operation fails on the road, users panic. Our interfaces must provide clear, supportive, and actionable directions rather than obscure technical stack traces:",
          "• No Nearby Requests: Instead of an empty white screen, show a calming illustration of an empty road with text: 'The neighborhood is secure. We will notify you the moment a nearby restaurant lists surplus.'",
          "• No Internet State: Displays a prominent warm beige banner at the top: 'Offline Mode Active. Your actions are saved locally and will auto-sync.' Features an instant manual offline retry button.",
          "• GPS / Permission Denied: Explains clearly why the app is locked: 'SETU requires GPS to verify your delivery proximity. Tap here to open Settings and enable location services.'"
        ]
      },
      {
        subheading: "6.2 Push Notification Priority Matrix",
        paragraphs: [
          "To prevent user fatigue and ensure critical messages are read, notifications are categorized into three rigid priority bands:",
          "1. Critical Priority (SMS & Push): Late delivery alerts, SOS triggers, route cancellation alerts, and food safety warnings.",
          "2. Medium Priority (Standard Push): Direct task assignments, volunteer route updates, and shelter inventory changes.",
          "3. Low Priority (Silent Push): Trust badges earned, weekly impact summaries, and CSR milestone celebrations."
        ]
      },
      {
        subheading: "6.3 Invisible AI UX Guidelines",
        paragraphs: [
          "AI scores, fraud metrics, and confidence intervals are highly intimidating to non-technical users. Our UX hides these backend parameters entirely behind natural, dignity-preserving text:",
          "• Instead of showing: 'AI Fraud Verification Score = 0.83', the app displays: 'Request under review.'",
          "• Instead of showing: 'GPS Anomaly Detected (Delta 120m) - Suspicious Flag', the app displays: 'Additional validation required. Please upload a clear photo of the delivery crate.'"
        ]
      }
    ]
  },
  {
    id: "v04_ch7",
    chapterNumber: 7,
    title: "Trust Indicators & Tailored Analytics UX",
    summary: "Visualizing gamified trust scores for all stakeholders, and structuring custom dashboards for donors, volunteers, NGOs, and city leads.",
    sections: [
      {
        subheading: "7.1 Micro-Trust Indicators in the UI",
        paragraphs: [
          "Mutual trust is the currency of our network. We embed prominent, reassuring trust metrics directly into user profiles to build systemic pride:",
          "• For Restaurant Partners: Displays a prominent badge: 'Verified Donor since 2026 | 500+ Pickups Completed | 0 Safety Violations'. This represents active CSR engagement.",
          "• For Volunteer Profiles: Displays trust levels (e.g., 'Trust Rank: Gold Scholar | 200 successful deliveries'). Drives community pride and volunteer retention.",
          "• For NGO Shelters: Displays validation credentials: 'FSSAI Certified Hub | Daily Capacity: 120 Guests | 99% Receipt Accuracy'."
        ]
      },
      {
        subheading: "7.2 Tailored Analytics Dashboards",
        paragraphs: [
          "A single analytics screen cannot serve everyone. Each stakeholder receives a highly customized, focused layout:",
          "• The Volunteer Panel: Displays personal metrics: 'Total Meals Delivered (e.g., 420)', 'Hours Served', and 'CO2 Waste Diverted (kg)'. Features active badges.",
          "• The NGO Coordinator Console: Focused strictly on operational inventory: 'Incoming meals today', 'Remaining Capacity', 'Past Delivery Logs'.",
          "• The Donor Web Console: Tailored for PR and corporate tax requirements: 'Total Servings Contributed', 'Carbon Footprint Offsets (Tonnes)', 'Download 80G Tax Exemption Certificates (PDF)'.",
          "• The Regional Operations Command Center: High-intensity cockpit showing live maps of all active delivery routes, vehicle speeds, and heatmaps of regional food waste, allowing DOMs to balance supplies dynamically."
        ]
      }
    ]
  }
];
