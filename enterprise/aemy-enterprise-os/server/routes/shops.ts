import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const shopsRouter = Router();

// GET /api/shops - list shops
shopsRouter.get('/', (req: Request, res: Response) => {
  try {
    const shops = db.getAllShops();
    res.json(shops);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shops - create new tenant shop
shopsRouter.post('/', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { name, slug, plan, currency } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const result = db.createShop({
      actorId: actor.id,
      name,
      slug,
      plan,
      currency
    });

    res.status(201).json(result);
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/shops/:shopId/memberships - list members for shop
shopsRouter.get('/:shopId/memberships', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const actor = db.getActiveUser();

    // RLS: member or ops
    if (!db.isShopMember(shopId, actor.id) && !db.isOperationsOrAdmin(actor.id)) {
      return res.status(403).json({
        error: `42501 Insufficient Privileges: User ${actor.email} is not a member of shop ${shopId} (RLS policy 'memberships_select_policy')`
      });
    }

    const memberships = db.getMembershipsForShop(shopId);
    res.json(memberships);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/shops/:shopId/products - get products with RLS
shopsRouter.get('/:shopId/products', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const actor = db.getActiveUser();
    const result = db.queryProductsWithRLS(actor.id, shopId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shops/:shopId/products - add product (enforcing shop_id)
shopsRouter.post('/:shopId/products', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const actor = db.getActiveUser();
    const { name, sku, priceCents, stockQuantity } = req.body;

    const product = db.addProduct({
      actorId: actor.id,
      shopId,
      name,
      sku,
      priceCents: Number(priceCents || 0),
      stockQuantity: Number(stockQuantity || 0)
    });

    res.status(201).json(product);
  } catch (err: any) {
    const status = err.message.includes('Forbidden') ? 403 : 400;
    res.status(status).json({ error: err.message });
  }
});

// GET /api/shops/:shopId/orders - get orders with RLS
shopsRouter.get('/:shopId/orders', (req: Request, res: Response) => {
  try {
    const { shopId } = req.params;
    const actor = db.getActiveUser();
    const result = db.queryOrdersWithRLS(actor.id, shopId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
