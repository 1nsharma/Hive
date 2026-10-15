import { IdentityCredential, SecurityEvent } from '../types';

export class SecurityService {
  getMockCredentials(): IdentityCredential[] {
    return [
      {
        id: 'VC-IAS-2026-001',
        credential_type: 'IAS Badge',
        issuer: 'UPSC / DoPT',
        issuedAt: '2026-01-15',
        status: 'Verified',
        proof: '0x7f8e9a2b3c4d5e6f1a2b3c4d5e6f7a8b9c0d1e2f'
      },
      {
        id: 'VC-AADH-9982',
        credential_type: 'Aadhaar',
        issuer: 'UIDAI',
        issuedAt: '2026-02-20',
        status: 'Verified',
        proof: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
      }
    ];
  }

  getSecurityEvents(): SecurityEvent[] {
    return [
      {
        id: 'EV-102',
        type: 'Intrusion',
        severity: 'Critical',
        message: 'Brute force attempt detected on IRS Gateway',
        timestamp: new Date().toISOString(),
        status: 'Blocked',
        automated_response: 'IP 103.44.12.9 blocked at firewall level; session terminated.',
        patch_status: 'N/A'
      },
      {
        id: 'EV-103',
        type: 'Anomaly',
        severity: 'Medium',
        message: 'Unusual data egress pattern in Ministry of Finance',
        timestamp: new Date().toISOString(),
        status: 'Monitoring',
        automated_response: 'Rate limiting applied to egress node; alert routed to SOC.',
        patch_status: 'N/A'
      },
      {
        id: 'EV-104',
        type: 'Auth',
        severity: 'Low',
        message: 'Successful SSI login: Officer Amit Sharma',
        timestamp: new Date().toISOString(),
        status: 'Resolved',
        automated_response: 'ZKP proof verified; access granted to Level 4 resources.',
        patch_status: 'N/A'
      },
      {
        id: 'EV-105',
        type: 'System',
        severity: 'Medium',
        message: 'Automated Patch applied: CVE-2026-1120 (OpenSSL)',
        timestamp: new Date().toISOString(),
        status: 'Patched',
        automated_response: 'System dependencies updated; services restarted.',
        patch_status: 'Applied'
      },
      {
        id: 'EV-106',
        type: 'Anomaly',
        severity: 'High',
        message: 'Federated Learning model updated: New fraud pattern detected in GST module',
        timestamp: new Date().toISOString(),
        status: 'Monitoring',
        automated_response: 'Model weights distributed to all ministry nodes.',
        patch_status: 'N/A'
      }
    ];
  }

  async verifyCredential(id: string): Promise<boolean> {
    // Simulate a decentralized verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }
}

export const securityService = new SecurityService();
