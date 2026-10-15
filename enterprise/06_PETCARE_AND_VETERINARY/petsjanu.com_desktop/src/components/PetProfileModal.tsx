import React, { useState } from 'react';
import { X, Plus, Camera, Shield, Check } from 'lucide-react';
import { Pet } from '../types';

interface PetProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Omit<Pet, 'id' | 'slug' | 'vaccinations'>) => void;
}

export const PetProfileModal: React.FC<PetProfileModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600');
  const [microchipId, setMicrochipId] = useState('');
  const [allergies, setAllergies] = useState('');
  const [conditions, setConditions] = useState('');
  const [contactName, setContactName] = useState('Amit Sharma');
  const [contactPhone, setContactPhone] = useState('+91 63937 41171');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !age) return;

    onSave({
      name,
      species,
      breed,
      age,
      gender,
      weight: weight || '10 kg',
      color: color || 'Golden',
      photoUrl,
      microchipId: microchipId || undefined,
      allergies: allergies || 'None declared',
      conditions: conditions || 'None declared',
      isLost: false,
      emergencyContact: {
        name: contactName,
        phone: contactPhone,
        relationship: 'Primary Parent'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl border shadow-2xl p-6 relative space-y-4 my-8" style={{ borderColor: '#E5DFD3' }}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#E5DFD3' }}>
          <div>
            <h3 className="text-xl font-extrabold" style={{ color: '#0E3D2F' }}>Add New Pet Profile</h3>
            <p className="text-xs text-stone-500">Create digital identity with QR & medical alerts</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo Preset Selection */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Select Profile Avatar
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300', label: 'Golden' },
                { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300', label: 'Beagle' },
                { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300', label: 'Persian' },
                { url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=300', label: 'Tabby Cat' },
                { url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300', label: 'Pug' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(item.url)}
                  className={`relative w-14 h-14 rounded-2xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    photoUrl === item.url ? 'ring-2 ring-[#175741] border-white scale-105' : 'opacity-70 border-stone-200'
                  }`}
                >
                  <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Pet Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Max"
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Breed *</label>
              <input
                type="text"
                required
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Age / DOB *</label>
              <input
                type="text"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 2 years"
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 18 kg"
                className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                style={{ borderColor: '#E5DFD3' }}
              />
            </div>
          </div>

          <div className="pt-2 border-t space-y-3" style={{ borderColor: '#E5DFD3' }}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
              Medical Alerts & Emergency Contact
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Known Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Chicken protein"
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Medical Conditions</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Joint sensitivity"
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Emergency Contact Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Emergency Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none"
                  style={{ borderColor: '#E5DFD3' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-4 transition-all hover:opacity-95"
            style={{ backgroundColor: '#175741' }}
          >
            <Shield className="w-4 h-4 text-amber-400" /> Save Profile & Generate Smart Tag Code
          </button>
        </form>
      </div>
    </div>
  );
};
