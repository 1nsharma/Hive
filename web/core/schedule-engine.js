export class ScheduleEngine {
  constructor() {
    // 24-Hour Autonomous Floor Roster
    this.dailyRoutines = [
      { time: "08:00 AM", event: "Morning Systems Self-Check", lead: "Dwight Schrute", action: "Verify all 8 workspaces, git status & AST health", type: "MAINTENANCE" },
      { time: "09:00 AM", event: "All-Hands Floor Standup", lead: "Michael Scott", action: "Review in-flight tasks, unblock stalled tickets, assign work", type: "COORDINATION" },
      { time: "11:00 AM", event: "Code & Architecture Review Sprint", lead: "Jim Halpert", action: "Inspect PRs, verify zero-trust contracts and API routes", type: "ENGINEERING" },
      { time: "01:00 PM", event: "Mid-Day Workforce Re-Balancing", lead: "Pam Beesly", action: "Evaluate FT/PT load, spin up part-time agents if queue > 5", type: "HR_CAPACITY" },
      { time: "03:00 PM", event: "B2B Merchant & Solar Subsidy Pipeline", lead: "Raja CA", action: "Disburse PM Surya Ghar claims and verify highway rate cards", type: "OPERATIONS" },
      { time: "05:00 PM", event: "Cryptographic ProofLedger Reconciliation", lead: "Oscar Martinez", action: "Hash daily transactions into SHA-256 ledger blocks", type: "FINANCE" },
      { time: "07:00 PM", event: "Security & Guardrails Lockdown", lead: "Angela Martin", action: "Run anti-jailbreak scans & purge unmasked keys", type: "SECURITY" },
      { time: "10:00 PM", event: "Night Watch & SOS Auto-Pilot", lead: "Kevin Malone", action: "24/7 Highway SOS listener and emergency garage dispatch", type: "NIGHT_WATCH" }
    ];

    this.activeRoutineIndex = 1; // Default: Standup
  }

  getCurrentRoutine() {
    return this.dailyRoutines[this.activeRoutineIndex];
  }

  getAllRoutines() {
    return this.dailyRoutines;
  }

  advanceSchedule() {
    this.activeRoutineIndex = (this.activeRoutineIndex + 1) % this.dailyRoutines.length;
    return this.getCurrentRoutine();
  }

  getShiftDistribution() {
    return {
      morningShift: ["Michael Scott", "Jim Halpert", "Pam Beesly"],
      regularDayShift: ["Oscar Martinez", "Raja CA"],
      eveningNightShift: ["Angela Martin", "Kevin Malone"],
      alwaysOnEngine: ["Dwight Schrute (Autonomous Watchdog)"]
    };
  }
}

export const scheduleEngine = new ScheduleEngine();
