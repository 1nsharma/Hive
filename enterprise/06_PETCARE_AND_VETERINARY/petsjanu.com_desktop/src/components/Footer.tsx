import React, { useState } from 'react';
import { Shield, Heart, Phone, Mail, MapPin, Instagram, Twitter, Check, ArrowRight, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const stats = [
    { value: 'Waitlist Live', label: 'Early Access Program', color: 'text-amber-400' },
    { value: '10,000+',       label: 'Pets Protected',        color: 'text-amber-400' },
    { value: 'Vet-Reviewed',  label: 'Medical AI Content',    color: 'text-amber-400' },
    { value: '24 / 7',        label: 'Emergency Support',     color: 'text-amber-400' },
  ];

  const exploreLinks  = [
    { tab: 'how-it-works',   label: 'How It Works' },
    { tab: 'safety',         label: 'Pet Safety & Smart Tags' },
    { tab: 'health',         label: 'AI Health & Vet Care' },
    { tab: 'pet-translator', label: 'AI Pet Voice Translator' },
    { tab: 'nutrition',      label: 'AI Diet & Calorie Planner' },
    { tab: 'marketplace',    label: 'Pet Product Shop' },
    { tab: 'pricing',        label: 'Pricing & Plans' },
    { tab: 'about',          label: 'About Mission' },
  ];

  const legalLinks = [
    { tab: 'privacy',      label: 'Privacy Policy' },
    { tab: 'security',     label: 'Security' },
    { tab: 'transparency', label: 'Transparency' },
    { tab: 'feedback',     label: 'Community' },
    { tab: 'vendor',       label: 'Sell on PetJanu' },
    { tab: 'jobs',         label: 'Pet Jobs' },
  ];

  return (
    <footer
      className="relative overflow-hidden pt-16 pb-8 border-t"
      style={{
        background: 'linear-gradient(160deg, #040C09 0%, #071410 40%, #0A1F17 100%)',
        borderColor: 'rgba(23,87,65,0.5)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[300px] pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(ellipse, #F0A21E, transparent 70%)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[300px] pointer-events-none opacity-8"
        style={{ background: 'radial-gradient(ellipse, #175741, transparent 70%)', filter: 'blur(80px)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-14">

        {/* Trust stat banner */}
        <div
          className="p-6 rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center border"
          style={{ background: 'rgba(23,87,65,0.18)', borderColor: 'rgba(23,87,65,0.4)' }}
        >
          {stats.map(({ value, label, color }) => (
            <div key={label} className="space-y-1">
              <div className={`text-2xl font-black font-serif ${color}`}>{value}</div>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: '#175741' }}>🐾</div>
              <div>
                <div className="font-serif font-black text-xl text-white tracking-tight">PetJanu</div>
                <div className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">petsjanu.com</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              India's trusted public pet safety platform. Protecting dogs, cats, and Indie pets across Mumbai, Delhi, Bengaluru, and 50+ cities. Waitlist Access mode — join now.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-400" /> support@petsjanu.com</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" /> +91 63937 41171</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /> HSR Layout, Bengaluru, India</p>
            </div>

            {/* Social row */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { label: 'Instagram', href: 'https://instagram.com/petsjanu', icon: Instagram },
                { label: 'Twitter/X', href: 'https://twitter.com/petsjanu',   icon: Twitter },
                {
                  label: 'WhatsApp', href: 'https://wa.me/916393741171',
                  icon: () => (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  ),
                  color: '#25D366',
                },
              ].map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10 hover:border-white/30"
                  style={color ? { '--hover-color': color } as React.CSSProperties : {}}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Explore</h4>
            <ul className="space-y-2.5">
              {exploreLinks.map(({ tab, label }) => (
                <li key={tab}>
                  <button
                    onClick={() => onNavigateTab(tab)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-medium text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Company</h4>
            <ul className="space-y-2.5">
              {legalLinks.map(({ tab, label }) => (
                <li key={tab}>
                  <button
                    onClick={() => onNavigateTab(tab)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-medium text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">Pet Safety Digest</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Monthly tips on pet safety, vet care reminders, and India-specific breed health advice — straight to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold text-emerald-400 border border-emerald-700/50" style={{ background: 'rgba(23,87,65,0.2)' }}>
                <Check className="w-4 h-4" /> You're subscribed! Welcome to the pack. 🐾
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 border border-slate-700"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl text-xs font-black text-stone-950 cursor-pointer flex items-center gap-1.5 shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F0A21E, #FFD07A)' }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* App store badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold text-slate-300 cursor-default">
                🍎 App Store — Coming Soon
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-[10px] font-bold text-slate-300 cursor-default">
                🤖 Play Store — Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600 font-mono">
            © 2025 PetJanu Technologies Pvt. Ltd. · HSR Layout, Bengaluru · CIN: U72900KA2025PTC000000
          </p>
          <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-600">
            {['SSL Encrypted', 'Razorpay PCI DSS', 'DPDP Act 2023', '4.9★ Trust Rating'].map(b => (
              <span key={b} className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
