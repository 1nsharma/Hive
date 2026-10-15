import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<AnimatePresence>\s*\{showNotifications && \(\s*<>\s*<motion\.div\s*key=\{activeTab\}[\s\S]*?transition=\{\{ type: "spring", stiffness: 350, damping: 28, mass: 0\.9 \}\}\s*>/;

const correctCode = `<AnimatePresence>
        {showNotifications && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-16 right-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div className="p-8 text-center text-slate-500 text-sm">
                No new notifications
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-24 relative">
        {dbError && (
          <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-sm font-medium">डेटा सिंक नहीं हो पा रहा है।</span>
            </div>
            <button
              onClick={handleRefreshDB}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              फिर कोशिश करें
            </button>
          </div>
        )}

        {/* Dynamic Tab Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.96, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: -15, filter: 'blur(4px)' }}
            transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
          >`;

code = code.replace(regex, correctCode);
fs.writeFileSync('src/App.tsx', code);
