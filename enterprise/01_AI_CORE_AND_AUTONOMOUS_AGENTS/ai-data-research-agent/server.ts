import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it via Settings > Secrets in the AI Studio UI.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// OpenAI-compatible client helper for Qwen / custom LLMs
async function callQwenModel(
  prompt: string,
  responseJson: boolean,
  customConfig: { apiKey?: string; apiBase?: string; model?: string }
): Promise<string> {
  const apiKey = customConfig.apiKey || process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error("Qwen API Key is missing. Please enter your Qwen/DashScope API Key in the UI or set QWEN_API_KEY in the application environment variables.");
  }

  const apiBase = (customConfig.apiBase || process.env.QWEN_API_BASE || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(/\/$/, "");
  const model = customConfig.model || process.env.QWEN_MODEL_NAME || "qwen-plus";

  const url = `${apiBase}/chat/completions`;
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  const body: any = {
    model,
    messages: [
      { role: "user", content: prompt }
    ]
  };

  if (responseJson) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 401) {
      throw new Error("Authentication with the Qwen AI Engine failed (401: Unauthorized). Please check that your Qwen / DashScope API Key is correct, active, and has not expired.");
    }
    throw new Error(`Qwen API call failed with status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Qwen API returned an empty completion response.");
  }
  return text;
}

// Endpoint to run the research agent
app.post("/api/research", async (req, res) => {
  try {
    const {
      query,
      purpose,
      format,
      fields,
      limit = 10,
      engine = "gemini",
      qwenApiKey,
      qwenApiBase,
      qwenModel
    } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: "At least one target data field is required" });
    }

    const ai = getGeminiClient();
    const modelName = "gemini-2.5-flash";

    const planningPrompt = `
You are an expert market researcher and data analyst planning a data-gathering campaign.
User wants to find data about: "${query}"
The purpose of this data is: "${purpose || "General Research"}"
We want to extract these specific fields for each record: ${JSON.stringify(fields)}

Generate 3 distinct, highly effective search queries to find this data using Google Search.
Include a brief, one-sentence explanation of why you chose these search strategies.

Respond in strict JSON format conforming to this schema:
{
  "searchQueries": [string, string, string],
  "planExplanation": string
}
    `;

    let planText = "";
    if (engine === "qwen") {
      planText = await callQwenModel(planningPrompt, true, {
        apiKey: qwenApiKey,
        apiBase: qwenApiBase,
        model: qwenModel
      });
    } else {
      const planningRes = await ai.models.generateContent({
        model: modelName,
        contents: planningPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              searchQueries: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Three targeted search queries"
              },
              planExplanation: {
                type: Type.STRING,
                description: "One-sentence research strategy"
              }
            },
            required: ["searchQueries", "planExplanation"]
          }
        }
      });
      planText = planningRes.text || "{}";
    }

    const plan = JSON.parse(planText || "{}");
    const queries: string[] = plan.searchQueries || [query];
    const planExplanation: string = plan.planExplanation || "Searching for live web resources.";

    // STEP 2: Execute Grounded Searches in parallel (Scraping/Research stage)
    // We always use Gemini for the live Google search indexing phase to leverage top-tier web grounding.
    const searchPromises = queries.map(async (q) => {
      try {
        const searchRes = await ai.models.generateContent({
          model: modelName,
          contents: `Find detailed directories, listings, lists, or raw source data regarding: ${q}. Ensure you retrieve names, links, contacts, and descriptors.`,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const rawText = searchRes.text || "";
        const chunks = searchRes.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
          .filter(chunk => chunk.web?.uri)
          .map(chunk => ({
            title: chunk.web?.title || "Web Source",
            url: chunk.web?.uri || ""
          }));

        return {
          query: q,
          rawText,
          sources,
          success: true
        };
      } catch (err) {
        console.error(`Search failed for query "${q}":`, err);
        return {
          query: q,
          rawText: "",
          sources: [],
          success: false
        };
      }
    });

    const searchResultsRaw = await Promise.all(searchPromises);
    const searchResults = searchResultsRaw.filter(r => r.success);
    
    const allCitations: Array<{ title: string; url: string }> = [];
    for (const r of searchResults) {
      for (const src of r.sources) {
        if (!allCitations.some(c => c.url === src.url)) {
          allCitations.push(src);
        }
      }
    }

    // STEP 3: Aggregate, Scrape & Extract Data
    // We pass all grounded research text to either Gemini or Qwen to clean and structure it into raw data
    const aggregatedResearchText = searchResults.map(r => `[Search Query: ${r.query}]\n${r.rawText}`).join("\n\n");
    const aggregatedSourcesStr = allCitations.map(c => `- ${c.title}: ${c.url}`).join("\n");

    const scrapingPrompt = `
You are an expert web scraping and extraction agent. Your job is to extract raw, high-quality, real database records from the following web research text.
Do not invent or hallucinate records. Only pull real entities mentioned or grounded in the search results.

Target Fields to Extract for each item: ${JSON.stringify(fields)}
Goal Limit: Extract up to ${limit} records.

Here is the grounded search and research data:
---
${aggregatedResearchText}
---
And here are the validated sources:
${aggregatedSourcesStr}

Please clean, deduplicate, and validate the extracted records. Each record must attempt to populate the requested fields. If a field is not available for an entity, write "N/A".
Provide the final output in two formats:
1. A parsed JSON array of objects, where keys correspond exactly to requested fields.
2. A formal "validation report" detailing:
   - Total raw entities found
   - Duplicates removed
   - Completeness / Quality check of the fields
   - Why this data is clean and valuable.

Respond in strict JSON format conforming to this schema:
{
  "records": [
    {
       // Keys should be the exact strings from: ${JSON.stringify(fields)}
    }
  ],
  "validation": {
    "totalFound": number,
    "duplicatesRemoved": number,
    "qualityReport": string,
    "completenessPercentage": number
  }
}
    `;

    let scrapeText = "";
    if (engine === "qwen") {
      scrapeText = await callQwenModel(scrapingPrompt, true, {
        apiKey: qwenApiKey,
        apiBase: qwenApiBase,
        model: qwenModel
      });
    } else {
      const scrapeRes = await ai.models.generateContent({
        model: modelName,
        contents: scrapingPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              records: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  description: "Cleaned data records mapped with requested fields as keys"
                }
              },
              validation: {
                type: Type.OBJECT,
                properties: {
                  totalFound: { type: Type.INTEGER },
                  duplicatesRemoved: { type: Type.INTEGER },
                  qualityReport: { type: Type.STRING },
                  completenessPercentage: { type: Type.INTEGER }
                },
                required: ["totalFound", "duplicatesRemoved", "qualityReport", "completenessPercentage"]
              }
            },
            required: ["records", "validation"]
          }
        }
      });
      scrapeText = scrapeRes.text || "{}";
    }

    const parsedScrape = JSON.parse(scrapeText || "{}");
    const records = parsedScrape.records || [];
    const validation = parsedScrape.validation || {
      totalFound: 0,
      duplicatesRemoved: 0,
      qualityReport: "Could not evaluate data quality.",
      completenessPercentage: 0
    };

    // STEP 4: Format conversion based on user selection
    let formattedRawData = "";
    if (format === "csv") {
      // Generate CSV string
      if (records.length > 0) {
        const headers = fields;
        const csvRows = [
          headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(","),
          ...records.map((rec: any) =>
            headers.map(h => {
              const val = rec[h] !== undefined ? rec[h] : "N/A";
              return `"${String(val).replace(/"/g, '""')}"`;
            }).join(",")
          )
        ];
        formattedRawData = csvRows.join("\n");
      } else {
        formattedRawData = fields.map((h: string) => `"${h}"`).join(",") + "\n";
      }
    } else if (format === "markdown") {
      // Generate markdown table
      if (records.length > 0) {
        const headers = fields;
        const headerRow = `| ${headers.join(" | ")} |`;
        const dividerRow = `| ${headers.map(() => "---").join(" | ")} |`;
        const rows = records.map((rec: any) => {
          return `| ${headers.map(h => String(rec[h] !== undefined ? rec[h] : "N/A").replace(/\|/g, '\\|')).join(" | ")} |`;
        });
        formattedRawData = [headerRow, dividerRow, ...rows].join("\n");
      } else {
        formattedRawData = "| No records found |";
      }
    } else {
      // Default JSON format
      formattedRawData = JSON.stringify(records, null, 2);
    }

    // Compile everything into a rich structured report
    return res.json({
      success: true,
      query,
      purpose,
      format,
      fields,
      plan: {
        queries,
        explanation: planExplanation
      },
      citations: allCitations,
      validation,
      records, // Parsed records for nice UI rendering
      formattedRawData // Clean raw data formatted as requested
    });

  } catch (error: any) {
    console.error("Research Agent failed:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred during the research process."
    });
  }
});

// Vite middleware setup
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
