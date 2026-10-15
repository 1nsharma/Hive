/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PrincipleDetail {
  id: string;
  number: string;
  titleHi: string;
  titleEn: string;
  shortDescHi: string;
  shortDescEn: string;
  coreRule: string;
  userFacingExample: {
    userInput: string;
    internalAction: string;
    userFacingMessage: string;
  };
  details: string[];
  tags: string[];
}

export interface MemoryLayer {
  layer: 'Layer A' | 'Layer B' | 'Layer C';
  nameHi: string;
  nameEn: string;
  type: string;
  storage: string;
  contents: string[];
  purpose: string;
}

export interface RiskCategory {
  riskLevel: 'Low-Risk' | 'Medium-Risk' | 'High-Risk';
  color: string;
  actionTypeHi: string;
  actionTypeEn: string;
  examples: string[];
  executionPolicy: string;
}

export interface WorkflowStateDef {
  state: string;
  category: 'Normal Flow' | 'Failure State' | 'Terminal State';
  descriptionHi: string;
  descriptionEn: string;
  color: string;
}

export interface DesignRuleItem {
  rule: string;
  auraRequirement: string;
  status: 'Enforced' | 'Active';
}

export const PRODUCT_THESIS = {
  thesis: "Aura ऐसा automation platform होगा जिसमें user को 'integration कैसे बनानी है' नहीं सोचना पड़ेगा; उसे केवल यह बताना होगा कि वह क्या हासिल करना चाहता है।",
  thesisEn: "Aura is an automation platform where users never think about 'how to build an integration' — they only declare the outcome they wish to achieve.",
  corePromise: "Tell Aura the outcome. Aura handles the plumbing.",
  taglinePrimary: "The Invisible Force Behind Your Growth.",
  taglineSecondary: "Where Data Meets Intelligence.",
  productDefinition: "Aura is an AI-native business orchestration layer that understands intent, connects systems, moves data, remembers context, and takes action."
};

export const ORCHESTRATION_LOOP = [
  { step: '01', titleHi: 'User Intent', titleEn: 'User Intent', desc: 'उपयोगकर्ता प्राकृतिक भाषा में वांछित परिणाम बताता है।' },
  { step: '02', titleHi: 'Aura Understands', titleEn: 'Aura Understands', desc: 'LLM इरादे, स्रोतों और लक्ष्यों को सटीक पार्स करता है।' },
  { step: '03', titleHi: 'Aura Discovers', titleEn: 'Aura Discovers', desc: 'उपलब्ध स्कीमा, टेबल्स और फ़ील्ड्स की स्वचालित खोज।' },
  { step: '04', titleHi: 'Aura Connects', titleEn: 'Aura Connects', desc: 'सुरक्षित OAuth 2.0 PKCE व क्रेडेंशियल्स हैंडशेक।' },
  { step: '05', titleHi: 'Aura Maps', titleEn: 'Aura Maps', desc: 'कैनोनिकल स्कीमा में डेटा फ़ील्ड्स की स्वतः मैचिंग।' },
  { step: '06', titleHi: 'Aura Executes', titleEn: 'Aura Executes', desc: 'डिटरमिनिस्टिक इंजन द्वारा डेटा सिंक व एक्शन एक्ज़ीक्यूशन।' },
  { step: '07', titleHi: 'Aura Monitors', titleEn: 'Aura Monitors', desc: 'निरंतर टेलीमेट्री, लेटेंसी और अखंडता की निगरानी।' },
  { step: '08', titleHi: 'Aura Recovers', titleEn: 'Aura Recovers', desc: 'सर्किट ब्रेकर और Redis बफ़र द्वारा स्वतः स्व-उपचार।' },
  { step: '09', titleHi: 'Aura Learns', titleEn: 'Aura Learns', desc: 'यूनिवर्सल मेमोरी में संदर्भ का विस्तार और अनुकूलन।' }
];

