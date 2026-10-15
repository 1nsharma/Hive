import { initializeQAPipeline } from "./src/agents/qa-pipeline.ts";
import express from "express";
import { initStranglerGateway } from './src/os-core/strangler-gateway';

import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { db } from "./src/db/index.ts";
import { globalCommandBus, initializeDatabaseIntegration } from "./src/os-core/index.ts";

import { customers, products, transactions, stockTransactions, marketResearch, users, userLogs, aiCache, userSettings, potentialCustomers, suppliers, purchases } from "./src/db/schema.ts";
import { eq, and, sql, desc } from "drizzle-orm";
import { requireAuth, optionalAuth, AuthRequest, requireAdmin } from "./src/middleware/auth.ts";
import { initWhatsApp, getWhatsAppStatus, sendWhatsAppMessage, disconnectWhatsApp } from "./src/whatsapp/index.ts";

dotenv.config();

initializeDatabaseIntegration();
  initializeQAPipeline();
const app = express();
initStranglerGateway();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || "";
const isRateLimit = (err: any) => {
  const errStr = String(err).toLowerCase();
  const errMsg = String(err?.message || "").toLowerCase();
  return errStr.includes('429') || errStr.includes('quota') || errStr.includes('resource_exhausted') || 
         errMsg.includes('429') || errMsg.includes('quota') || err?.status === 429;
};
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Simple In-Memory Cache to reduce database load
const apiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function clearUserCache(userId: number) {
  apiCache.delete(`user_db_${userId}`);
}

// Market Research / Demo Tracking (Public/Optional Auth)
app.post("/api/market-research", optionalAuth, async (req: AuthRequest, res) => {
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
});


