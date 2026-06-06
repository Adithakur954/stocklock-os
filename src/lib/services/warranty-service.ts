import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getSerialNumbers() {
  return demoDb.serialNumbers;
}

export function getWarrantyClaims() {
  return demoDb.warrantyClaims;
}

export function getOpenWarrantyClaims() {
  return demoDb.warrantyClaims.filter((claim) => !['CLOSED', 'REJECTED'].includes(claim.status));
}
