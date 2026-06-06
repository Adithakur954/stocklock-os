import Link from 'next/link';
import type { ReactElement } from 'react';
import { Download, Plus } from 'lucide-react';
import {
  AlertCard,
  ApprovalCard,
  AuditTimeline,
  BentoCard,
  BillPreview,
  BillStatusBadge,
  BillingGuardBadge,
  CustomerCreditBadge,
  DataTable,
  EmptyState,
  EodBlockingReasons,
  EodStatusBadge,
  PageHeader,
  PaymentStatusBadge,
  SearchInput,
  StaffStatusBadge,
  StatCard,
  StatusBadge,
  StockBadge,
  TransferStatusBadge,
  WarrantyStatusBadge,
} from '@/components/stocklock/ui';
import { getEodBlockingReasons } from '@/lib/eod/eod-lock';
import { getBillingGuardViolations } from '@/lib/guards/billing-guard';
import { demoDb, getBranchName, getProductName, getUserName } from '@/lib/mock-data/stocklock-demo-data';
import { detectDeadStock, detectLowStock } from '@/lib/services/inventory-service';
import { billingGuardReport, eodReport, exportRowsToCsv, inventoryReport, salesReport } from '@/lib/services/report-service';
import { getTransferTimeline } from '@/lib/services/transfer-service';

export type ModuleKey =
  | 'branches'
  | 'inventory'
  | 'inventory-ledger'
  | 'inventory-low-stock'
  | 'inventory-dead-stock'
  | 'products'
  | 'stock-requests'
  | 'transfers'
  | 'billing'
  | 'bills'
  | 'payments'
  | 'returns'
  | 'purchases'
  | 'vendors'
  | 'customers'
  | 'staff'
  | 'service-jobs'
  | 'warranty'
  | 'eod'
  | 'approvals'
  | 'alerts'
  | 'audit'
  | 'reports'
  | 'reports-sales'
  | 'reports-inventory'
  | 'reports-billing-guard'
  | 'reports-eod'
  | 'reports-transfers'
  | 'reports-staff'
  | 'settings';

const actionButton = (label: string, href = '#') => (
  <Link href={href} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
    <Plus size={16} />
    {label}
  </Link>
);

const exportButton = (label = 'Export CSV') => (
  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
    <Download size={16} />
    {label}
  </button>
);

function branchStockRows() {
  return demoDb.inventoryBalances.slice(0, 18).map((balance) => [
    getBranchName(balance.branchId),
    getProductName(balance.productId),
    <StockBadge key="q" qty={balance.quantityAvailable} />,
    balance.quantityReserved,
    new Date(balance.lastUpdatedAt).toLocaleString(),
  ]);
}

function productRows() {
  return demoDb.products.map((product) => {
    const category = demoDb.categories.find((item) => item.id === product.categoryId)?.name;
    const brand = demoDb.brands.find((item) => item.id === product.brandId)?.name;
    const stock = demoDb.inventoryBalances.filter((balance) => balance.productId === product.id).reduce((sum, balance) => sum + balance.quantityAvailable, 0);
    return [
      <div key="p"><p className="font-semibold text-gray-950">{product.name}</p><p className="text-xs text-gray-500">{product.sku} - {product.barcode}</p></div>,
      category,
      brand,
      product.compatibleVehicles.join(', '),
      `Rs ${product.sellingPrice.toLocaleString()}`,
      <StockBadge key="s" qty={stock} />,
      <StatusBadge key="w" tone={product.hasWarranty ? 'blue' : 'gray'}>{product.hasWarranty ? `${product.warrantyMonths} mo warranty` : 'No warranty'}</StatusBadge>,
    ];
  });
}

