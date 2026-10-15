import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Pet, Order, SightingReport } from '../types';

// ============================================================================
// 1. FIRESTORE PET PROFILES
// ============================================================================
export async function getPetsFromFirestore(ownerId?: string): Promise<Pet[]> {
  try {
    const petsRef = collection(db, 'pets');
    let q = petsRef;
    if (ownerId) {
      q = query(petsRef, where('ownerId', '==', ownerId)) as any;
    }
    const snapshot = await getDocs(q);
    const pets: Pet[] = [];
    snapshot.forEach((docSnap) => {
      pets.push({ id: docSnap.id, ...docSnap.data() } as Pet);
    });
    return pets;
  } catch (err) {
    console.warn('[Firebase] Firestore read error for pets:', err);
    return [];
  }
}

export async function savePetToFirestore(petData: Omit<Pet, 'id' | 'slug' | 'vaccinations'>, ownerId?: string): Promise<Pet> {
  const newId = `pet_${Date.now()}`;
  const slug = `PG-${petData.name.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const createdPet: Pet = {
    ...petData,
    id: newId,
    slug,
    vaccinations: [
      { id: `v-${Date.now()}`, name: 'Core Rabies Booster', due: 'Sep 15, 2026', done: false, type: 'vaccine' },
      { id: `v-${Date.now() + 1}`, name: 'Deworming Session', due: 'Jul 20, 2026', done: true, type: 'deworm' }
    ]
  };

  try {
    const docRef = doc(db, 'pets', newId);
    await setDoc(docRef, {
      ...createdPet,
      ownerId: ownerId || 'guest_user',
      updatedAt: new Date().toISOString()
    });
    console.log('[Firebase] Saved pet to Firestore:', newId);
  } catch (err) {
    console.error('[Firebase] Firestore save pet error:', err);
  }

  return createdPet;
}

export async function updatePetLostStatusInFirestore(petId: string, isLost: boolean) {
  try {
    const docRef = doc(db, 'pets', petId);
    await updateDoc(docRef, { isLost, updatedAt: new Date().toISOString() });
    console.log(`[Firebase] Firestore pet ${petId} lost status set to ${isLost}`);
  } catch (err) {
    console.error('[Firebase] Firestore update lost status error:', err);
  }
}

// ============================================================================
// 2. FIRESTORE SIGHTINGS
// ============================================================================
export async function getSightingsFromFirestore(): Promise<SightingReport[]> {
  try {
    const sightingsRef = collection(db, 'sightings');
    const snapshot = await getDocs(query(sightingsRef, limit(20)));
    const reports: SightingReport[] = [];
    snapshot.forEach((docSnap) => {
      reports.push({ id: docSnap.id, ...docSnap.data() } as SightingReport);
    });
    return reports;
  } catch (err) {
    console.warn('[Firebase] Firestore read sightings error:', err);
    return [];
  }
}

export async function addSightingToFirestore(sighting: Omit<SightingReport, 'id' | 'status'> & { status?: 'Pending' | 'Approved' | 'Flagged' }) {
  const newId = `sight_${Date.now()}`;
  const fullReport: SightingReport = {
    ...sighting,
    id: newId,
    status: sighting.status || 'Approved'
  };

  try {
    await setDoc(doc(db, 'sightings', newId), {
      ...fullReport,
      createdAt: new Date().toISOString()
    });
    console.log('[Firebase] Added sighting to Firestore:', newId);
  } catch (err) {
    console.error('[Firebase] Firestore sighting error:', err);
  }

  return fullReport;
}

// ============================================================================
// 3. FIRESTORE ORDERS
// ============================================================================
export async function createOrderInFirestore(order: Order, userId?: string): Promise<Order> {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, {
      ...order,
      userId: userId || 'guest_user',
      createdAt: new Date().toISOString()
    });
    console.log('[Firebase] Firestore order created:', order.id);
  } catch (err) {
    console.error('[Firebase] Firestore order creation error:', err);
  }
  return order;
}

export async function getOrdersFromFirestore(userId?: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const snapshot = await getDocs(ordersRef);
    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });
    return orders;
  } catch (err) {
    console.warn('[Firebase] Firestore read orders error:', err);
    return [];
  }
}

// ============================================================================
// 4. BIGQUERY ANALYTICS STREAM LOGGER
// ============================================================================
export interface BigQueryAnalyticsLog {
  id: string;
  eventName: string;
  userId: string;
  platform: 'Android' | 'Web';
  params: Record<string, any>;
  timestamp: string;
}

export async function logBigQueryAnalyticsEvent(
  eventName: string,
  params: Record<string, any> = {},
  userId: string = 'user_android_731e'
): Promise<BigQueryAnalyticsLog> {
  const log: BigQueryAnalyticsLog = {
    id: `bq_log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    eventName,
    userId,
    platform: 'Android',
    params,
    timestamp: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'analytics_events', log.id), log);
    console.log(`[BigQuery Stream] Logged event '${eventName}' to Firebase Analytics pipeline`);
  } catch (err) {
    console.warn('[BigQuery Stream] Failed to send analytics log:', err);
  }

  return log;
}

export async function fetchBigQueryAnalyticsLogs(): Promise<BigQueryAnalyticsLog[]> {
  try {
    const colRef = collection(db, 'analytics_events');
    const snapshot = await getDocs(query(colRef, limit(30)));
    const logs: BigQueryAnalyticsLog[] = [];
    snapshot.forEach((docSnap) => {
      logs.push(docSnap.data() as BigQueryAnalyticsLog);
    });
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    return [];
  }
}

// ============================================================================
// 5. GOOGLE PLAY BILLING TRANSACTIONS
// ============================================================================
export interface GooglePlayReceipt {
  purchaseToken: string;
  orderId: string;
  productId: string;
  packageName: string;
  purchaseTime: string;
  purchaseState: 'PURCHASED' | 'PENDING' | 'CANCELLED';
  userId: string;
  amount: number;
  currency: string;
}

export async function processGooglePlayBillingPurchase(
  productId: string,
  amount: number,
  userId: string = 'android_user_101'
): Promise<GooglePlayReceipt> {
  const purchaseToken = `gplay_token_${Math.random().toString(36).substring(2, 14)}`;
  const orderId = `GPA.${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const receipt: GooglePlayReceipt = {
    purchaseToken,
    orderId,
    productId,
    packageName: 'com.petguardian.app',
    purchaseTime: new Date().toISOString(),
    purchaseState: 'PURCHASED',
    userId,
    amount,
    currency: 'INR'
  };

  try {
    await setDoc(doc(db, 'play_billing_transactions', orderId), receipt);
    await logBigQueryAnalyticsEvent('in_app_purchase_success', {
      orderId,
      productId,
      amount,
      gateway: 'Google Play Billing'
    }, userId);
  } catch (err) {
    console.warn('[Google Play Billing] Firestore sync error:', err);
  }

  return receipt;
}

export async function fetchPlayBillingTransactions(): Promise<GooglePlayReceipt[]> {
  try {
    const colRef = collection(db, 'play_billing_transactions');
    const snapshot = await getDocs(query(colRef, limit(20)));
    const txs: GooglePlayReceipt[] = [];
    snapshot.forEach((docSnap) => {
      txs.push(docSnap.data() as GooglePlayReceipt);
    });
    return txs;
  } catch (err) {
    return [];
  }
}
