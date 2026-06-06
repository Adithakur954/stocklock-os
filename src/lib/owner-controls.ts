import { BusinessSettings, OwnerControlKey, OwnerControlSeverity, OwnerFeatureControl, OwnerFeatureControlAudit } from '@/lib/types/settings';
import { Product } from '@/lib/types/inventory';

export type OwnerControlGroup = 'Photo Proof' | 'EOD Lock' | 'Billing Guard' | 'Stock Control' | 'Audit';

export interface OwnerControlDefinition {
  key: OwnerControlKey;
  label: string;
  group: OwnerControlGroup;
  severity: OwnerControlSeverity;
  ownerRiskWhenOff: string;
  staffMessageWhenOff: string;
  staffMessageWhenOn: string;
}

export const ownerControlDefinitions: OwnerControlDefinition[] = [
  {
    key: 'installPhotoProofRequired',
    label: 'Before/after install photo proof',
    group: 'Photo Proof',
    severity: 'HIGH',
    ownerRiskWhenOff: 'Without photo proof, warranty and damage dispute proof becomes weak.',
    staffMessageWhenOff: 'Photo optional by owner.',
    staffMessageWhenOn: 'Before/after photos required.',
  },
  {
    key: 'billPhotoRequiredOnJobCard',
    label: 'Bill photo on job card',
    group: 'Photo Proof',
    severity: 'MEDIUM',
    ownerRiskWhenOff: 'Bill proof will rely on bill number matching instead of a job-card photo.',
    staffMessageWhenOff: 'Bill photo optional by owner.',
    staffMessageWhenOn: 'Attach bill photo before closing job.',
  },
  {
    key: 'qcBeforeVehicleDelivery',
    label: 'QC before vehicle delivery',
    group: 'Photo Proof',
    severity: 'HIGH',
    ownerRiskWhenOff: 'Without QC, wrong fitment or loose wiring may reach the customer.',
    staffMessageWhenOff: 'QC optional by owner.',
    staffMessageWhenOn: 'QC required before delivery.',
  },
  {
    key: 'blockEodPrintedUnpaidBills',
    label: 'Block EOD for printed unpaid bills',
    group: 'EOD Lock',
    severity: 'CRITICAL',
    ownerRiskWhenOff: 'Printed unpaid bills can be forgotten during closing and become hidden credit.',
    staffMessageWhenOff: 'Printed unpaid bills will warn, not block EOD.',
    staffMessageWhenOn: 'Printed unpaid bills block EOD.',
  },
  {
    key: 'blockEodOldDraftBills',
    label: 'Block EOD for old draft bills',
    group: 'EOD Lock',
    severity: 'HIGH',
    ownerRiskWhenOff: 'Old drafts may hide missed sales or abandoned bills.',
    staffMessageWhenOff: 'Old draft bills will warn, not block EOD.',
    staffMessageWhenOn: 'Old draft bills block EOD.',
  },
  {
    key: 'blockEodPendingTransfers',
    label: 'Block EOD for pending branch transfers',
    group: 'EOD Lock',
    severity: 'HIGH',
    ownerRiskWhenOff: 'Transferred stock may remain between branches without receive confirmation.',
    staffMessageWhenOff: 'Pending transfers will warn, not block EOD.',
    staffMessageWhenOn: 'Pending transfers block EOD.',
  },
  {
    key: 'blockEodUnapprovedStockAdjustments',
    label: 'Block EOD for unapproved stock adjustments',
    group: 'EOD Lock',
    severity: 'CRITICAL',
    ownerRiskWhenOff: 'Manual stock changes may close without owner review.',
    staffMessageWhenOff: 'Stock adjustment approval will warn, not block EOD.',
    staffMessageWhenOn: 'Unapproved stock adjustment blocks EOD.',
  },
  {
    key: 'blockNegativeStock',
    label: 'Block negative stock',
    group: 'Stock Control',
    severity: 'CRITICAL',
    ownerRiskWhenOff: 'Staff can bill stock that system says is unavailable, creating inventory mismatch.',
    staffMessageWhenOff: 'Negative stock allowed by owner.',
    staffMessageWhenOn: 'Negative stock blocked.',
  },
  {
    key: 'highDiscountOwnerApproval',
    label: 'High discount owner approval',
    group: 'Billing Guard',
    severity: 'HIGH',
    ownerRiskWhenOff: 'High discounts can be given without owner approval.',
    staffMessageWhenOff: 'High discount approval optional by owner.',
    staffMessageWhenOn: 'Owner approval required for high discount.',
  },
  {
    key: 'auditEveryOverride',
    label: 'Audit every override',
    group: 'Audit',
    severity: 'CRITICAL',
    ownerRiskWhenOff: 'Override history becomes weaker until database audit is connected.',
    staffMessageWhenOff: 'Override audit optional by owner.',
    staffMessageWhenOn: 'Every override will be audited.',
  },
];

export const defaultOwnerControls: Record<OwnerControlKey, OwnerFeatureControl> = ownerControlDefinitions.reduce(
  (controls, definition) => ({
    ...controls,
    [definition.key]: {
      key: definition.key,
      enabled: true,
      mode: 'HARD_LOCK',
      scope: 'PERMANENT',
    },
  }),
  {} as Record<OwnerControlKey, OwnerFeatureControl>
);

export function getOwnerControl(settings: BusinessSettings, key: OwnerControlKey) {
  return settings.ownerControls?.[key] || defaultOwnerControls[key];
}

export function isOwnerControlEnabled(settings: BusinessSettings, key: OwnerControlKey) {
  return getOwnerControl(settings, key).enabled;
}

export function getOwnerControlDefinition(key: OwnerControlKey) {
  return ownerControlDefinitions.find((definition) => definition.key === key);
}

export function mergeOwnerControls(savedControls?: Partial<Record<OwnerControlKey, OwnerFeatureControl>>) {
  return ownerControlDefinitions.reduce((controls, definition) => {
    const saved = savedControls?.[definition.key];
    controls[definition.key] = {
      ...defaultOwnerControls[definition.key],
      ...saved,
      key: definition.key,
    };
    return controls;
  }, {} as Record<OwnerControlKey, OwnerFeatureControl>);
}

export function shouldRequireInstallPhotoProof(settings: BusinessSettings, product?: Product) {
  return isOwnerControlEnabled(settings, 'installPhotoProofRequired') && Boolean(product?.photoProofRequired);
}

export function getOwnerControlAuditDraft(params: {
  controlKey: OwnerControlKey;
  previousEnabled: boolean;
  newEnabled: boolean;
  changedByUserId: string;
  reason: string;
}): OwnerFeatureControlAudit {
  const definition = getOwnerControlDefinition(params.controlKey);
  return {
    controlKey: params.controlKey,
    previousEnabled: params.previousEnabled,
    newEnabled: params.newEnabled,
    changedByUserId: params.changedByUserId,
    reason: params.reason,
    riskWarning: !params.newEnabled ? definition?.ownerRiskWhenOff || '' : '',
    createdAt: new Date().toISOString(),
  };
}
