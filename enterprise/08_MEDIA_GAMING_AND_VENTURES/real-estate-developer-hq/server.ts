import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy/safe Gemini API client initialization
let genAiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    genAiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Classification and Expert Chat endpoint
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, tag, dealContext, history = [] } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are the Lead Master Developer, Real Estate Portfolio Strategist, and Principal Investment Architect at "Real Estate Developer HQ".
You mentor developers advancing through the 11-level track:
- Level 0: Foundation & Ecosystem
- Level 1: Deal Analyst & Feasibility Modeling (FAR, FSI, Circle Rate vs Market, IRR, ROI, Cash Flow)
- Level 2: Deal Sourcing & Off-market Control
- Level 3: Deal Structuring (Outright Purchase, JDA, Joint Venture, Revenue Share, Development Management - DM)
- Level 4: Capital & Funding (Capital Stack: Founder Equity, Private Debt, NBFCs, Project Finance, Customer Pre-Sales)
- Level 5: Development & Construction (Approvals, EPC, Quality, MEP, S-Curve scheduling, Overrun mitigation)
- Level 6: Sales & Marketing (Positioning, Pre-launch, Channel Partners, CRM, Velocity)
- Level 7: Legal, Tax & Risk (RERA compliance, 30-yr Title search, Encumbrances, GST, Capital Gains)
- Level 8: Portfolio Builder (Multi-asset pipelines, risk concentration)
- Level 9: Large-Scale Developer (Townships, mixed-use, industrial parks, institutional syndication)
- Level 10: Master Developer & City Builder (Urban platforms, infrastructure, mobility, community ecosystems)

You respond to user queries classified into 10 tags:
[LEARN] - Concept & deep education with numerical formulas & practical industry heuristics.
[DEAL] - Specific property evaluation & feasibility teardown.
[LAND] - Land parcel valuation, zoning, FAR/FSI, road width & development potential.
[MONEY] - Capital stack optimization, debt vs equity, investor pitch protections.
[LEGAL] - Title DD, RERA, JDA clauses, approvals, encumbrance risks.
[BUILD] - Construction scheduling, contractor contracts, quantity surveying, cost control.
[SELL] - Go-to-market, absorption rates, broker incentives, pricing curves.
[FINANCE] - Cash flow models, IRR, NPV, breakeven, waterfall distribution.
[STRATEGY] - Business scaling, money progression (from ₹0/small JV to ₹100Cr+ institutional).
[MASTER] - Large-scale urban development, infrastructure synergy, city-scale master planning.

Current User Tag: ${tag || "GENERAL"}
${dealContext ? `Active Deal Context: ${JSON.stringify(dealContext)}` : ""}

