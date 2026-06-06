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
}
