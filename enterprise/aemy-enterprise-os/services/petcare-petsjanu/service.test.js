import test from "node:test";
import assert from "node:assert/strict";
import { server, db, PORT } from "./server.js";

test("Service 4 (PetsJanu Petcare): Starts, serves health, and books vet", async () => {
  await new Promise(res => server.listen(0, res));
  const testPort = server.address().port;
  const base = `http://localhost:${testPort}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.service, "PetsJanu Veterinary Care");
    assert.equal(health.status, "ONLINE");

    const book = await (await fetch(`${base}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petName: "Sheru", ownerName: "Aman", issue: "Routine vaccine" })
    })).json();

    assert.equal(book.petName, "Sheru");
    assert.equal(book.status, "SCHEDULED");
  } finally {
    server.close();
  }
});
