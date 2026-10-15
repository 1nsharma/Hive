import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { fleetEngine } from "./core/fleet-engine.js";
import { taskBoard } from "./core/task-board.js";
import { modelGateway } from "./core/model-gateway.js";
import { workforceManager } from "./core/workforce-manager.js";
import { scheduleEngine } from "./core/schedule-engine.js";
import { autonomousDirector } from "./core/autonomous-director.js";

const PORT = parseInt(process.env.PORT, 10) || 3300;
const HOST = process.env.HOST || "0.0.0.0";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. Health & Executive Telemetry
  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      status: "ONLINE",
      app: "AI Super Intelligence Company",
      theme: "Hive Autonomous Office",
      port: PORT,
      coworkersCount: fleetEngine.getCoworkers().length,
      fullTimeStaff: workforceManager.fullTimeStaff.length,
      partTimeStaff: workforceManager.partTimeContractors.length,
      activeRoutine: scheduleEngine.getCurrentRoutine().event,
      timestamp: new Date().toISOString()
    }));
  }

  // 2. Workforce API (Full-Time vs Part-Time)
  if (url.pathname === "/api/workforce" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      fullTime: workforceManager.fullTimeStaff,
      partTime: workforceManager.partTimeContractors,
      shifts: scheduleEngine.getShiftDistribution(),
      analysis: workforceManager.analyzeWorkforceCapacity(taskBoard.getTasks({ status: "in_progress" }).length)
    }));
  }

  if (url.pathname === "/api/workforce/hire" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const hired = workforceManager.hireContractor(data);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(hired));
    });
    return;
  }

  // 3. Schedule & Shift Engine (Kab Kya Karna Hai)
  if (url.pathname === "/api/schedule" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      currentRoutine: scheduleEngine.getCurrentRoutine(),
      allRoutines: scheduleEngine.getAllRoutines()
    }));
  }

  if (url.pathname === "/api/schedule/advance" && req.method === "POST") {
    const nextRoutine = scheduleEngine.advanceSchedule();
    autonomousDirector.evaluateAndAct();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(nextRoutine));
  }

  // 4. Autonomous Director & Decisions (Kudh Kya Karna Hai)
  if (url.pathname === "/api/decisions" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(autonomousDirector.getDecisionHistory()));
  }

  if (url.pathname === "/api/director/tick" && req.method === "POST") {
    const cycle = autonomousDirector.evaluateAndAct();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(cycle));
  }

  // 5. Coworkers Fleet
  if (url.pathname === "/api/coworkers" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(fleetEngine.getCoworkers()));
  }

  // 6. Workspaces
  if (url.pathname === "/api/workspaces" && req.method === "GET") {
    const wsFile = path.join(__dirname, "config/workspaces.json");
    const wsData = JSON.parse(fs.readFileSync(wsFile, "utf-8"));
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(wsData.workspaces));
  }

  // 7. Model Catalog
  if (url.pathname === "/api/models" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(modelGateway.getCatalog()));
  }

  // 8. Tasks Board
  if (url.pathname === "/api/tasks" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(taskBoard.getTasks()));
  }

  if (url.pathname === "/api/tasks" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const t = taskBoard.createTask(data);
      autonomousDirector.evaluateAndAct();
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(t));
    });
    return;
  }

  // 9. Floor Logs
  if (url.pathname === "/api/logs" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(fleetEngine.floorActivityLog));
  }

  // 10. Dispatch Mission to Coworker
  if (url.pathname === "/api/dispatch" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const result = modelGateway.dispatchPrompt(data);
      fleetEngine.setCoworkerStatus(
        data.coworkerId || "michael-scott",
        "working",
        `Executing prompt: "${(data.prompt || '').slice(0, 40)}..."`
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  // 11. Standup
  if (url.pathname === "/api/standup" && req.method === "POST") {
    const s = fleetEngine.triggerStandup();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(s));
  }

  
  // 12. Enterprise Services & Gateway Directory
  if (url.pathname === "/api/services" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify([
      { id: "commerce-dukaanmitra", name: "DukaanMitra OS", port: 3001, status: "ONLINE", category: "Retail and MSME Bahi-Khata" },
      { id: "logistics-truckwala", name: "TruckWala 24x7", port: 3002, status: "ONLINE", category: "Highway Emergency SOS and Fleet" },
      { id: "cleantech-solarhub", name: "SolarHub PM Surya Ghar", port: 3003, status: "ONLINE", category: "CleanTech Subsidy Engine" },
      { id: "talent-hiresaathi", name: "HireSaathi AI", port: 3004, status: "ONLINE", category: "Blue-Collar and Tech Talent Matching" },
      { id: "studio-ai-agents", name: "JORVISH AI Studio", port: 3005, status: "ONLINE", category: "Autonomous Agent Orchestration" },
      { id: "studio-gaming-arcade", name: "Desi Arcade 3D", port: 3006, status: "ONLINE", category: "Gaming and Neural Media" },
      { id: "govtech-services", name: "GovAI Citizen Hub", port: 3007, status: "ONLINE", category: "National Schemes and Verification" },
      { id: "petcare-petsjanu", name: "PetsJanu Tele-Vet", port: 3008, status: "ONLINE", category: "24x7 Veterinary Tele-Health" }
    ]));
  }

  
  // 13. Autonomous Engines (Phyllis Research & Andy Closing)
  if (url.pathname === "/api/engines" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      researchEngine: {
        id: "client-research-engine",
        name: "Hive B2B Client Research & Authority Engine",
        lead: "Phyllis Vance",
        status: "ACTIVE",
        verifiedLeadsCount: 42,
        pipelineValue: "$485,000",
        capabilities: ["Google Search & Maps Scraping", "Authority Scoring", "Contact Discovery", "Pain Point Extraction"],
        lastRun: new Date().toISOString()
      },
      closingEngine: {
        id: "closing-engine",
        name: "Hive Enterprise Deal Closing & Acquisition Engine",
        lead: "Andy Bernard",
        status: "ACTIVE",
        closedDealsCount: 18,
        conversionRate: "24.6%",
        capabilities: ["Pitch Personalization", "Autonomous Follow-ups", "Stripe Invoice Generation", "Contract Synthesis"],
        lastRun: new Date().toISOString()
      }
    }));
  }

  if (url.pathname === "/api/engines/research/run" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      message: "Phyllis B2B Research Engine executed successfully",
      newLeadsDiscovered: 4,
      targetNiches: ["CleanTech PM Surya Ghar", "Retail MSME Vyapar", "Logistics Fleet Owners"],
      timestamp: new Date().toISOString()
    }));
  }

  if (url.pathname === "/api/engines/closing/run" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      message: "Andy Deal Closing Engine executed successfully",
      dealsAdvanced: 2,
      pipelineValue: "$520,000",
      timestamp: new Date().toISOString()
    }));
  }

  // 14. Enterprise Portfolio & 8 Divisions API
  if (url.pathname === "/api/enterprise/portfolio" && req.method === "GET") {
    const portfolioFile = path.join(__dirname, "../enterprise/PORTFOLIO_INVENTORY.json");
    if (fs.existsSync(portfolioFile)) {
      const data = JSON.parse(fs.readFileSync(portfolioFile, "utf-8"));
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ divisions: [] }));
  }

  // 15. Hive Desktop Orchestrator Engine Status
  if (url.pathname === "/api/desktop/status" && req.method === "GET") {
    const mainBuilt = fs.existsSync(path.join(__dirname, "../desktop/out/main/index.js"));
    const rendererBuilt = fs.existsSync(path.join(__dirname, "../desktop/out/renderer/index.html"));
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      name: "Hive Desktop & Multi-Agent Orchestrator",
      status: mainBuilt && rendererBuilt ? "COMPILED" : "READY",
      electronVersion: "32.0.0",
      features: [
        "Monaco Editor 0.52 (Code Editor & Diff Viewer)",
        "Pixi.js 8 Virtual Office Spatial Floor Canvas",
        "Native ConPTY and SQLite Execution Layer",
        "Git Worktrees per-agent Isolation",
        "Markdown Memory Palaces (agents/<id>/memory.md)",
        "12 Multi-Model CLI Agent Harnesses"
      ],
      launcher: "LAUNCH_HIVE_DESKTOP.bat"
    }));
  }

  // 16. Serve Static UI
  const filePath = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
    res.writeHead(200, { "Content-Type": mimes[ext] || "text/plain" });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found in AI Company Server" }));
});

export { server, PORT, HOST };
export default server;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, HOST, () => {
    console.log(`🏢 HIVE VIRTUAL OFFICE & UNIFIED AI ENTERPRISE running on http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
    // Start initial autonomous cycle
    autonomousDirector.evaluateAndAct();
  });
}
