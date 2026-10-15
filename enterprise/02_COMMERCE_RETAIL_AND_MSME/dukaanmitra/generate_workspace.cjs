const fs = require('fs');

const code = `import { useState } from "react";
import { Search, Package, Users, IndianRupee, MessageCircleWarning, FileText, LineChart, TrendingUp, Sparkles, Command, Store, Mic, MicOff, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatRupees } from "../utils";

export default function WorkspaceOS({ products, customers, transactions, setActiveTab, shopName }: any) {
  const lowStockCount = products.filter((p: any) => p.stock <= (p.lowStockThreshold || 10)).length;
  const todaySales = transactions.filter((t: any) => t.type === 'sale').reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalUdhaari = customers.reduce((sum: number, c: any) => sum + (c.balance > 0 ? c.balance : 0), 0);
  
  const [command, setCommand] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const executeCommand = (e: any) => {
    e.preventDefault();
    if (command.toLowerCase().includes("pos") || command.toLowerCase().includes("sale")) setActiveTab("pos");
    else if (command.toLowerCase().includes("ledger") || command.toLowerCase().includes("customer")) setActiveTab("ledger");
    else setActiveTab("ai_ocr");
  };

  const handleVoiceCommand = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setActiveTab("ai_ocr");
      }, 2000);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 bg-slate-50 gap-4 overflow-y-auto pb-28">
      {/* Greeting & AI Suggestions */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Good Morning Amit 👋</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Business: {shopName || "Sharma Medical Store"}</p>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-4 rounded-2xl w-full md:w-auto flex-1 md:max-w-md">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-indigo-700">
            <Sparkles className="w-4 h-4" /> AI Suggestions
          </h3>
          <ul className="text-sm space-y-2 font-medium">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Order Paracetamol & fast-moving items</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Follow up with 4 pending customers</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> Run weekend offer campaign</li>
          </ul>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab("ai_ocr")}
          className="shrink-0 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold shadow-md hover:bg-indigo-700 transition-colors w-full md:w-auto"
        >
          <Mic className="w-5 h-5" />
          Talk to AI
        </motion.button>
      </div>

      {/* Adaptive Workspaces Grid */}
      
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
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
          className="col-span-1 bg-gradient-to-br from-rose-500 to-rose-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
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
          className="col-span-1 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
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
          className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
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
          className="col-span-1 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
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
          onClick={() => setActiveTab("whatsapp_orders")} 
          whileHover={{ scale: 0.98 }}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center gap-2 text-green-100">
            <MessageCircleWarning className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">WA Orders</span>
          </div>
          <div>
            <p className="text-2xl font-black">42</p>
            <p className="text-[10px] font-medium text-green-100">Incoming Orders</p>
          </div>
        </motion.div>
        
        <motion.div 
          onClick={() => setActiveTab("whatsapp_connection")} 
          whileHover={{ scale: 0.98 }}
          className="col-span-1 md:col-span-2 bg-gradient-to-br from-[#128C7E] to-[#075E54] text-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between opacity-90"
        >
          <div className="flex items-center gap-2 text-green-100">
            <MessageCircleWarning className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">WA Bot</span>
          </div>
          <div>
            <p className="text-2xl font-black">Active</p>
            <p className="text-[10px] font-medium text-green-100">Bot Status</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/WorkspaceOS.tsx', code);
console.log("Written WorkspaceOS.tsx");
