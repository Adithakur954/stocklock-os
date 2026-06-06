export type AuditModule =
  | 'AUTH'
  | 'INVENTORY'
  | 'BILLING'
  | 'BILLING_GUARD'
  | 'EOD_LOCK'
  | 'STOCK_REQUEST'
  | 'STOCK_TRANSFER'
  | 'STAFF'
  | 'CUSTOMER'
  | 'PURCHASE'
  | 'WARRANTY'
  | 'APPROVAL'
  | 'SETTINGS';

export interface AuditLog {
  id: string;
  organizationId: string;
  branchId?: string;
  userId: string;
  module: AuditModule;
  action: string;
  entityType: string;
  entityId: string;
  beforeValue?: string;
  afterValue?: string;
  reason?: string;
  approvalId?: string;
  ipAddress?: string;
  deviceInfo?: string;
  createdAt: string;
}

export interface Approval {
  id: string;
  organizationId: string;
  branchId?: string;
  requestedByUserId: string;
  approvedByUserId?: string;
  module: AuditModule;
  action: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
}
