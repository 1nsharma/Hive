const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const ledgerBtn = `<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("ledger")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "ledger" ? "text-rose-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "ledger" ? "bg-rose-50 shadow-inner" : ""}\`}>
              <Users className="w-6 h-6" strokeWidth={activeTab === "ledger" ? 2.5 : 2} />
            </div>
          </motion.button>`;

const inventoryBtn = `<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("inventory")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "inventory" ? "text-amber-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "inventory" ? "bg-amber-50 shadow-inner" : ""}\`}>
              <Package className="w-6 h-6" strokeWidth={activeTab === "inventory" ? 2.5 : 2} />
            </div>
          </motion.button>`;

code = code.replace(ledgerBtn, `{user?.businessConfig?.requiresUdhaar !== false && (${ledgerBtn})}`);
code = code.replace(inventoryBtn, `{user?.businessConfig?.requiresInventory !== false && (${inventoryBtn})}`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched Nav");
