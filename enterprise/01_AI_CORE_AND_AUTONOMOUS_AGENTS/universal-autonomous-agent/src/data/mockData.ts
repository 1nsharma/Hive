import { DigitalTwinProfile, PerceptionEvent, MemoryNode, MCPTool, RoadmapPhase, AuditLogEntry } from '../types';

export const INITIAL_PROFILES: DigitalTwinProfile[] = [
  {
    id: 'user-amit-01',
    name: 'Amit Sharma',
    role: 'AI Founder & Systems Architect',
    organization: 'NeuralVentures Labs',
    avatarSeed: 'Amit',
    bio: 'Building next-gen autonomous multi-agent orchestration frameworks, Model Context Protocol (MCP) toolchains, and scalable LLM intelligence systems.',
    toneOfVoice: 'visionary',
    primaryGoals: [
      'Expand strategic AI founder network across Silicon Valley & Bengaluru',
      'Publish high-signal technical breakdowns of MCP & multi-agent architectures',
      'Automate GitHub commit-to-LinkedIn pipeline with human approval',
      'Continuously self-learn and optimize outreach conversion rates'
    ],
    guardrails: [
      'Never publish to social channels without explicit HITL approval',
      'Never send emails with budget commitments over $0 without confirmation',
      'Strictly avoid generic marketing fluff; emphasize technical depth & metrics'
    ],
    connectedSources: {
      github: true,
      linkedin: true,
      gmail: true,
      calendar: true,
      crm: false,
      customWebhook: true
    },
    heuristicWeights: {
      autonomyThreshold: 72,
      riskTolerance: 45,
      thoroughness: 88,
      learningAdaptability: 94
    }
  },
  {
    id: 'user-elena-02',
    name: 'Elena Rostova',
    role: 'Principal DevOps & Site Reliability Engineer',
    organization: 'KubeMesh Cloud',
    avatarSeed: 'Elena',
    bio: 'Architecting distributed Kubernetes clusters, zero-trust infrastructure, and autonomous CI/CD remediation bots.',
    toneOfVoice: 'analytical',
    primaryGoals: [
      'Detect anomalous cluster metrics before SLA breaches occur',
      'Auto-generate terraform diffs and rollback plans for review'
    ],
    guardrails: [
      'Zero unauthorized write access to production namespaces',
      'Always log full JSON audit trace for any simulated cluster intervention'
    ],
    connectedSources: {
      github: true,
      linkedin: false,
      gmail: true,
      calendar: true,
      crm: false,
      customWebhook: true
    },
    heuristicWeights: {
      autonomyThreshold: 55,
      riskTolerance: 20,
      thoroughness: 98,
      learningAdaptability: 82
    }
  },
  {
    id: 'user-marcus-03',
    name: 'Marcus Vance',
    role: 'Growth & Product Strategy Director',
    organization: 'Aegis Growth Partners',
    avatarSeed: 'Marcus',
    bio: 'Scaling B2B enterprise AI products through data-backed positioning, competitor intelligence, and automated lead discovery.',
    toneOfVoice: 'assertive',
    primaryGoals: [
      'Track competitor pricing and weekly feature release movements',
      'Draft high-conversion founder outreach sequences for seed-stage startups'
    ],
    guardrails: [
      'Verify all lead contact information against company domain guidelines',
      'Never send cold outreach on weekends'
    ],
    connectedSources: {
      github: false,
      linkedin: true,
      gmail: true,
      calendar: false,
      crm: true,
      customWebhook: false
    },
    heuristicWeights: {
      autonomyThreshold: 80,
      riskTolerance: 65,
      thoroughness: 80,
      learningAdaptability: 90
    }
  }
];

export const INITIAL_PERCEPTION_EVENTS: PerceptionEvent[] = [
  {
    id: 'perc-01',
    tenantId: 'user-amit-01',
    source: 'github',
    title: 'Repo Push: autonomous-orchestrator-core',
    summary: 'Pushed commit 4f981e2: "Implemented distributed LangGraph task DAG and streaming MCP tool protocol"',
    timestamp: '12 minutes ago',
    payload: { commits: 3, branch: 'main', repo: 'amit/autonomous-orchestrator' },
    importanceScore: 9
  },
  {
    id: 'perc-02',
    tenantId: 'user-amit-01',
    source: 'linkedin',
    title: 'Network Activity Surge',
    summary: '6 founders in Agentic AI commented on your post discussing MCP protocol standardization.',
    timestamp: '45 minutes ago',
    payload: { impressions: 1840, keyProfiles: ['Devin S. (YC W24)', 'Aarav M. (TensorScale)'] },
    importanceScore: 8
  },
  {
    id: 'perc-03',
    tenantId: 'user-amit-01',
    source: 'gmail',
    title: 'Inbound Inquiry: AI Engineering Summit',
    summary: 'Invitation received to deliver a keynote on "Self-Deciding Autonomous Multi-Tenant Agents".',
    timestamp: '2 hours ago',
    payload: { sender: 'speakers@aisummit.io', subject: 'Keynote Invitation: AI Summit 2026' },
    importanceScore: 8
  },
  {
    id: 'perc-04',
    tenantId: 'user-amit-01',
    source: 'web_scraper',
    title: 'Competitor Intelligence Digest',
    summary: '3 new venture-backed Agent platforms announced Anthropic MCP server integrations.',
    timestamp: '4 hours ago',
    payload: { scrapedSources: 14, highRelevanceMatches: 3 },
    importanceScore: 7
  }
];

export const INITIAL_MEMORY_NODES: MemoryNode[] = [
  {
    id: 'mem-01',
    tenantId: 'user-amit-01',
    type: 'semantic_rag',
    title: 'Core Philosophy on Autonomous AGI Agents',
    content: 'An autonomous agent must possess recursive goal decomposition, perception memory recall, and a human-in-the-loop validation barrier to prevent runaway automation.',
    tags: ['architecture', 'philosophy', 'AGI'],
    relevanceScore: 0.98,
    timestamp: 'Yesterday'
  },
  {
    id: 'mem-02',
    tenantId: 'user-amit-01',
    type: 'learned_heuristic',
    title: 'Learned Heuristic: LinkedIn Outreach Engagement',
    content: 'Posts with reproducible architecture diagrams and GitHub commit links generate 3.8x more verified founder responses than text-only updates.',
    tags: ['social_strategy', 'learned_weight', 'heuristics'],
    relevanceScore: 0.94,
    timestamp: '2 days ago'
  },
  {
    id: 'mem-03',
    tenantId: 'user-amit-01',
    type: 'episodic',
    title: 'Previous Mission: Dev Summit Speaker Outreach',
    content: 'Agent autonomously parsed attendee roster, extracted 12 speaker bios via MCP SerpApi, and drafted personalized notes. User approved 11/12 with minor edits.',
    tags: ['mission_history', 'outreach', 'speakers'],
    relevanceScore: 0.89,
    timestamp: '3 days ago'
  },
  {
    id: 'mem-04',
    tenantId: 'user-amit-01',
    type: 'learned_heuristic',
    title: 'Learned Heuristic: Tone Calibration',
    content: 'User prefers concise, authoritative technical phrasing. Deprecate hyperbole like "revolutionary" or "game-changing". Stick to benchmarks and architectural trade-offs.',
    tags: ['tone', 'calibration', 'style_guide'],
    relevanceScore: 0.96,
    timestamp: '4 days ago'
  }
];

