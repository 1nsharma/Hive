import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  Shop, 
  Membership, 
  AuditLog, 
  Product, 
  Order, 
  UserRole, 
  MembershipRole,
  MenuItem,
  MenuAddOn,
  OrderItem,
  Payment,
  OrderMode,
  OrderStatus,
  FraudReview,
  TeamMember,
  StaffMembership,
  StaffRole,
  StaffStatus,
  AIEvent,
  AIEventType,
  ShopStats
} from '../src/types/database.js';

// Pre-configured mock tenants & seed data representing a multi-tenant platform
export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr-customer-001',
    email: 'elena.customer@gmail.com',
    full_name: 'Elena Rostova',
    system_role: 'customer',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-01-10T08:00:00Z'
  },
  {
    id: 'usr-merchant-001',
    email: 'marcus.owner@apexathletics.com',
    full_name: 'Marcus Vance (Apex Owner)',
    system_role: 'merchant',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: '2026-01-15T09:30:00Z',
    updated_at: '2026-01-15T09:30:00Z'
  },
  {
    id: 'usr-merchant-002',
    email: 'sophia.owner@luminahome.com',
    full_name: 'Sophia Chen (Lumina Owner)',
    system_role: 'merchant',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-01-20T11:00:00Z'
  },
  {
    id: 'usr-staff-001',
    email: 'liam.staff@apexathletics.com',
    full_name: 'Liam Sterling (Apex Staff)',
    system_role: 'staff',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    created_at: '2026-02-01T14:15:00Z',
    updated_at: '2026-02-01T14:15:00Z'
  },
  {
    id: 'usr-operations-001',
    email: 'sarah.ops@platformhq.io',
    full_name: 'Sarah Jenkins (Platform Ops)',
    system_role: 'operations',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-superadmin-001',
    email: 'alex.root@platformhq.io',
    full_name: 'Alex Mercer (Super Admin)',
    system_role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-amit-superadmin',
    email: 'AMITSHARMA99976@gmail.com',
    full_name: 'Amit Sharma (Super Admin)',
    system_role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }
];

// Super Admin Emails & API Key configured via ENV / Secret Manager (M03 Final Secure Access)
export const SUPER_ADMIN_EMAILS: string[] = (
  process.env.SUPER_ADMIN_EMAILS || 'AMITSHARMA99976@gmail.com,admin@platformhq.io,alex.root@platformhq.io'
)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_API_KEY: string = process.env.ADMIN_API_KEY || 'adm_secret_key_prod_2026';

// Team Members for internal access and testing (RSK & Internal Auth)
export const SEED_TEAM_MEMBERS: TeamMember[] = [
  { email: 'AMITSHARMA99976@gmail.com', role: 'owner', name: 'Amit Sharma' },
  { email: 'admin@platformhq.io', role: 'developer', name: 'Platform Admin' },
  { email: 'alex.root@platformhq.io', role: 'owner', name: 'Alex Mercer' },
  { email: 'qa.tester@platformhq.io', role: 'qa', name: 'QA Engineer' }
];

export const SEED_SHOPS: Shop[] = [
  {
    id: 'shp-apex-001',
    name: 'Apex Fuel & Espresso',
    slug: 'apex-athletics',
    owner_id: 'usr-merchant-001',
    status: 'ACTIVE',
    plan: 'enterprise',
    currency: 'USD',
    gstin: '27AABCA1234C1Z5',
    invoice_prefix: 'APX',
    address: '104 Market Blvd, Tech Park, Suite 4B, San Francisco, CA',
    avg_prep_time_mins: 12,
    upi_id: 'apexathletics@okaxis',
    theme_color: '#4f46e5',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150',
    is_internal_test: false,
    approved_by: 'AMITSHARMA99976@gmail.com',
    approved_at: '2026-01-16T10:00:00Z',
    subscription_status: 'ACTIVE',
    subscription_paid_at: '2026-01-15T10:30:00Z',
    settings: {
      allow_guest_checkout: true,
      tax_inclusive: false,
      stripe_account_id: 'acct_1ApexPerformance99X',
      payout_schedule: 'daily'
    },
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-10T12:00:00Z'
  },
  {
    id: 'shp-lumina-002',
    name: 'Lumina Studio & Cafe',
    slug: 'lumina-home',
    owner_id: 'usr-merchant-002',
    status: 'ACTIVE',
    plan: 'growth',
    currency: 'USD',
    gstin: '29AABCS9876D1Z2',
    invoice_prefix: 'LUM',
    address: '42 Bloom Avenue, Design District, New York, NY',
    avg_prep_time_mins: 15,
    upi_id: 'luminacafe@icici',
    theme_color: '#059669',
    logo_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150',
    is_internal_test: false,
    approved_by: 'admin@platformhq.io',
    approved_at: '2026-01-21T12:00:00Z',
    subscription_status: 'ACTIVE',
    subscription_paid_at: '2026-01-20T12:00:00Z',
    settings: {
      allow_guest_checkout: true,
      tax_inclusive: true,
      stripe_account_id: 'acct_2LuminaDecor88Z',
      payout_schedule: 'weekly'
    },
    created_at: '2026-01-20T11:30:00Z',
    updated_at: '2026-02-15T16:20:00Z'
  },
  {
    id: 'shp-internal-qa',
    name: 'Apex Lab - Internal QA Store',
    slug: 'internal-qa-shop',
    owner_id: 'usr-merchant-001',
    status: 'ACTIVE',
    plan: 'enterprise',
    currency: 'USD',
    gstin: '27QA9999999C1Z9',
    invoice_prefix: 'QA',
    address: 'Internal Test Sandbox Lab, Cloud Run Cluster',
    avg_prep_time_mins: 8,
    upi_id: 'internallab@upi',
    theme_color: '#d97706',
    is_internal_test: true,
    approved_by: 'AMITSHARMA99976@gmail.com',
    approved_at: '2026-02-01T09:00:00Z',
    subscription_status: 'ACTIVE',
    subscription_paid_at: '2026-02-01T09:00:00Z',
    settings: {
      allow_guest_checkout: true,
      tax_inclusive: false,
      payout_schedule: 'daily'
    },
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z'
  },
  {
    id: 'shp-artisan-roasters',
    name: 'Artisan Craft Roasters & Deli',
    slug: 'artisan-roasters',
    owner_id: 'usr-merchant-001',
    status: 'PENDING_APPROVAL',
    plan: 'growth',
    currency: 'USD',
    gstin: '27ART9988771A1Z0',
    invoice_prefix: 'ACR',
    address: '501 Roast Way, High Street Market, Portland, OR',
    avg_prep_time_mins: 10,
    upi_id: 'artisanroasters@upi',
    theme_color: '#8b5cf6',
    logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150',
    is_internal_test: false,
    approved_by: null,
    approved_at: null,
    subscription_status: 'ACTIVE',
    subscription_paid_at: '2026-02-12T10:00:00Z',
    settings: {
      allow_guest_checkout: true,
      tax_inclusive: false,
      payout_schedule: 'daily'
    },
    created_at: '2026-02-12T09:30:00Z',
    updated_at: '2026-02-12T10:00:00Z'
  },
  {
    id: 'shp-green-sprout',
    name: 'Green Sprout Organic Market',
    slug: 'green-sprout',
    owner_id: 'usr-merchant-002',
    status: 'PENDING_APPROVAL',
    plan: 'starter',
    currency: 'USD',
    gstin: '27GRN1234567B1Z2',
    invoice_prefix: 'GSO',
    address: '12 Organic Lane, Austin, TX',
    avg_prep_time_mins: 15,
    upi_id: 'greensprout@upi',
    theme_color: '#10b981',
    logo_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
    is_internal_test: false,
    approved_by: null,
    approved_at: null,
    subscription_status: 'NONE',
    subscription_paid_at: null,
    settings: {
      allow_guest_checkout: true,
      tax_inclusive: true,
      payout_schedule: 'weekly'
    },
    created_at: '2026-02-14T08:00:00Z',
    updated_at: '2026-02-14T08:00:00Z'
  }
];

export const SEED_STAFF_MEMBERSHIPS: StaffMembership[] = [
  {
    id: 'stf-001',
    shop_id: 'shp-apex-001',
    user_id: 'usr-staff-001',
    invited_email: 'sarah.kitchen@apexathletics.com',
    invited_phone: '+1 555-0199',
    name: 'Sarah Connor (Kitchen Lead)',
    role: 'kitchen',
    status: 'ACTIVE',
    invited_at: '2026-01-16T10:00:00Z',
    accepted_at: '2026-01-16T10:05:00Z',
  },
  {
    id: 'stf-002',
    shop_id: 'shp-apex-001',
    user_id: null,
    invited_email: 'rajesh.pos@apexathletics.com',
    invited_phone: '+1 555-0188',
    name: 'Rajesh Kumar (Front Cashier)',
    role: 'cashier',
    status: 'PENDING',
    invited_at: '2026-02-01T11:00:00Z',
    accepted_at: null,
  },
  {
    id: 'stf-003',
    shop_id: 'shp-apex-001',
    user_id: 'usr-merchant-001',
    invited_email: 'marcus.owner@apexathletics.com',
    invited_phone: '+1 555-0177',
    name: 'Marcus Vance (Owner)',
    role: 'owner',
    status: 'ACTIVE',
    invited_at: '2026-01-15T10:00:00Z',
    accepted_at: '2026-01-15T10:00:00Z',
  },
  {
    id: 'stf-004',
    shop_id: 'shp-apex-001',
    user_id: null,
    invited_email: 'claire.runner@apexathletics.com',
    invited_phone: '+1 555-0144',
    name: 'Claire Beauchamp (Order Dispatch)',
    role: 'staff',
    status: 'ACTIVE',
    invited_at: '2026-02-05T09:00:00Z',
    accepted_at: '2026-02-05T09:12:00Z',
  }
];

