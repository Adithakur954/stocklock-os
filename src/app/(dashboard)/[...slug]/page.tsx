import { StockLockModulePage, type ModuleKey } from '@/components/stocklock/module-page';

const routeMap: Record<string, ModuleKey> = {
  inventory: 'inventory',
  'inventory/ledger': 'inventory-ledger',
  'inventory/low-stock': 'inventory-low-stock',
  'inventory/dead-stock': 'inventory-dead-stock',
  'stock-requests': 'stock-requests',
  transfers: 'transfers',
  billing: 'billing',
  bills: 'bills',
  payments: 'payments',
  returns: 'returns',
  purchases: 'purchases',
  vendors: 'vendors',
  customers: 'customers',
  staff: 'staff',
  'service-jobs': 'service-jobs',
  warranty: 'warranty',
  eod: 'eod',
  approvals: 'approvals',
  alerts: 'alerts',
  audit: 'audit',
  reports: 'reports',
  'reports/sales': 'reports-sales',
  'reports/inventory': 'reports-inventory',
  'reports/billing-guard': 'reports-billing-guard',
  'reports/eod': 'reports-eod',
  'reports/transfers': 'reports-transfers',
  'reports/staff': 'reports-staff',
  settings: 'settings',
};

export default async function StockLockRoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const moduleKey = routeMap[slug.join('/')];

  return <StockLockModulePage moduleKey={moduleKey || 'reports'} />;
}
