'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Package, Plus, Users } from 'lucide-react';
import { Branch, Product, Stock, User, db } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';

type BranchSummary = Branch & {
  usersCount: number;
  stockQuantity: number;
  stockValue: number;
};

export default function BranchesPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Branch' as Branch['type'],
    area: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    const [allBranches, allUsers, allStock, allProducts] = await Promise.all([
      db.branches.toArray(),
      db.users.toArray(),
      db.stock.toArray(),
      db.products.toArray(),
    ]);

    setBranches(allBranches);
    setUsers(allUsers);
    setStock(allStock);
    setProducts(allProducts);
  }, []);

  useEffect(() => {
    if (user && user.role !== 'Owner') {
      router.push('/dashboard');
    }
  }, [router, user]);

  useEffect(() => {
    if (user?.role === 'Owner') {
      void Promise.resolve().then(loadData);
    }
  }, [loadData, user]);

  const branchSummaries = useMemo<BranchSummary[]>(() => {
    return branches.map((branch) => {
      const branchStock = stock.filter((record) => record.branchId === branch.id);

      return {
        ...branch,
        usersCount: users.filter((branchUser) => branchUser.branchId === branch.id).length,
        stockQuantity: branchStock.reduce((sum, record) => sum + record.quantity, 0),
        stockValue: branchStock.reduce((sum, record) => {
          const product = products.find((item) => item.id === record.productId);
          return sum + (product?.purchasePrice || 0) * record.quantity;
        }, 0),
      };
    });
  }, [branches, products, stock, users]);

  const totalStockValue = branchSummaries.reduce((sum, branch) => sum + branch.stockValue, 0);
  const totalStockQuantity = branchSummaries.reduce((sum, branch) => sum + branch.stockQuantity, 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const branchName = formData.name.trim();
    if (!branchName) return;

    setIsSaving(true);
    try {
      const branchId = await db.branches.add({
        name: branchName,
        type: formData.type,
        area: formData.area.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      });

      if (products.length > 0) {
        await db.stock.bulkAdd(
          products.map((product) => ({
            productId: product.id!,
            branchId: branchId as number,
            quantity: 0,
            minimumRequired: 1,
          }))
        );
      }

      setFormData({ name: '', type: 'Branch', area: '', phone: '' });
      await loadData();
    } catch (error) {
      console.error('Failed to add branch', error);
      alert('Error adding branch. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || user.role !== 'Owner') return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Branches</h1>
          <p className="mt-1 text-sm text-gray-500">Owner-only multi-shop branch control.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Shops</h3>
            <Building2 size={20} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{branches.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Stock Units</h3>
            <Package size={20} className="text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalStockQuantity}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Stock Value</h3>
            <Users size={20} className="text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">Rs {totalStockValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Branches</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900">
                <tr>
                  <th className="px-4 py-3 font-medium">Shop</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Area</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium text-right">Users</th>
                  <th className="px-4 py-3 font-medium text-right">Stock Qty</th>
                  <th className="px-4 py-3 font-medium text-right">Stock Value</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {branchSummaries.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{branch.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        branch.type === 'Main'
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20'
                          : 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-600/10'
                      }`}>
                        {branch.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{branch.area || '-'}</td>
                    <td className="px-4 py-3">{branch.phone || '-'}</td>
                    <td className="px-4 py-3 text-right">{branch.usersCount}</td>
                    <td className="px-4 py-3 text-right">{branch.stockQuantity}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      Rs {branch.stockValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="h-fit rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Plus size={18} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Add Shop Branch</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                required
                type="text"
                className="mt-1 w-full rounded-md border p-2 text-sm"
                placeholder="e.g. Dwarka"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Type</label>
              <select
                className="mt-1 w-full rounded-md border p-2 text-sm"
                value={formData.type}
                onChange={(event) => setFormData({ ...formData, type: event.target.value as Branch['type'] })}
              >
                <option value="Branch">Branch</option>
                <option value="Main">Main</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Area</label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border p-2 text-sm"
                placeholder="e.g. Janakpuri"
                value={formData.area}
                onChange={(event) => setFormData({ ...formData, area: event.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                className="mt-1 w-full rounded-md border p-2 text-sm"
                placeholder="e.g. 98100 55555"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <Plus size={16} />
            {isSaving ? 'Adding...' : 'Add Branch'}
          </button>
        </form>
      </div>
    </div>
  );
}
