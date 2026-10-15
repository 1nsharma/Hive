import re

with open("server.ts", "r") as f:
    content = f.read()

agent_endpoints = """
// AI Agentic Information and Logging
app.post("/api/ai/agent-log", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const { action, intent, context, status } = req.body;
    
    // Log AI Agent actions to database for tracking how the AI is interacting with the shop
    await db.insert(userLogs).values({
      userId,
      eventType: "ai_agent_action",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: JSON.stringify({ action, intent, context, status })
    });
    
    res.json({ success: true, message: "Agent log recorded" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
"""

if "/api/ai/agent-log" not in content:
    content = content.replace("// AI endpoints", agent_endpoints + "\n// AI endpoints")
    with open("server.ts", "w") as f:
        f.write(content)
    print("Added AI Agent logging endpoints.")
else:
    print("AI Agent logging endpoints already exist.")
