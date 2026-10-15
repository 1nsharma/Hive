import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3008;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  consultations: [
    { id: "PET-101", petName: "Bruno (Golden Retriever)", ownerName: "Vikram Mehta", issue: "Lethargy & low appetite", assignedVet: "Dr. Ananya Sharma (BVSc)", status: "SCHEDULED", timestamp: new Date().toISOString() }
  ],
  vets: [
    { name: "Dr. Ananya Sharma", specialization: "Canine Nutrition & Surgery", clinic: "PetsJanu Care Center Jaipur", rating: 4.9 },
    { name: "Dr. Rohit Mathur", specialization: "Emergency Feline Medicine", clinic: "Metro 24x7 Vet Clinic", rating: 4.8 }
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
    return res.end(JSON.stringify({ service: "PetsJanu Veterinary Care", port: PORT, status: "ONLINE", totalConsults: db.consultations.length }));
  }

  if (url.pathname === "/api/consultations" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.consultations));
  }

  if (url.pathname === "/api/vets" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.vets));
  }

  if (url.pathname === "/api/book" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const c = {
        id: `PET-${Date.now().toString().slice(-3)}`,
        petName: data.petName || "Pet",
        ownerName: data.ownerName || "Pet Parent",
        issue: data.issue || "General Checkup",
        assignedVet: db.vets[0].name,
        status: "SCHEDULED",
        timestamp: new Date().toISOString()
      };
      db.consultations.unshift(c);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(c));
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
  res.end(JSON.stringify({ error: "Not found in PetsJanu Care" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🐾 PetsJanu Care running on http://localhost:${PORT}`));
}
