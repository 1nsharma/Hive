/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PitchDeckSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  bullets: string[];
  keyMetric: string;
  notes: string;
}

export interface SocialMediaPost {
  platform: 'LinkedIn' | 'Twitter';
  title: string;
  content: string;
  tags: string[];
}

export interface ConnectorCodeSnippet {
  id: string;
  name: string;
  fileName: string;
  code: string;
  testCode: string;
  oauthFlow: string;
  schemaMapping: string;
}

export const PITCH_DECK_SLIDES: PitchDeckSlide[] = [
  {
    slideNumber: 1,
    title: 'Aura — The Invisible Force Behind Your Growth',
    subtitle: 'Where Data Meets Autonomous Intelligence',
    bullets: [
      'The first zero-configuration autonomous data integration platform',
      'Turns heterogeneous SaaS data into an invisible, self-orchestrating nervous system',
      'Presented by Amit Sharma & Aura Founding Team'
    ],
    keyMetric: '0 Configuration Required',
    notes: 'Opening hook: Current integration tools like Zapier or MuleSoft require endless manual mapping and break constantly. Aura is an active intelligent partner.'
  },
  {
    slideNumber: 2,
    title: 'The Problem: The SaaS Integration Nightmare',
    subtitle: 'Businesses are drowning in disconnected data silos',
    bullets: [
      'Average company uses 40–110 SaaS applications that do not talk to each other',
      'Existing tools (Zapier, Make, MuleSoft) require technical knowledge and complex logic builder UIs',
      'When an API changes or fails, workflows break silently, causing millions in lost revenue',
      'RevOps and IT teams waste 35% of engineering capacity maintaining brittle integrations'
    ],
    keyMetric: '35% Dev Capacity Wasted',
    notes: 'Highlight pain points: brittle webhooks, 429 rate-limiting failures, schema drift, and manual spreadsheet exports.'
  },
  {
    slideNumber: 3,
    title: 'The Solution: Aura — An Active Partner, Not a Tool',
    subtitle: 'True Invisible Intelligence with Zero Configuration',
    bullets: [
      'Zero-Config Onboarding: State intent in plain English or Hindi ("Sync Salesforce leads with Google Sheets")',
      'Invisible Intelligence: Aura autonomously perceives schemas, predicts bottlenecks, and executes actions',
      'Self-Healing Architecture: Circuit breakers and Redis queues prevent data loss during third-party downtime',
      'Universal Context Memory: Retains organizational context across emails, voice calls, Slack, and CRM'
    ],
    keyMetric: '10x Faster Deployment (<60s)',
    notes: 'Emphasize: You do not configure Aura; Aura configures itself around your business goals.'
  },
  {
    slideNumber: 4,
    title: 'Product Demonstration & Core Capabilities',
    subtitle: 'The 4 Pillars of Autonomous Operation',
    bullets: [
      '1. Natural Language Onboarding: AI parses intent, completes OAuth 2.0 PKCE, maps canonical schemas',
      '2. Standardized Adapter Pattern: Single unified GraphQL/REST interface across 25+ top enterprise ecosystems',
      '3. AI Voice Dialer & Agent: Autonomous voice conversations with customers via Twilio + Deepgram + LLM',
      '4. Self-Healing Pipelines: Exponential backoff, Redis BullMQ buffering, zero dropped records'
    ],
    keyMetric: '99.99% Data Delivery Guarantee',
    notes: 'Show live demo screenshot of the conversational connector builder and self-healing telemetry.'
  },
  {
    slideNumber: 5,
    title: 'Market Opportunity: The $19.8B Integration TAM',
    subtitle: 'Riding the wave of generative AI and enterprise workflow automation',
    bullets: [
      'Total Addressable Market (TAM): Global Integration Platform as a Service (iPaaS) is $19.8B by 2027',
      'Serviceable Addressable Market (SAM): SMB & Mid-Market SaaS integrations — $5.4B',
      'Serviceable Obtainable Market (SOM): Modern AI-first cloud integration market — $420M',
      'Tailwinds: Proliferation of specialized AI agents needing real-time cross-platform context'
    ],
    keyMetric: '$19.8B Total TAM',
    notes: 'SaaS sprawl is accelerating, making autonomous integration a non-negotiable layer of the modern tech stack.'
  },
  {
    slideNumber: 6,
    title: 'Business Model & Unit Economics',
    subtitle: 'High-margin, negative-churn product-led growth',
    bullets: [
      'Freemium ($0): 3 connectors, 1,000 sync events/mo, instant viral adoption',
      'Professional ($49/mo): 15 connectors, 50k syncs, AI voice agent starter, email support',
      'Business ($299/mo): Unlimited connectors, 500k syncs, full AI voice dialer, priority 99.9% SLA',
      'Enterprise (Custom $1,200+/mo): Private VPC Connect Gateway, SOC2/HIPAA compliance, dedicated CSM'
    ],
    keyMetric: '84% Gross Margins',
    notes: 'Blended CAC of $38 with enterprise LTV of $18,000+ ensures exceptional capital efficiency.'
  },
  {
    slideNumber: 7,
    title: 'Competitive Advantage & Moat',
    subtitle: 'Why Aura Wins against Zapier, MuleSoft, and Make',
    bullets: [
      'No Node-and-Wire Spaghetti: Zero manual flowchart building. Aura configures itself via natural language',
      'Active Voice & Action Agents: Aura does not just move data; it calls clients and books meetings',
      'Self-Healing by Default: Unlike Zapier "Zap stopped" emails, Aura buffers and replays automatically',
      'Connect Gateway: Run integrations inside private customer VPCs with zero data exposure'
    ],
    keyMetric: '5x Higher Retention Moat',
    notes: 'Competitors are passive pipelines. Aura is an active intelligent partner that drives revenue outcomes.'
  },
  {
    slideNumber: 8,
    title: 'Go-to-Market Strategy: The Path to $1M ARR',
    subtitle: 'A disciplined 3-phase execution roadmap',
    bullets: [
      'Phase A (Days 1–30): Beta with 100–200 early adopters via Hacker News, Product Hunt, Dev.to',
      'Phase B (Days 31–90): Official Launch targeting 1,000 paying users ($80k MRR) with SEO & B2B ads',
      'Phase C (Months 4–12): Global scale via AWS & Google Cloud Marketplaces to reach 10,000 users and $1M ARR',
      'Flywheel: Free tier users invite team members, organically triggering Pro and Business upgrades'
    ],
    keyMetric: '$1M ARR in 12 Months',
    notes: 'Content engine: 12 SEO-optimized teardowns comparing Aura against legacy tools, driving high-intent inbound traffic.'
  },
  {
    slideNumber: 9,
    title: 'Financial Projections & Milestones',
    subtitle: 'Conservative forecast based on 4.5% conversion and 1.2% monthly churn',
    bullets: [
      'Month 3 (Beta Launch): $12,000 MRR | 250 active teams | 25 production connectors',
      'Month 6 (Commercial Scale): $55,000 MRR | 1,200 active teams | 12 Enterprise contracts',
      'Month 12 (Target ARR): $110,000 MRR ($1.32M ARR) | 3,800 active teams | Cash flow positive',
      'Operating Expenses: ~$8,500/mo in initial 6 months (lean cloud and API footprint)'
    ],
    keyMetric: '15%+ Month-over-Month MRR Growth',
    notes: 'Demonstrates clear line of sight to profitability with modest capital requirements.'
  },
  {
    slideNumber: 10,
    title: 'The Team & The Ask',
    subtitle: 'Building the foundational intelligence layer for enterprise work',
    bullets: [
      'Founding Team: Full-Stack Architect, AI/Backend Engineer, Product & GTM Strategist',
      'Track record: Experienced in distributed data systems, cloud architecture, and high-growth B2B SaaS',
      'The Ask: Seeking $500,000 Seed Investment for 18 months of runway',
      'Capital Allocation: 60% Core Engineering & Connectors, 25% GTM & Developer Relations, 15% Infra & Security'
    ],
    keyMetric: '$500k Seed for 18mo Runway',
    notes: 'Closing statement: Join us in making software integrations completely invisible. Thank you!'
  }
];

