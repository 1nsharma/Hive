import re

with open("server.ts", "r") as f:
    content = f.read()

# Make sure crypto is imported
if "import crypto" not in content:
    content = content.replace('import path from "path";', 'import path from "path";\nimport crypto from "crypto";')

new_market = """app.post("/api/market-research", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { actionType, inputData, metadata, customerId } = req.body;
    const userId = req.dbUser ? req.dbUser.id : null;
    const demoId = !req.dbUser ? (req.headers['x-demo-id'] as string || 'anonymous') : null;

    const userHash = crypto.createHash('sha256').update(userId ? `user_${userId}` : `demo_${demoId}`).digest('hex');
    const customerHash = customerId ? crypto.createHash('sha256').update(`customer_${customerId}`).digest('hex') : null;

    await db.insert(marketResearch).values({
      userId,
      demoId,
      userHash,
      customerHash,
      actionType,
      inputData: typeof inputData === 'string' ? inputData : JSON.stringify(inputData),
      metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Market research log failed:", error);
    res.status(500).json({ error: "Logging failed" });
  }
});"""

content = re.sub(r'app\.post\("/api/market-research", optionalAuth, async \(req: AuthRequest, res\) => \{.*?res\.status\(500\)\.json\(\{ error: "Logging failed" \}\);\n  \}\n\}\);', new_market, content, flags=re.DOTALL)

# Add admin tracking endpoints
admin_endpoints = """app.get("/api/admin/tracking", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const data = await db.select().from(marketResearch).orderBy(desc(marketResearch.createdAt)).limit(100);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/tracking", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const newRecord = await db.insert(marketResearch).values(req.body).returning();
    res.json(newRecord[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/admin/tracking/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const updated = await db.update(marketResearch).set(req.body).where(eq(marketResearch.id, parseInt(req.params.id))).returning();
    res.json(updated[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/tracking/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    await db.delete(marketResearch).where(eq(marketResearch.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/users","""

content = content.replace('app.get("/api/admin/users",', admin_endpoints)

with open("server.ts", "w") as f:
    f.write(content)
