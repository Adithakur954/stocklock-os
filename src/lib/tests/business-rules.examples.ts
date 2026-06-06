import { canCloseDay, getEodBlockingReasons } from '@/lib/eod/eod-lock';
import { canFinalizeBill, canPrintBill, getBillingGuardViolations } from '@/lib/guards/billing-guard';
import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { canReduceStock, preventNegativeStock } from '@/lib/services/inventory-service';

export function runBusinessRuleExamples() {
  const printedUnpaidBill = demoDb.bills.find((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID') || demoDb.bills[0];
  const eodSession = demoDb.eodSessions[0];
  const stockBalance = demoDb.inventoryBalances[0];

  const billingGuard = getBillingGuardViolations(printedUnpaidBill, demoDb.settings);
  const eodBlockingReasons = getEodBlockingReasons(
    eodSession,
    demoDb.bills.filter((bill) => bill.branchId === eodSession.branchId),
    demoDb.stockTransfers,
    demoDb.settings
  );

  return {
    billingGuardBlocksPrintedUnpaidEdits: !billingGuard.allowed,
    printedBillCannotBePrintedAgainWithoutClearState: !canPrintBill(printedUnpaidBill).allowed,
    printedUnpaidBillCannotFinalize: !canFinalizeBill(printedUnpaidBill).allowed,
    eodBlockingReasonCount: eodBlockingReasons.length,
    eodCloseBlockedWhenReasonsExist: !canCloseDay(
      eodSession,
      demoDb.bills.filter((bill) => bill.branchId === eodSession.branchId),
      demoDb.stockTransfers,
      demoDb.settings
    ).allowed,
    stockCannotGoNegative: !canReduceStock(
      stockBalance.branchId,
      stockBalance.productId,
      stockBalance.quantityAvailable + 1,
      demoDb.settings.allowNegativeStock
    ).allowed,
    negativeStockGuardReturnsViolation: !preventNegativeStock(
      stockBalance.branchId,
      stockBalance.productId,
      stockBalance.quantityAvailable + 1
    ).allowed,
  };
}

export const businessRuleExamples = runBusinessRuleExamples();
