import React, { useEffect, useRef, useState } from 'react';
import { Order, Shop } from '../../types/database';
import JsBarcode from 'jsbarcode';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { printThermalKOT } from '../../lib/thermalPrinter';

interface CustomReceiptProps {
  shop: Partial<Shop> & { name: string; logo_url?: string; theme_color?: string; gstin?: string };
  order: Order;
  waitTimeMins?: number;
  onOpenGstBill?: () => void;
  onPrintThermal?: () => void;
}

export const CustomReceipt: React.FC<CustomReceiptProps> = ({
  shop,
  order,
  waitTimeMins,
  onOpenGstBill,
  onPrintThermal,
}) => {
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null);

  // Initial wait time in seconds (estimated_wait_mins * 60)
  const initialSeconds = Math.max(1, (waitTimeMins ?? order.estimated_wait_mins ?? 12) * 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);

  // Live countdown timer (Wait Time requirement 1)
  useEffect(() => {
    // If order is READY or COMPLETED, countdown finishes
    if (order.status === 'READY' || order.status === 'COMPLETED') {
      setSecondsRemaining(0);
      return;
    }

    setSecondsRemaining(initialSeconds);
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [initialSeconds, order.status]);

  // Render JsBarcode for Token
  useEffect(() => {
    if (barcodeSvgRef.current) {
      try {
        JsBarcode(barcodeSvgRef.current, order.token || 'K-00', {
          format: 'CODE128',
          lineColor: '#e4e4e7',
          width: 1.8,
          height: 38,
          displayValue: false,
          margin: 0,
          background: 'transparent',
        });
      } catch (err) {
        console.warn('JsBarcode SVG render warning:', err);
      }
    }
  }, [order.token]);

  const isVerifiedPaid = order.payment?.status === 'VERIFIED';
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const brandColor = shop.theme_color || '#4f46e5';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Decorative Brand Color Top Accent */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: brandColor }}
      />

      <div className="p-6">
        {/* Receipt Header: Shop identity + Payment Status Badge */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            {shop.logo_url ? (
              <img 
                src={shop.logo_url} 
                alt={shop.name} 
                className="h-11 w-11 rounded-xl object-cover ring-1 ring-zinc-700 bg-zinc-800 shrink-0" 
              />
            ) : (
              <div 
                className="h-11 w-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow"
                style={{ backgroundColor: brandColor }}
              >
                {shop.name ? shop.name.slice(0, 2).toUpperCase() : 'SH'}
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-zinc-100 tracking-tight">{shop.name}</h2>
              <div className="text-[11px] font-mono text-zinc-400">
                {order.mode === 'DINE_IN' 
                  ? `Dine-In Table ${order.table_number || '-'}` 
                  : order.mode === 'PARCEL' 
                  ? `Parcel / Takeaway: ${order.customer_name || 'Guest'}` 
                  : 'Token Counter Pickup'}
              </div>
            </div>
          </div>

          {/* Top Right: Badge PAID VERIFIED (green) vs PENDING (yellow) */}
          <div className="shrink-0 text-right">
            {isVerifiedPaid ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm animate-pulse">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>PAID VERIFIED</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>PENDING</span>
              </span>
            )}
            <div className="text-[10px] font-mono text-zinc-400 mt-1">
              Method: {order.payment?.method || 'UPI/Counter'}
            </div>
          </div>
        </div>

        {/* Big Token & Amount Display */}
        <div className="py-6 text-center bg-zinc-950/60 rounded-xl my-4 border border-zinc-850 relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
            Order Token / Identifier
          </div>
          
          {/* Big Token */}
          <div 
            className="text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm select-all"
            style={{ textShadow: `0 0 24px ${brandColor}33` }}
          >
            {order.token}
          </div>

          {/* Barcode of Token */}
          <div className="flex justify-center mt-3 opacity-90 hover:opacity-100 transition-opacity">
            <svg ref={barcodeSvgRef} className="h-10 max-w-[200px]" />
          </div>

          {/* Big Total Amount */}
          <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-center gap-2">
            <span className="text-xs text-zinc-400 uppercase font-mono">Total Due:</span>
            <span className="text-2xl font-extrabold font-mono text-zinc-100">
              ${(order.total_cents / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Live Wait Time Countdown Banner (Requirement 1) */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Clock className="h-4.5 w-4.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-200">
                {order.status === 'READY' ? 'Ready for Handover' : 'Estimated Kitchen Wait Time'}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {order.status === 'READY' 
                  ? 'Your items are fresh and waiting!' 
                  : `Queue prep: ~${waitTimeMins ?? order.estimated_wait_mins ?? 12} mins`}
              </div>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="text-right">
            {order.status === 'READY' ? (
              <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                READY NOW
              </span>
            ) : (
              <div className="font-mono text-lg font-bold text-indigo-300">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
            )}
            <div className="text-[10px] text-zinc-400 font-mono">Live Timer</div>
          </div>
        </div>

        {/* Itemized Order List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 pb-2 border-b border-zinc-800">
            <span>Ordered Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</span>
            <span>Price</span>
          </div>

          <div className="divide-y divide-zinc-850">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-200">
                    <span className="text-indigo-400 font-mono mr-1.5">{item.quantity}x</span>
                    {item.name}
                  </div>
                  {item.selected_add_ons && item.selected_add_ons.length > 0 && (
                    <div className="text-[11px] text-zinc-400 pl-5">
                      {item.selected_add_ons.map((ao) => `+ ${ao.name} ($${(ao.price_cents / 100).toFixed(2)})`).join(', ')}
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[11px] text-zinc-400 italic pl-5">
                      Note: {item.notes}
                    </div>
                  )}
                </div>

                <div className="font-mono text-zinc-300 text-xs shrink-0 pl-3">
                  ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Thermal KOT & GST Bill */}
        <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onPrintThermal ? onPrintThermal() : printThermalKOT(order, shop.name, waitTimeMins)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium transition-colors border border-zinc-700/60"
            title="Open 58mm Thermal POS Printer preview with barcode"
          >
            <Printer className="h-3.5 w-3.5 text-zinc-400" />
            <span>Thermal KOT (58mm)</span>
          </button>

          {onOpenGstBill && (
            <button
              onClick={onOpenGstBill}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm ml-auto"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Get GST Tax Bill</span>
            </button>
          )}
        </div>
      </div>

      {/* Micro-footer */}
      <div className="px-6 py-2.5 bg-zinc-950/80 border-t border-zinc-850 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span>Order: {order.order_number}</span>
        <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
};
