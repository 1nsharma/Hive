import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3004;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  candidates: [
    {
      id: "CAND-501",
      name: "Rohit Sharma",
      phone: "9829022334",
      appliedRole: "Full-Stack AI Developer",
      skills: ["REACT", "NODE", "TYPESCRIPT", "PYTHON", "AI"],
      score: 92,
      decision: "SELECTED_FOR_INTERVIEW",
      timestamp: new Date().toISOString()
    }
  ],
  openJobs: [
    { id: "J1", title: "Full-Stack AI Engineer", openings: 3, minExpYears: 2, tech: "React, Node, Gemini, Postgres" },
    { id: "J2", title: "Heavy Vehicle Fleet Dispatcher", openings: 2, minExpYears: 1, tech: "Highway Ops, WhatsApp CRM" },
    { id: "J3", title: "Solar Rooftop Lead Engineer", openings: 4, minExpYears: 2, tech: "DISCOM Net-metering, Turnkey EPC" }
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
    return res.end(JSON.stringify({ service: "HireSaathi AI", port: PORT, status: "ONLINE", totalCandidates: db.candidates.length }));
  }

  if (url.pathname === "/api/candidates" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.candidates));
  }

  if (url.pathname === "/api/jobs" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.openJobs));
  }

  if (url.pathname === "/api/screen" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const text = (data.resumeText || "").toLowerCase();
      const detected = [];
      const keywords = ["react", "node", "typescript", "python", "ai", "sql", "git", "logistics", "electrical", "solar", "mechanic"];
      for (const k of keywords) {
        if (text.includes(k)) detected.push(k.toUpperCase());
      }
      const score = Math.min(100, Math.max(35, detected.length * 15 + 25));
      const cand = {
        id: `CAND-${Date.now().toString().slice(-3)}`,
        name: data.name || "Candidate",
        phone: data.phone || "9829000000",
        appliedRole: data.appliedRole || "Full-Stack Engineer",
        skills: detected,
        score,
        decision: score >= 70 ? "SELECTED_FOR_INTERVIEW" : (score >= 50 ? "BENCH_REVIEW" : "REJECTED"),
        timestamp: new Date().toISOString()
      };
      db.candidates.unshift(cand);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cand));
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
  res.end(JSON.stringify({ error: "Not found in HireSaathi AI" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`👥 HireSaathi AI running on http://localhost:${PORT}`));
}
