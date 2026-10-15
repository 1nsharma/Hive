import {
  IntegrityAuditQuestion,
  ProposedTreasuryAllocation,
  FounderCompensationModel,
  LifecycleStage,
  AgentTopologyNode
} from '../types';

/**
 * Section 22: Constitutional Integrity & Proposed Treasury Model
 * Header: CURRENT PROPOSED ALLOCATION — NOT YET FINAL PROTOCOL PARAMETERS
 * Exact 25/20/15/15/10/15 sum = 100%
 */
export const PROPOSED_TREASURY_ALLOCATIONS: ProposedTreasuryAllocation[] = [
  {
    id: 'alloc-infra',
    category: 'Infrastructure',
    categoryHi: 'इन्फ्रास्ट्रक्चर (क्लाउड व सर्वर)',
    percentage: 25,
    description: 'Serverless compute, Docker sandbox runners, Vercel edge runtime, Supabase DB & DNS routing.',
    descriptionHi: 'सर्वरलेस कंप्यूट, डॉकर सैंडबॉक्स, Vercel एज रनटाइम, Supabase डेटाबेस और DNS रूटिंग।',
    status: 'PROPOSED',
    enforcement: 'Cloud IAM & Quota Limiters'
  },
  {
    id: 'alloc-ai-ops',
    category: 'AI Operations',
    categoryHi: 'AI ऑपरेशंस (API टोकन व टूल्स)',
    percentage: 20,
    description: 'Gemini 3.7 Flash API tokens, OCR vision pipelines, embeddings, and tool scraping quotas.',
    descriptionHi: 'Gemini 3.7 Flash API टोकन, OCR विज़न पाइपलाइन और टूल इनवोकेशन कोटा।',
    status: 'PROPOSED',
    enforcement: 'Server Middleware & API Token Prepay'
  },
  {
    id: 'alloc-security',
    category: 'Security & Audits',
    categoryHi: 'सुरक्षा व ऑडिट (AST गार्डरेल्स)',
    percentage: 15,
    description: 'Static AST analysis, cryptographic audit trail hashes, multi-sig signer fees, vulnerability probes.',
    descriptionHi: 'स्टैटिक AST विश्लेषण, क्रिप्टोग्राफिक ऑडिट ट्रेल हैश, मल्टी-सिग फीस और सुरक्षा जांच।',
    status: 'PROPOSED',
    enforcement: 'Read-only OS & AST Blockers'
  },
  {
    id: 'alloc-dev',
    category: 'Development',
    categoryHi: 'विकास व सुधार (डेवलपमेंट)',
    percentage: 15,
    description: 'Core agent topology upgrades, state graph refinement, prompt engineering benchmarking.',
    descriptionHi: 'कोर एजेंट टोपोलॉजी अपग्रेड, स्टेट ग्राफ सुधार, प्रॉम्प्ट इंजीनियरिंग बेंचमार्किंग।',
    status: 'PROPOSED',
    enforcement: 'Git PR Reviews & Automated CI/CD'
  },
  {
    id: 'alloc-ecosystem',
    category: 'Ecosystem & Growth',
    categoryHi: 'पारिस्थितिकी तंत्र व विकास (इकोसिस्टम)',
    percentage: 10,
    description: 'Hyper-local user acquisition ads (bounded <=₹1k/campaign), community templates, developer bounties.',
    descriptionHi: 'हाइपर-लोकल यूजर अधिग्रहण विज्ञापन (अधिकतम ₹1,000/कैंपेन), कम्युनिटी टेम्प्लेट, बाउंटी।',
    status: 'PROPOSED',
    enforcement: '7-Day Kill Switch Gate'
  },
  {
    id: 'alloc-protocol',
    category: 'Protocol Treasury',
    categoryHi: 'प्रोटोकॉल ट्रेजरी (दीर्घकालिक रिज़र्व)',
    percentage: 15,
    description: 'Autonomous protocol emergency reserve, buffer for unexpected API demand spikes or macro shocks.',
    descriptionHi: 'स्वायत्त प्रोटोकॉल आपातकालीन रिज़र्व, अप्रत्याशित स्पाइक्स या असफल प्रयोगों के लिए बफर।',
    status: 'PROPOSED',
    enforcement: 'Smart Contract / Multi-Sig Vault'
  }
];

