import { AlertTriangle, Banknote, Boxes, Camera, CreditCard, IndianRupee, LockKeyhole, ReceiptText, ShieldAlert, Truck, Users, Wrench } from 'lucide-react';
import { AlertCard, AuditTimeline, BentoCard, DataTable, EodBlockingReasons, PageHeader, StatusBadge } from '@/components/stocklock/ui';
import { UniversalSearch } from '@/components/stocklock/universal-search';
import { canCloseDay, getEodBlockingReasons } from '@/lib/eod/eod-lock';
import { demoDb, getBranchName, getProductName } from '@/lib/mock-data/stocklock-demo-data';
import { detectDeadStock, detectLowStock } from '@/lib/services/inventory-service';
import { getBillingMissRiskJobs, getJobBillingMissCount } from '@/lib/services/service-job-service';

function money(value: number) {
  return `Rs ${value.toLocaleString()}`;
}

function CommandMetric({
  title,
  value,
  helper,
  icon,
  tone = 'blue',
}: {
  title: string;
  value: string | number;
  helper: string;
  icon: React.ReactNode;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) {
  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    red: 'bg-red-50 text-red-700 ring-red-600/20',
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-gray-950">{value}</p>
          <p className="mt-2 text-sm text-gray-500">{helper}</p>
        </div>
        <div className={`rounded-lg p-3 ring-1 ring-inset ${toneClasses[tone]}`}>{icon}</div>
      </div>
    </section>
  );
}

