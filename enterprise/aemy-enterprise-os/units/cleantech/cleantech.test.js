import test from "node:test";
import assert from "node:assert/strict";
import { CleanTechEngine } from "./cleantech-engine.js";

test("SolarHub: Calculates PM Surya Ghar subsidy exactly per official guidelines", () => {
  const engine = new CleanTechEngine();
  
  // Test 2 kW case
  const assessment2kW = engine.calculateSolarAssessment("TENANT_SOLAR", {
    clientName: "Sunil Verma",
    clientPhone: "9829099887",
    city: "Jaipur",
    monthlyBillINR: 2000,
    roofAreaSqFt: 250
  });
  assert.equal(assessment2kW.recommendedCapacityKW, 2);
  assert.equal(assessment2kW.govSubsidy, 60000); // ₹30k x 2
  assert.equal(assessment2kW.grossSystemCost, 110000);
  assert.equal(assessment2kW.netConsumerCost, 50000);

  // Test 3+ kW case
  const assessment3kW = engine.calculateSolarAssessment("TENANT_SOLAR", {
    clientName: "Verma Residency",
    clientPhone: "9829099887",
    city: "Jaipur",
    monthlyBillINR: 4000,
    roofAreaSqFt: 400
  });
  assert.equal(assessment3kW.recommendedCapacityKW, 4);
  assert.equal(assessment3kW.govSubsidy, 78000); // Max ceiling
  assert.ok(assessment3kW.paybackPeriodYears > 0 && assessment3kW.paybackPeriodYears < 5);
});
