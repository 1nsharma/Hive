#!/usr/bin/env node
/**
 * PetJanu Code Connect CLI & Agent Client
 * 
 * Interacts directly with the PetJanu MCP engine, testing connectivity,
 * listing tools, and invoking agentic workflows directly from terminal or code.
 * 
 * Usage:
 *   node scripts/code-connect.cjs ping
 *   node scripts/code-connect.cjs list
 *   node scripts/code-connect.cjs call <toolName> [jsonArgs]
 */

const http = require('http');

const PORTS = [
  process.env.PORT ? parseInt(process.env.PORT, 10) : null,
  3001,
  3000
].filter(Boolean);

const INTERNAL_SECRET = process.env.INTERNAL_MCP_SECRET || 'petjanu-internal-secret';

function requestMcp(port, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: '/api/v1/mcp/rpc',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'x-mcp-internal-token': INTERNAL_SECRET,
        'x-mcp-client': 'petjanu-code-connect-cli'
      },
      timeout: 3000
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: { message: body || 'Non-JSON response' } });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Connection timed out'));
    });
    req.write(data);
    req.end();
  });
}

async function runMcpRequest(payload) {
  for (const port of PORTS) {
    try {
      const res = await requestMcp(port, payload);
      if (res) return { port, res };
    } catch (_) {}
  }
  throw new Error(`Failed to connect to PetJanu engine on ports: ${PORTS.join(', ')}`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'ping';

  console.log(`🔌 [PetJanu Code Connect] Connecting to engine...`);

  try {
    if (command === 'ping') {
      const { port, res } = await runMcpRequest({ jsonrpc: "2.0", id: 1, method: "ping" });
      console.log(`✅ Connected on port ${port}!`);
      console.log(JSON.stringify(res, null, 2));
    } else if (command === 'list' || command === 'tools') {
      const { port, res } = await runMcpRequest({ jsonrpc: "2.0", id: 2, method: "tools/list" });
      console.log(`✅ Retrieved tools from port ${port}:`);
      const tools = res.result?.tools || [];
      console.table(tools.map(t => ({ Name: t.name, Description: t.description.substring(0, 60) + '...' })));
    } else if (command === 'call') {
      const toolName = args[1];
      if (!toolName) {
        console.error('❌ Missing tool name. Usage: node scripts/code-connect.cjs call <toolName> [jsonArgs]');
        process.exit(1);
      }
      const rawArgs = args[2] || '{}';
      let toolArgs = {};
      try {
        toolArgs = JSON.parse(rawArgs);
      } catch (e) {
        console.error('❌ Invalid JSON arguments:', rawArgs);
        process.exit(1);
      }

      console.log(`⚡ Invoking tool: ${toolName}...`);
      const { port, res } = await runMcpRequest({
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: toolName, arguments: toolArgs }
      });
      console.log(`✅ Response from port ${port}:`);
      console.log(JSON.stringify(res, null, 2));
    } else {
      console.log(`Unknown command: ${command}. Available commands: ping, list, call`);
    }
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runMcpRequest };
