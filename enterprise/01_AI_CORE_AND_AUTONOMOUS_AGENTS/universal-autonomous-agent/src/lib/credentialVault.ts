import { TenantConnection } from '../types';
import { INITIAL_TENANT_CONNECTIONS } from '../data/mockData';

/**
 * CREDENTIAL VAULT & CONNECTION RESOLVER (A4)
 * 
 * CRITICAL ARCHITECTURAL INVARIANT:
 * Credentials reside strictly in the KMS/Vault layer.
 * They are NEVER passed to:
 *   - AgentContext
 *   - AgentProposal
 *   - LLM context or memory
 *   - ToolExecution input or output
 *   - Audit logs or UI previews
 * 
 * ToolRuntime resolves credentials at the moment of MCP dispatch only.
 */

// In-memory vault simulator with hardened simulated secrets
const VAULT_STORE: Record<string, { secret: string; type: string; issuedAt: string }> = {
  'vault://secrets/tenants/amit/github/oauth_token': {
    secret: 'ghp_enc_live_token_7x992b8d80f8373b9e4a',
    type: 'oauth2_bearer',
    issuedAt: '2026-09-01T00:00:00Z'
  },
  'vault://secrets/tenants/amit/linkedin/oauth_token': {
    secret: 'lia_enc_prod_v2_911f93028c12e557b4',
    type: 'oauth2_bearer',
    issuedAt: '2026-09-01T00:00:00Z'
  },
  'vault://secrets/tenants/amit/db/pool_conn_string': {
    secret: 'postgres://app_user:p_w_d_secure_vector@pg.agentos.internal:5432/agent_os',
    type: 'database_connection_string',
    issuedAt: '2026-08-15T00:00:00Z'
  },
  'vault://secrets/tenants/amit/redis/auth_token': {
    secret: 'redis_auth_clust_01_token_secret_xyz',
    type: 'redis_token',
    issuedAt: '2026-08-15T00:00:00Z'
  }
};

export class CredentialVault {
  private connections: TenantConnection[];

  constructor(initialConnections: TenantConnection[] = INITIAL_TENANT_CONNECTIONS) {
    this.connections = [...initialConnections];
  }

  /**
   * Resolves connection status for a tenant + provider
   */
  public resolveConnection(tenantId: string, provider: string): {
    valid: boolean;
    connection?: TenantConnection;
    reason?: string;
  } {
    const conn = this.connections.find(
      c => c.tenantId === tenantId && c.provider === provider
    );

    if (!conn) {
      return {
        valid: false,
        reason: `No connection registered for tenant "${tenantId}" and provider "${provider}".`
      };
    }

    if (conn.status === 'disconnected') {
      return {
        valid: false,
        connection: conn,
        reason: `Connection "${conn.displayName}" is currently disconnected or revoked.`
      };
    }

    if (conn.rateLimitRemaining <= 0) {
      return {
        valid: false,
        connection: conn,
        reason: `Connection "${conn.displayName}" has exceeded provider rate limit window.`
      };
    }

    return { valid: true, connection: conn };
  }

  /**
   * Securely acquires credential token inside ToolRuntime boundary.
   * This is NEVER exposed outside the ToolRuntime MCP execution wrapper.
   */
  public acquireSecretInternal(vaultSecretRef: string): {
    token: string;
    type: string;
  } | null {
    const record = VAULT_STORE[vaultSecretRef];
    if (!record) return null;
    return { token: record.secret, type: record.type };
  }

  /**
   * Helper to deep-sanitize any object or log entry so that secrets are never leaked.
   */
  public static scrubObject<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') return obj;
    const jsonStr = JSON.stringify(obj);
    // Mask any common token/secret patterns
    const sanitized = jsonStr
      .replace(/ghp_[a-zA-Z0-9_-]+/g, 'ghp_***MASKED_CREDENTIAL***')
      .replace(/lia_[a-zA-Z0-9_-]+/g, 'lia_***MASKED_CREDENTIAL***')
      .replace(/postgres:\/\/[^@]+@/g, 'postgres://***USER:PASS_MASKED***@')
      .replace(/"secret":\s*"[^"]+"/g, '"secret": "***REDACTED***"')
      .replace(/"token":\s*"[^"]+"/g, '"token": "***REDACTED***"');
    return JSON.parse(sanitized);
  }
}