// Import Contacts
app.post("/api/contacts/import", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { contacts } = req.body;
    if (!contacts || !Array.isArray(contacts)) {
      return res.status(400).json({ error: "Invalid contacts data" });
    }

    const inserted = [];
    for (const contact of contacts) {
      if (contact.name && (contact.phone || contact.email)) {
        const result = await db.insert(potentialCustomers).values({
          userId: req.dbUser!.id,
          name: contact.name,
          phone: contact.phone || '',
          email: contact.email || null,
          source: 'contacts'
        }).returning();
        inserted.push(result[0]);
      }
    }
    res.json({ success: true, count: inserted.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// AI Catalog Suggestion
app.post("/api/ai/suggest-catalog", optionalAuth, async (req: AuthRequest, res) => {
  try {
    let businessProfile = "Retail Store";
    if (req.dbUser) {
      const settings = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser.id)).limit(1);
      if (settings.length > 0) {
        businessProfile = `${settings[0].businessName} - ${settings[0].category || settings[0].description || 'Local Shop'}`;
      }
    }
    
    // First check AI Cache to save API calls
    const cacheKey = `catalog_${businessProfile}`;
    const cached = await db.select().from(aiCache).where(eq(aiCache.promptHash, cacheKey)).limit(1);
    
    if (cached.length > 0) {
      // Increase hit count
      await db.update(aiCache)
        .set({ hitCount: cached[0].hitCount + 1 })
        .where(eq(aiCache.id, cached[0].id));
      
      const parsed = JSON.parse(cached[0].response);
      return res.json(parsed);
    }

    // Generate large static seed combined with AI strategy
    const { seedCatalog } = await import("./src/db/catalog-seed.ts");
    
    // Call AI just for the business strategy and a few custom items
    let customStrategy = "Maintain a good mix of essential staples and fast-moving FMCG goods. Monitor expiration dates closely.";
    let customItems = [];
    
    try {
        const prompt = `Provide a 2-sentence inventory management strategy for a ${businessProfile} in India. Also give 5 specific high-margin products that this exact business type should sell.
JSON format:
{
  "strategy": "...",
  "catalog": [{"name":"...","unit":"...","suggestedPrice":100,"suggestedCostPrice":80}]
}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.2 }
        });
        const parsed = JSON.parse(response.text || "{}");
        if (parsed.strategy) customStrategy = parsed.strategy;
        if (parsed.catalog && Array.isArray(parsed.catalog)) customItems = parsed.catalog;
    } catch (e) {
        console.error("AI mini-generation failed, falling back to static", e);
    }
    
    const finalData = {
        strategy: customStrategy,
        catalog: [...customItems, ...seedCatalog]
    };
    
    // Save to Cache
    await db.insert(aiCache).values({
        promptHash: cacheKey,
        response: JSON.stringify(finalData),
        type: 'text'
    });
    
    res.json(finalData);
  } catch (error: any) {
    console.error("AI Catalog Error:", error);
    res.status(500).json({ error: error.message });
  }


});

// Settings routes
app.get("/api/settings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const settings = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser!.id)).limit(1);
    res.json({ settings: settings[0] || null });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/settings", requireAuth, async (req: AuthRequest, res) => {
  try {
    const config = req.body.settings || req.body;
    const { businessName, phone, address, description, gstNumber, mapsLink, munimStyle } = config;
    
    // Check if settings exist
    const existing = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser!.id)).limit(1);
    
    let updated;
    if (existing.length > 0) {
      updated = await db.update(userSettings).set({
        businessName,
        phone,
        address,
        description,
        gstNumber,
        mapsLink,
        munimStyle,
        updatedAt: new Date()
      }).where(eq(userSettings.userId, req.dbUser!.id)).returning();
    } else {
      updated = await db.insert(userSettings).values({
        userId: req.dbUser!.id,
        businessName: businessName || 'My Shop',
        phone: phone || '',
        address,
        description,
        gstNumber,
        mapsLink,
        munimStyle
      }).returning();
    }
    
    res.json({ settings: updated[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Get entire database (summary & state)
app.get("/api/db", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userId = req.dbUser!.id;
    const cacheKey = `user_db_${userId}`;
    const cached = apiCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({ ...cached.data, cached: true });
    }

    const userCustomers = await db.select().from(customers).where(eq(customers.userId, userId));
    const userProducts = await db.select().from(products).where(eq(products.userId, userId));
    const userTransactions = await db.select().from(transactions).where(eq(transactions.userId, userId));
    const userSuppliers = await db.select().from(suppliers).where(eq(suppliers.userId, userId));
    const userPurchases = await db.select().from(purchases).where(eq(purchases.userId, userId));
    
    // Map Drizzle output to the frontend expected format
    const responseData = {
      customers: userCustomers.map(c => ({ ...c, id: c.id.toString() })),
      products: userProducts.map(p => ({ ...p, id: p.id.toString() })),
      transactions: userTransactions.map(t => ({ ...t, id: t.id.toString(), customerId: t.customerId.toString() })),
      suppliers: userSuppliers.map(s => ({ ...s, id: s.id.toString() })),
      purchases: userPurchases.map(p => ({ ...p, id: p.id.toString(), supplierId: p.supplierId.toString() }))
    };

    apiCache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    res.json(responseData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Add customer
app.post("/api/customers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, phone, balance } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = `tenant_${userId}`;

    await globalCommandBus.dispatch({
      id: `cmd_cust_${Date.now()}`,
      type: 'CREATE_CUSTOMER' as any,
      tenantId,
      payload: { userId, name, phone, balance },
      timestamp: Date.now(),
      issuerId: `user_${userId}`
    });

    return res.status(200).json({ success: true, message: "Customer created via OS Kernel" });
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to add customer" });
  }
});

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
    
    clearUserCache(req.dbUser!.id);
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
    
    clearUserCache(req.dbUser!.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Add product
app.post("/api/ai/product-lookup", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { productName } = req.body;
    if (!productName) return res.status(400).json({ error: "Product name is required" });

    const prompt = `You are an expert FMCG pricing and inventory assistant for an Indian Kirana (grocery) store. The user wants to add a product named "${productName}". Return a JSON object with standard estimated details for this product in India:
    {
      "name": "Proper standard name with weight (if applicable, else just name)",
      "price": number (estimated MRP/selling price in rupees),
      "costPrice": number (estimated wholesale cost price in rupees, usually 10-20% less than MRP),
      "unit": "string (kg, g, L, ml, packet, piece)",
      "barcode": "string (leave empty string if unknown)"
    }
    Only output valid JSON.`;

        const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/\x60\x60\x60json/g, "").replace(/\x60\x60\x60/g, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
            if (isRateLimit(error)) {
      try {
        let productNameStr = req.body.productName || req.body.barcode || "";
        
        if (/^\d+$/.test(productNameStr)) {
          const offRes = await fetch(`https://world.openfoodfacts.org/api/v2/product/${productNameStr}.json`, {
            headers: { "User-Agent": "AIStudioAgent/1.0" }
          });
          const data: any = await offRes.json();
          if (data && data.product) {
            return res.json({
               name: data.product.product_name || "Unknown Product",
               description: "Fetched from Open Food Facts",
               category: "Food",
               suggestedPrice: 100,
               suggestedCostPrice: 80,
               unit: "pcs",
               barcode: productNameStr
            });
          }
        } else {
          // FakeStore API for text search
          const fakeRes = await fetch("https://fakestoreapi.com/products");
          const fakeData: any = await fakeRes.json();
          const found = fakeData.find((p: any) => p.title.toLowerCase().includes(productNameStr.toLowerCase()));
          
          if (found) {
            return res.json({
               name: found.title,
               description: "Fetched from FakeStore API",
               category: found.category,
               suggestedPrice: Math.round(found.price * 80),
               suggestedCostPrice: Math.round(found.price * 60),
               unit: "pcs",
               barcode: ""
            });
          }
        }
      } catch (e) {
        // ignore
      }

      return res.json({
         name: "Demo Product " + (req.body.productName || req.body.barcode || ""),
         description: "Scanned generic product",
         category: "General",
         suggestedPrice: 100,
         suggestedCostPrice: 80,
         unit: "pcs"
      });
    }
    console.error("Product info error:", error);
    res.status(500).json({ error: error.message });
  }



});

