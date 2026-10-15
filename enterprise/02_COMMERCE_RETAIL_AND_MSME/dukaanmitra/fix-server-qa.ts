import fs from 'fs';
let serverCode = fs.readFileSync('server.ts', 'utf-8');

if (!serverCode.includes('initializeQAPipeline')) {
  serverCode = serverCode.replace(
    /import \{ initializeDatabaseIntegration \} from '\.\/src\/os-core\/os-database-integration\.js';/,
    `import { initializeDatabaseIntegration } from './src/os-core/os-database-integration.js';\nimport { initializeQAPipeline } from './src/agents/qa-pipeline.js';`
  );

  serverCode = serverCode.replace(
    /initializeDatabaseIntegration\(\);/,
    `initializeDatabaseIntegration();\n  initializeQAPipeline();`
  );

  fs.writeFileSync('server.ts', serverCode);
}
