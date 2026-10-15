import fs from 'fs';

// 1. Update index.css for global styles
let cssContent = fs.readFileSync('src/index.css', 'utf-8');
if (!cssContent.includes('.glass-panel')) {
  cssContent += `

/* Premium Glassmorphism Utilities */
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

.glass-panel-dark {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Hide scrollbar for clean UI but allow scrolling */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
  fs.writeFileSync('src/index.css', cssContent);
}

// 2. Enhance App.tsx Bottom Navigation with Framer Motion and Glassmorphism
let appContent = fs.readFileSync('src/App.tsx', 'utf-8');
const premiumNav = `
      {/* Premium Floating Bottom Navigation (Glassmorphism + Motion) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.2 }}
          className="glass-panel px-6 py-3.5 rounded-full flex items-center gap-7 pointer-events-auto"
        >
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("dashboard")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "dashboard" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "dashboard" ? "bg-indigo-50 shadow-inner" : ""}\`}>
              <Home className="w-6 h-6" strokeWidth={activeTab === "dashboard" ? 2.5 : 2} />
            </div>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("pos")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "pos" ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "pos" ? "bg-emerald-50 shadow-inner" : ""}\`}>
              <IndianRupee className="w-6 h-6" strokeWidth={activeTab === "pos" ? 2.5 : 2} />
            </div>
          </motion.button>
          
          {/* AI Magic FAB */}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }} 
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("ai")} 
            className="flex items-center justify-center -mt-10 w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 text-white rounded-[24px] shadow-xl shadow-indigo-500/40 border-4 border-white relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Sparkles className="w-7 h-7 animate-pulse" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("ledger")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "ledger" ? "text-rose-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "ledger" ? "bg-rose-50 shadow-inner" : ""}\`}>
              <Users className="w-6 h-6" strokeWidth={activeTab === "ledger" ? 2.5 : 2} />
            </div>
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab("inventory")} className={\`flex flex-col items-center justify-center gap-1 transition-colors \${activeTab === "inventory" ? "text-amber-600" : "text-slate-400 hover:text-slate-600"}\`}>
            <div className={\`p-1.5 rounded-2xl transition-all duration-300 \${activeTab === "inventory" ? "bg-amber-50 shadow-inner" : ""}\`}>
              <Package className="w-6 h-6" strokeWidth={activeTab === "inventory" ? 2.5 : 2} />
            </div>
          </motion.button>
        </motion.div>
      </div>
`;
appContent = appContent.replace(
  /\{\/\* Floating Bottom Navigation \*\/\}[\s\S]*?<\/div>\s*<\/div>/,
  premiumNav
);
fs.writeFileSync('src/App.tsx', appContent);

// 3. Enhance AIChatTab.tsx
let aiChatContent = fs.readFileSync('src/components/AIChatTab.tsx', 'utf-8');
aiChatContent = aiChatContent.replace(
  /className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white\/80 backdrop-blur-lg sticky top-0 z-10"/g,
  'className="px-4 py-3 flex items-center justify-between border-b border-white/40 glass-panel sticky top-0 z-10"'
);

aiChatContent = aiChatContent.replace(
  /className="p-4 bg-white text-gray-800 rounded-\[20px\] rounded-tl-sm text-\[15px\] leading-relaxed border border-indigo-50 shadow-sm max-w-\[85%\]"/g,
  'className="p-4 bg-white/90 backdrop-blur-md text-slate-800 rounded-[24px] rounded-tl-sm text-[15px] leading-relaxed border border-white shadow-sm max-w-[85%]"'
);

aiChatContent = aiChatContent.replace(
  /className="p-4 bg-indigo-600 text-white rounded-\[20px\] rounded-tr-sm text-\[15px\] leading-relaxed shadow-md max-w-\[85%\]"/g,
  'className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[24px] rounded-tr-sm text-[15px] leading-relaxed shadow-md shadow-indigo-500/20 max-w-[85%]"'
);

// Add animated presence to chat
if (!aiChatContent.includes('<AnimatePresence>')) {
    aiChatContent = aiChatContent.replace(
        /import { ArrowLeft, Search, Mic, Image as ImageIcon, FileText, MoreHorizontal } from "lucide-react";\nimport { useState, useRef, useEffect } from "react";\nimport { motion } from "motion\/react";/g,
        'import { ArrowLeft, Search, Mic, Image as ImageIcon, FileText, MoreHorizontal, Sparkles } from "lucide-react";\nimport { useState, useRef, useEffect } from "react";\nimport { motion, AnimatePresence } from "motion/react";'
    );
    
    aiChatContent = aiChatContent.replace(
        /<div className="flex-1 overflow-y-auto p-4 space-y-4">([\s\S]*?)<\/div>\s*\{\/\* Input Area \*\/\}/g,
        `<div className="flex-1 overflow-y-auto p-4 space-y-5 hide-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}
              >
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 shrink-0 border border-indigo-200">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                )}
                <div className={msg.role === 'user' 
                  ? "p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[24px] rounded-tr-sm text-[15px] leading-relaxed shadow-md shadow-indigo-500/20 max-w-[85%]" 
                  : "p-4 bg-white/90 backdrop-blur-md text-slate-800 rounded-[24px] rounded-tl-sm text-[15px] leading-relaxed border border-white shadow-sm max-w-[85%]"
                }>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}`
    );
}

// Enhance input area
aiChatContent = aiChatContent.replace(
  /className="p-4 bg-white border-t border-gray-100"/g,
  'className="p-4 glass-panel border-t border-white/40 pb-safe"'
);
aiChatContent = aiChatContent.replace(
  /className="flex items-center gap-2 bg-gray-50 rounded-full p-1 border border-gray-100"/g,
  'className="flex items-center gap-2 bg-white/80 rounded-[24px] p-1.5 border border-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-shadow"'
);
aiChatContent = aiChatContent.replace(
  /className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"/g,
  'className="flex-1 bg-transparent px-4 py-2.5 text-[15px] focus:outline-none"'
);
aiChatContent = aiChatContent.replace(
  /className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-md"/g,
  'className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform"'
);

fs.writeFileSync('src/components/AIChatTab.tsx', aiChatContent);

console.log("Applied world-class UI design principles");
