const fs = require('fs');

const content = `import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import { db } from "./src/db/index.ts";
import { customers, products, transactions, stockTransactions, marketResearch } from "./src/db/schema.ts";
import { eq, and } from "drizzle-orm";
import { requireAuth, optionalAuth, AuthRequest } from "./src/middleware/auth.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Market Research / Demo Tracking (Public/Optional Auth)
app.post("/api/market-research", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { actionType, inputData, metadata } = req.body;
    const userId = req.dbUser ? req.dbUser.id : null;
    const demoId = !req.dbUser ? (req.headers['x-demo-id'] as string || 'anonymous') : null;

    await db.insert(marketResearch).values({
      userId,
      demoId,
      actionType,
      inputData: typeof inputData === 'string' ? inputData : JSON.stringify(inputData),
      metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Market research log failed:", error);
    res.status(500).json({ error: "Logging failed" });
  }
});

// 1. Get entire database (summary & state)
app.get("/api/db", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const userCustomers = await db.select().from(customers).where(eq(customers.userId, userId));
    const userProducts = await db.select().from(products).where(eq(products.userId, userId));
    const userTransactions = await db.select().from(transactions).where(eq(transactions.userId, userId));
    
    // Map Drizzle output to the frontend expected format
    res.json({
      customers: userCustomers.map(c => ({ ...c, id: c.id.toString() })),
      products: userProducts.map(p => ({ ...p, id: p.id.toString() })),
      transactions: userTransactions.map(t => ({ ...t, id: t.id.toString(), customerId: t.customerId.toString() }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Add customer
app.post("/api/customers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, balance } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const newCustomer = await db.insert(customers).values({
      userId: req.dbUser!.id,
      name,
      phone: phone || "",
      balance: Number(balance) || 0,
    }).returning();

    res.status(201).json({ ...newCustomer[0], id: newCustomer[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update customer
app.put("/api/customers/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, balance } = req.body;
    const updated = await db.update(customers)
      .set({
        name,
        phone,
        balance: balance !== undefined ? Number(balance) : undefined,
        updatedAt: new Date()
      })
      .where(and(eq(customers.id, parseInt(req.params.id)), eq(customers.userId, req.dbUser!.id)))
      .returning();

    if (updated.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json({ ...updated[0], id: updated[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Delete customer
app.delete("/api/customers/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(customers)
      .where(and(eq(customers.id, parseInt(req.params.id)), eq(customers.userId, req.dbUser!.id)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Add product
app.post("/api/products", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, stock, unit, price, costPrice, lowStockThreshold, barcode } = req.body;
    if (!name) return res.status(400).json({ error: "Product name is required" });

    const newProduct = await db.insert(products).values({
      userId: req.dbUser!.id,
      name,
      stock: Number(stock) || 0,
      unit: unit || "piece",
      price: Number(price) || 0,
      costPrice: Number(costPrice) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 10,
      barcode: barcode || null
    }).returning();

    res.status(201).json({ ...newProduct[0], id: newProduct[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Update product
app.put("/api/products/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, stock, unit, price, costPrice, lowStockThreshold } = req.body;
    const updated = await db.update(products)
      .set({
        name,
        stock: stock !== undefined ? Number(stock) : undefined,
        unit,
        price: price !== undefined ? Number(price) : undefined,
        costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
        lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined,
        updatedAt: new Date()
      })
      .where(and(eq(products.id, parseInt(req.params.id)), eq(products.userId, req.dbUser!.id)))
      .returning();

    if (updated.length === 0) return res.status(404).json({ error: "Product not found" });
    res.json({ ...updated[0], id: updated[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Delete product
app.delete("/api/products/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.delete(products)
      .where(and(eq(products.id, parseInt(req.params.id)), eq(products.userId, req.dbUser!.id)));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Add transaction (Ledger update)
app.post("/api/transactions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { customerId, amount, type, product, quantity, notes } = req.body;
    const userId = req.dbUser!.id;

    const custResult = await db.select().from(customers).where(and(eq(customers.id, parseInt(customerId)), eq(customers.userId, userId)));
    if (custResult.length === 0) return res.status(404).json({ error: "Customer not found" });
    const customer = custResult[0];

    const amtNum = Number(amount) || 0;
    let newBalance = customer.balance;
    if (type === "credit") newBalance += amtNum;
    else if (type === "payment") newBalance -= amtNum;

    await db.update(customers).set({ balance: newBalance, updatedAt: new Date() }).where(eq(customers.id, customer.id));

    let matchedProduct = null;
    if (product && product.trim().length > 0) {
      const cleanProdQuery = product.trim().toLowerCase();
      const userProducts = await db.select().from(products).where(eq(products.userId, userId));
      matchedProduct = userProducts.find(p => p.name.toLowerCase().includes(cleanProdQuery) || cleanProdQuery.includes(p.name.toLowerCase()));
      
      const qtyNum = parseFloat(quantity) || 1;
      const unitExtracted = quantity ? (quantity.replace(/[\\d\\s.]/g, '') || "piece") : "piece";

      if (matchedProduct) {
        if (type === "credit") {
          const newStock = Math.max(-100, matchedProduct.stock - qtyNum);
          await db.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, matchedProduct.id));
          matchedProduct.stock = newStock;
        }
      } else {
        const calculatedPrice = amtNum > 0 ? Math.round(amtNum / (qtyNum || 1)) : 40;
        const insertProd = await db.insert(products).values({
          userId,
          name: product.trim(),
          stock: -qtyNum,
          unit: unitExtracted,
          price: calculatedPrice,
          costPrice: Math.round(calculatedPrice * 0.8),
          lowStockThreshold: 5,
        }).returning();
        matchedProduct = insertProd[0];
      }
    }

    const newTx = await db.insert(transactions).values({
      userId,
      customerId: customer.id,
      customerName: customer.name,
      amount: amtNum,
      type,
      product: matchedProduct ? matchedProduct.name : (product || ""),
      quantity: quantity || "",
      date: new Date().toISOString(),
      notes: notes || ""
    }).returning();

    res.status(201).json({ 
      transaction: { ...newTx[0], id: newTx[0].id.toString(), customerId: newTx[0].customerId.toString() }, 
      customer: { ...customer, balance: newBalance, id: customer.id.toString() }, 
      product: matchedProduct ? { ...matchedProduct, id: matchedProduct.id.toString() } : null 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Process quick stock adjustment
app.post("/api/stock-adjust", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity, type, notes } = req.body;
    const userId = req.dbUser!.id;

    const prodResult = await db.select().from(products).where(and(eq(products.id, parseInt(productId)), eq(products.userId, userId)));
    if (prodResult.length === 0) return res.status(404).json({ error: "Product not found" });
    const product = prodResult[0];

    const qtyNum = Number(quantity) || 0;
    let newStock = product.stock;
    if (type === "in") newStock += qtyNum;
    else if (type === "out") newStock = Math.max(0, newStock - qtyNum);

    const updatedProd = await db.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, product.id)).returning();
    
    res.json({ ...updatedProd[0], id: updatedProd[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Munim AI Parsing Route
app.post("/api/munim/parse", optionalAuth, async (req: AuthRequest, res) => {
  const { query, customersList: guestCustomers, productsList: guestProducts } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  let customersList = [];
  let productsList = [];

  if (req.dbUser) {
    const userCustomers = await db.select().from(customers).where(eq(customers.userId, req.dbUser.id));
    const userProducts = await db.select().from(products).where(eq(products.userId, req.dbUser.id));
    customersList = userCustomers.map(c => ({ id: c.id, name: c.name }));
    productsList = userProducts.map(p => ({ id: p.id, name: p.name, price: p.price, unit: p.unit }));
  } else {
    customersList = guestCustomers || [];
    productsList = guestProducts || [];
  }

  const systemInstruction = \`
You are the brain of "DukaanMitra", an AI Digital Munim (digital business accountant) for Indian small shopkeepers.
Your job is to analyze natural language sentences (written in Hindi, English, or Hinglish) and parse them into a structured action object.

Here is the context of existing shop data:
- Existing Customers: \${JSON.stringify(customersList)}
- Existing Products: \${JSON.stringify(productsList)}

Rules for understanding:
1. "Rahul 500 Sugar" or "राहुल 500 चीनी" -> Customer: Rahul, product: Sugar, amount: 500, type: "credit". (Usually, when a customer gets item and amount is listed, it is a "credit" (उधारी) transaction).
2. "Amit gave 1000" or "अमित ₹1000 जमा" or "अमित ने भुगतान किया 500" -> Customer: Amit, amount: 1000/500, type: "payment" (भुगतान किया).
3. "चीनी 20 किलो जोड़ो" or "आटा 50 kg stock add" or "Add 10 pieces tea" -> Product: Tea or Sugar or Wheat Flour, quantity: 10/20/50, unit: kg/piece, type: "stock_add".
4. "आलू 5 किलो बेचा" or "sold 2kg sugar" -> Product: Potato or Sugar, quantity: 2 or 5, type: "sale". (This represents direct inventory sales).

Fuzzy Entity Mapping:
- Look at the lists of existing customers and products provided above.
- If the spoken/typed name is a close match (e.g., "Rahul" matches "Rahul (राहुल)" or "सुरेश" matches "Suresh (सुरेश)"), map the customer to that existing customer's EXACT name.
- If it is a completely new customer name, output the name with confidence.
- If it is a product like "चीनी" or "sugar", map it to "Sugar (चीनी)". If "दूध" map to "Milk Packet (दूध पैकेट)". Try to be smart!

You must return a valid JSON object matching the requested schema.
Provide a clear, respectful Hindi explanation (hindiExplanation) describing what you understood, like "राहुल के खाते में ₹500 चीनी की उधारी दर्ज की गई।" or "अमित से ₹1000 का भुगतान प्राप्त हुआ।"
\`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: \`Parse this instruction from the shopkeeper: "\${query}"\`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customer: { type: Type.STRING },
            phone: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            product: { type: Type.STRING },
            quantity: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["credit", "payment", "stock_add", "sale", "unknown"] },
            hindiExplanation: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ["type", "hindiExplanation", "confidence"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to parse query" });
  }
});

// 11. Munim AI Bill Photo OCR Scanner Route
app.post("/api/munim/scan-bill", optionalAuth, async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "Image data is required" });

  const prompt = \`
You are the AI Camera brain of DukaanMitra.
Analyze this bill, receipt, invoice, or handwritten ledger note photo and extract the line items.
For each line item found, extract:
- name (product name in Hindi or English)
- quantity (number of units)
- price (selling price per unit)
- unit (e.g. "kg", "packet", "litre", "piece")
- total (total amount for this product)

Return a JSON object containing a 'products' array.
Example structure:
{
  "products": [
    { "name": "Sugar", "quantity": 5, "price": 40, "unit": "kg", "total": 200 }
  ],
  "customerName": "Optional customer name if mentioned on the bill",
  "totalBillAmount": 295,
  "hindiSummary": "बिल में 2 आइटम्स मिले: Sugar और Tata Tea। कुल रकम ₹295 है।"
}

Ensure the output is STRICTLY valid JSON.
\`;

  try {
    const cleanBase64 = image.replace(/^data:image\\/\\w+;base64,/, "");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }, prompt],
      config: { responseMimeType: "application/json" }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    res.status(500).json({ error: "Scan failed" });
  }
});

// Vite & Static file serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => { res.sendFile(path.join(distPath, "index.html")); });
  }
  app.listen(PORT, "0.0.0.0", () => { console.log(\`DukaanMitra server running on http://0.0.0.0:\${PORT}\`); });
}
startServer();
`

fs.writeFileSync('server.ts', content, 'utf8');