export const TEN_PRINCIPLES: PrincipleDetail[] = [
  {
    id: 'p01',
    number: '01',
    titleHi: 'शून्य कॉन्फ़िगरेशन अनुभव (Zero-Configuration Experience)',
    titleEn: 'Zero-Configuration Experience',
    shortDescHi: 'शून्य तकनीकी कॉन्फ़िगरेशन, न्यूनतम मानवीय प्राधिकरण।',
    shortDescEn: 'Zero technical configuration, minimal human authorization.',
    coreRule: 'Zero Configuration ≠ Zero User Action. User authorizes via OAuth, but never configures webhooks, API keys, or manual mapping.',
    userFacingExample: {
      userInput: 'मेरे Salesforce और Google Sheets को जोड़ दो।',
      internalAction: 'Intent Detection ➔ OAuth Popup ➔ Auto-Discovery ➔ Schema Match ➔ Active Sync',
      userFacingMessage: 'Salesforce and Google Sheets are connected and syncing.'
    },
    details: [
      'API documentation पढ़ने की आवश्यकता नहीं',
      'API key manually ढूँढने की आवश्यकता नहीं',
      'Webhook configure करने की आवश्यकता नहीं',
      'Mapping manually बनाने की आवश्यकता नहीं',
      'Technical workflow editor सीखने की आवश्यकता नहीं'
    ],
    tags: ['Zero-Config', 'NLP Onboarding', 'OAuth PKCE']
  },
  {
    id: 'p02',
    number: '02',
    titleHi: 'इंटरफ़ेस पर इरादा (Intent Over Interface)',
    titleEn: 'Intent Over Interface',
    shortDescHi: 'Aura का प्राथमिक इंटरफ़ेस UI नहीं, इरादा (Intent) होगा।',
    shortDescEn: 'The user should describe the desired outcome, not the implementation.',
    coreRule: 'Frontend complexity decreases; AI orchestration depth increases. Users declare the outcome.',
    userFacingExample: {
      userInput: 'Shopify ke new orders ko Slack sales channel me bhejo.',
      internalAction: 'Subscribes to Shopify orders/create webhook, transforms JSON to Slack message block, posts to #sales.',
      userFacingMessage: 'Done. Shopify ➔ Slack sales automation is active.'
    },
    details: [
      'पारंपरिक SaaS में 8 चरणों का जटिल फ़्लोचार्ट कैनवास होता है',
      'Aura में उपयोगकर्ता केवल अंतिम परिणाम बताता है',
      'UI केवल पुष्टि और निगरानी के लिए है, जटिल वायरिंग के लिए नहीं'
    ],
    tags: ['Outcome-First', 'Conversational UX', 'No-Spaghetti']
  },
  {
    id: 'p03',
    number: '03',
    titleHi: 'अदृश्य बुद्धिमत्ता (Invisible Intelligence)',
    titleEn: 'Invisible Intelligence',
    shortDescHi: 'आंतरिक जटिलता को छिपाएं; केवल सार्थक उपयोगकर्ता भाषा दिखाएं।',
    shortDescEn: 'Hide unnecessary technical complexity; show only meaningful user-facing state.',
    coreRule: 'User never sees: vector retrieval, schema normalization, retry policy, queue management, or token refresh.',
    userFacingExample: {
      userInput: 'Salesforce sync in progress.',
      internalAction: 'Salesforce 429 Rate Limit ➔ Exponential Backoff ➔ In-Memory Token Refresh ➔ Retried ➔ Success',
      userFacingMessage: 'Salesforce sync recovered automatically.'
    },
    details: [
      'तकनीकी शब्दजाल की जगह: Connected, Syncing, Recovered, Waiting for authorization, Completed',
      'आंतरिक विफलताएँ पृष्ठभूमि में स्वचालित रूप से ठीक की जाती हैं',
      'उपयोगकर्ता के कार्यप्रवाह में कोई अनावश्यक घबराहट नहीं'
    ],
    tags: ['Simplicity', 'Clean UX', 'Background AI']
  },
  {
    id: 'p04',
    number: '04',
    titleHi: 'डिफ़ॉल्ट रूप से स्व-उपचार (Self-Healing by Default)',
    titleEn: 'Self-Healing by Default',
    shortDescHi: 'स्वचालन इंजन विफलता-जागरूक (Failure-Aware) होना चाहिए।',
    shortDescEn: 'Never hide a business-critical failure. Hide unnecessary technical complexity, not material truth.',
    coreRule: '5-Level Recovery Hierarchy: Transient Retry ➔ Exponential Backoff ➔ Durable Queue (Redis) ➔ Alternative Path ➔ Human Intervention.',
    userFacingExample: {
      userInput: 'Syncing $45k CRM deal data.',
      internalAction: 'Salesforce down ➔ Circuit Breaker OPEN ➔ Payload preserved in Redis BullMQ ➔ Service Restored ➔ Replayed',
      userFacingMessage: 'Your Salesforce data is safe. Sync is temporarily delayed and will resume automatically.'
    },
    details: [
      'गलत दृष्टिकोण: "Everything is fine" कहना जब डेटा सिंक नहीं हुआ',
      'सही दृष्टिकोण: उपयोगकर्ता को आश्वस्त करना कि डेटा सुरक्षित है और पुनः प्रयास जारी है',
      '0% डेटा ड्रॉप की गारंटी'
    ],
    tags: ['Circuit Breaker', 'Redis Queue', 'Zero Data Loss']
  },
  {
    id: 'p05',
    number: '05',
    titleHi: 'सार्वभौमिक संदर्भ स्मृति (Universal Context Memory)',
    titleEn: 'Universal Context Memory',
    shortDescHi: 'Email, Slack, CRM, WhatsApp, कॉल — सभी चैनलों के संदर्भ को जोड़ना।',
    shortDescEn: 'Retains cross-channel context across WhatsApp, CRM, Slack, and email.',
    coreRule: 'Aura does not look at requests in isolation; it synthesizes historical interactions across all business tools.',
    userFacingExample: {
      userInput: 'Is customer ready to close?',
      internalAction: 'Combines Monday WhatsApp ("Buy next month") + Tuesday CRM (Stage: Opportunity) + Friday Email (Pricing query)',
      userFacingMessage: 'Customer requested pricing yesterday after WhatsApp confirmation. High intent to close this week.'
    },
    details: [
      'केवल CRM फ़ील्ड नहीं पढ़ता, बल्कि सभी बातचीत का संश्लेषण करता है',
      'स्मृति को 3 परतों में अलग किया जाता है: ऑपरेशनल, सेमेंटिक, और इवेंट मेमोरी'
    ],
    tags: ['Cross-Channel', 'Synthesized Context', 'pgvector']
  },
  {
    id: 'p06',
    number: '06',
    titleHi: 'डेटा स्रोत प्रामाणिकता (Data Must Have Provenance)',
    titleEn: 'Data Must Have Provenance',
    shortDescHi: 'AI अनुमान और मूल स्रोत डेटा को हमेशा अलग रखना अनिवार्य है।',
    shortDescEn: 'AI interpretation must never overwrite raw source data.',
    coreRule: 'Raw Data ➔ Normalized Data ➔ AI Interpretation ➔ Action. Clear lineage and auditability for every conclusion.',
    userFacingExample: {
      userInput: 'Why do you recommend follow-up?',
      internalAction: 'Retrieves audit provenance log: Salesforce opp updated 2h ago + Email received yesterday + Call transcript today',
      userFacingMessage: 'Evidence: 1. Salesforce deal stage updated 2h ago | 2. Pricing email received yesterday | 3. Positive phone call transcript.'
    },
    details: [
      'प्रत्येक निष्कर्ष के पीछे सत्यापित स्रोत प्रमाण मौजूद होता है',
      'AI मॉडल कभी भी अंतर्निहित मूल डेटाबेस रिकॉर्ड्स को मनमाने ढंग से अधिलेखित नहीं कर सकता'
    ],
    tags: ['Lineage', 'Audit Trail', 'Provenance']
  },
  {
    id: 'p07',
    number: '07',
    titleHi: 'मानवीय अधिकार और जोखिम पदानुक्रम (Human Authority)',
    titleEn: 'Human Authority',
    shortDescHi: 'Aura स्वायत्त हो सकता है, लेकिन व्यवसाय स्वामी के अधिकार से ऊपर नहीं।',
    shortDescEn: 'Aura can automate execution; it cannot silently redefine authority.',
    coreRule: 'Actions categorized into Low-Risk (Auto), Medium-Risk (Configurable Approval), and High-Risk (Explicit Authorization).',
    userFacingExample: {
      userInput: 'Delete inactive Salesforce leads & charge card.',
      internalAction: 'High-Risk Action Flagged ➔ Execution halted ➔ Approval request dispatched to Workspace Admin with 2FA confirmation',
      userFacingMessage: 'Approval Required: Deleting 450 leads and financial transactions require explicit admin signature.'
    },
    details: [
      'Low-Risk: डेटा पढ़ना, सारांश बनाना, आंतरिक टास्क बनाना (स्वतः निष्पादन)',
      'Medium-Risk: CRM रिकॉर्ड अपडेट करना, आंतरिक स्लैक संदेश भेजना (कॉन्फ़िगर करने योग्य)',
      'High-Risk: बाहरी संचार, डेटा विलोपन, वित्तीय लेनदेन (अनिवार्य मानवीय स्वीकृति)'
    ],
    tags: ['Governance', 'Risk Matrix', 'Admin Approval']
  },
  {
    id: 'p08',
    number: '08',
    titleHi: 'डिटरमिनिस्टिक कोर, संभाव्य बुद्धिमत्ता (Deterministic Core, Probabilistic Intelligence)',
    titleEn: 'Deterministic Core, Probabilistic Intelligence',
    shortDescHi: 'LLM तय करता है "क्या", डिटरमिनिस्टिक सिस्टम लागू करता है "कैसे"।',
    shortDescEn: 'LLM decides "what", deterministic systems enforce "how".',
    coreRule: 'LLM handles intent, reasoning, and planning. Deterministic engine handles auth, DB writes, retries, queues, and billing.',
    userFacingExample: {
      userInput: 'Transfer invoices from Stripe to QuickBooks.',
      internalAction: 'LLM plans field mapping ➔ Deterministic financial ledger engine executes double-entry write with ACID transaction',
      userFacingMessage: 'Invoices successfully synchronized with 100% mathematical reconciliation.'
    },
    details: [
      'LLM संभाव्य (Probabilistic) है — वित्तीय लेनदेन या डेटाबेस म्यूटेशन कभी संभाव्य नहीं होना चाहिए',
      'डिटरमिनिस्टिक कोर में आइडमपोटेंसी (Idempotency) और स्ट्रिक्ट रोलबैक सुरक्षा अंतर्निहित है'
    ],
    tags: ['ACID Safety', 'Idempotency', 'Hybrid Core']
  },
  {
    id: 'p09',
    number: '09',
    titleHi: 'कार्रवाई से पहले साक्ष्य सत्यापन (Evidence Before Action)',
    titleEn: 'Evidence Before Action',
    shortDescHi: 'Aura कभी भी आंख मूंदकर कोई कदम नहीं उठाता।',
    shortDescEn: 'Observe ➔ Understand ➔ Validate ➔ Plan ➔ Execute ➔ Verify ➔ Record.',
    coreRule: 'Every meaningful action must pass pre-flight verification: authenticated? accessible? target exists? fields compatible? permissions valid?',
    userFacingExample: {
      userInput: 'Salesforce contacts ko Sheets me sync karo.',
      internalAction: 'Pre-flight check: Salesforce Auth ✓ | Sheets Auth ✓ | Contacts Access ✓ | Target Sheet Exists ✓ | Permission ✓',
      userFacingMessage: 'Pre-flight validation passed. Pipeline initiated safely.'
    },
    details: [
      'कार्रवाई करने से पूर्व 6-बिंदु सुरक्षा चेकलिस्ट की स्वचालित पुष्टि',
      'सिस्टम केवल तभी निष्पादन करता है जब सभी पूर्व-आवश्यकताएं पूरी हों'
    ],
    tags: ['Pre-Flight Check', 'Validation', 'Safe Execution']
  },
  {
    id: 'p10',
    number: '10',
    titleHi: 'विफलता एक स्थिति है, क्रैश नहीं (Failure Should Be a State, Not a Crash)',
    titleEn: 'Failure Should Be a State, Not a Crash',
    shortDescHi: 'कार्यप्रवाह की स्थितियाँ स्पष्ट और औपचारिक रूप से परिभाषित होंगी।',
    shortDescEn: 'Workflows transition through observable, typed lifecycle states rather than crashing.',
    coreRule: 'Formal state machine: Normal Flow, Failure States (RETRYING, WAITING, DEGRADED, QUEUED_FOR_RECOVERY), and Terminal States.',
    userFacingExample: {
      userInput: 'Check current pipeline health.',
      internalAction: 'Connector hit endpoint 503 ➔ Workflow state transitions to QUEUED_FOR_RECOVERY ➔ Heartbeat monitored',
      userFacingMessage: 'State: QUEUED_FOR_RECOVERY. 12 events buffered safely. Auto-resuming in 45s.'
    },
    details: [
      'सामान्य अवस्थाएँ: CREATED ➔ AUTHORIZING ➔ CONNECTED ➔ DISCOVERING ➔ MAPPING ➔ READY ➔ RUNNING ➔ SYNCED',
      'विफलता अवस्थाएँ: RETRYING, WAITING, DEGRADED, QUEUED_FOR_RECOVERY, REQUIRES_ACTION',
      'अंतिम अवस्थाएँ: COMPLETED, CANCELLED, FAILED_PERMANENTLY'
    ],
    tags: ['State Machine', 'Observability', 'Resilient Lifecycle']
  }
];

