import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf-8');

const updatedSim = `
// Simulator for WhatsApp Incoming Message -> OS Workflow
app.post("/api/whatsapp/simulate-incoming", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser ? req.dbUser.id.toString() : "1";
    const { fromPhone, text } = req.body;
    const txt = text.toLowerCase();
    
    // 1. AI Parse (Simulated/Fallback)
    let commandData: any = {};
    if (txt.includes("customer")) {
      commandData = {
        type: "CREATE_CUSTOMER",
        payload: { name: "Amit", phone: "9999999999", initialBalance: 0, notes: "WhatsApp simulated" }
      };
    } else if (txt.includes("product")) {
      commandData = {
        type: "CREATE_PRODUCT",
        payload: { name: "Maggi", stock: 100, price: 12, costPrice: 10, lowStockThreshold: 50, barcode: "123" }
      };
    } else if (txt.includes("sale")) {
      const prods = await db.select().from(products).where(eq(products.userId, parseInt(shopId))).limit(1);
      const custs = await db.select().from(customers).where(eq(customers.userId, parseInt(shopId))).limit(1);
      if (prods.length > 0 && custs.length > 0) {
        commandData = {
          type: "CREATE_TRANSACTION",
          payload: { customerId: custs[0].id, amount: 50, type: "sale", product: prods[0].name, quantity: 5 }
        };
      }
    } else if (txt.includes("low stock")) {
       const prods = await db.select().from(products).where(eq(products.userId, parseInt(shopId))).limit(1);
       if (prods.length > 0) {
         commandData = {
          type: "ADJUST_INVENTORY",
          payload: { productId: prods[0].id, quantity: 60, type: "out", notes: "Large sale" }
        };
       }
    } else {
       commandData = { type: "UNKNOWN" };
    }
    
    // 2. Command Bus -> Policy -> Workflow -> Domain Event -> Database -> Agent
    const cmd: any = {
      id: \`cmd_\${Date.now()}\`,
      type: commandData.type,
      tenantId: shopId,
      payload: commandData.payload,
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