export const INITIAL_MCP_TOOLS: MCPTool[] = [
  {
    id: 'mcp-github-commits',
    name: 'GitHub Commit Reader',
    serverUri: 'mcp://github.local/commits/read',
    category: 'perception',
    description: 'Fetches recent commits, repository diffs, pull request comments, and author metadata via GitHub API.',
    riskLevel: 'low',
    requiredScopes: ['repo:read'],
    isEnabled: true,
    parametersSchema: { repo: 'string', branch: 'string', limit: 'number' }
  },
  {
    id: 'mcp-web-search',
    name: 'Deep Web & Founder Intelligence (SerpAPI)',
    serverUri: 'mcp://search.local/intelligence/query',
    category: 'perception',
    description: 'Queries public search engines, LinkedIn profiles, tech blogs, and research papers for real-time grounding.',
    riskLevel: 'low',
    requiredScopes: ['search:execute'],
    isEnabled: true,
    parametersSchema: { query: 'string', numResults: 'number', filterDomain: 'string' }
  },
  {
    id: 'mcp-social-draft',
    name: 'Social Media Post Drafter',
    serverUri: 'mcp://social.local/posts/draft',
    category: 'reasoning',
    description: 'Formats high-signal LinkedIn and X/Twitter technical posts according to the Digital Twin persona.',
    riskLevel: 'low',
    requiredScopes: ['social:draft'],
    isEnabled: true,
    parametersSchema: { topic: 'string', style: 'string', hashtags: 'array' }
  },
  {
    id: 'mcp-social-publish',
    name: 'Social Media Publisher',
    serverUri: 'mcp://social.local/posts/publish',
    category: 'action',
    description: 'Publishes approved content directly to LinkedIn or Twitter feeds. STRICT HITL GATE REQUIRED.',
    riskLevel: 'high',
    requiredScopes: ['social:write', 'social:publish'],
    isEnabled: true,
    parametersSchema: { channel: 'string', content: 'string', scheduledTime: 'string' }
  },
  {
    id: 'mcp-email-outreach',
    name: 'Personalized Email Drafter',
    serverUri: 'mcp://comms.local/email/draft',
    category: 'reasoning',
    description: 'Drafts contextual emails referencing recipient latest papers, repos, or news items.',
    riskLevel: 'low',
    requiredScopes: ['mail:draft'],
    isEnabled: true,
    parametersSchema: { recipient: 'string', subject: 'string', context: 'string' }
  },
  {
    id: 'mcp-email-send',
    name: 'Automated Email Sender',
    serverUri: 'mcp://comms.local/email/send',
    category: 'action',
    description: 'Sends emails via connected SMTP / Gmail API. STRICT HITL GATE REQUIRED.',
    riskLevel: 'high',
    requiredScopes: ['mail:send'],
    isEnabled: true,
    parametersSchema: { recipient: 'string', subject: 'string', body: 'string' }
  },
  {
    id: 'mcp-code-sandbox',
    name: 'Python / TS Sandbox Runner',
    serverUri: 'mcp://execution.local/sandbox/run',
    category: 'action',
    description: 'Executes mathematical calculations, data analysis, graph generation, and schema validation safely.',
    riskLevel: 'medium',
    requiredScopes: ['sandbox:exec'],
    isEnabled: true,
    parametersSchema: { runtime: 'string', code: 'string', timeoutSec: 'number' }
  },
  {
    id: 'mcp-notion-kb',
    name: 'Notion / Markdown Knowledge Base Sync',
    serverUri: 'mcp://knowledge.local/notion/sync',
    category: 'action',
    description: 'Stores summaries, meeting notes, and learned insights directly into user Notion workspace or markdown database.',
    riskLevel: 'low',
    requiredScopes: ['notion:write'],
    isEnabled: true,
    parametersSchema: { documentTitle: 'string', markdownContent: 'string' }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '10:14:22',
    tenantId: 'user-amit-01',
    level: 'info',
    agentMonologue: 'Autonomous loop initialized. Listening to perception layer streams from GitHub & LinkedIn.',
    actionTaken: 'Connected to active perception listeners',
    toolUsed: 'mcp://github.local/commits/read',
    riskLevel: 'low',
    executionPayload: '{"status": "listening", "sources": ["github", "linkedin"]}'
  },
  {
    id: 'audit-002',
    timestamp: '10:15:05',
    tenantId: 'user-amit-01',
    level: 'decision',
    agentMonologue: 'Detected 3 commits on autonomous-orchestrator. Formulating goal hypothesis: draft architectural milestone post.',
    actionTaken: 'Heuristic Match: Commits > 2 and architectural diff contains LangGraph implementation.',
    riskLevel: 'low'
  },
  {
    id: 'audit-003',
    timestamp: '10:15:30',
    tenantId: 'user-amit-01',
    level: 'hitl',
    agentMonologue: 'Generated LinkedIn post draft. Action contains public publishing intent; routing to Human-in-the-Loop gate.',
    actionTaken: 'HITL Gate triggered. Action placed in pending approval queue.',
    toolUsed: 'mcp://social.local/posts/publish',
    riskLevel: 'high',
    executionPayload: '{"channel": "linkedin", "length": 420, "requiresApproval": true}'
  }
];

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    phase: 1,
    name: 'Core Orchestrator & Live Sandbox',
    timeline: 'Weeks 1-2 (Active Live)',
    status: 'current_live',
    tagline: 'Autonomous Goal Decomposition, MCP Tool Execution & HITL Safeguards',
    corePillars: [
      'Target Goal Parser: Converts any high-level objective into recursive DAG subtasks',
      'Dual Execution Modes: Fully Autonomous vs. Human-in-the-Loop Guarded',
      'Model Context Protocol (MCP) tool integration layer',
      'Real-time Perception & Working Memory integration'
    ],
    technicalSpecs: [
      'Express Node.js full-stack container running on Port 3000',
      'Google Gemini 3.8-flash for reasoning, reflection & planning',
      'Local vectorized memory simulation with dynamic cosine matching',
      'Instant interactive HITL approve/reject/modify workflow'
    ]
  },
  {
    phase: 2,
    name: 'Multi-Tenant Memory & Digital Twin Vectors',
    timeline: 'Weeks 3-4',
    status: 'next_phase',
    tagline: 'PostgreSQL + pgvector multi-tenant isolation and persistent RAG',
    corePillars: [
      'Isolated vector namespace per tenantId with row-level security (RLS)',
      'Digital Twin persona training: tone calibration, past successes, preferred frameworks',
      'Long-term episodic memory indexing with decay and relevance weighting'
    ],
    technicalSpecs: [
      'PostgreSQL with pgvector for high-dimensional embeddings',
      'Hierarchical clustering of past actions & outcome feedback',
      'Continuous background synchronization with Gmail/Slack/GitHub'
    ]
  },
  {
    phase: 3,
    name: 'Enterprise Dashboard & HITL Gateways',
    timeline: 'Weeks 5-6',
    status: 'planned',
    tagline: 'Collaborative approval queues, diff inspectors, and fine-grained OAuth scopes',
    corePillars: [
      'Multi-user review boards with team role-based access control (RBAC)',
      'Visual payload diffing and rollback simulators for sensitive changes',
      'Webhook notification bridges to mobile Slack / Telegram for instant approvals'
    ],
    technicalSpecs: [
      'Next.js 14 / Vite with Tailwind & headless UI',
      'Granular OAuth 2.0 permission scoping (Least Privilege Principle)',
      'Cryptographically signed audit logs for compliance & SOC2'
    ]
  },
  {
    phase: 4,
    name: 'Autonomous Loops & Self-Learning Swarms',
    timeline: 'Weeks 7-8',
    status: 'planned',
    tagline: 'Background cron daemons, BullMQ worker queues, and heuristic reinforcement',
    corePillars: [
      'Self-initiating proactive agents: wakes up on schedule, scans feeds, takes action',
      'Heuristic weight adaptation: self-learns which strategies achieve goals fastest',
      'Multi-agent delegation: Coordinator agent spawns Research, Coder, and Outreach sub-agents'
    ],
    technicalSpecs: [
      'Redis + BullMQ background job queues with jitter and retry backoffs',
      'Actor model supervisor tree with automated self-healing',
      'Monte Carlo Tree Search (MCTS) for complex multi-step decision paths'
    ]
  },
  {
    phase: 5,
    name: 'Universal AGI Horizon & Swarm Federation',
    timeline: 'Future Vision (AGI Milestone)',
    status: 'agi_horizon',
    tagline: 'Self-improving autonomous code synthesis & cross-organization agent federation',
    corePillars: [
      'Autonomous Code Evolution: Agent identifies its own bottlenecks and writes new MCP plugins',
      'Federated Agent Economy: Agents negotiate, contract, and exchange data with external agents',
      'General Purpose Transfer Learning: Digital Twin adapts from developer tasks to legal, finance & ops seamlessly'
    ],
    technicalSpecs: [
      'Self-reflective neural weight fine-tuning via synthetic feedback',
      'Decentralized MCP registry protocol with verified cryptographic safety proofs',
      'Safe alignment barriers and automated emergency circuit breakers'
    ]
  }
];

