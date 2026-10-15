import crypto from "crypto";

export type PublicPetProfile = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  photoUrl?: string | null;
  isLost: boolean;
  medicalSummary?: string | null;
  tagSlug?: string;
  contact: {
    mode: "secure_relay";
    message: string;
    isOwnerMasked: boolean;
    maskedPhone?: string | null;
    whatsappEnabled: boolean;
    whatsappNumber?: string | null;
  };
};

export function maskPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) {
    return "••••••••";
  }
  return `•••-•••-${digits.slice(-4)}`;
}

export function maskEmail(email?: string | null): string | null {
  if (!email) return null;
  const [local, domain] = email.split("@");
  if (!domain || local.length === 0) {
    return "•••@private.petjanu.in";
  }
  const visibleLocal = local.slice(0, 1);
  return `${visibleLocal}•••@${domain}`;
}

const PII_EMAIL_REGEX = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const PII_PHONE_REGEX = /(\+?\d[\d\s\-().]{7,}\d)/g;
const PII_ADDRESS_REGEX = /\b\d{1,5}\s+[\w\s]{2,30}(?:street|st|avenue|ave|road|rd|lane|ln|drive|dr|nagar|colony|sector|block|floor|apartment|apt)\b/gi;

export function safeMedicalSummary(
  notes?: string | null,
  maxLength = 300
): string | null {
  if (!notes) return null;

  const cleaned = notes
    .replace(PII_EMAIL_REGEX, "[EMAIL_REDACTED]")
    .replace(PII_PHONE_REGEX, "[PHONE_REDACTED]")
    .replace(PII_ADDRESS_REGEX, "[LOCATION_REDACTED]")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

export function toPublicPetProfile(row: {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  photoUrl?: string | null;
  photo_url?: string | null;
  isLost?: boolean;
  is_lost?: boolean;
  medicalNotes?: string | null;
  medical_notes?: string | null;
  ownerPhone?: string | null;
  owner_phone?: string | null;
  tagSlug?: string;
  tag_slug?: string;
  whatsappEnabled?: boolean;
  whatsapp_enabled?: boolean;
  whatsappNumber?: string | null;
  whatsapp_number?: string | null;
}): PublicPetProfile {
  const isLost = row.isLost !== undefined ? row.isLost : (row.is_lost || false);
  const notes = row.medicalNotes || row.medical_notes;
  const phone = row.ownerPhone || row.owner_phone;
  const photo = row.photoUrl || row.photo_url;
  const slug = row.tagSlug || row.tag_slug;

  const waOptIn = row.whatsappEnabled !== undefined 
    ? Boolean(row.whatsappEnabled) 
    : Boolean(row.whatsapp_enabled);

  const rawWaNumber = row.whatsappNumber || row.whatsapp_number || phone;

  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    age: row.age,
    photoUrl: photo ?? null,
    isLost: Boolean(isLost),
    medicalSummary: safeMedicalSummary(notes),
    tagSlug: slug,
    contact: {
      mode: "secure_relay",
      message: "Owner contact details are strictly protected. Send a free, secure emergency contact request or scan ping.",
      isOwnerMasked: true,
      maskedPhone: maskPhone(phone),
      whatsappEnabled: waOptIn && Boolean(rawWaNumber),
      whatsappNumber: waOptIn && rawWaNumber ? rawWaNumber : null,
    },
  };
}

// In-Memory Rate Limiter (Production uses Redis/Token bucket)
type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

export function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
    };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: limit - bucket.count,
  };
}

export function hashSha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export interface SecureContactToken {
  id: string;
  petId: string;
  tokenHash: string;
  purpose: string;
  expiresAt: string;
  maxUses: number;
  useCount: number;
  createdAt: string;
}

export interface ScanEvent {
  id: string;
  petId: string;
  lat?: number | null;
  lng?: number | null;
  area?: string | null;
  source: "geolocation" | "manual";
  accuracyM?: number | null;
  ipHash: string;
  createdAt: string;
}

export const scanEventsStore: ScanEvent[] = [];

// Daily retention cleaner: retains events within 30 days
export function cleanOldScanEvents(maxAgeDays = 30) {
  const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
  const initialCount = scanEventsStore.length;
  for (let i = scanEventsStore.length - 1; i >= 0; i--) {
    if (new Date(scanEventsStore[i].createdAt).getTime() < cutoff) {
      scanEventsStore.splice(i, 1);
    }
  }
  return initialCount - scanEventsStore.length;
}

export const GLOBAL_PETS_REGISTRY = [
  {
    id: "pet-1",
    name: "Milo",
    breed: "Golden Retriever",
    species: "Dog",
    age: "3 years",
    color: "Golden / Honey",
    gender: "Male",
    weight: "28 kg",
    allergies: "Chicken protein & artificial dyes",
    conditions: "Seasonal dermatological allergies",
    medicalNotes: "Sensitive stomach. On hypoallergenic salmon diet. Doctor: Dr. Sharma, Bandra Vet Clinic +91 98200 11223.",
    isLost: true,
    publicSearchable: true,
    slug: "PG-MILO-8821",
    lastSeen: "Bandra Carter Road, Mumbai",
    ownerPhone: "+91 63937 41171",
    ownerEmail: "amit.sharma@example.com",
    whatsappEnabled: true, // Owner opted in for emergency WhatsApp direct fallback
    whatsappNumber: "+91 63937 41171",
    photoUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400",
    microchipId: "985141002981041"
  },
  {
    id: "pet-2",
    name: "Bella",
    breed: "Indie / Desi Dog",
    species: "Dog",
    age: "2 years",
    color: "Brown & White",
    gender: "Female",
    weight: "16 kg",
    allergies: "None known",
    conditions: "Healthy, fully vaccinated (Rabies + DHPPiL)",
    medicalNotes: "Annual rabies vaccination due Oct 2026. Routine checkup OK.",
    isLost: false,
    publicSearchable: true,
    slug: "PG-BELL-4109",
    lastSeen: "Koramangala 4th Block, Bengaluru",
    ownerPhone: "+91 98111 22233",
    ownerEmail: "bella.parent@example.com",
    whatsappEnabled: false, // Default OFF = privacy first
    whatsappNumber: null,
    photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
    microchipId: "985141004419208"
  },
  {
    id: "pet-3",
    name: "Whiskers",
    breed: "Persian Cat",
    species: "Cat",
    age: "1.5 years",
    color: "White & Cream",
    gender: "Female",
    weight: "4.2 kg",
    allergies: "Dust & aerosol sprays",
    conditions: "Indoor only. Sensitive eyes.",
    medicalNotes: "Needs tear stain wipes daily. In case of emergency, contact Connaught Place Vet Hospital.",
    isLost: true,
    publicSearchable: true,
    slug: "PG-WHIS-2914",
    lastSeen: "Connaught Place, New Delhi",
    ownerPhone: "+91 98765 43210",
    ownerEmail: "delhi.catparent@example.com",
    whatsappEnabled: true,
    whatsappNumber: "+91 98765 43210",
    photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400",
    microchipId: "985141008819002"
  }
];

export const contactTokenStore = new Map<string, SecureContactToken>();
export const contactLogsStore: Array<{
  id: string;
  petId: string;
  ipHash: string;
  reason: string;
  finderPhoneMasked?: string;
  createdAt: string;
}> = [];
