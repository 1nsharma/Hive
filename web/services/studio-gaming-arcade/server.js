import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = 3006;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = {
  games: [
    { id: "GAME-01", title: "Gilli Danda 3D Legends", genre: "Heritage Sports", dailyActive: "142K", status: "LIVE" },
    { id: "GAME-02", title: "Kancha Marble Masters", genre: "Physics Arcade", dailyActive: "89K", status: "LIVE" },
    { id: "GAME-03", title: "Kabaddi Clash Real-Time", genre: "Multiplayer PvP", dailyActive: "215K", status: "LIVE" },
    { id: "GAME-04", title: "Chor Police Highway Chase", genre: "Endless Runner", dailyActive: "64K", status: "STAGING" }
  ],
  trends: [
    { tag: "Desi Nostalgia Gaming", momentum: "+48%", viralScore: 94 },
    { tag: "Tier-2/3 Regional Audio Commentary", momentum: "+62%", viralScore: 98 },
    { tag: "Micro-Tournament In-App Rewards", momentum: "+35%", viralScore: 88 }
  ],
  liveOpsEvents: [
    { title: "Diwali Mahayuddh Tournament", rewardPool: "₹5,00,000", status: "ACTIVE" },
    { title: "Weekend Gilli Danda Knockout", rewardPool: "₹50,000", status: "SCHEDULED" }
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
    return res.end(JSON.stringify({ service: "Desi Arcade Gaming Studio", port: PORT, status: "ONLINE", liveGames: db.games.length }));
  }

  if (url.pathname === "/api/games" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.games));
  }

  if (url.pathname === "/api/trends" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(db.trends));
  }

  if (url.pathname === "/api/synthesize" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");
      const newGame = {
        id: `GAME-${Date.now().toString().slice(-2)}`,
        title: data.title || "Ludo Desi League",
        genre: data.genre || "Casual Board",
        dailyActive: "0 (New Release)",
        status: "GENERATED_BY_AI"
      };
      db.games.push(newGame);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newGame));
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
  res.end(JSON.stringify({ error: "Not found in Gaming Arcade Studio" }));
});

export { server, db, PORT };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => console.log(`🎮 Desi Arcade Gaming Studio running on http://localhost:${PORT}`));
}
