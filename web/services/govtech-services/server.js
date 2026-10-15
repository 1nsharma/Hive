import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3007;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  schemes: [
    { id: "SCH-01", name: "PM Surya Ghar Muft Bijli Yojana", ministry: "MNRE", maxBenefit: "₹78,000 CFA Direct Transfer", beneficiaries: "1.2 Crore" },
    { id: "SCH-02", name: "PM Kisan Samman Nidhi", ministry: "Ministry of Agriculture", maxBenefit: "₹6,000 / Year", beneficiaries: "9.5 Crore" },
    { id: "SCH-03", name: "Ayushman Bharat PM-JAY", ministry: "Ministry of Health", maxBenefit: "₹5,00,000 Free Hospitalization", beneficiaries: "55 Crore" },
    { id: "SCH-04", name: "PM SVANidhi Micro-Credit", ministry: "MoHUA", maxBenefit: "₹50,000 Collateral-Free", beneficiaries: "68 Lakh" }
  ],
  verifications: [
    { id: "VER-901", citizenName: "Mahesh Chandra", scheme: "PM SVANidhi", status: "VERIFIED", timestamp: new Date().toISOString() }
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
    return res.end(JSON.stringify({ service: "GovAI Citizen Services", port: PORT, status: "ONLINE", totalSchemes: db.schemes.length }));
  }

  if (url.pathname === "/api/schemes" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.schemes));
  }

  if (url.pathname === "/api/verify" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const rec = {
        id: `VER-${Date.now().toString().slice(-3)}`,
        citizenName: data.name || "Citizen",
        scheme: data.scheme || "General Citizen Scheme",
        status: "VERIFIED",
        timestamp: new Date().toISOString()
      };
      db.verifications.unshift(rec);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rec));
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
  res.end(JSON.stringify({ error: "Not found in GovAI Services" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🏛️ GovAI Citizen Services running on http://localhost:${PORT}`));
}
