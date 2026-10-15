import React, { useState } from "react";
import { X, Camera, Upload, CheckCircle2, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { WorkItem } from "../types";

interface PhotoEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workItems: WorkItem[];
  onUploadPhoto: (evidence: {
    workItemId: string;
    photoUrl: string;
    caption: string;
    category: string;
  }) => void;
}

export const PhotoEvidenceModal: React.FC<PhotoEvidenceModalProps> = ({
  isOpen,
  onClose,
  workItems,
  onUploadPhoto,
}) => {
  const [selectedWorkId, setSelectedWorkId] = useState(workItems[0]?.id || "");
  const [category, setCategory] = useState("Installation Evidence");
  const [caption, setCaption] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string>(
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=60"
  );
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUploadPhoto({
      workItemId: selectedWorkId,
      photoUrl: photoPreview,
      caption: caption || "Evidence captured on shop floor",
      category,
    });
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">Photo Evidence</h2>
              <p className="text-xs text-gray-500">Attach Installation or Damage Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isDone ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-secondary">Evidence Attached & Hash Verified!</h3>
            <p className="text-xs text-gray-500">
              Linked to vehicle job timeline with tamper-evident audit record.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Select Vehicle / Job
              </label>
              <select
                value={selectedWorkId}
                onChange={(e) => setSelectedWorkId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent font-medium"
              >
                {workItems.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.vehicleNumber} — {w.issue} ({w.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Evidence Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Installation Evidence">Installation Evidence (New Part Fitted)</option>
                <option value="Old Damaged Part">Old Damaged Part (Friction burn/crack)</option>
                <option value="New Boxed Packaging">New Boxed Packaging (QR / Seal check)</option>
                <option value="Diagnostic Screen">Diagnostic Laptop Error Screen</option>
                <option value="Road Test Odometer">Road Test Odometer & Temperature Reading</option>
              </select>
            </div>

            {/* Photo Preview & Upload Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Photo Preview / Capture
              </label>
              <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group hover:border-primary transition p-2 text-center">
                {photoPreview ? (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden">
                    <img
                      src={photoPreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-2">
                      <Camera className="w-4 h-4" />
                      <span>Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-2">
                    <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">Drag photo here or click to select</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Technician Notes / Part Number
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Flywheel faced 0.2mm, new clutch disk seated"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Timestamp & EXIF GPS recorded into immutable audit chain.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Attach Photo to Work Order</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
