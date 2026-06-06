import { AlertTriangle, Banknote, Boxes, CreditCard, IndianRupee, LockKeyhole, ShieldAlert, Truck, Users } from 'lucide-react';
import { AlertCard, ApprovalDecisionPanel, AuditTimeline, BentoCard, DataTable, EodBlockingReasons, PageHeader, StatCard, StatusBadge } from '@/components/stocklock/ui';
import { canCloseDay, getEodBlockingReasons } from '@/lib/eod/eod-lock';
import { getBillingGuardViolations } from '@/lib/guards/billing-guard';
import { demoDb, getBranchName, getProductName, getUserName } from '@/lib/mock-data/stocklock-demo-data';
import { detectDeadStock, detectLowStock } from '@/lib/services/inventory-service';

export default function DashboardPage() {
  const todayBills = demoDb.bills;
  const payments = demoDb.payments;
  const salesTotal = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const cashCollected = payments.filter((payment) => payment.mode === 'CASH').reduce((sum, payment) => sum + payment.amount, 0);
  const upiCollected = payments.filter((payment) => payment.mode === 'UPI').reduce((sum, payment) => sum + payment.amount, 0);
  const cardCollected = payments.filter((payment) => payment.mode === 'CARD').reduce((sum, payment) => sum + payment.amount, 0);
  const creditSales = todayBills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  const printedUnpaid = todayBills.filter((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID');
  const lowStock = detectLowStock();
  const deadStock = detectDeadStock();
  const openRequests = demoDb.stockRequests.filter((request) => request.status === 'OPEN' || request.status === 'RESPONSE_RECEIVED');
  const pendingTransfers = demoDb.stockTransfers.filter((transfer) => transfer.status === 'READY' || transfer.status === 'DISPATCHED');
  const blockedEod = demoDb.eodSessions.find((session) => session.status === 'BLOCKED') || demoDb.eodSessions[0];
  const eodReasons = getEodBlockingReasons(blockedEod, todayBills.filter((bill) => bill.branchId === blockedEod.branchId), demoDb.stockTransfers, demoDb.settings);
  const guardResult = getBillingGuardViolations(printedUnpaid[0] || todayBills[0], demoDb.settings);
  const closeResult = canCloseDay(blockedEod, todayBills.filter((bill) => bill.branchId === blockedEod.branchId), demoDb.stockTransfers, demoDb.settings);
  const staffAvailable = demoDb.staffStatuses.filter((staff) => staff.status === 'FREE').length;
  const servicePending = demoDb.serviceJobs.filter((job) => !['COMPLETED', 'BILLED', 'CANCELLED'].includes(job.status)).length;
  const pendingApprovals = demoDb.approvals.filter((approval) => approval.status === 'PENDING');
  const criticalAlerts = demoDb.alerts.filter((alert) => alert.status === 'OPEN').slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owner Dashboard"
        description="Live branch health, billing risk, EOD close status, staff availability, stock movement, and owner approvals for Kalra Car Accessories."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today Sales" value={`Rs ${salesTotal.toLocaleString()}`} sub={`${todayBills.length} bills`} tone="green" icon={<IndianRupee size={16} />} />
        <StatCard title="Cash Collected" value={`Rs ${cashCollected.toLocaleString()}`} sub="Feeds EOD drawer" tone="green" icon={<Banknote size={16} />} />
        <StatCard title="UPI Collected" value={`Rs ${upiCollected.toLocaleString()}`} sub="Digital settlement" tone="blue" icon={<CreditCard size={16} />} />
        <StatCard title="Card Collected" value={`Rs ${cardCollected.toLocaleString()}`} sub="Card terminal" tone="blue" icon={<CreditCard size={16} />} />
        <StatCard title="Credit Sales" value={`Rs ${creditSales.toLocaleString()}`} sub="Customer outstanding" tone="amber" icon={<IndianRupee size={16} />} />
        <StatCard title="Printed Unpaid" value={printedUnpaid.length} sub="Billing Guard alert" tone="red" icon={<ShieldAlert size={16} />} />
        <StatCard title="Low Stock Items" value={lowStock.length} sub="Below reorder level" tone="amber" icon={<Boxes size={16} />} />
        <StatCard title="Open Requests" value={openRequests.length} sub="Branch demand board" tone="blue" icon={<Truck size={16} />} />
        <StatCard title="Transfers Pending" value={pendingTransfers.length} sub="Blocks EOD when dispatched" tone="amber" icon={<Truck size={16} />} />
        <StatCard title="EOD Status" value={blockedEod.status} sub={closeResult.allowed ? 'Ready to close' : 'Close blocked'} tone={closeResult.allowed ? 'green' : 'red'} icon={<LockKeyhole size={16} />} />
        <StatCard title="Dead Stock Items" value={deadStock.length} sub="Capital stuck" tone="amber" icon={<AlertTriangle size={16} />} />
        <StatCard title="Staff Available" value={staffAvailable} sub={`${servicePending} jobs pending`} tone="green" icon={<Users size={16} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <BentoCard title="Branch Health Overview" description="Cross-branch operational status from demo data.">
          <DataTable
            headers={['Branch', 'Sales', 'Requests', 'Transfers', 'EOD']}
            rows={demoDb.branches.map((branch) => [
              <span key="b" className="font-semibold text-gray-950">{branch.name}</span>,
              `Rs ${todayBills.filter((bill) => bill.branchId === branch.id).reduce((sum, bill) => sum + bill.grandTotal, 0).toLocaleString()}`,
              demoDb.stockRequests.filter((request) => request.requestingBranchId === branch.id).length,
              demoDb.stockTransfers.filter((transfer) => transfer.sourceBranchId === branch.id || transfer.destinationBranchId === branch.id).length,
              <StatusBadge key="eod" tone={demoDb.eodSessions.find((session) => session.branchId === branch.id)?.status === 'BLOCKED' ? 'red' : 'green'}>
                {demoDb.eodSessions.find((session) => session.branchId === branch.id)?.status || 'OPEN'}
              </StatusBadge>,
            ])}
          />
        </BentoCard>

        <BentoCard title="Billing Guard Warnings" description="Hard locks and approval triggers.">
          <div className="space-y-3">
            <StatusBadge tone={guardResult.allowed ? 'green' : 'red'}>{guardResult.allowed ? 'Billing Guard Clear' : 'Billing Guard Active'}</StatusBadge>
            {guardResult.reasons.map((reason) => <p key={reason} className="rounded-md bg-red-50 p-3 text-sm text-red-700">{reason}</p>)}
            <ApprovalDecisionPanel count={pendingApprovals.length} />
          </div>
        </BentoCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BentoCard title="EOD Lock Status" description={`${getBranchName(blockedEod.branchId)} - cash variance Rs ${blockedEod.cashVariance.toLocaleString()}`}>
          <EodBlockingReasons reasons={eodReasons} />
        </BentoCard>
        <BentoCard title="Staff Availability" description="Skill-wise fitter and support staff view.">
          <DataTable
            headers={['Staff', 'Skill', 'Status']}
            rows={demoDb.staffStatuses.map((staff) => [
              getUserName(staff.userId),
              staff.skill,
              <StatusBadge key="s" tone={staff.status === 'FREE' ? 'green' : staff.status === 'BUSY' ? 'amber' : 'gray'}>{staff.status}</StatusBadge>,
            ])}
          />
        </BentoCard>
        <BentoCard title="Inventory Risk" description="Products needing owner attention.">
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((stock) => (
              <div key={stock.id} className="rounded-md bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900">{getProductName(stock.productId)}</p>
                <p className="text-xs text-gray-500">{getBranchName(stock.branchId)} - available {stock.quantityAvailable}</p>
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BentoCard title="Recent Audit Activity" description="Every important action leaves an audit trail.">
          <AuditTimeline logs={demoDb.auditLogs} />
        </BentoCard>
        <BentoCard title="Open Alerts" description="Critical branch risks requiring action.">
          <div className="space-y-3">{criticalAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div>
        </BentoCard>
      </div>

      <BentoCard title="Top Selling Products" description="Calculated from current demo bills and product lines.">
        <DataTable
          headers={['Product', 'Branch', 'Attention']}
          rows={demoDb.billItems.slice(0, 5).map((item) => {
            const bill = demoDb.bills.find((record) => record.id === item.billId);
            return [
              <span key="p" className="font-semibold">{item.description}</span>,
              getBranchName(bill?.branchId),
              item.discount > 0 ? <StatusBadge key="d" tone="amber">Discount used</StatusBadge> : <StatusBadge key="d" tone="green">Clean sale</StatusBadge>,
            ];
          })}
        />
      </BentoCard>
    </div>
  );
}
