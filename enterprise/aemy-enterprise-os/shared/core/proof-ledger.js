import crypto from "node:crypto";

export class ProofLedger {
  constructor() {
    this.chain = [];
    this.createGenesis();
  }

  createGenesis() {
    const genesis = {
      index: 0,
      timestamp: "2026-10-14T00:00:00.000Z",
      service: "GATEWAY",
      eventType: "ECOSYSTEM_GENESIS",
      payload: { message: "Aemy Enterprise Gateway Initialized" },
      previousHash: "0".repeat(64),
      hash: ""
    };
    genesis.hash = this.hashBlock(genesis);
    this.chain.push(genesis);
  }

  hashBlock(block) {
    const str = `${block.index}|${block.timestamp}|${block.service}|${block.eventType}|${JSON.stringify(block.payload)}|${block.previousHash}`;
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  append(service, eventType, payload) {
    const prev = this.chain[this.chain.length - 1];
    const block = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      service,
      eventType,
      payload,
      previousHash: prev.hash,
      hash: ""
    };
    block.hash = this.hashBlock(block);
    this.chain.push(block);
    return block;
  }

  verify() {
    for (let i = 1; i < this.chain.length; i++) {
      const cur = this.chain[i];
      const prev = this.chain[i - 1];
      if (cur.previousHash !== prev.hash) return false;
      const rehash = this.hashBlock({ ...cur, hash: "" });
      if (cur.hash !== rehash) return false;
    }
    return true;
  }
}

export const sharedLedger = new ProofLedger();
