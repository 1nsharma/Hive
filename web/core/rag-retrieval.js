export class HybridRAGRetriever {
  constructor() {
    this.documents = [];
  }

  indexDocument(id, text, metadata = {}) {
    const tokens = this.tokenize(text);
    this.documents.push({
      id,
      text,
      tokens,
      metadata,
      vector: this.generateDeterministicVector(text)
    });
  }

  tokenize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  }

  generateDeterministicVector(text) {
    // 8-dimensional semantic fingerprint hash for zero-dependency vector indexing
    const vec = new Array(8).fill(0);
    const tokens = this.tokenize(text);
    for (const t of tokens) {
      for (let i = 0; i < t.length; i++) {
        vec[(t.charCodeAt(i) + i) % 8] += 1;
      }
    }
    // Normalize vector
    const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map(v => v / mag);
  }

  cosineSimilarity(v1, v2) {
    let dot = 0;
    for (let i = 0; i < v1.length; i++) dot += v1[i] * v2[i];
    return dot;
  }

  keywordScore(queryTokens, docTokens) {
    let matches = 0;
    const docSet = new Set(docTokens);
    for (const q of queryTokens) {
      if (docSet.has(q)) matches += 1;
    }
    return matches / (queryTokens.length || 1);
  }

  hybridSearch(query, topK = 3) {
    const qTokens = this.tokenize(query);
    const qVec = this.generateDeterministicVector(query);

    const scored = this.documents.map(doc => {
      const vecScore = this.cosineSimilarity(qVec, doc.vector);
      const kwScore = this.keywordScore(qTokens, doc.tokens);
      // 60% semantic vector + 40% exact keyword match
      const hybridScore = (0.6 * vecScore) + (0.4 * kwScore);
      return {
        id: doc.id,
        text: doc.text,
        metadata: doc.metadata,
        hybridScore: Math.round(hybridScore * 1000) / 1000,
        vecScore: Math.round(vecScore * 1000) / 1000,
        kwScore: Math.round(kwScore * 1000) / 1000
      };
    });

    return scored.sort((a, b) => b.hybridScore - a.hybridScore).slice(0, topK);
  }
}

export const ragRetriever = new HybridRAGRetriever();
