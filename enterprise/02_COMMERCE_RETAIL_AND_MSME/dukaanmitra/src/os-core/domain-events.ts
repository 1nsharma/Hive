/**
 * 🚨 Business Domain Events
 * Complete event catalog for the OS.
 */

export type BusinessDomainEventType =
  | 'SALE_CREATED'
  | 'CUSTOMER_CREATED'
  | 'INVENTORY_UPDATED'
  | 'INVENTORY_LOW'
  | 'PAYMENT_RECEIVED'
  | 'UDHAAR_ADDED'
  | 'PURCHASE_CREATED'
  | 'WHATSAPP_MESSAGE_RECEIVED'
  | 'GST_RETURN_DUE'
  | 'AI_TASK_COMPLETED'
  | 'GST_FILED'
  | 'TRANSACTION_CREATED';

export interface DomainEvent {
  id: string;
  type: BusinessDomainEventType;
  tenantId: string;
  payload: any;
  timestamp: number;
  correlationId?: string;
  sourceId: string;
}
