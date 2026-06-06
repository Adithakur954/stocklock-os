'use client';

import { useState, useEffect } from 'react';
import { db, Product, Category } from '@/lib/db';
import { Plus, Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<(Product & { categoryName?: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const cats = await db.categories.toArray();
    setCategories(cats);
    
    const prods = await db.products.toArray();
    const prodsWithCats = prods.map(p => ({
      ...p,
      categoryName: cats.find(c => c.id === p.categoryId)?.name || 'Unknown'
    }));
    setProducts(prodsWithCats);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Master</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 shadow-sm">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text"
          placeholder="Search products by name or brand..."
          className="w-full bg-transparent outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Brand</th>
                <th className="px-4 py-3 font-medium">Price (Sell)</th>
                <th className="px-4 py-3 font-medium">Cars</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3">{product.categoryName}</td>
                  <td className="px-4 py-3">{product.brand}</td>
                  <td className="px-4 py-3">₹{product.sellingPrice}</td>
                  <td className="px-4 py-3 text-xs">{product.compatibleCars}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <AddProductModal 
          categories={categories} 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => {
            setIsAddModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function AddProductModal({ categories, onClose, onSuccess }: { categories: Category[], onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || 0,
    brand: '',
    model: '',
    compatibleCars: '',
    purchasePrice: 0,
    sellingPrice: 0,
    minimumPrice: 0,
    stockUnit: 'Piece'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await db.products.add({
        ...formData,
        categoryId: Number(formData.categoryId),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        minimumPrice: Number(formData.minimumPrice)
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to add product', error);
      alert('Error adding product. Check if it already exists.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-bold">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input required type="text" className="mt-1 w-full rounded-md border p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select className="mt-1 w-full rounded-md border p-2" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <input required type="text" className="mt-1 w-full rounded-md border p-2" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input type="text" className="mt-1 w-full rounded-md border p-2" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Compatible Cars</label>
            <input type="text" placeholder="e.g. Swift, Baleno" className="mt-1 w-full rounded-md border p-2" value={formData.compatibleCars} onChange={e => setFormData({...formData, compatibleCars: e.target.value})} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase ₹</label>
              <input required type="number" className="mt-1 w-full rounded-md border p-2" value={formData.purchasePrice || ''} onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Selling ₹</label>
              <input required type="number" className="mt-1 w-full rounded-md border p-2" value={formData.sellingPrice || ''} onChange={e => setFormData({...formData, sellingPrice: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Sell ₹</label>
              <input required type="number" className="mt-1 w-full rounded-md border p-2" value={formData.minimumPrice || ''} onChange={e => setFormData({...formData, minimumPrice: Number(e.target.value)})} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}
