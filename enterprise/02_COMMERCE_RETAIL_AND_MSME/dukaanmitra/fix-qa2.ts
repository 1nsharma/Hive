import fs from 'fs';
let content = fs.readFileSync('src/agents/qa-pipeline.ts', 'utf-8');

content = content.replace(
  /globalEventBus\.subscribe\('CODE_PROPOSED' as any, async \(event\) => \{/g,
  `globalEventBus.subscribe('CODE_PROPOSED' as any, async (event: any) => {`
);

content = content.replace(
  /globalEventBus\.subscribe\('SYSTEM_ANOMALY' as any, async \(event\) => \{/g,
  `globalEventBus.subscribe('SYSTEM_ANOMALY' as any, async (event: any) => {`
);

fs.writeFileSync('src/agents/qa-pipeline.ts', content);