export const INITIAL_AGENT_WORKERS: import('../types').AgentWorker[] = [
  {
    id: 'worker-identity',
    name: 'Identity Agent',
    role: 'Digital Twin & Presence Curator',
    type: 'identity',
    avatarIcon: 'Fingerprint',
    description: 'Continuously discovers mentions, verifies personal entities, maps identity deltas, and curates high-signal thought leadership.',
    status: 'running',
    policy: {
      read: ['public_web', 'github', 'linkedin', 'analytics'],
      create: ['drafts', 'identity_deltas', 'positioning_reports'],
      execute: ['none'],
      requires_approval: ['publish_post', 'update_bio', 'broadcast_announcement']
    },
    activeWorkload: 'Scanning Google Scholar & GitHub for latest Amit Sharma mentions',
    metrics: {
      tasksCompleted: 48,
      accuracyScore: 98,
      hoursSaved: 34
    },
    lastActive: 'Just now'
  },
  {
    id: 'worker-research',
    name: 'Research Agent',
    role: 'Deep Tech & Market Intelligence',
    type: 'research',
    avatarIcon: 'Search',
    description: 'Surveys arXiv, Anthropic/OpenAI updates, competitor repos, and market signals to extract actionable technological insights.',
    status: 'running',
    policy: {
      read: ['public_web', 'arxiv', 'sec_filings', 'github_trending'],
      create: ['research_briefs', 'benchmark_reports'],
      execute: ['sandbox_python_eval'],
      requires_approval: ['none']
    },
    activeWorkload: 'Synthesizing Model Context Protocol 2.0 streaming benchmarks',
    metrics: {
      tasksCompleted: 82,
      accuracyScore: 95,
      hoursSaved: 56
    },
    lastActive: '2m ago'
  },
  {
    id: 'worker-content',
    name: 'Content Agent',
    role: 'Multi-Format Technical Writer',
    type: 'content',
    avatarIcon: 'PenTool',
    description: 'Translates raw code commits and research into polished LinkedIn articles, Dev.to technical tutorials, and executive briefs.',
    status: 'running',
    policy: {
      read: ['git_commits', 'research_notes', 'brand_guidelines'],
      create: ['linkedin_posts', 'dev_to_drafts', 'x_threads', 'changelogs'],
      execute: ['none'],
      requires_approval: ['publish', 'schedule_post']
    },
    activeWorkload: 'Drafting deep dive: "Why We Switched from Stateless Tools to Stateful MCP Servers"',
    metrics: {
      tasksCompleted: 64,
      accuracyScore: 96,
      hoursSaved: 42
    },
    lastActive: '5m ago'
  },
  {
    id: 'worker-growth',
    name: 'Growth Agent',
    role: 'Network Expansion & BD Lead',
    type: 'growth',
    avatarIcon: 'TrendingUp',
    description: 'Identifies high-fit AI founders, MSME tech leaders, and investors; drafts personalized connection notes and tracks response velocity.',
    status: 'running',
    policy: {
      read: ['linkedin_sales_nav', 'apollo_crm', 'github_contributors'],
      create: ['personalized_outreach_drafts', 'pipeline_summaries'],
      execute: ['none'],
      requires_approval: ['send_outreach', 'sync_crm_lead']
    },
    activeWorkload: 'Identified 8 AI founders building on MCP; prepared customized warm intros',
    metrics: {
      tasksCompleted: 39,
      accuracyScore: 92,
      hoursSaved: 28
    },
    lastActive: '12m ago'
  },
  {
    id: 'worker-coding',
    name: 'Coding Agent',
    role: 'Autonomous Developer & MCP Engineer',
    type: 'coding',
    avatarIcon: 'Code2',
    description: 'Inspects repositories, generates architectural boilerplates, verifies unit tests, and implements custom MCP tool endpoints.',
    status: 'idle',
    policy: {
      read: ['git_repos', 'ast_trees', 'issue_trackers'],
      create: ['branch_pr_diffs', 'unit_tests', 'mcp_tool_schemas'],
      execute: ['container_sandbox_run', 'lint_checker'],
      requires_approval: ['push_to_main', 'merge_pull_request', 'deploy_production']
    },
    activeWorkload: 'Idle (Awaiting code synthesis mission)',
    metrics: {
      tasksCompleted: 112,
      accuracyScore: 99,
      hoursSaved: 85
    },
    lastActive: '1h ago'
  },
  {
    id: 'worker-business',
    name: 'Business Agent',
    role: 'Ops, Financials & Metric Tracker',
    type: 'business',
    avatarIcon: 'Briefcase',
    description: 'Tracks cloud token expenditures, compute unit costs, partnership inquiries, and strategic OKR milestone velocity.',
    status: 'running',
    policy: {
      read: ['cloud_billing_api', 'stripe_webhooks', 'calendar_schedules'],
      create: ['weekly_burn_reports', 'investor_bulletins'],
      execute: ['none'],
      requires_approval: ['export_financial_pdf']
    },
    activeWorkload: 'Analyzing compute cost savings from local vs cloud LLM routing',
    metrics: {
      tasksCompleted: 27,
      accuracyScore: 97,
      hoursSaved: 19
    },
    lastActive: '25m ago'
  },
  {
    id: 'worker-security',
    name: 'Security Agent',
    role: 'Zero-Trust Policy & Guardrail Auditor',
    type: 'security',
    avatarIcon: 'ShieldAlert',
    description: 'Monitors agent permissions in real-time, blocks unauthorized tool scopes, flags API token leaks, and enforces safety boundaries.',
    status: 'running',
    policy: {
      read: ['all_internal_audit_logs', 'tool_execution_traces', 'oauth_token_vault'],
      create: ['security_advisories', 'containment_policies'],
      execute: ['emergency_killswitch', 'revoke_oauth_token'],
      requires_approval: ['revoke_oauth_token']
    },
    activeWorkload: 'Zero-trust verification active: All MCP tools audited and sandboxed',
    metrics: {
      tasksCompleted: 154,
      accuracyScore: 100,
      hoursSaved: 60
    },
    lastActive: 'Active (Realtime Sentinel)'
  },
  {
    id: 'worker-assistant',
    name: 'Personal Assistant',
    role: 'Executive Schedule & Communication Triage',
    type: 'assistant',
    avatarIcon: 'CalendarClock',
    description: 'Triages inbound executive emails, schedules high-priority technical syncs, summarizes meeting transcripts, and organizes action items.',
    status: 'running',
    policy: {
      read: ['gmail_inbox', 'google_calendar', 'slack_dms'],
      create: ['calendar_invites', 'draft_email_replies'],
      execute: ['none'],
      requires_approval: ['send_email', 'confirm_calendar_booking']
    },
    activeWorkload: '3 high-priority investor emails triaged; draft replies waiting in Review Plane',
    metrics: {
      tasksCompleted: 73,
      accuracyScore: 94,
      hoursSaved: 38
    },
    lastActive: '8m ago'
  }
];

