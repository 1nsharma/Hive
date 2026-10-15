import fs from 'fs';
let content = fs.readFileSync('src/components/InventoryTab.tsx', 'utf-8');

// Replace standard plain look with sleek cards in Inventory
content = content.replace(
  /className="bg-white border border-slate-200 rounded-2xl p-4"/g,
  'className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"'
);

content = content.replace(
  /className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"/g,
  'className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors absolute top-4 right-4 opacity-0 group-hover:opacity-100"'
);

fs.writeFileSync('src/components/InventoryTab.tsx', content);
