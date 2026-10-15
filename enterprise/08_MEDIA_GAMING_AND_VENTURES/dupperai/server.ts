import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set yet.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Dupperai Unified Engine', timestamp: new Date().toISOString() });
  });

  // 1. "Create Once, Adapt Everywhere" Master AI Pipeline Route
  app.post('/api/gemini/adapt', async (req, res) => {
    try {
      const { masterPrompt, targetAudience, goal, brandKitName } = req.body;

      if (!masterPrompt) {
        return res.status(400).json({ error: 'Master campaign prompt is required.' });
      }

      const ai = getAiClient();
      const prompt = `You are Dupperai, an enterprise content engine operating on "Create Once, Adapt Everywhere".
Adapt the following core campaign concept across 5 distinct channels: Instagram, TikTok, LinkedIn, Facebook, and Headless Web/App.

MASTER CONCEPT: "${masterPrompt}"
TARGET AUDIENCE: "${targetAudience || 'General'}"
CAMPAIGN GOAL: "${goal || 'Brand Awareness & Engagement'}"
BRAND KIT: "${brandKitName || 'Standard Brand'}"

Requirements for each channel output:
1. Instagram: Engaging caption with emojis, 5 hashtags, 1:1 image prompt, call to action, and punchy visual overlay text.
2. TikTok: Catchy title, 3-second script hook, detailed video body script, audio soundtrack vibe, voiceover script, subtitle style, estimated duration (15-30s), and 3 visual scene cues.
3. LinkedIn: Professional headline, long-form post body, 3 key takeaways, 3 carousel slides (number, title, content), CTA, and hashtags.
4. Facebook: Conversational post, link preview title & description, community question hook, banner concept.
5. Headless Web/App: Headline, summary, hero image prompt, markdown, React JSX banner snippet, and structured JSON payload.
6. A/B Testing: Variant A (hook, score 0-100, predicted CTR %), Variant B (hook, score 0-100, predicted CTR %), recommended winner ('variantA' or 'variantB'), and reasoning.

Return strictly JSON conforming to this schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignTitle: { type: Type.STRING },
              instagram: {
                type: Type.OBJECT,
                properties: {
                  caption: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  imagePrompt: { type: Type.STRING },
                  aspectRatio: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                  visualOverlayText: { type: Type.STRING },
                },
                required: ['caption', 'hashtags', 'imagePrompt', 'callToAction', 'visualOverlayText'],
              },
              tiktok: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  scriptHook: { type: Type.STRING },
                  videoBodyScript: { type: Type.STRING },
                  audioSoundtrack: { type: Type.STRING },
                  voiceoverText: { type: Type.STRING },
                  subtitleStyle: { type: Type.STRING },
                  estimatedDurationSec: { type: Type.NUMBER },
                  visualCues: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title', 'scriptHook', 'videoBodyScript', 'audioSoundtrack', 'voiceoverText', 'visualCues'],
              },
              linkedin: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  body: { type: Type.STRING },
                  keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                  carouselSlides: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        slideNumber: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        content: { type: Type.STRING },
                      },
                    },
                  },
                  callToAction: { type: Type.STRING },
                  hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['headline', 'body', 'keyTakeaways', 'carouselSlides', 'callToAction', 'hashtags'],
              },
              facebook: {
                type: Type.OBJECT,
                properties: {
                  mainText: { type: Type.STRING },
                  linkPreviewTitle: { type: Type.STRING },
                  linkPreviewDescription: { type: Type.STRING },
                  communityQuestionHook: { type: Type.STRING },
                  bannerConcept: { type: Type.STRING },
                },
                required: ['mainText', 'linkPreviewTitle', 'linkPreviewDescription', 'communityQuestionHook', 'bannerConcept'],
              },
              headless: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  heroImagePrompt: { type: Type.STRING },
                  rawMarkdown: { type: Type.STRING },
                  reactComponentSnippet: { type: Type.STRING },
                },
                required: ['title', 'summary', 'heroImagePrompt', 'rawMarkdown', 'reactComponentSnippet'],
              },
              abTesting: {
                type: Type.OBJECT,
                properties: {
                  variantA: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      hook: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      predictedCTR: { type: Type.STRING },
                      predictedConversion: { type: Type.STRING },
                    },
                  },
                  variantB: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      hook: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      predictedCTR: { type: Type.STRING },
                      predictedConversion: { type: Type.STRING },
                    },
                  },
                  recommendedWinner: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                },
                required: ['variantA', 'variantB', 'recommendedWinner', 'reasoning'],
              },
            },
            required: ['campaignTitle', 'instagram', 'tiktok', 'linkedin', 'facebook', 'headless', 'abTesting'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error in /api/gemini/adapt:', err);
      res.status(500).json({ error: err.message || 'Failed to generate cross-platform adaptation.' });
    }
  });

  // 1b. Dupperai Single Post Prompt Brain Route
  app.post('/api/gemini/post-brain', async (req, res) => {
    try {
      const { userInput, location, style, mode } = req.body;
      const ai = getAiClient();

      const prompt = `You are Dupperai's Prompt Brain for social media content creation.
User Prompt Input: "${userInput || 'Casual everyday photo'}"
Location: "${location || 'Paris'}"
Style/Vibe: "${style || 'Casual'}"
Post Mode: "${mode || 'image'}"

Generate an engaging Hinglish/English caption with appropriate emojis, 5 relevant hashtags, and a detailed photorealistic image/video prompt for AI image generation.

Return strictly JSON with this schema:
{
  "caption": "string (the main caption text in catchy Hinglish/English with emojis)",
  "hashtags": ["string"],
  "enhancedPrompt": "string (detailed photorealistic prompt for AI image/video generation)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              caption: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              enhancedPrompt: { type: Type.STRING },
            },
            required: ['caption', 'hashtags', 'enhancedPrompt'],
          },
        },
      });

      const data = JSON.parse(response.text || '{}');
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error in /api/gemini/post-brain:', err);
      res.status(500).json({ error: err.message || 'Failed to process prompt brain.' });
    }
  });

  // 2. AI Voiceover Generator Endpoint (Gemini TTS)
  app.post('/api/gemini/voice', async (req, res) => {
    try {
      const { text, voiceName = 'Kore' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text prompt is required for TTS.' });
      }

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Say clearly in a professional studio tone: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        res.json({ success: true, audioBase64: base64Audio, voiceName, mimeType: 'audio/pcm' });
      } else {
        res.status(500).json({ error: 'Audio generation failed or empty audio received.' });
      }
    } catch (err: any) {
      console.error('Error in /api/gemini/voice:', err);
      res.status(500).json({ error: err.message || 'Failed to synthesize AI voice.' });
    }
  });

  // 3. Interactive Chatbot Simulator Endpoint
  app.post('/api/gemini/chatbot', async (req, res) => {
    try {
      const { personaSystemPrompt, tone, userMessage, history = [] } = req.body;
      if (!userMessage) {
        return res.status(400).json({ error: 'User message is required.' });
      }

      const ai = getAiClient();
      const systemInstruction = `You are an AI chatbot persona for social media interactions.
Tone: ${tone || 'Friendly and professional'}
System Persona Instructions: ${personaSystemPrompt || 'Help answer customer questions concisely.'}
Keep responses under 3 sentences suitable for DMs or social media comments.`;

      const contents = history.map((h: { role: string; text: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      }));

      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ success: true, reply: response.text });
    } catch (err: any) {
      console.error('Error in /api/gemini/chatbot:', err);
      res.status(500).json({ error: err.message || 'Failed to get chatbot response.' });
    }
  });

  // 4. Headless CMS Distribution REST API Endpoint
  app.get('/api/v1/posts', (_req, res) => {
    res.json({
      status: '200 OK',
      cms_engine: 'Dupperai Headless Distribution Engine v1.0',
      total_published: 1,
      items: [
        {
          id: 'post-hd-001',
          title: '60-Second Digital Store Setup with AI Scanning',
          target_audience: 'Small Retail Merchants',
          brand: 'Dukaanmitra',
          published_at: new Date().toISOString(),
          content: {
            headline: 'Transform your physical store into a 24/7 online shop',
            summary: 'Camera AI barcode detection & catalog auto-generation for local retailers.',
            cta_url: 'https://dukaanmitra.ai/start',
            banner_code: '<MerchantBanner />',
          },
          distribution_nodes: ['instagram_api', 'linkedin_api', 'tiktok_webhook', 'headless_sdk'],
        },
      ],
    });
  });

  // Vite middleware for dev or Static serve for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dupperai Dashboard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
