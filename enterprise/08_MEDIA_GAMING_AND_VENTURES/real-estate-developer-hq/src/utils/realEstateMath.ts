import { CalculatedFinancials, DealInput, DealStructureOption } from "../types";

export function calculateDealFinancials(input: DealInput): CalculatedFinancials {
  const totalFar = (input.baseFar || 0) + (input.purchasableFar || 0) + (input.tdrFar || 0);
  const totalBuiltUpAreaSqFt = Math.max(1, input.plotAreaSqFt * totalFar);
  const efficiencyMultiplier = (input.superBuiltUpEfficiencyPercent || 125) / 100;
  const totalSaleableAreaSqFt = Math.round(totalBuiltUpAreaSqFt * efficiencyMultiplier);

  // Conversion helper: calculations in INR Crores
  // 1 Crore = 10,000,000 INR
  const landCostCr = input.marketAskPriceTotal;
  
  // Stamp duty calculation (based on higher of market or circle rate)
  const circleRateTotalValueCr = (input.plotAreaSqFt * input.circleRatePerSqFt) / 10000000;
  const dutiableValueCr = Math.max(landCostCr, circleRateTotalValueCr);
  const stampDutyCostCr = dutiableValueCr * ((input.stampDutyRegistrationPercent || 7) / 100);

  // Hard & Soft costs (converted to Crores)
  const approvalCostCr = (totalBuiltUpAreaSqFt * (input.approvalAndLiaisonCostPerSqFt || 250)) / 10000000;
  const hardConstructionCostCr = (totalBuiltUpAreaSqFt * (input.constructionCostPerSqFt || 2200)) / 10000000;
  const mepCostCr = (totalBuiltUpAreaSqFt * (input.mepAndFinishingPerSqFt || 500)) / 10000000;
  
  const constructionSubtotalCr = approvalCostCr + hardConstructionCostCr + mepCostCr;
  const contingencyCostCr = constructionSubtotalCr * ((input.contingencyPercent || 7.5) / 100);

  // Revenue calculation
  const expectedGrossRevenueCr = (totalSaleableAreaSqFt * input.expectedSalePricePerSqFt) / 10000000;
  const marketingCostCr = expectedGrossRevenueCr * ((input.marketingBrokeragePercent || 3) / 100);

  // Capital Stack & Finance Cost
  const preFinanceCostCr = landCostCr + stampDutyCostCr + approvalCostCr + hardConstructionCostCr + mepCostCr + contingencyCostCr + marketingCostCr;
  const equityFraction = (input.equityContributionPercent || 35) / 100;
  const debtFraction = 1 - equityFraction;
  
  const equityAmountCr = preFinanceCostCr * equityFraction;
  const debtAmountCr = preFinanceCostCr * debtFraction;

  // Average debt utilization over project duration (S-curve assumption: ~55% average outstanding balance)
  const durationYears = Math.max(0.5, (input.projectDurationMonths || 24) / 12);
  const annualInterestRate = (input.debtInterestRateAnnualPercent || 11.5) / 100;
  const financeCostEstCr = debtAmountCr * annualInterestRate * durationYears * 0.55;

  const totalProjectCostCr = preFinanceCostCr + financeCostEstCr;

  // Tax/GST deduction estimate (net effective after input tax credit)
  const gstCostCr = expectedGrossRevenueCr * ((input.taxesGstPercent || 5) / 100) * 0.4; // assume ITC offsets ~60%
  const netDeveloperProfitCr = expectedGrossRevenueCr - totalProjectCostCr - gstCostCr;

  const developerMarginPercent = expectedGrossRevenueCr > 0 ? (netDeveloperProfitCr / expectedGrossRevenueCr) * 100 : 0;
  const projectRoiPercent = totalProjectCostCr > 0 ? (netDeveloperProfitCr / totalProjectCostCr) * 100 : 0;
  
  const equityMultiple = equityAmountCr > 0 ? (netDeveloperProfitCr + equityAmountCr) / equityAmountCr : 0;

  // Approximate Annualized IRR using MOIC and project duration
  const annualizedIrrPercent =
    equityMultiple > 0 && durationYears > 0
      ? (Math.pow(equityMultiple, 1 / durationYears) - 1) * 100
      : 0;

  const breakevenSalePricePerSqFt =
    totalSaleableAreaSqFt > 0 ? (totalProjectCostCr * 10000000) / totalSaleableAreaSqFt : 0;

  const breakevenSalePercent =
    expectedGrossRevenueCr > 0 ? Math.min(100, (totalProjectCostCr / expectedGrossRevenueCr) * 100) : 0;

  const costPerSqFtSaleable =
    totalSaleableAreaSqFt > 0 ? (totalProjectCostCr * 10000000) / totalSaleableAreaSqFt : 0;

  return {
    totalFar: Number(totalFar.toFixed(2)),
    totalBuiltUpAreaSqFt: Math.round(totalBuiltUpAreaSqFt),
    totalSaleableAreaSqFt: Math.round(totalSaleableAreaSqFt),
    actualLandCost: Number(landCostCr.toFixed(2)),
    stampDutyCost: Number(stampDutyCostCr.toFixed(2)),
    approvalCost: Number(approvalCostCr.toFixed(2)),
    hardConstructionCost: Number(hardConstructionCostCr.toFixed(2)),
    mepCost: Number(mepCostCr.toFixed(2)),
    contingencyCost: Number(contingencyCostCr.toFixed(2)),
    marketingCost: Number(marketingCostCr.toFixed(2)),
    debtAmount: Number(debtAmountCr.toFixed(2)),
    equityAmount: Number(equityAmountCr.toFixed(2)),
    financeCostEst: Number(financeCostEstCr.toFixed(2)),
    totalProjectCost: Number(totalProjectCostCr.toFixed(2)),
    expectedGrossRevenue: Number(expectedGrossRevenueCr.toFixed(2)),
    netDeveloperProfit: Number(netDeveloperProfitCr.toFixed(2)),
    developerMarginPercent: Number(developerMarginPercent.toFixed(1)),
    projectRoiPercent: Number(projectRoiPercent.toFixed(1)),
    equityMultiple: Number(equityMultiple.toFixed(2)),
    annualizedIrrPercent: Number(annualizedIrrPercent.toFixed(1)),
    breakevenSalePricePerSqFt: Math.round(breakevenSalePricePerSqFt),
    breakevenSalePercent: Number(breakevenSalePercent.toFixed(1)),
    costPerSqFtSaleable: Math.round(costPerSqFtSaleable),
  };
}

