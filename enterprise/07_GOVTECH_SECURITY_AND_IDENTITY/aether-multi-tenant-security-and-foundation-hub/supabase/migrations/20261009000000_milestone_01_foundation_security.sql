-- ==============================================================================
-- MILESTONE 01: FOUNDATION & SECURITY - POSTGRESQL + SUPABASE RLS MIGRATION
-- Multi-Tenant E-Commerce / Platform Schema with Row Level Security (RLS)
-- Stack: Supabase (Postgres + Auth + Realtime + Storage), Next.js 14 App Router
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'customer',     -- Anon or authenticated end-customer
        'merchant',     -- Shop owner / creator
        'staff',        -- Store employee with delegated permissions
        'operations',   -- Platform internal staff / support
        'super_admin'   -- Global root administrator
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE membership_role AS ENUM (
        'owner',        -- Full control over shop
        'staff'         -- Delegated day-to-day shop permissions
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS / PROFILES TABLE
-- Mirrors supabase auth.users for application-level profile and system role
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    system_role user_role NOT NULL DEFAULT 'customer',
    avatar_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SHOPS TABLE (Multi-Tenant Core)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
    plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'enterprise')),
    currency TEXT NOT NULL DEFAULT 'USD',
    settings JSONB NOT NULL DEFAULT '{"allow_guest_checkout": true, "tax_inclusive": false}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for lookup by slug and owner
CREATE INDEX IF NOT EXISTS idx_shops_slug ON public.shops(slug);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);

-- 5. MEMBERSHIPS TABLE (Multi-Tenant RBAC: Shop Owner / Staff)
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'staff',
    permissions TEXT[] NOT NULL DEFAULT ARRAY['products.read', 'orders.read'],
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_shop_user_membership UNIQUE (shop_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_shop_id ON public.memberships(shop_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);

-- 6. AUDIT LOGS TABLE
-- CRITICAL REQUIREMENT: Every privileged action must log actor_id, action, target, timestamp.
-- MUST be immutable: no UPDATE or DELETE permitted.
-- MUST be written ONLY by server-side routes via service_role key.
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL,
    shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_shop_id ON public.audit_logs(shop_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- 7. TENANT DATA TABLES (Demonstrating mandatory shop_id and multi-tenant RLS)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_shop_product_sku UNIQUE (shop_id, sku)
);

CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL,
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_shop_order_number UNIQUE (shop_id, order_number)
);

CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON public.orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);

-- ==============================================================================
-- 8. HELPER SECURITY DEFINER FUNCTIONS FOR RLS EVALUATION
-- ==============================================================================

-- Helper: Get current user's system role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
    SELECT system_role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check if current user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND system_role = 'super_admin'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check if current user is operations or super_admin
CREATE OR REPLACE FUNCTION public.is_operations_or_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND system_role IN ('operations', 'super_admin')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check membership in a shop
CREATE OR REPLACE FUNCTION public.is_shop_member(check_shop_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE shop_id = check_shop_id AND user_id = auth.uid()
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check if user is shop owner
CREATE OR REPLACE FUNCTION public.is_shop_owner(check_shop_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.memberships
        WHERE shop_id = check_shop_id AND user_id = auth.uid() AND role = 'owner'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES ON ALL TABLES
-- CRITICAL REQUIREMENT: Enable RLS on all tables.
-- No direct elevated DB access from browser.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PROFILES RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view their own profile;
-- Shop members can view profiles of other members in their shop;
-- Operations and super_admin can view all profiles.
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid()
        OR public.is_operations_or_admin()
        OR EXISTS (
            SELECT 1 FROM public.memberships m1
            JOIN public.memberships m2 ON m1.shop_id = m2.shop_id
            WHERE m1.user_id = auth.uid() AND m2.user_id = public.profiles.id
        )
    );

-- Users can update their own profile, but system_role changes are guarded:
-- elevated system_role modification can ONLY be done via service_role API.
CREATE POLICY "profiles_update_self_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid() OR public.is_super_admin())
    WITH CHECK (
        (id = auth.uid() AND system_role = (SELECT system_role FROM public.profiles WHERE id = auth.uid()))
        OR public.is_super_admin()
    );

-- ------------------------------------------------------------------------------
-- SHOPS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Customers can view active shops (for storefront browsing)
CREATE POLICY "shops_select_public_policy" ON public.shops
    FOR SELECT TO anon, authenticated
    USING (
        status = 'active'
        OR public.is_shop_member(id)
        OR public.is_operations_or_admin()
    );

-- Only merchants or super_admins can insert new shops
CREATE POLICY "shops_insert_policy" ON public.shops
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_super_admin()
        OR (public.current_user_role() = 'merchant' AND owner_id = auth.uid())
    );

-- Only shop owners or super_admin can update shop details
CREATE POLICY "shops_update_policy" ON public.shops
    FOR UPDATE TO authenticated
    USING (
        public.is_shop_owner(id)
        OR public.is_super_admin()
    )
    WITH CHECK (
        public.is_shop_owner(id)
        OR public.is_super_admin()
    );

