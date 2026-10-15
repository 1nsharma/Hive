import { Connector, Phase, ExecutionOption, RevenueTier } from '../types';

export const CONNECTORS: Connector[] = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    symbol: 'PG',
    category: 'database',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'ओपन-सोर्स रिलेशनल डेटाबेस, ACID अनुपालन और उच्च प्रदर्शन के साथ।',
    descriptionEn: 'Open-source relational database with robust ACID compliance.',
    protocol: 'PostgreSQL Wire Protocol / SSL / Connection Pooling',
    samplePayload: { host: 'db.internal', port: 5432, database: 'aura_prod', pool_size: 20 }
  },
  {
    id: 'mysql',
    name: 'MySQL',
    symbol: 'MY',
    category: 'database',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'विश्वसनीय और व्यापक रूप से उपयोग किया जाने वाला SQL डेटाबेस।',
    descriptionEn: 'Widely deployed relational database for transactional web applications.',
    protocol: 'MySQL Native Driver / TLS 1.3',
    samplePayload: { host: 'mysql.cluster.local', port: 3306, user: 'aura_sync' }
  },
  {
    id: 'sqlserver',
    name: 'SQL Server',
    symbol: 'SQ',
    category: 'database',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'Microsoft का एंटरप्राइज़-ग्रेड रिलेशनल डेटाबेस इंजन।',
    descriptionEn: 'Microsoft enterprise-grade relational database management system.',
    protocol: 'TDS (Tabular Data Stream) / Kerberos Auth',
    samplePayload: { server: 'mssql.corp.net', database: 'ERP_Core', encrypt: true }
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    symbol: 'SF',
    category: 'database',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'इलास्टिक क्लाउड डेटा वेयरहाउस और विश्लेषणात्मक इंजन।',
    descriptionEn: 'Elastic cloud data warehouse for cross-cloud analytical pipelines.',
    protocol: 'Snowflake SQL REST API / Key-Pair Auth',
    samplePayload: { account: 'xy12345.us-east-1', warehouse: 'AURA_WH', role: 'AURA_READER' }
  },
  {
    id: 's3',
    name: 'Amazon S3',
    symbol: 'S3',
    category: 'storage',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'असीमित स्केलेबिलिटी वाला ऑब्जेक्ट स्टोरेज सिस्टम।',
    descriptionEn: 'Scalable cloud object storage for raw telemetry, backups, and media.',
    protocol: 'AWS SigV4 / S3 REST API',
    samplePayload: { bucket: 'aura-lakehouse-prod', region: 'us-east-1', encryption: 'AES256' }
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    symbol: 'GS',
    category: 'productivity',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'द्विदिशीय डेटा सिंकिंग के साथ क्लाउड स्प्रेडशीट।',
    descriptionEn: 'Cloud spreadsheet with bidirectional live sync and event triggers.',
    protocol: 'Google Workspace OAuth 2.0 / REST API v4',
    samplePayload: { spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms', range: 'A1:Z500' }
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    symbol: 'SF',
    category: 'crm',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'वैश्विक स्तर पर अग्रणी CRM प्लेटफ़ॉर्म। ग्राहक एवं लीड प्रबंधन।',
    descriptionEn: 'Leading enterprise CRM platform for contact, lead, and pipeline management.',
    protocol: 'Salesforce REST / Bulk API 2.0 / OAuth Web Server Flow',
    samplePayload: { instanceUrl: 'https://aura.my.salesforce.com', objects: ['Lead', 'Contact', 'Opportunity'] }
  },
  {
    id: 'slack',
    name: 'Slack',
    symbol: 'SL',
    category: 'communication',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'रीयल-टाइम टीम मैसेजिंग और स्वचालित नोटिफिकेशन हब।',
    descriptionEn: 'Real-time team messaging, bots, and automated action alerts.',
    protocol: 'Slack Webhook & Bolt SDK / OAuth v2',
    samplePayload: { channel: '#sales-alerts', bot_name: 'Aura Intelligence', interactive_blocks: true }
  },
  {
    id: 'shopify',
    name: 'Shopify',
    symbol: 'SH',
    category: 'commerce',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'अत्यधिक उच्च',
    priorityEn: 'Critical',
    descriptionHi: 'ई-कॉमर्स स्टोर, ऑर्डर्स, इन्वेंटरी और ग्राहक डेटा।',
    descriptionEn: 'E-commerce platform for live order intake, inventory, and customer lifecycle.',
    protocol: 'Shopify GraphQL Admin API / Webhooks',
    samplePayload: { shop: 'aura-store.myshopify.com', scopes: ['read_orders', 'write_inventory'] }
  },
  {
    id: 'github',
    name: 'GitHub',
    symbol: 'GH',
    category: 'dev',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'कोड रिपॉजिटरी, इश्यूज, और CI/CD वर्कफ़्लो ऑटोमेशन।',
    descriptionEn: 'Code repository, PR tracking, and GitHub Actions telemetry.',
    protocol: 'GitHub App / Octokit REST & GraphQL',
    samplePayload: { org: 'aura-intelligence', events: ['push', 'issues', 'pull_request'] }
  },
  {
    id: 'jira',
    name: 'Jira',
    symbol: 'JR',
    category: 'dev',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'एजाइल प्रोजेक्ट और इश्यू ट्रैकिंग प्रबंधन।',
    descriptionEn: 'Agile project tracking, sprints, and engineering ticket sync.',
    protocol: 'Atlassian Connect OAuth 2.0 / REST v3',
    samplePayload: { domain: 'aura.atlassian.net', projectKey: 'AURA' }
  },
  {
    id: 'bigquery',
    name: 'Google BigQuery',
    symbol: 'BQ',
    category: 'database',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'सर्वरलेस, अत्यधिक स्केलेबल एंटरप्राइज़ डेटा वेयरहाउस।',
    descriptionEn: 'Serverless, cost-effective multicloud enterprise data warehouse.',
    protocol: 'Google Cloud Storage & BigQuery REST API',
    samplePayload: { project_id: 'aura-bi-prod', dataset: 'growth_analytics', location: 'US' }
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    symbol: 'XL',
    category: 'productivity',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'Office 365 और OneDrive के माध्यम से व्यावसायिक डेटा शीट।',
    descriptionEn: 'Microsoft 365 spreadsheet integration via Microsoft Graph API.',
    protocol: 'Microsoft Graph API / Azure AD OAuth',
    samplePayload: { driveItem: 'root/Financials_2026.xlsx', worksheet: 'Summary' }
  },
  {
    id: 'stripe',
    name: 'Stripe',
    symbol: 'ST',
    category: 'finance',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'ग्लोबल पेमेंट प्रोसेसिंग, सब्सक्रिप्शन और इनवॉइसिंग।',
    descriptionEn: 'Online payment infrastructure, recurring subscriptions, and billing telemetry.',
    protocol: 'Stripe Webhooks / REST API (HMAC Signature Verif)',
    samplePayload: { account_type: 'custom', events: ['invoice.paid', 'customer.subscription.created'] }
  },
  {
    id: 'twilio',
    name: 'Twilio',
    symbol: 'TW',
    category: 'communication',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'क्लाउड वॉइस डायलर, SMS एवं वॉयस ऑटोमेशन एपीआई।',
    descriptionEn: 'Programmable voice dialer, SMS gateway, and real-time audio streaming.',
    protocol: 'Twilio Voice TwiML / WebSocket Media Streams',
    samplePayload: { voiceUrl: '/api/voice/twiml', speechTimeout: 'auto', dialerAgentId: 'aura-voice-01' }
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    symbol: 'MC',
    category: 'communication',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'ईमेल मार्केटिंग अभियान और ऑडियंस सेगमेंटेशन।',
    descriptionEn: 'Email campaign automation and subscriber audience synchronization.',
    protocol: 'Mailchimp API v3.0 / OAuth 2.0',
    samplePayload: { listId: 'aura_newsletter_30k', batch_sync: true }
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    symbol: 'HS',
    category: 'crm',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'मार्केटिंग, सेल्स और कस्टमर सर्विस सीआरएम सूट।',
    descriptionEn: 'Inbound marketing, CRM deals pipeline, and lead scoring engine.',
    protocol: 'HubSpot OAuth / CRM v3 API',
    samplePayload: { portalId: '9843120', pipelines: ['Sales', 'Growth'] }
  },
  {
    id: 'zapier',
    name: 'Zapier',
    symbol: 'ZP',
    category: 'communication',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: '5000+ ऐप्स के साथ नो-कोड ट्रिगर और क्रियाएँ।',
    descriptionEn: 'No-code workflow bridge with webhook triggers and action dispatch.',
    protocol: 'REST Webhooks / REST Hook Triggers',
    samplePayload: { hookUrl: 'https://hooks.zapier.com/hooks/catch/123/abc' }
  },
  {
    id: 'airtable',
    name: 'Airtable',
    symbol: 'AT',
    category: 'productivity',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'रिलेशनल क्षमताओं वाली इंटरैक्टिव डेटाबेस स्प्रेडशीट।',
    descriptionEn: 'Low-code relational database with custom views and formula sync.',
    protocol: 'Airtable Web API / Personal Access Token',
    samplePayload: { baseId: 'app9h410sXZ', table: 'Operational_Roadmap' }
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    symbol: 'λ',
    category: 'cloud',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'इवेंट-ड्रिवन सर्वरलेस कम्प्यूट फ़ंक्शन्स।',
    descriptionEn: 'Event-driven serverless compute runtime for micro-actions.',
    protocol: 'AWS SDK v3 / IAM Role Delegation',
    samplePayload: { functionName: 'aura-event-processor', invocationType: 'Event' }
  },
  {
    id: 'firebase',
    name: 'Firebase',
    symbol: 'FB',
    category: 'cloud',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'रीयलटाइम डेटाबेस, फ़ायरस्टोर एवं मोबाइल बैकएंड।',
    descriptionEn: 'Realtime database, Cloud Firestore, and authentication tokens.',
    protocol: 'Firebase Admin SDK / Firestore Listeners',
    samplePayload: { projectId: 'aura-growth-app', collection: 'telemetry_stream' }
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    symbol: 'TM',
    category: 'communication',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'एंटरप्राइज़ सहयोग, मीटिंग और बॉट नोटिफिकेशन्स।',
    descriptionEn: 'Enterprise workspace chat, notification cards, and approval bot.',
    protocol: 'Microsoft Bot Framework / Graph API',
    samplePayload: { tenantId: 'azure-corp-99', channelId: '19:general' }
  },
  {
    id: 'zoom',
    name: 'Zoom',
    symbol: 'ZM',
    category: 'communication',
    complexity: 'निम्न (Low)',
    complexityEn: 'Low',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'वीडियो कॉन्फ्रेंसिंग, ट्रांसक्रिप्ट्स और कॉल रिकॉर्डिंग्स।',
    descriptionEn: 'Video conferences, cloud audio recording sync, and meeting transcripts.',
    protocol: 'Zoom Server-to-Server OAuth / Webhooks',
    samplePayload: { auto_recording: 'cloud', transcript_sync: true }
  },
  {
    id: 'dynamics',
    name: 'Dynamics 365',
    symbol: 'D3',
    category: 'crm',
    complexity: 'उच्च (High)',
    complexityEn: 'High',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'Microsoft का एंटरप्राइज़ CRM एवं ERP बिज़नेस सूट।',
    descriptionEn: 'Microsoft enterprise ERP and CRM for enterprise resource planning.',
    protocol: 'OData v4 Web API / Microsoft Entra ID',
    samplePayload: { orgUrl: 'https://aura-corp.crm.dynamics.com', entities: ['Accounts', 'Orders'] }
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    symbol: 'QB',
    category: 'finance',
    complexity: 'मध्यम (Medium)',
    complexityEn: 'Medium',
    priority: 'उच्च',
    priorityEn: 'High',
    descriptionHi: 'लेखांकन, इनवॉइसिंग, लाभ-हानि और टैक्स रिकॉर्ड्स।',
    descriptionEn: 'Accounting software, profit/loss ledger, expenses, and invoices.',
    protocol: 'Intuit OAuth 2.0 / QuickBooks Online Accounting API',
    samplePayload: { realmId: '46208163650', syncEntities: ['Invoice', 'Payment'] }
  }
];

