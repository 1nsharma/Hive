import re

with open("src/components/LoginScreen.tsx", "r") as f:
    content = f.read()

new_content = """import { useState, FormEvent, useEffect } from "react";
import { User, ShieldCheck, KeyRound, ArrowRight, Store, Mail, Chrome, HelpCircle, AlertCircle, WifiOff, CheckCircle2, MessageSquare, ShoppingBag, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

interface LoginScreenProps {
  onLoginSuccess: (shopName: string, phoneOrEmail: string, isDemo: boolean) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [authMethod, setAuthMethod] = useState<"phone" | "email" | "google">("phone");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const clearError = () => {
    if (error) setError("");
  };

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setError("इंटरनेट कनेक्शन नहीं है। कृपया अपना नेटवर्क जांचें।");
      return;
    }
    if (!shopName.trim()) {
      setError("कृपया अपनी दुकान का नाम दर्ज करें।");
      return;
    }
    if (!phone || phone.length < 10) {
      setError("कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOtpSent(true);
    } catch (err: any) {
      setError("OTP भेजने में विफल: " + (err.message || "अज्ञात त्रुटि"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setError("इंटरनेट कनेक्शन नहीं है। कृपया अपना नेटवर्क जांचें।");
      return;
    }
    if (!otp || otp.length !== 4) {
      setError("कृपया 4-अंकों का सही OTP दर्ज करें। (Hint: 1234)");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (otp === "1234" || otp === "4321" || otp === "0000" || phone === "9876543210") {
        onLoginSuccess(shopName, `+91 ${phone}`, false);
      } else {
        setError("गलत OTP, कृपया पुनः प्रयास करें।");
      }
    } catch (err: any) {
      setError("सत्यापन विफल: " + (err.message || "कृपया पुनः प्रयास करें।"));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setError("इंटरनेट कनेक्शन नहीं है। कृपया अपना नेटवर्क जांचें।");
      return;
    }
    if (!shopName.trim()) {
      setError("कृपया अपनी दुकान का नाम दर्ज करें।");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("कृपया सही ईमेल दर्ज करें।");
      return;
    }
    if (!password || password.length < 6) {
      setError("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onLoginSuccess(shopName, email, false);
    } catch (err: any) {
      setError("लॉगिन विफल: " + (err.message || "कृपया पुनः प्रयास करें।"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isOnline) {
      setError("इंटरनेट कनेक्शन नहीं है। कृपया अपना नेटवर्क जांचें।");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      // token can be used to authenticate with backend if needed
      
      onLoginSuccess(result.user.displayName || "My Shop", result.user.email || "No email", false);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
         setError("लॉगिन रद्द किया गया। कृपया पुनः प्रयास करें।");
      } else {
         setError("Google Login failed: " + (err.message || "Network Error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onLoginSuccess("श्री गणेश किराना स्टोर (डेमो)", "अतिथि खाता • ऑफ़लाइन", true);
    } catch (err) {
      setError("अतिथि मोड लोड करने में विफल।");
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B2818] via-[#0F3324] to-[#0B2818] text-white flex flex-col justify-between p-6 sm:p-8 selection:bg-emerald-500/30">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* Header Brand */}
          <div className="mt-8 mb-6">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/50 mb-6">
              🛍️
            </div>
            <h1 className="text-3xl font-bold font-sans tracking-tight mb-1">
              Dukaan<span className="text-emerald-500">Mitra</span>
            </h1>
            <p className="text-emerald-200/60 font-mono text-xs uppercase tracking-widest">Aapka Digital Dost</p>
          </div>

          {/* Value Prop */}
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold leading-[1.15] mb-4 tracking-tight">
              हर दुकान के लिए<br />AI Business OS.
            </h2>
            <p className="text-emerald-100/70 text-sm leading-relaxed">
              WhatsApp से बोलिए, हिसाब खुद बन जाएगा।
            </p>
          </div>

          {/* Features Checklist */}
          <div className="space-y-4 mb-auto">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-emerald-50">कोई ऐप डाउनलोड नहीं</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-emerald-50">WhatsApp पर पूरी तरह काम करे</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-emerald-50">उधार, स्टॉक और बिलिंग एक जगह</span>
            </div>
          </div>

          {/* Footer CTA & Testimonial */}
          <div className="mt-8 space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-sm text-emerald-50/90 italic leading-relaxed">
                "मैसेज भेजो, काम हो जाएगा।"
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-emerald-200/60 font-medium">— 1000+ दुकानों का भरोसा</span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> 4.8
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowSplash(false)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-base"
            >
              शुरू करें <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-center p-4 selection:bg-emerald-500/30">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-900/50 mb-4 border border-emerald-400/20">
          <Store className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dukaan<span className="text-emerald-400">Mitra</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 font-medium">अपना डिजिटल मुनीम सेटअप करें</p>
      </div>

      {/* Card Content */}
      <div className="w-full max-w-md mx-auto bg-slate-900/90 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/20 shadow-2xl my-4 relative">
        
        {/* Offline Warning */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-12 left-0 right-0 bg-rose-500 text-white p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <WifiOff className="w-4 h-4" /> इंटरनेट कनेक्शन नहीं है
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guest Mode Direct Promo */}
        <div className="mb-5 bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 p-3.5 rounded-2xl text-center">
          <p className="text-emerald-300 text-xs font-semibold mb-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> सुरक्षित और मुफ़्त
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleGuestMode}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-sm font-extrabold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            🚀 बिना लॉगिन के डेमो देखें
          </button>
        </div>

        <div className="relative flex items-center py-2 mb-4">
          <div className="flex-grow border-t border-slate-700/50"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium">या लॉगिन करें</span>
          <div className="flex-grow border-t border-slate-700/50"></div>
        </div>

        {!otpSent && (
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950/80 rounded-xl mb-5">
            <button
              type="button"
              disabled={loading}
              onClick={() => { setAuthMethod("phone"); setError(""); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                authMethod === "phone" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Mobile OTP
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => { setAuthMethod("email"); setError(""); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                authMethod === "email" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => { setAuthMethod("google"); setError(""); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50 ${
                authMethod === "google" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Google
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-950/50 border border-rose-500/30 text-rose-300 rounded-xl p-3 text-xs flex items-center justify-center gap-2 mb-4 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Phone OTP flow */}
        {authMethod === "phone" && (
          <AnimatePresence mode="wait">
            {!otpSent ? (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-emerald-400 text-xs font-semibold mb-1.5">दुकान का नाम</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                      <Store className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={loading}
                      value={shopName}
                      onChange={(e) => { setShopName(e.target.value); clearError(); }}
                      className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 transition-all"
                      placeholder="जैसे: श्री गणेश किराना स्टोर"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-emerald-400 text-xs font-semibold mb-1.5">मोबाइल नंबर</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600 font-bold text-sm">
                      +91
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={loading}
                      maxLength={10}
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); clearError(); }}
                      className="block w-full pl-12 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-550 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono text-base disabled:opacity-50 transition-all"
                      placeholder="99XXXXXXXX"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-1.5 text-base cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      कृपया प्रतीक्षा करें...
                    </span>
                  ) : (
                    <>OTP भेजें <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-4"
              >
                <div className="text-center mb-2">
                  <p className="text-slate-400 text-xs">+91 {phone} पर भेजे गए कोड को दर्ज करें</p>
                </div>
                <div>
                  <label className="block text-emerald-400 text-xs font-semibold mb-1.5 text-center">4-अंकों का OTP कोड</label>
                  <div className="relative max-w-[180px] mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={loading}
                      maxLength={4}
                      value={otp}
                      onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); clearError(); }}
                      className="block w-full text-center pl-8 pr-3 py-2 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xl tracking-[0.5em] font-mono disabled:opacity-50 transition-all"
                      placeholder="••••"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 text-center mt-1.5">डेमो कोड: <span className="font-mono text-emerald-400 font-bold">1234</span> दर्ज करें</p>
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => { setOtpSent(false); setOtp(""); setError(""); }}
                    className="w-1/3 py-2.5 border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 transition-all text-xs cursor-pointer disabled:opacity-50"
                  >
                    वापस
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        सत्यापन...
                      </span>
                    ) : (
                      <>प्रवेश करें <ShieldCheck className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        )}

        {/* 2. Email flow */}
        {authMethod === "email" && (
          <motion.form 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onSubmit={handleEmailLogin} 
            className="space-y-4"
          >
            <div>
              <label className="block text-emerald-400 text-xs font-semibold mb-1.5">दुकान का नाम</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                  <Store className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={shopName}
                  onChange={(e) => { setShopName(e.target.value); clearError(); }}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50 transition-all"
                  placeholder="श्री गणेश किराना स्टोर"
                />
              </div>
            </div>
            <div>
              <label className="block text-emerald-400 text-xs font-semibold mb-1.5">ईमेल एड्रेस (Email ID)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono disabled:opacity-50 transition-all"
                  placeholder="name@store.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-emerald-400 text-xs font-semibold mb-1.5">पासवर्ड (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="block w-full pl-9 pr-3 py-2.5 bg-slate-950/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono disabled:opacity-50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-1.5 text-sm cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  लॉगिन किया जा रहा है...
                </span>
              ) : (
                <>ईमेल से प्रवेश करें <ShieldCheck className="w-4 h-4" /></>
              )}
            </button>
          </motion.form>
        )}

        {/* 3. Google flow */}
        {authMethod === "google" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 py-2 text-center">
            <p className="text-slate-400 text-xs">अपने गूगल व्यवसाय खाते से जुड़े रहने के लिए वन-टैप लॉगिन</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                  Google खाते से कनेक्ट हो रहा है...
                </span>
              ) : (
                <><Chrome className="w-5 h-5 text-red-500" /> Google खाते से लॉगिन करें</>
              )}
            </button>
            <p className="text-[10px] text-slate-500">Google Authentication के साथ सुरक्षित</p>
          </motion.div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center text-emerald-400/60 text-[10px] py-2 mt-4 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400/80" /> 100% सुरक्षित बहीखाता • भारत में निर्मित
      </div>
    </div>
  );
}
"""

with open("src/components/LoginScreen.tsx", "w") as f:
    f.write(new_content)
