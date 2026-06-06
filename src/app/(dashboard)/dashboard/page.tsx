'use client';

import { useEffect, useState } from 'react';
import { Branch, User, db } from '@/lib/db';
import { BranchScope, useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const selectedBranchId = useAuthStore((state) => state.selectedBranchId);
  const [todaySales, setTodaySales] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [deadStockValue, setDeadStockValue] = useState(0);
  const [actionList, setActionList] = useState<string[]>([]);
  const [branchLabel, setBranchLabel] = useState('All Branches');

  useEffect(() => {
    async function loadMetrics() {
      const branches = await db.branches.toArray();
      const scopedBranchId = getScopedBranchId(user, selectedBranchId);
      setBranchLabel(getBranchLabel(branches, scopedBranchId));

      // 1. Today Sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const allSales = await db.sales.where('createdAt').aboveOrEqual(today).toArray();
      const sales = scopedBranchId ? allSales.filter((sale) => sale.branchId === scopedBranchId) : allSales;
      const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
      setTodaySales(totalSales);

      // 2. Pending Requests
      const allReqs = await db.transferRequests.where('status').equals('Requested').toArray();
      const reqs = scopedBranchId
        ? allReqs.filter((request) => request.fromBranchId === scopedBranchId || request.toBranchId === scopedBranchId)
        : allReqs;
      setPendingRequestsCount(reqs.length);

      // 3. Low Stock Items
      const allStock = await db.stock.toArray();
      const stock = scopedBranchId ? allStock.filter((item) => item.branchId === scopedBranchId) : allStock;
      const lowStockItems = stock.filter(s => s.quantity <= s.minimumRequired);
      setLowStockCount(lowStockItems.length);

      // 4. Dead Stock Value (Simplified: items unsold for > 60 days, mock with all low moving stock for MVP)
      // For MVP demo, let's consider stock > 0 but not sold recently (no lastSoldDate or old)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      
      let deadValue = 0;
      const products = await db.products.toArray();
      
      for (const s of stock) {
         if (s.quantity > 0 && (!s.lastSoldDate || s.lastSoldDate < sixtyDaysAgo)) {
           const p = products.find(p => p.id === s.productId);
           if (p) deadValue += (p.purchasePrice * s.quantity);
         }
      }
      setDeadStockValue(deadValue);

      // 5. Generate Action List
      const actions: string[] = [];
      if (reqs.length > 0) {
        actions.push(`${reqs.length} pending transfer requests need approval.`);
      }
      if (lowStockItems.length > 0) {
        actions.push(`${lowStockItems.length} items are currently below minimum stock levels.`);
      }
      if (deadValue > 0) {
        actions.push(`Review dead stock to free up ₹${deadValue.toLocaleString()} in capital.`);
      }
      if (actions.length === 0) {
        actions.push("No urgent actions required right now.");
      }
      setActionList(actions);
    }

    loadMetrics();
  }, [selectedBranchId, user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Viewing {branchLabel}</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Today Sales</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{todaySales.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingRequestsCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Dead Stock Value</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">₹{deadStockValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Action List</h2>
        </div>
        <div className="p-6">
          <ul className="space-y-3">
            {actionList.map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  {idx + 1}
                </span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function getScopedBranchId(
  user: User | null,
  selectedBranchId: BranchScope
) {
  if (!user) return undefined;
  if (user.role === 'Owner') {
    return selectedBranchId === 'all' ? undefined : selectedBranchId;
  }

  return user.branchId;
}

function getBranchLabel(branches: Branch[], branchId?: number) {
  if (!branchId) return 'All Branches';
  return branches.find((branch) => branch.id === branchId)?.name || 'Selected Branch';
}
