import { Customer, Product, Transaction, ParsedAISuggestion, Supplier, Purchase, PurchaseItem } from "./types";


export async function fetchWithAuth(url: string, options: any = {}, maxRetries = 3, baseDelayMs = 500) {
  let token = null;
  let demoId = null;
  let userRole = null;
  try {
    const authData = localStorage.getItem('bazaarsync_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      token = parsed.token;
    }
  } catch (e) {}
  
  try {
    const userData = localStorage.getItem('bazaarsync_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      userRole = parsed.role;
    }
  } catch (e) {}
  
  try {
    demoId = localStorage.getItem('bazaarsync_demo_id');
    if (!demoId) {
      demoId = 'demo_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('bazaarsync_demo_id', demoId);
    }
  } catch (e) {}

  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', 'Bearer ' + token);
  }
  if (demoId) {
    headers.set('x-demo-id', demoId);
  }
  if (userRole) {
    headers.set('x-user-role', userRole);
  }
  options.headers = headers;
  
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && (response.status >= 500 || response.status === 429)) {
        throw new Error(`Server Error: ${response.status}`);
      }
      return response;
    } catch (error: any) {
      attempt++;
      if (attempt >= maxRetries) break;
      const delay = (Math.pow(2, attempt - 1) * baseDelayMs) + (Math.random() * 200);
      console.warn(`[Network Retry] Fetch failed for ${url} (attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return fetch(url, options);
}


// Authentic Indian Rupee Formatting helper (Lakh / Crore style formatting)
export function formatRupees(amount: number): string {
  const isNegative = amount < 0;
  const absAmt = Math.abs(amount);
  
  // Format to standard Indian Currency
  let x = absAmt.toFixed(0);
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return `${isNegative ? "-" : ""}₹${formatted}`;
}

export function formatDateHindi(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatDateEnglish(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Guest/Demo Mode Utilities
export function isGuestUser(): boolean {
  try {
    const saved = localStorage.getItem("bazaarsync_user");
    if (saved) {
      const u = JSON.parse(saved);
      return !!u.isGuest;
    }
  } catch (e) {}
  return false;
}

export function getGuestDB() {
  const defaultDB = {
    customers: [
      { id: "cust_demo1", name: "अमित कुमार", phone: "9876543210", balance: 1200, updatedAt: new Date().toISOString() },
      { id: "cust_demo2", name: "सरिता देवी", phone: "9812345678", balance: -350, updatedAt: new Date().toISOString() },
      { id: "cust_demo3", name: "राजेश सिंह", phone: "9765432109", balance: 5400, updatedAt: new Date().toISOString() }
    ],
    products: [
      { id: "prod_demo1", name: "चीनी (Sugar)", stock: 45, unit: "kg", price: 42, costPrice: 38, lowStockThreshold: 10, updatedAt: new Date().toISOString() },
      { id: "prod_demo2", name: "सरसों तेल (Oil)", stock: 8, unit: "litre", price: 165, costPrice: 150, lowStockThreshold: 15, updatedAt: new Date().toISOString() },
      { id: "prod_demo3", name: "आटा (Ashirvaad)", stock: 120, unit: "kg", price: 35, costPrice: 30, lowStockThreshold: 20, updatedAt: new Date().toISOString() },
      { id: "prod_demo4", name: "चाय पत्ती (Tata Tea)", stock: 2, unit: "packet", price: 95, costPrice: 82, lowStockThreshold: 5, updatedAt: new Date().toISOString() }
    ],
    transactions: [
      { id: "tx_demo1", customerId: "cust_demo1", customerName: "अमित कुमार", amount: 1200, type: "credit", product: "सरसों तेल (Oil)", quantity: "2 litre", date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), notes: "सप्ताह के अंत में भुगतान करेंगे" },
      { id: "tx_demo2", customerId: "cust_demo2", customerName: "सरिता देवी", amount: 350, type: "payment", date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), notes: "पुराना बकाया जमा" }
    ]
  };
  if (typeof window === "undefined") return defaultDB;
  const data = localStorage.getItem("bazaarsync_guest_db");
  if (!data) {
    const fullDefaultDB = { ...defaultDB, suppliers: [], purchases: [] };
    localStorage.setItem("bazaarsync_guest_db", JSON.stringify(fullDefaultDB));
    return fullDefaultDB;
  }
  const parsed = JSON.parse(data);
  if (!parsed.suppliers) parsed.suppliers = [];
  if (!parsed.purchases) parsed.purchases = [];
  return parsed;
}

export function saveGuestDB(db: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bazaarsync_guest_db", JSON.stringify(db));
  }
}

export async function mergeGuestDataWithServer(): Promise<boolean> {
  try {
    const guestDB = getGuestDB();
    const response = await fetchWithAuth("/api/db/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guestDB)
    });
    if (response.ok) {
      localStorage.removeItem("bazaarsync_guest_db");
      return true;
    }
  } catch (err) {
    console.error("Failed to merge guest data:", err);
  }
  return false;
}

// Service API layer
export async function fetchDB() {
  if (isGuestUser()) {
    return getGuestDB();
  }
  const response = await fetchWithAuth("/api/db");
  if (response.status === 401) {
    throw new Error("401 Unauthorized: Missing token");
  }
  if (!response.ok) {
    const text = await response.text();
    console.error("fetchDB failed:", response.status, text);
    throw new Error(`Failed to load database (Status: ${response.status}): ${text}`);
  }
  return response.json();
}

export async function addCustomer(name: string, phone: string, balance: number, ledgerEnabled: boolean = true): Promise<Customer> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name,
      phone: phone || "",
      balance: Number(balance) || 0,
      ledgerEnabled,
      updatedAt: new Date().toISOString()
    };
    db.customers.push(newCustomer);
    saveGuestDB(db);
    return newCustomer;
  }
  const response = await fetchWithAuth("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, balance, ledgerEnabled })
  });
  if (!response.ok) throw new Error("Failed to add customer");
  return response.json();
}

export async function updateCustomer(id: string, name: string, phone: string, balance: number, ledgerEnabled: boolean = true): Promise<Customer> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const idx = db.customers.findIndex((c: any) => c.id === id);
    if (idx === -1) throw new Error("Customer not found");
    db.customers[idx] = {
      ...db.customers[idx],
      name,
      phone,
      balance: Number(balance),
      ledgerEnabled,
      updatedAt: new Date().toISOString()
    };
    saveGuestDB(db);
    return db.customers[idx];
  }
  const response = await fetchWithAuth(`/api/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, balance, ledgerEnabled })
  });
  if (!response.ok) throw new Error("Failed to update customer");
  return response.json();
}

