const fs = require('fs');

let code = fs.readFileSync('src/components/AIInput.tsx', 'utf8');

const targetStr = `{/* Tab 1: Written Voice AI Form */}`;

const replacementStr = `
      {/* AI Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3 group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Shopping Assistant</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Automate orders & recommendations</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3 group" onClick={() => { setActiveMode("write"); setQuery("Identify customers with high udhaar balance and generate recovery messages."); }}>
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 p-3 rounded-2xl group-hover:bg-rose-100 transition-colors">
              <MessageSquare className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Udhaar Recovery</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Automated invoice reminders</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3 group" onClick={() => { setActiveMode("write"); setQuery("Predict stock requirements for the next 7 days based on recent sales."); }}>
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-3 rounded-2xl group-hover:bg-amber-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Stock Prediction</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Supplier management & forecasts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Written Voice AI Form */}`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/AIInput.tsx', code);
console.log("Written AIInput.tsx");
