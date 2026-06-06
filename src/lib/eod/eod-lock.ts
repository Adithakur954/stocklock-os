import { Bill } from '@/lib/types/billing';
import { GuardResult } from '@/lib/types/core';
import { EodSession } from '@/lib/types/eod';
import { StockTransfer } from '@/lib/types/inventory';
import { BusinessSettings } from '@/lib/types/settings';

function result(allowed: boolean, reasons: string[], requiresApproval = false): GuardResult {
  return {
    allowed,
    requiresApproval,
    reasons,
    severity: !allowed ? 'BLOCKER' : requiresApproval ? 'CRITICAL' : reasons.length ? 'WARNING' : 'INFO',
  };
}

export function calculateExpectedCash(openingCash: number, cashSales: number, returnsCash: number, expenses: number) {
  return openingCash + cashSales - returnsCash - expenses;
}

export function calculatePaymentSummary(bills: Bill[]) {
  return bills.reduce(
    (summary, bill) => {
      summary.totalSales += bill.grandTotal;
      summary.credit += bill.paymentStatus === 'UNPAID' || bill.paymentStatus === 'PART_PAID' ? bill.dueAmount : 0;
      return summary;
    },
    { totalSales: 0, cash: 0, upi: 0, card: 0, credit: 0 }
  );
}

export function calculateCashVariance(expectedCash: number, countedCash: number) {
  return countedCash - expectedCash;
}

export function detectPendingPrintedBills(bills: Bill[]) {
  return bills.filter((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID');
}

export function detectOldDraftBills(bills: Bill[], draftExpiryMinutes: number, now = new Date()) {
  return bills.filter((bill) => {
    if (bill.status !== 'DRAFT') return false;
    const ageMs = now.getTime() - new Date(bill.createdAt).getTime();
    return ageMs > draftExpiryMinutes * 60 * 1000;
  });
}

export function detectPendingTransfers(transfers: StockTransfer[]) {
  return transfers.filter((transfer) => transfer.status === 'DISPATCHED' || transfer.status === 'READY');
}

export function detectUnapprovedStockAdjustments(stockAdjustments: number) {
  return stockAdjustments > 0;
}

export function getEodBlockingReasons(session: EodSession, bills: Bill[], transfers: StockTransfer[], settings: BusinessSettings) {
  const reasons: string[] = [];
  if (detectPendingPrintedBills(bills).length > 0) reasons.push('Day cannot close because printed unpaid bills exist.');
  if (detectOldDraftBills(bills, settings.draftBillExpiryMinutes).length > 0) reasons.push('Old draft bills must be finalized, cancelled, or approved.');
  if (settings.transferReceiveRequiredBeforeEod && detectPendingTransfers(transfers).length > 0) reasons.push('Transfer dispatched but not received exists.');
  if (Math.abs(session.cashVariance) > settings.eodCashVarianceThreshold) reasons.push('Cash variance above threshold. Owner approval required.');
  if (detectUnapprovedStockAdjustments(session.stockAdjustments)) reasons.push('Unapproved stock adjustment exists.');
  return reasons;
}

export function canCloseDay(session: EodSession, bills: Bill[], transfers: StockTransfer[], settings: BusinessSettings): GuardResult {
  const reasons = getEodBlockingReasons(session, bills, transfers, settings);
  return result(reasons.length === 0, reasons, reasons.some((reason) => reason.includes('approval')));
}

export function requiresOwnerApprovalForEod(session: EodSession, settings: BusinessSettings) {
  return Math.abs(session.cashVariance) > settings.eodCashVarianceThreshold || session.status === 'REOPENED_WITH_APPROVAL';
}

export function closeBusinessDate(session: EodSession, userId: string): EodSession {
  return { ...session, status: 'CLOSED', closedByUserId: userId, closedAt: new Date().toISOString() };
}

export function lockBusinessDate(session: EodSession): EodSession {
  return { ...session, status: 'CLOSED' };
}

export function canCreateBackdatedTransaction(session: EodSession, hasOwnerApproval: boolean): GuardResult {
  if (session.status !== 'CLOSED') return result(true, []);
  if (hasOwnerApproval) return result(true, ['Correction will be posted to next open day.']);
  return result(false, ['Backdated transaction blocked by EOD Lock.', 'This business date is locked.'], true);
}

export function createEodAuditEvent(session: EodSession, action: string, reason: string) {
  return {
    module: 'EOD_LOCK' as const,
    action,
    entityType: 'EodSession',
    entityId: session.id,
    reason,
  };
}
