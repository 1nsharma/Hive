import React, { useState } from 'react';
import { Shield, ShoppingBag, User, LogOut, Phone, Sparkles, Menu, X, ChevronDown, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  activePetName?: string;
  onOpenTourModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  activePetName,
  onOpenTourModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'safety', label: 'Pet Safety' },
    { id: 'health', label: 'Health & Care' },
    { id: 'marketplace', label: 'Shop' },
    { id: 'security', label: 'Security' },
    { id: 'feedback', label: 'Community' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b shadow-xs" style={{ backgroundColor: '#FDFBF7', borderColor: '#E5DFD3' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        
        {/* Brand Logo - PetJanu */}
        <button 
          id="petjanu-brand-header"
          onClick={() => setActiveTab('landing')} 
          className="flex items-center gap-2 text-left cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs transition-transform group-hover:scale-105" style={{ backgroundColor: '#175741', color: '#FFFFFF' }}>
            🐾
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-serif font-black tracking-tight" style={{ color: '#1C2B23' }}>PetJanu</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200 uppercase">
                INDIA
              </span>
            </div>
            <p className="text-[10px] font-medium tracking-wide text-stone-500">Trusted Pet Safety &amp; Care</p>
          </div>
        </button>

        {/* Desktop Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/80 p-1 rounded-2xl border border-stone-200/80">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive ? 'bg-[#175741] text-white shadow-xs' : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Cart, Guided Tour, Dashboard & Auth */}
        <div className="flex items-center gap-2">
          
          {/* Guided Tour Launcher Button */}
          {onOpenTourModal && (
            <button
              id="tour-nav-guide-btn"
              onClick={onOpenTourModal}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border border-amber-300/80 bg-amber-50 text-amber-950 hover:bg-amber-100 cursor-pointer hidden sm:flex items-center gap-1.5 shadow-2xs"
              title="Launch interactive ecosystem tour"
            >
              <Compass className="w-3.5 h-3.5 text-[#B87A08] animate-spin-slow" />
              <span>Economy Tour ✨</span>
            </button>
          )}

          {/* Dashboard Button */}
          <button
            id="tour-nav-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border cursor-pointer hidden sm:flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-[#175741] text-white border-[#175741]'
                : 'bg-emerald-50 text-[#175741] border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#F0A21E]" /> Dashboard
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-xl border bg-white hover:bg-stone-50 cursor-pointer text-stone-800 transition-all"
            style={{ borderColor: '#E5DFD3' }}
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#175741]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F0A21E] text-stone-900 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Auth Button */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('settings')}
                className="hidden md:inline-flex text-xs font-bold text-stone-800 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer"
              >
                👤 {activePetName ? `${activePetName}'s Parent` : 'Account Settings'}
              </button>
              <button
                onClick={onLogout}
                className="p-2 rounded-xl border bg-stone-50 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-all text-stone-600"
                style={{ borderColor: '#E5DFD3' }}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-white flex items-center gap-1.5 shadow-xs cursor-pointer transition-all hover:opacity-95"
              style={{ backgroundColor: '#175741' }}
            >
              <Phone className="w-3.5 h-3.5 text-[#F0A21E]" /> Sign In / OTP
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border bg-white text-stone-800 cursor-pointer"
            style={{ borderColor: '#E5DFD3' }}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-[#FDFBF7] p-4 space-y-2" style={{ borderColor: '#E5DFD3' }}>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left cursor-pointer ${
                  activeTab === link.id ? 'bg-[#175741] text-white' : 'bg-stone-100 text-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
            {onOpenTourModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTourModal();
                }}
                className="w-full py-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-extrabold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-[#B87A08]" /> Launch Economy Guided Tour ✨
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-emerald-50 text-[#175741] border border-emerald-200 font-extrabold text-xs text-center"
            >
              🛡️ Pet Parent Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 rounded-xl bg-stone-100 text-stone-800 font-bold text-xs text-center"
            >
              ⚙️ Account Settings
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

