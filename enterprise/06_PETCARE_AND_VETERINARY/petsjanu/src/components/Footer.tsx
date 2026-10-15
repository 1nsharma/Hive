import React from 'react';
import { Shield, Heart, Phone, Mail, MapPin, Sparkles, Award, Star, Lock } from 'lucide-react';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-[#1C2B23] text-stone-200 pt-16 pb-12 border-t border-[#175741]">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        
        {/* Trust Banner */}
        <div className="p-6 rounded-3xl bg-[#175741]/40 border border-[#175741] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#F0A21E]">10,000+</div>
            <p className="text-xs text-stone-300 font-medium">Pets Protected in India</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#F0A21E]">4.8 ★</div>
            <p className="text-xs text-stone-300 font-medium">Rating from Pet Parents</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#F0A21E]">Vet-Reviewed</div>
            <p className="text-xs text-stone-300 font-medium">Medical Content & AI</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-black text-[#F0A21E]">24 / 7</div>
            <p className="text-xs text-stone-300 font-medium">Emergency Support</p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#175741] text-amber-400 flex items-center justify-center text-lg font-bold shadow-xs">
                🐾
              </div>
              <span className="text-2xl font-serif font-black text-white tracking-tight">PetJanu</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              India’s most trusted public pet safety platform (petsjanu.com). Protecting dogs, cats, and Indie pets across Mumbai, Delhi, Bengaluru, and 50+ cities.
            </p>
            <div className="text-xs text-stone-400 space-y-1 pt-1">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#F0A21E]" /> support@petsjanu.com</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#F0A21E]" /> +91 63937 41171 (Direct Helpline)</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#F0A21E]" /> HSR Layout, Bengaluru, Karnataka, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0A21E]">Services</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-300">
              <li>
                <button onClick={() => onNavigateTab('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('safety')} className="hover:text-white transition-colors cursor-pointer">
                  Pet Safety & Smart Tags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('health')} className="hover:text-white transition-colors cursor-pointer">
                  AI Health & Vet Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('marketplace')} className="hover:text-white transition-colors cursor-pointer">
                  Pet Product Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('services')} className="hover:text-white transition-colors cursor-pointer">
                  Book Vet & Grooming
                </button>
              </li>
            </ul>
          </div>

          {/* Learn & Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0A21E]">Trust &amp; Transparency</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-300">
              <li>
                <button onClick={() => onNavigateTab('security')} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#F0A21E]" /> Security Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('privacy')} className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy &amp; Data Rights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('transparency')} className="hover:text-white transition-colors cursor-pointer">
                  Public Transparency Report
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('feedback')} className="hover:text-white transition-colors cursor-pointer">
                  Community Feedback &amp; Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Leadership &amp; Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F0A21E]">Stay Connected</h4>
            <p className="text-xs text-stone-300">Receive vet tips, food guides &amp; pet safety alerts for Indian pet parents.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to PetJanu newsletter!"); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter email address"
                required
                className="w-full px-3 py-2 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-[#F0A21E]"
              />
              <button type="submit" className="w-full py-2 rounded-xl bg-[#F0A21E] text-stone-900 text-xs font-extrabold hover:bg-amber-400 cursor-pointer">
                Subscribe Free
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Trust Badges */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <p>© 2026 PetJanu (petsjanu.com). Made with ❤️ for pet parents in India.</p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => onNavigateTab('security')} className="hover:underline hover:text-white cursor-pointer">Security</button>
            <button onClick={() => onNavigateTab('privacy')} className="hover:underline hover:text-white cursor-pointer">Privacy Policy</button>
            <button onClick={() => onNavigateTab('transparency')} className="hover:underline hover:text-white cursor-pointer">Transparency Report</button>
            <button onClick={() => onNavigateTab('feedback')} className="hover:underline hover:text-white cursor-pointer">Community Feedback</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
