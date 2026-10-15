import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Studio 1 (AI Agents & JORVISH): Starts, serves health, and dispatches missions", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "AI Agent & JORVISH Studio");
    assert.equal(health.status, "ONLINE");

    const disp = await (await fetch(`${base}/api/dispatch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Autonomous code generation test" })
    })).json();

    assert.equal(disp.success, true);
    assert.ok(db.terminalLogs.some(l => l.includes("Autonomous code generation test")));
  } finally {
    server.close();
  }
});