export const INITIAL_IDENTITY_ENTITIES: import('../types').IdentityEntity[] = [
  {
    id: 'entity-1',
    tenantId: 'user-amit-01',
    source: 'github',
    title: 'amit-sharma/mcp-autonomous-orchestrator',
    snippet: 'Open source repository: Core reactive DAG executor with dynamic Model Context Protocol client and HITL gates.',
    url: 'https://github.com/amit-sharma/mcp-autonomous-orchestrator',
    verificationStatus: 'CONFIRMED',
    discoveredAt: 'Today, 07:15 AM',
    deltaIdentified: 'New commit merged: Streaming SSE transport support. Star count grew by +68 stars in 48 hours.',
    confidence: 100
  },
  {
    id: 'entity-2',
    tenantId: 'user-amit-01',
    source: 'news',
    title: 'The AI Dispatch: Top 10 Multi-Agent Frameworks to Watch in 2026',
    snippet: 'Amit Sharma (NeuralVentures Labs) highlights the transition from prompt engineering to long-running asynchronous agent memory loops.',
    url: 'https://theaidispatch.tech/2026/multi-agent-top10',
    verificationStatus: 'CONFIRMED',
    discoveredAt: 'Yesterday, 04:30 PM',
    deltaIdentified: 'Featured in external editorial roundup with direct quote on AGI safety.',
    confidence: 96
  },
  {
    id: 'entity-3',
    tenantId: 'user-amit-01',
    source: 'google_scholar',
    title: 'Pre-print: "Stateful Heuristic Recalibration in Autonomous Agent Swarms"',
    snippet: 'Authors: Amit Sharma, E. Rostova. Explores mathematical feedback mechanisms for self-tuning LLM agent behavior.',
    url: 'https://scholar.google.com/citations?view_op=view_citation&citation_for_view=amit_sharma_swarm_2026',
    verificationStatus: 'CONFIRMED',
    discoveredAt: '3 days ago',
    deltaIdentified: 'Cited by 3 new research labs studying multi-agent coordination.',
    confidence: 99
  },
  {
    id: 'entity-4',
    tenantId: 'user-amit-01',
    source: 'linkedin',
    title: 'Amit Sharma invited as Keynote Speaker: India AI Summit 2026',
    snippet: 'Invitation sent to NeuralVentures Labs: Session on "Building Resilient Agent Operating Systems with Zero-Trust".',
    url: 'https://linkedin.com/events/india-ai-summit-2026',
    verificationStatus: 'POSSIBLE',
    discoveredAt: 'Today, 06:10 AM',
    deltaIdentified: 'Inbound speaker invitation matching profile expertise; needs founder confirmation.',
    confidence: 84
  },
  {
    id: 'entity-5',
    tenantId: 'user-amit-01',
    source: 'web',
    title: 'Amit Sharma Realty - Luxury Villa Properties Gurgaon',
    snippet: 'Real estate advisory services for residential plots and commercial towers across NCR region.',
    url: 'https://amitsharmarealty.in',
    verificationStatus: 'NOT_YOU',
    discoveredAt: 'Today, 05:45 AM',
    deltaIdentified: 'Disambiguation filtered: Same name, completely distinct sector (Real Estate vs Deep AI Systems).',
    confidence: 99
  },
  {
    id: 'entity-6',
    tenantId: 'user-amit-01',
    source: 'x',
    title: 'Discussion thread on X: "Who is building open-source MCP servers that actually work?"',
    snippet: '@dev_lead mentions: Check out Amit Sharma\'s work at NeuralVentures; their memory adapter handles multi-agent DAGs smoothly.',
    url: 'https://x.com/dev_lead/status/1982348912',
    verificationStatus: 'CONFIRMED',
    discoveredAt: 'Today, 07:40 AM',
    deltaIdentified: 'High-signal peer recommendation thread with 120+ retweets.',
    confidence: 94
  }
];

export const INITIAL_GROWTH_PROSPECTS: import('../types').IdentityGrowthProspect[] = [
  {
    id: 'prospect-1',
    name: 'Dr. Priya Narang',
    role: 'Founder & CEO',
    organization: 'CognitiveScale AI (Bengaluru & SF)',
    category: 'ai_founder',
    relevanceScore: 98,
    draftedOutreachMessage: 'Hi Dr. Priya — noticed CognitiveScale recently opened your autonomous agent evaluation benchmarks. At NeuralVentures Labs, we just solved stateful memory persistence across long-running MCP toolchains (preventing runaway hallucination). Would love to swap notes on agent reliability over a quick virtual coffee this week.',
    status: 'drafted',
    outreachChannel: 'linkedin'
  },
  {
    id: 'prospect-2',
    name: 'Rajesh Singhal',
    role: 'VP of Digital Transformation',
    organization: 'Apex Manufacturing Solutions (MSME Leader)',
    category: 'msme_tech_leader',
    relevanceScore: 92,
    draftedOutreachMessage: 'Hello Rajesh — saw your interview on automating plant telemetry with AI agents. Many industrial teams struggle when agents execute without human guardrails. We built an Agent OS with deterministic HITL gates that allows autonomous reporting while safeguarding equipment commands. Would be glad to share our architecture diagram if helpful.',
    status: 'drafted',
    outreachChannel: 'email'
  },
  {
    id: 'prospect-3',
    name: 'Sarah Chen',
    role: 'Partner (AI & Developer Tools)',
    organization: 'Vanguard DeepTech Capital',
    category: 'investor',
    relevanceScore: 95,
    draftedOutreachMessage: 'Hi Sarah — following your thesis on "Operating Systems for Autonomous Work". We have implemented a multi-tenant Agent OS that coordinates specialized worker agents with self-learning heuristic feedback and Model Context Protocol tooling. Our open-source repo just crossed 4,000 developer stars. Happy to share our technical memo if you are tracking this space.',
    status: 'drafted',
    outreachChannel: 'linkedin'
  },
  {
    id: 'prospect-4',
    name: 'Alexandre Dubois',
    role: 'Principal LLM Systems Engineer',
    organization: 'OpenSource Swarm Initiative',
    category: 'researcher',
    relevanceScore: 89,
    draftedOutreachMessage: 'Salut Alexandre — loved your paper on async multi-agent convergence. We noticed in our experiments that updating dynamic heuristic weights post-reflection speeds up goal completion by 3.2x compared to static prompt chains. Are you exploring MCP tool standardization in your next release?',
    status: 'approved',
    outreachChannel: 'x'
  }
];

export const INITIAL_GENERATED_CONTENT: import('../types').IdentityGeneratedContent[] = [
  {
    id: 'content-1',
    format: 'linkedin',
    title: 'Stop Building Chatbots: The Shift to Operating Systems for Autonomous Work',
    body: `A chatbot waits for you to type. An Agent OS observes your environment, identifies what changed, plans next steps, executes via tools, and learns from every outcome.\n\nOver the past 6 months at NeuralVentures Labs, we moved away from rigid single-turn AI prompts. Instead, we built a 6-phase autonomous loop:\n1. Observe (Web, GitHub, Email, APIs)\n2. Understand (What changed? What matters? What is mine?)\n3. Plan (Recursive task DAG decomposition)\n4. Act (Model Context Protocol tool execution)\n5. Verify (Deterministic Human-in-the-Loop approval gate)\n6. Learn (Dynamic heuristic weight recalibration)\n\nAutonomy doesn't mean unrestricted access. It requires strict capability policies (Copilot vs Supervised vs Autonomous vs Lockdown modes).\n\nIf you're building in the agent space, are you treating your agents as assistants or as an operating system?`,
    tags: ['ArtificialIntelligence', 'AgentOS', 'ModelContextProtocol', 'SoftwareEngineering', 'AutonomousAgents'],
    sourcesUsed: ['GitHub Commits', 'Research Notes on Agent OS', 'Anthropic MCP Spec'],
    status: 'pending_approval',
    engagementMetrics: {
      views: 3420,
      reactions: 218,
      replies: 42,
      leadConversions: 8
    }
  },
  {
    id: 'content-2',
    format: 'dev_to',
    title: 'Architecting an Autonomous Multi-Tenant Agent OS in TypeScript',
    body: `Deep dive into how we built an Agent OS that scales from individual developer workflows to enterprise multi-tenant swarms without data leakage. Covers: 1) Vector memory segmentation; 2) MCP client connection pooling; 3) Zero-trust permission auditing. Full code snippets included.`,
    tags: ['typescript', 'ai', 'architecture', 'webdev'],
    sourcesUsed: ['src/server.ts', 'docs/agent-os-architecture.md'],
    status: 'draft'
  },
  {
    id: 'content-3',
    format: 'x_post',
    title: 'Why your AI agent needs a "Lockdown Mode"',
    body: `Unchecked agent autonomy is a disaster waiting to happen. Every production agent needs 4 operating modes:\n\n1. COPILOT (Every action approved)\n2. SUPERVISED (Low-risk auto, high-risk gate)\n3. AUTONOMOUS (Within policy boundaries)\n4. LOCKDOWN (Emergency kill switch)\n\nSecurity is what separates a toy from an enterprise platform.`,
    tags: ['AIAgents', 'CyberSecurity', 'BuildInPublic'],
    sourcesUsed: ['Zero-Trust Architecture Spec'],
    status: 'pending_approval'
  },
  {
    id: 'content-4',
    format: 'project_update',
    title: 'NeuralVentures Agent OS: Sprint 14 Milestone Report',
    body: `Key accomplishments: Implemented 8 autonomous worker agents (Identity, Research, Content, Growth, Coding, Business, Security, Assistant); integrated multi-channel bot dispatch (WhatsApp, Slack, Telegram); stabilized streaming MCP tool runtime.`,
    tags: ['Changelog', 'SprintUpdate', 'AgentOS'],
    sourcesUsed: ['Sprint 14 Git Log'],
    status: 'published'
  }
];