export async function deleteCustomer(id: string): Promise<boolean> {
  if (isGuestUser()) {
    const db = getGuestDB();
    db.customers = db.customers.filter((c: any) => c.id !== id);
    saveGuestDB(db);
    return true;
  }
  const response = await fetchWithAuth(`/api/customers/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete customer");
  return true;
}

export async function addProduct(
  name: string, 
  stock: number, 
  unit: string, 
  price: number, 
  costPrice: number, 
  lowStockThreshold: number,
  barcode?: string
): Promise<Product> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name,
      stock: Number(stock) || 0,
      unit: unit || "piece",
      price: Number(price) || 0,
      costPrice: Number(costPrice) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      barcode,
      updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    saveGuestDB(db);
    return newProduct;
  }
  const response = await fetchWithAuth("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, stock, unit, price, costPrice, lowStockThreshold, barcode })
  });
  if (!response.ok) throw new Error("Failed to add product");
  return response.json();
}

export async function updateProduct(
  id: string,
  name: string,
  stock: number,
  unit: string,
  price: number,
  costPrice: number,
  lowStockThreshold: number
): Promise<Product> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const idx = db.products.findIndex((p: any) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    db.products[idx] = {
      ...db.products[idx],
      name,
      stock: Number(stock),
      unit,
      price: Number(price),
      costPrice: Number(costPrice),
      lowStockThreshold: Number(lowStockThreshold),
      updatedAt: new Date().toISOString()
    };
    saveGuestDB(db);
    return db.products[idx];
  }
  const response = await fetchWithAuth(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, stock, unit, price, costPrice, lowStockThreshold })
  });
  if (!response.ok) throw new Error("Failed to update product");
  return response.json();
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isGuestUser()) {
    const db = getGuestDB();
    db.products = db.products.filter((p: any) => p.id !== id);
    saveGuestDB(db);
    return true;
  }
  const response = await fetchWithAuth(`/api/products/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete product");
  return true;
}

export async function addTransaction(
  customerId: string,
  amount: number,
  type: 'credit' | 'payment' | 'cash_sale',
  product?: string,
  quantity?: string,
  notes?: string
): Promise<{ transaction: Transaction; customer: Customer; product: Product | null }> {
  if (isGuestUser()) {
    const db = getGuestDB();
    let customer = db.customers.find((c: any) => c.id === customerId);
    if (!customer && customerId) throw new Error("Customer not found");
    if (!customer) customer = { id: "cash", name: "Cash Sale", phone: "", balance: 0 };

    const amtNum = Number(amount) || 0;
    if (type === "credit") {
      customer.balance += amtNum;
    } else if (type === "payment") {
      customer.balance -= amtNum;
    }
    customer.updatedAt = new Date().toISOString();

    // Auto-inventory sync in guest mode
    let matchedProduct: Product | null = null;
    if (product && product.trim().length > 0) {
      const cleanProdQuery = product.trim().toLowerCase();
      const gp = db.products.find((p: any) => 
        p.name.toLowerCase().includes(cleanProdQuery) || cleanProdQuery.includes(p.name.toLowerCase())
      );
      const qtyNum = parseFloat(quantity || "") || 1;
      const unitExtracted = quantity ? (quantity.replace(/[\d\s.]/g, '') || "piece") : "piece";

      if (gp) {
        if (type === "credit") {
          gp.stock = Math.max(-100, gp.stock - qtyNum);
          gp.updatedAt = new Date().toISOString();
        }
        matchedProduct = gp;
      } else {
        const calculatedPrice = amtNum > 0 ? Math.round(amtNum / (qtyNum || 1)) : 40;
        const newProd: Product = {
          id: `prod_${Date.now()}`,
          name: product.trim(),
          stock: -qtyNum,
          unit: unitExtracted,
          price: calculatedPrice,
          costPrice: Math.round(calculatedPrice * 0.8),
          lowStockThreshold: 5,
          updatedAt: new Date().toISOString()
        };
        db.products.push(newProd);
        matchedProduct = newProd;
      }
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      customerId,
      customerName: customer.name,
      amount: amtNum,
      type,
      product: matchedProduct ? matchedProduct.name : product || "",
      quantity: quantity || "",
      date: new Date().toISOString(),
      notes: notes || ""
    };

    db.transactions.push(newTx);
    saveGuestDB(db);
    return { transaction: newTx, customer, product: matchedProduct };
  }

  const response = await fetchWithAuth("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId, amount, type, product, quantity, notes })
  });
  if (!response.ok) throw new Error("Failed to add transaction");
  return response.json();
}

