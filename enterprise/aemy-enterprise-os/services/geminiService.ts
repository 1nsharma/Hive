
import { GoogleGenAI, Type } from "@google/genai";
import { Roadmap, ProjectInput } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    projectName: {
      type: Type.STRING,
      description: "A creative and fitting name for the project.",
    },
    projectDescription: {
      type: Type.STRING,
      description: "A short, engaging description of the project.",
    },
    milestones: {
      type: Type.ARRAY,
      description: "A list of development milestones.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The title of the milestone (e.g., 'Phase 1: Foundation & Core UI').",
          },
          duration: {
            type: Type.STRING,
            description: "Estimated time to complete this milestone (e.g., '2 Weeks').",
          },
          features: {
            type: Type.ARRAY,
            description: "A list of features to be implemented in this milestone.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: {
                  type: Type.STRING,
                  description: "The name of the feature.",
                },
                description: {
                  type: Type.STRING,
                  description: "A brief description of what the feature does.",
                },
              },
              required: ["name", "description"],
            },
          },
        },
        required: ["title", "duration", "features"],
      },
    },
  },
  required: ["projectName", "projectDescription", "milestones"],
};

export const generateRoadmap = async (input: ProjectInput): Promise<Roadmap> => {
  try {
    const context = `
      Project Vision: ${input.description}
      Target Audience: ${input.targetAudience || 'Not specified'}
      Preferred Tech Stack: ${input.techStack || 'Recommend based on needs'}
      Desired Timeline: ${input.timeline || 'Flexible'}
    `.trim();

    const systemPrompt = `You are an elite Software Architect and Technical Product Manager. 
    Your task is to generate a comprehensive, actionable development roadmap based on the provided project context.
    
    CRITICAL INSTRUCTIONS:
    1. If a tech stack is specified, use it to define technical features.
    2. Tailor the milestones to the desired timeline.
    3. Ensure features solve specific needs for the target audience.
    4. Structure the output strictly as a JSON object matching the schema.
    
    Context:
    ${context}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const text = response.text.trim();
    const roadmapData: Roadmap = JSON.parse(text);
    return roadmapData;

  } catch (error) {
    console.error("Error generating roadmap with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
