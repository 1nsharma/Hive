import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Printer, AlertTriangle, ShieldCheck, MapPin, Phone, Sparkles } from 'lucide-react';
import { generateLostPetPoster, downloadCanvasImage, LostPosterConfig } from '../lib/posterGenerator';

interface PetPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName?: string;
  species?: string;
  breed?: string;
  phone?: string;
  qrUrl?: string;
}

export const PetPosterModal: React.FC<PetPosterModalProps> = ({
  isOpen,
  onClose,
  petName = 'Bruno',
  species = 'Dog',
  breed = 'Golden Retriever',
  phone = '+91 63937 41171',
  qrUrl = 'https://petsjanu.com/p/bruno-9842'
}) => {
  const [lastSeen, setLastSeen] = useState('Near Central Park Gate 3, Indiranagar, Bengaluru');
  const [reward, setReward] = useState('5,000');
  const [isGenerating, setIsGenerating] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fullCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    const config: LostPosterConfig = {
      petName,
      species,
      breed,
      age: '3 Years Old',
      lastSeenLocation: lastSeen,
      rewardAmount: reward,
      contactPhone: phone,
      qrUrl
    };

    generateLostPetPoster(config)
      .then((canvas) => {
        if (!isMounted) return;
        fullCanvasRef.current = canvas;

        // Render preview downscaled onto modal preview canvas
        const previewCanvas = previewCanvasRef.current;
        if (previewCanvas) {
          previewCanvas.width = 400;
          previewCanvas.height = 533; // 3:4 aspect ratio
          const pctx = previewCanvas.getContext('2d');
          if (pctx) {
            pctx.drawImage(canvas, 0, 0, 400, 533);
          }
        }
        setIsGenerating(false);
      })
      .catch(() => {
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, petName, species, breed, lastSeen, reward, phone, qrUrl]);

  const handleDownload = () => {
    if (fullCanvasRef.current) {
      downloadCanvasImage(fullCanvasRef.current, `PetJanu-Lost-Pet-${petName.toUpperCase()}.png`);
    }
  };

  const handlePrint = () => {
    if (fullCanvasRef.current) {
      const dataUrl = fullCanvasRef.current.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head><title>Print Lost Pet Alert - ${petName}</title></head>
            <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#000;">
              <img src="${dataUrl}" style="max-width:100%;max-height:100vh;" onload="window.print();window.close();"/>
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-black tracking-tight text-stone-900">
                Official Lost Pet Emergency Poster &amp; Pass
              </h3>
              <p className="text-xs text-stone-500">
                Print-ready high-contrast A4 poster with embedded recovery QR code
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left: Interactive Canvas Preview */}
          <div className="flex flex-col items-center bg-stone-100 p-4 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              High-Resolution Print Preview
            </span>
            <div className="relative shadow-xl rounded-xl overflow-hidden border border-stone-300 bg-white">
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs font-bold text-stone-600">
                  Rendering 300DPI Canvas...
                </div>
              )}
              <canvas 
                ref={previewCanvasRef} 
                className="w-64 h-auto block rounded-lg"
              />
            </div>
          </div>

          {/* Right: Customizable Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Last Seen Location
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <input 
                  type="text" 
                  value={lastSeen}
                  onChange={(e) => setLastSeen(e.target.value)}
                  className="w-full bg-transparent text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Reward Amount (₹)
              </label>
              <input 
                type="text" 
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g. 5,000"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Emergency Contact Phone
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-stone-900">{phone}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Smart QR Verification
              </span>
              This poster includes {petName}'s unique encrypted PetJanu tag URL. Anyone scanning the poster on telephone poles or gates can instantly notify you with GPS!
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" /> Direct Print
            </button>
            <button
              onClick={handleDownload}
              className="px-5 py-2 bg-[#175741] hover:bg-[#134634] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
            >
              <Download className="w-4 h-4" /> Download High-Res Poster (.PNG)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
