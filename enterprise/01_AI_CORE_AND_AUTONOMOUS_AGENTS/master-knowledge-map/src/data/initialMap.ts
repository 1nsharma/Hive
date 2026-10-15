import { KnowledgeMapData } from '../types';

export const INITIAL_KNOWLEDGE_MAP: KnowledgeMapData = {
  domains: [
    {
      id: 'architecture',
      name: 'Architecture',
      description: 'System design, blueprints, trade-offs, and multi-tier structural design.',
      iconName: 'Layers',
      color: 'indigo'
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Storage engines, schemas, index designs, and data-integrity guarantees.',
      iconName: 'Database',
      color: 'emerald'
    },
    {
      id: 'apis',
      name: 'APIs',
      description: 'Integration protocols, client-server design, and payload specs.',
      iconName: 'Network',
      color: 'sky'
    },
    {
      id: 'ai-ml',
      name: 'AI/ML',
      description: 'Model deployment, pipelines, feature stores, and ethical alignment.',
      iconName: 'Brain',
      color: 'amber'
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Identity management, cryptographic controls, and threat mitigation.',
      iconName: 'Lock',
      color: 'rose'
    },
    {
      id: 'devops',
      name: 'DevOps',
      description: 'Deployment pipelines, automation, orchestration, and metrics.',
      iconName: 'Infinity',
      color: 'purple'
    },
    {
      id: 'testing',
      name: 'Testing',
      description: 'Quality assurance, verification, load-testing, and security scans.',
      iconName: 'ClipboardCheck',
      color: 'teal'
    },
    {
      id: 'operations',
      name: 'Operations',
      description: 'Incident handling, resilience, scaling, and system telemetry.',
      iconName: 'Activity',
      color: 'orange'
    }
  ],
  subDomains: [
    {
      id: 'system-architecture',
      domainId: 'architecture',
      name: 'System Architecture',
      description: 'High-level structure of complex software system components and interactions.',
      content: `# System Architecture

## Overview
System Architecture outlines the conceptual model that defines the structure, behavior, and more views of a system. It serves as the foundation for scalability, reliability, and security of modern full-stack platforms.

### Key Architectural Styles
- **Monolithic**: Single unit deployments, ideal for low-complexity or early-stage products.
- **Microservices**: Loose-coupling, enabling independent service scaling, localized failures, and polyglot stacks.
- **Event-Driven**: Asynchronous message passing, maximizing throughput and decouple of production and consumption.

### Core Architectural Decisions
- [x] Synchronous vs Asynchronous message queues
- [ ] Database selection matching read/write profiles
- [ ] Isolation levels and state persistence boundaries

### Cross-Domain Links
- Integrates with **Database: Schema Design** to define transactional boundaries.
- Relies on **DevOps: Containerization** for isolated runtime environments.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'software-architecture',
      domainId: 'architecture',
      name: 'Software Architecture',
      description: 'Design patterns, component interfaces, and clean code principles.',
      content: `# Software Architecture

## Overview
Software Architecture focuses on internal code organization, maintainability, separation of concerns, and development velocities. It ensures that code scales with team sizes and changing requirements.

### Core Principles
- **SOLID**: Clean OOP design metrics.
- **Domain-Driven Design (DDD)**: Structuring software domains around real-world business domains.
- **Clean Architecture / Hexagonal**: Decoupling frameworks, drivers, and user interfaces from core business logic via adapters.

### Action Items
- [x] Define layered directory structure (controllers, services, repositories)
- [ ] Standardize error-handling frameworks and API middleware
- [ ] Configure dependency injection containers for loose coupling`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'solution-architecture',
      domainId: 'architecture',
      name: 'Solution Architecture',
      description: 'Translating business requirements into robust technical specifications.',
      content: `# Solution Architecture

## Overview
Solution Architecture bridges business needs and technical execution, mapping user journeys into concrete platform services, integrations, and operational models.

### Focus Areas
- **Cost Estimation**: Balancing server capabilities and licensing costs.
- **Integration**: Integrating external SaaS APIs, identity providers, and search indices.
- **High Availability**: Multi-region active-passive or active-active configurations.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'cloud-architecture',
      domainId: 'architecture',
      name: 'Cloud Architecture',
      description: 'Cloud provider resources, network topologies, and managed services.',
      content: `# Cloud Architecture

## Overview
Designing robust, secure, and cost-effective cloud resource topographies using AWS, GCP, or Azure services.

### Core Architectural Pillars
1. **Network Isolation**: Virtual Private Clouds (VPC), private subnets, NAT Gateways, and security groups.
2. **Global Distribution**: Content Delivery Networks (CDN) and Anycast DNS routing.
3. **Elastic Capacity**: Auto-scaling groups matching real-time system loading thresholds.

### Deployment Checklist
- [x] Provision private subnets for database clusters
- [ ] Configure serverless compute runtime for microservices
- [ ] Set up global CDN caching rules`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'security-architecture',
      domainId: 'architecture',
      name: 'Security Architecture',
      description: 'Trust boundaries, secure enclaves, and cryptographic foundations.',
      content: `# Security Architecture

## Overview
Establishes system-wide security controls, defense-in-depth methodologies, and encryption keys infrastructure.

### Guiding Doctrines
- **Zero Trust**: Always verify, never assume. Explicitly authorize every request.
- **Principle of Least Privilege**: Grant processes the absolute minimum system permissions required.
- **Defense in Depth**: Layered security policies across transport layers, firewalls, hosts, and data storage.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'ai-ml-architecture',
      domainId: 'architecture',
      name: 'AI/ML Architecture',
      description: 'AI model deployment, serving, vector search, and agent orchestration.',
      content: `# AI/ML Architecture

## Overview
Designing low-latency serving stacks for LLMs, agent frameworks, embedding stores, and real-time model inferences.

### Structural Blocks
- **Vector Databases**: Semantic lookup caching (e.g., Pinecone, pgvector).
- **Agent Orchestrators**: Combining prompts, tools (Function Calling), and history.
- **API Gateways for AI**: Rate-limiting token consumption and proxying secure API keys.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'data-architecture',
      domainId: 'architecture',
      name: 'Data Architecture',
      description: 'Data ingestion flow, analytical lakes, and transactional storage design.',
      content: `# Data Architecture

## Overview
Organizes data flows across analytical warehouses, streaming pipelines, and operational stores.

### Focus areas
- **OLTP vs OLAP**: Partitioning real-time databases from analytical lakes (e.g., BigQuery, Snowflake).
- **ETL/ELT**: Automated data cleaning, sanitization, and delivery.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'integration-architecture',
      domainId: 'architecture',
      name: 'Integration Architecture',
      description: 'Enterprise bus systems, message brokers, and webhook integrations.',
      content: `# Integration Architecture

## Overview
Integration Architecture governs communication between internal and third-party systems using message brokers and enterprise standard protocols.

### Integration Patterns
- **Point-to-Point**: Direct API integration, simple but increases architectural spaghetti.
- **Publish-Subscribe**: Event-driven message brokers (Kafka, RabbitMQ) decoupling publishers.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'deployment-architecture',
      domainId: 'architecture',
      name: 'Deployment Architecture',
      description: 'Physical server provisioning, container configurations, and CD engines.',
      content: `# Deployment Architecture

## Overview
Outlines the release lifecycle mapping compiled code into running servers or serverless container configurations.

### Key Practices
- **Blue-Green Deployments**: Maintain identical staging and production environments to achieve zero-downtime releases.
- **Canary Deployments**: Incrementally route a percentage of traffic to new service builds to safely audit runtime behavior.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // DATABASE DOMAIN
    {
      id: 'schema-design',
      domainId: 'database',
      name: 'Schema Design',
      description: 'Designing normalized or denormalized database schemas and constraints.',
      content: `# Schema Design

## Overview
Creating a database model that maximizes query execution speed, enforces data consistency, and maintains operational scalability.

### Normalization Levels
- **1NF**: Atomic values.
- **2NF**: No partial dependency.
- **3NF**: No transitive dependency. Essential for avoiding write anomalies.
- **Denormalization**: Intentionally mixing tables to satisfy ultra-high-speed analytical read workflows.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'data-models',
      domainId: 'database',
      name: 'Data Models',
      description: 'Relational, document, key-value, and graph data representations.',
      content: `# Data Models

## Overview
Selecting and mapping business data models to the correct database engines (SQL, NoSQL, Graph, or Document stores).`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'query-optimization',
      domainId: 'database',
      name: 'Query Optimization',
      description: 'Indexes, query analysis, slow query identification, and cache strategies.',
      content: `# Query Optimization

## Overview
Query Optimization aims to minimize response latency and resource footprint for read/write database actions.

### Core Techniques
- **Indexing**: Creating B-Trees, Hash indexes, or GIN indexes to bypass expensive sequential scans.
- **Query Plans**: Using \`EXPLAIN ANALYZE\` to identify bottlenecks.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'migration-strategies',
      domainId: 'database',
      name: 'Migration Strategies',
      description: 'Safe database migration techniques with zero downtime.',
      content: `# Migration Strategies

## Overview
Updating schema definitions across production environments without blocking writes or causing data corruption.

### Two-Phase Migration Pattern
1. **Add**: Add new nullable columns or tables to the database.
2. **Deploy Code**: Deploy server versions writing to both columns.
3. **Backfill**: Backfill data for historic records.
4. **Remove/Cleanup**: Safely deprecate and drop unused assets.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // APIS DOMAIN
    {
      id: 'restful-apis',
      domainId: 'apis',
      name: 'RESTful APIs',
      description: 'HTTP verb design, resource routing, status codes, and hypermedia.',
      content: `# RESTful APIs

## Overview
RESTful API design focuses on stateless, resource-oriented operations using standardized HTTP verbs and response envelopes.

### HTTP Methods Guidelines
- \`GET\`: Retrieve resources safely without side-effects. Must be idempotent.
- \`POST\`: Create new entities.
- \`PUT\`: Overwrite existing resource properties.
- \`PATCH\`: Perform partial field modifications.
- \`DELETE\`: Remove resources cleanly.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'graphql',
      domainId: 'apis',
      name: 'GraphQL',
      description: 'Declarative queries, mutations, type schemas, and resolver caching.',
      content: `# GraphQL

## Overview
GraphQL provides a powerful declarative query syntax, enabling clients to specify the precise fields they require from the server, eliminating over-fetching.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'microservices',
      domainId: 'apis',
      name: 'Microservices',
      description: 'Decoupling monolithic software architectures into independent processes.',
      content: `# Microservices

## Overview
Structuring systems as collections of autonomous, loosely coupled services aligned around business subdomains.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'api-gateways',
      domainId: 'apis',
      name: 'API Gateways',
      description: 'Reverse-proxies, rate limiters, auth headers, and route matching rules.',
      content: `# API Gateways

## Overview
The single entry point orchestrating incoming requests, routing to internal services, and enforcing global ingress rules.

### Core Policies
- **Authentication**: Validating Bearer tokens (JWT) before routing downstream.
- **Rate Limiting**: Enforcing client request limits via Token Bucket or Leaky Bucket algorithms.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // AI/ML DOMAIN
    {
      id: 'model-training',
      domainId: 'ai-ml',
      name: 'Model Training',
      description: 'Model selection, training loops, hyperparameter tuning, and verification.',
      content: `# Model Training

## Overview
Standard practices for pipeline design, learning scheduling, and evaluating model accuracy and regression indexes.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'inference-pipelines',
      domainId: 'ai-ml',
      name: 'Inference Pipelines',
      description: 'Running optimized, low-latency, containerized real-time model predictions.',
      content: `# Inference Pipelines

## Overview
Deploying AI models for real-time, low-latency predictions using frameworks like Triton Inference Server or FastAPI.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'data-processing',
      domainId: 'ai-ml',
      name: 'Data Processing',
      description: 'Data cleaning, feature extraction, tokenization, and vector transformations.',
      content: `# Data Processing

## Overview
Transforming messy raw operational data into pristine datasets ready for training or semantic vector querying.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'ethical-ai',
      domainId: 'ai-ml',
      name: 'Ethical AI',
      description: 'Bias reduction, explaining predictions, privacy regulations, and guardrails.',
      content: `# Ethical AI

## Overview
Implementing security guardrails, audit logging, and bias mitigation algorithms within automated decision-making engines.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // SECURITY DOMAIN
    {
      id: 'auth',
      domainId: 'security',
      name: 'Authentication & Authorization',
      description: 'OAuth2, JWT standards, multi-factor, RBAC and ABAC access controls.',
      content: `# Authentication & Authorization

## Overview
Enforces verify identities (Authentication) and validates specific resource access permissions (Authorization).

### Key Architectures
- **OAuth 2.1**: Delegated access framework.
- **OIDC (OpenID Connect)**: Identity layer on top of OAuth.
- **RBAC (Role-Based Access Control)**: Permissions assigned to structural user roles (e.g., admin, editor, reader).`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'encryption',
      domainId: 'security',
      name: 'Encryption',
      description: 'Symmetric/Asymmetric encryption, TLS layers, and secrets management.',
      content: `# Encryption

## Overview
Data protection controls at-rest (using AES-256) and in-transit (using TLS 1.3).`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'compliance',
      domainId: 'security',
      name: 'Compliance (GDPR, HIPAA, etc.)',
      description: 'Regulatory guidelines, user privacy controls, and audit logs.',
      content: `# Compliance (GDPR, HIPAA, etc.)

## Overview
Aligning enterprise platform blueprints with complex regulatory frameworks like GDPR, HIPAA, and SOC2.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'threat-modeling',
      domainId: 'security',
      name: 'Threat Modeling',
      description: 'Identifying structural security gaps during the planning phase.',
      content: `# Threat Modeling

## Overview
The practice of auditing platform structures systematically using frameworks like **STRIDE**:
- **S**poofing
- **T**ampering
- **R**epudiation
- **I**nformation Disclosure
- **D**enial of Service
- **E**levation of Privilege`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // DEVOPS DOMAIN
    {
      id: 'ci-cd',
      domainId: 'devops',
      name: 'CI/CD Pipelines',
      description: 'Automating build, test, and container deployment lifecycles.',
      content: `# CI/CD Pipelines

## Overview
Continuous Integration and Continuous Deployment pipelines automate high-frequency software validation and container delivery processes.

### CI Phase (Validation)
1. **Trigger**: Developer pushes code to Github repository branch.
2. **Lint/Scan**: Run static code analysis, style guides, and vulnerability scans.
3. **Unit Tests**: Execute full test suites in container isolation.
4. **Compile/Build**: Compile binaries and package containers.

### CD Phase (Delivery)
- Automated deployment to staging/production clusters.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'iac',
      domainId: 'devops',
      name: 'Infrastructure as Code (IaC)',
      description: 'Terraform, CloudFormation, declarative resources, and drift control.',
      content: `# Infrastructure as Code (IaC)

## Overview
Provisioning physical hardware, load-balancers, networks, and firewalls using declarative configuration tools like Terraform or Ansible.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'monitoring',
      domainId: 'devops',
      name: 'Monitoring & Logging',
      description: 'Aggregating logs, dashboard metrics, alerting structures, and traces.',
      content: `# Monitoring & Logging

## Overview
Achieving high-visibility telemetry into platform health metrics using the **Golden Signals**:
- **Latency**: Time taken to fulfill client requests.
- **Traffic**: Request volume on the service.
- **Errors**: Rates of request failures.
- **Saturation**: Server resources utilization levels (CPU, memory, storage).`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'containerization',
      domainId: 'devops',
      name: 'Containerization (Docker, Kubernetes)',
      description: 'Docker image packaging, layer caching, and Kubernetes pod orchestration.',
      content: `# Containerization (Docker, Kubernetes)

## Overview
Isolating software builds, dependencies, and environments in Docker containers, and managing dynamic multi-host networks using Kubernetes.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // TESTING DOMAIN
    {
      id: 'unit-testing',
      domainId: 'testing',
      name: 'Unit Testing',
      description: 'Verifying individual code modules, functions, and adapters.',
      content: `# Unit Testing

## Overview
Validating code blocks in absolute isolation by mocking all external dependencies, network interfaces, and database drivers.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'integration-testing',
      domainId: 'testing',
      name: 'Integration Testing',
      description: 'Auditing data flows between two or more system components.',
      content: `# Integration Testing

## Overview
Ensuring database queries, external integrations, API adapters, and cache servers exchange data accurately as a composite system.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'performance-testing',
      domainId: 'testing',
      name: 'Performance Testing',
      description: 'Load tests, stress checks, spike profiles, and bottleneck analysis.',
      content: `# Performance Testing

## Overview
Stress-testing system limits using load simulation tools like k6 or Locust to audit latency, concurrency, and degradation indexes.`,
      status: 'draft',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'security-testing',
      domainId: 'testing',
      name: 'Security Testing',
      description: 'SAST/DAST scanners, dependency audits, and penetration tests.',
      content: `# Security Testing

## Overview
Automating static application scanning (SAST), dynamic active exploit scans (DAST), and dependency CVE audits before shipping code.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },

    // OPERATIONS DOMAIN
    {
      id: 'incident-management',
      domainId: 'operations',
      name: 'Incident Management',
      description: 'On-call alerting schedules, runbooks, and post-mortem logs.',
      content: `# Incident Management

## Overview
Structured playbooks, pager duties, and post-incident logs to minimize Mean Time to Resolution (MTTR).`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'disaster-recovery',
      domainId: 'operations',
      name: 'Disaster Recovery',
      description: 'Failover topographies, database snapshots, RTO and RPO metrics.',
      content: `# Disaster Recovery

## Overview
Disaster Recovery governs business continuity metrics in catastrophic platform failures (e.g., complete regional cloud outage).

### Vital Metrics
- **RTO (Recovery Time Objective)**: Maximum tolerable duration of service outage before full restoration.
- **RPO (Recovery Point Objective)**: Maximum acceptable age of data loss from the moment of failure.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    },
    {
      id: 'scalability-planning',
      domainId: 'operations',
      name: 'Scalability Planning',
      description: 'Audit logs, database sharding, caching, and load distribution schemes.',
      content: `# Scalability Planning

## Overview
Capacity planning, vertical and horizontal autoscaling strategies, CDN optimizations, and microservice isolation layers to handle traffic surges.`,
      status: 'completed',
      lastUpdated: '2026-08-04T08:55:00-07:00'
    }
  ],
  connections: [
    {
      id: 'conn-1',
      sourceId: 'deployment-architecture',
      targetId: 'ci-cd',
      description: 'Deployment steps and container configs are triggered and run inside continuous deployment pipelines.',
      type: 'dependency'
    },
    {
      id: 'conn-2',
      sourceId: 'deployment-architecture',
      targetId: 'compliance',
      description: 'Server setups and cloud network boundaries must conform to regulatory privacy constraints (GDPR/HIPAA).',
      type: 'security'
    },
    {
      id: 'conn-3',
      sourceId: 'api-gateways',
      targetId: 'auth',
      description: 'API Gateways act as the primary security layer, validating user access tokens before routing.',
      type: 'security'
    },
    {
      id: 'conn-4',
      sourceId: 'auth',
      targetId: 'threat-modeling',
      description: 'Authentication strategies and access privileges are mapped as key threat boundaries in threat modeling reviews.',
      type: 'dependency'
    },
    {
      id: 'conn-5',
      sourceId: 'restful-apis',
      targetId: 'schema-design',
      description: 'REST API payload requests are parsed and stored based on DB schema models and column constraints.',
      type: 'data-flow'
    },
    {
      id: 'conn-6',
      sourceId: 'query-optimization',
      targetId: 'scalability-planning',
      description: 'Optimized index caching and queries relieve DB bottlenecks, enabling higher platform scaling limits.',
      type: 'data-flow'
    },
    {
      id: 'conn-7',
      sourceId: 'model-training',
      targetId: 'data-processing',
      description: 'Model training stages require structured features pre-processed through vector pipeline workflows.',
      type: 'dependency'
    },
    {
      id: 'conn-8',
      sourceId: 'ai-ml-architecture',
      targetId: 'ethical-ai',
      description: 'AI serving architectures deploy policy guardrails ensuring system fairness and data privacy metrics.',
      type: 'security'
    }
  ]
};
