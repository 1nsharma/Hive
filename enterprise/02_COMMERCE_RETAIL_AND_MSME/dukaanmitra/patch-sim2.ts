import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');
content = content.replace(
  /if \(isRateLimit\(e\)\) \{/,
  "if (true) {"
);
fs.writeFileSync('server.ts', content);
