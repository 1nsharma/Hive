import { Product, Service, Pet, Order, ServiceBooking, SightingReport } from '../types';

export const SEEDED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Smart Brass QR & NFC Pet Tag',
    category: 'Safety & Tags',
    price: 499,
    priceFormatted: '₹499',
    rating: 4.9,
    reviewsCount: 328,
    image: '/assets/smart-qr-tag.png',
    description: 'Aircraft-grade solid brass tag with laser-etched QR code and embedded NFC chip. No subscription fees required.',
    features: ['Laser-etched QR + NFC Chip', 'Waterproof & Scratch Resistant', 'Instant SMS/WhatsApp Notification on Scan', 'Free Lifetime Cloud Hosting'],
    inStock: true,
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-2',
    name: 'Guardian Live GPS Tracker Collar',
    category: 'Safety & Tags',
    price: 2499,
    priceFormatted: '₹2,499',
    rating: 4.8,
    reviewsCount: 194,
    image: '/assets/gps-tracker.png',
    description: 'Lightweight real-time GPS & cellular tracker with geofence escape alerts and activity monitoring.',
    features: ['Live GPS Pinpoint Tracking', 'Custom Virtual Safe Zones', '10-Day Battery Life', 'IP67 Submersible Waterproof'],
    inStock: true,
    badge: 'SMART TECH'
  },
  {
    id: 'prod-3',
    name: 'WildSalmon Organic Grain-Free Kibble (3kg)',
    category: 'Food & Care',
    price: 899,
    priceFormatted: '₹899',
    rating: 4.9,
    reviewsCount: 412,
    image: '/assets/salmon-kibble.png',
    description: 'Premium wild salmon & sweet potato recipe formulated for optimal coat shine, joint care, and easy digestion.',
    features: ['70% Fresh Salmon & Whole Fish', 'Zero Artificial Preservatives', 'Rich in Omega-3 & Joint Glucosamine', 'Suitable for All Breeds'],
    inStock: true
  },
  {
    id: 'prod-4',
    name: 'EcoClean Natural Odor-Control Cat Litter (6L)',
    category: 'Food & Care',
    price: 499,
    priceFormatted: '₹499',
    rating: 4.7,
    reviewsCount: 280,
    image: '/assets/cat-litter.png',
    description: '100% biodegradable pea husk cat litter with instant tight clumping and activated carbon odor control.',
    features: ['Instant 3-Second Clumping', '99.9% Dust Free & Paw Friendly', 'Flushable & Compostable', 'Natural Green Tea Scent'],
    inStock: true
  },
  {
    id: 'prod-5',
    name: 'CloudRest Orthopedic Memory Foam Bed',
    category: 'Accessories',
    price: 1799,
    priceFormatted: '₹1,799',
    rating: 4.9,
    reviewsCount: 156,
    image: '/assets/orthopedic-bed.png',
    description: 'High-density orthopedic memory foam lounge bed designed to soothe aging joints and promote restorative sleep.',
    features: ['Medical Grade Memory Foam', 'Removable Washable Velvet Cover', 'Waterproof Inner Protective Lining', 'Non-Skid Anti-Slip Base'],
    inStock: true,
    badge: 'LUXURY'
  },
  {
    id: 'prod-6',
    name: 'Herbal Dental Care Chew Sticks (10 Pack)',
    category: 'Toys & Health',
    price: 299,
    priceFormatted: '₹299',
    rating: 4.6,
    reviewsCount: 220,
    image: '/assets/chew-sticks.png',
    description: 'Natural mint & parsley dental chews that reduce tartar buildup by up to 80% and freshen dog breath.',
    features: ['Unique Grooved Tartar Scraper', 'Infused with Parsley & Peppermint', '100% Grain-Free & Easily Digestible', 'Vet Approved Dental Solution'],
    inStock: true
  },
  {
    id: 'prod-7',
    name: 'Ergonomic Pet Grooming & Deshedding Kit',
    category: 'Accessories',
    price: 699,
    priceFormatted: '₹699',
    rating: 4.8,
    reviewsCount: 189,
    image: '/assets/grooming-kit.png',
    description: 'Professional 5-in-1 grooming set featuring self-cleaning slicker brush, deshedding comb, and nail trimmer with LED.',
    features: ['Self-Cleaning Hair Release Button', 'Gentle Stainless Steel Pins with Rubber Tips', 'LED Quick-Finder Nail Clipper', 'Ergonomic Anti-Slip Handle'],
    inStock: true
  },
  {
    id: 'prod-8',
    name: 'Interactive Smart Motion Laser Toy',
    category: 'Toys & Health',
    price: 799,
    priceFormatted: '₹799',
    rating: 4.7,
    reviewsCount: 145,
    image: '/assets/laser-toy.png',
    description: 'Automated 360-degree rotating laser toy with unpredictable movement paths to keep indoor cats active and engaged.',
    features: ['3 Automatic Speed Modes', '15-Minute Auto Shut-Off Timer', 'Silent Whisper-Quiet Motor', 'USB Type-C Rechargeable'],
    inStock: true,
    badge: 'NEW'
  }
];

