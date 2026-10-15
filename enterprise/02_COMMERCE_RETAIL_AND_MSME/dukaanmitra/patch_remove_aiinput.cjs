const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/\{activeTab === "ai_ocr" && \([\s\S]*?\}\)/, '');

// Also remove the bottom nav button for it
const aiNavBtn = `<motion.button           whileHover={{ scale: 1.1 }}          whileTap={{ scale: 0.9 }}          onClick={() => setActiveTab("ai_ocr")}          className="relative group"        >          <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>          <div className="relative w-14 h-14 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white/20 group-hover:scale-105 transition-transform z-10">            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>            <Sparkles className="w-7 h-7 animate-pulse" />          </div>        </motion.button>`;
code = code.replace(aiNavBtn, '');

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
