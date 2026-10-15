import re

with open("src/components/WorkspaceOS.tsx", "r") as f:
    content = f.read()

new_grid_content = """      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
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
          onClick={() => setActiveTab("reports")} 
          whileHover={{ scale: 0.98 }}
          className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-blue-100">
            <LineChart className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Reports</span>
          </div>
          <div>
            <p className="text-2xl font-black">Stats</p>
            <p className="text-[10px] font-medium text-blue-100">View Analytics</p>
          </div>
        </motion.div>

        <motion.div 
          onClick={() => setActiveTab("staff")} 
          whileHover={{ scale: 0.98 }}
          className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-purple-100">
            <Users className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">Staff</span>
          </div>
          <div>
            <p className="text-2xl font-black">Team</p>
            <p className="text-[10px] font-medium text-purple-100">Manage Access</p>
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
      </div>"""

content = re.sub(r'<div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">[\s\S]*?</div>\s*</div>\s*\);\s*}', new_grid_content + '\n    </div>\n  );\n}', content)

with open("src/components/WorkspaceOS.tsx", "w") as f:
    f.write(content)
