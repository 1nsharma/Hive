/**
 * Enterprise Statutory Compliance & Feasibility Analytics
 * Authored by Phyllis Vance (`client-research`)
 * Munder Difflin Enterprise Client Intelligence
 */

/**
 * Calculates Solar Rooftop Feasibility, generation, and financial payback
 * @param {object} params - { sanctionedLoadKva, rooftopAreaSqFt, gridTariffPerUnit, rescoTariffPerUnit }
 * @returns {object} Feasibility report and ROI analytics
 */
export function calculateSolarFeasibility({
  sanctionedLoadKva = 100,
  rooftopAreaSqFt = 10000,
  gridTariffPerUnit = 10.50,
  rescoTariffPerUnit = 4.50
}) {
  // Rule of thumb: 100 sq ft yields ~1 kW solar capacity
  const maxCapacityByArea = Math.floor(rooftopAreaSqFt / 100);
  // DISCOM guidelines generally allow up to 80-100% of sanctioned load for net metering
  const maxCapacityByLoad = Math.floor(sanctionedLoadKva * 0.85);
  const recommendedKw = Math.min(maxCapacityByArea, maxCapacityByLoad);

  // Standard Indian solar insolation: ~4 units (kWh) per kW per day (accounting for 300 sunny days)
  const annualUnitsKwh = recommendedKw * 4 * 300;
  const monthlyUnitsKwh = Math.round(annualUnitsKwh / 12);

  const monthlyGridCost = monthlyUnitsKwh * gridTariffPerUnit;
  const monthlyRescoCost = monthlyUnitsKwh * rescoTariffPerUnit;
  const monthlySavings = monthlyGridCost - monthlyRescoCost;
  const annualSavings = monthlySavings * 12;

  // Capex estimate if purchased outright: ~₹42,000 per kW installed
  const capexEstimateInr = recommendedKw * 42000;
  const capexPaybackYears = capexEstimateInr / (annualUnitsKwh * (gridTariffPerUnit - 1.0)); // subtracting ₹1/unit O&M

  return {
    recommendedSolarCapacityKw: recommendedKw,
    metrics: {
      sanctionedLoadKva,
      rooftopAreaSqFt,
      gridTariffPerUnit,
      rescoTariffPerUnit,
      tariffArbitragePerUnit: Number((gridTariffPerUnit - rescoTariffPerUnit).toFixed(2))
    },
    generation: {
      dailyUnitsKwh: recommendedKw * 4,
      monthlyUnitsKwh,
      annualUnitsKwh
    },
    financialSavings: {
      monthlySavingsInr: Math.round(monthlySavings),
      annualSavingsInr: Math.round(annualSavings),
      twentyYearCumulativeSavingsInr: Math.round(annualSavings * 20 * 0.95) // 0.95 degradation factor
    },
    outrightCapexAlternative: {
      capexInvestmentInr: capexEstimateInr,
      estimatedPaybackYears: Number(capexPaybackYears.toFixed(1))
    },
    discomComplianceChecklist: [
      'Sanctioned Contract Demand review with State DISCOM (NOC for Net Metering)',
      'Structural load-bearing certificate from chartered structural engineer for roof stability',
      'Dual bi-directional net-meter installation clearance',
      'CEIG (Chief Electrical Inspector to Government) safety inspection for installations > 100 kVA'
    ]
  };
}

/**
 * Validates DPDP Act 2023 compliance status for enterprise digital systems
 * @param {object} audit - Audit items
 * @returns {object} Compliance rating and missing controls
 */
export function auditDPDPCompliance(audit = {}) {
  const requirements = [
    { key: 'consentArtifactNotice', title: 'Clear & Itemized Notice for Data Principal Consent (Section 5)', weight: 20 },
    { key: 'dataProcessorAgreement', title: 'Data Processor Contract with Specific Instructions & Liability (Section 8(2))', weight: 20 },
    { key: 'reasonableSecuritySafeguards', title: 'Cryptographic Encryption & Tamper-Evident Logging (Section 8(5))', weight: 25 },
    { key: 'breachNotificationMechanism', title: 'Mechanism to Notify Data Protection Board of India on Breach (Section 8(6))', weight: 15 },
    { key: 'dataErasureWorkflow', title: 'Data Erasure upon Purpose Completion or Consent Withdrawal (Section 8(7))', weight: 10 },
    { key: 'grievanceRedressalOfficer', title: 'Appointed Grievance Officer with Contact Published on Site (Section 12)', weight: 10 }
  ];

  let totalScore = 0;
  const missingControls = [];

  for (const req of requirements) {
    if (audit[req.key] === true) {
      totalScore += req.weight;
    } else {
      missingControls.push(req.title);
    }
  }

  return {
    score: totalScore,
    complianceStatus: totalScore >= 80 ? 'COMPLIANT' : totalScore >= 50 ? 'PARTIAL_COMPLIANCE' : 'HIGH_RISK_DEFICIT',
    statutoryAct: 'Digital Personal Data Protection Act, 2023',
    maxPenaltyWarning: 'Penalties up to ₹250 Crore for significant failure of security safeguards under Section 33 Schedule',
    missingControls
  };
}

/**
 * Validates RBI Digital Lending Master Directions compliance
 * @param {object} params - { nbfcCategory, usesDla, hasFldgAgreement, fldgPercentage }
 * @returns {object} RBI compliance verdict
 */
export function auditRBIDigitalLending({ nbfcCategory = 'NBFC-ND', usesDla = true, hasFldgAgreement = false, fldgPercentage = 0 }) {
  const issues = [];
  if (hasFldgAgreement && fldgPercentage > 5.0) {
    issues.push(`FLDG (Default Loss Guarantee) is capped at 5.0% of loan portfolio under RBI Master Directions (observed: ${fldgPercentage}%)`);
  }

  return {
    statutoryRegulator: 'Reserve Bank of India (RBI)',
    direction: 'Guidelines on Digital Lending (DOR.CRE.REC.66/21.07.001/2022-23)',
    nbfcCategory,
    isCompliant: issues.length === 0,
    fldgCapped: fldgPercentage <= 5.0,
    mandatoryRequirements: [
      'Direct disbursement from Regulated Entity bank account to borrower account (zero pass-through pool accounts)',
      'Key Fact Statement (KFS) provided to borrower in standardized format with All-Inclusive Annual Percentage Rate (APR)',
      'Digital Lending Apps (DLAs) must explicitly disclose name of lending partner NBFC/Bank in play store and UI',
      'Zero access to mobile phone resources like contacts, media, call logs without explicit one-time justification'
    ],
    issues
  };
}