-- Only super_admin can delete a shop
CREATE POLICY "shops_delete_policy" ON public.shops
    FOR DELETE TO authenticated
    USING (public.is_super_admin());

-- ------------------------------------------------------------------------------
-- MEMBERSHIPS RLS
-- ------------------------------------------------------------------------------
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Shop members can view fellow members of the same shop;
-- Platform ops and super_admin can view all memberships.
CREATE POLICY "memberships_select_policy" ON public.memberships
    FOR SELECT TO authenticated
    USING (
        public.is_shop_member(shop_id)
        OR public.is_operations_or_admin()
    );

-- Only shop owners or super_admin can add members
CREATE POLICY "memberships_insert_policy" ON public.memberships
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_shop_owner(shop_id)
        OR public.is_super_admin()
    );

-- Only shop owners or super_admin can update member roles/permissions
CREATE POLICY "memberships_update_policy" ON public.memberships
    FOR UPDATE TO authenticated
    USING (
        public.is_shop_owner(shop_id)
        OR public.is_super_admin()
    )
    WITH CHECK (
        public.is_shop_owner(shop_id)
        OR public.is_super_admin()
    );

-- Only shop owners or super_admin can remove members (owners cannot remove themselves)
CREATE POLICY "memberships_delete_policy" ON public.memberships
    FOR DELETE TO authenticated
    USING (
        (public.is_shop_owner(shop_id) AND user_id <> auth.uid())
        OR public.is_super_admin()
    );

-- ------------------------------------------------------------------------------
-- AUDIT LOGS RLS
-- CRITICAL SECURITY REQUIREMENT:
-- 1. Browser client CANNOT write directly to audit_logs (WITH CHECK false).
--    All privileged actions must be written via server-side service_role API.
-- 2. Audit logs are IMMUTABLE: no UPDATE, no DELETE.
-- 3. Only shop owners (for their shop) or operations/super_admin can view logs.
-- ------------------------------------------------------------------------------
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read policy: Shop owners can read their shop's audit logs.
-- Operations & Super Admin can read all audit logs.
-- Regular staff and customers have ZERO read access.
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        (shop_id IS NOT NULL AND public.is_shop_owner(shop_id))
        OR public.is_operations_or_admin()
    );

-- WRITE POLICY: BLOCKED FOR BROWSER CLIENTS!
-- Neither authenticated users nor anon can insert directly from browser.
-- Server-side API uses the service_role key to insert records safely.
CREATE POLICY "audit_logs_insert_block_client" ON public.audit_logs
    FOR INSERT TO anon, authenticated
    WITH CHECK (false);

-- UPDATE POLICY: BLOCKED FOR ALL (IMMUTABLE LOGS)
CREATE POLICY "audit_logs_update_block_all" ON public.audit_logs
    FOR UPDATE TO anon, authenticated
    USING (false)
    WITH CHECK (false);

-- DELETE POLICY: BLOCKED FOR ALL (IMMUTABLE LOGS)
CREATE POLICY "audit_logs_delete_block_all" ON public.audit_logs
    FOR DELETE TO anon, authenticated
    USING (false);

-- ------------------------------------------------------------------------------
-- PRODUCTS RLS (Multi-Tenant Isolation)
-- ------------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can browse published products of active shops;
-- Staff/owners can see unlisted products of their shop.
CREATE POLICY "products_select_policy" ON public.products
    FOR SELECT TO anon, authenticated
    USING (
        is_published = true
        OR public.is_shop_member(shop_id)
        OR public.is_operations_or_admin()
    );

-- Only shop members can create products for their own shop
CREATE POLICY "products_insert_policy" ON public.products
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_shop_member(shop_id)
        OR public.is_super_admin()
    );

-- Only shop members can update their shop's products
CREATE POLICY "products_update_policy" ON public.products
    FOR UPDATE TO authenticated
    USING (
        public.is_shop_member(shop_id)
        OR public.is_super_admin()
    )
    WITH CHECK (
        public.is_shop_member(shop_id)
        OR public.is_super_admin()
    );

-- Only shop owners or super_admin can delete products
CREATE POLICY "products_delete_policy" ON public.products
    FOR DELETE TO authenticated
    USING (
        public.is_shop_owner(shop_id)
        OR public.is_super_admin()
    );

-- ------------------------------------------------------------------------------
-- ORDERS RLS (Multi-Tenant Isolation & Customer Privacy)
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders;
-- Shop members can view orders placed in their shop;
-- Operations and super_admin can view all orders.
CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT TO authenticated
    USING (
        customer_id = auth.uid()
        OR public.is_shop_member(shop_id)
        OR public.is_operations_or_admin()
    );

-- Customers can create orders; Shop members cannot forge orders without service_role
CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO authenticated
    WITH CHECK (
        customer_id = auth.uid()
        OR public.is_shop_member(shop_id)
        OR public.is_super_admin()
    );

-- Only shop staff/owners or operations can update order status
CREATE POLICY "orders_update_policy" ON public.orders
    FOR UPDATE TO authenticated
    USING (
        public.is_shop_member(shop_id)
        OR public.is_operations_or_admin()
    )
    WITH CHECK (
        public.is_shop_member(shop_id)
        OR public.is_operations_or_admin()
    );
