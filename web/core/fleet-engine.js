import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rosterPath = path.join(__dirname, "../config/roster.json");
const initialRoster = JSON.parse(fs.readFileSync(rosterPath, "utf-8"));

export class FleetEngine {
  constructor() {
    this.coworkers = initialRoster.coworkers;
    this.floorActivityLog = [
      `[FLOOR INIT] Office opened. Michael Scott initialized as floor boss (God Agent).`,
      `[DWIGHT] 1M token code enforcer online. Code integrity scans running.`,
      `[OSCAR] ProofLedger cryptographic ledger synchronized with SHA-256 blocks.`,
      `[PAM] Morning standup prepared. All 8 workspaces reporting normal.`
    ];
  }

  getCoworkers() {
    return this.coworkers;
  }

  getCoworker(id) {
    return this.coworkers.find(c => c.id === id);
  }

  setCoworkerStatus(id, status, activity = null) {
    const c = this.getCoworker(id);
    if (!c) throw new Error(`Coworker '${id}' not found`);
    c.status = status;
    if (activity) c.currentActivity = activity;
    this.floorActivityLog.unshift(`[${new Date().toLocaleTimeString()}] ${c.name} is now ${status.toUpperCase()}: "${c.currentActivity}"`);
    if (this.floorActivityLog.length > 50) this.floorActivityLog.pop();
    return c;
  }

  triggerStandup() {
    const activeTasks = this.coworkers.map(c => `• ${c.name} (${c.role}): ${c.currentActivity}`);
    const summary = `📢 **Hourly Ops Standup Meeting Report (Conference Room)**:\n\n` +
      activeTasks.join("\n") +
      `\n\n🚀 **Verdict**: All 8 Workspaces running autonomously with full multi-model CLI support.`;
    this.floorActivityLog.unshift(`[OPS STANDUP] Michael completed floor standup. All departments in sync.`);
    return {
      timestamp: new Date().toISOString(),
      organizedBy: "Michael Scott",
      report: summary
    };
  }
}

export const fleetEngine = new FleetEngine();
