/**
 * 🚨 Tool Registry
 * Defines what tools exist, their risk level, and required permissions.
 */

import { Permission, UserContext } from './auth';

export type ToolRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  riskLevel: ToolRiskLevel;
  requiresApproval: boolean; // if true, routes to Human Approval Queue
  execute: (payload: any, context: UserContext) => Promise<any>;
}

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  register(tool: ToolDefinition) {
    this.tools.set(tool.id, tool);
  }

  get(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  getAll(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }
}

export const globalToolRegistry = new ToolRegistry();
