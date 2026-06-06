import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { AuditLog, AuditModule } from '@/lib/types/audit';

export function createAuditLog(input: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
  return {
    ...input,
    id: `aud_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}

export function createBillingAuditLog(entityId: string, userId: string, action: string, reason: string) {
  return createAuditLog({ organizationId: demoDb.organization.id, userId, module: 'BILLING', action, entityType: 'Bill', entityId, reason });
}

export function createInventoryAuditLog(entityId: string, userId: string, action: string, reason: string) {
  return createAuditLog({ organizationId: demoDb.organization.id, userId, module: 'INVENTORY', action, entityType: 'Product', entityId, reason });
}

export function createEodAuditLog(entityId: string, userId: string, action: string, reason: string) {
  return createAuditLog({ organizationId: demoDb.organization.id, userId, module: 'EOD_LOCK', action, entityType: 'EodSession', entityId, reason });
}

export function createApprovalAuditLog(entityId: string, userId: string, action: string, reason: string) {
  return createAuditLog({ organizationId: demoDb.organization.id, userId, module: 'APPROVAL', action, entityType: 'Approval', entityId, reason });
}

export function getAuditLogs(module?: AuditModule) {
  return module ? demoDb.auditLogs.filter((log) => log.module === module) : demoDb.auditLogs;
}
