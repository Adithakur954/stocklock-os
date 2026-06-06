'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, LogOut, Menu, Building2 } from 'lucide-react';
import { Branch, db } from '@/lib/db';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const selectedBranchId = useAuthStore((state) => state.selectedBranchId);
  const setSelectedBranchId = useAuthStore((state) => state.setSelectedBranchId);
  const [branches, setBranches] = useState<Branch[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    async function loadBranches() {
      const allBranches = await db.branches.toArray();
      setBranches(allBranches);
    }

    loadBranches();
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isOwner = user.role === 'Owner';
  const assignedBranch = branches.find((branch) => branch.id === user.branchId);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Stock & Transfers', href: '/stock', icon: ArrowLeftRight },
    { name: 'Sales & Quotes', href: '/sales', icon: ShoppingCart },
    ...(isOwner ? [{ name: 'Shop Branches', href: '/branches', icon: Building2 }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm md:hidden">
        <span className="text-xl font-bold text-blue-600">StockLock</span>
        <button className="p-2 text-gray-500"><Menu size={24} /></button>
      </div>
      {isOwner && (
        <div className="border-b bg-white px-4 py-3 md:hidden">
          <label className="mb-1 block text-xs font-medium text-gray-500">Viewing Shop</label>
          <select
            className="w-full rounded-md border border-gray-200 bg-white px-2 py-2 text-sm text-gray-700 outline-none focus:border-blue-500"
            value={selectedBranchId}
            onChange={(event) => setSelectedBranchId(event.target.value === 'all' ? 'all' : Number(event.target.value))}
          >
            <option value="all">All Branches</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-2xl font-bold text-blue-600">StockLock OS</span>
        </div>
        <div className="flex flex-col p-4">
          <div className="mb-6 rounded-lg bg-gray-50 p-3">
            <div className="font-medium text-gray-900">{user.username}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
            <div className="mt-3 border-t border-gray-200 pt-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                {isOwner ? 'Viewing Shop' : 'Assigned Shop'}
              </label>
              {isOwner ? (
                <select
                  className="w-full rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-700 outline-none focus:border-blue-500"
                  value={selectedBranchId}
                  onChange={(event) => setSelectedBranchId(event.target.value === 'all' ? 'all' : Number(event.target.value))}
                >
                  <option value="all">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-md border border-gray-200 bg-white px-2 py-2 text-xs font-medium text-gray-700">
                  {assignedBranch?.name || 'No branch assigned'}
                </div>
              )}
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-white pb-safe md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center py-3 text-gray-500 hover:text-blue-600"
          >
            <item.icon size={20} />
            <span className="mt-1 text-[10px]">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
