import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Service 3 (GovAI Central Services): Starts, serves health, and verifies citizen", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "GovAI Citizen Services");
    assert.equal(health.status, "ONLINE");

    const v = await (await fetch(`${base}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rajesh Kumar", scheme: "PM Surya Ghar" })
    })).json();

    assert.equal(v.status, "VERIFIED");
    assert.equal(v.citizenName, "Rajesh Kumar");
  } finally {
    server.close();
  }
});
