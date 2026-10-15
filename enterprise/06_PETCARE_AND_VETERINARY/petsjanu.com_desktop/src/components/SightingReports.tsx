import React, { useState } from "react";
import { SightingReport } from "../types";

interface SightingReportsProps {
  reports: SightingReport[];
  onAddReport: (report: Omit<SightingReport, 'id' | 'petId' | 'petName' | 'status'>) => void;
  triggerToast: (msg: string) => void;
}

export default function SightingReports({ reports, onAddReport, triggerToast }: SightingReportsProps) {
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    onAddReport({
      location: location.trim(),
      time: "Just now",
      note: note.trim(),
      phone: phone.trim() || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    setPhone("");
    setLocation("");
    setNote("");

    triggerToast("📍 Sighting report sent to pet owner. Thank you!");
  };

  return (
    <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
      <h5 className="font-mono text-xs tracking-wider flex justify-between items-center text-stone-500 font-bold uppercase">
        LIVE SIGHTING REPORTS 
        <span className="bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded text-[10px]">
          {reports.length} REPORT{reports.length === 1 ? "" : "S"}
        </span>
      </h5>
      
      <div className="max-h-60 overflow-y-auto space-y-2.5">
        {reports.length === 0 ? (
          <p className="text-xs text-stone-500 italic text-center py-4">No sightings reported yet.</p>
        ) : (
          reports.map((s) => (
            <div key={s.id} className="border-l-4 border-amber-500 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/60 text-xs space-y-1">
              <div className="flex justify-between font-bold text-stone-800">
                <span>📍 Location: {s.location}</span>
                <time className="font-mono text-[10px] text-stone-400 font-normal">{s.time || s.createdAt}</time>
              </div>
              {s.note && <p className="text-stone-600">{s.note}</p>}
              {s.phone && <span className="text-[10px] text-emerald-800 font-semibold block">Contact: {s.phone}</span>}
            </div>
          ))
        )}
      </div>

      <form className="grid gap-2.5 pt-2" onSubmit={handleSubmit}>
        <input 
          required 
          placeholder="Landmark / Location seen" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-stone-200 rounded-xl p-2.5 text-xs bg-stone-50 outline-none focus:border-emerald-700"
        />
        <input 
          placeholder="Your phone number (optional)" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border border-stone-200 rounded-xl p-2.5 text-xs bg-stone-50 outline-none focus:border-emerald-700"
        />
        <textarea 
          rows={2} 
          placeholder="Sighting notes (e.g. collar color, direction)..." 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border border-stone-200 rounded-xl p-2.5 text-xs bg-stone-50 outline-none focus:border-emerald-700 resize-none"
        />
        <button className="bg-[#175741] hover:bg-emerald-900 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs" type="submit">
          📍 Send Sighting Report
        </button>
      </form>
    </div>
  );
}
