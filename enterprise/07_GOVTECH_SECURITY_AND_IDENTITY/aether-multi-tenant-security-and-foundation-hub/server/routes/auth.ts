import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const authRouter = Router();

// GET /api/auth/session - returns current active user, role, active shop and memberships
authRouter.get('/session', (req: Request, res: Response) => {
  try {
    const user = db.getActiveUser();
    const activeShop = db.getActiveShop();
    const memberships = db.getMembershipsForUser(user.id);
    const effectiveMembership = memberships.find(m => m.shop_id === activeShop.id);

    res.json({
      user,
      activeShop,
      memberships,
      effectiveMembership,
      isSuperAdmin: db.isSuperAdmin(user.id),
      isOperations: db.isOperationsOrAdmin(user.id),
      isShopOwner: db.isShopOwner(activeShop.id, user.id)
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/switch-role - switch simulated active actor identity
authRouter.post('/switch-role', (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    const user = db.setActiveUser(userId);
    const activeShop = db.getActiveShop();
    const memberships = db.getMembershipsForUser(user.id);

    res.json({
      success: true,
      message: `Switched active actor to ${user.full_name} (${user.system_role})`,
      user,
      activeShop,
      memberships
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/auth/switch-shop - switch active tenant shop context
authRouter.post('/switch-shop', (req: Request, res: Response) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ error: 'shopId is required' });
    }
    const shop = db.setActiveShop(shopId);
    res.json({ success: true, shop });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/auth/users - list persona options
authRouter.get('/users', (req: Request, res: Response) => {
  try {
    const users = db.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