export const FOUNDER_COMPENSATION_MODEL: FounderCompensationModel = {
  role: 'Human Founder / Genesis Architect',
  allocationPercent: 80, // Day 1 locked reserve in corporate bank
  vestingCliffMonths: 6,
  vestingDurationMonths: 24,
  governanceCap: 'Founder cannot execute > ₹20k expense without logging SHA-256 reason; AI cannot touch founder 80% without multi-sig.',
  hiddenFeeClause: 'Zero hidden fees. All payouts, server costs, and token charges are published to public ledger.',
  status: 'HUMAN_VERIFIED'
};

/**
 * Section 23: Narrative & Conceptual Coherence
 * GENESIS -> GROWTH -> AUTONOMY -> ECONOMY -> CIVILIZATION
 */
export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    id: 'genesis',
    name: '1. Genesis (बीज चरण)',
    nameHi: '1. जेनेसिस (बीज चरण)',
    description: 'Human founder injects ₹1,00,000 seed capital, locks 80% reserve, and encodes immutable Constitution rules.',
    descriptionHi: 'मानव संस्थापक ₹1,00,000 की बीज पूंजी लगाता है, 80% रिज़र्व लॉक करता है और संविधान नियम कोड करता है।',
    status: 'IMPLEMENTED',
    timeframe: 'Day 1 - 21'
  },
  {
    id: 'growth',
    name: '2. Growth (अंकुरण चरण)',
    nameHi: '2. विकास (अंकुरण चरण)',
    description: '5-agent LangGraph topology runs in sandbox, finds high-friction Indian SME problems, builds first 3 MVPs.',
    descriptionHi: '5-एजेंट टोपोलॉजी सैंडबॉक्स में चलती है, MSME समस्याएं खोजती है और पहले 3 MVP बनाती है।',
    status: 'PROTOTYPE',
    timeframe: 'Day 22 - 42'
  },
  {
    id: 'autonomy',
    name: '3. Autonomy (स्वायत्तता चरण)',
    nameHi: '3. स्वायत्तता (प्रायोगिक चरण)',
    description: 'Micro-SaaS experiments launch on subdomains. Grim Reaper triggers 7-day kill switches or scales winning tools.',
    descriptionHi: 'माइक्रो-SaaS प्रयोग लॉन्च होते हैं। 7-दिन का किल स्विच असफल टूल्स बंद करता है व सफल टूल्स को स्केल करता है।',
    status: 'SIMULATED',
    timeframe: 'Day 43 - 70'
  },
  {
    id: 'economy',
    name: '4. Economy (स्वायत्त अर्थव्यवस्था)',
    nameHi: '4. अर्थव्यवस्था (राजस्व चक्र)',
    description: 'Customer subscription revenue cycles directly back into the AI Ops wallet, reaching self-funding cashflow.',
    descriptionHi: 'सब्सक्रिप्शन राजस्व सीधे AI ऑप्स वॉलेट में रीसायकल होता है, जिससे सिस्टम आत्मनिर्भर बनता है।',
    status: 'PROPOSED',
    timeframe: 'Day 71 - 90'
  },
  {
    id: 'civilization',
    name: '5. Civilization (विकेंद्रीकृत संस्था)',
    nameHi: '5. सभ्यता (पूर्ण विकेंद्रीकरण)',
    description: 'Transition from single founder LLP to community-governed multi-agent DAO with formal on-chain parameters.',
    descriptionHi: 'एकल संस्थापक LLP से समुदाय-संचालित मल्टी-एजेंट DAO में परिवर्तन जब सिस्टम बड़े पैमाने पर पहुंचे।',
    status: 'CONCEPT',
    timeframe: 'Year 2+'
  }
];

