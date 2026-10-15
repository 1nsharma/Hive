
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you would want to handle this more gracefully.
    // For this example, we'll throw an error if the key is missing.
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        backend: {
            type: Type.OBJECT,
            properties: {
                language: { type: Type.STRING },
                code: { type: Type.STRING },
            },
            required: ['language', 'code'],
        },
        frontend: {
            type: Type.OBJECT,
            properties: {
                language: { type: Type.STRING },
                code: { type: Type.STRING },
            },
             required: ['language', 'code'],
        },
        aiIntegration: {
            type: Type.OBJECT,
            properties: {
                language: { type: Type.STRING },
                code: { type: Type.STRING },
            },
             required: ['language', 'code'],
        },
        deployment: {
            type: Type.OBJECT,
            properties: {
                platform: { type: Type.STRING },
                steps: { type: Type.STRING },
            },
             required: ['platform', 'steps'],
        },
    },
    required: ['backend', 'frontend', 'aiIntegration', 'deployment'],
};


export const generateCode = async (prompt: string): Promise<GeneratedCode> => {
    const fullPrompt = `
You are an AI-powered full-stack development expert. Your goal is to help users generate code snippets for their application ideas.

Based on the user's request: "${prompt}", generate four distinct code/text snippets.

1.  A backend snippet using FastAPI in Python. Keep it simple and focused on the core idea.
2.  A frontend snippet using React with TypeScript and Tailwind CSS. It should be a single component that could plausibly connect to the backend.
3.  An AI integration snippet for the FastAPI backend using the 'google-generativeai' library for Python to add a smart feature related to the user's request.
4.  A short, clear, step-by-step text description of deployment steps for a platform like Fly.io or Vercel.

Return the response ONLY as a valid JSON object matching the provided schema. Do not include any markdown formatting like \`\`\`json.
`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Basic validation to ensure the parsed object matches the expected structure
        if (
            parsedJson.backend &&
            parsedJson.frontend &&
            parsedJson.aiIntegration &&
            parsedJson.deployment
        ) {
            return parsedJson as GeneratedCode;
        } else {
            throw new Error("Generated JSON does not match the expected structure.");
        }

    } catch (error) {
        console.error("Error generating code with Gemini:", error);
        throw new Error("Failed to generate code. Please check your API key and try again.");
    }
};