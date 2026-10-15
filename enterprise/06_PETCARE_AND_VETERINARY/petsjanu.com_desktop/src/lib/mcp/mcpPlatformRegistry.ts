/**
 * mcpPlatformRegistry.ts
 * Unified Platform MCP (Model Context Protocol) Registry for PetJanu.
 * Connects all internal platform MCP servers: GitHub, Vercel, Firebase, Genkit, Cloud Run, Supabase, Android CLI, Chrome DevTools, Maps, & Autonomous AI Swarms.
 */

export interface MCPServerConfig {
  id: string;
  name: string;
  provider: 'github' | 'vercel' | 'firebase' | 'genkit' | 'cloudrun' | 'supabase' | 'android_cli' | 'chrome_devtools' | 'developer_knowledge' | 'google_maps' | 'petjanu_custom';
  status: 'CONNECTED' | 'ACTIVE' | 'STANDBY';
  description: string;
  capabilities: {
    tools: string[];
    resources: string[];
    prompts: string[];
  };
  endpoint: string;
}

export const PLATFORM_MCP_SERVERS: MCPServerConfig[] = [
  {
    id: 'mcp-github',
    name: 'GitHub CI/CD Release MCP Server',
    provider: 'github',
    status: 'CONNECTED',
    description: 'Manages GitHub repository automation, APK build workflows (.github/workflows/release-apk.yml), release tags (v1.2.0), and issue tracking.',
    capabilities: {
      tools: [
        'github_create_release',
        'github_trigger_workflow',
        'github_list_commits',
        'github_manage_pull_requests'
      ],
      resources: ['github://repo/petsjanu.com', 'github://workflows/release-apk'],
      prompts: ['create_beta_apk_release', 'sync_main_branch']
    },
    endpoint: 'mcp://github-mcp-server'
  },
  {
    id: 'mcp-vercel',
    name: 'Vercel Deployment MCP Server',
    provider: 'vercel',
    status: 'CONNECTED',
    description: 'Orchestrates serverless edge deployments, preview environment builds, environment variable sync, and domain routing for petsjanu.com.',
    capabilities: {
      tools: [
        'vercel_deploy_project',
        'vercel_list_deployments',
        'vercel_set_env_vars',
        'vercel_check_domain_dns'
      ],
      resources: ['vercel://deployments', 'vercel://env-config'],
      prompts: ['deploy_production_edge', 'set_gemini_api_key']
    },
    endpoint: 'mcp://vercel-mcp-server'
  },
  {
    id: 'mcp-firebase',
    name: 'Firebase MCP Server',
    provider: 'firebase',
    status: 'CONNECTED',
    description: 'Manages Firestore databases, Firebase Auth, Remote Config templates, and Security Rules auditing.',
    capabilities: {
      tools: [
        'firebase_get_project',
        'firebase_list_apps',
        'firebase_get_sdk_config',
        'firebase_get_security_rules',
        'firebase_deploy'
      ],
      resources: ['firebase://project-config', 'firebase://security-rules'],
      prompts: ['audit_firestore_rules', 'generate_firebase_env']
    },
    endpoint: 'mcp://firebase-mcp-server'
  },
  {
    id: 'mcp-genkit',
    name: 'Genkit AI Logic MCP Server',
    provider: 'genkit',
    status: 'CONNECTED',
    description: 'Executes Genkit flows, manages Gemini AI models, prompt templates, and runtime trace analysis.',
    capabilities: {
      tools: [
        'lookup_genkit_docs',
        'get_usage_guide',
        'list_flows',
        'run_flow',
        'get_trace'
      ],
      resources: ['genkit://flows', 'genkit://traces'],
      prompts: ['triage_symptom_flow', 'generate_pet_care_plan']
    },
    endpoint: 'mcp://genkit-mcp-server'
  },
  {
    id: 'mcp-cloudrun',
    name: 'Google Cloud Run MCP Server',
    provider: 'cloudrun',
    status: 'CONNECTED',
    description: 'Deploys Node.js Express server containers, manages GCP projects, services, and log streaming.',
    capabilities: {
      tools: [
        'list_projects',
        'list_services',
        'get_service',
        'get_service_log',
        'deploy_local_folder'
      ],
      resources: ['gcp://cloudrun/services', 'gcp://cloudrun/logs'],
      prompts: ['deploy_production_container', 'inspect_server_logs']
    },
    endpoint: 'mcp://cloudrun'
  },
  {
    id: 'mcp-supabase',
    name: 'Supabase Realtime Database MCP Server',
    provider: 'supabase',
    status: 'CONNECTED',
    description: 'Postgres database queries, Row Level Security (RLS) policies, community feedback persistence, and realtime subscriptions.',
    capabilities: {
      tools: [
        'supabase_query_table',
        'supabase_execute_sql',
        'supabase_check_rls_policies',
        'supabase_manage_storage'
      ],
      resources: ['supabase://database/beta_feedback', 'supabase://storage/pet_avatars'],
      prompts: ['verify_rls_security', 'query_beta_feedback']
    },
    endpoint: 'mcp://supabase-mcp-server'
  },
  {
    id: 'mcp-android-cli',
    name: 'Android CLI & Capacitor Build MCP Server',
    provider: 'android_cli',
    status: 'CONNECTED',
    description: 'Builds Android debug & release APKs (scripts/build-apk.cjs), manages Capacitor Android sync, and AVD emulators.',
    capabilities: {
      tools: [
        'android_build_apk',
        'android_sync_capacitor',
        'android_inspect_device',
        'android_capture_screenshot'
      ],
      resources: ['android://apk/debug', 'android://emulator/status'],
      prompts: ['compile_tester_apk', 'sync_capacitor_assets']
    },
    endpoint: 'mcp://android-cli-plugin'
  },
  {
    id: 'mcp-chrome-devtools',
    name: 'Chrome DevTools Performance & A11y MCP Server',
    provider: 'chrome_devtools',
    status: 'CONNECTED',
    description: 'Monitors Core Web Vitals (LCP), performs accessibility (a11y) audits, memory heap snapshots, and network inspection.',
    capabilities: {
      tools: [
        'audit_lcp_performance',
        'audit_accessibility_a11y',
        'inspect_memory_leaks',
        'capture_network_har'
      ],
      resources: ['devtools://performance/lcp', 'devtools://a11y/audit'],
      prompts: ['debug_lcp_slowness', 'verify_accessibility_contrast']
    },
    endpoint: 'mcp://chrome-devtools-plugin'
  },
  {
    id: 'mcp-dev-knowledge',
    name: 'Developer Knowledge Base MCP Server',
    provider: 'developer_knowledge',
    status: 'CONNECTED',
    description: 'Searches technical documentation, retrieves SDK configs, and answers architectural queries.',
    capabilities: {
      tools: [
        'developerknowledge_search_documents',
        'developerknowledge_answer_query',
        'developerknowledge_get_documents'
      ],
      resources: ['knowledge://docs', 'knowledge://guides'],
      prompts: ['explain_pet_safety_architecture', 'search_sdk_docs']
    },
    endpoint: 'mcp://firebase-mcp-server/knowledge'
  },
  {
    id: 'mcp-maps',
    name: 'Google Maps Platform MCP Server',
    provider: 'google_maps',
    status: 'CONNECTED',
    description: 'Geocoding, nearby vet clinic search, lost pet radar radius calculation, and SOS maps.',
    capabilities: {
      tools: [
        'search_nearby_vets',
        'geocode_address',
        'calculate_radar_radius',
        'generate_static_map_url'
      ],
      resources: ['maps://vet-clinics', 'maps://emergency-shelters'],
      prompts: ['find_247_vet_hospital', 'calculate_sos_radius']
    },
    endpoint: 'mcp://google_maps_platform'
  },
  {
    id: 'mcp-petjanu-protocol',
    name: 'PetJanu Autonomous Protocol MCP',
    provider: 'petjanu_custom',
    status: 'ACTIVE',
    description: 'Primary custom JSON-RPC 2.0 & SSE protocol server for clinical triage, lost pet registry, and collar tags.',
    capabilities: {
      tools: [
        'pet_safety_triage',
        'search_lost_pets',
        'register_smart_collar',
        'calculate_pet_nutrition',
        'search_marketplace_products',
        'execute_sandbox_code'
      ],
      resources: ['petjanu://safety-guidelines', 'petjanu://lost-pets-registry'],
      prompts: ['emergency_triage_prompt', 'smart_tag_registration_prompt']
    },
    endpoint: '/api/mcp/rpc'
  }
];

export function getMCPRegistrySummary() {
  const totalServers = PLATFORM_MCP_SERVERS.length;
  const connectedServers = PLATFORM_MCP_SERVERS.filter(s => s.status === 'CONNECTED' || s.status === 'ACTIVE').length;
  const totalTools = PLATFORM_MCP_SERVERS.reduce((acc, s) => acc + s.capabilities.tools.length, 0);

  return {
    totalServers,
    connectedServers,
    totalTools,
    protocolVersion: '2024-11-05',
    lastSync: new Date().toISOString()
  };
}
