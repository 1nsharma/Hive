/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LivePipeline {
  id: string;
  name: string;
  source: string;
  destination: string;
  status: 'SYNCED' | 'RUNNING' | 'QUEUED_FOR_RECOVERY' | 'REQUIRES_ACTION' | 'DEGRADED';
  eventsProcessed: number;
  latencyMs: number;
  lastSyncAgo: string;
  circuitBreaker: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  riskLevel: 'Low-Risk' | 'Medium-Risk' | 'High-Risk';
  schemaMapping: {
    sourceField: string;
    targetField: string;
    transformation: string;
  }[];
  description: string;
}

export interface LiveAuditEvent {
  id: string;
  timestamp: string;
  pipelineId: string;
  eventType: string;
  sourcePayload: Record<string, unknown>;
  normalizedPayload: Record<string, unknown>;
  actionTaken: string;
  riskTier: 'Low-Risk' | 'Medium-Risk' | 'High-Risk';
  approvalStatus: 'Auto-Executed' | 'Approved by Admin' | 'Pending 2FA Approval';
  provenanceHash: string;
}

export const INITIAL_PIPELINES: LivePipeline[] = [
  {
    id: 'pipe-sfdc-sheets',
    name: 'Salesforce Leads ⇄ Google Sheets Sync',
    source: 'Salesforce CRM (v59.0)',
    destination: 'Google Sheets (Enterprise Master)',
    status: 'SYNCED',
    eventsProcessed: 14820,
    latencyMs: 44,
    lastSyncAgo: '12s ago',
    circuitBreaker: 'CLOSED',
    riskLevel: 'Low-Risk',
    schemaMapping: [
      { sourceField: 'Lead.Name', targetField: 'Sheet.ColA (Full Name)', transformation: 'Trim & Normalize' },
      { sourceField: 'Lead.Email', targetField: 'Sheet.ColB (Verified Email)', transformation: 'RFC5322 Validate' },
      { sourceField: 'Lead.AnnualRevenue', targetField: 'Sheet.ColC (ARR USD)', transformation: 'Currency Formatter' },
      { sourceField: 'Lead.Status', targetField: 'Sheet.ColD (Stage)', transformation: 'Enum Mapping' }
    ],
    description: 'Autonomous bidirectional mirror syncing new inbound qualified enterprise leads directly to executive spreadsheets.'
  },
  {
    id: 'pipe-shopify-slack-qb',
    name: 'Shopify Orders ➔ Slack #sales & QuickBooks',
    source: 'Shopify Store (REST / GraphQL)',
    destination: 'Slack (#revenue-wins) + QuickBooks',
    status: 'RUNNING',
    eventsProcessed: 3410,
    latencyMs: 68,
    lastSyncAgo: '4s ago',
    circuitBreaker: 'CLOSED',
    riskLevel: 'Low-Risk',
    schemaMapping: [
      { sourceField: 'Order.TotalUSD', targetField: 'Slack.Blocks.Header', transformation: 'Formatted Currency Banner' },
      { sourceField: 'Order.LineItems', targetField: 'QuickBooks.InvoiceLines', transformation: 'Double-Entry Reconciliation' },
      { sourceField: 'Customer.Email', targetField: 'QuickBooks.CustomerRef', transformation: 'Upsert Customer Record' }
    ],
    description: 'Instant multi-destination fanout: celebrates order in sales channel and books reconciled invoice in ledger.'
  },
  {
    id: 'pipe-stripe-postgres',
    name: 'Stripe Payments ➔ PostgreSQL Master Ledger',
    source: 'Stripe Webhooks API',
    destination: 'PostgreSQL 16 (ACID Schema)',
    status: 'SYNCED',
    eventsProcessed: 28940,
    latencyMs: 28,
    lastSyncAgo: 'Just now',
    circuitBreaker: 'CLOSED',
    riskLevel: 'Medium-Risk',
    schemaMapping: [
      { sourceField: 'charge.id', targetField: 'transactions.external_id', transformation: 'Idempotency Key Check' },
      { sourceField: 'charge.amount', targetField: 'transactions.amount_cents', transformation: 'BigInt Safe Conversion' },
      { sourceField: 'charge.status', targetField: 'transactions.status', transformation: 'State Enum' }
    ],
    description: 'Zero-loss deterministic accounting sync with strict idempotency verification and immutable audit trail.'
  },
  {
    id: 'pipe-hubspot-voice',
    name: 'HubSpot Qualified Leads ➔ Twilio AI Voice Dialer',
    source: 'HubSpot CRM Workflows',
    destination: 'Twilio Media Stream + Aura Voice Agent',
    status: 'QUEUED_FOR_RECOVERY',
    eventsProcessed: 890,
    latencyMs: 112,
    lastSyncAgo: '45s ago',
    circuitBreaker: 'HALF_OPEN',
    riskLevel: 'Medium-Risk',
    schemaMapping: [
      { sourceField: 'contact.phone', targetField: 'voice.e164_destination', transformation: 'E.164 Number Format' },
      { sourceField: 'contact.notes', targetField: 'agent.prompt_context', transformation: 'Semantic Memory Injection' }
    ],
    description: 'Autonomous AI outbound calling agent that qualifies leads, answers product questions, and locks demo calendars.'
  }
];

