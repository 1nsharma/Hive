import fs from 'fs';

let content = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf-8');

// Replace standard Framer motion div with more bouncy spring
content = content.replace(
  /initial=\{\{ opacity: 0, scale: 0\.95 \}\}\s*animate=\{\{ opacity: 1, scale: 1 \}\}\s*transition=\{\{ delay: i \* 0\.03 \}\}/g,
  `initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.05 }}`
);

fs.writeFileSync('src/components/WorkspaceOS.tsx', content);
console.log("Enhanced workspace motion");
