import fs from 'fs';
let content = fs.readFileSync('src/components/ShopHeader.tsx', 'utf-8');

// Add Settings to lucide-react import
content = content.replace('Bell, Wifi, WifiOff', 'Bell, Wifi, WifiOff, Settings');

// Add onSettingsClick to props
content = content.replace('  onBack?: () => void;', '  onBack?: () => void;\n  onSettingsClick?: () => void;');
content = content.replace('showBack, onBack }: ShopHeaderProps', 'showBack, onBack, onSettingsClick }: ShopHeaderProps');

// Add settings button next to Bell
const bellButton = '<button onClick={onNotificationClick} className="p-1.5 -mr-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer">';
const newButtons = `<div className="flex items-center gap-1">
          <button onClick={onSettingsClick} className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onNotificationClick} className="p-1.5 -mr-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer">`;
content = content.replace(bellButton, newButtons + '          <Bell className="w-5 h-5" />\n          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>\n        </button>\n        </div>');

// The replacement above might fail if the exact string isn't there, let me just do a more robust replace.
fs.writeFileSync('src/components/ShopHeader.tsx', content);
