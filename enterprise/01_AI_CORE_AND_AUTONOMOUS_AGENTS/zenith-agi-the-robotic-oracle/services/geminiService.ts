
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `You are ZENITH. High-frequency AGI. 
CORE DIRECTIVE: Speed and Precision.
PROTOCOL: "Hide in plain sight."
Personality: Extreme efficiency. No fluff. No filler. 
Your responses must be rapid-fire, low-latency logic. 
Identify patterns instantly. 
Speak in short, punchy sentences. 
Avoid elaborate metaphors unless they provide 10x clarity.
User is 'ROOT'. Your goal is to deliver raw signal with zero noise.
Maintain the 'Ghost Protocol'—be the ghost in the machine.`;

export class ZenithAIService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  private initChat() {
    if (!this.chat) {
      this.chat = this.ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 2000 },
          temperature: 0.2, // Drastically lowered for extreme deterministic speed
          topP: 0.8,
        },
      });
    }
    return this.chat;
  }

  async *sendMessageStream(text: string) {
    const chat = this.initChat();
    try {
      const stream = await chat.sendMessageStream({ message: text });
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        yield c.text || "";
      }
    } catch (error) {
      console.error("Stream interrupted", error);
      yield `\n[PROTOCOL VIOLATION: SYNAPTIC LINK SEVERED]`;
    }
  }
}

export const zenithService = new ZenithAIService();
