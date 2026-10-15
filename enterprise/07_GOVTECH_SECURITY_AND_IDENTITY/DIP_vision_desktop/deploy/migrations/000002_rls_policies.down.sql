-- Migration: 000002_rls_policies.down.sql
-- Rollback for Row-Level Security policies

DROP POLICY IF EXISTS tenant_isolation_audit_insert ON audit_events;
DROP POLICY IF EXISTS tenant_isolation_audit_read ON audit_events;
DROP POLICY IF EXISTS tenant_isolation_sessions ON sessions;
DROP POLICY IF EXISTS tenant_isolation_user_roles ON user_roles;
DROP POLICY IF EXISTS tenant_isolation_users ON users;
DROP POLICY IF EXISTS tenant_isolation_locations ON locations;

ALTER TABLE audit_events NO FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_events DISABLE ROW LEVEL SECURITY;

ALTER TABLE sessions NO FORCE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

ALTER TABLE user_roles NO FORCE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

ALTER TABLE users NO FORCE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

ALTER TABLE locations NO FORCE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM aura_app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM aura_app;
REVOKE USAGE ON SCHEMA public FROM aura_app;
DROP ROLE IF EXISTS aura_app;
