import test from 'node:test';
import assert from 'node:assert/strict';
import {
  listLeads,
  findLead,
  getCallingScript,
  generateGmailEmail,
  lookupObjection,
  generateProposal,
  generateContract,
  getStats
} from '../engine.mjs';

test('Lead Database Integrity', async (t) => {
  await t.test('lists all verified leads from research database', () => {
    const leads = listLeads();
    assert.ok(Array.isArray(leads));
    assert.strictEqual(leads.length >= 5, true);
  });

  await t.test('finds specific leads by company or target solution', () => {
    const freightLead = findLead('National Express');
    assert.ok(freightLead);
    assert.strictEqual(freightLead.targetSolution, 'truckwala');

    const retailLead = findLead('Bhavani');
    assert.ok(retailLead);
    assert.strictEqual(retailLead.targetSolution, 'dukaanmitra');

    const solarLead = findLead('Apex');
    assert.ok(solarLead);
    assert.strictEqual(solarLead.targetSolution, 'solarhub');

    const govLead = findLead('SecurePay');
    assert.ok(govLead);
    assert.strictEqual(govLead.targetSolution, 'proofledger');
  });
});

test('Cold Calling Scripts Across All 4 Verticals', async (t) => {
  const verticals = ['dukaanmitra', 'truckwala', 'solarhub', 'proofledger'];

  for (const v of verticals) {
    await t.test(`loads non-empty calling script for ${v}`, () => {
      const script = getCallingScript(v);
      assert.ok(script.length > 500);
      assert.ok(script.includes('Gatekeeper Navigation'));
      assert.ok(script.includes('Pattern-Interrupt Hook'));
      assert.ok(script.includes('Discovery Questions'));
      assert.ok(script.includes('Closing Hook') || script.includes('Deal Close'));
    });
  }
});

test('Gmail Email Sequences & Merge Tag Interpolation', async (t) => {
  const testCases = [
    { vertical: 'dukaanmitra', query: 'Bhavani', leadName: 'Bhavani Shankar Chettiar' },
    { vertical: 'truckwala', query: 'National Express', leadName: 'Rajesh Singhal' },
    { vertical: 'solarhub', query: 'Apex', leadName: 'Harpreet Singh Dhillon' },
    { vertical: 'proofledger', query: 'SecurePay', leadName: 'Ananya Deshmukh' }
  ];

  for (const tc of testCases) {
    for (let step = 1; step <= 5; step++) {
      await t.test(`generates step ${step} email for ${tc.vertical}`, () => {
        const res = generateGmailEmail(tc.vertical, tc.query, step);
        assert.ok(res);
        assert.strictEqual(res.step, step);
        assert.ok(res.renderedContent.length > 100);

        // Ensure key merge tags are properly substituted
        assert.ok(!res.renderedContent.includes('{{firstName}}'), 'firstName should be substituted');
        assert.ok(!res.renderedContent.includes('{{companyName}}'), 'companyName should be substituted');
      });
    }
  }
});

test('Objection-Handling Battlecards Lookup', async (t) => {
  await t.test('retrieves counter-scripts for universal objections', () => {
    const costMatches = lookupObjection('expensive');
    assert.ok(costMatches.length > 0);

    const vendorMatches = lookupObjection('vendor');
    assert.ok(vendorMatches.length > 0);

    const emailMatches = lookupObjection('email');
    assert.ok(emailMatches.length > 0);
  });

  await t.test('retrieves competitor battlecard for Vyapar/WheelsEye', () => {
    const vyaparMatches = lookupObjection('vyapar');
    assert.ok(vyaparMatches.length > 0);

    const wheelseyeMatches = lookupObjection('wheelseye');
    assert.ok(wheelseyeMatches.length > 0);
  });
});

test('Commercial Proposal Generation', async (t) => {
  const verticals = [
    { v: 'dukaanmitra', q: 'Bhavani' },
    { v: 'truckwala', q: 'National Express' },
    { v: 'solarhub', q: 'Apex' },
    { v: 'proofledger', q: 'SecurePay' }
  ];

  for (const { v, q } of verticals) {
    await t.test(`renders proposal for ${v}`, () => {
      const proposal = generateProposal(v, q);
      assert.ok(proposal.length > 1000);
      assert.ok(proposal.includes('Commercial Proposal'));
      assert.ok(proposal.includes('Pricing Structure') || proposal.includes('Commercial Models'));
      assert.ok(proposal.includes('Acceptance & Authorization'));
      assert.ok(!proposal.includes('{{companyName}}'));
    });
  }
});

test('Closed-Won Contract Frameworks & Master Services Agreement', async (t) => {
  const verticals = [
    { v: 'dukaanmitra', q: 'Bhavani' },
    { v: 'truckwala', q: 'National Express' },
    { v: 'solarhub', q: 'Apex' },
    { v: 'proofledger', q: 'SecurePay' }
  ];

  for (const { v, q } of verticals) {
    await t.test(`renders full MSA & SOW agreement for ${v}`, () => {
      const contract = generateContract(v, q);
      assert.ok(contract.length > 2000);
      assert.ok(contract.includes('MASTER SERVICES AGREEMENT'));
      assert.ok(contract.includes('DPDP Act'));
      assert.ok(contract.includes('Arbitration and Conciliation Act, 1996'));
      assert.ok(contract.includes('Schedule'));
      assert.ok(!contract.includes('{{clientCompanyName}}'));
    });
  }
});

test('Closing Engine Health & Summary Metrics', async (t) => {
  await t.test('provides comprehensive operational telemetry', () => {
    const stats = getStats();
    assert.strictEqual(stats.callingScripts, 4);
    assert.strictEqual(stats.productsCovered.length, 4);
    assert.strictEqual(stats.emailCadenceTouchesPerProduct, 5);
  });
});
