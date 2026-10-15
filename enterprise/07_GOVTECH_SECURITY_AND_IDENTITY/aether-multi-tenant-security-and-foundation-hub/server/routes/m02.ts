import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { OrderMode, OrderStatus } from '../../src/types/database.js';

export const m02Router = Router();

// ==============================================================================
// 1. PUBLIC MENU & QR ORDERING ENDPOINTS (/s/[shop_slug])
// ==============================================================================

// GET /api/public/shop/:slug - Fetch shop by slug from Cloud SQL (404 if not found)
m02Router.get(['/shop/:slug', '/public/shop/:slug'], (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const shop = db.getShopBySlug(slug);

    if (!shop) {
      return res.status(404).json({
        error: `Shop not found with slug: "${slug}"`,
        code: 'SHOP_NOT_FOUND',
      });
    }

    res.json(shop);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/public/shop/:slug/menu - Show menu from DB with Cloud Storage photos & add-ons
m02Router.get(['/shop/:slug/menu', '/public/shop/:slug/menu'], (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const shop = db.getShopBySlug(slug);

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    const items = db.getMenuItems(shop.id);
    
    // Group into categories
    const categories = Array.from(new Set(items.map(i => i.category)));

    res.json({
      shop,
      categories,
      items,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/public/orders - Place Order: Creates orders + payments in Cloud SQL, returns order_id & K-XX token
m02Router.post(['/orders', '/public/orders'], (req: Request, res: Response) => {
  try {
    const { 
      shopId, 
      mode, 
      tableNumber, 
      customerName, 
      customerPhone, 
      items, 
      paymentMethod 
    } = req.body;

    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items before placing order.' });
    }

    // Validate order mode requirements (ORD-05)
    const validModes: OrderMode[] = ['DINE_IN', 'PARCEL', 'TOKEN'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({ error: `Invalid mode. Allowed: ${validModes.join(', ')}` });
    }

    if (mode === 'DINE_IN' && (!tableNumber || !tableNumber.trim())) {
      return res.status(400).json({ error: 'Table number is required for DINE_IN orders.' });
    }

    if (mode === 'PARCEL' && (!customerName || !customerName.trim())) {
      return res.status(400).json({ error: 'Customer name is required for PARCEL / Takeaway orders.' });
    }

    // Create order and payment in Cloud SQL
    const order = db.createOrder({
      shopId,
      mode,
      tableNumber,
      customerName,
      customerPhone,
      items,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      order_id: order.id,
      token: order.token,
      order_number: order.order_number,
      status: order.status,
      total_cents: order.total_cents,
      payment: order.payment,
      message: `Order placed successfully! Your token is ${order.token}.`,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/public/orders/:orderId - Live tracking page /o/[order_id] (ORD-07)
m02Router.get(['/orders/:orderId', '/public/orders/:orderId'], (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = db.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: `Order ${orderId} not found` });
    }

    const shop = db.getShopById(order.shop_id);

    res.json({
      order,
      shop: shop ? { id: shop.id, name: shop.name, slug: shop.slug, currency: shop.currency } : null,
      firestoreRealtimePath: `shop_${order.shop_id}_live_orders/${order.id}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==============================================================================
// 2. MERCHANT DASHBOARD ENDPOINTS (/dashboard) - Protected by Membership Check
// ==============================================================================

// GET /api/dashboard/orders - Realtime Order Board 3 columns
m02Router.get('/dashboard/orders', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.query;

    const targetShopId = String(shopId || db.getActiveShopId());

    // GCP Specific Rule: Check membership, prevent cross-shop data leak
    if (!db.isShopMember(targetShopId, actor.id) && !db.isOperationsOrAdmin(actor.id)) {
      return res.status(403).json({
        error: `403 Forbidden: Actor ${actor.email} does not have membership in shop ${targetShopId}. Cross-shop data leak prevented.`,
      });
    }

    // Requirement A: Middleware gate for shop approval status
    const shop = db.getShopById(targetShopId);
    if (shop && shop.status !== 'ACTIVE' && shop.status !== 'active' && !shop.is_internal_test) {
      return res.status(403).json({
        error: `Shop ${shop.name} is waiting for admin approval.`,
        blocked: true,
        approval_status: shop.status,
        subscription_status: shop.subscription_status || 'NONE',
        shop,
      });
    }

    const liveOrders = db.getLiveOrders(targetShopId, actor.id);

    // Group into 3 Kanban columns: INCOMING, PREPARING, READY
    const board = {
      INCOMING: liveOrders.filter(o => o.status === 'INCOMING'),
      PREPARING: liveOrders.filter(o => o.status === 'PREPARING'),
      READY: liveOrders.filter(o => o.status === 'READY'),
    };

    res.json({
      shopId: targetShopId,
      totalActive: liveOrders.length,
      firestoreCollection: `shop_${targetShopId}_live_orders`,
      board,
      allLive: liveOrders,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/dashboard/orders/:orderId/status - Update order status (with Firestore sync & Audit Log entry)
m02Router.patch('/dashboard/orders/:orderId/status', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { orderId } = req.params;
    const { status, staffRole } = req.body;

    const validStatuses: OrderStatus[] = ['INCOMING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Allowed: ${validStatuses.join(', ')}` });
    }

    // Updates Cloud SQL, syncs Firestore collection, creates audit log entry
    const updatedOrder = db.updateOrderStatus({
      orderId,
      newStatus: status,
      actorId: actor.id,
      staffRole,
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: `Order ${updatedOrder.token} transitioned to ${status}. Audit log entry recorded.`,
    });
  } catch (err: any) {
    const statusCode = err.message.includes('Security Violation') || err.message.includes('Forbidden') ? 403 : 400;
    res.status(statusCode).json({ error: err.message });
  }
});

// PATCH /api/dashboard/menu/:itemId/toggle-availability - Instant Menu Toggle (true/false)
m02Router.patch('/dashboard/menu/:itemId/toggle-availability', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { itemId } = req.params;
    const { shopId, isAvailable } = req.body;

    const targetShopId = shopId || db.getActiveShopId();
    const item = db.toggleMenuItemAvailability(targetShopId, itemId, Boolean(isAvailable), actor.id);

    res.json({
      success: true,
      item,
      message: `Menu item "${item.name}" availability set to ${isAvailable ? 'AVAILABLE' : 'OUT_OF_STOCK'}.`,
    });
  } catch (err: any) {
    const statusCode = err.message.includes('Forbidden') ? 403 : 400;
    res.status(statusCode).json({ error: err.message });
  }
});

// POST /api/dashboard/menu - Add dish to menu
m02Router.post('/dashboard/menu', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId, name, category, description, photoUrl, priceCents, isVeg, addOns } = req.body;

    const targetShopId = shopId || db.getActiveShopId();
    const newItem = db.addMenuItem({
      shopId: targetShopId,
      actorId: actor.id,
      name,
      category,
      description,
      photoUrl,
      priceCents: Number(priceCents),
      isVeg: Boolean(isVeg),
      addOns: addOns || [],
    });

    res.status(201).json(newItem);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/dashboard/upload-photo - Upload dish photo to Cloud Storage bucket, return public URL
m02Router.post('/dashboard/upload-photo', (req: Request, res: Response) => {
  try {
    const { shopId, filename } = req.body;
    const targetShopId = shopId || db.getActiveShopId();

    const publicUrl = db.uploadDishPhoto(targetShopId, filename || 'dish.jpg');

    res.json({
      success: true,
      bucket: 'aether-dishes-prod',
      storageUri: `gs://aether-dishes-prod/shops/${targetShopId}/${filename}`,
      publicUrl,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
