const fs = require('fs');
let code = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf8');

const regex = /<motion\.button[\s\S]*?Talk to AI\s*<\/motion\.button>/;
code = code.replace(regex, '');

fs.writeFileSync('src/components/WorkspaceOS.tsx', code);
