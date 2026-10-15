import fs from 'fs';
let content = fs.readFileSync('src/components/InventoryTab.tsx', 'utf-8');

// Remove AI buttons
// "AI Catalog" button:
const catalogBtnRegex = /<button[^>]*onClick=\{\(\) => setShowAICatalogModal\(true\)\}[^>]*>[\s\S]*?<\/button>/;
content = content.replace(catalogBtnRegex, '');

// "AI Auto-Fill" button:
const autoFillBtnRegex = /<button type="button" onClick=\{handleAILookup\}.*?<\/button>/;
content = content.replace(autoFillBtnRegex, '');

fs.writeFileSync('src/components/InventoryTab.tsx', content);
