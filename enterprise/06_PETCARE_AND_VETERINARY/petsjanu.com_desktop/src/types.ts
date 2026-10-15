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
  species: string; // Dog, Cat, Bird, etc.
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
  price: number; // in INR / USD equivalent
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
  createdAt: string;
}

export interface Order {
  id: string;
  petName?: string;
  items: { productName: string; quantity: number; price: string }[];
  totalPrice: string;
  shippingAddress: string;
  phone: string;
  date: string;
  status: 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Failed';
  paymentId?: string;
}

export interface TriageReport {
  riskLevel: 'LOW' | 'MONITOR' | 'VET RECOMMENDED' | 'URGENT';
  indicator: string;
  immediateSteps: string[];
  why: string;
  watchFor: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  triage?: TriageReport;
  timestamp: string;
}

