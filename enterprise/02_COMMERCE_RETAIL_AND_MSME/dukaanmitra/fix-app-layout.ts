import fs from 'fs';
let app = fs.readFileSync('src/App.tsx', 'utf-8');

// The bottom nav got inserted inside AnimatePresence or something. Let's revert and do it properly.

const premiumNavMatch = app.match(/\{\/\* Premium Floating Bottom Navigation \(Glassmorphism \+ Motion\) \*\/\}[\s\S]*?<\/div>\s*<\/div>/);
if (premiumNavMatch) {
    app = app.replace(premiumNavMatch[0], ''); // remove it first
    
    // We want to insert it before the very last `</div>` which closes the main app container.
    // The main app container is: <div className="h-screen bg-slate-50 flex flex-col font-sans select-none overflow-hidden">
    const lastClosingDiv = app.lastIndexOf('</div>');
    
    app = app.substring(0, lastClosingDiv) + `\n      {/* Premium Bottom Navigation */}\n` + premiumNavMatch[0].replace('pointer-events-none px-4', 'mt-auto pb-3 pt-1 px-2 flex justify-center z-50 shrink-0 pointer-events-none') + `\n` + app.substring(lastClosingDiv);
}

fs.writeFileSync('src/App.tsx', app);
