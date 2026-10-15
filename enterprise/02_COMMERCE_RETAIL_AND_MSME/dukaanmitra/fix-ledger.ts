import fs from 'fs';
let content = fs.readFileSync('src/components/LedgerTab.tsx', 'utf-8');

// Replace standard plain look with sleek cards in Ledger
content = content.replace(
  /className="bg-white border border-slate-200 rounded-2xl p-4"/g,
  'className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"'
);

fs.writeFileSync('src/components/LedgerTab.tsx', content);