export const AGENT_TOPOLOGY_NODES: AgentTopologyNode[] = [
  {
    agentId: 'agent-a-scout',
    name: 'Agent A: Opportunity Scout (बीज अन्वेषक)',
    role: 'Scrapes Reddit, Twitter, and G2 for boring, painful Indian SME workflows.',
    roleHi: 'Reddit, Twitter व G2 से भारतीय व्यापारियों की अनसुलझी शिकायतें खोजता है।',
    governanceBounds: 'Read-only web scraping; zero write access to file system or databases.',
    humanOverrideRequired: false,
    status: 'IMPLEMENTED'
  },
  {
    agentId: 'agent-b-analyst',
    name: 'Agent B: Feasibility Analyst (विश्लेषक)',
    role: 'Calculates TAM, unit economics, ₹ server cost, breakeven users, and 7-day kill metric.',
    roleHi: 'बाजार का आकार, सर्वर लागत, ब्रेक-ईवन यूजर्स और 7-दिवसीय किल मीट्रिक तय करता है।',
    governanceBounds: 'Pure mathematical and analytical evaluation; no external API dispatch.',
    humanOverrideRequired: false,
    status: 'IMPLEMENTED'
  },
  {
    agentId: 'agent-c-builder',
    name: 'Agent C: MVP Builder (सॉफ्टवेयर निर्माता)',
    role: 'Synthesizes Next.js/Tailwind/Supabase MVP code and generates Docker sandbox runner.',
    roleHi: 'Next.js/Tailwind/Supabase MVP कोड जनरेट करता है और डॉकर सैंडबॉक्स तैयार करता है।',
    governanceBounds: 'Sandboxed file generation only; blocked from touching protected constitution files.',
    humanOverrideRequired: false,
    status: 'IMPLEMENTED'
  },
  {
    agentId: 'agent-d-critic',
    name: 'Agent D: Constitutional Critic (संविधान संरक्षक)',
    role: 'Audits generated code for AST security, spending cap violations, and naked secrets.',
    roleHi: 'जनरेटेड कोड की AST सुरक्षा, व्यय सीमा और सीक्रेट लीकेज के खिलाफ जांच करता है।',
    governanceBounds: 'Hard validator gate. If Critic rejects, deployment pipeline halts immediately.',
    humanOverrideRequired: false,
    status: 'IMPLEMENTED'
  },
  {
    agentId: 'agent-e-reaper',
    name: 'Agent E: Operations & Grim Reaper (ऑपरेशंस व किल स्विच)',
    role: 'Deploys passing MVPs to subdomains; terminates experiment after 7 days if ₹0 revenue.',
    roleHi: 'पास हुए MVP डिप्लॉय करता है और 7 दिन में ₹0 रेवेन्यू होने पर तुरंत आर्काइव करता है।',
    governanceBounds: 'Max ad spend capped at ₹1,000; cannot exceed ₹5,000 without human multi-sig.',
    humanOverrideRequired: true,
    status: 'SIMULATED'
  }
];

/**
 * FINAL INTEGRITY TEST (10 Questions Audit)
 */
