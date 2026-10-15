import test from "node:test";
import assert from "node:assert/strict";
import { server as gatewayServer } from "./gateway-server.js";
import { server as commServer } from "../services/commerce-dukaanmitra/server.js";

test("Master Gateway: Serves status and aggregates multi-service health", async () => {
  await new Promise(r => commServer.listen(0, r));
  await new Promise(r => gatewayServer.listen(0, r));
  const gwPort = gatewayServer.address().port;
  const base = `http://localhost:${gwPort}`;

  try {
    const res = await fetch(`${base}/api/gateway/status`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.gateway.status, "ONLINE");
    assert.equal(data.ledgerValid, true);
  } finally {
    gatewayServer.close();
    commServer.close();
  }
});
