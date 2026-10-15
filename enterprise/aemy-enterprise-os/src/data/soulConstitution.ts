import { ConstitutionalArticle, RefusalPrinciple } from '../types/blueprint';

export const MASTER_AXIOM = {
  visionStatement: "एक ऐसा digital ecosystem बनाना जहाँ लोग सिर्फ consume न करें, बल्कि learn, create, collaborate, earn, build, govern और अपनी identity develop कर सकें।",
  visionEn: "To build a digital civilization where humans are sovereign citizens rather than data commodities—empowered to learn, create, collaborate, earn, build, govern, and cultivate enduring identity.",
  externalPromise: "“We help people get more value from their attention.”",
  externalPromiseHi: "“हम लोगों के ध्यान (Attention) को वास्तविक मूल्य में बदलने में मदद करते हैं।”",
  internalThesis: "Attention → Intelligence → Utility → Trust → Network → Creation → Economy → Identity → Governance → Infrastructure → Culture → Ecosystem",
  aiPhilosophy: "AI is an assistant → not authority. (AI सहायक है → अंतिम प्राधिकारी नहीं।)",
  chainOfValue: [
    { step: "01. Attention", desc: "User conscious focus is respected as sacred human energy, never hijacked or artificially prolonged." },
    { step: "02. Intelligence", desc: "Real-time context engines analyze content patterns, factual claims, and relevant background knowledge." },
    { step: "03. Utility", desc: "Actionable understanding is instantly delivered at the exact moment of contemplation." },
    { step: "04. Trust", desc: "Uncompromising transparency ('View Source', 'View Logic') builds verifiable credibility." },
    { step: "05. Network", desc: "Trust enables decentralized peer connections between citizens, creators, and researchers." },
    { step: "06. Creation", desc: "Citizens transition into builders, crafting modular context lenses and specialized knowledge agents." },
    { step: "07. Economy", desc: "Direct value circulation returns sustainable revenue to creators and developers without vanity exploitation." },
    { step: "08. Identity", desc: "Sovereign, portable, user-owned reputation and contribution ledger emerges across platforms." },
    { step: "09. Governance", desc: "Polycentric community councils and institutional checks preserve platform integrity beyond any founder." },
    { step: "10. Infrastructure", desc: "Resilient public-good computing protocols and sandboxed runtime environments sustain scale." },
    { step: "11. Culture", desc: "An organic ethos of curiosity, empirical truth-seeking, craftsmanship, and mutual dignity flourishes." },
    { step: "12. Ecosystem", desc: "A self-sustaining digital civilization operating on immutable constitutional invariants." }
  ]
};