const pages: Record<ModuleKey, () => ReactElement> = {
  branches: () => (
    <>
      <PageHeader title="Branches" description="Manage multi-branch operations, branch managers, city locations, stock value, and EOD health." action={actionButton('Add branch')} />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Active Branches" value={demoDb.branches.length} sub="Main, city, workshop, airport" />
        <StatCard title="Main Branch" value={demoDb.branches.find((branch) => branch.isMainBranch)?.name} sub="Hub inventory branch" tone="blue" />
        <StatCard title="Managers" value={demoDb.branches.filter((branch) => branch.managerUserId).length} sub="Assigned users" tone="green" />
        <StatCard title="Cities" value={new Set(demoDb.branches.map((branch) => branch.city)).size} sub="NCR coverage" tone="purple" />
      </div>
      <DataTable headers={['Branch', 'Code', 'City', 'Phone', 'Manager', 'Status']} rows={demoDb.branches.map((branch) => [branch.name, branch.code, branch.city, branch.phone, getUserName(branch.managerUserId), <StatusBadge key="s" tone="green">{branch.status}</StatusBadge>])} />
    </>
  ),
  inventory: () => (
    <>
      <PageHeader title="Inventory" description="Branch-wise stock balances with no silent edits. Every stock movement must create ledger history." action={actionButton('Manual adjustment')} />
      <div className="grid gap-4 md:grid-cols-3"><StatCard title="Stock Value" value={`Rs ${inventoryReport().stockValue.toLocaleString()}`} /><StatCard title="Low Stock" value={detectLowStock().length} tone="amber" /><StatCard title="Dead Stock" value={detectDeadStock().length} tone="red" /></div>
      <SearchInput placeholder="Search branch stock by SKU, barcode, product or branch..." />
      <DataTable headers={['Branch', 'Product', 'Available', 'Reserved', 'Updated']} rows={branchStockRows()} />
    </>
  ),
  'inventory-ledger': () => (
    <>
      <PageHeader title="Stock Ledger" description="Typed movement ledger with before and after quantity. Silent stock edits are not allowed." action={exportButton()} />
      <DataTable headers={['When', 'Branch', 'Product', 'Movement', 'Before', 'After', 'Reason']} rows={demoDb.stockLedger.map((ledger) => [new Date(ledger.createdAt).toLocaleString(), getBranchName(ledger.branchId), getProductName(ledger.productId), <StatusBadge key="m" tone={ledger.quantityChange < 0 ? 'red' : 'green'}>{ledger.movementType}</StatusBadge>, ledger.quantityBefore, ledger.quantityAfter, ledger.reason])} />
    </>
  ),
  'inventory-low-stock': () => (
    <>
      <PageHeader title="Low Stock" description="Products at or below reorder level by branch." action={actionButton('Create purchase order')} />
      <DataTable headers={['Branch', 'Product', 'Available', 'Reorder Level']} rows={detectLowStock().map((balance) => {
        const product = demoDb.products.find((item) => item.id === balance.productId);
        return [getBranchName(balance.branchId), getProductName(balance.productId), <StockBadge key="q" qty={balance.quantityAvailable} />, product?.reorderLevel || 0];
      })} />
    </>
  ),
  'inventory-dead-stock': () => (
    <>
      <PageHeader title="Dead Stock" description="Slow-moving products with blocked capital." action={exportButton()} />
      <DataTable headers={['Product', 'Last Sold', 'Stock Value', 'Action']} rows={detectDeadStock().map((product) => {
        const qty = demoDb.inventoryBalances.filter((balance) => balance.productId === product.id).reduce((sum, balance) => sum + balance.quantityOnHand, 0);
        return [product.name, product.lastSoldAt ? new Date(product.lastSoldAt).toLocaleDateString() : 'Never', `Rs ${(qty * product.purchaseCost).toLocaleString()}`, <StatusBadge key="a" tone="amber">Discount / transfer review</StatusBadge>];
      })} />
    </>
  ),
  products: () => (
    <>
      <PageHeader title="Products" description="Product master with SKU, barcode, category, brand, image, vehicle compatibility, warranty, and branch stock." action={actionButton('Add product')} />
      <SearchInput placeholder="Search products by name, SKU, barcode, vehicle or brand..." />
      <DataTable headers={['Product', 'Category', 'Brand', 'Vehicles', 'Sell Price', 'Stock', 'Warranty']} rows={productRows()} />
    </>
  ),
  'stock-requests': () => (
    <>
      <PageHeader title="Stock Requests" description="Inter-branch demand board replacing WhatsApp stock requests." action={actionButton('Create request')} />
      <DataTable headers={['Requesting Branch', 'Product', 'Qty', 'Urgency', 'Status', 'Responses']} rows={demoDb.stockRequests.map((request) => [getBranchName(request.requestingBranchId), getProductName(request.productId), request.requestedQty, <StatusBadge key="u" tone={request.urgency === 'CUSTOMER_WAITING' ? 'red' : 'amber'}>{request.urgency}</StatusBadge>, request.status, demoDb.stockRequestResponses.filter((response) => response.requestId === request.id).length])} />
    </>
  ),
  transfers: () => (
    <>
      <PageHeader title="Transfers" description="Dispatch and receive workflow with source/destination stock impact and EOD blocking visibility." action={actionButton('Create transfer')} />
      <DataTable headers={['Transfer', 'From', 'To', 'Status', 'Timeline']} rows={demoDb.stockTransfers.map((transfer) => [transfer.id, getBranchName(transfer.sourceBranchId), getBranchName(transfer.destinationBranchId), <TransferStatusBadge key="s" status={transfer.status} />, getTransferTimeline(transfer.id).join(' -> ')])} />
    </>
  ),
  billing: () => {
    const bill = demoDb.bills[0];
    const guard = getBillingGuardViolations(bill, demoDb.settings);
    return (
      <>
        <PageHeader title="POS Billing" description="Customer search, product search, cart, payment, print, finalize, and Billing Guard enforcement." action={actionButton('New bill')} />
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <BentoCard title="Billing Workspace" description="SKU/barcode search and cart controls for counter staff.">
            <SearchInput placeholder="Scan barcode or search product..." />
            <DataTable headers={['Item', 'Qty', 'Rate', 'Tax', 'Total']} rows={demoDb.billItems.map((item) => [item.description, item.quantity, `Rs ${item.unitPrice}`, `${item.taxRate}%`, `Rs ${item.lineTotal.toLocaleString()}`])} />
          </BentoCard>
          <BentoCard title="Billing Guard" description="Hard-lock status for the selected bill.">
            <BillingGuardBadge result={guard} />
            <div className="mt-4 space-y-2">{guard.reasons.map((reason) => <p key={reason} className="rounded-md bg-red-50 p-3 text-sm text-red-700">{reason}</p>)}</div>
            <div className="mt-4"><BillPreview bill={bill} /></div>
          </BentoCard>
        </div>
      </>
    );
  },
  bills: () => (
    <>
      <PageHeader title="Bills" description="Draft, printed, finalized, paid, unpaid and cancelled bills with lock badges." action={exportButton()} />
      <DataTable headers={['Bill', 'Branch', 'Customer', 'Status', 'Payment', 'Total', 'Due']} rows={demoDb.bills.map((bill) => [bill.billNumber, getBranchName(bill.branchId), demoDb.customers.find((customer) => customer.id === bill.customerId)?.name || '-', <BillStatusBadge key="bs" status={bill.status} />, <PaymentStatusBadge key="ps" status={bill.paymentStatus} />, `Rs ${bill.grandTotal.toLocaleString()}`, `Rs ${bill.dueAmount.toLocaleString()}`])} />
    </>
  ),
  payments: () => (
    <>
      <PageHeader title="Payments" description="Cash, UPI, card, bank transfer, mixed payment, and customer credit tracking." action={actionButton('Record payment')} />
      <DataTable headers={['Bill', 'Mode', 'Amount', 'Received By', 'At', 'Status']} rows={demoDb.payments.map((payment) => [payment.billId, payment.mode, `Rs ${payment.amount.toLocaleString()}`, getUserName(payment.receivedByUserId), new Date(payment.receivedAt).toLocaleString(), payment.status])} />
    </>
  ),
  returns: () => (
    <>
      <PageHeader title="Returns / Credit Notes" description="Return approval, refund tracking, restock rules, and future-credit workflow." action={actionButton('Create return')} />
      <DataTable headers={['Return', 'Original Bill', 'Reason', 'Refund', 'Status']} rows={demoDb.returns.map((ret) => [ret.id, ret.originalBillId, ret.reason, ret.refundMode, <StatusBadge key="s" tone="amber">{ret.status}</StatusBadge>])} />
      <DataTable headers={['Credit Note', 'Amount', 'Status', 'Reason']} rows={demoDb.creditNotes.map((note) => [note.creditNoteNumber, `Rs ${note.amount.toLocaleString()}`, note.status, note.reason])} />
    </>
  ),
  purchases: () => (
    <>
      <PageHeader title="Purchases" description="Purchase orders, purchase bills, receiving stock, vendor due, and purchase inward ledger." action={actionButton('Receive purchase')} />
      <DataTable headers={['Invoice / PO', 'Vendor', 'Branch', 'Status', 'Due']} rows={[...demoDb.purchaseBills.map((bill) => [bill.invoiceNumber, demoDb.vendors.find((vendor) => vendor.id === bill.vendorId)?.name, getBranchName(bill.branchId), bill.status, `Rs ${bill.dueAmount.toLocaleString()}`]), ...demoDb.purchaseOrders.map((po) => [po.poNumber, demoDb.vendors.find((vendor) => vendor.id === po.vendorId)?.name, getBranchName(po.branchId), po.status, 'PO'])]} />
    </>
  ),
  vendors: () => (
    <>
      <PageHeader title="Vendors" description="Vendor ledger, outstanding amounts, GST details, terms, and payment actions." action={actionButton('Add vendor')} />
      <DataTable headers={['Vendor', 'Contact', 'GST', 'Terms', 'Due', 'Status']} rows={demoDb.vendors.map((vendor) => [vendor.name, vendor.contactPerson, vendor.gstNumber, vendor.paymentTerms, `Rs ${vendor.dueAmount.toLocaleString()}`, <StatusBadge key="s" tone="green">{vendor.status}</StatusBadge>])} />
    </>
  ),
  customers: () => (
    <>
      <PageHeader title="Customers" description="CRM with phone/vehicle search, spend, credit due, warranty and service history." action={actionButton('Add customer')} />
      <SearchInput placeholder="Search by phone, vehicle number or name..." />
      <DataTable headers={['Customer', 'Phone', 'Vehicle', 'Spend', 'Credit', 'Tags']} rows={demoDb.customers.map((customer) => [customer.name, customer.phone, `${customer.vehicleNumber} - ${customer.vehicleModel}`, `Rs ${customer.totalSpend.toLocaleString()}`, <CustomerCreditBadge key="c" amount={customer.outstandingBalance} />, customer.tags.join(', ') || '-'])} />
    </>
  ),
  staff: () => (
    <>
      <PageHeader title="Staff" description="Skill-wise staff availability, branch workload, and fitter/helper transfer requests." action={actionButton('Request staff')} />
      <DataTable headers={['Staff', 'Branch', 'Skill', 'Status', 'Task']} rows={demoDb.staffStatuses.map((staff) => [getUserName(staff.userId), getBranchName(staff.branchId), staff.skill, <StaffStatusBadge key="s" status={staff.status} />, staff.currentTask || '-'])} />
      <DataTable headers={['Request', 'Branch', 'Skill', 'Urgency', 'Status']} rows={demoDb.staffRequests.map((request) => [request.id, getBranchName(request.requestingBranchId), request.requestedSkill, request.urgency, request.status])} />
    </>
  ),
  'service-jobs': () => (
    <>
      <PageHeader title="Service Jobs" description="Installation job cards, fitter assignment, product usage, billing conversion, and customer vehicle history." action={actionButton('Create job card')} />
      <DataTable headers={['Job', 'Branch', 'Customer', 'Vehicle', 'Status', 'Amount']} rows={demoDb.serviceJobs.map((job) => [job.id, getBranchName(job.branchId), demoDb.customers.find((customer) => customer.id === job.customerId)?.name, `${job.vehicleNumber} - ${job.vehicleModel}`, <StatusBadge key="s" tone={job.status === 'WAITING_PART' ? 'amber' : 'blue'}>{job.status}</StatusBadge>, `Rs ${(job.finalAmount || job.estimatedAmount).toLocaleString()}`])} />
    </>
  ),
  warranty: () => (
    <>
      <PageHeader title="Warranty" description="Serial number tracking, warranty expiry, customer history, and warranty claim workflow." action={actionButton('Create claim')} />
      <DataTable headers={['Serial', 'Product', 'Branch', 'Status', 'Warranty']} rows={demoDb.serialNumbers.map((serial) => [serial.serialNumber, getProductName(serial.productId), getBranchName(serial.branchId), <WarrantyStatusBadge key="s" status={serial.status} />, serial.warrantyEndDate || '-'])} />
      <DataTable headers={['Claim', 'Customer', 'Issue', 'Status']} rows={demoDb.warrantyClaims.map((claim) => [claim.id, demoDb.customers.find((customer) => customer.id === claim.customerId)?.name, claim.issue, <WarrantyStatusBadge key="s" status={claim.status} />])} />
    </>
  ),
  eod: () => {
    const session = demoDb.eodSessions[0];
    const reasons = getEodBlockingReasons(session, demoDb.bills.filter((bill) => bill.branchId === session.branchId), demoDb.stockTransfers, demoDb.settings);
    return (
      <>
        <PageHeader title="EOD Closing" description="Cash drawer, payment summary, transfer checks, printed unpaid checks, stock adjustment checks, and close-day lock." action={actionButton('Request owner approval')} />
        <div className="grid gap-4 md:grid-cols-4"><StatCard title="Expected Cash" value={`Rs ${session.expectedCash.toLocaleString()}`} /><StatCard title="Counted Cash" value={`Rs ${session.countedCash.toLocaleString()}`} /><StatCard title="Variance" value={`Rs ${session.cashVariance.toLocaleString()}`} tone="red" /><StatCard title="Status" value={<EodStatusBadge status={session.status} />} /></div>
        <BentoCard title="Blocking Reasons" description="EOD Lock Active"><EodBlockingReasons reasons={reasons} /></BentoCard>
      </>
    );
  },
  approvals: () => (
    <>
      <PageHeader title="Approvals" description="Owner approval center for high discounts, negative stock, backdated bills, EOD variance, and manual adjustment." />
      <div className="grid gap-4 md:grid-cols-2">{demoDb.approvals.map((approval) => <ApprovalCard key={approval.id} approval={approval} />)}</div>
    </>
  ),
  alerts: () => (
    <>
      <PageHeader title="Alerts" description="Low stock, Billing Guard, EOD Lock, transfer, warranty, vendor, and customer credit alerts." />
      <div className="grid gap-4 md:grid-cols-2">{demoDb.alerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div>
    </>
  ),
  audit: () => (
    <>
      <PageHeader title="Audit Log" description="Searchable typed audit trail for inventory, billing, EOD, staff, approvals, settings, and alerts." action={exportButton()} />
      <AuditTimeline logs={demoDb.auditLogs} />
    </>
  ),
  reports: () => (
    <>
      <PageHeader title="Reports" description="Owner reports for sales, inventory, Billing Guard, EOD, transfers, staff, customer credit, vendors and warranty." action={exportButton()} />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['/reports/sales', 'Sales Report'],
          ['/reports/inventory', 'Inventory Report'],
          ['/reports/billing-guard', 'Billing Guard Report'],
          ['/reports/eod', 'EOD Report'],
          ['/reports/transfers', 'Transfer Report'],
          ['/reports/staff', 'Staff Report'],
        ].map(([href, title]) => <Link key={href} href={href} className="rounded-lg border bg-white p-4 font-semibold text-gray-900 hover:border-blue-300">{title}</Link>)}
      </div>
    </>
  ),
  'reports-sales': () => {
    const report = salesReport();
    return <><PageHeader title="Sales Report" description="Branch sales, payment split, credit, top products and discounts." action={exportButton()} /><div className="grid gap-4 md:grid-cols-4"><StatCard title="Sales" value={`Rs ${report.totalSales.toLocaleString()}`} /><StatCard title="Collected" value={`Rs ${report.paid.toLocaleString()}`} /><StatCard title="Credit" value={`Rs ${report.credit.toLocaleString()}`} /><StatCard title="Bills" value={report.billCount} /></div><DataTable headers={['Bill', 'Branch', 'Total', 'Due']} rows={demoDb.bills.map((bill) => [bill.billNumber, getBranchName(bill.branchId), `Rs ${bill.grandTotal.toLocaleString()}`, `Rs ${bill.dueAmount.toLocaleString()}`])} /></>;
  },
  'reports-inventory': () => {
    const report = inventoryReport();
    return <><PageHeader title="Inventory Report" description="Branch-wise stock, product-wise stock, low stock, negative stock attempts and value." action={exportButton()} /><div className="grid gap-4 md:grid-cols-3"><StatCard title="Stock Value" value={`Rs ${report.stockValue.toLocaleString()}`} /><StatCard title="Low Stock" value={report.lowStockCount} /><StatCard title="Dead Stock" value={report.deadStockCount} /></div><DataTable headers={['Branch', 'Product', 'Qty']} rows={branchStockRows()} /></>;
  },
  'reports-billing-guard': () => {
    const report = billingGuardReport();
    return <><PageHeader title="Billing Guard Report" description="Violations, printed unpaid bills, old drafts, overrides and cancelled bills." action={exportButton()} /><div className="grid gap-4 md:grid-cols-3"><StatCard title="Printed Unpaid" value={report.printedUnpaid} tone="red" /><StatCard title="Old Drafts" value={report.oldDrafts} tone="amber" /><StatCard title="Approvals" value={report.approvals} tone="purple" /></div><DataTable headers={['Bill', 'Violation']} rows={demoDb.bills.map((bill) => [bill.billNumber, getBillingGuardViolations(bill, demoDb.settings).reasons.join(', ') || 'Clear'])} /></>;
  },
  'reports-eod': () => {
    const report = eodReport();
    return <><PageHeader title="EOD Report" description="Branch/day close status, cash variance, blocking reasons, closed by and closed at." action={exportButton()} /><div className="grid gap-4 md:grid-cols-3"><StatCard title="Blocked" value={report.blocked} tone="red" /><StatCard title="Ready" value={report.ready} tone="green" /><StatCard title="Variance" value={`Rs ${report.variance.toLocaleString()}`} tone="amber" /></div><DataTable headers={['Branch', 'Status', 'Variance', 'Printed Unpaid', 'Transfers']} rows={demoDb.eodSessions.map((session) => [getBranchName(session.branchId), <EodStatusBadge key="s" status={session.status} />, `Rs ${session.cashVariance.toLocaleString()}`, session.pendingPrintedBills, session.pendingTransfers])} /></>;
  },
  'reports-transfers': () => <><PageHeader title="Transfer Report" description="Source, destination, pending dispatch, pending receive and completed transfers." action={exportButton()} /><DataTable headers={['Transfer', 'From', 'To', 'Status']} rows={demoDb.stockTransfers.map((transfer) => [transfer.id, getBranchName(transfer.sourceBranchId), getBranchName(transfer.destinationBranchId), <TransferStatusBadge key="s" status={transfer.status} />])} /></>,
  'reports-staff': () => <><PageHeader title="Staff Report" description="Availability, requests, assigned jobs and completed jobs." action={exportButton()} /><DataTable headers={['Staff', 'Skill', 'Status', 'Branch']} rows={demoDb.staffStatuses.map((staff) => [getUserName(staff.userId), staff.skill, <StaffStatusBadge key="s" status={staff.status} />, getBranchName(staff.branchId)])} /></>,
  settings: () => (
    <>
      <PageHeader title="Settings" description="Organization, tax, billing sequence, negative stock, approvals, EOD threshold, print and warranty rules." action={actionButton('Update settings')} />
      <DataTable headers={['Setting', 'Value', 'Rule']} rows={[
        ['Bill prefix', demoDb.settings.billPrefix, 'Sequential bill numbers protected'],
        ['Max discount without approval', `${demoDb.settings.maxDiscountPercentWithoutApproval}%`, 'Higher discount requires owner approval'],
        ['Allow negative stock', demoDb.settings.allowNegativeStock ? 'Yes' : 'No', 'Negative stock blocked by default'],
        ['EOD cash variance threshold', `Rs ${demoDb.settings.eodCashVarianceThreshold}`, 'Variance above threshold requires owner approval'],
        ['Draft bill expiry', `${demoDb.settings.draftBillExpiryMinutes} minutes`, 'Old drafts warn and block close'],
        ['Transfer receive before EOD', demoDb.settings.transferReceiveRequiredBeforeEod ? 'Required' : 'Optional', 'Dispatched transfers block close'],
      ]} />
    </>
  ),
};

export function StockLockModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const Page = pages[moduleKey];
  if (!Page) return <EmptyState title="Module not found" description="This route is not registered in the StockLock OS module map." />;
  const sampleCsv = exportRowsToCsv([{ module: moduleKey, generated: true }]);
  return (
    <div className="space-y-6">
      <Page />
      <div className="hidden">{sampleCsv}</div>
    </div>
  );
}
