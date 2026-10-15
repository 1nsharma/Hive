export class WorkforceManager {
  constructor() {
    this.fullTimeStaff = [
      { id: "michael-scott", name: "Michael Scott", role: "CEO & Floor Boss (God Agent)", type: "FULL_TIME", hoursPerWeek: 40, shift: "DAY", hourlyRate: 0, status: "active", capacityLoadPct: 35 },
      { id: "dwight-schrute", name: "Dwight Schrute", role: "1M-Token Code Enforcer & Security", type: "FULL_TIME", hoursPerWeek: 50, shift: "ROUND_THE_CLOCK", hourlyRate: 0, status: "active", capacityLoadPct: 75 },
      { id: "jim-halpert", name: "Jim Halpert", role: "Lead Solutions Architect & B2B", type: "FULL_TIME", hoursPerWeek: 40, shift: "DAY", hourlyRate: 0, status: "active", capacityLoadPct: 50 },
      { id: "pam-beesly", name: "Pam Beesly", role: "Chief of Staff & UX Lead", type: "FULL_TIME", hoursPerWeek: 40, shift: "DAY", hourlyRate: 0, status: "active", capacityLoadPct: 40 },
      { id: "oscar-martinez", name: "Oscar Martinez", role: "Head of Finance & Cryptographic Audit", type: "FULL_TIME", hoursPerWeek: 40, shift: "DAY", hourlyRate: 0, status: "active", capacityLoadPct: 60 }
    ];

    this.partTimeContractors = [
      { id: "raja-ca", name: "Raja CA", role: "Statutory Tax & DISCOM Auditor", type: "PART_TIME", hoursPerWeek: 15, shift: "ON_DEMAND", status: "standby", capacityLoadPct: 20, triggerCondition: "Finance/Tax audit queue > 2" },
      { id: "angela-martin", name: "Angela Martin", role: "Security & Guardrails QA Auditor", type: "PART_TIME", hoursPerWeek: 20, shift: "EVENING", status: "active", capacityLoadPct: 45, triggerCondition: "New PR or Code push" },
      { id: "kevin-malone", name: "Kevin Malone", role: "Highway SOS Emergency Dispatcher", type: "PART_TIME", hoursPerWeek: 20, shift: "NIGHT", status: "standby", capacityLoadPct: 15, triggerCondition: "Highway SOS SOS event" },
      { id: "toby-flenderson", name: "Toby Flenderson", role: "Compliance & Ethical AI Safety", type: "PART_TIME", hoursPerWeek: 10, shift: "WEEKEND", status: "standby", capacityLoadPct: 10, triggerCondition: "Legal or policy query" },
      { id: "ryan-temp", name: "Ryan Howard (Temp)", role: "Rapid Web Scraping & Trend Hustler", type: "PART_TIME", hoursPerWeek: 10, shift: "ON_DEMAND", status: "standby", capacityLoadPct: 0, triggerCondition: "Market radar search" }
    ];
  }

  getAllStaff() {
    return [...this.fullTimeStaff, ...this.partTimeContractors];
  }

  getStaffById(id) {
    return this.getAllStaff().find(s => s.id === id);
  }

  analyzeWorkforceCapacity(taskQueueLength) {
    const totalStaff = this.getAllStaff().length;
    const activeStaff = this.getAllStaff().filter(s => s.status === "active").length;
    const avgLoad = Math.round(this.getAllStaff().reduce((acc, s) => acc + s.capacityLoadPct, 0) / totalStaff);

    let recommendation = "Workforce capacity optimal.";
    let autoSpawns = [];

    // If task backlog exceeds capacity, dynamically spawn standby part-time contractors
    if (taskQueueLength > 5) {
      recommendation = `High workload detected (${taskQueueLength} in-flight tasks). Dynamically spinning up standby part-time AI contractors.`;
      for (const pt of this.partTimeContractors) {
        if (pt.status === "standby") {
          pt.status = "active";
          pt.capacityLoadPct = 50;
          autoSpawns.push(pt.name);
        }
      }
    }

    return {
      totalEmployees: totalStaff,
      fullTimeCount: this.fullTimeStaff.length,
      partTimeCount: this.partTimeContractors.length,
      activeEmployees: activeStaff,
      averageCapacityLoadPct: avgLoad,
      recommendation,
      autoSpawns
    };
  }

  hireContractor({ name, role, hoursPerWeek = 15, triggerCondition = "General backlog" }) {
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-pt";
    const contractor = {
      id,
      name,
      role,
      type: "PART_TIME",
      hoursPerWeek,
      shift: "ON_DEMAND",
      status: "active",
      capacityLoadPct: 10,
      triggerCondition
    };
    this.partTimeContractors.push(contractor);
    return contractor;
  }
}

export const workforceManager = new WorkforceManager();
