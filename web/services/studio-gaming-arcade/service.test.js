import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Studio 2 (Desi Arcade): Starts, serves health, and synthesizes games", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "Desi Arcade Gaming Studio");
    assert.equal(health.status, "ONLINE");

    const newGame = await (await fetch(`${base}/api/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Carrom Pro Multi", genre: "Casual" })
    })).json();

    assert.equal(newGame.title, "Carrom Pro Multi");
    assert.ok(db.games.some(g => g.title === "Carrom Pro Multi"));
  } finally {
    server.close();
  }
});
