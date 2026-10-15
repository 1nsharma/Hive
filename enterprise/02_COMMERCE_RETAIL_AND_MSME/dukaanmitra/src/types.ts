export interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number; // positive = customer owes us (udhaari), negative = we owe customer (credit/advance)
  ledgerEnabled?: boolean;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'credit' | 'payment' | 'cash_sale' | 'sale'; // credit = shopkeeper gave goods on credit, payment = customer paid back cash, cash_sale/sale = cash purchase
  product?: string;
  quantity?: string;
  date: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  unit: string; // e.g., "kg", "packet", "litre", "piece"
  price: number; // selling price per unit
  costPrice: number; // purchase price per unit (for profit calculation)
  lowStockThreshold: number;
  barcode?: string;
  updatedAt: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'in' | 'out'; // in = stock added/purchased, out = stock sold
  date: string;
  notes?: string;
}

export interface ParsedAISuggestion {
  customer?: string;
  phone?: string;
  amount?: number;
  product?: string;
  quantity?: string;
  unit?: string;
  price?: number;
  isNewProduct?: boolean;
  type: 'credit' | 'payment' | 'stock_add' | 'sale' | 'unknown';
  hindiExplanation: string;
  confidence: number;
}

export interface FeatureMetadata {
  id: string;
  group: 'operations' | 'finance' | 'marketplace' | 'ai' | 'settings';
  priority: number;
  business_types: string[];
  placement: 'dynamic' | 'fixed';
}

export type WidgetSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export interface WorkspaceWidget {
  id: string;
  featureId: string;
  title: string;
  size: WidgetSize;
  priority: number;
  category: 'ai' | 'finance' | 'operations' | 'utility' | 'reports';
  collapsible: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  gstin?: string;
  phone: string;
  stateCode?: string;
  balance: number;
  notes?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface PurchaseItem {
  productId?: string;
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
  gstRate: number;
  total: number;
}

export interface Purchase {
  id: string;
  supplierId: string;
  invoiceNumber: string;
  invoiceDate: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  itcStatus: 'eligible' | 'blocked';
  items?: string | PurchaseItem[];
  notes?: string;
  paymentType: 'credit' | 'cash';
  totalAmount: number;
  status: 'active' | 'cancelled';
  createdAt?: string;
}
