#!/usr/bin/env bash
# ==============================================================================
# Aemy AI Studio — Model Context Protocol (MCP) Terminal Auto-Installer
# Director: Amit Sharma
# Positioning: AI • Human Intelligence • Future Systems
# ==============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

SERVER_URL="${AEMY_SERVER_URL:-https://ais-dev-77jfhcyuqptwgreoonzm4r-439336978771.asia-southeast1.run.app}"
MCP_ENDPOINT="${SERVER_URL}/api/mcp"

echo -e "${CYAN}${BOLD}"
cat << "EOF"
   ___                       _   ___   ____  _             _ _       
  / _ \                     | |_/ _ \ / ___|| |_ _   _  __| (_) ___  
 / /_\ \ ___ _ __ ___  _   _| __| | | \___ \| __| | | |/ _` | |/ _ \ 
 |  _  |/ _ \ '_ ` _ \| | | | |_| |_| |___) | |_| |_| | (_| | | (_) |
 |_| |_|\___/_| |_| |_|\__, |\__|\___/|____/ \__|\__,_|\__,_|_|\___/ 
                        |___/                                        
 Aemy AI Studio MCP Auto-Installer (by Amit Sharma)
 AI • Human Intelligence • Future Systems
EOF
echo -e "${NC}"

echo -e "${BLUE}==>${NC} Starting automated installation for Aemy AI Studio MCP Server..."
echo -e "${BLUE}==>${NC} Server endpoint: ${BOLD}${MCP_ENDPOINT}${NC}"

# Detect OS
OS_NAME="$(uname -s)"
CONFIG_DIR=""
CONFIG_FILE=""

case "${OS_NAME}" in
  Darwin*)
    OS_TYPE="macOS"
    CONFIG_DIR="$HOME/Library/Application Support/Claude"
    CONFIG_FILE="${CONFIG_DIR}/claude_desktop_config.json"
    ;;
  Linux*)
    OS_TYPE="Linux"
    XDG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}"
    CONFIG_DIR="${XDG_DIR}/Claude"
    CONFIG_FILE="${CONFIG_DIR}/claude_desktop_config.json"
    ;;
  MINGW*|MSYS*|CYGWIN*)
    OS_TYPE="Windows"
    if [ -n "$APPDATA" ]; then
      CONFIG_DIR="$APPDATA/Claude"
    else
      CONFIG_DIR="$USERPROFILE/AppData/Roaming/Claude"
    fi
    CONFIG_FILE="${CONFIG_DIR}/claude_desktop_config.json"
    ;;
  *)
    OS_TYPE="Unix/Other (${OS_NAME})"
    CONFIG_DIR="$HOME/.config/Claude"
    CONFIG_FILE="${CONFIG_DIR}/claude_desktop_config.json"
    ;;
esac

echo -e "${GREEN}[✓]${NC} Detected platform: ${BOLD}${OS_TYPE}${NC}"
echo -e "${BLUE}==>${NC} Target Claude Desktop configuration: ${BOLD}${CONFIG_FILE}${NC}"

mkdir -p "${CONFIG_DIR}"

# Backup existing config if present
if [ -f "${CONFIG_FILE}" ]; then
  BACKUP_FILE="${CONFIG_FILE}.bak.$(date +%s)"
  cp "${CONFIG_FILE}" "${BACKUP_FILE}"
  echo -e "${GREEN}[✓]${NC} Created backup of existing configuration: ${BACKUP_FILE}"
fi

# Merge configuration safely using Python 3, Node.js, or direct write
MERGE_SUCCESS=0

if command -v python3 >/dev/null 2>&1; then
  python3 - << PYEOF
import json, os, sys

config_path = os.path.expanduser("${CONFIG_FILE}")
server_url = "${SERVER_URL}"

data = {}
if os.path.exists(config_path):
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        data = {}

if not isinstance(data, dict):
    data = {}

if "mcpServers" not in data or not isinstance(data["mcpServers"], dict):
    data["mcpServers"] = {}

