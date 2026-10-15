import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
// AI Catalog Suggestion
app.post("/api/ai/suggest-catalog", requireAuth, async (req: AuthRequest, res) => {
  try {
    const settings = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser!.id)).limit(1);
    
    let businessProfile = "Retail Store";
    if (settings.length > 0) {
      businessProfile = \`\${settings[0].businessName} - \${settings[0].category || settings[0].description || 'Local Shop'}\`;
    }

    const prompt = \`
You are an expert in local Indian retail businesses (Kirana, Pharmacy, Hardware, Electronics, etc.).
A shopkeeper wants to set up their inventory catalog.
Business Profile: \${businessProfile}

Please suggest a list of 10-15 common inventory items they should track.
Also provide a short personalized inventory management strategy (1-2 sentences).

Return a valid JSON object matching exactly this schema (do NOT include markdown wrappers like \`\`\`json):
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
\`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Catalog generation error:", error);
    res.status(500).json({ error: error.message });
  }
});
`;

code = code.replace('// Settings routes', newRoute + '\n// Settings routes');
fs.writeFileSync('server.ts', code);
