export interface EvolutionStage {
  stageNumber: number;
  name: string;
  subtitle: string;
  headcountRange: string;
  architectureType: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  characteristics: string[];
  infrastructureCost: 'Very Low ($)' | 'Moderate ($$)' | 'High ($$$)' | 'Enterprise ($$$$)';
  deploymentComplexity: 'Low (Single pipeline)' | 'Medium (Workers & Cache)' | 'High (Independent CI/CD)' | 'Advanced (Cell-based / Multi-region)';
  keyMilestones: string[];
  whenToGraduate: string;
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    stageNumber: 1,
    name: 'Stage 1 — MVP',
    subtitle: 'Modular Monolith',
    headcountRange: '1 - 10 Developers',
    architectureType: 'Single Monorepo · Shared DB · Fast Shipping',
    descriptionHindi: 'Ek deployable backend, ek database, clearly separated modules. Kam infrastructure cost aur fast development.',
    descriptionEnglish: 'Single deployable backend, unified database, clearly separated domain modules. Low cloud infrastructure bill and maximum development velocity.',
    characteristics: [
      'Next.js frontend in apps/web talking directly to services/api-gateway',
      'Shared PostgreSQL database with modular schema boundaries',
      'Python recruit logic called as modular service or embedded worker',
      'Unified deployment on Railway, Render, or a single AWS ECS cluster',
      'Zero inter-service network latency or distributed transaction overhead'
    ],
    infrastructureCost: 'Very Low ($)',
    deploymentComplexity: 'Low (Single pipeline)',
    keyMilestones: [
      'apps/web dashboard functioning',
      'Authentication & workspace isolation in identity service',
      'Shared types package ensuring zero contract mismatch',
      'Initial DB migrations with Alembic/Prisma'
    ],
    whenToGraduate: 'Move to Stage 2 when long-running AI operations (resume PDF parsing, LLM batch jobs) start blocking HTTP request threads.'
  },
  {
    stageNumber: 2,
    name: 'Stage 2 — Growth',
    subtitle: 'Workers & Async Workloads',
    headcountRange: '10 - 50 Developers',
    architectureType: 'Modular Monolith + Background Queue Workers',
    descriptionHindi: 'Resume parsing, AI inference aur scheduled automations ko background workers par shift karein. Queue, caching aur observability introduce karein.',
    descriptionEnglish: 'Heavy workloads (resume parsing, AI embeddings, model inference, scheduled automations) offloaded to background workers with Redis/Celery/Temporal.',
    characteristics: [
      'FastAPI remains core API; background tasks queued via Redis / Celery / BullMQ',
      'Qdrant or Pinecone vector DB integrated for candidate semantic search',
      'Structured OpenTelemetry tracing and Sentry error monitoring added',
      'Read-replicas for Postgres to handle high-volume talent searches',
      'Separate worker containers with autoscaling for heavy GPU/CPU tasks'
    ],
    infrastructureCost: 'Moderate ($$)',
    deploymentComplexity: 'Medium (Workers & Cache)',
    keyMilestones: [
      'Resume parser worker separated from web request cycle',
      'MCP Gateway caching tool responses to minimize token costs',
      'Dead-letter queues and retry logic for flaky 3rd party AI APIs',
      'Automated PR previews in CI'
    ],
    whenToGraduate: 'Move to Stage 3 when recruitment service or AI gateway requires its own deployment cadence, separate scaling tiers, or dedicated domain team ownership.'
  },
  {
    stageNumber: 3,
    name: 'Stage 3 — Scale',
    subtitle: 'Selective Microservices',
    headcountRange: '50 - 150 Developers',
    architectureType: 'Decoupled Critical Services in Monorepo',
    descriptionHindi: 'AI gateway, agent runtime ya recruitment service ko tab alag deploy karein jab independent scaling, reliability ya team ownership ki real zaroorat ho.',
    descriptionEnglish: 'Selectively decouple high-traffic or independently scaled domains (AI Gateway, Agent Runtime, Recruit Service) while retaining the single monorepo for shared types and contracts.',
    characteristics: [
      'AI Gateway deployed independently with custom token rate-limiting and model fallback routing',
      'Agent Runtime running in isolated sandbox container cluster',
      'gRPC / Protocol Buffers or Kafka event bus for internal asynchronous messaging',
      'Strict CODEOWNERS enforcement per service folder',
      'Independent Docker images built by Turborepo cache graphs'
    ],
    infrastructureCost: 'High ($$$)',
    deploymentComplexity: 'High (Independent CI/CD)',
    keyMilestones: [
      'Decoupled deployment pipeline for AI Gateway (zero downtime model upgrades)',
      'Candidate PII data isolation service with strict cryptographic guards',
      'MCP Tool registry with dynamic sandboxing',
      'Team-level autonomy without breaking cross-cutting packages'
    ],
    whenToGraduate: 'Move to Stage 4 when serving multinational enterprise clients requiring multi-region data sovereignty (India, EU GDPR, US SOC-2), 99.99% SLAs, and custom on-premise deployments.'
  },
  {
    stageNumber: 4,
    name: 'Stage 4 — Enterprise',
    subtitle: 'Multi-Region Platform & Ecosystem',
    headcountRange: '150 - 500+ Developers',
    architectureType: 'Cell-Based Architecture · Multi-Region · MCP Marketplace',
    descriptionHindi: 'Tenant isolation, regional data controls, developer SDKs, integration marketplace, enterprise auditability aur advanced disaster recovery.',
    descriptionEnglish: 'Cell-based multi-region architecture with strict tenant isolation, compliance governance, third-party developer MCP ecosystem, and public SDKs.',
    characteristics: [
      'Regional data residency pods (India, EU, US) ensuring candidate data never leaves legal jurisdiction',
      'Public HireSaathi MCP Marketplace allowing enterprise customers to build custom hiring tools',
      'Immutable cryptographic audit trail for every automated hiring recommendation (EU AI Act compliant)',
      'Automated canary deployments with real-time model evaluation rollbacks',
      'Dedicated Platform Engineering team maintaining shared SDKs, CLI, and developer experience'
    ],
    infrastructureCost: 'Enterprise ($$$$)',
    deploymentComplexity: 'Advanced (Cell-based / Multi-region)',
    keyMilestones: [
      'SOC-2 Type II, ISO 27001, and EU AI Act compliance certifications',
      'Developer Portal with self-serve API keys and MCP verification',
      'Multi-cluster Kubernetes management across AWS & Google Cloud',
      'Automated synthetic candidate bias auditing on every model release'
    ],
    whenToGraduate: 'Industry benchmark: Global leader in ethical AI recruitment and workplace automation.'
  }
];

