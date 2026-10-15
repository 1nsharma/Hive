import { ContextLens, SimulatedContent } from '../types/blueprint';

export const SAMPLE_LENSES: ContextLens[] = [
  {
    id: "lens-india-gdp",
    name: "India GDP & Macroeconomics Lens",
    version: "1.4.2",
    author: "Indian Economic Policy Guild (@EconGuildIN)",
    authorType: "researcher",
    description: "Evaluates economic claims against official Ministry of Statistics (MoSPI), RBI, World Bank, and IMF real-time datasets with inflation-adjusted context.",
    category: "economics",
    triggers: {
      platforms: ["youtube", "x", "news", "reddit", "web"],
      keywords: ["GDP", "trillion dollar economy", "inflation", "fiscal deficit", "foreign reserves", "per capita income", "FDI", "Make in India"],
      contentTypes: ["video", "article", "tweet"],
      confidenceThreshold: 0.82
    },
    dataSources: [
      {
        name: "Ministry of Statistics & Programme Implementation (MoSPI)",
        type: "verified-db",
        provenanceUrl: "https://mospi.gov.in/data-release/gdp-q3-2025",
        trustScore: 0.98
      },
      {
        name: "Reserve Bank of India (RBI) Bulletin",
        type: "verified-db",
        provenanceUrl: "https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
        trustScore: 0.99
      },
      {
        name: "World Bank DataBank — India Profile",
        type: "verified-db",
        provenanceUrl: "https://databank.worldbank.org/country/IND",
        trustScore: 0.96
      }
    ],
    logicCode: `// Lens Runtime Trigger & Scoring Logic
export default function evaluate(contentContext) {
  const text = contentContext.extractedText;
  const mentionsGDP = /([0-9]+(\\.[0-9]+)?\\s*(trillion|lakh crore|billion|%))/i.test(text);
  
  if (!mentionsGDP) return { match: false };
  
  return {
    match: true,
    confidence: 0.94,
    pill: "India GDP Verified Context",
    verdict: "context-needed",
    metrics: [
      { label: "Nominal GDP (2025-26 Est.)", value: "$4.18 Trillion", diff: "+7.2% YoY" },
      { label: "Real GDP Growth (RBI)", value: "6.8%", diff: "Inflation Adj." },
      { label: "Per Capita Income (Nominal)", value: "$2,850", diff: "World Bank" }
    ]
  };
}`,
    permissions: ["read:viewport_text", "net:verified_sources_only"],
    uiOutput: {
      pillLabel: "🇮🇳 MoSPI / World Bank Context",
      pillColor: "emerald",
      cardTitle: "Macroeconomic Reality Check & Projections",
      insights: [
        "Current Official Real GDP growth sits at 6.8% (RBI Bulletin, Q3 2025).",
        "Reaching the $10 Trillion milestone by 2035 requires sustained nominal compound growth of ~9.5% annually.",
        "Crucial context: Nominal GDP figures are often confused with Real (constant price) figures in popular discussions."
      ],
      counterMetrics: [
        { label: "Nominal GDP (FY26)", value: "$4.18T", diff: "+7.2%" },
        { label: "Real Growth Rate", value: "6.8%", diff: "RBI" },
        { label: "Forex Reserves", value: "$685B", diff: "All-time High" },
        { label: "Per Capita (Nominal)", value: "$2,850", diff: "WB" }
      ],
      verdict: "context-needed"
    },
    economicDistribution: {
      creatorShare: 72,
      infraReserveShare: 15,
      curatorShare: 8,
      auditFundShare: 5
    }
  },
  {
    id: "lens-science-claim",
    name: "Scientific Claims & Health Fact-Checker",
    version: "2.1.0",
    author: "Biomedical Evidence Collective",
    authorType: "community",
    description: "Detects sensational health breakthroughs, miracle cures, and dietary trends; correlates with PubMed and Cochrane systematic reviews.",
    category: "fact-check",
    triggers: {
      platforms: ["youtube", "x", "reddit", "web"],
      keywords: ["cure", "miracle", "reverse aging", "toxins", "cancer breakthrough", "superfood", "boost testosterone", "cleanse"],
      contentTypes: ["video", "tweet", "post"],
      confidenceThreshold: 0.88
    },
    dataSources: [
      {
        name: "Cochrane Library of Systematic Reviews",
        type: "academic-papers",
        provenanceUrl: "https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858",
        trustScore: 0.99
      },
      {
        name: "PubMed Central / NIH Peer-Reviewed Studies",
        type: "academic-papers",
        provenanceUrl: "https://pubmed.ncbi.nlm.nih.gov/3829104",
        trustScore: 0.97
      }
    ],
    logicCode: `// Scientific Claim Evaluator
export default function evaluate(contentContext) {
  const claim = contentContext.extractedClaims.find(c => c.category === 'health_intervention');
  if (!claim) return { match: false };
  
  return {
    match: true,
    confidence: 0.91,
    pill: "Evidence Check: Human Trials Required",
    verdict: "misleading",
    insights: ["Study cited was conducted in vitro on rodent models, not human clinical trials."]
  };
}`,
    permissions: ["read:viewport_text", "query:pubmed_cache"],
    uiOutput: {
      pillLabel: "🔬 PubMed / Cochrane Peer-Review",
      pillColor: "rose",
      cardTitle: "Clinical Trial Evidence Level: In Vitro / Preliminary",
      insights: [
        "The viral claim is based on an in-vitro cell culture study, not randomized double-blind human clinical trials.",
        "Cochrane systematic review (2024, n=4,200) found no statistically significant difference in longevity outcomes.",
        "Clinical warning: High dosage supplementation poses potential hepatic contraindications."
      ],
      counterMetrics: [
        { label: "Study Subject", value: "Murine (Mice)", diff: "Not Human" },
        { label: "Evidence Grade", value: "Class III", diff: "Preliminary" },
        { label: "Replication Status", value: "Unverified", diff: "Single Lab" }
      ],
      verdict: "misleading"
    },
    economicDistribution: {
      creatorShare: 75,
      infraReserveShare: 15,
      curatorShare: 5,
      auditFundShare: 5
    }
  },
  {
    id: "lens-hindi-context",
    name: "Hindi Context & Cultural Clarifier (हिंदी संदर्भ लेंस)",
    version: "1.2.0",
    author: "Shabd-Sangam Language Guild (@BhashaSetu)",
    authorType: "official",
    description: "Provides nuanced Hindi/English terminology translations, constitutional meanings, historical etymology, and colloquial nuances.",
    category: "cultural-linguistic",
    triggers: {
      platforms: ["youtube", "x", "news", "reddit"],
      keywords: ["samvidhan", "dharma", "rashtra", "swaraj", "sabka sath", "federalism", "secular", "sovereignty", "sanatan", "nyaya"],
      contentTypes: ["video", "article", "tweet"],
      confidenceThreshold: 0.80
    },
    dataSources: [
      {
        name: "Constitution of India (Bilingual Official Edition)",
        type: "verified-db",
        provenanceUrl: "https://legislative.gov.in/constitution-of-india",
        trustScore: 1.0
      },
      {
        name: "Sahitya Akademi Etymological Concordance",
        type: "academic-papers",
        provenanceUrl: "https://sahitya-akademi.gov.in/lexicon",
        trustScore: 0.95
      }
    ],
    logicCode: `// Hindi Cultural & Legal Terminology Context
export default function evaluate(contentContext) {
  return {
    match: true,
    confidence: 0.89,
    pill: "🇮🇳 शब्द और संविधान संदर्भ",
    verdict: "deep-dive"
  };
}`,
    permissions: ["read:viewport_text"],
    uiOutput: {
      pillLabel: "🇮🇳 शब्द और संविधान संदर्भ",
      pillColor: "amber",
      cardTitle: "संवैधानिक और भाषाई स्पष्टीकरण (Constitutional & Contextual Depth)",
      insights: [
        "संविधान के अनुच्छेद 1 में भारत को 'Union of States' (राज्यों का संघ) परिभाषित किया गया है।",
        "पारिभाषिक स्पष्टता: 'सॉवरेनिटी' (Sovereignty) का विधिक अनुवाद 'संप्रभुता' है, जिसका अर्थ है बिना किसी बाहरी दबाव के स्वतंत्र निर्णय लेने की सर्वोच्च शक्ति।",
        "ऐतिहासिक संदर्भ: 'स्वराज' शब्द का प्रथम आधुनिक सार्वजनिक प्रयोग 1906 के कलकत्ता अधिवेशन में दादाभाई नौरोजी द्वारा किया गया था।"
      ],
      counterMetrics: [
        { label: "मूल पाठ", value: "अनुच्छेद 1", diff: "भारत का संविधान" },
        { label: "भाषा स्रोत", value: "द्विभाषी राजपत्र", diff: "आधिकारिक" },
        { label: "ऐतिहासिक काल", value: "1946–1950", diff: "संविधान सभा" }
      ],
      verdict: "deep-dive"
    },
    economicDistribution: {
      creatorShare: 70,
      infraReserveShare: 15,
      curatorShare: 10,
      auditFundShare: 5
    }
  },
  {
    id: "lens-tech-bias",
    name: "Tech News & Silicon Valley Bias Checker",
    version: "3.0.1",
    author: "Open Standards Observatory",
    authorType: "researcher",
    description: "Identifies PR hype, benchmark cherry-picking, sponsored venture capital talking points, and vendor lock-in traps in tech announcements.",
    category: "tech-bias",
    triggers: {
      platforms: ["x", "news", "reddit", "youtube"],
      keywords: ["AGI achieved", "killer app", "100x faster", "disrupting everything", "revolutionary new model", "beats human in everything", "exclusive closed access"],
      contentTypes: ["article", "tweet", "video"],
      confidenceThreshold: 0.85
    },
    dataSources: [
      {
        name: "HuggingFace Open LLM Leaderboard (Independent)",
        type: "public-api",
        provenanceUrl: "https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard",
        trustScore: 0.97
      },
      {
        name: "Papers With Code Benchmark Audits",
        type: "academic-papers",
        provenanceUrl: "https://paperswithcode.com/sota",
        trustScore: 0.96
      }
    ],
    logicCode: `// Tech Claim & Benchmark Auditor
export default function evaluate(contentContext) {
  return {
    match: true,
    confidence: 0.92,
    pill: "Independent Benchmark Check",
    verdict: "context-needed"
  };
}`,
    permissions: ["read:viewport_text", "query:leaderboard_cache"],
    uiOutput: {
      pillLabel: "⚡ Independent Benchmark Audit",
      pillColor: "sky",
      cardTitle: "Vendor Benchmark vs Independent Evaluation",
      insights: [
        "Claimed '10x performance gain' is measured on a custom synthetic benchmark with non-standard quantization.",
        "On standardized GSM8K and MMLU-Pro tests, performance delta is +2.3% with 3.1x higher token cost.",
        "Lock-in risk: The SDK uses a non-exportable proprietary format incompatible with open ONNX/GGUF runtimes."
      ],
      counterMetrics: [
        { label: "Claimed Gain", value: "1000%", diff: "Cherry-picked" },
        { label: "Independent Delta", value: "+2.3%", diff: "MMLU-Pro" },
        { label: "Inference Cost", value: "3.1x Higher", diff: "Token Burn" }
      ],
      verdict: "context-needed"
    },
    economicDistribution: {
      creatorShare: 74,
      infraReserveShare: 15,
      curatorShare: 6,
      auditFundShare: 5
    }
  },
  {
    id: "lens-deep-learning",
    name: "Concepts & First-Principles Explainer",
    version: "1.8.0",
    author: "Foundational STEM Academy (@DeepPrinciples)",
    authorType: "official",
    description: "Breaks down complex technical, mathematical, and philosophical ideas into first principles, mental models, and interactive analogies.",
    category: "education",
    triggers: {
      platforms: ["youtube", "reddit", "web", "news"],
      keywords: ["quantum computing", "transformer architecture", "monetary policy", "thermodynamics", "epistemology", "game theory", "entropy"],
      contentTypes: ["video", "article", "post"],
      confidenceThreshold: 0.80
    },
    dataSources: [
      {
        name: "MIT OpenCourseWare & Stanford Engineering Archive",
        type: "academic-papers",
        provenanceUrl: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science",
        trustScore: 0.99
      },
      {
        name: "Feynman Lectures on Physics (Online Edition)",
        type: "verified-db",
        provenanceUrl: "https://www.feynmanlectures.caltech.edu/",
        trustScore: 1.0
      }
    ],
    logicCode: `// First Principles Explainer Logic
export default function evaluate(contentContext) {
  return {
    match: true,
    confidence: 0.95,
    pill: "💡 First-Principles Mental Model",
    verdict: "supported"
  };
}`,
    permissions: ["read:viewport_text"],
    uiOutput: {
      pillLabel: "💡 First-Principles Mental Model",
      pillColor: "indigo",
      cardTitle: "Mental Model Breakdown: Attention Mechanisms",
      insights: [
        "Core Intuition: Just as human reading zooms in on critical words while ignoring filler, self-attention computes dynamic relevance weights across all tokens in parallel.",
        "Key Equation: Attention(Q, K, V) = softmax(QK^T / √d_k)V — measuring how query vectors align with key vectors to scale value outputs.",
        "Common Misconception: Attention is not conscious awareness; it is dynamic dot-product matrix weighting."
      ],
      counterMetrics: [
        { label: "Complexity", value: "O(N²)", diff: "Standard Attention" },
        { label: "FlashAttention", value: "IO-Aware", diff: "Memory Bound" },
        { label: "First Paper", value: "Vaswani et al. (2017)", diff: "NeurIPS" }
      ],
      verdict: "supported"
    },
    economicDistribution: {
      creatorShare: 75,
      infraReserveShare: 15,
      curatorShare: 5,
      auditFundShare: 5
    }
  }
];

