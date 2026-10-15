import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 image uploads
  app.use(express.json({ limit: '50mb' }));

  app.post('/api/extract-bill', async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an expert OCR and data extraction system for vehicle maintenance billing.
        Extract the billing details from this image.
        Return a JSON array of objects with the following schema:
        [{
          "date": "string (format: MMM DD YYYY)",
          "vehicleName": "string",
          "particulars": "string",
          "amount": number,
          "status": "string"
        }]
        
        Rules:
        1. "vehicleName" often includes a vehicle number like "UP78 GT 2887". Keep any names in parenthesis too if present.
        2. "particulars" should be a concatenated string of the items/services billed.
        3. "amount" must be a number (not a string).
        4. "status" might be payment status or comments like "Paid", "उधार", or "-" if blank.
        5. Return ONLY a raw JSON array, without any markdown formatting, backticks, or extra text.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          prompt,
          { inlineData: { data: imageBase64, mimeType: mimeType || 'image/jpeg' } }
        ],
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        // Fallback JSON cleanup
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }
      
      // Ensure the return is an array
      if (!Array.isArray(parsed)) {
        parsed = [parsed];
      }

      res.json({ bills: parsed });
    } catch (error: any) {
      console.error('Error processing bill:', error);
      res.status(500).json({ error: error.message || 'Failed to process bill' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
