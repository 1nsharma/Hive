import {
  CoreState,
  CulturalEntity,
  CoreClaim,
  CoreEvidence,
  CoreTestimony,
  CoreReview,
  CoreConsent,
  CoreContributor,
  CorePlurality,
  CoreAuditLogEntry,
} from '../types';

export const STORAGE_KEY = 'cultural_intelligence_core_v01';

export function uuid(): string {
  return 'id-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
}

export function nowISO(): string {
  return new Date().toISOString();
}

export const defaultCoreData: CoreState = {
  entities: [],
  claims: [],
  evidence: [],
  testimonies: [],
  reviews: [],
  consent: [],
  plurality: [],
  contributors: [],
  auditLog: []
};

export function seedKanpurPilotData(): CoreState {
  const entityId = uuid();
  const entity: CulturalEntity = {
    entity_id: entityId,
    entity_type: 'FOOD_TRADITION',
    name: 'Kanpur Traditional Home-Food Heritage',
    geographic_scope: 'Kanpur, Uttar Pradesh',
    description: '[HYPOTHESIS CLUSTER] A set of home-food practices attributed to Kanpur households. All claims below are UNVERIFIED hypotheses pending field research.',
    created_at: nowISO(),
    created_by: 'researcher_01'
  };

  const pilotClaimsRaw: Array<{ statement: string; type: CoreClaim['claim_type'] }> = [
    { statement: 'Satpaita Kanpur-region की traditional home-food practice है।', type: 'PRACTICE' },
    { statement: 'Nimona Kanpur households में intergenerationally बनाया जाता है।', type: 'TRANSMISSION' },
    { statement: 'Buknu/paratha की Kanpur-specific cultural association है।', type: 'ASSOCIATION' },
    { statement: 'Dal ka dulha local household food tradition में मौजूद है।', type: 'PRACTICE' },
    { statement: 'इन dishes का knowledge formal restaurants से ज्यादा परिवारों के माध्यम से transmit होता है।', type: 'TRANSMISSION' },
    { statement: 'अलग-अलग परिवारों में इनके recipes में meaningful variations हैं।', type: 'DIVERSITY' },
    { statement: 'कुछ dishes seasonal या occasion-specific हैं।', type: 'TEMPORAL' },
    { statement: 'Younger generation में इनका knowledge कम हो रहा है।', type: 'EROSION' },
    { statement: 'Existing online discovery इन foods का cultural provenance adequately नहीं दिखाती।', type: 'DIGITAL_GAP' },
    { statement: 'Evidence + community validation वाला profile ordinary food listing से अधिक useful होगा।', type: 'BUSINESS_HYPOTHESIS' }
  ];

  const claims: CoreClaim[] = pilotClaimsRaw.map((c, i) => ({
    claim_id: 'C' + String(i + 1).padStart(3, '0'),
    entity_id: entityId,
    statement: c.statement,
    claim_type: c.type,
    geographic_scope: 'Kanpur',
    verification_status: 'UNVERIFIED',
    created_at: nowISO(),
    created_by: 'researcher_01'
  }));

  const initialAudit: CoreAuditLogEntry[] = [
    {
      log_id: uuid(),
      entity_type: 'CLAIM',
      entity_id: 'C001-C010',
      action: 'CREATED',
      actor_id: 'researcher_01',
      timestamp: nowISO(),
      before_state: null,
      after_state: { count: 10 },
      rationale: 'Seeded 10 pilot claims as UNVERIFIED hypotheses'
    },
    {
      log_id: uuid(),
      entity_type: 'ENTITY',
      entity_id: entityId,
      action: 'CREATED',
      actor_id: 'researcher_01',
      timestamp: nowISO(),
      before_state: null,
      after_state: { name: 'Kanpur Traditional Home-Food Heritage' },
      rationale: 'Seeded Kanpur pilot entity'
    }
  ];

  return {
    entities: [entity],
    claims,
    evidence: [],
    testimonies: [],
    reviews: [],
    consent: [],
    plurality: [],
    contributors: [],
    auditLog: initialAudit
  };
}

export function loadCoreState(): CoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.entities) && parsed.entities.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading core state', e);
  }
  const seeded = seedKanpurPilotData();
  saveCoreState(seeded);
  return seeded;
}

export function saveCoreState(state: CoreState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving core state', e);
  }
}

export function appendAuditLog(
  state: CoreState,
  entityType: string,
  entityId: string,
  action: string,
  before: any,
  after: any,
  rationale: string = ''
): CoreState {
  const newEntry: CoreAuditLogEntry = {
    log_id: uuid(),
    entity_type: entityType,
    entity_id: entityId,
    action,
    actor_id: 'researcher_01',
    timestamp: nowISO(),
    before_state: before,
    after_state: after,
    rationale
  };

  const updated: CoreState = {
    ...state,
    auditLog: [newEntry, ...state.auditLog]
  };
  saveCoreState(updated);
  return updated;
}
