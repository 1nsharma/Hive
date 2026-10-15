import fs from 'fs';

let appStr = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix h-screen to h-[100dvh]
appStr = appStr.replace('className="h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden"', 'className="h-[100dvh] bg-slate-50 flex flex-col font-sans select-none overflow-hidden"');

// Fix the bottom navigation to be absolute or fixed to avoid flex push-off issues
// Instead of mt-auto in flow, let's make it absolute at the bottom of the screen.
appStr = appStr.replace('<div className="mt-auto pb-4 pt-2 px-2 flex justify-center z-50 shrink-0">', '<div className="absolute bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">');

// Update the inner pill to have pointer-events-auto and some shadow
appStr = appStr.replace('className="glass-panel px-6 py-3.5 rounded-full flex items-center gap-7 pointer-events-auto"', 'className="glass-panel px-6 py-3.5 rounded-full flex items-center gap-7 pointer-events-auto shadow-xl shadow-slate-200/50"');

// Since we made it absolute, we need to add padding to the bottom of the main content so it's not hidden
appStr = appStr.replace('<main className="flex-1 overflow-hidden px-3 pt-2 pb-safe relative flex flex-col min-h-0">', '<main className="flex-1 overflow-hidden px-3 pt-2 pb-24 relative flex flex-col min-h-0">');

fs.writeFileSync('src/App.tsx', appStr);
