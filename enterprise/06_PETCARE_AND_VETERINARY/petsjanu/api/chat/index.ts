import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAI() {
  const key = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!aiClient && key) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export default async function handler(req: Request, res: Response) {
  // CORS Headers for Vercel Serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, petName, petSpecies } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const ai = getAI();

  if (ai) {
    try {
      const prompt = `User pet parent question for ${petName || 'Buddy'} (${petSpecies || 'Dog'}): "${message}"\n\nProvide a warm, reassuring, highly practical response. If health symptoms are mentioned, categorize into risk level: LOW, MONITOR, VET RECOMMENDED, or URGENT, and provide immediate step-by-step advice. Always include a disclaimer that this does not replace in-person veterinary diagnosis.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || 'Thank you for asking. Please keep a close watch on your pet and ensure they have clean water.';

      return res.status(200).json({
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Gemini API call failed, using smart fallback', err);
    }
  }

  // Fallback intelligent responses if API key is not configured or fails
  const q = message.toLowerCase();
  let text = '';
  let riskLevel: 'LOW' | 'MONITOR' | 'VET RECOMMENDED' | 'URGENT' = 'LOW';

  if (q.includes('vomit') || q.includes('diarrhea') || q.includes('blood') || q.includes('choking') || q.includes('poison')) {
    riskLevel = 'URGENT';
    text = `🚨 **Risk Level: URGENT**\n\nBased on your description ("${message}"), your pet should be evaluated by a veterinarian or emergency clinic promptly.\n\n**Immediate Steps:**\n1. Do NOT induce vomiting unless specifically instructed by a vet.\n2. Keep your pet calm and warm in a quiet area.\n3. Keep water accessible but do not force drinking.\n4. Call your nearest emergency vet clinic right away.\n\n*Disclaimer: AI guidance is for preliminary triage only and cannot replace professional clinical examination.*`;
  } else if (q.includes('eating') || q.includes('appetite') || q.includes('scratch') || q.includes('lethargic') || q.includes('limp')) {
    riskLevel = 'MONITOR';
    text = `🟡 **Risk Level: MONITOR**\n\nMild changes in behavior or appetite warrant close observation for 12-24 hours.\n\n**Care Recommendations:**\n1. Provide fresh filtered water and a bland diet (boiled chicken breast and plain white rice).\n2. Restrict heavy running or jumping.\n3. Note any worsening signs such as fever or refusal to drink.\n\n*Disclaimer: If symptoms persist beyond 24 hours, schedule an in-person vet checkup.*`;
  } else if (q.includes('diet') || q.includes('food') || q.includes('kibble') || q.includes('treat')) {
    riskLevel = 'LOW';
    text = `🟢 **Care & Nutrition Guidance**\n\nFor a balanced diet, ensure high-quality protein makes up at least 60% of their daily meal. Transition to any new food brand gradually over 7-10 days to prevent digestive upset.\n\n**Foods to strictly avoid:** Onions, garlic, grapes, raisins, chocolate, avocado, and xylitol sweetener.`;
  } else {
    riskLevel = 'LOW';
    text = `🟢 **PetGuardian AI Advice for ${petName || 'your pet'}**\n\nThanks for reaching out! Keeping a regular routine of exercise, mental stimulation, and timely vaccinations is key to a long, happy life for your pet.\n\nIs there any specific behavior, diet question, or medical symptom you would like to discuss further?`;
  }

  return res.status(200).json({
    sender: 'ai',
    text,
    riskLevel,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
}
