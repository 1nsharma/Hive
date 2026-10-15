import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const m03Router = Router();

// ==============================================================================
// 1. PAYMENT PROOF SUBMISSION (PAY-01, PAY-02)
// ==============================================================================

// POST /api/payments/submit-proof - Customer submits UTR & screenshot proof
m03Router.post('/submit-proof', (req: Request, res: Response) => {
  try {
    const { orderId, utr, screenshotUrl, deviceId, customAmountCents } = req.body;

    if (!orderId || !utr) {
      return res.status(400).json({ error: 'orderId and utr are required.' });
    }

    const result = db.submitPaymentProof({
      orderId,
      utr: utr.trim(),
      screenshotUrl,
      deviceId: deviceId || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
      customAmountCents: customAmountCents ? Number(customAmountCents) : undefined,
    });

    res.json({
      success: true,
      message: 'Payment reference submitted. Sent to merchant review queue.',
      payment: result.payment,
      fraudReview: result.fraudReview,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==============================================================================
// 2. SERVER-SIDE WEBHOOK ENDPOINT (PAY-03, PAY-06)
// ==============================================================================

// POST /api/webhooks/razorpay - Razorpay Webhook with HMAC signature verification & idempotency
m03Router.post('/webhooks/razorpay', (req: Request, res: Response) => {
  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_wh_secret_test_2026';
    const rawBody = JSON.stringify(req.body);

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    }

    const result = db.processRazorpayWebhook({
      rawBody,
      signature,
      secret,
      payload: req.body,
    });

    if (result.status === 'INVALID_SIGNATURE') {
      return res.status(400).json({ error: 'Invalid HMAC signature verification' });
    }

    if (result.status === 'ALREADY_PROCESSED') {
      return res.status(200).json({ status: 'ok', message: 'Already processed (idempotent)' });
    }

    if (result.status === 'FRAUD_REVIEW') {
      return res.status(200).json({
        status: 'fraud_review_created',
        reason: result.reason,
        message: 'Amount mismatch detected. Queued for merchant inspection.',
      });
    }

    res.status(200).json({ status: 'ok', order_id: result.order?.id, verified: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================================
// 3. FRAUD REVIEW QUEUE (RSK-08)
// ==============================================================================

// GET /api/dashboard/fraud-reviews - List suspicious and unverified payments
m03Router.get('/dashboard/fraud-reviews', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.query;
    const targetShopId = String(shopId || db.getActiveShopId());

    const reviews = db.getFraudReviews(targetShopId, actor.id);
    res.json({
      shopId: targetShopId,
      count: reviews.length,
      reviews,
    });
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 500;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/dashboard/fraud-reviews/action - Confirm Paid or Mark Fraud
m03Router.post('/dashboard/fraud-reviews/action', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { reviewId, paymentId, orderId, action, notes } = req.body;

    if (!['CONFIRM', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'Action must be CONFIRM or REJECT' });
    }

    const result = db.verifyPaymentMerchant({
      reviewId,
      paymentId,
      orderId,
      actorId: actor.id,
      action,
      notes,
    });

    res.json({
      success: true,
      action,
      order: result.order,
      message: action === 'CONFIRM' ? 'Payment marked VERIFIED. Order accepted.' : 'Payment rejected as FRAUD. Order cancelled.',
    });
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// ==============================================================================
// 4. GST BILL WITH LOGIN GATE (Customer Auth + GST Tax Invoice)
// ==============================================================================

// POST /api/orders/:orderId/assign-customer - Link Firebase customer UID after Phone OTP
m03Router.post('/orders/:orderId/assign-customer', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { customerUid, customerEmail, customerPhone } = req.body;

    if (!customerUid) {
      return res.status(400).json({ error: 'customerUid is required' });
    }

    const order = db.assignCustomerToOrder({
      orderId,
      customerUid,
      customerEmail,
      customerPhone,
    });

    res.json({
      success: true,
      message: `Customer linked to order ${order.token}. GST invoice unlocked.`,
      order,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders/:orderId/invoice - Generate GST tax invoice (Protected Page /bill/[order_id])
m03Router.get('/orders/:orderId/invoice', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { customerUid, email } = req.query;

    const invoice = db.getOrderInvoice({
      orderId,
      actorUid: customerUid ? String(customerUid) : undefined,
      actorEmail: email ? String(email) : undefined,
    });

    res.json(invoice);
  } catch (err: any) {
    const status = err.message.includes('403') ? 403 : 500;
    res.status(status).json({ error: err.message });
  }
});

// ==============================================================================
// 5. INTERNAL TESTING AUTH & SCENARIOS (/internal/test-payments)
// ==============================================================================

// GET /api/internal/test-payments/meta - Check team membership and return test shops
m03Router.get('/internal/test-payments/meta', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const teamMembers = db.getTeamMembers();
    const isTeam = db.isTeamMember(actor.email);

    res.json({
      currentActor: actor,
      isTeamMember: isTeam,
      teamMembers,
      internalShops: db.getAllShops().filter(s => s.is_internal_test),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/internal/test-payments/simulate-scenario - Run automated test scenario
m03Router.post('/internal/test-payments/simulate-scenario', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { scenarioType, orderId, shopId, customUtr, customAmount } = req.body;

    const targetShopId = shopId || 'shp-internal-qa';
    const targetOrderId = orderId || 'ord-001';

    let result: any = null;

    switch (scenarioType) {
      case 'DUPLICATE_UTR': {
        // Submit the same UTR used in ord-001 (428192019283) to trigger RSK-02
        result = db.submitPaymentProof({
          orderId: targetOrderId,
          utr: customUtr || '428192019283',
          screenshotUrl: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=500',
        });
        break;
      }

      case 'AMOUNT_MISMATCH': {
        // Submit ₹100 instead of ₹24.30 to trigger RSK-04
        result = db.submitPaymentProof({
          orderId: targetOrderId,
          utr: `UTR-MISMATCH-${Date.now().toString().slice(-6)}`,
          customAmountCents: customAmount ? Number(customAmount) : 100, // 1 dollar
        });
        break;
      }

      case 'VELOCITY': {
        // Simulate 6 rapid attempts from same device
        const testDevice = `dev-flood-${Date.now()}`;
        for (let i = 0; i < 6; i++) {
          result = db.submitPaymentProof({
            orderId: targetOrderId,
            utr: `UTR-FLOOD-${i}-${Date.now().toString().slice(-4)}`,
            deviceId: testDevice,
          });
        }
        break;
      }

      default:
        throw new Error(`Unknown scenario type: ${scenarioType}`);
    }

    res.json({
      success: true,
      scenarioType,
      result,
      message: `Scenario ${scenarioType} executed. Check fraud review queue.`,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==============================================================================
// 6. SECURE MERCHANT APPROVAL FLOW (Requirement A)
// ==============================================================================

// GET /api/admin/approvals - List pending shops (Protected: team members only)
m03Router.get('/admin/approvals', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const adminEmail = (req.query.email as string) || actor.email;

    if (!db.isTeamMember(adminEmail)) {
      return res.status(403).json({
        error: `403 Forbidden: Email ${adminEmail} is not an authorized team member.`,
        isAuthorized: false,
      });
    }

    const pendingShops = db.getPendingApprovalShops(adminEmail);
    const allShops = db.getAllShops(adminEmail);

    res.json({
      success: true,
      adminEmail,
      isAuthorized: true,
      pendingShops,
      activeShops: allShops.filter(s => s.status === 'ACTIVE' || s.status === 'active'),
      internalShops: allShops.filter(s => s.is_internal_test),
      allShops,
    });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

// POST /api/admin/approvals/:shopId/approve - Approve pending shop
m03Router.post('/admin/approvals/:shopId/approve', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.params;
    const adminEmail = req.body.adminEmail || actor.email;

    if (!db.isTeamMember(adminEmail)) {
      return res.status(403).json({ error: `403 Forbidden: Email ${adminEmail} is not authorized to approve shops.` });
    }

    const approvedShop = db.approveShop({ shopId, adminEmail });

    res.json({
      success: true,
      message: `Shop "${approvedShop.name}" approved by ${adminEmail}. Dashboard unlocked.`,
      shop: approvedShop,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/admin/approvals/:shopId/reject - Reject pending shop
m03Router.post('/admin/approvals/:shopId/reject', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.params;
    const { reason, adminEmail } = req.body;
    const email = adminEmail || actor.email;

    if (!db.isTeamMember(email)) {
      return res.status(403).json({ error: `403 Forbidden: Email ${email} is not authorized to reject shops.` });
    }

    const rejectedShop = db.rejectShop({ shopId, adminEmail: email, reason });

    res.json({
      success: true,
      message: `Shop "${rejectedShop.name}" rejected.`,
      shop: rejectedShop,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/shops/:shopId/pay-subscription - Simulate Razorpay Subscription Test Checkout
m03Router.post('/shops/:shopId/pay-subscription', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const updatedShop = db.payShopSubscription({ shopId });

    res.json({
      success: true,
      message: `Subscription paid successfully for ${updatedShop.name}. Next step: awaiting platform admin approval.`,
      shop: updatedShop,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==============================================================================
// 7. STAFF CONTROL & ROLES (Requirement D / MRC-04)
// ==============================================================================

// GET /api/shops/:shopId/staff - Get staff list for shop
m03Router.get('/shops/:shopId/staff', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const staff = db.getStaffMemberships(shopId);
    res.json({ shopId, staff });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shops/:shopId/staff/invite - Invite staff by email/phone & role
m03Router.post('/shops/:shopId/staff/invite', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.params;
    const { email, phone, role, name } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required.' });
    }

    const staffMember = db.inviteStaffMember({
      shopId,
      email,
      phone,
      role,
      name,
      actorId: actor.id,
    });

    res.status(201).json({
      success: true,
      message: `Invitation sent to ${email} with role "${role}".`,
      staffMember,
      inviteUrl: `/staff?invite=${staffMember.id}&shop=${shopId}`,
    });
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// POST /api/shops/:shopId/staff/:staffId/accept - Accept staff invitation
m03Router.post('/shops/:shopId/staff/:staffId/accept', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { staffId } = req.params;
    const { userEmail, userId } = req.body;

    const acceptedStaff = db.acceptStaffInvite({
      inviteId: staffId,
      userId: userId || actor.id,
      userEmail: userEmail || actor.email,
    });

    res.json({
      success: true,
      message: `Invitation accepted. Welcome to the staff team!`,
      staff: acceptedStaff,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/shops/:shopId/staff/:staffId - Revoke staff permissions
m03Router.delete('/shops/:shopId/staff/:staffId', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId, staffId } = req.params;

    const revoked = db.revokeStaffMember({ staffId, shopId, actorId: actor.id });

    if (!revoked) {
      return res.status(404).json({ error: 'Staff member not found.' });
    }

    res.json({ success: true, message: 'Staff member access revoked.' });
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// ==============================================================================
// 8. AI DATA LAYER & SUPPORT BOT (Requirement E)
// ==============================================================================

// GET /api/ai/events - View anonymized AI training event log
m03Router.get('/ai/events', (req: Request, res: Response) => {
  try {
    const { shopId, limit } = req.query;
    const events = db.getAIEvents(shopId ? String(shopId) : undefined, limit ? Number(limit) : 40);
    res.json({ total: events.length, events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ai/stats - Shop statistics and AI Boost qualification
m03Router.get('/ai/stats', (req: Request, res: Response) => {
  try {
    const { shopId } = req.query;
    const targetShopId = String(shopId || db.getActiveShopId());
    const stats = db.getShopStats(targetShopId);
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/support/chat - AI Support Bot for Merchant Operations
m03Router.post('/support/chat', (req: Request, res: Response) => {
  try {
    const { message, shopId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const response = db.handleSupportChat(message, shopId);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
