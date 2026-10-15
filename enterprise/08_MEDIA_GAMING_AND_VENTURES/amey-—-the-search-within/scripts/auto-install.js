#!/usr/bin/env node
/**
 * Aemy AI Studio — Model Context Protocol (MCP) Cross-Platform Auto-Installer
 * Director: Amit Sharma
 * Positioning: AI • Human Intelligence • Future Systems
 *
 * Automatically installs and configures Aemy AI Studio MCP Server for:
 * - Claude Desktop (macOS, Windows, Linux)
 * - Cursor IDE (~/.cursor/mcp.json)
 * - VS Code / Cline / Roo Code
 * - Windsurf IDE
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import http from 'http';
import https from 'https';

const DEFAULT_SERVER_URL = process.env.AEMY_SERVER_URL || 'http://localhost:3000';
const MCP_ENDPOINT = `${DEFAULT_SERVER_URL}/api/mcp`;

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function log(msg) {
  console.log(msg);
}

function banner() {
  log(`${colors.cyan}${colors.bold}`);
  log(`   ___                       _   ___   ____  _             _ _       `);
  log(`  / _ \\                     | |_/ _ \\ / ___|| |_ _   _  __| (_) ___  `);
  log(` / /_\\ \\ ___ _ __ ___  _   _| __| | | \\___ \\| __| | | |/ _\` | |/ _ \\ `);
  log(` |  _  |/ _ \\ '_ \` _ \\| | | | |_| |_| |___) | |_| |_| | (_| | | (_) |`);
  log(` |_| |_|\\___/_| |_| |_|\\__, |\\__|\\___/|____/ \\__|\\__,_|\\__,_|_|\\___/ `);
  log(`                        |___/                                        `);
  log(` Aemy AI Studio — Model Context Protocol Auto-Installer`);
  log(` Research Director: Amit Sharma | Epistemic Framework & Social Connectors`);
  log(`${colors.reset}`);
}

function getClaudeConfigPath() {
  const home = os.homedir();
  const platform = os.platform();

  if (platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    return path.join(appData, 'Claude', 'claude_desktop_config.json');
  } else {
    const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    return path.join(xdgConfig, 'Claude', 'claude_desktop_config.json');
  }
}

function getCursorConfigPath() {
  const home = os.homedir();
  return path.join(home, '.cursor', 'mcp.json');
}

function getWindsurfConfigPath() {
  const home = os.homedir();
  return path.join(home, '.codeium', 'windsurf', 'mcp_config.json');
}

function safelyMergeConfig(filePath, newServerConfig, serverKey = 'aemy-ai-studio') {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let existingData = {};
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        existingData = JSON.parse(raw);
        // Backup
        const backupPath = `${filePath}.bak.${Date.now()}`;
        fs.writeFileSync(backupPath, raw, 'utf8');
        log(`  ${colors.dim}[backup] Saved existing configuration to: ${path.basename(backupPath)}${colors.reset}`);
      } catch (parseErr) {
        log(`  ${colors.yellow}[warn] Could not parse existing JSON in ${filePath}. Initializing fresh.${colors.reset}`);
        existingData = {};
      }
    }

    if (!existingData || typeof existingData !== 'object' || Array.isArray(existingData)) {
      existingData = {};
    }

    if (!existingData.mcpServers || typeof existingData.mcpServers !== 'object') {
      existingData.mcpServers = {};
    }

    existingData.mcpServers[serverKey] = newServerConfig;

    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message, filePath };
  }
}

async function verifyServerOnline(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const client = parsed.protocol === 'https:' ? https : http;
      const req = client.get(`${parsed.origin}/api/health`, { timeout: 2500 }, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

async function run() {
  banner();

  log(`${colors.blue}==>${colors.reset} Platform detected: ${colors.bold}${os.platform()} (${os.arch()})${colors.reset}`);
  log(`${colors.blue}==>${colors.reset} Target Aemy MCP Server Endpoint: ${colors.cyan}${colors.bold}${MCP_ENDPOINT}${colors.reset}\n`);

  const serverOnline = await verifyServerOnline(DEFAULT_SERVER_URL);
  if (serverOnline) {
    log(`  ${colors.green}[✓] Aemy AI Studio server is reachable & responsive.${colors.reset}`);
  } else {
    log(`  ${colors.dim}[i] Server not currently responding locally at ${DEFAULT_SERVER_URL}. (Config will still be installed for when server runs)${colors.reset}`);
  }

  log(`\n${colors.bold}Installing client configurations:${colors.reset}`);

  // 1. Claude Desktop
  const claudePath = getClaudeConfigPath();
  const claudeConfig = {
    url: MCP_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const claudeResult = safelyMergeConfig(claudePath, claudeConfig);
  if (claudeResult.success) {
    log(`  ${colors.green}[✓] Claude Desktop configured successfully!${colors.reset}`);
    log(`      Location: ${colors.dim}${claudeResult.filePath}${colors.reset}`);
  } else {
    log(`  ${colors.red}[✗] Failed to configure Claude Desktop: ${claudeResult.error}${colors.reset}`);
  }

  // 2. Cursor IDE
  const cursorPath = getCursorConfigPath();
  const cursorConfig = {
    url: MCP_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const cursorResult = safelyMergeConfig(cursorPath, cursorConfig);
  if (cursorResult.success) {
    log(`  ${colors.green}[✓] Cursor IDE MCP configured successfully!${colors.reset}`);
    log(`      Location: ${colors.dim}${cursorResult.filePath}${colors.reset}`);
  } else {
    log(`  ${colors.dim}[i] Cursor IDE skipped or not yet installed on this machine.${colors.reset}`);
  }

  // 3. Windsurf
  const windsurfPath = getWindsurfConfigPath();
  const windsurfResult = safelyMergeConfig(windsurfPath, cursorConfig);
  if (windsurfResult.success && fs.existsSync(path.dirname(windsurfPath))) {
    log(`  ${colors.green}[✓] Windsurf IDE configured successfully!${colors.reset}`);
    log(`      Location: ${colors.dim}${windsurfResult.filePath}${colors.reset}`);
  }

  log(`\n${colors.cyan}========================================================================${colors.reset}`);
  log(`${colors.green}${colors.bold}AEMY AI STUDIO AUTO-INSTALLATION COMPLETE${colors.reset}`);
  log(`${colors.cyan}========================================================================${colors.reset}`);
  log(`Registered Tools:`);
  log(`  1. syndicate_to_social         (X, LinkedIn, YouTube, Substack, GitHub)`);
  log(`  2. query_research_playbook     (8-step epistemic scientific protocol)`);
  log(`  3. steelman_counter_challenge  (Epistemic devil's advocate & falsification tests)`);
  log(`  4. generate_content_funnel     (Multi-platform intellectual cascading)`);
  log(`  5. simulate_agent_sandbox      (Mechanistic explainability & human agency score)`);
  log(`  6. search_publications         (7 research series & 12-chapter monograph)`);
  log(`  7. get_brand_manifesto         (Amit Sharma, 5 wings, mission & manifesto)`);
  log(`\n${colors.yellow}${colors.bold}NEXT STEPS:${colors.reset}`);
  log(`1. Restart Claude Desktop completely (Quit and reopen).`);
  log(`2. In Claude Desktop, check the hammer icon (🔨) for tools.`);
  log(`3. Start exploring: "What does Aemy AI Studio research say about human agency?"`);
  log(`${colors.cyan}========================================================================${colors.reset}\n`);
}

run().catch((err) => {
  console.error('Auto-installer error:', err);
  process.exit(1);
});
