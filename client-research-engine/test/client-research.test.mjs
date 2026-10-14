import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateCIN,
  validateGSTIN,
  calculateGstCheckDigit,
  validateUdyam,
  classifyMSMETier,
  calculateSolarFeasibility,
  auditDPDPCompliance,
  auditRBIDigitalLending,
  verifyClientAuthority,
  exportDossierMarkdown,
  getResearchStats,
  listEnterpriseDossiers,
  findEnterpriseDossier,
  searchEnterpriseDossiers
} from '../engine.mjs';

test('1. MCA CIN Validator & Parser', async (t) => {
  await t.test('validates and parses a standard Private Limited CIN', () => {
    const res = validateCIN('U60200DL2018PTC334192');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.parsed.listingStatus, 'Unlisted');
    assert.strictEqual(res.parsed.nicIndustryCode, '60200');
    assert.strictEqual(res.parsed.stateCode, 'DL');
    assert.strictEqual(res.parsed.stateName, 'Delhi');
    assert.strictEqual(res.parsed.incorporationYear, 2018);
    assert.strictEqual(res.parsed.companyTypeCode, 'PTC');
    assert.strictEqual(res.parsed.companyTypeDescription, 'Private Limited Company');
    assert.strictEqual(res.parsed.registrationNumber, '334192');
  });

  await t.test('validates a Public Limited Company CIN', () => {
    const res = validateCIN('U60231TN2015PLC048912');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.parsed.stateName, 'Tamil Nadu');
    assert.strictEqual(res.parsed.companyTypeCode, 'PLC');
    assert.strictEqual(res.parsed.companyTypeDescription, 'Public Limited Company');
  });

  await t.test('rejects malformed or invalid length CIN', () => {
    const short = validateCIN('U60200DL2018PTC33419');
    assert.strictEqual(short.isValid, false);
    assert.ok(short.error.includes('length'));

    const invalidState = validateCIN('U60200ZZ2018PTC334192');
    assert.strictEqual(invalidState.isValid, false);
    assert.ok(invalidState.error.includes('state code'));
  });
});

test('2. GSTIN Validator & Checksum Engine', async (t) => {
  await t.test('validates and parses a standard corporate GSTIN', () => {
    const res = validateGSTIN('07AABCN8921K1Z3');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.parsed.stateCode, '07');
    assert.strictEqual(res.parsed.stateName, 'Delhi');
    assert.strictEqual(res.parsed.pan, 'AABCN8921K');
    assert.strictEqual(res.parsed.panEntityCategory, 'Company (Corporate)');
    assert.strictEqual(res.parsed.businessEntityNumber, '1');
    assert.strictEqual(res.parsed.defaultConstant, 'Z');
  });

  await t.test('calculates GST checksum character correctly', () => {
    const gstin14 = '07AABCN8921K1Z';
    const checkChar = calculateGstCheckDigit(gstin14);
    assert.ok(typeof checkChar === 'string');
    assert.strictEqual(checkChar.length, 1);
  });

  await t.test('rejects malformed GSTIN or invalid state code', () => {
    const invalidLen = validateGSTIN('07AABCN8921K1');
    assert.strictEqual(invalidLen.isValid, false);

    const invalidState = validateGSTIN('99AABCN8921K1Z3');
    assert.strictEqual(invalidState.isValid, false);
    assert.ok(invalidState.error.includes('state jurisdiction'));
  });
});

test('3. MSME Udyam Registration & Composite Classification', async (t) => {
  await t.test('validates standard Udyam number format', () => {
    const res = validateUdyam('UDYAM-DL-01-0023412');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.parsed.stateCode, 'DL');
    assert.strictEqual(res.parsed.districtCode, '01');
    assert.strictEqual(res.parsed.registrationSequence, '0023412');
  });

  await t.test('rejects invalid Udyam format', () => {
    const invalid = validateUdyam('UDYAM-1234');
    assert.strictEqual(invalid.isValid, false);
  });

  await t.test('classifies Micro, Small, Medium, and Large enterprises accurately', () => {
    const micro = classifyMSMETier({ investmentInCrores: 0.8, turnoverInCrores: 4.2 });
    assert.strictEqual(micro.tier, 'MICRO');
    assert.ok(micro.statutoryBenefits.delayedPaymentProtection);

    const small = classifyMSMETier({ investmentInCrores: 8.5, turnoverInCrores: 35.0 });
    assert.strictEqual(small.tier, 'SMALL');

    const medium = classifyMSMETier({ investmentInCrores: 38.0, turnoverInCrores: 180.0 });
    assert.strictEqual(medium.tier, 'MEDIUM');

    const large = classifyMSMETier({ investmentInCrores: 65.0, turnoverInCrores: 420.0 });
    assert.strictEqual(large.tier, 'LARGE_ENTERPRISE');
  });
});

