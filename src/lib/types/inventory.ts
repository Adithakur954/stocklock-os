export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
export type MovementType =
  | 'OPENING_STOCK'
  | 'PURCHASE_INWARD'
  | 'SALE_OUTWARD'
  | 'SALE_RETURN'
  | 'MANUAL_ADJUSTMENT'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'DAMAGE'
  | 'LOSS'
  | 'WARRANTY_REPLACEMENT'
  | 'SERVICE_CONSUMPTION';

export interface Category {
  id: string;
  organizationId: string;
  name: string;
}

export interface Brand {
  id: string;
  organizationId: string;
  name: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  productCode: string;
  hsnCode: string;
  sku: string;
  barcode: string;
  internalCode: string;
  oemPartNumber: string;
  supplierCode: string;
  rackLocation: string;
  categoryId: string;
  category: string;
  brandId: string;
  brand: string;
  imageUrl: string;
  description: string;
  compatibleVehicles: string[];
  fitmentNotes: string;
  keywords: string[];
  unit: string;
  taxRate: number;
  purchaseCost: number;
  sellingPrice: number;
  mrp: number;
  defaultInstallCharge: number;
  minStock: number;
  reorderLevel: number;
  isSerialized: boolean;
  hasWarranty: boolean;
  warrantyMonths: number;
  photoProofRequired: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  lastSoldAt?: string;
}

export interface InventoryBalance {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  lastUpdatedAt: string;
}

export interface StockLedger {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  movementType: MovementType;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType: string;
  referenceId: string;
  reason: string;
  createdByUserId: string;
  createdAt: string;
  lockedBusinessDate?: string;
  approvalId?: string;
}

export type StockRequestUrgency = 'NORMAL' | 'URGENT' | 'CUSTOMER_WAITING';
export type StockRequestStatus =
  | 'OPEN'
  | 'RESPONSE_RECEIVED'
  | 'ACCEPTED'
  | 'DISPATCHED'
  | 'RECEIVED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface StockRequest {
  id: string;
  organizationId: string;
  requestingBranchId: string;
  requestedByUserId: string;
  productId: string;
  requestedQty: number;
  urgency: StockRequestUrgency;
  note: string;
  status: StockRequestStatus;
  createdAt: string;
  expiresAt: string;
}

export type AvailabilityStatus = 'AVAILABLE' | 'PARTIAL_AVAILABLE' | 'NOT_AVAILABLE';

export interface StockRequestResponse {
  id: string;
  requestId: string;
  respondingBranchId: string;
  respondedByUserId: string;
  availabilityStatus: AvailabilityStatus;
  availableQty: number;
  note: string;
  priceNote?: string;
  conditionNote?: string;
  createdAt: string;
}

export type StockTransferStatus = 'DRAFT' | 'READY' | 'DISPATCHED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

export interface StockTransfer {
  id: string;
  organizationId: string;
  sourceBranchId: string;
  destinationBranchId: string;
  requestedByUserId: string;
  dispatchedByUserId?: string;
  receivedByUserId?: string;
  status: StockTransferStatus;
  dispatchNote?: string;
  receiveNote?: string;
  createdAt: string;
  dispatchedAt?: string;
  receivedAt?: string;
}

export interface StockTransferItem {
  id: string;
  transferId: string;
  productId: string;
  qty: number;
  sourceQtyBefore: number;
  sourceQtyAfter: number;
  destinationQtyBefore: number;
  destinationQtyAfter: number;
}
