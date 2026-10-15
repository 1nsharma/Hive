export class TaskBoard {
  constructor() {
    this.tasks = [
      {
        id: "TSK-101",
        title: "Integrate Voice Bahi Khata to ProofLedger",
        workspace: "01-engineering-dev",
        assignee: "dwight-schrute",
        status: "in_progress",
        priority: "HIGH",
        updatedAt: new Date().toISOString()
      },
      {
        id: "TSK-102",
        title: "Highway SOS Dynamic Price Surge Engine",
        workspace: "06-logistics-supplychain",
        assignee: "kevin-malone",
        status: "in_progress",
        priority: "HIGH",
        updatedAt: new Date().toISOString()
      },
      {
        id: "TSK-103",
        title: "PM Surya Ghar ₹78,000 Direct Subsidy Audit",
        workspace: "05-cleantech-energy",
        assignee: "raja-ca",
        status: "in_progress",
        priority: "NORMAL",
        updatedAt: new Date().toISOString()
      },
      {
        id: "TSK-104",
        title: "Desi Arcade 3D Kancha Physics Engine",
        workspace: "04-creative-media-games",
        assignee: "pam-beesly",
        status: "review",
        priority: "NORMAL",
        updatedAt: new Date().toISOString()
      },
      {
        id: "TSK-105",
        title: "Quarterly ProofLedger Cryptographic Audit Report",
        workspace: "03-finance-ledger",
        assignee: "oscar-martinez",
        status: "done",
        priority: "CRITICAL",
        updatedAt: new Date().toISOString()
      }
    ];
  }

  getTasks(filter = {}) {
    return this.tasks.filter(t => {
      if (filter.status && t.status !== filter.status) return false;
      if (filter.workspace && t.workspace !== filter.workspace) return false;
      if (filter.assignee && t.assignee !== filter.assignee) return false;
      return true;
    });
  }

  createTask({ title, workspace, assignee, priority = "NORMAL" }) {
    const task = {
      id: `TSK-${Date.now().toString().slice(-4)}`,
      title,
      workspace,
      assignee: assignee || "michael-scott",
      status: "in_progress",
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(task);
    return task;
  }

  updateTaskStatus(id, newStatus) {
    const t = this.tasks.find(x => x.id === id);
    if (!t) throw new Error(`Task '${id}' not found`);
    t.status = newStatus;
    t.updatedAt = new Date().toISOString();
    return t;
  }
}

export const taskBoard = new TaskBoard();
