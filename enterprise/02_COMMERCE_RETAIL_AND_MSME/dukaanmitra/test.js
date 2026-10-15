import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hello",
    });
    console.log(response.text);
  } catch (e) {
    console.error(e);
  }
}
run();
