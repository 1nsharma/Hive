import crypto from "node:crypto";

export class ProofLedger {
  constructor() {
    this.chain = [];
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesis = {
      index: 0,
      timestamp: new Date("2026-10-14T00:00:00Z").toISOString(),
      tenantId: "SYSTEM",
      eventType: "GENESIS_INITIALIZATION",
      payload: { system: "Aemy Enterprise OS Genesis" },
      previousHash: "0".repeat(64),
      hash: ""
    };
    genesis.hash = this.calculateHash(genesis);
    this.chain.push(genesis);
  }

  calculateHash(block) {
    const data = `${block.index}|${block.timestamp}|${block.tenantId}|${block.eventType}|${JSON.stringify(block.payload)}|${block.previousHash}`;
    return crypto.createHash("sha256").update(data).digest("hex");
  }

  recordEvent(tenantId, eventType, payload) {
    const previousBlock = this.chain[this.chain.length - 1];
    const newBlock = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      tenantId,
      eventType,
      payload,
      previousHash: previousBlock.hash,
      hash: ""
    };
    newBlock.hash = this.calculateHash(newBlock);
    this.chain.push(newBlock);
    return newBlock;
  }

  getEntries(filter = {}) {
    let result = [...this.chain];
    if (filter.tenantId) {
      result = result.filter(b => b.tenantId === filter.tenantId);
    }
    if (filter.eventType) {
      result = result.filter(b => b.eventType === filter.eventType);
    }
    return result;
  }

  verifyChainIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.previousHash !== previous.hash) {
        return { valid: false, brokenIndex: i, reason: "Previous hash mismatch" };
      }

      const recalculated = this.calculateHash({ ...current, hash: "" });
      if (current.hash !== recalculated) {
        return { valid: false, brokenIndex: i, reason: "Block data tampered" };
      }
    }
    return { valid: true, totalBlocks: this.chain.length };
  }
}

export const sharedLedger = new ProofLedger();
