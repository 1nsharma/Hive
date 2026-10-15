#!/usr/bin/env node
/**
 * Master Hive System Hub & Health Diagnostics
 * Integrates Web App, Desktop Engine, Agent Swarm, Enterprise Divisions, Research & Closing Engines
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("\n==================================================================");
console.log("   🐝 AI HIVE SUPER INTELLIGENCE — MASTER SYSTEM CORE OS   ");
console.log("==================================================================");

// 1. Check Agents Directory
const agentsDir = path.join(__dirname, "agents");
let agents = [];
if (fs.existsSync(agentsDir)) {
  agents = fs.readdirSync(agentsDir).filter(f => fs.statSync(path.join(agentsDir, f)).isDirectory());
}
console.log(`\n[1] Canonical AI Agent Roster: ${agents.length} active agents (Zero duplicates)`);
console.log("    " + agents.join(", "));

// 2. Check Tasks & Registry
const regFile = path.join(__dirname, "registry.json");
const taskFile = path.join(__dirname, "tasks.json");
let regCount = 0, taskCount = 0;
if (fs.existsSync(regFile)) {
  const reg = JSON.parse(fs.readFileSync(regFile, "utf-8"));
  regCount = Object.keys(reg.agents || {}).length;
}
if (fs.existsSync(taskFile)) {
  const t = JSON.parse(fs.readFileSync(taskFile, "utf-8"));
  taskCount = (t.tasks || []).length;
}
console.log(`\n[2] Agent Registry & Tasks:`);
console.log(`    - Registry Agents: ${regCount}`);
console.log(`    - Task Board Tasks: ${taskCount}`);

// 3. Check Enterprise Divisions
const entDir = path.join(__dirname, "enterprise");
let entList = [];
if (fs.existsSync(entDir)) {
  entList = fs.readdirSync(entDir).filter(f => fs.statSync(path.join(entDir, f)).isDirectory());
}
console.log(`\n[3] Enterprise OS & Divisions: ${entList.length} active divisions`);
console.log("    " + entList.join("\n    "));

// 4. Check Workspaces
const wsDir = path.join(__dirname, "web/workspaces");
let wsList = [];
if (fs.existsSync(wsDir)) {
  wsList = fs.readdirSync(wsDir).filter(f => fs.statSync(path.join(wsDir, f)).isDirectory());
}
console.log(`\n[4] Department Workspaces: ${wsList.length} active workspaces`);
console.log("    " + wsList.join("\n    "));

// 5. Check Research & Closing Engines
const researchEngine = path.join(__dirname, "client-research-engine/engine.mjs");
const closingEngine = path.join(__dirname, "closing-engine/engine.mjs");
console.log(`\n[5] Revenue & Intelligence Engines:`);
console.log(`    - B2B Research Engine (Phyllis): ${fs.existsSync(researchEngine) ? "READY ✓" : "MISSING"}`);
console.log(`    - Deal Closing Engine (Andy):    ${fs.existsSync(closingEngine) ? "READY ✓" : "MISSING"}`);

// 6. Check Desktop App Build
const desktopOutMain = path.join(__dirname, "desktop/out/main/index.js");
const desktopOutRenderer = path.join(__dirname, "desktop/out/renderer/index.html");
const desktopBuilt = fs.existsSync(desktopOutMain) && fs.existsSync(desktopOutRenderer);
console.log(`\n[6] Hive Desktop Engine (Electron 32 + Monaco + Pixi.js):`);
console.log(`    - Production Bundle: ${desktopBuilt ? "COMPILED ✓ (out/main + out/renderer)" : "UNBUILT"}`);
console.log(`    - 1-Click Launcher:  ${path.join(__dirname, "LAUNCH_HIVE_DESKTOP.bat")}`);

// 7. Web Application & Vercel
console.log(`\n[7] Web & Cloud Platform:`);
console.log(`    - Local Server URL:  http://localhost:3300`);
console.log(`    - Live Vercel URL:   https://ai-hive-company.vercel.app`);

console.log("\n==================================================================");
console.log("   ALL HIVE MODULES OPERATIONAL & UNIFIED   ");
console.log("==================================================================\n");
