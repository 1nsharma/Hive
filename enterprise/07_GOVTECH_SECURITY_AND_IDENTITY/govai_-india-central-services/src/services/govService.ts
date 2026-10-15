import { GoogleGenAI } from "@google/genai";

export class GovAIService {
  private ai: GoogleGenAI;
  private modelName = "gemini-3-flash-preview";

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }

  async handleGrievanceChat(message: string, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: [
          ...history.map(h => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.content }] })),
          { role: 'user', parts: [{ text: message }] }
        ] as any,
        config: {
          systemInstruction: `You are GovAssist, an AI virtual assistant for the Indian Central Government Services. 
          Your goal is to help citizens with grievances related to services like IAS, IPS, IRS, Aadhaar, GST, etc.
          Be professional, empathetic, and provide clear steps for resolution. 
          If a grievance is complex, suggest the appropriate department (e.g., Ministry of Finance for IRS issues).
          Always maintain a formal and helpful tone.`,
        }
      });
      return response.text || "I apologize, I am unable to process your request at the moment. Please try again later.";
    } catch (error) {
      console.error("GovAI Error:", error);
      return "An error occurred while connecting to the governance portal. Please check your connection.";
    }
  }

  getMockPolicyData() {
    return [
      { name: 'Swachh Bharat', target: 100, current: 92, unit: '%' },
      { name: 'Ayushman Bharat', target: 50, current: 38, unit: 'Cr Users' },
      { name: 'Digital India', target: 100, current: 85, unit: '%' },
      { name: 'PM-KISAN', target: 12, current: 11.3, unit: 'Cr Farmers' },
    ];
  }

  getMockGrievances() {
    return [
      { id: '1', citizenName: 'Aarav Mehta', department: 'IRS', subject: 'Tax Refund Delay', status: 'Pending', timestamp: '2026-03-24', priority: 'High' },
      { id: '2', citizenName: 'Priya Sharma', department: 'IPoS', subject: 'Missing Parcel', status: 'In-Progress', timestamp: '2026-03-25', priority: 'Medium' },
      { id: '3', citizenName: 'Rahul Singh', department: 'UIDAI', subject: 'Aadhaar Update Issue', status: 'Resolved', timestamp: '2026-03-23', priority: 'Low' },
    ];
  }

  getMockFraudCases(): import('../types').FraudCase[] {
    return [
      {
        id: 'FR-882',
        subject: 'GST-INV-2026-X9',
        type: 'Tax Evasion',
        riskScore: 92,
        status: 'Flagged',
        reasoning: 'Sovereign AI detected circular trading pattern between 3 shell entities in Sector 12 using federated learning models.',
        recommendation: 'Initiate immediate audit of the linked GSTINs and freeze input tax credit.',
        evidence: ['https://gstn.gov.in/audit/circular-trading-X9', 'https://mca.gov.in/shell-entity-report'],
        timestamp: '2026-03-25T10:00:00Z'
      },
      {
        id: 'FR-901',
        subject: 'PM-KISAN-BEN-44',
        type: 'Subsidy Mismatch',
        riskScore: 78,
        status: 'Under Investigation',
        reasoning: 'Income tax filings (IRS) show earnings above threshold for PM-KISAN eligibility, cross-verified via homomorphic encryption.',
        recommendation: 'Request manual verification from the local Tehsildar office.',
        evidence: ['https://pmkisan.gov.in/mismatch/BEN-44', 'https://incometax.gov.in/audit/BEN-44'],
        timestamp: '2026-03-25T11:30:00Z'
      }
    ];
  }

  getMockInfrastructure(): import('../types').InfrastructureStatus[] {
    return [
      { id: 'INF-001', name: 'National Power Grid (POSOCO)', type: 'Power', status: 'Operational', load: 72, lastCheck: new Date().toISOString() },
      { id: 'INF-002', name: 'IRCTC Signaling Network', type: 'Railways', status: 'Operational', load: 45, lastCheck: new Date().toISOString() },
      { id: 'INF-003', name: 'MeghRaj Sovereign Cloud', type: 'Cloud', status: 'Operational', load: 88, lastCheck: new Date().toISOString() },
      { id: 'INF-004', name: 'Central e-Office Gateway', type: 'Network', status: 'Under Attack', load: 95, lastCheck: new Date().toISOString() },
    ];
  }

  getMockMinistries(): import('../types').MinistryData[] {
    return [
      { id: 'MIN-FIN', name: 'Ministry of Finance', compliance: 94, activeGrievances: 450, fraudAlerts: 12 },
      { id: 'MIN-HOME', name: 'Ministry of Home Affairs', compliance: 98, activeGrievances: 120, fraudAlerts: 3 },
      { id: 'MIN-HEALTH', name: 'Ministry of Health', compliance: 88, activeGrievances: 890, fraudAlerts: 24 },
      { id: 'MIN-RAIL', name: 'Ministry of Railways', compliance: 91, activeGrievances: 1200, fraudAlerts: 8 },
    ];
  }
}

export const govService = new GovAIService();
