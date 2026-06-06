import { Bill } from '@/lib/types/billing';
import { GuardResult, Role } from '@/lib/types/core';
import { BusinessSettings } from '@/lib/types/settings';
import { canApproveOverride, canCancelBill as roleCanCancelBill } from '@/lib/permissions';

function result(allowed: boolean, reasons: string[], requiresApproval = false): GuardResult {
  return {
    allowed,
    requiresApproval,
    reasons,
    severity: !allowed ? 'BLOCKER' : requiresApproval ? 'CRITICAL' : reasons.length ? 'WARNING' : 'INFO',
  };
}

export function canEditBill(bill: Bill): GuardResult {
  if (bill.status === 'PRINTED') return result(false, ['This bill is locked after print.']);
  if (bill.paymentStatus === 'PAID' || bill.status === 'PAID') return result(false, ['Paid bills cannot be edited directly. Create return or credit note.']);
  if (bill.status === 'FINALIZED') return result(false, ['Finalized bills cannot be edited directly.']);
  if (bill.status === 'CANCELLED') return result(false, ['Cancelled bills remain visible and cannot be edited.']);
  return result(true, []);
}

export function canCancelBill(bill: Bill, role: Role): GuardResult {
  if (!canCancelBillPermission(role)) return result(false, ['Only permitted roles can cancel bills.'], true);
  if (bill.status === 'PAID' || bill.paymentStatus === 'PAID') return result(false, ['Paid bills cannot be cancelled directly. Create return or credit note.'], true);
  if (bill.status === 'CANCELLED') return result(false, ['Bill is already cancelled.']);
  if (bill.status === 'PRINTED') return result(false, ['Owner approval required for cancelling printed bill.'], true);
  return result(true, []);
}

function canCancelBillPermission(role: Role) {
  return roleCanCancelBill(role);
}

export function canPrintBill(bill: Bill): GuardResult {
  if (bill.status === 'CANCELLED') return result(false, ['Cancelled bill cannot be printed.']);
  if (bill.status === 'PAID') return result(true, ['Paid bill can be reprinted as duplicate copy.']);
  return result(true, []);
}

export function canFinalizeBill(bill: Bill): GuardResult {
  if (bill.status === 'CANCELLED') return result(false, ['Cancelled bill cannot be finalized.']);
  if (bill.status === 'PRINTED' && bill.paymentStatus === 'UNPAID') return result(true, ['Printed but unpaid bill pending.']);
  return result(true, []);
}

export function canAcceptPayment(bill: Bill): GuardResult {
  if (bill.status === 'CANCELLED') return result(false, ['Cancelled bill cannot accept payment.']);
  if (bill.paymentStatus === 'PAID') return result(false, ['Bill is already fully paid.']);
  return result(true, []);
}

export function canApplyDiscount(discountPercent: number, settings: BusinessSettings, role: Role): GuardResult {
  if (discountPercent <= settings.maxDiscountPercentWithoutApproval) return result(true, []);
  if (canApproveOverride(role)) return result(true, ['High discount allowed by approver role.']);
  return result(false, [`Discount above ${settings.maxDiscountPercentWithoutApproval}% requires owner approval.`], true);
}

export function canChangeBillDate(role: Role): GuardResult {
  if (canApproveOverride(role)) return result(true, []);
  return result(false, ['Backdated bill requires owner approval.'], true);
}

export function canDeleteBill(bill: Bill): GuardResult {
  if (bill.status === 'DRAFT') return result(true, []);
  return result(false, ['Finalized bill cannot be deleted. Bill number sequence protected.']);
}

export function canCreateReturn(bill: Bill): GuardResult {
  if (bill.status === 'PAID' || bill.status === 'FINALIZED' || bill.status === 'PART_PAID') return result(true, []);
  return result(false, ['Return can be created only against paid, part-paid, or finalized bill.']);
}

export function requiresOwnerApproval(action: string, bill?: Bill): boolean {
  return action.includes('override') || action.includes('backdate') || action.includes('negative') || bill?.status === 'PRINTED' || bill?.paymentStatus === 'PAID';
}

export function getBillingGuardViolations(bill: Bill, settings: BusinessSettings): GuardResult {
  const reasons: string[] = [];
  if (bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID') reasons.push('Printed but unpaid bill pending.');
  if (bill.lockedByBillingGuard) reasons.push('Billing Guard Active.');
  if (bill.discountTotal / Math.max(bill.subtotal, 1) * 100 > settings.maxDiscountPercentWithoutApproval) {
    reasons.push('Owner approval required for this action.');
  }
  return result(reasons.length === 0, reasons, reasons.some((reason) => reason.includes('Owner approval')));
}

export function createBillingAuditEvent(bill: Bill, action: string, reason: string) {
  return {
    module: 'BILLING_GUARD' as const,
    action,
    entityType: 'Bill',
    entityId: bill.id,
    reason,
  };
}

export function lockBillAfterPrint(bill: Bill): Bill {
  return { ...bill, status: bill.status === 'DRAFT' ? 'PRINTED' : bill.status, lockedByBillingGuard: true, printedAt: bill.printedAt || new Date().toISOString() };
}

export function lockBillAfterPayment(bill: Bill): Bill {
  return { ...bill, paymentStatus: 'PAID', paidAmount: bill.grandTotal, dueAmount: 0, status: 'PAID', lockedByBillingGuard: true };
}

export function generateNextBillNumber(prefix: string, branchCode: string, sequence: number) {
  return `${prefix}-${branchCode}-${String(sequence).padStart(4, '0')}`;
}

export function validateSequentialBillNumber(existingNumbers: string[], nextNumber: string): GuardResult {
  if (existingNumbers.includes(nextNumber)) return result(false, ['Bill number cannot be reused.']);
  return result(true, ['Bill number sequence protected.']);
}
