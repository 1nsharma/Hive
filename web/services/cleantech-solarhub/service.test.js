import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("CleanTech Service (SolarHub): Starts, serves health, and evaluates 3kW subsidy", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "SolarHub CleanTech");
    assert.equal(health.status, "ONLINE");

    const assessRes = await fetch(`${base}/api/assess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: "Sunil Verma",
        city: "Jaipur",
        monthlyBill: 3500,
        roofArea: 400
      })
    });
    assert.equal(assessRes.status, 201);
    const audit = await assessRes.json();
    assert.ok(audit.govSubsidy > 0);
    assert.equal(audit.govSubsidy, 78000);
  } finally {
    server.close();
  }
});
