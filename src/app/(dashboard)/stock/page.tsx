'use client';

import { useState, useEffect } from 'react';
import { db, Stock, Product, Branch } from '@/lib/db';
import { Search, ArrowRightLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function StockPage() {
  const user = useAuthStore(state => state.user);
  const [stockRecords, setStockRecords] = useState<(Stock & { productName: string, branchName: string })[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranchId, setFilterBranchId] = useState<number | 'all'>('all');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const brs = await db.branches.toArray();
    setBranches(brs);
    const prds = await db.products.toArray();
    setProducts(prds);

    const stks = await db.stock.toArray();
    const enrichedStks = stks.map(s => ({
      ...s,
      productName: prds.find(p => p.id === s.productId)?.name || 'Unknown',
      branchName: brs.find(b => b.id === s.branchId)?.name || 'Unknown'
    }));

    // If user is a branch manager/staff, filter by their branch by default, unless they are owner/main warehouse
    if (user?.branchId) {
       setFilterBranchId(user.branchId);
    }
    setStockRecords(enrichedStks);
  }

  const filteredStock = stockRecords.filter(s => {
    const matchesSearch = s.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = filterBranchId === 'all' ? true : s.branchId === Number(filterBranchId);
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Branch Stock</h1>
        <button 
          onClick={() => setIsTransferModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowRightLeft size={16} />
          Request Transfer
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text"
            placeholder="Search stock by product..."
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="rounded-lg border bg-white px-3 py-2 text-sm shadow-sm sm:w-48"
          value={filterBranchId}
          onChange={(e) => setFilterBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          disabled={!!user?.branchId && user.role !== 'Main Branch Manager'} // Lock if normal branch user
        >
          <option value="all">All Branches</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium text-right">Available Qty</th>
                <th className="px-4 py-3 font-medium text-right">Min. Required</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredStock.map(stock => (
                <tr key={stock.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{stock.productName}</td>
                  <td className="px-4 py-3">{stock.branchName}</td>
                  <td className="px-4 py-3 text-right font-medium">{stock.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{stock.minimumRequired}</td>
                  <td className="px-4 py-3">
                    {stock.quantity <= stock.minimumRequired ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Healthy
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStock.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No stock records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isTransferModalOpen && (
        <TransferRequestModal 
          products={products}
          branches={branches}
          userBranchId={user?.branchId}
          onClose={() => setIsTransferModalOpen(false)}
          onSuccess={() => {
            setIsTransferModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function TransferRequestModal({ 
  products, 
  branches, 
  userBranchId,
  onClose, 
  onSuccess 
}: { 
  products: Product[], 
  branches: Branch[], 
  userBranchId?: number,
  onClose: () => void, 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    productId: products[0]?.id || 0,
    fromBranchId: branches[0]?.id || 0,
    quantity: 1,
    urgency: 'Medium' as const,
    note: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userBranchId) {
      alert("Owners cannot request stock directly. Log in as a Branch Manager.");
      return;
    }
    if (formData.fromBranchId === userBranchId) {
      alert("Cannot request stock from your own branch.");
      return;
    }
    
    try {
      await db.transferRequests.add({
        productId: Number(formData.productId),
        fromBranchId: Number(formData.fromBranchId),
        toBranchId: userBranchId,
        quantity: Number(formData.quantity),
        urgency: formData.urgency,
        status: 'Requested',
        note: formData.note,
        requestedAt: new Date(),
        updatedAt: new Date()
      });
      alert('Transfer Request Created!');
      onSuccess();
    } catch (error) {
      console.error('Failed to create transfer request', error);
      alert('Error creating request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Request Stock Transfer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Needed</label>
            <select className="mt-1 w-full rounded-md border p-2" value={formData.productId} onChange={e => setFormData({...formData, productId: Number(e.target.value)})}>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Request From Branch</label>
            <select className="mt-1 w-full rounded-md border p-2" value={formData.fromBranchId} onChange={e => setFormData({...formData, fromBranchId: Number(e.target.value)})}>
              {branches.map(b => (
                <option key={b.id} value={b.id} disabled={b.id === userBranchId}>
                  {b.name} {b.id === userBranchId ? '(Your Branch)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input required type="number" min="1" className="mt-1 w-full rounded-md border p-2" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Urgency</label>
              <select className="mt-1 w-full rounded-md border p-2" value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value as any})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
            <input type="text" placeholder="e.g. Customer waiting" className="mt-1 w-full rounded-md border p-2" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}