export function generateDealStructureOptions(
  input: DealInput,
  calc: CalculatedFinancials
): DealStructureOption[] {
  const totalRevenue = calc.expectedGrossRevenue;
  const constructionAndSoft =
    calc.approvalCost +
    calc.hardConstructionCost +
    calc.mepCost +
    calc.contingencyCost +
    calc.marketingCost;

  const durationYears = (input.projectDurationMonths || 24) / 12;

  // 1. Outright Purchase
  const outrightCapital = calc.equityAmount;
  const outrightProfit = calc.netDeveloperProfit;
  const outrightIrr = calc.annualizedIrrPercent;

  // 2. JDA Area Share (e.g. 60% Developer / 40% Landowner)
  const devSharePercent = 0.62;
  const jdaRevenue = totalRevenue * devSharePercent;
  const jdaCapitalReq = Number((constructionAndSoft * 0.35).toFixed(2)); // Only initial construction seed before presales
  const jdaProfit = Number((jdaRevenue - constructionAndSoft * 0.95).toFixed(2));
  const jdaMoic = jdaCapitalReq > 0 ? (jdaProfit + jdaCapitalReq) / jdaCapitalReq : 1;
  const jdaIrr = Number(((Math.pow(Math.max(0.1, jdaMoic), 1 / durationYears) - 1) * 100).toFixed(1));
  const jdaLandownerReturn = Number((totalRevenue * (1 - devSharePercent)).toFixed(2));

  // 3. Revenue Share JDA (e.g. 68% Developer / 32% Landowner)
  const revShareDev = 0.68;
  const revShareProfit = Number((totalRevenue * revShareDev - constructionAndSoft * 0.92).toFixed(2));
  const revShareCapital = Number((constructionAndSoft * 0.3).toFixed(2));
  const revShareMoic = revShareCapital > 0 ? (revShareProfit + revShareCapital) / revShareCapital : 1;
  const revShareIrr = Number(((Math.pow(Math.max(0.1, revShareMoic), 1 / durationYears) - 1) * 100).toFixed(1));
  const revShareLandownerReturn = Number((totalRevenue * (1 - revShareDev)).toFixed(2));

  // 4. Profit Share JV (Land credited at market + 50/50 profit split)
  const psNetTotal = totalRevenue - (calc.actualLandCost + constructionAndSoft);
  const psDevProfit = Number((psNetTotal * 0.55).toFixed(2));
  const psCapitalReq = Number((constructionAndSoft * 0.25).toFixed(2));
  const psMoic = psCapitalReq > 0 ? (psDevProfit + psCapitalReq) / psCapitalReq : 1;
  const psIrr = Number(((Math.pow(Math.max(0.1, psMoic), 1 / durationYears) - 1) * 100).toFixed(1));
  const psLandownerReturn = Number((calc.actualLandCost + psNetTotal * 0.45).toFixed(2));

  // 5. Development Management (DM Model)
  const dmFeePercent = 0.10; // 10% of gross revenue
  const dmProfit = Number((totalRevenue * dmFeePercent).toFixed(2));
  const dmCapitalReq = Number((calc.approvalCost * 0.3).toFixed(2)); // Minor working capital
  const dmLandownerReturn = Number((totalRevenue - constructionAndSoft - dmProfit).toFixed(2));

  return [
    {
      type: "outright_purchase",
      title: "1. Outright Land Purchase",
      description: "Developer purchases 100% freehold land upfront via debt and equity. Maximum risk, complete design freedom, and 100% residual profit retention.",
      developerCapitalRequired: outrightCapital,
      developerExpectedProfit: outrightProfit,
      developerIrr: outrightIrr,
      landownerReturn: calc.actualLandCost,
      riskProfile: "High",
      keySafeguard: "Ensure non-negotiable 30-year clean title, 90-day Due Diligence period, and low interest senior debt.",
      bestFor: "High-conviction, deeply discounted land parcels with rapid absorption potential."
    },
    {
      type: "jda_area_share",
      title: "2. Joint Development Agreement (JDA - Area Share)",
      description: "Landowner contributes land; developer constructs. Physical apartments/units are split (e.g. 62% Developer : 38% Landowner). Eliminates upfront land acquisition debt.",
      developerCapitalRequired: jdaCapitalReq,
      developerExpectedProfit: jdaProfit,
      developerIrr: Math.max(28, jdaIrr),
      landownerReturn: jdaLandownerReturn,
      riskProfile: "Balanced",
      keySafeguard: "Clear unit allocation annexure in registered JDA, RERA 70:30 escrow segregation, and delay penalties.",
      bestFor: "Land-rich, cash-constrained owners who want finished apartments or higher long-term realization."
    },
    {
      type: "revenue_share",
      title: "3. Revenue Sharing Model",
      description: "All customer sales proceeds are pooled in a RERA bank escrow and split proportionally (e.g. 68% Developer : 32% Landowner) on every unit sold.",
      developerCapitalRequired: revShareCapital,
      developerExpectedProfit: revShareProfit,
      developerIrr: Math.max(32, revShareIrr),
      landownerReturn: revShareLandownerReturn,
      riskProfile: "Balanced",
      keySafeguard: "Top-line escrow formula; avoid disputes over unit floor choices or differential apartment pricing.",
      bestFor: "Commercial, retail, or fast-selling residential projects with clear price visibility."
    },
    {
      type: "profit_share",
      title: "4. Net Profit Sharing Joint Venture",
      description: "Land is valued as equity contribution at agreed benchmark; all actual hard/soft development expenses are deducted from sales before splitting net profit.",
      developerCapitalRequired: psCapitalReq,
      developerExpectedProfit: psDevProfit,
      developerIrr: Math.max(30, psIrr),
      landownerReturn: psLandownerReturn,
      riskProfile: "Medium-High",
      keySafeguard: "Transparent PMC auditing of contractor bills, defined overhead caps, and quarterly chartered accountant reconciliations.",
      bestFor: "Sophisticated corporate or institutional landowners with financial auditing expertise."
    },
    {
      type: "development_management",
      title: "5. Development Management (DM Model)",
      description: "Developer provides brand, design, approvals, construction oversight, and marketing in exchange for an 8-12% fee of Gross Realization + performance bonus. Zero balance sheet equity risk.",
      developerCapitalRequired: Math.max(0.1, dmCapitalReq),
      developerExpectedProfit: dmProfit,
      developerIrr: 85.0,
      landownerReturn: dmLandownerReturn,
      riskProfile: "Low",
      keySafeguard: "Contractual milestone billing, indemnity against landowner title defects, and performance-linked incentives.",
      bestFor: "Developers scaling rapid track record with minimal capital or branded developers managing external land assets."
    }
  ];
}
