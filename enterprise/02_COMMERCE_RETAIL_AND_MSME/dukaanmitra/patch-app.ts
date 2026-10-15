import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace standard container classes
content = content.replace(
  /<div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">/g,
  '<div className="h-screen w-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">'
);

// We want to add Command Center at the top of the Workspace!
// Find the WorkspaceOS usage or the main activeTab switch.

content = content.replace(
  /<div className="flex-1 overflow-y-auto relative pb-24 px-4 sm:px-6 pt-4">/g,
  '<div className="flex-1 overflow-hidden relative pb-24 px-4 sm:px-6 pt-4 flex flex-col">'
);

fs.writeFileSync('src/App.tsx', content);
