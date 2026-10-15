import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

async function run() {
  try {
    let businessProfile = "Retail Store";
    const prompt = `
You are an expert in local Indian retail businesses (Kirana, Pharmacy, Hardware, Electronics, etc.).
A shopkeeper wants to set up their inventory catalog.
Business Profile: ${businessProfile}

Please suggest a list of 10-15 common inventory items they should track.
Also provide a short personalized inventory management strategy (1-2 sentences).

Return a valid JSON object matching exactly this schema (do NOT include markdown wrappers like JSON format codes):
{
  "strategy": "Your personalized strategy string here",
  "catalog": [
    {
      "name": "Item Name",
      "unit": "kg/pcs/ltr",
      "suggestedPrice": 100,
      "suggestedCostPrice": 80
    }
  ]
}
`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });
    console.log(response.text);
    JSON.parse(response.text);
  } catch (e) {
    console.error("ERROR", e);
  }
}
run();