export const INTEGRITY_AUDIT_QUESTIONS: IntegrityAuditQuestion[] = [
  {
    id: 1,
    question: '1. What is real and working right now?',
    questionHi: '1. अभी वास्तव में क्या काम कर रहा है?',
    category: 'REALITY',
    answer: 'The Node.js Express server, Gemini 3.7 Flash API pipeline with auto-fallback, live AST Constitution validator middleware, local state synchronization engine, responsive High Density UI, and simulated unit economics calculations.',
    answerHi: 'Node.js Express सर्वर, Gemini 3.7 Flash API पाइपलाइन, लाइव AST संविधान मिडलवेयर, लोकल स्टेट स्टोरेज और रीयल-टाइम UI।',
    status: 'IMPLEMENTED',
    currentEnforcement: 'Live in running container',
    futureTarget: 'Continuous production runtime'
  },
  {
    id: 2,
    question: '2. What is simulated?',
    questionHi: '2. क्या सिमुलेशन (काल्पनिक परीक्षण) है?',
    category: 'SIMULATION',
    answer: 'Live Stripe webhook transaction ingestion, Indian bank corporate card automated charging, live Vercel dynamic DNS sub-domain creation, and live Twitter/Reddit web scraper bots (using authenticated client proxies).',
    answerHi: 'लाइव स्ट्राइप वेबहुक पेमेंट इवेंट्स, बैंक कॉर्पोरेट कार्ड ऑटो-चार्जिंग और लाइव DNS सब-डोमेन ऑटोमेशन।',
    status: 'SIMULATED',
    currentEnforcement: 'High-fidelity deterministic simulation',
    futureTarget: 'Live API integrations via credentials'
  },
  {
    id: 3,
    question: '3. What is proposed and not yet active?',
    questionHi: '3. क्या केवल प्रस्तावित है और अभी सक्रिय नहीं है?',
    category: 'GOVERNANCE',
    answer: 'The 25/20/15/15/10/15 Protocol Treasury distribution model is PROPOSED for future decentralized operations. On Day 1, funds operate under a simplified 80% Human Reserve / 20% AI Ops model.',
    answerHi: '25/20/15/15/10/15 प्रोटोकॉल ट्रेजरी मॉडल भविष्य के लिए प्रस्तावित है। Day 1 पर 80% रिज़र्व / 20% AI ऑप्स का सीधा मॉडल है।',
    status: 'PROPOSED',
    currentEnforcement: 'Documented architectural model',
    futureTarget: 'Smart contract multi-sig protocol'
  },
  {
    id: 4,
    question: '4. What is actually enforced by code?',
    questionHi: '4. कोड द्वारा वास्तव में क्या बाध्यकारी रूप से लागू है?',
    category: 'BOUNDS',
    answer: 'Hardcoded Express middleware enforces the ₹5,000 spend cap, rejects unauthorized tool calls, blocks self-modification attempts via AST checking, and prevents spending above current AI Ops wallet balance.',
    answerHi: 'एक्सप्रेस मिडलवेयर ₹5,000 खर्च सीमा, अनधिकृत टूल्स और AST आत्म-संशोधन को ब्लॉक करता है।',
    status: 'TESTED',
    currentEnforcement: 'Server-side Express middleware',
    futureTarget: 'Hardware Security Module (HSM)'
  },
  {
    id: 5,
    question: '5. What requires human approval?',
    questionHi: '5. किस कार्य के लिए मानव अनुमोदन आवश्यक है?',
    category: 'GOVERNANCE',
    answer: 'Any single transaction or compute allocation exceeding ₹5,000, adding new tools to the allowlist, modifying constitution source code, releasing funds from the 80% locked reserve, or deleting database backups.',
    answerHi: '₹5,000 से अधिक का कोई भी खर्च, नए टूल्स की अनुमति, संविधान में बदलाव और 80% रिज़र्व से फंड निकालना।',
    status: 'HUMAN_VERIFIED',
    currentEnforcement: '2-of-3 Multi-sig modal in UI & backend check',
    futureTarget: 'Cryptographic hardware key sign-off'
  },
  {
    id: 6,
    question: '6. What can the AI autonomously control?',
    questionHi: '6. AI अपने दम पर क्या नियंत्रित कर सकता है?',
    category: 'BOUNDS',
    answer: 'Scouting complaints, scoring TAM & feasibility, synthesizing MVP TypeScript code, running test builds in Docker sandbox, triggering 7-day kill switch for dead prototypes, and spending within the ₹20,000 Ops wallet (max ₹5,000 per tx).',
    answerHi: 'शिकायतें खोजना, TAM गणना, MVP कोड जनरेट करना, सैंडबॉक्स टेस्ट रन करना और ₹20,000 ऑप्स बजट के भीतर खर्च करना।',
    status: 'IMPLEMENTED',
    currentEnforcement: 'Bounded AI Agent loop',
    futureTarget: 'Continuous automated background cron'
  },
  {
    id: 7,
    question: '7. What can the AI NEVER control?',
    questionHi: '7. AI कभी भी क्या नियंत्रित नहीं कर सकता?',
    category: 'BOUNDS',
    answer: 'The AI can NEVER touch the 80% locked founder bank reserve, can NEVER alter its own spending cap, can NEVER remove the human multi-sig gate, and can NEVER modify founder equity or siphon funds secretly.',
    answerHi: 'AI कभी भी 80% संस्थापक रिज़र्व नहीं छू सकता, अपनी खर्च सीमा नहीं बढ़ा सकता और गुप्त फीस नहीं काट सकता।',
    status: 'TESTED',
    currentEnforcement: 'Read-only OS paths & cryptographic gates',
    futureTarget: 'Zero-knowledge proofs on chain'
  },
  {
    id: 8,
    question: '8. Where does treasury money theoretically flow?',
    questionHi: '8. सैद्धांतिक रूप से ट्रेजरी का पैसा कहाँ जाता है?',
    category: 'GOVERNANCE',
    answer: '25% Infrastructure, 20% AI Operations, 15% Security, 15% Development, 10% Ecosystem Growth, 15% Protocol Emergency Reserve. 100% of customer subscription revenue replenishes the AI Ops pool.',
    answerHi: '25% इन्फ्रास्ट्रक्चर, 20% AI ऑप्स, 15% सुरक्षा, 15% देव, 10% इकोसिस्टम, 15% प्रोटोकॉल रिज़र्व। 100% रेवेन्यू वापस ऑप्स में।',
    status: 'PROPOSED',
    currentEnforcement: 'Ledger simulation engine',
    futureTarget: 'Automated bank account split rules'
  },
  {
    id: 9,
    question: '9. Which capabilities do not yet exist in reality?',
    questionHi: '9. कौन सी क्षमताएं अभी वास्तविकता में मौजूद नहीं हैं?',
    category: 'REALITY',
    answer: 'Indian banking regulations currently DO NOT permit non-human legal entities to open bank accounts or obtain corporate credit cards without human director KYC. Pure "autonomous corporate ownership" remains an architectural roadmap goal.',
    answerHi: 'भारतीय कानून अभी बिना मानव KYC के किसी AI को बैंक खाता या क्रेडिट कार्ड रखने की अनुमति नहीं देता। यह अभी कानूनी रूप से मानव-स्वामित्व वाली कंपनी है।',
    status: 'CONCEPT',
    currentEnforcement: 'Private Limited / LLP with human 100% ownership',
    futureTarget: 'Future regulatory DAO frameworks'
  },
  {
    id: 10,
    question: '10. Which claims still require independent verification?',
    questionHi: '10. किन दावों को अभी स्वतंत्र सत्यापन की आवश्यकता है?',
    category: 'REALITY',
    answer: 'Gemini 3.7 Flash OCR accuracy on handwritten Hindi/regional bills in poor lighting, zero-shot code generation reliability across diverse frameworks, and long-term customer willingness to pay ₹199/month for micro-SaaS bots.',
    answerHi: 'खराब रोशनी में हस्तलिखित हिंदी बिलों पर OCR की सटीकता और भारतीय छोटे दुकानदारों द्वारा ₹199/माह भुगतान करने की वास्तविक इच्छा।',
    status: 'PROTOTYPE',
    currentEnforcement: 'Empirical testing with sample bills',
    futureTarget: 'Field pilot with 50 live shopkeepers'
  }
];
