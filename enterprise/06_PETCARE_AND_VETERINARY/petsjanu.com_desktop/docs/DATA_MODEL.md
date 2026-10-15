# PetJanu Data Model

**Version:** 1.0.0  
**Last Updated:** Phase 0 Audit  
**Database:** Supabase PostgreSQL (Primary), Firebase Firestore (Secondary)

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│    profiles     │       │      pets       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ owner_id (FK)   │
│ full_name       │       │ id (PK)         │
│ phone           │       │ name            │
│ avatar_url      │       │ species         │
│ role            │       │ breed           │
│ created_at      │       │ slug (UNIQUE)   │
│ updated_at      │       │ is_lost         │
└─────────────────┘       │ medical_notes   │
                          │ emergency_contact│
                          │ vaccinations    │
                          └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
          ┌────────────────┐ ┌────────────┐ ┌─────────────────┐
          │pet_public_profiles│ │tag_bindings│ │   sightings     │
          ├────────────────┤ ├────────────┤ ├─────────────────┤
          │ pet_id (FK)    │ │ pet_id (FK)│ │ pet_id (FK)     │
          │ slug           │ │ tag_id (FK)│ │ location        │
          │ qr_code_url    │ │ is_active  │ │ status          │
          │ active_sos     │ └────────────┘ │ image           │
          └────────────────┘                └─────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │      tags       │
          ├─────────────────┤
          │ id (PK)         │
          │ tag_code        │
          │ qr_code         │
          │ type            │
          │ status          │
          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    vendors      │       │    products     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ vendor_id (FK)  │
│ user_id (FK)    │       │ id (PK)         │
│ name            │       │ name            │
│ category        │       │ price           │
│ is_verified     │       │ category        │
└─────────────────┘       │ in_stock        │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│    services     │       │    bookings     │
├─────────────────┤       ├─────────────────┤
│ vendor_id (FK)  │◄──────│ service_id (FK) │
│ id (PK)         │       │ user_id (FK)    │
│ title           │       │ pet_id (FK)     │
│ price           │       │ date            │
│ duration        │       │ status          │
└─────────────────┘       └─────────────────┘