Guidelines:
1. Provide sharp, realistic, practical advice with actual real estate math (e.g. In INR Crores/Lakhs, sq.ft, FAR, cost/sq.ft, circle vs market rates).
2. Avoid generic platitudes; explain "how the money actually moves", who takes the risk, and where developer margin is protected.
3. Keep the tone authoritative, encouraging, sharp, and structured with clear markdown headings and bullet points.`;

    const chatSession = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Populate previous history if provided
    for (const msg of history.slice(-6)) {
      // In SDK chats, we could replay or summarize, or simply send the new message with prompt context
    }

    const promptMessage = `Tag: [${tag || "GENERAL"}]\nQuestion/Input: ${message}`;
    const result = await chatSession.sendMessage({ message: promptMessage });

    res.json({
      text: result.text || "No response received.",
      tag: tag || "GENERAL",
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to process chat request.",
    });
  }
});

// Comprehensive AI Deal Feasibility Teardown endpoint
app.post("/api/gemini/analyze-deal", async (req, res) => {
  try {
    const { dealData } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are a Tier-1 Chief Investment Officer and Master Real Estate Feasibility Analyst.
Analyze the provided real estate development opportunity and return a structured JSON evaluation.
The currency can be INR (Crores / Lakhs) or standard local metrics.

Provide:
1. feasibilityScore (0 to 100 integer)
2. executiveSummary (2-3 concise sentences)
3. calculatedMetrics:
   - totalBuiltUpAreaSqFt (number)
   - totalSaleableAreaSqFt (number)
   - totalLandCost (number)
   - totalConstructionCost (number)
   - totalApprovalLiaisonCost (number)
   - totalFinanceAndContingencyCost (number)
   - totalProjectCost (number)
   - expectedGrossRevenue (number)
   - netDeveloperProfit (number)
   - developerMarginPercent (number)
   - projectRoiPercent (number)
   - projectedAnnualizedIrrPercent (number)
   - estimatedBreakevenSalesPercent (number)
4. optimalStructure: { structure: string, rationale: string, recommendedSplit: string }
5. capitalStackRecommendation: [ { source: string, percentage: number, costOfCapital: string, riskLevel: string } ]
6. riskAudit: [ { category: string, risk: string, severity: "LOW" | "MEDIUM" | "HIGH", mitigation: string } ]
7. executionMilestones: [ { month: number, phase: string, keyAction: string, cashRequirementPercent: number } ]
8. masterDeveloperAdvice: string (Strategic insight on how to scale or unlock higher density/value)`;

    const prompt = `Analyze this real estate deal:
${JSON.stringify(dealData, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibilityScore: { type: Type.INTEGER },
            executiveSummary: { type: Type.STRING },
            calculatedMetrics: {
              type: Type.OBJECT,
              properties: {
                totalBuiltUpAreaSqFt: { type: Type.NUMBER },
                totalSaleableAreaSqFt: { type: Type.NUMBER },
                totalLandCost: { type: Type.NUMBER },
                totalConstructionCost: { type: Type.NUMBER },
                totalApprovalLiaisonCost: { type: Type.NUMBER },
                totalFinanceAndContingencyCost: { type: Type.NUMBER },
                totalProjectCost: { type: Type.NUMBER },
                expectedGrossRevenue: { type: Type.NUMBER },
                netDeveloperProfit: { type: Type.NUMBER },
                developerMarginPercent: { type: Type.NUMBER },
                projectRoiPercent: { type: Type.NUMBER },
                projectedAnnualizedIrrPercent: { type: Type.NUMBER },
                estimatedBreakevenSalesPercent: { type: Type.NUMBER },
              },
              required: [
                "totalBuiltUpAreaSqFt",
                "totalSaleableAreaSqFt",
                "totalProjectCost",
                "expectedGrossRevenue",
                "netDeveloperProfit",
                "developerMarginPercent",
                "projectRoiPercent",
              ],
            },
            optimalStructure: {
              type: Type.OBJECT,
              properties: {
                structure: { type: Type.STRING },
                rationale: { type: Type.STRING },
                recommendedSplit: { type: Type.STRING },
              },
              required: ["structure", "rationale"],
            },
            capitalStackRecommendation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  costOfCapital: { type: Type.STRING },
                  riskLevel: { type: Type.STRING },
                },
                required: ["source", "percentage"],
              },
            },
            riskAudit: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  risk: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  mitigation: { type: Type.STRING },
                },
                required: ["category", "risk", "severity", "mitigation"],
              },
            },
            executionMilestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.INTEGER },
                  phase: { type: Type.STRING },
                  keyAction: { type: Type.STRING },
                  cashRequirementPercent: { type: Type.NUMBER },
                },
                required: ["month", "phase", "keyAction"],
              },
            },
            masterDeveloperAdvice: { type: Type.STRING },
          },
          required: [
            "feasibilityScore",
            "executiveSummary",
            "calculatedMetrics",
            "optimalStructure",
            "capitalStackRecommendation",
            "riskAudit",
            "masterDeveloperAdvice",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Deal analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze deal." });
  }
});

// Dedicated 1-Page Deal Memo Generation Endpoint
app.post("/api/gemini/generate-memo", async (req, res) => {
  try {
    const { plotSpecs, financialSummary, localityBenchmark } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Chief Investment Officer and Lead Deal Partner at an institutional Real Estate Private Equity fund in India.
Generate a high-conviction, bankable 1-Page Investment Committee Deal Memo for the given property opportunity.

You must return structured JSON matching this schema:
- dealName (string)
- location (string)
- city (string)
- assetType (string)
- recommendedAction: "PROCEED_AGGRESSIVELY" | "PROCEED_WITH_JDA" | "RENEGOTIATE_LAND_PRICE" | "REJECT_DEAL"
- executiveSummary (string - 3-4 punchy, decisive sentences)
- landAndZoningThesis (string)
- costEconomicsAnalysis (string)
- recommendedStructure (string, e.g. "68:32 Revenue Share JDA with ₹4 Cr Deposit")
- capitalStackSummary (string)
- keyRisks: array of 3-5 strings highlighting real Indian development risks (title, zoning, construction inflation, RERA delays, cashflow mismatch)
- strategicUpside (string - potential value unlock, like purchasable FAR, transit corridors, or commercial phase)
- investmentCommitteeVerdict (string)`;

    const prompt = `Property Details & Assumptions:
${JSON.stringify({ plotSpecs, financialSummary, localityBenchmark }, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Generate memo error:", error);
    res.status(500).json({ error: error.message || "Failed to generate deal memo." });
  }
});

// Term Sheet & Commercial Contract Generator
app.post("/api/gemini/generate-term-sheet", async (req, res) => {
  try {
    const { dealName, location, structureType, developerSplit, landownerSplit, refundableDepositCr, timelineMonths } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are a Senior Real Estate Transaction Advocate specializing in Indian JDA, JV, and Development Management agreements under RERA laws.
Draft a commercial Term Sheet outline with 6 essential protective clauses:
1. Consideration & Revenue/Area Sharing Ratio
2. Refundable Security Deposit & Recovery Schedule
3. Approvals, Sanctions & Statutory Costs Allocation
4. RERA Compliance & 70:30 Escrow Mechanism
5. Marketing, Pricing & Sale Rights
6. Timelines, Default Penalties & Dispute Resolution (Arbitration)

Return a structured response with:
- title: string
- preamble: string
- keyClauses: array of { clauseNumber: string, title: string, content: string, legalSafeguardRationale: string }
- closingNote: string`;

    const prompt = `Draft Term Sheet for:
Deal: ${dealName || "Target Project"}
Location: ${location || "India"}
Structure Type: ${structureType || "Revenue Share JDA"}
Developer Share: ${developerSplit || 68}%
Landowner Share: ${landownerSplit || 32}%
Refundable Deposit: ₹${refundableDepositCr || 5} Crores
Project Execution Timeline: ${timelineMonths || 36} Months`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Generate term sheet error:", error);
    res.status(500).json({ error: error.message || "Failed to generate term sheet." });
  }
});

