import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

appContent = appContent.replace(
  /className="fixed inset-0 bg-black\/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-hindi"/g,
  'className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 font-hindi"'
);

appContent = appContent.replace(
  /className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl relative"/g,
  'className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 max-w-md w-full border border-white/50 shadow-2xl shadow-indigo-500/10 relative overflow-hidden"'
);

// Form inputs inside modal
appContent = appContent.replace(
  /className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-600"/g,
  'className="w-full bg-slate-50/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"'
);
appContent = appContent.replace(
  /className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-800 text-base font-bold focus:outline-none focus:border-emerald-600 font-mono"/g,
  'className="w-full bg-slate-50/50 border border-slate-200/60 p-3 rounded-2xl text-slate-800 text-[15px] font-bold focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-mono"'
);

appContent = appContent.replace(
  /className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all text-sm cursor-pointer shadow-md"/g,
  'className="w-full py-3.5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-[15px] cursor-pointer shadow-lg shadow-indigo-500/30"'
);

fs.writeFileSync('src/App.tsx', appContent);
console.log("Enhanced modals");
