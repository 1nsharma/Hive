const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const fabCode = `onClick={() => setActiveTab("ai_ocr")}`;
code = code.replace(fabCode, `onClick={() => setActiveTab("dashboard")}`);

fs.writeFileSync('src/App.tsx', code);
