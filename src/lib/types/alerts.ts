import { AuditModule } from './audit';

export interface Alert {
  id: string;
  organizationId: string;
  branchId?: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'BLOCKER';
  module: AuditModule;
  title: string;
  message: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  actionUrl: string;
  createdAt: string;
  resolvedAt?: string;
  resolvedByUserId?: string;
}
