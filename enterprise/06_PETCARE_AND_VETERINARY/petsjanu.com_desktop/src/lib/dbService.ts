import { supabase, isSupabaseConfigured } from './supabase';
import { Pet, Product, Service, Order, ServiceBooking, SightingReport } from '../types';
import { SEEDED_PETS, SEEDED_PRODUCTS, SEEDED_SERVICES, SEEDED_ORDERS, SEEDED_BOOKINGS, SEEDED_SIGHTINGS } from './mockData';

const STORAGE_KEY_PETS = 'petsjanu_pets';
const STORAGE_KEY_ORDERS = 'petsjanu_orders';
const STORAGE_KEY_BOOKINGS = 'petsjanu_bookings';
const STORAGE_KEY_SIGHTINGS = 'petsjanu_sightings';

// Helper to handle local storage persistence as fallback
function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
}

// -------------------------------------------------------------
// PETS DATABASE SERVICE
// -------------------------------------------------------------

export async function fetchPetsFromDb(userId?: string): Promise<Pet[]> {
  if (!isSupabaseConfigured()) {
    return getLocalStorage<Pet[]>(STORAGE_KEY_PETS, SEEDED_PETS);
  }

  try {
    let query = supabase.from('pets').select('*');
    if (userId) {
      query = query.eq('owner_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalStorage<Pet[]>(STORAGE_KEY_PETS, SEEDED_PETS);
    }

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      species: row.species,
      breed: row.breed,
      age: row.age || '2 years',
      gender: row.gender || 'Male',
      weight: row.weight || '12 kg',
      color: row.color || 'Golden',
      photoUrl: row.photo_url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
      allergies: row.allergies || 'None',
      conditions: row.medical_notes || 'Healthy',
      isLost: row.is_lost || false,
      emergencyContact: row.emergency_contact || { name: 'Amit Sharma (Founder)', phone: '+91 63937 41171' },
      vaccinations: row.vaccinations || [],
      createdAt: row.created_at,
    }));
  } catch (e) {
    return getLocalStorage<Pet[]>(STORAGE_KEY_PETS, SEEDED_PETS);
  }
}

