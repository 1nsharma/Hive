import fs from 'fs';
let content = fs.readFileSync('src/components/WorkspaceOS.tsx', 'utf-8');

// Use gradients and better styling in the renderWidget function
content = content.replace(
  /case "ai_assistant":\s*return \([\s\S]*?\);\s*case "sales_pos":/m,
  `case "ai_assistant":
        return (
          <div onClick={() => setActiveTab("ai")} className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 text-white rounded-[24px] p-4 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative group h-full border border-white/20">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <Bot className="w-20 h-20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-indigo-100">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">AI OS</span>
                </div>
                <h3 className="font-extrabold text-2xl leading-tight">Dukaan<br/>Brain</h3>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between mt-1 border border-white/20 group-hover:bg-white/30 transition-colors">
                <span className="text-xs font-semibold">Talk to AI...</span>
                <ChevronRight className="w-4 h-4 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        );
      case "sales_pos":`
);

content = content.replace(
  /case "sales_pos":\s*return \([\s\S]*?\);\s*case "profit":/m,
  `case "sales_pos":
        return (
          <div onClick={() => setActiveTab("pos")} className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white border border-white/10 shadow-lg shadow-emerald-500/20 p-4 rounded-[24px] flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 h-full group relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <IndianRupee className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-emerald-100 mb-2">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Sales POS</span>
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-black leading-tight drop-shadow-sm">{formatRupees(todaySales)}</p>
              <p className="text-xs text-emerald-100 font-medium leading-none mt-1 opacity-90">Today's Revenue</p>
            </div>
          </div>
        );
      case "profit":`
);

content = content.replace(
  /case "profit":\s*return \([\s\S]*?\);\s*case "udhaar":/m,
  `case "profit":
        return (
          <div onClick={() => setActiveTab("reports")} className="bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/20 p-4 rounded-[24px] flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 h-full group relative overflow-hidden">
             <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 text-blue-100 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Profit</span>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black leading-tight drop-shadow-sm">{formatRupees(todaySales * 0.15)}</p>
              <p className="text-[11px] text-blue-100 font-medium mt-1">Est. Margin</p>
            </div>
          </div>
        );
      case "udhaar":`
);

content = content.replace(
  /case "udhaar":\s*return \([\s\S]*?\);\s*case "inventory":/m,
  `case "udhaar":
        return (
          <div onClick={() => setActiveTab("ledger")} className="bg-gradient-to-br from-rose-500 to-pink-700 text-white shadow-lg shadow-rose-500/20 p-4 rounded-[24px] flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-1 transition-all duration-300 h-full group relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 text-rose-100 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Udhaar</span>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black leading-tight drop-shadow-sm">{formatRupees(totalUdhaari)}</p>
              <p className="text-[11px] text-rose-100 font-medium mt-1">Pending Dues</p>
            </div>
          </div>
        );
      case "inventory":`
);

content = content.replace(
  /case "inventory":\s*return \([\s\S]*?\);\s*case "whatsapp":/m,
  `case "inventory":
        return (
          <div onClick={() => setActiveTab("inventory")} className="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20 p-4 rounded-[24px] flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300 h-full group relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Package className="w-24 h-24" />
            </div>
            <div className="relative z-10 flex items-center gap-1.5 text-amber-50 mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Stock</span>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black leading-tight drop-shadow-sm">{lowStockCount}</p>
              <p className="text-[11px] text-amber-50 font-medium mt-1">Alerts</p>
            </div>
          </div>
        );
      case "whatsapp":`
);

content = content.replace(
  /case "whatsapp":\s*return \([\s\S]*?\);\s*case "staff":/m,
  `case "whatsapp":
        return (
          <div onClick={() => setActiveTab("whatsapp_connection")} className="bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white shadow-lg shadow-[#128C7E]/20 p-4 rounded-[24px] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <MessageCircleWarning className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-1.5 text-white/90 mb-2 relative z-10">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
                <MessageCircleWarning className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">WhatsApp</span>
            </div>
            <div className="relative z-10">
              <p className="text-2xl font-black leading-tight drop-shadow-sm">On</p>
              <p className="text-[11px] text-white/80 font-medium mt-1">Bot Active</p>
            </div>
          </div>
        );
      case "staff":`
);

content = content.replace(
  /case "reports":\s*return \([\s\S]*?\);\s*default:/m,
  `case "reports":
        return (
          <div onClick={() => setActiveTab("reports")} className="bg-white border border-slate-200 shadow-sm p-4 rounded-[24px] flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-300 h-full group">
            <div className="flex items-center gap-1.5 text-slate-500 mb-2">
              <div className="p-1.5 bg-slate-100 text-indigo-600 rounded-lg group-hover:bg-indigo-50 transition-colors">
                <LineChart className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Reports</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-tight">View</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Analytics</p>
            </div>
          </div>
        );
      default:`
);

content = content.replace(
  /case "staff":\s*return \([\s\S]*?\);\s*case "gst":/m,
  `case "staff":
        return (
          <div onClick={() => setActiveTab("staff")} className="bg-white border border-slate-200 shadow-sm p-3 rounded-[24px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-all duration-300 h-full group">
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Staff</span>
          </div>
        );
      case "gst":`
);

content = content.replace(
  /case "gst":\s*return \([\s\S]*?\);\s*case "reports":/m,
  `case "gst":
        return (
          <div onClick={() => setActiveTab("reports")} className="bg-white border border-slate-200 shadow-sm p-3 rounded-[24px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:shadow-md transition-all duration-300 h-full group">
            <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors text-slate-400">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">GST</span>
          </div>
        );
      case "reports":`
);

fs.writeFileSync('src/components/WorkspaceOS.tsx', content);