export async function adjustStock(
  productId: string,
  quantity: number,
  type: 'in' | 'out',
  notes?: string
): Promise<Product> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const product = db.products.find((p: any) => p.id === productId);
    if (!product) throw new Error("Product not found");

    const qty = Number(quantity) || 0;
    if (type === "in") {
      product.stock += qty;
    } else if (type === "out") {
      product.stock = Math.max(0, product.stock - qty);
    }
    product.updatedAt = new Date().toISOString();
    saveGuestDB(db);
    return product;
  }

  const response = await fetchWithAuth("/api/stock-adjust", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity, type, notes })
  });
  if (!response.ok) throw new Error("Failed to adjust stock");
  return response.json();
}

export async function parseAIMunim(query: string, businessConfig?: any): Promise<ParsedAISuggestion> {
  if (isGuestUser()) {
    // Call the parse endpoint but give local context
    const db = getGuestDB();
    const response = await fetchWithAuth("/api/munim/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, customers: db.customers, products: db.products, businessConfig })
    });
    if (!response.ok) {
      throw new Error("AI Munim parsing failed in offline simulator");
    }
    return response.json();
  }

  const response = await fetchWithAuth("/api/munim/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, businessConfig })
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "AI Munim did not respond");
  }
  return response.json();
}

export async function scanBillPhoto(base64Image: string): Promise<any> {
  if (isGuestUser()) {
    // Simulated delay for premium scanning effect
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const mockBills = [
      {
        products: [
          { name: "Sugar (चीनी)", quantity: 5, price: 42, unit: "kg", total: 210 },
          { name: "Tata Tea (चाय)", quantity: 2, price: 95, unit: "packet", total: 190 }
        ],
        customerName: "दिनेश वर्मा",
        totalBillAmount: 400,
        hindiSummary: "बिल स्कैन सफल (मॉक ऑफ़लाइन): चीनी 5 किलो और टाटा चाय 2 पैकेट। कुल रकम ₹400 है।"
      },
      {
        products: [
          { name: "Rice (चावल)", quantity: 15, price: 38, unit: "kg", total: 570 },
          { name: "Mustard Oil", quantity: 3, price: 160, unit: "litre", total: 480 }
        ],
        customerName: "श्रीमती वर्मा",
        totalBillAmount: 1050,
        hindiSummary: "बिल स्कैन सफल (मॉक ऑफ़लाइन): चावल 15 किलो और सरसों तेल 3 लीटर। कुल रकम ₹1050 है।"
      }
    ];
    return mockBills[Math.floor(Math.random() * mockBills.length)];
  }

  const response = await fetchWithAuth("/api/munim/scan-bill", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image })
  });
  if (!response.ok) throw new Error("Failed to scan bill via AI Camera");
  return response.json();
}

