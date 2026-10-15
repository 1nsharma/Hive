import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";

interface WhatsAppOrdersProps {
  onBack: () => void;
}

export default function WhatsAppOrders({ onBack }: WhatsAppOrdersProps) {
  const orders = [
    { id: "1024", name: "Neha Patel", amount: 1250, time: "2 mins ago", status: "Confirmed", avatar: "NP" },
    { id: "1023", name: "Rahul Verma", amount: 680, time: "12 mins ago", status: "Pending", avatar: "RV" },
    { id: "1022", name: "Anjali Singh", amount: 950, time: "25 mins ago", status: "Confirmed", avatar: "AS" },
    { id: "1021", name: "Mohit Kumar", amount: 560, time: "1 hr ago", status: "Pending", avatar: "MK" },
  ];

  return (
    <div className="bg-white min-h-screen font-sans pb-24">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">WhatsApp Orders</h1>
      </div>

      <div className="p-4 space-y-4">
        {orders.map((order, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#15803D] font-bold flex items-center justify-center text-sm">
                {order.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{order.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span>Order #{order.id}</span>
                  <span className="font-bold text-gray-900">₹{order.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-gray-400 font-medium">{order.time}</span>
              {order.status === "Confirmed" ? (
                <div className="flex items-center gap-1 text-[#16A34A]">
                  <span className="text-[10px] font-bold">Confirmed</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-500">
                  <span className="text-[10px] font-bold">Pending</span>
                  <Clock className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 mt-4">
        <button className="w-full py-3.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors cursor-pointer shadow-md">
          View All Orders
        </button>
      </div>
    </div>
  );
}
