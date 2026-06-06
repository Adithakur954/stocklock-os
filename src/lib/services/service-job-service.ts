import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getServiceJobs() {
  return demoDb.serviceJobs;
}

export function getPendingServiceJobs() {
  return demoDb.serviceJobs.filter((job) => !['COMPLETED', 'BILLED', 'CANCELLED'].includes(job.status));
}

export function getJobsByBranch(branchId: string) {
  return demoDb.serviceJobs.filter((job) => job.branchId === branchId);
}
