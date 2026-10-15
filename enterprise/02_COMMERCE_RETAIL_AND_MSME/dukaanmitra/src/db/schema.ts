import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, doublePrecision, varchar, boolean } from 'drizzle-orm/pg-core';

// users table (for shopkeepers / authenticated users)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Customers
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  balance: doublePrecision('balance').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Transactions (Ledger/Udhaari)
export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  customerId: integer('customer_id').references(() => customers.id).notNull(),
  customerName: text('customer_name').notNull(),
  amount: doublePrecision('amount').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'credit' | 'payment'
  product: text('product'),
  quantity: text('quantity'),
  date: text('date').notNull(),
  notes: text('notes'),
  invoiceNumber: text('invoice_number'),
  cgst: doublePrecision('cgst'),
  sgst: doublePrecision('sgst'),
  igst: doublePrecision('igst'),
  hsnCode: text('hsn_code'),
  isB2b: boolean('is_b2b').default(false),
  buyerGstin: text('buyer_gstin'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products (Inventory)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  stock: doublePrecision('stock').default(0).notNull(),
  unit: text('unit').notNull(),
  price: doublePrecision('price').default(0).notNull(),
  costPrice: doublePrecision('cost_price').default(0).notNull(),
  lowStockThreshold: doublePrecision('low_stock_threshold').default(10).notNull(),
  barcode: text('barcode'),
  hsnCode: text('hsn_code'),
  gstRate: doublePrecision('gst_rate'),
  description: text('description'),
  isService: boolean('is_service').default(false),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stock Transactions (Inventory In/Out)
export const stockTransactions = pgTable('stock_transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  productName: text('product_name').notNull(),
  quantity: doublePrecision('quantity').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'in' | 'out'
  date: text('date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Suppliers (Vendor Management)
export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  gstin: text('gstin'),
  phone: text('phone').notNull(),
  stateCode: text('state_code'),
  balance: doublePrecision('balance').default(0).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Purchases (Input Tax Credit / Procurements Ledger)
export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  supplierId: integer('supplier_id').references(() => suppliers.id).notNull(),
  invoiceNumber: text('invoice_number').notNull(),
  invoiceDate: text('invoice_date').notNull(),
  taxableValue: doublePrecision('taxable_value').notNull(),
  cgst: doublePrecision('cgst').default(0).notNull(),
  sgst: doublePrecision('sgst').default(0).notNull(),
  igst: doublePrecision('igst').default(0).notNull(),
  itcStatus: varchar('itc_status', { length: 20 }).default('eligible').notNull(), // 'eligible' | 'blocked'
  items: text('items'), // JSON string array of items
  notes: text('notes'),
  paymentType: text('payment_type').default('credit').notNull(), // 'credit' | 'cash'
  totalAmount: doublePrecision('total_amount').default(0).notNull(),
  status: text('status').default('active').notNull(), // 'active' | 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
});

// GST Returns (GSTR-1, GSTR-3B filings tracker)
export const gstReturns = pgTable('gst_returns', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  financialPeriod: varchar('financial_period', { length: 20 }).notNull(), // e.g. "07-2026"
  formType: varchar('form_type', { length: 20 }).notNull(), // 'GSTR-1' | 'GSTR-3B'
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending' | 'prepared' | 'reconciled' | 'ready' | 'filed'
  filedAt: timestamp('filed_at'),
  arnNumber: text('arn_number'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Market Research & Demo Tracking Table (Public/Demo Data)
export const marketResearch = pgTable('market_research', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable if anonymous demo users
  userHash: text('user_hash'),
  customerHash: text('customer_hash'),
  demoId: text('demo_id'), // For unauthenticated demo tracking
  actionType: text('action_type').notNull(),
  inputData: text('input_data'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Session Logs
export const userLogs = pgTable('user_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  eventType: varchar('event_type', { length: 50 }).notNull(), // 'login', 'logout', 'session_start'
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// AI Token Balancer / Cache (Cost Efficiency)
export const aiCache = pgTable('ai_cache', {
  id: serial('id').primaryKey(),
  promptHash: text('prompt_hash').notNull().unique(), // The text query or hashed image base64
  response: text('response').notNull(), // The JSON response from Gemini
  type: varchar('type', { length: 20 }).notNull(), // 'text' | 'image'
  hitCount: integer('hit_count').default(0).notNull(), // Track how much we saved!
  createdAt: timestamp('created_at').defaultNow(),
});

// User Settings / Business Config
export const userSettings = pgTable('user_settings', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull().unique(),
  businessName: text('business_name').notNull(),
  phone: text('phone').notNull(),
  address: text('address'),
  category: text('category'),
  description: text('description'),
  gstNumber: text('gst_number'),
  businessType: text('business_type'), // e.g. "Regular" | "Composition"
  stateCode: text('state_code'), // e.g. "27" for Maharashtra
  pan: text('pan'),
  mapsLink: text('maps_link'),
  munimStyle: text('munim_style'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Potential Customers (Contacts)
export const potentialCustomers = pgTable('potential_customers', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  source: text('source').default('contacts'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many, one }) => ({
  customers: many(customers),
  transactions: many(transactions),
  products: many(products),
  stockTransactions: many(stockTransactions),
  suppliers: many(suppliers),
  purchases: many(purchases),
  gstReturns: many(gstReturns),
  marketResearch: many(marketResearch),
  userLogs: many(userLogs),
  settings: one(userSettings)
}));
