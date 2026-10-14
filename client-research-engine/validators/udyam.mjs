/**
 * MSME Udyam Registration Validator & Tier Classifier
 * Authored by Phyllis Vance (`client-research`)
 * Munder Difflin Enterprise Client Intelligence
 */

const UDYAM_REGEX = /^UDYAM-([A-Z]{2})-([0-9]{2})-([0-9]{7})$/;

/**
 * Validates an MSME Udyam Registration Number
 * Format: UDYAM-XX-00-0000000
 * @param {string} udyam - Udyam Registration Number
 * @returns {object} Validation result
 */
export function validateUdyam(udyam) {
  if (!udyam || typeof udyam !== 'string') {
    return { isValid: false, error: 'Udyam Registration Number must be a non-empty string' };
  }

  const clean = udyam.trim().toUpperCase();
  const match = clean.match(UDYAM_REGEX);
  if (!match) {
    return {
      isValid: false,
      error: 'Udyam number does not match format: UDYAM-XX-00-0000000 (e.g. UDYAM-DL-01-0012345)'
    };
  }

  const [, stateCode, districtCode, sequence] = match;

  return {
    isValid: true,
    udyamNumber: clean,
    parsed: {
      stateCode,
      districtCode,
      registrationSequence: sequence
    },
    portalUrl: 'https://udyamregistration.gov.in/Udyam_Verify.aspx'
  };
}

/**
 * Classifies an enterprise into MSME categories based on Gazette of India Composite Criteria
 * Notification S.O. 2119(E) dated 26th June 2020
 * @param {object} params - { investmentInCrores, turnoverInCrores }
 * @returns {object} Tier classification, limits, and statutory protections
 */
export function classifyMSMETier({ investmentInCrores, turnoverInCrores }) {
  const inv = Number(investmentInCrores);
  const turn = Number(turnoverInCrores);

  if (isNaN(inv) || isNaN(turn) || inv < 0 || turn < 0) {
    throw new Error('Investment and turnover must be non-negative numbers in ₹ Crores');
  }

  let tier = '';
  let maxInvestmentLimit = 0;
  let maxTurnoverLimit = 0;
  let description = '';

  if (inv <= 1.0 && turn <= 5.0) {
    tier = 'MICRO';
    maxInvestmentLimit = 1.0;
    maxTurnoverLimit = 5.0;
    description = 'Micro Enterprise (Investment <= ₹1 Cr & Turnover <= ₹5 Cr)';
  } else if (inv <= 10.0 && turn <= 50.0) {
    tier = 'SMALL';
    maxInvestmentLimit = 10.0;
    maxTurnoverLimit = 50.0;
    description = 'Small Enterprise (Investment <= ₹10 Cr & Turnover <= ₹50 Cr)';
  } else if (inv <= 50.0 && turn <= 250.0) {
    tier = 'MEDIUM';
    maxInvestmentLimit = 50.0;
    maxTurnoverLimit = 250.0;
    description = 'Medium Enterprise (Investment <= ₹50 Cr & Turnover <= ₹250 Cr)';
  } else {
    tier = 'LARGE_ENTERPRISE';
    maxInvestmentLimit = Infinity;
    maxTurnoverLimit = Infinity;
    description = 'Large Commercial Enterprise / Conglomerate (> ₹50 Cr Investment or > ₹250 Cr Turnover)';
  }

  return {
    tier,
    description,
    metrics: {
      investmentInCrores: inv,
      turnoverInCrores: turn
    },
    statutoryBenefits: {
      delayedPaymentProtection: {
        act: 'Section 15 & 16 of MSMED Act 2006',
        provision: 'Buyer must settle within agreed date (max 45 days). Failure triggers compound interest at 3x RBI Bank Rate with monthly rests.',
        redressalPortal: 'https://samadhaan.msme.gov.in'
      },
      publicProcurementPreference: {
        policy: 'Public Procurement Policy for MSEs Order 2012',
        benefit: 'Mandatory 25% annual procurement by Central Ministries/PSUs from MSEs, with 358 items reserved exclusively.'
      },
      collateralFreeCredit: {
        scheme: 'CGTMSE (Credit Guarantee Fund Trust for Micro and Small Enterprises)',
        coverage: 'Credit guarantee cover up to ₹5 Crore without collateral security.'
      },
      tenderFeeWaiver: '100% exemption from Earnest Money Deposit (EMD) and tender document fees in Govt/PSU tenders.'
    }
  };
}
