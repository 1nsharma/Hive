-- =========================================================
-- PetGuardian Supabase Database Initialization & Schema Migration
-- =========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'pet_owner', -- 'pet_owner', 'vendor', 'admin'
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PETS TABLE
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'Dog',
  breed TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  weight TEXT,
  photo_url TEXT,
  allergies TEXT,
  medical_notes TEXT,
  microchip_no TEXT,
  is_lost BOOLEAN DEFAULT FALSE,
  slug TEXT UNIQUE NOT NULL,
  emergency_contact JSONB,
  vaccinations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PET PUBLIC PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.pet_public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID UNIQUE REFERENCES public.pets(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  qr_code_url TEXT,
  is_masked_phone BOOLEAN DEFAULT TRUE,
  emergency_phone TEXT,
  reward_offered TEXT,
  active_sos BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TAGS TABLE
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_code TEXT UNIQUE NOT NULL,
  qr_code TEXT,
  type TEXT DEFAULT 'QR_NFC_COLLAR',
  batch_no TEXT,
  status TEXT DEFAULT 'Unbound', -- 'Unbound', 'Active', 'Disabled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TAG BINDINGS TABLE
CREATE TABLE IF NOT EXISTS public.tag_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  bound_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. VENDORS TABLE
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  logo TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  address TEXT,
  phone TEXT,
  category TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  price_formatted TEXT,
  rating NUMERIC(2,1) DEFAULT 4.8,
  reviews_count INT DEFAULT 0,
  image TEXT,
  description TEXT,
  badge TEXT,
  is_in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  provider TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  price_formatted TEXT,
  rating NUMERIC(2,1) DEFAULT 4.9,
  duration TEXT,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  pet_name TEXT,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  address TEXT,
  notes TEXT,
  price_formatted TEXT,
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_name TEXT,
  total_price TEXT,
  shipping_address TEXT,
  phone TEXT,
  status TEXT DEFAULT 'Processing',
  payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT,
  quantity INT NOT NULL DEFAULT 1,
  price TEXT
);

-- 12. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'Completed',
  gateway TEXT DEFAULT 'Razorpay',
  payment_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SIGHTINGS TABLE
CREATE TABLE IF NOT EXISTS public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_phone TEXT,
  location TEXT NOT NULL,
  time TEXT,
  note TEXT,
  latitude NUMERIC(10,8),
  longitude NUMERIC(11,8),
  status TEXT DEFAULT 'Approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. SOS CASES TABLE
CREATE TABLE IF NOT EXISTS public.sos_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'ACTIVE', -- 'ACTIVE', 'RESOLVED', 'CANCELLED'
  description TEXT,
  alert_radius_km NUMERIC(5,2) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- 1. PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. PETS
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own pets or public lost pets" 
  ON public.pets FOR SELECT USING (
    auth.uid() = owner_id OR is_lost = true OR owner_id IS NULL
  );

CREATE POLICY "Users can insert own pet" 
  ON public.pets FOR INSERT WITH CHECK (
    auth.uid() = owner_id OR owner_id IS NULL
  );

CREATE POLICY "Owners can update own pets" 
  ON public.pets FOR UPDATE USING (
    auth.uid() = owner_id OR owner_id IS NULL
  );

CREATE POLICY "Owners can delete own pets" 
  ON public.pets FOR DELETE USING (
    auth.uid() = owner_id OR owner_id IS NULL
  );

-- 3. PET PUBLIC PROFILES
ALTER TABLE public.pet_public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public pet profiles readable by everyone" 
  ON public.pet_public_profiles FOR SELECT USING (true);

CREATE POLICY "Owners can manage pet public profile" 
  ON public.pet_public_profiles FOR ALL USING (
    pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid() OR owner_id IS NULL)
  );

-- 4. TAGS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags readable by everyone" 
  ON public.tags FOR SELECT USING (true);

-- 5. TAG BINDINGS
ALTER TABLE public.tag_bindings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tag bindings viewable by pet owners" 
  ON public.tag_bindings FOR SELECT USING (true);

-- 6. VENDORS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors viewable by everyone" 
  ON public.vendors FOR SELECT USING (true);

CREATE POLICY "Vendors manageable by vendor user" 
  ON public.vendors FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- 7. PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products viewable by everyone" 
  ON public.products FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own products" 
  ON public.products FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid() OR user_id IS NULL)
  );

-- 8. SERVICES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services viewable by everyone" 
  ON public.services FOR SELECT USING (true);

CREATE POLICY "Vendors can manage own services" 
  ON public.services FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid() OR user_id IS NULL)
  );

-- 9. BOOKINGS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" 
  ON public.bookings FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can create bookings" 
  ON public.bookings FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can update own bookings" 
  ON public.bookings FOR UPDATE USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- 10. ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" 
  ON public.orders FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

CREATE POLICY "Users can create orders" 
  ON public.orders FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- 11. ORDER ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" 
  ON public.order_items FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid() OR user_id IS NULL)
  );

CREATE POLICY "Users can insert order items" 
  ON public.order_items FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid() OR user_id IS NULL)
  );

-- 12. REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert own review" 
  ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- 13. PAYMENTS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" 
  ON public.payments FOR SELECT USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- 14. SIGHTINGS
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sightings viewable by everyone" 
  ON public.sightings FOR SELECT USING (true);

CREATE POLICY "Sightings insertable by anyone" 
  ON public.sightings FOR INSERT WITH CHECK (true);

-- 15. SOS CASES
ALTER TABLE public.sos_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SOS cases viewable by everyone" 
  ON public.sos_cases FOR SELECT USING (true);

CREATE POLICY "Users can manage own SOS cases" 
  ON public.sos_cases FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL
  );

-- =========================================================
-- AUTOMATIC USER PROFILE TRIGGER ON AUTH.SIGNUP
-- =========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.phone,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