export const PHASES: Phase[] = [
  {
    id: 'phase-1',
    num: '01',
    titleHi: 'ब्रांड पहचान और कोर फीचर्स',
    titleEn: 'Brand Identity & Core Features',
    descriptionHi: 'ब्रांड की पहचान मजबूत करें और उन फीचर्स को विकसित करें जो Aura को अद्वितीय बनाएंगे।',
    descriptionEn: 'Establish an indelible brand identity and construct the 6 distinctive foundation capabilities.',
    badgeHi: 'फाउंडेशन चरण',
    badgeEn: 'Foundation Stage',
    targetMetricHi: '6 कोर एआई क्षमताएं',
    targetMetricEn: '6 Core AI Capabilities',
    tasks: [
      {
        id: 't-1-1',
        textHi: 'Zero-Configuration Onboarding: प्राकृतिक भाषा द्वारा स्वतः कनेक्शन (जैसे: "Salesforce और Sheets जोड़ दो")',
        textEn: 'Zero-Configuration Onboarding: Natural language connection intent auto-discovery & binding',
        completed: true,
        priority: 'critical',
        techStack: 'NLP Parser, OAuth 2.0 Auto-Handshake'
      },
      {
        id: 't-1-2',
        textHi: 'Unified Data Interface: सभी 25 स्रोतों को एक मानकीकृत लेयर (GraphQL/REST) में एकजुट करना',
        textEn: 'Unified Data Interface: Abstract all 25 heterogenous sources behind a single canonical query layer',
        completed: true,
        priority: 'critical',
        techStack: 'GraphQL Federation, SQL Translation Layer'
      },
      {
        id: 't-1-3',
        textHi: 'AI Voice Dialer & Agent: स्वायत्त वॉयस कॉल, ग्राहक वार्तालाप और CRM में मीटिंग शेड्यूलिंग',
        textEn: 'AI Voice Dialer & Agent: Autonomous calling agent, conversational synthesis, CRM calendar booking',
        completed: false,
        priority: 'high',
        techStack: 'Twilio Media Streams, Deepgram STT, Gemini Flash Voice'
      },
      {
        id: 't-1-4',
        textHi: 'Predictive Action Engine: इन्वेंटरी फोरकास्टिंग एवं पूर्व-अनुमानित क्रियान्वयन (उदा: 3 दिन में री-ऑर्डर)',
        textEn: 'Predictive Action Engine: Time-series anomaly detection & preemptive execution triggers',
        completed: false,
        priority: 'high',
        techStack: 'ML Time-Series Engine, Rule-Based Event Bus'
      },
      {
        id: 't-1-5',
        textHi: 'Self-Healing Workflows: API विफलता पर स्वतः कैशिंग, बैकऑफ रिट्राई और निर्बाध रिकवरी',
        textEn: 'Self-Healing Workflows: Circuit breakers, Redis queue buffering, exponential retry policies',
        completed: false,
        priority: 'high',
        techStack: 'Redis, BullMQ, Dead Letter Queue'
      },
      {
        id: 't-1-6',
        textHi: 'Universal Context Memory: ईमेल, स्लैक, कॉल और व्हाट्सएप संदर्भ को याद रखने वाला वेक्टर स्टोर',
        textEn: 'Universal Context Memory: Cross-channel conversational graph & long-term vector embeddings',
        completed: false,
        priority: 'medium',
        techStack: 'Vector Embeddings, Context Synthesizer'
      }
    ]
  },
  {
    id: 'phase-2',
    num: '02',
    titleHi: 'तकनीकी आर्किटेक्चर और MVP',
    titleEn: 'Technical Architecture & MVP',
    descriptionHi: 'मानकीकृत कनेक्टर फ्रेमवर्क और MVP विकसित करें — एडाप्टर पैटर्न और ज़ीरो-ट्रस्ट सुरक्षा पर आधारित।',
    descriptionEn: 'Build the standardized connector framework using Adapter Pattern, container gateway, and MVP.',
    badgeHi: 'इंजीनियरिंग कोर',
    badgeEn: 'Engineering Core',
    targetMetricHi: '25 सक्रिय कनेक्टर्स',
    targetMetricEn: '25 Active Connectors',
    tasks: [
      {
        id: 't-2-1',
        textHi: 'Plug-and-Play Connector Framework: एडाप्टर पैटर्न आधारित प्लग-इन आर्किटेक्चर',
        textEn: 'Plug-and-Play Connector Framework: Strict Adapter Pattern implementation for modular ingestion',
        completed: true,
        priority: 'critical',
        techStack: 'TypeScript Interfaces, Schema Normalizer'
      },
      {
        id: 't-2-2',
        textHi: 'Connect Gateway (Docker/K8s): ग्राहक के निजी VPC में डेटा सुरक्षा सुनिश्चित करने वाला एजेंट',
        textEn: 'Connect Gateway: Isolated Docker/K8s micro-gateway keeping customer telemetry within private VPCs',
        completed: false,
        priority: 'critical',
        techStack: 'Docker, Kubernetes, gRPC Tunnel'
      },
      {
        id: 't-2-3',
        textHi: 'OAuth 2.0 + Zero-Trust Security: टोकन एन्क्रिप्शन और सख्त रोल-बेस्ड एक्सेस कंट्रोल',
        textEn: 'Zero-Trust Security Layer: AES-256 token encryption, OAuth 2.0 PKCE, continuous verification',
        completed: true,
        priority: 'critical',
        techStack: 'OAuth 2.0, OpenID Connect, RBAC'
      },
      {
        id: 't-2-4',
        textHi: 'शीर्ष 25 उच्च-मांग वाले कनेक्टर्स का MVP रोलआउट (PostgreSQL, Salesforce, Slack, आदि)',
        textEn: 'MVP Rollout of Top 25 High-Demand Connectors (Databases, CRMs, APIs)',
        completed: false,
        priority: 'critical',
        techStack: '25 Normalized Adapter Engines'
      }
    ]
  },
  {
    id: 'phase-3',
    num: '03',
    titleHi: 'बाजार लॉन्च और स्केलिंग',
    titleEn: 'Go-to-Market & Scaling',
    descriptionHi: 'बीटा से लेकर वैश्विक एंटरप्राइज़ स्केलिंग तक — चरणबद्ध लॉन्च रणनीति और $1M+ ARR लक्ष्य।',
    descriptionEn: 'Phased commercial rollout from 100 early adopters to 10,000+ customers and $1M+ ARR.',
    badgeHi: 'कमर्शियल विस्तार',
    badgeEn: 'Commercial Scale',
    targetMetricHi: '$1M+ वार्षिक ARR',
    targetMetricEn: '$1M+ Target ARR',
    tasks: [
      {
        id: 't-3-1',
        textHi: 'बीटा लॉन्च: 100-200 प्रारंभिक उपयोगकर्ताओं के साथ उत्पाद फीडबैक और बग फिक्सिंग',
        textEn: 'Beta Launch: Onboard 100-200 early tech adopters for telemetry refinement & UX hardening',
        completed: false,
        priority: 'high',
        techStack: 'Hacker News, ProductHunt, Dev.to'
      },
      {
        id: 't-3-2',
        textHi: 'आधिकारिक कमर्शियल लॉन्च: 1,000+ भुगतानकर्ता ग्राहक और पेड टियर सक्रियण',
        textEn: 'Official Commercial Launch: Scale to 1,000+ active paying accounts & self-serve subscriptions',
        completed: false,
        priority: 'critical',
        techStack: 'Stripe Billing, Google/LinkedIn Ads'
      },
      {
        id: 't-3-3',
        textHi: 'ग्लोबल एंटरप्राइज़ स्केलिंग: 10,000+ ग्राहक, यूरोपीय और एशियाई बाजारों में विस्तार',
        textEn: 'Global Enterprise Scaling: Expansion into EMEA/APAC, multi-region residency, $1M+ ARR',
        completed: false,
        priority: 'high',
        techStack: 'AWS / GCP / Azure Partner Directory'
      }
    ]
  }
];

