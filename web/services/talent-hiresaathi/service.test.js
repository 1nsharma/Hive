import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Talent Service (HireSaathi): Starts, serves health, and screens AI skills", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "HireSaathi AI");
    assert.equal(health.status, "ONLINE");

    const screenRes = await fetch(`${base}/api/screen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Aakash Mehta",
        phone: "9829055555",
        appliedRole: "Full-Stack AI Developer",
        resumeText: "Skilled in React, TypeScript, Node.js, Python, and SQL with Git workflows."
      })
    });
    assert.equal(screenRes.status, 201);
    const cand = await screenRes.json();
    assert.ok(cand.skills.includes("REACT"));
    assert.ok(cand.score >= 70);
  } finally {
    server.close();
  }
});
