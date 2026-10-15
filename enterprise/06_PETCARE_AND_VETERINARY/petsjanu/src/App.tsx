import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';
import { PetProfileModal } from './components/PetProfileModal';
import { Marketplace } from './components/Marketplace';
import { ServicesBooking } from './components/ServicesBooking';
import { PublicPetPage } from './components/PublicPetPage';
import LandingPage from './components/LandingPage';
import { Footer } from './components/Footer';
import { EconomyTourModal } from './components/EconomyTourModal';
import { FloatingTourWidget } from './components/FloatingTourWidget';
import { useAuth } from './context/AuthContext';

// Lazy-loaded secondary views for optimized production bundle splitting
const HowItWorksView = lazy(() => import('./components/HowItWorksView').then(m => ({ default: m.HowItWorksView })));
const SafetyView = lazy(() => import('./components/SafetyView').then(m => ({ default: m.SafetyView })));
const HealthView = lazy(() => import('./components/HealthView').then(m => ({ default: m.HealthView })));
const PricingView = lazy(() => import('./components/PricingView').then(m => ({ default: m.PricingView })));
const BlogView = lazy(() => import('./components/BlogView').then(m => ({ default: m.BlogView })));
const AboutView = lazy(() => import('./components/AboutView').then(m => ({ default: m.AboutView })));
const SettingsView = lazy(() => import('./components/SettingsView').then(m => ({ default: m.SettingsView })));
const OrdersBookings = lazy(() => import('./components/OrdersBookings').then(m => ({ default: m.OrdersBookings })));
const AIChatAssistant = lazy(() => import('./components/AIChatAssistant').then(m => ({ default: m.AIChatAssistant })));
const SecurityView = lazy(() => import('./components/SecurityView').then(m => ({ default: m.SecurityView })));
const PrivacyView = lazy(() => import('./components/PrivacyView').then(m => ({ default: m.PrivacyView })));
const TransparencyView = lazy(() => import('./components/TransparencyView').then(m => ({ default: m.TransparencyView })));
const FeedbackView = lazy(() => import('./components/FeedbackView').then(m => ({ default: m.FeedbackView })));
const MCPConsole = lazy(() => import('./components/MCPConsole').then(m => ({ default: m.MCPConsole })));

function ViewLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-3 text-[#175741]">
      <div className="w-8 h-8 border-3 border-[#175741] border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-bold tracking-wide">Loading PetJanu...</span>
    </div>
  );
}
import {
  fetchPetsFromDb,
  savePetToDb,
  updatePetLostStatusInDb,
  fetchProductsFromDb,
  fetchServicesFromDb,
  fetchOrdersFromDb,
  createOrderInDb,
  fetchBookingsFromDb,
  createBookingInDb,
  fetchSightingsFromDb,
  createSightingInDb
} from './lib/dbService';
import { SEEDED_PETS, SEEDED_PRODUCTS, SEEDED_SERVICES, SEEDED_ORDERS, SEEDED_BOOKINGS, SEEDED_SIGHTINGS } from './lib/mockData';
import { Pet, Product, CartItem, Service, Order, ServiceBooking, SightingReport } from './types';
import { Shield, Plus, AlertTriangle, Check, Phone, MessageSquare, QrCode, Sparkles, ShoppingBag, Calendar, Heart } from 'lucide-react';

