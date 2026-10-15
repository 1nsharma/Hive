import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SERVICES = [
  { name: "Commerce (DukaanMitra)", script: "services/commerce-dukaanmitra/server.js", port: 3001 },
  { name: "Logistics (TruckWala)", script: "services/logistics-truckwala/server.js", port: 3002 },
  { name: "CleanTech (SolarHub)", script: "services/cleantech-solarhub/server.js", port: 3003 },
  { name: "Talent (HireSaathi)", script: "services/talent-hiresaathi/server.js", port: 3004 },
  { name: "AI Agent Studio (JORVISH)", script: "services/studio-ai-agents/server.js", port: 3005 },
  { name: "Gaming (Desi Arcade)", script: "services/studio-gaming-arcade/server.js", port: 3006 },
  { name: "GovAI Central Services", script: "services/govtech-services/server.js", port: 3007 },
  { name: "Petcare (PetsJanu)", script: "services/petcare-petsjanu/server.js", port: 3008 },
  { name: "Master Gateway Shell", script: "gateway/gateway-server.js", port: 3000 }
];

console.log("======================================================");
console.log("   🚀 AEMY ENTERPRISE OS — MASTER ORCHESTRATOR       ");
console.log("   8 Full-Stack Services & Studios + Master Gateway    ");
console.log("======================================================\n");

const running = [];

for (const svc of SERVICES) {
  const fullPath = path.join(__dirname, svc.script);
  const child = spawn(process.execPath, [fullPath], {
    cwd: __dirname,
    stdio: ["ignore", "pipe", "pipe"]
  });

  child.stdout.on("data", d => console.log(`[${svc.name}] ${d.toString().trim()}`));
  child.stderr.on("data", d => console.error(`[${svc.name} ERR] ${d.toString().trim()}`));

  running.push({ ...svc, process: child });
}

console.log("\nAll 9 full-stack services & studios spawned successfully.");
console.log("👉 Master Enterprise Command Shell: http://localhost:3000");
console.log("👉 DukaanMitra OS (Port 3001): http://localhost:3001");
console.log("👉 TruckWala 24x7 (Port 3002): http://localhost:3002");
console.log("👉 SolarHub CleanTech (Port 3003): http://localhost:3003");
console.log("👉 HireSaathi AI (Port 3004): http://localhost:3004");
console.log("👉 AI Agent & JORVISH Studio (Port 3005): http://localhost:3005");
console.log("👉 Desi Arcade Gaming Studio (Port 3006): http://localhost:3006");
console.log("👉 GovAI India Central Portal (Port 3007): http://localhost:3007");
console.log("👉 PetsJanu Veterinary Hub (Port 3008): http://localhost:3008\n");

process.on("SIGINT", () => {
  console.log("\nGracefully shutting down all services...");
  running.forEach(s => s.process.kill());
  process.exit(0);
});
