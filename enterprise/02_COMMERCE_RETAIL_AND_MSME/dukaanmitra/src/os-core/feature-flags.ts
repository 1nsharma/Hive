export class FeatureFlags {
  private flags: Map<string, Map<string, boolean>> = new Map(); // tenantId -> (flag -> boolean)

  setFlag(tenantId: string, flag: string, enabled: boolean) {
    if (!this.flags.has(tenantId)) {
      this.flags.set(tenantId, new Map());
    }
    this.flags.get(tenantId)!.set(flag, enabled);
  }

  isEnabled(tenantId: string, flag: string): boolean {
    const tenantFlags = this.flags.get(tenantId);
    if (!tenantFlags) return false;
    return tenantFlags.get(flag) || false;
  }
}
export const globalFeatureFlags = new FeatureFlags();
