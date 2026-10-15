import { workforceManager } from "./workforce-manager.js";
import { scheduleEngine } from "./schedule-engine.js";
import { taskBoard } from "./task-board.js";
import { modelGateway } from "./model-gateway.js";

export class AutonomousDirector {
  constructor() {
    this.tickInterval = null;
    this.autonomousDecisionLog = [];
    this.isRunning = true;
  }

  evaluateAndAct() {
    const routine = scheduleEngine.getCurrentRoutine();
    const tasks = taskBoard.getTasks();
    const pendingTasks = tasks.filter(t => t.status === "in_progress");
    const workforceState = workforceManager.analyzeWorkforceCapacity(pendingTasks.length);

    const decisions = [];

    // Decision 1: Auto-assign unassigned tasks to the best matching coworker
    for (const t of pendingTasks) {
      if (!t.assignee || t.assignee === "unassigned") {
        const bestStaff = this.matchTaskToStaff(t.title, t.workspace);
        t.assignee = bestStaff.id;
        decisions.push(`[AUTO-ASSIGN] Task '${t.title}' assigned to ${bestStaff.name} (${bestStaff.role}).`);
      }
    }

    // Decision 2: Execute routine agenda
    decisions.push(`[SCHEDULE SYNC] Running ${routine.time} routine: '${routine.event}' led by ${routine.lead}.`);

    // Decision 3: Capacity management
    if (workforceState.autoSpawns.length > 0) {
      decisions.push(`[HR ACTION] Auto-summoned Part-Time Specialists: ${workforceState.autoSpawns.join(', ')}.`);
    }

    // Log decisions
    const entry = {
      timestamp: new Date().toISOString(),
      routine: routine.event,
      pendingTasksCount: pendingTasks.length,
      decisions
    };

    this.autonomousDecisionLog.unshift(entry);
    if (this.autonomousDecisionLog.length > 30) this.autonomousDecisionLog.pop();

    return entry;
  }

  matchTaskToStaff(taskTitle, workspace) {
    const text = (taskTitle + " " + workspace).toLowerCase();
    if (text.includes("security") || text.includes("ast") || text.includes("refactor")) {
      return workforceManager.getStaffById("dwight-schrute");
    }
    if (text.includes("finance") || text.includes("ledger") || text.includes("audit") || text.includes("gst")) {
      return workforceManager.getStaffById("oscar-martinez");
    }
    if (text.includes("solar") || text.includes("subsidy") || text.includes("tax")) {
      return workforceManager.getStaffById("raja-ca");
    }
    if (text.includes("sos") || text.includes("highway") || text.includes("truck")) {
      return workforceManager.getStaffById("kevin-malone");
    }
    if (text.includes("design") || text.includes("ux") || text.includes("standup")) {
      return workforceManager.getStaffById("pam-beesly");
    }
    if (text.includes("sales") || text.includes("client") || text.includes("api")) {
      return workforceManager.getStaffById("jim-halpert");
    }
    return workforceManager.getStaffById("michael-scott");
  }

  getDecisionHistory() {
    return this.autonomousDecisionLog;
  }
}

export const autonomousDirector = new AutonomousDirector();
