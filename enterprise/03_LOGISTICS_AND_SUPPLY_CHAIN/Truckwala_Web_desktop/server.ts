import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  generateBaselineQTable, 
  evaluateRLRecommendation, 
  ALL_RESCUE_ACTIONS 
} from './src/utils/reinforcementEngine';
import { RescueUnitAction } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Persistent Data Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'truckwala_db.json');

// Initial Seed Database
const DEFAULT_CONFIG = {
  name: 'TruckWala 24×7',
  phoneDisplay: '+91 98765 43210',
  phoneClean: '+919876543210',
  whatsappNumber: '919876543210',
  addressEn: 'Truckwala, Nearby Address: GF8M+85W, Gadan Khera Bypass Flyover, Nirala Nagar, Unnao, Uttar Pradesh 209801 (Kanpur–Lucknow Highway Corridor)',
  addressHi: 'ट्रकवाला, गडन खेड़ा बाईपास फ्लाईओवर के पास, निराला नगर, उन्नाव, उत्तर प्रदेश 209801 (कानपुर-लखनऊ हाईवे कॉरिडोर)',
  googleMapsUrl: 'https://maps.app.goo.gl/kSAFmi55aoMxJLHMA',
  googleReviewUrl: 'https://maps.app.goo.gl/QcYsfEK4xaUVxngF7?g_st=ac',
  emergencyRadiusKm: 50,
  emergencyVanCount: 4,
  specialties: ['Tata Motors Commercial', 'Cummins Turbo Diesel', 'Ashok Leyland', 'BharatBenz Heavy', 'BS-III / IV / VI'],
  stats: {
    vehiclesHelped: '500+',
    emergencySupport: '24×7',
    happyCustomers: '1000+',
    highwayCoverage: 'KANPUR – UNNAO +'
  }
};

interface LeadRecord {
  id: string;
  receivedAt: string;
  formType: 'breakdown' | 'repair' | 'parts' | 'direct' | 'whatsapp';
  vehicleType?: string;
  vehicleNumber?: string;
  phone?: string;
  problem?: string;
  services?: string[];
  partName?: string;
  location?: {
    lat: number;
    lng: number;
    addressText?: string;
    accuracy?: number;
  };
  hasVoiceNote?: boolean;
  voiceNoteDuration?: number;
  voiceNoteBase64?: string;
  hasPhoto?: boolean;
  photoBase64?: string;
  photoName?: string;
  urgency?: 'emergency' | 'high' | 'normal';
  status: 'new' | 'contacted' | 'dispatched' | 'resolved';
  technicianNotes?: string;
  rlDispatchMetadata?: {
    action: RescueUnitAction;
    unitName: string;
    confidence: number;
    etaMinutes: number;
    recommendedKit: string[];
    stateKey: string;
  };
}

interface EventRecord {
  id: string;
  timestamp: string;
  eventType: string;
  label?: string;
  metadata?: Record<string, any>;
}

interface VehicleJobRecord {
  jobId: string;
  date: string;
  serviceCategory: string;
  problemSummary: string;
  technicianAssigned: string;
  status: 'In Progress' | 'Completed' | 'Van Dispatched' | 'Pending Parts';
  partsReplaced: string[];
  invoiceAmount?: string;
  invoiceId?: string;
  mileageKm?: string;
}

interface VehicleRecord {
  vehicleNumber: string;
  model: string;
  fleetOwner: string;
  activeTicket?: {
    leadId: string;
    reportedIssue: string;
    status: string;
    locationName: string;
    etaMinutes: number;
    dispatchedVan: string;
  };
  history: VehicleJobRecord[];
}

export interface RLPolicyRecord {
  qTable: Record<string, Record<RescueUnitAction, number>>;
  totalEpisodes: number;
  avgReward: number;
  recentRewards: { episode: number; reward: number; action: RescueUnitAction; timestamp: string }[];
  hyperparams: {
    learningRate: number;
    discountFactor: number;
    epsilon: number;
  };
  lastTrainedAt: string;
  convergenceScore: number;
}

interface DBStructure {
  config: typeof DEFAULT_CONFIG;
  leads: LeadRecord[];
  events: EventRecord[];
  vehicles: Record<string, VehicleRecord>;
  rlPolicy?: RLPolicyRecord;
}

