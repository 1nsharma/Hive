import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "./app.js";

test("API Integration: Core health and metrics endpoints respond with 200", async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  try {
    // 1. Test /api/health
    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const healthJson = await healthRes.json();
    assert.equal(healthJson.status, "HEALTHY");
    assert.equal(healthJson.ledgerIntegrity.valid, true);

    // 2. Test /api/commerce/order
    const orderRes = await fetch(`${baseUrl}/api/commerce/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText: "5 packet maggi to Ramesh on udhar" })
    });
    assert.equal(orderRes.status, 201);
    const orderJson = await orderRes.json();
    assert.equal(orderJson.customerName, "Ramesh");
    assert.equal(orderJson.isUdhar, true);

    // 3. Test /api/logistics/breakdown
    const logRes = await fetch(`${baseUrl}/api/logistics/breakdown`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        truckNumber: "RJ-14-1122",
        driverName: "Dharmendra",
        driverPhone: "9988776655",
        highwayLocation: "NH-48",
        issueDescription: "Air pipe leak"
      })
    });
    assert.equal(logRes.status, 201);
    const logJson = await logRes.json();
    assert.equal(logJson.truckNumber, "RJ-14-1122");

    // 4. Test /api/cleantech/calculate
    const solarRes = await fetch(`${baseUrl}/api/cleantech/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "Aemy Solar Villa",
        clientPhone: "9000000000",
        city: "Jaipur",
        monthlyBillINR: 2500,
        roofAreaSqFt: 300
      })
    });
    assert.equal(solarRes.status, 201);
    const solarJson = await solarRes.json();
    assert.ok(solarJson.govSubsidy > 0);

    // 5. Test /api/metrics
    const metricsRes = await fetch(`${baseUrl}/api/metrics`);
    assert.equal(metricsRes.status, 200);
    const metricsJson = await metricsRes.json();
    assert.ok(metricsJson.totalRevenueGTV > 0);
    assert.ok(metricsJson.ledgerTotalBlocks > 1);
  } finally {
    server.close();
  }
});
