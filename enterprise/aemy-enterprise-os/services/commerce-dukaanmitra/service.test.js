import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Commerce Service (DukaanMitra): Starts, serves health, and processes orders", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "DukaanMitra OS");
    assert.equal(health.status, "ONLINE");

    const orderRes = await fetch(`${base}/api/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Sharma Ji",
        phone: "9829099999",
        items: [{ name: "Basmati Rice 5kg", qty: 1, price: 450 }],
        total: 450,
        isUdhar: true
      })
    });
    assert.equal(orderRes.status, 201);
    const inv = await orderRes.json();
    assert.equal(inv.customerName, "Sharma Ji");
    assert.equal(inv.isUdhar, true);

    const cust = db.customers.find(c => c.name === "Sharma Ji");
    assert.ok(cust);
    assert.equal(cust.balance, 450);
  } finally {
    server.close();
  }
});