export const ESSENTIAL_FILES_TABLE = [
  {
    file: 'README.md',
    responsibility: 'Master project setup, architecture principles, and day-one onboarding commands.',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  },
  {
    file: 'pyproject.toml',
    responsibility: 'Python dependencies, uv/poetry settings, and strict ruff/mypy configs for AI services.',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  },
  {
    file: 'package.json & turbo.json',
    responsibility: 'Monorepo workspace configuration, task execution pipeline, and shared build cache.',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  },
  {
    file: 'docker-compose.yml',
    responsibility: 'One-command local development environment (Postgres, Redis, Qdrant, LocalStack).',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  },
  {
    file: '.env.example',
    responsibility: 'Exhaustive list of required configuration keys without leaking secrets.',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  },
  {
    file: 'CODEOWNERS',
    responsibility: 'Granular code review ownership mapping directories to domain teams.',
    stage: 'Stage 2 (Growth)',
    priority: 'High'
  },
  {
    file: 'SECURITY.md',
    responsibility: 'Vulnerability disclosure policy and responsible AI safety reporting channel.',
    stage: 'Stage 1 (Day 1)',
    priority: 'High'
  },
  {
    file: 'docs/decisions/ (ADRs)',
    responsibility: 'Architecture Decision Records documenting why decisions were made.',
    stage: 'Stage 1 (Day 1)',
    priority: 'High'
  },
  {
    file: '.github/workflows/ci.yml',
    responsibility: 'Continuous Integration: typecheck, lint, pytest, secret scanning on every PR.',
    stage: 'Stage 1 (Day 1)',
    priority: 'Critical'
  }
];
