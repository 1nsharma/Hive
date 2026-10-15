import React, { useState } from "react";
import { X, Calendar, Truck, User, Phone, CheckCircle2, Wrench, ShieldCheck } from "lucide-react";
import { WORKSHOP_SERVICES } from "../truckWalaData";

interface BookServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  onBookingSuccess?: (booking: {
    vehicleNumber: string;
    serviceName: string;
    bookingId: string;
  }) => void;
}

export const BookServiceModal: React.FC<BookServiceModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  onBookingSuccess,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("Tata Signa 4825.TK");
  const [selectedService, setSelectedService] = useState(initialServiceId || "repair");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = "TW-" + Math.floor(100000 + Math.random() * 900000);
    setBookingId(id);
    setIsSuccess(true);
    if (onBookingSuccess) {
      const srvObj = WORKSHOP_SERVICES.find((s) => s.id === selectedService);
      onBookingSuccess({
        vehicleNumber: vehicleNumber || "UP 32 XX 1234",
        serviceName: srvObj?.title || "Commercial Maintenance",
        bookingId: id,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-secondary tracking-tight">Book Truck Service</h2>
              <p className="text-xs text-gray-500">Commercial Workshop Scheduling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-secondary">Service Appointment Confirmed!</h3>
              <p className="text-sm text-gray-600 mt-1">
                Booking ID: <span className="font-mono font-bold text-primary">{bookingId}</span>
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-4 text-left text-xs space-y-2.5 border border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle:</span>
                <span className="font-mono font-bold text-secondary">{vehicleNumber || "UP 32 XX 1234"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Model:</span>
                <span className="font-bold text-secondary">{vehicleModel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled Date:</span>
                <span className="font-bold text-secondary">{preferredDate} (Morning Bay 1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assigned Diagnostic:</span>
                <span className="font-bold text-primary">Level-2 Pre-Inspection Included</span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              An SMS and WhatsApp message with workshop direction pin has been sent.
            </p>

            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-md hover:bg-primary-dark transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Name / Transporter
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Transport"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Phone Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Vehicle Registration Number
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. UP 32 XX 1234"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Tata Signa 4825.TK">Tata Signa 4825.TK</option>
                  <option value="Tata 1618 LPT (BS-IV)">Tata 1618 LPT (BS-IV)</option>
                  <option value="Tata Prima 4028.S">Tata Prima 4028.S</option>
                  <option value="Cummins ISBe 5.9 Commercial">Cummins ISBe 5.9 Commercial</option>
                  <option value="Ashok Leyland 2820 HG">Ashok Leyland 2820 HG</option>
                  <option value="BharatBenz 3528R">BharatBenz 3528R</option>
                  <option value="Eicher Pro 6035">Eicher Pro 6035</option>
                  <option value="Other Commercial Vehicle">Other Commercial Vehicle</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Required Service Type
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {WORKSHOP_SERVICES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.hindiTitle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Additional Notes / Symptoms
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention any specific issue (e.g. clutch slipping, oil leakage, high smoke)"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Prior estimation provided before any part replacement. Genuine OEM guaranteed.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm Workshop Booking</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