export const SEED_AI_EVENTS: AIEvent[] = [
  {
    id: 'aievt-001',
    shop_id: 'shp-apex-001',
    event_type: 'ORDER_PLACED',
    payload: { token: 'K-01', item_count: 2, total_cents: 2430, mode: 'DINE_IN', hour: 14 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'aievt-002',
    shop_id: 'shp-apex-001',
    event_type: 'PAYMENT_VERIFIED',
    payload: { provider: 'MANUAL_UPI', turnaround_seconds: 45, amount_cents: 2430 },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'aievt-003',
    shop_id: 'shp-apex-001',
    event_type: 'USER_VISITED',
    payload: { referrer: 'direct_qr', platform: 'mobile_web' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'aievt-004',
    shop_id: 'shp-apex-001',
    event_type: 'ITEM_VIEWED',
    payload: { category: 'Superfood Bowls', item_id: 'itm-apex-001' },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: 'aievt-005',
    shop_id: 'shp-apex-001',
    event_type: 'BILL_DOWNLOADED',
    payload: { invoice_prefix: 'APX', hsn: '2106', total_cents: 2430 },
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  }
];

export const SEED_MEMBERSHIPS: Membership[] = [
  {
    id: 'mem-001',
    shop_id: 'shp-apex-001',
    user_id: 'usr-merchant-001',
    role: 'owner',
    permissions: ['*'],
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 'mem-002',
    shop_id: 'shp-apex-001',
    user_id: 'usr-staff-001',
    role: 'staff',
    permissions: ['orders.read', 'orders.write', 'menu.read', 'menu.write'],
    invited_by: 'usr-merchant-001',
    created_at: '2026-02-01T14:30:00Z',
    updated_at: '2026-02-01T14:30:00Z'
  },
  {
    id: 'mem-003',
    shop_id: 'shp-lumina-002',
    user_id: 'usr-merchant-002',
    role: 'owner',
    permissions: ['*'],
    created_at: '2026-01-20T11:30:00Z',
    updated_at: '2026-01-20T11:30:00Z'
  },
  {
    id: 'mem-004',
    shop_id: 'shp-internal-qa',
    user_id: 'usr-merchant-001',
    role: 'owner',
    permissions: ['*'],
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z'
  }
];

// Cloud Storage URLs for appetizing food dishes with GST HSN Codes
export const SEED_MENU_ITEMS: MenuItem[] = [
  {
    id: 'itm-apex-001',
    shop_id: 'shp-apex-001',
    category: 'Superfood Bowls',
    name: 'Wild Acai Protein Energy Bowl',
    description: 'Organic Amazonian acai puree, hemp granola, sliced kiwi, chia seeds, banana, and raw honey drizzle.',
    photo_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80',
    price_cents: 1250,
    is_veg: true,
    is_available: true,
    hsn_code: '2106',
    gst_rate: 5.0,
    add_ons: [
      { id: 'ao-01', name: 'Plant Protein Scoop (20g)', price_cents: 200 },
      { id: 'ao-02', name: 'Almond Butter Swirl', price_cents: 150 },
      { id: 'ao-03', name: 'Organic Goji Berries', price_cents: 100 }
    ],
    created_at: '2026-01-16T10:00:00Z',
    updated_at: '2026-01-16T10:00:00Z'
  },
  {
    id: 'itm-apex-002',
    shop_id: 'shp-apex-001',
    category: 'Toasts & Bites',
    name: 'Hass Avocado & Sourdough Toast',
    description: 'Crushed ripe avocados, Maldon flaky salt, sumac, micro-greens, cherry tomatoes on toasted sourdough.',
    photo_url: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&auto=format&fit=crop&q=80',
    price_cents: 980,
    is_veg: true,
    is_available: true,
    hsn_code: '1905',
    gst_rate: 5.0,
    add_ons: [
      { id: 'ao-04', name: 'Poached Pasture Egg', price_cents: 200 },
      { id: 'ao-05', name: 'Crumbled Danish Feta', price_cents: 150 }
    ],
    created_at: '2026-01-16T10:30:00Z',
    updated_at: '2026-01-16T10:30:00Z'
  },
  {
    id: 'itm-apex-003',
    shop_id: 'shp-apex-001',
    category: 'Toasts & Bites',
    name: 'Smoked Salmon Bagel Sandwich',
    description: 'Wild Alaskan cured lox, whipped herb cream cheese, pickled red onions, and capers on toasted bagel.',
    photo_url: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=600&auto=format&fit=crop&q=80',
    price_cents: 1420,
    is_veg: false,
    is_available: true,
    hsn_code: '1905',
    gst_rate: 5.0,
    add_ons: [
      { id: 'ao-06', name: 'Extra Salmon Slice', price_cents: 350 }
    ],
    created_at: '2026-01-16T11:00:00Z',
    updated_at: '2026-01-16T11:00:00Z'
  },
  {
    id: 'itm-apex-004',
    shop_id: 'shp-apex-001',
    category: 'Specialty Beverages',
    name: 'Nitro Cold Brew Reserve',
    description: '18-hour slow steeped single-origin Ethiopian beans infused with pure nitrogen for a velvety stout finish.',
    photo_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
    price_cents: 550,
    is_veg: true,
    is_available: true,
    hsn_code: '0901',
    gst_rate: 5.0,
    add_ons: [
      { id: 'ao-08', name: 'Oat Milk Creamer', price_cents: 75 }
    ],
    created_at: '2026-01-16T11:15:00Z',
    updated_at: '2026-01-16T11:15:00Z'
  },
  // Items for Internal QA Store
  {
    id: 'itm-qa-001',
    shop_id: 'shp-internal-qa',
    category: 'Test Dishes',
    name: 'Standard QA Benchmark Plate',
    description: 'Automated test dish for payment verification and duplicate UTR injection.',
    photo_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    price_cents: 1000,
    is_veg: true,
    is_available: true,
    hsn_code: '2106',
    gst_rate: 5.0,
    add_ons: [],
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-01T09:00:00Z'
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-001',
    shop_id: 'shp-apex-001',
    customer_id: 'usr-customer-001',
    order_number: 'APX-2026-9041',
    token: 'K-01',
    mode: 'DINE_IN',
    table_number: 'Table 4',
    customer_name: 'Elena Rostova',
    customer_phone: '+1 555-0192',
    total_cents: 2430,
    status: 'INCOMING',
    estimated_wait_mins: 14,
    invoice_number: 'APX-2026-K-01',
    items: [
      {
        item_id: 'itm-apex-001',
        name: 'Wild Acai Protein Energy Bowl',
        price_cents: 1250,
        quantity: 1,
        selected_add_ons: [
          { id: 'ao-01', name: 'Plant Protein Scoop (20g)', price_cents: 200 }
        ],
        notes: 'Extra granola on top please'
      },
      {
        item_id: 'itm-apex-002',
        name: 'Hass Avocado & Sourdough Toast',
        price_cents: 980,
        quantity: 1,
        selected_add_ons: []
      }
    ],
    payment: {
      id: 'pay-001',
      order_id: 'ord-001',
      shop_id: 'shp-apex-001',
      amount_cents: 2430,
      status: 'VERIFIED', // Verified payment for demonstration
      method: 'MANUAL_UPI',
      provider: 'MANUAL_UPI',
      provider_ref: '428192019283',
      screenshot_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=500',
      risk_score: 10,
      risk_level: 'ALLOW',
      created_at: '2026-02-01T15:20:00Z',
      verified_at: '2026-02-01T15:21:00Z'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'ord-002',
    shop_id: 'shp-apex-001',
    customer_id: null,
    order_number: 'APX-2026-9042',
    token: 'K-02',
    mode: 'PARCEL',
    customer_name: 'Julian Mercer',
    customer_phone: '+1 555-8821',
    total_cents: 1970,
    status: 'PREPARING',
    estimated_wait_mins: 8,
    invoice_number: 'APX-2026-K-02',
    items: [
      {
        item_id: 'itm-apex-003',
        name: 'Smoked Salmon Bagel Sandwich',
        price_cents: 1420,
        quantity: 1,
        selected_add_ons: []
      },
      {
        item_id: 'itm-apex-004',
        name: 'Nitro Cold Brew Reserve',
        price_cents: 550,
        quantity: 1,
        selected_add_ons: []
      }
    ],
    payment: {
      id: 'pay-002',
      order_id: 'ord-002',
      shop_id: 'shp-apex-001',
      amount_cents: 1970,
      status: 'PENDING',
      method: 'MANUAL_UPI',
      provider: 'MANUAL_UPI',
      provider_ref: '984102941829',
      screenshot_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=500',
      risk_score: 15,
      risk_level: 'ALLOW',
      created_at: '2026-02-08T18:40:00Z'
    },
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    actor_id: 'usr-merchant-001',
    actor_role: 'merchant',
    actor_name: 'Marcus Vance (Apex Owner)',
    shop_id: 'shp-apex-001',
    action: 'shop.initialize',
    target: 'shop:shp-apex-001',
    metadata: { plan: 'enterprise', currency: 'USD', initial_payout: 'daily' },
    ip_address: '198.51.100.24',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    timestamp: '2026-01-15T10:02:14Z'
  }
];

export const SEED_FRAUD_REVIEWS: FraudReview[] = [
  {
    id: 'rev-001',
    payment_id: 'pay-002',
    order_id: 'ord-002',
    shop_id: 'shp-apex-001',
    order_token: 'K-02',
    provider_ref: '984102941829',
    screenshot_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=500',
    amount_cents: 1970,
    order_total_cents: 1970,
    risk_score: 25,
    risk_level: 'ALLOW',
    reasons: ['MANUAL_UNVERIFIED'],
    status: 'PENDING',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  }
];

/**
 * Stateful Multi-Tenant Database Store with Cloud SQL, Fraud Engine, and Firestore Realtime Emulation
 */
class MultiTenantDatabase {
  private users: UserProfile[] = [...SEED_USERS];
  private shops: Shop[] = [...SEED_SHOPS];
  private memberships: Membership[] = [...SEED_MEMBERSHIPS];
  private menuItems: MenuItem[] = [...SEED_MENU_ITEMS];
  private orders: Order[] = [...SEED_ORDERS];
  private auditLogs: AuditLog[] = [...SEED_AUDIT_LOGS];
  private fraudReviews: FraudReview[] = [...SEED_FRAUD_REVIEWS];
  private teamMembers: TeamMember[] = [...SEED_TEAM_MEMBERS];
  private staffMemberships: StaffMembership[] = [...SEED_STAFF_MEMBERSHIPS];
  private aiEvents: AIEvent[] = [...SEED_AI_EVENTS];

  // IP/Device request tracking for velocity fraud detection (RSK-03)
  private velocityTracker: Map<string, number[]> = new Map();

  // Daily token counters per shop: e.g. shp-apex-001 -> 3
  private dailyCounters: Map<string, number> = new Map([
    ['shp-apex-001', 3],
    ['shp-lumina-002', 0],
    ['shp-internal-qa', 0],
    ['shp-artisan-roasters', 0],
    ['shp-green-sprout', 0]
  ]);

  // Firestore Realtime Collections: live_orders_{shop_id} & shop_{shop_id}_live_orders
  private firestoreLiveOrders: Map<string, Order[]> = new Map();

  // Current simulated session
  private activeUserId: string = 'usr-merchant-001';
  private activeShopId: string = 'shp-apex-001';

  constructor() {
    this.syncFirestoreForShop('shp-apex-001');
    this.syncFirestoreForShop('shp-lumina-002');
    this.syncFirestoreForShop('shp-internal-qa');
    this.syncFirestoreForShop('shp-artisan-roasters');
    this.syncFirestoreForShop('shp-green-sprout');
  }

  private syncFirestoreForShop(shopId: string) {
    const activeOrders = this.orders.filter(
      o => o.shop_id === shopId && ['INCOMING', 'PREPARING', 'READY'].includes(o.status)
    );
    this.firestoreLiveOrders.set(`shop_${shopId}_live_orders`, activeOrders);
    this.firestoreLiveOrders.set(`live_orders_${shopId}`, activeOrders);
  }

  // --- Auth & Session Context ---
  public getActiveUser(): UserProfile {
    return this.users.find(u => u.id === this.activeUserId) || this.users[0];
  }

  public getActiveShop(): Shop {
    return this.shops.find(s => s.id === this.activeShopId) || this.shops[0];
  }

  public getActiveShopId(): string {
    return this.activeShopId;
  }

  public setActiveUser(userId: string): UserProfile {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);
    this.activeUserId = userId;

    const userMemberships = this.memberships.filter(m => m.user_id === userId);
    if (userMemberships.length > 0) {
      this.activeShopId = userMemberships[0].shop_id;
    }
    return user;
  }

  public setActiveShop(shopId: string): Shop {
    const shop = this.shops.find(s => s.id === shopId);
    if (!shop) throw new Error(`Shop with ID ${shopId} not found`);
    this.activeShopId = shopId;
    return shop;
  }

  public getAllUsers(): UserProfile[] {
    return [...this.users];
  }

  public getAllShops(actorEmail?: string): Shop[] {
    const isTeam = this.isTeamMember(actorEmail);
    if (isTeam) return [...this.shops];
    // Non-team members cannot see internal test shops
    return this.shops.filter(s => !s.is_internal_test);
  }

  public getTeamMembers(): TeamMember[] {
    return [...this.teamMembers];
  }

  public isSuperAdminEmail(email?: string): boolean {
    if (!email) return false;
    return SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  public isValidAdminApiKey(apiKey?: string): boolean {
    if (!apiKey) return false;
    return apiKey.trim() === ADMIN_API_KEY.trim();
  }

  public isTeamMember(email?: string): boolean {
    if (!email) return false;
    const clean = email.toLowerCase().trim();
    if (this.isSuperAdminEmail(clean)) return true;
    return this.teamMembers.some(tm => tm.email.toLowerCase() === clean);
  }

  public getMembershipsForUser(userId: string): (Membership & { shop?: Shop })[] {
    return this.memberships
      .filter(m => m.user_id === userId)
      .map(m => ({
        ...m,
        shop: this.shops.find(s => s.id === m.shop_id)
      }));
  }

  public getMembershipsForShop(shopId: string): (Membership & { user?: UserProfile })[] {
    return this.memberships
      .filter(m => m.shop_id === shopId)
      .map(m => ({
        ...m,
        user: this.users.find(u => u.id === m.user_id)
      }));
  }

  // --- RLS & Access Checks ---
  public isSuperAdmin(userId: string): boolean {
    const user = this.users.find(u => u.id === userId);
    return user?.system_role === 'super_admin' || this.isSuperAdminEmail(user?.email);
  }

  public isOperationsOrAdmin(userId: string): boolean {
    const user = this.users.find(u => u.id === userId);
    return user?.system_role === 'operations' || user?.system_role === 'super_admin' || this.isSuperAdminEmail(user?.email);
  }

  public isShopOwner(shopId: string, userId: string): boolean {
    if (this.isSuperAdmin(userId)) return true;
    const membership = this.memberships.find(m => m.shop_id === shopId && m.user_id === userId);
    return membership?.role === 'owner';
  }

  public isShopMember(shopId: string, userId: string): boolean {
    if (this.isOperationsOrAdmin(userId)) return true;
    return this.memberships.some(m => m.shop_id === shopId && m.user_id === userId);
  }

  // --- Milestone 02: Menu & Storefront ---
  public getShopBySlug(slug: string, options?: { visitorEmail?: string; apiKey?: string }): { shop: Shop | null; accessDeniedReason?: string } {
    const shop = this.shops.find(s => s.slug === slug);
    if (!shop) return { shop: null };

    // Requirement C: Team Testing
    // If is_internal_test=true, only SUPER_ADMIN_EMAILS can view that shop's /s/ page.
    if (shop.is_internal_test) {
      const email = options?.visitorEmail;
      const isSuper = this.isSuperAdminEmail(email) || this.isValidAdminApiKey(options?.apiKey);
      if (!isSuper) {
        return {
          shop: null,
          accessDeniedReason: `403 Forbidden: Internal test shop "${shop.name}" is restricted to SUPER_ADMIN_EMAILS configured in ENV/Secret Manager.`
        };
      }
    }

    // Public operation allows active shops or approved internal test shops
    if (shop.status !== 'ACTIVE' && shop.status !== 'active' && !shop.is_internal_test) {
      return { shop: null, accessDeniedReason: `Shop is currently ${shop.status} and awaiting approval.` };
    }

    this.logAIEvent(shop.id, 'USER_VISITED', { slug, source: 'qr_menu_entry' });
    return { shop };
  }

  public getShopById(shopId: string): Shop | null {
    return this.shops.find(s => s.id === shopId) || null;
  }

  public getMenuItems(shopId: string): MenuItem[] {
    return this.menuItems.filter(m => m.shop_id === shopId);
  }

  public toggleMenuItemAvailability(shopId: string, itemId: string, isAvailable: boolean, actorId: string): MenuItem {
    if (!this.isShopMember(shopId, actorId)) {
      throw new Error(`Forbidden: User does not have membership in shop ${shopId}`);
    }

    const item = this.menuItems.find(m => m.id === itemId && m.shop_id === shopId);
    if (!item) {
      throw new Error(`MenuItem ${itemId} not found in shop ${shopId}`);
    }

    item.is_available = isAvailable;
    item.updated_at = new Date().toISOString();

    const actor = this.users.find(u => u.id === actorId);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: actorId,
      actor_role: actor?.system_role || 'staff',
      actor_name: actor?.full_name,
      shop_id: shopId,
      action: 'menu.toggle_availability',
      target: `menu_item:${itemId}`,
      metadata: { item_name: item.name, is_available: isAvailable },
      ip_address: '127.0.0.1',
      user_agent: 'Merchant-Dashboard/Next.js-Route',
      timestamp: new Date().toISOString()
    });

    return item;
  }

  public addMenuItem(params: {
    shopId: string;
    actorId: string;
    name: string;
    category: string;
    description: string;
    photoUrl: string;
    priceCents: number;
    isVeg: boolean;
    hsnCode?: string;
    gstRate?: number;
    addOns?: MenuAddOn[];
  }): MenuItem {
    if (!this.isShopMember(params.shopId, params.actorId)) {
      throw new Error(`Forbidden: User does not have membership in shop ${params.shopId}`);
    }

    const newItem: MenuItem = {
      id: `itm-${Date.now().toString(36)}`,
      shop_id: params.shopId,
      category: params.category,
      name: params.name,
      description: params.description,
      photo_url: params.photoUrl,
      price_cents: params.priceCents,
      is_veg: params.isVeg,
      is_available: true,
      hsn_code: params.hsnCode || '2106',
      gst_rate: params.gstRate || 5.0,
      add_ons: params.addOns || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.menuItems.push(newItem);

    const actor = this.users.find(u => u.id === params.actorId);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.actorId,
      actor_role: actor?.system_role || 'merchant',
      actor_name: actor?.full_name,
      shop_id: params.shopId,
      action: 'menu.create_item',
      target: `menu_item:${newItem.id}`,
      metadata: { item_name: newItem.name, category: newItem.category, price: newItem.price_cents },
      ip_address: '127.0.0.1',
      user_agent: 'Merchant-Dashboard',
      timestamp: new Date().toISOString()
    });

    return newItem;
  }

  // Cloud Storage simulated upload handler
  public uploadDishPhoto(shopId: string, filename: string): string {
    const cleanFilename = filename.toLowerCase().replace(/[^a-z0-9.]/g, '_');
    return `https://storage.googleapis.com/aether-dishes-prod/shops/${shopId}/${Date.now()}_${cleanFilename}`;
  }

  // --- Milestone 03: Wait Time Calculation Logic ---
  public calculateWaitTime(shopId: string): number {
    const shop = this.shops.find(s => s.id === shopId);
    const avgPrep = shop?.avg_prep_time_mins || 12;
    // Count of active orders in INCOMING or PREPARING
    const countActive = this.orders.filter(
      o => o.shop_id === shopId && (o.status === 'INCOMING' || o.status === 'PREPARING')
    ).length;
    // Formula: count * avg_prep + avg_prep
    return countActive * avgPrep + avgPrep;
  }

  // Generate unique token format K-[daily_counter]
  public generateNextToken(shopId: string): string {
    const current = this.dailyCounters.get(shopId) || 0;
    const next = current + 1;
    this.dailyCounters.set(shopId, next);
    return `K-${String(next).padStart(2, '0')}`;
  }

  // --- Order Creation (PAY-01, ORD-05, ORD-08) ---
  public createOrder(params: {
    shopId: string;
    mode: OrderMode;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    customerId?: string;
    items: OrderItem[];
    paymentMethod?: string;
  }): Order {
    const shop = this.shops.find(s => s.id === params.shopId);
    if (!shop) throw new Error(`Shop ${params.shopId} not found`);

    if (params.items.length === 0) {
      throw new Error(`Cannot place order with zero items`);
    }

    const token = this.generateNextToken(params.shopId);
    const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNumber = `${(shop.invoice_prefix || shop.slug.substring(0, 3)).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalCents = params.items.reduce((sum, itm) => {
      const addOnsTotal = (itm.selected_add_ons || []).reduce((a, b) => a + b.price_cents, 0);
      return sum + (itm.price_cents + addOnsTotal) * itm.quantity;
    }, 0);

    // Wait Time logic (ORD-08)
    const estimatedWaitMins = this.calculateWaitTime(params.shopId);

    // PAY-01: Create payment with status PENDING, provider MANUAL_UPI
    const payment: Payment = {
      id: `pay-${Date.now().toString(36)}`,
      order_id: orderId,
      shop_id: params.shopId,
      amount_cents: totalCents,
      status: 'PENDING',
      method: params.paymentMethod || 'MANUAL_UPI',
      provider: (params.paymentMethod as any) || 'MANUAL_UPI',
      provider_ref: null,
      screenshot_url: null,
      risk_score: 10,
      risk_level: 'ALLOW',
      created_at: new Date().toISOString()
    };

    const newOrder: Order = {
      id: orderId,
      shop_id: params.shopId,
      customer_id: params.customerId || null,
      order_number: orderNumber,
      token,
      mode: params.mode,
      table_number: params.tableNumber,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      items: params.items,
      total_cents: totalCents,
      status: 'INCOMING',
      estimated_wait_mins: estimatedWaitMins,
      invoice_number: `${shop.invoice_prefix || 'INV'}-${new Date().getFullYear()}-${token}`,
      payment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.orders.unshift(newOrder);
    this.syncFirestoreForShop(params.shopId);

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.customerId || 'anon_customer',
      actor_role: 'customer',
      actor_name: params.customerName || 'Online QR Customer',
      shop_id: params.shopId,
      action: 'order.create',
      target: `order:${newOrder.id}`,
      metadata: {
        token: newOrder.token,
        mode: newOrder.mode,
        total_cents: newOrder.total_cents,
        wait_mins: estimatedWaitMins
      },
      ip_address: '127.0.0.1 (Client/Cloud Run)',
      user_agent: 'Aether-QR-Menu/v2.0',
      timestamp: new Date().toISOString()
    });

    return newOrder;
  }

  // --- Milestone 03: Fraud Engine (RSK-01 to RSK-10) ---
  public calculateFraudScore(params: {
    shopId: string;
    orderId: string;
    paymentAmountCents: number;
    orderTotalCents: number;
    provider: 'MANUAL_UPI' | 'RAZORPAY';
    providerRef?: string | null;
    deviceId?: string;
  }): { riskScore: number; riskLevel: 'ALLOW' | 'MONITOR' | 'REVIEW'; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    const { shopId, orderId, paymentAmountCents, orderTotalCents, provider, providerRef, deviceId } = params;

    // RSK-01: MANUAL_UPI is never auto-verified; always flag for review
    if (provider === 'MANUAL_UPI') {
      reasons.push('MANUAL_UNVERIFIED');
      score += 15;
    }

    // RSK-02 DUPLICATE: Check if same UTR / provider_ref already exists in other payments for same shop
    if (providerRef && providerRef.trim()) {
      const cleanRef = providerRef.trim().toUpperCase();
      const duplicateExists = this.orders.some(o => 
        o.shop_id === shopId && 
        o.id !== orderId && 
        o.payment?.provider_ref && 
        o.payment.provider_ref.trim().toUpperCase() === cleanRef
      );

      if (duplicateExists) {
        score += 80;
        reasons.push('DUPLICATE_UTR');
      }
    }

    // RSK-04 AMOUNT_MISMATCH: If payment amount != order total
    if (paymentAmountCents !== orderTotalCents) {
      score += 90;
      reasons.push('AMOUNT_MISMATCH');
    }

    // RSK-03 VELOCITY: Check if > 5 requests from same device_id in last 10 mins
    if (deviceId) {
      const now = Date.now();
      const tenMinsAgo = now - 10 * 60 * 1000;
      const history = this.velocityTracker.get(deviceId) || [];
      const recent = history.filter(ts => ts > tenMinsAgo);
      recent.push(now);
      this.velocityTracker.set(deviceId, recent);

      if (recent.length > 5) {
        score += 60;
        reasons.push('VELOCITY');
      }
    }

    // RSK-06 Scoring levels
    let riskLevel: 'ALLOW' | 'MONITOR' | 'REVIEW' = 'ALLOW';
    if (score >= 71) {
      riskLevel = 'REVIEW';
    } else if (score >= 31) {
      riskLevel = 'MONITOR';
    }

    return {
      riskScore: Math.min(100, score),
      riskLevel,
      reasons
    };
  }

  // PAY-02 & RSK-08: Customer Submits Manual UPI Reference & Screenshot
  public submitPaymentProof(params: {
    orderId: string;
    utr: string;
    screenshotUrl?: string;
    deviceId?: string;
    customAmountCents?: number; // for testing mismatch
  }): { payment: Payment; fraudReview: FraudReview } {
    const order = this.orders.find(o => o.id === params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found`);

    if (!order.payment) {
      order.payment = {
        id: `pay-${Date.now().toString(36)}`,
        order_id: order.id,
        shop_id: order.shop_id,
        amount_cents: order.total_cents,
        status: 'PENDING',
        method: 'MANUAL_UPI',
        created_at: new Date().toISOString()
      };
    }

    const paymentAmount = params.customAmountCents ?? order.total_cents;

    // Run Fraud Engine
    const fraud = this.calculateFraudScore({
      shopId: order.shop_id,
      orderId: order.id,
      paymentAmountCents: paymentAmount,
      orderTotalCents: order.total_cents,
      provider: 'MANUAL_UPI',
      providerRef: params.utr,
      deviceId: params.deviceId || 'dev-browser-client'
    });

    order.payment.provider = 'MANUAL_UPI';
    order.payment.provider_ref = params.utr;
    order.payment.screenshot_url = params.screenshotUrl || `https://storage.googleapis.com/aether-payment-proofs/${order.id}.jpg`;
    order.payment.amount_cents = paymentAmount;
    order.payment.risk_score = fraud.riskScore;
    order.payment.risk_level = fraud.riskLevel;
    order.payment.status = 'PENDING'; // Keep pending for manual review (RSK-01)

    // Upsert into fraud_reviews table (RSK-08)
    const existingRevIdx = this.fraudReviews.findIndex(r => r.order_id === order.id);
    const reviewEntry: FraudReview = {
      id: existingRevIdx >= 0 ? this.fraudReviews[existingRevIdx].id : `rev-${Date.now()}`,
      payment_id: order.payment.id,
      order_id: order.id,
      shop_id: order.shop_id,
      order_token: order.token,
      provider_ref: params.utr,
      screenshot_url: order.payment.screenshot_url,
      amount_cents: paymentAmount,
      order_total_cents: order.total_cents,
      risk_score: fraud.riskScore,
      risk_level: fraud.riskLevel,
      reasons: fraud.reasons,
      status: 'PENDING',
      created_at: new Date().toISOString()
    };

    if (existingRevIdx >= 0) {
      this.fraudReviews[existingRevIdx] = reviewEntry;
    } else {
      this.fraudReviews.unshift(reviewEntry);
    }

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: order.customer_id || 'anon_customer',
      actor_role: 'customer',
      shop_id: order.shop_id,
      action: 'payment.proof_submitted',
      target: `payment:${order.payment.id}`,
      metadata: {
        order_token: order.token,
        utr: params.utr,
        risk_score: fraud.riskScore,
        reasons: fraud.reasons
      },
      ip_address: '127.0.0.1',
      user_agent: 'Client/UPI-Portal',
      timestamp: new Date().toISOString()
    });

    return { payment: order.payment, fraudReview: reviewEntry };
  }

  // Merchant Dashboard Action: Confirm Paid or Mark Fraud (RSK-08)
  public verifyPaymentMerchant(params: {
    reviewId?: string;
    paymentId?: string;
    orderId?: string;
    actorId: string;
    action: 'CONFIRM' | 'REJECT';
    notes?: string;
  }): { success: boolean; order: Order } {
    let order: Order | undefined;
    if (params.orderId) {
      order = this.orders.find(o => o.id === params.orderId);
    } else if (params.paymentId) {
      order = this.orders.find(o => o.payment?.id === params.paymentId);
    } else if (params.reviewId) {
      const rev = this.fraudReviews.find(r => r.id === params.reviewId);
      if (rev) order = this.orders.find(o => o.id === rev.order_id);
    }

    if (!order || !order.payment) {
      throw new Error('Order or payment record not found');
    }

    // Security check: must be member of shop or team member
    const actor = this.users.find(u => u.id === params.actorId);
    if (!this.isShopMember(order.shop_id, params.actorId) && !this.isTeamMember(actor?.email)) {
      throw new Error(`Forbidden: Insufficient role to verify payments for shop ${order.shop_id}`);
    }

    const rev = this.fraudReviews.find(r => r.order_id === order?.id);

    if (params.action === 'CONFIRM') {
      order.payment.status = 'VERIFIED';
      order.payment.verified_at = new Date().toISOString();
      if (order.status === 'INCOMING') {
        order.status = 'PREPARING';
      }
      if (rev) rev.status = 'CONFIRMED';
    } else {
      order.payment.status = 'FAILED';
      order.status = 'CANCELLED';
      if (rev) rev.status = 'REJECTED';
    }

    this.syncFirestoreForShop(order.shop_id);

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.actorId,
      actor_role: actor?.system_role || 'merchant',
      actor_name: actor?.full_name,
      shop_id: order.shop_id,
      action: params.action === 'CONFIRM' ? 'payment.verified' : 'payment.rejected_fraud',
      target: `payment:${order.payment.id}`,
      metadata: {
        order_token: order.token,
        action: params.action,
        notes: params.notes,
        utr: order.payment.provider_ref
      },
      ip_address: '127.0.0.1',
      user_agent: 'Merchant-Dashboard/Review-Queue',
      timestamp: new Date().toISOString()
    });

    return { success: true, order };
  }

  // PAY-03 & PAY-06: Razorpay Webhook Simulation with HMAC & Idempotency
  public processRazorpayWebhook(params: {
    rawBody: string;
    signature: string;
    secret: string;
    payload: any;
  }): { status: 'VERIFIED' | 'ALREADY_PROCESSED' | 'FRAUD_REVIEW' | 'INVALID_SIGNATURE'; order?: Order; reason?: string } {
    // 1. Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', params.secret)
      .update(params.rawBody)
      .digest('hex');

    if (expectedSignature !== params.signature) {
      return { status: 'INVALID_SIGNATURE', reason: 'Invalid signature verification' };
    }

    const paymentEntity = params.payload?.payload?.payment?.entity;
    if (!paymentEntity) {
      throw new Error('Invalid Razorpay payload structure');
    }

    const razorpayPaymentId = paymentEntity.id;
    const amountInPaise = paymentEntity.amount;
    const notes = paymentEntity.notes || {};
    const orderId = notes.order_id;
    const shopId = notes.shop_id;

    // PAY-06 Idempotency check: if payment_id already processed
    const alreadyProcessed = this.orders.find(o => o.payment?.provider_ref === razorpayPaymentId && o.payment?.status === 'VERIFIED');
    if (alreadyProcessed) {
      return { status: 'ALREADY_PROCESSED', order: alreadyProcessed };
    }

    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found in database`);
    }

    // PAY-04 Amount Matching: Razorpay amount is in paise ($1 = 100 cents = 100 units)
    if (order.total_cents !== amountInPaise) {
      // Amount mismatch -> create fraud review
      const rev: FraudReview = {
        id: `rev-${Date.now()}`,
        payment_id: `pay-${razorpayPaymentId}`,
        order_id: order.id,
        shop_id: order.shop_id,
        order_token: order.token,
        provider_ref: razorpayPaymentId,
        amount_cents: amountInPaise,
        order_total_cents: order.total_cents,
        risk_score: 90,
        risk_level: 'REVIEW',
        reasons: ['AMOUNT_MISMATCH'],
        status: 'PENDING',
        created_at: new Date().toISOString()
      };
      this.fraudReviews.unshift(rev);
      return { status: 'FRAUD_REVIEW', order, reason: 'AMOUNT_MISMATCH' };
    }

    // Mark verified
    order.payment = {
      id: `pay-${Date.now().toString(36)}`,
      order_id: order.id,
      shop_id: order.shop_id,
      amount_cents: order.total_cents,
      status: 'VERIFIED',
      method: 'RAZORPAY',
      provider: 'RAZORPAY',
      provider_ref: razorpayPaymentId,
      risk_score: 0,
      risk_level: 'ALLOW',
      created_at: new Date().toISOString(),
      verified_at: new Date().toISOString()
    };

    order.status = 'PREPARING'; // accepted & preparing
    this.syncFirestoreForShop(order.shop_id);

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: 'webhook_razorpay',
      actor_role: 'system_webhook',
      shop_id: order.shop_id,
      action: 'payment.webhook_verified',
      target: `payment:${order.payment.id}`,
      metadata: {
        order_id: order.id,
        token: order.token,
        razorpay_id: razorpayPaymentId,
        amount: order.total_cents
      },
      ip_address: '127.0.0.1 (Razorpay-Webhook)',
      user_agent: 'Razorpay-CloudRun-Webhook',
      timestamp: new Date().toISOString()
    });

    return { status: 'VERIFIED', order };
  }

  // --- Milestone 03: GST Bill Login Gate & Invoice (Req 3 & 5) ---
  public assignCustomerToOrder(params: {
    orderId: string;
    customerUid: string;
    customerEmail?: string;
    customerPhone?: string;
  }): Order {
    const order = this.orders.find(o => o.id === params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found`);

    order.customer_id = params.customerUid;
    if (params.customerPhone) order.customer_phone = params.customerPhone;
    order.updated_at = new Date().toISOString();

    const shop = this.shops.find(s => s.id === order.shop_id);
    if (!order.invoice_number) {
      order.invoice_number = `${shop?.invoice_prefix || 'INV'}-${new Date().getFullYear()}-${order.token}`;
    }

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.customerUid,
      actor_role: 'customer',
      shop_id: order.shop_id,
      action: 'order.customer_authenticated',
      target: `order:${order.id}`,
      metadata: { customer_uid: params.customerUid, email: params.customerEmail },
      ip_address: '127.0.0.1',
      user_agent: 'Firebase-Auth-PhoneOTP',
      timestamp: new Date().toISOString()
    });

    return order;
  }

  public getOrderInvoice(params: {
    orderId: string;
    actorUid?: string;
    actorEmail?: string;
  }) {
    const order = this.orders.find(o => o.id === params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found`);

    const shop = this.shops.find(s => s.id === order.shop_id);
    if (!shop) throw new Error(`Shop not found`);

    // Security Gate: Check orders.customer_id == logged-in user OR team_member OR shop owner
    const isOwner = params.actorUid ? this.isShopOwner(shop.id, params.actorUid) : false;
    const isTeam = this.isTeamMember(params.actorEmail);
    const isCustomer = order.customer_id && params.actorUid && order.customer_id === params.actorUid;

    if (!isCustomer && !isOwner && !isTeam) {
      throw new Error(`403 Forbidden: GST Tax Invoice is private. You must authenticate as the customer who placed order ${order.token} or as store staff.`);
    }

    // Build itemized GST breakdown
    const itemsWithGst = order.items.map(item => {
      const menuItem = this.menuItems.find(m => m.id === item.item_id);
      const hsnCode = menuItem?.hsn_code || '2106';
      const gstRate = menuItem?.gst_rate || 5.0;

      const totalItemCents = item.price_cents * item.quantity + 
        (item.selected_add_ons || []).reduce((a, b) => a + b.price_cents * item.quantity, 0);

      // Taxable value = Total / (1 + gstRate / 100)
      const taxableValueCents = Math.round(totalItemCents / (1 + gstRate / 100));
      const totalTaxCents = totalItemCents - taxableValueCents;
      const cgstCents = Math.round(totalTaxCents / 2);
      const sgstCents = totalTaxCents - cgstCents;

      return {
        item_id: item.item_id,
        name: item.name,
        hsn_code: hsnCode,
        quantity: item.quantity,
        rate_cents: item.price_cents,
        selected_add_ons: item.selected_add_ons,
        taxable_value_cents: taxableValueCents,
        gst_rate: gstRate,
        cgst_rate: gstRate / 2,
        cgst_amount_cents: cgstCents,
        sgst_rate: gstRate / 2,
        sgst_amount_cents: sgstCents,
        total_cents: totalItemCents
      };
    });

    const totalTaxableCents = itemsWithGst.reduce((a, b) => a + b.taxable_value_cents, 0);
    const totalCgstCents = itemsWithGst.reduce((a, b) => a + b.cgst_amount_cents, 0);
    const totalSgstCents = itemsWithGst.reduce((a, b) => a + b.sgst_amount_cents, 0);

    return {
      invoiceNumber: order.invoice_number || `${shop.invoice_prefix || 'INV'}-${new Date().getFullYear()}-${order.token}`,
      date: order.created_at,
      token: order.token,
      mode: order.mode,
      tableNumber: order.table_number,
      customerName: order.customer_name || 'Valued Customer',
      customerPhone: order.customer_phone,
      shop: {
        id: shop.id,
        name: shop.name,
        gstin: shop.gstin || '27AABCA1234C1Z5',
        address: shop.address || 'Standard Storefront Address',
        currency: shop.currency
      },
      items: itemsWithGst,
      summary: {
        taxableValueCents: totalTaxableCents,
        cgstCents: totalCgstCents,
        sgstCents: totalSgstCents,
        grandTotalCents: order.total_cents
      },
      paymentStatus: order.payment?.status || 'PENDING'
    };
  }

  // --- Fraud Reviews API ---
  public getFraudReviews(shopId: string, actorId: string): FraudReview[] {
    if (!this.isShopMember(shopId, actorId) && !this.isOperationsOrAdmin(actorId)) {
      throw new Error(`Forbidden: User does not have access to shop fraud reviews`);
    }
    return this.fraudReviews.filter(r => r.shop_id === shopId);
  }

  // --- Orders & Status Updates ---
  public updateOrderStatus(params: {
    orderId: string;
    newStatus: OrderStatus;
    actorId: string;
    staffRole?: StaffRole;
  }): Order {
    const order = this.orders.find(o => o.id === params.orderId);
    if (!order) {
      throw new Error(`Order ${params.orderId} not found`);
    }

    if (!this.isShopMember(order.shop_id, params.actorId)) {
      throw new Error(`Security Violation: Cross-shop access denied. Actor ${params.actorId} is not a member of shop ${order.shop_id}.`);
    }

    // MRC-04 Role Boundary: Kitchen role can ONLY advance INCOMING -> PREPARING -> READY
    if (params.staffRole === 'kitchen') {
      const allowed: Record<string, string[]> = {
        'INCOMING': ['PREPARING'],
        'PREPARING': ['READY'],
      };
      if (!allowed[order.status]?.includes(params.newStatus)) {
        throw new Error(`Role Restriction: Kitchen staff can only transition INCOMING -> PREPARING -> READY. Transition from ${order.status} to ${params.newStatus} is blocked.`);
      }
    }

    const previousStatus = order.status;
    order.status = params.newStatus;
    order.updated_at = new Date().toISOString();

    this.syncFirestoreForShop(order.shop_id);

    // AI Data Layer (MRC): Log order progress event
    this.logAIEvent(order.shop_id, 'ORDER_PLACED', {
      order_id: order.id,
      token: order.token,
      transition: `${previousStatus} -> ${params.newStatus}`,
      role: params.staffRole || 'merchant'
    });

    const actor = this.users.find(u => u.id === params.actorId);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.actorId,
      actor_role: actor?.system_role || 'staff',
      actor_name: actor?.full_name,
      shop_id: order.shop_id,
      action: 'order.status_update',
      target: `order:${order.id}`,
      metadata: {
        token: order.token,
        previous_status: previousStatus,
        new_status: params.newStatus,
        mode: order.mode,
        staff_role: params.staffRole || 'owner'
      },
      ip_address: '127.0.0.1',
      user_agent: 'Merchant-Dashboard/Realtime-Board',
      timestamp: new Date().toISOString()
    });

    return order;
  }

  public getOrderById(orderId: string): Order | null {
    return this.orders.find(o => o.id === orderId) || null;
  }

  public getLiveOrders(shopId: string, actorId: string): Order[] {
    if (!this.isShopMember(shopId, actorId) && !this.isOperationsOrAdmin(actorId)) {
      throw new Error(`403 Forbidden: User is not authorized to inspect live orders for shop ${shopId}`);
    }

    return this.orders.filter(
      o => o.shop_id === shopId && ['INCOMING', 'PREPARING', 'READY'].includes(o.status)
    );
  }

  // --- M01 Compatibility APIs ---
  public queryProductsWithRLS(actorId: string, filterShopId?: string): { data: any[]; rlsFilteredOutCount: number } {
    const accessible = this.menuItems.filter(item => {
      if (filterShopId && item.shop_id !== filterShopId) return false;
      return true;
    });
    return { data: accessible, rlsFilteredOutCount: 0 };
  }

  public queryOrdersWithRLS(actorId: string, filterShopId?: string): { data: Order[]; rlsFilteredOutCount: number } {
    const actor = this.users.find(u => u.id === actorId);
    const isOps = actor ? this.isOperationsOrAdmin(actor.id) : false;

    const accessible = this.orders.filter(order => {
      if (filterShopId && order.shop_id !== filterShopId) return false;
      if (isOps) return true;
      if (actor && this.isShopMember(order.shop_id, actor.id)) return true;
      if (actor && order.customer_id === actor.id) return true;
      return false;
    });

    const totalMatchingShop = filterShopId 
      ? this.orders.filter(o => o.shop_id === filterShopId).length 
      : this.orders.length;

    return {
      data: accessible,
      rlsFilteredOutCount: totalMatchingShop - accessible.length
    };
  }

  public queryAuditLogsWithRLS(actorId: string, filterShopId?: string): { data: AuditLog[]; allowed: boolean } {
    const actor = this.users.find(u => u.id === actorId);
    if (!actor) return { data: [], allowed: false };

    const isOps = this.isOperationsOrAdmin(actor.id);

    if (filterShopId) {
      const isOwner = this.isShopOwner(filterShopId, actor.id);
      if (!isOwner && !isOps) {
        return { data: [], allowed: false };
      }
      const logs = this.auditLogs.filter(log => log.shop_id === filterShopId);
      return { data: logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), allowed: true };
    }

    if (isOps) {
      return { 
        data: [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), 
        allowed: true 
      };
    }

    const ownedShopIds = this.memberships
      .filter(m => m.user_id === actor.id && m.role === 'owner')
      .map(m => m.shop_id);

    if (ownedShopIds.length === 0) {
      return { data: [], allowed: false };
    }

    const logs = this.auditLogs.filter(log => log.shop_id && ownedShopIds.includes(log.shop_id));
    return { data: logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), allowed: true };
  }

  public attemptDirectBrowserAuditLogInsert(actorId: string, fakeLog: Partial<AuditLog>): { success: false; error: string; code: string } {
    return {
      success: false,
      error: 'new row violates row-level security policy for table "audit_logs" (RLS policy "audit_logs_insert_block_client" evaluates to FALSE)',
      code: '42501'
    };
  }

  public executePrivilegedAction(params: {
    actorId: string;
    action: string;
    target: string;
    shopId?: string;
    payload: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): {
    success: boolean;
    message: string;
    auditLog: AuditLog;
    updatedData?: unknown;
  } {
    const { actorId, action, target, shopId, payload, ipAddress, userAgent } = params;
    const actor = this.users.find(u => u.id === actorId);
    if (!actor) throw new Error(`Unauthorized: Actor ${actorId} not recognized`);

    const effectiveShopId = shopId || this.activeShopId;
    const isOps = this.isOperationsOrAdmin(actor.id);
    const isOwner = this.isShopOwner(effectiveShopId, actor.id);

    if (!isOwner && !isOps) {
      throw new Error(`Forbidden: Insufficient privileges for action ${action}`);
    }

    const auditEntry: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor_id: actor.id,
      actor_role: actor.system_role,
      actor_name: actor.full_name,
      shop_id: effectiveShopId,
      action,
      target,
      metadata: {
        ...payload,
        execution_context: 'server_route_handler_service_role',
        authorized_by_role: actor.system_role
      },
      ip_address: ipAddress || '127.0.0.1 (Client/Vite-Proxy)',
      user_agent: userAgent || 'Next.js 14 Route Handler (Server Engine)',
      timestamp: new Date().toISOString()
    };

    this.auditLogs.unshift(auditEntry);

    return {
      success: true,
      message: `Privileged action '${action}' successfully executed. Audit record generated.`,
      auditLog: auditEntry
    };
  }

  public createShop(params: {
    actorId: string;
    name: string;
    slug: string;
    plan?: 'starter' | 'growth' | 'enterprise';
    currency?: string;
    isInternalTest?: boolean;
  }): { shop: Shop; membership: Membership; auditLog: AuditLog } {
    const actor = this.users.find(u => u.id === params.actorId);
    if (!actor) throw new Error('Actor not found');

    if (actor.system_role !== 'merchant' && actor.system_role !== 'super_admin') {
      throw new Error(`Forbidden: Only merchants or super administrators can provision new tenant shops`);
    }

    const isTeam = this.isTeamMember(actor.email);
    // Requirement A:
    // 1. Merchant signs up -> creates shop -> status = PENDING_APPROVAL.
    // 4. If is_internal_test=true (created by admin for personal testing), bypass payment & auto ACTIVE, but only visible to team_members.
    const isInternal = Boolean(params.isInternalTest && isTeam);
    const initialStatus = isInternal ? 'ACTIVE' : 'PENDING_APPROVAL';
    const initialSubscription = isInternal ? 'ACTIVE' : 'NONE';

    const shopId = `shp-${params.slug.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString(36)}`;
    const newShop: Shop = {
      id: shopId,
      name: params.name,
      slug: params.slug.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      owner_id: actor.id,
      status: initialStatus,
      plan: params.plan || 'starter',
      currency: params.currency || 'USD',
      gstin: '27AABCT9999P1Z1',
      invoice_prefix: params.slug.substring(0, 3).toUpperCase(),
      avg_prep_time_mins: 12,
      upi_id: `${params.slug.replace(/[^a-z0-9]/g, '')}@upi`,
      theme_color: '#4f46e5',
      is_internal_test: isInternal,
      approved_by: isInternal ? actor.email : null,
      approved_at: isInternal ? new Date().toISOString() : null,
      subscription_status: initialSubscription,
      subscription_paid_at: isInternal ? new Date().toISOString() : null,
      settings: {
        allow_guest_checkout: true,
        tax_inclusive: false,
        payout_schedule: 'daily'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.shops.push(newShop);

    const newMembership: Membership = {
      id: `mem-${Date.now()}`,
      shop_id: shopId,
      user_id: actor.id,
      role: 'owner',
      permissions: ['*'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.memberships.push(newMembership);

    // Also auto-add to staff memberships as owner
    const staffOwner: StaffMembership = {
      id: `stf-${Date.now()}`,
      shop_id: shopId,
      user_id: actor.id,
      invited_email: actor.email,
      name: actor.full_name,
      role: 'owner',
      status: 'ACTIVE',
      invited_at: new Date().toISOString(),
      accepted_at: new Date().toISOString()
    };
    this.staffMemberships.unshift(staffOwner);

    // AI Data Layer (MRC)
    this.logAIEvent(shopId, 'USER_VISITED', {
      event: 'shop_provisioned',
      is_internal: isInternal,
      plan: newShop.plan
    });

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      actor_id: actor.id,
      actor_role: actor.system_role,
      actor_name: actor.full_name,
      shop_id: shopId,
      action: 'shop.create',
      target: `shop:${shopId}`,
      metadata: { name: newShop.name, slug: newShop.slug, plan: newShop.plan, status: newShop.status, is_internal_test: isInternal },
      ip_address: '127.0.0.1',
      user_agent: 'Next.js 14 Route Handler / API',
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(audit);

    return { shop: newShop, membership: newMembership, auditLog: audit };
  }

  // --- Requirement A: Admin Approvals & Subscription Payments ---
  public getPendingApprovalShops(actorEmail?: string): Shop[] {
    if (!this.isTeamMember(actorEmail)) {
      throw new Error(`403 Forbidden: Only verified team members can access the shop approval queue.`);
    }
    return this.shops.filter(s => s.status === 'PENDING_APPROVAL');
  }

  public approveShop(params: { shopId: string; adminEmail: string }): Shop {
    if (!this.isTeamMember(params.adminEmail)) {
      throw new Error(`403 Forbidden: Email ${params.adminEmail} is not an authorized team member.`);
    }
    const shop = this.shops.find(s => s.id === params.shopId);
    if (!shop) throw new Error(`Shop ${params.shopId} not found`);

    shop.status = 'ACTIVE';
    shop.approved_by = params.adminEmail;
    shop.approved_at = new Date().toISOString();
    shop.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: 'admin',
      actor_role: 'super_admin',
      actor_name: `Admin (${params.adminEmail})`,
      shop_id: shop.id,
      action: 'shop.approved',
      target: `shop:${shop.id}`,
      metadata: { approved_by: params.adminEmail, approved_at: shop.approved_at, name: shop.name },
      timestamp: new Date().toISOString()
    });

    return shop;
  }

  public rejectShop(params: { shopId: string; adminEmail: string; reason?: string }): Shop {
    if (!this.isTeamMember(params.adminEmail)) {
      throw new Error(`403 Forbidden: Email ${params.adminEmail} is not an authorized team member.`);
    }
    const shop = this.shops.find(s => s.id === params.shopId);
    if (!shop) throw new Error(`Shop ${params.shopId} not found`);

    shop.status = 'REJECTED';
    shop.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: 'admin',
      actor_role: 'super_admin',
      actor_name: `Admin (${params.adminEmail})`,
      shop_id: shop.id,
      action: 'shop.rejected',
      target: `shop:${shop.id}`,
      metadata: { rejected_by: params.adminEmail, reason: params.reason || 'Verification criteria not met' },
      timestamp: new Date().toISOString()
    });

    return shop;
  }

  public payShopSubscription(params: { shopId: string }): Shop {
    const shop = this.shops.find(s => s.id === params.shopId);
    if (!shop) throw new Error(`Shop ${params.shopId} not found`);

    shop.subscription_status = 'ACTIVE';
    shop.subscription_paid_at = new Date().toISOString();
    shop.updated_at = new Date().toISOString();

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: shop.owner_id,
      actor_role: 'merchant',
      actor_name: 'Merchant Subscription',
      shop_id: shop.id,
      action: 'subscription.activated',
      target: `shop:${shop.id}`,
      metadata: { provider: 'RAZORPAY_TEST_LINK', plan: shop.plan, status: 'ACTIVE' },
      timestamp: new Date().toISOString()
    });

    return shop;
  }

  // --- Requirement D: Staff Control (MRC-04) ---
  public getStaffMemberships(shopId: string): StaffMembership[] {
    return this.staffMemberships.filter(s => s.shop_id === shopId && s.status !== 'REVOKED');
  }

  public inviteStaffMember(params: {
    shopId: string;
    email: string;
    phone?: string;
    role: StaffRole;
    name?: string;
    actorId: string;
  }): StaffMembership {
    if (!this.isShopOwner(params.shopId, params.actorId) && !this.isOperationsOrAdmin(params.actorId)) {
      throw new Error(`Forbidden: Only shop owner can invite staff members.`);
    }

    const newStaff: StaffMembership = {
      id: `stf-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      shop_id: params.shopId,
      user_id: null,
      invited_email: params.email.trim(),
      invited_phone: params.phone?.trim(),
      name: params.name?.trim() || params.email.split('@')[0],
      role: params.role,
      status: 'PENDING',
      invited_at: new Date().toISOString(),
      accepted_at: null
    };

    this.staffMemberships.unshift(newStaff);

    const actor = this.users.find(u => u.id === params.actorId);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.actorId,
      actor_role: actor?.system_role || 'merchant',
      actor_name: actor?.full_name,
      shop_id: params.shopId,
      action: 'staff.invited',
      target: `staff:${newStaff.id}`,
      metadata: { invited_email: params.email, role: params.role, name: newStaff.name },
      timestamp: new Date().toISOString()
    });

    return newStaff;
  }

  public acceptStaffInvite(params: {
    inviteId: string;
    userId?: string;
    userEmail?: string;
  }): StaffMembership {
    const staff = this.staffMemberships.find(s => 
      s.id === params.inviteId || (params.userEmail && s.invited_email.toLowerCase() === params.userEmail.toLowerCase())
    );
    if (!staff) {
      throw new Error(`Staff invitation not found or expired.`);
    }

    staff.status = 'ACTIVE';
    staff.user_id = params.userId || `usr-staff-${Date.now().toString(36)}`;
    staff.accepted_at = new Date().toISOString();

    // Also link to memberships table for RBAC queries
    const existingMem = this.memberships.find(m => m.shop_id === staff.shop_id && m.user_id === staff.user_id);
    if (!existingMem && staff.user_id) {
      this.memberships.push({
        id: `mem-${Date.now()}`,
        shop_id: staff.shop_id,
        user_id: staff.user_id,
        role: staff.role === 'owner' ? 'owner' : 'staff',
        permissions: ['orders.read', 'orders.write'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return staff;
  }

  public revokeStaffMember(params: { staffId: string; shopId: string; actorId: string }): boolean {
    if (!this.isShopOwner(params.shopId, params.actorId) && !this.isOperationsOrAdmin(params.actorId)) {
      throw new Error(`Forbidden: Only shop owner can revoke staff permissions.`);
    }

    const staff = this.staffMemberships.find(s => s.id === params.staffId && s.shop_id === params.shopId);
    if (!staff) return false;

    staff.status = 'REVOKED';

    const actor = this.users.find(u => u.id === params.actorId);
    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: params.actorId,
      actor_role: actor?.system_role || 'merchant',
      actor_name: actor?.full_name,
      shop_id: params.shopId,
      action: 'staff.revoked',
      target: `staff:${staff.id}`,
      metadata: { email: staff.invited_email, role: staff.role },
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // --- Requirement E: AI Data Layer & Support Bot ---
  public logAIEvent(shopId: string, eventType: AIEventType, payload: Record<string, unknown>): AIEvent {
    // Sanitize payload to strip PII (customer phones, emails, raw card details)
    const sanitized: Record<string, unknown> = { ...payload };
    delete sanitized.customerPhone;
    delete sanitized.customerEmail;
    delete sanitized.customerName;
    delete sanitized.phone;
    delete sanitized.email;

    const event: AIEvent = {
      id: `aievt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      shop_id: shopId,
      event_type: eventType,
      payload: sanitized,
      created_at: new Date().toISOString()
    };

    this.aiEvents.unshift(event);
    if (this.aiEvents.length > 200) this.aiEvents.pop(); // keep stream bounded
    return event;
  }

  public getAIEvents(shopId?: string, limit: number = 30): AIEvent[] {
    const list = shopId ? this.aiEvents.filter(e => e.shop_id === shopId) : this.aiEvents;
    return list.slice(0, limit);
  }

  public getShopStats(shopId: string): ShopStats {
    const shop = this.shops.find(s => s.id === shopId) || this.shops[0];
    const shopOrders = this.orders.filter(o => o.shop_id === shop.id);
    const totalRev = shopOrders.reduce((sum, o) => sum + (o.total_cents || 0), 0);

    const createdTime = new Date(shop.created_at).getTime();
    const nowTime = Date.now();
    const daysSinceCreation = Math.max(1, Math.floor((nowTime - createdTime) / (1000 * 60 * 60 * 24)));
    
    // For demonstration, older shops or apex athletics exceed 90 days
    const effectiveDays = daysSinceCreation >= 90 ? daysSinceCreation : (shop.id === 'shp-apex-001' ? 98 : daysSinceCreation);
    const shopEvents = this.aiEvents.filter(e => e.shop_id === shop.id);
    const visitorsToday = shopEvents.filter(e => e.event_type === 'USER_VISITED').length + 38;
    const repeatCount = Math.floor(shopOrders.length * 0.45) + 14;

    return {
      shop_id: shop.id,
      active_since: shop.created_at,
      days_active: effectiveDays,
      total_orders: shopOrders.length + 112,
      total_revenue_cents: totalRev + 245000,
      unique_visitors_today: visitorsToday,
      repeat_customers_count: repeatCount,
      ai_boost_eligible: effectiveDays >= 90,
      ai_boost_unlocked: false
    };
  }

  public handleSupportChat(query: string, shopId?: string): { reply: string; quickReplies: string[] } {
    const q = query.toLowerCase();
    const shop = shopId ? this.shops.find(s => s.id === shopId) : this.getActiveShop();

    if (q.includes('kot') || q.includes('printer') || q.includes('thermal') || q.includes('print')) {
      return {
        reply: `To print Kitchen Order Tickets (KOT) on 58mm thermal printers (MRC-05), click the "Print KOT Receipt" button on any active order in the Merchant Dashboard or Staff POS. The print window isolates styling to monospace font at 58mm roll width, auto-renders a scannable Code128 barcode of token (via JsBarcode), and lists wait time and verified payment state.`,
        quickReplies: ['How to setup 58mm printer?', 'What barcode format is used?', 'View staff roles']
      };
    }

    if (q.includes('approval') || q.includes('pending') || q.includes('approve') || q.includes('waiting')) {
      return {
        reply: `Secure Merchant Approval Flow: When you register a new shop, its initial status is 'PENDING_APPROVAL'. After paying your subscription, a verified platform team member must review and approve your storefront via the Admin Approvals Panel (/admin/approvals). Once approved, your order board instantly unlocks. Internal test shops created by team members bypass payment automatically.`,
        quickReplies: ['Pay Razorpay subscription test', 'Open Admin Approvals Panel', 'How to add staff?']
      };
    }

    if (q.includes('fraud') || q.includes('utr') || q.includes('mismatch') || q.includes('fake') || q.includes('risk')) {
      return {
        reply: `Automated Risk Engine (RSK-01 to RSK-10): All UPI payment references are scored in real time. 1) DUPLICATE_UTR adds +80 risk score if the UTR was previously submitted. 2) AMOUNT_MISMATCH adds +90 if the submitted amount does not match the order total. 3) VELOCITY adds +60 if more than 5 attempts occur in 10 minutes. Flagged orders are queued in the "Payment Review" tab where only merchants can confirm or reject.`,
        quickReplies: ['Simulate duplicate UTR test', 'Check payment review queue', 'How to verify manual UPI?']
      };
    }

    if (q.includes('gst') || q.includes('tax') || q.includes('hsn') || q.includes('invoice') || q.includes('bill')) {
      return {
        reply: `GST Compliance Flow: Your shop GSTIN is configured in shop settings (e.g. ${shop?.gstin || '27AABCA1234C1Z5'}). Each menu item carries an HSN code (e.g. 2106) and GST rate (5.0%). Once an order status is ACCEPTED or PREPARING, customers can authenticate via Phone OTP on the tracking page (/o/[id]) to unlock the tax bill (/bill/[order_id]) and download itemized CGST/SGST PDF invoices.`,
        quickReplies: ['Download sample GST bill', 'Where is my GSTIN saved?', 'What is HSN code?']
      };
    }

    if (q.includes('staff') || q.includes('kitchen') || q.includes('cashier') || q.includes('role')) {
      return {
        reply: `Staff Control (MRC-04): Owners can invite staff with 4 specialized roles: 1) 'kitchen' (can only transition orders from INCOMING -> PREPARING -> READY), 2) 'cashier' (can verify payments, mark fraud, and view bills), 3) 'staff' (table delivery and order pickup dispatch), 4) 'owner' (full admin rights). Use the Staff tab in your dashboard to generate invite links.`,
        quickReplies: ['Invite kitchen staff', 'Open Staff Portal /staff', 'How to revoke staff?']
      };
    }

    if (q.includes('ai') || q.includes('boost') || q.includes('model') || q.includes('event')) {
      return {
        reply: `AI Data Layer: Anonymized order timestamps, categories, and customer velocity events are continuously recorded in the 'ai_events' table. Storefronts active for more than 90 days qualify for AI Boost, unlocking repeat customer ratios, hourly prep recommendations, and predictive restocking alerts.`,
        quickReplies: ['View logged AI events', 'Check AI Boost eligibility', 'What data is logged?']
      };
    }

    return {
      reply: `Hello! I am your AI Operations & Merchant Support Assistant for Cloud Run POS. I can help you with 58mm KOT thermal printing, UPI fraud verification rules, GST invoices, staff role assignments, and merchant approval workflows. What would you like to explore?`,
      quickReplies: ['How does Merchant Approval work?', 'Explain Duplicate UTR fraud test', 'How to invite Kitchen staff?', 'Generate GST Bill']
    };
  }

  public addProduct(params: {
    actorId: string;
    shopId: string;
    name: string;
    sku: string;
    priceCents: number;
    stockQuantity: number;
  }): any {
    if (!this.isShopMember(params.shopId, params.actorId)) {
      throw new Error(`Forbidden: User is not an authorized member of shop ${params.shopId}`);
    }

    const newProduct = {
      id: `prd-${Date.now()}`,
      shop_id: params.shopId,
      name: params.name,
      sku: params.sku,
      price_cents: params.priceCents,
      stock_quantity: params.stockQuantity,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return newProduct;
  }
}

export const db = new MultiTenantDatabase();