export async function savePetToDb(pet: Omit<Pet, 'id' | 'slug' | 'vaccinations'>, userId?: string): Promise<Pet> {
  const slug = `PG-${pet.name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newPet: Pet = {
    ...pet,
    id: `pet-${Date.now()}`,
    slug,
    vaccinations: [
      { id: `v-${Date.now()}`, name: 'Core Rabies Booster', due: 'Sep 15, 2026', done: false, type: 'vaccine' },
      { id: `v-${Date.now() + 1}`, name: 'Deworming Session', due: 'Jul 20, 2026', done: true, type: 'deworm' }
    ]
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('pets').insert({
        owner_id: userId || null,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        weight: pet.weight,
        photo_url: pet.photoUrl,
        allergies: pet.allergies,
        medical_notes: pet.conditions,
        is_lost: pet.isLost,
        slug,
        emergency_contact: pet.emergencyContact,
        vaccinations: newPet.vaccinations,
      });

      // Insert into public profile as well
      await supabase.from('pet_public_profiles').insert({
        slug,
        emergency_phone: pet.emergencyContact?.phone || '+91 63937 41171',
        is_masked_phone: true,
      });
    } catch (e) {
      console.warn('Supabase pet save error, using local storage:', e);
    }
  }

  const existing = getLocalStorage<Pet[]>(STORAGE_KEY_PETS, SEEDED_PETS);
  setLocalStorage(STORAGE_KEY_PETS, [newPet, ...existing]);
  return newPet;
}

export async function updatePetLostStatusInDb(petId: string, isLost: boolean): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('pets').update({ is_lost: isLost }).eq('id', petId);
    } catch (e) {
      console.warn('Supabase pet update lost status error:', e);
    }
  }

  const existing = getLocalStorage<Pet[]>(STORAGE_KEY_PETS, SEEDED_PETS);
  const updated = existing.map((p) => (p.id === petId ? { ...p, isLost } : p));
  setLocalStorage(STORAGE_KEY_PETS, updated);
  return isLost;
}

// -------------------------------------------------------------
// PRODUCTS & SERVICES DATABASE SERVICE
// -------------------------------------------------------------

export async function fetchProductsFromDb(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return SEEDED_PRODUCTS;
  }

  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) return SEEDED_PRODUCTS;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category as any,
      price: Number(row.price),
      priceFormatted: row.price_formatted || `₹${row.price}`,
      rating: Number(row.rating || 4.8),
      reviewsCount: row.reviews_count || 40,
      image: row.image,
      description: row.description || '',
      features: ['Smart QR', 'NFC Enabled', 'Waterproof'],
      inStock: row.is_in_stock ?? true,
      badge: row.badge,
    }));
  } catch (e) {
    return SEEDED_PRODUCTS;
  }
}

export async function fetchServicesFromDb(): Promise<Service[]> {
  if (!isSupabaseConfigured()) {
    return SEEDED_SERVICES;
  }

  try {
    const { data, error } = await supabase.from('services').select('*');
    if (error || !data || data.length === 0) return SEEDED_SERVICES;

    return data.map((row: any) => ({
      id: row.id,
      name: row.title,
      category: row.category,
      price: Number(row.price),
      priceFormatted: row.price_formatted || `₹${row.price}`,
      duration: row.duration || '30 mins',
      rating: Number(row.rating || 4.9),
      image: row.icon || 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600',
      description: row.description || '',
      includes: ['Comprehensive Checkup', 'Digital Prescription'],
    }));
  } catch (e) {
    return SEEDED_SERVICES;
  }
}

// -------------------------------------------------------------
// ORDERS & BOOKINGS DATABASE SERVICE
// -------------------------------------------------------------

export async function fetchOrdersFromDb(userId?: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) {
    return getLocalStorage<Order[]>(STORAGE_KEY_ORDERS, SEEDED_ORDERS);
  }

  try {
    let query = supabase.from('orders').select('*, order_items(*)');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalStorage<Order[]>(STORAGE_KEY_ORDERS, SEEDED_ORDERS);
    }

    return data.map((row: any) => ({
      id: row.id,
      petName: row.pet_name,
      items: row.order_items ? row.order_items.map((item: any) => ({
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price
      })) : [],
      totalPrice: row.total_price,
      shippingAddress: row.shipping_address,
      phone: row.phone,
      date: new Date(row.created_at).toLocaleDateString(),
      status: row.status as any,
      paymentId: row.payment_id,
    }));
  } catch (e) {
    return getLocalStorage<Order[]>(STORAGE_KEY_ORDERS, SEEDED_ORDERS);
  }
}

export async function createOrderInDb(order: Order, userId?: string): Promise<Order> {
  if (isSupabaseConfigured()) {
    try {
      const { data: orderData, error } = await supabase.from('orders').insert({
        user_id: userId || null,
        pet_name: order.petName,
        total_price: order.totalPrice,
        shipping_address: order.shippingAddress,
        phone: order.phone,
        status: order.status,
        payment_id: order.paymentId,
      }).select().single();

      if (orderData && order.items.length > 0) {
        await supabase.from('order_items').insert(
          order.items.map((item) => ({
            order_id: orderData.id,
            product_name: item.productName,
            quantity: item.quantity,
            price: item.price,
          }))
        );
      }
    } catch (e) {
      console.warn('Supabase create order error:', e);
    }
  }

  const existing = getLocalStorage<Order[]>(STORAGE_KEY_ORDERS, SEEDED_ORDERS);
  setLocalStorage(STORAGE_KEY_ORDERS, [order, ...existing]);
  return order;
}

export async function fetchBookingsFromDb(userId?: string): Promise<ServiceBooking[]> {
  if (!isSupabaseConfigured()) {
    return getLocalStorage<ServiceBooking[]>(STORAGE_KEY_BOOKINGS, SEEDED_BOOKINGS);
  }

  try {
    let query = supabase.from('bookings').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalStorage<ServiceBooking[]>(STORAGE_KEY_BOOKINGS, SEEDED_BOOKINGS);
    }

    return data.map((row: any) => ({
      id: row.id,
      serviceId: row.service_id,
      serviceName: row.service_name,
      petId: row.pet_id,
      petName: row.pet_name,
      date: row.date,
      timeSlot: row.time_slot,
      address: row.address,
      notes: row.notes,
      priceFormatted: row.price_formatted,
      status: row.status as any,
      createdAt: row.created_at,
    }));
  } catch (e) {
    return getLocalStorage<ServiceBooking[]>(STORAGE_KEY_BOOKINGS, SEEDED_BOOKINGS);
  }
}

export async function createBookingInDb(booking: ServiceBooking, userId?: string): Promise<ServiceBooking> {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('bookings').insert({
        user_id: userId || null,
        service_id: booking.serviceId || null,
        service_name: booking.serviceName,
        pet_id: booking.petId || null,
        pet_name: booking.petName,
        date: booking.date,
        time_slot: booking.timeSlot,
        address: booking.address,
        notes: booking.notes,
        price_formatted: booking.priceFormatted,
        status: booking.status,
      });
    } catch (e) {
      console.warn('Supabase create booking error:', e);
    }
  }

  const existing = getLocalStorage<ServiceBooking[]>(STORAGE_KEY_BOOKINGS, SEEDED_BOOKINGS);
  setLocalStorage(STORAGE_KEY_BOOKINGS, [booking, ...existing]);
  return booking;
}

// -------------------------------------------------------------
// SIGHTINGS DATABASE SERVICE
// -------------------------------------------------------------

export async function fetchSightingsFromDb(petId?: string): Promise<SightingReport[]> {
  if (!isSupabaseConfigured()) {
    return getLocalStorage<SightingReport[]>(STORAGE_KEY_SIGHTINGS, SEEDED_SIGHTINGS);
  }

  try {
    let query = supabase.from('sightings').select('*');
    if (petId) {
      query = query.eq('pet_id', petId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalStorage<SightingReport[]>(STORAGE_KEY_SIGHTINGS, SEEDED_SIGHTINGS);
    }

    return data.map((row: any) => ({
      id: row.id,
      petId: row.pet_id,
      petName: 'Buddy',
      location: row.location,
      time: row.time || 'Recently',
      note: row.note,
      status: row.status as any || 'Approved',
      phone: row.reporter_phone,
      createdAt: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  } catch (e) {
    return getLocalStorage<SightingReport[]>(STORAGE_KEY_SIGHTINGS, SEEDED_SIGHTINGS);
  }
}

export async function createSightingInDb(
  sighting: Omit<SightingReport, 'id' | 'petId' | 'petName' | 'status'> & { petId: string; petName: string }
): Promise<SightingReport> {
  const newSighting: SightingReport = {
    ...sighting,
    id: `sight-${Date.now()}`,
    status: 'Approved',
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('sightings').insert({
        pet_id: sighting.petId || null,
        reporter_name: 'Concerned Citizen',
        reporter_phone: sighting.phone,
        location: sighting.location,
        time: sighting.time,
        note: sighting.note,
        status: 'Approved',
      });
    } catch (e) {
      console.warn('Supabase create sighting error:', e);
    }
  }

  const existing = getLocalStorage<SightingReport[]>(STORAGE_KEY_SIGHTINGS, SEEDED_SIGHTINGS);
  setLocalStorage(STORAGE_KEY_SIGHTINGS, [newSighting, ...existing]);
  return newSighting;
}
