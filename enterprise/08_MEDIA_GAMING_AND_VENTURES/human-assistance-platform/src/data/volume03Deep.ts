import { DeepChapter } from "./volume00Deep";

export const volume03Chapters: DeepChapter[] = [
  {
    id: "v03_ch1",
    chapterNumber: 1,
    title: "Brand Architecture & Strategic Naming",
    summary: "Differentiating internal codenames from public brand trademarks, mapping our brand architecture across multiple physical and digital portals, and defining our core brand promise.",
    sections: [
      {
        subheading: "1.1 Internal Codename vs. Public Trademark Strategy",
        paragraphs: [
          "A common failure in social-tech start-ups is launching publicly with an un-cleared brand name, leading to costly legal battles and confusing rebrands. While 'SETU' (representing a symbolic and physical bridge) is our highly aligned internal codename, we must separate it from final public branding.",
          "In India, 'SETU' is registered under multiple government services (e.g., Aarogya Setu, CoWIN Setu) and software portals. To prevent trademark conflicts, we maintain 'Project SETU' as our internal architectural framework, while our public brand trademark will undergo comprehensive Class 39, Class 43, and Class 45 legal audits before final launch."
        ],
        bulletPoints: [
          "Class 39 (Logistics): Protects our proprietary real-time geofenced routing, dispatch, and delivery services.",
          "Class 43 (Food Redistribution): Governs our platform's food-rescue facilitation, packaging verification, and hunger relief logistics.",
          "Class 45 (Social & Humanitarian): Controls our humanitarian outreach, verified donor transparency portals, and community coordination."
        ],
        keyMetrics: [
          { label: "IP Clearance Classes", value: "Class 39, 43, 45", source: "Indian Patent & TM Registry" },
          { label: "Trademark Risk Index", value: "High (Common Sanskrit term)", source: "SETU Legal Audit" }
        ],
        callout: "By maintaining 'Project SETU' as an internal codename, we isolate our engineering and system architecture from downstream brand alterations, ensuring a modular name-swap is always possible."
      },
      {
        subheading: "1.2 Unified Brand Architecture",
        paragraphs: [
          "Our system must not be perceived as a single monolithic app. It is a highly integrated, multi-stakeholder ecosystem. To prevent brand confusion, we establish a strict hub-and-spoke brand architecture where each application serves a unique user archetype with dedicated interfaces:"
        ],
        bulletPoints: [
          "1. Donor Platform: The high-trust portal where commercial kitchens, luxury hotels, and wedding caterers list surplus food in under 10 seconds.",
          "2. Volunteer App: The gamified, GPS-enabled field client designed for on-road volunteers to claim routes and verify pickups.",
          "3. NGO Portal: The secure, lightweight, and offline-capable console where shelter coordinators verify incoming food deliveries via QR validation.",
          "4. CSR Portal: The enterprise dashboard where corporate sponsors track real-time donation impact, download tax receipts, and access ESG reports.",
          "5. System Admin Console: The central cockpit giving municipal administrators real-time heatmaps, route metrics, and manual override capabilities."
        ],
        keyMetrics: [
          { label: "Total Target Ecosystem Portals", value: "5 Active Interfaces", source: "Product Specification" },
          { label: "Stakeholder Groups Served", value: "Donor, Volunteer, NGO, Corp, Admin", source: "Brand Architecture" }
        ]
      },
      {
        subheading: "1.3 The Core Brand Promise",
        paragraphs: [
          "Every visual choice, text message, and UI micro-interaction must support a single, unshakeable brand promise: 'Verified help. Delivered with dignity.'",
          "This promise separates SETU from the traditional 'charity' aesthetic. We do not deal in pity; we deliver reliable, high-transparency, and deeply respectful public infrastructure."
        ]
      }
    ]
  },
  {
    id: "v03_ch2",
    chapterNumber: 2,
    title: "Brand Voice, Personality & Dignity Ethics",
    summary: "Guiding rules on how SETU speaks and interacts across digital channels, outlining our strict dignity-first copywriting standards and photography ethics.",
    sections: [
      {
        subheading: "2.1 Brand Personality & Tone of Voice",
        paragraphs: [
          "SETU speaks with a professional, empathetic, and urgent tone. We are serious about technology but deeply human at heart. We write clearly, avoiding technical jargon, academic high-mindedness, or emotional panic."
        ],
        bulletPoints: [
          "Empathetic, not Pitying: We focus on systemic empowerment and connection. We describe our users as active partners and guests, never as victims.",
          "Transparent, not Defensive: We publish our real-time audit logs, including delayed runs, and explain anomalies simply with factual data.",
          "Urgent, not Panicked: We prompt volunteers to act quickly because food is highly perishable, but we maintain complete operational control and calmness."
        ],
        callout: "We communicate like a public utility—reliable, urgent, and accessible to all—rather than an emotional charity pleading for help."
      },
      {
        subheading: "2.2 Strictly Banned vs. Preferred Dignity Vocabulary",
        paragraphs: [
          "To respect our community, we enforce a strict vocabulary policy. Using derogatory, pity-inducing, or dehumanizing terminology is a critical failure that erodes trust:"
        ],
        bulletPoints: [
          "❌ Banned terms: 'Beggar', 'Victim', 'Hopeless', 'Poor people', 'Underprivileged souls', 'Starving masses'.",
          "✅ Preferred terms: 'Guests at the partner shelter', 'Community members in need', 'Food-insecure families', 'Beneficiary organizations', 'Active recipients'."
        ]
      },
      {
        subheading: "2.3 Photography and Media Ethics (The 3C Rule)",
        paragraphs: [
          "Many NGOs exploit pictures of children eating or distressed families to drive donations—a practice known as 'poverty porn'. Project SETU has a strict zero-tolerance policy against this. All media assets must adhere to the 3C Rule:"
        ],
        bulletPoints: [
          "1. Consent: Never photograph any recipient or shelter guest without explicit written or verified verbal permission. If they express even mild hesitation, the camera is immediately put away.",
          "2. Context: The hero of our imagery is never the 'victim' in isolation. Our photos focus on the physical system working—the clean containers, the volunteer-donor handoff, or the logistics map.",
          "3. Camera Angle: We never shoot from a high angle looking down on a recipient, as this visually projects inferiority. All photographs of people must be shot from eye-level or slightly lower, representing strength and equality."
        ],
        callout: "The volunteer is not a savior, and the beneficiary is not a helpless victim. The hero of our brand is the community coming together to bridge the gap."
      }
    ]
  },
  {
    id: "v03_ch3",
    chapterNumber: 3,
    title: "Design Principles, Accessibility & Motion",
    summary: "Building for everyone: establishing our WCAG 2.2 AA accessibility targets, battery-friendly motion guidelines, and low-bandwidth UI strategies.",
    sections: [
      {
        subheading: "3.1 Five Core Design Principles",
        paragraphs: [
          "Every engineer, designer, and PM contributing to our codebase must enforce these five core principles in their interfaces:"
        ],
        bulletPoints: [
          "1. Accessibility First: Interfaces must be readable by users with differing visual, auditory, cognitive, or physical abilities.",
          "2. Mobile First: The vast majority of our field operations occur on entry-level Android devices. The desktop portal is secondary; the mobile interface is paramount.",
          "3. Low-Bandwidth First: Assets are heavily optimized, SVGs are preferred over images, and CSS is kept light to render perfectly on 2G and 3G connections.",
          "4. Offline First: The user interface must gracefully handle connection drops, visually queuing actions without interrupting the volunteer's flow.",
          "5. Privacy First: Beneficiary personal identifiers are never displayed in public or volunteer interfaces, fully complying with India's DPDP Act 2023."
        ],
        keyMetrics: [
          { label: "Min Touch Target", value: "48px x 48px", source: "Android Accessibility Spec" },
          { label: "Target Bundle Size", value: "< 150KB (Gzipped)", source: "Performance SLA" }
        ]
      },
      {
        subheading: "3.2 WCAG 2.2 AA Accessibility Mandates",
        paragraphs: [
          "Our platforms must comply with WCAG 2.2 Level AA guidelines. This is not only a moral duty but a crucial requirement for public and municipal partnerships:",
          "• High-Contrast Ratio: All text must maintain a minimum contrast ratio of 4.5:1 for body copy and 3.0:1 for large display headings.",
          "• Color Independence: Information must never be communicated solely through color. For example, success status must feature both a green color and an active checkmark icon.",
          "• Large Screen-Reader and Font Support: Layouts must accommodate fluid text scaling up to 200% without breaking grid boundaries or truncating labels."
        ],
        keyMetrics: [
          { label: "Contrast Ratio Target", value: ">= 4.5:1", source: "WCAG 2.2 AA Standard" },
          { label: "Fluid Scaling Cap", value: "Up to 200% zoom", source: "Accessibility Spec" }
        ]
      },
      {
        subheading: "3.3 Battery-Friendly Motion Guidelines",
        paragraphs: [
          "Motion should provide useful spatial feedback, not serve as visual noise. Animations must be purposeful, subtle, and optimized to protect battery life on affordable field devices:",
          "• Target Duration: All layout and micro-interactions must resolve between 200ms and 300ms using clean easing curves (ease-out or ease-in-out).",
          "• Hardware Acceleration: We restrict layout-breaking animations. We use transform, translate, and opacity animations to utilize GPU acceleration, preventing CPU heating.",
          "• Dynamic Trigger States: Heavy success animations are reserved exclusively for critical milestones (e.g. completing a delivery run or confirming a donation), while transactional lists use instant or near-instant fades."
        ]
      }
    ]
  },
  {
    id: "v03_ch4",
    chapterNumber: 4,
    title: "Design System Foundation (The Tokens)",
    summary: "The source of truth for Project SETU's visual identity: precise color palettes, spacing grids, typography hierarchies, and elevation systems.",
    sections: [
      {
        subheading: "4.1 Sophisticated Neutral & Eye-Safe Color Tokens",
        paragraphs: [
          "Our color palette rejects default cold grays and harsh clinical whites. We utilize a highly sophisticated, warm neutral palette that reflects nourishment, cleanliness, and trust:"
        ],
        bulletPoints: [
          "Primary: SETU Saffron (`#FF7A00` / HSL 29, 100%, 50%) — represents warmth, community meals, and rapid action. Used for main action buttons and highlights.",
          "Secondary: Trust Navy (`#0A2540` / HSL 210, 73%, 15%) — represents solid technology, security, and institutional trust. Used for dark backgrounds and text.",
          "Accent: Impact Green (`#00C48C` / HSL 163, 100%, 38%) — represents sanitation, safe food, and completed missions.",
          "Neutral Light: Dignity Clay (`#F4F1EA` / HSL 45, 20%, 94%) — a warm off-white background that reduces eye strain under outdoor sunlight.",
          "Neutral Dark: Charcoal (`#1C1E21` / HSL 210, 8%, 12%) — soft, high-contrast black for reading clarity."
        ],
        keyMetrics: [
          { label: "Saffron AA Contrast on Dark", value: "Passes 4.8:1", source: "Contrast Audit" },
          { label: "Navy AA Contrast on Clay", value: "Passes 8.3:1", source: "Contrast Audit" }
        ],
        callout: "By mixing a tiny hint of warm clay saturation into our grays and whites, we create a unified visual tone that feels welcoming and highly premium."
      },
      {
        subheading: "4.2 Spacing System (The 8-Point Grid)",
        paragraphs: [
          "All margins, paddings, gap dimensions, and component heights must align mathematically to a strict 8-point grid. This ensures perfect visual rhythm and prevents arbitrary sizing errors:",
          "• 4px: Extra-tight grouping (e.g., label-to-input gap).",
          "• 8px: Tight padding (e.g., small buttons, micro-badges).",
          "• 16px: Standard padding (e.g., card margins, body margins).",
          "• 24px: Generous gap (e.g., section spacing, header margins).",
          "• 32px: Extra-generous separation (e.g., container outer bounds)."
        ],
        callout: "Consistent spacing is the foundation of structural polish. Avoid hardcoded values like 11px or 19px."
      },
      {
        subheading: "4.3 Typographic Scale & Pairing",
        paragraphs: [
          "We establish a strict typographic hierarchy to optimize readability across diverse screen sizes. We pair Poppins/Plus Jakarta Sans (display) with Inter (body copy):",
          "• Display H1: 32px (Line height 1.25) — Poppins Bold. Used for main page headers.",
          "• Section H2: 24px (Line height 1.3) — Poppins SemiBold. Used for major module headings.",
          "• Subheading H3: 18px (Line height 1.35) — Inter SemiBold. Used for card headers.",
          "• Body Text: 16px (Line height 1.55) — Inter Regular. The absolute minimum size for legible content.",
          "• Labels & Micro: 12px (Line height 1.4) — Inter Medium/Bold. Used for buttons, tags, and small badges."
        ]
      },
      {
        subheading: "4.4 Elevation, Corners & Shadows",
        paragraphs: [
          "Project SETU avoids complex, muddy layers or deep glowing shadows. We use a flat visual style with crisp, clean elevations and mathematically correct border-radii:",
          "• Flat/Base Card: Border 1px solid `#E6E1D8`, border-radius 12px, shadow none.",
          "• Floating Component: Border 1px solid `#E6E1D8`, border-radius 16px, shadow `0 4px 12px rgba(10, 37, 64, 0.05)`.",
          "• Button Corners: Rounded 8px to 12px (pills reserved exclusively for tags and active filter chips)."
        ]
      }
    ]
  },
  {
    id: "v03_ch5",
    chapterNumber: 5,
    title: "Component Library Specifications",
    summary: "Standardizing our core interactive UI components to ensure layout stability, unified brand patterns, and rapid engineering reuse.",
    sections: [
      {
        subheading: "5.1 Standardized Input Forms & Dynamic Error States",
        paragraphs: [
          "Inputs are the primary source of user friction. We standardize our form components to maintain visual rhythm and provide clear, reassuring feedback:",
          "• Active State: Border shifts to SETU Saffron (`#FF7A00`) with a subtle 2px glow.",
          "• Error State: Border shifts to soft red (`#EF4444`). Error messages must be displayed in plain text underneath the field, pairing a red label with a tiny warning icon.",
          "• Loading State: Input fields are disabled and show a clean, battery-friendly skeleton pulse."
        ]
      },
      {
        subheading: "5.2 Structured Card Layouts",
        paragraphs: [
          "We reject nested cards (cards inside cards) as they clutter the interface and reduce reading density. Instead, we use flat dividers and generous margins:",
          "• Card Container: A warm clay background, framed by a delicate 1px border. No heavy drop-shadows.",
          "• Card Header: Bold 18px subheading with a colored accent tag indicating status.",
          "• Card Footer: Action buttons are aligned horizontally on the bottom right, with clear spacing and a minimum touch target size of 48px."
        ]
      },
      {
        subheading: "5.3 Multi-Platform Navigation Guidelines",
        paragraphs: [
          "Navigation is tailored directly to the device archetype:",
          "• Mobile Clients: Bottom-sheet drawers and tab bars positioned at the bottom of the screen to enable simple, single-handed operation while on the move.",
          "• Desktop Portals: Clean top navigation bars with high-contrast text and sticky section headers, leaving maximum screen width for analytics graphs and map grids."
        ]
      }
    ]
  }
];
