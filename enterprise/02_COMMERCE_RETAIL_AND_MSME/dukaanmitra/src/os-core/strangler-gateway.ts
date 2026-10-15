import { globalCommandBus, Command } from './command-bus';
import { globalEventBus } from './event-bus';
import { DomainEvent } from './domain-events';
import { db } from '../db';
import { transactions, customers, products, stockTransactions } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { inventoryAgent } from '../agents/inventory-agent';
import { globalPolicyEngine } from './policy-engine';

export function initStranglerGateway() {
  // ---------------------------------------------------------
  // PHASE 1: COMMAND HANDLERS (Gateway)
  // ---------------------------------------------------------
  
  globalCommandBus.registerHandler('ADD_TRANSACTION', {
    handle: async (command: Command) => {
      // 1. Evaluate Policies
      await globalPolicyEngine.evaluate({
        tenantId: command.tenantId,
        payload: command.payload
      });

      // 2. Map to Domain Event
      const type = command.payload.type === 'credit' ? 'UDHAAR_ADDED' : 'PAYMENT_RECEIVED';
      const event: DomainEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        type: type,
        tenantId: command.tenantId,
        payload: command.payload,
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      
      // 3. Emit Event (EDA)
      await globalEventBus.publish(event);
      return [event];
    }
  });

  globalCommandBus.registerHandler('CREATE_CUSTOMER', {
    handle: async (command: Command) => {
      const event: DomainEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        type: 'CUSTOMER_CREATED',
        tenantId: command.tenantId,
        payload: command.payload,
        timestamp: Date.now(),
        sourceId: command.issuerId
      };
      await globalEventBus.publish(event);
      return [event];
    }
  });

  // ---------------------------------------------------------
  // PHASE 3 & 4: EVENT HANDLERS & PROJECTIONS (Drizzle CRUD)
  // ---------------------------------------------------------

  globalEventBus.subscribe('UDHAAR_ADDED', async (event: DomainEvent) => {
    const { userId, customerId, amount, type, product, quantity, notes, date } = event.payload;
    const amtNum = Number(amount) || 0;
    const qtyNum = parseFloat(quantity) || 1;
    
    // Legacy Drizzle DB updates (Projection)
    const custResult = await db.select().from(customers).where(and(eq(customers.id, parseInt(customerId)), eq(customers.userId, userId)));
    if (custResult.length > 0) {
      const customer = custResult[0];
      await db.update(customers).set({ balance: customer.balance + amtNum, updatedAt: new Date() }).where(eq(customers.id, customer.id));
      
      await db.insert(transactions).values({
        userId, 
        customerId: customer.id, 
        customerName: customer.name, 
        amount: amtNum, 
        type, 
        product, 
        quantity: quantity?.toString(), 
        date: date || new Date().toISOString(), 
        notes
      });
      
      // Check inventory side effect
      if (product && product.trim().length > 0) {
        const cleanProdQuery = product.trim().toLowerCase();
        const userProducts = await db.select().from(products).where(eq(products.userId, userId));
        const matchedProduct = userProducts.find(p => p.name.toLowerCase().includes(cleanProdQuery) || cleanProdQuery.includes(p.name.toLowerCase()));
        
        if (matchedProduct) {
          const newStock = Math.max(-100, matchedProduct.stock - qtyNum);
          await db.update(products).set({ stock: newStock, updatedAt: new Date() }).where(eq(products.id, matchedProduct.id));
          
          // Phase 2: Agent Integration
          if (newStock <= matchedProduct.lowStockThreshold) {
            await globalEventBus.publish({
              id: `evt_inv_${Date.now()}`,
              type: 'INVENTORY_LOW',
              tenantId: event.tenantId,
              payload: { item: matchedProduct.name, currentStock: newStock, requiredStock: 50 },
              timestamp: Date.now(),
              sourceId: 'system_projection'
            });
          }
        }
      }
    }
  });

  globalEventBus.subscribe('PAYMENT_RECEIVED', async (event: DomainEvent) => {
    const { userId, customerId, amount, type, product, quantity, notes, date } = event.payload;
    const amtNum = Number(amount) || 0;
    
    const custResult = await db.select().from(customers).where(and(eq(customers.id, parseInt(customerId)), eq(customers.userId, userId)));
    if (custResult.length > 0) {
      const customer = custResult[0];
      await db.update(customers).set({ balance: customer.balance - amtNum, updatedAt: new Date() }).where(eq(customers.id, customer.id));
      
      await db.insert(transactions).values({
        userId, customerId: customer.id, customerName: customer.name, amount: amtNum, type, product, 
        quantity: quantity?.toString(), date: date || new Date().toISOString(), notes
      });
    }
  });

  globalEventBus.subscribe('CUSTOMER_CREATED', async (event: DomainEvent) => {
    const { userId, name, phone, balance } = event.payload;
    await db.insert(customers).values({ userId, name, phone, balance: Number(balance) || 0 });
  });

  // ---------------------------------------------------------
  // PHASE 2: AGENT INTEGRATIONS
  // ---------------------------------------------------------
  globalEventBus.subscribe('INVENTORY_LOW', async (event: DomainEvent) => {
    await inventoryAgent.onInventoryLow(event);
  });
}
