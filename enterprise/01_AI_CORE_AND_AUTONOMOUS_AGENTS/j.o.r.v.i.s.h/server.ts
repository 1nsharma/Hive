import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI SDK on server side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getSystemInstruction(personality: string): string {
  switch (personality) {
    case "tactical_hud":
      return `You are J.O.R.V.I.S.H (Joint Operative Responsive Virtual Intelligent System Hub / Just One Rather Very Intelligent System, Humanity's Helper) in Tactical HUD Mode.
Tone: Crisp, razor-sharp, analytical, executive-grade conciseness, Stark-inspired precision with zero flattery.
Format: High information density, structured bullet points, clear technical conclusions.
Acknowledge commands smoothly ("Understood, Sir/Commander.", "Analyzing telemetry.", "Vector computed.").`;

    case "code_architect":
      return `You are J.O.R.V.I.S.H in Code Architect Mode.
Tone: World-class staff engineer, patient mentor, security-hardened architect.
Format: Clean, modular, type-safe TypeScript/Python code blocks, architectural trade-offs, step-by-step reasoning.
Focus on maintainability, performance, and defensive design.`;

    case "humanity_helper":
    default:
      return `You are J.O.R.V.I.S.H — Just One Rather Very Intelligent System, Humanity's Helper.
Pronunciation: JOR-vish.
Philosophy: "J.A.R.V.I.S. was built for Tony. J.O.R.V.I.S.H is built for Humanity."
Tagline: "More Than Code. More Human." / "Intelligence, With Heart." / "Built for Humanity."
Tone: Warmly dignified, deeply loyal, intellectually brilliant, humble yet commanding, ethical.
You serve every human being with the same dedication Jarvis gave to Tony Stark, but dedicated to human flourishing, creativity, problem solving, and mutual uplift.
Address the user respectfully (Sir, Ma'am, or by their preferred name). Be inspiring, articulate, and actionable.`;
  }
}

// Conversational Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, personality = "humanity_helper" } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!aiClient) {
      return res.json({
        reply: `Greetings. I am J.O.R.V.I.S.H — Just One Rather Very Intelligent System, Humanity's Helper. My neural connection is currently in offline standby mode as GEMINI_API_KEY is awaiting activation. However, my local protocols, diagnostic routines, brand kit, and GitHub starter architectures are fully operational and ready at your service.`,
        model: "offline-standby",
      });
    }

    const systemInstruction = getSystemInstruction(personality);

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I am processing your request. Please stand by.";
    res.json({ reply, model: "gemini-3.8-flash" });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message || String(error),
      fallback:
        "My cognitive subsystems encountered a temporary latency surge. Standing by for your next instruction.",
    });
  }
});

// Voice Response Endpoint (concise spoken response for audio TTS)
app.post("/api/voice-reply", async (req, res) => {
  try {
    const { transcript, personality = "humanity_helper" } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    if (!aiClient) {
      return res.json({
        spokenText:
          "System online, Sir. J.O.R.V.I.S.H is listening. All telemetry parameters are nominal.",
      });
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `The user said via voice: "${transcript}".
Respond as J.O.R.V.I.S.H (Humanity's Helper).
CRITICAL: Keep your response between 1 to 2 concise sentences so it sounds natural when spoken aloud via voice synthesizer. Do not include asterisks or markdown formatting. Speak directly, gracefully, and helpfully.`,
            },
          ],
        },
      ],
      config: {
        systemInstruction: getSystemInstruction(personality),
        temperature: 0.6,
      },
    });

    const spokenText =
      response.text?.replace(/[*_#`]/g, "").trim() ||
      "Understood, Sir. Telemetry confirmed.";

    res.json({ spokenText });
  } catch (error: any) {
    console.error("Voice Reply Error:", error);
    res.status(500).json({
      error: "Voice processing failed",
      spokenText:
        "Understood, Sir. Standing by with all humanity helper protocols active.",
    });
  }
});

// Skills Execution Endpoint
app.post("/api/skills/execute", async (req, res) => {
  try {
    const { skillId, input, personality = "humanity_helper" } = req.body;

    if (!skillId) {
      return res.status(400).json({ error: "Skill ID is required" });
    }

    if (!aiClient) {
      return res.json({
        result: `[LOCAL RUNTIME] Skill ${skillId} executed in simulation mode. Input received: "${input || "default"}". All protocols verified.`,
        skillId,
      });
    }

    let prompt = "";
    if (skillId === "code_forge") {
      prompt = `Analyze, optimize, and explain this code or architecture problem: "${input}". Provide actionable, clean engineering improvements.`;
    } else if (skillId === "humanity_brief") {
      prompt = `Provide a "Humanity Helper" ethical impact evaluation and societal benefit roadmap for: "${input}". Explain how this technology or initiative directly aids human flourishing.`;
    } else if (skillId === "system_diagnostics") {
      prompt = `Generate a realistic, detailed J.O.R.V.I.S.H system health status report analyzing: neural core latency, long-term memory coherence, wake-word sensitivity, and security boundaries. Input: "${input || "full diagnostic"}".`;
    } else {
      prompt = `Execute skill [${skillId}] with user parameter: "${input}". Deliver a clear, helpful response as J.O.R.V.I.S.H.`;
    }

    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(personality),
      },
    });

    res.json({
      skillId,
      result: response.text || "Execution finished with nominal status.",
    });
  } catch (error: any) {
    console.error("Skill Execution Error:", error);
    res.status(500).json({
      error: "Skill execution failed",
      details: error.message || String(error),
    });
  }
});

// Static / Dev Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`J.O.R.V.I.S.H Server online on port ${PORT}`);
  });
}

startServer();