export const INITIAL_REVIEW_ITEMS: import('../types').ReviewControlItem[] = [
  {
    id: 'ctrl-1',
    tenantId: 'user-amit-01',
    agentWorkerId: 'worker-content',
    agentWorkerName: 'Content Agent',
    proposedAction: 'Publish Thought Leadership Article to LinkedIn',
    riskLevel: 'high',
    reason: 'New major commit on streaming MCP client warrants public architectural breakdown to solidify digital brand positioning.',
    dataUsed: [
      'GitHub commit 8b10f24',
      'Priya Narang AI benchmarking report',
      'Amit Sharma identity tone guidelines'
    ],
    toolUsed: 'mcp://social.local/posts/publish',
    expectedResult: 'Post live on LinkedIn to 14,500+ followers; estimated 2,500+ impressions and 40+ inbound connection requests.',
    actualResult: undefined,
    payload: {
      channel: 'linkedin',
      format: 'article',
      preview: 'Stop Building Chatbots: The Shift to Operating Systems for Autonomous Work...\n\n(Full article prepared with 5 key architectural diagrams)'
    },
    diffPreview: `+ [LinkedIn Post] "Stop Building Chatbots: The Shift to Operating Systems for Autonomous Work"\n+ Tags: #ArtificialIntelligence #AgentOS #ModelContextProtocol\n+ Visibility: Public`,
    status: 'pending',
    createdAt: '12m ago',
    canRollback: true
  },
  {
    id: 'ctrl-2',
    tenantId: 'user-amit-01',
    agentWorkerId: 'worker-growth',
    agentWorkerName: 'Growth Agent',
    proposedAction: 'Send Personalized Warm Outreach to CognitiveScale CEO',
    riskLevel: 'medium',
    reason: 'Strategic synergy: CognitiveScale is benchmarking multi-agent memory; our framework directly solves their latency bottleneck.',
    dataUsed: [
      'Dr. Priya Narang public interview',
      'NeuralVentures MCP memory benchmarks'
    ],
    toolUsed: 'mcp://comms.local/email/send',
    expectedResult: 'Direct founder-to-founder dialogue opened; 45% probability of exploratory partnership call.',
    payload: {
      recipient: 'priya@cognitivescale.ai',
      subject: 'Solving stateful memory in long-running agent toolchains',
      bodySnippet: 'Hi Dr. Priya — noticed CognitiveScale recently opened your autonomous agent evaluation benchmarks...'
    },
    diffPreview: `+ OUTBOUND_EMAIL to: priya@cognitivescale.ai\n+ Subject: Solving stateful memory in long-running agent toolchains`,
    status: 'pending',
    createdAt: '28m ago',
    canRollback: false
  },
  {
    id: 'ctrl-3',
    tenantId: 'user-amit-01',
    agentWorkerId: 'worker-coding',
    agentWorkerName: 'Coding Agent',
    proposedAction: 'Deploy MCP Webhook Dispatcher to Cloud Run',
    riskLevel: 'critical',
    reason: 'Automated CI/CD pipeline generated updated ingress container for WhatsApp and Slack bot triggers.',
    dataUsed: [
      'Container Dockerfile',
      'Zero-trust security scanner report'
    ],
    toolUsed: 'mcp://execution.local/cloud/deploy',
    expectedResult: 'New cloud revision active with zero downtime; health check verified on port 3000.',
    actualResult: 'Deployed successfully to revision rev-0498. Latency: 42ms.',
    payload: {
      service: 'agent-os-gateway',
      image: 'gcr.io/neuralventures/agent-os:v1.4.2',
      environment: 'production'
    },
    diffPreview: `@@ -12,3 +12,4 @@\n- image: agent-os:v1.4.1\n+ image: agent-os:v1.4.2 (Zero-Trust MCP Ingress)`,
    status: 'approved',
    createdAt: '2h ago',
    reviewedAt: '1h 50m ago',
    reviewerNotes: 'Approved after verifying container checksum and sandbox tests passed.',
    canRollback: true
  }
];

export const INITIAL_BOT_CHANNELS: import('../types').BotChannel[] = [
  {
    id: 'whatsapp',
    name: 'whatsapp',
    displayName: 'WhatsApp Business Agent',
    icon: 'MessageSquare',
    status: 'connected',
    webhookUrl: 'https://api.neuralventures.io/v1/webhooks/whatsapp',
    botHandle: '+1 (555) 019-2834 (Amit OS)',
    unreadCount: 2,
    allowedModes: ['COPILOT', 'SUPERVISED', 'AUTONOMOUS']
  },
  {
    id: 'telegram',
    name: 'telegram',
    displayName: 'Telegram Executive Bot',
    icon: 'Send',
    status: 'connected',
    webhookUrl: 'https://api.neuralventures.io/v1/webhooks/telegram',
    botHandle: '@AmitAgentOS_bot',
    unreadCount: 0,
    allowedModes: ['COPILOT', 'SUPERVISED', 'AUTONOMOUS', 'LOCKDOWN']
  },
  {
    id: 'slack',
    name: 'slack',
    displayName: 'Slack Team & Alerts App',
    icon: 'Hash',
    status: 'connected',
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/XXXX',
    botHandle: '@agent-os-bot',
    unreadCount: 1,
    allowedModes: ['SUPERVISED', 'AUTONOMOUS']
  },
  {
    id: 'web',
    name: 'web',
    displayName: 'Web Chat & API Gateway',
    icon: 'Globe',
    status: 'connected',
    webhookUrl: 'http://localhost:3000/api/channels/web',
    botHandle: 'AgentOS Web Client v1.0',
    unreadCount: 0,
    allowedModes: ['COPILOT', 'SUPERVISED', 'AUTONOMOUS', 'LOCKDOWN']
  }
];

export const INITIAL_BOT_MESSAGES: import('../types').BotChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'telegram',
    sender: 'agent',
    senderName: 'Agent OS Sentinel',
    text: 'Good morning Amit! 🌅 Your Daily Identity Delta Scan is complete: 1 new high-value mention on X, 68 new GitHub stars on your MCP repo, and 1 inbound keynote speaking invite for India AI Summit 2026. What would you like to prioritize?',
    timestamp: '08:02 AM'
  },
  {
    id: 'msg-2',
    channelId: 'telegram',
    sender: 'user',
    senderName: 'Amit Sharma',
    text: 'Review the keynote invite and draft a high-impact LinkedIn post based on our latest MCP commit.',
    timestamp: '08:05 AM'
  },
  {
    id: 'msg-3',
    channelId: 'telegram',
    sender: 'agent',
    senderName: 'Content Agent',
    text: 'I have prepared the LinkedIn article: "Stop Building Chatbots: The Shift to Operating Systems for Autonomous Work". It includes the 6-stage loop and capability policy framework. Review card generated below:',
    timestamp: '08:06 AM',
    actionCard: {
      actionId: 'ctrl-1',
      title: 'Publish Thought Leadership Article to LinkedIn',
      risk: 'high',
      status: 'pending'
    }
  },
  {
    id: 'msg-4',
    channelId: 'whatsapp',
    sender: 'system',
    senderName: 'System Monitor',
    text: 'WhatsApp Channel linked. End-to-end encryption verified with WhatsApp Cloud API gateway.',
    timestamp: 'Yesterday'
  },
  {
    id: 'msg-5',
    channelId: 'whatsapp',
    sender: 'agent',
    senderName: 'Growth Agent',
    text: 'Dr. Priya Narang (CEO, CognitiveScale) viewed your profile 30m ago. I drafted a personalized warm message in your Review Control Plane.',
    timestamp: '07:30 AM'
  }
];

