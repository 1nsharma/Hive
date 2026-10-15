import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /<motion\.div[\s\S]*?key={activeTab}[\s\S]*?transition={{ duration: 0\.15 }}[\s\S]*?>/,
  `<motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.96, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: -15, filter: 'blur(4px)' }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
          >`
);

fs.writeFileSync('src/App.tsx', code);