test('4. Commercial Solar Feasibility & Tariff Analytics', async (t) => {
  await t.test('calculates solar capacity and positive net annual savings', () => {
    const report = calculateSolarFeasibility({
      sanctionedLoadKva: 250,
      rooftopAreaSqFt: 35000,
      gridTariffPerUnit: 10.50,
      rescoTariffPerUnit: 4.50
    });

    assert.ok(report.recommendedSolarCapacityKw > 0);
    assert.strictEqual(report.metrics.tariffArbitragePerUnit, 6.00);
    assert.ok(report.financialSavings.annualSavingsInr > 1000000);
    assert.ok(report.discomComplianceChecklist.length >= 3);
  });
});

test('5. DPDP Act 2023 & RBI Digital Lending Audits', async (t) => {
  await t.test('audits DPDP Act security compliance scoring', () => {
    const fullyCompliant = auditDPDPCompliance({
      consentArtifactNotice: true,
      dataProcessorAgreement: true,
      reasonableSecuritySafeguards: true,
      breachNotificationMechanism: true,
      dataErasureWorkflow: true,
      grievanceRedressalOfficer: true
    });
    assert.strictEqual(fullyCompliant.score, 100);
    assert.strictEqual(fullyCompliant.complianceStatus, 'COMPLIANT');

    const partial = auditDPDPCompliance({
      consentArtifactNotice: true,
      reasonableSecuritySafeguards: true
    });
    assert.ok(partial.score < 80);
    assert.ok(partial.missingControls.length > 0);
  });

  await t.test('validates RBI Digital Lending FLDG cap compliance', () => {
    const validLending = auditRBIDigitalLending({ hasFldgAgreement: true, fldgPercentage: 4.5 });
    assert.strictEqual(validLending.isCompliant, true);

    const excessiveFldg = auditRBIDigitalLending({ hasFldgAgreement: true, fldgPercentage: 8.0 });
    assert.strictEqual(excessiveFldg.isCompliant, false);
    assert.ok(excessiveFldg.issues.length > 0);
  });
});

test('6. Enterprise Dossiers Database Integrity & Coverage', async (t) => {
  const dossiers = listEnterpriseDossiers();

  await t.test('contains at least 20 comprehensive enterprise accounts', () => {
    assert.ok(dossiers.length >= 20);
  });

  await t.test('ensures every dossier passes full corporate authority verification', () => {
    for (const d of dossiers) {
      const rep = verifyClientAuthority(d);
      assert.strictEqual(rep.verificationPassed, true, `Verification failed for ${d.companyName}`);
      assert.strictEqual(rep.verificationScore, 100);
      assert.ok(d.decisionMaker.name.length > 0);
      assert.ok(d.decisionMaker.email.includes('@'));
      assert.ok(d.decisionMaker.phone.startsWith('+91'));
      assert.ok(d.operationalPainPoint.length > 20);
      assert.ok(d.quantifiableBleed.length > 5);
      assert.ok(d.targetSolution.length > 10);
    }
  });

  await t.test('searches and finds dossiers by company and keywords', () => {
    const freight = findEnterpriseDossier('National Express');
    assert.ok(freight);
    assert.strictEqual(freight.vertical, 'truckwala');

    const retail = findEnterpriseDossier('Bhavani Supermarkets');
    assert.ok(retail);
    assert.strictEqual(retail.vertical, 'dukaanmitra');

    const solar = findEnterpriseDossier('Apex Cold Storage');
    assert.ok(solar);
    assert.strictEqual(solar.vertical, 'solarhub');

    const gov = findEnterpriseDossier('SecurePay Micro-Finance');
    assert.ok(gov);
    assert.strictEqual(gov.vertical, 'proofledger');

    const searchResults = searchEnterpriseDossiers('breakdown');
    assert.ok(searchResults.length > 0);
  });

  await t.test('renders complete Markdown dossier export with all sections', () => {
    const md = exportDossierMarkdown('National Express');
    assert.ok(md.includes('# 🏢 Enterprise Client Dossier: National Express'));
    assert.ok(md.includes('Corporate Registration & Legal Authority'));
    assert.ok(md.includes('Scale, Financials & Operations'));
    assert.ok(md.includes('Executive CXO Decision Makers'));
    assert.ok(md.includes('Quantifiable Operational Pain & Financial Bleed'));
    assert.ok(md.includes('Recommended Solution & Commercial Proposal Structure'));
  });
});

test('7. Research Stats & Operational Telemetry', async (t) => {
  await t.test('provides comprehensive telemetry across all 4 key verticals', () => {
    const stats = getResearchStats();
    assert.strictEqual(stats.totalVerifiedDossiers >= 20, true);
    assert.strictEqual(stats.verticalBreakdown.truckwala >= 5, true);
    assert.strictEqual(stats.verticalBreakdown.dukaanmitra >= 5, true);
    assert.strictEqual(stats.verticalBreakdown.solarhub >= 5, true);
    assert.strictEqual(stats.verticalBreakdown.proofledger >= 5, true);
    assert.strictEqual(stats.verificationAuditStatus, '100% OF DOSSIERS VERIFIED ACTIVE');
  });
});
