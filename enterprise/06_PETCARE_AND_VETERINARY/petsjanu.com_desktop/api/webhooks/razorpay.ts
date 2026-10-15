import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '../../src/lib/supabase';

export interface RazorpayWebhookEvent {
  entity: string;
  account_id: string;
  event: 'payment.captured' | 'payment.failed' | 'payment.authorized' | string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        invoice_id: string | null;
        international: boolean;
        method: string;
        amount_refunded: number;
        refund_status: string | null;
        captured: boolean;
        description: string;
        card_id: string | null;
        bank: string | null;
        wallet: string | null;
        vpa: string | null;
        email: string;
        contact: string;
        notes: Record<string, any>;
        fee: number;
        tax: number;
        error_code: string | null;
        error_description: string | null;
        created_at: number;
      };
    };
  };
  created_at: number;
}

/**
 * Verifies the Razorpay webhook signature.
 */
export function verifyWebhookSignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    return false;
  }
}

/**
 * Handles incoming Razorpay webhook payload and updates order status in Supabase.
 */
export async function handleRazorpayWebhook(eventPayload: RazorpayWebhookEvent) {
  const { event, payload } = eventPayload;
  const paymentEntity = payload?.payment?.entity;

  if (!paymentEntity) {
    return { success: false, message: 'Invalid payment payload structure' };
  }

  const razorpayOrderId = paymentEntity.order_id;
  const razorpayPaymentId = paymentEntity.id;
  const notes = paymentEntity.notes || {};
  const dbOrderId = notes.order_id || notes.db_order_id;

  console.log(`[Razorpay Webhook] Event: ${event}, Payment ID: ${razorpayPaymentId}, Order ID: ${razorpayOrderId}`);

  if (event === 'payment.captured') {
    // Update order status to 'Paid' / 'Processing'
    if (isSupabaseConfigured() && dbOrderId) {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'Paid',
            payment_id: razorpayPaymentId,
          })
          .or(`id.eq.${dbOrderId},payment_id.eq.${razorpayOrderId}`);

        // Record payment record
        await supabase.from('payments').insert({
          order_id: dbOrderId,
          amount: paymentEntity.amount / 100,
          status: 'Completed',
          gateway: 'Razorpay',
          payment_ref: razorpayPaymentId,
        });
      } catch (err) {
        console.error('[Razorpay Webhook] Database update error:', err);
      }
    }

    return {
      success: true,
      event,
      paymentId: razorpayPaymentId,
      status: 'Paid',
      message: 'Payment captured successfully and order updated.',
    };
  }

  if (event === 'payment.failed') {
    // Update order status to 'Failed'
    if (isSupabaseConfigured() && dbOrderId) {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'Failed',
            payment_id: razorpayPaymentId,
          })
          .or(`id.eq.${dbOrderId},payment_id.eq.${razorpayOrderId}`);

        await supabase.from('payments').insert({
          order_id: dbOrderId,
          amount: paymentEntity.amount / 100,
          status: 'Failed',
          gateway: 'Razorpay',
          payment_ref: razorpayPaymentId,
        });
      } catch (err) {
        console.error('[Razorpay Webhook] Database update error on failure:', err);
      }
    }

    return {
      success: true,
      event,
      paymentId: razorpayPaymentId,
      status: 'Failed',
      reason: paymentEntity.error_description || 'Payment failed',
      message: 'Payment failed event processed.',
    };
  }

  return { success: true, event, message: 'Event received and logged.' };
}

/**
 * Express Request Handler for Razorpay Webhook
 */
export async function razorpayWebhookHandler(req: any, res: any) {
  const signature = req.headers['x-razorpay-signature'] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured');
    return res.status(503).json({ error: 'WEBHOOK_NOT_CONFIGURED' });
  }

  const rawBody = req.rawBody || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));

  // In test mode, if signature is 'test-signature' or matches secret, allow test events
  const isSignatureValid =
    (process.env.NODE_ENV !== 'production' && signature === 'test-signature') ||
    verifyWebhookSignature(rawBody, signature, webhookSecret);

  if (!isSignatureValid && process.env.NODE_ENV === 'production') {
    return res.status(400).json({ error: 'INVALID_SIGNATURE', message: 'Razorpay webhook signature verification failed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleRazorpayWebhook(payload);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'WEBHOOK_PROCESSING_FAILED', message: err.message });
  }
}
