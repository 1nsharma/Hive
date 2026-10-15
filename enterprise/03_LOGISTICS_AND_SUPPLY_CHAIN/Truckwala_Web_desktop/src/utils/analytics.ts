import { LeadSubmission, TrackingEvent, WorkshopConfig, DashboardStats } from '../types';

const LEADS_STORAGE_KEY = 'truckwala_leads';
const EVENTS_STORAGE_KEY = 'truckwala_events';
const CONFIG_STORAGE_KEY = 'truckwala_config';

let cachedLeads: LeadSubmission[] = [];
let cachedEvents: TrackingEvent[] = [];

// Initialize local cache
try {
  const storedLeads = localStorage.getItem(LEADS_STORAGE_KEY);
  if (storedLeads) cachedLeads = JSON.parse(storedLeads);
  const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  if (storedEvents) cachedEvents = JSON.parse(storedEvents);
} catch (e) {
  console.warn('localStorage init warning:', e);
}

export function trackEvent(
  eventType: TrackingEvent['eventType'],
  label?: string,
  metadata?: Record<string, any>
): void {
  const event: TrackingEvent = {
    id: `EV-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    eventType,
    label,
    metadata
  };

  cachedEvents.unshift(event);
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(cachedEvents.slice(0, 100)));
  } catch (e) {
    console.warn('Could not store event to localStorage', e);
  }

  // Also send to backend API endpoint
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(() => {
    // Graceful fallback
  });
}

export function trackPageView(): void {
  trackEvent('page_view', window.location.pathname, {
    referrer: document.referrer,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  });
}

export function trackClick(type: 'phone' | 'whatsapp' | 'directions' | 'review' | 'internal-link' | 'entity_link', target: string): void {
  let eventType: TrackingEvent['eventType'] = 'phone_click';
  if (type === 'whatsapp') eventType = 'whatsapp_click';
  else if (type === 'directions') eventType = 'directions_click';
  else if (type === 'review') eventType = 'review_click';
  else if (type === 'entity_link') eventType = 'button_click';

  trackEvent(eventType, target, { url: window.location.href });
}

export async function submitLead(lead: Omit<LeadSubmission, 'id' | 'receivedAt' | 'status'>): Promise<LeadSubmission> {
  const newLead: LeadSubmission = {
    ...lead,
    id: `TW-${Date.now().toString().slice(-6)}`,
    receivedAt: new Date().toISOString(),
    status: 'new'
  };

  // Local storage caching first for instant responsiveness
  cachedLeads.unshift(newLead);
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(cachedLeads.slice(0, 100)));
  } catch (e) {
    console.warn('Could not store lead to localStorage', e);
  }

  // Dispatch tracking event
  trackEvent('form_submission', lead.formType, {
    vehicleNumber: lead.vehicleNumber,
    hasLocation: !!lead.location,
    hasVoiceNote: !!lead.hasVoiceNote,
    hasPhoto: !!lead.hasPhoto
  });

  // Persist to Cloud Database via server API
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.lead) return data.lead;
    }
  } catch (err) {
    console.warn('Backend API submission fell back to client persistence', err);
  }

  return newLead;
}

export async function fetchRemoteLeads(): Promise<LeadSubmission[]> {
  try {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.leads)) {
        cachedLeads = data.leads;
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(data.leads));
        return data.leads;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch remote leads, using cache', err);
  }
  return [...cachedLeads];
}

export async function fetchRemoteEvents(): Promise<TrackingEvent[]> {
  try {
    const res = await fetch('/api/events');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.events)) {
        cachedEvents = data.events;
        return data.events;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch remote events, using cache', err);
  }
  return [...cachedEvents];
}

export async function updateLeadStatus(id: string, status: LeadSubmission['status'], technicianNotes?: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, technicianNotes })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchWorkshopConfig(): Promise<WorkshopConfig | null> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const config = await res.json();
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      return config;
    }
  } catch (err) {
    console.warn('Failed to fetch config, using local cache', err);
  }
  const cached = localStorage.getItem(CONFIG_STORAGE_KEY);
  return cached ? JSON.parse(cached) : null;
}

export async function updateWorkshopConfig(newConfig: Partial<WorkshopConfig>): Promise<WorkshopConfig | null> {
  try {
    const res = await fetch('/api/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(data.config));
      return data.config;
    }
  } catch (err) {
    console.error('Failed to update config', err);
  }
  return null;
}

export async function fetchDashboardStats(): Promise<DashboardStats | null> {
  try {
    const res = await fetch('/api/stats');
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Failed to fetch stats', err);
  }
  return null;
}

export async function fetchVehicleRecord(regNumber: string) {
  try {
    const clean = encodeURIComponent(regNumber.trim());
    const res = await fetch(`/api/vehicles/${clean}`);
    if (res.ok) {
      const data = await res.json();
      return data.vehicle;
    }
  } catch (err) {
    console.warn('Failed to fetch vehicle record', err);
  }
  return null;
}

export function getLocalLeads(): LeadSubmission[] {
  return [...cachedLeads];
}

export function getLocalEvents(): TrackingEvent[] {
  return [...cachedEvents];
}

export function exportLeadsCSV(): void {
  const leads = getLocalLeads();
  if (leads.length === 0) {
    alert('No leads available to export yet.');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Vehicle', 'Phone', 'Problem / Details', 'Status', 'Location Lat/Lng'];
  const rows = leads.map(l => [
    l.id,
    new Date(l.receivedAt).toLocaleString(),
    l.formType,
    `"${l.vehicleNumber || ''}"`,
    `"${l.phone || ''}"`,
    `"${(l.problem || l.partName || (l.services ? l.services.join(', ') : '')).replace(/"/g, '""')}"`,
    l.status,
    l.location ? `"${l.location.lat}, ${l.location.lng}"` : '""'
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `truckwala_leads_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
