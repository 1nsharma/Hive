import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { DatabaseClient } from '../src/client.js';
import { Migrator } from '../src/migrator.js';

describe('PostgreSQL Row-Level Security (RLS) Multi-Tenant Isolation', () => {
  let pglite;
  let db;
  let migrator;

  let tenantA_id;
  let tenantB_id;

  let locationA1_id;
  let locationB1_id;

  beforeEach(async () => {
    pglite = new PGlite();
    db = new DatabaseClient({ adapter: pglite });
    migrator = new Migrator(db, path.resolve(process.cwd(), 'deploy/migrations'));

    // Apply migrations
    await migrator.migrateUp();

    // Setup Tenant A and Tenant B under SuperAdmin bypass
    await db.withSuperAdmin(async (tx) => {
      // 1. Create Organization A
      const orgARes = await tx.query(`
        INSERT INTO organizations (slug, name) VALUES ('tenant-a', 'Tenant Alpha') RETURNING id;
      `);
      tenantA_id = orgARes.rows[0].id;

      // 2. Create Organization B
      const orgBRes = await tx.query(`
        INSERT INTO organizations (slug, name) VALUES ('tenant-b', 'Tenant Beta') RETURNING id;
      `);
      tenantB_id = orgBRes.rows[0].id;

      // 3. Create Location A1
      const locARes = await tx.query(`
        INSERT INTO locations (organization_id, name, timezone)
        VALUES ($1, 'HQ Site Alpha', 'America/New_York') RETURNING id;
      `, [tenantA_id]);
      locationA1_id = locARes.rows[0].id;

      // 4. Create Location B1
      const locBRes = await tx.query(`
        INSERT INTO locations (organization_id, name, timezone)
        VALUES ($1, 'HQ Site Beta', 'Europe/London') RETURNING id;
      `, [tenantB_id]);
      locationB1_id = locBRes.rows[0].id;

      // 5. Create Users
      await tx.query(`
        INSERT INTO users (organization_id, email, password_hash, full_name)
        VALUES ($1, 'alice@alpha.com', 'hash_a', 'Alice Alpha');
      `, [tenantA_id]);

      await tx.query(`
        INSERT INTO users (organization_id, email, password_hash, full_name)
        VALUES ($1, 'bob@beta.com', 'hash_b', 'Bob Beta');
      `, [tenantB_id]);

      // 6. Create Audit Events
      await tx.query(`
        INSERT INTO audit_events (
          organization_id, actor_type, actor_id, action, resource_type, resource_id,
          status, correlation_id, prev_event_hash, event_hash
        ) VALUES (
          $1, 'USER', 'alice-id', 'SITE_CREATED', 'LOCATION', $2,
          'SUCCESS', 'trace-a', '0000', 'hash-a'
        );
      `, [tenantA_id, locationA1_id]);

      await tx.query(`
        INSERT INTO audit_events (
          organization_id, actor_type, actor_id, action, resource_type, resource_id,
          status, correlation_id, prev_event_hash, event_hash
        ) VALUES (
          $1, 'USER', 'bob-id', 'SITE_CREATED', 'LOCATION', $2,
          'SUCCESS', 'trace-b', '0000', 'hash-b'
        );
      `, [tenantB_id, locationB1_id]);
    });
  });

  afterEach(async () => {
    await db.close();
  });

  test('Tenant A context queries ONLY return Tenant A locations', async () => {
    await db.withTenant(tenantA_id, async (tx) => {
      // Query without any WHERE organization_id clause
      const res = await tx.query('SELECT id, name, organization_id FROM locations');
      
      assert.equal(res.rows.length, 1);
      assert.equal(res.rows[0].id, locationA1_id);
      assert.equal(res.rows[0].name, 'HQ Site Alpha');
      assert.equal(res.rows[0].organization_id, tenantA_id);
    });
  });

  test('Tenant B context queries ONLY return Tenant B locations', async () => {
    await db.withTenant(tenantB_id, async (tx) => {
      // Query without any WHERE organization_id clause
      const res = await tx.query('SELECT id, name, organization_id FROM locations');

      assert.equal(res.rows.length, 1);
      assert.equal(res.rows[0].id, locationB1_id);
      assert.equal(res.rows[0].name, 'HQ Site Beta');
      assert.equal(res.rows[0].organization_id, tenantB_id);
    });
  });

  test('Tenant A explicitly querying Tenant B location returns 0 rows (DENY)', async () => {
    await db.withTenant(tenantA_id, async (tx) => {
      // Malicious or accidental attempt to fetch Tenant B's location by ID
      const res = await tx.query('SELECT * FROM locations WHERE id = $1', [locationB1_id]);
      assert.equal(res.rows.length, 0);
    });
  });

  test('Tenant A cannot INSERT a record belonging to Tenant B (RLS CHECK violation)', async () => {
    await db.withTenant(tenantA_id, async (tx) => {
      // Attempting to insert a location for Tenant B under Tenant A session
      await assert.rejects(async () => {
        await tx.query(`
          INSERT INTO locations (organization_id, name, timezone)
          VALUES ($1, 'Infiltrated Site', 'UTC');
        `, [tenantB_id]);
      }, /policy|violat/i);
    });
  });

  test('Audit trail isolation: Tenant A cannot inspect Tenant B audit events', async () => {
    await db.withTenant(tenantA_id, async (tx) => {
      const res = await tx.query('SELECT * FROM audit_events');
      assert.equal(res.rows.length, 1);
      assert.equal(res.rows[0].organization_id, tenantA_id);
      assert.equal(res.rows[0].action, 'SITE_CREATED');
      assert.equal(res.rows[0].correlation_id, 'trace-a');
    });

    await db.withTenant(tenantB_id, async (tx) => {
      const res = await tx.query('SELECT * FROM audit_events');
      assert.equal(res.rows.length, 1);
      assert.equal(res.rows[0].organization_id, tenantB_id);
      assert.equal(res.rows[0].correlation_id, 'trace-b');
    });
  });

  test('SuperAdmin context bypasses RLS and can inspect all records', async () => {
    await db.withSuperAdmin(async (tx) => {
      const res = await tx.query('SELECT id, name FROM locations ORDER BY name');
      assert.equal(res.rows.length, 2);
      assert.equal(res.rows[0].name, 'HQ Site Alpha');
      assert.equal(res.rows[1].name, 'HQ Site Beta');

      const auditRes = await tx.query('SELECT id, correlation_id FROM audit_events ORDER BY correlation_id');
      assert.equal(auditRes.rows.length, 2);
    });
  });

  test('Privileged DB role test: verify runtime role aura_app has NO BYPASSRLS and NO SUPERUSER', async () => {
    const res = await db.query(`
      SELECT rolname, rolsuper, rolbypassrls 
      FROM pg_roles 
      WHERE rolname = 'aura_app';
    `);
    assert.equal(res.rows.length, 1);
    assert.equal(res.rows[0].rolname, 'aura_app');
    assert.equal(res.rows[0].rolsuper, false);
    assert.equal(res.rows[0].rolbypassrls, false);
  });

  test('Unset tenant context in normal session returns empty set (safe default)', async () => {
    // Normal connection with NO tenant context set
    await db.asAppRole(async (tx) => {
      const res = await tx.query('SELECT * FROM locations');
      assert.equal(res.rows.length, 0);
    });
  });
});
