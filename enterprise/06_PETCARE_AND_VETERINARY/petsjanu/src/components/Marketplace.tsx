import React, { useState } from 'react';
import { Search, Filter, ShoppingBag, Star, Plus, Minus, X, Check, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { Product, CartItem } from '../types';
import { RazorpayCheckoutModal } from './RazorpayCheckoutModal';

interface MarketplaceProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onOpenCart: () => void;
  isCartOpen: boolean;
  onCloseCart: () => void;
  onCheckout: (address: string, phone: string, paymentId?: string, customOrderId?: string) => void;
  userPhone?: string;
  userName?: string;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  isCartOpen,
  onCloseCart,
  onCheckout,
  userPhone,
  userName,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);

  const categories = ['All', 'Safety & Tags', 'Food & Care', 'Accessories', 'Toys & Health'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleRazorpaySuccess = (orderData: {
    orderId: string;
    paymentId: string;
    address: string;
    phone: string;
    items: CartItem[];
    total: number;
  }) => {
    onCheckout(orderData.address, orderData.phone, orderData.paymentId, orderData.orderId);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header Banner */}
      <div id="tour-marketplace-header" className="p-6 md:p-8 rounded-3xl border bg-gradient-to-r from-[#175741] to-[#0E3D2F] text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-400 text-stone-900 rounded-md inline-block">
            PETGUARDIAN ESSENTIALS
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Curated Safety & Wellness Marketplace
          </h2>
          <p className="text-xs text-stone-200 leading-relaxed">
            Smart QR NFC tags, real-time GPS trackers, organic grain-free nutrition, and vet-approved wellness gear for your beloved companions.
          </p>
        </div>
        <div className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
          🛍️
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div id="tour-marketplace-categories" className="p-4 rounded-2xl border bg-[#FDFBF7] space-y-3 shadow-xs" style={{ borderColor: '#E5DFD3' }}>
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tags, food, toys, beds, grooming tools..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
            style={{ borderColor: '#E5DFD3' }}
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#175741] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid (8 Items) */}
      <div id="tour-marketplace-product-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group rounded-2xl border bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            style={{ borderColor: '#E5DFD3' }}
          >
            {/* Product Image */}
            <div className="relative h-44 bg-stone-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 bg-[#F0A21E] text-stone-900 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => setSelectedProduct(product)}
                className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border shadow-xs hover:bg-white cursor-pointer"
                style={{ borderColor: '#E5DFD3' }}
              >
                Quick View
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase">
                  <span>{product.category}</span>
                  <span className="flex items-center gap-0.5 text-amber-600 font-extrabold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating} ({product.reviewsCount})
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-[#175741] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Add Button */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#F0EBE1' }}>
                <div>
                  <span className="text-base font-black text-[#0E3D2F]">{product.priceFormatted}</span>
                  <span className="block text-[9px] text-emerald-700 font-semibold">Free Delivery</span>
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs text-white flex items-center gap-1 shadow-xs transition-all hover:opacity-95 cursor-pointer"
                  style={{ backgroundColor: '#175741' }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FDFBF7] rounded-3xl border shadow-2xl overflow-hidden p-6 relative space-y-4" style={{ borderColor: '#E5DFD3' }}>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-white p-1.5 rounded-full shadow-md text-stone-500 hover:text-stone-800 cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-56 rounded-2xl overflow-hidden border" style={{ borderColor: '#E5DFD3' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {selectedProduct.category}
              </span>
              <h3 className="text-xl font-extrabold text-stone-900">{selectedProduct.name}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="space-y-1.5 bg-white p-3 rounded-xl border" style={{ borderColor: '#E5DFD3' }}>
              <span className="text-[10px] font-bold uppercase text-stone-500">Key Features:</span>
              <ul className="text-xs space-y-1 text-stone-700">
                {selectedProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#E5DFD3' }}>
              <span className="text-xl font-black text-[#0E3D2F]">{selectedProduct.priceFormatted}</span>
              <button
                onClick={() => {
                  onAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center gap-2"
                style={{ backgroundColor: '#175741' }}
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOPPING CART SLIDE-OVER DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: '#E5DFD3' }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#175741]" />
                <h3 className="text-lg font-extrabold text-stone-900">Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
              </div>
              <button onClick={onCloseCart} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-4xl">🛒</span>
                <p className="text-xs font-semibold text-stone-500">Your shopping cart is currently empty.</p>
                <button
                  onClick={onCloseCart}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: '#175741' }}
                >
                  Explore Marketplace Products
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-white rounded-2xl border flex items-center gap-3 shadow-xs"
                      style={{ borderColor: '#E5DFD3' }}
                    >
                      <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-xl border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-stone-900 truncate">{item.product.name}</h4>
                        <div className="text-xs font-black text-[#0E3D2F] mt-0.5">{item.product.priceFormatted}</div>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        <button
                          onClick={() => onUpdateCartQty(item.product.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white border text-stone-700 font-extrabold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold px-1.5 text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQty(item.product.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white border text-stone-700 font-extrabold flex items-center justify-center text-xs hover:bg-stone-50 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer rounded-lg hover:bg-rose-50"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary Footer */}
                <div className="pt-3 border-t space-y-3" style={{ borderColor: '#E5DFD3' }}>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Subtotal</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Express Shipping</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t" style={{ borderColor: '#E5DFD3' }}>
                      <span>Total Amount</span>
                      <span>₹{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onCloseCart();
                      setIsRazorpayModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 hover:opacity-95"
                    style={{ backgroundColor: '#175741' }}
                  >
                    Proceed to Razorpay Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* RAZORPAY CHECKOUT MODAL */}
      <RazorpayCheckoutModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        userPhone={userPhone}
        userName={userName}
        onSuccess={handleRazorpaySuccess}
      />


    </div>
  );
};