app.post("/api/products", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, stock, unit, price, costPrice, lowStockThreshold, barcode } = req.body;
    if (!name) return res.status(400).json({ error: "Product name is required" });

    const command = {
      id: `cmd_${Date.now()}`,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Update product
app.put("/api/products/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, stock, unit, price, costPrice, lowStockThreshold, barcode } = req.body;
    const updated = await db.update(products)
      .set({
        name,
        stock: stock !== undefined ? Number(stock) : undefined,
        unit,
        price: price !== undefined ? Number(price) : undefined,
        costPrice: costPrice !== undefined ? Number(costPrice) : undefined,
        lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : undefined,
        barcode: barcode !== undefined ? barcode : undefined,
        updatedAt: new Date()
      })
      .where(and(eq(products.id, parseInt(req.params.id)), eq(products.userId, req.dbUser!.id)))
      .returning();

    if (updated.length === 0) return res.status(404).json({ error: "Product not found" });
    
    clearUserCache(req.dbUser!.id);
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
    
    clearUserCache(req.dbUser!.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Add transaction (Ledger update)
app.post("/api/transactions", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { customerId, amount, type, product, quantity, notes, date } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = `tenant_${userId}`;

    // STRANGLER PATTERN: Dispatch to OS Kernel instead of raw DB inserts
    await globalCommandBus.dispatch({
      id: `cmd_tx_${Date.now()}`,
      type: 'ADD_TRANSACTION' as any,
      tenantId,
      payload: { userId, customerId, amount, type, product, quantity, notes, date },
      timestamp: Date.now(),
      issuerId: `user_${userId}`
    });

    return res.status(200).json({ success: true, message: "Transaction processed via OS Kernel" });
  } catch (error: any) {
    console.error("Transaction Error:", error);
    return res.status(500).json({ error: error.message || "Failed to add transaction" });
  }
});

app.post("/api/stock-adjust", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { productId, quantity, type, notes } = req.body;
    const userId = req.dbUser!.id;
    const tenantId = `tenant_${userId}`;

    const command = {
      id: `cmd_adj_${Date.now()}`,
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- SUPPLIER MANAGEMENT ENDPOINTS ---

app.get("/api/suppliers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userSuppliers = await db.select().from(suppliers).where(eq(suppliers.userId, req.dbUser!.id));
    res.json(userSuppliers.map(s => ({ ...s, id: s.id.toString() })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/suppliers", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, gstin, phone, stateCode, balance, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Supplier name and phone are required" });
    }
    const inserted = await db.insert(suppliers).values({
      userId: req.dbUser!.id,
      name,
      gstin: gstin || null,
      phone,
      stateCode: stateCode || null,
      balance: balance !== undefined ? Number(balance) : 0,
      notes: notes || null,
    }).returning();
    
    clearUserCache(req.dbUser!.id);
    res.status(201).json({ ...inserted[0], id: inserted[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/suppliers/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, gstin, phone, stateCode, balance, notes } = req.body;
    const supplierId = parseInt(req.params.id);
    
    const updated = await db.update(suppliers)
      .set({
        name,
        gstin: gstin !== undefined ? gstin : undefined,
        phone,
        stateCode: stateCode !== undefined ? stateCode : undefined,
        balance: balance !== undefined ? Number(balance) : undefined,
        notes: notes !== undefined ? notes : undefined,
        updatedAt: new Date()
      })
      .where(and(eq(suppliers.id, supplierId), eq(suppliers.userId, req.dbUser!.id)))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    
    clearUserCache(req.dbUser!.id);
    res.json({ ...updated[0], id: updated[0].id.toString() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/suppliers/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const supplierId = parseInt(req.params.id);
    await db.delete(suppliers).where(and(eq(suppliers.id, supplierId), eq(suppliers.userId, req.dbUser!.id)));
    
    clearUserCache(req.dbUser!.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/suppliers/:id/payment", requireAuth, async (req: AuthRequest, res) => {
  try {
    const supplierId = parseInt(req.params.id);
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    
    const supplierList = await db.select().from(suppliers).where(and(eq(suppliers.id, supplierId), eq(suppliers.userId, req.dbUser!.id))).limit(1);
    if (supplierList.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    
    const currentBalance = supplierList[0].balance;
    const newBalance = currentBalance - Number(amount);
    
    const updated = await db.update(suppliers)
      .set({
        balance: newBalance,
        updatedAt: new Date()
      })
      .where(eq(suppliers.id, supplierId))
      .returning();
      
    clearUserCache(req.dbUser!.id);
    res.json({ success: true, balance: updated[0].balance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- PURCHASE MANAGEMENT ENDPOINTS ---

app.get("/api/purchases", requireAuth, async (req: AuthRequest, res) => {
  try {
    const userPurchases = await db.select().from(purchases).where(eq(purchases.userId, req.dbUser!.id));
    res.json(userPurchases.map(p => ({ ...p, id: p.id.toString(), supplierId: p.supplierId.toString() })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/purchases", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { supplierId, invoiceNumber, invoiceDate, taxableValue, cgst, sgst, igst, itcStatus, items, notes, paymentType, totalAmount } = req.body;
    if (!supplierId || !invoiceNumber || !invoiceDate) {
      return res.status(400).json({ error: "Supplier, invoice number, and invoice date are required" });
    }
    
    const sId = parseInt(supplierId);
    
    // Verify supplier exists
    const supplierList = await db.select().from(suppliers).where(and(eq(suppliers.id, sId), eq(suppliers.userId, req.dbUser!.id))).limit(1);
    if (supplierList.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    
    // Insert purchase
    const newPurchase = await db.insert(purchases).values({
      userId: req.dbUser!.id,
      supplierId: sId,
      invoiceNumber,
      invoiceDate,
      taxableValue: Number(taxableValue) || 0,
      cgst: Number(cgst) || 0,
      sgst: Number(sgst) || 0,
      igst: Number(igst) || 0,
      itcStatus: itcStatus || 'eligible',
      items: typeof items === 'string' ? items : JSON.stringify(items || []),
      notes: notes || null,
      paymentType: paymentType || 'credit',
      totalAmount: Number(totalAmount) || 0,
      status: 'active'
    }).returning();
    
    const actualTotal = Number(totalAmount) || 0;
    
    // 1. Accounting integration: if credit purchase, increase supplier outstanding balance
    if (paymentType === 'credit') {
      await db.update(suppliers)
        .set({
          balance: sql`${suppliers.balance} + ${actualTotal}`,
          updatedAt: new Date()
        })
        .where(eq(suppliers.id, sId));
    }
    
    // 2. Inventory integration: Automatic stock increase & average/cost price update
    const itemsList = typeof items === 'string' ? JSON.parse(items) : (items || []);
    if (Array.isArray(itemsList)) {
      for (const item of itemsList) {
        const { productId, quantity, costPrice: itemCostPrice } = item;
        const qty = Number(quantity);
        if (!qty || qty <= 0) continue;
        
        if (productId) {
          const pId = parseInt(productId);
          const prodList = await db.select().from(products).where(and(eq(products.id, pId), eq(products.userId, req.dbUser!.id))).limit(1);
          if (prodList.length > 0) {
            const existing = prodList[0];
            // Calculate average cost update
            let newCostPrice = Number(itemCostPrice) || existing.costPrice;
            if (existing.stock > 0) {
              newCostPrice = ((existing.stock * existing.costPrice) + (qty * (Number(itemCostPrice) || 0))) / (existing.stock + qty);
            }
            
            // Update product stock and cost price
            await db.update(products)
              .set({
                stock: sql`${products.stock} + ${qty}`,
                costPrice: newCostPrice,
                updatedAt: new Date()
              })
              .where(eq(products.id, pId));
              
            // Create Stock transaction
            await db.insert(stockTransactions).values({
              userId: req.dbUser!.id,
              productId: pId,
              productName: existing.name,
              quantity: qty,
              type: 'in',
              date: invoiceDate,
              notes: `Purchase Invoice #${invoiceNumber}`
            });
          }
        }
      }
    }
    
    clearUserCache(req.dbUser!.id);
    res.status(201).json({ ...newPurchase[0], id: newPurchase[0].id.toString(), supplierId: newPurchase[0].supplierId.toString() });
  } catch (error: any) {
    console.error("Purchase creation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/purchases/:id/cancel", requireAuth, async (req: AuthRequest, res) => {
  try {
    const purchaseId = parseInt(req.params.id);
    const purchaseList = await db.select().from(purchases).where(and(eq(purchases.id, purchaseId), eq(purchases.userId, req.dbUser!.id))).limit(1);
    if (purchaseList.length === 0) {
      return res.status(404).json({ error: "Purchase invoice not found" });
    }
    
    const purchaseData = purchaseList[0];
    if (purchaseData.status === 'cancelled') {
      return res.status(400).json({ error: "Purchase is already cancelled" });
    }
    
    // Update purchase status to cancelled
    await db.update(purchases)
      .set({ status: 'cancelled' })
      .where(eq(purchases.id, purchaseId));
      
    const total = purchaseData.totalAmount;
    
    // 1. Revert supplier balance if it was a credit purchase
    if (purchaseData.paymentType === 'credit') {
      await db.update(suppliers)
        .set({
          balance: sql`${suppliers.balance} - ${total}`,
          updatedAt: new Date()
        })
        .where(eq(suppliers.id, purchaseData.supplierId));
    }
    
    // 2. Revert stock updates
    const itemsList = typeof purchaseData.items === 'string' ? JSON.parse(purchaseData.items) : (purchaseData.items || []);
    if (Array.isArray(itemsList)) {
      for (const item of itemsList) {
        const { productId, quantity } = item;
        const qty = Number(quantity);
        if (!qty || qty <= 0 || !productId) continue;
        
        const pId = parseInt(productId);
        const prodList = await db.select().from(products).where(and(eq(products.id, pId), eq(products.userId, req.dbUser!.id))).limit(1);
        if (prodList.length > 0) {
          const existing = prodList[0];
          // Decrease stock
          await db.update(products)
            .set({
              stock: sql`${products.stock} - ${qty}`,
              updatedAt: new Date()
            })
            .where(eq(products.id, pId));
            
          // Create negative stock transaction to offset
          await db.insert(stockTransactions).values({
            userId: req.dbUser!.id,
            productId: pId,
            productName: existing.name,
            quantity: -qty,
            type: 'out',
            date: new Date().toISOString().split('T')[0],
            notes: `Purchase cancellation/return for Inv #${purchaseData.invoiceNumber}`
          });
        }
      }
    }
    
    clearUserCache(req.dbUser!.id);
    res.json({ success: true, message: "Purchase cancelled and stock/balances reverted" });
  } catch (error: any) {
    console.error("Purchase cancellation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Onboarding OS Config
app.post("/api/onboarding/analyze", async (req, res) => {
  const { businessName, description } = req.body;
  if (!businessName) return res.status(400).json({ error: "Business name required" });

  const prompt = `
You are the AI Business Architect for MitraOS (an AI OS for local businesses in India).
The user wants to set up their business:
Name: "${businessName}"
Description: "${description}"

Analyze this business and automatically detect the required configuration.
Return a valid JSON object matching this schema:
{
  "businessType": "String (e.g. Pharmacy, Restaurant, Hardware Store, Kirana)",
  "industry": "String (e.g. Healthcare Retail, F&B, Electronics)",
  "modules": [
    "String array of enabled modules based on needs. Choose from: Inventory, Customers, Credit/Udhaar, Delivery, Staff, Analytics, QR Catalog, AI Assistants"
  ],
  "requiresInventory": boolean,
  "requiresUdhaar": boolean
}
Return ONLY the JSON. No markdown formatting or extra text.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1
      }
    });

    const text = response.text || "{}"; const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim(); const parsedData = JSON.parse(cleanedText);
    res.json(parsedData);
  } catch (error: any) {
    if (isRateLimit(error)) {
      return res.json({
        businessType: "Retail Store",
        industry: "Retail",
        modules: ["Inventory", "Customers", "Credit/Udhaar", "Analytics"],
        requiresInventory: true,
        requiresUdhaar: true
      });
    }
    console.error("Onboarding analyze error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 10. Munim AI Parsing Route
app.post("/api/munim/parse", optionalAuth, async (req: AuthRequest, res) => {
  const { query, customersList: guestCustomers, productsList: guestProducts, businessConfig } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  let customersList = [];
  let productsList = [];
  let dbSettings = null;

  if (req.dbUser) {
    const userCustomers = await db.select().from(customers).where(eq(customers.userId, req.dbUser.id));
    const userProducts = await db.select().from(products).where(eq(products.userId, req.dbUser.id));
    const settings = await db.select().from(userSettings).where(eq(userSettings.userId, req.dbUser.id)).limit(1);
    if (settings.length > 0) dbSettings = settings[0];
    customersList = userCustomers.map(c => ({ id: c.id, name: c.name }));
    productsList = userProducts.map(p => ({ id: p.id, name: p.name, price: p.price, unit: p.unit }));
  } else {
    customersList = guestCustomers || [];
    productsList = guestProducts || [];
  }

  const businessTypeContext = dbSettings?.description ? `Business Description: ${dbSettings.description}` : (businessConfig?.businessType ? `Business Type: ${businessConfig.businessType}` : "Indian small shopkeeper (Kirana/Retail)");
  const munimStyleContext = dbSettings?.munimStyle ? `Munim Personality & Rules: ${dbSettings.munimStyle}` : "Helpful, precise, and polite.";

  const systemInstruction = `
You are the brain of "MitraOS", an AI Digital Munim (digital business accountant) for this business: ${businessTypeContext}.
${munimStyleContext}
Your job is to analyze natural language sentences (written in Hindi, English, or Hinglish) and parse them into a structured action object.

Here is the context of existing shop data:
- Existing Customers: ${JSON.stringify(customersList)}
- Existing Products: ${JSON.stringify(productsList)}

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
- VERY IMPORTANT RESTRICTION: If the user mentions a product that is NOT in the "Existing Products" list, DO NOT REJECT the query. Extract the new product name anyway and set \`isNewProduct\` to true. The system has an auto-inventory update feature which will automatically create the product catalog entry and maintain the product database if it's new, even without explicit permission.
- If the user is just selling or adding items and doesn't provide customer data, use type: "sale" or "stock_add" for direct billing/inventory. Do not force them to provide customer data.
- Extract \`price\` per item if mentioned. If they say "2 soap for 50", amount is 50, but if they say "2 soap at 25 each", price is 25, amount is 50.

You must return a valid JSON object matching the requested schema.
Provide a clear, respectful Hindi explanation (hindiExplanation) describing what you understood, like "राहुल के खाते में ₹500 चीनी की उधारी दर्ज की गई।" or "अमित से ₹1000 का भुगतान प्राप्त हुआ।"
`;

  try {
    const promptHashText = crypto.createHash('sha256').update(query.toLowerCase().trim()).digest('hex');
    const cachedAI = await db.select().from(aiCache).where(eq(aiCache.promptHash, promptHashText)).limit(1);
    if (cachedAI.length > 0) {
      await db.update(aiCache).set({ hitCount: cachedAI[0].hitCount + 1 }).where(eq(aiCache.id, cachedAI[0].id));
      return res.json({ ...JSON.parse(cachedAI[0].response), cached: true });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse this instruction from the shopkeeper: "${query}"`,
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
            price: { type: Type.NUMBER },
            isNewProduct: { type: Type.BOOLEAN },
            type: { type: Type.STRING, enum: ["credit", "payment", "stock_add", "sale", "unknown"] },
            hindiExplanation: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ["type", "hindiExplanation", "confidence"],
        },
      },
    });

    const text = response.text || "{}"; const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim(); const parsedData = JSON.parse(cleanedText);
    
    // Save to cache
    await db.insert(aiCache).values({
      promptHash: promptHashText,
      response: JSON.stringify(parsedData),
      type: 'text'
    });

    res.json(parsedData);
  } catch (error: any) {
    if (isRateLimit(error)) {
      return res.json({
        type: "sale",
        customer: "Demo Customer",
        amount: 500,
        hindiExplanation: "डेमो ग्राहक को 500 रुपये का सामान बेचा।",
        confidence: 0.8
      });
    }
    console.error("Munim parse error:", error);
    res.status(500).json({ error: "Failed to parse query" });
  }
});

// 11. Munim AI Bill Photo OCR Scanner Route
app.post("/api/munim/scan-bill", optionalAuth, async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "Image data is required" });

  const prompt = `
You are the AI Camera brain of BazaarSync, an advanced OCR system.
Analyze this image (which could be a bill, receipt, invoice, or blurry handwritten ledger note) and extract all line items. It may be written in poor handwriting, Hindi, or English. Be extremely forgiving of blur or messy handwriting and make your best educated guess.
For each line item found, extract:
- name (product name in Hindi or English, try to spell it correctly)
- quantity (number of units, default to 1 if not found)
- price (selling price per unit, derive it from total / quantity if missing)
- unit (e.g. "kg", "packet", "litre", "piece", default to "piece" if unknown)
- total (total amount for this product)

Return a JSON object containing a 'products' array.
Example structure:
{
  "products": [
    { "name": "Sugar (चीनी)", "quantity": 5, "price": 40, "unit": "kg", "total": 200 }
  ],
  "customerName": "Optional customer name if clearly mentioned on the bill",
  "totalBillAmount": 295,
  "hindiSummary": "बिल में 2 आइटम्स मिले: चीनी 5 kg और टाटा चाय 2 पैकेट। कुल रकम ₹295 है।"
}

Ensure the output is STRICTLY valid JSON. Do not include markdown code block formatting like \`\`\`json.
`;

  try {
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");
    const imageHash = crypto.createHash('sha256').update(cleanBase64).digest('hex');
    
    const cachedAI = await db.select().from(aiCache).where(eq(aiCache.promptHash, imageHash)).limit(1);
    if (cachedAI.length > 0) {
      await db.update(aiCache).set({ hitCount: cachedAI[0].hitCount + 1 }).where(eq(aiCache.id, cachedAI[0].id));
      return res.json({ ...JSON.parse(cachedAI[0].response), cached: true });
    }

        const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ inlineData: { data: cleanBase64, mimeType: "image/jpeg" } }, prompt],
      config: { 
        responseMimeType: "application/json",
        temperature: 0.1 
      }
    });

    const text = response.text || "{}";
    const cleanedText = text.replace(/\x60\x60\x60json/g, "").replace(/\x60\x60\x60/g, "").trim();
    res.json(JSON.parse(cleanedText));
  } catch (error: any) {
    if (isRateLimit(error)) {
      return res.json({
        totalAmount: 1500,
        vendorName: "Demo Wholesaler",
        date: new Date().toISOString(),
        items: [
          { name: "Demo Item 1", quantity: 10, price: 100 },
          { name: "Demo Item 2", quantity: 5, price: 100 }
        ]
      });
    }
    console.error("OCR Bill parse error:", error);
    res.status(500).json({ error: error.message });
  }

});

app.delete("/api/admin/cache", requireAdmin, async (req: AuthRequest, res) => {
  try {
    await db.delete(aiCache);
    res.json({ success: true, message: "Cache cleared successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/system", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const envVars = Object.keys(process.env).map(key => ({
      key,
      value: key.includes("KEY") || key.includes("SECRET") || key.includes("PASSWORD") || key.includes("TOKEN") ? "••••••••" : process.env[key],
    }));

    const statsResult = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(transactions),
      db.select({ count: sql<number>`count(*)` }).from(products)
    ]);

    res.json({
      envVars,
      stats: {
        totalUsers: Number(statsResult[0][0].count),
        totalTransactions: Number(statsResult[1][0].count),
        totalProducts: Number(statsResult[2][0].count)
      },
      aiConfig: {
        model: "gemini-2.5-flash & gemini-2.5-flash",
        status: apiKey ? "Active" : "Missing API Key",
      },
      deployments: {
        status: "Live",
        environment: process.env.NODE_ENV || "development",
        port: PORT
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/tracking", requireAdmin, async (req: AuthRequest, res) => {
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

app.get("/api/admin/users", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Delete associated data first
    await db.delete(transactions).where(eq(transactions.userId, userId));
    await db.delete(stockTransactions).where(eq(stockTransactions.userId, userId));
    await db.delete(products).where(eq(products.userId, userId));
    await db.delete(customers).where(eq(customers.userId, userId));
    await db.delete(userLogs).where(eq(userLogs.userId, userId));
    
    // Finally delete the user
    await db.delete(users).where(eq(users.id, userId));
    
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.get("/api/admin/logs", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const logs = await db.select({
      id: userLogs.id,
      userId: userLogs.userId,
      email: users.email,
      eventType: userLogs.eventType,
      ipAddress: userLogs.ipAddress,
      userAgent: userLogs.userAgent,
      createdAt: userLogs.createdAt
    })
    .from(userLogs)
    .leftJoin(users, eq(userLogs.userId, users.id))
    .orderBy(sql`${userLogs.createdAt} DESC`)
    .limit(100);
    
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/admin/ai-logs", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const logs = await db.select().from(userLogs).where(eq(userLogs.eventType, "ai_agent_action")).orderBy(sql`${userLogs.createdAt} DESC`).limit(50);
    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
  res.json({ isAdmin: !!req.isAdmin, email: req.dbUser?.email });
});

const JWT_SECRET = process.env.JWT_SECRET || 'bazaarsync-super-secret-key-2026';

// Temporary mock store for SSH codes
const sshCodes: Record<string, { code: string; expiresAt: number }> = {};


app.post("/api/auth/mock-login", async (req, res) => {
  try {
    const { phone, email, name } = req.body;
    const identifier = phone || email || 'demo';
    
    // Create a custom JWT token
    const token = jwt.sign(
      { type: 'mock_user', email: identifier, name }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/send-ssh", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    
    const emailToCheck = email.toLowerCase().trim();
    let envEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [];
    const defaultAdmins = ['founder@bazaarsync.com', 'admin@bazaarsync.com', 'amitsharmaanxt@gmail.com', 'amitsharma99976@gmail.com'];
    const adminEmails = [...envEmails, ...defaultAdmins];
    
    if (!adminEmails.includes(emailToCheck)) {
      return res.status(403).json({ error: "Email is not authorized for Admin SSH access" });
    }
    
    // Generate a 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store code with 10 mins expiry
    sshCodes[emailToCheck] = {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000
    };
    
    // In production this would send an email. For this env, we log it.
    console.log(`[AUTH] SSH Code for ${emailToCheck}: ${code}`);
    
    res.json({ success: true, message: "Code sent successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/verify-ssh", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });
    
    const emailToCheck = email.toLowerCase().trim();
    const storedData = sshCodes[emailToCheck];
    
    if (!storedData) {
      return res.status(400).json({ error: "No SSH code requested for this email" });
    }
    
    if (Date.now() > storedData.expiresAt) {
      delete sshCodes[emailToCheck];
      return res.status(400).json({ error: "SSH code expired" });
    }
    
    if (storedData.code !== code.trim()) {
      return res.status(400).json({ error: "Invalid SSH code" });
    }
    
    // Code matched, clear it
    delete sshCodes[emailToCheck];
    
    // Generate our custom JWT
    const token = jwt.sign({ email: emailToCheck, type: 'admin_ssh' }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ success: true, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/session-log", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { eventType, metadata } = req.body;
    await db.insert(userLogs).values({
      userId: req.dbUser!.id,
      eventType: eventType || 'unknown',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] || '',
      metadata: typeof metadata === 'string' ? metadata : JSON.stringify(metadata)
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Session log error:", error);
    res.status(500).json({ error: "Failed to log session" });
  }
});





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
      id: `cmd_${Date.now()}`,
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




// WhatsApp Integration API
app.get("/api/whatsapp/status", requireAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser!.id.toString();
    const status = getWhatsAppStatus(shopId);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/whatsapp/connect", requireAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser!.id.toString();
    const status = getWhatsAppStatus(shopId);
    
    if (!status.connected && !status.qr) {
      // Start connection
      initWhatsApp(shopId);
    }
    
    // Return current status (might take a second for QR to generate, so frontend will poll)
    res.json({ success: true, message: "Connection initiated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/whatsapp/disconnect", requireAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser!.id.toString();
    await disconnectWhatsApp(shopId);
    res.json({ success: true, message: "Disconnected successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/whatsapp/send-bill", requireAuth, async (req: AuthRequest, res) => {
  try {
    const shopId = req.dbUser!.id.toString();
    const { customerName, phone, amount, billNo, items } = req.body;
    
    if (!phone) return res.status(400).json({ error: "Phone number required" });
    
    const shopName = "BazaarSync Shop";
    
    let messageText = `🏪 *${shopName}*\n\n` +
                      `नमस्ते *${customerName || "ग्राहक"}*,\n` +
                      `आपकी दुकान का बिल तैयार है।\n\n` +
                      `🧾 बिल नंबर: ${billNo || new Date().getTime().toString().slice(-6)}\n` +
                      `💰 कुल राशि: ₹${amount}\n`;
                      
    if (items && Array.isArray(items) && items.length > 0) {
      messageText += `\n*विवरण:*\n`;
      items.forEach((item: any) => {
        messageText += `- ${item.name} x ${item.quantity || 1} (₹${item.price})\n`;
      });
    }

    messageText += `\nखरीदारी के लिए धन्यवाद! 🙏`;

    await sendWhatsAppMessage(shopId, phone, messageText);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Failed to send WhatsApp message:", error);
    res.status(500).json({ error: error.message || "Failed to send message. Please ensure WhatsApp is connected." });
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
  app.listen(PORT, "0.0.0.0", () => { console.log(`BazaarSync server running on http://0.0.0.0:${PORT}`); });
}
startServer();