export const THREE_MEMORY_LAYERS: MemoryLayer[] = [
  {
    layer: 'Layer A',
    nameHi: 'ऑपरेशनल मेमोरी (Operational Memory)',
    nameEn: 'Operational Memory',
    type: 'Structured State',
    storage: 'PostgreSQL 16 (ACID Relations)',
    contents: ['Customer ID', 'Order ID', 'Workflow ID', 'Connector State', 'Sync Cursor', 'Last Execution', 'Retries', 'Permissions'],
    purpose: 'सटीक, अपरिवर्तनीय और तात्कालिक ट्रांज़ैक्शनल स्थिति को सुरक्षित रखना।'
  },
  {
    layer: 'Layer B',
    nameHi: 'सेमेंटिक मेमोरी (Semantic Memory)',
    nameEn: 'Semantic Memory',
    type: 'Conversational Context',
    storage: 'Vector Database (pgvector / Pinecone)',
    contents: ['Past Conversations', 'Important Decisions', 'Customer Preferences', 'Business Notes', 'Meeting Summaries', 'Documents'],
    purpose: 'विभिन्न संचार चैनलों के अर्थ, टोन और संदर्भ को समझकर प्रासंगिक सुझाव देना।'
  },
  {
    layer: 'Layer C',
    nameHi: 'इवेंट मेमोरी (Event Memory)',
    nameEn: 'Event Memory',
    type: 'Immutable Append-Only Log',
    storage: 'Event Store / Kafka / EventLog',
    contents: ['Lead Created', 'Order Received', 'Email Sent', 'Payment Failed', 'Sync Completed', 'Workflow Recovered'],
    purpose: 'वास्तव में क्या घटित हुआ उसका पूर्ण ऑडिट ट्रेल और समय-यात्रा (Time-Travel) रीप्ले।'
  }
];

