/**
 * Core Type Definitions for Milestone 01: Foundation & Security
 * Multi-tenant PostgreSQL / Supabase Schema with Row Level Security (RLS)
 */

export type UserRole = 'customer' | 'merchant' | 'staff' | 'operations' | 'super_admin';

export type MembershipRole = 'owner' | 'staff';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  system_role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type ShopApprovalStatus = 'PENDING_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | 'active' | 'suspended' | 'archived';

export interface Shop {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  status: ShopApprovalStatus;
  plan: 'starter' | 'growth' | 'enterprise';
  currency: string;
  gstin?: string; // e.g. 27AABCA1234C1Z5
  invoice_prefix?: string; // e.g. INV
  address?: string;
  avg_prep_time_mins?: number; // default 12
  upi_id?: string; // e.g. merchant@upi
  theme_color?: string; // e.g. #4f46e5
  logo_url?: string;
  is_internal_test?: boolean;
  approved_by?: string | null; // admin email
  approved_at?: string | null; // ISO timestamp
  subscription_status?: 'NONE' | 'ACTIVE' | 'EXPIRED';
  subscription_paid_at?: string | null;
  settings: {
    allow_guest_checkout: boolean;
    tax_inclusive: boolean;
    stripe_account_id?: string;
    payout_schedule?: 'daily' | 'weekly' | 'manual';
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
}

export type StaffRole = 'owner' | 'cashier' | 'kitchen' | 'staff';
export type StaffStatus = 'PENDING' | 'ACTIVE' | 'REVOKED';

export interface StaffMembership {
  id: string;
  shop_id: string;
  user_id: string | null; // Firebase UID
  invited_email: string;
  invited_phone?: string;
  name?: string;
  role: StaffRole;
  status: StaffStatus;
  invited_at: string;
  accepted_at?: string | null;
}

export type AIEventType = 'ORDER_PLACED' | 'PAYMENT_VERIFIED' | 'USER_VISITED' | 'ITEM_VIEWED' | 'BILL_DOWNLOADED';

export interface AIEvent {
  id: string;
  shop_id: string;
  event_type: AIEventType;
  payload: Record<string, unknown>; // Anonymized, no PII
  created_at: string;
}

export interface ShopStats {
  shop_id: string;
  active_since: string; // ISO date
  days_active: number;
  total_orders: number;
  total_revenue_cents: number;
  unique_visitors_today: number;
  repeat_customers_count: number;
  ai_boost_eligible: boolean;
  ai_boost_unlocked: boolean;
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  quick_replies?: string[];
}

export interface Membership {
  id: string;
  shop_id: string;
  user_id: string;
  role: MembershipRole;
  permissions: string[];
  invited_by?: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  actor_role: string;
  actor_name?: string;
  shop_id: string | null;
  action: string;
  target: string;
  metadata: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  sku: string;
  price_cents: number;
  stock_quantity: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type OrderMode = 'DINE_IN' | 'PARCEL' | 'TOKEN';

export type OrderStatus = 'INCOMING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface MenuAddOn {
  id: string;
  name: string;
  price_cents: number;
}

export interface MenuItem {
  id: string;
  shop_id: string;
  category: string;
  name: string;
  description: string;
  photo_url: string;
  price_cents: number;
  is_veg: boolean;
  is_available: boolean;
  add_ons: MenuAddOn[];
  hsn_code?: string; // e.g. 2106, 0901, 1905
  gst_rate?: number; // e.g. 5.0 (5%)
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  item_id: string;
  name: string;
  price_cents: number;
  quantity: number;
  selected_add_ons: MenuAddOn[];
  notes?: string;
}

export interface Payment {
  id: string;
  order_id: string;
  shop_id: string;
  amount_cents: number;
  status: 'PENDING' | 'VERIFIED' | 'FAILED';
  method: string;
  provider?: 'MANUAL_UPI' | 'RAZORPAY';
  provider_ref?: string | null; // UTR or Razorpay Payment ID
  screenshot_url?: string | null; // Cloud Storage payment-proofs URL
  risk_score?: number; // 0 - 100
  risk_level?: 'ALLOW' | 'MONITOR' | 'REVIEW';
  device_id?: string;
  created_at: string;
  verified_at?: string;
}

export interface Order {
  id: string;
  shop_id: string;
  customer_id: string | null; // Firebase Auth UID
  order_number: string;
  token: string; // e.g. K-01, K-02 (ORD-05)
  mode: OrderMode; // DINE_IN | PARCEL | TOKEN
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  items: OrderItem[];
  total_cents: number;
  status: OrderStatus; // INCOMING -> PREPARING -> READY -> COMPLETED
  payment?: Payment;
  invoice_number?: string; // {shops.invoice_prefix}-{YYYY}-{order.token}
  estimated_wait_mins?: number; // ORD-08
  placed_at_timestamp?: number;
  created_at: string;
  updated_at: string;
}

export interface FraudReview {
  id: string;
  payment_id: string;
  order_id: string;
  shop_id: string;
  order_token?: string;
  provider_ref?: string | null;
  screenshot_url?: string | null;
  amount_cents: number;
  order_total_cents: number;
  risk_score: number;
  risk_level: 'ALLOW' | 'MONITOR' | 'REVIEW';
  reasons: string[]; // e.g. DUPLICATE_UTR, AMOUNT_MISMATCH, VELOCITY, MANUAL_UNVERIFIED
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  reviewed_by?: string;
  created_at: string;
}

export interface TeamMember {
  email: string;
  role: 'owner' | 'developer' | 'qa';
  name: string;
}

export interface SessionContext {
  user: UserProfile;
  activeShopId: string | null;
  memberships: Membership[];
  role: UserRole;
  isSuperAdmin: boolean;
  isOperations: boolean;
  effectiveMembership?: Membership;
}

export interface PrivilegedActionRequest {
  action: string;
  target: string;
  shop_id?: string;
  params: Record<string, unknown>;
}

export interface PrivilegedActionResult {
  success: boolean;
  message: string;
  audit_log_id?: string;
  auditLog?: AuditLog;
  data?: unknown;
  error?: string;
  actor_id: string;
  action: string;
  target: string;
  timestamp: string;
  executionMode: 'server_service_role' | 'browser_direct_blocked';
}

export interface RLSTestCase {
  id: string;
  title: string;
  category: 'Multi-Tenant Isolation' | 'Role Boundary' | 'Audit Log Protection' | 'Browser Bypass Prevention';
  testedRole: UserRole;
  targetShopId?: string;
  description: string;
  ruleVerified: string;
  passed: boolean;
  actualStatus: number;
  expectedStatus: number;
  detail: string;
  sqlSnippet: string;
  latencyMs: number;
}
