export interface InfrastructureStatus {
  id: string;
  name: string;
  type: 'Power' | 'Railways' | 'Cloud' | 'Network';
  status: 'Operational' | 'Degraded' | 'Under Attack' | 'Maintenance';
  load: number;
  lastCheck: string;
}

export interface MinistryData {
  id: string;
  name: string;
  compliance: number;
  activeGrievances: number;
  fraudAlerts: number;
}

export interface ZKPProof {
  id: string;
  credentialId: string;
  timestamp: string;
  proofHash: string;
  verified: boolean;
}

export interface FraudCase {
  id: string;
  subject: string;
  type: 'Tax Evasion' | 'Subsidy Mismatch' | 'Identity Theft' | 'Procurement Anomaly';
  riskScore: number;
  status: 'Flagged' | 'Under Investigation' | 'Cleared';
  reasoning: string; // XAI explanation
  recommendation: string; // Suggested action
  evidence: string[]; // Links to supporting data
  timestamp: string;
}

export interface IdentityCredential {
  id: string;
  credential_type: 'IAS Badge' | 'IPS ID' | 'Aadhaar' | 'GSTIN' | 'DigiLocker';
  issuer: string;
  issuedAt: string;
  status: 'Verified' | 'Pending' | 'Revoked';
  proof: string; // ZKP hash
}

export interface SecurityEvent {
  id: string;
  type: 'Intrusion' | 'Anomaly' | 'System' | 'Auth';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
  status: 'Blocked' | 'Monitoring' | 'Resolved' | 'Patched';
  automated_response?: string;
  patch_status?: 'Applied' | 'Pending' | 'N/A';
}

export interface Grievance {
  id: string;
  citizenName: string;
  department: string;
  subject: string;
  status: 'Pending' | 'In-Progress' | 'Resolved';
  timestamp: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface PolicyImpact {
  name: string;
  target: number;
  current: number;
  unit: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
