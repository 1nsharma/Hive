import test from "node:test";
import assert from "node:assert/strict";
import { CommerceEngine } from "./commerce-engine.js";

test("DukaanMitra: Parses order items and accurately computes subtotal and tax", () => {
  const engine = new CommerceEngine();
  const items = [
    { name: "Maggi Noodles", quantity: 5, unitPrice: 14, total: 70 },
    { name: "Amul Milk", quantity: 2, unitPrice: 33, total: 66 }
  ];
  const invoice = engine.generateInvoice("TENANT_01", "Ramesh Kumar", items, false, 0.05);

  assert.equal(invoice.customerName, "Ramesh Kumar");
  assert.equal(invoice.subtotal, 136);
  assert.equal(invoice.tax, 6.8);
  assert.equal(invoice.grandTotal, 142.8);
  assert.equal(invoice.status, "PAID_CASH");
});

test("DukaanMitra: Voice input updates Khata/Udhar balance properly", async () => {
  const engine = new CommerceEngine();
  const rawVoiceText = "5 packet maggi aur 2 litre amul milk to Ramesh on udhar";
  const invoice = await engine.processVoiceOrTextInput("TENANT_01", rawVoiceText);

  assert.equal(invoice.isUdhar, true);
  assert.equal(invoice.customerName, "Ramesh");
  assert.ok(invoice.grandTotal > 0);
  assert.equal(engine.getKhataBalance("Ramesh"), invoice.grandTotal);
  assert.ok(invoice.whatsAppShareText.includes("DukaanMitra Digital Bill"));
});
