import fs from 'fs';
let content = fs.readFileSync('src/agents/qa-pipeline.ts', 'utf-8');

content = content.replace(
  `import { DomainEvent } from '../os-core/domain-events.js';`,
  `import { DomainEvent, OSEvent } from '../os-core/domain-events.js';`
);

content = content.replace(
  `globalEventBus.publish(reviewEvent);`,
  `globalEventBus.publish(reviewEvent as any);`
);

content = content.replace(
  `globalEventBus.publish(testEvent);`,
  `globalEventBus.publish(testEvent as any);`
);

content = content.replace(
  `globalEventBus.publish(chaosEvent);`,
  `globalEventBus.publish(chaosEvent as any);`
);

content = content.replace(
  `globalEventBus.publish(anomalyEvent);`,
  `globalEventBus.publish(anomalyEvent as any);`
);

content = content.replace(
  `globalEventBus.publish(fixEvent);`,
  `globalEventBus.publish(fixEvent as any);`
);

fs.writeFileSync('src/agents/qa-pipeline.ts', content);
