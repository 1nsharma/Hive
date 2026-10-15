/**
 * 🏢 Business Identity Engine & Multi Tenant Layer
 */
export type BusinessCategory = 
  | 'kirana' | 'grocery' | 'dairy' | 'pharmacy' | 'medical' 
  | 'restaurant' | 'cafe' | 'bakery' | 'salon' | 'spa' | 'gym'
  | 'fashion' | 'electronics' | 'hardware' | 'mobile'
  | 'manufacturing' | 'wholesale' | 'distributor' | 'service'
  | 'freelancer' | 'agency' | 'solar' | 'construction' 
  | 'agriculture' | 'education' | 'healthcare' | 'all';

export interface BusinessProfile {
  id: string; // Tenant ID
  name: string;
  category: BusinessCategory;
  subCategory?: string;
  size: 'micro' | 'small' | 'medium' | 'enterprise';
  employeesCount: number;
  branches: Branch[];
  taxInfo: IndiaSpecificLayer;
  location: Address;
  workingHours: WorkingHours;
  subscription: 'free' | 'starter' | 'pro' | 'os_premium';
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address: Address;
  managerId?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface WorkingHours {
  timezone: string;
  schedule: Record<string, { open: string; close: string; isClosed: boolean }>;
}

/**
 * 🏛️ India Specific Layer
 */
export interface IndiaSpecificLayer {
  gstin?: string;
  pan?: string;
  aadhaarEkycVerified?: boolean;
  upiId?: string;
  bharatQrId?: string;
  msmeUdyam?: string;
}

/**
 * 💰 Financial Layer
 */
export interface FinancialTransaction {
  id: string;
  tenantId: string;
  type: 'cash' | 'bank' | 'upi' | 'card' | 'credit' | 'emi' | 'loan' | 'udhaar';
  amount: number;
  direction: 'income' | 'expense';
  category: string;
  timestamp: number;
  taxDetails?: {
    cgst: number;
    sgst: number;
    igst: number;
    tds: number;
  };
}

/**
 * 📦 Inventory Layer
 */
export interface InventoryItem {
  id: string;
  tenantId: string;
  name: string;
  type: 'product' | 'service';
  variants: ProductVariant[];
  warehouseId?: string;
  supplierId?: string;
  hsnCode?: string;
  stockMovement: StockMovement[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  qrCode?: string;
  price: number;
  cost: number;
  stock: number;
  batchInfo?: {
    batchNumber: string;
    manufacturingDate: number;
    expiryDate: number;
  };
}

export interface StockMovement {
  id: string;
  type: 'purchase' | 'sale' | 'return' | 'damage' | 'transfer';
  quantity: number;
  timestamp: number;
}

/**
 * 👤 Customer & CRM Layer
 */
export interface CustomerProfile {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  creditLimit: number;
  currentUdhaar: number;
  loyaltyPoints: number;
  segments: string[];
}

/**
 * 🧠 Knowledge Graph Node Types
 */
export type GraphNodeType = 'Customer' | 'Order' | 'Supplier' | 'Product' | 'Inventory' | 'Sales' | 'Profit' | 'Tax' | 'Finance' | 'BusinessHealth';

export interface GraphEdge {
  fromId: string;
  fromType: GraphNodeType;
  toId: string;
  toType: GraphNodeType;
  relation: string; // e.g., 'PURCHASED', 'OWES', 'SUPPLIES'
}

