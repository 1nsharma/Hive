/**
 * 🔐 Security & Permission System (RBAC)
 */
export type Role = 
  | 'owner' 
  | 'manager' 
  | 'cashier' 
  | 'staff' 
  | 'salesman' 
  | 'accountant' 
  | 'partner' 
  | 'auditor' 
  | 'customer' 
  | 'vendor' 
  | 'ai_agent'
  | 'super_admin';

export type Permission = 
  | 'read:sales' | 'write:sales' | 'delete:sales'
  | 'read:inventory' | 'write:inventory' | 'delete:inventory'
  | 'read:customers' | 'write:customers'
  | 'read:finance' | 'write:finance'
  | 'manage:staff' | 'manage:settings'
  | 'approve:discounts' | 'approve:returns'
  | 'export:data';

export interface UserContext {
  uid: string;
  tenantId: string;
  role: Role;
  permissions: Permission[];
  branchIds: string[]; // Branches this user has access to
  deviceId: string;
  sessionId: string;
}

export interface SecurityAuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: number;
  ipAddress?: string;
  deviceId?: string;
  status: 'success' | 'failure';
}