export const SEEDED_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'On-Demand Vet Tele-Consultation',
    category: 'Medical & Health',
    price: 599,
    priceFormatted: '₹599',
    duration: '30 mins',
    rating: 4.9,
    image: '/assets/vet-teleconsult.png',
    description: 'Instant video consultation with licensed senior veterinarians for general checkups, skin conditions, diet advice, or prescription reviews.',
    includes: ['Live 1-on-1 Video Consultation', 'Digital Prescription & Clinical Notes', 'Follow-up Chat Support for 7 Days', 'Health History Sync']
  },
  {
    id: 'srv-2',
    name: 'Professional Dog Walking & Exercise',
    category: 'Care & Fitness',
    price: 299,
    priceFormatted: '₹299',
    duration: '45 mins',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
    description: 'Vetted, GPS-tracked dog walkers who provide invigorating outdoor exercise, hydration, and paw cleanups.',
    includes: ['Live GPS Route Tracking in App', 'Pee & Poop Route Updates', 'Fresh Water & Paw Wipe Service', 'Post-Walk Photo Report']
  },
  {
    id: 'srv-3',
    name: 'Complete Pet Grooming & Spa Package',
    category: 'Grooming',
    price: 999,
    priceFormatted: '₹999',
    duration: '90 mins',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    description: 'Full-service grooming session including organic bath, blow-dry, nail clipping, ear cleaning, and hygienic coat trimming.',
    includes: ['Organic Herbal Shampoo & Conditioner', 'Nail Trimming & Filing', 'Ear Cleaning & Hair Plucking', 'Sanitary Trim & Fragrance Spritz']
  },
  {
    id: 'srv-4',
    name: 'Verified In-Home Pet Boarding & Sitting',
    category: 'Boarding & Sitting',
    price: 799,
    priceFormatted: '₹799 / day',
    duration: '24 hours',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=600',
    description: 'Homelike, cage-free boarding with background-checked host families who offer 24/7 love, feeding, and play time.',
    includes: ['Cage-Free Home Environment', '24/7 Photo & Video Updates', 'Custom Diet & Medication Schedule', 'Emergency Vet Insurance Included']
  },
  {
    id: 'srv-5',
    name: 'Positive Reinforcement Behavioral Training',
    category: 'Training',
    price: 1299,
    priceFormatted: '₹1,299',
    duration: '60 mins',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600',
    description: 'One-on-one session with certified animal behaviorists focusing on leash pulling, housebreaking, separation anxiety, or recall commands.',
    includes: ['Personalized Behavioral Assessment', 'Force-Free Positive Clicker Training', 'Customized Action Plan PDF', '2-Week Trainer Q&A Support']
  }
];