export async function verifyBarcodeVisual(base64Image: string, productName: string, barcode: string): Promise<any> {
  if (isGuestUser()) {
    // Mock for offline/guest
    return {
      isMatch: true,
      confidence: 0.9,
      reason: "मॉक (ऑफ़लाइन): उत्पाद सही लग रहा है।",
      detectedObject: productName
    };
  }

  const response = await fetchWithAuth("/api/munim/verify-barcode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image, productName, barcode })
  });
  if (!response.ok) throw new Error("Failed to verify barcode visually");
  return response.json();
}

// Hindi Speech Recognition simulation helper
export const voiceQueriesFallback = [
  "राहुल 500 चीनी उधारी",
  "अमित 1000 रुपये जमा",
  "सुरेश 450 सरसों तेल",
  "पूजा 300 रुपये का आटा लिया",
  "दूध पैकेट 20 स्टॉक जोड़ो",
  "चाय पत्ती 5 किलो खरीदा"
];

export async function logMarketResearch(actionType: string, inputData: any, metadata?: any) {
  try {
    await fetchWithAuth("/api/market-research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionType, inputData, metadata })
    });
  } catch (err) {
    console.error("Failed to log market research", err);
  }
}

// --- CLIENT SIDE SUPPLIER & PURCHASE API HELPERS ---

export async function addSupplier(
  name: string,
  phone: string,
  gstin?: string,
  stateCode?: string,
  balance: number = 0,
  notes?: string
): Promise<Supplier> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const newSupplier: Supplier = {
      id: `sup_${Date.now()}`,
      name,
      phone,
      gstin,
      stateCode,
      balance: Number(balance) || 0,
      notes,
      updatedAt: new Date().toISOString()
    };
    db.suppliers.push(newSupplier);
    saveGuestDB(db);
    return newSupplier;
  }
  const response = await fetchWithAuth("/api/suppliers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, gstin, stateCode, balance, notes })
  });
  if (!response.ok) throw new Error("Failed to add supplier");
  return response.json();
}

export async function updateSupplier(
  id: string,
  name: string,
  phone: string,
  gstin?: string,
  stateCode?: string,
  balance?: number,
  notes?: string
): Promise<Supplier> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const idx = db.suppliers.findIndex((s: any) => s.id === id);
    if (idx === -1) throw new Error("Supplier not found");
    db.suppliers[idx] = {
      ...db.suppliers[idx],
      name,
      phone,
      gstin: gstin !== undefined ? gstin : db.suppliers[idx].gstin,
      stateCode: stateCode !== undefined ? stateCode : db.suppliers[idx].stateCode,
      balance: balance !== undefined ? Number(balance) : db.suppliers[idx].balance,
      notes: notes !== undefined ? notes : db.suppliers[idx].notes,
      updatedAt: new Date().toISOString()
    };
    saveGuestDB(db);
    return db.suppliers[idx];
  }
  const response = await fetchWithAuth(`/api/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, gstin, stateCode, balance, notes })
  });
  if (!response.ok) throw new Error("Failed to update supplier");
  return response.json();
}

export async function deleteSupplier(id: string): Promise<boolean> {
  if (isGuestUser()) {
    const db = getGuestDB();
    db.suppliers = db.suppliers.filter((s: any) => s.id !== id);
    saveGuestDB(db);
    return true;
  }
  const response = await fetchWithAuth(`/api/suppliers/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete supplier");
  return true;
}

