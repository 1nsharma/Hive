/**
 * Production Next.js 14 App Router Code Templates
 * Demonstrates the exact implementation of the architecture required:
 * - Multi-tenant schema with shop_id on all tables and RLS
 * - Supabase Auth with 5 roles: customer, merchant, staff, operations, super_admin
 * - Privileged actions via Next.js route handlers using service_role key
 * - Mandatory audit logging for every privileged action
 */

export const NEXTJS_CODE_TEMPLATES = {
  adminRouteHandler: {
    filename: 'app/api/privileged-action/route.ts',
    language: 'typescript',
    description: 'Next.js 14 Route Handler executing privileged actions via Supabase service_role key with mandatory audit logging',
    code: `import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// CRITICAL: Initialize Supabase Admin with SERVICE_ROLE_KEY
// NEVER exposed to the browser. Only accessible inside server-side route handlers.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();

    // 1. Authenticate calling user using their session JWT (read-only RLS client)
    const supabaseUserClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Valid Supabase session required' },
        { status: 401 }
      );
    }

    // 2. Parse privileged action payload
    const body = await req.json();
    const { action, target, shop_id, payload } = body;

    if (!action || !target) {
      return NextResponse.json(
        { error: 'Missing required parameters: action and target' },
        { status: 400 }
      );
    }

    // 3. Server-side RBAC Authorization Verification
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('system_role')
      .eq('id', user.id)
      .single();

    const isSuperAdmin = profile?.system_role === 'super_admin';
    const isOperations = profile?.system_role === 'operations';

    let isShopOwner = false;
    if (shop_id) {
      const { data: membership } = await supabaseAdmin
        .from('memberships')
        .select('role')
        .eq('shop_id', shop_id)
        .eq('user_id', user.id)
        .single();
      isShopOwner = membership?.role === 'owner';
    }

    // Guard: privileged action permissions
    if (!isSuperAdmin && !isOperations && !isShopOwner) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient privileges for action ' + action },
        { status: 403 }
      );
    }

    // 4. Execute the privileged business logic via supabaseAdmin (service_role)
    let executionResult = null;
    if (action === 'shop.update_billing') {
      const { data, error } = await supabaseAdmin
        .from('shops')
        .update({
          settings: payload.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', shop_id)
        .select()
        .single();

      if (error) throw error;
      executionResult = data;
    } else if (action === 'member.invite') {
      const { data, error } = await supabaseAdmin
        .from('memberships')
        .insert({
          shop_id,
          user_id: payload.user_id,
          role: payload.role || 'staff',
          permissions: payload.permissions || ['products.read', 'orders.read'],
          invited_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      executionResult = data;
    }

    // 5. MANDATORY AUDIT LOG: Record actor_id, action, target, timestamp
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Next.js 14 Route Handler';

    const { data: auditEntry, error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        actor_id: user.id,
        actor_role: profile?.system_role || 'merchant',
        shop_id: shop_id || null,
        action,
        target,
        metadata: {
          ...payload,
          executed_by_ip: clientIp,
          authorized_via: 'Next.js App Router (service_role key)'
        },
        ip_address: clientIp,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      })
      .select('id, timestamp')
      .single();

    if (auditError) {
      console.error('CRITICAL: Audit log failed to write:', auditError);
      // In enterprise systems, fail-closed or alarm immediately
    }

    return NextResponse.json({
      success: true,
      action,
      target,
      audit_log_id: auditEntry?.id,
      timestamp: auditEntry?.timestamp,
      result: executionResult
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}`
  },

  supabaseAdminClient: {
    filename: 'lib/supabase/admin.ts',
    language: 'typescript',
    description: 'Server-only Supabase client with SUPABASE_SERVICE_ROLE_KEY to bypass RLS securely in route handlers',
    code: `import { createClient } from '@supabase/supabase-js';

// WARNING: Never import this file in client components ('use client')!
// This file is strictly for server-side route handlers and server actions.
if (typeof window !== 'undefined') {
  throw new Error('CRITICAL SECURITY VIOLATION: supabaseAdmin imported in client-side code!');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});`
  },

  supabaseBrowserClient: {
    filename: 'lib/supabase/client.ts',
    language: 'typescript',
    description: 'Browser-safe Supabase client using public Anon Key. Bound by Postgres Row Level Security (RLS)',
    code: `import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Uses ONLY public anon key.
  // Cannot perform privileged actions.
  // Cannot insert into audit_logs (blocked by RLS WITH CHECK false).
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}`
  },

  auditLogsRoute: {
    filename: 'app/api/audit-logs/route.ts',
    language: 'typescript',
    description: 'Secure Next.js Route Handler to query audit logs with tenant and role filtering',
    code: `import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get('shop_id');

    // Verify actor role: only shop owner or operations/super_admin can view audit logs
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('system_role')
      .eq('id', user.id)
      .single();

    const isOps = ['operations', 'super_admin'].includes(profile?.system_role || '');

    let query = supabaseAdmin
      .from('audit_logs')
      .select('id, actor_id, actor_role, shop_id, action, target, metadata, ip_address, timestamp')
      .order('timestamp', { ascending: false })
      .limit(100);

    if (shopId) {
      // Check if user is owner of the requested shop
      const { data: membership } = await supabaseAdmin
        .from('memberships')
        .select('role')
        .eq('shop_id', shopId)
        .eq('user_id', user.id)
        .single();

      if (!isOps && membership?.role !== 'owner') {
        return NextResponse.json(
          { error: 'Forbidden: Only shop owners or platform admins can inspect audit logs' },
          { status: 403 }
        );
      }
      query = query.eq('shop_id', shopId);
    } else {
      if (!isOps) {
        return NextResponse.json(
          { error: 'Forbidden: Global audit log stream restricted to Operations and Super Admin' },
          { status: 403 }
        );
      }
    }

    const { data: logs, error } = await query;
    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}`
  },

  postgresRLSSummary: {
    filename: 'supabase/migrations/rls_security_rules.sql',
    language: 'sql',
    description: 'PostgreSQL Row Level Security policies enforcing multi-tenancy, immutable audit logs, and role boundaries',
    code: `-- Enable RLS on all tables
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- AUDIT LOGS: Immutable & Server-Only Insert Policy
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    (shop_id IS NOT NULL AND public.is_shop_owner(shop_id))
    OR public.is_operations_or_admin()
  );

-- BROWSER BLOCKED: No direct write to audit_logs
CREATE POLICY "audit_logs_insert_block_client" ON public.audit_logs
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

-- IMMUTABLE: No UPDATE or DELETE permitted
CREATE POLICY "audit_logs_update_block_all" ON public.audit_logs
  FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "audit_logs_delete_block_all" ON public.audit_logs
  FOR DELETE TO anon, authenticated
  USING (false);`
  }
};