export const SIMULATED_CONTENTS: SimulatedContent[] = [
  {
    id: "content-yt-gdp",
    platform: "youtube",
    title: "How India Will Reach $10 Trillion GDP by 2030! Full Breakdown & Predictions 🚀",
    creator: "FinanceExplainedDaily (2.4M Subs)",
    date: "2 days ago",
    bodySnippet: "In this video we reveal why India is guaranteed to hit a 10 trillion dollar economy in just 5 years. With massive manufacturing growth, FDI booming, and per capita income exploding, no other country can compete...",
    url: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    matchingKeywords: ["GDP", "trillion dollar economy", "FDI", "per capita income"],
    applicableLenses: ["lens-india-gdp", "lens-hindi-context"]
  },
  {
    id: "content-x-health",
    platform: "x",
    title: "This single supplement reverses aging by 15 years and clears all cellular toxins permanently!",
    creator: "BiohackGuru_99 (Verified)",
    date: "4 hours ago",
    bodySnippet: "Big pharma doesn't want you to know about this cellular cleanse molecule. A new groundbreaking study proves it cleanses 100% of mitochondrial toxins and gives you infinite energy. Link in bio before it gets deleted!",
    url: "https://x.com/BiohackGuru_99/status/18923019283",
    matchingKeywords: ["reverse aging", "toxins", "cleanse", "cure"],
    applicableLenses: ["lens-science-claim"]
  },
  {
    id: "content-news-tech",
    platform: "news",
    title: "Venture-Backed Startup Claims AGI Breakthrough with New Closed Foundation Model",
    creator: "Global Tech Chronicle",
    date: "Yesterday",
    bodySnippet: "San Francisco-based stealth lab announces 'revolutionary new model' that is 100x faster than existing LLMs and beats humans in every benchmark. Exclusive API access is priced at $5,000/month with closed proprietary weights...",
    url: "https://techchronicle.org/news/2026/08/agi-breakthrough",
    matchingKeywords: ["AGI achieved", "100x faster", "revolutionary new model", "exclusive closed access"],
    applicableLenses: ["lens-tech-bias", "lens-deep-learning"]
  },
  {
    id: "content-reddit-samvidhan",
    platform: "reddit",
    title: "r/IndianHistory: What did Ambedkar and the drafting committee actually mean by 'Union of States'?",
    creator: "u/ConstitutionalScholar_IN",
    date: "3 days ago",
    bodySnippet: "There is constant debate online about federalism vs centralization. Let's look at the actual debates in the Constituent Assembly regarding 'Rashtra', 'Swaraj', and Article 1's drafting nuances...",
    url: "https://reddit.com/r/IndianHistory/comments/samvidhan_debates",
    matchingKeywords: ["samvidhan", "rashtra", "swaraj", "sovereignty", "federalism"],
    applicableLenses: ["lens-hindi-context", "lens-india-gdp"]
  }
];

