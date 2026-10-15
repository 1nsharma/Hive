import fs from 'fs';

// Fix LoginScreen.tsx splash screen scroll
let loginStr = fs.readFileSync('src/components/LoginScreen.tsx', 'utf-8');
loginStr = loginStr.replace('className="min-h-screen bg-gradient-to-b from-[#0B2818] via-[#0F3324] to-[#0B2818] text-white flex flex-col justify-between p-6 sm:p-8 selection:bg-emerald-500/30"', 'className="min-h-screen bg-gradient-to-b from-[#0B2818] via-[#0F3324] to-[#0B2818] text-white flex flex-col justify-between p-6 sm:p-8 selection:bg-emerald-500/30 overflow-y-auto"');
loginStr = loginStr.replace('className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center p-4 selection:bg-emerald-500/30"', 'className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center p-4 selection:bg-emerald-500/30 overflow-y-auto"');

fs.writeFileSync('src/components/LoginScreen.tsx', loginStr);
