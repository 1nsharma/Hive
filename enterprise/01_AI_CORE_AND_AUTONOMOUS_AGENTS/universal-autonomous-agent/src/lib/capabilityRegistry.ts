import { CapabilityDefinition } from '../types';

/**
 * CAPABILITY REGISTRY (A1)
 * Central canonical registry for all agent capabilities.
 * 
 * CRITICAL ARCHITECTURAL RULE:
 * Agent specifies only abstract intent: { resource, action }
 * The Registry and ToolRuntime resolve this into concrete Provider, MCP Adapter,
 * Risk Profile, Rate Limits, and Security Pre-requisites.
 * 
 * The Agent NEVER selects the provider or accesses MCP directly!
 */
export const CAPABILITY_REGISTRY: Record<string, CapabilityDefinition> = {
  // 1. Web Search
  'search_public_web': {
    id: 'search_public_web',
    resource: 'public_web',
    action: 'read',
    provider: 'mcp_web',
    mcpMethod: 'search_public_web',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 60,
    costEstimateUsd: 0.005,
    description: 'Query public search engine index for brand mentions, technical updates, and discussions.',
    risk: {
      dataSensitivity: 0,
      externalCommunication: 0,
      financialImpact: 0,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 0,
      riskLevel: 'low'
    }
  },

  // 2. GitHub Public Activity
  'read_github_public': {
    id: 'read_github_public',
    resource: 'github',
    action: 'read',
    provider: 'mcp_github',
    mcpMethod: 'read_github_public',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 100,
    costEstimateUsd: 0.001,
    description: 'Inspect public commits, pull requests, releases, and discussions on open source repositories.',
    risk: {
      dataSensitivity: 0,
      externalCommunication: 0,
      financialImpact: 0,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 0,
      riskLevel: 'low'
    }
  },

  // 3. LinkedIn Content Draft (Safe: Creates draft on platform staging, does NOT publish)
  'create_content_draft': {
    id: 'create_content_draft',
    resource: 'linkedin',
    action: 'create_draft',
    provider: 'mcp_linkedin',
    mcpMethod: 'create_draft',
    requiresConnection: true,
    requiresApproval: false, // Draft is internal/staging, reversible
    rateLimitPerHour: 15,
    costEstimateUsd: 0.01,
    description: 'Generate structured draft post with media and citations in LinkedIn drafts staging queue.',
    risk: {
      dataSensitivity: 1,
      externalCommunication: 1, // Staging draft only
      financialImpact: 0,
      reputationImpact: 1, // Low: not yet live
      destructiveness: 0,
      reversibility: 0, // Fully reversible/deletable draft
      compositeScore: 18,
      riskLevel: 'low'
    }
  },

  // 4. LinkedIn Publish (High Risk: Live outbound post)
  'publish_post': {
    id: 'publish_post',
    resource: 'linkedin',
    action: 'publish',
    provider: 'mcp_linkedin',
    mcpMethod: 'publish_post',
    requiresConnection: true,
    requiresApproval: true, // MANDATORY HUMAN REVIEW
    rateLimitPerHour: 4,
    costEstimateUsd: 0.02,
    description: 'Directly broadcast verified post to live public LinkedIn feed under user identity.',
    risk: {
      dataSensitivity: 1,
      externalCommunication: 3, // Direct Outbound Public
      financialImpact: 0,
      reputationImpact: 3, // Public Branding / High Profile
      destructiveness: 0,
      reversibility: 3, // Irreversible once distributed to follower feeds
      compositeScore: 82,
      riskLevel: 'critical'
    }
  },

  // 5. Memory Store
  'store_memory': {
    id: 'store_memory',
    resource: 'memory',
    action: 'store',
    provider: 'mcp_memory',
    mcpMethod: 'store_node',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 300,
    costEstimateUsd: 0.0005,
    description: 'Persist episodic observations and semantic identity facts into encrypted memory ledger.',
    risk: {
      dataSensitivity: 1,
      externalCommunication: 0,
      financialImpact: 0,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 5,
      riskLevel: 'low'
    }
  },

  // 6. Memory Read
  'read_memory': {
    id: 'read_memory',
    resource: 'memory',
    action: 'read',
    provider: 'mcp_memory',
    mcpMethod: 'query_nodes',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 500,
    costEstimateUsd: 0.0001,
    description: 'Retrieve relevant memories via semantic similarity and recency filter.',
    risk: {
      dataSensitivity: 1,
      externalCommunication: 0,
      financialImpact: 0,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 4,
      riskLevel: 'low'
    }
  },

  // 7. LLM Cognitive Operations
  'classify_and_detect': {
    id: 'classify_and_detect',
    resource: 'llm',
    action: 'classify_and_detect',
    provider: 'mcp_llm',
    mcpMethod: 'classify_and_detect',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 120,
    costEstimateUsd: 0.02,
    description: 'Perform cognitive identity entity disambiguation and change significance extraction.',
    risk: {
      dataSensitivity: 0,
      externalCommunication: 0,
      financialImpact: 1,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 10,
      riskLevel: 'low'
    }
  },

  'generate_draft': {
    id: 'generate_draft',
    resource: 'llm',
    action: 'generate_draft',
    provider: 'mcp_llm',
    mcpMethod: 'generate_draft',
    requiresConnection: false,
    requiresApproval: false,
    rateLimitPerHour: 60,
    costEstimateUsd: 0.03,
    description: 'Synthesize high-signal post draft reflecting persona voice and verified observations.',
    risk: {
      dataSensitivity: 0,
      externalCommunication: 0,
      financialImpact: 1,
      reputationImpact: 0,
      destructiveness: 0,
      reversibility: 0,
      compositeScore: 10,
      riskLevel: 'low'
    }
  }
};

/**
 * Resolves a capability from abstract (resource, action) request
 */
export function resolveCapability(resource: string, action: string): CapabilityDefinition | null {
  for (const def of Object.values(CAPABILITY_REGISTRY)) {
    if (def.resource === resource && def.action === action) {
      return def;
    }
  }
  // Try combined key lookup fallback (e.g. action === 'search_public_web')
  if (CAPABILITY_REGISTRY[action]) {
    return CAPABILITY_REGISTRY[action];
  }
  return null;
}
