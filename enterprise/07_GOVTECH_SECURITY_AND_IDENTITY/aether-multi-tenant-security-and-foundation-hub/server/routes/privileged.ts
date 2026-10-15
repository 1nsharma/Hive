import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const privilegedRouter = Router();

/**
 * POST /api/privileged-action
 * Next.js 14 Route Handler Parity:
 * Handles elevated operations server-side using service_role key credentials.
 * Enforces server-side authorization check AND writes an immutable entry
 * into the audit_logs table (actor_id, action, target, timestamp, metadata, ip).
 */
privilegedRouter.post('/', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { action, target, shopId, payload = {} } = req.body;

    if (!action || !target) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "action" and "target" are required fields for privileged operations.'
      });
    }

    // Client IP & User Agent extraction
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Next.js-Route-Handler-ServiceRole';

    // Execute through service_role wrapper
    const result = db.executePrivilegedAction({
      actorId: actor.id,
      action,
      target,
      shopId,
      payload,
      ipAddress,
      userAgent
    });

    res.status(200).json({
      success: true,
      executionMode: 'server_service_role',
      message: result.message,
      auditLog: result.auditLog,
      updatedData: result.updatedData
    });
  } catch (err: any) {
    const isForbidden = err.message.toLowerCase().includes('forbidden') || err.message.toLowerCase().includes('unauthorized');
    res.status(isForbidden ? 403 : 500).json({
      success: false,
      executionMode: 'server_service_role',
      error: err.message
    });
  }
});
