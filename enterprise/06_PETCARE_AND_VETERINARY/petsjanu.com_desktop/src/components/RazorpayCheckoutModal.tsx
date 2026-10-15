import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Building2, CheckCircle2, AlertTriangle, Copy, Check, ArrowRight, RefreshCw, Lock } from 'lucide-react';
import { CartItem } from '../types';

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  userPhone?: string;
  userName?: string;
  onSuccess: (orderData: {
    orderId: string;
    paymentId: string;
    address: string;
    phone: string;
    items: CartItem[];
    total: number;
  }) => void;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  cartTotal,
  userPhone = '+91 63937 41171',
  userName = 'Amit Sharma',
  onSuccess,
}) => {
  const [step, setStep] = useState<'address' | 'payment' | 'processing' | 'success' | 'failure'>('address');
  
  // Shipping Form State
  const [address, setAddress] = useState('402 Sunset Heights, Bandra West, Mumbai 400050');
  const [phone, setPhone] = useState(userPhone);
  const [name, setName] = useState(userName);
  const [pincode, setPincode] = useState('400050');
  const [city, setCity] = useState('Mumbai');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [testCardNumber, setTestCardNumber] = useState('4111 1111 1111 1111');
  const [testExp, setTestExp] = useState('12/28');
  const [testCvv, setTestCvv] = useState('123');
  const [testUpiId, setTestUpiId] = useState('success@razorpay');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Result details
  const [razorpayOrderId, setRazorpayOrderId] = useState<string>('');
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string>('');
  const [completedOrderNum, setCompletedOrderNum] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setStep('address');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Step 1: Proceed from Address to Payment Mode
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone || !name) return;
    setStep('payment');
  };

  // Execute Razorpay Payment
  const handlePayNow = async (forceSimulateFailure = false) => {
    setStep('processing');
    setErrorMessage('');

    try {
      // 1. Call Backend API to Create Razorpay Order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: name,
            customer_phone: phone,
            shipping_address: `${address}, ${city} ${pincode}`,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.message || 'Failed to initialize Razorpay order');
      }

      const rzpOrderId = orderData.id;
      setRazorpayOrderId(rzpOrderId);

      // Simulate payment network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (forceSimulateFailure) {
        setErrorMessage('Payment failed in Razorpay test mode (Simulated failure event: bank authorization declined).');
        setStep('failure');
        return;
      }

      // Generate payment ID & signature
      const paymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;
      const signature = `sig_test_${Math.random().toString(36).substring(2, 16)}`;
      const dbOrderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Call Backend API to Verify Payment & Dispatch Webhook
      const verifyRes = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: rzpOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          db_order_id: dbOrderNum,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.verified) {
        setRazorpayPaymentId(paymentId);
        setCompletedOrderNum(dbOrderNum);
        setStep('success');

        onSuccess({
          orderId: dbOrderNum,
          paymentId,
          address: `${address}, ${city} ${pincode}`,
          phone,
          items: cart,
          total: cartTotal,
        });
      } else {
        throw new Error(verifyData.message || 'Payment signature verification failed');
      }
    } catch (err: any) {
      console.error('Razorpay payment error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during payment processing');
      setStep('failure');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-[#FDFBF7] rounded-3xl border shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]"
        style={{ borderColor: '#E5DFD3' }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b flex items-center justify-between shrink-0" style={{ borderColor: '#E5DFD3' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-sm">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-stone-900">Razorpay Secure Checkout</h3>
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-stone-500">256-bit SSL Encrypted Payment Gateway</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: ADDRESS & CONTACT DETAILS */}
          {step === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-stone-700 font-semibold">Total Payable Amount</span>
                <span className="text-lg font-black text-stone-900">₹{cartTotal.toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Shipping & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                    Street Address & House/Flat No.
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                    style={{ borderColor: '#E5DFD3' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#175741]"
                      style={{ borderColor: '#E5DFD3' }}
                    />
                  </div>
                </div>
              </div>

              {/* Items Preview */}
              <div className="p-3 bg-white rounded-2xl border space-y-2" style={{ borderColor: '#E5DFD3' }}>
                <span className="text-[10px] font-bold uppercase text-stone-400">Order Summary ({cart.length} items)</span>
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {cart.map((i) => (
                    <div key={i.product.id} className="flex justify-between text-xs text-stone-700">
                      <span className="truncate pr-2">{i.quantity}x {i.product.name}</span>
                      <span className="font-bold shrink-0">{i.product.priceFormatted}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 hover:opacity-95"
                style={{ backgroundColor: '#175741' }}
              >
                Continue to Razorpay Payment <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: RAZORPAY TEST PAYMENT MODAL */}
          {step === 'payment' && (
            <div className="space-y-4">
              {/* Order total header */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900">Total Payable</span>
                  <p className="text-[10px] text-stone-500">Express Delivery Included</p>
                </div>
                <span className="text-xl font-black text-emerald-950">₹{cartTotal.toLocaleString()}</span>
              </div>

              {/* TEST CARDS & UPI REFERENCE BOX */}
              <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2.5 text-xs text-blue-900">
                <div className="flex items-center justify-between">
                  <span className="font-black flex items-center gap-1.5 text-blue-950">
                    <Lock className="w-3.5 h-3.5 text-blue-700" /> Razorpay Merchant & Test Credentials
                  </span>
                  <span className="text-[9px] bg-blue-200/80 px-2 py-0.5 rounded font-extrabold text-blue-900">
                    KEY: rzp_test_123456...
                  </span>
                </div>

                {/* Official Razorpay.me Handle */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-2.5 rounded-xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-200 block">
                      Direct Merchant Payment Link
                    </span>
                    <a
                      href="https://razorpay.me/@amitsharma9693"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono font-black text-amber-300 text-xs hover:underline flex items-center gap-1"
                    >
                      razorpay.me/@amitsharma9693
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => copyToClipboard('https://razorpay.me/@amitsharma9693', 'meLink')}
                      className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'meLink' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'meLink' ? 'Copied' : 'Copy'}
                    </button>
                    <a
                      href="https://razorpay.me/@amitsharma9693"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-[10px] font-extrabold cursor-pointer"
                    >
                      Pay Directly ↗
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-stone-500 block text-[9px] uppercase">Test Card Number</span>
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span>4111 1111 1111 1111</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('4111111111111111', 'card')}
                        className="text-blue-700 hover:text-blue-900 cursor-pointer p-0.5"
                      >
                        {copiedField === 'card' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[9px] text-stone-500">Exp: 12/28 | CVV: 123 | OTP: 123456</div>
                  </div>

                  <div className="bg-white/80 p-2 rounded-xl border border-blue-100 space-y-1">
                    <span className="font-bold text-stone-500 block text-[9px] uppercase">Test UPI ID</span>
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span>success@razorpay</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('success@razorpay', 'upi')}
                        className="text-blue-700 hover:text-blue-900 cursor-pointer p-0.5"
                      >
                        {copiedField === 'upi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-[9px] text-stone-500">Simulate Failure: failure@razorpay</div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Select Razorpay Payment Method
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#175741] text-white border-[#175741] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs font-extrabold">Debit / Credit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#175741] text-white border-[#175741] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="text-xs font-extrabold">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#175741] text-white border-[#175741] shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-extrabold">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Method Detail Input */}
              <div className="p-4 bg-white rounded-2xl border space-y-3" style={{ borderColor: '#E5DFD3' }}>
                {paymentMethod === 'card' && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 mb-1">Card Number (Test)</label>
                      <input
                        type="text"
                        value={testCardNumber}
                        onChange={(e) => setTestCardNumber(e.target.value)}
                        className="w-full p-2.5 rounded-xl border bg-stone-50 font-mono font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={testExp}
                          onChange={(e) => setTestExp(e.target.value)}
                          className="w-full p-2.5 rounded-xl border bg-stone-50 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 mb-1">CVV</label>
                        <input
                          type="password"
                          value={testCvv}
                          onChange={(e) => setTestCvv(e.target.value)}
                          className="w-full p-2.5 rounded-xl border bg-stone-50 font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-stone-500">Virtual Payment Address (VPA)</label>
                      <a
                        href="https://razorpay.me/@amitsharma9693"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-indigo-700 hover:underline flex items-center gap-1"
                      >
                        razorpay.me/@amitsharma9693 ↗
                      </a>
                    </div>
                    <input
                      type="text"
                      value={testUpiId}
                      onChange={(e) => setTestUpiId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border bg-stone-50 font-mono font-bold"
                      placeholder="e.g. success@razorpay"
                    />
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span>Supports Google Pay, PhonePe, Paytm, BHIM UPI.</span>
                      <button
                        type="button"
                        onClick={() => setTestUpiId('amitsharma9693@razorpay')}
                        className="text-indigo-800 font-bold hover:underline cursor-pointer"
                      >
                        Use @amitsharma9693
                      </button>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2 text-xs">
                    <label className="block text-[10px] font-bold text-stone-500 mb-1">Select Bank</label>
                    <select className="w-full p-2.5 rounded-xl border bg-stone-50 font-bold text-stone-800">
                      <option>HDFC Bank (Test)</option>
                      <option>ICICI Bank (Test)</option>
                      <option>State Bank of India (Test)</option>
                      <option>Axis Bank (Test)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handlePayNow(false)}
                  className="w-full py-3.5 rounded-xl font-extrabold text-xs text-white shadow-md cursor-pointer flex items-center justify-center gap-2 hover:opacity-95 transition-all"
                  style={{ backgroundColor: '#175741' }}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Complete Payment of ₹{cartTotal.toLocaleString()}
                </button>

                <button
                  type="button"
                  onClick={() => handlePayNow(true)}
                  className="w-full py-2 rounded-xl text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 cursor-pointer flex items-center justify-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Test Simulated Failure Event
                </button>

                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="w-full py-2 text-[11px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  ← Back to Shipping Address
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PROCESSING ANIMATION */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-amber-200 border-t-[#175741] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-stone-800 text-xs">
                  ₹
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-stone-900">Communicating with Razorpay Server...</h4>
                <p className="text-xs text-stone-500">Creating order token, verifying payment signature & webhook status</p>
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SUCCESS / ORDER CONFIRMATION */}
          {step === 'success' && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300 shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  PAYMENT CAPTURED
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900">Order Confirmed!</h3>
                <p className="text-xs text-stone-600">Your order has been placed successfully via Razorpay.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border text-left space-y-2 text-xs" style={{ borderColor: '#E5DFD3' }}>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: '#F0EBE1' }}>
                  <span className="text-stone-500 font-medium">Order Number:</span>
                  <span className="font-extrabold text-stone-900">{completedOrderNum}</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: '#F0EBE1' }}>
                  <span className="text-stone-500 font-medium">Razorpay Payment Ref:</span>
                  <span className="font-mono font-bold text-emerald-800">{razorpayPaymentId}</span>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: '#F0EBE1' }}>
                  <span className="text-stone-500 font-medium">Amount Paid:</span>
                  <span className="font-black text-stone-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-medium">Est. Delivery:</span>
                  <span className="font-bold text-stone-800">2-3 Business Days</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer hover:opacity-95"
                style={{ backgroundColor: '#175741' }}
              >
                View Order History & Tracking
              </button>
            </div>
          )}

          {/* STEP 5: PAYMENT FAILURE */}
          {step === 'failure' && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-300 shadow-xs">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                  PAYMENT FAILED
                </span>
                <h3 className="text-xl font-extrabold text-stone-900">Transaction Not Completed</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">{errorMessage || 'Razorpay payment was declined or cancelled.'}</p>
              </div>

              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 text-left space-y-1">
                <span className="font-bold block">Troubleshooting in Test Mode:</span>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-rose-800">
                  <li>Ensure using valid test card number: 4111 1111 1111 1111</li>
                  <li>Use test UPI ID: success@razorpay</li>
                  <li>Check browser console or local webhook logs</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex-1 py-3 rounded-xl font-extrabold text-xs text-white shadow-xs cursor-pointer hover:opacity-95 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: '#175741' }}
                >
                  <RefreshCw className="w-4 h-4" /> Retry Payment
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl font-bold text-xs text-stone-700 bg-stone-200 hover:bg-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
