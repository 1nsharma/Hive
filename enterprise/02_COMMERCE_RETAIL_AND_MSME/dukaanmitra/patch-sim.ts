import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

const updatedSim = `
// Simulator for WhatsApp Incoming Message -> OS Workflow
app.post("/api/whatsapp/simulate-incoming", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser ? req.dbUser.id.toString() : "1"; // Default to shop 1
    const { fromPhone, text } = req.body;
    
    // 1. AI Parse
    const prompt = \`Parse this message from shopkeeper into a JSON command: "\${text}".
Valid command types: CREATE_TRANSACTION, CREATE_PRODUCT, CREATE_CUSTOMER.
Output JSON schema: { type: "CREATE_TRANSACTION", payload: { customerId: 1, amount: 50, type: "sale", product: "maggi", quantity: 1 } }
Only output the JSON object, no markdown.
\`;

    let commandData: any = {};
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.1 }
      });
      const parsedText = response.text || "{}";
      const cleanedText = parsedText.replace(/\\\`\\\`\\\`json/g, "").replace(/\\\`\\\`\\\`/g, "").trim();
      commandData = JSON.parse(cleanedText);
    } catch (e: any) {
      if (isRateLimit(e)) {
        commandData = {
          type: "CREATE_TRANSACTION",
          payload: { customerId: 1, amount: 50, type: "sale", product: "maggi", quantity: 1 }
        };
      } else {
        throw e;
      }
    }
    
    // 2. Command Bus -> Policy -> Workflow -> Domain Event -> Database -> Agent
    const cmd: any = {
      id: \`cmd_\${Date.now()}\`,
      type: commandData.type || "CREATE_TRANSACTION",
      tenantId: shopId,
      payload: commandData.payload || {},
      timestamp: Date.now(),
      issuerId: "whatsapp_integration"
    };
    
    const events = await globalCommandBus.dispatch(cmd);
    
    res.json({ success: true, parsedCommand: cmd, generatedEvents: events });
  } catch (error: any) {
    console.error("WhatsApp Simulate Error:", error);
    res.status(500).json({ error: error.message });
  }
});
`;

content = content.replace(/\/\/ Simulator for WhatsApp Incoming Message -> OS Workflow[\s\S]*?\}\n\}\);/m, updatedSim);
fs.writeFileSync('server.ts', content);
