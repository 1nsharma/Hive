import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3005;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  agents: [
    { id: "AGT-01", name: "J.O.R.V.I.S.H Enterprise Voice", status: "ACTIVE", memoryTokens: "420K", role: "Autonomous Executive Voice & Ops" },
    { id: "AGT-02", name: "Universal Code Synthesizer", status: "ACTIVE", memoryTokens: "850K", role: "Full-Stack Code Generation" },
    { id: "AGT-03", name: "Mowglai Hyperlocal Dispatcher", status: "IDLE", memoryTokens: "180K", role: "Route & Logistics Optimization" },
    { id: "AGT-04", name: "Data Research & Market Scout", status: "ACTIVE", memoryTokens: "310K", role: "Deep Web & Financial Recon" }
  ],
  pipelines: [
    { id: "PIPE-1", title: "Autonomous Refactor & Self-Healing", status: "SUCCESS", lastRun: "10 mins ago" },
    { id: "PIPE-2", title: "Gemini 2.5 Multi-Agent Swarm Sync", status: "STREAMING", lastRun: "Live" },
    { id: "PIPE-3", title: "Automated API Contract Verification", status: "SUCCESS", lastRun: "22 mins ago" }
  ],
  terminalLogs: [
    "[JORVISH-CORE] Neural audio stream synchronized (Whisper/Gemini audio).",
    "[POLICY-ENGINE] Zero-Trust access token verified for Tenant TENANT-AEMY.",
    "[AGENT-MESH] Dispatching parallel subagents for enterprise inventory reconciliation.",
    "[COMPOSIO-GATEWAY] 14 native tools hooked into system runtime."
  ]
};

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ service: "AI Agent & JORVISH Studio", port: PORT, status: "ONLINE", agentsCount: db.agents.length }));
  }

  if (url.pathname === "/api/agents" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.agents));
  }

  if (url.pathname === "/api/pipelines" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.pipelines));
  }

  if (url.pathname === "/api/terminal" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.terminalLogs));
  }

  if (url.pathname === "/api/dispatch" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const cmd = data.prompt || "Execute routine task";
      const log = `[AUTONOMOUS-AGENT] Prompt dispatched: "${cmd}" -> Plan synthesized with 4 subtasks.`;
      db.terminalLogs.push(log);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, log }));
    });
    return;
  }

  const filePath = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
    res.writeHead(200, { "Content-Type": mimes[ext] || "text/plain" });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found in AI Agent Studio" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🧠 AI Agent Studio running on http://localhost:${PORT}`));
}
