import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf8');

// 1. Add imports
const importsToAdd = `
import { initStranglerGateway } from './src/os-core/strangler-gateway';
import { globalCommandBus } from './src/os-core/command-bus';
`;

content = content.replace(/(import express from "express";)/, `$1${importsToAdd}`);

// 2. Add initStranglerGateway after app initialization
content = content.replace(/(const app = express\(\);)/, `$1\ninitStranglerGateway();`);

// 3. Replace POST /api/transactions
const transactionsRegex = /app\.post\("\/api\/transactions", requireAuth, async \(req: AuthRequest, res\) => {[\s\S]*?(?=app\.post\("\/api\/stock-adjust)/;
const newTransactionsRoute = `app.post("/api/transactions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { customerId, amount, type, product, quantity, notes, date } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = \`tenant_\${userId}\`;

    // STRANGLER PATTERN: Dispatch to OS Kernel instead of raw DB inserts
    await globalCommandBus.dispatch({
      id: \`cmd_tx_\${Date.now()}\`,
      type: 'ADD_TRANSACTION' as any,
      tenantId,
      payload: { userId, customerId, amount, type, product, quantity, notes, date },
      timestamp: Date.now(),
      issuerId: \`user_\${userId}\`
    });

    return res.status(200).json({ success: true, message: "Transaction processed via OS Kernel" });
  } catch (error: any) {
    console.error("Transaction Error:", error);
    return res.status(500).json({ error: error.message || "Failed to add transaction" });
  }
});\n\n`;

content = content.replace(transactionsRegex, newTransactionsRoute);

// 4. Replace POST /api/customers
const customersRegex = /app\.post\("\/api\/customers", requireAuth, async \(req: AuthRequest, res\) => {[\s\S]*?(?=app\.put\("\/api\/customers\/:id)/;
const newCustomersRoute = `app.post("/api/customers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, balance } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = \`tenant_\${userId}\`;

    await globalCommandBus.dispatch({
      id: \`cmd_cust_\${Date.now()}\`,
      type: 'CREATE_CUSTOMER' as any,
      tenantId,
      payload: { userId, name, phone, balance },
      timestamp: Date.now(),
      issuerId: \`user_\${userId}\`
    });

    return res.status(200).json({ success: true, message: "Customer created via OS Kernel" });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to add customer" });
  }
});\n\n`;

content = content.replace(customersRegex, newCustomersRoute);

fs.writeFileSync('server.ts', content);
