import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3003;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  audits: [
    {
      id: "SOLAR-101",
      clientName: "Sunil Verma",
      city: "Jaipur",
      capacityKW: 3,
      grossCost: 165000,
      govSubsidy: 78000,
      netCost: 87000,
      annualSavings: 32400,
      paybackYears: 2.7,
      timestamp: new Date().toISOString()
    }
  ],
  epcVendors: [
    { name: "Tata Power Solar Authorized Channel", rating: 4.9, completedProjects: 320 },
    { name: "Loom Solar Rooftop Experts", rating: 4.8, completedProjects: 195 },
    { name: "Adani Solar Direct Installer", rating: 4.7, completedProjects: 140 }
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
    return res.end(JSON.stringify({ service: "SolarHub CleanTech", port: PORT, status: "ONLINE", totalAudits: db.audits.length }));
  }

  if (url.pathname === "/api/audits" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.audits));
  }

  if (url.pathname === "/api/vendors" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.epcVendors));
  }

  if (url.pathname === "/api/assess" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const bill = parseFloat(data.monthlyBill) || 2500;
      const roof = parseFloat(data.roofArea) || 300;

      // Mathematical PM Surya Ghar Formula
      const unitsMonth = bill / 7.5;
      const reqKW = unitsMonth / 120;
      const capKW = Math.max(1, Math.min(Math.round(reqKW * 10) / 10, Math.floor(roof / 100)));

      let govSubsidy = capKW <= 2 ? capKW * 30000 : Math.min(78000, 60000 + (capKW - 2) * 18000);
      const grossCost = capKW * 55000;
      const netCost = grossCost - govSubsidy;
      const annualSavings = Math.round(capKW * 120 * 12 * 7.5);
      const paybackYears = Math.round((netCost / annualSavings) * 10) / 10;

      const audit = {
        id: `SOLAR-${Date.now().toString().slice(-3)}`,
        clientName: data.clientName || "Solar Consumer",
        city: data.city || "Jaipur",
        capacityKW: capKW,
        grossCost,
        govSubsidy,
        netCost,
        annualSavings,
        paybackYears,
        timestamp: new Date().toISOString()
      };
      db.audits.unshift(audit);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(audit));
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
  res.end(JSON.stringify({ error: "Not found in SolarHub CleanTech" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`⚡ SolarHub CleanTech running on http://localhost:${PORT}`));
}
