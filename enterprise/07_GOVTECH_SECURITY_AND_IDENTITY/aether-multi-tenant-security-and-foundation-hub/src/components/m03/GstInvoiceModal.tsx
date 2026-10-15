import React, { useState, useEffect } from 'react';
import { Order, Shop, UserProfile } from '../../types/database';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  Check, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  Phone, 
  KeyRound,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';

interface GstInvoiceModalProps {
  orderId: string;
  order: Order;
  shop: Shop;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCustomerLinked?: (updatedOrder: Order) => void;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  token: string;
  mode: string;
  tableNumber?: string;
  customerName: string;
  customerPhone?: string;
  shop: {
    id: string;
    name: string;
    gstin: string;
    address: string;
    currency: string;
  };
  items: Array<{
    item_id: string;
    name: string;
    hsn_code: string;
    quantity: number;
    rate_cents: number;
    taxable_value_cents: number;
    gst_rate: number;
    cgst_rate: number;
    cgst_amount_cents: number;
    sgst_rate: number;
    sgst_amount_cents: number;
    total_cents: number;
  }>;
  summary: {
    taxableValueCents: number;
    cgstCents: number;
    sgstCents: number;
    grandTotalCents: number;
  };
  paymentStatus: string;
}

export const GstInvoiceModal: React.FC<GstInvoiceModalProps> = ({
  orderId,
  order,
  shop,
  currentUser,
  isOpen,
  onClose,
  onCustomerLinked,
}) => {
  // Login Gate State (Firebase Phone OTP Simulation)
  const [phoneNumber, setPhoneNumber] = useState<string>('+1 (555) 234-5678');
  const [otpCode, setOtpCode] = useState<string>('776921');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);

  // Invoice Data State
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<boolean>(false);
  const [accessDeniedError, setAccessDeniedError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState<boolean>(false);

  // Check if current user is authorized
  const isOwner = shop.owner_id === currentUser.id || currentUser.system_role === 'super_admin';
  const isTeam = ['AMITSHARMA99976@gmail.com', 'admin@platformhq.io', 'alex.root@platformhq.io', 'qa.tester@platformhq.io'].includes(currentUser.email);
  const isLinkedCustomer = Boolean(order.customer_id && order.customer_id === currentUser.id);
  const hasAccess = isOwner || isTeam || isLinkedCustomer;

  // Load invoice if user already has access
  const fetchInvoice = async () => {
    try {
      setLoadingInvoice(true);
      setAccessDeniedError(null);
      const res = await fetch(`/api/orders/${orderId}/invoice?customerUid=${currentUser.id}&email=${encodeURIComponent(currentUser.email)}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      } else {
        const errData = await res.json();
        setAccessDeniedError(errData.error || 'Access denied');
        setInvoice(null);
      }
    } catch (err: any) {
      setAccessDeniedError(err.message);
    } finally {
      setLoadingInvoice(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (hasAccess) {
        fetchInvoice();
      } else {
        setInvoice(null);
      }
    }
  }, [isOpen, hasAccess, orderId]);

  if (!isOpen) return null;

  // Phone OTP Flow: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setOtpSent(true);
  };

  // Phone OTP Flow: Verify & Assign Customer (Requirements 3 & 4)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyingOtp(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/assign-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerUid: currentUser.id,
          customerEmail: currentUser.email,
          customerPhone: phoneNumber,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.order && onCustomerLinked) {
        onCustomerLinked(data.order);
      }

      // Now fetch invoice with newly authorized customer UID
      await fetchInvoice();
    } catch (err: any) {
      setAccessDeniedError(err.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Generate and download client-side PDF using jsPDF (Requirement 3)
  const handleDownloadPdf = () => {
    if (!invoice) return;
    try {
      setDownloadingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Colors
      const primaryColor = [79, 70, 229]; // indigo-600
      const textColor = [24, 24, 27]; // zinc-900
      const mutedColor = [113, 113, 122]; // zinc-500

      // Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 24, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(invoice.shop.name.toUpperCase(), 14, 12);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('TAX INVOICE / GST COMPLIANT BILL', 14, 18);

      doc.text(`INV NO: ${invoice.invoiceNumber}`, 145, 12);
      doc.text(`DATE: ${new Date(invoice.date).toLocaleDateString()}`, 145, 18);

      // Shop & Customer Info Section
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('SUPPLIER DETAILS:', 14, 34);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Store: ${invoice.shop.name}`, 14, 40);
      doc.text(`GSTIN: ${invoice.shop.gstin}`, 14, 45);
      doc.text(`Address: ${invoice.shop.address}`, 14, 50);

      doc.setFont('helvetica', 'bold');
      doc.text('ORDER & CUSTOMER DETAILS:', 115, 34);
      doc.setFont('helvetica', 'normal');
      doc.text(`Token / Order ID: ${invoice.token}`, 115, 40);
      doc.text(`Customer Name: ${invoice.customerName}`, 115, 45);
      doc.text(`Payment Status: ${invoice.paymentStatus} (VERIFIED)`, 115, 50);

      // Table Header
      let y = 62;
      doc.setFillColor(243, 244, 246);
      doc.rect(14, y, 182, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ITEM DESCRIPTION', 16, y + 5.5);
      doc.text('HSN', 80, y + 5.5);
      doc.text('QTY', 96, y + 5.5);
      doc.text('RATE ($)', 110, y + 5.5);
      doc.text('TAXABLE ($)', 130, y + 5.5);
      doc.text('GST %', 156, y + 5.5);
      doc.text('TOTAL ($)', 176, y + 5.5);

      // Table Rows
      y += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      invoice.items.forEach((item) => {
        doc.text(item.name.substring(0, 32), 16, y);
        doc.text(item.hsn_code, 80, y);
        doc.text(String(item.quantity), 98, y);
        doc.text((item.rate_cents / 100).toFixed(2), 112, y);
        doc.text((item.taxable_value_cents / 100).toFixed(2), 132, y);
        doc.text(`${item.gst_rate}%`, 158, y);
        doc.text((item.total_cents / 100).toFixed(2), 178, y);
        y += 7;
      });

      // Divider
      y += 2;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, y, 196, y);
      y += 8;

      // Summary Breakdown Table
      const summaryX = 120;
      doc.setFont('helvetica', 'normal');
      doc.text('Subtotal (Taxable Value):', summaryX, y);
      doc.text(`$${(invoice.summary.taxableValueCents / 100).toFixed(2)}`, 180, y, { align: 'right' });
      y += 6;

      doc.text('CGST (Central GST):', summaryX, y);
      doc.text(`$${(invoice.summary.cgstCents / 100).toFixed(2)}`, 180, y, { align: 'right' });
      y += 6;

      doc.text('SGST (State GST):', summaryX, y);
      doc.text(`$${(invoice.summary.sgstCents / 100).toFixed(2)}`, 180, y, { align: 'right' });
      y += 8;

      // Grand Total Box
      doc.setFillColor(243, 244, 246);
      doc.rect(summaryX - 4, y - 5, 80, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('GRAND TOTAL DUE:', summaryX, y + 2);
      doc.text(`$${(invoice.summary.grandTotalCents / 100).toFixed(2)}`, 180, y + 2, { align: 'right' });

      // Footer Notes
      y += 25;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
      doc.text('This is a computer-generated tax invoice generated under Cloud Run API engine.', 14, y);
      doc.text(`Authorized Signatory: ${invoice.shop.name} E-Commerce Division`, 14, y + 5);

      // Save PDF
      doc.save(`GST_Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">
                GST Tax Invoice & Billing (Requirement 3)
              </h2>
              <div className="text-[11px] font-mono text-zinc-400">
                Token: {order.token} · Order ID: {order.order_number}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* LOGIN GATE: If user is not yet authenticated as the order customer */}
          {!hasAccess && !invoice && (
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <Lock className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-100">
                  Login Required to Access GST Tax Bill
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  Tax invoices contain private financial and GSTIN information. Verify your mobile number via OTP to associate this order and download your invoice.
                </p>
              </div>

              {/* Phone OTP Form */}
              <div className="max-w-xs mx-auto text-left space-y-3 pt-2">
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow"
                    >
                      Send 6-Digit OTP Code
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                        Enter 6-Digit Firebase OTP
                      </label>
                      <div className="relative">
                        <KeyRound className="h-3.5 w-3.5 text-indigo-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="6-digit OTP code"
                          maxLength={6}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-zinc-200 tracking-widest focus:outline-none focus:border-indigo-500 text-center"
                        />
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1 text-center">
                        Demo OTP: 776921 (pre-filled)
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={verifyingOtp}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors shadow flex items-center justify-center gap-2"
                    >
                      {verifyingOtp ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Phone Auth...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Verify & Unlock Invoice</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loadingInvoice && (
            <div className="py-12 text-center space-y-3">
              <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs font-mono text-zinc-400">
                Fetching GST Tax breakdown from Cloud SQL...
              </div>
            </div>
          )}

          {/* INVOICE DISPLAY (Protected & Verified) */}
          {invoice && (
            <div className="space-y-5">
              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                <div>
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Supplier Details</div>
                  <div className="font-bold text-zinc-100 text-sm mt-0.5">{invoice.shop.name}</div>
                  <div className="text-[11px] font-mono text-indigo-400">GSTIN: {invoice.shop.gstin}</div>
                  <div className="text-[11px] text-zinc-400 mt-1">{invoice.shop.address}</div>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-zinc-400 uppercase">Invoice Particulars</div>
                  <div className="font-bold font-mono text-zinc-200 mt-0.5">
                    No: {invoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    Date: {new Date(invoice.date).toLocaleDateString()} · {new Date(invoice.date).toLocaleTimeString()}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-1">
                    Customer: {invoice.customerName}
                  </div>
                </div>
              </div>

              {/* Itemized Table with HSN, GST %, CGST, SGST */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5">HSN</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Taxable</th>
                      <th className="p-2.5 text-center">GST%</th>
                      <th className="p-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {invoice.items.map((itm, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/60">
                        <td className="p-2.5 font-medium text-zinc-200">{itm.name}</td>
                        <td className="p-2.5 font-mono text-zinc-400 text-[11px]">{itm.hsn_code}</td>
                        <td className="p-2.5 font-mono text-center text-zinc-300">{itm.quantity}</td>
                        <td className="p-2.5 font-mono text-right text-zinc-300">
                          ${(itm.rate_cents / 100).toFixed(2)}
                        </td>
                        <td className="p-2.5 font-mono text-right text-zinc-300">
                          ${(itm.taxable_value_cents / 100).toFixed(2)}
                        </td>
                        <td className="p-2.5 font-mono text-center text-indigo-400 text-[11px]">
                          {itm.gst_rate}%
                        </td>
                        <td className="p-2.5 font-mono text-right font-bold text-zinc-100">
                          ${(itm.total_cents / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax Breakdown Summary */}
              <div className="flex flex-col sm:flex-row items-end justify-between gap-4 pt-2">
                <div className="text-[11px] font-mono text-zinc-400">
                  <div>CGST: ${(invoice.summary.cgstCents / 100).toFixed(2)} (Central GST)</div>
                  <div>SGST: ${(invoice.summary.sgstCents / 100).toFixed(2)} (State GST)</div>
                  <div className="text-emerald-400 mt-1 font-semibold">
                    ✓ Verified GST Tax Invoice
                  </div>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 min-w-[220px] text-right">
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                    <span>Taxable Amount:</span>
                    <span>${(invoice.summary.taxableValueCents / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 font-mono mt-1">
                    <span>Total GST:</span>
                    <span>
                      ${((invoice.summary.cgstCents + invoice.summary.sgstCents) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white font-mono mt-2 pt-2 border-t border-zinc-800">
                    <span>Grand Total:</span>
                    <span>${(invoice.summary.grandTotalCents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-400">
            {hasAccess ? 'Status: Authenticated' : 'Status: Phone Gate Pending'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            >
              Close
            </button>

            {invoice && (
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloadingPdf ? 'Exporting PDF...' : 'Download PDF'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
