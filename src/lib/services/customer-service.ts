import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getCustomers() {
  return demoDb.customers;
}

export function searchCustomers(query: string) {
  const value = query.toLowerCase();
  return demoDb.customers.filter((customer) =>
    [customer.name, customer.phone, customer.vehicleNumber, customer.vehicleModel].some((field) => field.toLowerCase().includes(value))
  );
}

export function getCustomersWithCreditDue() {
  return demoDb.customers.filter((customer) => customer.outstandingBalance > 0);
}
