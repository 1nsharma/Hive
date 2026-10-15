/**
 * Aura v1: Database Client & Tenant Context Manager
 * Enforces PostgreSQL Row-Level Security via transactional session variables.
 */

import pg from 'pg';

export class DatabaseClient {
  /**
   * @param {Object} [options]
   * @param {string} [options.connectionString]
   * @param {Object} [options.adapter] - Injected adapter (e.g. PGlite for tests)
   */
  constructor(options = {}) {
    if (options.adapter) {
      this.adapter = options.adapter;
      this.isPool = false;
    } else {
      const { Pool } = pg;
      this.pool = new Pool({
        connectionString: options.connectionString || process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
      this.isPool = true;
    }
  }

  /**
   * Raw query execution.
   * @param {string} text
   * @param {Array} [params]
   */
  async query(text, params = []) {
    if (this.adapter) {
      return this.adapter.query(text, params);
    }
    return this.pool.query(text, params);
  }

  /**
   * Multi-statement SQL script execution (e.g. for migrations).
   * @param {string} sql
   */
  async exec(sql) {
    if (this.adapter && typeof this.adapter.exec === 'function') {
      return this.adapter.exec(sql);
    }
    return this.query(sql);
  }

  /**
   * Executes a callback within a managed transaction.
   * @param {Function} callback - async (client) => result
   */
  async transaction(callback) {
    if (this.adapter) {
      await this.adapter.query('BEGIN');
      try {
        const result = await callback(this.adapter);
        await this.adapter.query('COMMIT');
        return result;
      } catch (err) {
        await this.adapter.query('ROLLBACK');
        throw err;
      }
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Executes a callback within a tenant-scoped transaction.
   * Enforces RLS by switching to `aura_app` role and setting `app.current_organization_id`.
   * 
   * @param {string} organizationId - UUID of the tenant
   * @param {Function} callback - async (client) => result
   */
  async withTenant(organizationId, callback) {
    if (!organizationId) {
      throw new Error('organizationId is required for tenant-scoped operations');
    }

    return this.transaction(async (tx) => {
      await tx.query('SET ROLE aura_app');
      await tx.query(`SET LOCAL app.current_organization_id = '${organizationId}'`);
      await tx.query(`SET LOCAL app.is_super_admin = 'false'`);
      return callback(tx);
    });
  }

  /**
   * Executes a callback as the runtime application role without any tenant context set.
   * Used to verify safe default behavior (returns empty set on tenant tables).
   * 
   * @param {Function} callback - async (client) => result
   */
  async asAppRole(callback) {
    return this.transaction(async (tx) => {
      await tx.query('SET ROLE aura_app');
      await tx.query(`SET LOCAL app.current_organization_id = ''`);
      await tx.query(`SET LOCAL app.is_super_admin = 'false'`);
      return callback(tx);
    });
  }

  /**
   * Executes a callback with SuperAdmin platform privileges (RLS bypass enabled).
   * 
   * @param {Function} callback - async (client) => result
   */
  async withSuperAdmin(callback) {
    return this.transaction(async (tx) => {
      await tx.query('RESET ROLE');
      await tx.query(`SET LOCAL app.is_super_admin = 'true'`);
      await tx.query(`SET LOCAL app.current_organization_id = ''`);
      return callback(tx);
    });
  }

  /**
   * Health check to verify database connectivity.
   */
  async ping() {
    const res = await this.query('SELECT 1 as alive');
    return res.rows && res.rows[0] && res.rows[0].alive === 1;
  }

  /**
   * Graceful shutdown of connection pool.
   */
  async close() {
    if (this.isPool && this.pool) {
      await this.pool.end();
    } else if (this.adapter && typeof this.adapter.close === 'function') {
      await this.adapter.close();
    }
  }
}
