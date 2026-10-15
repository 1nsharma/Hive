import { BusinessCategory } from './models';
import { Permission } from './auth';

/**
 * 🧩 Feature Registry Engine
 */
export type FeatureGroup = 'operations' | 'finance' | 'marketplace' | 'ai' | 'settings' | 'hr' | 'crm' | 'analytics' | 'communication';

export interface FeatureMetadata {
  id: string;
  name: string;
  group: FeatureGroup;
  priority: number; // For layout engine placement
  supportedBusinessTypes: BusinessCategory[] | 'all';
  requiredPermissions: Permission[];
  placement: 'dynamic' | 'fixed';
  isPremium: boolean;
}

/**
 * 📱 Widget Registry
 */
export type WidgetSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface WidgetDefinition {
  id: string;
  featureId: string;
  title: string;
  defaultSize: WidgetSize;
  supportedSizes: WidgetSize[];
  collapsible: boolean;
  expandable: boolean;
  priority: number;
}

/**
 * 🤖 AI Agent Registry
 */
export type AIAgentRole = 
  | 'accountant' | 'sales_manager' | 'inventory_manager' 
  | 'crm_manager' | 'marketing_manager' | 'operations_manager'
  | 'financial_advisor' | 'business_consultant' | 'hr_manager'
  | 'support_agent';

export interface AIAgentMetadata {
  id: string;
  name: string;
  role: AIAgentRole;
  capabilities: string[];
  requiredFeatures: string[]; // Feature IDs this agent depends on
}

/**
 * 🔄 Automation Registry
 */
export interface AutomationRule {
  id: string;
  tenantId: string;
  name: string;
  trigger: 'on_sale' | 'on_low_stock' | 'on_payment_due' | 'schedule';
  conditions: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
}

export interface AutomationAction {
  type: 'send_whatsapp' | 'send_sms' | 'create_task' | 'alert_staff' | 'ai_action';
  payload: any;
}
