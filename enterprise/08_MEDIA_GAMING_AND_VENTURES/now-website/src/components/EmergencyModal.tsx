import React, { useState } from "react";
import { X, Phone, MessageCircle, MapPin, AlertCircle, CheckCircle, Navigation, Loader2 } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDispatchTicket?: (ticket: {
    vehicleNumber: string;
    location: string;
    problem: string;
  }) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onDispatchTicket,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [locationStatus, setLocationStatus] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [ticketDispatched, setTicketDispatched] = useState(false);

  if (!isOpen) return null;

  const handleShareLocation = () => {
    setIsLocating(true);
    setLocationStatus("Detecting GPS coordinates...");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const locString = `GPS: ${lat}° N, ${lng}° E (NH-48 Corridor)`;
          setLocationStatus(locString);
          setIsLocating(false);
        },
        () => {
          // Fallback location for container or denied iframe permission
          const fallbackLoc = "NH-48 Expressway Km 84 (Near Toll Plaza)";
          setLocationStatus(fallbackLoc);
          setIsLocating(false);
        },
        { timeout: 6000 }
      );
    } else {
      setLocationStatus("NH-48 Expressway Km 84 (Near Toll Plaza)");
      setIsLocating(false);
    }
  };

  const handleInstantDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketDispatched(true);
    if (onDispatchTicket) {
      onDispatchTicket({
        vehicleNumber: vehicleNumber || "RJ 14 GB 4412",
        location: locationStatus || "NH-48 Expressway Km 84",
        problem: problemDescription || "Commercial vehicle roadside breakdown",
      });
    }
  };

  return (
    <div
      id="emergencyModal"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center text-error">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">Emergency Help</h2>
              <p className="text-xs text-error font-semibold">24×7 Highway SOS Unit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {ticketDispatched ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-secondary">Mobile Van Unit Dispatched!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Van #02 (Ramesh Ustad) has acknowledged your SOS.
              </p>
            </div>
            <div className="bg-surface rounded-xl p-4 text-left text-xs space-y-2 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle:</span>
                <span className="font-mono font-bold text-secondary">{vehicleNumber || "RJ 14 GB 4412"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-bold text-secondary">{locationStatus || "NH-48 Expressway Km 84"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Arrival:</span>
                <span className="font-bold text-primary">28 - 35 Minutes</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="tel:+919876543210"
                className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-center text-sm shadow-md"
              >
                Call Technician
              </a>
              <button
                onClick={() => {
                  setTicketDispatched(false);
                  onClose();
                }}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm mb-1">
                <span className="w-2 h-2 rounded-full bg-red-600 pulse-dot"></span>
                <span>No login required for emergency</span>
              </div>
              <p className="text-xs text-red-700">
                Get immediate roadside assistance anywhere on state & national highways.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="tel:9140889473"
                className="flex items-center space-x-3.5 p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:border-red-500 border border-gray-200/80 transition group"
              >
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-red-600 transition">Call Now (H.O. Line)</p>
                  <p className="text-xs text-slate-600 font-mono">+91 9140889473 / 7070709082</p>
                </div>
              </a>

              <a
                href="https://wa.me/917070709082?text=Emergency%20Truck%20Breakdown!%20Need%20immediate%20assistance."
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-3.5 p-4 bg-gray-50 rounded-2xl hover:bg-green-50 hover:border-green-500 border border-gray-200/80 transition group"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition">WhatsApp Live SOS</p>
                  <p className="text-xs text-slate-600 font-mono">+91 7070709082 (Live GPS & Photo)</p>
                </div>
              </a>

              <button
                type="button"
                onClick={handleShareLocation}
                disabled={isLocating}
                className="flex items-center space-x-3.5 p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:border-blue-500 border border-gray-200/80 transition w-full text-left group cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md">
                  {isLocating ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-secondary group-hover:text-blue-700 transition">
                    {locationStatus ? "GPS Location Captured" : "Share GPS Location"}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {locationStatus || "Help mobile mechanic find you on highway"}
                  </p>
                </div>
              </button>
            </div>

            {/* Quick Dispatch Form */}
            <form onSubmit={handleInstantDispatch} className="pt-2 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Vehicle Registration (Optional)
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. UP 32 XX 1234 / RJ 14 GB 4412"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Describe Symptom / Issue
                </label>
                <input
                  type="text"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="e.g. Wheel hub smoking, clutch slip, air pressure leak"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-error text-white font-bold rounded-xl hover:bg-red-700 transition text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>DISPATCH EMERGENCY MOBILE VAN</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
