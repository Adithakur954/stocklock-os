export type OwnerControlKey =
  | 'installPhotoProofRequired'
  | 'billPhotoRequiredOnJobCard'
  | 'qcBeforeVehicleDelivery'
  | 'blockEodPrintedUnpaidBills'
  | 'blockEodOldDraftBills'
  | 'blockEodPendingTransfers'
  | 'blockEodUnapprovedStockAdjustments'
  | 'blockNegativeStock'
  | 'highDiscountOwnerApproval'
  | 'auditEveryOverride';

export type OwnerControlSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type OwnerControlMode = 'OFF' | 'WARNING' | 'HARD_LOCK';

export interface OwnerFeatureControl {
  key: OwnerControlKey;
  enabled: boolean;
  mode?: OwnerControlMode;
  scope?: 'TODAY_ONLY' | 'BRANCH_ONLY' | 'PERMANENT';
  branchId?: string;
}

export interface OwnerFeatureControlAudit {
  id?: string;
  organizationId?: string;
  controlKey: OwnerControlKey;
  previousEnabled: boolean;
  newEnabled: boolean;
  changedByUserId: string;
  reason: string;
  riskWarning: string;
  createdAt: string;
}

export interface BusinessSettings {
  organizationId: string;
  billPrefix: string;
  nextBillSequence: number;
  allowNegativeStock: boolean;
  ownerOverrideForNegativeStock: boolean;
  maxDiscountPercentWithoutApproval: number;
  draftBillExpiryMinutes: number;
  eodCashVarianceThreshold: number;
  transferReceiveRequiredBeforeEod: boolean;
  stockAdjustmentApprovalRequired: boolean;
  purchasePriceUpdatesCost: boolean;
  warrantyDefaultMonths: number;
  businessDateCloseTime: string;
  currency: 'INR';
  taxRate: number;
  printFooter: string;
  ownerControls: Record<OwnerControlKey, OwnerFeatureControl>;
}
