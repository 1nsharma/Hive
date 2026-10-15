-- Migration: 000001_initial_schema.up.sql
-- Aura v1 Foundation Schema: Organizations, Locations, Users, RBAC, Sessions, Audit Ledger

-- Organizations (Tenants)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_DELETE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Physical Locations / Sites under an Organization
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_locations_org ON locations(organization_id);

-- System Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INVITED', 'SUSPENDED', 'DEACTIVATED')),
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_email UNIQUE(organization_id, email)
);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);

-- Standard RBAC Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(64) PRIMARY KEY,
    category VARCHAR(64) NOT NULL,
    description TEXT NOT NULL
);

-- Standard Platform Roles
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(64) PRIMARY KEY,
    is_system_role BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT NOT NULL
);

-- Role to Permission Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- User Role Assignment (Scoped to Organization and optional Location)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role_id VARCHAR(64) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_role_scope UNIQUE(user_id, organization_id, role_id, location_id)
);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org ON user_roles(organization_id);

-- Active User Sessions & Refresh Tokens
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(64) NOT NULL UNIQUE,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(refresh_token_hash);

-- Cryptographically Chained Audit Ledger
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_number BIGSERIAL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    timestamp_utc TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_type VARCHAR(32) NOT NULL CHECK (actor_type IN ('USER', 'SERVICE', 'SYSTEM', 'ANONYMOUS')),
    actor_id VARCHAR(255) NOT NULL,
    actor_email VARCHAR(255),
    action VARCHAR(128) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'DENIED')),
    ip_address INET,
    user_agent TEXT,
    correlation_id VARCHAR(128) NOT NULL,
    context_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_event_hash VARCHAR(64) NOT NULL,
    event_hash VARCHAR(64) NOT NULL,
    CONSTRAINT uq_audit_seq UNIQUE(sequence_number)
);
CREATE INDEX IF NOT EXISTS idx_audit_org_time ON audit_events(organization_id, timestamp_utc DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_events(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_correlation ON audit_events(correlation_id);

-- Seed System Roles
INSERT INTO roles (id, is_system_role, description) VALUES
    ('SUPER_ADMIN', TRUE, 'Internal Platform Ops & Security'),
    ('ORG_ADMIN', TRUE, 'Customer Tenant Root Administrator'),
    ('LOCATION_ADMIN', TRUE, 'Site or Branch Administrator'),
    ('CUSTOMER_USER', TRUE, 'Standard Customer Operator'),
    ('SUPPORT_AGENT', TRUE, 'Ephemeral Support Access'),
    ('AUDITOR', TRUE, 'Compliance and Audit Inspector'),
    ('TECHNICIAN', TRUE, 'Field Installation Technician (JIT)')
ON CONFLICT (id) DO NOTHING;

-- Seed Standard Permissions
INSERT INTO permissions (id, category, description) VALUES
    ('org:read', 'Organization', 'View organization profile and settings'),
    ('org:write', 'Organization', 'Update organization settings and billing'),
    ('location:create', 'Location', 'Provision new site/location'),
    ('location:read', 'Location', 'View site details'),
    ('location:update', 'Location', 'Update site configurations'),
    ('location:delete', 'Location', 'Decommission site'),
    ('user:invite', 'Identity', 'Invite new tenant members'),
    ('user:read', 'Identity', 'View tenant members and roles'),
    ('user:update_roles', 'Identity', 'Assign or revoke roles'),
    ('user:deactivate', 'Identity', 'Suspend or delete members'),
    ('audit:read', 'Compliance', 'Query tamper-evident audit logs'),
    ('system:manage', 'Ops Control', 'Internal SuperAdmin management')
ON CONFLICT (id) DO NOTHING;

-- Seed Role-Permission Bindings
INSERT INTO role_permissions (role_id, permission_id) VALUES
    -- ORG_ADMIN has full tenant management
    ('ORG_ADMIN', 'org:read'),
    ('ORG_ADMIN', 'org:write'),
    ('ORG_ADMIN', 'location:create'),
    ('ORG_ADMIN', 'location:read'),
    ('ORG_ADMIN', 'location:update'),
    ('ORG_ADMIN', 'location:delete'),
    ('ORG_ADMIN', 'user:invite'),
    ('ORG_ADMIN', 'user:read'),
    ('ORG_ADMIN', 'user:update_roles'),
    ('ORG_ADMIN', 'user:deactivate'),
    ('ORG_ADMIN', 'audit:read'),
    -- LOCATION_ADMIN
    ('LOCATION_ADMIN', 'org:read'),
    ('LOCATION_ADMIN', 'location:read'),
    ('LOCATION_ADMIN', 'location:update'),
    ('LOCATION_ADMIN', 'user:read'),
    ('LOCATION_ADMIN', 'audit:read'),
    -- CUSTOMER_USER
    ('CUSTOMER_USER', 'org:read'),
    ('CUSTOMER_USER', 'location:read'),
    -- AUDITOR
    ('AUDITOR', 'org:read'),
    ('AUDITOR', 'location:read'),
    ('AUDITOR', 'user:read'),
    ('AUDITOR', 'audit:read')
ON CONFLICT (role_id, permission_id) DO NOTHING;
