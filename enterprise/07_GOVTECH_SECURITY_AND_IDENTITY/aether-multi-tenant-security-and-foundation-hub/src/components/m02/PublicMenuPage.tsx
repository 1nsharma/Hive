import React, { useState, useEffect } from 'react';
import { Shop, MenuItem, MenuAddOn, OrderMode } from '../../types/database';
import { useCartStore } from '../../store/cartStore';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  Utensils, 
  Search, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  X, 
  Info,
  ChevronRight,
  Store,
  Sparkles
} from 'lucide-react';

interface PublicMenuPageProps {
  shopSlug: string;
  onNavigateToTracking: (orderId: string) => void;
  onBackToApp?: () => void;
}

export const PublicMenuPage: React.FC<PublicMenuPageProps> = ({
  shopSlug,
  onNavigateToTracking,
  onBackToApp,
}) => {
  const [shop, setShop] = useState<Shop | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  
  // Customization modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<MenuAddOn[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Cart drawer state
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Zustand cart store
  const { 
    items: cartItems, 
    mode, 
    tableNumber, 
    customerName, 
    customerPhone,
    setShopId,
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart,
    setMode, 
    setTableNumber, 
    setCustomerName, 
    setCustomerPhone,
    getTotalCount, 
    getTotalAmountCents 
  } = useCartStore();

  // Load menu from Cloud SQL DB
  useEffect(() => {
    async function loadMenu() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/public/shop/${shopSlug}/menu`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error('Failed to load menu');

        const data = await res.json();
        setShop(data.shop);
        setMenuItems(data.items);
        setCategories(data.categories);
        setShopId(data.shop.id);
      } catch (err) {
        console.error('Menu load error:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (shopSlug) {
      loadMenu();
    }
  }, [shopSlug, setShopId]);

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (vegOnly && !item.is_veg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  // Handle opening add-on modal or direct add
  const handleItemAddClick = (item: MenuItem) => {
    if (!item.is_available) return;
    if (item.add_ons && item.add_ons.length > 0) {
      setCustomizingItem(item);
      setSelectedAddOns([]);
      setSpecialNotes('');
    } else {
      addItem(item, [], '');
    }
  };

  const handleConfirmCustomization = () => {
    if (!customizingItem) return;
    addItem(customizingItem, selectedAddOns, specialNotes);
    setCustomizingItem(null);
  };

  const toggleAddOn = (addon: MenuAddOn) => {
    if (selectedAddOns.some(a => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Place order handler
  const handlePlaceOrder = async () => {
    setErrorMessage(null);
    if (!shop) return;
    if (cartItems.length === 0) {
      setErrorMessage('Please add items to cart before ordering.');
      return;
    }

    // Validation for order mode (ORD-05)
    if (mode === 'DINE_IN' && (!tableNumber || !tableNumber.trim())) {
      setErrorMessage('Please enter your Table Number for Dine-In.');
      return;
    }

    if (mode === 'PARCEL' && (!customerName || !customerName.trim())) {
      setErrorMessage('Please enter your Name for Takeaway / Parcel.');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = {
        shopId: shop.id,
        mode,
        tableNumber: mode === 'DINE_IN' ? tableNumber.trim() : undefined,
        customerName: mode === 'PARCEL' ? customerName.trim() : undefined,
        customerPhone: customerPhone ? customerPhone.trim() : undefined,
        items: cartItems.map(c => ({
          item_id: c.item.id,
          name: c.item.name,
          price_cents: c.item.price_cents,
          quantity: c.quantity,
          selected_add_ons: c.selectedAddOns,
          notes: c.notes || undefined,
        })),
        paymentMethod: 'UPI_QR',
      };

      const res = await fetch('/api/public/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      // Clear cart
      clearCart();
      setIsCartOpen(false);

      // Navigate to live tracking /o/[order_id]
      onNavigateToTracking(data.order_id);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error creating order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // 404 View
  if (notFound) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-zinc-100 mb-2">404: Storefront Not Found</h1>
        <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
          The shop slug <code className="text-zinc-200 font-mono">/s/{shopSlug}</code> does not match any active Cloud SQL tenant. Please check the QR code or URL.
        </p>
        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors font-medium"
          >
            ← Back to Merchant Control Hub
          </button>
        )}
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-xs font-mono text-zinc-400">Loading Cloud SQL Menu for /s/{shopSlug}...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans pb-28">
      {/* Top Banner / Store Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {shop?.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-zinc-100 tracking-tight">
                  {shop?.name}
                </h1>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Open for Orders</span>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                <span>QR Table Menu</span>
                <span>·</span>
                <span className="font-mono text-zinc-500">/s/{shop?.slug}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors flex items-center justify-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {getTotalCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-indigo-500 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {getTotalCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto px-4 pb-3 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Search food, coffee, bowls, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none w-full text-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-zinc-500 hover:text-zinc-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0 ${
                vegOnly
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs pt-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
                selectedCategory === 'All'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap text-xs ${
                  selectedCategory === cat
                    ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Menu Feed */}
      <main className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6">
        {filteredItems.length === 0 ? (
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-8 text-center">
            <Utensils className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-300">No dishes match your filters</h3>
            <p className="text-xs text-zinc-500 mt-1">Try resetting the category or search query.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setVegOnly(false); setSearchQuery(''); }}
              className="mt-4 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`bg-zinc-900/60 border rounded-xl overflow-hidden transition-all flex flex-col justify-between ${
                  item.is_available
                    ? 'border-zinc-800 hover:border-zinc-700'
                    : 'border-zinc-800/40 opacity-70 bg-zinc-950/40'
                }`}
              >
                {/* Image and Badges */}
                <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={item.photo_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Category & Veg indicator */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="bg-zinc-950/80 backdrop-blur border border-zinc-700/60 px-2 py-0.5 rounded text-[10px] font-medium text-zinc-300">
                      {item.category}
                    </span>
                    <span
                      title={item.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
                      className={`h-4 w-4 rounded border flex items-center justify-center bg-zinc-950/80 ${
                        item.is_veg
                          ? 'border-emerald-500 text-emerald-400'
                          : 'border-rose-500 text-rose-400'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${item.is_veg ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    </span>
                  </div>

                  {!item.is_available && (
                    <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 border border-rose-800/60 px-3 py-1 rounded">
                        Sold Out
                      </span>
                    </div>
                  )}

                  {/* Cloud Storage provenance */}
                  <div className="absolute bottom-1.5 right-2 text-[9px] font-mono text-zinc-400 bg-zinc-950/80 px-1.5 py-0.5 rounded">
                    Cloud Storage
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-zinc-100 font-mono">
                        ${(item.price_cents / 100).toFixed(2)}
                      </span>
                      {item.add_ons && item.add_ons.length > 0 && (
                        <div className="text-[10px] text-zinc-500">
                          {item.add_ons.length} add-on options
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleItemAddClick(item)}
                      disabled={!item.is_available}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        item.is_available
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{item.add_ons && item.add_ons.length > 0 ? 'Customize' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {getTotalCount() > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-0 z-40 max-w-lg mx-auto px-4 animate-in slide-in-from-bottom duration-200">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl p-3.5 shadow-xl flex items-center justify-between transition-transform active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="h-7 w-7 rounded-lg bg-indigo-700/80 font-mono text-xs font-bold flex items-center justify-center">
                {getTotalCount()}
              </span>
              <div className="text-left">
                <div className="text-xs font-semibold">View Order Items</div>
                <div className="text-[11px] text-indigo-200">Mode: {mode}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono">
                ${(getTotalAmountCents() / 100).toFixed(2)}
              </span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      {/* Add-ons Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-5 text-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">{customizingItem.name}</h3>
                <div className="text-xs text-indigo-400 font-mono mt-0.5">
                  Base: ${(customizingItem.price_cents / 100).toFixed(2)}
                </div>
              </div>
              <button onClick={() => setCustomizingItem(null)} className="text-zinc-400 hover:text-zinc-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Add-ons List */}
            {customizingItem.add_ons && customizingItem.add_ons.length > 0 && (
              <div className="space-y-2">
                <label className="block text-zinc-300 font-semibold">Optional Add-ons & Boosts</label>
                <div className="space-y-1.5">
                  {customizingItem.add_ons.map((addon) => {
                    const isSelected = selectedAddOns.some(a => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        type="button"
                        onClick={() => toggleAddOn(addon)}
                        className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-zinc-800 border-indigo-500/80 text-zinc-100'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-zinc-700'
                          }`}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-mono text-zinc-400">
                          +${(addon.price_cents / 100).toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Kitchen Preparation Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Less ice, no onions, extra crispy..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            {/* Total and Add to Cart */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-zinc-500 text-[11px]">Item Total:</span>
                <div className="text-sm font-bold text-zinc-100 font-mono">
                  ${(
                    (customizingItem.price_cents +
                      selectedAddOns.reduce((s, a) => s + a.price_cents, 0)) /
                    100
                  ).toFixed(2)}
                </div>
              </div>

              <button
                onClick={handleConfirmCustomization}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Drawer / Sheet */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-2xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 text-xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-zinc-100">Review Your Order ({shop?.name})</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-zinc-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Order Mode Selector (ORD-05) */}
              <div className="mt-4 p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                <div>
                  <span className="font-semibold text-zinc-200 block mb-1">
                    Order Mode (ORD-05)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['TOKEN', 'DINE_IN', 'PARCEL'] as OrderMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`py-2 px-2 rounded-lg text-center font-medium text-xs transition-colors border ${
                          mode === m
                            ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {m === 'TOKEN' ? 'Token (Counter)' : m === 'DINE_IN' ? 'Dine In' : 'Takeaway'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode-specific Required Inputs */}
                {mode === 'DINE_IN' && (
                  <div className="pt-1">
                    <label className="block text-zinc-400 mb-1">
                      Table Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4 or Bar 2"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {mode === 'PARCEL' && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="block text-zinc-400 mb-1">
                        Your Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Elena Rostova"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 555-0192"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {mode === 'TOKEN' && (
                  <div className="text-[11px] text-zinc-400 leading-relaxed">
                    Default quick-service mode: Generates a unique kitchen queue token (<span className="text-indigo-400 font-mono font-medium">K-XX</span>) for pickup at the counter.
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((cartItem) => (
                  <div
                    key={cartItem.cartItemId}
                    className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-200">{cartItem.item.name}</div>
                      {cartItem.selectedAddOns.length > 0 && (
                        <div className="text-[10px] text-zinc-500">
                          {cartItem.selectedAddOns.map(a => `+ ${a.name}`).join(', ')}
                        </div>
                      )}
                      {cartItem.notes && (
                        <div className="text-[10px] text-indigo-400 font-mono">
                          "{cartItem.notes}"
                        </div>
                      )}
                      <div className="font-mono text-xs text-zinc-400 mt-1">
                        ${(cartItem.itemTotalCents / 100).toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                        className="h-6 w-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono font-bold text-zinc-200 min-w-4 text-center">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                        className="h-6 w-6 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(cartItem.cartItemId)}
                        className="text-zinc-500 hover:text-rose-400 ml-1 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mt-3 p-2.5 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Notice */}
              <div className="mt-3 p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Payment Status (Cloud SQL):</span>
                <span className="font-mono text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  PENDING (M02)
                </span>
              </div>
            </div>

            {/* Bottom Place Order Button */}
            <div className="mt-4 pt-3 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Due:</span>
                <span className="text-base font-bold font-mono text-zinc-100">
                  ${(getTotalAmountCents() / 100).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <span>Generating Kitchen Token & Creating Order...</span>
                ) : (
                  <>
                    <span>Place Order & Generate Token</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
