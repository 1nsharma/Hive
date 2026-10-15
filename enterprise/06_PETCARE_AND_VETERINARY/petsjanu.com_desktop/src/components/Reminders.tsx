import React from "react";
import { Vaccination } from "../types";

interface RemindersProps {
  vaccinations: Vaccination[];
  onMarkDone: (id: string) => void;
}

export default function Reminders({ vaccinations, onMarkDone }: RemindersProps) {
  const doneCount = vaccinations.filter((v) => v.done).length;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
      <h5 className="font-mono text-xs tracking-wider flex justify-between items-center text-stone-500 font-bold uppercase">
        VACCINATION &amp; CARE REMINDERS 
        <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
          {doneCount}/{vaccinations.length} COMPLETED
        </span>
      </h5>
      
      <div className="flex flex-col divide-y divide-dashed divide-stone-200">
        {vaccinations.map((v) => (
          <div key={v.id} className="flex items-center gap-3 py-3 last:pb-0">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              v.done ? "bg-emerald-600" : "bg-amber-500 animate-pulse"
            }`}></span>
            
            <div className="flex-1 text-xs">
              <span className="font-bold text-stone-900 block">{v.name}</span>
              <small className="block text-stone-500 font-medium">Due Date: {v.due}</small>
            </div>
            
            {!v.done ? (
              <button 
                onClick={() => onMarkDone(v.id)}
                className="border border-stone-300 hover:border-emerald-700 hover:text-emerald-800 bg-white rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer"
              >
                Mark done ✓
              </button>
            ) : (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                ✓ Done
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
