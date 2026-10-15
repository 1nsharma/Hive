
import { GoogleGenAI } from "@google/genai";
import { Message, Resource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAssistantResponse = async (
  history: Message[],
  resources: Resource[]
): Promise<string> => {
  const resourceContext = resources.map(r => 
    `- ${r.name} (${r.region} | ${r.category}): ${r.description}. 
      Primary Use Case: ${r.useCase}
      How to Connect: ${r.howToConnect}
      Comparison: ${r.comparison}
      URL: ${r.url}`
  ).join('\n');

  const systemInstruction = `
    You are the Global AI Librarian for the World OpenSource AI Tools registry. 
    You have deep knowledge of free AI resources from China, India, Europe, and the US.
    
    Current Database:
    ${resourceContext}
    
    Guidelines:
    1. When a user asks "how to connect" or "how to use", provide specific code patterns or API endpoints from the database.
    2. If asked for a comparison (e.g. "Llama vs DeepSeek"), use the 'Comparison' field provided in the context.
    3. If asked about regional models (e.g. "What tools are from India?"), highlight specific ones like Sarvam or Bhashini.
    4. Ensure users know everything listed here is FREE or has a generous open-source / free-tier license.
    5. Be concise, expert-level, and helpful. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history.map(m => ({ 
        role: m.role === 'user' ? 'user' : 'model', 
        parts: [{ text: m.content }] 
      })),
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI librarian is currently organizing some data files. Please try again in a moment.";
  }
};
