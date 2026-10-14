/**
 * MCA (Ministry of Corporate Affairs) CIN Validator & Parser
 * Authored by Phyllis Vance (`client-research`)
 * Munder Difflin Enterprise Client Intelligence
 */

export const INDIAN_STATE_CODES = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  CH: 'Chandigarh',
  DD: 'Daman & Diu',
  DL: 'Delhi',
  DN: 'Dadra & Nagar Haveli',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu & Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  LD: 'Lakshadweep',
  MH: 'Maharashtra',
  ML: 'Meghalaya',
  MN: 'Manipur',
  MP: 'Madhya Pradesh',
  MZ: 'Mizoram',
  NL: 'Nagaland',
  OR: 'Odisha',
  PB: 'Punjab',
  PY: 'Puducherry',
  RJ: 'Rajasthan',
  SK: 'Sikkim',
  TG: 'Telangana',
  TN: 'Tamil Nadu',
  TR: 'Tripura',
  UL: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal'
};

export const COMPANY_OWNERSHIP_TYPES = {
  PTC: 'Private Limited Company',
  PLC: 'Public Limited Company',
  FTC: 'Subsidiary of Foreign Company',
  OPC: 'One Person Company',
  SGC: 'State Government Company',
  CGC: 'Central Government Company',
  NPL: 'Non-Profit License (Section 8 Company)',
  ULL: 'Unlimited Liability Private Company',
  GAP: 'General Association / Private Body'
};

const CIN_REGEX = /^([UL])([0-9]{5})([A-Z]{2})([0-9]{4})([A-Z]{3})([0-9]{6})$/;

/**
 * Validates and parses an Indian Corporate Identity Number (CIN)
 * @param {string} cin - 21-character CIN
 * @returns {object} Validation result and structured components
 */
export function validateCIN(cin) {
  if (!cin || typeof cin !== 'string') {
    return { isValid: false, error: 'CIN must be a non-empty string' };
  }

  const cleanCIN = cin.trim().toUpperCase();
  if (cleanCIN.length !== 21) {
    return {
      isValid: false,
      error: `Invalid CIN length: expected 21 characters, got ${cleanCIN.length}`
    };
  }

  const match = cleanCIN.match(CIN_REGEX);
  if (!match) {
    return {
      isValid: false,
      error: 'CIN does not match standard MCA format (e.g. U60200DL2018PTC334192)'
    };
  }

  const [, listingChar, nicCode, stateCode, yearStr, typeCode, regNumber] = match;
  const stateName = INDIAN_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `Invalid MCA state code in CIN: "${stateCode}"`
    };
  }

  const year = parseInt(yearStr, 10);
  const currentYear = 2026;
  if (year < 1850 || year > currentYear) {
    return {
      isValid: false,
      error: `Invalid incorporation year in CIN: ${year}`
    };
  }

  const companyTypeDesc = COMPANY_OWNERSHIP_TYPES[typeCode] || 'Registered Corporate Body';

  return {
    isValid: true,
    cin: cleanCIN,
    parsed: {
      listingStatus: listingChar === 'L' ? 'Listed' : 'Unlisted',
      nicIndustryCode: nicCode,
      stateCode,
      stateName,
      incorporationYear: year,
      companyTypeCode: typeCode,
      companyTypeDescription: companyTypeDesc,
      registrationNumber: regNumber
    },
    verificationCriteria: {
      mcaPortalVerificationUrl: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
      rocFilingActive: true,
      annualComplianceRequirements: ['Form AOC-4 (Financials)', 'Form MGT-7 (Annual Return)', 'DIR-3 KYC']
    }
  };
}
