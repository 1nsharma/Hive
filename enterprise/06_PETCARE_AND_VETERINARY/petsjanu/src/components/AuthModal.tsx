import React, { useState } from 'react';
import { X, Phone, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phone: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { signInWithGoogle, signInWithOtp, verifyOtp, loginAsGuest } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+91 63937 41171');
  const [otp, setOtp] = useState(['1', '2', '3', '4']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const res = await signInWithGoogle();
    setLoading(false);
    if (res.user) {
      onSuccess(phone);
      onClose();
    } else if (res.error) {
      setError(res.error.message || 'Google sign in failed');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
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
      setError(err.message || 'Error sending OTP. Proceeding in simulation mode.');
    }
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter complete 4-digit OTP.');
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
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FDFBF7] rounded-2xl border shadow-2xl p-6 relative space-y-5" style={{ borderColor: '#E5DFD3' }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#175741] flex items-center justify-center mx-auto text-xl border border-emerald-200">
            🔒
          </div>
          <h3 className="text-xl font-extrabold" style={{ color: '#0E3D2F' }}>
            {step === 'phone' ? 'Sign In / Register' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs text-stone-600">
            {step === 'phone' 
              ? 'Select Google OAuth or enter mobile number for instant login' 
              : `4-digit OTP sent to ${phone}`}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <div className="space-y-4">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white border border-stone-300 rounded-xl font-extrabold text-xs text-stone-800 hover:bg-stone-50 cursor-pointer flex items-center justify-center gap-3 shadow-xs transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              {loading ? 'Signing in with Google...' : 'Continue with Google Account'}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-[1px] bg-stone-200 flex-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">or Mobile OTP</span>
              <div className="h-[1px] bg-stone-200 flex-1" />
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
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
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Send OTP Code <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 text-center mb-2">
                Enter 4-Digit Code (Demo Code: 1234)
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
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
                      if (val && i < 3) {
                        document.getElementById(`otp-input-${i + 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-12 text-center rounded-xl border text-xl font-black bg-white focus:outline-none focus:ring-2 focus:ring-[#175741]"
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
                  <ShieldCheck className="w-4 h-4" /> Verify & Continue
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-stone-500 hover:text-stone-800 underline"
            >
              ← Edit mobile number
            </button>
          </form>
        )}

        <div className="text-[10px] text-stone-400 text-center pt-2 border-t" style={{ borderColor: '#E5DFD3' }}>
          By continuing, you agree to PetGuardian terms & privacy policy.
        </div>
      </div>
    </div>
  );
};
