import re

with open("server.ts", "r") as f:
    content = f.read()

# Find the AI catalog handler
catalog_regex = r'app\.post\("/api/ai/suggest-catalog", optionalAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?\}\);'

new_catalog_handler = """app.post("/api/ai/suggest-catalog", optionalAuth, async (req: AuthRequest, res) => {
  try {
    let businessProfile = "Retail Store";
    if (req.dbUser) {
      const settings = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser.id)).limit(1);
      if (settings.length > 0) {
        businessProfile = `${settings[0].businessName} - ${settings[0].category || settings[0].description || 'Local Shop'}`;
      }
    }
    
    // First check AI Cache to save API calls
    const cacheKey = `catalog_${businessProfile}`;
    const cached = await db.select().from(aiCache).where(eq(aiCache.promptHash, cacheKey)).limit(1);
    
    if (cached.length > 0) {
      // Increase hit count
      await db.update(aiCache)
        .set({ hitCount: cached[0].hitCount + 1 })
        .where(eq(aiCache.id, cached[0].id));
      
      const parsed = JSON.parse(cached[0].response);
      return res.json(parsed);
    }

    // Generate large static seed combined with AI strategy
    const { seedCatalog } = await import("./src/db/catalog-seed.ts");
    
    // Call AI just for the business strategy and a few custom items
    let customStrategy = "Maintain a good mix of essential staples and fast-moving FMCG goods. Monitor expiration dates closely.";
    let customItems = [];
    
    try {
        const prompt = `Provide a 2-sentence inventory management strategy for a ${businessProfile} in India. Also give 5 specific high-margin products that this exact business type should sell.
JSON format:
{
  "strategy": "...",
  "catalog": [{"name":"...","unit":"...","suggestedPrice":100,"suggestedCostPrice":80}]
}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.2 }
        });
        const parsed = JSON.parse(response.text() || "{}");
        if (parsed.strategy) customStrategy = parsed.strategy;
        if (parsed.catalog && Array.isArray(parsed.catalog)) customItems = parsed.catalog;
    } catch (e) {
        console.error("AI mini-generation failed, falling back to static", e);
    }
    
    const finalData = {
        strategy: customStrategy,
        catalog: [...customItems, ...seedCatalog]
    };
    
    // Save to Cache
    await db.insert(aiCache).values({
        promptHash: cacheKey,
        response: JSON.stringify(finalData),
        type: 'text'
    });
    
    res.json(finalData);
  } catch (error: any) {
    console.error("AI Catalog Error:", error);
    res.status(500).json({ error: error.message });
  }
});"""

content = re.sub(catalog_regex, new_catalog_handler, content)

with open("server.ts", "w") as f:
    f.write(content)

