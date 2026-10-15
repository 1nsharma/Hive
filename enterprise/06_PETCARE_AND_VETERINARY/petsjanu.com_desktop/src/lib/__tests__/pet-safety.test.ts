import { describe, it, expect } from 'vitest';

// Mock the node:test imports for vitest compatibility
const test = it;
const describeSuite = describe;

import {
  redactPii,
  deterministicEmergencyCheck,
  containsUnsafeAdvice,
  emergencyResponse,
  fallbackResponse,
} from '../ai/pet-safety';

describeSuite('Pet Safety AI Utilities', () => {
  describeSuite('redactPii', () => {
    it('redacts email addresses', () => {
      const input = 'Contact user at john.doe@example.com for info.';
      const result = redactPii(input);
      expect(result.includes('john.doe@example.com')).toBe(false);
      expect(result.includes('[EMAIL_REDACTED]')).toBe(true);
    });

    it('redacts phone numbers', () => {
      const input = 'Call me at +91 98765 43210 immediately.';
      const result = redactPii(input);
      expect(result.includes('98765')).toBe(false);
      expect(result.includes('[PHONE_REDACTED]')).toBe(true);
    });

    it('handles empty string gracefully', () => {
      expect(redactPii('')).toBe('');
    });
  });

  describeSuite('deterministicEmergencyCheck', () => {
    it('detects breathing difficulties as emergency', () => {
      expect(deterministicEmergencyCheck('My dog is struggling to breathe')).toBe(true);
      expect(deterministicEmergencyCheck('My cat cannot breathe')).toBe(true);
    });

    it('detects seizures as emergency', () => {
      expect(deterministicEmergencyCheck('Pup had a seizure 5 mins ago')).toBe(true);
    });

    it('detects poison ingestion as emergency', () => {
      expect(deterministicEmergencyCheck('Dog swallowed chocolate and antifreeze')).toBe(true);
    });

    it('returns false for non-emergency symptoms', () => {
      expect(deterministicEmergencyCheck('My dog seems a bit tired today')).toBe(false);
    });
  });

  describeSuite('containsUnsafeAdvice', () => {
    it('flags dosage recommendations as unsafe', () => {
      const unsafeOutput = {
        urgent: 'monitor' as const,
        summary: 'Give a dose of 5mg/kg paracetamol',
        red_flags: [],
        next_steps: ['Give medication'],
        what_to_avoid: [],
        disclaimer: 'Disclaimer',
      };
      expect(containsUnsafeAdvice(unsafeOutput)).toBe(true);
    });

    it('flags definitive diagnosis as unsafe', () => {
      const unsafeOutput = {
        urgent: 'same_day' as const,
        summary: 'Your pet has a disease called Parvovirus',
        red_flags: [],
        next_steps: [],
        what_to_avoid: [],
        disclaimer: 'Disclaimer',
      };
      expect(containsUnsafeAdvice(unsafeOutput)).toBe(true);
    });

    it('passes safe emergency response', () => {
      const safeResp = emergencyResponse();
      expect(containsUnsafeAdvice(safeResp)).toBe(false);
    });
  });

  describeSuite('emergencyResponse & fallbackResponse', () => {
    it('creates emergency response with emergency urgency level', () => {
      const resp = emergencyResponse();
      expect(resp.urgent).toBe('emergency');
      expect(resp.red_flags.length).toBeGreaterThan(0);
    });

    it('creates fallback response with unknown urgency level', () => {
      const resp = fallbackResponse('Custom error message');
      expect(resp.urgent).toBe('unknown');
      expect(resp.summary).toBe('Custom error message');
    });
  });
});
