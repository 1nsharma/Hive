import React, { useState } from 'react';
import { User, Phone, Mail, Bell, Shield, Download, Save, CheckCircle2, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  onShowToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  const { user, userPhone } = useAuth();
  const [fullName, setFullName] = useState('Amit Sharma');
  const [email, setEmail] = useState(user?.email || 'amit.sharma@petsjanu.com');
  const [phone, setPhone] = useState(userPhone || '+91 63937 41171');
  const [emergencyContact, setEmergencyContact] = useState('+91 98111 22233');
  const [city, setCity] = useState('Andheri West, Mumbai, Maharashtra');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Account settings & emergency contacts updated!");
  };

  const handleDownloadInvoice = (invId: string) => {
    onShowToast(`Downloading Tax Invoice ${invId} (GST 18% included)...`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-[#1C2B23]">
      
      {/* Header */}
      <div className="space-y-1 border-b border-[#E5DFD3] pb-4">
        <h1 className="text-3xl font-serif font-black text-[#1C2B23]">Account &amp; Safety Settings</h1>
        <p className="text-xs text-stone-600">Manage your phone number (+91), emergency contacts, notifications, and tax invoices.</p>
      </div>

      {/* Form Grid */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Personal Details */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
            <User className="w-5 h-5 text-[#175741]" /> Parent Profile Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Primary Mobile Number (+91 SMS)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Backup Emergency Contact (+91)</label>
              <input
                type="tel"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">City / Address Area</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#175741]"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#175741]" /> Safety &amp; Tag Scan Notification Channels
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <span className="font-bold text-stone-900 block">WhatsApp Sighting &amp; Scan Alerts</span>
                <span className="text-[10px] text-stone-500">Receive instant WhatsApp message when someone scans your pet's tag</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#175741] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <span className="font-bold text-stone-900 block">SMS Emergency Backups</span>
                <span className="text-[10px] text-stone-500">Receive immediate SMS alert if WhatsApp is unreachable</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#175741] cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-[#175741] text-white font-extrabold text-xs hover:bg-[#175741]/90 shadow-xs cursor-pointer flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Account Settings
        </button>

      </form>

      {/* Tax Invoices & Razorpay Billing */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#175741]" /> Tax Invoices &amp; Razorpay Payments
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-900 block">NFC Smart Collar Tag (INV-2026-0812)</span>
              <span className="text-[10px] text-stone-500">Amount: ₹499 (18% GST Included) · Razorpay ID: pay_NFC10293</span>
            </div>
            <button
              onClick={() => handleDownloadInvoice('INV-2026-0812')}
              className="px-3 py-1.5 rounded-lg bg-[#175741] text-white font-bold text-[10px] hover:bg-[#175741]/90 cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> PDF Invoice
            </button>
          </div>

          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-stone-900 block">PetJanu Care Consultation (INV-2026-0801)</span>
              <span className="text-[10px] text-stone-500">Amount: ₹500 (18% GST Included) · Razorpay ID: pay_VET8823</span>
            </div>
            <button
              onClick={() => handleDownloadInvoice('INV-2026-0801')}
              className="px-3 py-1.5 rounded-lg bg-[#175741] text-white font-bold text-[10px] hover:bg-[#175741]/90 cursor-pointer flex items-center gap-1"
            >
              <Download className="w-3 h-3" /> PDF Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Internal Agentic AI & MCP Systems (Private System) */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5DFD3] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#1C2B23] flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#175741]" /> Internal Agentic AI &amp; MCP Engine
          </h3>
          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
            INTERNAL ONLY · SECURED
          </span>
        </div>
        <p className="text-xs text-stone-600">
          Autonomous Agentic AI swarm, Web MCP tools, and clinical AI reasoning loop operating under internal process isolation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-800 block">Internal Agent RPC Endpoint</span>
            <code className="text-[11px] font-mono text-[#175741] block break-all">/api/v1/mcp/rpc</code>
            <p className="text-[10px] text-stone-500">Autonomous loop, LATS agent planner, &amp; clinical AI triage.</p>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="font-bold text-stone-800 block">Agent Security Scope</span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold block">Internal Token / Loopback Guarded</span>
            <p className="text-[10px] text-stone-500">Isolated execution sandbox &amp; RBAC protection.</p>
          </div>
        </div>
      </div>


    </div>
  );
};