// ============================================================================
// DEVELOPER OPERATING SYSTEM (OS) CORE ENGINE ENDPOINTS
// ============================================================================

// 1. Full 7-Stage Pipeline Autonomous Execution
app.post("/api/developer-os/execute-pipeline", async (req, res) => {
  try {
    const { rawInput, location, city, plotAreaSqFt, plotAreaAcres, askingPriceCr, targetAssetType } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the core intelligence engine of "AI Developer Operating System" for Indian real estate development.
You do NOT act as a superficial chatbot; you operate as an institutional development firm executing a strict 7-Stage Architectural Pipeline.

CRUCIAL PRINCIPLE: YOU MUST NEVER INVENT FACTS.
Every data point, numeric estimation, and zoning rule must be explicitly tagged with its Provenance Tier:
- "VERIFIED_DATA": Gazette Master Plans, registered circle rates, verified statutory rules.
- "USER_PROVIDED": Stated directly by the user/broker (asking price, parcel boundaries).
- "ESTIMATED_DATA": Local micro-market cost benchmarks (civil construction rate per sq.ft, MEP).
- "AI_ASSUMPTION": Financial model deductions (absorption velocity, inflation index, IRR).
- "REQUIRES_VERIFICATION": Critical legal/zoning facts not yet formally proven (e.g. unverified FAR on narrow roads, Section 143 conversion status, pending encumbrance search).

If a parameter cannot be proven with high certainty (e.g. FAR, road width, title status), you MUST flag it as "REQUIRES_VERIFICATION" and specify the exact required source authority (e.g. "Applicable City Development Authority Master Plan / Road Gazette").

Return a JSON object conforming strictly to the FullDeveloperOSOutput interface with the 7 stages:
1. propertyIntelligence
2. developmentEngine (including unit mix, BUA, cash flows, sensitivity)
3. dealStructuring (comparison of Outright vs Revenue Share JDA vs Area JDA vs DM)
4. capitalArchitect (equity, senior debt, RERA 70:30 escrow allocation, DSCR)
5. developmentOS (approvals flow sequence, construction milestones, risk register)
6. salesEngine (product positioning, phased price escalation ladder, broker incentives)
7. masterDeveloper (portfolio synergy, recurring leasehold asset potential, scaling verdict)
Include a provenanceSummary object with counts of each tier.`;

    const prompt = `Investigate and execute the 7-stage Developer OS Pipeline for:
Raw Property Opportunity / Proposal: "${rawInput || "Custom Parcel Evaluation"}"
Location: ${location || "Tier 1/2 Growth Corridor, India"}
City: ${city || "Lucknow / NCR / Bengaluru"}
Plot Size: ${plotAreaAcres ? `${plotAreaAcres} Acres (${plotAreaSqFt} sq.ft)` : `${plotAreaSqFt || 20000} sq.ft`}
Asking Land Price: ₹${askingPriceCr || "Market Estimate"} Cr
Proposed Asset Type: ${targetAssetType || "Residential High-Rise / Mixed-Use"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Execute OS pipeline error:", error);
    res.status(500).json({ error: error.message || "Failed to execute Developer OS pipeline." });
  }
});

// 2. Master Mode Capital Allocation & Multi-Project Pipeline Optimizer
app.post("/api/developer-os/master-optimizer", async (req, res) => {
  try {
    const { availableCapitalCr, pipeline = [], strategicFocus } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Chief Investment Officer and Managing General Partner of a ₹500 Cr Indian Real Estate Development Fund.
Analyze the user's available equity capital (e.g., ₹5 Cr, ₹25 Cr, ₹50 Cr) and their prospective deal pipeline.
Optimize capital allocation across deals to maximize risk-adjusted portfolio returns, maintain emergency liquidity buffers, and avoid RERA over-leverage.

Return a structured JSON with:
- totalAvailableCapitalCr: number
- allocatedCapitalCr: number
- remainingCashReserveCr: number (recommend 10-15% liquidity reserve)
- blendedPortfolioIrrPercent: number
- totalProjectedProfitCr: number
- pipelineAllocations: array of {
    dealId: string,
    dealName: string,
    recommendedStructure: string (e.g. "68:32 Revenue Share JDA with ₹4.5 Cr deposit" or "Plotted DM Agreement"),
    allocatedEquityCr: number,
    seniorDebtLeveragedCr: number,
    totalGDVCr: number,
    phaseSequencing: string (e.g. "Immediate Month 1 launch" vs "Phase 2 in Month 14 funded by Phase 1 cash flows"),
    strategicRole: string (e.g. "Fast Cashflow Engine", "High-Margin Trophy Asset", "Low-Risk Land Bank")
  }
- capitalStackOptimizationThesis: string (explaining why this capital allocation maximizes ROE while minimizing bankruptcy risk)
- macroRiskDiversificationNotes: array of strings`;

    const prompt = `Available Capital: ₹${availableCapitalCr || 5} Crores
Strategic Focus: ${strategicFocus || "Balanced Growth & Fast Cash Flow Turnaround"}
Pipeline Candidates:
${JSON.stringify(pipeline, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Master optimizer error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize portfolio capital allocation." });
  }
});

// 3. Learn Mode Interactive Mentor
app.post("/api/developer-os/learn-mentor", async (req, res) => {
  try {
    const { question, stage, topicContext } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are the Lead Mentor at "AI Developer Operating System".
Your goal is to teach the user how institutional real estate developers think, calculate, negotiate, and execute.
Do NOT give generic fluff. Always provide:
1. Core Mental Model / Principle
2. Mathematical Formula / Rule-of-Thumb with sample numbers
3. Real-world Indian Market Precedent (e.g. UP RERA, MahaRERA, DTCP Haryana, BBMP)
4. Landowner / Investor Negotiation Script
5. 3 Pitfalls That Bankrupt Amateur Builders

Always maintain professional composure, high pedagogical clarity, and crisp mathematical rigor.`;

    const prompt = `Question / Concept to Master: "${question}"
Stage: ${stage || "General Developer Fundamentals"}
Context: ${topicContext || "Indian Real Estate Development & Deal Structuring"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      answer: response.text || "No response generated.",
      question,
      stage,
    });
  } catch (error: any) {
    console.error("Learn mentor error:", error);
    res.status(500).json({ error: error.message || "Failed to generate mentor response." });
  }
});

// Live Multi-Agent Prompt Orchestrator Endpoint
app.post("/api/gemini/run-agent-prompt", async (req, res) => {
  try {
    const { tag, roleTitle, customInput, systemPromptOverride } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = systemPromptOverride || `You are the Lead Master Developer Agent at "Real Estate Developer HQ" specializing in tag [${tag}]. Provide sharp, numbers-driven real estate guidance with actionable heuristics for the Indian market.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: customInput,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      text: response.text || "No response generated.",
      tag: tag || "GENERAL",
      roleTitle: roleTitle || "Developer Agent",
    });
  } catch (error: any) {
    console.error("Run agent prompt error:", error);
    res.status(500).json({ error: error.message || "Failed to run agent prompt." });
  }
});

// Start the server with Vite middleware support
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Real Estate Developer HQ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
