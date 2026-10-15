import React, { useState } from 'react';
import { Calendar, Clock, Star, MapPin, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { Service, Pet } from '../types';

interface ServicesBookingProps {
  services: Service[];
  pets: Pet[];
  onBookService: (bookingData: {
    serviceId: string;
    serviceName: string;
    petId: string;
    petName: string;
    date: string;
    timeSlot: string;
    address: string;
    notes: string;
    priceFormatted: string;
  }) => void;
}

export const ServicesBooking: React.FC<ServicesBookingProps> = ({
  services,
  pets,
  onBookService
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || 'pet-1');
  const [bookingDate, setBookingDate] = useState<string>('2026-08-15');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 11:00 AM');
  const [address, setAddress] = useState<string>('402 Sunset Heights, Bandra West, Mumbai 400050');
  const [notes, setNotes] = useState<string>('');
  const [isSuccessModal, setIsSuccessModal] = useState<boolean>(false);

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '06:00 PM - 07:00 PM'
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const chosenPet = pets.find((p) => p.id === selectedPetId) || pets[0];

    onBookService({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      petId: chosenPet.id,
      petName: chosenPet.name,
      date: new Date(bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeSlot,
      address,
      notes,
      priceFormatted: selectedService.priceFormatted
    });

    setIsSuccessModal(true);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Banner */}
      <div id="tour-services-header" className="p-6 md:p-8 rounded-3xl border bg-gradient-to-r from-[#175741] to-[#0E3D2F] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-400 text-stone-900 rounded-md inline-block">
            VERIFIED EXPERT PET SERVICES
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Professional Veterinary, Grooming & Walking Services
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed">
            Background-checked professionals delivered to your doorstep or available on-demand via tele-consultation.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🩺
        </div>
      </div>

      {/* Services Cards List (5 Services) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-3xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            style={{ borderColor: '#E5DFD3' }}
          >
            <div className="flex gap-4 items-start">
              <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-2xl border shrink-0" />
              
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold">
                  <span className="bg-stone-100 px-2 py-0.5 rounded-md text-stone-700">{service.category}</span>
                  <span className="flex items-center gap-0.5 text-amber-600 font-extrabold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {service.rating}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-stone-900 leading-snug">{service.name}</h3>
                
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 font-semibold text-stone-700">
                    <Clock className="w-3 h-3 text-[#175741]" /> {service.duration}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">{service.description}</p>

            {/* Includes Checklist */}
            <div className="p-3 bg-stone-50 rounded-xl border space-y-1" style={{ borderColor: '#F0EBE1' }}>
              <span className="text-[10px] font-bold uppercase text-stone-500">Package Highlights:</span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-700 font-medium">
                {service.includes.slice(0, 4).map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-1 truncate">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" /> {inc}
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Book CTA */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F0EBE1' }}>
              <div>
                <span className="text-lg font-black text-[#0E3D2F]">{service.priceFormatted}</span>
                <span className="block text-[9px] text-stone-500 font-medium">All Taxes & Fees Included</span>
              </div>

              <button
                onClick={() => setSelectedService(service)}
                className="px-4 py-2 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all hover:opacity-95"
                style={{ backgroundColor: '#175741' }}
              >
                Book Slot <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedService && !isSuccessModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl border shadow-2xl p-6 space-y-4 my-8 relative" style={{ borderColor: '#E5DFD3' }}>
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                SCHEDULE APPOINTMENT
              </span>
              <h3 className="text-xl font-extrabold text-stone-900">{selectedService.name}</h3>
              <p className="text-xs text-stone-500">{selectedService.duration} · {selectedService.priceFormatted}</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              
              {/* Pet Selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Select Pet for Service *
                </label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-white text-xs font-bold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.species} · {p.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                    style={{ borderColor: '#E5DFD3' }}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                    style={{ borderColor: '#E5DFD3' }}
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Service Location / Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Home address or online call"
                  className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Special Instructions / Medical Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Sensitive ears, cautious around strangers..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4 hover:opacity-95"
                style={{ backgroundColor: '#175741' }}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" /> Confirm Booking ({selectedService.priceFormatted})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {isSuccessModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FDFBF7] rounded-3xl border shadow-2xl p-6 text-center space-y-4" style={{ borderColor: '#E5DFD3' }}>
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🎉
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-stone-900">Service Appointment Confirmed!</h3>
              <p className="text-xs text-stone-600">
                Your verified professional has been assigned and notified.
              </p>
            </div>

            <div className="p-3 bg-white rounded-2xl border text-xs text-left space-y-1" style={{ borderColor: '#E5DFD3' }}>
              <div className="font-bold text-[#0E3D2F]">{selectedService?.name}</div>
              <div className="text-stone-500">Date: {bookingDate} ({timeSlot})</div>
              <div className="text-stone-500">Address: {address}</div>
            </div>

            <button
              onClick={() => {
                setIsSuccessModal(false);
                setSelectedService(null);
              }}
              className="w-full py-2.5 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer"
              style={{ backgroundColor: '#175741' }}
            >
              Done & View Bookings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