data["mcpServers"]["aemy-ai-studio"] = {
    "url": server_url + "/api/mcp",
    "headers": {
        "Content-Type": "application/json"
    }
}

with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Merged configuration successfully via Python 3.")
PYEOF
  MERGE_SUCCESS=1
elif command -v node >/dev/null 2>&1; then
  node -e "
const fs = require('fs');
const configPath = '${CONFIG_FILE}';
const serverUrl = '${SERVER_URL}';
let data = {};
if (fs.existsSync(configPath)) {
  try { data = JSON.parse(fs.readFileSync(configPath, 'utf8')); } catch (e) { data = {}; }
}
if (!data.mcpServers || typeof data.mcpServers !== 'object') data.mcpServers = {};
data.mcpServers['aemy-ai-studio'] = {
  url: serverUrl + '/api/mcp',
  headers: { 'Content-Type': 'application/json' }
};
fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
console.log('Merged configuration successfully via Node.js.');
"
  MERGE_SUCCESS=1
else
  cat > "${CONFIG_FILE}" << EOFJSON
{
  "mcpServers": {
    "aemy-ai-studio": {
      "url": "${MCP_ENDPOINT}",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}
EOFJSON
  MERGE_SUCCESS=1
fi

# Cursor IDE configuration check
CURSOR_DIR="$HOME/.cursor"
if [ -d "${CURSOR_DIR}" ]; then
  echo -e "${BLUE}==>${NC} Detected Cursor IDE environment. Updating Cursor MCP config..."
  if command -v python3 >/dev/null 2>&1; then
    python3 - << PYEOF
import json, os
cursor_path = os.path.expanduser("~/.cursor/mcp.json")
data = {}
if os.path.exists(cursor_path):
    try:
        with open(cursor_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        data = {}
if "mcpServers" not in data or not isinstance(data["mcpServers"], dict):
    data["mcpServers"] = {}
data["mcpServers"]["aemy-ai-studio"] = {
    "url": "${MCP_ENDPOINT}",
    "headers": { "Content-Type": "application/json" }
}
try:
    with open(cursor_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Cursor MCP configured.")
except Exception:
    pass
PYEOF
  fi
fi

if [ "${MERGE_SUCCESS}" -eq 1 ]; then
  echo -e "${GREEN}${BOLD}[✓] Successfully installed Aemy AI Studio MCP Server into Claude Desktop!${NC}"
fi

echo ""
echo -e "${CYAN}========================================================================${NC}"
echo -e "${GREEN}${BOLD}AEMY AI STUDIO MCP AUTO-INSTALLATION COMPLETE${NC}"
echo -e "${CYAN}========================================================================${NC}"
echo -e "Registered Server:  ${BOLD}aemy-ai-studio${NC}"
echo -e "Protocol Version:   ${BOLD}2024-11-05 (JSON-RPC 2.0)${NC}"
echo -e "Tools Enabled:      ${BOLD}7 Production Epistemic Tools${NC}"
echo -e "  1. syndicate_to_social         - Broadcast to X, LinkedIn, YouTube, Substack, GitHub"
echo -e "  2. query_research_playbook     - 8-step epistemic scientific protocol"
echo -e "  3. steelman_counter_challenge  - Epistemic devil's advocate & falsification tests"
echo -e "  4. generate_content_funnel     - Multi-platform intellectual cascading"
echo -e "  5. simulate_agent_sandbox      - Mechanistic explainability & human agency scoring"
echo -e "  6. search_publications         - 7 research series & 12-chapter monograph canon"
echo -e "  7. get_brand_manifesto         - Director Amit Sharma, positioning & 5 wings"
echo -e ""
echo -e "${YELLOW}${BOLD}NEXT STEPS TO ACTIVATE:${NC}"
echo -e "1. Completely restart Claude Desktop (Cmd+Q on macOS, or close and restart on Windows)."
echo -e "2. Open Claude and look for the ${BOLD}hammer icon (🔨)${NC} in the chat input."
echo -e "3. Try asking: ${CYAN}\"What does Aemy AI Studio research say about human agency?\"${NC}"
echo -e "${CYAN}========================================================================${NC}"
