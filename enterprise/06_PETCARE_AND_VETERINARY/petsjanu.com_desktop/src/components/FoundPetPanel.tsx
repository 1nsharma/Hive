import React, { useState } from 'react';
import { MapPin, Navigation, MessageCircle, CheckCircle2, AlertCircle, Send, Shield, Compass, Heart } from 'lucide-react';
import { buildWhatsAppLink } from '../lib/whatsapp';

type Stage = 'idle' | 'consent' | 'locating' | 'sent' | 'manual';

interface FoundPetPanelProps {
  petId: string;
  petName: string;
  whatsappEnabled?: boolean;
  whatsappNumber?: string | null;
  isLost?: boolean;
  onPingSent?: () => void;
}

export const FoundPetPanel: React.FC<FoundPetPanelProps> = ({
  petId,
  petName,
  whatsappEnabled = false,
  whatsappNumber = null,
  isLost = true,
  onPingSent,
}) => {
  const [stage, setStage] = useState<Stage>('idle');
  const [area, setArea] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function sendPing(payload: Record<string, unknown>) {
    setBusy(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/pets/${petId}/scan-ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to send location ping.');
      }

      setSuccessMessage(data.message || 'Location ping sent to owner successfully!');
      setStage('sent');
      if (onPingSent) onPingSent();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not send GPS ping. Please try entering the area manually.');
      setStage('manual');
    } finally {
      setBusy(false);
    }
  }

  function handleAllowLocation() {
    setStage('locating');
    setErrorMessage(null);

    if (!('geolocation' in navigator)) {
      setErrorMessage('Browser does not support GPS geolocation. Please enter area manually.');
      setStage('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sendPing({
          source: 'geolocation',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (geoErr) => {
        let reason = 'Location permission denied or unavailable.';
        if (geoErr.code === geoErr.TIMEOUT) reason = 'GPS search timed out.';
        setErrorMessage(`${reason} You can type the area name manually below.`);
        setStage('manual');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  }

  return (
    <div className="rounded-3xl border border-[#E5DFD3] bg-white p-5 shadow-xs space-y-4">
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-serif font-bold text-base text-[#1C2B23] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#175741]" />
            Location Ping &amp; Live Citizen Radar
          </h3>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
          Free · No App Required
        </span>
      </div>

      {/* STAGE 1: IDLE BUTTON */}
      {stage === 'idle' && (
        <div className="space-y-3">
          <p className="text-xs text-stone-600 leading-relaxed">
            Spotted <strong>{petName}</strong>? Send a 1-click GPS location ping to the owner. Coordinates are fuzzed for privacy and delivered instantly.
          </p>
          <button
            onClick={() => setStage('consent')}
            className="w-full py-3.5 px-4 bg-[#175741] hover:bg-[#0E3D2F] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 text-emerald-300 animate-bounce" />
            <span>🐾 Maine is pet ko dekha hai (Send Instant Location)</span>
          </button>
        </div>
      )}

      {/* STAGE 2: CONSENT SCREEN */}
      {stage === 'consent' && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-start gap-2.5">
            <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-emerald-950">Privacy-First Location Consent</h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Aapki approximate location <strong>sirf {petName} ke verified owner</strong> ko bheji jayegi. Aapki personal details ya raw IP bilkul store nahi hoti. Madad karne ke liye shukriya! 💙
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleAllowLocation}
              disabled={busy}
              className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Allow GPS Location</span>
            </button>
            <button
              onClick={() => setStage('manual')}
              className="py-2.5 px-3 bg-white border border-emerald-300 hover:bg-stone-50 text-emerald-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Area Manually Likhein</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: LOCATING SPINNER */}
      {stage === 'locating' && (
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2.5 animate-pulse">
          <Navigation className="w-6 h-6 text-emerald-700 mx-auto animate-spin" />
          <h4 className="text-xs font-bold text-stone-800">Reading Device GPS &amp; Fuzzing Coords…</h4>
          <p className="text-[11px] text-stone-500">Owner ko safe location beacon dispatch ho raha hai.</p>
        </div>
      )}

      {/* STAGE 4: MANUAL ENTRY FALLBACK */}
      {stage === 'manual' && (
        <div className="space-y-3">
          {errorMessage && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (area.trim().length >= 3) {
                sendPing({ source: 'manual', area: area.trim() });
              }
            }}
            className="space-y-2.5"
          >
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600">
              Where did you see {petName}? (Landmark / Market / Area) *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Sector 12 Main Market, near HDFC Bank ATM / Chai stall"
                maxLength={120}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-300 bg-stone-50 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStage('consent')}
                className="px-3 py-2 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={busy || area.trim().length < 3}
                className="flex-1 py-2.5 bg-[#175741] hover:bg-[#0E3D2F] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{busy ? 'Sending Ping…' : 'Send Manual Location Beacon'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STAGE 5: SENT SUCCESS STATE */}
      {stage === 'sent' && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-center">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
          <h4 className="text-xs font-black text-emerald-950">Location Beacon Relayed Successfully!</h4>
          <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
            {successMessage || `✅ Owner ko location ping mil gayi hai. Aap ${petName} ki safety me bahut badi madad kar rahe hain! 🙏`}
          </p>
        </div>
      )}

      {/* OPTIONAL WHATSAPP DIRECT DEEP-LINK (Explicit Opt-in Only) */}
      {whatsappEnabled && whatsappNumber && (
        <div className="pt-2 border-t border-stone-100">
          <a
            href={buildWhatsAppLink(whatsappNumber, petName, area || undefined)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>💬 WhatsApp par owner ko live location bhejein</span>
          </a>
          <span className="text-[10px] text-stone-400 text-center block mt-1">
            Owner has explicitly opted in to receive verified direct WhatsApp chats.
          </span>
        </div>
      )}
    </div>
  );
};
