const fs = require('fs');
const path = require('path');

const features = {
  auth: ['LoginScreen.tsx', 'OnboardingWizard.tsx'],
  dashboard: ['WorkspaceOS.tsx', 'ShopHeader.tsx', 'Omnibar.tsx', 'UniversalDataEntry.tsx'],
  pos: ['POSTab.tsx'],
  inventory: ['InventoryTab.tsx'],
  ledger: ['LedgerTab.tsx'],
  reports: ['ReportsTab.tsx'],
  settings: ['SettingsTab.tsx'],
  staff: ['StaffTab.tsx', 'VisitsTab.tsx'],
  whatsapp: ['WhatsAppConnection.tsx', 'WhatsAppOrders.tsx'],
  admin: ['AdminConsole.tsx']
};

for (const feature of Object.keys(features)) {
  fs.mkdirSync(`src/features/${feature}`, { recursive: true });
}

for (const [feature, files] of Object.entries(features)) {
  for (const file of files) {
    const oldPath = `src/components/${file}`;
    const newPath = `src/features/${feature}/${file}`;
    if (fs.existsSync(oldPath)) {
      let content = fs.readFileSync(oldPath, 'utf8');
      
      content = content.replace(/from "\.\.\/utils/g, 'from "../../utils');
      content = content.replace(/from "\.\.\/types/g, 'from "../../types');
      content = content.replace(/from "\.\.\/firebase/g, 'from "../../firebase');
      
      fs.writeFileSync(newPath, content);
      fs.unlinkSync(oldPath);
    }
  }
}

let appContent = fs.readFileSync('src/App.tsx', 'utf8');
for (const [feature, files] of Object.entries(features)) {
  for (const file of files) {
    const componentName = file.replace('.tsx', '');
    const regex = new RegExp(`from "\\./components/${componentName}"`);
    appContent = appContent.replace(regex, `from "./features/${feature}/${componentName}"`);
  }
}
fs.writeFileSync('src/App.tsx', appContent);
console.log("Refactored to feature directories.");
