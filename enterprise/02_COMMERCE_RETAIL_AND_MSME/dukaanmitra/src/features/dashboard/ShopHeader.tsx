import { Bell, Wifi, WifiOff, Settings, Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface ShopHeaderProps {
  isGuest?: boolean;
  onNotificationClick?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  onSettingsClick?: () => void;
}

export default function ShopHeader({ isGuest, onNotificationClick, showBack, onBack, onSettingsClick }: ShopHeaderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="glass-panel sticky top-0 z-40 select-none">
      {isGuest && (
        <div className="bg-amber-50 text-amber-800 text-[10px] py-1.5 px-4 font-bold text-center border-b border-amber-200">
          DEMO MODE - Data is saved locally. Login to save to cloud.
        </div>
      )}
      {!isOnline && (
        <div className="bg-rose-50 text-rose-600 text-[10px] py-1.5 px-4 font-bold text-center border-b border-rose-100 flex items-center justify-center gap-1.5">
          <WifiOff className="w-3 h-3" /> Offline Mode (Changes will sync later)
        </div>
      )}
      <div className="max-w-7xl mx-auto w-full px-3 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={onBack} className="p-2 -ml-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <div className="flex items-center gap-1 font-extrabold text-2xl tracking-tight cursor-pointer">
            <span className="text-slate-900">Bazaar</span>
            <span className="text-[#16A34A]">Sync</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onNotificationClick} className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={onSettingsClick} className="p-2 -mr-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
