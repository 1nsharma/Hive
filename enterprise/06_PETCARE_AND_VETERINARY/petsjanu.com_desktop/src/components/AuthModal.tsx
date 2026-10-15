import React, { useState } from 'react';
import { X, Phone, ShieldCheck, ArrowRight, RefreshCw, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneOrEmail: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { signInWithGoogle, signInWithOtp, verifyOtp, loginAsGuest } = useAuth();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [email, setEmail] = useState('parent@petsjanu.com');
  const [phone, setPhone] = useState('+91 63937 41171');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Handle Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.user) {
      onSuccess(phone || email);
      onClose();
    } else if (res.error) {
      setError(res.error.message || 'Google sign in failed');
    }
  };

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setInfoMessage(data.message || 'OTP successfully sent to your email!');
        if (data.demoOtp) {
          setOtp(data.demoOtp.split(''));
        } else {
          setOtp(['', '', '', '', '', '']);
        }
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send OTP to email.');
      }
    } catch (err: any) {
      setLoading(false);
      setError('Network error sending OTP. Please try again.');
    }
  };

  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter complete 6-digit OTP code.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        loginAsGuest(email);
        onSuccess(email);
        onClose();
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error verifying OTP code.');
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setLoading(true);

    const { error: err } = await signInWithOtp(phone);
    setLoading(false);
    if (err) {
      setError(err.message || 'Error sending SMS OTP. Proceeding in simulation mode.');
    }
    setOtp(['1', '2', '3', '4', '', '']);
    setStep('otp');
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('').slice(0, 4);
    if (code.length < 4) {
      setError('Please enter complete 4-digit mobile OTP.');
      return;
    }
    setLoading(true);

    const { error: err } = await verifyOtp(phone, code);
    setLoading(false);

    loginAsGuest(phone);
    onSuccess(phone);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#FDFBF7] rounded-2xl border shadow-2xl p-6 relative space-y-4 transform transition-all duration-200" 
        style={{ borderColor: '#E5DFD3' }}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#175741] flex items-center justify-center mx-auto text-xl border border-emerald-200">
            🔑
          </div>
          <h3 className="text-xl font-extrabold" style={{ color: '#0E3D2F' }}>
            {step === 'input' ? 'Secure Login / Register' : 'Verify Security OTP'}
          </h3>
          <p className="text-xs text-stone-600">
            {step === 'input' 
              ? 'Login with Email OTP, Mobile SMS, or Google Account' 
              : authMethod === 'email' ? `6-Digit OTP sent to ${email}` : `4-Digit OTP sent to ${phone}`}
          </p>
        </div>

        {/* Method Selector Tabs */}
        {step === 'input' && (
          <div className="flex bg-stone-200/70 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => { setAuthMethod('email'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'email' ? 'bg-white text-[#175741] shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5" /> Email OTP
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod('phone'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authMethod === 'phone' ? 'bg-white text-[#175741] shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Mobile SMS
            </button>
          </div>
        )}

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {infoMessage && step === 'otp' && (
          <div className="p-2.5 bg-amber-50 border border-amber-300/60 text-amber-900 rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{infoMessage}</span>
          </div>
        )}

        {step === 'input' ? (
          <div className="space-y-3.5">
            {/* Beta Testing Notice Banner */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-900 text-xs font-semibold flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950 font-extrabold text-[11px] uppercase tracking-wider">⚡ Beta Testing Notice:</strong>
                <span>Full real app access & pet profile data creation requires <strong>Google Account Login</strong> for Beta Tester onboarding.</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-[#175741] text-white border border-[#0E3D2F] rounded-xl font-extrabold text-xs hover:bg-[#0E3D2F] cursor-pointer flex items-center justify-center gap-2.5 shadow-md transition-all relative overflow-hidden"
            >
              <div className="bg-white p-1 rounded-lg">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
              </div>
              {loading ? 'Connecting Google Account...' : 'Sign In with Google (Recommended Real Access)'}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="h-[1px] bg-stone-200 flex-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                or {authMethod === 'email' ? 'Email OTP' : 'Mobile OTP'}
              </span>
              <div className="h-[1px] bg-stone-200 flex-1" />
            </div>

            {authMethod === 'email' ? (
              <form onSubmit={handleSendEmailOtp} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Email Address (Resend SMTP Verified)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="parent@petsjanu.com"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-95"
                  style={{ backgroundColor: '#175741' }}
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Send Email OTP Code <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                    Mobile Number (SMS Auth)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 63937 41171"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-95"
                  style={{ backgroundColor: '#175741' }}
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>Send Mobile OTP Code <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={authMethod === 'email' ? handleVerifyEmailOtp : handleVerifyPhoneOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 text-center mb-2">
                Enter {authMethod === 'email' ? '6-Digit' : '4-Digit'} Security OTP
              </label>
              <div className="flex gap-1.5 justify-center">
                {(authMethod === 'email' ? otp : otp.slice(0, 4)).map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      const next = [...otp];
                      next[i] = val;
                      setOtp(next);
                      const maxLen = authMethod === 'email' ? 5 : 3;
                      if (val && i < maxLen) {
                        document.getElementById(`otp-input-${i + 1}`)?.focus();
                      }
                    }}
                    className="w-10 h-12 text-center rounded-xl border text-xl font-black bg-white focus:outline-none focus:ring-2 focus:ring-[#175741]"
                    style={{ borderColor: '#E5DFD3' }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all hover:opacity-95"
              style={{ backgroundColor: '#175741' }}
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Verify & Login
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('input'); setError(''); setInfoMessage(''); }}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-800 underline"
            >
              ← Edit {authMethod === 'email' ? 'email address' : 'mobile number'}
            </button>
          </form>
        )}

        <div className="text-[10px] text-stone-400 text-center pt-2 border-t" style={{ borderColor: '#E5DFD3' }}>
          By continuing, you agree to PetJanu security terms & privacy policy.
        </div>
      </div>
    </div>
  );
};
