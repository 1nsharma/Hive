import React, { useState } from 'react';
import { Language } from '../../types';
import { 
  Cpu, Play, CheckCircle2, AlertTriangle, RefreshCw, 
  PhoneCall, PhoneOff, Mic, Volume2, ShieldCheck, 
  ArrowRight, Terminal, Database, Sparkles, Layers 
} from 'lucide-react';

interface TechPlaygroundProps {
  lang: Language;
}

export const TechPlayground: React.FC<TechPlaygroundProps> = ({ lang }) => {
  // Simulator 1: Zero-Config Onboarding
  const [userPrompt, setUserPrompt] = useState('मेरे Salesforce और Google Sheets को जोड़ दो');
  const [onboardingStep, setOnboardingStep] = useState<'idle' | 'analyzing' | 'authenticating' | 'connected'>('idle');
  const [activeTab, setActiveTab] = useState<'zero-config' | 'voice-dialer' | 'self-healing' | 'adapter-pattern'>('zero-config');

  // Simulator 2: Voice Dialer
  const [callState, setCallState] = useState<'idle' | 'dialing' | 'connected' | 'completed'>('idle');
  const [transcriptIndex, setTranscriptIndex] = useState<number>(0);

  // Simulator 3: Self-Healing
  const [healingStatus, setHealingStatus] = useState<'normal' | 'failed' | 'buffering' | 'recovering' | 'healed'>('normal');

  const presetPrompts = [
    'मेरे Salesforce और Google Sheets को जोड़ दो',
    'PostgreSQL डेटा को Slack में अलर्ट के साथ सिंक करो',
    'Shopify ऑर्डर्स को QuickBooks इनवॉइस में ऑटो-कन्वर्ट करो'
  ];

  const handleRunOnboarding = () => {
    setOnboardingStep('analyzing');
    setTimeout(() => {
      setOnboardingStep('authenticating');
      setTimeout(() => {
        setOnboardingStep('connected');
      }, 900);
    }, 800);
  };

  const startVoiceCall = () => {
    setCallState('dialing');
    setTranscriptIndex(0);
    setTimeout(() => {
      setCallState('connected');
      const timer = setInterval(() => {
        setTranscriptIndex((prev) => {
          if (prev >= 3) {
            clearInterval(timer);
            setCallState('completed');
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }, 1200);
  };

  const simulateFailure = () => {
    setHealingStatus('failed');
    setTimeout(() => {
      setHealingStatus('buffering');
      setTimeout(() => {
        setHealingStatus('recovering');
        setTimeout(() => {
          setHealingStatus('healed');
        }, 1200);
      }, 1100);
    }, 900);
  };

  const callTranscript = [
    { speaker: 'Aura Voice AI', text: 'नमस्ते अमित जी, मैं Aura ग्रोथ असिस्टेंट से बोल रहा हूँ। आपने एंटरप्राइज़ पाइपलाइन में रुचि दिखाई थी?' },
    { speaker: 'Customer', text: 'हाँ, हम अपने Salesforce और PostgreSQL को जोड़ना चाहते हैं।' },
    { speaker: 'Aura Voice AI', text: 'बहुत बढ़िया! क्या गुरुवार दोपहर 3:00 बजे 15-मिनट की डेमो कॉल तय कर दी जाए?' },
    { speaker: 'Customer', text: 'बिल्कुल, गुरुवार 3 बजे ठीक रहेगा।' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Live Production Operating System Quick Link */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-[#7c5cff]/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-emerald-300 font-medium">
            {lang === 'hi' 
              ? 'पूर्ण Aura लाइव प्रोडक्शन इंजन सक्रिय है: 4 लाइव पाइपलाइन्स, 9-चरणीय लूप, और सर्किट ब्रेकर लैब।' 
              : 'Full Aura Live Production Engine is running: 4 live pipelines, 9-step loop, and circuit breaker lab.'}
          </span>
        </div>
        <a
          href="#production-engine"
          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>{lang === 'hi' ? 'प्रोडक्शन कंसोल खोलें' : 'Open Production Console'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('zero-config')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'zero-config'
              ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
              : 'text-[#9a9ab0] hover:text-white bg-white/[0.02]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'Zero-Config ऑनबोर्डिंग' : 'Zero-Config Engine'}</span>
        </button>

        <button
          onClick={() => setActiveTab('voice-dialer')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'voice-dialer'
              ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
              : 'text-[#9a9ab0] hover:text-white bg-white/[0.02]'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#22d3ee]" />
          <span>{lang === 'hi' ? 'AI Voice Dialer (Twilio+LLM)' : 'AI Voice Dialer & Agent'}</span>
        </button>

        <button
          onClick={() => setActiveTab('self-healing')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'self-healing'
              ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
              : 'text-[#9a9ab0] hover:text-white bg-white/[0.02]'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'hi' ? 'Self-Healing वर्कफ़्लो' : 'Self-Healing Engine'}</span>
        </button>

        <button
          onClick={() => setActiveTab('adapter-pattern')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'adapter-pattern'
              ? 'bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] text-white shadow-md'
              : 'text-[#9a9ab0] hover:text-white bg-white/[0.02]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#c4b5fd]" />
          <span>{lang === 'hi' ? 'एडाप्टर पैटर्न आर्किटेक्चर' : 'Adapter Pattern Architecture'}</span>
        </button>
      </div>

      {/* TAB 1: Zero-Config Onboarding Simulator */}
      {activeTab === 'zero-config' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
              {lang === 'hi' ? 'प्राकृतिक भाषा ऑनबोर्डिंग इंजन' : 'Natural Language Zero-Configuration'}
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              {lang === 'hi' ? 'सिर्फ एक वाक्य बोलें या टाइप करें' : 'One-Sentence Autonomous Connection'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
              {lang === 'hi'
                ? 'ग्राहक को किसी जटिल API मैपिंग या क्रेडेंशियल कॉन्फ़िगरेशन की आवश्यकता नहीं है। AI आशय को समझकर स्वतः पाइपलाइन तैयार करता है।'
                : 'Customer states intent in plain language. Aura parses entities, handles OAuth token discovery, and activates bidirectional pipelines.'}
            </p>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setUserPrompt(p)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.03] hover:bg-white/[0.08] text-[#c4c4d8] border border-white/10 cursor-pointer transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Input & Action */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Type integration goal..."
              className="flex-1 px-4 py-3 bg-[#07070d] border border-white/15 rounded-xl text-sm text-white placeholder-[#9a9ab0] focus:outline-none focus:border-[#7c5cff]"
            />
            <button
              onClick={handleRunOnboarding}
              disabled={onboardingStep === 'analyzing' || onboardingStep === 'authenticating'}
              className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7c5cff] to-[#3b82f6] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{lang === 'hi' ? 'कनेक्शन बनाएं' : 'Build Connection'}</span>
            </button>
          </div>

          {/* Live Pipeline Execution Steps */}
          {onboardingStep !== 'idle' && (
            <div className="p-4 rounded-xl bg-[#07070d] border border-[#7c5cff]/30 space-y-3 font-mono text-xs">
              <div className="flex items-center gap-2 text-[#9a9ab0]">
                {onboardingStep === 'analyzing' ? (
                  <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>1. [NLP Entity Extraction]: Identified Source A (Salesforce) ⇄ Source B (Google Sheets)</span>
              </div>

              {(onboardingStep === 'authenticating' || onboardingStep === 'connected') && (
                <div className="flex items-center gap-2 text-[#9a9ab0]">
                  {onboardingStep === 'authenticating' ? (
                    <RefreshCw className="w-4 h-4 text-[#22d3ee] animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>2. [Zero-Trust Handshake]: Secure OAuth 2.0 PKCE tokens exchanged via Connect Gateway</span>
                </div>
              )}

              {onboardingStep === 'connected' && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ पाइपलाइन सक्रिय (Pipeline Active): 0 Configuration Required!</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Schema automatically mapped: <code className="text-white">Salesforce.Lead[Name, Email, Status]</code> ➔ <code className="text-white">GoogleSheets[A, B, C]</code>. Bidirectional webhooks listening.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI Voice Dialer & Agent */}
      {activeTab === 'voice-dialer' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-[#22d3ee] uppercase tracking-wider block mb-1">
                Twilio Media Stream + LLM Speech-to-Text
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                {lang === 'hi' ? 'स्वायत्त AI Voice Dialer सिमुलेटर' : 'Autonomous AI Voice Dialer Agent'}
              </h3>
              <p className="text-xs text-[#9a9ab0] mt-1">
                {lang === 'hi'
                  ? 'ग्राहक को कॉल करता है, स्वाभाविक बातचीत करता है और सीधे CRM में मीटिंग बुक करता है।'
                  : 'Synthesizes conversational speech, listens, detects booking intent, and updates CRM.'}
              </p>
            </div>

            <button
              onClick={startVoiceCall}
              disabled={callState === 'dialing' || callState === 'connected'}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{callState === 'connected' ? 'कॉल चालू है...' : 'टेस्ट कॉल शुरू करें'}</span>
            </button>
          </div>

          {/* Phone Call Visualizer */}
          <div className="p-6 rounded-xl bg-[#07070d] border border-white/10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7c5cff]/20 text-[#22d3ee] flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Aura Outbound Voice Agent</div>
                  <div className="text-[11px] text-[#9a9ab0] font-mono">
                    Status: {callState.toUpperCase()}
                  </div>
                </div>
              </div>

              {callState === 'connected' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-6 bg-[#22d3ee] rounded-full animate-pulse" />
                  <span className="w-1.5 h-10 bg-[#7c5cff] rounded-full animate-pulse delay-75" />
                  <span className="w-1.5 h-8 bg-[#3b82f6] rounded-full animate-pulse delay-150" />
                  <span className="w-1.5 h-4 bg-[#22d3ee] rounded-full animate-pulse" />
                </div>
              )}
            </div>

            {/* Transcript Stream */}
            <div className="space-y-3 min-h-[160px]">
              {callState === 'idle' && (
                <div className="text-center py-8 text-xs text-[#9a9ab0]">
                  "टेस्ट कॉल शुरू करें" बटन पर क्लिक करके वास्तविक समय वार्तालाप और CRM सिंक देखें।
                </div>
              )}

              {callState === 'dialing' && (
                <div className="flex items-center justify-center gap-2 py-8 text-xs text-[#22d3ee] font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Twilio SIP Trunk Dialing +91 98765 43210...</span>
                </div>
              )}

              {(callState === 'connected' || callState === 'completed') && (
                <div className="space-y-2.5">
                  {callTranscript.slice(0, transcriptIndex + 1).map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs flex flex-col ${
                        item.speaker === 'Customer'
                          ? 'bg-white/[0.04] text-white ml-6 border border-white/5'
                          : 'bg-[#7c5cff]/15 text-[#e7e7f0] mr-6 border border-[#7c5cff]/30'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-[#22d3ee] mb-0.5">
                        {item.speaker}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {callState === 'completed' && (
                <div className="p-3 mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block">✓ कॉल समाप्त: मीटिंग CRM में दर्ज की गई!</span>
                    <span className="text-[11px] text-emerald-200/80">Salesforce Event: "Aura Demo - Thursday 3:00 PM" created with Google Meet link.</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: Self-Healing Workflows Simulator */}
      {activeTab === 'self-healing' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Zero Data Loss Guarantee
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                {lang === 'hi' ? 'Self-Healing वर्कफ़्लो इंजन' : 'Self-Healing Workflow Engine'}
              </h3>
              <p className="text-xs text-[#9a9ab0] mt-1">
                {lang === 'hi'
                  ? 'यदि तृतीय-पक्ष API डाउन होती है या रेट-लिमिट (429) आता है, तो Aura डेटा को स्वतः Redis में बफ़र करता है और सर्किट ब्रेकर से रिकवर करता है।'
                  : 'Circuit breaker, Redis queue buffering, and exponential backoff retry ensure 0% data drop during partner outages.'}
              </p>
            </div>

            <button
              onClick={simulateFailure}
              disabled={healingStatus !== 'normal' && healingStatus !== 'healed'}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-red-500/80 hover:bg-red-500 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{lang === 'hi' ? 'API विफलता सिमुलेट करें' : 'Simulate API Outage (429)'}</span>
            </button>
          </div>

          {/* Architecture Status Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className={`p-4 rounded-xl border text-center transition-all ${
              healingStatus === 'failed' ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
            }`}>
              <div className="text-xs font-bold mb-1">1. Target API</div>
              <div className="text-sm font-mono text-white">Salesforce REST</div>
              <div className="text-[10px] mt-2 font-mono">
                {healingStatus === 'failed' ? 'HTTP 429 Too Many Requests' : 'HTTP 200 OK'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-center transition-all ${
              healingStatus === 'buffering' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
            }`}>
              <div className="text-xs font-bold mb-1">2. Circuit Breaker</div>
              <div className="text-sm font-mono text-white">Trip: OPEN</div>
              <div className="text-[10px] mt-2 font-mono">
                {healingStatus === 'buffering' ? 'Buffering in Redis Queue' : 'State: Pass-through'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-center transition-all ${
              healingStatus === 'recovering' ? 'bg-[#3b82f6]/15 border-[#3b82f6]/40 text-[#93c5fd]' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
            }`}>
              <div className="text-xs font-bold mb-1">3. Retry Policy</div>
              <div className="text-sm font-mono text-white">Exponential Backoff</div>
              <div className="text-[10px] mt-2 font-mono">
                {healingStatus === 'recovering' ? 'Retrying (attempt 2 of 5)...' : 'Queue: 0 pending'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-center transition-all ${
              healingStatus === 'healed' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.02] border-white/5 text-[#9a9ab0]'
            }`}>
              <div className="text-xs font-bold mb-1">4. Recovery</div>
              <div className="text-sm font-mono text-white">Circuit CLOSED</div>
              <div className="text-[10px] mt-2 font-mono">
                {healingStatus === 'healed' ? '100% Events Synced' : 'Standby'}
              </div>
            </div>

          </div>

          {/* Healing Log */}
          <div className="p-3.5 rounded-xl bg-[#07070d] border border-white/10 font-mono text-xs text-[#9a9ab0]">
            <span className="text-[#22d3ee] font-bold">Aura Circuit Watcher: </span>
            {healingStatus === 'normal' && 'सभी 25 कनेक्टर स्वस्थ स्थिति में चल रहे हैं।'}
            {healingStatus === 'failed' && 'चेतावनी: Salesforce API ने 429 थ्रॉटल किया! तत्काल फॉलबैक सक्रिय।'}
            {healingStatus === 'buffering' && 'Redis BullMQ ने 142 इनबाउंड इवेंट्स को सुरक्षित बफर किया। ग्राहक को कोई डेटा नुकसान नहीं।'}
            {healingStatus === 'recovering' && 'सर्किट हाफ-ओपन: परीक्षण पिंग सफल। कतारबद्ध इवेंट्स को पुनः प्रसारित किया जा रहा है...'}
            {healingStatus === 'healed' && 'सफलता: सभी 142 इवेंट्स सफलतापूर्वक डिलीवर किए गए! सिस्टम पुनः सामान्य स्थिति में।'}
          </div>
        </div>
      )}

      {/* TAB 4: Adapter Pattern Architecture */}
      {activeTab === 'adapter-pattern' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-6">
          <div>
            <span className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider block mb-1">
              Architecture Blueprint
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              {lang === 'hi' ? 'मानकीकृत एडाप्टर पैटर्न (Standardized Adapter Pattern)' : 'Standardized Adapter Pattern'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9a9ab0] mt-1">
              {lang === 'hi'
                ? 'प्रत्येक नए कनेक्टर को सीधे कोर कोड बदले बिना केवल एक मानकीकृत इंटरफेस (IConnectorAdapter) लागू करके जोड़ा जा सकता है।'
                : 'Decouples vendor-specific protocols (REST, GraphQL, gRPC, Wire) into a single canonical CommonSchema interface.'}
            </p>
          </div>

          {/* Code Spec Sample */}
          <div className="rounded-xl bg-[#07070d] border border-white/10 p-4 font-mono text-xs overflow-x-auto text-[#a5f3fc]">
            <pre className="text-emerald-400 mb-2">// TypeScript Interface for Standardized Adapter</pre>
            <pre>{`export interface IConnectorAdapter<TRaw, TCanonical> {
  readonly connectorId: string;
  readonly protocol: 'REST' | 'GraphQL' | 'Wire' | 'gRPC';
  
  authenticate(credentials: OAuthCredentials): Promise<AuthSession>;
  normalizeToCanonical(rawPayload: TRaw): TCanonical;
  dispatchAction(action: AuraAction): Promise<ActionResult>;
  healthCheck(): Promise<{ latencyMs: number; status: 'HEALTHY' | 'DEGRADED' }>;
}`}</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-bold text-[#22d3ee] mb-1">1. Zero Vendor Lock-in</div>
              <p className="text-[#9a9ab0]">डेटाबेस बदलने पर एप्लीकेशन कोड में कोई बदलाव नहीं करना पड़ता।</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-bold text-[#7c5cff] mb-1">2. 10x Fast Integration</div>
              <p className="text-[#9a9ab0]">नया कनेक्टर जोड़ने में 2-3 दिन लगते हैं, 2-3 महीने नहीं।</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-bold text-emerald-400 mb-1">3. Connect Gateway Security</div>
              <p className="text-[#9a9ab0]">डेटा ग्राहक के प्राइवेट VPC के भीतर प्रोसेस होता है।</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
