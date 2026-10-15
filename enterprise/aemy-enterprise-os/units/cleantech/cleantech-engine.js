import { enterpriseBus } from "../../core/bus-event.js";

export class CleanTechEngine {
  constructor() {
    this.audits = [];
  }

  calculateSolarAssessment(tenantId, clientData) {
    const { clientName, clientPhone, city, monthlyBillINR, roofAreaSqFt } = clientData;

    // Standard India solar benchmarks:
    // 1 kW rooftop solar needs ~100 sq.ft area and generates ~120 kWh/month.
    // Average residential tariff ~ ₹7.50 / kWh.
    const averageUnitsConsumed = monthlyBillINR / 7.5;
    const requiredCapacityByBill = averageUnitsConsumed / 120;
    const maxCapacityByRoof = roofAreaSqFt / 100;
    
    const recommendedCapacityKW = Math.max(1, Math.min(Math.round(requiredCapacityByBill * 10) / 10, Math.floor(maxCapacityByRoof)));
    
    // PM Surya Ghar Muft Bijli Yojana Central Financial Assistance (CFA) Rules:
    // Up to 2 kW: ₹30,000 / kW (Max ₹60,000)
    // Additional for 3rd kW: ₹18,000
    // Total for >= 3 kW: ₹78,000 fixed
    let govSubsidy = 0;
    if (recommendedCapacityKW <= 2) {
      govSubsidy = recommendedCapacityKW * 30000;
    } else {
      govSubsidy = 60000 + Math.min(1, recommendedCapacityKW - 2) * 18000;
    }
    govSubsidy = Math.min(78000, govSubsidy);

    const grossSystemCost = recommendedCapacityKW * 55000; // Average ₹55,000 / kW turnkey
    const netConsumerCost = Math.max(0, grossSystemCost - govSubsidy);

    const monthlyGenerationUnits = Math.round(recommendedCapacityKW * 120);
    const annualSavingsINR = Math.round(monthlyGenerationUnits * 12 * 7.5);
    const paybackPeriodYears = Math.round((netConsumerCost / annualSavingsINR) * 10) / 10;
    const co2ReductionTonsPerYear = Math.round(recommendedCapacityKW * 1.3 * 10) / 10;

    const assessment = {
      id: `SOLAR-${Date.now().toString().slice(-6)}`,
      tenantId,
      clientName,
      clientPhone,
      city,
      recommendedCapacityKW,
      grossSystemCost,
      govSubsidy,
      netConsumerCost,
      annualSavingsINR,
      paybackPeriodYears,
      co2ReductionTonsPerYear,
      timestamp: new Date().toISOString()
    };

    this.audits.push(assessment);

    enterpriseBus.publish(tenantId, "CLEANTECH_SOLAR_ASSESSMENT_COMPLETED", {
      auditId: assessment.id,
      capacityKW: assessment.recommendedCapacityKW,
      netCost: assessment.netConsumerCost
    });

    return assessment;
  }

  getAllAudits() {
    return [...this.audits];
  }
}

export const cleanTechEngine = new CleanTechEngine();
