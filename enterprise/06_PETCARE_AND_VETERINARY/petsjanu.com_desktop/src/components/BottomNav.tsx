import React from 'react';
import { Compass, Home, ShoppingBag, Calendar, Sparkles, Stethoscope, Radar, Settings, User, Mic } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

const PUBLIC_TABS = [
  { id: 'landing',        label: 'Explore',   icon: Compass },
  { id: 'pet-translator', label: 'Pet Talk',  icon: Mic },
  { id: 'marketplace',    label: 'Shop',      icon: ShoppingBag },
  { id: 'ai',             label: 'AI Care',   icon: Sparkles },
  { id: 'auth',           label: 'Sign In',   icon: User },
];

const APP_TABS = [
  { id: 'dashboard',      label: 'Home',      icon: Home },
  { id: 'health',         label: 'Health',    icon: Stethoscope },
  { id: 'pet-translator', label: 'Pet Talk',  icon: Mic },
  { id: 'radar',          label: 'SOS Radar', icon: Radar },
  { id: 'settings',       label: 'Account',   icon: Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  isLoggedIn = false,
  onOpenAuth
}) => {
  const tabs = isLoggedIn ? APP_TABS : PUBLIC_TABS;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-safe"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        paddingTop: '8px',
        background: 'rgba(253,250,244,0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(227,217,196,0.8)',
        boxShadow: '0 -4px 24px -8px rgba(23,87,65,0.15)',
      }}
    >
      <div className="flex items-end justify-around gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const showBadge = id === 'marketplace' && cartCount > 0;
          return (
            <button
              key={id}
              onClick={() => {
                if (id === 'auth') {
                  onOpenAuth?.();
                } else {
                  setActiveTab(id);
                }
              }}
              className="relative flex flex-col items-center gap-1 py-1 px-2 cursor-pointer group"
              style={{ minWidth: 52 }}
            >
              {/* Active pill background */}
              {isActive && (
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-8 rounded-2xl"
                  style={{ background: 'rgba(240,162,30,0.18)' }}
                />
              )}

              {/* Icon */}
              <div className="relative z-10">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive
                      ? 'text-[#175741] scale-110'
                      : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-black text-[9px] flex items-center justify-center border-2 border-white shadow-xs">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] font-bold tracking-tight transition-colors leading-none ${
                  isActive ? 'text-[#175741]' : 'text-stone-400 group-hover:text-stone-600'
                }`}
              >
                {label}
              </span>

              {/* Active dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
