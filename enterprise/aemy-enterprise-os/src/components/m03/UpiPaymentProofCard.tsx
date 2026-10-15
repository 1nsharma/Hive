import React, { useState } from 'react';
import { Order, Shop, Payment } from '../../types/database';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Upload, 
  Check, 
  AlertTriangle, 
  Copy, 
  ShieldCheck, 
  FileCheck, 
  Image as ImageIcon,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';

interface UpiPaymentProofCardProps {
  order: Order;
  shop: Partial<Shop> & { name: string; upi_id?: string; currency?: string };
  onProofSubmitted: (updatedPayment: Payment) => void;
}

export const UpiPaymentProofCard: React.FC<UpiPaymentProofCardProps> = ({
  order,
  shop,
  onProofSubmitted,
}) => {
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>(
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=600&auto=format&fit=crop&q=80'
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const effectiveUpiId = shop.upi_id || 'apexstore@upi';
  const amountStr = (order.total_cents / 100).toFixed(2);
  
  // Standard UPI URI format
  const upiUri = `upi://pay?pa=${encodeURIComponent(effectiveUpiId)}&pn=${encodeURIComponent(
    shop.name
  )}&am=${amountStr}&cu=INR&tn=Token-${order.token}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(effectiveUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setFeedback({ type: 'error', message: 'Please enter the 12-digit UPI Reference / UTR Number.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      // Cloud storage bucket path simulation: gs://payment-proofs/{order_id}.jpg
      const cloudStorageUri = `https://storage.googleapis.com/aether-payment-proofs/orders/${order.id}/proof-${Date.now()}.jpg`;

      const res = await fetch('/api/submit-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          utr: utrNumber.trim(),
          screenshotUrl: cloudStorageUri,
          deviceId: `web-client-${Math.random().toString(36).substring(2, 8)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment proof');
      }

      setFeedback({
        type: 'success',
        message: `Reference #${utrNumber} submitted! Proof stored in Cloud Storage. Status is PENDING merchant review.`,
      });

      if (data.payment) {
        onProofSubmitted(data.payment);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const isVerified = order.payment?.status === 'VERIFIED';
  const hasSubmittedProof = Boolean(order.payment?.provider_ref);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-zinc-100">Scan & Pay via UPI (PAY-01)</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Scan with any UPI app (GPay, PhonePe, Paytm) to complete payment for Token {order.token}.
          </p>
        </div>

        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
          isVerified 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        }`}>
          {order.payment?.status || 'PENDING'}
        </span>
      </div>

      {/* UPI QR & Payment Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-zinc-950/60 p-4 rounded-xl border border-zinc-850">
        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md mx-auto">
          <QRCodeSVG
            value={upiUri}
            size={160}
            level="H"
            includeMargin={true}
          />
          <div className="text-[10px] font-mono text-zinc-700 mt-1 font-bold">
            Scan to pay ${amountStr}
          </div>
        </div>

        {/* UPI Details & Copy */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-zinc-400 font-mono">Store UPI VPA:</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="bg-zinc-900 px-2.5 py-1.5 rounded border border-zinc-800 text-indigo-300 font-mono text-xs flex-1 select-all">
                {effectiveUpiId}
              </code>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 font-mono">Exact Payable Amount:</label>
            <div className="text-xl font-mono font-bold text-white mt-0.5">
              ${amountStr}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-zinc-400 font-mono">Transaction Note:</label>
            <div className="text-xs font-mono text-zinc-300">
              Token-{order.token}
            </div>
          </div>
        </div>
      </div>

      {/* Submission Form (PAY-02) */}
      <form onSubmit={handleSubmitProof} className="space-y-4 pt-2">
        <div className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
          <span>Submit Payment Verification (PAY-02)</span>
          {hasSubmittedProof && (
            <span className="text-[11px] font-mono text-zinc-400">
              Ref in DB: {order.payment?.provider_ref}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* UTR Input */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              1. 12-Digit UTR / Transaction Ref No <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 428192019283"
              maxLength={24}
              disabled={isVerified}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            {/* Quick Demo Fill Buttons */}
            <div className="flex gap-1.5 mt-1.5">
              <button
                type="button"
                onClick={() => setUtrNumber('428192019283')}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 font-mono bg-zinc-800/80 px-2 py-0.5 rounded"
              >
                + Valid UTR
              </button>
              <button
                type="button"
                onClick={() => setUtrNumber(`UTR-NEW-${Date.now().toString().slice(-4)}`)}
                className="text-[10px] text-zinc-400 hover:text-zinc-200 font-mono bg-zinc-800/80 px-2 py-0.5 rounded"
              >
                + Unique Ref
              </button>
            </div>
          </div>

          {/* Screenshot Upload Input */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              2. Screenshot Upload (Cloud Storage)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="Cloud Storage screenshot URL"
                disabled={isVerified}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 truncate"
              />
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1">
              Target: gs://aether-payment-proofs/{order.id}.jpg
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200' 
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
          }`}>
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || isVerified}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium text-xs transition-colors shadow flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Uploading to Cloud Storage & Queuing Review...</span>
            </>
          ) : isVerified ? (
            <>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Payment Verified & Confirmed</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Submit Payment Proof for Verification</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
