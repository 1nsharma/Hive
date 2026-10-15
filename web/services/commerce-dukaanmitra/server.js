import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  invoices: [
    {
      id: "INV-9021",
      customerName: "Ramesh Kirana",
      phone: "9829011223",
      items: [{ name: "Tata Salt 1kg", qty: 2, price: 28 }, { name: "Fortune Oil 1L", qty: 1, price: 165 }],
      total: 221,
      isUdhar: false,
      timestamp: new Date().toISOString()
    }
  ],
  customers: [
    { name: "Ramesh Kirana", phone: "9829011223", balance: 0 },
    { name: "Suresh Sharma", phone: "9829044556", balance: 450 },
    { name: "Gupta Ji General Store", phone: "9829077889", balance: 1200 }
  ],
  inventory: [
    { id: 1, name: "Amul Taaza Milk 500ml", stock: 45, price: 33 },
    { id: 2, name: "Maggi 2-Minute Noodles", stock: 120, price: 14 },
    { id: 3, name: "Fortune Chakki Atta 10kg", stock: 18, price: 380 },
    { id: 4, name: "Sugar Premium 1kg", stock: 60, price: 44 }
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
    return res.end(JSON.stringify({ service: "DukaanMitra OS", port: PORT, status: "ONLINE", totalInvoices: db.invoices.length }));
  }

  if (url.pathname === "/api/invoices" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.invoices));
  }

  if (url.pathname === "/api/customers" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.customers));
  }

  if (url.pathname === "/api/inventory" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.inventory));
  }

  if (url.pathname === "/api/order" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const isUdhar = data.isUdhar === true;
      const inv = {
        id: `INV-${Date.now().toString().slice(-4)}`,
        customerName: data.customerName || "Walk-in Customer",
        phone: data.phone || "9829000000",
        items: data.items || [{ name: "General Groceries", qty: 1, price: 100 }],
        total: data.total || 100,
        isUdhar,
        timestamp: new Date().toISOString()
      };
      db.invoices.unshift(inv);
      if (isUdhar) {
        let cust = db.customers.find(c => c.name.toLowerCase() === inv.customerName.toLowerCase());
        if (cust) cust.balance += inv.total;
        else db.customers.push({ name: inv.customerName, phone: inv.phone, balance: inv.total });
      }
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(inv));
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
  res.end(JSON.stringify({ error: "Not found in DukaanMitra OS" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🏪 DukaanMitra OS running on http://localhost:${PORT}`));
}
