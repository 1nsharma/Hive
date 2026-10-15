export class TenantContext {
  constructor(tenantId, role = "OPERATOR", permissions = []) {
    if (!tenantId) throw new Error("TenantContext requires tenantId");
    this.tenantId = tenantId;
    this.role = role.toUpperCase();
    this.permissions = new Set(permissions);
    this.createdAt = new Date().toISOString();
  }

  isAuthorizedFor(action) {
    if (this.role === "CEO" || this.role === "SUPERADMIN") return true;
    if (this.role === "CTO" && !action.startsWith("FINANCE_TRANSFER")) return true;
    return this.permissions.has(action);
  }

  assertTenantIsolation(resourceTenantId) {
    if (this.role === "CEO" || this.role === "SUPERADMIN") return true;
    if (this.tenantId !== resourceTenantId) {
      throw new Error(`TENANT_ISOLATION_VIOLATION: Context tenant '${this.tenantId}' cannot access resource tenant '${resourceTenantId}'`);
    }
    return true;
  }
}

export class DomainEvent {
  constructor(eventType, payload, context) {
    if (!eventType) throw new Error("DomainEvent requires eventType");
    this.eventId = `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.eventType = eventType;
    this.payload = payload || {};
    this.tenantId = context?.tenantId || "GLOBAL";
    this.role = context?.role || "SYSTEM";
    this.timestamp = new Date().toISOString();
  }
}

export function enforceTenantBoundary(context, resourceTenantId, callback) {
  context.assertTenantIsolation(resourceTenantId);
  return callback();
}
