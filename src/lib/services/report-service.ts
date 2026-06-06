import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { detectDeadStock, detectLowStock } from '@/lib/services/inventory-service';

export function salesReport() {
  const totalSales = demoDb.bills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const credit = demoDb.bills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  const paid = demoDb.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return { totalSales, paid, credit, billCount: demoDb.bills.length };
}

export function inventoryReport() {
  const stockValue = demoDb.inventoryBalances.reduce((sum, balance) => {
    const product = demoDb.products.find((item) => item.id === balance.productId);
    return sum + balance.quantityOnHand * (product?.purchaseCost || 0);
  }, 0);
  return { stockValue, lowStockCount: detectLowStock().length, deadStockCount: detectDeadStock().length };
}

export function billingGuardReport() {
  return {
    printedUnpaid: demoDb.bills.filter((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID').length,
    oldDrafts: demoDb.bills.filter((bill) => bill.status === 'DRAFT').length,
    approvals: demoDb.approvals.filter((approval) => approval.module === 'BILLING_GUARD').length,
  };
}

export function eodReport() {
  return {
    blocked: demoDb.eodSessions.filter((session) => session.status === 'BLOCKED').length,
    ready: demoDb.eodSessions.filter((session) => session.status === 'READY_TO_CLOSE').length,
    variance: demoDb.eodSessions.reduce((sum, session) => sum + Math.abs(session.cashVariance), 0),
  };
}

export function exportRowsToCsv(rows: Array<Record<string, string | number | boolean | undefined>>) {
  const headers = Object.keys(rows[0] || {});
  const body = rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','));
  return [headers.join(','), ...body].join('\n');
}
