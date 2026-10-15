import re

with open("server.ts", "r") as f:
    content = f.read()

# Make sure we import userSettings
if "userSettings" not in content:
    content = content.replace("marketResearch, users, userLogs, aiCache }", "marketResearch, users, userLogs, aiCache, userSettings }")
    
# Add settings API
settings_api = """
// User Settings API
app.get("/api/settings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const result = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    
    if (result.length > 0) {
      res.json({ success: true, settings: result[0] });
    } else {
      res.json({ success: true, settings: null });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/settings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { businessName, phone, address, category, description } = req.body;
    
    // Check if exists
    const existing = await db.select().from(userSettings).where(eq(userSettings.userId, userId));
    
    let result;
    if (existing.length > 0) {
      result = await db.update(userSettings)
        .set({
           businessName: businessName || existing[0].businessName,
           phone: phone || existing[0].phone,
           address: address || existing[0].address,
           category: category || existing[0].category,
           description: description || existing[0].description,
           updatedAt: new Date()
        })
        .where(eq(userSettings.userId, userId))
        .returning();
    } else {
      result = await db.insert(userSettings)
        .values({
           userId,
           businessName: businessName || req.dbUser!.email,
           phone: phone || "",
           address: address || "",
           category: category || "",
           description: description || ""
        })
        .returning();
    }
    
    res.json({ success: true, settings: result[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
"""

if "/api/settings" not in content:
    content = content.replace("// AI endpoints", settings_api + "\n// AI endpoints")
    with open("server.ts", "w") as f:
        f.write(content)
    print("Added settings API endpoints to server.")
else:
    print("Settings API already exists.")
