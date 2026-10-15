import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, "../config/model-catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

export class ModelGateway {
  constructor() {
    this.catalog = catalog.providers;
  }

  getCatalog() {
    return this.catalog;
  }

  generateCommand({ provider, model, prompt, dangerSkip = true }) {
    const prov = this.catalog[provider] || this.catalog.antigravity;
    const cli = prov.cli;
    const skipFlag = dangerSkip ? "--dangerously-skip-permissions" : "";

    if (provider === "antigravity") {
      return `${cli} --model "${model || 'Gemini 3.1 Pro (High)'}" ${skipFlag} -p "${prompt || ''}"`;
    }
    if (provider === "claude") {
      return `${cli} --model "${model || 'claude-sonnet-5-5'}" ${skipFlag} -p "${prompt || ''}"`;
    }
    if (provider === "cursor") {
      return `${cli} --model "${model || 'composer-2.5'}" -p "${prompt || ''}"`;
    }
    return `${cli} -p "${prompt || ''}"`;
  }

  dispatchPrompt({ coworkerId, prompt, provider, model }) {
    return {
      dispatchedAt: new Date().toISOString(),
      coworkerId,
      provider: provider || "antigravity",
      model: model || "Gemini 3.1 Pro (High)",
      prompt,
      simulatedExecution: `[${(provider || 'antigravity').toUpperCase()} CLI DISPATCH] Coworker ${coworkerId} accepted mission. Running via model ${model || 'Gemini 3.1 Pro'}. Autonomous agent loop initiated with zero subscription cost.`
    };
  }
}

export const modelGateway = new ModelGateway();
