import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { DatabaseClient } from '../src/client.js';
import { Migrator } from '../src/migrator.js';

describe('PostgreSQL 16 Migrations Engine (UP -> DOWN -> UP)', () => {
  let pglite;
  let db;
  let migrator;
  const migrationsDir = path.resolve(process.cwd(), 'deploy/migrations');

  beforeEach(async () => {
    pglite = new PGlite();
    db = new DatabaseClient({ adapter: pglite });
    migrator = new Migrator(db, migrationsDir);
  });

  afterEach(async () => {
    await db.close();
  });

  test('migrateUp() applies all initial migrations in order', async () => {
    const executed = await migrator.migrateUp();
    assert.deepEqual(executed, ['000001_initial_schema', '000002_rls_policies']);

    // Check schema_migrations table
    const applied = await migrator.getAppliedMigrations();
    assert.deepEqual(applied, ['000001_initial_schema', '000002_rls_policies']);

    // Check that tables exist
    const tablesRes = await db.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    const tableNames = tablesRes.rows.map(r => r.table_name);
    
    assert.ok(tableNames.includes('organizations'));
    assert.ok(tableNames.includes('locations'));
    assert.ok(tableNames.includes('users'));
    assert.ok(tableNames.includes('roles'));
    assert.ok(tableNames.includes('permissions'));
    assert.ok(tableNames.includes('role_permissions'));
    assert.ok(tableNames.includes('user_roles'));
    assert.ok(tableNames.includes('sessions'));
    assert.ok(tableNames.includes('audit_events'));
  });

  test('Migration seeds default roles and permissions correctly', async () => {
    await migrator.migrateUp();

    const rolesRes = await db.query('SELECT id, is_system_role FROM roles ORDER BY id');
    const roleIds = rolesRes.rows.map(r => r.id);
    assert.ok(roleIds.includes('SUPER_ADMIN'));
    assert.ok(roleIds.includes('ORG_ADMIN'));
    assert.ok(roleIds.includes('LOCATION_ADMIN'));
    assert.ok(roleIds.includes('CUSTOMER_USER'));
    assert.ok(roleIds.includes('AUDITOR'));
    assert.ok(roleIds.includes('TECHNICIAN'));

    const permsRes = await db.query('SELECT id FROM permissions');
    const permIds = permsRes.rows.map(r => r.id);
    assert.ok(permIds.includes('org:read'));
    assert.ok(permIds.includes('user:invite'));
    assert.ok(permIds.includes('audit:read'));
  });

  test('Schema enforces constraints: unique slug and unique org email', async () => {
    await migrator.migrateUp();

    // Insert Org 1
    const orgRes = await db.query(`
      INSERT INTO organizations (slug, name) VALUES ('acme-corp', 'Acme Corp') RETURNING id;
    `);
    const orgId = orgRes.rows[0].id;

    // Duplicate slug must fail
    await assert.rejects(async () => {
      await db.query(`
        INSERT INTO organizations (slug, name) VALUES ('acme-corp', 'Acme Duplicate');
      `);
    }, /unique|duplicate/i);

    // Insert user
    await db.query(`
      INSERT INTO users (organization_id, email, password_hash, full_name)
      VALUES ($1, 'admin@acme.com', 'hash_val', 'Admin User');
    `, [orgId]);

    // Duplicate email within same organization must fail
    await assert.rejects(async () => {
      await db.query(`
        INSERT INTO users (organization_id, email, password_hash, full_name)
        VALUES ($1, 'admin@acme.com', 'hash_val2', 'Admin Duplicate');
      `, [orgId]);
    }, /unique|duplicate|uq_org_email/i);
  });

  test('migrateDown() rolls back migrations cleanly and migrateUp() re-applies idempotently', async () => {
    await migrator.migrateUp();

    // Rollback policy migration
    const down1 = await migrator.migrateDown();
    assert.deepEqual(down1, ['000002_rls_policies']);

    // Rollback initial schema
    const down2 = await migrator.migrateDown();
    assert.deepEqual(down2, ['000001_initial_schema']);

    // Migrations remaining should be 0
    const appliedAfterRollback = await migrator.getAppliedMigrations();
    assert.deepEqual(appliedAfterRollback, []);

    // Re-apply UP
    const reUp = await migrator.migrateUp();
    assert.deepEqual(reUp, ['000001_initial_schema', '000002_rls_policies']);
  });
});
