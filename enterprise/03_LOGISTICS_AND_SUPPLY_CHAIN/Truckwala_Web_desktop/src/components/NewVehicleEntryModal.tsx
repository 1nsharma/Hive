import React, { useState } from "react";
import { X, Truck, Wrench, User, DollarSign, CheckCircle2 } from "lucide-react";
import { WorkItem } from "../types";

interface NewVehicleEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkItem: (item: WorkItem) => void;
}

export const NewVehicleEntryModal: React.FC<NewVehicleEntryModalProps> = ({
  isOpen,
  onClose,
  onAddWorkItem,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("Tata 1618 LPT (BS-IV)");
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState<WorkItem["category"]>("Clutch");
  const [estimateAmount, setEstimateAmount] = useState<number>(12000);
  const [assignedTechnician, setAssignedTechnician] = useState("Raj Kumar (Ustad)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newItem: WorkItem = {
      id: "work-" + Date.now(),
      vehicleNumber: vehicleNumber || "UP 14 BT " + Math.floor(1000 + Math.random() * 9000),
      vehicleModel,
      issue: issue || `${category} Overhaul & Inspection`,
      category,
      status: "In Process",
      partsStatus: "Pending",
      estimateAmount: Number(estimateAmount) || 10000,
      actualAmount: 0,
      assignedTechnician,
      reportedTime: timeStr,
      totalEvents: 2,
      evidenceCount: 0,
      lastUpdate: "Just now",
      timeline: [
        {
          id: "tl-new-1",
          time: timeStr,
          title: "Vehicle entered workshop bay",
          description: `Vehicle checked in by gate operator. ${vehicleModel}`,
          iconType: "mic",
          completed: true,
        },
        {
          id: "tl-new-2",
          time: timeStr,
          title: `Initial triage: ${category}`,
          description: `Assigned to ${assignedTechnician}. Estimate ₹${estimateAmount} awaiting owner sign-off.`,
          iconType: "wrench",
          completed: true,
        },
        {
          id: "tl-new-3",
          time: "Pending",
          title: "Parts requisition & disassembly",
          description: "Awaiting shop floor mechanic report",
          iconType: "clock",
          completed: false,
        },
      ],
    };

    onAddWorkItem(newItem);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">New Job Order</h2>
              <p className="text-xs text-gray-500">Commercial Bay Check-In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              required
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. UP 32 XX 5544"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-primary focus:border-transparent font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Vehicle Model
            </label>
            <select
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="Tata 1618 LPT (BS-IV)">Tata 1618 LPT (BS-IV)</option>
              <option value="Tata Signa 4825.TK">Tata Signa 4825.TK</option>
              <option value="Tata Prima 4028.S">Tata Prima 4028.S</option>
              <option value="Ashok Leyland 2820 HG">Ashok Leyland 2820 HG</option>
              <option value="Cummins ISBe 5.9 Commercial">Cummins ISBe 5.9 Commercial</option>
              <option value="BharatBenz 3528R Heavy Tipper">BharatBenz 3528R Heavy Tipper</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkItem["category"])}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Clutch">Clutch</option>
                <option value="Engine">Engine</option>
                <option value="Brake">Brake</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Estimate (₹)
              </label>
              <input
                type="number"
                value={estimateAmount}
                onChange={(e) => setEstimateAmount(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Issue / Complaint
            </label>
            <input
              type="text"
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Clutch slip under full load, pedal soft"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Assigned Master Technician / Bay
            </label>
            <select
              value={assignedTechnician}
              onChange={(e) => setAssignedTechnician(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="Raj Kumar (Ustad) - Bay 3">Raj Kumar (Ustad) - Bay 3</option>
              <option value="Vikram Patel (Diagnostics Eng.) - Bay 1">Vikram Patel (Diagnostics Eng.) - Bay 1</option>
              <option value="Mohan Lal (Brake Spec.) - Bay 2">Mohan Lal (Brake Spec.) - Bay 2</option>
              <option value="Ramesh Ustad (Mobile Van 2)">Ramesh Ustad (Mobile Van 2)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition text-sm shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Create Job Order & Open Bay</span>
          </button>
        </form>
      </div>
    </div>
  );
};
