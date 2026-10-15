/**
 * Aura v1: Audit Event Recorder
 * Cryptographically writes audit records to the tamper-evident ledger.
 */

import { computeAuditEventHash } from '@aura/common/crypto';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export class AuditRecorder {
  /**
   * @param {Object} db - DatabaseClient instance
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * Records a cryptographically chained audit event.
   * 
   * @param {Object} tx - Active database client or transaction
   * @param {Object} event
   * @param {string} event.organizationId
   * @param {string} event.actorType - 'USER' | 'SERVICE' | 'SYSTEM' | 'ANONYMOUS'
   * @param {string} event.actorId
   * @param {string} [event.actorEmail]
   * @param {string} event.action
   * @param {string} event.resourceType
   * @param {string} event.resourceId
   * @param {string} event.status - 'SUCCESS' | 'FAILURE' | 'DENIED'
   * @param {string} [event.ipAddress]
   * @param {string} [event.userAgent]
   * @param {string} [event.correlationId]
   * @param {Object} [event.context]
   */
  async record(tx, event) {
    // 1. Fetch latest event hash for the organization (or globally for tenant)
    const latestRes = await tx.query(`
      SELECT sequence_number, event_hash
      FROM audit_events
      WHERE organization_id = $1
      ORDER BY sequence_number DESC
      LIMIT 1;
    `, [event.organizationId]);

    const prevHash = latestRes.rows.length > 0 ? latestRes.rows[0].event_hash : GENESIS_HASH;
    const nextSeq = latestRes.rows.length > 0 ? Number(latestRes.rows[0].sequence_number) + 1 : 1;
    const timestamp = new Date().toISOString();

    const hashPayload = {
      prev_event_hash: prevHash,
      sequence_number: nextSeq,
      organization_id: event.organizationId,
      timestamp_utc: timestamp,
      actor_id: event.actorId,
      action: event.action,
      resource_type: event.resourceType,
      resource_id: event.resourceId,
      status: event.status,
      context_json: event.context || {},
    };

    const eventHash = computeAuditEventHash(hashPayload);

    await tx.query(`
      INSERT INTO audit_events (
        organization_id, timestamp_utc, actor_type, actor_id, actor_email,
        action, resource_type, resource_id, status, ip_address, user_agent,
        correlation_id, context_json, prev_event_hash, event_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `, [
      event.organizationId,
      timestamp,
      event.actorType,
      event.actorId,
      event.actorEmail || null,
      event.action,
      event.resourceType,
      event.resourceId,
      event.status,
      event.ipAddress || null,
      event.userAgent || null,
      event.correlationId || 'corr-system',
      JSON.stringify(event.context || {}),
      prevHash,
      eventHash,
    ]);

    return { sequenceNumber: nextSeq, eventHash };
  }
}
