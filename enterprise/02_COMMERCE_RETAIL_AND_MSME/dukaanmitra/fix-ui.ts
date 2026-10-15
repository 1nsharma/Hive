import fs from 'fs';

// Fix App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf-8');
appStr = appStr.replace('onSettingsClick={() => setActiveTab("settings")}', 'onSettingsClick={() => setActiveTab("more")}');
fs.writeFileSync('src/App.tsx', appStr);

// Fix WorkspaceOS.tsx scroll
let wsStr = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf-8');
wsStr = wsStr.replace('className="h-full flex flex-col p-4 bg-slate-50 gap-4 overflow-hidden"', 'className="h-full flex flex-col p-4 bg-slate-50 gap-4 overflow-y-auto"');
// Fix Grid rows
wsStr = wsStr.replace('grid-rows-[repeat(auto-fit,minmax(100px,1fr))]', ''); // This can break layout if content is larger
fs.writeFileSync('src/components/WorkspaceOS.tsx', wsStr);