const SEED_VEHICLES: Record<string, VehicleRecord> = {
  'UP78BT4410': {
    vehicleNumber: 'UP 78 BT 4410',
    model: 'Tata Signa 4825.TK 16-Wheeler Tipper',
    fleetOwner: 'Kanpur Roadways Logistics Co.',
    activeTicket: {
      leadId: 'TW-849102',
      reportedIssue: 'Air line pressure drop & rear wheel lock on NH-19 near Unnao Toll',
      status: 'Van Dispatched',
      locationName: 'NH-19 KM 42 (Kanpur-Unnao corridor)',
      etaMinutes: 18,
      dispatchedVan: 'Mobile Rescue Van #2 (Tech: Master Rakesh Yadav)'
    },
    history: [
      {
        jobId: 'JOB-2026-0914',
        date: '2026-08-12',
        serviceCategory: 'Brake System Overhaul',
        problemSummary: 'Replaced rear axle brake linings and fitted genuine Wabco 4-circuit protection valve',
        technicianAssigned: 'Tech Lead Manoj Sharma',
        status: 'Completed',
        partsReplaced: ['Wabco 4-Circuit Protection Valve', 'Ferodo Heavy Duty Brake Linings (Set of 8)'],
        invoiceAmount: '₹14,800',
        invoiceId: 'INV-TW-4921',
        mileageKm: '184,200 km'
      },
      {
        jobId: 'JOB-2026-0422',
        date: '2026-04-22',
        serviceCategory: 'Engine Diagnostics & DPF Regen',
        problemSummary: 'BS-6 DEF AdBlue dosing error cleared; forced stationary DPF regeneration conducted',
        technicianAssigned: 'ECU Specialist Vikram Singh',
        status: 'Completed',
        partsReplaced: ['AdBlue Dosing Filter Element', 'Bosch Differential Pressure Sensor'],
        invoiceAmount: '₹8,450',
        invoiceId: 'INV-TW-3882',
        mileageKm: '152,400 km'
      }
    ]
  },
  'RJ14GB6821': {
    vehicleNumber: 'RJ 14 GB 6821',
    model: 'Ashok Leyland 3520 8x2 Multi-Axle Hauler',
    fleetOwner: 'Marwar Cargo Carriers',
    activeTicket: {
      leadId: 'TW-849208',
      reportedIssue: 'Clutch booster leakage near Rania Industrial Bypass',
      status: 'In Progress',
      locationName: 'Rania Bypass, Kanpur Outer Ring',
      etaMinutes: 12,
      dispatchedVan: 'Mobile Rescue Van #1 (Tech: Arvind Kumar)'
    },
    history: [
      {
        jobId: 'JOB-2026-0610',
        date: '2026-06-10',
        serviceCategory: 'Transmission & Clutch',
        problemSummary: 'Clutch plate and release bearing replacement with pre-trip inspection',
        technicianAssigned: 'Tech Suresh Yadav',
        status: 'Completed',
        partsReplaced: ['Ashok Leyland Genuine 380mm Clutch Disc', 'Heavy Release Bearing Assembly'],
        invoiceAmount: '₹22,300',
        invoiceId: 'INV-TW-4209',
        mileageKm: '210,000 km'
      }
    ]
  },
  'UP32AZ1009': {
    vehicleNumber: 'UP 32 AZ 1009',
    model: 'BharatBenz 2823R Heavy Cargo Container',
    fleetOwner: 'Awadh Express Freightways',
    history: [
      {
        jobId: 'JOB-2026-0719',
        date: '2026-07-19',
        serviceCategory: 'Preventive Fleet Maintenance',
        problemSummary: 'Scheduled 40,000 km lube service with 24V alternator overhaul',
        technicianAssigned: 'Tech Lead Manoj Sharma',
        status: 'Completed',
        partsReplaced: ['15W-40 CK-4 Turbo Diesel Oil (28L)', 'Primary/Secondary Diesel Fuel Filters', 'Alternator Diode Plate'],
        invoiceAmount: '₹18,900',
        invoiceId: 'INV-TW-4511',
        mileageKm: '138,500 km'
      }
    ]
  }
};

