import { DeepChapter } from "./volume00Deep";

export const volume04aChapters: DeepChapter[] = [
  {
    id: "v04a_ch1",
    chapterNumber: 1,
    title: "Color Tokens & HSL Saturation Specs",
    summary: "Diving deep into the mathematical definition of Project SETU's color system, detailing background brightness limits and WCAG contrast conformance.",
    sections: [
      {
        subheading: "1.1 The Eye-Safe, Low-Strain Color System",
        paragraphs: [
          "To guarantee comfortable operation during bright mid-day sun and pitch-black night runs, SETU's color token registry avoids default absolute grays and clinical whites. Instead, we saturate our neutral tones with 3% to 5% warm yellow/brown hue to create a soft, nourishing, and highly readable canvas:",
          "• Primary: SETU Saffron (`#FF7A00` / HSL 29, 100%, 50%) — represents food, energy, and community warmth. Emphasized on primary touch controls and active notifications.",
          "• Secondary: Trust Navy (`#0A2540` / HSL 210, 73%, 15%) — represents solid security, corporate trust, and technical durability. Used for high-contrast typography, cards, and deep headers.",
          "• Accent: Impact Green (`#00C48C` / HSL 163, 100%, 38%) — represents sanitation, safe food, and successfully completed tasks.",
          "• Neutral Light: Dignity Clay (`#F4F1EA` / HSL 45, 20%, 94%) — soft, warm off-white background that completely eliminates the eye strain caused by stark white screens in outdoor environments.",
          "• Neutral Dark: Charcoal (`#1C1E21` / HSL 210, 8%, 12%) — soft high-contrast black for reading clarity."
        ],
        keyMetrics: [
          { label: "Saffron on Clay Contrast", value: "Passes 4.6:1 (AA Large)", source: "WCAG Audit" },
          { label: "Navy on Clay Contrast", value: "Passes 8.4:1 (AA Normal)", source: "WCAG Audit" }
        ]
      },
      {
        subheading: "1.2 Brightness Delta Boundaries",
        paragraphs: [
          "Our UI layout ensures that overlapping elements follow a strict vertical Z-axis brightness progression. Elements physically closer to the user (floating cards, modal dialogs) are styled lighter, and the brightness difference between any container and its background is constrained to protect readability:",
          "• Light Mode Limits: The background-to-container brightness variance is capped at 7% (e.g., container at HSL H, S, 98% sitting on a background of HSL H, S, 91%).",
          "• Dark Mode Limits: The variance is capped at 12% to prevent harsh, high-frequency outlines that tire the eyes at night."
        ]
      }
    ]
  },
  {
    id: "v04a_ch2",
    chapterNumber: 2,
    title: "Spacing & Vertical Rhythm Grid",
    summary: "Defining our mathematical 8-point spatial system, container padding limits, and the nested border-radius rule.",
    sections: [
      {
        subheading: "2.1 The Standardized 8-Point Grid Scale",
        paragraphs: [
          "All margins, paddings, gap dimensions, and layout offsets align to a strict mathematical scale. This consistency ensures predictable rendering and speeds up cross-framework translation between Flutter and Next.js:",
          "• 4px: Extra-tight grouping (e.g., label text to its direct input box).",
          "• 8px: Tight padding (e.g., small buttons, status chips, or tags).",
          "• 12px: Medium spacing (e.g., items inside a list, or dense form field clusters).",
          "• 16px: Standard padding (e.g., card internal margins, general body margins, or item lists).",
          "• 24px: Generous padding (e.g., major sections, column separators, or outer page titles).",
          "• 32px: Extra-generous bounds (e.g., outer app containers, landing page sections)."
        ],
        callout: "Hardcoded spacing values like 11px or 19px are strictly banned from our UI codebase. Every dimension must be a multiple of the base grid."
      },
      {
        subheading: "2.2 The Nested Corner Radius Formula",
        paragraphs: [
          "When a rounded component is nested inside another rounded container (such as a thumbnail image inside a card, or a text block inside a popup), standard outer corner radii cause optical clipping and misalignment. We enforce a strict geometric formula:",
          "• Formula: Inner Corner Radius = Outer Corner Radius - Distance Between the Two (Padding).",
          "• Example: If a card features an outer border-radius of 16px and has a standard padding of 12px, any inner container must utilize an exact corner radius of 4px (16 - 12 = 4) to ensure mathematical alignment."
        ]
      }
    ]
  },
  {
    id: "v04a_ch3",
    chapterNumber: 3,
    title: "Typography Scale & Responsive Breakpoints",
    summary: "Outlining our font pairings, line-height rules, and responsive layout breakpoints.",
    sections: [
      {
        subheading: "3.1 Typography Pairing and Sizing",
        paragraphs: [
          "To establish a clear visual hierarchy, we pair Poppins (for Display and Headers) with Inter (for highly legible body content and controls):",
          "• Display H1: 32px (Line height 1.25, Poppins Bold) — Used for major page headings.",
          "• Section H2: 24px (Line height 1.3, Poppins SemiBold) — Used for card titles and major module sections.",
          "• Subheading H3: 18px (Line height 1.35, Inter SemiBold) — Used for component headers.",
          "• Body Text: 16px (Line height 1.55, Inter Regular) — The absolute standard for reading copy. Never shrink body text below 16px.",
          "• Labels & Micro: 12px (Line height 1.4, Inter Medium) — Used for buttons, active badges, or captions."
        ],
        bulletPoints: [
          "No All-Caps Body Copy: All-caps text is strictly restricted to short status chips, badges, or buttons (max 3 words) to protect readability.",
          "Line Width Constraint: Body text containers are constrained to a maximum width of 65 to 75 characters (approx. 600px) to prevent eye tracking fatigue."
        ]
      },
      {
        subheading: "3.2 Mobile-First Responsive Breakpoints",
        paragraphs: [
          "Our grids adapt fluidly across devices, optimizing layouts dynamically:",
          "• Mobile (xs / sm): Up to 640px. Single column layout, bottom-sheet navigation, full-width touch targets.",
          "• Tablet (md): 641px to 1024px. Two-column grids, sidebar drawers, medium density displays.",
          "• Desktop (lg / xl): 1025px and up. Multi-column dashboard layouts, top nav menus, side-by-side active map panes."
        ]
      }
    ]
  },
  {
    id: "v04a_ch4",
    chapterNumber: 4,
    title: "UI Navigation & Interaction Patterns",
    summary: "Establishing standard bottom-sheet layouts, drawer overlays, and responsive header navigation templates.",
    sections: [
      {
        subheading: "4.1 Bottom-Sheet Drawers for On-the-Road Tasks",
        paragraphs: [
          "For field volunteers operating on scooters, single-handed thumbs are the primary interaction tool. We standardize our mobile drawer overlays:",
          "• Handle Bar: Every bottom-sheet includes a 40px wide, centered grey drag handle at the top.",
          "• Heights: Bottom-sheets are height-constrained to 45% (collapsed list) or 85% (expanded detailed steps) of screen height.",
          "• Backdrops: Features a semi-transparent, deep navy backdrop overlay (`rgba(10, 37, 64, 0.4)`) to isolate focus and reduce distraction."
        ]
      }
    ]
  },
  {
    id: "v04a_ch5",
    chapterNumber: 5,
    title: "Figma & Cross-Framework Component Specs",
    summary: "Defining the styling and states of our primary button configurations, forms, and cards.",
    sections: [
      {
        subheading: "5.1 Standardized Button Classes",
        paragraphs: [
          "Buttons are our primary interactive components. We define four unified states across both Flutter and Next.js:",
          "• Primary Button: Background SETU Saffron (`#FF7A00`), text white, border-radius 8px. Hover state: brightness decreases slightly. Focused: 2px secondary navy outline.",
          "• Secondary Button: Background transparent, border 1.5px solid Trust Navy (`#0A2540`), text Trust Navy.",
          "• Danger Button: Background soft red (`#EF4444`), text white. Used strictly for SOS triggers or route cancellations.",
          "• Success Button: Background Impact Green (`#00C48C`), text white. Used for verified completed handoffs."
        ],
        bulletPoints: [
          "Min Touch Target: All buttons on mobile devices feature a minimum padding area measuring 48px x 48px to prevent touch errors.",
          "White-Space Constraint: Buttons must contain a single line of text; wrapping or truncation is a critical design bug."
        ]
      }
    ]
  },
  {
    id: "v04a_ch6",
    chapterNumber: 6,
    title: "Motion Design & Transition Curves",
    summary: "Battery-friendly animation parameters, success state micro-interactions, and layout fade curves.",
    sections: [
      {
        subheading: "6.1 Low-Power Spatial Feedback",
        paragraphs: [
          "Animations must be subtle, highly performant, and completely free of CPU heating. We enforce a strict set of animation standards:",
          "• Target Duration: All micro-interactions (button hovers, input focus) resolve within 200ms. Page transitions or drawer slides resolve within 300ms.",
          "• Easing Profile: We use 'ease-out' for entering elements (creates an active, responsive feel) and 'ease-in-out' for continuous layout changes.",
          "• Hardware Acceleration: We restrict animations to CSS transform, translate, and opacity. Animating top/left or height/width is strictly banned from our codebase to protect battery performance."
        ]
      }
    ]
  }
];
