import fs from 'fs';
let content = fs.readFileSync('src/components/AIChatTab.tsx', 'utf-8');

content = content.replace(
  /className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10"/g,
  'className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-10"'
);

content = content.replace(
  /className="p-3 bg-white text-gray-800 rounded-2xl rounded-tl-sm text-sm border border-gray-100 shadow-sm"/g,
  'className="p-4 bg-white text-gray-800 rounded-[20px] rounded-tl-sm text-[15px] leading-relaxed border border-indigo-50 shadow-sm max-w-[85%]"'
);

content = content.replace(
  /className="p-3 bg-emerald-600 text-white rounded-2xl rounded-tr-sm text-sm shadow-sm"/g,
  'className="p-4 bg-indigo-600 text-white rounded-[20px] rounded-tr-sm text-[15px] leading-relaxed shadow-md max-w-[85%]"'
);

content = content.replace(
  /bg-emerald-600/g,
  'bg-indigo-600'
);
content = content.replace(
  /text-emerald-600/g,
  'text-indigo-600'
);
content = content.replace(
  /border-emerald-600/g,
  'border-indigo-600'
);

fs.writeFileSync('src/components/AIChatTab.tsx', content);