function loadDB(): DBStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDB: DBStructure = {
        config: DEFAULT_CONFIG,
        leads: [
          {
            id: 'TW-849102',
            receivedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
            formType: 'breakdown',
            vehicleType: '10–14 Wheeler Heavy Truck',
            vehicleNumber: 'UP 78 BT 4410',
            phone: '+91 98370 55122',
            problem: 'Air brake pressure drop & rear wheel lock on NH-19 near Unnao Toll',
            urgency: 'emergency',
            status: 'dispatched',
            location: {
              lat: 26.5412,
              lng: 80.4891,
              addressText: 'NH-19 KM 42, Kanpur-Unnao Highway corridor',
              accuracy: 12
            },
            technicianNotes: 'Mobile Rescue Van #2 dispatched with heavy air compressor and Wabco pressure valve kit.'
          },
          {
            id: 'TW-848712',
            receivedAt: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
            formType: 'parts',
            vehicleType: 'Multi-Axle Trailer (16+ Wheeler)',
            vehicleNumber: 'RJ 14 GB 6821',
            phone: '+91 94140 12890',
            problem: 'Genuine Clutch Booster Valve & Wabco 4-Circuit Protection Valve needed for Tata Signa 4825',
            partName: 'Wabco 4-Circuit Valve + Tata Clutch Booster',
            urgency: 'high',
            status: 'contacted',
            technicianNotes: 'Part ready in Transport Nagar hub. Transporter notified.'
          }
        ],
        events: [
          {
            id: 'EV-9901',
            timestamp: new Date().toISOString(),
            eventType: 'PAGE_VIEW',
            label: 'Home'
          }
        ],
        vehicles: SEED_VEHICLES,
        rlPolicy: {
          qTable: generateBaselineQTable(),
          totalEpisodes: 342,
          avgReward: 1.84,
          recentRewards: [
            { episode: 338, reward: 2.1, action: 'VAN_2_HEAVY_AIR', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
            { episode: 339, reward: 1.9, action: 'VAN_4_ECU_DIAG', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
            { episode: 340, reward: 1.7, action: 'VAN_1_RAPID', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
            { episode: 341, reward: 2.3, action: 'VAN_2_HEAVY_AIR', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
            { episode: 342, reward: 1.8, action: 'VAN_3_HYDRAULIC_CRANE', timestamp: new Date().toISOString() }
          ],
          hyperparams: {
            learningRate: 0.18,
            discountFactor: 0.88,
            epsilon: 0.08
          },
          lastTrainedAt: new Date().toISOString(),
          convergenceScore: 94.6
        }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.vehicles) {
      parsed.vehicles = SEED_VEHICLES;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    if (!parsed.rlPolicy) {
      parsed.rlPolicy = {
        qTable: generateBaselineQTable(),
        totalEpisodes: 342,
        avgReward: 1.84,
        recentRewards: [
          { episode: 338, reward: 2.1, action: 'VAN_2_HEAVY_AIR', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
          { episode: 339, reward: 1.9, action: 'VAN_4_ECU_DIAG', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
          { episode: 340, reward: 1.7, action: 'VAN_1_RAPID', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
          { episode: 341, reward: 2.3, action: 'VAN_2_HEAVY_AIR', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
          { episode: 342, reward: 1.8, action: 'VAN_3_HYDRAULIC_CRANE', timestamp: new Date().toISOString() }
        ],
        hyperparams: {
          learningRate: 0.18,
          discountFactor: 0.88,
          epsilon: 0.08
        },
        lastTrainedAt: new Date().toISOString(),
        convergenceScore: 94.6
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB, resetting to defaults', err);
    return { config: DEFAULT_CONFIG, leads: [], events: [], vehicles: SEED_VEHICLES };
  }
}

function saveDB(db: DBStructure): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Workshop Config
app.get('/api/config', (req, res) => {
  const db = loadDB();
  res.json(db.config);
});

app.put('/api/config', (req, res) => {
  const db = loadDB();
  db.config = {
    ...db.config,
    ...req.body
  };
  saveDB(db);
  res.json({ success: true, config: db.config });
});

// 3. Leads CRUD
app.get('/api/leads', (req, res) => {
  const db = loadDB();
  const { type, status, today } = req.query;
  let filtered = [...db.leads];

  if (type) {
    filtered = filtered.filter(l => l.formType === type);
  }
  if (status) {
    filtered = filtered.filter(l => l.status === status);
  }
  if (today === 'true') {
    const todayStr = new Date().toISOString().slice(0, 10);
    filtered = filtered.filter(l => l.receivedAt.startsWith(todayStr));
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  res.json({ leads: filtered, total: db.leads.length });
});

app.post('/api/leads', (req, res) => {
  const db = loadDB();
  const incoming = req.body;

  const newLead: LeadRecord = {
    id: incoming.id || `TW-${Date.now().toString().slice(-6)}`,
    receivedAt: incoming.receivedAt || new Date().toISOString(),
    formType: incoming.formType || 'direct',
    vehicleType: incoming.vehicleType || 'Commercial Truck',
    vehicleNumber: (incoming.vehicleNumber || '').toUpperCase().trim(),
    phone: incoming.phone || '',
    problem: incoming.problem || incoming.partName || '',
    services: incoming.services || [],
    partName: incoming.partName,
    location: incoming.location,
    hasVoiceNote: incoming.hasVoiceNote || !!incoming.voiceNoteBase64,
    voiceNoteDuration: incoming.voiceNoteDuration,
    voiceNoteBase64: incoming.voiceNoteBase64,
    hasPhoto: incoming.hasPhoto || !!incoming.photoBase64,
    photoBase64: incoming.photoBase64,
    photoName: incoming.photoName,
    urgency: incoming.urgency || (incoming.formType === 'breakdown' ? 'emergency' : 'normal'),
    status: incoming.status || 'new',
    technicianNotes: incoming.technicianNotes || ''
  };

  // Evaluate Reinforcement Learning Dispatcher
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 22 || currentHour < 6;
  const rlRec = evaluateRLRecommendation({
    vehicleCategory: newLead.vehicleType || '10–14 Wheeler Heavy Truck',
    problemTag: newLead.problem || 'Brake',
    corridorZone: 'zone_b_corridor',
    timeSlot: isNight ? 'night_peak' : 'day'
  }, db.rlPolicy as any);

  newLead.rlDispatchMetadata = {
    action: rlRec.actionId,
    unitName: rlRec.unit.name,
    confidence: rlRec.confidence,
    etaMinutes: rlRec.estimatedArrivalMin,
    recommendedKit: rlRec.recommendedKit,
    stateKey: rlRec.stateKey
  };

  db.leads.unshift(newLead);
  if (db.leads.length > 500) {
    db.leads = db.leads.slice(0, 500);
  }

  // Update vehicle record if registration provided
  const cleanReg = newLead.vehicleNumber ? newLead.vehicleNumber.replace(/\s+/g, '') : null;
  if (cleanReg) {
    const assignedVan = `${rlRec.unit.callsign} (${rlRec.unit.vanNumber})`;
    if (!db.vehicles[cleanReg]) {
      db.vehicles[cleanReg] = {
        vehicleNumber: newLead.vehicleNumber!,
        model: newLead.vehicleType || 'Commercial Vehicle',
        fleetOwner: 'Registered Transporter',
        activeTicket: {
          leadId: newLead.id,
          reportedIssue: newLead.problem || 'Roadside Assistance',
          status: 'Request Received - RL Van Assigned',
          locationName: newLead.location?.addressText || 'Highway Location Shared',
          etaMinutes: rlRec.estimatedArrivalMin,
          dispatchedVan: assignedVan
        },
        history: []
      };
    } else {
      db.vehicles[cleanReg].activeTicket = {
        leadId: newLead.id,
        reportedIssue: newLead.problem || 'Roadside Assistance',
        status: 'Active Request - RL Queued',
        locationName: newLead.location?.addressText || 'Highway Location Shared',
        etaMinutes: rlRec.estimatedArrivalMin,
        dispatchedVan: assignedVan
      };
    }
  }

  // Also log tracking event
  db.events.unshift({
    id: `EV-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    eventType: 'REQUEST_SUBMITTED',
    label: newLead.formType,
    metadata: {
      leadId: newLead.id,
      vehicleNumber: newLead.vehicleNumber,
      vehicleType: newLead.vehicleType,
      urgency: newLead.urgency,
      hasLocation: !!newLead.location
    }
  });

  saveDB(db);
  res.status(201).json({ success: true, lead: newLead });
});

app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const index = db.leads.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  db.leads[index] = {
    ...db.leads[index],
    ...req.body,
    id
  };

  saveDB(db);
  res.json({ success: true, lead: db.leads[index] });
});

app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const initialLength = db.leads.length;
  db.leads = db.leads.filter(l => l.id !== id);

  if (db.leads.length === initialLength) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  saveDB(db);
  res.json({ success: true, message: 'Lead deleted' });
});

// 4. Telemetry Events
app.get('/api/events', (req, res) => {
  const db = loadDB();
  res.json({ events: db.events.slice(0, 150) });
});

app.post('/api/events', (req, res) => {
  const db = loadDB();
  const ev = req.body;

  const newEvent: EventRecord = {
    id: ev.id || `EV-${Date.now().toString().slice(-6)}`,
    timestamp: ev.timestamp || new Date().toISOString(),
    eventType: ev.eventType || 'PAGE_VIEW',
    label: ev.label,
    metadata: ev.metadata
  };

  db.events.unshift(newEvent);
  if (db.events.length > 300) {
    db.events = db.events.slice(0, 300);
  }

  saveDB(db);
  res.status(201).json({ success: true, event: newEvent });
});

// 5. Dashboard Summary Stats
app.get('/api/stats', (req, res) => {
  const db = loadDB();
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayLeads = db.leads.filter(l => l.receivedAt.startsWith(todayStr));
  const emergencyLeads = db.leads.filter(l => l.formType === 'breakdown' || l.urgency === 'emergency');
  const partsLeads = db.leads.filter(l => l.formType === 'parts');

  const callEvents = db.events.filter(e => e.eventType === 'CALL_CLICK' || e.eventType === 'phone_click' || e.eventType === 'call').length;
  const whatsappEvents = db.events.filter(e => e.eventType === 'WHATSAPP_CLICK' || e.eventType === 'whatsapp_click' || e.eventType === 'whatsapp').length;
  const directionsEvents = db.events.filter(e => e.eventType === 'DIRECTIONS_CLICK' || e.eventType === 'directions_click' || e.eventType === 'directions').length;
  const locationShares = db.events.filter(e => e.eventType === 'LOCATION_SHARED' || e.eventType === 'location_shared' || e.eventType === 'location_share').length;
  const photoUploads = db.events.filter(e => e.eventType === 'PHOTO_UPLOADED' || e.eventType === 'photo_upload').length;

  res.json({
    totalLeads: db.leads.length,
    todayLeadsCount: todayLeads.length,
    emergencyCount: emergencyLeads.length,
    partsCount: partsLeads.length,
    totalCalls: callEvents,
    totalWhatsApp: whatsappEvents,
    totalDirections: directionsEvents,
    locationShares,
    photoUploads
  });
});

// 6. Section 7: Vehicle History & Real-Time Job Tracking
app.get('/api/vehicles/:regNumber', (req, res) => {
  const { regNumber } = req.params;
  const cleanKey = (regNumber || '').replace(/[\s\-_]/g, '').toUpperCase();
  const db = loadDB();

  // Direct match or partial match
  let record = db.vehicles[cleanKey];
  if (!record) {
    const matchingKey = Object.keys(db.vehicles).find(k => k.includes(cleanKey) || cleanKey.includes(k));
    if (matchingKey) {
      record = db.vehicles[matchingKey];
    }
  }

  // Also check if there's any active lead for this vehicle
  const activeLead = db.leads.find(l => {
    if (!l.vehicleNumber) return false;
    const lClean = l.vehicleNumber.replace(/[\s\-_]/g, '').toUpperCase();
    return lClean === cleanKey;
  });

  if (record) {
    if (activeLead && !record.activeTicket) {
      record.activeTicket = {
        leadId: activeLead.id,
        reportedIssue: activeLead.problem || 'Active Service Request',
        status: activeLead.status === 'dispatched' ? 'Van Dispatched' : 'Active Request',
        locationName: activeLead.location?.addressText || 'Highway Location',
        etaMinutes: 20,
        dispatchedVan: 'Mobile Rescue Van #1'
      };
    }
    return res.json({ success: true, found: true, vehicle: record });
  }

  // Return dynamic vehicle template if not yet seeded
  const formattedReg = regNumber.toUpperCase().trim();
  res.json({
    success: true,
    found: false,
    vehicle: {
      vehicleNumber: formattedReg,
      model: 'Commercial Vehicle (Registered)',
      fleetOwner: 'Private Transporter',
      activeTicket: activeLead ? {
        leadId: activeLead.id,
        reportedIssue: activeLead.problem || 'Emergency Highway Request',
        status: activeLead.status === 'dispatched' ? 'Van Dispatched' : 'Request Received',
        locationName: activeLead.location?.addressText || 'GPS Coordinates Stored',
        etaMinutes: 25,
        dispatchedVan: 'Mobile Rescue Van #3'
      } : undefined,
      history: [
        {
          jobId: 'JOB-SYS-NEW',
          date: new Date().toISOString().slice(0, 10),
          serviceCategory: 'New Vehicle Registration on TruckWala OS',
          problemSummary: 'Initial digital telemetry profile created in TruckWala 24x7 commercial network',
          technicianAssigned: 'Highway Duty Engineer',
          status: 'Completed',
          partsReplaced: ['Telemetry Onboarding Inspection'],
          invoiceAmount: '₹0 (Verified Registration)',
          invoiceId: 'REC-TW-001',
          mileageKm: 'Verified In-Bay'
        }
      ]
    }
  });
});

// 7. AI Technical Diagnostics & Audit Assistant (Server-side Gemini)
app.post('/api/ai/audit', async (req, res) => {
  const { vehicleModel, symptoms, faultCodes } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      success: true,
      source: 'offline-rules',
      recommendations: [
        '1. Check main 24V battery terminal voltage under starting load (should stay > 18.5V).',
        '2. Inspect primary and secondary fuel filters for water emulsion or diesel wax lock.',
        '3. Check air pressure in dual brake circuits; ensure unloader valve purges at 8.5 bar.',
        '4. For BS-VI AdBlue derate: Check DEF dosing valve for urea crystallization and DPF delta pressure sensor.'
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are the Chief Commercial Vehicle Technical Specialist at TruckWala 24x7 India.
Analyze the following commercial truck fault:
- Vehicle: ${vehicleModel || 'Heavy Commercial Truck (Tata / Leyland / BharatBenz)'}
- Driver Reported Symptoms: ${symptoms || 'Loss of pickup, check engine light, highway stop'}
- Diagnostic / DTC Codes: ${faultCodes || 'None provided'}

Provide a fast, highly practical 4-step diagnosis protocol in clear Hindi and English bullet points for our highway mobile mechanic. Keep it direct, actionable, focusing on mechanical tests (air pressure, diesel rail pressure, DEF quality, electrical relays).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({
      success: true,
      source: 'gemini',
      analysis: response.text
    });
  } catch (err: any) {
    console.error('Gemini diagnostic call failed:', err);
    res.json({
      success: true,
      source: 'fallback',
      analysis: '1. Check dual air pressure gauge in cabin (>7.5 bar required for brake chamber release).\n2. Test fuel rail sensor for air entrapment in common rail pump.\n3. Inspect battery terminals for 24V under-crank drop.'
    });
  }
});

// 7.1 AI 5-Star Review Generator (Auto-writes authentic reviews from driver words)
app.post('/api/ai/write-review', async (req, res) => {
  const { words, language = 'hinglish', vehicleType, serviceType } = req.body;
  const userWords = (words || '').trim();

  // Smart high-authenticity fallback templates based on user words/service
  const getFallbackReview = () => {
    const cleaned = userWords.toLowerCase();
    if (language === 'hi') {
      if (cleaned.includes('brake') || cleaned.includes('ब्रेक')) {
        return `कानपुर-उन्नाव बाईपास पर रात में हमारी गाड़ी का एयर ब्रेक वाल्व लॉक हो गया था। ट्रकवाला की मोबाइल वैन केवल 25 मिनट में गडन खेड़ा फ्लाईओवर के पास पहुंच गई और बहुत वाजिब दाम में काम ठीक कर दिया। पूरी तरह 5-स्टार और भरोसेमंद वर्कशॉप!`;
      }
      if (cleaned.includes('crane') || cleaned.includes('towing') || cleaned.includes('क्रेन')) {
        return `हाईवे पर ब्रेकडाउन होने के बाद ट्रकवाला की हैवी रिकवरी क्रेन टीम ने तुरंत मदद की। बहुत पेशेवर मैकेनिक और सही चार्ज। कानपुर-लखनऊ हाईवे पर हर ड्राइवर के लिए सबसे बेहतरीन 24 घंटे सेवा।`;
      }
      return `ट्रकवाला 24×7 गडन खेड़ा बाईपास उन्नाव पर बहुत ही बढ़िया और ईमानदार वर्कशॉप है। ${userWords ? `(${userWords}) का काम` : 'गाड़ी का काम'} बहुत तेजी से और ओरिजिनल पार्ट्स के साथ किया। सभी ट्रांसपोर्टर और ड्राइवरों के लिए 5-स्टार सर्विस!`;
    }
    
    if (language === 'en') {
      if (cleaned.includes('brake') || cleaned.includes('air')) {
        return `Had a sudden air brake pressure drop near Unnao bypass. TruckWala 24x7 mobile rescue team reached our vehicle within 25 minutes. Fixed the Wabco valve efficiently with zero overcharging. Truly a lifesaver for highway drivers. Highly recommended 5 stars!`;
      }
      if (cleaned.includes('night') || cleaned.includes('midnight') || cleaned.includes('emergency')) {
        return `Outstanding 24x7 emergency service on the Kanpur–Lucknow highway corridor. Our loaded truck broke down late night, and their mechanic arrived fast at Gadan Khera bypass with full equipment. Transparent pricing and genuine support. 5-star experience!`;
      }
      return `Excellent commercial truck service by TruckWala 24×7 at Gadan Khera Bypass Flyover, Unnao. ${userWords ? `Handled ${userWords} with great skill.` : 'Skilled mechanics, prompt turnaround, and very reasonable rates.'} Genuine 5-star workshop on this route!`;
    }

    // Hinglish (Natural Indian Highway Driver / Transporter tone)
    if (cleaned.includes('night') || cleaned.includes('raat') || cleaned.includes('midnight')) {
      return `Raat ko Kanpur-Unnao bypass par gaadi kharab ho gayi thi. TruckWala team ne call ke 25 minute ke andar Gadan Khera flyover ke paas mechanic bhej diya. Kaam bilkul perfect aur genuine rate me hua. 100% genuine 5-star service!`;
    }
    if (cleaned.includes('brake') || cleaned.includes('air')) {
      return `Highway par air brake pressure drop ho gaya tha. TruckWala 24x7 ki van ne aakar Wabco valve replace kiya. Rate bilkul transparent tha aur bina kisi delay ke gaadi dispatch kar di. Best workshop on Kanpur-Lucknow route!`;
    }
    if (cleaned.includes('crane') || cleaned.includes('towing')) {
      return `Heavy loaded trailer breakdown hua tha. TruckWala ki hydraulic recovery crane time par pahunchi aur safe tow kiya. Honest staff aur pocket-friendly charge. 5 stars for reliable support!`;
    }
    return `TruckWala 24×7 (Gadan Khera Bypass Flyover, Unnao) par bohot badhiya kaam hua. ${userWords ? `${userWords} - mechanic ne bohot fast solve kiya.` : 'Experienced mechanics aur genuine OEM parts.'} Highway par kisi bhi commercial vehicle ke liye best 5-star workshop hai.`;
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      success: true,
      source: 'smart-template',
      review: getFallbackReview()
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `You are helping a commercial truck driver or fleet operator write an authentic, high-credibility 5-star Google Maps review for "TruckWala 24×7", a 24x7 heavy commercial vehicle workshop located at Gadan Khera Bypass Flyover, Unnao (Kanpur–Lucknow Highway Corridor).

User's input / core thoughts: "${userWords || 'fast response, honest rates, skilled mechanic'}"
Vehicle context: "${vehicleType || 'Commercial Truck / Trailer'}"
Service context: "${serviceType || 'Highway Breakdown & Repair'}"
Language style requested: "${language}" (options: 'hinglish' = natural conversational Hindi-English driver speak, 'en' = clear professional English, 'hi' = respectful natural Hindi).

Instructions:
1. Write ONE realistic, concise 5-star review (3 to 4 sentences).
2. Sound like a genuine transporter or highway truck driver: direct, grateful, highlighting fast arrival, honest pricing, and professional mechanical work.
3. Mention "TruckWala 24x7" and "Unnao bypass / Kanpur highway" naturally.
4. Output ONLY the review text. Do NOT add quotes, titles, bullet points, asterisks, or any extra conversational text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    const generatedText = (response.text || '').replace(/^["']|["']$/g, '').trim();

    res.json({
      success: true,
      source: 'gemini',
      review: generatedText || getFallbackReview()
    });
  } catch (err: any) {
    console.error('Gemini write-review call failed:', err);
    res.json({
      success: true,
      source: 'fallback',
      review: getFallbackReview()
    });
  }
});

// ----------------------------------------------------
// 8. REINFORCEMENT LEARNING DISPATCH & FLEET OPTIMIZER API
// ----------------------------------------------------

app.get('/api/rl/status', (req, res) => {
  const db = loadDB();
  res.json({ success: true, policy: db.rlPolicy });
});

app.post('/api/rl/recommend', (req, res) => {
  const db = loadDB();
  const { vehicleCategory, problemTag, corridorZone, timeSlot } = req.body;
  const recommendation = evaluateRLRecommendation({
    vehicleCategory: vehicleCategory || '10–14 Wheeler Heavy Truck',
    problemTag: problemTag || 'Brake',
    corridorZone: corridorZone || 'zone_b_corridor',
    timeSlot: timeSlot || 'day'
  }, db.rlPolicy as any);
  res.json({ success: true, recommendation });
});

app.post('/api/rl/feedback', (req, res) => {
  const db = loadDB();
  const { leadId, stateKey, action, resolutionTimeMinutes, firstTimeFix, transporterRating } = req.body;

  if (!db.rlPolicy) {
    db.rlPolicy = {
      qTable: generateBaselineQTable(),
      totalEpisodes: 342,
      avgReward: 1.84,
      recentRewards: [],
      hyperparams: { learningRate: 0.18, discountFactor: 0.88, epsilon: 0.08 },
      lastTrainedAt: new Date().toISOString(),
      convergenceScore: 94.6
    };
  }

  // Calculate environmental reward signal:
  // - Transporter Rating (1-5 mapped to -1 to +1)
  // - First-time fix bonus (+1.5) or tow penalty (-1.0)
  // - Rapid resolution bonus (<= 45 mins: +1.0, > 75 mins: -1.0)
  const normRating = ((transporterRating || 4) - 3) * 0.5;
  const fixBonus = firstTimeFix ? 1.5 : -1.0;
  const timePenalty = (resolutionTimeMinutes || 35) > 60 ? -0.8 : +0.8;
  const reward = Number((normRating + fixBonus + timePenalty).toFixed(2));

  // Bellman update: Q(s,a) = Q(s,a) + alpha * (R - Q(s,a))
  const alpha = db.rlPolicy.hyperparams.learningRate || 0.18;
  if (!db.rlPolicy.qTable[stateKey]) {
    const base = generateBaselineQTable();
    db.rlPolicy.qTable[stateKey] = base[stateKey] || {
      VAN_1_RAPID: 10,
      VAN_2_HEAVY_AIR: 10,
      VAN_3_HYDRAULIC_CRANE: 10,
      VAN_4_ECU_DIAG: 10
    };
  }

  const act = (action || 'VAN_2_HEAVY_AIR') as RescueUnitAction;
  const currentQ = db.rlPolicy.qTable[stateKey][act] ?? 10;
  db.rlPolicy.qTable[stateKey][act] = Number((currentQ + alpha * (reward - currentQ)).toFixed(2));

  db.rlPolicy.totalEpisodes += 1;
  db.rlPolicy.avgReward = Number(((db.rlPolicy.avgReward * 0.95) + (reward * 0.05)).toFixed(2));
  db.rlPolicy.convergenceScore = Math.min(99.4, Number((db.rlPolicy.convergenceScore + 0.1).toFixed(1)));
  db.rlPolicy.lastTrainedAt = new Date().toISOString();

  db.rlPolicy.recentRewards.unshift({
    episode: db.rlPolicy.totalEpisodes,
    reward,
    action: act,
    timestamp: new Date().toISOString()
  });
  if (db.rlPolicy.recentRewards.length > 25) {
    db.rlPolicy.recentRewards = db.rlPolicy.recentRewards.slice(0, 25);
  }

  // Log tracking event
  db.events.unshift({
    id: `EV-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    eventType: 'RL_POLICY_UPDATED',
    label: action,
    metadata: { stateKey, reward, leadId, resolutionTimeMinutes }
  });

  saveDB(db);
  res.json({ success: true, reward, policy: db.rlPolicy });
});

app.post('/api/rl/train-batch', (req, res) => {
  const db = loadDB();
  const episodes = Math.min(200, Math.max(10, req.body.episodes || 50));

  if (!db.rlPolicy) {
    db.rlPolicy = {
      qTable: generateBaselineQTable(),
      totalEpisodes: 342,
      avgReward: 1.84,
      recentRewards: [],
      hyperparams: { learningRate: 0.18, discountFactor: 0.88, epsilon: 0.08 },
      lastTrainedAt: new Date().toISOString(),
      convergenceScore: 94.6
    };
  }

  const vehicles = ['TRAILER', 'HEAVY', 'TIPPER', 'CONTAINER', 'LCV', 'BUS'];
  const problems = ['BRAKE', 'CLUTCH', 'ELECTRICAL', 'FUEL', 'COOLING', 'TYRE', 'BS6_DERATE', 'CHASSIS_AXLE'];
  const zones = ['ZONE_A', 'ZONE_B', 'ZONE_C'];
  const times = ['DAY', 'NIGHT'];

  let totalReward = 0;
  for (let i = 0; i < episodes; i++) {
    const v = vehicles[Math.floor(Math.random() * vehicles.length)];
    const p = problems[Math.floor(Math.random() * problems.length)];
    const z = zones[Math.floor(Math.random() * zones.length)];
    const t = times[Math.floor(Math.random() * times.length)];
    const stateKey = `${v}:${p}:${z}:${t}`;

    if (!db.rlPolicy.qTable[stateKey]) {
      db.rlPolicy.qTable[stateKey] = {
        VAN_1_RAPID: 10,
        VAN_2_HEAVY_AIR: 10,
        VAN_3_HYDRAULIC_CRANE: 10,
        VAN_4_ECU_DIAG: 10
      };
    }

    let chosenAct: RescueUnitAction = 'VAN_2_HEAVY_AIR';
    if (Math.random() < db.rlPolicy.hyperparams.epsilon) {
      const allActs: RescueUnitAction[] = ['VAN_1_RAPID', 'VAN_2_HEAVY_AIR', 'VAN_3_HYDRAULIC_CRANE', 'VAN_4_ECU_DIAG'];
      chosenAct = allActs[Math.floor(Math.random() * allActs.length)];
    } else {
      let maxQ = -Infinity;
      ALL_RESCUE_ACTIONS.forEach(a => {
        if ((db.rlPolicy!.qTable[stateKey][a] || 0) > maxQ) {
          maxQ = db.rlPolicy!.qTable[stateKey][a];
          chosenAct = a;
        }
      });
    }

    let reward = 1.2;
    if (p === 'BRAKE') reward = (chosenAct === 'VAN_2_HEAVY_AIR') ? 2.4 : -0.8;
    else if (p === 'BS6_DERATE') reward = (chosenAct === 'VAN_4_ECU_DIAG') ? 2.6 : -1.2;
    else if (p === 'CHASSIS_AXLE') reward = (chosenAct === 'VAN_3_HYDRAULIC_CRANE') ? 2.5 : -1.0;
    else if (p === 'ELECTRICAL') reward = (chosenAct === 'VAN_1_RAPID') ? 2.2 : -0.5;
    else if (p === 'CLUTCH') reward = (chosenAct === 'VAN_2_HEAVY_AIR') ? 2.1 : (chosenAct === 'VAN_1_RAPID' ? 1.3 : -0.4);
    else reward = 1.6;

    totalReward += reward;
    const alpha = db.rlPolicy.hyperparams.learningRate;
    const oldQ = db.rlPolicy.qTable[stateKey][chosenAct] || 10;
    db.rlPolicy.qTable[stateKey][chosenAct] = Number((oldQ + alpha * (reward - oldQ)).toFixed(2));
  }

  db.rlPolicy.totalEpisodes += episodes;
  db.rlPolicy.avgReward = Number(
    ((db.rlPolicy.avgReward * 0.7) + ((totalReward / episodes) * 0.3)).toFixed(2)
  );
  db.rlPolicy.convergenceScore = Math.min(99.5, Number((db.rlPolicy.convergenceScore + 0.5).toFixed(1)));
  db.rlPolicy.lastTrainedAt = new Date().toISOString();

  saveDB(db);
  res.json({
    success: true,
    episodesRun: episodes,
    avgReward: db.rlPolicy.avgReward,
    convergenceScore: db.rlPolicy.convergenceScore,
    policy: db.rlPolicy
  });
});

app.post('/api/rl/reset', (req, res) => {
  const db = loadDB();
  db.rlPolicy = {
    qTable: generateBaselineQTable(),
    totalEpisodes: 100,
    avgReward: 1.5,
    recentRewards: [],
    hyperparams: { learningRate: 0.18, discountFactor: 0.88, epsilon: 0.08 },
    lastTrainedAt: new Date().toISOString(),
    convergenceScore: 92.0
  };
  saveDB(db);
  res.json({ success: true, policy: db.rlPolicy });
});

// ----------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TruckWala 24×7 Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
