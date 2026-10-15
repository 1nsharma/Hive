import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sharedLedger } from "../shared/core/proof-ledger.js";

const PORT = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVICES = {
  commerce: { name: "DukaanMitra OS", url: "http://localhost:3001" },
  logistics: { name: "TruckWala 24x7", url: "http://localhost:3002" },
  cleantech: { name: "SolarHub CleanTech", url: "http://localhost:3003" },
  talent: { name: "HireSaathi AI", url: "http://localhost:3004" },
  ai_agents: { name: "AI Agent & JORVISH Studio", url: "http://localhost:3005" },
  gaming_arcade: { name: "Desi Arcade Gaming Studio", url: "http://localhost:3006" },
  govtech: { name: "GovAI India Central Portal", url: "http://localhost:3007" },
  petcare: { name: "PetsJanu Veterinary Hub", url: "http://localhost:3008" }
};

async function proxyRequest(targetUrl, req, res) {
  try {
    const target = new URL(req.url, targetUrl);
    const options = {
      method: req.method,
      headers: { ...req.headers, host: target.host }
    };

    const proxyReq = http.request(target, options, proxyRes => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on("error", err => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: `Service unavailable at ${targetUrl}`, details: err.message }));
    });

    req.pipe(proxyReq);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-ID");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api/gateway/status") {
    const results = {};
    for (const [key, svc] of Object.entries(SERVICES)) {
      try {
        const resp = await fetch(`${svc.url}/api/health`, { signal: AbortSignal.timeout(1200) });
        results[key] = resp.ok ? await resp.json() : { status: "DEGRADED" };
      } catch {
        results[key] = { service: svc.name, status: "OFFLINE", port: svc.url.split(":").pop() };
      }
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      gateway: { name: "Aemy Master Enterprise Gateway", port: PORT, status: "ONLINE" },
      ledgerValid: sharedLedger.verify(),
      totalBlocks: sharedLedger.chain.length,
      microServices: results
    }));
  }

  if (url.pathname === "/api/gateway/metrics") {
    let totalGTV = 0;
    let invoicesCount = 0;
    let activeSOSCount = 0;
    let solarAuditsCount = 0;
    let candidatesCount = 0;

    try {
      const invs = await (await fetch(`${SERVICES.commerce.url}/api/invoices`, { signal: AbortSignal.timeout(800) })).json();
      invoicesCount = invs.length;
      totalGTV = invs.reduce((acc, i) => acc + (i.total || 0), 0);
    } catch {}

    try {
      const tickets = await (await fetch(`${SERVICES.logistics.url}/api/breakdowns`, { signal: AbortSignal.timeout(800) })).json();
      activeSOSCount = tickets.length;
    } catch {}

    try {
      const audits = await (await fetch(`${SERVICES.cleantech.url}/api/audits`, { signal: AbortSignal.timeout(800) })).json();
      solarAuditsCount = audits.length;
    } catch {}

    try {
      const cands = await (await fetch(`${SERVICES.talent.url}/api/candidates`, { signal: AbortSignal.timeout(800) })).json();
      candidatesCount = cands.length;
    } catch {}

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      totalGTV,
      invoicesCount,
      activeSOSCount,
      solarAuditsCount,
      candidatesCount,
      timestamp: new Date().toISOString()
    }));
  }

  if (url.pathname === "/api/gateway/ledger") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(sharedLedger.chain));
  }

  // Reverse Proxy mapping
  for (const [key, svc] of Object.entries(SERVICES)) {
    if (url.pathname.startsWith(`/services/${key}`)) {
      req.url = req.url.replace(`/services/${key}`, "") || "/";
      return proxyRequest(svc.url, req, res);
    }
  }

  // Serve Gateway Command Shell SPA
  const filePath = path.join(__dirname, "public", url.pathname === "/" ? "index.html" : url.pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
    res.writeHead(200, { "Content-Type": mimes[ext] || "text/plain" });
    return fs.createReadStream(filePath).pipe(res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found on Master Gateway" }));
});

export { server, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🏛️ Master Enterprise Gateway running on http://localhost:${PORT}`));
}