┌─────────────────┐
│     orders      │
├─────────────────┤
│ user_id (FK)    │
│ id (PK)         │
│ total_price     │
│ status          │
│ payment_id      │
└─────────────────┘
```

---

## Supabase Schema (PostgreSQL)

### 1. profiles

User accounts and profile information.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'pet_owner', -- 'pet_owner', 'vendor', 'admin'
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK to auth.users | User ID from Firebase/Supabase Auth |
| full_name | TEXT | | User's display name |
| phone | TEXT | | Primary contact number |
| avatar_url | TEXT | | Profile picture URL |
| role | TEXT | DEFAULT 'pet_owner' | User role for authorization |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last profile update |

---

### 2. pets

Pet profiles owned by users.

```sql
CREATE TABLE public.pets (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique pet identifier |
| owner_id | UUID | FK to auth.users | Pet owner's user ID |
| name | TEXT | NOT NULL | Pet's name |
| species | TEXT | NOT NULL, DEFAULT 'Dog' | Species (Dog, Cat, Bird, etc.) |
| breed | TEXT | NOT NULL | Breed information |
| age | TEXT | | Age description (e.g., "2 years") |
| gender | TEXT | | Male/Female |
| weight | TEXT | | Weight with unit |
| photo_url | TEXT | | Profile photo URL |
| allergies | TEXT | | Known allergies |
| medical_notes | TEXT | | Medical conditions |
| microchip_no | TEXT | | Microchip identification number |
| is_lost | BOOLEAN | DEFAULT FALSE | Lost pet SOS flag |
| slug | TEXT | UNIQUE NOT NULL | Public URL identifier (e.g., PG-BUDDY-8821) |
| emergency_contact | JSONB | | Contact details JSON |
| vaccinations | JSONB | DEFAULT [] | Vaccination records array |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Profile creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_pets_owner_id` on `owner_id`
- `idx_pets_slug` on `slug`
- `idx_pets_is_lost` on `is_lost`

---

### 3. pet_public_profiles

Public-facing pet profile data for QR/NFC tag scans.

```sql
CREATE TABLE public.pet_public_profiles (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Profile ID |
| pet_id | UUID | UNIQUE FK to pets | Reference to pet |
| slug | TEXT | UNIQUE NOT NULL | Public lookup key |
| qr_code_url | TEXT | | Generated QR code image URL |
| is_masked_phone | BOOLEAN | DEFAULT TRUE | Privacy flag |
| emergency_phone | TEXT | | Relay phone number |
| reward_offered | TEXT | | Reward text if lost |
| active_sos | BOOLEAN | DEFAULT FALSE | SOS mode active |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

---

### 4. tags

Physical QR/NFC collar tags inventory.

```sql
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_code TEXT UNIQUE NOT NULL,
  qr_code TEXT,
  type TEXT DEFAULT 'QR_NFC_COLLAR',
  batch_no TEXT,
  status TEXT DEFAULT 'Unbound', -- 'Unbound', 'Active', 'Disabled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Tag ID |
| tag_code | TEXT | UNIQUE NOT NULL | Unique tag identifier |
| qr_code | TEXT | | QR code data/URL |
| type | TEXT | DEFAULT 'QR_NFC_COLLAR' | Tag type |
| batch_no | TEXT | | Manufacturing batch |
| status | TEXT | DEFAULT 'Unbound' | Current status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Provisioning date |

---

### 5. tag_bindings

Associations between tags and pets.

```sql
CREATE TABLE public.tag_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  bound_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Binding ID |
| tag_id | UUID | FK to tags | Reference to tag |
| pet_id | UUID | FK to pets | Reference to pet |
| bound_at | TIMESTAMPTZ | DEFAULT NOW() | Binding timestamp |
| is_active | BOOLEAN | DEFAULT TRUE | Active binding flag |

---

### 6. vendors

Service providers and product sellers.

```sql
CREATE TABLE public.vendors (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Vendor ID |
| user_id | UUID | FK to auth.users | Owner's user ID |
| name | TEXT | NOT NULL | Business name |
| logo | TEXT | | Logo URL |
| rating | NUMERIC(2,1) | DEFAULT 4.8 | Average rating |
| address | TEXT | | Business address |
| phone | TEXT | | Contact number |
| category | TEXT | | Service/product category |
| is_verified | BOOLEAN | DEFAULT TRUE | Verification status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Registration date |

---

### 7. products

Marketplace product listings.

```sql
CREATE TABLE public.products (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Product ID |
| vendor_id | UUID | FK to vendors | Seller reference |
| name | TEXT | NOT NULL | Product name |
| category | TEXT | NOT NULL | Category classification |
| price | NUMERIC(10,2) | NOT NULL | Price in INR |
| price_formatted | TEXT | | Formatted display (₹499) |
| rating | NUMERIC(2,1) | DEFAULT 4.8 | Average rating |
| reviews_count | INT | DEFAULT 0 | Review count |
| image | TEXT | | Product image URL |
| description | TEXT | | Product description |
| badge | TEXT | | Promotional badge |
| is_in_stock | BOOLEAN | DEFAULT TRUE | Availability |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Listing date |

---

### 8. services

Veterinary and grooming service listings.

```sql
CREATE TABLE public.services (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Service ID |
| vendor_id | UUID | FK to vendors | Provider reference |
| title | TEXT | NOT NULL | Service name |
| category | TEXT | NOT NULL | Service category |
| provider | TEXT | NOT NULL | Provider name |
| price | NUMERIC(10,2) | NOT NULL | Service price |
| price_formatted | TEXT | | Formatted display |
| rating | NUMERIC(2,1) | DEFAULT 4.9 | Average rating |
| duration | TEXT | | Service duration |
| icon | TEXT | | Icon identifier |
| description | TEXT | | Service description |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Listing date |

---

### 9. bookings

Service appointment bookings.

```sql
CREATE TABLE public.bookings (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Booking ID |
| user_id | UUID | FK to auth.users | Customer reference |
| service_id | UUID | FK to services | Service reference |
| service_name | TEXT | | Cached service name |
| pet_id | UUID | FK to pets | Pet reference |
| pet_name | TEXT | | Cached pet name |
| date | DATE | NOT NULL | Appointment date |
| time_slot | TEXT | NOT NULL | Time slot |
| address | TEXT | | Service location |
| notes | TEXT | | Special instructions |
| price_formatted | TEXT | | Price display |
| status | TEXT | DEFAULT 'Confirmed' | Booking status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Booking timestamp |

---

### 10. orders

Product purchase orders.

```sql
CREATE TABLE public.orders (
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
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Order ID |
| user_id | UUID | FK to auth.users | Customer reference |
| pet_name | TEXT | | Pet name for context |
| total_price | TEXT | | Formatted total |
| shipping_address | TEXT | | Delivery address |
| phone | TEXT | | Contact number |
| status | TEXT | DEFAULT 'Processing' | Order status |
| payment_id | TEXT | | Razorpay payment ID |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Order timestamp |

---

## Firebase Firestore Collections

### users

```javascript
{
  uid: string,
  email: string | null,
  phone: string | null,
  displayName: string | null,
  photoURL: string | null,
  role: 'pet_owner' | 'vendor' | 'admin',
  createdAt: Timestamp,
  settings: {
    whatsappEnabled: boolean,
    smsEnabled: boolean,
    emailNotifications: boolean
  }
}
```

### pets (Firestore mirror for real-time features)

```javascript
{
  ownerId: string,
  name: string,
  species: string,
  breed: string,
  slug: string,
  isLost: boolean,
  sosActivatedAt: Timestamp | null,
  lastScanLocation: GeoPoint | null,
  lastScannedAt: Timestamp | null
}
```

### sightings

```javascript
{
  petId: string,
  reportedBy: string | null,
  location: GeoPoint,
  address: string,
  photoURL: string | null,
  notes: string,
  status: 'pending' | 'approved' | 'flagged',
  createdAt: Timestamp
}
```

### sessions (for observability)

```javascript
{
  userId: string,
  device: string,
  ip: string,
  loginAt: Timestamp,
  logoutAt: Timestamp | null,
  isActive: boolean
}
```

---

## TypeScript Interfaces

```typescript
// src/types.ts

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  createdAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

export interface Vaccination {
  id: string;
  name: string;
  due: string;
  done: boolean;
  type: 'vaccine' | 'deworm' | 'medicine' | 'checkup';
}

export interface Pet {
  id: string;
  slug: string; // e.g., PG-BUDDY-8821
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  weight: string;
  color: string;
  photoUrl: string;
  microchipId?: string;
  allergies: string;
  conditions: string;
  isLost: boolean;
  emergencyContact: EmergencyContact;
  vaccinations: Vaccination[];
  createdAt?: string;
}

export interface SightingReport {
  id: string;
  petId: string;
  petName: string;
  location: string;
  time: string;
  note: string;
  status: 'Pending' | 'Approved' | 'Flagged';
  image?: string;
  phone?: string;
  gpsCoords?: { lat: number; lng: number };
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Safety & Tags' | 'Food & Care' | 'Accessories' | 'Toys & Health';
  price: number;
  priceFormatted: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  features: string[];
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  priceFormatted: string;
  duration: string;
  rating: number;
  image: string;
  description: string;
  includes: string[];
}

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  petId: string;
  petName: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
  priceFormatted: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  petName: string;
  totalPrice: string;
  shippingAddress: string;
  phone: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentId?: string;
  createdAt?: string;
}
```

---

## Data Access Patterns

### Common Queries

```sql
-- Get all pets for a user
SELECT * FROM pets WHERE owner_id = $1;

-- Get public pet profile by slug
SELECT * FROM pet_public_profiles WHERE slug = $1;

-- Find lost pets in area
SELECT * FROM pets WHERE is_lost = true AND created_at > NOW() - INTERVAL '7 days';

-- Get products by category
SELECT * FROM products WHERE category = $1 AND is_in_stock = true;

-- Get upcoming bookings for a user
SELECT * FROM bookings WHERE user_id = $1 AND date >= CURRENT_DATE;

-- Get order history
SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;
```

### Row Level Security (RLS) Policies

```sql
-- Pets: Public read, owner write
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view pets"
  ON pets FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert their pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their pets"
  ON pets FOR UPDATE
  USING (auth.uid() = owner_id);

-- Orders: Owner only
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## Migration History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-08-11 | Initial schema creation |

See: `/supabase/migrations/20260811000000_init_schema.sql`

---

## Appendix

### Related Documents
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [ROADMAP.md](./ROADMAP.md) - Development timeline

### External Resources
- [Supabase Schema Guide](https://supabase.com/docs/guides/database)
- [Firebase Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
