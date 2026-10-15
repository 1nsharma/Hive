import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { INITIAL_KNOWLEDGE_MAP } from "./src/data/initialMap";
import { KnowledgeMapData } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "knowledge_map_db.json");

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// Initialize Database if it doesn't exist
function initDatabase(): KnowledgeMapData {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read database, resetting to initial map:", error);
  }
  
  // Write initial map
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_KNOWLEDGE_MAP, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write initial database:", error);
  }
  return INITIAL_KNOWLEDGE_MAP;
}

// Ensure database is active
let dbState = initDatabase();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- API ROUTES ---

// 1. Get the current Knowledge Map State
app.get("/api/knowledge-map", (req, res) => {
  res.json(dbState);
});

// 2. Update the complete Knowledge Map State (Save/Persist modifications)
app.post("/api/knowledge-map", (req, res) => {
  try {
    const newState: KnowledgeMapData = req.body;
    if (!newState || !Array.isArray(newState.domains) || !Array.isArray(newState.subDomains)) {
       res.status(400).json({ error: "Invalid knowledge map structure" });
       return;
    }
    dbState = newState;
    fs.writeFileSync(DB_PATH, JSON.stringify(dbState, null, 2), "utf-8");
    res.json({ success: true, message: "Database saved successfully" });
  } catch (error: any) {
    console.error("Error saving knowledge map state:", error);
    res.status(500).json({ error: error.message || "Failed to save state" });
  }
});

// 3. AI Document Generator / Enhancer (Gemini 3.6 Flash)
app.post("/api/knowledge/generate", async (req, res) => {
  try {
    const { subDomainId, domainName, subDomainName, description, connections } = req.body;
    
    if (!subDomainId || !subDomainName) {
       res.status(400).json({ error: "Missing required parameters (subDomainId or subDomainName)" });
       return;
    }

    const prompt = `You are a world-class principal system architect and distinguished software engineer.
Generate a deeply detailed, highly professional, production-ready Markdown documentation page for the subdomain "${subDomainName}" which sits under the "${domainName}" domain.

Current Subdomain Description:
"${description}"

Existing architectural connections/context within our Knowledge Map:
${JSON.stringify(connections, null, 2)}

Requirements:
- Ensure the tone is objective, technical, and authoritative. Avoid generic verbs like "supercharge" or "empower".
- Use beautiful, modern typography conventions: use appropriate bold terms, list groupings, and spacing.
- Include a practical architecture blueprint diagram (using clean ASCII block art or text-based flow diagram).
- Include standard industry patterns, trade-offs, and critical considerations.
- Include a highly specific, actionable engineering checklist using markdown checkboxes (e.g. - [ ] Task name).
- Explicitly trace how this subdomain interacts with other domains (Architecture, Databases, Security, APIs, etc.).

Please output ONLY the raw Markdown content. Do not wrap the response in markdown code blocks like \`\`\`markdown or \`\`\`. Start immediately with the "# ${subDomainName}" heading.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional technical documentation generator. You output pure, raw Markdown files without any surrounding conversational text or codeblock wrappers.",
      },
    });

    let markdown = response.text || "";
    // Clean up any stray markdown backticks if Gemini accidentally included them
    markdown = markdown.replace(/^```markdown\n/, "").replace(/\n```$/, "").trim();

    // Update the subdomain content in our memory state and file database
    const subIdx = dbState.subDomains.findIndex(s => s.id === subDomainId);
    if (subIdx !== -1) {
      dbState.subDomains[subIdx].content = markdown;
      dbState.subDomains[subIdx].status = 'completed';
      dbState.subDomains[subIdx].lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_PATH, JSON.stringify(dbState, null, 2), "utf-8");
    }

    res.json({
      success: true,
      content: markdown,
      subDomain: subIdx !== -1 ? dbState.subDomains[subIdx] : null
    });

  } catch (error: any) {
    console.error("Gemini documentation generation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate documentation with Gemini" });
  }
});

// 4. AI Connection Suggester (Gemini 3.6 Flash - Structured JSON output)
app.post("/api/knowledge/suggest-connections", async (req, res) => {
  try {
    // Collect brief metadata of all existing subdomains to pass to Gemini
    const subdomainsMeta = dbState.subDomains.map(s => ({
      id: s.id,
      name: s.name,
      domainId: s.domainId,
      description: s.description
    }));

    const existingConnections = dbState.connections.map(c => ({
      sourceId: c.sourceId,
      targetId: c.targetId,
      type: c.type
    }));

    const prompt = `You are a Principal Software Architect analyzing a system knowledge map.
Analyze the following subdomains in our technology stack and suggest exactly 3 new high-value, logical cross-domain connections that are NOT already connected.

Existing subdomains:
${JSON.stringify(subdomainsMeta, null, 2)}

Currently existing connections:
${JSON.stringify(existingConnections, null, 2)}

Each suggested connection must map a relationship between two subdomains across DIFFERENT domains (e.g., connecting a Database subdomain to an API or Security subdomain).
Provide a precise, technical explanation of why this connection is vital in modern enterprise engineering.

Types of connection allowed: 'dependency', 'data-flow', 'security', 'integration'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of suggested cross-domain connections.",
          items: {
            type: Type.OBJECT,
            properties: {
              sourceId: {
                type: Type.STRING,
                description: "The ID of the source subdomain"
              },
              targetId: {
                type: Type.STRING,
                description: "The ID of the target subdomain"
              },
              description: {
                type: Type.STRING,
                description: "A professional, concise 1-2 sentence explanation of the technical relationship and why it connects."
              },
              type: {
                type: Type.STRING,
                description: "The relationship classification type: 'dependency', 'data-flow', 'security', 'integration'"
              }
            },
            required: ["sourceId", "targetId", "description", "type"]
          }
        }
      }
    });

    const suggestionsText = response.text || "[]";
    const suggestions = JSON.parse(suggestionsText);

    res.json({ success: true, suggestions });
  } catch (error: any) {
    console.error("AI connection suggestions error:", error);
    res.status(500).json({ error: error.message || "Failed to generate suggestions" });
  }
});

