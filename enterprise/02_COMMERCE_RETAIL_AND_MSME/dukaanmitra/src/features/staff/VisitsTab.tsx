import React, { useMemo } from 'react';
import { formatRupees } from '../../utils';
import { motion } from 'motion/react';
import { Clock, IndianRupee, Printer, User } from 'lucide-react';

export default function VisitsTab({ transactions, customers }: any) {
  // Sort transactions by date descending
  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  return (
    <div className="h-full flex flex-col p-4 bg-slate-100 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800">Visit Tokens ({sorted.length})</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">Today's Log</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
        {sorted.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-10 bg-white rounded-3xl shadow-sm border border-slate-200 border-dashed">No visits recorded yet.</div>
        ) : (
          sorted.map((tx: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={tx.id} 
              className="bg-white rounded-xl shadow-sm relative overflow-hidden flex flex-col"
              style={{
                filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.05))"
              }}
            >
              {/* Ticket Jagged Edge Top */}
              <div className="h-3 w-full bg-[radial-gradient(circle,transparent_4px,#ffffff_5px)] bg-[length:12px_12px] -mt-1.5 absolute top-0 left-0"></div>
              
              <div className="p-5 pt-6 pb-4 border-b-2 border-dashed border-slate-200 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Token No.</span>
                    <span className="font-mono text-xl font-bold text-[#16A34A]">#{tx.id.toString().substring(0,6).toUpperCase()}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer">
                    <Printer className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">
                      {tx.customerName || 'Cash Customer'}
                    </h4>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold mt-1 inline-block">
                      {tx.type === 'cash_sale' ? 'CASH' : tx.type === 'payment' ? 'PAYMENT' : 'CREDIT'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-[#F8FAFC] flex items-center justify-between">
                 <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(tx.date).toLocaleString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                 </div>
                 <div className="font-black text-xl text-slate-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    {tx.amount}
                  </div>
              </div>
              
              {/* Ticket Jagged Edge Bottom */}
              <div className="h-3 w-full bg-[radial-gradient(circle,transparent_4px,#f8fafc_5px)] bg-[length:12px_12px] -mb-1.5 absolute bottom-0 left-0"></div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
