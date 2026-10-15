import fs from 'fs';
let content = fs.readFileSync('src/components/ShopHeader.tsx', 'utf-8');

const correct = `      <div className="max-w-7xl mx-auto w-full px-3 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={onBack} className="p-1 -ml-1 text-gray-700 hover:bg-gray-50 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          )}
          <div className="flex items-center gap-0.5 font-extrabold text-xl tracking-tight">
            <span className="text-gray-900">Dukaan</span>
            <span className="text-emerald-600">Mitra</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onSettingsClick} className="p-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onNotificationClick} className="p-1.5 -mr-1.5 text-gray-700 hover:bg-gray-50 rounded-full transition-colors relative cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>
    </header>
  );
}`;

content = content.replace(/<div className="max-w-7xl mx-auto w-full px-3 h-12 flex items-center justify-between">.*}<\/header>/s, correct + '\n</header>');
fs.writeFileSync('src/components/ShopHeader.tsx', content);
