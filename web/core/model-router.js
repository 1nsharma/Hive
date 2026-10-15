export const MODEL_REGISTRY = {
  REASONING_COMPLEX: {
    model: "gemini-2.5-pro",
    tier: "ULTRA",
    maxTokens: 32768,
    costPer1k: 0.007
  },
  FAST_CONVERSATIONAL: {
    model: "gemini-2.5-flash",
    tier: "STANDARD",
    maxTokens: 8192,
    costPer1k: 0.0003
  },
  CODE_SYNTHESIS: {
    model: "gemini-2.5-pro-code",
    tier: "HIGH_PRECISION",
    maxTokens: 16384,
    costPer1k: 0.005
  },
  EDGE_EMBEDDINGS: {
    model: "text-embedding-004",
    tier: "LIGHTWEIGHT",
    dimensions: 768,
    costPer1k: 0.00005
  }
};

export class ModelRouter {
  constructor() {
    this.registry = MODEL_REGISTRY;
  }

  selectModelForTask(taskType, priority = "NORMAL") {
    const t = (taskType || "").toUpperCase();
    if (priority === "CRITICAL" || t.includes("ARCHITECTURE") || t.includes("FINANCE_AUDIT") || t.includes("LEGAL")) {
      return { ...this.registry.REASONING_COMPLEX, selectedReason: "High-reasoning / critical priority required" };
    }
    if (t.includes("CODE") || t.includes("SYNTHESIS") || t.includes("REFACTOR")) {
      return { ...this.registry.CODE_SYNTHESIS, selectedReason: "Code synthesis specialty route" };
    }
    if (t.includes("EMBED") || t.includes("SEMANTIC_SEARCH") || t.includes("RAG_VECTOR")) {
      return { ...this.registry.EDGE_EMBEDDINGS, selectedReason: "Vector embedding route" };
    }
    return { ...this.registry.FAST_CONVERSATIONAL, selectedReason: "Low-latency conversational/intent default" };
  }
}

export const modelRouter = new ModelRouter();
