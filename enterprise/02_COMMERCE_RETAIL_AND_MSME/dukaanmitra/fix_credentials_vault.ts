import fs from 'fs';
import path from 'path';
import { DomainEvent } from './src/os-core/domain-events.js';
import * as agents from './src/agents/index.js';

async function run() {
    const d16 = "16. Credentials Vault";
    const d19 = "19. Meeting Notes";
    
    for (const d of [d16, d19]) {
        let agentName = "";
        if (d === d16) agentName = "credentialsVaultAgent";
        if (d === d19) agentName = "meetingNotesAgent";
        
        const agent = (agents as any)[agentName];
        if (!agent) {
            console.log(`Still missing ${agentName}`);
            continue;
        }
        
        const files = fs.readdirSync(d).filter(f => f.endsWith('.md'));
        for (const f of files) {
            const content = fs.readFileSync(path.join(d, f), 'utf-8');
            const event: DomainEvent = {
                id: `evt_doc_${Date.now()}_${Math.random()}`,
                type: 'DOCUMENT_CREATED',
                tenantId: 'tenant_system',
                payload: { category: d, file: f, content: content },
                timestamp: Date.now(),
                sourceId: 'system_initializer'
            };
            await agent.processDocument(event);
        }
    }
}
run();
