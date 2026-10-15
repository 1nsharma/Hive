import React, { useState } from 'react';
import { Package, Calendar, Clock, CheckCircle2, Truck, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { Order, ServiceBooking } from '../types';

interface OrdersBookingsProps {
  orders: Order[];
  bookings: ServiceBooking[];
}

export const OrdersBookings: React.FC<OrdersBookingsProps> = ({ orders, bookings }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings'>('orders');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header & Tab Switcher */}
      <div className="p-6 rounded-3xl border bg-[#FDFBF7] shadow-xs space-y-4" style={{ borderColor: '#E5DFD3' }}>
        <div>
          <h2 className="text-2xl font-extrabold text-[#0E3D2F]">Orders & Bookings History</h2>
          <p className="text-xs text-stone-500">Track marketplace deliveries and scheduled expert service appointments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl border" style={{ borderColor: '#E5DFD3' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-[#175741] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" /> Product Purchases ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#175741] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-4 h-4" /> Service Appointments ({bookings.length})
          </button>
        </div>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-8 rounded-3xl border bg-white text-center text-stone-500 space-y-2" style={{ borderColor: '#E5DFD3' }}>
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs font-semibold">No marketplace orders placed yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-3xl border bg-white shadow-xs space-y-4"
                style={{ borderColor: '#E5DFD3' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">{order.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {order.date}
                      </span>
                    </div>
                    {order.petName && (
                      <span className="text-[11px] text-stone-500">Ordered for: <strong className="text-stone-800">{order.petName}</strong></span>
                    )}
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-extrabold px-3 py-1 rounded-full border ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : order.status === 'Shipped'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {order.status === 'Delivered' ? '✅ Delivered' : order.status === 'Shipped' ? '🚚 In Transit' : '⚙️ Processing'}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-stone-800 font-semibold p-2 bg-stone-50 rounded-xl">
                      <span>{item.quantity}x {item.productName}</span>
                      <span className="font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Footer info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t" style={{ borderColor: '#F0EBE1' }}>
                  <div className="text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {order.shippingAddress}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-stone-500">Total Paid:</span>
                    <span className="text-base font-black text-[#0E3D2F]">{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-8 rounded-3xl border bg-white text-center text-stone-500 space-y-2" style={{ borderColor: '#E5DFD3' }}>
              <Calendar className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-xs font-semibold">No service appointments scheduled yet.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-5 rounded-3xl border bg-white shadow-xs space-y-3"
                style={{ borderColor: '#E5DFD3' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {booking.id}
                    </span>
                    <h3 className="font-extrabold text-base text-stone-900 mt-1">{booking.serviceName}</h3>
                  </div>

                  <span className={`self-start sm:self-auto text-xs font-extrabold px-3 py-1 rounded-full border ${
                    booking.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {booking.status === 'Completed' ? '✓ Completed' : '🗓️ Confirmed'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl">
                  <div><span className="text-stone-400">Pet:</span> <strong className="text-stone-900">{booking.petName}</strong></div>
                  <div><span className="text-stone-400">Date:</span> <strong className="text-stone-900">{booking.date}</strong></div>
                  <div><span className="text-stone-400">Time Slot:</span> <strong className="text-stone-900">{booking.timeSlot}</strong></div>
                  <div><span className="text-stone-400">Amount:</span> <strong className="text-[#0E3D2F] font-black">{booking.priceFormatted}</strong></div>
                  <div className="sm:col-span-2"><span className="text-stone-400">Location:</span> <strong>{booking.address}</strong></div>
                </div>

                {booking.notes && (
                  <div className="text-xs text-stone-500 italic bg-amber-50/50 p-2 rounded-xl">
                    Note: "{booking.notes}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
