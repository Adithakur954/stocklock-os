import Link from 'next/link';
import { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, CircleSlash, Clock, FileText, ShieldAlert } from 'lucide-react';
import { Alert } from '@/lib/types/alerts';
import { Approval, AuditLog } from '@/lib/types/audit';
import { Bill } from '@/lib/types/billing';
import { GuardResult } from '@/lib/types/core';
import { EodSession } from '@/lib/types/eod';

const toneClasses = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  gray: 'bg-gray-50 text-gray-700 ring-gray-600/20',
};

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-950">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ children, tone = 'gray' }: { children: ReactNode; tone?: keyof typeof toneClasses }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses[tone]}`}>{children}</span>;
}

export function StatCard({ title, value, sub, tone = 'gray', icon }: { title: string; value: ReactNode; sub?: string; tone?: keyof typeof toneClasses; icon?: ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`rounded-md p-2 ring-1 ring-inset ${toneClasses[tone]}`}>{icon || <FileText size={16} />}</div>
      </div>
      <div className="mt-3 text-2xl font-bold text-gray-950">{value}</div>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export function BentoCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-semibold">{header}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-gray-700">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SearchInput({ placeholder = 'Search...' }: { placeholder?: string }) {
  return <input className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder={placeholder} />;
}

export function BranchSelector({ branches }: { branches: Array<{ id: string; name: string }> }) {
  return (
    <select className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500">
      <option>All branches</option>
      {branches.map((branch) => <option key={branch.id}>{branch.name}</option>)}
    </select>
  );
}

export function DateRangePicker() {
  return <input type="date" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500" defaultValue="2026-06-06" />;
}

export function AlertCard({ alert }: { alert: Alert }) {
  const tone = alert.severity === 'BLOCKER' || alert.severity === 'CRITICAL' ? 'red' : alert.severity === 'WARNING' ? 'amber' : 'blue';
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className={tone === 'red' ? 'text-red-500' : 'text-amber-500'} size={18} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-gray-950">{alert.title}</p>
            <StatusBadge tone={tone}>{alert.severity}</StatusBadge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{alert.message}</p>
          <Link href={alert.actionUrl} className="mt-2 inline-flex text-sm font-medium text-blue-600">Open module</Link>
        </div>
      </div>
    </div>
  );
}

export function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-3">
          <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{log.action}</p>
            <p className="text-xs text-gray-500">{log.module} · {log.reason || 'No reason'} · {new Date(log.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ApprovalCard({ approval }: { approval: Approval }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-950">{approval.action}</p>
          <p className="mt-1 text-sm text-gray-500">{approval.reason}</p>
        </div>
        <StatusBadge tone={approval.status === 'PENDING' ? 'amber' : approval.status === 'APPROVED' ? 'green' : 'red'}>{approval.status}</StatusBadge>
      </div>
      {approval.status === 'PENDING' && <div className="mt-3 flex gap-2"><button className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">Approve</button><button className="rounded-md border px-3 py-2 text-xs font-semibold text-gray-700">Reject</button></div>}
    </div>
  );
}

export function ModuleCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <p className="font-semibold text-gray-950">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center"><p className="font-semibold text-gray-900">{title}</p><p className="mt-1 text-sm text-gray-500">{description}</p></div>;
}

export function ConfirmDialog() {
  return <div className="hidden" aria-hidden="true">Confirm dialog scaffold ready for destructive actions.</div>;
}

export function FormModal() {
  return <div className="hidden" aria-hidden="true">Form modal scaffold ready for create/edit workflows.</div>;
}

export function StockBadge({ qty }: { qty: number }) {
  return <StatusBadge tone={qty <= 0 ? 'red' : qty <= 3 ? 'amber' : 'green'}>{qty <= 0 ? 'No stock' : `${qty} available`}</StatusBadge>;
}

export function BillStatusBadge({ status }: { status: Bill['status'] }) {
  const tone = status === 'PAID' ? 'green' : status === 'PRINTED' || status === 'PART_PAID' ? 'amber' : status === 'CANCELLED' ? 'red' : 'gray';
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}

export function BillingGuardBadge({ result }: { result: GuardResult }) {
  return <StatusBadge tone={result.allowed ? 'green' : 'red'}>{result.allowed ? 'Billing Guard Clear' : 'Billing Guard Active'}</StatusBadge>;
}

export function EodStatusBadge({ status }: { status: EodSession['status'] }) {
  const tone = status === 'CLOSED' || status === 'READY_TO_CLOSE' ? 'green' : status === 'BLOCKED' ? 'red' : 'amber';
  return <StatusBadge tone={tone}>{status}</StatusBadge>;
}

export function TransferStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={status === 'RECEIVED' ? 'green' : status === 'DISPATCHED' || status === 'READY' ? 'amber' : 'gray'}>{status}</StatusBadge>;
}

export function StaffStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={status === 'FREE' ? 'green' : status === 'BUSY' ? 'amber' : 'gray'}>{status}</StatusBadge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={status === 'PAID' ? 'green' : status === 'UNPAID' ? 'red' : 'amber'}>{status}</StatusBadge>;
}

export function CustomerCreditBadge({ amount }: { amount: number }) {
  return <StatusBadge tone={amount > 0 ? 'amber' : 'green'}>{amount > 0 ? `Rs ${amount.toLocaleString()} due` : 'Clear'}</StatusBadge>;
}

export function WarrantyStatusBadge({ status }: { status: string }) {
  return <StatusBadge tone={status === 'OPEN' || status === 'IN_REVIEW' ? 'amber' : status === 'REJECTED' ? 'red' : 'green'}>{status}</StatusBadge>;
}

export function StockMovementTimeline({ movements }: { movements: Array<{ label: string; detail: string }> }) {
  return <div className="space-y-3">{movements.map((move) => <div key={move.label} className="rounded-md bg-gray-50 p-3"><p className="text-sm font-semibold text-gray-900">{move.label}</p><p className="text-xs text-gray-500">{move.detail}</p></div>)}</div>;
}

export function BillPreview({ bill }: { bill: Bill }) {
  return <div className="rounded-lg border bg-white p-5"><p className="font-bold">Tax Invoice {bill.billNumber}</p><p className="mt-2 text-sm text-gray-500">Total Rs {bill.grandTotal.toLocaleString()} · Due Rs {bill.dueAmount.toLocaleString()}</p><p className="mt-4 text-xs text-gray-500">Thank you for choosing Kalra Car Accessories.</p></div>;
}

export function EodBlockingReasons({ reasons }: { reasons: string[] }) {
  return <div className="space-y-2">{reasons.length ? reasons.map((reason) => <div key={reason} className="flex gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700"><CircleSlash size={16} />{reason}</div>) : <div className="flex gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={16} />Ready to close</div>}</div>;
}

export function ApprovalDecisionPanel({ count }: { count: number }) {
  return <div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><div className="flex items-center gap-2 font-semibold text-amber-800"><ShieldAlert size={18} />Owner approvals pending: {count}</div><p className="mt-1 text-sm text-amber-700">Approve or reject overrides from the Approval Center.</p></div>;
}

export function ModuleClock({ text }: { text: string }) {
  return <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Clock size={14} />{text}</span>;
}
