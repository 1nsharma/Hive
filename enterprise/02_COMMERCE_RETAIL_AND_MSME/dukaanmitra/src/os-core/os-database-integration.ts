import { globalCommandBus, Command } from './command-bus.js';
import { DomainEvent } from './domain-events.js';
import { db } from '../db/index.js';
import { customers, products, transactions, stockTransactions } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { globalEventBus } from './event-bus.js';
import { globalObservability } from './observability.js';
import { globalProjectionEngine } from './projection-engine.js';
import { inventoryAgent } from '../agents/inventory-agent.js';
import { sendWhatsAppMessage } from '../whatsapp/index.js';

export function initializeDatabaseIntegration() {
  // 1. CREATE CUSTOMER
  globalCommandBus.registerHandler('CREATE_CUSTOMER', {
    handle: async (command: Command) => {
      const { name, phone, balance } = command.payload;
      const userId = parseInt(command.tenantId);

      const newCust = await db.insert(customers).values({
        userId,
        name,
        phone: phone || "",
        balance: Number(balance) || 0
      }).returning();

      const event: DomainEvent = {
        id: `evt_${Date.now()}`,
        type: 'CUSTOMER_CREATED' as any,
        tenantId: command.tenantId,
        payload: { record: newCust[0] },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });

  // 2. CREATE PRODUCT
  globalCommandBus.registerHandler('CREATE_PRODUCT', {
    handle: async (command: Command) => {
      const { name, stock, unit, price, costPrice, lowStockThreshold, barcode } = command.payload;
      const userId = parseInt(command.tenantId);

      const newProduct = await db.insert(products).values({
        userId,
        name,
        stock: Number(stock) || 0,
        unit: unit || "piece",
        price: Number(price) || 0,
        costPrice: Number(costPrice) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 10,
        barcode: barcode || null
      }).returning();

      const event: DomainEvent = {
        id: `evt_${Date.now()}`,
        type: 'INVENTORY_UPDATED' as any,
        tenantId: command.tenantId,
        payload: { record: newProduct[0] },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });

  // 3. CREATE TRANSACTION
  globalCommandBus.registerHandler('CREATE_TRANSACTION', {
    handle: async (command: Command) => {
      const { customerId, amount, type, product, quantity, notes } = command.payload;
      const userId = parseInt(command.tenantId);

      const custResult = await db.select().from(customers).where(and(eq(customers.id, parseInt(customerId)), eq(customers.userId, userId)));
      if (custResult.length === 0) throw new Error("Customer not found");
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
        matchedProduct = userProducts.find((p: any) => p.name.toLowerCase().includes(cleanProdQuery) || cleanProdQuery.includes(p.name.toLowerCase()));
        
        const qtyNum = parseFloat(quantity) || 1;
        const unitExtracted = quantity ? (quantity.replace(/[\d\s.]/g, '') || "piece") : "piece";

        if (matchedProduct) {
          if (type === "credit") {
            const newStock = Math.max(-100, matchedProduct.stock - qtyNum);
            await db.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, matchedProduct.id));
            matchedProduct.stock = newStock;
            
            // Generate Domain Event for Low Stock
            if (newStock <= matchedProduct.lowStockThreshold) {
              const lowStockEvent: DomainEvent = {
                id: `evt_low_${Date.now()}`,
                type: 'INVENTORY_LOW',
                tenantId: command.tenantId,
                payload: { item: matchedProduct.name, currentStock: newStock, requiredStock: matchedProduct.lowStockThreshold * 3 },
                timestamp: Date.now(),
                sourceId: 'system_monitor'
              };
              globalEventBus.publish(lowStockEvent);
            }
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
        product: product || "",
        quantity: quantity?.toString() || "",
        date: new Date().toISOString(),
        notes: notes || ""
      }).returning();

      const eventType = type === 'credit' ? 'UDHAAR_ADDED' : type === 'payment' ? 'PAYMENT_RECEIVED' : 'SALE_CREATED';
      const event: DomainEvent = {
        id: `evt_${Date.now()}`,
        type: eventType as any,
        tenantId: command.tenantId,
        payload: { record: newTx[0] },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });
  
  
  // 6. CREATE PURCHASE ORDER
  globalCommandBus.registerHandler('CREATE_PURCHASE', {
    handle: async (command: Command) => {
      const { item, qtyToOrder, totalCost } = command.payload;
      console.log(`[DB Integration] Executing CREATE_PURCHASE: ${qtyToOrder}x ${item} for ${totalCost}`);
      
      const event: DomainEvent = {
        id: `evt_po_${Date.now()}`,
        type: 'PURCHASE_CREATED',
        tenantId: command.tenantId,
        payload: { item, qtyToOrder, totalCost, status: 'DRAFT' },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);
      return [event];
    }
  });

  // Connect EventBus to Projections
  
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
        id: `evt_${Date.now()}`,
        type: eventType as any,
        tenantId: command.tenantId,
        payload: { record: updatedProd[0] },
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      globalEventBus.publish(event);

      if (newStock <= product.lowStockThreshold) {
        const lowStockEvent: DomainEvent = {
          id: `evt_low_${Date.now()}`,
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
        id: `evt_${Date.now()}`,
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


  // Connect EventBus to Projections
  globalEventBus.subscribe('CUSTOMER_CREATED' as any, async (event) => {
    globalProjectionEngine.processEvent(event);
  });
  
  globalEventBus.subscribe('INVENTORY_UPDATED' as any, async (event) => {
    globalProjectionEngine.processEvent(event);
  });

  globalEventBus.subscribe('UDHAAR_ADDED' as any, async (event) => {
    globalObservability.logAction({
      tenantId: event.tenantId,
      agentId: 'system',
      actionType: 'DECISION',
      payload: event.payload,
      reasoning: 'Customer udhaar processed',
      latencyMs: 0,
      costEstimate: 0
    });
    globalProjectionEngine.processEvent(event);
  });
  
  globalEventBus.subscribe('PAYMENT_RECEIVED' as any, async (event) => {
    globalProjectionEngine.processEvent(event);
  });
  
  globalEventBus.subscribe('SALE_CREATED' as any, async (event) => {
    globalProjectionEngine.processEvent(event);
  });

  globalEventBus.subscribe('INVENTORY_LOW', async (event) => {
    await inventoryAgent.onInventoryLow(event);
  });
}
