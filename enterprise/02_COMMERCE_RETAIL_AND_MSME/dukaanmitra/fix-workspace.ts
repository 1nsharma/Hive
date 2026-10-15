import fs from 'fs';
let content = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf-8');

const newGrid = `
      {/* Adaptive Workspaces Grid */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 grid-rows-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
        <motion.div 
          onClick={() => setActiveTab("pos")} 
          whileHover={{ scale: 0.98 }}
          className="col-span-2 row-span-2 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-emerald-100">
            <IndianRupee className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">POS</span>
          </div>
          <div>
            <p className="text-4xl font-black">{formatRupees(todaySales)}</p>
            <p className="text-sm font-medium text-emerald-100 mt-1">Today's Revenue</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab("ledger")} 
          whileHover={{ scale: 0.98 }}
          className="bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-rose-100">
            <Users className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Ledger</span>
          </div>
          <div>
            <p className="text-2xl font-black">{formatRupees(totalUdhaari)}</p>
            <p className="text-[10px] font-medium text-rose-100">Pending Dues</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab("inventory")} 
          whileHover={{ scale: 0.98 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-amber-50">
            <Package className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Stock</span>
          </div>
          <div>
            <p className="text-2xl font-black">{lowStockCount}</p>
            <p className="text-[10px] font-medium text-amber-50">Low Alerts</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab("visits")} 
          whileHover={{ scale: 0.98 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-indigo-100">
            <Users className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Visits</span>
          </div>
          <div>
            <p className="text-2xl font-black">{transactions.length}</p>
            <p className="text-[10px] font-medium text-indigo-100">Total Visits</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab("whatsapp_connection")} 
          whileHover={{ scale: 0.98 }}
          className="col-span-2 bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <MessageCircleWarning className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg">WhatsApp Bot</span>
              <p className="text-xs text-white/80">Running smoothly</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-full font-bold text-sm">Active</div>
        </motion.div>
      </div>
`;
content = content.replace(/<div className="flex-1 grid grid-cols-2 md:grid-cols-4 grid-rows-\[repeat\(auto-fit,minmax\(100px,1fr\)\)\] gap-3">.*<\/div>\s*<\/div>\s*\);\s*}/s, newGrid.trim() + '\n    </div>\n  );\n}');
fs.writeFileSync('src/components/WorkspaceOS.tsx', content);
