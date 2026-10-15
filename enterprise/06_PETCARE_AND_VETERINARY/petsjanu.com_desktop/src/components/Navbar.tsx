import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShoppingBag,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Search,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronDown,
  Tag,
  Heart,
  BookOpen,
  Stethoscope,
  Info,
  HelpCircle,
  FileText,
  Home,
  Radar,
  CreditCard,
  Box,
  Calendar,
  Settings,
  Clock,
  Plus,
  AlertTriangle,
  Check,
  Mic
} from 'lucide-react';
import { audioService } from '../lib/audioService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  cartCount: number;
  onOpenCart: () => void;
  activePetName?: string;
  activePet?: any;
  pets?: any[];
  onSelectPet?: (petId: string) => void;
  onToggleLostStatus?: () => void;
  onOpenAddPet?: () => void;
  onOpenSearch?: () => void;
  onStartTour?: () => void;
  onOpenPoster?: () => void;
}

// Marketing website navigation (for logged-out visitors)
const PUBLIC_NAV_LINKS = [
  { id: 'how-it-works',   label: 'How It Works',  icon: HelpCircle },
  { id: 'safety',         label: 'Pet Safety',    icon: Shield },
  { id: 'health',         label: 'Health & Care', icon: Stethoscope },
  { id: 'pet-translator', label: 'Pet Talk AI',   icon: Mic },
  { id: 'marketplace',    label: 'Shop',          icon: ShoppingBag },
  { id: 'pricing',        label: 'Pricing',       icon: Tag },
  { id: 'blog',           label: 'Blog',          icon: BookOpen },
  { id: 'about',          label: 'About',         icon: Info },
];

