import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navCode = `
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center z-40 pb-safe relative">
        {[
          { id: 'dashboard', icon: Home, label: 'Home', show: true },
          { id: 'pos', icon: Store, label: 'Sales', show: true },
          { id: 'ledger', icon: Users, label: 'Customers', show: ['Owner', 'Manager', 'Staff'].includes(user.role) },
          { id: 'inventory', icon: Package, label: 'Inventory', show: ['Owner', 'Manager', 'Staff'].includes(user.role) },
          { id: 'more', icon: Settings, label: 'Settings', show: ['Owner', 'Manager'].includes(user.role) },
        ].filter(t => t.show).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={\`relative flex flex-col items-center justify-center w-16 h-12 transition-colors cursor-pointer \${
              activeTab === tab.id ? "text-emerald-600" : "text-gray-400 hover:text-gray-600"
            }\`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <tab.icon className={\`w-5 h-5 \${activeTab === tab.id ? "fill-emerald-100 stroke-2" : "stroke-[1.5]"}\`} />
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
`;

code = code.replace(/\{\/\* Bottom Navigation \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/, navCode + '    </div>\n  );\n}');

fs.writeFileSync('src/App.tsx', code);
