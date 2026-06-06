export type BillType = 'SALE' | 'SERVICE' | 'MIXED' | 'RETURN' | 'CREDIT_NOTE';
export type BillStatus = 'DRAFT' | 'PRINTED' | 'FINALIZED' | 'PART_PAID' | 'PAID' | 'CANCELLED' | 'RETURNED';
export type PaymentStatus = 'UNPAID' | 'PART_PAID' | 'PAID' | 'REFUNDED';
export type ItemType = 'PRODUCT' | 'SERVICE' | 'INSTALLATION' | 'DISCOUNT' | 'CHARGE';
export type PaymentMode = 'CASH' | 'UPI' | 'CARD' | 'CREDIT' | 'BANK_TRANSFER' | 'MIXED';

export interface Bill {
  id: string;
  organizationId: string;
  branchId: string;
  billNumber: string;
  customerId?: string;
  businessDate: string;
  billType: BillType;
  status: BillStatus;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  createdByUserId: string;
  printedAt?: string;
  finalizedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  lockedByBillingGuard: boolean;
}

export interface BillItem {
  id: string;
  billId: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  itemType: ItemType;
  serialNumber?: string;
  warrantyMonths?: number;
}

export interface Payment {
  id: string;
  billId: string;
  mode: PaymentMode;
  amount: number;
  referenceNumber?: string;
  receivedByUserId: string;
  receivedAt: string;
  status: 'RECORDED' | 'REVERSED';
}

export interface CreditNote {
  id: string;
  organizationId: string;
  branchId: string;
  originalBillId: string;
  creditNoteNumber: string;
  customerId?: string;
  reason: string;
  amount: number;
  status: 'DRAFT' | 'APPROVED' | 'USED' | 'CANCELLED';
  createdByUserId: string;
  approvedByUserId?: string;
  createdAt: string;
}

export interface ReturnRecord {
  id: string;
  organizationId: string;
  branchId: string;
  originalBillId: string;
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
  reason: string;
  refundMode: PaymentMode;
  createdByUserId: string;
  approvedByUserId?: string;
  createdAt: string;
}

export interface ReturnItem {
  id: string;
  returnId: string;
  productId: string;
  qty: number;
  condition: 'GOOD' | 'DAMAGED' | 'WARRANTY' | 'SCRAP';
  restock: boolean;
}
