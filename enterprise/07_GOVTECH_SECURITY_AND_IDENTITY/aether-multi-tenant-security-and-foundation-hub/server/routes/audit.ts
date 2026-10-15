import { Router, Request, Response } from 'express';
import { db } from '../db.js';

export const auditRouter = Router();

// GET /api/audit-logs - read audit logs with RLS enforcement
auditRouter.get('/', (req: Request, res: Response) => {
  try {
    const actor = db.getActiveUser();
    const { shopId } = req.query;

    const result = db.queryAuditLogsWithRLS(
      actor.id,
      shopId ? String(shopId) : undefined
    );

    if (!result.allowed) {
      return res.status(403).json({
        error: `42501 Insufficient Privileges: User role '${actor.system_role}' is not authorized to read audit logs for this scope. (RLS policy 'audit_logs_select_policy')`,
        code: '42501',
        logs: []
      });
    }

    res.json({
      success: true,
      count: result.data.length,
      logs: result.data
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/audit-logs/direct-browser-write-attempt
// Simulates a browser client attempting a direct DB insert into audit_logs.
// RLS Policy `WITH CHECK (false)` prevents this!
auditRouter.post('/direct-browser-write-attempt', (req: Request, res: Response) => {
  const actor = db.getActiveUser();
  const simulatedDirectInsert = req.body;

  const result = db.attemptDirectBrowserAuditLogInsert(actor.id, simulatedDirectInsert);

  return res.status(403).json({
    blockedByRLS: true,
    error: result.error,
    code: result.code,
    explanation: 'Direct client writes to audit_logs are unconditionally blocked by PostgreSQL Row Level Security (WITH CHECK (false)). All privileged actions MUST flow through server-side route handlers using service_role credentials.'
  });
});