// 5. AI Copilot Chat (Grounding conversation directly in documentation)
app.post("/api/knowledge/ask-copilot", async (req, res) => {
  try {
    const { message, activeSubDomainId } = req.body;
    
    if (!message) {
       res.status(400).json({ error: "Missing message query" });
       return;
    }

    // Build the grounding context out of the actual database state!
    let activeDocContext = "";
    if (activeSubDomainId) {
      const doc = dbState.subDomains.find(s => s.id === activeSubDomainId);
      if (doc) {
        activeDocContext = `User is currently viewing the "${doc.name}" documentation:\n\n${doc.content}\n\n`;
      }
    }

    // Include summaries of all other subdomains for global context
    const globalContext = dbState.subDomains.map(s => 
      `- Subdomain: ${s.name} (Domain: ${s.domainId}). Description: ${s.description}`
    ).join("\n");

    const systemInstruction = `You are the ultimate Engineering AI Copilot inside a Master Knowledge Map.
Your goal is to answer technical, architectural, and design questions with absolute authority, relying directly on the provided system context.

Knowledge Map Context:
${globalContext}

${activeDocContext ? `CURRENT FOCUS CONTEXT:\n${activeDocContext}` : ""}

Answer guidelines:
- Synthesize responses using exact concepts in the knowledge map.
- If the user asks about system integration or workflows, draw connections between subdomains.
- Provide clean, elegant code snippets, data models, or design patterns where appropriate.
- Keep the tone highly professional, precise, and educational.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({
      success: true,
      answer: response.text || "I was unable to compile an answer at this moment."
    });

  } catch (error: any) {
    console.error("AI Copilot Error:", error);
    res.status(500).json({ error: error.message || "Failed to process request" });
  }
});

// --- VITE DEV / PRODUCTION MIDDLEWARE ---

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
    console.log(`Master Knowledge Map Fullstack Server booting on port ${PORT}`);
  });
}

startServer();