export const WHAT_WE_REFUSE: RefusalPrinciple[] = [
  {
    id: "REFUSE_01",
    title: "Surveillance-First Ecosystems",
    banReason: "Tracking citizens across the web to build predictive behavioral profiles treats human beings as livestock.",
    industryPractice: "Continuous cross-site fingerprinting, opaque cookies, shadow profiling, and ad broker data auctions.",
    apniDuniyaAlternative: "Zero-Knowledge context evaluation, edge processing, client-side encryption, and strict 3-tier memory separation.",
    architecturalGuardrail: "Strict sandboxing: Network isolation in Lens Runtime; Context engines receive only ephemeral viewport signals."
  },
  {
    id: "REFUSE_02",
    title: "Dark Patterns & Deceptive UX",
    banReason: "Manipulative user flows, disguised ads, fake urgency, and labyrinthine cancel buttons violate human dignity.",
    industryPractice: "Hidden opt-outs, roach-motel subscriptions, infinite scroll doom-loops, and disguised context placement.",
    apniDuniyaAlternative: "Clean, single-step cancellation, explicit consent banners, discrete reading pauses, and non-intrusive context pills.",
    architecturalGuardrail: "Automated UX Linter in CI/CD pipeline fails any build containing infinite loops or hidden interactive triggers."
  },
  {
    id: "REFUSE_03",
    title: "Artificial Addiction Loops",
    banReason: "Variable intermittent rewards (gamified dopamine spikes) degrade cognitive sovereignty and mental health.",
    industryPractice: "Autoplay next, red unread badges designed to trigger anxiety, algorithmic rage bait amplification.",
    apniDuniyaAlternative: "User-configured focus quotas, deliberate pause points, intentional engagement summaries, and calm typography.",
    architecturalGuardrail: "No push notification may be dispatched based solely on dwell-time drop; algorithmic feeds forbid rage-weighted ranking."
  },
  {
    id: "REFUSE_04",
    title: "Forced Platform Lock-In",
    banReason: "Walled gardens prevent freedom of exit, trapping user work, social graphs, and identity behind proprietary walls.",
    industryPractice: "Proprietary database silos, loss of data upon account deletion, non-exportable reputation and social links.",
    apniDuniyaAlternative: "One-click 100% JSON/SQLite data export, open Lens specifications, and portable DID/W3C verifiable credentials.",
    architecturalGuardrail: "Mandatory Export API (`/api/v1/identity/export`) must be maintained and verified on every release candidate."
  },
  {
    id: "REFUSE_05",
    title: "Opaque Algorithmic Manipulation",
    banReason: "Secret black-box algorithms determine what citizens perceive as reality, enabling unseen bias and political sway.",
    industryPractice: "Secret black-box recommendation models tuned solely for watch time and ad engagement.",
    apniDuniyaAlternative: "Public 'View Logic' and 'View Reason' transparency engines explaining why every context pill or lens was selected.",
    architecturalGuardrail: "Context Injector throws runtime exception if explanation object is missing or unverified by source hash."
  },
  {
    id: "REFUSE_06",
    title: "Fake Scarcity & Exploitative Gating",
    banReason: "Inventing artificial digital shortages to exploit fear of missing out (FOMO) distorts genuine utility and trust.",
    industryPractice: "Countdown timers for baseline knowledge, deceptive tiering, and fabricated stock counters.",
    apniDuniyaAlternative: "Transparent utility pricing, perpetual access to earned knowledge, and open canonical specifications.",
    architecturalGuardrail: "Pricing schemas are cryptographically signed with immutable fee schedules published on the public ledger."
  },
  {
    id: "REFUSE_07",
    title: "User Data Exploitation",
    banReason: "Selling private thoughts, search trails, or context queries to third-party ad networks is a breach of sacred trust.",
    industryPractice: "Targeted programmatic ad exchanges, telemetry reselling, cross-device graph sharing.",
    apniDuniyaAlternative: "Private World isolation: Personal data never enters public or community worlds without explicit multi-signature consent.",
    architecturalGuardrail: "Hard boundary between Private Memory, Public Knowledge Graph, and Community Lenses enforced at database layer."
  },
  {
    id: "REFUSE_08",
    title: "Creator Exploitation & Middleman Rent-Seeking",
    banReason: "Platforms keeping 50-70% margins while treating creators as disposable algorithmic fuel cripples genuine culture.",
    industryPractice: "Unilateral algorithm shadowbanning, opaque payout cuts, delayed royalty distribution.",
    apniDuniyaAlternative: "Transparent 4-Way Value Circulation: 70%+ of lens utility revenue directly routed to creators and developers.",
    architecturalGuardrail: "Smart settlement contracts calculate and display creator shares in real-time before any platform fee deduction."
  },
  {
    id: "REFUSE_09",
    title: "AI Pretending to Know What It Doesn't Know",
    banReason: "AI hallucinating falsehoods with unwarranted confidence destroys epistemic hygiene and misleads human judgment.",
    industryPractice: "Unattributed conversational hallucinations, hidden uncertainty levels, ungrounded synthetic assertions.",
    apniDuniyaAlternative: "AI is an Assistant, not Authority; mandatory confidence scoring, source citation backlinks, and explicit uncertainty badges.",
    architecturalGuardrail: "Synthesizer output rejected if grounding score is below 0.85 or citation provenance URL fails verification."
  }
];

