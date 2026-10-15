export const Roles = {
  CEO: "ROLE_CEO",
  CTO: "ROLE_CTO",
  PM: "ROLE_PM",
  MERCHANT: "ROLE_MERCHANT",
  OPERATOR: "ROLE_OPERATOR",
  CANDIDATE: "ROLE_CANDIDATE"
};

export class TenantContext {
  constructor(tenantId, userRole = Roles.OPERATOR, userName = "Authorized User") {
    if (!tenantId) throw new Error("Tenant ID is required for multi-tenant isolation");
    this.tenantId = tenantId;
    this.userRole = userRole;
    this.userName = userName;
    this.createdAt = new Date().toISOString();
  }

  canAccess(requiredRole) {
    const hierarchy = [
      Roles.CANDIDATE,
      Roles.OPERATOR,
      Roles.MERCHANT,
      Roles.PM,
      Roles.CTO,
      Roles.CEO
    ];
    return hierarchy.indexOf(this.userRole) >= hierarchy.indexOf(requiredRole);
  }
}
