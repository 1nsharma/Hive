import re

with open("server.ts", "r") as f:
    content = f.read()

# Add endpoint for fetching AI logs
admin_ai_logs = """
app.get("/api/admin/ai-logs", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const logs = await db.select().from(userLogs).where(eq(userLogs.eventType, "ai_agent_action")).orderBy(sql`${userLogs.createdAt} DESC`).limit(50);
    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
"""

if "/api/admin/ai-logs" not in content:
    content = content.replace("app.get(\"/api/auth/me\"", admin_ai_logs + "\napp.get(\"/api/auth/me\"")
    with open("server.ts", "w") as f:
        f.write(content)
    print("Added /api/admin/ai-logs endpoint")