export async function recordSupplierPayment(id: string, amount: number): Promise<boolean> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const idx = db.suppliers.findIndex((s: any) => s.id === id);
    if (idx === -1) throw new Error("Supplier not found");
    db.suppliers[idx].balance -= Number(amount);
    db.suppliers[idx].updatedAt = new Date().toISOString();
    saveGuestDB(db);
    return true;
  }
  const response = await fetchWithAuth(`/api/suppliers/${id}/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  if (!response.ok) throw new Error("Failed to record payment");
  return true;
}

export async function addPurchase(purchaseData: {
  supplierId: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  itcStatus: 'eligible' | 'blocked';
  items: PurchaseItem[];
  notes?: string;
  paymentType: 'credit' | 'cash';
  totalAmount: number;
}): Promise<Purchase> {
  if (isGuestUser()) {
    const db = getGuestDB();
    // Verify supplier
    const supplier = db.suppliers.find((s: any) => s.id === purchaseData.supplierId);
    if (!supplier) throw new Error("Supplier not found");

    // 1. Revert supplier balance if credit
    if (purchaseData.paymentType === 'credit') {
      supplier.balance += Number(purchaseData.totalAmount) || 0;
    }

    // 2. Adjust products stock and average cost
    for (const item of purchaseData.items) {
      if (item.productId) {
        const prod = db.products.find((p: any) => p.id === item.productId);
        if (prod) {
          const qty = Number(item.quantity) || 0;
          if (qty > 0) {
            let newCostPrice = Number(item.costPrice) || prod.costPrice;
            if (prod.stock > 0) {
              newCostPrice = ((prod.stock * prod.costPrice) + (qty * (Number(item.costPrice) || 0))) / (prod.stock + qty);
            }
            prod.stock += qty;
            prod.costPrice = newCostPrice;
            prod.updatedAt = new Date().toISOString();

            // Stock transaction
            if (!db.stockTransactions) db.stockTransactions = [];
            db.stockTransactions.push({
              id: `st_${Date.now()}_${Math.random()}`,
              productId: prod.id,
              productName: prod.name,
              quantity: qty,
              type: 'in',
              date: purchaseData.invoiceDate,
              notes: `Purchase Invoice #${purchaseData.invoiceNumber}`
            });
          }
        }
      }
    }

    const newPurchase: Purchase = {
      ...purchaseData,
      id: `pur_${Date.now()}`,
      status: 'active',
      items: JSON.stringify(purchaseData.items)
    };
    if (!db.purchases) db.purchases = [];
    db.purchases.push(newPurchase);
    saveGuestDB(db);
    return newPurchase;
  }

  const response = await fetchWithAuth("/api/purchases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(purchaseData)
  });
  if (!response.ok) throw new Error("Failed to add purchase");
  return response.json();
}

export async function cancelPurchase(id: string): Promise<boolean> {
  if (isGuestUser()) {
    const db = getGuestDB();
    const purchase = db.purchases.find((p: any) => p.id === id);
    if (!purchase) throw new Error("Purchase not found");
    if (purchase.status === 'cancelled') throw new Error("Already cancelled");

    purchase.status = 'cancelled';

    // Revert supplier balance
    if (purchase.paymentType === 'credit') {
      const supplier = db.suppliers.find((s: any) => s.id === purchase.supplierId);
      if (supplier) {
        supplier.balance -= Number(purchase.totalAmount) || 0;
      }
    }

    // Revert stock updates
    const itemsList = typeof purchase.items === 'string' ? JSON.parse(purchase.items) : (purchase.items || []);
    for (const item of itemsList) {
      if (item.productId) {
        const prod = db.products.find((p: any) => p.id === item.productId);
        if (prod) {
          const qty = Number(item.quantity) || 0;
          prod.stock = Math.max(0, prod.stock - qty);
          prod.updatedAt = new Date().toISOString();

          // Offset transaction
          if (!db.stockTransactions) db.stockTransactions = [];
          db.stockTransactions.push({
            id: `st_${Date.now()}_${Math.random()}`,
            productId: prod.id,
            productName: prod.name,
            quantity: -qty,
            type: 'out',
            date: new Date().toISOString().split('T')[0],
            notes: `Purchase cancel: Inv #${purchase.invoiceNumber}`
          });
        }
      }
    }

    saveGuestDB(db);
    return true;
  }

  const response = await fetchWithAuth(`/api/purchases/${id}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });
  if (!response.ok) throw new Error("Failed to cancel purchase");
  return true;
}
