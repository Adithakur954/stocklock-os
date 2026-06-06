export interface SerialNumber {
  id: string;
  organizationId: string;
  productId: string;
  serialNumber: string;
  branchId: string;
  status: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'WARRANTY_CLAIM' | 'DAMAGED';
  purchaseBillId?: string;
  saleBillId?: string;
  customerId?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
}

export interface WarrantyClaim {
  id: string;
  organizationId: string;
  branchId: string;
  customerId: string;
  productId: string;
  serialNumber: string;
  issue: string;
  status: 'OPEN' | 'IN_REVIEW' | 'REPLACED' | 'REPAIRED' | 'REJECTED' | 'CLOSED';
  resolution?: string;
  createdAt: string;
  closedAt?: string;
}
