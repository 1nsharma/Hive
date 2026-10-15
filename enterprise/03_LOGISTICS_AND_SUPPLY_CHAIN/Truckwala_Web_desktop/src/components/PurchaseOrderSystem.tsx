import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  Camera,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Database,
  Layers,
  ArrowRight,
  Receipt,
  Truck,
  IndianRupee,
  Calendar,
  User,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { PurchaseOrderRecord, PurchaseOrderItem } from "../types";

interface PurchaseOrderSystemProps {
  orders: PurchaseOrderRecord[];
  onUpdateOrder: (updated: PurchaseOrderRecord) => void;
  onSimulateDeliveryMessage: (orderId: string) => void;
}

export const PurchaseOrderSystem: React.FC<PurchaseOrderSystemProps> = ({
  orders,
  onUpdateOrder,
  onSimulateDeliveryMessage,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("PO-2024-001");
  const [activeSubTab, setActiveSubTab] = useState<"detail" | "all-orders" | "blueprint" | "sql-schema" | "scan-bill">("detail");
  const [copiedSql, setCopiedSql] = useState(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const selectedOrder = orders.find((o) => o.orderId === selectedOrderId) || orders[0];

  // Calculate metrics for dashboard view
  const activeOrdersCount = orders.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED").length;
  const pendingValue = orders
    .filter((o) => o.paymentStatus !== "PAID")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const overdueCount = orders.filter((o) => o.orderId === "PO-2024-002").length;
  const receivedTodayAmount = orders.find((o) => o.orderId === "PO-2024-001")?.totalAmount || 50600;

  // Item counts
  const totalItemsCount = selectedOrder?.items.length || 0;
  const receivedItemsCount = selectedOrder?.items.filter((i) => i.status === "RECEIVED").length || 0;
  const pendingItemsCount = totalItemsCount - receivedItemsCount;

  // Handler to receive remaining items
  const handleReceiveAll = () => {
    if (!selectedOrder) return;
    const updatedItems = selectedOrder.items.map((i) => ({
      ...i,
      status: "RECEIVED" as const,
      condition: "GOOD" as const,
      quantityReceived: i.quantityOrdered,
      receivedDate: "Today, 02:15 PM",
      verifiedBy: "Ramesh Ustad (Head Mechanic)",
    }));

    const updatedChecklist = selectedOrder.auditChecklist.map((c) => ({
      ...c,
      passed: true,
      note: c.note.includes("pending") ? "All 17/17 items fully received & verified" : c.note,
    }));

    const updatedTrail = [
      ...selectedOrder.auditTrail,
      {
        timestamp: "Today, 02:15 PM",
        action: "GOODS_RECEIVED" as const,
        actionBy: "Ramesh Ustad via WhatsApp",
        details: 'Staff sent "PO-2024-001 maal aa gaya" with delivery photo. All 17/17 parts verified in physical inventory.',
        evidenceType: "WHATSAPP_PHOTO" as const,
      },
    ];

    const updatedOrder: PurchaseOrderRecord = {
      ...selectedOrder,
      items: updatedItems,
      status: "COMPLETED",
      paymentStatus: "PAID",
      actualDelivery: "Today",
      auditChecklist: updatedChecklist,
      auditTrail: updatedTrail,
    };

    onUpdateOrder(updatedOrder);
    onSimulateDeliveryMessage(selectedOrder.orderId);
    setNotificationBanner('✅ "PO-2024-001 maal aa gaya" received via WhatsApp! 17/17 items verified & inventory incremented.');
    setTimeout(() => setNotificationBanner(null), 6000);
  };

  // Toggle single item status
  const handleToggleItemStatus = (itemId: number) => {
    if (!selectedOrder) return;
    const updatedItems = selectedOrder.items.map((i) => {
      if (i.itemId === itemId) {
        const nextStatus = i.status === "RECEIVED" ? "PENDING" : "RECEIVED";
        return {
          ...i,
          status: nextStatus as any,
          quantityReceived: nextStatus === "RECEIVED" ? i.quantityOrdered : 0,
          condition: nextStatus === "RECEIVED" ? ("GOOD" as const) : ("PENDING_CHECK" as const),
          receivedDate: nextStatus === "RECEIVED" ? "Today" : undefined,
          verifiedBy: nextStatus === "RECEIVED" ? "Ramesh Ustad" : undefined,
        };
      }
      return i;
    });

    const anyPending = updatedItems.some((i) => i.status !== "RECEIVED");
    onUpdateOrder({
      ...selectedOrder,
      items: updatedItems,
      status: anyPending ? "PARTIAL" : "COMPLETED",
    });
  };

  const copySqlToClipboard = () => {
    const sqlText = `-- Purchase Order Table
CREATE TABLE purchase_orders (
    order_id VARCHAR(20) PRIMARY KEY, -- PO-2024-001
    dealer_id VARCHAR(20),
    order_date DATE,
    expected_delivery DATE,
    actual_delivery DATE,
    total_amount DECIMAL(10,2),
    status ENUM('PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED'),
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID'),
    created_by VARCHAR(50),
    evidence_photos JSON,
    bill_pdf VARCHAR(255)
);

-- Order Items Table
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20),
    part_name VARCHAR(100),
    quantity_ordered INT,
    quantity_received INT,
    rate_per_unit DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    received_date DATE,
    verified_by VARCHAR(50),
    quality_status ENUM('GOOD', 'DAMAGED', 'WRONG_ITEM'),
    FOREIGN KEY (order_id) REFERENCES purchase_orders(order_id)
);

-- Audit Trail Table
CREATE TABLE audit_trail (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20),
    action VARCHAR(50), -- ORDER_CREATED, GOODS_RECEIVED, PAYMENT_MADE
    action_by VARCHAR(50),
    action_timestamp DATETIME,
    details JSON,
    evidence_file VARCHAR(255)
);`;
    navigator.clipboard?.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Alert if active */}
      {notificationBanner && (
        <div className="bg-emerald-950/90 border border-emerald-500/50 rounded-xl p-4 text-emerald-200 text-xs sm:text-sm font-medium flex items-center justify-between shadow-lg shadow-emerald-950/50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{notificationBanner}</span>
          </div>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-xs text-emerald-400 hover:text-white px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Title Banner */}
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-800/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                Actual Handwritten Purchase Order
              </span>
              <span className="text-xs text-slate-400">• Complete Audit Trail & Tracking</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Purchase Order Audit & Tracking System</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">PO-2024-001</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Order Details extracted from your handwritten bill (17 parts, ₹50,600). Connects physical shop parchi
              to WhatsApp delivery verification, automated inventory sync, and cryptographic audit records.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab("blueprint")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeSubTab === "blueprint"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 text-amber-300 border-slate-800 hover:border-amber-500/50"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Master Blueprint (v1.0)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("sql-schema")}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                activeSubTab === "sql-schema"
                  ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>SQL Schema</span>
            </button>
          </div>
        </div>
      </div>

      {/* Owner Dashboard KPI View (As requested by user) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>📦 Active Orders</span>
            <span className="text-[10px] text-amber-400 font-mono">Real-time</span>
          </div>
          <div className="text-2xl font-black text-white">{activeOrdersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">PO-001, PO-002, PO-003</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>💰 Pending Value</span>
            <span className="text-[10px] text-slate-400 font-mono">Unpaid</span>
          </div>
          <div className="text-2xl font-black text-amber-400">₹{pendingValue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Across active suppliers</div>
        </div>

        <div className="bg-slate-900/90 border border-rose-900/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>⚠️ Overdue Orders</span>
            <span className="text-[10px] text-rose-400 font-bold">Alert</span>
          </div>
          <div className="text-2xl font-black text-rose-400">{overdueCount}</div>
          <div className="text-[11px] text-rose-300/80 mt-1">PO-2024-002 delayed 2 days</div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/40 p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>✅ Received Today</span>
            <span className="text-[10px] text-emerald-400 font-bold">Verified</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">₹{receivedTodayAmount.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">PO-2024-001 (Sharma Auto)</div>
        </div>
      </div>

      {/* Secondary Sub Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab("detail")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === "detail"
              ? "bg-amber-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PO-2024-001 Detailed Audit ({totalItemsCount} Parts)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("all-orders")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === "all-orders"
              ? "bg-amber-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>All Orders Registry ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("blueprint")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === "blueprint"
              ? "bg-amber-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Master System Blueprint (v1.0)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("sql-schema")}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === "sql-schema"
              ? "bg-amber-500 text-slate-950 font-bold shadow"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Database Tables (SQL)</span>
        </button>
      </div>

      {/* TAB 1: PO-2024-001 Detailed Audit View */}
      {activeSubTab === "detail" && selectedOrder && (
        <div className="space-y-6">
          {/* Order Header / Stage Progress Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold text-white font-mono">{selectedOrder.orderId}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      selectedOrder.status === "COMPLETED"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : selectedOrder.status === "PARTIAL"
                        ? "bg-amber-950 text-amber-300 border-amber-700"
                        : "bg-slate-800 text-slate-300 border-slate-700"
                    }`}
                  >
                    {selectedOrder.status === "COMPLETED"
                      ? "✅ FULLY RECEIVED"
                      : selectedOrder.status === "PARTIAL"
                      ? "⏳ PARTIALLY RECEIVED (12/17)"
                      : "PENDING"}
                  </span>
                  <span className="text-xs text-slate-400">
                    Supplier: <strong className="text-slate-200">{selectedOrder.dealerName}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>📅 Order Date: <strong className="text-slate-300">{selectedOrder.orderDate}</strong></span>
                  <span>🚚 Expected Delivery: <strong className="text-slate-300">{selectedOrder.expectedDelivery}</strong></span>
                  <span>💳 Mode: <strong className="text-slate-300">{selectedOrder.paymentMode}</strong></span>
                  <span>👤 Created By: <strong className="text-slate-300">{selectedOrder.createdBy}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right">
                  <span className="text-[11px] text-slate-400 block">Total Order Value</span>
                  <span className="text-xl font-black text-amber-400 font-mono">
                    ₹{selectedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>

                {selectedOrder.status !== "COMPLETED" && (
                  <button
                    id="btn-simulate-full-receipt"
                    onClick={handleReceiveAll}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Receive All 17 Items (Simulate "Maal Aa Gaya")</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stage Tracking Bar */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-300">
                  Goods Receipt Progress: {receivedItemsCount} of {totalItemsCount} items received
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round((receivedItemsCount / totalItemsCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  style={{ width: `${(receivedItemsCount / totalItemsCount) * 100}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                ></div>
              </div>

              {/* 4-Stage Workflow Breadcrumb */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4 text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-800/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block">Stage 1: Placed</strong>
                    <span className="text-slate-400">PO-2024-001 Created</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-emerald-800/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <strong className="text-white block">Stage 2: Delivery Track</strong>
                    <span className="text-slate-400">10-Sep-2024 Verified</span>
                  </div>
                </div>

                <div
                  className={`bg-slate-950 p-2.5 rounded-lg border flex items-center gap-2 ${
                    selectedOrder.status === "COMPLETED"
                      ? "border-emerald-800/40"
                      : "border-amber-800/50"
                  }`}
                >
                  {selectedOrder.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <div>
                    <strong className="text-white block">Stage 3: WhatsApp Sync</strong>
                    <span className="text-slate-400">
                      {selectedOrder.status === "COMPLETED" ? "17/17 Received" : "12/17 Received"}
                    </span>
                  </div>
                </div>

                <div
                  className={`bg-slate-950 p-2.5 rounded-lg border flex items-center gap-2 ${
                    selectedOrder.status === "COMPLETED"
                      ? "border-emerald-800/40"
                      : "border-slate-800"
                  }`}
                >
                  {selectedOrder.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                  <div>
                    <strong className="text-white block">Stage 4: Audit Verified</strong>
                    <span className="text-slate-400">
                      {selectedOrder.status === "COMPLETED" ? "7/7 Checklist Green" : "6/7 Passed"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 17 Extracted Parts Table (Direct from user's handwritten bill) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>Extracted Line Items from Handwritten Parchi</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono font-bold">
                    17 Items • Total ₹50,600
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click on status badge to toggle between Received / Pending check
                </p>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  {receivedItemsCount} Received
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  {pendingItemsCount} Pending
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-3 text-center">#</th>
                    <th className="py-3 px-3 font-mono">Date / Code</th>
                    <th className="py-3 px-4">Part Name (Extracted Description)</th>
                    <th className="py-3 px-3 text-center">Ordered</th>
                    <th className="py-3 px-3 text-center">Received</th>
                    <th className="py-3 px-3 text-right">Rate (₹)</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-3 text-center">Quality Condition</th>
                    <th className="py-3 px-3 text-center">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {selectedOrder.items.map((item) => (
                    <tr
                      key={item.itemId}
                      className={`hover:bg-slate-850/50 transition-colors ${
                        item.status === "RECEIVED" ? "bg-slate-900/40" : "bg-amber-950/10"
                      }`}
                    >
                      <td className="py-3 px-3 text-center font-mono text-slate-400">
                        {item.itemId}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 font-bold">
                        {item.code || "-"}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{item.partName}</span>
                          {item.verifiedBy && (
                            <span className="text-[10px] text-slate-500 hidden md:inline">
                              (by {item.verifiedBy})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                        {item.quantityOrdered}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                        {item.quantityReceived}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        ₹{item.ratePerUnit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                        ₹{item.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.condition === "GOOD"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                              : item.condition === "DAMAGED"
                              ? "bg-rose-950 text-rose-300 border border-rose-800"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {item.condition === "GOOD" ? "✅ Good" : item.condition === "DAMAGED" ? "❌ Damaged" : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleItemStatus(item.itemId)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                            item.status === "RECEIVED"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                          }`}
                          title="Click to toggle status"
                        >
                          {item.status === "RECEIVED" ? "✅ Received" : "⏳ Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-950 border-t-2 border-slate-700 font-bold">
                  <tr>
                    <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider text-slate-300 text-xs">
                      Grand Total (17 Items)
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-white text-xs">
                      {selectedOrder.items.reduce((s, i) => s + i.quantityOrdered, 0)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-emerald-400 text-xs">
                      {selectedOrder.items.reduce((s, i) => s + i.quantityReceived, 0)}
                    </td>
                    <td></td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400 text-sm">
                      ₹{selectedOrder.totalAmount.toLocaleString()}
                    </td>
                    <td colSpan={2} className="py-3.5 px-3 text-center text-slate-400 text-[11px]">
                      {receivedItemsCount === totalItemsCount ? "✅ 100% Fulfilled" : "⏳ 5 Items Pending"}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Bottom Grid: Stage 4 Audit Checklist + Digital Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stage 4: 7-Point Audit Checklist (Left 6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm text-slate-100">
                    Stage 4: 7-Point Mandatory Audit Checklist
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                  {selectedOrder.auditChecklist.filter((c) => c.passed).length}/7 Passed
                </span>
              </div>

              <div className="space-y-2.5 pt-1 text-xs">
                {selectedOrder.auditChecklist.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border flex items-start justify-between gap-3 ${
                      item.passed
                        ? "bg-slate-950/60 border-slate-800"
                        : "bg-amber-950/20 border-amber-800/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-semibold text-slate-200">{item.check}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${
                        item.passed
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-amber-950 text-amber-300 border border-amber-800"
                      }`}
                    >
                      {item.passed ? "VERIFIED" : "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Audit Trail Timeline (Right 6 cols) */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-sm text-slate-100">
                    Cryptographic Digital Audit Trail
                  </h3>
                </div>
                <span className="text-xs text-slate-400">PO-2024-001 Chain</span>
              </div>

              <div className="relative pl-6 space-y-4 pt-2 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {selectedOrder.auditTrail.map((entry, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-slate-900 shadow"></div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-200">
                          {entry.action.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {entry.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed">
                        {entry.details}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-850">
                        <span>By: {entry.actionBy}</span>
                        {entry.evidenceType && (
                          <span className="text-amber-400/90 font-mono">
                            Evidence: {entry.evidenceType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: All Orders Registry */}
      {activeSubTab === "all-orders" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-200">
                Active Purchase Orders Registry ({orders.length})
              </h3>
              <p className="text-xs text-slate-400">
                Click "View & Audit" to inspect line-by-line item verification
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Supplier / Dealer</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Payment</th>
                  <th className="py-3 px-4 text-center">Order Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {o.orderId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {o.dealerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {o.orderDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">Exp: {o.expectedDelivery}</div>
                      {o.orderId === "PO-2024-002" && (
                        <span className="text-[10px] text-rose-400 font-bold">⚠️ Delayed 2 Days</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                      ₹{o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === "PAID"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : o.paymentStatus === "PARTIAL"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-rose-950 text-rose-300 border border-rose-800"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === "COMPLETED"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : o.status === "PARTIAL"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrderId(o.orderId);
                          setActiveSubTab("detail");
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition-all"
                      >
                        View & Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Master System Blueprint (v1.0) Visualizer */}
      {activeSubTab === "blueprint" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>TRUCK WALA 24×7 — MASTER SYSTEM BLUEPRINT (v1.0)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Architecture foundation: WhatsApp-First capture ➔ AI/OCR Intelligence ➔ 8 Core Modules ➔ Audit Engine ➔ Multi-Interface
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs">
                Production Ready Blueprint
              </span>
            </div>

            {/* 3 Core Rules Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Rule 01</span>
                <h4 className="font-bold text-sm text-slate-100 mt-1">No Software Burden on Owner</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Owner ko software operate nahi karna padega; his existing WhatsApp and photos are the source.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Rule 02</span>
                <h4 className="font-bold text-sm text-slate-100 mt-1">No Data Without Evidence</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Original bills, photos, voice notes, and timestamps are never destroyed; ledger balances are 100% traceable.
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-800/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Rule 03</span>
                <h4 className="font-bold text-sm text-slate-100 mt-1">AI Recommends ➔ Human Validates</h4>
                <p className="text-xs text-slate-400 mt-1">
                  AI performs OCR & extraction; owner/head mechanic confirms; system commits to verified stock.
                </p>
              </div>
            </div>

            {/* 8 Core Data Modules Grid */}
            <div className="pt-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                8 Core Data Modules Architecture
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">01. Customer</div>
                  <div className="text-slate-300 font-semibold mt-1">Owner & Fleet Operators</div>
                  <div className="text-[11px] text-slate-500">Profiles, credit limits & bills</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">02. Vehicle Digital Twin</div>
                  <div className="text-slate-300 font-semibold mt-1">RC, Fitness, Engine, KM</div>
                  <div className="text-[11px] text-slate-500">Commercial trucks & trailers</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">03. Driver Management</div>
                  <div className="text-slate-300 font-semibold mt-1">Assignment & Emergency Contact</div>
                  <div className="text-[11px] text-slate-500">Live breakdown reporting</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">04. Technical & Job Card</div>
                  <div className="text-slate-300 font-semibold mt-1">Inspection & Repair Protocol</div>
                  <div className="text-[11px] text-slate-500">L1 Driver ➔ L2 Tech ➔ L3 Eng</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">05. Parts / Inventory</div>
                  <div className="text-slate-300 font-semibold mt-1">SKU, Stock, Shelf Location</div>
                  <div className="text-[11px] text-slate-500">Visual shelf discovery sync</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">06. Dealer Intelligence</div>
                  <div className="text-slate-300 font-semibold mt-1">Rates, Credit Ledger & Reliability</div>
                  <div className="text-[11px] text-slate-500">Price card matching</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">07. Financial Core</div>
                  <div className="text-slate-300 font-semibold mt-1">Purchase, Sale, Margin, GST</div>
                  <div className="text-[11px] text-slate-500">Missing bill discovery</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold font-mono">08. Evidence Vault</div>
                  <div className="text-slate-300 font-semibold mt-1">SHA-256 Cryptographic Trace</div>
                  <div className="text-[11px] text-slate-500">Photos, PDFs & voice audio</div>
                </div>
              </div>
            </div>

            {/* Phased Rollout Roadmap */}
            <div className="pt-3 border-t border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-3">
                8-Phase Commercial Vehicle Roadmap
              </h4>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-emerald-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-emerald-400">PHASE 1 (CURRENT)</span>
                    <span className="text-white font-semibold">WhatsApp + AI + Purchase/Inventory Database</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                    ACTIVE NOW
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500">PHASE 2</span>
                    <span>Vehicle Master + Customer + Driver Registry</span>
                  </div>
                  <span className="text-[11px]">Ready</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500">PHASE 3</span>
                    <span>Digital Job Card + Technical Mobile Van Inspection</span>
                  </div>
                  <span className="text-[11px]">Ready</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500">PHASE 4</span>
                    <span>Dealer Comparison Engine + Purchase Price Optimization</span>
                  </div>
                  <span className="text-[11px]">Scheduled</span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-slate-500">PHASE 5-8</span>
                    <span>Highway 24×7 Emergency Mesh, Telematics & Engineer Decision Engine</span>
                  </div>
                  <span className="text-[11px]">Vision 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Database Tables (SQL Schema) */}
      {activeSubTab === "sql-schema" && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Production SQL Schema for Purchase Orders & Audit</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct database structure matching your PO tracking system specification.
                </p>
              </div>

              <button
                onClick={copySqlToClipboard}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? "Copied SQL!" : "Copy SQL"}</span>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed">
              <pre className="text-slate-300">{`-- 1. Purchase Orders Table
CREATE TABLE purchase_orders (
    order_id VARCHAR(20) PRIMARY KEY,      -- e.g., 'PO-2024-001'
    dealer_id VARCHAR(20),
    order_date DATE,
    expected_delivery DATE,
    actual_delivery DATE,
    total_amount DECIMAL(10,2),            -- 50600.00
    status ENUM('PENDING', 'PARTIAL', 'COMPLETED', 'CANCELLED'),
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID'),
    payment_mode ENUM('Credit', 'Cash', 'UPI', 'Bank Transfer'),
    transaction_id VARCHAR(50),
    created_by VARCHAR(50),
    evidence_photos JSON,
    bill_pdf VARCHAR(255)
);

-- 2. Order Items Table (17 parts extracted from handwritten parchi)
CREATE TABLE order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20),
    part_name VARCHAR(100),                -- 'Viscus T', 'Relay 4 Pin', 'UC Visvus'
    part_code VARCHAR(50),                 -- '3/86', '6/18', '6/26'
    quantity_ordered INT,
    quantity_received INT,
    rate_per_unit DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    received_date DATE,
    verified_by VARCHAR(50),
    quality_status ENUM('GOOD', 'DAMAGED', 'WRONG_ITEM'),
    FOREIGN KEY (order_id) REFERENCES purchase_orders(order_id)
);

-- 3. Audit Trail Table (Immutable evidence logs)
CREATE TABLE audit_trail (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20),
    action VARCHAR(50),                    -- 'ORDER_CREATED', 'GOODS_RECEIVED', 'PAYMENT_RECORDED'
    action_by VARCHAR(50),
    action_timestamp DATETIME,
    details JSON,
    evidence_file VARCHAR(255)
);`}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
