import test from "node:test";
import assert from "node:assert/strict";

import { server } from "../server.js";
import { fleetEngine } from "../core/fleet-engine.js";
import { taskBoard } from "../core/task-board.js";
import { modelGateway } from "../core/model-gateway.js";

test("Office Test 1: Server health and core telemetry", async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const base = `http://localhost:${port}`;

  try {
    const health = await (await fetch(`${base}/api/health`)).json();
    assert.equal(health.status, "ONLINE");
    assert.equal(health.app, "AI Super Intelligence Company");
    assert.equal(health.theme, "Munder Difflin Office");
    assert.equal(health.coworkersCount, 8);
  } finally {
    server.close();
  }
});

test("Office Test 2: AI Coworkers Fleet verification (Munder Difflin Roster)", () => {
  const coworkers = fleetEngine.getCoworkers();
  assert.equal(coworkers.length, 8);

  const michael = coworkers.find(c => c.name === "Michael Scott");
  assert.equal(michael.role.includes("God Agent"), true);
  assert.equal(michael.provider, "antigravity");

  const dwight = coworkers.find(c => c.name === "Dwight Schrute");
  assert.equal(dwight.skills.includes("1M Context Analysis"), true);
  assert.equal(dwight.provider, "claude");

  const oscar = coworkers.find(c => c.name === "Oscar Martinez");
  assert.equal(oscar.department, "Finance & Audit");

  const raja = coworkers.find(c => c.name === "Raja CA");
  assert.equal(raja.department, "Finance & Compliance");
});

test("Office Test 3: Multi-Model CLI command generator", () => {
  const agyCmd = modelGateway.generateCommand({
    provider: "antigravity",
    model: "Gemini 3.1 Pro (High)",
    prompt: "Audit ledger"
  });
  assert.ok(agyCmd.includes('agy --model "Gemini 3.1 Pro (High)"'));
  assert.ok(agyCmd.includes("--dangerously-skip-permissions"));

  const claudeCmd = modelGateway.generateCommand({
    provider: "claude",
    model: "claude-sonnet-4-6[1m]",
    prompt: "Refactor AST"
  });
  assert.ok(claudeCmd.includes('claude --model "claude-sonnet-4-6[1m]"'));

  const cursorCmd = modelGateway.generateCommand({
    provider: "cursor",
    model: "composer-2.5",
    prompt: "Fix imports"
  });
  assert.ok(cursorCmd.includes('cursor-agent --model "composer-2.5"'));
});

test("Office Test 4: Kanban Board task lifecycle", () => {
  const task = taskBoard.createTask({
    title: "Verify PM Surya Ghar CFA Subsidy API",
    workspace: "05-cleantech-energy",
    assignee: "raja-ca",
    priority: "CRITICAL"
  });
  assert.equal(task.status, "in_progress");

  const updated = taskBoard.updateTaskStatus(task.id, "review");
  assert.equal(updated.status, "review");

  const done = taskBoard.updateTaskStatus(task.id, "done");
  assert.equal(done.status, "done");
});

test("Office Test 5: Floor standup and mission dispatch", () => {
  const standup = fleetEngine.triggerStandup();
  assert.equal(standup.organizedBy, "Michael Scott");
  assert.ok(standup.report.includes("Hourly Ops Standup Meeting Report"));

  const mission = modelGateway.dispatchPrompt({
    coworkerId: "dwight-schrute",
    prompt: "Enforce zero-trust token isolation",
    provider: "claude",
    model: "claude-sonnet-5-5"
  });
  assert.equal(mission.coworkerId, "dwight-schrute");
  assert.ok(mission.simulatedExecution.includes("zero subscription cost"));
});
