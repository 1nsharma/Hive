const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navStart = code.indexOf('{/* Premium Floating Bottom Navigation (Glassmorphism + Motion) */}');
if (navStart !== -1) {
  const newTabBar = `{/* NEW TAB BAR DESIGN */}
      <div className="tabbar z-50">
        <div className={\`tab \${activeTab === "dashboard" ? "active" : ""}\`} onClick={() => setActiveTab("dashboard")}>
          <div className="dot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>
          </div>
          Home
        </div>
        
        {user?.businessConfig?.requiresUdhaar !== false && (
          <div className={\`tab \${activeTab === "ledger" ? "active" : ""}\`} onClick={() => setActiveTab("ledger")}>
            <div className="dot">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h13a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z"/><path d="M9 9h7M9 13h7"/></svg>
            </div>
            Khata
          </div>
        )}

        <div className={\`tab \${activeTab === "pos" ? "active" : ""}\`} onClick={() => setActiveTab("pos")}>
          <div className="dot" style={activeTab === "pos" ? {color: 'var(--gold)'} : {}}>
            {activeTab === "pos" ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--gold)"><circle cx="12" cy="12" r="11"/></svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11"/></svg>
            )}
          </div>
        </div>

        {user?.businessConfig?.requiresInventory !== false && (
          <div className={\`tab \${activeTab === "inventory" ? "active" : ""}\`} onClick={() => setActiveTab("inventory")}>
            <div className="dot">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3.3 8.5l8.7 5 8.7-5"/><path d="M12 21.5V13"/></svg>
            </div>
            Stock
          </div>
        )}

        <div className={\`tab \${activeTab === "settings" ? "active" : ""}\`} onClick={() => setActiveTab("settings")}>
          <div className="dot">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
          </div>
          More
        </div>
      </div>
    </div>
  );
}
`;
  
  const endDiv = code.lastIndexOf('</div>');
  const outerEnd = code.lastIndexOf(');', endDiv);
  
  // Actually just replace from navStart to the end of the return statement
  const navEndRegex = /\{\/\* Premium Floating Bottom Navigation[\s\S]*?<\/div>\n    <\/div>\n  \);\n\}/;
  code = code.replace(navEndRegex, newTabBar);
} else {
  console.log("Nav block not found");
}

code = code.replace(/<div className="h-\[100dvh\] bg-\[#F8FAFC\] flex flex-col font-sans select-none overflow-hidden">/, `<div className="h-[100dvh] flex flex-col font-sans select-none overflow-hidden" style={{background: 'var(--paper)', backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, var(--paper-line) 27px, var(--paper-line) 28px)'}}>`);

fs.writeFileSync('src/App.tsx', code);
