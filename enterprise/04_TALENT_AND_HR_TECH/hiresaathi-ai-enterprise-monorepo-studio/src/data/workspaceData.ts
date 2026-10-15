export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  applicantsCount: number;
  shortlistedCount: number;
  mandatorySkills: string[];
  preferredSkills: string[];
  minYearsExp: number;
  status: 'active' | 'reviewing' | 'closed';
}

export interface CandidateApplicant {
  id: string;
  name: string;
  jobId: string;
  title: string;
  yearsExperience: number;
  skills: string[];
  matchScore: number;
  skillCoverage: number;
  experienceFit: number;
  biasAuditStatus: 'clean' | 'flagged' | 'pending';
  appliedDate: string;
  summary: string;
  strengths: string[];
  concerns?: string;
}

export interface McpServerItem {
  id: string;
  name: string;
  description: string;
  category: 'code' | 'database' | 'communication' | 'ats' | 'search';
  transport: 'stdio' | 'sse' | 'http';
  endpoint: string;
  status: 'connected' | 'idle' | 'warning';
  latencyMs: number;
  tools: {
    name: string;
    description: string;
    parameters: string[];
  }[];
}

export interface AgentItem {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'active' | 'idle' | 'standby';
  systemPrompt: string;
  boundMcpTools: string[];
  lastAction: string;
  tasksCompleted: number;
  confidenceScore: number;
}

export interface WorkflowItem {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused';
  steps: {
    id: string;
    title: string;
    executor: string;
    details: string;
  }[];
  runsToday: number;
}

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Senior AI Platform Engineer',
    department: 'Engineering',
    location: 'Bengaluru / Remote',
    type: 'Full-time',
    applicantsCount: 42,
    shortlistedCount: 6,
    mandatorySkills: ['Python', 'FastAPI', 'PyTorch', 'Postgres', 'Docker'],
    preferredSkills: ['MCP Protocol', 'LangChain', 'Kubernetes', 'Qdrant'],
    minYearsExp: 5,
    status: 'active'
  },
  {
    id: 'job-2',
    title: 'Founding Technical Recruiter',
    department: 'People Operations',
    location: 'Mumbai / Hybrid',
    type: 'Full-time',
    applicantsCount: 28,
    shortlistedCount: 4,
    mandatorySkills: ['Tech Sourcing', 'ATS Management', 'Interview Coordination'],
    preferredSkills: ['AI Tooling', 'Boolean Search', 'LinkedIn Recruiter'],
    minYearsExp: 3,
    status: 'active'
  },
  {
    id: 'job-3',
    title: 'Full-Stack Lead (Next.js / Python)',
    department: 'Engineering',
    location: 'Gurugram / Remote',
    type: 'Full-time',
    applicantsCount: 35,
    shortlistedCount: 5,
    mandatorySkills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'FastAPI'],
    preferredSkills: ['Turborepo', 'PostgreSQL', 'Redis'],
    minYearsExp: 6,
    status: 'active'
  }
];

