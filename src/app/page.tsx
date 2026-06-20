import React from 'react'
import { AlertCircle, Layers, CheckCircle, PackageSearch } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

// Note: We removed 'use client' because this is now a highly secure Server Component

export default async function InventoryMasterPage() {
  // 1. Connect to the live Supabase database
  const supabase = await createClient()

  // 2. Fetch live products and their inventory levels from PostgreSQL
  // We use a join here to get the product details AND its stock quantity in one go
  const { data: stockItems, error } = await supabase
    .from('inventory')
    .select(`
      quantity,
      products (
        sku,
        name,
        category,
        selling_price
      )
    `)
    .order('quantity', { ascending: true })

  // Fallback if the database is empty or still setting up
  if (error || !stockItems) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-500 space-y-4">
        <PackageSearch size={48} className="text-neutral-300" />
        <p className="text-lg font-medium text-neutral-900">No inventory data found.</p>
        <p className="text-sm">Please ensure your Supabase tables are seeded with products.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Live Inventory Ledger</h1>
          <p className="text-sm text-neutral-500">Real-time stock configurations pulled directly from the database.</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-700 font-semibold">
                <th className="p-4 pl-6">Product Details</th>
                <th className="p-4 text-center">Category</th>
                <th className="p-4 text-center">Selling Price</th>
                <th className="p-4 text-center">Live Stock Qty</th>
                <th className="p-4 pr-6 text-right">System Health Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {stockItems.map((item, index) => {
                const product = Array.isArray(item.products) ? item.products[0] : item.products;
                const isLowStock = item.quantity <= 3;

                return (
                  <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-neutral-900">{product?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        SKU Reference: <span className="font-mono tracking-wider font-semibold uppercase">{product?.sku || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-neutral-500">
                      <span className="bg-neutral-100 px-2 py-1 rounded-md text-xs">{product?.category || 'Uncategorized'}</span>
                    </td>
                    <td className="p-4 text-center font-bold text-neutral-900">
                      ₹{product?.selling_price?.toLocaleString() || '0'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`font-bold ${isLowStock ? 'text-amber-600' : 'text-neutral-900'}`}>
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                          <AlertCircle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                          <CheckCircle size={12} /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