// Software Application navigation (for authenticated users)
const APP_NAV_LINKS = [
  { id: 'dashboard',      label: 'Dashboard',   icon: Home },
  { id: 'health',         label: 'AI Health',   icon: Stethoscope },
  { id: 'pet-translator', label: 'Pet Talk AI', icon: Mic },
  { id: 'radar',          label: 'SOS Radar',   icon: Radar },
  { id: 'passport',       label: 'Passport',    icon: CreditCard },
  { id: 'marketplace',    label: 'Shop',        icon: ShoppingBag },
  { id: 'services',       label: 'Bookings',    icon: Calendar },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onOpenAuth,
  onLogout,
  cartCount,
  onOpenCart,
  activePetName,
  activePet,
  pets = [],
  onSelectPet,
  onToggleLostStatus,
  onOpenAddPet,
  onOpenSearch,
  onStartTour,
  onOpenPoster,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioService.getMuted());
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (petRef.current && !petRef.current.contains(e.target as Node)) {
        setPetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    if (!muted) audioService.playSuccess();
  };

  const navigate = (tab: string) => {
    setActiveTab(tab);
    setDrawerOpen(false);
    setProfileDropdownOpen(false);
    setPetDropdownOpen(false);
    audioService.playSuccess();
  };

  return (
    <>
      {/* ── Main Header ───────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(253,250,244,0.96)'
            : 'rgba(253,250,244,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #E3D9C4' : '1px solid rgba(227,217,196,0.5)',
          boxShadow: scrolled ? '0 4px 24px -8px rgba(23,87,65,0.12)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3 sm:gap-4">

          {/* Brand Logo */}
          <button
            onClick={() => navigate(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shadow-sm transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}
            >
              🐾
            </div>
            <div className="flex flex-col leading-none text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-lg tracking-tight text-stone-900">PetJanu</span>
                {isLoggedIn && (
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-xs">
                    APP
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                {isLoggedIn ? 'pet operating system' : 'petsjanu.com'}
              </span>
            </div>
          </button>

          {/* Active Pet Pill in App Mode */}
          {isLoggedIn && activePet && (
            <div className="relative hidden md:flex items-center" ref={petRef}>
              <button
                onClick={() => setPetDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-amber-300/80 bg-amber-50/80 hover:bg-amber-100/80 transition-all cursor-pointer shadow-xs text-xs font-bold text-stone-800"
              >
                <span>{activePet.species === 'Cat' ? '🐱' : '🐶'}</span>
                <span className="font-black text-stone-900">{activePet.name}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                  activePet.isLost ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-200 text-emerald-900'
                }`}>
                  {activePet.isLost ? '🚨 LOST SOS' : 'SAFE'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {/* Pet Switcher Dropdown */}
              {petDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-stone-400 uppercase border-b border-stone-100">
                    Switch Active Pet
                  </div>
                  {pets.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectPet?.(p.id);
                        setPetDropdownOpen(false);
                        audioService.playSuccess();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        p.id === activePet.id ? 'bg-amber-100 text-stone-950 font-black' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{p.species === 'Cat' ? '🐱' : '🐶'}</span>
                        <span>{p.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{p.slug}</span>
                    </button>
                  ))}
                  {onOpenAddPet && (
                    <button
                      onClick={() => {
                        setPetDropdownOpen(false);
                        onOpenAddPet();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[#175741] hover:bg-emerald-50 transition-all cursor-pointer border-t border-stone-100 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Pet Profile</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {(isLoggedIn ? APP_NAV_LINKS : PUBLIC_NAV_LINKS).map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-sm scale-105'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-500'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Quick SOS Trigger Button in App Mode */}
            {isLoggedIn && onToggleLostStatus && (
              <button
                onClick={onToggleLostStatus}
                title={activePet?.isLost ? "Click to mark pet as Safe" : "Click to report emergency Lost SOS"}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm ${
                  activePet?.isLost
                    ? 'bg-red-600 text-white animate-pulse shadow-red-600/40'
                    : 'bg-stone-900 text-amber-400 hover:bg-red-600 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{activePet?.isLost ? '🚨 SOS ACTIVE' : '🚨 REPORT LOST'}</span>
              </button>
            )}

            {/* Search Button (⌘K) */}
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-500 text-xs font-medium hover:border-amber-300 hover:text-stone-800 transition-all cursor-pointer bg-white/70"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="text-[9px] font-mono bg-stone-100 px-1.5 py-0.5 rounded font-bold">⌘K</kbd>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              title="Shopping Cart"
              className="relative w-8 h-8 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Area */}
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-900 bg-stone-100 hover:bg-amber-100/80 border border-stone-200 transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#175741] text-white flex items-center justify-center text-xs font-black">
                    {activePetName ? activePetName[0].toUpperCase() : 'P'}
                  </div>
                  <span className="hidden sm:inline font-black">{activePetName || 'Pet Parent'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {/* Profile Menu Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <div className="text-xs font-black text-stone-900">Signed In</div>
                      <div className="text-[10px] text-stone-500 font-mono truncate">Managing {activePetName || 'Bruno'}</div>
                    </div>

                    <button
                      onClick={() => navigate('dashboard')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5 text-stone-400" />
                      <span>Pet Dashboard</span>
                    </button>

                    <button
                      onClick={() => navigate('history')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Orders &amp; Bookings</span>
                    </button>

                    <button
                      onClick={() => navigate('settings')}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-stone-400" />
                      <span>Account Settings</span>
                    </button>

                    <div className="border-t border-stone-100 my-1 pt-1">
                      <button
                        onClick={async () => {
                          setProfileDropdownOpen(false);
                          await onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white cursor-pointer transition-all shadow-md hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #175741, #1F7A5A)' }}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Sign In / Get Started</span>
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Mobile Drawer Overlay ─────────────────────────────────── */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] flex"
          onClick={() => setDrawerOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative ml-auto w-80 h-full flex flex-col shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #071410, #0A1F17)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: '#175741' }}>🐾</div>
                <div>
                  <div className="font-serif font-black text-white text-base">
                    PetJanu {isLoggedIn ? 'App' : 'Platform'}
                  </div>
                  {isLoggedIn && activePetName && (
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">
                      Active: {activePetName}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer links */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {(isLoggedIn ? APP_NAV_LINKS : PUBLIC_NAV_LINKS).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === id
                      ? 'bg-amber-400 text-stone-950 font-black shadow-md'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-70" />
                    {label}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              ))}

              {isLoggedIn ? (
                <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                  <button
                    onClick={() => navigate('history')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Clock className="w-4 h-4 opacity-70" />
                    <span>Orders &amp; Bookings</span>
                  </button>
                  <button
                    onClick={() => navigate('settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 opacity-70" />
                    <span>Account Settings</span>
                  </button>
                  {onToggleLostStatus && (
                    <button
                      onClick={() => {
                        onToggleLostStatus();
                        setDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-amber-300 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>{activePet?.isLost ? 'Mark Pet Safe ✅' : 'Trigger Lost SOS 🚨'}</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                  {onOpenPoster && (
                    <button
                      onClick={() => {
                        onOpenPoster();
                        setDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 opacity-70" /> Lost Poster Lab
                    </button>
                  )}
                  <button
                    onClick={toggleSound}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 opacity-70" /> : <Volume2 className="w-4 h-4 opacity-70" />}
                    <span>{isMuted ? 'Unmute Sounds' : 'Mute Sounds'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-4 pb-6 pt-3 border-t border-white/10 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={async () => {
                    setDrawerOpen(false);
                    await onLogout();
                  }}
                  className="w-full py-3 rounded-2xl text-sm font-bold text-red-400 hover:text-white border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of App</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenAuth();
                    setDrawerOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl text-sm font-black text-stone-950 cursor-pointer shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #F0A21E, #FFD07A)' }}
                >
                  Get Started Free ✦
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