export const RISK_CATEGORIES: RiskCategory[] = [
  {
    riskLevel: 'Low-Risk',
    color: '#22d3ee',
    actionTypeHi: 'निम्न-जोखिम (Low-Risk)',
    actionTypeEn: 'Low-Risk Actions',
    examples: ['Read data from APIs', 'Summarize meeting transcripts', 'Classify lead intent', 'Create internal task', 'Update BI analytics'],
    executionPolicy: 'स्वतः निष्पादन (Automatically Execute) — किसी मानवीय बाधा के बिना।'
  },
  {
    riskLevel: 'Medium-Risk',
    color: '#3b82f6',
    actionTypeHi: 'मध्यम-जोखिम (Medium-Risk)',
    actionTypeEn: 'Medium-Risk Actions',
    examples: ['Update CRM opportunity stage', 'Send internal Slack notifications', 'Modify non-critical sync schedules', 'Tag contact attributes'],
    executionPolicy: 'कॉन्फ़िगर करने योग्य स्वीकृति (Configurable Approval) — टीम सेटिंग्स के आधार पर।'
  },
  {
    riskLevel: 'High-Risk',
    color: '#ef4444',
    actionTypeHi: 'उच्च-जोखिम (High-Risk)',
    actionTypeEn: 'High-Risk Actions',
    examples: ['Send external email or SMS to customer', 'Bulk delete database records', 'Trigger financial transactions / refunds', 'Alter contract terms'],
    executionPolicy: 'अनिवार्य मानवीय प्राधिकरण (Explicit Authorization Required) — 2FA/हस्ताक्षर अनिवार्य।'
  }
];

