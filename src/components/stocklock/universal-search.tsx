'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { demoDb, getBranchName, getProductName } from '@/lib/mock-data/stocklock-demo-data';
import { StatusBadge } from '@/components/stocklock/ui';

type SearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  href: string;
  tokens: string[];
  risk?: 'BLOCKER' | 'WARNING' | 'OK';
};

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function buildSearchIndex(): SearchResult[] {
  const products: SearchResult[] = demoDb.products.map((product) => ({
    id: product.id,
    type: 'Product',
    title: product.name,
    subtitle: `${product.productCode} | ${product.sku} | HSN ${product.hsnCode} | Rack ${product.rackLocation}`,
    href: '/products',
    risk: product.photoProofRequired ? 'WARNING' : 'OK',
    tokens: [
      product.name,
      product.productCode,
      product.hsnCode,
      product.sku,
      product.barcode,
      product.internalCode,
      product.oemPartNumber,
      product.supplierCode,
      product.rackLocation,
      product.category,
      product.brand,
      product.fitmentNotes,
      ...product.compatibleVehicles,
      ...product.keywords,
    ],
  }));

  const customers: SearchResult[] = demoDb.customers.map((customer) => ({
    id: customer.id,
    type: 'Customer',
    title: customer.name,
    subtitle: `${customer.phone} | ${customer.vehicleNumber || 'No vehicle'} | ${customer.vehicleModel || 'No model'}`,
    href: '/customers',
    risk: customer.outstandingBalance > 0 ? 'WARNING' : 'OK',
    tokens: [customer.name, customer.phone, customer.vehicleNumber || '', customer.vehicleModel || '', ...customer.tags],
  }));

  const bills: SearchResult[] = demoDb.bills.map((bill) => ({
    id: bill.id,
    type: 'Bill',
    title: bill.billNumber,
    subtitle: `${getBranchName(bill.branchId)} | ${bill.status} | Due Rs ${bill.dueAmount.toLocaleString()}`,
    href: '/bills',
    risk: bill.dueAmount > 0 || bill.status === 'PRINTED' ? 'BLOCKER' : 'OK',
    tokens: [bill.billNumber, bill.status, bill.paymentStatus, bill.billType, bill.customerId || '', getBranchName(bill.branchId)],
  }));

  const transfers: SearchResult[] = demoDb.stockTransfers.map((transfer) => ({
    id: transfer.id,
    type: 'Transfer',
    title: transfer.id,
    subtitle: `${getBranchName(transfer.sourceBranchId)} -> ${getBranchName(transfer.destinationBranchId)} | ${transfer.status}`,
    href: '/transfers',
    risk: transfer.status === 'DISPATCHED' ? 'BLOCKER' : transfer.status === 'READY' ? 'WARNING' : 'OK',
    tokens: [transfer.id, transfer.status, getBranchName(transfer.sourceBranchId), getBranchName(transfer.destinationBranchId), transfer.dispatchNote || '', transfer.receiveNote || ''],
  }));

  const requests: SearchResult[] = demoDb.stockRequests.map((request) => ({
    id: request.id,
    type: 'Stock Request',
    title: request.id,
    subtitle: `${getProductName(request.productId)} | ${getBranchName(request.requestingBranchId)} | ${request.urgency}`,
    href: '/stock-requests',
    risk: request.urgency === 'CUSTOMER_WAITING' ? 'BLOCKER' : 'WARNING',
    tokens: [request.id, request.status, request.urgency, request.note, getProductName(request.productId), getBranchName(request.requestingBranchId)],
  }));

  const jobs: SearchResult[] = demoDb.serviceJobs.map((job) => ({
    id: job.id,
    type: 'Job Card',
    title: job.id,
    subtitle: `${job.vehicleNumber} | ${job.vehicleModel} | ${job.status} | Issued ${job.partsIssuedCount}, billed ${job.partsBilledCount}`,
    href: '/service-jobs',
    risk: job.partsIssuedCount > job.partsBilledCount ? 'BLOCKER' : job.qualityCheckStatus === 'PENDING' ? 'WARNING' : 'OK',
    tokens: [
      job.id,
      job.vehicleNumber,
      job.vehicleModel,
      job.status,
      job.priority,
      job.issueDescription,
      job.workDescription,
      job.linkedBillId || '',
      job.qualityCheckStatus,
    ],
  }));

  return [...products, ...customers, ...bills, ...transfers, ...requests, ...jobs];
}

export function UniversalSearch() {
  const [query, setQuery] = useState('');
  const searchIndex = useMemo(() => buildSearchIndex(), []);
  const normalizedQuery = normalize(query);
  const results = useMemo(() => {
    if (!normalizedQuery) return searchIndex.slice(0, 6);

    return searchIndex
      .map((item) => {
        const haystack = normalize([item.title, item.subtitle, ...item.tokens].join(' '));
        const startsWith = haystack.startsWith(normalizedQuery) ? 2 : 0;
        const includes = haystack.includes(normalizedQuery) ? 1 : 0;
        return { item, score: startsWith + includes };
      })
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((result) => result.item);
  }, [normalizedQuery, searchIndex]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Universal search</p>
          <h2 className="mt-1 text-xl font-bold text-gray-950">Find product, bill, customer, transfer, request, or job card</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search product name, SKU, product code, HSN, barcode, internal code, supplier code, rack, phone, vehicle, bill, transfer, request, or job card.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          <ShieldAlert size={16} />
          Billing leakage proof enabled
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <Search className="text-blue-600" size={22} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-base font-medium text-gray-950 outline-none placeholder:text-gray-400"
          placeholder="Try ST-AND-09, KCA-0001, 8518, rack A-1-1, DL8C AX 9090, KCA-CITY-0001, tr_2, job_1..."
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {results.map((result) => (
          <Link key={`${result.type}-${result.id}`} href={result.href} className="rounded-lg border border-gray-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">{result.type}</p>
                <p className="mt-1 font-semibold text-gray-950">{result.title}</p>
                <p className="mt-1 text-sm text-gray-500">{result.subtitle}</p>
              </div>
              <StatusBadge tone={result.risk === 'BLOCKER' ? 'red' : result.risk === 'WARNING' ? 'amber' : 'green'}>{result.risk || 'OK'}</StatusBadge>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
