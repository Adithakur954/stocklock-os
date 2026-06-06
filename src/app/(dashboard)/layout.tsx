'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  CreditCard,
  FileClock,
  FileText,
  Gauge,
  LayoutDashboard,
  LockKeyhole,
  Package,
  ReceiptText,
  RefreshCcw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';
import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { BranchSelector, DateRangePicker } from '@/components/stocklock/ui';
import { ThemeToggle } from '@/components/stocklock/theme-toggle';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Branches', href: '/branches', icon: Building2 },
  { label: 'Inventory', href: '/inventory', icon: Boxes },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Stock Requests', href: '/stock-requests', icon: ClipboardCheck },
  { label: 'Transfers', href: '/transfers', icon: Truck },
  { label: 'POS Billing', href: '/billing', icon: ShoppingCart },
  { label: 'Bills', href: '/bills', icon: ReceiptText },
  { label: 'Payments', href: '/payments', icon: CreditCard },
  { label: 'Returns / Credit Notes', href: '/returns', icon: RefreshCcw },
  { label: 'Purchases', href: '/purchases', icon: BriefcaseBusiness },
  { label: 'Vendors', href: '/vendors', icon: BriefcaseBusiness },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Staff', href: '/staff', icon: Users },
  { label: 'Service Jobs', href: '/service-jobs', icon: Wrench },
  { label: 'Warranty', href: '/warranty', icon: ShieldCheck },
  { label: 'EOD Closing', href: '/eod', icon: LockKeyhole },
  { label: 'Approvals', href: '/approvals', icon: ClipboardCheck },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { label: 'Audit Log', href: '/audit', icon: FileClock },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeAlerts = demoDb.alerts.filter((alert) => alert.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-950">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Gauge size={22} />
            </div>
            <div>
              <p className="text-lg font-bold">StockLock OS</p>
              <p className="text-xs text-gray-500">{demoDb.organization.name}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                }`}
              >
                <item.icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.href === '/alerts' && activeAlerts > 0 && <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">{activeAlerts}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-3 rounded-lg bg-gray-50 p-3">
            <p className="text-sm font-semibold">{demoDb.users[0].name}</p>
            <p className="text-xs text-gray-500">Owner - Full access</p>
            <div className="border-t border-gray-200 pt-3">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Theme</p>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <div>
                <p className="text-sm font-semibold">Inventory, Billing & Branch Control System</p>
                <p className="text-xs text-gray-500">Billing Guard and EOD Lock active in demo mode</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <BranchSelector branches={demoDb.branches} />
              <DateRangePicker />
              <ThemeToggle />
              <button className="relative rounded-lg border border-gray-200 bg-white p-2 text-gray-600">
                <Bell size={18} />
                {activeAlerts > 0 && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-600" />}
              </button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
