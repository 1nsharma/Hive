export interface Snapshot {
  id: string;
  tenantId: string;
  projectionName: string;
  state: any;
  version: number; // e.g. event count
  timestamp: number;
}

export class SnapshotEngine {
  private snapshots: Snapshot[] = [];

  takeSnapshot(tenantId: string, projectionName: string, state: any, currentVersion: number) {
    this.snapshots.push({
      id: `snap_${Date.now()}`,
      tenantId,
      projectionName,
      state: JSON.parse(JSON.stringify(state)), // Deep copy
      version: currentVersion,
      timestamp: Date.now()
    });
  }

  getLatestSnapshot(tenantId: string, projectionName: string): Snapshot | undefined {
    const tenantSnaps = this.snapshots.filter(s => s.tenantId === tenantId && s.projectionName === projectionName);
    if (tenantSnaps.length === 0) return undefined;
    return tenantSnaps.sort((a, b) => b.version - a.version)[0]; // Highest version
  }
}
export const globalSnapshotEngine = new SnapshotEngine();
