-- PetJanu multi-vendor marketplace operations.
-- Apply after 20260811000000_init_schema.sql in the Supabase SQL editor or CI migration runner.

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- A vendor must be reviewed before listing or fulfilling orders. Do not rely on
-- client-side role fields for approval.
CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL CHECK (char_length(business_name) BETWEEN 2 AND 120),
  contact_name TEXT NOT NULL CHECK (char_length(contact_name) BETWEEN 2 AND 120),
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT NOT NULL,
  gstin TEXT,
  pickup_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5,2) NOT NULL DEFAULT 15.00 CHECK (commission_rate >= 0 AND commission_rate <= 100),
  ADD COLUMN IF NOT EXISTS pickup_location TEXT,
  ADD COLUMN IF NOT EXISTS gstin TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS vendors_slug_unique ON public.vendors (slug) WHERE slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS vendor_applications_status_idx ON public.vendor_applications (status, created_at DESC);

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS mrp NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS inventory_quantity INTEGER NOT NULL DEFAULT 0 CHECK (inventory_quantity >= 0),
  ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(7,3),
  ADD COLUMN IF NOT EXISTS dimensions_cm JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 100),
  ADD COLUMN IF NOT EXISTS approval_status TEXT NOT NULL DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected', 'archived')),
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE UNIQUE INDEX IF NOT EXISTS products_vendor_sku_unique ON public.products (vendor_id, sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_catalog_idx ON public.products (approval_status, is_in_stock, category);

-- One checkout can contain goods from multiple vendors. Each vendor receives a
-- private fulfilment record, while the customer retains a single parent order.
CREATE TABLE IF NOT EXISTS public.vendor_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'packed', 'shipped', 'delivered', 'cancelled', 'returned')),
  subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (commission_amount >= 0),
  vendor_payout_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (vendor_payout_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, vendor_id)
);

CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_order_id UUID NOT NULL UNIQUE REFERENCES public.vendor_orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'shiprocket',
  provider_order_id TEXT,
  shipment_id TEXT,
  awb_code TEXT,
  courier_name TEXT,
  tracking_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  last_event JSONB,
  label_url TEXT,
  pickup_scheduled_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS vendor_orders_vendor_status_idx ON public.vendor_orders (vendor_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS shipments_awb_idx ON public.shipments (awb_code) WHERE awb_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.vendor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
  vendor_order_id UUID NOT NULL UNIQUE REFERENCES public.vendor_orders(id) ON DELETE RESTRICT,
  gross_amount NUMERIC(10,2) NOT NULL CHECK (gross_amount >= 0),
  commission_amount NUMERIC(10,2) NOT NULL CHECK (commission_amount >= 0),
  net_amount NUMERIC(10,2) NOT NULL CHECK (net_amount >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'eligible', 'paid', 'on_hold', 'reversed')),
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_order_id UUID NOT NULL REFERENCES public.vendor_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 3 AND 1000),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'rejected', 'picked_up', 'refunded', 'closed')),
  return_shipment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Knowledge centre content supports platform-authored and reviewed vendor guides.
CREATE TABLE IF NOT EXISTS public.knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 5 AND 180),
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL CHECK (char_length(excerpt) <= 400),
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;

-- Replace the permissive demo marketplace policies from the initial schema.
DROP POLICY IF EXISTS "Vendors manageable by vendor user" ON public.vendors;
DROP POLICY IF EXISTS "Products viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Vendors can manage own products" ON public.products;

CREATE POLICY "Applicants manage their own vendor application" ON public.vendor_applications
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins review vendor applications" ON public.vendor_applications
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Public sees active vendors" ON public.vendors
  FOR SELECT USING (status = 'active' OR user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY "Vendors update their own profile" ON public.vendors
  FOR UPDATE USING (user_id = auth.uid() OR public.is_platform_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY "Admins manage vendors" ON public.vendors
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Public sees approved products" ON public.products
  FOR SELECT USING (approval_status = 'approved' OR vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()) OR public.is_platform_admin());
CREATE POLICY "Vendors create product drafts" ON public.products
  FOR INSERT WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid() AND status = 'active')
    AND approval_status = 'draft'
  );
CREATE POLICY "Vendors update unapproved products" ON public.products
  FOR UPDATE USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()))
  WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
    AND approval_status IN ('draft', 'pending')
  );
CREATE POLICY "Admins manage products" ON public.products
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Customers view their own vendor orders" ON public.vendor_orders
  FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Vendors view their fulfilment orders" ON public.vendor_orders
  FOR SELECT USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage vendor orders" ON public.vendor_orders
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Customers view shipment tracking for their orders" ON public.shipments
  FOR SELECT USING (vendor_order_id IN (
    SELECT vo.id FROM public.vendor_orders vo JOIN public.orders o ON o.id = vo.order_id WHERE o.user_id = auth.uid()
  ));
CREATE POLICY "Vendors view their shipments" ON public.shipments
  FOR SELECT USING (vendor_order_id IN (
    SELECT vo.id FROM public.vendor_orders vo JOIN public.vendors v ON v.id = vo.vendor_id WHERE v.user_id = auth.uid()
  ));
CREATE POLICY "Admins manage shipments" ON public.shipments
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Vendors view their payouts" ON public.vendor_payouts
  FOR SELECT USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));
CREATE POLICY "Admins manage payouts" ON public.vendor_payouts
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Customers manage their return requests" ON public.return_requests
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage return requests" ON public.return_requests
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

CREATE POLICY "Published knowledge is public" ON public.knowledge_articles
  FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR public.is_platform_admin());
CREATE POLICY "Authors create knowledge drafts" ON public.knowledge_articles
  FOR INSERT WITH CHECK (author_id = auth.uid() AND status = 'draft');
CREATE POLICY "Authors update their knowledge drafts" ON public.knowledge_articles
  FOR UPDATE USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid() AND status IN ('draft', 'review'));
CREATE POLICY "Admins manage knowledge" ON public.knowledge_articles
  FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());
