import fs from 'fs';

let headerContent = fs.readFileSync('src/components/ShopHeader.tsx', 'utf-8');

headerContent = headerContent.replace(
  /className="bg-white\/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40 select-none"/g,
  'className="glass-panel sticky top-0 z-40 select-none"'
);

fs.writeFileSync('src/components/ShopHeader.tsx', headerContent);
console.log("Updated header");
