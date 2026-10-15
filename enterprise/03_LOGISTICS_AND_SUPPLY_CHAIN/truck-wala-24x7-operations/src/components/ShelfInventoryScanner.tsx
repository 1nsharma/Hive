import React, { useState } from "react";
import {
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Edit2,
  Check,
  Upload,
  Eye,
  Info,
  Package,
} from "lucide-react";
import { DetectedShelfItem } from "../types";

interface ShelfInventoryScannerProps {
  shelfItems: DetectedShelfItem[];
  onVerifyItem: (id: string, actualQty: number) => void;
  onScanNewShelf: (rackLabel: string) => Promise<void>;
  isScanning: boolean;
}

export const ShelfInventoryScanner: React.FC<ShelfInventoryScannerProps> = ({
  shelfItems,
  onVerifyItem,
  onScanNewShelf,
  isScanning,
}) => {
  const [selectedRack, setSelectedRack] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState<number>(1);
  const [selectedItemForPreview, setSelectedItemForPreview] = useState<DetectedShelfItem | null>(null);
  const [newRackLabel, setNewRackLabel] = useState("Rack F (Springs & Hubs)");

  const racks = Array.from(new Set(shelfItems.map((i) => i.rack)));

  const filteredItems = shelfItems.filter(
    (item) => selectedRack === "ALL" || item.rack === selectedRack
  );

  const handleStartEdit = (item: DetectedShelfItem) => {
    setEditingId(item.id);
    setEditingQty(item.actualQty ?? item.estimatedQty);
  };

  const handleSaveVerify = (id: string) => {
    onVerifyItem(id, editingQty);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Principle #4 Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider">
                Visual Inventory Discovery
              </span>
              <span className="text-xs text-slate-400">• No Shop Shutdown Required</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Old Inventory Photo Discovery — <span className="text-indigo-400">Shop Shelves & Boxes</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "Owner se yeh mat kaho: sara inventory software me daliye. Balki: Shop ki photos bhej dijiye."
              AI visually detects parts, quantities, and boxes with confidence ratings so staff can incrementally verify.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="scan-new-shelf-btn"
              onClick={() => onScanNewShelf(newRackLabel)}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
              <span>{isScanning ? "Scanning Shelf Photo..." : "📸 Scan New Rack Photo"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rack Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
          Racks:
        </span>
        <button
          onClick={() => setSelectedRack("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedRack === "ALL"
              ? "bg-indigo-600 text-white font-bold"
              : "bg-slate-850 text-slate-400 hover:text-white"
          }`}
        >
          All Godown Racks ({shelfItems.length})
        </button>
        {racks.map((rack) => (
          <button
            key={rack}
            onClick={() => setSelectedRack(rack)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedRack === rack
                ? "bg-indigo-600 text-white font-bold"
                : "bg-slate-850 text-slate-400 hover:text-white"
            }`}
          >
            {rack}
          </button>
        ))}
      </div>

      {/* Detected Inventory Table as Specified in Point #4 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-200">
              Detected Inventory from Visual Captures
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click on any item to verify count or view photo evidence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Photo Evidence</th>
                <th className="py-3 px-4">Part / Description</th>
                <th className="py-3 px-4">Shelf / Rack Location</th>
                <th className="py-3 px-4 text-center">Estimated Qty</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4">Packaging Status</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;
                const isHighConfidence = item.confidence >= 80;
                const isLowConfidence = item.confidence < 50;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-850/60 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div
                        onClick={() => setSelectedItemForPreview(item)}
                        className="h-12 w-12 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden cursor-pointer group-hover:border-indigo-500 transition-colors relative"
                      >
                        <img
                          src={item.photoUrl}
                          alt={item.partName}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </td>

                    {/* Part Name */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-100 text-sm">{item.partName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.category}</div>
                      {item.notes && (
                        <div className="text-[10px] text-amber-400/90 italic mt-0.5 max-w-xs truncate">
                          {item.notes}
                        </div>
                      )}
                    </td>

                    {/* Shelf Location */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {item.shelfLocation}
                    </td>

                    {/* Estimated Qty / Editable */}
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={editingQty}
                            onChange={(e) => setEditingQty(Number(e.target.value))}
                            className="w-16 bg-slate-950 border border-amber-500 rounded px-1.5 py-0.5 text-xs text-center font-bold text-amber-300"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-extrabold text-sm text-slate-100">
                            {item.actualQty ?? item.estimatedQty}
                          </span>
                          {item.actualQty && (
                            <span className="text-[10px] text-emerald-400 block font-sans">
                              (Verified)
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* AI Confidence */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                          isHighConfidence
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                            : isLowConfidence
                            ? "bg-rose-950/80 text-rose-300 border border-rose-800/80"
                            : "bg-amber-950/80 text-amber-300 border border-amber-800/80"
                        }`}
                      >
                        {item.confidence}%
                      </span>
                    </td>

                    {/* Packaging Status */}
                    <td className="py-3 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px]">
                        {item.packagingStatus}
                      </span>
                    </td>

                    {/* Verification Status */}
                    <td className="py-3 px-4">
                      {item.verificationStatus === "Verified" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      ) : item.verificationStatus === "Manual Check Required" ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Manual Check</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-semibold text-xs">
                          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveVerify(item.id)}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 ml-auto shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      ) : item.verificationStatus === "Verified" ? (
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="text-slate-400 hover:text-slate-200 text-xs font-semibold p-1"
                          title="Edit Quantity"
                        >
                          <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                          <span>Adjust</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-colors"
                          >
                            Verify Qty
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Preview Modal if clicked */}
      {selectedItemForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-100 text-base">{selectedItemForPreview.partName}</h4>
                <p className="text-xs text-slate-400 font-mono">{selectedItemForPreview.shelfLocation}</p>
              </div>
              <button
                onClick={() => setSelectedItemForPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img
                src={selectedItemForPreview.photoUrl}
                alt={selectedItemForPreview.partName}
                className="w-full max-h-80 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span>AI Detected Boxes / Items:</span>
                <strong className="text-white">{selectedItemForPreview.estimatedQty} units</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Confidence:</span>
                <span className="font-bold text-indigo-400">{selectedItemForPreview.confidence}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Condition / Tag:</span>
                <span>{selectedItemForPreview.packagingStatus}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  onVerifyItem(selectedItemForPreview.id, selectedItemForPreview.estimatedQty);
                  setSelectedItemForPreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Accept & Verify Count ({selectedItemForPreview.estimatedQty} pcs)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
