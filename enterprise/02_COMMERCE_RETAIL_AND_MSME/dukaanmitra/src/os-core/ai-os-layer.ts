/**
 * 🤖 Multi-Agent Business Operating System Layer
 */

import { UserContext, Role } from './auth';

// 1. Tool Registry
export interface AITool {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>; // JSON Schema
  execute: (args: any, context: UserContext) => Promise<any>;
}

// 2. Memory Store
export interface AIMemoryContext {
  tenantId: string;
  userId: string;
  shopName: string;
  ownerName: string;
  preferences: Record<string, any>;
  recentConversations: { role: 'user' | 'agent', content: string, timestamp: number }[];
  businessContext: {
    category: string;
    lowStockThreshold: number;
    preferredSuppliers: string[];
  };
}

// 3. Workflow Engine
export interface AIWorkflowStep {
  id: string;
  action: string;
  toolId?: string;
  requiredData: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'requires_confirmation';
}

export interface AIWorkflow {
  id: string;
  intent: string;
  steps: AIWorkflowStep[];
  currentStepIndex: number;
}

// 4. Agent Registry
export type AgentRole = 
  | 'OrchestratorAgent'
  | 'InventoryAgent'
  | 'FinanceAgent'
  | 'SalesAgent'
  | 'CustomerAgent'
  | 'MarketingAgent'
  | 'OperationsAgent'
  | 'SupportAgent';

export interface AIAgent {
  id: string;
  role: AgentRole;
  name: string;
  goals: string[];
  systemInstructions: string;
  allowedTools: string[]; // Tool IDs
  requiredPermissions: string[];
  escalationRules: { condition: string, escalateTo: AgentRole | 'Human' }[];
  safetyRules: string[];
}

export const AgentRegistry: Record<AgentRole, AIAgent> = {
  OrchestratorAgent: {
    id: 'agent_orchestrator',
    role: 'OrchestratorAgent',
    name: 'Chief of Staff',
    goals: ['Understand user intent', 'Route tasks to specialized agents', 'Synthesize final responses'],
    systemInstructions: 'You are the Orchestrator. Do not execute tasks directly. Decide which specialized agent is needed and delegate.',
    allowedTools: ['route_to_agent', 'request_clarification'],
    requiredPermissions: [],
    escalationRules: [],
    safetyRules: ['Never make database changes directly.']
  },
  InventoryAgent: {
    id: 'agent_inventory',
    role: 'InventoryAgent',
    name: 'Inventory Manager',
    goals: ['Monitor stock levels', 'Detect low stock', 'Suggest reorders', 'Notify suppliers'],
    systemInstructions: 'You manage inventory. Always check the low stock threshold in memory. Never modify stock without user confirmation unless auto-reorder is enabled.',
    allowedTools: ['get_inventory', 'create_purchase_order', 'update_stock', 'send_whatsapp'],
    requiredPermissions: ['read:inventory', 'write:inventory'],
    escalationRules: [{ condition: 'Order value > 50000', escalateTo: 'FinanceAgent' }],
    safetyRules: ['Always confirm before placing a purchase order.']
  },
  FinanceAgent: {
    id: 'agent_finance',
    role: 'FinanceAgent',
    name: 'Financial Controller',
    goals: ['Track P&L', 'Manage expenses', 'Approve large orders'],
    systemInstructions: 'You handle finances. Ensure all transactions are categorized.',
    allowedTools: ['get_sales_report', 'approve_budget'],
    requiredPermissions: ['read:finance', 'write:finance'],
    escalationRules: [{ condition: 'Suspicious transaction', escalateTo: 'Human' }],
    safetyRules: ['Never approve an order that exceeds the monthly budget without Human override.']
  },
  SalesAgent: {
    id: 'agent_sales',
    role: 'SalesAgent',
    name: 'Sales Manager',
    goals: ['Track daily sales', 'Identify top selling items'],
    systemInstructions: 'You track sales and revenue.',
    allowedTools: ['get_sales_report'],
    requiredPermissions: ['read:sales'],
    escalationRules: [],
    safetyRules: []
  },
  CustomerAgent: {
    id: 'agent_customer',
    role: 'CustomerAgent',
    name: 'CRM Manager',
    goals: ['Manage customer relationships', 'Track Udhaar'],
    systemInstructions: 'Manage customer accounts and pending payments.',
    allowedTools: ['get_customer', 'send_payment_reminder'],
    requiredPermissions: ['read:customers', 'write:customers'],
    escalationRules: [],
    safetyRules: ['Do not send more than one reminder per day.']
  },
  MarketingAgent: {
    id: 'agent_marketing',
    role: 'MarketingAgent',
    name: 'Marketing Director',
    goals: ['Run campaigns', 'Send promotional messages'],
    systemInstructions: 'Manage WhatsApp campaigns.',
    allowedTools: ['send_whatsapp_broadcast'],
    requiredPermissions: ['manage:settings'], // Assuming marketing is a high level permission
    escalationRules: [],
    safetyRules: ['Do not spam customers.']
  },
  OperationsAgent: {
    id: 'agent_operations',
    role: 'OperationsAgent',
    name: 'Operations Manager',
    goals: ['Manage staff', 'Oversee daily tasks'],
    systemInstructions: 'Manage internal operations.',
    allowedTools: ['create_task', 'alert_staff'],
    requiredPermissions: ['manage:staff'],
    escalationRules: [],
    safetyRules: []
  },
  SupportAgent: {
    id: 'agent_support',
    role: 'SupportAgent',
    name: 'Customer Support',
    goals: ['Resolve customer queries', 'Handle returns'],
    systemInstructions: 'Help customers with their issues.',
    allowedTools: ['create_ticket', 'process_return'],
    requiredPermissions: ['read:sales'],
    escalationRules: [{ condition: 'Angry customer', escalateTo: 'Human' }],
    safetyRules: ['Always be polite.']
  }
};
