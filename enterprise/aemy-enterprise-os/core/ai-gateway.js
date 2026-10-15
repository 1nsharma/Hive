import { AppConfig } from "./config.js";

export class AIGateway {
  constructor(apiKey = AppConfig.geminiApiKey) {
    this.apiKey = apiKey;
  }

  async parseCommerceOrder(naturalInput) {
    const input = naturalInput.toLowerCase();
    const items = [];
    let customerName = "Cash Customer";
    let isUdhar = input.includes("udhar") || input.includes("khata") || input.includes("credit");

    const nameMatch = naturalInput.match(/(?:to|ko|for|se|bhai|ji)\s+([A-Za-z]+)/i);
    if (nameMatch && nameMatch[1]) {
      customerName = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
    }

    const rules = [
      { regex: /(\d+)\s*(?:packet|pkt|pc|pack)?\s*(?:of\s+)?(maggi|noodle[s]?)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 14, name: "Maggi Noodles" },
      { regex: /(\d+)\s*(?:litre|ltr|l)?\s*(?:of\s+)?(amul\s+milk|milk|doodh)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 33, name: "Amul Taaza Milk 500ml" },
      { regex: /(\d+)\s*(?:kg|kilo)?\s*(?:of\s+)?(sugar|cheeni)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 44, name: "Sugar Premium 1kg" },
      { regex: /(\d+)\s*(?:packet|pc)?\s*(?:of\s+)?(atta|fortune\s+atta)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 380, name: "Fortune Chakki Atta 10kg" },
      { regex: /(\d+)\s*(?:bottle|pc)?\s*(?:of\s+)?(oil|mustard\s+oil|tel)\s*(?:at|@|rate)?\s*(\d+)?/i, defaultPrice: 165, name: "Mustard Oil 1L" }
    ];

    for (const rule of rules) {
      const match = naturalInput.match(rule.regex);
      if (match) {
        const qty = parseInt(match[1], 10) || 1;
        const unitPrice = match[3] ? parseFloat(match[3]) : rule.defaultPrice;
        items.push({
          name: rule.name,
          quantity: qty,
          unitPrice,
          total: qty * unitPrice
        });
      }
    }

    if (items.length === 0) {
      const genericMatch = naturalInput.match(/(\d+)\s+([a-zA-Z\s]+)(?:at|@|\s+)(\d+)/);
      if (genericMatch) {
        const qty = parseInt(genericMatch[1], 10);
        const name = genericMatch[2].trim();
        const price = parseFloat(genericMatch[3]);
        items.push({ name, quantity: qty, unitPrice: price, total: qty * price });
      } else {
        items.push({ name: "General Grocery Goods", quantity: 1, unitPrice: 100, total: 100 });
      }
    }

    return {
      success: true,
      customerName,
      isUdhar,
      items
    };
  }

  async screenCandidateSkills(jobTitle, candidateResumeText) {
    const text = candidateResumeText.toLowerCase();
    const skillsFound = [];
    const targetKeywords = ["react", "node", "typescript", "python", "ai", "sql", "git", "logistics", "electrical", "solar", "mechanic", "accounting"];

    for (const kw of targetKeywords) {
      if (text.includes(kw)) {
        skillsFound.push(kw.toUpperCase());
      }
    }

    const baseScore = Math.min(100, Math.max(30, skillsFound.length * 18 + 25));
    return {
      jobTitle,
      skillsIdentified: skillsFound,
      matchScore: baseScore,
      recommendation: baseScore >= 70 ? "HIRE_IMMEDIATELY" : (baseScore >= 50 ? "REVIEW_INTERVIEW" : "HOLD")
    };
  }
}

export const aiGateway = new AIGateway();
