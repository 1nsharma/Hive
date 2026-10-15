const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `onSettingsClick={() => setActiveTab("settings")}\n      />`;
const replacementStr = `onSettingsClick={() => setActiveTab("settings")}\n      />\n      {activeTab !== "ai_ocr" && <Omnibar customers={customers} products={products} transactions={transactions} onNavigate={setActiveTab} />}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched App.tsx with Omnibar successfully");
} else {
  console.log("Could not find target string in App.tsx");
}
