import React, { useState } from "react";
import {
  X,
  Mic,
  Cpu,
  Wrench,
  Check,
  Package,
  Settings,
  Camera,
  Clock,
  Shield,
  Plus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
} from "lucide-react";
import { WorkItem, TimelineEvent } from "../types";

interface WorkTimelineModalProps {
  item: WorkItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote?: (workItemId: string, note: string) => void;
  onCompleteStep?: (workItemId: string, eventId: string) => void;
}

export const WorkTimelineModal: React.FC<WorkTimelineModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddNote,
  onCompleteStep,
}) => {
  const [newNote, setNewNote] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const renderIcon = (type: TimelineEvent["iconType"], completed: boolean) => {
    const iconClass = "w-5 h-5 text-white";
    switch (type) {
      case "mic":
        return <Mic className={iconClass} />;
      case "cpu":
        return <Cpu className={iconClass} />;
      case "wrench":
        return <Wrench className={iconClass} />;
      case "check":
        return <Check className={iconClass} />;
      case "package":
        return <Package className={iconClass} />;
      case "settings":
        return <Settings className={iconClass} />;
      case "camera":
        return <Camera className={iconClass} />;
      case "clock":
      default:
        return <Clock className={completed ? iconClass : "w-5 h-5 text-gray-500"} />;
    }
  };

  const getStatusColor = (status: WorkItem["status"]) => {
    switch (status) {
      case "In Process":
        return "text-warning";
      case "Completed":
        return "text-success";
      case "Needs Action":
        return "text-error";
      case "Assigned":
        return "text-blue-600";
      default:
        return "text-secondary";
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    if (onAddNote) {
      onAddNote(item.id, newNote);
    }
    setNewNote("");
    setShowAddNote(false);
  };

  return (
    <div
      id="timelineModal"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex justify-between items-center z-20">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-secondary tracking-tight">Work Timeline</h2>
            <p className="text-xs sm:text-sm text-gray-600 font-mono flex items-center gap-2 mt-0.5">
              <span className="font-bold text-secondary">{item.vehicleNumber}</span>
              <span>•</span>
              <span>{item.issue}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Job Slip"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition hidden sm:inline-flex"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Summary Banner */}
          <div className="bg-surface rounded-2xl p-4 border border-gray-200/80">
            <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Status</p>
                <p className={`font-black text-sm sm:text-base tracking-wide uppercase ${getStatusColor(item.status)}`}>
                  {item.status}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Estimate</p>
                <p className="font-mono font-black text-secondary text-sm sm:text-base">
                  ₹{item.estimateAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Actual</p>
                <p className="font-mono font-black text-secondary text-sm sm:text-base">
                  {item.actualAmount ? `₹${item.actualAmount.toLocaleString("en-IN")}` : "In Tally"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Details Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200 text-gray-600">
            <div>
              <span className="text-gray-400">Model:</span>{" "}
              <span className="font-semibold text-secondary">{item.vehicleModel}</span>
            </div>
            <div>
              <span className="text-gray-400">Technician:</span>{" "}
              <span className="font-semibold text-secondary">{item.assignedTechnician || "Bay Master"}</span>
            </div>
            <div>
              <span className="text-gray-400">Parts Status:</span>{" "}
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {item.partsStatus === "OK" ? "Parts Verified ✓" : item.partsStatus}
              </span>
            </div>
          </div>

          {/* Step-by-Step Vertical Timeline */}
          <div className="space-y-6 pt-2">
            {item.timeline.map((event, idx) => {
              const isLast = idx === item.timeline.length - 1;
              const isPending = !event.completed;

              return (
                <div key={event.id} className="flex space-x-4 group">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
                        event.completed
                          ? event.iconType === "mic"
                            ? "bg-success"
                            : event.iconType === "cpu"
                            ? "bg-blue-600"
                            : event.iconType === "wrench"
                            ? "bg-purple-600"
                            : event.iconType === "check"
                            ? "bg-success"
                            : event.iconType === "package"
                            ? "bg-amber-600"
                            : event.iconType === "settings"
                            ? "bg-primary"
                            : event.iconType === "camera"
                            ? "bg-blue-600"
                            : "bg-gray-800"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {renderIcon(event.iconType, event.completed)}
                    </div>
                    {!isLast && <div className="w-0.5 h-16 timeline-line opacity-90 my-1"></div>}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-mono">{event.time}</p>
                      {isPending && onCompleteStep && (
                        <button
                          onClick={() => onCompleteStep(item.id, event.id)}
                          className="text-[11px] font-bold text-primary hover:underline"
                        >
                          Mark Done ✓
                        </button>
                      )}
                    </div>
                    <p
                      className={`font-bold text-sm sm:text-base mt-0.5 ${
                        event.completed ? "text-secondary" : "text-gray-400"
                      }`}
                    >
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{event.description}</p>

                    {event.detail && (
                      <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-200 mt-2 font-mono">
                        {event.detail}
                      </p>
                    )}

                    {event.stockChange && (
                      <div className="mt-2 bg-surface rounded-lg p-2 text-xs border border-gray-200 inline-block font-mono text-emerald-800 font-semibold">
                        {event.stockChange}
                      </div>
                    )}

                    {event.evidenceUrl && (
                      <div className="mt-3">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Installation Photo Upload:</span>
                        </p>
                        <div
                          onClick={() => setPreviewPhoto(event.evidenceUrl || null)}
                          className="relative w-36 h-24 rounded-xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:ring-2 hover:ring-primary transition"
                        >
                          <img
                            src={event.evidenceUrl}
                            alt="Installation proof"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition text-white text-xs font-bold">
                            Click to Expand
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Note Section */}
          <div className="pt-4 border-t border-gray-200">
            {showAddNote ? (
              <form onSubmit={handleAddNoteSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Add Technician / Workshop Note to Timeline
                </label>
                <textarea
                  rows={2}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Test drive completed with 14 ton load; clutch bite point smooth."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark"
                  >
                    Post Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowAddNote(true)}
                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Note / Progress Milestone</span>
              </button>
            )}
          </div>

          {/* Audit Info Section */}
          <div className="bg-surface rounded-2xl p-4 border border-gray-200/90">
            <h4 className="font-black text-secondary text-sm mb-3 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Audit & Compliance Information</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Total Workflow Events:</span>
                <span className="font-bold mono text-secondary">{item.totalEvents}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Evidence Attachments (Photos/Voice):</span>
                <span className="font-bold mono text-secondary">{item.evidenceCount}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Last Telemetry / WhatsApp Sync:</span>
                <span className="font-bold mono text-secondary">{item.lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Preview Modal Lightbox */}
        {previewPhoto && (
          <div
            className="fixed inset-0 bg-black/80 z-60 flex items-center justify-center p-4 backdrop-blur"
            onClick={() => setPreviewPhoto(null)}
          >
            <div className="max-w-xl w-full bg-white rounded-2xl overflow-hidden p-4 relative shadow-2xl">
              <button
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewPhoto}
                alt="Enlarged evidence"
                className="w-full h-auto rounded-xl object-contain max-h-[70vh]"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs text-gray-600 mt-2 text-center font-mono">
                Verified Workshop Evidence Photo • SHA256 Watermarked
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