function BranchPerformanceBars({
  branchRows,
}: {
  branchRows: Array<{ branchId: string; name: string; sales: number; risk: number; transfers: number; stockPressure: number }>;
}) {
  const maxSales = Math.max(...branchRows.map((row) => row.sales), 1);

  return (
    <div className="space-y-4">
      {branchRows.map((row) => {
        const width = Math.max(8, Math.round((row.sales / maxSales) * 100));
        return (
          <div key={row.branchId} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-950">{row.name}</p>
                <p className="text-sm text-gray-500">{money(row.sales)} sales today</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={row.risk > 0 ? 'red' : 'green'}>{row.risk} blocker{row.risk === 1 ? '' : 's'}</StatusBadge>
                <StatusBadge tone={row.transfers > 0 ? 'amber' : 'green'}>{row.transfers} transfer{row.transfers === 1 ? '' : 's'}</StatusBadge>
                <StatusBadge tone={row.stockPressure > 0 ? 'amber' : 'green'}>{row.stockPressure} low stock</StatusBadge>
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DecisionBoard({
  billingMissRisk,
  pendingTransfers,
  openRequests,
  freeStaff,
}: {
  billingMissRisk: number;
  pendingTransfers: number;
  openRequests: number;
  freeStaff: number;
}) {
  const decisions = [
    {
      title: 'Billing miss risk',
      value: billingMissRisk,
      action: billingMissRisk > 0 ? 'Match issued parts with bill now' : 'No leakage found',
      tone: billingMissRisk > 0 ? 'red' : 'green',
      icon: <ShieldAlert size={18} />,
    },
    {
      title: 'Pending transfers',
      value: pendingTransfers,
      action: pendingTransfers > 0 ? 'Dispatch or receive before EOD' : 'Transfers are clean',
      tone: pendingTransfers > 0 ? 'amber' : 'green',
      icon: <Truck size={18} />,
    },
    {
      title: 'Open stock requests',
      value: openRequests,
      action: openRequests > 0 ? 'Respond before customer waits' : 'No open demand',
      tone: openRequests > 0 ? 'amber' : 'green',
      icon: <Boxes size={18} />,
    },
    {
      title: 'Free staff',
      value: freeStaff,
      action: freeStaff > 0 ? 'Can assign urgent fitment' : 'No spare staff',
      tone: freeStaff > 0 ? 'green' : 'red',
      icon: <Users size={18} />,
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {decisions.map((item) => (
        <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-500">{item.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-950">{item.value}</p>
            </div>
            <StatusBadge tone={item.tone}>{item.icon}</StatusBadge>
          </div>
          <p className="mt-3 text-sm font-medium text-gray-700">{item.action}</p>
        </div>
      ))}
    </div>
  );
}

function InstallationWorkflow() {
  const steps = [
    { title: 'Vehicle Job', detail: 'Open job card', icon: <Wrench size={18} /> },
    { title: 'Product Issue', detail: 'Stock leaves shelf', icon: <Boxes size={18} /> },
    { title: 'Photo Proof', detail: 'Before/after proof', icon: <Camera size={18} /> },
    { title: 'POS Bill', detail: 'Parts billed', icon: <ReceiptText size={18} /> },
    { title: 'EOD Lock', detail: 'Close only when clean', icon: <LockKeyhole size={18} /> },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step.title} className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">{step.icon}</div>
          <p className="mt-3 text-sm font-bold text-gray-950">{index + 1}. {step.title}</p>
          <p className="mt-1 text-xs text-gray-500">{step.detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const todayBills = demoDb.bills;
  const payments = demoDb.payments;
  const salesTotal = todayBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const cashCollected = payments.filter((payment) => payment.mode === 'CASH').reduce((sum, payment) => sum + payment.amount, 0);
  const digitalPayments = payments.filter((payment) => payment.mode === 'UPI' || payment.mode === 'CARD' || payment.mode === 'BANK_TRANSFER').reduce((sum, payment) => sum + payment.amount, 0);
  const creditDue = todayBills.reduce((sum, bill) => sum + bill.dueAmount, 0);
  const printedUnpaid = todayBills.filter((bill) => bill.status === 'PRINTED' && bill.paymentStatus !== 'PAID');
  const openRequests = demoDb.stockRequests.filter((request) => request.status === 'OPEN' || request.status === 'RESPONSE_RECEIVED');
  const pendingTransfers = demoDb.stockTransfers.filter((transfer) => transfer.status === 'READY' || transfer.status === 'DISPATCHED');
  const blockedEod = demoDb.eodSessions.find((session) => session.status === 'BLOCKED') || demoDb.eodSessions[0];
  const eodReasons = getEodBlockingReasons(blockedEod, todayBills.filter((bill) => bill.branchId === blockedEod.branchId), demoDb.stockTransfers, demoDb.settings);
  const closeResult = canCloseDay(blockedEod, todayBills.filter((bill) => bill.branchId === blockedEod.branchId), demoDb.stockTransfers, demoDb.settings);
  const lowStock = detectLowStock();
  const deadStock = detectDeadStock();
  const freeStaff = demoDb.staffStatuses.filter((staff) => staff.status === 'FREE').length;
  const billingMissRiskJobs = getBillingMissRiskJobs();
  const billingMissCount = getJobBillingMissCount();
  const blockers = printedUnpaid.length + pendingTransfers.filter((transfer) => transfer.status === 'DISPATCHED').length + billingMissRiskJobs.length + (closeResult.allowed ? 0 : 1);
  const criticalAlerts = demoDb.alerts.filter((alert) => alert.status === 'OPEN').slice(0, 3);

  const branchRows = demoDb.branches.map((branch) => {
    const branchBills = todayBills.filter((bill) => bill.branchId === branch.id);
    const branchTransfers = pendingTransfers.filter((transfer) => transfer.sourceBranchId === branch.id || transfer.destinationBranchId === branch.id);
    const branchRisk = printedUnpaid.filter((bill) => bill.branchId === branch.id).length + billingMissRiskJobs.filter((job) => job.branchId === branch.id).length;
    return {
      branchId: branch.id,
      name: branch.name,
      sales: branchBills.reduce((sum, bill) => sum + bill.grandTotal, 0),
      risk: branchRisk,
      transfers: branchTransfers.length,
      stockPressure: lowStock.filter((stock) => stock.branchId === branch.id).length,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owner Command Center"
        description="Search anything, see cash health, spot billing leakage, and decide what each branch needs before EOD."
      />

      <UniversalSearch />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <CommandMetric title="Sales today" value={money(salesTotal)} helper={`${todayBills.length} bills across branches`} tone="green" icon={<IndianRupee size={20} />} />
        <CommandMetric title="Cash" value={money(cashCollected)} helper="Count this in EOD drawer" tone="green" icon={<Banknote size={20} />} />
        <CommandMetric title="Digital payments" value={money(digitalPayments)} helper="UPI, card and bank settlement" tone="blue" icon={<CreditCard size={20} />} />
        <CommandMetric title="Credit due" value={money(creditDue)} helper="Customer outstanding today" tone={creditDue > 0 ? 'amber' : 'green'} icon={<IndianRupee size={20} />} />
        <CommandMetric title="Blockers" value={blockers} helper="Must clear before close" tone={blockers > 0 ? 'red' : 'green'} icon={<AlertTriangle size={20} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <BentoCard title="Branch Performance" description="Sales with operational pressure by branch. Bigger bars show stronger sales. Badges show what needs action.">
          <BranchPerformanceBars branchRows={branchRows} />
        </BentoCard>

        <BentoCard title="Owner Decision Board" description="Four decisions that matter most before the shop closes.">
          <DecisionBoard
            billingMissRisk={billingMissCount}
            pendingTransfers={pendingTransfers.length}
            openRequests={openRequests.length}
            freeStaff={freeStaff}
          />
        </BentoCard>
      </div>

      <BentoCard title="Installation-To-Billing Workflow" description="The leakage-control path from job card to EOD lock.">
        <InstallationWorkflow />
      </BentoCard>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <BentoCard title="Billing Miss Risk" description="Parts issued must match parts billed before close.">
          <DataTable
            headers={['Job Card', 'Vehicle', 'Issued', 'Billed', 'Risk']}
            rows={demoDb.serviceJobs.map((job) => [
              job.id,
              `${job.vehicleNumber} - ${job.vehicleModel}`,
              job.partsIssuedCount,
              job.partsBilledCount,
              job.partsIssuedCount > job.partsBilledCount
                ? <StatusBadge key="risk" tone="red">Bill {job.partsIssuedCount - job.partsBilledCount} part{job.partsIssuedCount - job.partsBilledCount === 1 ? '' : 's'}</StatusBadge>
                : <StatusBadge key="risk" tone="green">Matched</StatusBadge>,
            ])}
          />
        </BentoCard>

        <BentoCard title="EOD Lock Status" description={`${getBranchName(blockedEod.branchId)} - ${closeResult.allowed ? 'ready to close' : 'owner action needed'}`}>
          <EodBlockingReasons reasons={eodReasons} />
        </BentoCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <BentoCard title="Stock Attention" description="Detailed inventory view stays lower on the page so owners see decisions first.">
          <div className="space-y-2">
            {lowStock.slice(0, 5).map((stock) => (
              <div key={stock.id} className="rounded-md bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900">{getProductName(stock.productId)}</p>
                <p className="text-xs text-gray-500">{getBranchName(stock.branchId)} - available {stock.quantityAvailable}</p>
              </div>
            ))}
            {deadStock.length > 0 && <StatusBadge tone="amber">{deadStock.length} dead stock item needs owner review</StatusBadge>}
          </div>
        </BentoCard>

        <BentoCard title="Open Alerts" description="Only active business alerts.">
          <div className="space-y-3">{criticalAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div>
        </BentoCard>

        <BentoCard title="Recent Audit Activity" description="Important actions remain traceable.">
          <AuditTimeline logs={demoDb.auditLogs.slice(0, 5)} />
        </BentoCard>
      </div>

      <BentoCard title="Detailed Sales Lines" description="Operational detail for counter follow-up.">
        <DataTable
          headers={['Product', 'Branch', 'Bill', 'Attention']}
          rows={demoDb.billItems.map((item) => {
            const bill = demoDb.bills.find((record) => record.id === item.billId);
            return [
              <span key="p" className="font-semibold">{item.description}</span>,
              getBranchName(bill?.branchId),
              bill?.billNumber || '-',
              item.discount > 0 ? <StatusBadge key="d" tone="amber">Discount used</StatusBadge> : <StatusBadge key="d" tone="green">Clean sale</StatusBadge>,
            ];
          })}
        />
      </BentoCard>
    </div>
  );
}
