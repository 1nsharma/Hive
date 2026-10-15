-- Migration: 000002_rls_policies.up.sql
-- Aura v1: Row-Level Security (RLS) Tenant Isolation Engine

-- 1. Create runtime application role with NOBYPASSRLS
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'aura_app') THEN
    CREATE ROLE aura_app WITH LOGIN NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO aura_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO aura_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO aura_app;

-- 2. Enable and Force RLS on Tenant-Scoped Tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations FORCE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles FORCE ROW LEVEL SECURITY;

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions FORCE ROW LEVEL SECURITY;

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events FORCE ROW LEVEL SECURITY;

-- 2. Locations Isolation Policy
CREATE POLICY tenant_isolation_locations ON locations
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 3. Users Isolation Policy
CREATE POLICY tenant_isolation_users ON users
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 4. User Roles Isolation Policy
CREATE POLICY tenant_isolation_user_roles ON user_roles
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 5. Sessions Isolation Policy
CREATE POLICY tenant_isolation_sessions ON sessions
    FOR ALL
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    )
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

-- 6. Audit Events Isolation (Append-only & Tenant Scoped)
CREATE POLICY tenant_isolation_audit_read ON audit_events
    FOR SELECT
    USING (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );

CREATE POLICY tenant_isolation_audit_insert ON audit_events
    FOR INSERT
    WITH CHECK (
        organization_id = NULLIF(current_setting('app.current_organization_id', true), '')::uuid
        OR current_setting('app.is_super_admin', true) = 'true'
    );