export const INITIAL_AUTOMATIONS: import('../types').AutomationWorkflow[] = [
  {
    id: 'auto-1',
    tenantId: 'user-amit-01',
    name: 'Daily 08:00 AM Digital Identity Delta Scanner',
    triggerType: 'cron',
    triggerSchedule: '0 8 * * *',
    description: 'Scans public web, GitHub, publications, mentions and categorizes changes into CONFIRMED, POSSIBLE, UNKNOWN, NOT_YOU.',
    assignedAgent: 'Identity Agent',
    actions: ['discover_web_mentions', 'classify_identity_delta', 'generate_daily_briefing'],
    isEnabled: true,
    lastRun: 'Today, 08:00 AM',
    lastStatus: 'success',
    totalExecutions: 42
  },
  {
    id: 'auto-2',
    tenantId: 'user-amit-01',
    name: 'Post-Commit Architectural Digest Synthesizer',
    triggerType: 'webhook',
    triggerSchedule: 'On GitHub push to main',
    description: 'Watches repo commits, analyzes semantic code diffs, drafts technical explainer posts, and queues them in the Review Gate.',
    assignedAgent: 'Content Agent',
    actions: ['read_git_diff', 'synthesize_breakdown', 'draft_linkedin_x_post'],
    isEnabled: true,
    lastRun: 'Today, 07:22 AM',
    lastStatus: 'success',
    totalExecutions: 19
  },
  {
    id: 'auto-3',
    tenantId: 'user-amit-01',
    name: 'Autonomous High-Fit Founder Prospector',
    triggerType: 'cron',
    triggerSchedule: '0 10 * * 1-5',
    description: 'Searches LinkedIn & GitHub contributors for founders building AI tooling; drafts personalized value-first connection messages.',
    assignedAgent: 'Growth Agent',
    actions: ['search_ai_founders', 'score_relevance', 'draft_personalized_outreach'],
    isEnabled: true,
    lastRun: 'Yesterday, 10:00 AM',
    lastStatus: 'success',
    totalExecutions: 28
  },
  {
    id: 'auto-4',
    tenantId: 'user-amit-01',
    name: 'Zero-Trust Permission & Key Leak Sentinel',
    triggerType: 'event',
    triggerSchedule: 'Continuous background loop (every 5m)',
    description: 'Verifies no agent executes unapproved external tool calls or writes unencrypted secrets.',
    assignedAgent: 'Security Agent',
    actions: ['audit_tool_scopes', 'scan_secret_leaks', 'enforce_mode_boundaries'],
    isEnabled: true,
    lastRun: '3m ago',
    lastStatus: 'success',
    totalExecutions: 310
  }
];

export const INITIAL_MARKETPLACE_ITEMS: import('../types').MarketplaceItem[] = [
  {
    id: 'mkt-1',
    name: 'GitHub Commit-to-Article Synthesizer',
    category: 'Workflows',
    description: 'Turns git commits and PR diffs into multi-format developer blog posts with code breakdowns.',
    author: 'NeuralVentures Core',
    version: '2.1.0',
    icon: 'GitPullRequest',
    tags: ['GitHub', 'Blogging', 'DeveloperBrand'],
    stars: 342,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'medium',
    requiredScopes: ['github:read', 'content:draft'],
    installCommand: 'agent install workflow:git-synthesizer'
  },
  {
    id: 'mkt-2',
    name: 'Model Context Protocol (MCP) Official Server Pack',
    category: 'MCP Servers',
    description: 'Production MCP client servers for Brave Search, PostgreSQL, Filesystem sandbox, and Memory RAG.',
    author: 'Anthropic / MCP Working Group',
    version: '1.2.0',
    icon: 'Server',
    tags: ['MCP', 'Tools', 'Protocol'],
    stars: 1250,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'low',
    requiredScopes: ['mcp:execute', 'fs:sandbox_read'],
    installCommand: 'agent install mcp-pack:official'
  },
  {
    id: 'mkt-3',
    name: 'Autonomous ArXiv Deep Researcher Agent',
    category: 'Agents',
    description: 'Autonomous worker that monitors CS.AI and CS.SE pre-prints, extracts key equations, and generates state-of-the-art matrix summaries.',
    author: 'DeepResearch Community',
    version: '1.0.4',
    icon: 'BookOpen',
    tags: ['Research', 'ArXiv', 'AI'],
    stars: 580,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'low',
    requiredScopes: ['web:read', 'pdf:parse'],
    installCommand: 'agent install agent:arxiv-researcher'
  },
  {
    id: 'mkt-4',
    name: 'Zero-Trust HITL Firewall Skill',
    category: 'Skills',
    description: 'Deterministic policy engine requiring cryptographic signatures on destructive API calls.',
    author: 'CyberShield Labs',
    version: '3.0.1',
    icon: 'ShieldCheck',
    tags: ['Security', 'Governance', 'HITL'],
    stars: 890,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'low',
    requiredScopes: ['policy:enforce'],
    installCommand: 'agent install skill:hitl-firewall'
  },
  {
    id: 'mkt-5',
    name: 'WhatsApp & Telegram Multi-Channel Dispatcher',
    category: 'Integrations',
    description: 'Bi-directional webhook adapter enabling voice and text approvals from mobile messenger apps.',
    author: 'OmniChannel Bot Works',
    version: '1.3.2',
    icon: 'Send',
    tags: ['WhatsApp', 'Telegram', 'MobileControl'],
    stars: 420,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'medium',
    requiredScopes: ['webhooks:receive', 'messaging:send'],
    installCommand: 'agent install integration:omnichannel'
  },
  {
    id: 'mkt-6',
    name: 'Founder Cold Outreach Personalizer',
    category: 'Templates',
    description: 'Empathetic, research-grounded outreach templates tested on 500+ VC and tech founder introductions.',
    author: 'GrowthEngine',
    version: '2.0.0',
    icon: 'Users',
    tags: ['Outreach', 'Networking', 'BD'],
    stars: 310,
    isInstalled: true,
    isEnabled: true,
    riskLevel: 'low',
    requiredScopes: ['crm:read', 'email:draft'],
    installCommand: 'agent install template:founder-outreach'
  }
];

export const INITIAL_CLOUD_STATE: import('../types').CloudSystemState = {
  vectorMemoryTokens: 482910,
  indexedDocumentsCount: 142,
  activeWorkloadsCount: 6,
  credentialsVaultCount: 8,
  uptimeSeconds: 84920,
  computeLoadPercentage: 24,
  storageUsedMb: 384,
  storageLimitMb: 5120,
  credentials: [
    {
      id: 'cred-1',
      name: 'GitHub Personal Access Token (Fine-grained)',
      type: 'token',
      service: 'GitHub',
      status: 'valid',
      lastUsed: 'Just now',
      scope: 'repo:read, workflow:read'
    },
    {
      id: 'cred-2',
      name: 'Google Workspace OAuth2 (Gmail + Calendar)',
      type: 'oauth2',
      service: 'Google',
      status: 'valid',
      lastUsed: '8m ago',
      scope: 'gmail.readonly, calendar.events'
    },
    {
      id: 'cred-3',
      name: 'LinkedIn Marketing & Profile API',
      type: 'oauth2',
      service: 'LinkedIn',
      status: 'valid',
      lastUsed: '12m ago',
      scope: 'w_member_social, r_liteprofile'
    },
    {
      id: 'cred-4',
      name: 'Gemini 3.8-Flash Server-side Key',
      type: 'api_key',
      service: 'Google AI Studio',
      status: 'valid',
      lastUsed: 'Realtime',
      scope: 'ai.generateContent'
    },
    {
      id: 'cred-5',
      name: 'Telegram Bot Token',
      type: 'token',
      service: 'Telegram API',
      status: 'valid',
      lastUsed: '2m ago',
      scope: 'bot:send_message, bot:webhook'
    }
  ],
  workloads: [
    {
      id: 'wkld-1',
      name: 'Continuous Digital Identity Delta Watcher',
      assignedAgent: 'Identity Agent',
      status: 'running',
      duration: '4h 12m',
      cpu: '1.2%',
      memory: '48 MB'
    },
    {
      id: 'wkld-2',
      name: 'ArXiv & MCP 2.0 Benchmarking Daemon',
      assignedAgent: 'Research Agent',
      status: 'running',
      duration: '1h 45m',
      cpu: '3.8%',
      memory: '112 MB'
    },
    {
      id: 'wkld-3',
      name: 'Zero-Trust Tool Scope Sentinel',
      assignedAgent: 'Security Agent',
      status: 'running',
      duration: '18h 30m',
      cpu: '0.4%',
      memory: '32 MB'
    },
    {
      id: 'wkld-4',
      name: 'Outbound Warm Intro Sequence Drafter',
      assignedAgent: 'Growth Agent',
      status: 'queued',
      duration: 'Scheduled 10:00 AM',
      cpu: '0.0%',
      memory: '16 MB'
    }
  ]
};

// --- OPTION A: PRODUCTION DETERMINISTIC PERMISSION & POLICY RULES ---
// Principle: STRICT DENY-BY-DEFAULT. LLM justification is NOT policy.
import { AgentPermissionRule, TenantConnection } from '../types';

