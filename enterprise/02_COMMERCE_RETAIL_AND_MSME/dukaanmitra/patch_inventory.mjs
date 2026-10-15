import fs from 'fs';
let code = fs.readFileSync('src/components/InventoryTab.tsx', 'utf8');

const newCode = `
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAICatalogModal(true)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md transition-all cursor-pointer flex items-center gap-1 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" /> AI Catalog
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md transition-all cursor-pointer flex items-center gap-1 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> नया स्टॉक आइटम
            </button>
          </div>
        </div>`;

code = code.replace(`
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md transition-all cursor-pointer flex items-center gap-1 text-sm font-semibold"
          >
            <Plus className="w-4 h-4" /> नया स्टॉक आइटम
          </button>
        </div>`, newCode);
fs.writeFileSync('src/components/InventoryTab.tsx', code);