export const SOCIAL_MEDIA_POSTS: SocialMediaPost[] = [
  {
    platform: 'LinkedIn',
    title: 'The Death of Integration Drag: Why We Built Aura',
    content: `If you run RevOps, Engineering, or an agency, you know this horror:

A webhook silently fails at 2 AM. 
Salesforce doesn't update. 
A $50k deal sits in limbo. 
Your engineers spend 4 hours digging through Zapier logs and Postman collections.

Software integrations shouldn't feel like plumbing broken pipes. 

That's why we built Aura ("The Invisible Force Behind Your Growth").
Aura is an active intelligent partner that:
1. Understands intent: "Connect Salesforce with Google Sheets" — done in 10 seconds.
2. Self-heals: When an API fails, it buffers data in Redis and auto-recovers with 0% data drop.
3. Takes action: Outbound AI Voice Agent automatically dials leads and schedules demos into your CRM.

No manual flowchart builders. Zero API key friction.

We are opening 150 early access spots for our private Beta today.
Check the link in the comments to join! 👇

#SaaS #AI #RevOps #DataIntegration #Automation #Engineering #Aura`,
    tags: ['#SaaS', '#AI', '#RevOps', '#Automation', '#TechLeadership']
  },
  {
    platform: 'Twitter',
    title: 'Twitter/X Thread: The 4 Laws of Invisible Software',
    content: `1/7 Most automation tools are stuck in 2012:
- You spend 3 hours connecting nodes
- You paste sensitive API tokens into random web forms
- An API updates its schema and your entire pipeline crashes

Here is how we redesigned integration from scratch with @AuraHQ 🧵👇

2/7 Principle 1: Zero Configuration.
You shouldn't need a computer science degree to sync two apps. 
You type or say: "Sync Shopify orders over $500 into QuickBooks and notify #vip-sales in Slack."
Aura discovers endpoints, negotiates OAuth tokens, and activates the pipeline.

3/7 Principle 2: Self-Healing Architecture.
When Salesforce or Stripe hits a 429 rate limit or 503 outage, legacy tools throw an error email.
Aura trips a circuit breaker, queues in Redis, and exponential backoff replays automatically. 
Zero records lost. Ever.

4/7 Principle 3: Universal Context Memory.
Aura doesn't just pass strings. It understands business context across email, phone calls, and databases via a unified vector memory layer.

5/7 Principle 4: Active Agents > Passive Pipes.
Why stop at moving data? Aura's AI Voice Agent calls leads who sign up on your site, answers questions, and books demos straight into your Google Calendar.

6/7 We have built 25+ standardized connectors covering PostgreSQL, Salesforce, Slack, Sheets, Shopify, and more.

7/7 Beta is now live. Try it out and experience the invisible force behind your growth:
https://aura.build

RT if your Zapier flowchart has ever given you a headache! 🔁`,
    tags: ['#BuildInPublic', '#AI', '#SaaS', '#ProductHunt', '#DevCommunity']
  }
];