export const WORKFLOW_STATES: WorkflowStateDef[] = [
  { state: 'CREATED', category: 'Normal Flow', descriptionHi: 'इरादा पार्स हुआ, पाइपलाइन बनी', descriptionEn: 'Intent parsed, workflow created', color: '#9a9ab0' },
  { state: 'AUTHORIZING', category: 'Normal Flow', descriptionHi: 'OAuth अनुमति का इंतज़ार', descriptionEn: 'Waiting for OAuth PKCE token', color: '#3b82f6' },
  { state: 'CONNECTED', category: 'Normal Flow', descriptionHi: 'सिस्टम्स सफलतापूर्वक जुड़े', descriptionEn: 'Credentials verified and active', color: '#22d3ee' },
  { state: 'DISCOVERING', category: 'Normal Flow', descriptionHi: 'स्कीमा और टेबल्स की खोज', descriptionEn: 'Auto-discovering tables & fields', color: '#7c5cff' },
  { state: 'MAPPING', category: 'Normal Flow', descriptionHi: 'फ़ील्ड्स का कैनोनिकल मिलान', descriptionEn: 'Canonical entity schema matching', color: '#c4b5fd' },
  { state: 'READY', category: 'Normal Flow', descriptionHi: 'पाइपलाइन सिंक के लिए तैयार', descriptionEn: 'Pre-flight verified, ready to run', color: '#38bdf8' },
  { state: 'RUNNING', category: 'Normal Flow', descriptionHi: 'डेटा सक्रिय रूप से प्रवाहित', descriptionEn: 'Actively streaming data batches', color: '#22c55e' },
  { state: 'SYNCED', category: 'Normal Flow', descriptionHi: 'अद्यतन डेटा 100% समन्वित', descriptionEn: 'Batch successfully committed', color: '#10b981' },
  
  { state: 'RETRYING', category: 'Failure State', descriptionHi: 'क्षणिक एरर, पुनः प्रयास जारी', descriptionEn: 'Transient error, backing off', color: '#f59e0b' },
  { state: 'WAITING', category: 'Failure State', descriptionHi: 'API रेट-लिमिट कूलडाउन', descriptionEn: 'Waiting for 429 quota window', color: '#eab308' },
  { state: 'DEGRADED', category: 'Failure State', descriptionHi: 'आंशिक सिंक, बैकग्राउंड बफ़र', descriptionEn: 'Slow response, fallback active', color: '#f97316' },
  { state: 'QUEUED_FOR_RECOVERY', category: 'Failure State', descriptionHi: 'Redis कतार में सुरक्षित बफ़र', descriptionEn: 'Buffered in Redis BullMQ', color: '#ec4899' },
  { state: 'REQUIRES_ACTION', category: 'Failure State', descriptionHi: 'टोकन एक्सपायर, यूजर अनुमति चाहिए', descriptionEn: 'Expired token, requires login', color: '#ef4444' },

  { state: 'COMPLETED', category: 'Terminal State', descriptionHi: 'प्रक्रिया सफलतापूर्वक समाप्त', descriptionEn: 'One-off migration completed', color: '#10b981' },
  { state: 'CANCELLED', category: 'Terminal State', descriptionHi: 'उपयोगकर्ता द्वारा रोका गया', descriptionEn: 'Explicitly stopped by owner', color: '#6b7280' },
  { state: 'FAILED_PERMANENTLY', category: 'Terminal State', descriptionHi: 'अपरिहार्य विफलता (लॉग सुरक्षित)', descriptionEn: 'Dead-letter queue, logged', color: '#b91c1c' }
];

