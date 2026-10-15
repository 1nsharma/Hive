import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const prompt = `Return a JSON object: {"catalog": [{"name": "item1"}]}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    console.log("Raw text:", response.text);
    const parsed = JSON.parse(response.text);
    console.log("Parsed:", parsed);
  } catch (e) {
    console.error(e);
  }
}
run();
