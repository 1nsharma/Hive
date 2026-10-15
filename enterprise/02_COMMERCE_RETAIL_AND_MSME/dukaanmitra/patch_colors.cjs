const fs = require('fs');
let code = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf8');

// Replace background color
code = code.replace(/bg-slate-50/g, "bg-[#F8FAFC]");

// Replace POS tile colors to use Trust Green
code = code.replace(/from-emerald-500 to-emerald-700/g, "from-[#16A34A] to-[#15803d]");

// Replace Settings or WA tile colors
code = code.replace(/from-\[\#128C7E\] to-\[\#075E54\]/g, "from-[#0F172A] to-[#1e293b]");
code = code.replace(/text-green-100/g, "text-slate-300");

fs.writeFileSync('src/components/WorkspaceOS.tsx', code);
console.log("Patched Colors");
