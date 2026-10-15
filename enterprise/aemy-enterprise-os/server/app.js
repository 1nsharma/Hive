import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AppConfig } from "../core/config.js";
import { sharedLedger } from "../core/audit-ledger.js";
import { commerceEngine } from "../units/commerce/commerce-engine.js";
import { logisticsEngine } from "../units/logistics/logistics-engine.js";
import { cleanTechEngine } from "../units/cleantech/cleantech-engine.js";
import { talentEngine } from "../units/talent/talent-engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, "..", "public");

export function createApp() {
  return http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Tenant-ID");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const tenantId = req.headers["x-tenant-id"] || "AEMY_HQ_DEFAULT";

    // Helper to send JSON
    const sendJson = (statusCode, data) => {
      res.writeHead(statusCode, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    };

    // Helper to parse JSON body
    const parseBody = () => new Promise((resolve) => {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });

    try {
      // 1. Core Health & Metrics
      if (req.method === "GET" && url.pathname === "/api/health") {
        const integrity = sharedLedger.verifyChainIntegrity();
        return sendJson(200, {
          status: "HEALTHY",
          uptimeSeconds: process.uptime(),
          version: AppConfig.version,
          ledgerIntegrity: integrity,
          nodeVersion: process.version
        });
      }

      if (req.method === "GET" && url.pathname === "/api/metrics") {
        const commerceInvoices = commerceEngine.getAllInvoices();
        const logisticsTickets = logisticsEngine.getAllTickets();
        const solarAudits = cleanTechEngine.getAllAudits();
        const candidates = talentEngine.getAllCandidates();

        const totalGTV = commerceInvoices.reduce((acc, i) => acc + i.grandTotal, 0);
        const totalSolarKW = solarAudits.reduce((acc, a) => acc + a.recommendedCapacityKW, 0);

        return sendJson(200, {
          totalRevenueGTV: totalGTV,
          activeKiranas: commerceInvoices.length,
          activeFleetTickets: logisticsTickets.length,
          totalSolarInstalledKW: totalSolarKW,
          candidatesScreened: candidates.length,
          ledgerTotalBlocks: sharedLedger.chain.length
        });
      }

      if (req.method === "GET" && url.pathname === "/api/audit-logs") {
        return sendJson(200, sharedLedger.getEntries());
      }

      // 2. Commerce Endpoints
      if (req.method === "POST" && url.pathname === "/api/commerce/order") {
        const body = await parseBody();
        const invoice = await commerceEngine.processVoiceOrTextInput(tenantId, body.rawText || "1 packet maggi at 14");
        return sendJson(201, invoice);
      }
      if (req.method === "GET" && url.pathname === "/api/commerce/invoices") {
        return sendJson(200, commerceEngine.getAllInvoices());
      }

      // 3. Logistics Endpoints
      if (req.method === "POST" && url.pathname === "/api/logistics/breakdown") {
        const body = await parseBody();
        const ticket = logisticsEngine.createBreakdownTicket(tenantId, body);
        return sendJson(201, ticket);
      }
      if (req.method === "POST" && url.pathname === "/api/logistics/dispatch") {
        const body = await parseBody();
        const ticket = logisticsEngine.assignNearestPartner(body.ticketId);
        return sendJson(200, ticket);
      }
      if (req.method === "GET" && url.pathname === "/api/logistics/tickets") {
        return sendJson(200, logisticsEngine.getAllTickets());
      }

      // 4. CleanTech Endpoints
      if (req.method === "POST" && url.pathname === "/api/cleantech/calculate") {
        const body = await parseBody();
        const assessment = cleanTechEngine.calculateSolarAssessment(tenantId, body);
        return sendJson(201, assessment);
      }
      if (req.method === "GET" && url.pathname === "/api/cleantech/audits") {
        return sendJson(200, cleanTechEngine.getAllAudits());
      }

      // 5. Talent Endpoints
      if (req.method === "POST" && url.pathname === "/api/talent/screen") {
        const body = await parseBody();
        const candidate = await talentEngine.screenCandidate(tenantId, body);
        return sendJson(201, candidate);
      }
      if (req.method === "GET" && url.pathname === "/api/talent/candidates") {
        return sendJson(200, talentEngine.getAllCandidates());
      }

      // 6. Static File Server for Dashboard
      let filePath = path.join(PUBLIC_DIR, url.pathname === "/" ? "index.html" : url.pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes = {
          ".html": "text/html",
          ".js": "text/javascript",
          ".css": "text/css",
          ".json": "application/json"
        };
        res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // Default 404
      sendJson(404, { error: "Route not found" });
    } catch (err) {
      sendJson(500, { error: err.message });
    }
  });
}

// Start server if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createApp();
  server.listen(AppConfig.port, () => {
    console.log(`🚀 ${AppConfig.appName} running at http://localhost:${AppConfig.port}`);
  });
}