export const CONSTITUTIONAL_ARTICLES: ConstitutionalArticle[] = [
  {
    id: "ART_01",
    number: "ARTICLE I",
    title: "Preamble & Sovereign Human Agency",
    category: "core-axiom",
    clauses: [
      {
        clauseNumber: "1.1",
        text: "Human attention is an irreplaceable sovereign resource. The platform shall never employ coercive, dark, or deceptive architectures to artificially capture or prolong user presence.",
        architecturalInvariant: "INVARIANT_ZERO_COERCION",
        codeVerificationHook: "assert(session.dwellTimeMechanism !== 'infinite_trap' && !session.hasHiddenOptOut);",
        enforcementMechanism: "Core UI Engine rejects components lacking explicit user exit boundaries or containing disguised interactive prompts."
      },
      {
        clauseNumber: "1.2",
        text: "Every citizen possesses the inalienable right to understand, challenge, and modify any algorithmic assumption made about their cognitive preferences or intent.",
        architecturalInvariant: "INVARIANT_EXPLAINABILITY_MANDATE",
        codeVerificationHook: "assert(intelligenceContext.transparencyObject.hasProvenance && intelligenceContext.isUserAuditable);",
        enforcementMechanism: "The 'View Reason' inspector is a mandatory UI primitive bound directly to every context injection payload."
      }
    ]
  },
  {
    id: "ART_02",
    number: "ARTICLE II",
    title: "The AI Relationship — Assistant, Not Authority",
    category: "ai-relationship",
    clauses: [
      {
        clauseNumber: "2.1",
        text: "Artificial Intelligence operates strictly as an auxiliary assistant to human cognition. Under no circumstance shall an AI model be granted sovereign authority over legal, ethical, or user data decisions.",
        architecturalInvariant: "INVARIANT_ASSISTANT_NOT_AUTHORITY",
        codeVerificationHook: "assert(aiAction.requiresHumanConfirmation === true || aiAction.isNonDestructiveRead);",
        enforcementMechanism: "High-impact actions (deletion, fund allocation, identity alteration) require explicit human cryptographic sign-off."
      },
      {
        clauseNumber: "2.2",
        text: "All AI-generated context must explicitly declare its underlying model, temperature, source grounding URLs, and measured uncertainty index.",
        architecturalInvariant: "INVARIANT_EPISTEMIC_HONESTY",
        codeVerificationHook: "assert(aiResponse.groundingConfidence >= 0.85 && aiResponse.sources.length > 0);",
        enforcementMechanism: "Hallucination defense filter strips responses lacking verified primary citations or flags them with 'High Uncertainty' badges."
      }
    ]
  },
  {
    id: "ART_03",
    number: "ARTICLE III",
    title: "Memory Architecture & The 3-World Separation Law",
    category: "privacy-memory",
    clauses: [
      {
        clauseNumber: "3.1",
        text: "The platform's memory shall be strictly segregated into three non-mingling domains: PRIVATE WORLD (User), PUBLIC WORLD (Sources), and COMMUNITY WORLD (Collective).",
        architecturalInvariant: "INVARIANT_THREE_WORLD_ISOLATION",
        codeVerificationHook: "assert(PrivateMemory.isDecoupledFrom(PublicKnowledgeGraph) && !PublicApi.hasAccess(PrivateMemory));",
        enforcementMechanism: "Cryptographic isolation: User private memory keys are retained solely on the client device or zero-knowledge vault."
      },
      {
        clauseNumber: "3.2",
        text: "Private user context shall never be harvested to train global models, indexed for public search, or monetized via external programmatic data brokers.",
        architecturalInvariant: "INVARIANT_ZERO_DATA_HARVESTING",
        codeVerificationHook: "assert(pipeline.optInTelemetryOnly && pipeline.zeroKnowledgeQueryEnabled);",
        enforcementMechanism: "Network gateway drops any outbound telemetry packet attempting to serialize raw private user session tokens."
      }
    ]
  },
  {
    id: "ART_04",
    number: "ARTICLE IV",
    title: "Economic Fairness & Value Circulation",
    category: "economic-fairness",
    clauses: [
      {
        clauseNumber: "4.1",
        text: "Value creation takes precedence over rent-seeking value extraction. Platform fees shall be capped, transparently visible, and audited by community consensus.",
        architecturalInvariant: "INVARIANT_VALUE_OVER_EXTRACTION",
        codeVerificationHook: "assert(transaction.creatorShare >= 0.70 && transaction.platformFee <= 0.15);",
        enforcementMechanism: "Revenue distribution smart contracts auto-split micro-payments with transparent on-ledger audit trails."
      },
      {
        clauseNumber: "4.2",
        text: "Vanity metrics (follower counts, algorithmic virality spikes) shall never be substituted for genuine economic utility or quality attribution.",
        architecturalInvariant: "INVARIANT_ANTI_VANITY_METRICS",
        codeVerificationHook: "assert(reputationEngine.scoreBasedOnUtility && !reputationEngine.usesRawFollowerCount);",
        enforcementMechanism: "Creator payouts derive from measured contextual utility, peer review ratings, and verified learning outcomes."
      }
    ]
  },
  {
    id: "ART_05",
    number: "ARTICLE V",
    title: "Governance & Decentralization Protocol",
    category: "governance-decentralization",
    clauses: [
      {
        clauseNumber: "5.1",
        text: "Platform stewardship shall evolve through a structured 3-phase decentralization path: Stage I (Guardian Stewardship), Stage II (Delegated Community Guilds), Stage III (Polycentric Sovereign Federation).",
        architecturalInvariant: "INVARIANT_PROGRESSIVE_DECENTRALIZATION",
        codeVerificationHook: "assert(governance.activePhase in ['Phase_1_Guardian', 'Phase_2_Guilds', 'Phase_3_Polycentric']);",
        enforcementMechanism: "Protocol transition gates require meeting verified user, developer, and resilience milestones before authority transfer."
      },
      {
        clauseNumber: "5.2",
        text: "The Principle of Epistemic Integrity: Popularity is not Truth. Democratic voting can govern policy and resource allocation, but cannot vote away empirical or scientific facts.",
        architecturalInvariant: "INVARIANT_POPULARITY_NOT_TRUTH",
        codeVerificationHook: "assert(factEngine.disputeResolutionProtocol.usesEmpiricalVerification && !factEngine.usesSimpleMajorityVote);",
        enforcementMechanism: "Dispute councils utilize domain-expert multi-stakeholder jury mechanics with mandatory evidentiary citations rather than popularity polls."
      },
      {
        clauseNumber: "5.3",
        text: "Constitutional Core Invariants (Articles I through V and the 9 Prohibitions) are mathematically and architecturally immutable; no platform majority or institutional decree may repeal them.",
        architecturalInvariant: "INVARIANT_CONSTITUTIONAL_SUPER_LOCK",
        codeVerificationHook: "assert(proposal.violatesProhibitions === false && proposal.preservesSoulAxiom === true);",
        enforcementMechanism: "Automated constitutional CI/CD check rejects any protocol upgrade or pull request that alters immutable core axioms."
      }
    ]
  }
];

