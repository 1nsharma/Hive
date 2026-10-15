import React, { useState, useRef } from 'react';
import { 
  AlertCircle, Mic, Square, Play, Trash2, MapPin, CheckCircle, Phone, Send, Loader2, Navigation 
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { WORKSHOP_CONFIG } from '../data/servicesData';
import { submitLead, trackClick, trackEvent } from '../utils/analytics';

interface BreakdownFormProps {
  language: Language;
  onSuccess: (leadId: string, formType: string) => void;
}

export const BreakdownForm: React.FC<BreakdownFormProps> = ({ language, onSuccess }) => {
  const t = TRANSLATIONS[language];
  const [problem, setProblem] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; addressText?: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Quick Problem chips
  const quickChips = language === 'hi' ? [
    'एयर प्रेशर डाउन / ब्रेक जाम',
    'क्लच प्लेट जल गई / गियर नहीं लग रहा',
    'डीजल एयर लॉक',
    'इंजन ओवरहीट / सफेद धुआं',
    'AdBlue / DEF फॉल्ट',
    'अल्टरनेटर / बैटरी बैठ गई'
  ] : [
    'Air Pressure Drop / Brake Jam',
    'Clutch Burnout / Hard Gear',
    'Diesel Fuel Air Lock',
    'Engine Overheat / Smoke',
    'AdBlue / DEF System Derate',
    'Alternator / Dead Battery'
  ];

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        trackEvent('voice_recorded', 'breakdown', { duration: recordingDuration });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert(language === 'hi' 
        ? 'माइक्रोफोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन चालू करें।' 
        : 'Microphone permission denied. Please allow audio access in browser settings.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleDeleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setRecordingDuration(0);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLocation({
          lat,
          lng,
          addressText: `GPS: ${lat}, ${lng} (Accuracy: ~${Math.round(pos.coords.accuracy)}m)`
        });
        setLocationLoading(false);
        trackEvent('location_shared', 'breakdown', { lat, lng });
      },
      (err) => {
        setLocationLoading(false);
        alert(language === 'hi' 
          ? 'लोकेशन प्राप्त नहीं हो सकी। कृपया फोन की GPS लोकेशन सर्विस ऑन करें।' 
          : 'Unable to acquire GPS location. Please ensure location is enabled.');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() && !audioUrl) {
      alert(language === 'hi' 
        ? 'कृपया समस्या का विवरण लिखें या वॉइस मैसेज रिकॉर्ड करें।' 
        : 'Please describe the problem or record a voice message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const lead = await submitLead({
        formType: 'breakdown',
        vehicleNumber: vehicleNumber.toUpperCase().trim() || 'NOT_SPECIFIED',
        phone: driverPhone.trim() || WORKSHOP_CONFIG.phoneDisplay,
        problem: problem.trim(),
        location: location || undefined,
        hasVoiceNote: !!audioUrl,
        voiceNoteDuration: recordingDuration,
        urgency: 'emergency'
      });

      onSuccess(lead.id, 'breakdown');
      // Reset
      setProblem('');
      setVehicleNumber('');
      setDriverPhone('');
      handleDeleteRecording();
    } catch {
      alert('Failed to dispatch request. Please call directly!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="breakdown-form" className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-red-100 p-7 sm:p-10 relative overflow-hidden">
          
          {/* Emergency top stripe */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-red-600 via-rose-500 to-red-700"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t.emergencyFormTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">
              {t.emergencyFormSub}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Problem description */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                {t.whatIsWrong} <span className="text-red-600">*</span>
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-hidden"
                placeholder={t.whatIsWrongPlaceholder}
              />

              {/* Quick Symptom Chips */}
              <div className="mt-2.5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  {language === 'hi' ? 'त्वरित चयन (Quick Select):' : 'Common Highway Symptoms:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProblem(prev => prev ? `${prev}, ${chip}` : chip)}
                      className="text-[11px] font-medium bg-gray-100 hover:bg-red-50 hover:text-red-700 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 transition"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Voice Message Recorder (Drivers prefer speaking over typing on highway) */}
            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                  <Mic className="w-4 h-4 text-red-600" />
                  <span>{t.voiceNoteTitle}</span>
                </label>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                  {t.voiceSupportedNote}
                </span>
              </div>

              {!audioUrl ? (
                <div className="flex items-center justify-center py-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="px-5 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
                    >
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>{t.voiceRecordStart}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition animate-pulse cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>{t.voiceRecording} ({recordingDuration}s)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <audio src={audioUrl} controls className="h-8 max-w-[200px] sm:max-w-xs" />
                    <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{language === 'hi' ? 'वॉइस संदेश तैयार' : 'Voice Attached'}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteRecording}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete voice note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Vehicle Number & Driver Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.vehicleNumberLabel}
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono tracking-wider uppercase focus:ring-2 focus:ring-red-500 outline-hidden"
                  placeholder={t.vehicleNumberPlaceholder}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {t.driverPhoneLabel}
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-red-500 outline-hidden"
                  placeholder={t.driverPhonePlaceholder}
                />
              </div>
            </div>

            {/* Live GPS Location Share */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {language === 'hi' ? 'गाड़ी का वर्तमान स्थान (Highway KM / GPS)' : 'Current Vehicle Breakdown Location'}
              </label>
              
              {!location ? (
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50/50 hover:bg-red-50/40 rounded-xl text-xs sm:text-sm font-bold text-gray-700 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      <span>{language === 'hi' ? 'जीपीएस से लोकेशन खोजी जा रही है...' : 'Acquiring high accuracy GPS coordinates...'}</span>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-red-600" />
                      <span>{t.locationButtonDefault}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{location.addressText}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocation(null)}
                    className="text-red-600 text-xs font-bold hover:underline"
                  >
                    {language === 'hi' ? 'हटाएं' : 'Clear'}
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions: Direct Call & Submit */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${WORKSHOP_CONFIG.phoneClean}`}
                onClick={() => trackClick('phone', 'breakdown_form')}
                className="flex-1 py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition text-center"
              >
                <Phone className="w-4 h-4" />
                <span>{t.call247}</span>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-4 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl font-black text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-red-700/25 transition active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'भेजा जा रहा है...' : 'Dispatching...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.submitEmergencyBtn}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
