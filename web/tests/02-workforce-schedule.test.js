import test from "node:test";
import assert from "node:assert/strict";

import { workforceManager } from "../core/workforce-manager.js";
import { scheduleEngine } from "../core/schedule-engine.js";
import { autonomousDirector } from "../core/autonomous-director.js";

test("Workforce Test 1: Full-time and part-time employee structure", () => {
  const all = workforceManager.getAllStaff();
  assert.ok(all.length >= 10);
  assert.equal(workforceManager.fullTimeStaff.length, 5);
  assert.ok(workforceManager.partTimeContractors.length >= 5);

  const dwight = workforceManager.getStaffById("dwight-schrute");
  assert.equal(dwight.type, "FULL_TIME");
  assert.equal(dwight.shift, "ROUND_THE_CLOCK");

  const raja = workforceManager.getStaffById("raja-ca");
  assert.equal(raja.type, "PART_TIME");
  assert.equal(raja.shift, "ON_DEMAND");
});

test("Workforce Test 2: Dynamic auto-scaling when workload exceeds threshold", () => {
  const capacityNormal = workforceManager.analyzeWorkforceCapacity(3);
  assert.ok(capacityNormal.recommendation.includes("optimal"));

  // High load simulation (> 5)
  const capacitySpike = workforceManager.analyzeWorkforceCapacity(8);
  assert.ok(capacitySpike.recommendation.includes("High workload detected"));
  assert.ok(capacitySpike.autoSpawns.length > 0);
});

test("Schedule Test 3: 24-hour routine rotation and shift distribution", () => {
  const routines = scheduleEngine.getAllRoutines();
  assert.equal(routines.length, 8);

  const current = scheduleEngine.getCurrentRoutine();
  assert.ok(current.time);
  assert.ok(current.event);

  const advanced = scheduleEngine.advanceSchedule();
  assert.notEqual(advanced.event, current.event);
});

test("Director Test 4: Autonomous decision loop and skill-matching", () => {
  const matchCode = autonomousDirector.matchTaskToStaff("Fix AST security vulnerability", "01-engineering-dev");
  assert.equal(matchCode.id, "dwight-schrute");

  const matchFinance = autonomousDirector.matchTaskToStaff("Audit quarterly GST ledger", "03-finance-ledger");
  assert.equal(matchFinance.id, "oscar-martinez");

  const matchSolar = autonomousDirector.matchTaskToStaff("Process PM Surya Ghar subsidy claim", "05-cleantech-energy");
  assert.equal(matchSolar.id, "raja-ca");

  const cycle = autonomousDirector.evaluateAndAct();
  assert.ok(cycle.timestamp);
  assert.ok(cycle.decisions.length > 0);
});
