import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getVendors() {
  return demoDb.vendors;
}

export function getVendorOutstanding() {
  return demoDb.vendors.reduce((sum, vendor) => sum + vendor.dueAmount, 0);
}

export function getPurchaseBills() {
  return demoDb.purchaseBills;
}

export function getPurchaseOrders() {
  return demoDb.purchaseOrders;
}
