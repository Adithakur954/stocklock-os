import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getApprovals() {
  return demoDb.approvals;
}

export function getPendingApprovals() {
  return demoDb.approvals.filter((approval) => approval.status === 'PENDING');
}
