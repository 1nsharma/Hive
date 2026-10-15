import { Search, ShoppingBag, Menu, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenRequest: () => void;
  cartCount: number;
}

export function Header({ onOpenRequest, cartCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-stone-900" />
            <span className="font-serif text-xl font-semibold tracking-tight text-stone-900">Obscura</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Artifacts</a>
          <a href="#" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Media</a>
          <a href="#" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Curiosities</a>
          <button 
            onClick={onOpenRequest}
            className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
          >
            Submit a Request
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-stone-600 hover:text-stone-900 transition-colors hidden sm:block">
            <Search className="h-5 w-5" />
          </button>
          <button className="group relative p-2 text-stone-600 hover:text-stone-900 transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-stone-900 text-[9px] font-medium text-white ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
