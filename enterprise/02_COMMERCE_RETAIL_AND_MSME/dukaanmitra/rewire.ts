import fs from 'fs';

let content = fs.readFileSync('server.ts', 'utf-8');

// Add imports
content = content.replace(
  'import { db } from "./src/db/index.ts";',
  'import { db } from "./src/db/index.ts";\nimport { globalCommandBus, initializeDatabaseIntegration } from "./src/os-core/index.ts";\n'
);

// Add initialization
content = content.replace(
  'const app = express();',
  'initializeDatabaseIntegration();\nconst app = express();'
);

// Rewire /api/customers POST
content = content.replace(
  /app\.post\("\/api\/customers", requireAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?res\.status\(201\)\.json\(\{ \.\.\.newCustomer\[0\], id: newCustomer\[0\]\.id\.toString\(\) \}\);\n  \} catch \(error: any\) \{/m,
  `app.post("/api/customers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, balance } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const command = {
      id: \`cmd_\${Date.now()}\`,
      type: 'CREATE_CUSTOMER',
      tenantId: req.dbUser!.id.toString(),
      payload: { name, phone, balance },
      timestamp: Date.now(),
      issuerId: req.dbUser!.id.toString()
    };
    
    const events = await globalCommandBus.dispatch(command as any);
    const newCustomer = events[0].payload.record;

    clearUserCache(req.dbUser!.id);
    res.status(201).json({ ...newCustomer, id: newCustomer.id.toString() });
  } catch (error: any) {`
);

// Rewire /api/products POST
content = content.replace(
  /app\.post\("\/api\/products", requireAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?res\.status\(201\)\.json\(\{ \.\.\.newProduct\[0\], id: newProduct\[0\]\.id\.toString\(\) \}\);\n  \} catch \(error: any\) \{/m,
  `app.post("/api/products", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, stock, unit, price, costPrice, lowStockThreshold, barcode } = req.body;
    if (!name) return res.status(400).json({ error: "Product name is required" });

    const command = {
      id: \`cmd_\${Date.now()}\`,
      type: 'CREATE_PRODUCT',
      tenantId: req.dbUser!.id.toString(),
      payload: { name, stock, unit, price, costPrice, lowStockThreshold, barcode },
      timestamp: Date.now(),
      issuerId: req.dbUser!.id.toString()
    };
    
    const events = await globalCommandBus.dispatch(command as any);
    const newProduct = events[0].payload.record;

    clearUserCache(req.dbUser!.id);
    res.status(201).json({ ...newProduct, id: newProduct.id.toString() });
  } catch (error: any) {`
);

// Rewire /api/transactions POST
content = content.replace(
  /app\.post\("\/api\/transactions", requireAuth, async \(req: AuthRequest, res\) => \{[\s\S]*?res\.status\(201\)\.json\(\{ \.\.\.newTx\[0\], id: newTx\[0\]\.id\.toString\(\) \}\);\n  \} catch \(error: any\) \{/m,
  `app.post("/api/transactions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const command = {
      id: \`cmd_\${Date.now()}\`,
      type: 'CREATE_TRANSACTION',
      tenantId: req.dbUser!.id.toString(),
      payload: req.body,
      timestamp: Date.now(),
      issuerId: req.dbUser!.id.toString()
    };
    
    const events = await globalCommandBus.dispatch(command as any);
    const newTx = events[0].payload.record;

    clearUserCache(req.dbUser!.id);
    res.status(201).json({ ...newTx, id: newTx.id.toString() });
  } catch (error: any) {`
);

fs.writeFileSync('server.ts', content);
console.log("Rewired server.ts successfully");