export const INITIAL_CANDIDATES: CandidateApplicant[] = [
  {
    id: 'cand-1',
    name: 'Aarav Sharma',
    jobId: 'job-1',
    title: 'Senior ML Systems Engineer at Flipkart',
    yearsExperience: 6.5,
    skills: ['Python', 'FastAPI', 'PyTorch', 'Postgres', 'Docker', 'Kubernetes', 'MCP Protocol'],
    matchScore: 94.8,
    skillCoverage: 100,
    experienceFit: 100,
    biasAuditStatus: 'clean',
    appliedDate: '2 hours ago',
    summary: 'Built high-throughput model inference pipelines handling 15k req/sec with FastAPI and gRPC. Extensive hands-on experience with vector embeddings and custom MCP server tools.',
    strengths: ['100% core skill match', 'Production LLM inference experience', 'Clear open-source track record']
  },
  {
    id: 'cand-2',
    name: 'Priya Narang',
    jobId: 'job-1',
    title: 'AI Software Engineer at Swiggy',
    yearsExperience: 5.2,
    skills: ['Python', 'FastAPI', 'Postgres', 'Docker', 'LangChain', 'Qdrant'],
    matchScore: 88.5,
    skillCoverage: 80,
    experienceFit: 100,
    biasAuditStatus: 'clean',
    appliedDate: 'Yesterday',
    summary: 'Designed multi-agent routing architecture for customer chat support. Strong asynchronous Python and relational database optimization.',
    strengths: ['Exemplary domain knowledge in agent orchestration', 'Strong microservices architecture background'],
    concerns: 'Slightly less direct PyTorch kernel optimization experience.'
  },
  {
    id: 'cand-3',
    name: 'Vikramaditya Bose',
    jobId: 'job-1',
    title: 'Backend Platform Engineer at Razorpay',
    yearsExperience: 4.8,
    skills: ['Python', 'Django', 'Postgres', 'Docker', 'AWS'],
    matchScore: 73.2,
    skillCoverage: 60,
    experienceFit: 96,
    biasAuditStatus: 'clean',
    appliedDate: '3 days ago',
    summary: 'Highly capable backend engineer with deep Postgres indexing and payment flow experience, looking to transition into AI platform tooling.',
    strengths: ['High-reliability distributed systems knowledge', 'Zero production incidents in past 18 months'],
    concerns: 'Missing direct vector database and PyTorch production workloads.'
  },
  {
    id: 'cand-4',
    name: 'Ananya Deshmukh',
    jobId: 'job-3',
    title: 'Staff Frontend & Systems Engineer',
    yearsExperience: 7.0,
    skills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'FastAPI', 'Turborepo', 'PostgreSQL'],
    matchScore: 97.2,
    skillCoverage: 100,
    experienceFit: 100,
    biasAuditStatus: 'clean',
    appliedDate: '5 hours ago',
    summary: 'Led monorepo migration from Vite to Turborepo across 12 packages. Deep expertise in React Server Components and Python async backends.',
    strengths: ['Architected enterprise monorepos for 150+ engineers', 'Perfect match for HireSaathi tech stack']
  }
];

export const INITIAL_MCP_SERVERS: McpServerItem[] = [
  {
    id: 'mcp-github',
    name: 'GitHub Profiler MCP',
    description: 'Inspect candidate open-source contributions, commit cadence, and code reviews safely.',
    category: 'code',
    transport: 'stdio',
    endpoint: 'local://npx-mcp-github',
    status: 'connected',
    latencyMs: 14,
    tools: [
      {
        name: 'search_repositories',
        description: 'Find candidate repositories by tech stack or keyword',
        parameters: ['query: string', 'sort?: string']
      },
      {
        name: 'get_commit_history',
        description: 'Analyze commit consistency and commit message clarity',
        parameters: ['owner: string', 'repo: string', 'limit: number']
      },
      {
        name: 'analyze_pr_quality',
        description: 'Evaluate code review thoroughness and architectural discussions',
        parameters: ['pr_url: string']
      }
    ]
  },
  {
    id: 'mcp-postgres',
    name: 'Postgres Candidate DB MCP',
    description: 'Read-only candidate talent pool access with automatic masking of phone numbers and addresses.',
    category: 'database',
    transport: 'sse',
    endpoint: 'https://mcp.internal.hiresaathi.ai/postgres',
    status: 'connected',
    latencyMs: 8,
    tools: [
      {
        name: 'query_candidates_by_skill',
        description: 'Vector-assisted query for candidate skill matches in historical talent pool',
        parameters: ['skills: string[]', 'min_exp: number']
      },
      {
        name: 'save_candidate_score',
        description: 'Persist AI screening scorecard into auditable records',
        parameters: ['candidate_id: string', 'score: number', 'reasons: string[]']
      }
    ]
  },
  {
    id: 'mcp-whatsapp',
    name: 'WhatsApp Outreach MCP',
    description: 'Compliant candidate interview scheduling and automated WhatsApp reminder alerts.',
    category: 'communication',
    transport: 'http',
    endpoint: 'https://mcp.internal.hiresaathi.ai/whatsapp',
    status: 'connected',
    latencyMs: 42,
    tools: [
      {
        name: 'send_interview_invite',
        description: 'Sends approved template WhatsApp message with interview booking link',
        parameters: ['candidate_id: string', 'slot_time: string']
      },
      {
        name: 'send_status_update',
        description: 'Send transparent recruitment stage update to candidate',
        parameters: ['candidate_id: string', 'status: string']
      }
    ]
  },
  {
    id: 'mcp-greenhouse',
    name: 'Greenhouse & ATS Sync MCP',
    description: 'Bi-directional sync with enterprise applicant tracking systems.',
    category: 'ats',
    transport: 'sse',
    endpoint: 'https://mcp.internal.hiresaathi.ai/greenhouse',
    status: 'idle',
    latencyMs: 65,
    tools: [
      {
        name: 'sync_job_requisition',
        description: 'Import new job openings directly from enterprise ATS',
        parameters: ['req_id: string']
      },
      {
        name: 'push_scorecard',
        description: 'Push HireSaathi AI evaluation to Greenhouse candidate profile',
        parameters: ['candidate_id: string', 'evaluation_json: string']
      }
    ]
  }
];

