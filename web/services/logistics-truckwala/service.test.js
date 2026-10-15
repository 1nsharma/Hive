import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Logistics Service (TruckWala 24x7): Starts, serves health, and dispatches SOS", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "TruckWala 24x7");
    assert.equal(health.status, "ONLINE");

    const dispRes = await fetch(`${base}/api/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        truckNumber: "DL-01-AB-9999",
        driverName: "Karan Singh",
        driverPhone: "9829011111",
        location: "NH-8 KM 50",
        issue: "Diesel pump failure"
      })
    });
    assert.equal(dispRes.status, 201);
    const ticket = await dispRes.json();
    assert.equal(ticket.truckNumber, "DL-01-AB-9999");
    assert.equal(ticket.status, "DISPATCHED");
  } finally {
    server.close();
  }
});
