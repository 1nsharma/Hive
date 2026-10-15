import test from "node:test";
import assert from "node:assert/strict";
import { LogisticsEngine, BreakdownStatus } from "./logistics-engine.js";

test("TruckWala 24x7: Creates breakdown ticket with transparent distance cost math", () => {
  const engine = new LogisticsEngine();
  const ticket = engine.createBreakdownTicket("TENANT_LOG_01", {
    truckNumber: "RJ-14-GA-8899",
    driverName: "Sardar Balwant Singh",
    driverPhone: "9829012345",
    highwayLocation: "NH-48 KM 145 Jaipur-Ajmer",
    issueDescription: "Clutch pressure plate breakdown",
    distanceKm: 20
  });

  assert.equal(ticket.truckNumber, "RJ-14-GA-8899");
  // 499 base + (15km * 25) = 499 + 375 = 874
  assert.equal(ticket.estimatedCost, 874);
  assert.equal(ticket.status, BreakdownStatus.REPORTED);
});

test("TruckWala 24x7: Full lifecycle state machine transitions correctly", () => {
  const engine = new LogisticsEngine();
  const ticket = engine.createBreakdownTicket("TENANT_LOG_01", {
    truckNumber: "DL-01-AB-1234",
    driverName: "Ram Singh",
    driverPhone: "9876543210",
    highwayLocation: "NH-8 KM 60",
    issueDescription: "Tyre puncture"
  });

  engine.assignNearestPartner(ticket.id);
  assert.equal(ticket.status, BreakdownStatus.ASSIGNED);
  assert.ok(ticket.assignedPartner);

  engine.updateTicketStatus(ticket.id, BreakdownStatus.IN_REPAIR);
  assert.equal(ticket.status, BreakdownStatus.IN_REPAIR);

  engine.updateTicketStatus(ticket.id, BreakdownStatus.RESOLVED, 500); // 500 parts cost
  assert.equal(ticket.status, BreakdownStatus.RESOLVED);
  assert.ok(ticket.finalCost >= 999);
});