export const INITIAL_AGENTS: AgentItem[] = [
  {
    id: 'agent-recruiter',
    name: 'HireSaathi Core Recruiter Agent',
    role: 'Autonomous Candidate Screener & Ranker',
    model: 'Claude 3.7 Sonnet / Gemini 2.5 Pro (Dual-Route)',
    status: 'active',
    systemPrompt: 'You are HireSaathi AI Recruiter. Rank candidates strictly on objective merit. Anonymize demographic details to prevent bias. Validate experience claims against GitHub or project artifacts.',
    boundMcpTools: ['GitHub Profiler MCP', 'Postgres Candidate DB MCP'],
    lastAction: 'Screened Aarav Sharma against Senior AI Platform Engineer job requirements',
    tasksCompleted: 1420,
    confidenceScore: 98.4
  },
  {
    id: 'agent-scheduler',
    name: 'Candidate Concierge & Scheduler',
    role: 'Interview Logistics & Candidate Support',
    model: 'Gemini 2.5 Flash',
    status: 'active',
    systemPrompt: 'Assist candidates with rescheduling, answering questions about the role culture, and confirming panel availability.',
    boundMcpTools: ['WhatsApp Outreach MCP', 'Greenhouse & ATS Sync MCP'],
    lastAction: 'Sent WhatsApp confirmation for Priya Narang technical assessment',
    tasksCompleted: 890,
    confidenceScore: 99.1
  },
  {
    id: 'agent-sourcing',
    name: 'Autonomous Talent Sourcing Bot',
    role: 'Passive Candidate Discovery',
    model: 'Claude 3.5 Haiku',
    status: 'idle',
    systemPrompt: 'Identify top engineering talent from open-source repositories and publications matching target hiring archetypes.',
    boundMcpTools: ['GitHub Profiler MCP'],
    lastAction: 'Completed scan of Top 50 open-source contributors in HuggingFace transformers',
    tasksCompleted: 450,
    confidenceScore: 94.6
  }
];

export const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'End-to-End Autonomous Screening Pipeline',
    trigger: 'New candidate submits application on careers page or job board',
    status: 'active',
    runsToday: 38,
    steps: [
      {
        id: 's1',
        title: 'Extract & Anonymize Resume',
        executor: 'recruit-service (Python parser)',
        details: 'Strip name, gender, college tier and photo to guarantee bias-free initial evaluation.'
      },
      {
        id: 's2',
        title: 'Domain Skill & Experience Scoring',
        executor: 'Domain Matching Engine',
        details: 'Calculate mandatory skill coverage & verified production experience ratio.'
      },
      {
        id: 's3',
        title: 'GitHub & Project Verification',
        executor: 'GitHub Profiler MCP',
        details: 'Inspect code quality, commit history, and technical depth in public repos.'
      },
      {
        id: 's4',
        title: 'Automated Interview Scheduling',
        executor: 'WhatsApp Outreach MCP',
        details: 'If overall match score >= 85%, send automated Calendly link via WhatsApp.'
      }
    ]
  },
  {
    id: 'wf-2',
    name: 'ATS Bi-directional Sync & Audit Logging',
    trigger: 'Candidate stage transitions in HireSaathi',
    status: 'active',
    runsToday: 82,
    steps: [
      {
        id: 's1',
        title: 'Generate SOC2 Audit Record',
        executor: 'audit-service',
        details: 'Write immutable log of candidate review decision with model token IDs.'
      },
      {
        id: 's2',
        title: 'Push Scorecard to Greenhouse',
        executor: 'Greenhouse MCP',
        details: 'Update ATS status and attach detailed AI evaluation breakdown.'
      }
    ]
  }
];