export const SEEDED_PETS: Pet[] = [
  {
    id: 'pet-1',
    slug: 'PG-BUDDY-8821',
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    weight: '28 kg',
    color: 'Golden Cream',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    microchipId: '98514100238194',
    allergies: 'Chicken protein, Wheat gluten',
    conditions: 'Mild hip joint sensitivity',
    isLost: false,
    emergencyContact: {
      name: 'Amit Sharma',
      phone: '+91 63937 41171',
      relationship: 'Primary Parent'
    },
    vaccinations: [
      { id: 'v-1', name: 'Rabies Annual Booster', due: 'Sep 15, 2026', done: false, type: 'vaccine' },
      { id: 'v-2', name: 'DHPP Core Vaccine', due: 'Aug 20, 2026', done: false, type: 'vaccine' },
      { id: 'v-3', name: 'Deworming (Drontal Plus)', due: 'Jun 01, 2026', done: true, type: 'deworm' },
      { id: 'v-4', name: 'Heartworm Monthly Pill', due: 'Aug 10, 2026', done: false, type: 'medicine' }
    ]
  },
  {
    id: 'pet-2',
    slug: 'PG-LUNA-9924',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian White',
    age: '1.5 years',
    gender: 'Female',
    weight: '4.2 kg',
    color: 'Snow White & Amber',
    photoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    microchipId: '98514100918231',
    allergies: 'None declared',
    conditions: 'Sensitive stomach',
    isLost: true,
    emergencyContact: {
      name: 'Aditi Roy',
      phone: '+91 91234 56789',
      relationship: 'Cat Mom'
    },
    vaccinations: [
      { id: 'v-5', name: 'Feline Rabies Booster', due: 'Dec 10, 2026', done: false, type: 'vaccine' },
      { id: 'v-6', name: 'FVRCP Tri-booster', due: 'Aug 02, 2026', done: true, type: 'vaccine' }
    ]
  }
];

export const SEEDED_ORDERS: Order[] = [
  {
    id: 'ORD-8821',
    petName: 'Buddy',
    items: [
      { productName: 'Smart Brass QR & NFC Pet Tag', quantity: 1, price: '₹499' },
      { productName: 'WildSalmon Organic Grain-Free Kibble (3kg)', quantity: 1, price: '₹899' }
    ],
    totalPrice: '₹1,398',
    shippingAddress: '402 Sunset Heights, Bandra West, Mumbai 400050',
    phone: '+91 63937 41171',
    date: 'Aug 04, 2026',
    status: 'Shipped',
    paymentId: 'pay_PZ891230491'
  },
  {
    id: 'ORD-9914',
    petName: 'Luna',
    items: [
      { productName: 'EcoClean Natural Odor-Control Cat Litter (6L)', quantity: 2, price: '₹998' }
    ],
    totalPrice: '₹998',
    shippingAddress: '12-A Green Park, New Delhi 110016',
    phone: '+91 91234 56789',
    date: 'Aug 01, 2026',
    status: 'Delivered',
    paymentId: 'pay_PZ119823481'
  }
];

export const SEEDED_BOOKINGS: ServiceBooking[] = [
  {
    id: 'BKG-4019',
    serviceId: 'srv-1',
    serviceName: 'On-Demand Vet Tele-Consultation',
    petId: 'pet-1',
    petName: 'Buddy',
    date: 'Aug 14, 2026',
    timeSlot: '04:00 PM - 04:30 PM',
    address: 'Online Video Call',
    notes: 'Checking joint stiffness after morning runs.',
    priceFormatted: '₹599',
    status: 'Confirmed',
    createdAt: '2026-08-08T10:00:00Z'
  },
  {
    id: 'BKG-3102',
    serviceId: 'srv-3',
    serviceName: 'Complete Pet Grooming & Spa Package',
    petId: 'pet-2',
    petName: 'Luna',
    date: 'Jul 28, 2026',
    timeSlot: '11:00 AM - 12:30 PM',
    address: '12-A Green Park, New Delhi',
    notes: 'Please use extra gentle coat conditioner.',
    priceFormatted: '₹999',
    status: 'Completed',
    createdAt: '2026-07-25T14:30:00Z'
  }
];

export const SEEDED_SIGHTINGS: SightingReport[] = [
  {
    id: 'sight-1',
    petId: 'pet-2',
    petName: 'Luna',
    location: 'Bandra Promenade near CCD, Mumbai',
    time: '2 hours ago',
    note: 'Spotted sitting under a green bench. She is wearing a green smart tag.',
    status: 'Approved',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
    phone: '+91 98700 11223',
    createdAt: '2026-08-11T07:30:00Z'
  },
  {
    id: 'sight-2',
    petId: 'pet-2',
    petName: 'Luna',
    location: 'Carter Road Park Gate, Mumbai',
    time: 'Yesterday, 06:30 PM',
    note: 'Running along the flower bed wall toward the main exit.',
    status: 'Approved',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&q=80&w=300',
    phone: '+91 99112 23344',
    createdAt: '2026-08-10T18:30:00Z'
  }
];
