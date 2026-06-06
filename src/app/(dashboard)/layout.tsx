'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ArrowLeftRight, ShoppingCart, LogOut, Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Stock & Transfers', href: '/stock', icon: ArrowLeftRight },
    { name: 'Sales & Quotes', href: '/sales', icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
      {/* Mobile Header */}
      <div className="flex h-16 items-center justify-between bg-white px-4 shadow-sm md:hidden">
        <span className="text-xl font-bold text-blue-600">StockLock</span>
        <button className="p-2 text-gray-500"><Menu size={24} /></button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col border-r bg-white md:flex">
        <div className="flex h-16 items-center border-b px-6">
          <span className="text-2xl font-bold text-blue-600">StockLock OS</span>
        </div>
        <div className="flex flex-col p-4">
          <div className="mb-6 rounded-lg bg-gray-50 p-3">
            <div className="font-medium text-gray-900">{user.username}</div>
            <div className="text-xs text-gray-500">{user.role}</div>
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
