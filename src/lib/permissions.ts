import { Role } from '@/lib/types/core';

type Permission =
  | 'dashboard'
  | 'branches'
  | 'inventory'
  | 'products'
  | 'stock-requests'
  | 'transfers'
  | 'billing'
  | 'bills'
  | 'payments'
  | 'returns'
  | 'purchases'
  | 'vendors'
  | 'customers'
  | 'staff'
  | 'service-jobs'
  | 'warranty'
  | 'eod'
  | 'approvals'
  | 'alerts'
  | 'audit'
  | 'reports'
  | 'settings';

const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: ['dashboard', 'branches', 'inventory', 'products', 'stock-requests', 'transfers', 'billing', 'bills', 'payments', 'returns', 'purchases', 'vendors', 'customers', 'staff', 'service-jobs', 'warranty', 'eod', 'approvals', 'alerts', 'audit', 'reports', 'settings'],
  OWNER: ['dashboard', 'branches', 'inventory', 'products', 'stock-requests', 'transfers', 'billing', 'bills', 'payments', 'returns', 'purchases', 'vendors', 'customers', 'staff', 'service-jobs', 'warranty', 'eod', 'approvals', 'alerts', 'audit', 'reports', 'settings'],
  BRANCH_MANAGER: ['dashboard', 'inventory', 'products', 'stock-requests', 'transfers', 'billing', 'bills', 'payments', 'returns', 'customers', 'staff', 'service-jobs', 'warranty', 'eod', 'alerts', 'audit', 'reports'],
  SALES_STAFF: ['dashboard', 'products', 'stock-requests', 'billing', 'bills', 'payments', 'customers', 'service-jobs', 'alerts'],
  STOCK_STAFF: ['dashboard', 'inventory', 'products', 'stock-requests', 'transfers', 'purchases', 'vendors', 'alerts', 'audit'],
  FITTER: ['dashboard', 'stock-requests', 'staff', 'service-jobs', 'warranty', 'alerts'],
  INSTALLER: ['dashboard', 'stock-requests', 'staff', 'service-jobs', 'warranty', 'alerts'],
  ACCOUNTANT: ['dashboard', 'billing', 'bills', 'payments', 'returns', 'purchases', 'vendors', 'customers', 'eod', 'approvals', 'alerts', 'audit', 'reports', 'settings'],
  VIEWER: ['dashboard', 'inventory', 'products', 'bills', 'customers', 'alerts', 'reports'],
};

function normalizeRole(role?: string): Role {
  const mapped: Record<string, Role> = {
    Owner: 'OWNER',
    'Main Branch Manager': 'BRANCH_MANAGER',
    'Branch Manager': 'BRANCH_MANAGER',
    'Sales Staff': 'SALES_STAFF',
    Fitter: 'FITTER',
    'Warehouse Staff': 'STOCK_STAFF',
  };

  return (mapped[role || ''] || role || 'VIEWER') as Role;
}

export function canViewModule(role: string | Role | undefined, module: Permission) {
  return rolePermissions[normalizeRole(role)].includes(module);
}

export function canCreateBill(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'SALES_STAFF'].includes(normalizeRole(role));
}

export function canApproveOverride(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'ACCOUNTANT'].includes(normalizeRole(role));
}

export function canEditInventory(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'STOCK_STAFF'].includes(normalizeRole(role));
}

export function canCloseEod(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'ACCOUNTANT'].includes(normalizeRole(role));
}

export function canCancelBill(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'ACCOUNTANT'].includes(normalizeRole(role));
}

export function canTransferStock(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'STOCK_STAFF'].includes(normalizeRole(role));
}

export function canManageStaff(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER'].includes(normalizeRole(role));
}

export function canViewReports(role?: string | Role) {
  return ['SUPER_ADMIN', 'OWNER', 'BRANCH_MANAGER', 'ACCOUNTANT', 'VIEWER'].includes(normalizeRole(role));
}
