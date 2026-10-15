import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const navCode = `
      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl shadow-slate-200/50 border border-slate-100/50 px-4 py-3 rounded-[32px] flex items-center gap-6 pointer-events-auto">
          <button onClick={() => setActiveTab("dashboard")} className={\`flex flex-col items-center justify-center gap-1 w-12 transition-colors \${activeTab === "dashboard" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-full transition-colors \${activeTab === "dashboard" ? "bg-emerald-50" : ""}\`}>
              <Home className="w-5 h-5" />
            </div>
          </button>
          <button onClick={() => setActiveTab("pos")} className={\`flex flex-col items-center justify-center gap-1 w-12 transition-colors \${activeTab === "pos" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-full transition-colors \${activeTab === "pos" ? "bg-emerald-50" : ""}\`}>
              <IndianRupee className="w-5 h-5" />
            </div>
          </button>
          
          {/* AI FAB */}
          <button 
            onClick={() => setActiveTab("ai")} 
            className="flex items-center justify-center -mt-8 w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/40 border-4 border-slate-50 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </button>

          <button onClick={() => setActiveTab("ledger")} className={\`flex flex-col items-center justify-center gap-1 w-12 transition-colors \${activeTab === "ledger" ? "text-rose-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-full transition-colors \${activeTab === "ledger" ? "bg-rose-50" : ""}\`}>
              <Users className="w-5 h-5" />
            </div>
          </button>
          <button onClick={() => setActiveTab("inventory")} className={\`flex flex-col items-center justify-center gap-1 w-12 transition-colors \${activeTab === "inventory" ? "text-amber-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-full transition-colors \${activeTab === "inventory" ? "bg-amber-50" : ""}\`}>
              <Package className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>
`;

content = content.replace(
  /\{\/\* Removed Bottom Navigation \*\/\}/g,
  navCode
);

fs.writeFileSync('src/App.tsx', content);
