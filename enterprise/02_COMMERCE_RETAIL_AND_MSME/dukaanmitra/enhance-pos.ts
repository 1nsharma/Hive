import fs from 'fs';

let content = fs.readFileSync('src/components/POSTab.tsx', 'utf-8');

// Replace standard white bg with slightly translucent soft cards
content = content.replace(
  /className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm"/g,
  'className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow"'
);

// Better inputs
content = content.replace(
  /className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-xl text-sm focus:outline-none focus:border-emerald-500"/g,
  'className="w-full bg-slate-50/50 border border-slate-200/60 p-3 pl-10 rounded-2xl text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"'
);

// Better buttons
content = content.replace(
  /className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"/g,
  'className="px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-[15px] hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-indigo-500/20"'
);

// Cart summary card
content = content.replace(
  /className="bg-white border-t border-slate-200 p-4 sticky bottom-0 pb-safe"/g,
  'className="glass-panel border-t border-white/50 p-5 sticky bottom-0 pb-safe rounded-t-[32px] mt-4"'
);

// Checkout button
content = content.replace(
  /className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl text-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"/g,
  'className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-[20px] text-lg shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"'
);

fs.writeFileSync('src/components/POSTab.tsx', content);
console.log("Enhanced POSTab");
