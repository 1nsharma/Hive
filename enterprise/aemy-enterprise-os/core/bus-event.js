import { EventEmitter } from "node:events";
import { sharedLedger } from "./audit-ledger.js";

class EnterpriseEventBus extends EventEmitter {
  publish(tenantId, eventName, payload) {
    sharedLedger.recordEvent(tenantId, eventName, payload);
    this.emit(eventName, { tenantId, timestamp: new Date().toISOString(), payload });
  }
}

export const enterpriseBus = new EnterpriseEventBus();
