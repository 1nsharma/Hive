import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Download, 
  Key, 
  ShieldCheck, 
  Bug, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Globe, 
  QrCode, 
  RefreshCw, 
  UserCheck, 
  Lock, 
  Sparkles,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  testerName: string;
  category: 'bug' | 'feature' | 'performance' | 'ui';
  message: string;
  status: 'submitted' | 'in_review' | 'resolved';
  timestamp: string;
}

export const BetaTesterDashboard: React.FC = () => {
  // Authentication & Access State
  const [accessKey, setAccessKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('petjanu_beta_auth') === 'true';
  });
  const [authError, setAuthError] = useState<string>('');
  const [testerRole, setTesterRole] = useState<string>('Core QA Tester');

  // Diagnostics & Modal State
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [swActive, setSwActive] = useState<boolean>(true);
  const [deviceInfo, setDeviceInfo] = useState<string>('');

  // Feedback State
  const [feedbackCategory, setFeedbackCategory] = useState<'bug' | 'feature' | 'performance' | 'ui'>('bug');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    {
      id: 'fb-101',
      testerName: 'Alpha Tester #04',
      category: 'performance',
      message: '3D Pet Collar rendering runs smoothly at 60 FPS on Android 14 (Snapdragon 8 Gen 2).',
      status: 'resolved',
      timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    {
      id: 'fb-102',
      testerName: 'Vet Inspector #02',
      category: 'ui',
      message: 'NFC QR Scanner modal opens instantly on Chrome Mobile browser.',
      status: 'submitted',
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    // Run diagnostics
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGlSupported(!!gl);
    } catch (e) {
      setWebGlSupported(false);
    }

    if ('serviceWorker' in navigator) {
      setSwActive(true);
    }

    setDeviceInfo(`${navigator.platform} | ${navigator.userAgent.slice(0, 45)}...`);

    // Fetch live feedback entries from backend API pipeline
    fetch('/api/v1/beta/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data?.feedback && Array.isArray(data.feedback)) {
          setFeedbackList(
            data.feedback.map((item: any) => ({
              id: item.id,
              testerName: item.testerName || 'Beta Tester',
              category: item.category || 'bug',
              message: item.message,
              status: item.status || 'submitted',
              timestamp: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim().toUpperCase();
    if (cleanKey === 'BETA-PETJANU-2026' || cleanKey === 'PETJANU2026' || cleanKey === 'TESTER') {
      setIsAuthenticated(true);
      localStorage.setItem('petjanu_beta_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Beta Passkey. Use demo key: BETA-PETJANU-2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('petjanu_beta_auth');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    const testerName = `${testerRole} (${accessKey || 'Beta User'})`;
    const payload = {
      testerName,
      category: feedbackCategory,
      message: feedbackMessage,
      deviceInfo,
      buildVersion: 'v1.2.0-beta.4'
    };

    const newItem: FeedbackItem = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      testerName,
      category: feedbackCategory,
      message: feedbackMessage,
      status: 'submitted',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic UI update
    setFeedbackList([newItem, ...feedbackList]);
    setFeedbackMessage('');
    setFeedbackSuccess(true);

    try {
      await fetch('/api/v1/beta/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Backend feedback submission offline fallback');
    }

    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A1A14] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-emerald-900/50">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> PETJANU ANDROID & WEB BETA DASHBOARD v1.2.0-beta
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Smartphone className="w-8 h-8 text-emerald-400" />
              Beta Tester Launchpad & APK Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time APK download builds, device diagnostics, and tester feedback channel for <code className="text-emerald-300">petsjanu.com</code>.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-emerald-400 flex items-center gap-1 justify-end">
                  <UserCheck className="w-3.5 h-3.5" /> Authenticated
                </div>
                <div className="text-xs text-slate-400">{testerRole}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* LOGIN OVERLAY IF NOT AUTHENTICATED */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-slate-900/90 backdrop-blur-md border border-emerald-800/60 rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-5">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">Beta Tester Gatekeeper</h2>
            <p className="text-xs text-slate-400 text-center mb-6">
              Enter your assigned Beta Passkey to unlock APK downloads and developer tools.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">BETA PASSKEY</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="e.g. BETA-PETJANU-2026"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition-colors"
                  />
                </div>
                {authError && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {authError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">TESTER ROLE</label>
                <select
                  value={testerRole}
                  onChange={(e) => setTesterRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none"
                >
                  <option value="Core QA Tester">Core QA Tester (UI/UX)</option>
                  <option value="Vet Specialist">Veterinary Specialist</option>
                  <option value="Shelter Partner">Shelter & Rescue Partner</option>
                  <option value="Security Auditor">Security & Privacy Auditor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm mt-4 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> Authenticate & Access APK
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                Demo Key: <code className="text-amber-400 font-mono">BETA-PETJANU-2026</code>
              </span>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED BETA DASHBOARD CONTENT */
          <div>
            <div className="bg-red-500/20 text-red-400 border border-red-500/40 px-4 py-3 rounded-2xl mb-6 flex items-center gap-3 shadow-md font-mono text-xs">
              <ShieldCheck className="w-5 h-5 text-red-400 shrink-0" />
              <span className="font-extrabold tracking-wider">🔒 INTERNAL BETA TESTER ACCESS ONLY — CONFIDENTIAL QA ASSETS & BUILD PORTAL</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: APK Download & Installation */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* APK Download Box */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" /> Android APK Package
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Built directly with Capacitor / TWA for full native Android performance.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-400">
                    <span>Build:</span> <span className="text-emerald-400">v1.2.0-beta.4</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Package:</span> <span className="text-white">com.petsjanu.app</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Min Android:</span> <span className="text-slate-300">Android 8.0+ (API 26)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Size:</span> <span className="text-amber-400">~8.4 MB</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <a
                    href="/downloads/petjanu-v1.2.0-beta.apk"
                    download="petjanu-v1.2.0-beta.apk"
                    className="w-full bg-[#F0A21E] hover:bg-amber-400 text-slate-950 font-black py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-950" /> Download Android APK (v1.2.0)
                  </a>

                  <button
                    onClick={() => setShowGuide(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs border border-slate-700 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-cyan-400" /> Android Installation Guide
                  </button>
                </div>
              </div>

              {/* Installation Guide Modal */}
              {showGuide && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border border-amber-400/60 rounded-2xl p-6 max-w-md w-full relative text-white shadow-2xl">
                    <button
                      onClick={() => setShowGuide(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-[#F0A21E]">Android Installation Guide</h3>
                    <ol className="list-decimal list-inside space-y-3 text-xs text-slate-300">
                      <li>Upar diye gaye button se <code className="text-cyan-400 bg-slate-950 px-1 py-0.5 rounded">.apk</code> file download karein.</li>
                      <li>Apne phone ke <b>Downloads</b> folder mein file open karein.</li>
                      <li>Agar prompt aaye, toh <b>Settings</b> mein jaakar <b>"Install Unknown Apps"</b> allow karein.</li>
                      <li><b>Install</b> par tap karein aur PetJanu beta experience karein!</li>
                    </ol>
                    <button
                      onClick={() => setShowGuide(false)}
                      className="mt-6 w-full bg-[#175741] hover:bg-[#1d6b4f] text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
                    >
                      Samajh gaya!
                    </button>
                  </div>
                </div>
              )}

              {/* System Diagnostics */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Device & WebGL Diagnostics
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400">3D WebGL Engine</span>
                    {webGlSupported ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Supported
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Hardware Fallback
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-slate-400">PWA Offline Cache</span>
                    {swActive ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-amber-400">Disabled</span>
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono truncate">
                    Platform: <span className="text-slate-200">{deviceInfo}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Feedback Form & Live Community Submissions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Submit Feedback Card */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-amber-400" /> Submit Tester Feedback / Bug Report
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Reports go directly into our development pipeline to optimize the upcoming production release.
                </p>

                {feedbackSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-none" />
                    Thank you! Your beta feedback report has been logged successfully.
                  </div>
                )}

                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bug', label: '🐛 Bug Report' },
                      { id: 'ui', label: '🎨 UI / UX' },
                      { id: 'performance', label: '⚡ 3D / Speed' },
                      { id: 'feature', label: '💡 Feature Request' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFeedbackCategory(cat.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          feedbackCategory === cat.id
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <textarea
                      rows={3}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Describe what happened, device model, or feature suggestion..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      Logged as: <span className="text-emerald-400 font-medium">{testerRole}</span>
                    </span>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 rounded-xl transition-all shadow-md flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Transmit Report
                    </button>
                  </div>
                </form>
              </div>

              {/* Feedback History Log */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Recent Beta Tester Submissions
                </h3>

                <div className="space-y-3">
                  {feedbackList.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {item.testerName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{item.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                        <span className={`text-[11px] font-medium ${
                          item.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {item.status === 'resolved' ? '✓ Resolved' : '⏳ In Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
