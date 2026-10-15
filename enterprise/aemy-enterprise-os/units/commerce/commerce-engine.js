import { aiGateway } from "../../core/ai-gateway.js";
import { enterpriseBus } from "../../core/bus-event.js";

export class CommerceEngine {
  constructor() {
    this.invoices = [];
    this.khataLedger = new Map(); // customerName -> balance
  }

  async processVoiceOrTextInput(tenantId, rawText) {
    const parsed = await aiGateway.parseCommerceOrder(rawText);
    const invoice = this.generateInvoice(tenantId, parsed.customerName, parsed.items, parsed.isUdhar);
    
    // Update Khata if credit
    if (parsed.isUdhar) {
      const current = this.khataLedger.get(parsed.customerName) || 0;
      this.khataLedger.set(parsed.customerName, current + invoice.grandTotal);
    }

    enterpriseBus.publish(tenantId, "COMMERCE_ORDER_CREATED", {
      invoiceId: invoice.id,
      customerName: invoice.customerName,
      grandTotal: invoice.grandTotal,
      isUdhar: invoice.isUdhar
    });

    return invoice;
  }

  generateInvoice(tenantId, customerName, items, isUdhar = false, taxRate = 0.05) {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const grandTotal = Math.round((subtotal + tax) * 100) / 100;

    const invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      tenantId,
      customerName,
      timestamp: new Date().toISOString(),
      items,
      subtotal,
      tax,
      grandTotal,
      isUdhar,
      status: isUdhar ? "UNPAID_UDHAR" : "PAID_CASH",
      whatsAppShareText: this.formatWhatsAppReceipt(customerName, items, grandTotal, isUdhar)
    };

    this.invoices.push(invoice);
    return invoice;
  }

  formatWhatsAppReceipt(customerName, items, total, isUdhar) {
    const itemsText = items.map(i => `• ${i.name} (${i.quantity}x @ ₹${i.unitPrice}) = ₹${i.total}`).join("\n");
    return `🏪 *DukaanMitra Digital Bill*\n` +
      `Grahak: *${customerName}*\n` +
      `------------------------\n` +
      `${itemsText}\n` +
      `------------------------\n` +
      `*Total: ₹${total}* (${isUdhar ? "Khata/Udhar Baaki" : "Cash Chukta"})\n` +
      `UPI ID: dukaanmitra@okaxis\n` +
      `Dhanyawad! Phir Padhaarein 🙏`;
  }

  getKhataBalance(customerName) {
    return this.khataLedger.get(customerName) || 0;
  }

  getAllInvoices() {
    return [...this.invoices];
  }
}

export const commerceEngine = new CommerceEngine();
