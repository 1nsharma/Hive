/**
 * 🚨 Policy Engine
 * Declarative rules for the AI and OS.
 */

export interface OSContext {
  tenantId: string;
  userRole?: string;
  payload: any;
}

export interface PolicyRule {
  id: string;
  tenantId: string | 'system';
  description: string;
  condition: (context: OSContext) => boolean;
  action: (context: OSContext) => void | Promise<void>;
}

export class PolicyEngine {
  private rules: PolicyRule[] = [];

  registerRule(rule: PolicyRule) {
    this.rules.push(rule);
  }

  async evaluate(context: OSContext) {
    const applicableRules = this.rules.filter(r => r.tenantId === 'system' || r.tenantId === context.tenantId);
    
    for (const rule of applicableRules) {
      if (rule.condition(context)) {
        console.log(`[PolicyEngine] Rule Triggered: ${rule.description}`);
        await rule.action(context);
      }
    }
  }
}

export const globalPolicyEngine = new PolicyEngine();
