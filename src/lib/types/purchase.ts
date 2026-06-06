export interface Vendor {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  gstNumber?: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  status: 'ACTIVE' | 'INACTIVE';
  dueAmount: number;
}

export interface PurchaseOrder {
  id: string;
  organizationId: string;
  branchId: string;
  vendorId: string;
  poNumber: string;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED';
  expectedDate: string;
  createdByUserId: string;
  createdAt: string;
}

export interface PurchaseBill {
  id: string;
  organizationId: string;
  branchId: string;
  vendorId: string;
  invoiceNumber: string;
  status: 'DRAFT' | 'RECEIVED' | 'PARTIALLY_RECEIVED' | 'CANCELLED';
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  createdAt: string;
}

export interface PurchaseItem {
  id: string;
  purchaseBillId: string;
  productId: string;
  qty: number;
  costPrice: number;
  taxRate: number;
  lineTotal: number;
}
