export type EodStatus = 'OPEN' | 'READY_TO_CLOSE' | 'BLOCKED' | 'CLOSED' | 'REOPENED_WITH_APPROVAL';

export interface EodSession {
  id: string;
  organizationId: string;
  branchId: string;
  businessDate: string;
  status: EodStatus;
  openingCash: number;
  expectedCash: number;
  countedCash: number;
  cashVariance: number;
  expectedUpi: number;
  expectedCard: number;
  expectedCredit: number;
  totalSales: number;
  totalReturns: number;
  totalExpenses: number;
  pendingPrintedBills: number;
  oldDraftBills: number;
  pendingTransfers: number;
  stockAdjustments: number;
  closingNote?: string;
  closedByUserId?: string;
  approvedByUserId?: string;
  closedAt?: string;
  createdAt: string;
}
