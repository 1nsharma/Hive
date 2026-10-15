const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Unify navigation active colors
code = code.replace(/text-indigo-600/g, "text-[#16A34A]");
code = code.replace(/bg-indigo-50/g, "bg-[#16A34A]/10 text-[#16A34A]");
code = code.replace(/text-emerald-600/g, "text-[#16A34A]");
code = code.replace(/bg-emerald-50/g, "bg-[#16A34A]/10 text-[#16A34A]");
code = code.replace(/text-rose-600/g, "text-[#16A34A]");
code = code.replace(/bg-rose-50/g, "bg-[#16A34A]/10 text-[#16A34A]");
code = code.replace(/text-amber-600/g, "text-[#16A34A]");
code = code.replace(/bg-amber-50/g, "bg-[#16A34A]/10 text-[#16A34A]");
code = code.replace(/shadow-indigo-500\/40/g, "shadow-emerald-500/40");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx Colors");
