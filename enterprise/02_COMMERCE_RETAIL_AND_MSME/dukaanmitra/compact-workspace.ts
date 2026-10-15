import fs from 'fs';

let content = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf-8');

// Update WIDGET_DIMENSIONS
content = content.replace(
  /const WIDGET_DIMENSIONS: Record<WidgetSize, \{ cols: number, rows: number \}> = \{[\s\S]*?\};/m,
  `const WIDGET_DIMENSIONS: Record<WidgetSize, { cols: number, rows: number }> = {
  XS: { cols: 1, rows: 1 },
  S: { cols: 2, rows: 1 },
  M: { cols: 2, rows: 2 },
  L: { cols: 4, rows: 2 },
  XL: { cols: 4, rows: 3 }, // 12 cells (compacted from 16)
};`
);

// Update sizes in initialWidgets
content = content.replace(
  /\{ id: "w_ai", featureId: "ai_assistant", title: "AI Assistant", size: "XL", priority: 110, category: "ai", collapsible: true \},/g,
  `{ id: "w_ai", featureId: "ai_assistant", title: "AI Assistant", size: "XL", priority: 110, category: "ai", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_sales", featureId: "sales_pos", title: "Sales", size: "M", priority: 100, category: "operations", collapsible: true \},/g,
  `{ id: "w_sales", featureId: "sales_pos", title: "Sales", size: "M", priority: 100, category: "operations", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_profit", featureId: "profit", title: "Profit", size: "M", priority: 95, category: "finance", collapsible: true \},/g,
  `{ id: "w_profit", featureId: "profit", title: "Profit", size: "M", priority: 95, category: "finance", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_udhaar", featureId: "udhaar", title: "Udhaar", size: "M", priority: 90, category: "finance", collapsible: true \},/g,
  `{ id: "w_udhaar", featureId: "udhaar", title: "Udhaar", size: "M", priority: 90, category: "finance", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_inventory", featureId: "inventory", title: "Inventory", size: "M", priority: 85, category: "operations", collapsible: true \},/g,
  `{ id: "w_inventory", featureId: "inventory", title: "Inventory", size: "S", priority: 85, category: "operations", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_whatsapp", featureId: "whatsapp", title: "WhatsApp", size: "M", priority: 80, category: "operations", collapsible: true \},/g,
  `{ id: "w_whatsapp", featureId: "whatsapp", title: "WhatsApp", size: "S", priority: 80, category: "operations", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_reports", featureId: "reports", title: "Reports", size: "S", priority: 70, category: "reports", collapsible: true \},/g,
  `{ id: "w_reports", featureId: "reports", title: "Reports", size: "XS", priority: 70, category: "reports", collapsible: true },`
);
content = content.replace(
  /\{ id: "w_gst", featureId: "gst", title: "GST", size: "XS", priority: 60, category: "utility", collapsible: false \},/g,
  `{ id: "w_gst", featureId: "gst", title: "GST", size: "XS", priority: 60, category: "utility", collapsible: false },`
);
content = content.replace(
  /\{ id: "w_staff", featureId: "staff", title: "Staff", size: "XS", priority: 50, category: "utility", collapsible: false \},/g,
  `{ id: "w_staff", featureId: "staff", title: "Staff", size: "XS", priority: 50, category: "utility", collapsible: false },`
);

// Update grid class in render
content = content.replace(
  /<div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-8 gap-2 grid-flow-dense">/g,
  '<div className="flex-1 min-h-0 grid grid-cols-4 grid-rows-[repeat(8,minmax(0,1fr))] gap-2 grid-flow-dense pb-2">'
);

// Update getSizeClasses
content = content.replace(
  /case 'XL': return 'col-span-4 row-span-4';/g,
  "case 'XL': return 'col-span-4 row-span-3';"
);

// Compact padding and spacing in widgets
// AI Assistant
content = content.replace(
  /className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 text-white rounded-\[24px\] p-4 /g,
  'className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 text-white rounded-[20px] p-3 '
);
content = content.replace(
  /className="font-extrabold text-2xl leading-tight">/g,
  'className="font-extrabold text-xl leading-tight">'
);
content = content.replace(
  /<Sparkles className="w-4 h-4 animate-pulse" \/>/g,
  '<Sparkles className="w-3 h-3 animate-pulse" />'
);
content = content.replace(
  /<span className="text-xs font-bold uppercase tracking-widest">AI OS<\/span>/g,
  '<span className="text-[10px] font-bold uppercase tracking-widest">AI OS</span>'
);
content = content.replace(
  /className="w-20 h-20"/g, // Bot icon
  'className="w-16 h-16"'
);
content = content.replace(
  /className="bg-white\/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between mt-1/g,
  'className="bg-white/20 backdrop-blur-md rounded-xl p-2 flex items-center justify-between mt-1'
);

// Sales POS
content = content.replace(
  /className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-white\/10 shadow-lg shadow-emerald-500\/20 p-4 rounded-\[24px\] /g,
  'className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-white/10 shadow-lg shadow-emerald-500/20 p-3 rounded-[20px] '
);
content = content.replace(
  /className="w-24 h-24"/g, // bg icons
  'className="w-16 h-16"'
);
content = content.replace(
  /className="text-3xl font-black leading-tight drop-shadow-sm">\{formatRupees\(todaySales\)\}/g,
  'className="text-xl font-black leading-tight drop-shadow-sm">{formatRupees(todaySales)}'
);

// Profit
content = content.replace(
  /className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500\/20 p-4 rounded-\[24px\] /g,
  'className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20 p-3 rounded-[20px] '
);
content = content.replace(
  /className="text-2xl font-black leading-tight drop-shadow-sm">\{formatRupees\(todaySales \* 0\.15\)\}/g,
  'className="text-xl font-black leading-tight drop-shadow-sm">{formatRupees(todaySales * 0.15)}'
);

// Udhaar
content = content.replace(
  /className="bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-500\/20 p-4 rounded-\[24px\] /g,
  'className="bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-500/20 p-3 rounded-[20px] '
);
content = content.replace(
  /className="text-2xl font-black leading-tight drop-shadow-sm">\{formatRupees\(totalUdhaari\)\}/g,
  'className="text-xl font-black leading-tight drop-shadow-sm">{formatRupees(totalUdhaari)}'
);

// Inventory (Stock) - Sized to S (2x1) now!
content = content.replace(
  /className="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500\/20 p-4 rounded-\[24px\] flex flex-col justify-between/g,
  'className="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 p-2.5 rounded-[20px] flex items-center justify-between'
);
content = content.replace(
  /<div className="relative z-10 flex items-center gap-1.5 text-amber-50 mb-2">/g,
  '<div className="relative z-10 flex items-center gap-1.5 text-amber-50">'
);
content = content.replace(
  /<div className="relative z-10">\s*<p className="text-2xl font-black leading-tight drop-shadow-sm">\{lowStockCount\}<\/p>\s*<p className="text-\[11px\] text-amber-50 font-medium mt-1">Alerts<\/p>\s*<\/div>/g,
  '<div className="relative z-10 text-right"><p className="text-lg font-black leading-tight drop-shadow-sm">{lowStockCount}</p><p className="text-[9px] text-amber-50 font-medium leading-none">Alerts</p></div>'
);

// WhatsApp - Sized to S (2x1) now!
content = content.replace(
  /className="bg-gradient-to-br from-\[#128C7E\] to-\[#075E54\] text-white shadow-lg shadow-\[#128C7E\]\/20 p-4 rounded-\[24px\] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between/g,
  'className="bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white shadow-lg shadow-[#128C7E]/20 p-2.5 rounded-[20px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between'
);
content = content.replace(
  /<div className="flex items-center gap-1.5 text-white\/90 mb-2 relative z-10">/g,
  '<div className="flex items-center gap-1.5 text-white/90 relative z-10">'
);
content = content.replace(
  /<div className="relative z-10">\s*<p className="text-2xl font-black leading-tight drop-shadow-sm">On<\/p>\s*<p className="text-\[11px\] text-white\/80 font-medium mt-1">Bot Active<\/p>\s*<\/div>/g,
  '<div className="relative z-10 text-right"><p className="text-lg font-black leading-tight drop-shadow-sm">On</p><p className="text-[9px] text-white/80 font-medium leading-none">Bot Active</p></div>'
);

// Reports - Sized to XS (1x1)
content = content.replace(
  /className="bg-white border border-slate-200 shadow-sm p-4 rounded-\[24px\] flex flex-col justify-between/g,
  'className="bg-white border border-slate-200 shadow-sm p-2 rounded-[20px] flex flex-col items-center justify-center gap-1'
);
content = content.replace(
  /<div className="flex items-center gap-1.5 text-slate-500 mb-2">\s*<div className="p-1.5 bg-slate-100 text-indigo-600 rounded-lg group-hover:bg-indigo-50 transition-colors">\s*<LineChart className="w-4 h-4" \/>\s*<\/div>\s*<span className="text-xs font-bold uppercase tracking-widest">Reports<\/span>\s*<\/div>\s*<div>\s*<p className="text-2xl font-black text-slate-800 leading-tight">View<\/p>\s*<p className="text-\[11px\] text-slate-500 font-medium mt-1">Analytics<\/p>\s*<\/div>/gm,
  '<div className="p-1.5 bg-slate-100 text-indigo-600 rounded-xl group-hover:bg-indigo-50 transition-colors"><LineChart className="w-4 h-4" /></div><span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">Reports</span>'
);

// Staff - Sized to XS (1x1)
content = content.replace(
  /className="bg-white border border-slate-200 shadow-sm p-3 rounded-\[24px\]/g,
  'className="bg-white border border-slate-200 shadow-sm p-2 rounded-[20px]'
);

// GST - Sized to XS (1x1)
content = content.replace(
  /className="bg-white border border-slate-200 shadow-sm p-3 rounded-\[24px\]/g,
  'className="bg-white border border-slate-200 shadow-sm p-2 rounded-[20px]'
);
content = content.replace(
  /text-\[10px\]/g,
  'text-[9px]'
);

// Fix AI bot icon overlapping
content = content.replace(
  /className="absolute top-0 right-0 p-3 opacity-20/g,
  'className="absolute -top-2 -right-2 p-3 opacity-20'
);

// Fix title margins
content = content.replace(
  /className="text-\[10px\] font-bold text-slate-400 uppercase tracking-widest">Workspace OS/g,
  'className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Workspace OS'
);
content = content.replace(
  /className="text-sm font-semibold text-slate-700">\{shopName\}/g,
  'className="text-xs font-bold text-slate-700">{shopName}'
);

fs.writeFileSync('src/components/WorkspaceOS.tsx', content);
console.log("Compacted WorkspaceOS");