export const STATIC_LOGO_SVG = `<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background Glow & Gradient Definitions -->
  <defs>
    <radialGradient id="auraGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7C5CFF" stop-opacity="0.4"/>
      <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#07070D" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C5CFF"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <linearGradient id="innerCore" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#7C5CFF"/>
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Ambient background orb -->
  <circle cx="120" cy="120" r="100" fill="url(#auraGlow)" />

  <!-- Outer Luminous Aura Ring -->
  <circle cx="120" cy="120" r="72" stroke="url(#ringGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="320 80" filter="url(#softGlow)"/>

  <!-- Middle Concentric Flow Wave -->
  <ellipse cx="120" cy="120" rx="52" ry="46" stroke="#22D3EE" stroke-width="3" stroke-opacity="0.6" stroke-dasharray="16 12" transform="rotate(-25 120 120)"/>

  <!-- Central Intelligence Core -->
  <rect x="98" y="98" width="44" height="44" rx="14" fill="url(#innerCore)" filter="url(#softGlow)"/>
  
  <!-- Neural Spark Icon Inside Core -->
  <path d="M120 108 L123 117 L132 120 L123 123 L120 132 L117 123 L108 120 L117 117 Z" fill="#FFFFFF"/>
</svg>`;

export const DYNAMIC_LOGO_SVG = `<svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes spinRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulseCore {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.1); opacity: 1; filter: drop-shadow(0 0 16px #22D3EE); }
    }
    @keyframes counterWave {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    .rotating-ring {
      transform-origin: 120px 120px;
      animation: spinRing 8s linear infinite;
    }
    .pulsing-core {
      transform-origin: 120px 120px;
      animation: pulseCore 3s ease-in-out infinite;
    }
    .counter-orbit {
      transform-origin: 120px 120px;
      animation: counterWave 12s linear infinite;
    }
  </style>
  <defs>
    <radialGradient id="dynGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7C5CFF" stop-opacity="0.5"/>
      <stop offset="70%" stop-color="#3B82F6" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#07070D" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="dynRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C5CFF"/>
      <stop offset="40%" stop-color="#3B82F6"/>
      <stop offset="80%" stop-color="#22D3EE"/>
      <stop offset="100%" stop-color="#7C5CFF"/>
    </linearGradient>
  </defs>

  <circle cx="120" cy="120" r="110" fill="url(#dynGlow)"/>

  <!-- Rotating Outer Ring -->
  <g class="rotating-ring">
    <circle cx="120" cy="120" r="76" stroke="url(#dynRing)" stroke-width="7" stroke-dasharray="240 100" stroke-linecap="round"/>
    <circle cx="196" cy="120" r="6" fill="#22D3EE" filter="drop-shadow(0 0 8px #22D3EE)"/>
  </g>

  <!-- Counter-Rotating Middle Orbit -->
  <g class="counter-orbit">
    <ellipse cx="120" cy="120" rx="54" ry="46" stroke="#3B82F6" stroke-width="2.5" stroke-dasharray="20 14" stroke-opacity="0.7"/>
    <circle cx="120" cy="66" r="4" fill="#7C5CFF"/>
  </g>

  <!-- Pulsing Central Neural Core -->
  <g class="pulsing-core">
    <rect x="96" y="96" width="48" height="48" rx="16" fill="url(#dynRing)"/>
    <path d="M120 106 L124 116 L134 120 L124 124 L120 134 L116 124 L106 120 L116 116 Z" fill="#FFFFFF"/>
  </g>
</svg>`;
