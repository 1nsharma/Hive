/**
 * 🚨 Human Approval Engine
 * Prevents AI from executing high-risk actions without human verification.
 */

export interface ApprovalRequest {
  id: string;
  toolId: string;
  agentId: string;
  tenantId: string;
  payload: any;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: number;
  resolvedAt?: number;
  resolvedBy?: string; // Human User ID
  reason: string; // The explanation provided by the AI for why this action is needed
}

export class ApprovalEngine {
  private queue: ApprovalRequest[] = [];

  requestApproval(request: Omit<ApprovalRequest, 'id' | 'status' | 'requestedAt'>): ApprovalRequest {
    const newReq: ApprovalRequest = {
      ...request,
      id: `req_${Date.now()}`,
      status: 'PENDING',
      requestedAt: Date.now()
    };
    this.queue.push(newReq);
    // Here we would also trigger a notification to the Owner/Manager
    return newReq;
  }

  getPendingRequests(tenantId: string): ApprovalRequest[] {
    return this.queue.filter(q => q.tenantId === tenantId && q.status === 'PENDING');
  }

  resolveRequest(id: string, userId: string, status: 'APPROVED' | 'REJECTED') {
    const req = this.queue.find(q => q.id === id);
    if (req && req.status === 'PENDING') {
      req.status = status;
      req.resolvedAt = Date.now();
      req.resolvedBy = userId;
      // If APPROVED, trigger the actual tool execution
      // If REJECTED, notify the agent
    }
  }
}

export const globalApprovalEngine = new ApprovalEngine();
