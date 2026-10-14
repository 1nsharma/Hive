/**
 * GSTIN (Goods and Services Tax Identification Number) Validator & Parser
 * Authored by Phyllis Vance (`client-research`)
 * Munder Difflin Enterprise Client Intelligence
 */

export const GST_STATE_CODES = {
  '01': 'Jammu & Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chhattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '25': 'Daman & Diu',
  '26': 'Dadra & Nagar Haveli',
  '27': 'Maharashtra',
  '28': 'Andhra Pradesh (Old)',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman & Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh (New)',
  '38': 'Ladakh'
};

const GSTIN_REGEX = /^([0-9]{2})([A-Z]{5}[0-9]{4}[A-Z]{1})([1-9A-Z]{1})([Z]{1})([0-9A-Z]{1})$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const CHAR_SET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Computes check digit according to GST Luhn mod 36 algorithm
 * @param {string} gstin14 - First 14 characters of GSTIN
 * @returns {string} Expected check character
 */
export function calculateGstCheckDigit(gstin14) {
  let factor = 2;
  let sum = 0;
  const mod = CHAR_SET.length;

  for (let i = gstin14.length - 1; i >= 0; i--) {
    const codePoint = CHAR_SET.indexOf(gstin14[i]);
    const addend = factor * codePoint;
    factor = factor === 2 ? 1 : 2;
    sum += Math.floor(addend / mod) + (addend % mod);
  }

  const remainder = sum % mod;
  const checkCodePoint = (mod - remainder) % mod;
  return CHAR_SET[checkCodePoint];
}

/**
 * Validates and parses an Indian GSTIN
 * @param {string} gstin - 15-character GSTIN
 * @returns {object} Validation result and structured components
 */
export function validateGSTIN(gstin) {
  if (!gstin || typeof gstin !== 'string') {
    return { isValid: false, error: 'GSTIN must be a non-empty string' };
  }

  const cleanGSTIN = gstin.trim().toUpperCase();
  if (cleanGSTIN.length !== 15) {
    return {
      isValid: false,
      error: `Invalid GSTIN length: expected 15 characters, got ${cleanGSTIN.length}`
    };
  }

  const match = cleanGSTIN.match(GSTIN_REGEX);
  if (!match) {
    return {
      isValid: false,
      error: 'GSTIN does not match official format (e.g. 07AABCN8921K1Z3)'
    };
  }

  const [, stateCode, pan, entityNumber, defaultZ, checkDigit] = match;
  const stateName = GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `Invalid GST state jurisdiction code: "${stateCode}"`
    };
  }

  const panEntityType = pan[3];
  const panTypes = {
    C: 'Company (Corporate)',
    P: 'Person (Individual)',
    H: 'HUF (Hindu Undivided Family)',
    F: 'Firm / LLP',
    A: 'Association of Persons (AOP)',
    T: 'Trust',
    B: 'Body of Individuals (BOI)',
    L: 'Local Authority',
    J: 'Artificial Juridical Person',
    G: 'Government Entity'
  };

  const calculatedCheckDigit = calculateGstCheckDigit(cleanGSTIN.slice(0, 14));
  const isChecksumValid = calculatedCheckDigit === checkDigit;

  return {
    isValid: true,
    gstin: cleanGSTIN,
    checksumValid: isChecksumValid,
    parsed: {
      stateCode,
      stateName,
      pan,
      panEntityCategory: panTypes[panEntityType] || 'Registered Taxpayer',
      businessEntityNumber: entityNumber,
      defaultConstant: defaultZ,
      checkDigit,
      expectedCheckDigit: calculatedCheckDigit
    },
    complianceStandards: {
      portalUrl: 'https://services.gst.gov.in/services/searchtp',
      eWayBillEligible: true,
      eInvoicingThresholdApplicable: 'Mandatory for B2B turnover > ₹5 Crore (Notification No. 10/2023)',
      filingReturns: ['GSTR-1 (Outward Supplies)', 'GSTR-3B (Summary Return)', 'GSTR-9 (Annual Audit)']
    }
  };
}
