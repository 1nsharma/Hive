const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `{activeTab === "ai_ocr" && (\n                user={user}\n                customers={customers}\n                products={products}\n                onRefreshDB={handleRefreshDB}\n              />\n            )}`;
const replacementStr = `{activeTab === "ai_ocr" && (\n              <AIInput\n                user={user}\n                customers={customers}\n                products={products}\n                onRefreshDB={handleRefreshDB}\n              />\n            )}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched syntax error");
} else {
  console.log("Not found.");
}
