/**
 * Aura v1: Database Migration Runner
 * Manages versioned SQL schema migrations with transaction safety and tracking.
 */

import fs from 'node:fs';
import path from 'node:path';

export class Migrator {
  /**
   * @param {Object} db - Database client supporting query()
   * @param {string} [migrationsDir] - Absolute or relative path to migrations directory
   */
  constructor(db, migrationsDir) {
    this.db = db;
    this.migrationsDir = migrationsDir || path.resolve(process.cwd(), 'deploy/migrations');
  }

  async initMigrationTable() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(128) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async getAppliedMigrations() {
    await this.initMigrationTable();
    const res = await this.db.query('SELECT version FROM schema_migrations ORDER BY version ASC');
    return res.rows.map(r => r.version);
  }

  async migrateUp() {
    await this.initMigrationTable();
    const applied = await this.getAppliedMigrations();
    const files = fs.readdirSync(this.migrationsDir)
      .filter(f => f.endsWith('.up.sql'))
      .sort();

    const executed = [];

    for (const file of files) {
      const version = file.replace(/\.up\.sql$/, '');
      if (!applied.includes(version)) {
        const sql = fs.readFileSync(path.join(this.migrationsDir, file), 'utf8');
        
        // Execute inside transaction
        await this.db.query('BEGIN');
        try {
          await this.db.exec(sql);
          await this.db.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
          await this.db.query('COMMIT');
          executed.push(version);
        } catch (err) {
          await this.db.query('ROLLBACK');
          throw new Error(`Migration ${version} failed: ${err.message}`);
        }
      }
    }

    return executed;
  }

  async migrateDown() {
    await this.initMigrationTable();
    const applied = await this.getAppliedMigrations();
    if (applied.length === 0) {
      return [];
    }

    const lastVersion = applied[applied.length - 1];
    const downFile = `${lastVersion}.down.sql`;
    const downPath = path.join(this.migrationsDir, downFile);

    if (!fs.existsSync(downPath)) {
      throw new Error(`Rollback file ${downFile} does not exist in ${this.migrationsDir}`);
    }

    const sql = fs.readFileSync(downPath, 'utf8');

    await this.db.query('BEGIN');
    try {
      await this.db.exec(sql);
      await this.db.query('DELETE FROM schema_migrations WHERE version = $1', [lastVersion]);
      await this.db.query('COMMIT');
      return [lastVersion];
    } catch (err) {
      await this.db.query('ROLLBACK');
      throw new Error(`Rollback of ${lastVersion} failed: ${err.message}`);
    }
  }

  async reset() {
    let rolledBack = [];
    let applied = await this.getAppliedMigrations();
    while (applied.length > 0) {
      const rb = await this.migrateDown();
      rolledBack.push(...rb);
      applied = await this.getAppliedMigrations();
    }
    return rolledBack;
  }
}
