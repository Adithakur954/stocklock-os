import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { Bill, Payment, PaymentMode } from '@/lib/types/billing';
import { generateNextBillNumber } from '@/lib/guards/billing-guard';

export function getBills() {
  return demoDb.bills;
}

export function getBillDetail(billId: string) {
  return {
    bill: demoDb.bills.find((bill) => bill.id === billId),
    items: demoDb.billItems.filter((item) => item.billId === billId),
    payments: demoDb.payments.filter((payment) => payment.billId === billId),
  };
}

export function getPrintedUnpaidBills() {
  return demoDb.bills.filter((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID');
}

export function getOldDraftBills(now = new Date(), maxAgeMinutes = demoDb.settings.draftBillExpiryMinutes) {
  return demoDb.bills.filter((bill) => bill.status === 'DRAFT' && now.getTime() - new Date(bill.createdAt).getTime() > maxAgeMinutes * 60 * 1000);
}

export function calculateBillTotals(items: Array<{ quantity: number; unitPrice: number; discount: number; taxRate: number }>) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const discountTotal = items.reduce((sum, item) => sum + item.discount, 0);
  const taxable = subtotal - discountTotal;
  const taxTotal = items.reduce((sum, item) => sum + ((item.quantity * item.unitPrice - item.discount) * item.taxRate) / 100, 0);
  return { subtotal, discountTotal, taxTotal, grandTotal: taxable + taxTotal };
}

export function createDraftBill(branchCode: string, createdByUserId: string): Bill {
  const billNumber = generateNextBillNumber(demoDb.settings.billPrefix, branchCode, demoDb.settings.nextBillSequence);
  return {
    id: `bill_${Date.now()}`,
    organizationId: demoDb.organization.id,
    branchId: 'br_main',
    billNumber,
    businessDate: new Date().toISOString().slice(0, 10),
    billType: 'SALE',
    status: 'DRAFT',
    subtotal: 0,
    discountTotal: 0,
    taxTotal: 0,
    grandTotal: 0,
    paidAmount: 0,
    dueAmount: 0,
    paymentStatus: 'UNPAID',
    createdByUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lockedByBillingGuard: false,
  };
}

export function applyPayment(bill: Bill, amount: number, mode: PaymentMode, receivedByUserId: string): { bill: Bill; payment: Payment } {
  const paidAmount = bill.paidAmount + amount;
  const dueAmount = Math.max(0, bill.grandTotal - paidAmount);
  return {
    bill: {
      ...bill,
      paidAmount,
      dueAmount,
      paymentStatus: dueAmount === 0 ? 'PAID' : 'PART_PAID',
      status: dueAmount === 0 ? 'PAID' : 'PART_PAID',
      lockedByBillingGuard: dueAmount === 0 ? true : bill.lockedByBillingGuard,
    },
    payment: {
      id: `pay_${Date.now()}`,
      billId: bill.id,
      mode,
      amount,
      receivedByUserId,
      receivedAt: new Date().toISOString(),
      status: 'RECORDED',
    },
  };
}
