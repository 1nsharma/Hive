import React, { useState } from "react";
import {
  Truck,
  Wrench,
  AlertTriangle,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  Cpu,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  FileCode,
  Sparkles,
} from "lucide-react";
import { EmergencyJob, VehicleRecord } from "../types";

interface VehicleEmergencyHubProps {
  emergencyJobs: EmergencyJob[];
  vehicles: VehicleRecord[];
  onResolveEmergency: (id: string) => void;
}

export const VehicleEmergencyHub: React.FC<VehicleEmergencyHubProps> = ({
  emergencyJobs,
  vehicles,
  onResolveEmergency,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"emergencies" | "fleet" | "roadmap" | "engineer-layer">("emergencies");
  const [selectedJob, setSelectedJob] = useState<EmergencyJob>(emergencyJobs[0]);

  const stages = [
    { num: 1, title: "Existing Shop", desc: "WhatsApp Data Capture + Audit Admin System", active: true },
    { num: 2, title: "Existing Vehicles", desc: "Digital Maintenance Logbooks + Health History", active: false },
    { num: 3, title: "24×7 Emergency Support", desc: "Highway roadside breakdown assistance network", active: true },
    { num: 4, title: "Nearby Workshops Network", desc: "Hub & spoke verified garage federation across corridors", active: false },
    { num: 5, title: "Driver & Fleet Ecosystem", desc: "Driver performance, cash allowances & job dispatch", active: false },
    { num: 6, title: "Parts Marketplace", desc: "Aggregated spare parts supply chain & direct manufacturer dispatch", active: false },
    { num: 7, title: "Vehicle Operating System", desc: "Predictive failure diagnostics & telematics core", active: false },
    { num: 8, title: "All Commercial Vehicles", desc: "Nationwide standard platform for Indian transport & logistics", active: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>24×7 Highway Support Network</span>
              </span>
              <span className="text-xs text-slate-400">• Vehicle Operating System Core</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              24×7 Highway Emergency & <span className="text-red-400">Fleet Operations</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Managing 127 commercial vehicles, active highway breakdowns, 3-tier escalation (Driver ➔ Technician ➔ Engineer),
              and the long-term Vehicle OS expansion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-red-950/80 border border-red-800 px-3.5 py-2 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span className="font-bold font-mono text-sm">{emergencyJobs.length}</span>
              <span>Active Roadside Calls</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab("emergencies")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === "emergencies"
              ? "bg-red-600 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Active Highway Breakdowns ({emergencyJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("engineer-layer")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === "engineer-layer"
              ? "bg-amber-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>3-Level Engineer Diagnostics</span>
        </button>

        <button
          onClick={() => setActiveSubTab("fleet")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === "fleet"
              ? "bg-slate-700 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Fleet Catalog (127 Trucks)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("roadmap")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === "roadmap"
              ? "bg-indigo-600 text-white font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>8-Stage Vehicle OS Roadmap</span>
        </button>
      </div>

      {/* 1. Active Emergencies View */}
      {activeSubTab === "emergencies" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of active emergency jobs (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {emergencyJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-red-950/40 border-red-500 text-slate-100 shadow-md"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800">
                      {job.vehicleNumber}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                      {job.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-100">{job.vehicleModel}</h4>
                  <p className="text-xs text-red-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{job.highwayLocation}</span>
                  </p>

                  <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2 rounded border border-slate-800/80">
                    {job.problemSummary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-2 border-t border-slate-800">
                    <span>Driver: <strong>{job.driverName}</strong></span>
                    <span className="font-mono">{job.reportedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed 3-Level Breakdown & Escalation (7 cols) */}
          {selectedJob && (
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-6 shadow">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase font-semibold">
                    Emergency Dispatch Case #{selectedJob.id}
                  </span>
                  <h3 className="font-black text-lg text-white mt-0.5">
                    {selectedJob.vehicleNumber} — {selectedJob.vehicleModel}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    onResolveEmergency(selectedJob.id);
                    alert(`Emergency ticket ${selectedJob.id} marked as RESOLVED and vehicle cleared for road!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              </div>

              {/* 3-Tier Escalation Architecture Display */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>3-Tier Resolution Escalation (Principle #13)</span>
                </h4>

                {/* Level 1: Driver */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">1</span>
                      <span>Level 1: Driver Field Report</span>
                    </span>
                    <span className="text-slate-400 text-[11px]">{selectedJob.reportedAt}</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Driver: <strong>{selectedJob.driverName}</strong> ({selectedJob.driverPhone})
                  </p>
                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2 rounded">
                    "{selectedJob.level1DriverReport}"
                  </p>
                </div>

                {/* Level 2: Technician */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">2</span>
                      <span>Level 2: Truck Wala Field Technician</span>
                    </span>
                    <span className="text-emerald-400 text-[11px] font-semibold">On Site (Mobile Van 4)</span>
                  </div>
                  <p className="text-xs text-slate-200">
                    Assigned: <strong>{selectedJob.level2TechnicianAssigned}</strong>
                  </p>
                  <p className="text-xs text-slate-300 bg-slate-900 p-2 rounded">
                    {selectedJob.level2TechnicianInspection}
                  </p>
                </div>

                {/* Level 3: Engineer Diagnosis */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-900/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[11px]">3</span>
                      <span>Level 3: Technical Engineer Guidance</span>
                    </span>
                    <span className="text-indigo-300 font-mono text-[11px]">
                      Code: {selectedJob.level3DiagnosticCode}
                    </span>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center gap-2 text-indigo-300 font-semibold text-[11px]">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Wiring & Technical Spec Reference:</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      {selectedJob.level3EngineerGuidance}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Engineer Layer Knowledge Base */}
      {activeSubTab === "engineer-layer" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Engineer Knowledge Base & Decision Support</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              "Truck repair me hamesha local mechanic sabkuch nahi kar sakta. System me engineer knowledge base store hoti jayegi."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">BS-VI SCR / DEF System</span>
              <h4 className="font-bold text-slate-100 text-sm">Urea Dosing Pump Pressure Fault (SPN 3556)</h4>
              <p className="text-slate-400 leading-relaxed">
                Step-by-step diagnostic protocol for Cummins & Tata 5.0L common rail engines. Includes test-bench pressure tolerances and air valve clearance.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Transmission & Clutch</span>
              <h4 className="font-bold text-slate-100 text-sm">G-1150 9-Speed Synchronizer Mesh Guide</h4>
              <p className="text-slate-400 leading-relaxed">
                Torque specs for input shaft bearing retainer ring, clearance gaps, and fork alignment for heavy multi-axle haulers.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">Pneumatics & ABS</span>
              <h4 className="font-bold text-slate-100 text-sm">Wabco Trailer ABS Modulator Valve Relay Failure</h4>
              <p className="text-slate-400 leading-relaxed">
                Pinout voltage checking across ISO 7638 7-pin coiled cable and pressure relief threshold validation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fleet Catalog (127 Trucks) */}
      {activeSubTab === "fleet" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-200">
              Fleet Commercial Vehicles Registry (127 Active)
            </h3>
            <span className="text-xs text-slate-400">123 On Highway • 4 In Workshop / Bay</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Vehicle No</th>
                  <th className="py-3 px-4">Model & Make</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Driver Assigned</th>
                  <th className="py-3 px-4">Service History</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Last Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {vehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-850/50">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{v.vehicleNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-200">{v.model}</td>
                    <td className="py-3 px-4 text-slate-400">{v.vehicleType}</td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{v.driverName}</div>
                      <div className="text-[10px] text-slate-500">{v.driverPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {v.totalJobs} service jobs
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.status === "On Road"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : v.status === "In Workshop"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-red-950 text-red-300 border border-red-800"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{v.lastServiceDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 8-Stage Vehicle OS Roadmap */}
      {activeSubTab === "roadmap" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>The 8-Stage Evolution into India's Vehicle Operating System</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              "Ye journey sirf ek shop tak seemit nahi rahegi — Har stage pichle verified data par khada hoga."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stages.map((stg) => (
              <div
                key={stg.num}
                className={`p-4 rounded-xl border text-xs space-y-2 relative transition-all ${
                  stg.active
                    ? "bg-indigo-950/40 border-indigo-500 shadow-md"
                    : "bg-slate-950/60 border-slate-800 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-indigo-400">
                    STAGE {stg.num}
                  </span>
                  {stg.active && (
                    <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Live Now
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-100 text-sm">{stg.title}</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">{stg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