export const EXECUTION_OPTIONS: ExecutionOption[] = [
  {
    id: '1',
    num: '01',
    tagHi: 'रचनात्मक एवं डिज़ाइन',
    tagEn: 'Creative & Design',
    titleHi: 'ब्रांड पहचान और UI/UX डिज़ाइन',
    titleEn: 'Brand Identity & UI/UX Design',
    descHi: 'Aura/Synapse के लिए लोगो, टैगलाइन, दृश्य दर्शन, रंग पैलेट और इंटरैक्टिव UI/UX वायरफ्रेम तैयार करना।',
    descEn: 'Architect the visual aesthetic, logo mark, design philosophy, typography scale, and responsive UI wireframes.',
    tasksHi: [
      'ब्रांड नाम का अंतिम चयन (Aura बनाम Synapse)',
      'लोगो मार्क डिज़ाइन (साइबर ग्रेडिएंट & न्यूरल वेव)',
      'डिजाइन सिस्टम व रंग पैलेट (Deep Space Obsidian & Cyan)',
      'टैगलाइन और सजीव भागीदार ब्रांड दर्शन'
    ],
    tasksEn: [
      'Final brand name resolution (Aura vs Synapse)',
      'Dynamic Logo Mark (Conic Gradient & Glowing Core)',
      'Comprehensive Design System (Obsidian, Cyan & Violet)',
      'Active Partner Brand Philosophy & Typography'
    ],
    longDescHi: 'यह विकल्प उन लोगों के लिए श्रेष्ठ है जो पहले Aura को बाज़ार में एक प्रीमियम, भविष्योन्मुखी और भरोसेमंद ब्रांड के रूप में स्थापित करना चाहते हैं। ग्राहक के मन में एक सजीव भागीदार की छवि बनाना पहला कदम है।',
    longDescEn: 'Tailored for teams prioritizing a stellar visual moat and clear positioning before engineering commits.',
    deliverablesHi: [
      'Figma-ready कॉम्पोनेन्ट डिज़ाइन किट',
      'ब्रांड गाइडलाइन बुकलेट (रंग, फॉन्ट, वॉइस)',
      'लाइव इंटरैक्टिव डैशबोर्ड वायरफ्रेम'
    ],
    deliverablesEn: [
      'Figma-ready component design kit',
      'Brand guideline booklet (Colors, Fonts, Voice tone)',
      'Live interactive dashboard wireframe prototype'
    ]
  },
  {
    id: '2',
    num: '02',
    tagHi: 'तकनीकी कोर',
    tagEn: 'Technical Core',
    titleHi: 'तकनीकी आर्किटेक्चर और MVP विकास',
    titleEn: 'Technical Architecture & MVP Development',
    descHi: 'मानकीकृत एडाप्टर पैटर्न, टॉप 5 कनेक्टर्स, Zero-Config Onboarding और AI Voice Dialer प्रोटोटाइप।',
    descEn: 'Build standardized connector framework, Adapter Pattern, Zero-Config engine, and Twilio+LLM Voice Dialer.',
    tasksHi: [
      'एडाप्टर पैटर्न का ऑब्जेक्ट-ओरिएंटेड डिज़ाइन',
      'शीर्ष 5 कनेक्टर्स (PostgreSQL, Sheets, Salesforce, Slack, Shopify)',
      'Zero-Configuration Onboarding इंजन (प्राकृतिक भाषा इनपुट)',
      'AI Voice Dialer & Agent (Twilio + LLM + CRM सिंक)'
    ],
    tasksEn: [
      'Object-oriented Adapter Pattern specification',
      'Top 5 Core Connectors (Postgres, Sheets, Salesforce, Slack, Shopify)',
      'Zero-Configuration Onboarding engine (Natural Language Intent)',
      'AI Voice Dialer & Agent prototype (Twilio + LLM + CRM Sync)'
    ],
    longDescHi: 'यह विकल्प सीधे उत्पाद निर्माण पर केंद्रित है। इसमें डेटा फ्लो, एडाप्टर सुरक्षा और स्वायत्त एआई एजेंट के प्रोटोटाइप को कोड में वास्तविकता में बदला जाएगा।',
    longDescEn: 'Direct engineering trajectory constructing the core ingestion pipeline, unified schema, and agentic workflows.',
    deliverablesHi: [
      'मानकीकृत कनेक्टर SDK एवं एडाप्टर कोड',
      'वर्किंग Zero-Config पार्सर और हैंडशेक डेमो',
      'वॉयस डायलर कॉल सिमुलेटर व CRM ट्रिगर'
    ],
    deliverablesEn: [
      'Standardized connector SDK & adapter code',
      'Working Zero-Config parser & handshake demo',
      'Voice dialer call simulator & CRM trigger'
    ]
  },
  {
    id: '3',
    num: '03',
    tagHi: 'व्यापार एवं GTM',
    tagEn: 'Business & GTM',
    titleHi: 'व्यापार योजना और मार्केटिंग रणनीति',
    titleEn: 'Business Plan & Marketing Strategy',
    descHi: 'राजस्व मॉडल (Freemium, Subscription, Enterprise), GTM फनल, और $1M ARR तक पहुंचने का रोडमैप।',
    descEn: 'Monetization modeling (Freemium, Subscriptions, Enterprise), GTM acquisition channels, and $1M ARR roadmap.',
    tasksHi: [
      'राजस्व मॉडल का गणितीय मूल्यांकन (ACV, Churn, LTV)',
      'चरणबद्ध लॉन्च रणनीति (100 बीटा → 1k लॉन्च → 10k स्केल)',
      'मार्केटिंग चैनल मैट्रिक्स (SEO, Dev Community, Ads)',
      'लक्ष्य ग्राहक प्रोफाइल (SMBs, Enterprises, Developers)'
    ],
    tasksEn: [
      'Mathematical monetization modeling (ACV, Churn, LTV)',
      'Phased GTM roadmap (100 Beta → 1k Launch → 10k Scale)',
      'Marketing channel matrix (SEO, Dev Community, Ads)',
      'Target customer segmentation (SMBs, Enterprises, Developers)'
    ],
    longDescHi: 'यह विकल्प व्यावसायिक सफलता, निवेश रणनीति और आय स्रोतों को सुरक्षित करने के लिए आदर्श है। इसमें मूल्य निर्धारण, ग्राहक अर्जन लागत (CAC) और स्केलिंग मेट्रिक्स का विश्लेषण शामिल है।',
    longDescEn: 'Engineered for commercial readiness, pricing tiers, customer acquisition economics, and rapid global ARR expansion.',
    deliverablesHi: [
      'इंटरैक्टिव ARR एवं यूनिट इकोनॉमिक्स कैलकुलेटर',
      'Go-To-Market 90-दिन का विस्तृत टाइमलाइन',
      'पार्टनरशिप व क्लाउड मार्केटप्लेस रणनीति'
    ],
    deliverablesEn: [
      'Interactive ARR & unit economics calculator',
      'Detailed 90-day Go-To-Market timeline',
      'Cloud marketplace partnership blueprint'
    ]
  }
];

