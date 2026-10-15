import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Camera, 
  Mic, 
  Square, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  X, 
  ShieldCheck, 
  Truck,
  Sparkles,
  Zap,
  Navigation,
  Cpu,
  Layers,
  Wrench,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Language, WorkshopConfig, VehicleCategory, RLRecommendation } from '../types';
import { submitLead, trackClick, trackEvent } from '../utils/analytics';
import { 
  evaluateRLRecommendation, 
  RESCUE_UNITS
} from '../utils/reinforcementEngine';

interface FastHighwayHelpDeskProps {
  language: Language;
  workshopConfig: WorkshopConfig;
  onSuccess: (leadId: string, formType: string) => void;
}

const VEHICLE_CATEGORIES: VehicleCategory[] = [
  '10–14 Wheeler Heavy Truck',
  'Multi-Axle Trailer (16+ Wheeler)',
  'Tipper / Dumper',
  'Container / Cargo Carrier',
  'Light Commercial Vehicle (LCV / Pickup)',
  'Heavy Bus / Highway Coach'
];

const PROBLEM_TAGS = [
  'Clutch',
  'Brake',
  'Heating',
  'Fuel',
  'Electrical',
  'Tyre',
  'Other'
];

export const FastHighwayHelpDesk: React.FC<FastHighwayHelpDeskProps> = ({
  language,
  workshopConfig,
  onSuccess
}) => {
  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('10–14 Wheeler Heavy Truck');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [locationText, setLocationText] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('Brake');
  const [problemDescription, setProblemDescription] = useState('');
  const [phone, setPhone] = useState('');

  // Reinforcement Learning Dispatcher State
  const [corridorZone, setCorridorZone] = useState<'zone_a_near' | 'zone_b_corridor' | 'zone_c_remote'>('zone_b_corridor');
  const [rlRecommendation, setRlRecommendation] = useState<RLRecommendation>(() => {
    return evaluateRLRecommendation({
      vehicleCategory: '10–14 Wheeler Heavy Truck',
      problemTag: 'Brake',
      corridorZone: 'zone_b_corridor',
      timeSlot: (new Date().getHours() >= 22 || new Date().getHours() < 6) ? 'night_peak' : 'day'
    });
  });

  // Re-evaluate RL policy dynamically when vehicle, fault, or zone changes
  useEffect(() => {
    const isNight = new Date().getHours() >= 22 || new Date().getHours() < 6;
    const rec = evaluateRLRecommendation({
      vehicleCategory,
      problemTag: selectedTag,
      corridorZone,
      timeSlot: isNight ? 'night_peak' : 'day'
    });
    setRlRecommendation(rec);
  }, [vehicleCategory, selectedTag, corridorZone]);

  // GPS Geolocation state
  const [location, setLocation] = useState<{ lat: number; lng: number; addressText?: string; accuracy?: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Audio Voice Note state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceBlobBase64, setVoiceBlobBase64] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Photo state
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Get Current GPS Location
  const handleGetCurrentLocation = () => {
    trackEvent('LOCATION_SHARED', 'gps_requested');
    setLocLoading(true);
    setLocError(null);

    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coordsText = `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          addressText: coordsText
        });
        setLocationText(coordsText);
        setLocLoading(false);
        trackEvent('LOCATION_SHARED', 'gps_acquired', { lat: latitude, lng: longitude });
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocError('Unable to detect GPS. Please enter highway milestone or toll name manually.');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // WhatsApp Share Location & Breakdown
  const handleShareLocationOnWhatsApp = () => {
    trackEvent('WHATSAPP_CLICK', 'sos_share_location');
    const locString = location 
      ? `https://maps.google.com/?q=${location.lat},${location.lng}` 
      : (locationText || 'Highway Breakdown Location');
    
    const message = `*EMERGENCY BREAKDOWN ASSISTANCE NEEDED*\n` +
      `--------------------------------\n` +
      `*Vehicle Type:* ${vehicleCategory}\n` +
      `*Vehicle No:* ${vehicleNumber || 'Unspecified'}\n` +
      `*Problem:* ${selectedTag} - ${problemDescription || 'Urgent breakdown'}\n` +
      `*Driver Phone:* ${phone || 'Same as WhatsApp'}\n` +
      `*Live Location:* ${locString}\n` +
      `--------------------------------\n` +
      `Please dispatch mobile repair van immediately.`;

    window.open(`https://wa.me/${workshopConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Handle Photo selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
      trackEvent('PHOTO_UPLOADED', file.name);
    };
    reader.readAsDataURL(file);
  };

  // Handle Voice Note recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setVoiceBlobBase64(reader.result as string);
          trackEvent('VOICE_MESSAGE', 'recorded');
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVoiceDuration(0);

      timerRef.current = setInterval(() => {
        setVoiceDuration(d => {
          if (d >= 45) {
            stopRecording();
            return 45;
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied:', err);
      alert('Microphone permission needed to record voice message.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  // Submit SOS Assistance
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!phone.trim()) {
      setSubmitError('Please provide a driver or transporter mobile number so our mobile mechanic can call.');
      return;
    }

    setIsSubmitting(true);
    trackEvent('REQUEST_SUBMITTED', 'sos_form_started');

    try {
      const fullProblem = `${selectedTag}: ${problemDescription || 'Emergency highway repair requested'}`;

      const lead = await submitLead({
        formType: 'breakdown',
        vehicleType: vehicleCategory,
        vehicleNumber: vehicleNumber.toUpperCase().trim() || 'NOT_SPECIFIED',
        phone: phone.trim(),
        problem: fullProblem,
        location: location || (locationText ? { lat: 26.5158, lng: 80.4829, addressText: locationText } : undefined),
        urgency: 'emergency',
        hasPhoto: !!photoBase64,
        photoBase64: photoBase64 || undefined,
        photoName: photoName || undefined,
        hasVoiceNote: !!voiceBlobBase64,
        voiceNoteDuration: voiceDuration,
        voiceNoteBase64: voiceBlobBase64 || undefined,
        rlDispatchMetadata: {
          action: rlRecommendation.actionId,
          unitName: rlRecommendation.unit.name,
          confidence: rlRecommendation.confidence,
          etaMinutes: rlRecommendation.estimatedArrivalMin,
          recommendedKit: rlRecommendation.recommendedKit,
          stateKey: rlRecommendation.stateKey
        }
      });

      setIsSubmitting(false);
      onSuccess(lead.id, 'breakdown');
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError('Submission failed. Please call our 24×7 hotline directly.');
    }
  };

  return (
    <section id="sos-desk" className="relative py-12 md:py-16 bg-[#080A0F] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Floating Glassmorphic SOS Panel */}
        <div className="glass-panel-orange rounded-3xl p-6 sm:p-10 border border-[#FF5A1F]/30 shadow-2xl relative overflow-hidden">
          
          {/* Top Luminous Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-white/10 gap-3">
            <div>
              <div className="inline-flex items-center space-x-2 text-[#FF5A1F] text-xs font-black tracking-wider uppercase mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span>NO LOGIN REQUIRED • 30-SECOND DISPATCH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                REQUEST EMERGENCY SERVICE
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                Priority Highway Van
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Field 1: Select Vehicle Category */}
            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-300 mb-2">
                1. Select Vehicle Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {VEHICLE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setVehicleCategory(cat);
                      trackEvent('SERVICE_SELECTED', cat);
                    }}
                    className={`p-3 rounded-2xl text-left border text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                      vehicleCategory === cat
                        ? 'bg-[#FF5A1F]/20 border-[#FF5A1F] text-white shadow-md shadow-orange-500/10'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Truck className={`w-4 h-4 shrink-0 ${vehicleCategory === cat ? 'text-[#FF5A1F]' : 'text-gray-400'}`} />
                    <span className="leading-tight">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Field 2 & Field 5: Vehicle Number & Driver Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Vehicle Number */}
              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-300 mb-2">
                  2. Vehicle Number
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. UP 78 BT 4410 / RJ 14 GB 6821"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-white font-mono font-bold text-sm tracking-wider focus:outline-none focus:border-[#FF5A1F] transition"
                />
              </div>

              {/* Driver Phone */}
              <div>
                <label className="block text-xs font-black tracking-wider uppercase text-gray-300 mb-2">
                  5. Driver / Transporter Phone Number *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-400 text-sm font-bold font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-14 pr-4 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-white font-mono font-bold text-sm tracking-wider focus:outline-none focus:border-[#FF5A1F] transition"
                  />
                </div>
              </div>

            </div>

            {/* Field 3: Current Location */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black tracking-wider uppercase text-gray-300">
                  3. Current Location
                </label>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locLoading}
                  className="inline-flex items-center space-x-1.5 text-xs font-black text-[#00D2FF] hover:text-white bg-[#00D2FF]/10 hover:bg-[#00D2FF]/20 px-3 py-1.5 rounded-xl border border-[#00D2FF]/30 transition cursor-pointer"
                >
                  <Navigation className={`w-3.5 h-3.5 ${locLoading ? 'animate-spin' : ''}`} />
                  <span>{locLoading ? 'Acquiring GPS...' : 'Use Current Location'}</span>
                </button>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. NH-19 KM 42, Near Unnao Toll Plaza / Transport Nagar Bypass"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/15 rounded-2xl text-white text-sm font-medium focus:outline-none focus:border-[#FF5A1F] transition"
                />
              </div>

              {location && typeof location.lat === 'number' && typeof location.lng === 'number' && (
                <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono">
                    <CheckCircle className="w-3.5 h-3.5" />
                    GPS Coords Attached: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                  <span className="text-[11px] text-gray-400">Accuracy: ±{Math.round(location.accuracy || 15)}m</span>
                </div>
              )}

              {locError && (
                <p className="mt-1.5 text-xs text-amber-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {locError}
                </p>
              )}
            </div>

            {/* Field 4: Problem Description & Quick Tags */}
            <div>
              <label className="block text-xs font-black tracking-wider uppercase text-gray-300 mb-2">
                4. Problem Description (Select Quick Tag or describe)
              </label>
              
              {/* Quick Tags: Clutch, Brake, Heating, Fuel, Electrical, Tyre, Other */}
              <div className="flex flex-wrap gap-2 mb-3">
                {PROBLEM_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTag(tag);
                      trackEvent('SERVICE_SELECTED', `tag_${tag}`);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#FF5A1F] text-white shadow-md shadow-orange-500/30'
                        : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Briefly describe what happened (e.g. Air pressure drop, wheel locked, won't crank, diesel leak)..."
                className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white text-sm focus:outline-none focus:border-[#FF5A1F] transition resize-none"
              />
            </div>

            {/* REINFORCEMENT LEARNING DISPATCH ENGINE (RL) */}
            <div className="rounded-2xl p-4 sm:p-5 bg-linear-to-br from-[#0c121e] to-[#070b12] border border-[#00D2FF]/30 relative overflow-hidden shadow-lg shadow-cyan-950/20">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D2FF]/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Top RL status ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00D2FF]/15 border border-[#00D2FF]/40 flex items-center justify-center text-[#00D2FF]">
                    <Cpu className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black tracking-wider uppercase text-white font-mono">
                        REINFORCEMENT DISPATCH AGENT
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-black text-emerald-400 font-mono">
                        POLICY ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Continuously learning from 340+ highway breakdown episodes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-cyan-300">
                    Q-Value: +{(rlRecommendation?.qScore ?? 0).toFixed(1)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300">
                    {rlRecommendation?.confidence ?? 95}% Confidence
                  </span>
                </div>
              </div>

              {/* Highway Corridor Zone Selector */}
              <div className="mb-4">
                <label className="block text-[11px] font-mono uppercase text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Highway Corridor Distance Tier:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'zone_a_near', label: 'Zone A (0–15km)', sub: 'Hub / Ring Road' },
                    { id: 'zone_b_corridor', label: 'Zone B (15–35km)', sub: 'NH-19 Expressway' },
                    { id: 'zone_c_remote', label: 'Zone C (35–60km)', sub: 'Outer Toll Plaza' }
                  ].map(z => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => setCorridorZone(z.id as any)}
                      className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                        corridorZone === z.id
                          ? 'bg-[#00D2FF]/15 border-[#00D2FF] text-white shadow-sm shadow-cyan-500/20'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{z.label}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{z.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Rescue Unit Card */}
              <div className="p-3.5 bg-black/40 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/20 border border-[#FF5A1F]/40 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-[#FF5A1F]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">
                        {rlRecommendation.unit.callsign}: {rlRecommendation.unit.name}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        ({rlRecommendation.unit.vanNumber})
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {language === 'hi' ? rlRecommendation.explanationHi : rlRecommendation.explanationEn}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-gray-400">Pre-Loaded Hardware:</span>
                      {rlRecommendation.recommendedKit.slice(0, 3).map((tool, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-cyan-200 font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10 sm:border-l sm:pl-4 sm:border-white/10 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-mono uppercase text-gray-400">Estimated Arrival</div>
                    <div className="text-base font-black text-emerald-400 font-mono">
                      ~{rlRecommendation.estimatedArrivalMin} Mins
                    </div>
                  </div>
                  <div className="text-right mt-1">
                    <span className="text-[10px] font-mono text-cyan-300">
                      {rlRecommendation.firstTimeFixProb}% 1st-Time Fix
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Roadside Helpers: Photo Upload & Audio Voice Note */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              
              {/* Photo Input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment"
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                  photoBase64 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{photoName ? `Photo: ${photoName.slice(0, 15)}...` : 'Attach Photo'}</span>
              </button>

              {/* Voice Note Recording */}
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
                  isRecording 
                    ? 'bg-red-600 text-white border-red-500 animate-pulse' 
                    : voiceBlobBase64 
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {isRecording ? <Square className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#FF5A1F]" />}
                <span>
                  {isRecording ? `Recording (${voiceDuration}s) - Tap Stop` : voiceBlobBase64 ? 'Voice Note Ready' : 'Record Voice Note'}
                </span>
              </button>

            </div>

            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {submitError}
              </div>
            )}

            {/* CTAs Bar: REQUEST IMMEDIATE ASSISTANCE + SHARE LOCATION ON WHATSAPP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              
              {/* Primary CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-linear-to-r from-[#FF5A1F] to-[#E04810] hover:from-[#FF6E30] hover:to-[#FF5A1F] text-white font-black text-sm tracking-wide rounded-2xl shadow-xl shadow-orange-500/30 border border-orange-400/40 transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                <span>
                  {isSubmitting 
                    ? 'DISPATCHING VAN VIA RL...' 
                    : `DISPATCH ${rlRecommendation.unit.callsign} (RL OPTIMIZED)`}
                </span>
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={handleShareLocationOnWhatsApp}
                className="w-full py-4 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] hover:text-white font-bold text-sm tracking-wide rounded-2xl border border-[#25D366]/40 transition-all flex items-center justify-center space-x-2.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>SHARE LOCATION ON WHATSAPP</span>
              </button>

            </div>

            {/* Subtle Reassurance Copy */}
            <div className="pt-2 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Mobile repair van dispatched from nearest highway point.
              </p>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
