export type Role =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'BRANCH_MANAGER'
  | 'SALES_STAFF'
  | 'STOCK_STAFF'
  | 'FITTER'
  | 'INSTALLER'
  | 'ACCOUNTANT'
  | 'VIEWER';

export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export type GuardSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'BLOCKER';

export interface GuardResult {
  allowed: boolean;
  requiresApproval: boolean;
  reasons: string[];
  severity: GuardSeverity;
}

export interface Organization {
  id: string;
  name: string;
  businessType: string;
  gstNumber: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  status: EntityStatus;
}

export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  phone: string;
  address: string;
  city: string;
  managerUserId?: string;
  isMainBranch: boolean;
  status: EntityStatus;
}

export interface User {
  id: string;
  organizationId: string;
  branchId?: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  status: EntityStatus;
  avatarUrl?: string;
  createdAt: string;
}
