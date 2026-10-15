import React from 'react';
import { Home, ShoppingBag, Calendar, Sparkles, Clock } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'marketplace', label: 'Shop', icon: ShoppingBag, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'history', label: 'Orders', icon: Clock },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-t shadow-lg px-2 py-1.5" style={{ borderColor: '#E5DFD3' }}>
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#175741] font-extrabold' : 'text-stone-500 font-medium hover:text-stone-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F0A21E] text-stone-900 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#175741] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
