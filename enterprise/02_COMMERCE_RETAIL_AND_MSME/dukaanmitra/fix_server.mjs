import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

// The bad line is:
// Return a valid JSON object matching exactly this schema (do NOT include markdown wrappers like ```json):

code = code.replace(/wrappers like ```json\):/g, 'wrappers like JSON format codes):');
code = code.replace(/```json/g, 'JSON format codes');

fs.writeFileSync('server.ts', code);
