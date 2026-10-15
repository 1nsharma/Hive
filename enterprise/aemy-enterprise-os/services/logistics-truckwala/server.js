import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3002;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  breakdowns: [
    {
      id: "SOS-701",
      truckNumber: "RJ-14-GA-8899",
      driverName: "Balwant Singh",
      driverPhone: "9829012345",
      location: "NH-48 KM 142 Near Dudu Toll Plaza",
      issue: "Clutch pressure plate burst, air brake pressure low",
      assignedWorkshop: "Sharma Highway Garage (KM 135)",
      status: "DISPATCHED",
      costEstimate: 1450,
      timestamp: new Date().toISOString()
    }
  ],
  workshops: [
    { id: "W1", name: "Sharma Highway Garage", highway: "NH-48 KM 135", rating: 4.8, activeMechanics: 4 },
    { id: "W2", name: "National Crane & Hydraulic Service", highway: "NH-8 KM 80", rating: 4.6, activeMechanics: 2 },
    { id: "W3", name: "Rajdhani Mobile Workshop", highway: "NH-52 KM 45", rating: 4.9, activeMechanics: 3 }
  ],
  rates: [
    { service: "On-site Laptop Computer Diagnostic", rate: "₹499 fixed" },
    { service: "Air Brake Line / Valve Repair", rate: "₹650 + parts" },
    { service: "Clutch & Gearbox Highway Overhaul", rate: "₹1,800 + parts" },
    { service: "Heavy Crane Towing (up to 40T)", rate: "₹2,500 base + ₹60/km" }
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
    return res.end(JSON.stringify({ service: "TruckWala 24x7", port: PORT, status: "ONLINE", activeSOS: db.breakdowns.length }));
  }

  if (url.pathname === "/api/breakdowns" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.breakdowns));
  }

  if (url.pathname === "/api/workshops" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.workshops));
  }

  if (url.pathname === "/api/rates" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.rates));
  }

  if (url.pathname === "/api/dispatch" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const ticket = {
        id: `SOS-${Date.now().toString().slice(-3)}`,
        truckNumber: (data.truckNumber || "UNKNOWN").toUpperCase(),
        driverName: data.driverName || "Highway Driver",
        driverPhone: data.driverPhone || "9829000000",
        location: data.location || "NH-48",
        issue: data.issue || "Engine Breakdown",
        assignedWorkshop: db.workshops[0].name,
        status: "DISPATCHED",
        costEstimate: data.costEstimate || 899,
        timestamp: new Date().toISOString()
      };
      db.breakdowns.unshift(ticket);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(ticket));
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
  res.end(JSON.stringify({ error: "Not found in TruckWala 24x7" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🚛 TruckWala 24x7 running on http://localhost:${PORT}`));
}