export const DEATH_VALLEY_STAGES_DATA = [
  {
    stage: "A" as const,
    name: "Stage A — Survival Mode",
    tagline: "Tiny team, low revenue, essential core only",
    status: "Active Initial Build",
    runwayMonths: "18+ Months (Lean)",
    triggerConditions: [
      "Initial bootstrap or pre-revenue phase",
      "Core team < 8 engineers",
      "Total active citizens < 50,000"
    ],
    survivalPriority: [
      "1. Soul Constitution adherence (Non-negotiable)",
      "2. Context Injector core latency & accuracy",
      "3. Essential edge infrastructure",
      "4. Core developer documentation"
    ],
    allowedComponents: [
      "Soul Constitution Invariant Engine",
      "Context Injector Core (Web Workers)",
      "Server-side Gemini 2.5 RAG with aggressive caching",
      "Essential YouTube & Web Lens Runtime",
      "Local-First 3-World Memory prototype"
    ],
    frozenComponents: [
      "Complex DAO voting smart contracts",
      "Public token issuance / speculative mechanics",
      "Secondary service marketplace",
      "AR/VR Spatial Intelligence adapters",
      "Heavy ad-hoc marketing campaigns"
    ],
    killSwitchPolicy: "If cloud compute spend exceeds $300/day without matching growth, auto-throttle vector indexing to batch mode."
  },
  {
    stage: "B" as const,
    name: "Stage B — Pressure Mode",
    tagline: "Users spiking, compute costs rising, revenue uncertain",
    status: "Standby Readiness",
    runwayMonths: "12–18 Months",
    triggerConditions: [
      "Monthly active users surge > 500,000",
      "AI inference costs exceed 20% of monthly burn",
      "Creator payout volume requires high liquidity"
    ],
    survivalPriority: [
      "1. Unit economics per context injection",
      "2. 80%+ Semantic Cache hit rate",
      "3. Retention over vanity acquisition",
      "4. Selective feature freeze on experimental branches"
    ],
    allowedComponents: [
      "Semantic Edge Redis Cache Cluster",
      "Quantized local fallback summarizers",
      "Citizen Pro self-service subscription funnel",
      "Creator revenue split settlement automation"
    ],
    frozenComponents: [
      "Experimental multi-agent autonomous crawlers",
      "Non-revenue research fellowship grants",
      "Third-party desktop ecosystem expansions"
    ],
    killSwitchPolicy: "Auto-enable 2-tier caching: viral videos served 100% from edge CDN with 0 LLM API calls."
  },
  {
    stage: "C" as const,
    name: "Stage C — Crisis Mode",
    tagline: "Runway drops below 6 months, economic shock",
    status: "Emergency Contingency",
    runwayMonths: "< 6 Months",
    triggerConditions: [
      "Macroeconomic crisis or payment rail disruption",
      "Operating runway reaches critical < 6-month threshold",
      "Burn rate exceeds sustainable inflows"
    ],
    survivalPriority: [
      "1. Soul (Preserve ethics & trust)",
      "2. Users (Preserve data sovereignty & export)",
      "3. Core Product (Keep essential injector alive)",
      "4. Data (Immutable backups secured)",
      "5. Security (Zero compromise on auth/sandboxing)",
      "6. Cash (Cut all non-critical vendor spend)",
      "7. Team (Core engineering retention)"
    ],
    allowedComponents: [
      "Read-only Context Cache static mirrors",
      "One-click data export API",
      "Decentralized peer-to-peer lens distribution",
      "Minimal maintenance infra"
    ],
    frozenComponents: [
      "All new hiring and discretionary spend",
      "Paid cloud GPU clusters",
      "All non-essential background daemons"
    ],
    killSwitchPolicy: "Switch all AI calls to static verified database lookups; zero variable cloud compute invoices."
  },
  {
    stage: "D" as const,
    name: "Stage D — Recovery & Expansion",
    tagline: "Unit economics positive, cash flow green, selective scaling",
    status: "Growth Horizon",
    runwayMonths: "24+ Months (Sustainable)",
    triggerConditions: [
      "Consecutive 3 months of positive net cash flow",
      "Citizen Pro subscriptions cover 100% of infra & team",
      "Creator economy pool self-funds community grants"
    ],
    survivalPriority: [
      "1. Expansion into mobile accessibility services",
      "2. Creator Guild decentralized grant distribution",
      "3. Open standards research publications",
      "4. Multi-language linguistic lens development"
    ],
    allowedComponents: [
      "Full 12-Volume civilization roadmap",
      "Open Lens Marketplace with global payouts",
      "Research network benchmarking grants",
      "Federated sovereign node hosting"
    ],
    frozenComponents: ["None. Unfreezes in strict dependency chain."],
    killSwitchPolicy: "Expansion pacing capped at 15% monthly headcount increase to preserve cultural coherence."
  }
];
