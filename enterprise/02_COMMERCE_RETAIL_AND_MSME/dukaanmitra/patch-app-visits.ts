import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add import for VisitsTab
content = content.replace(
  'import SettingsTab from "./components/SettingsTab";',
  'import SettingsTab from "./components/SettingsTab";\nimport VisitsTab from "./components/VisitsTab";'
);

// 2. Add VisitsTab to switch
const renderVisits = `
            {activeTab === "visits" && (
              <VisitsTab
                transactions={transactions}
                customers={customers}
              />
            )}
`;
content = content.replace(
  '{activeTab === "settings" && (',
  renderVisits.trim() + '\n            {activeTab === "settings" && ('
);

fs.writeFileSync('src/App.tsx', content);
