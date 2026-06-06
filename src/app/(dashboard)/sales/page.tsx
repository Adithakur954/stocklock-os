'use client';

import { useState, useEffect } from 'react';
import { db, Product, Branch } from '@/lib/db';
import { useAuthStore } from '@/store/authStore';
import { Receipt, Search } from 'lucide-react';

export default function SalesPage() {
  const user = useAuthStore(state => state.user);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{product: Product, quantity: number, price: number}[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [fittingRequired, setFittingRequired] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const prds = await db.products.toArray();
    setProducts(prds);
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        return current.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1, price: product.sellingPrice }];
    });
  };

  const updateCartItemPrice = (productId: number, newPrice: number) => {
    setCart(current => current.map(item => {
      if (item.product.id === productId) {
        if (newPrice < item.product.minimumPrice) {
          alert(`Warning: Price cannot be lower than the safe minimum of ₹${item.product.minimumPrice}`);
          return { ...item, price: item.product.minimumPrice };
        }
        return { ...item, price: newPrice };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    if (!user?.branchId) {
      alert("Only branch staff can make a sale.");
      return;
    }

    try {
      // Create Customer if not exists
      let customerId: number | undefined;
      if (customerPhone) {
        const existingCust = await db.customers.where('phone').equals(customerPhone).first();
        if (existingCust) {
          customerId = existingCust.id;
        } else {
          customerId = await db.customers.add({ name: customerName, phone: customerPhone, carModel: '' }) as number;
        }
      }

      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create Sale
      const saleId = await db.sales.add({
        customerId,
        branchId: user.branchId,
        totalAmount,
        discount: 0, // Simplified for MVP, handled by custom price per item
        paymentMode,
        fittingRequired,
        createdAt: new Date()
      }) as number;

      // Add Sale Items & Reduce Stock
      for (const item of cart) {
        await db.saleItems.add({
          saleId,
          productId: item.product.id!,
          quantity: item.quantity,
          price: item.price
        });

        // Reduce stock logic
        const stockRecord = await db.stock.where({ productId: item.product.id, branchId: user.branchId }).first();
        if (stockRecord) {
          await db.stock.update(stockRecord.id!, {
            quantity: Math.max(0, stockRecord.quantity - item.quantity),
            lastSoldDate: new Date()
          });
        }
      }

      alert("Sale successful! Stock has been updated.");
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setSearchTerm('');
    } catch (error) {
      console.error("Sale failed", error);
      alert("Failed to process sale.");
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 md:flex-row">
      {/* Product Selection */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Products</h2>
          <div className="mt-3 flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text"
              placeholder="Search to add..."
              className="w-full bg-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filteredProducts.map(product => (
              <button 
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col items-center justify-center rounded-lg border p-4 text-center transition-colors hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</span>
                <span className="mt-2 text-xs text-gray-500">₹{product.sellingPrice}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="flex w-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm md:w-96">
        <div className="border-b p-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Receipt size={20} />
            Current Sale
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-lg border bg-gray-50 p-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-900">{item.product.name}</span>
                <span className="text-sm font-bold text-gray-900">₹{item.price * item.quantity}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Qty: {item.quantity}</span>
                <span className="px-2">|</span>
                <label>Unit ₹:</label>
                <input 
                  type="number" 
                  className="w-20 rounded border px-2 py-1"
                  value={item.price}
                  onChange={(e) => updateCartItemPrice(item.product.id!, Number(e.target.value))}
                />
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center text-sm text-gray-500">Cart is empty.</div>
          )}
        </div>

        <div className="border-t bg-gray-50 p-4 space-y-4">
          <div className="space-y-3">
            <input 
              type="text" placeholder="Customer Name (Optional)" 
              className="w-full rounded-lg border p-2 text-sm"
              value={customerName} onChange={e => setCustomerName(e.target.value)}
            />
            <input 
              type="tel" placeholder="Customer Phone (Optional)" 
              className="w-full rounded-lg border p-2 text-sm"
              value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
            />
            <div className="flex gap-2 text-sm">
              <select 
                className="flex-1 rounded-lg border p-2"
                value={paymentMode} onChange={e => setPaymentMode(e.target.value as any)}
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
              <label className="flex flex-1 items-center gap-2 rounded-lg border bg-white p-2">
                <input type="checkbox" checked={fittingRequired} onChange={e => setFittingRequired(e.target.checked)} />
                Fitting Req.
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 text-lg font-bold text-gray-900">
            <span>Total:</span>
            <span>₹{cartTotal}</span>
          </div>

          <button 
            onClick={handleCheckout}
            className="w-full rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700"
          >
            Complete Sale
          </button>
        </div>
      </div>
    </div>
  );
}
