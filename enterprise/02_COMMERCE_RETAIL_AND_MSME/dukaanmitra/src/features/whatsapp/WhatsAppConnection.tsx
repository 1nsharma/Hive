import { ArrowLeft, MessageCircle, Info, QrCode, RefreshCcw, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils";

interface WhatsAppConnectionProps {
  onBack: () => void;
  token?: string; // Optional auth token if needed for API
}

export default function WhatsAppConnection({ onBack, token }: WhatsAppConnectionProps) {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetchWithAuth("/api/whatsapp/status");
      if (res.ok) {
        const data = await res.json();
        setConnected(data.connected);
        if (data.qr) {
           setQrCode(data.qr);
        } else if (!data.connected) {
           // If we're polling and neither connected nor have QR, we're still initializing
        }
        
        // If we got a QR code or connected, stop the connecting state
        if (data.qr || data.connected) {
          setConnecting(false);
        }
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp status", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll for status every 3 seconds if not connected
    const interval = setInterval(() => {
      if (!connected) {
        fetchStatus();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [connected, token]);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const res = await fetchWithAuth("/api/whatsapp/connect", { 
        method: "POST"
      });
      if (!res.ok) {
        throw new Error("Failed to start connection");
      }
      // Status polling will pick up the QR code soon
    } catch (err: any) {
      setError(err.message || "Failed to connect");
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetchWithAuth("/api/whatsapp/disconnect", { 
        method: "POST"
      });
      setConnected(false);
      setQrCode(null);
    } catch (err) {
      console.error("Failed to disconnect", err);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-900 rounded-full hover:bg-gray-50 cursor-pointer">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-900 ml-2">WhatsApp Connection</h1>
      </div>

      <div className="flex flex-col items-center px-6 pt-10 pb-6 text-center">
        {connected ? (
          <>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Connected!</h2>
            <p className="text-gray-500 text-sm mb-10 max-w-[260px]">
              Your shop is now linked. You can send bills and reminders directly to your customers.
            </p>
            
            <button 
              onClick={handleDisconnect}
              className="w-full py-3.5 font-bold rounded-xl transition-colors shadow-sm bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 cursor-pointer"
            >
              Disconnect WhatsApp
            </button>
          </>
        ) : qrCode ? (
          <>
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8 text-[#25D366]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h2>
            <p className="text-gray-500 text-xs mb-6 max-w-[280px]">
              Open WhatsApp on your phone, go to Linked Devices, and scan this QR code to connect your shop.
            </p>
            
            <div className="bg-white p-3 border-2 border-dashed border-emerald-200 rounded-2xl mb-6 shadow-sm">
              <img src={qrCode} alt="WhatsApp QR Code" className="w-48 h-48 mx-auto" />
            </div>
            
            <button 
              onClick={fetchStatus}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCcw className="w-4 h-4" /> Refresh QR Code
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-[#25D366] fill-[#25D366]" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Link your WhatsApp</h2>
            <p className="text-gray-500 text-sm mb-10 max-w-[260px]">
              Connect your shop's WhatsApp number to automate bills and payment reminders directly to customers.
            </p>

            {error && (
              <div className="mb-4 text-xs text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 w-full text-left">
                {error}
              </div>
            )}

            <button 
              onClick={handleConnect}
              disabled={connecting}
              className={`w-full py-3.5 font-bold rounded-xl transition-colors shadow-md flex items-center justify-center ${
                connecting ? "bg-gray-100 text-gray-500" : "bg-[#25D366] text-white hover:bg-[#20bd5a] cursor-pointer"
              }`}
            >
              {connecting ? "Initializing..." : "Generate QR Code"}
            </button>

            <button className="mt-6 flex items-center gap-1.5 text-xs text-gray-500 font-medium hover:text-gray-700 transition-colors cursor-pointer">
              How it works? <Info className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