export const INITIAL_AUDIT_LOGS: LiveAuditEvent[] = [
  {
    id: 'evt-98214',
    timestamp: '14:28:02',
    pipelineId: 'pipe-sfdc-sheets',
    eventType: 'lead.created',
    sourcePayload: {
      lead_id: '00Q5g000004XYZ',
      name: 'Priya Sharma',
      company: 'TechFlow Systems',
      email: 'priya@techflow.io',
      arr_estimate: 85000,
      lead_source: 'Organic Search'
    },
    normalizedPayload: {
      entity: 'CRM_LEAD',
      normalized_name: 'Priya Sharma',
      clean_email: 'priya@techflow.io',
      deal_tier: 'Enterprise Tier 1',
      formatted_arr: '$85,000'
    },
    actionTaken: 'Appended row to Google Sheet "Enterprise Leads 2026" with verified lock',
    riskTier: 'Low-Risk',
    approvalStatus: 'Auto-Executed',
    provenanceHash: 'sha256:4a8b9c...f102e3'
  },
  {
    id: 'evt-98213',
    timestamp: '14:27:18',
    pipelineId: 'pipe-shopify-slack-qb',
    eventType: 'order.completed',
    sourcePayload: {
      order_number: 10482,
      customer: 'David Miller',
      total_price: '4,250.00',
      currency: 'USD',
      items: 3
    },
    normalizedPayload: {
      order_id: 10482,
      tier: 'High-Value Sale',
      slack_target: '#revenue-wins',
      qb_invoice_id: 'INV-2026-089'
    },
    actionTaken: 'Broadcasted to Slack channel & generated QuickBooks ledger invoice #INV-2026-089',
    riskTier: 'Low-Risk',
    approvalStatus: 'Auto-Executed',
    provenanceHash: 'sha256:9f2c1a...77b8e1'
  },
  {
    id: 'evt-98212',
    timestamp: '14:25:40',
    pipelineId: 'pipe-stripe-postgres',
    eventType: 'charge.dispute_created',
    sourcePayload: {
      charge_id: 'ch_3N8k29x9102',
      amount_refunded: 120000,
      reason: 'fraudulent_charge'
    },
    normalizedPayload: {
      action: 'BULK_RECORD_REVERSAL',
      impact: 'Financial Debit $1,200',
      requires_approval: true
    },
    actionTaken: 'Human Authority Gate paused execution. Dispatched 2FA approval to CFO.',
    riskTier: 'High-Risk',
    approvalStatus: 'Pending 2FA Approval',
    provenanceHash: 'sha256:33d1c8...a89104'
  }
];

export const PRESET_INTENTS = [
  {
    label: 'Salesforce ⇄ Google Sheets + Slack Alert',
    text: 'Salesforce ke naye leads ko Google Sheets me daily update karo aur jab high-value lead ($50k+) aaye to Slack #sales me batao.'
  },
  {
    label: 'Shopify ➔ QuickBooks Double-Entry Accounting',
    text: 'Shopify ke sabhi new orders ko QuickBooks me invoice bnao aur customer records ko PostgreSQL master ledger me sync karo.'
  },
  {
    label: 'Stripe Payment Recovery ➔ WhatsApp Assistant',
    text: 'Stripe me payment fail hone par customer ko WhatsApp par friendly payment link bhejo aur CRM deal stage ko At-Risk mark karo.'
  },
  {
    label: 'HubSpot Inbound ➔ AI Voice Qualified Call',
    text: 'HubSpot me naya lead aate hi 2 minute ke andar Twilio Voice AI se follow-up call karo aur calendar booking confirm karo.'
  }
];
