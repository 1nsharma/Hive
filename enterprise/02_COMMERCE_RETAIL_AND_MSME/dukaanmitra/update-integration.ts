import fs from 'fs';

let integration = fs.readFileSync('src/os-core/os-database-integration.ts', 'utf-8');

// Ensure import
if (!integration.includes('sendWhatsAppMessage')) {
  integration = integration.replace(
    /import { inventoryAgent } from '\.\.\/agents\/inventory-agent\.js';/,
    "import { inventoryAgent } from '../agents/inventory-agent.js';\nimport { sendWhatsAppMessage } from '../whatsapp/index.js';"
  );
}

const appendCode = `
  // 4. ADJUST INVENTORY
  globalCommandBus.registerHandler('ADJUST_INVENTORY' as any, {
    handle: async (command: Command) => {
      const { productId, quantity, type, notes } = command.payload;
      const userId = parseInt(command.tenantId);
      
      const prodResult = await db.select().from(products).where(and(eq(products.id, parseInt(productId)), eq(products.userId, userId)));
      if (prodResult.length === 0) throw new Error("Product not found");
      const product = prodResult[0];

      const qtyNum = Number(quantity) || 0;
      let newStock = product.stock;
      if (type === "in") newStock += qtyNum;
      else if (type === "out") newStock = Math.max(0, newStock - qtyNum);

      const updatedProd = await db.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, product.id)).returning();
      
      await db.insert(stockTransactions).values({
        userId,
        productId: product.id,
        productName: product.name,
        quantity: qtyNum,
        type,
        date: new Date().toISOString(),
        notes: notes || ""
      });

      const eventType = type === 'in' ? 'INVENTORY_RESTOCKED' : 'INVENTORY_DEDUCTED';
      const event: DomainEvent = {
        id: \`evt_\${Date.now()}\`,
        type: eventType as any,
        tenantId: command.tenantId,
        payload: { record: updatedProd[0] },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);

      if (newStock <= product.lowStockThreshold) {
        const lowStockEvent: DomainEvent = {
          id: \`evt_low_\${Date.now()}\`,
          type: 'INVENTORY_LOW',
          tenantId: command.tenantId,
          payload: { item: product.name, currentStock: newStock, requiredStock: product.lowStockThreshold * 3 },
          timestamp: Date.now(),
          sourceId: 'system_monitor'
        };
        globalEventBus.publish(lowStockEvent);
      }

      return [event];
    }
  });

  // 5. SEND WHATSAPP
  globalCommandBus.registerHandler('SEND_WHATSAPP' as any, {
    handle: async (command: Command) => {
      const { phone, messageText, shopId } = command.payload;
      await sendWhatsAppMessage(shopId, phone, messageText);

      const event: DomainEvent = {
        id: \`evt_\${Date.now()}\`,
        type: 'WHATSAPP_SENT' as any,
        tenantId: command.tenantId,
        payload: { phone, shopId },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });
`;

integration = integration.replace(/globalEventBus\.subscribe\('CUSTOMER_CREATED' as any, async \(event\) => \{/m, `${appendCode}\n\n  // Connect EventBus to Projections\n  globalEventBus.subscribe('CUSTOMER_CREATED' as any, async (event) => {`);

fs.writeFileSync('src/os-core/os-database-integration.ts', integration);

let serverCode = fs.readFileSync('server.ts', 'utf-8');

// Rewire /api/stock-adjust
serverCode = serverCode.replace(
  /app\.post\("\/api\/stock-adjust", requireAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?res\.json\(\{ \.\.\.updatedProd\[0\], id: updatedProd\[0\]\.id\.toString\(\) \}\);\n  \} catch \(error: any\) \{/m,
  `app.post("/api/stock-adjust", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity, type, notes } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = \`tenant_\${userId}\`;

    const command = {
      id: \`cmd_adj_\${Date.now()}\`,
      type: 'ADJUST_INVENTORY',
      tenantId: userId.toString(),
      payload: { productId, quantity, type, notes },
      timestamp: Date.now(),
      issuerId: userId.toString()
    };
    
    const events = await globalCommandBus.dispatch(command as any);
    const updatedProd = events[0].payload.record;

    clearUserCache(userId);
    res.json({ ...updatedProd, id: updatedProd.id.toString() });
  } catch (error: any) {`
);


// Rewire /api/whatsapp/send-bill
serverCode = serverCode.replace(
  /app\.post\("\/api\/whatsapp\/send-bill", requireAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?await sendWhatsAppMessage\(shopId, phone, messageText\);\n    res\.json\(\{ success: true, message: "Bill sent successfully on WhatsApp" \}\);\n  \} catch \(error: any\) \{/m,
  `app.post("/api/whatsapp/send-bill", requireAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser!.id.toString();
    const { customerName, phone, amount, billNo, items } = req.body;
    
    if (!phone) return res.status(400).json({ error: "Phone number required" });
    
    const shopName = "DukaanMitra Shop";
    let messageText = \`🏪 *\${shopName}*\\n\\n\` +
                  \`नमस्ते *\${customerName || "ग्राहक"}*,\\n\` +
                  \`आपकी दुकान का बिल तैयार है।\\n\\n\` +
                  \`🧾 बिल नंबर: \${billNo || new Date().getTime().toString().slice(-6)}\\n\` +
                  \`💰 कुल राशि: ₹\${amount}\\n\`;
                  
    if (items && Array.isArray(items) && items.length > 0) {
      messageText += \`\\n*विवरण:*\\n\`;
      items.forEach((item: any) => {
        messageText += \`- \${item.name} x \${item.quantity || 1} (₹\${item.price})\\n\`;
      });
    }

    const command = {
      id: \`cmd_wa_\${Date.now()}\`,
      type: 'SEND_WHATSAPP',
      tenantId: shopId,
      payload: { phone, messageText, shopId },
      timestamp: Date.now(),
      issuerId: shopId
    };
    
    await globalCommandBus.dispatch(command as any);
    res.json({ success: true, message: "Bill sent successfully on WhatsApp" });
  } catch (error: any) {`
);

fs.writeFileSync('server.ts', serverCode);

console.log("Updated os-database-integration and server.ts");
