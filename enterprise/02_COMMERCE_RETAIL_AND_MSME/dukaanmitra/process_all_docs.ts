import fs from 'fs';
import path from 'path';
import { DomainEvent } from './src/os-core/domain-events.js';
import * as agents from './src/agents/index.js';

// Convert kebab-case or space separated to camelCase agent instance name
// e.g. "01. Strategy" -> strategyAgent
// "credentials-vault" -> credentialsVaultAgent
function getAgentName(folderName: string): string {
    const match = folderName.match(/^\d+\.\s+(.*)/);
    if (!match) return '';
    let name = match[1];
    name = name.replace(/\s+/g, '');
    return name.charAt(0).toLowerCase() + name.slice(1) + 'Agent';
}

async function run() {
    console.log("=== STARTING BAZAAR SYNC AGENT DEPLOYMENT ===");
    const dirs = fs.readdirSync('.', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && /^\d+\.\s+/.test(dirent.name))
        .map(dirent => dirent.name);

    for (const d of dirs) {
        const agentName = getAgentName(d);
        const agent = (agents as any)[agentName];
        if (!agent) {
            console.log(`[Warning] No agent instance found for ${d} (expected ${agentName})`);
            continue;
        }

        const files = fs.readdirSync(d).filter(f => f.endsWith('.md'));
        for (const f of files) {
            const content = fs.readFileSync(path.join(d, f), 'utf-8');
            const event: DomainEvent = {
                id: `evt_doc_${Date.now()}_${Math.random()}`,
                type: 'DOCUMENT_CREATED',
                tenantId: 'tenant_system',
                payload: {
                    category: d,
                    file: f,
                    content: content
                },
                timestamp: Date.now(),
                sourceId: 'system_initializer'
            };
            
            console.log(`Dispatching ${f} to ${agentName}...`);
            try {
                await agent.processDocument(event);
            } catch (e) {
                console.error(`Error processing ${f} with ${agentName}:`, e);
            }
        }
    }
    console.log("=== BAZAAR SYNC AGENT DEPLOYMENT COMPLETE ===");
}

run();