export const INITIAL_PERMISSION_RULES: AgentPermissionRule[] = [
  {
    id: 'perm-1',
    agentId: 'worker-identity',
    agentName: 'Identity Agent',
    resource: 'public_web',
    capability: 'search_mentions',
    decision: 'ALLOW',
    rateLimitPerHour: 60,
    costCapUsdPerDay: 5.0,
    description: 'Read-only public web search for identity delta tracking and citations.'
  },
  {
    id: 'perm-2',
    agentId: 'worker-identity',
    agentName: 'Identity Agent',
    resource: 'github',
    capability: 'read_repository',
    decision: 'ALLOW',
    rateLimitPerHour: 100,
    costCapUsdPerDay: 0.0,
    description: 'Read-only analysis of public and user repository commits, stars, and pull requests.'
  },
  {
    id: 'perm-3',
    agentId: 'worker-identity',
    agentName: 'Identity Agent',
    resource: 'linkedin',
    capability: 'create_draft',
    decision: 'ALLOW',
    rateLimitPerHour: 20,
    costCapUsdPerDay: 0.0,
    description: 'Autonomous generation of article/post drafts within local workspace.'
  },
  {
    id: 'perm-4',
    agentId: 'worker-identity',
    agentName: 'Identity Agent',
    resource: 'linkedin',
    capability: 'publish_post',
    decision: 'ALLOW_WITH_APPROVAL',
    rateLimitPerHour: 4,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'External public brand reputation impact. Requires explicit human review in Control Plane.',
    description: 'Direct outbound broadcasting to user LinkedIn feed.'
  },
  {
    id: 'perm-5',
    agentId: 'worker-growth',
    agentName: 'Growth Agent',
    resource: 'email',
    capability: 'send_outreach',
    decision: 'ALLOW_WITH_APPROVAL',
    rateLimitPerHour: 10,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'External high-touch communication to enterprise founders/investors.',
    description: 'Direct outbound email delivery to targeted prospective contacts.'
  },
  {
    id: 'perm-6',
    agentId: 'worker-growth',
    agentName: 'Growth Agent',
    resource: 'whatsapp',
    capability: 'send_bulk_broadcast',
    decision: 'DENY',
    rateLimitPerHour: 0,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'Strict policy violation: Unsolicited bulk messaging is permanently forbidden by Agent OS core policy.',
    description: 'Automated mass-messaging to contacts list.'
  },
  {
    id: 'perm-7',
    agentId: 'worker-coding',
    agentName: 'Coding Agent',
    resource: 'database',
    capability: 'drop_table',
    decision: 'DENY',
    rateLimitPerHour: 0,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'Irreversible destructive DDL operation strictly blocked for all autonomous agents.',
    description: 'Dropping or truncating database schema tables.'
  },
  {
    id: 'perm-8',
    agentId: 'worker-coding',
    agentName: 'Coding Agent',
    resource: 'github',
    capability: 'create_pull_request',
    decision: 'ALLOW_WITH_APPROVAL',
    rateLimitPerHour: 15,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'Code modification affecting production branches requires peer/human code review.',
    description: 'Submitting pull requests to connected code repositories.'
  },
  {
    id: 'perm-9',
    agentId: 'worker-research',
    agentName: 'Research Agent',
    resource: 'arxiv_api',
    capability: 'fetch_papers',
    decision: 'ALLOW',
    rateLimitPerHour: 120,
    costCapUsdPerDay: 2.0,
    description: 'Fetching scientific papers and technical pre-prints from arXiv.'
  },
  {
    id: 'perm-10',
    agentId: 'worker-security',
    agentName: 'Security Agent',
    resource: 'vault',
    capability: 'rotate_secrets',
    decision: 'ALLOW_WITH_APPROVAL',
    rateLimitPerHour: 5,
    costCapUsdPerDay: 0.0,
    requiresApprovalReason: 'Key rotation impacts active gateway connections.',
    description: 'Triggering credential refresh and revocation across active API integrations.'
  }
];

// --- SEPARATE CONNECTIONS / CREDENTIAL VAULT ARCHITECTURE ---
// Tokens reside in Credential Vault. Agent only requests capability invocation!
export const INITIAL_TENANT_CONNECTIONS: TenantConnection[] = [
  {
    id: 'conn-github-01',
    tenantId: 'user-amit-01',
    provider: 'github',
    displayName: 'GitHub Organization Connection',
    accountIdentifier: 'amit-sharma-org',
    status: 'connected',
    capabilitiesGranted: ['github.read_repository', 'github.create_pull_request', 'github.read_commits'],
    vaultSecretRef: 'vault://secrets/tenants/amit/github/ghp_encrypted_v2',
    lastRotated: '2 days ago',
    rateLimitRemaining: 4850
  },
  {
    id: 'conn-linkedin-01',
    tenantId: 'user-amit-01',
    provider: 'linkedin',
    displayName: 'LinkedIn Member OAuth 2.0',
    accountIdentifier: 'in/amit-sharma-ai',
    status: 'connected',
    capabilitiesGranted: ['linkedin.read_profile', 'linkedin.create_draft', 'linkedin.publish_post'],
    vaultSecretRef: 'vault://secrets/tenants/amit/linkedin/oauth_refresh_vault',
    lastRotated: 'Yesterday at 11:20 PM',
    rateLimitRemaining: 96
  },
  {
    id: 'conn-google-01',
    tenantId: 'user-amit-01',
    provider: 'google_workspace',
    displayName: 'Google Workspace (Gmail & Calendar)',
    accountIdentifier: 'AMITSHARMA99976@gmail.com',
    status: 'connected',
    capabilitiesGranted: ['gmail.read_inbox', 'calendar.read_events', 'gmail.draft_email'],
    vaultSecretRef: 'vault://secrets/tenants/amit/google/gsi_tokens_vault',
    lastRotated: '12 hours ago',
    rateLimitRemaining: 2400
  },
  {
    id: 'conn-whatsapp-01',
    tenantId: 'user-amit-01',
    provider: 'whatsapp_cloud',
    displayName: 'WhatsApp Business Cloud API',
    accountIdentifier: '+91-98765-XXXXX',
    status: 'connected',
    capabilitiesGranted: ['whatsapp.receive_webhook', 'whatsapp.send_template_alert'],
    vaultSecretRef: 'vault://secrets/tenants/amit/whatsapp/token_meta_enc',
    lastRotated: '3 days ago',
    rateLimitRemaining: 1000
  },
  {
    id: 'conn-pg-01',
    tenantId: 'user-amit-01',
    provider: 'postgres',
    displayName: 'Cloud SQL PostgreSQL + pgvector',
    accountIdentifier: 'agent_os_db (Cluster-01)',
    status: 'connected',
    capabilitiesGranted: ['postgres.read_records', 'postgres.insert_vector_embeddings'],
    vaultSecretRef: 'vault://secrets/tenants/amit/db/pool_conn_string',
    lastRotated: '7 days ago',
    rateLimitRemaining: 50000
  },
  {
    id: 'conn-redis-01',
    tenantId: 'user-amit-01',
    provider: 'redis',
    displayName: 'Redis BullMQ Job Queue & Rate Limiter',
    accountIdentifier: 'redis://10.0.0.4:6379/0',
    status: 'connected',
    capabilitiesGranted: ['redis.queue_jobs', 'redis.check_rate_limit', 'redis.cache_kv'],
    vaultSecretRef: 'vault://secrets/tenants/amit/redis/auth_token',
    lastRotated: '14 days ago',
    rateLimitRemaining: 1000000
  }
];

