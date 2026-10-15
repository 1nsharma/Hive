import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /console.error\("WhatsApp Simulate Error:", error\);/g,
  `console.error("WhatsApp Simulate Error Stack:", error.stack);`
);
fs.writeFileSync('server.ts', content);
