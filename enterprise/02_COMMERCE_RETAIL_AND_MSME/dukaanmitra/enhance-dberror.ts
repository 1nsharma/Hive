import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /className="mb-2 p-2 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center justify-between shrink-0"/g,
  'className="mb-3 mx-2 p-3 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-[20px] flex items-center justify-between shrink-0 shadow-sm"'
);

fs.writeFileSync('src/App.tsx', content);