// Production-ready Schema representation incorporating the 6 enhancements
export const PRISMA_SCHEMA_SPEC = `// =========================================================================
// AGENT OS: MULTI-TENANT CORE PRODUCTION SCHEMA (Prisma 5.x + PostgreSQL)
// Incorporates the 6 Core Security, Idempotency & Permission Enhancements:
// 1. 3-Way Permission Engine: DENY, ALLOW, ALLOW_WITH_APPROVAL (Deny by default)
// 2. Separate Connection / CredentialVault (Agents never see raw tokens)
// 3. Idempotency & Execution State (idempotencyKey, executionId, attempt)
// 4. Immutable Audit Log (Hash-chained audit events, zero agent mutation)
// 5. Multi-dimensional Risk Matrix (Data, Comm, Finance, Brand, Destruct, Reversibility)
// 6. Deterministic Policy Enforcement (LLM proposes, deterministic engine permits)
// =========================================================================

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

// -------------------------------------------------------------------------
// 1. TENANT: Complete Data & Namespace Isolation
// -------------------------------------------------------------------------
model Tenant {
  id          String       @id @default(uuid())
  name        String       // e.g. "Amit Sharma" or "NeuralVentures Labs"
  type        TenantType   @default(USER) // USER, ORGANIZATION
  slug        String       @unique
  config      Json         // Global Goals, Brand Voice, Risk Tolerance, Heuristics
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  agents      Agent[]
  connections Connection[]
  memories    Memory[]
  actions     ProposedAction[]
  auditLogs   ImmutableActionLog[]
  policies    PolicyRule[]
}

// -------------------------------------------------------------------------
// 2. CONNECTIONS & CREDENTIAL VAULT: Secrets separated from Agents!
// -------------------------------------------------------------------------
model Connection {
  id                  String           @id @default(uuid())
  tenantId            String
  tenant              Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  provider            String           // "github", "linkedin", "google", "whatsapp", "postgres"
  accountIdentifier   String           // e.g. "in/amit-sharma-ai" or "AMITSHARMA99976@gmail.com"
  status              ConnectionStatus @default(ACTIVE)
  grantedCapabilities String[]         // Capability names authorized for this connection
  vaultSecretRef      String           // Pointer into KMS/Vault; NEVER returned to agent LLM
  lastRotated         DateTime         @default(now())
  createdAt           DateTime         @default(now())

  tools               ToolRuntimeBinding[]
  @@unique([tenantId, provider, accountIdentifier])
}

// -------------------------------------------------------------------------
// 3. AGENT: Autonomous Workers in Sandbox Boundaries
// -------------------------------------------------------------------------
model Agent {
  id              String           @id @default(uuid())
  tenantId        String
  tenant          Tenant           @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name            String           // "Identity Agent", "Growth Agent", "Coding Agent"
  type            AgentType        // IDENTITY, RESEARCH, CONTENT, GROWTH, CODING, SECURITY
  status          AgentStatus      @default(ACTIVE)
  mode            AgentMode        @default(SUPERVISED) // COPILOT, SUPERVISED, AUTONOMOUS, LOCKDOWN
  systemPrompt    String           @db.Text
  modelAlias      String           @default("gemini-2.5-pro")
  config          Json             // Heuristic weights, rate-limits, scheduling parameters
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  memories        Memory[]
  permissions     AgentPermission[]
  proposedActions ProposedAction[]
  executions      ActionExecution[]
}

// -------------------------------------------------------------------------
// 4. PERMISSION ENGINE: 3-Way Policy Decision (DENY, ALLOW, ALLOW_WITH_APPROVAL)
// Strict Deny-By-Default: Missing permission row = DENIED automatically!
// -------------------------------------------------------------------------
model AgentPermission {
  id                     String             @id @default(uuid())
  agentId                String
  agent                  Agent              @relation(fields: [agentId], references: [id], onDelete: Cascade)
  resource               String             // e.g. "public_web", "github", "linkedin", "email", "db"
  capability             String             // e.g. "read", "create_draft", "publish_post", "drop_table"
  decision               PermissionDecision @default(DENY) // DENY, ALLOW, ALLOW_WITH_APPROVAL
  rateLimitPerHour       Int                @default(10)
  costCapUsdPerDay       Float              @default(1.0)
  requiresApprovalReason String?            // Explanation of why HITL gate is enforced
  createdAt              DateTime           @default(now())

  @@unique([agentId, resource, capability])
}

// -------------------------------------------------------------------------
// 5. MEMORY LAYER: Persistent Context (Short, Episodic, Semantic pgvector)
// -------------------------------------------------------------------------
model Memory {
  id          String                  @id @default(uuid())
  tenantId    String
  tenant      Tenant                  @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  agentId     String?
  agent       Agent?                  @relation(fields: [agentId], references: [id], onDelete: SetNull)
  type        MemoryType              // SHORT_TERM, LONG_TERM, EPISODIC, SEMANTIC
  title       String
  content     String                  @db.Text
  metadata    Json                    // Source URL, citation, entity references
  embedding   Unsupported("vector")?  // pgvector 768 / 1536 dimensions
  relevance   Float                   @default(1.0)
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt

  @@index([tenantId, type])
}

// -------------------------------------------------------------------------
// 6. CONTROL PLANE: Human-in-the-Loop Review & Idempotent Actions
// -------------------------------------------------------------------------
model ProposedAction {
  id              String             @id @default(uuid())
  idempotencyKey  String             @unique // Prevents duplicate execution on timeouts/retries
  executionId     String             @default(uuid())
  attempt         Int                @default(1)
  externalActionId String?           // ID returned by external API (e.g. LinkedIn URN or Tweet ID)
  tenantId        String
  tenant          Tenant             @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  agentId         String
  agent           Agent              @relation(fields: [agentId], references: [id], onDelete: Cascade)
  actionType      String             // "PUBLISH_LINKEDIN", "SEND_OUTREACH", "MERGE_PR"
  
  // Multi-Dimensional Risk Matrix
  dataSensitivity       Int          @default(0) // 0-3 (Public -> Secret)
  externalCommunication Int          @default(0) // 0-3 (None -> Direct Outbound)
  financialImpact       Int          @default(0) // 0-3 (Zero -> Uncapped)
  reputationImpact      Int          @default(0) // 0-3 (None -> Irreversible)
  destructiveness       Int          @default(0) // 0-3 (Read -> Delete)
  reversibility         Int          @default(0) // 0-3 (Reversible -> Irreversible)
  compositeRiskScore    Float        @default(0.0) // 0-100
  riskLevel             RiskLevel    @default(LOW) // LOW, MEDIUM, HIGH, CRITICAL

  payload         Json               // Precise JSON payload proposed
  diffPreview     String?            @db.Text // Unified diff or visual preview
  status          ActionStatus       @default(PENDING) // PENDING, APPROVED, REJECTED, EXECUTED, ROLLED_BACK
  reason          String?            // LLM reasoning (NOTE: does NOT override policy!)
  dataUsed        Json?              // Source memories/citations that informed the proposal
  createdAt       DateTime           @default(now())
  resolvedAt      DateTime?
  reviewerNotes   String?

  executions      ActionExecution[]
  auditLogs       ImmutableActionLog[]
}

// -------------------------------------------------------------------------
// 7. IMMUTABLE AUDIT LOG: Zero-Tamper Execution Ledger with Hash Chaining
// -------------------------------------------------------------------------
model ImmutableActionLog {
  id             String          @id @default(uuid())
  sequenceNumber BigInt          @default(autoincrement())
  tenantId       String
  tenant         Tenant          @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  agentId        String
  actionId       String?
  action         ProposedAction? @relation(fields: [actionId], references: [id], onDelete: SetNull)
  toolUsed       String          // e.g. "mcp://github.local/read_repo"
  capability     String          // Capability invoked
  decision       PermissionDecision
  input          Json
  output         Json
  status         ExecutionStatus // SUCCESS, FAILURE, BLOCKED_BY_POLICY, TIMEOUT
  tokensUsed     Int             @default(0)
  durationMs     Int             @default(0)
  prevHash       String          // Cryptographic hash of previous record (Blockchain-style integrity)
  recordHash     String          // SHA-256(sequence + tenant + agent + tool + input + prevHash)
  createdAt      DateTime        @default(now())

  @@index([tenantId, createdAt])
}

// -------------------------------------------------------------------------
// 8. ENUMS
// -------------------------------------------------------------------------
enum TenantType { USER, ORGANIZATION }
enum ConnectionStatus { ACTIVE, EXPIRING, REVOKED, DISCONNECTED }
enum AgentType { IDENTITY, RESEARCH, CONTENT, GROWTH, CODING, SECURITY, ASSISTANT }
enum AgentStatus { ACTIVE, PAUSED, LOCKDOWN }
enum AgentMode { COPILOT, SUPERVISED, AUTONOMOUS, LOCKDOWN }
enum PermissionDecision { DENY, ALLOW, ALLOW_WITH_APPROVAL }
enum MemoryType { SHORT_TERM, LONG_TERM, EPISODIC, SEMANTIC }
enum RiskLevel { LOW, MEDIUM, HIGH, CRITICAL }
enum ActionStatus { PENDING, APPROVED, REJECTED, EXECUTED, ROLLED_BACK }
enum ExecutionStatus { SUCCESS, FAILURE, BLOCKED_BY_POLICY, TIMEOUT }
`;