export const DESIGN_RULES: DesignRuleItem[] = [
  { rule: 'Technical Setup', auraRequirement: 'Minimum (Zero manual keys)', status: 'Enforced' },
  { rule: 'Natural-Language Interaction', auraRequirement: 'First-Class Interface', status: 'Enforced' },
  { rule: 'Manual Mapping', auraRequirement: 'Optional (AI default)', status: 'Enforced' },
  { rule: 'AI Suggestions', auraRequirement: 'Default (Pre-computed)', status: 'Enforced' },
  { rule: 'Human Approval', auraRequirement: 'Risk-based (3 tiers)', status: 'Enforced' },
  { rule: 'Error Transparency', auraRequirement: 'Required (Material Truth)', status: 'Enforced' },
  { rule: 'Automatic Recovery', auraRequirement: 'Default (5 levels)', status: 'Enforced' },
  { rule: 'Audit Trail', auraRequirement: 'Required (Event Memory)', status: 'Enforced' },
  { rule: 'Data Provenance', auraRequirement: 'Required (Source Lineage)', status: 'Enforced' },
  { rule: 'Deterministic Execution', auraRequirement: 'Required (ACID & Idempotent)', status: 'Enforced' },
  { rule: 'Context Memory', auraRequirement: 'Cross-channel synthesis', status: 'Enforced' },
  { rule: 'Vendor Lock-in', auraRequirement: 'Minimized (Adapter pattern)', status: 'Enforced' }
];