export const REVENUE_TIERS: RevenueTier[] = [
  {
    id: 'freemium',
    symbol: '₹',
    nameHi: 'Freemium (निःशुल्क)',
    nameEn: 'Freemium',
    price: '$0 / माह',
    targetHi: 'SMBs, स्टार्टअप्स और व्यक्तिगत डेवलपर्स',
    targetEn: 'SMBs, Early Startups & Developers',
    descHi: 'शून्य प्रवेश बाधा के साथ बुनियादी कनेक्टर्स और 1,000 मासिक इवेंट्स।',
    descEn: 'Zero barrier to entry with core connectors and up to 1,000 automated events/mo.',
    highlightsHi: [
      '5 बुनियादी कनेक्टर्स (Sheets, Slack, Gmail...)',
      '1,000 मासिक वर्कफ़्लो इवेंट्स',
      'समुदाय आधारित सहायता',
      'शून्य सेटअप शुल्क'
    ],
    highlightsEn: [
      '5 Basic Connectors (Sheets, Slack, Webhooks)',
      '1,000 automated workflow events/mo',
      'Community discord support',
      'Instant zero setup barrier'
    ]
  },
  {
    id: 'subscription',
    symbol: '$',
    nameHi: 'Professional Subscription',
    nameEn: 'Professional Subscription',
    price: '$29 - $299 / माह',
    targetHi: 'मध्यम स्तर के बढ़ते व्यवसाय (Mid-Market)',
    targetEn: 'Growing Businesses & Mid-Market',
    descHi: 'सभी 25+ कनेक्टर्स, AI Voice Dialer और प्रेडिक्टिव ऑटोमेशन।',
    descEn: 'Full library of 25+ connectors, autonomous voice dialer, and self-healing pipelines.',
    highlightsHi: [
      'शीर्ष 25+ सभी कनेक्टर्स तक असीमित पहुंच',
      'AI Voice Dialer (100 मिनट/माह शामिल)',
      'Self-Healing Workflows और स्वतः रिकवरी',
      'प्राथमिकता तकनीकी सहायता (99.9% SLA)'
    ],
    highlightsEn: [
      'Unrestricted access to all 25+ connectors',
      'Autonomous Voice Dialer (100 min/mo included)',
      'Self-Healing Workflows & instant auto-recovery',
      'Priority customer support with 99.9% uptime SLA'
    ]
  },
  {
    id: 'enterprise',
    symbol: '∞',
    nameHi: 'Enterprise + Pay-As-You-Go',
    nameEn: 'Enterprise & Pay-As-You-Go',
    price: 'Custom ($1,200+/माह)',
    targetHi: 'बड़ी कंपनियाँ एवं कस्टम स्केलिंग जरूरतें',
    targetEn: 'Enterprises & Large Scale Developers',
    descHi: 'Connect Gateway ऑन-प्रिमाइसेस/प्राइवेट VPC डिप्लॉयमेंट और असीमित क्षमता।',
    descEn: 'On-premise / Private VPC Connect Gateway, dedicated support, and custom volume API pricing.',
    highlightsHi: [
      'Connect Gateway (Docker/K8s) प्राइवेट VPC पर',
      'कस्टम एडाप्टर विकास और कस्टम डेटा स्कीमा',
      'SOC2 / HIPAA / GDPR अनुपालन सुरक्षा',
      'समर्पित समाधान आर्किटेक्ट और 24/7 हॉटलाइन'
    ],
    highlightsEn: [
      'Connect Gateway (Docker/K8s) in customer VPC',
      'Bespoke adapter generation & custom schema',
      'SOC2 / HIPAA / GDPR compliance posture',
      'Dedicated Solutions Architect & 24/7 hotline'
    ]
  }
];