export default function App() {
  const { user, isLoggedIn, userPhone, signOut } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Guided Economy Tour Modal State
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [waitlistPhone, setWaitlistPhone] = useState<string>('+91 63937 41171');

  // Pet Profiles State
  const [pets, setPets] = useState<Pet[]>(SEEDED_PETS);
  const [activePetId, setActivePetId] = useState<string>('pet-1');
  const [isPetModalOpen, setIsPetModalOpen] = useState<boolean>(false);

  // Marketplace & Cart State
  const [products, setProducts] = useState<Product[]>(SEEDED_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: SEEDED_PRODUCTS[0], quantity: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Services & History State
  const [services, setServices] = useState<Service[]>(SEEDED_SERVICES);
  const [orders, setOrders] = useState<Order[]>(SEEDED_ORDERS);
  const [bookings, setBookings] = useState<ServiceBooking[]>(SEEDED_BOOKINGS);

  // Sightings State
  const [sightings, setSightings] = useState<SightingReport[]>(SEEDED_SIGHTINGS);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch initial data from DB / Local Storage
  useEffect(() => {
    async function loadData() {
      const [fetchedPets, fetchedProds, fetchedServs, fetchedOrds, fetchedBkgs, fetchedSights] = await Promise.all([
        fetchPetsFromDb(user?.id),
        fetchProductsFromDb(),
        fetchServicesFromDb(),
        fetchOrdersFromDb(user?.id),
        fetchBookingsFromDb(user?.id),
        fetchSightingsFromDb()
      ]);

      if (fetchedPets && fetchedPets.length > 0) {
        setPets(fetchedPets);
        setActivePetId(fetchedPets[0].id);
      }
      if (fetchedProds && fetchedProds.length > 0) setProducts(fetchedProds);
      if (fetchedServs && fetchedServs.length > 0) setServices(fetchedServs);
      if (fetchedOrds) setOrders(fetchedOrds);
      if (fetchedBkgs) setBookings(fetchedBkgs);
      if (fetchedSights) setSightings(fetchedSights);
    }

    loadData();
  }, [user]);

  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // Auto-Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to shopping cart`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = async (address: string, phone: string, paymentId?: string, customOrderId?: string) => {
    const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: customOrderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      petName: activePet?.name || 'Pet',
      items: cart.map((i) => ({
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.priceFormatted
      })),
      totalPrice: `₹${totalAmount.toLocaleString()}`,
      shippingAddress: address,
      phone,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Paid',
      paymentId: paymentId || `pay_${Math.random().toString(36).substring(2, 10)}`
    };

    const saved = await createOrderInDb(newOrder, user?.id);
    setOrders((prev) => [saved, ...prev]);
    setCart([]);
    showToast(`Order ${saved.id} placed successfully via Razorpay!`);
    setActiveTab('history');
  };

  // Service Booking Handler
  const handleBookService = async (bookingData: any) => {
    const newBooking: ServiceBooking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: bookingData.serviceId,
      serviceName: bookingData.serviceName,
      petId: bookingData.petId,
      petName: bookingData.petName,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      address: bookingData.address,
      notes: bookingData.notes,
      priceFormatted: bookingData.priceFormatted,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const saved = await createBookingInDb(newBooking, user?.id);
    setBookings((prev) => [saved, ...prev]);
    showToast(`Service appointment ${saved.id} confirmed!`);
  };

  // Pet Profile Save Handler
  const handleSavePet = async (newPetData: Omit<Pet, 'id' | 'slug' | 'vaccinations'>) => {
    const createdPet = await savePetToDb(newPetData, user?.id);
    setPets((prev) => [createdPet, ...prev]);
    setActivePetId(createdPet.id);
    showToast(`Digital profile & QR tag generated for ${createdPet.name}!`);
  };

  // Toggle Lost Status
  const handleToggleLostStatus = async () => {
    if (!activePet) return;
    const nextLost = !activePet.isLost;
    await updatePetLostStatusInDb(activePet.id, nextLost);

    setPets((prev) =>
      prev.map((p) => (p.id === activePet.id ? { ...p, isLost: nextLost } : p))
    );

    showToast(nextLost ? `🚨 EMERGENCY LOST ALERT ENABLED FOR ${activePet.name.toUpperCase()}` : `✅ ${activePet.name} MARKED AS SAFE`);
  };

  // Sighting Handler
  const handleReportSighting = async (reportData: Omit<SightingReport, 'id' | 'petId' | 'petName' | 'status'>) => {
    if (!activePet) return;
    const newReport = await createSightingInDb({
      ...reportData,
      petId: activePet.id,
      petName: activePet.name
    });

    setSightings((prev) => [newReport, ...prev]);
    showToast(`Sighting report logged for ${activePet.name}!`);
  };


  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#FDFBF7', color: '#1D2321' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-stone-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-amber-400/50 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={async () => {
          await signOut();
          showToast('Signed out successfully');
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activePetName={activePet?.name}
        onOpenTourModal={() => setIsTourModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Suspense fallback={<ViewLoader />}>
        {/* LANDING PAGE / EXPLORE */}
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenPreorder={(type, price) => {
              setIsAuthModalOpen(true);
            }}
            setToast={showToast}
            waitlistPhone={waitlistPhone}
            setWaitlistPhone={setWaitlistPhone}
            waitlistPetName={activePet.name}
            setWaitlistPetName={() => {}}
            waitlistStatus="idle"
            handleJoinWaitlist={(e) => {
              e.preventDefault();
              showToast('Thank you for joining the PetGuardian waitlist!');
            }}
            onOpenTourModal={() => setIsTourModalOpen(true)}
          />
        )}

        {/* OWNER DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 pb-20">
            
            {/* Active Pet Selector Bar */}
            <div className="p-4 rounded-3xl border bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: '#E5DFD3' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl font-black shrink-0 border border-amber-200">
                  {activePet.species === 'Cat' ? '🐱' : '🐶'}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Active Pet Profile:</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={activePetId}
                      onChange={(e) => setActivePetId(e.target.value)}
                      className="font-black text-lg text-[#0E3D2F] bg-transparent outline-none cursor-pointer"
                    >
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.breed})
                        </option>
                      ))}
                    </select>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      activePet.isLost ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {activePet.isLost ? '🚨 LOST SOS' : '✅ SAFE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsPetModalOpen(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border bg-stone-50 font-extrabold text-xs text-stone-800 hover:bg-stone-100 cursor-pointer flex items-center justify-center gap-1.5"
                  style={{ borderColor: '#E5DFD3' }}
                >
                  <Plus className="w-4 h-4 text-[#175741]" /> Add New Pet
                </button>

                <button
                  onClick={handleToggleLostStatus}
                  className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer ${
                    activePet.isLost ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {activePet.isLost ? 'Mark as SAFE ✅' : 'Report LOST 🚨'}
                </button>
              </div>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pet Identity & QR Tag */}
              <div className="p-6 rounded-3xl border bg-white shadow-xs space-y-4" style={{ borderColor: '#E5DFD3' }}>
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
                  <h3 className="font-extrabold text-base text-stone-900">Digital Identity & Tag</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    TAG: {activePet.slug}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img src={activePet.photoUrl} alt={activePet.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#175741]" />
                  <div className="space-y-1 text-xs text-stone-600">
                    <h4 className="font-extrabold text-base text-stone-900">{activePet.name}</h4>
                    <p>{activePet.breed} · {activePet.age}</p>
                    <p>Weight: <strong className="text-stone-800">{activePet.weight}</strong></p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border space-y-1.5 text-xs text-stone-700" style={{ borderColor: '#F0EBE1' }}>
                  <div className="flex justify-between"><span className="text-stone-400">Allergies:</span> <strong className="text-red-700 font-bold">{activePet.allergies}</strong></div>
                  <div className="flex justify-between"><span className="text-stone-400">Emergency Phone:</span> <strong className="text-stone-900 font-bold">{activePet.emergencyContact.phone}</strong></div>
                </div>

                <button
                  onClick={() => setActiveTab('publicScan')}
                  className="w-full py-2.5 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-95"
                  style={{ backgroundColor: '#175741' }}
                >
                  <QrCode className="w-4 h-4 text-amber-400" /> View Public Tag Scan Page
                </button>
              </div>

              {/* Vaccination & Deworming Timeline */}
              <div className="p-6 rounded-3xl border bg-white shadow-xs space-y-4 md:col-span-2" style={{ borderColor: '#E5DFD3' }}>
                <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: '#F0EBE1' }}>
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900">Health & Vaccination Schedule</h3>
                    <p className="text-xs text-stone-500">Automated reminder engine for {activePet.name}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    UP TO DATE
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activePet.vaccinations.map((vac) => (
                    <div
                      key={vac.id}
                      className="p-3 bg-stone-50 rounded-2xl border flex items-center justify-between text-xs font-semibold"
                      style={{ borderColor: '#F0EBE1' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${vac.done ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`}></span>
                        <div>
                          <span className="font-extrabold text-stone-900 block">{vac.name}</span>
                          <span className="text-[10px] text-stone-500">Scheduled Due Date: {vac.due}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        vac.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {vac.done ? '✓ Completed' : '🗓️ Due Soon'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Service CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('services')}
                    className="py-2.5 px-3 rounded-xl border bg-amber-50 text-amber-950 text-xs font-bold hover:bg-amber-100 cursor-pointer text-center"
                    style={{ borderColor: '#E5DFD3' }}
                  >
                    🩺 Book Tele-Vet Consultation
                  </button>

                  <button
                    onClick={() => setActiveTab('ai')}
                    className="py-2.5 px-3 rounded-xl border bg-emerald-50 text-emerald-950 text-xs font-bold hover:bg-emerald-100 cursor-pointer text-center"
                    style={{ borderColor: '#E5DFD3' }}
                  >
                    🤖 Ask AI Symptom Triage
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MARKETPLACE SHOP */}
        {activeTab === 'marketplace' && (
          <Marketplace
            products={products}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => setIsCartOpen(true)}
            isCartOpen={isCartOpen}
            onCloseCart={() => setIsCartOpen(false)}
            onCheckout={handleCheckout}
            userPhone={userPhone}
            userName={user?.email ? user.email.split('@')[0] : 'Pet Parent'}
          />
        )}

        {/* SERVICES BOOKING */}
        {activeTab === 'services' && (
          <ServicesBooking
            services={services}
            pets={pets}
            onBookService={handleBookService}
          />
        )}

        {/* HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <HowItWorksView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* PET SAFETY */}
        {activeTab === 'safety' && (
          <SafetyView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenPreorder={(type, price) => setIsAuthModalOpen(true)}
          />
        )}

        {/* HEALTH & CARE */}
        {activeTab === 'health' && (
          <HealthView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* PRICING */}
        {activeTab === 'pricing' && (
          <PricingView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenPreorder={(type, price) => setIsAuthModalOpen(true)}
          />
        )}

        {/* BLOG */}
        {activeTab === 'blog' && (
          <BlogView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* ABOUT */}
        {activeTab === 'about' && (
          <AboutView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <SecurityView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* PRIVACY */}
        {activeTab === 'privacy' && (
          <PrivacyView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onShowToast={showToast}
          />
        )}

        {/* TRANSPARENCY */}
        {activeTab === 'transparency' && (
          <TransparencyView
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {/* COMMUNITY FEEDBACK & ROADMAP */}
        {activeTab === 'feedback' && (
          <FeedbackView
            onShowToast={showToast}
          />
        )}

        {/* MODEL CONTEXT PROTOCOL (MCP) DEVELOPER & PUBLIC CONSOLE */}
        {activeTab === 'mcp' && (
          <MCPConsole
            onShowToast={showToast}
          />
        )}

        {/* ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsView
            onShowToast={showToast}
          />
        )}

        {/* AI CHAT ASSISTANT */}
        {activeTab === 'ai' && (
          <AIChatAssistant activePet={activePet} />
        )}

        {/* ORDERS & BOOKINGS HISTORY */}
        {activeTab === 'history' && (
          <OrdersBookings orders={orders} bookings={bookings} />
        )}

        {/* PUBLIC TAG SCAN PAGE */}
        {activeTab === 'publicScan' && (
          <PublicPetPage
            pet={activePet}
            sightings={sightings}
            onReportSighting={handleReportSighting}
            onToggleLostStatus={handleToggleLostStatus}
            isOwner={true}
          />
        )}
        </Suspense>
      </main>

      {/* Global PetJanu Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(phone) => {
          showToast('Authenticated successfully with SMS OTP');
        }}
      />

      {/* Pet Profile Modal */}
      <PetProfileModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        onSave={handleSavePet}
      />

      {/* Interactive Economy Guided Tour Modal */}
      <EconomyTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Floating Tour Launch Widget */}
      <FloatingTourWidget
        onOpenTourModal={() => setIsTourModalOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Mobile Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
      />

    </div>
  );
}