export const GOVERNANCE_STAGES = [
  {
    phase: "Phase 1: Guardian Stewardship (Present / Early Foundation)",
    subtitle: "High speed, founder accountability, immutable soul anchoring",
    description: "During initial survival and build stages (Death Valley Stages A & B), decisions are driven by core stewards to guarantee lightning-fast execution while binding all code to the immutable Soul Constitution.",
    safeguards: [
      "All code open-source and verified against the 9 Prohibitions",
      "Public transparency log for all protocol decisions",
      "One-click data export and sovereign portability guarantees active from Day 1"
    ],
    councilStructure: "Founding Stewardship + Technical Audit Council",
    votingMechanism: "Stewardship consensus with mandatory constitutional invariant checks"
  },
  {
    phase: "Phase 2: Delegated Community Guilds (Expansion & Scale)",
    subtitle: "Specialized domain guilds for Lenses, Safety, Economics, and Dispute Resolution",
    description: "As network effects take hold, operational oversight transfers to elected functional guilds (Creator Guild, Developer Guild, Safety Council, Economic Reserve Committee).",
    safeguards: [
      "Term limits for all guild delegates with recall mechanisms",
      "Multi-sig treasury approvals for any reserve fund disbursement",
      "Domain-specific peer review standards for all Lens additions"
    ],
    councilStructure: "4 Elected Guilds (Lenses, Safety, Developer Tools, Economics) + 1 Citizens Assembly",
    votingMechanism: "Quadratic voting for resource grants + Expert jury for technical dispute arbitration"
  },
  {
    phase: "Phase 3: Polycentric Sovereign Federation (Mature Civilization)",
    subtitle: "Decentralized autonomous protocol, sovereign nodes, platform as public utility",
    description: "The platform matures into a neutral digital civilization infrastructure. Independent community nodes host their own lens runtimes and context registries while sharing a unified reputation and truth protocol.",
    safeguards: [
      "Mathematical super-majority (85%+) required for non-core protocol upgrades",
      "Core Soul Invariants locked permanently via immutable cryptographic proofs",
      "Full forkability: Any community can deploy an independent sovereign node with zero friction"
    ],
    councilStructure: "Global Federated Node Assembly + Open Standards Consortium",
    votingMechanism: "Polycentric consensus with zero-knowledge cryptographic ballot verification"
  }
];
