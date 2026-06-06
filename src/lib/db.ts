import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  username: string;
  role: 'Owner' | 'Main Branch Manager' | 'Branch Manager' | 'Sales Staff' | 'Fitter' | 'Warehouse Staff';
  branchId?: number; // Null for owner
}

export interface Branch {
  id?: number;
  name: string;
  type: 'Main' | 'Branch';
  area?: string;
  phone?: string;
}

export interface Category {
  id?: number;
  name: string;
}

export interface Supplier {
  id?: number;
  name: string;
  phone: string;
}

export interface Product {
  id?: number;
  name: string;
  categoryId: number;
  brand: string;
  model: string;
  compatibleCars: string;
  purchasePrice: number;
  sellingPrice: number;
  minimumPrice: number;
  stockUnit: string;
  supplierId?: number;
}

export interface Stock {
  id?: number;
  productId: number;
  branchId: number;
  quantity: number;
  minimumRequired: number;
  lastSoldDate?: Date;
}

export interface TransferRequest {
  id?: number;
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Requested' | 'Accepted' | 'Packed' | 'Dispatched' | 'Received' | 'Rejected' | 'Cancelled';
  note?: string;
  requestedAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  carModel: string;
}

export interface Quote {
  id?: number;
  customerId: number;
  productId: number;
  quotedPrice: number;
  finalPrice: number;
  status: 'Open' | 'Won' | 'Lost';
  followUpDate?: Date;
  createdAt: Date;
}

export interface Sale {
  id?: number;
  customerId?: number;
  branchId: number;
  totalAmount: number;
  discount: number;
  paymentMode: 'Cash' | 'Card' | 'UPI';
  fittingRequired: boolean;
  createdAt: Date;
}

export interface SaleItem {
  id?: number;
  saleId: number;
  productId: number;
  quantity: number;
  price: number;
}

export class StockLockDB extends Dexie {
  users!: Table<User, number>;
  branches!: Table<Branch, number>;
  categories!: Table<Category, number>;
  suppliers!: Table<Supplier, number>;
  products!: Table<Product, number>;
  stock!: Table<Stock, number>;
  transferRequests!: Table<TransferRequest, number>;
  customers!: Table<Customer, number>;
  quotes!: Table<Quote, number>;
  sales!: Table<Sale, number>;
  saleItems!: Table<SaleItem, number>;

  constructor() {
    super('StockLockDB');
    this.version(1).stores({
      users: '++id, username, role, branchId',
      branches: '++id, name, type',
      categories: '++id, name',
      suppliers: '++id, name',
      products: '++id, name, categoryId, brand',
      stock: '++id, productId, branchId, quantity',
      transferRequests: '++id, productId, fromBranchId, toBranchId, status',
      customers: '++id, phone, name',
      quotes: '++id, customerId, status',
      sales: '++id, branchId, createdAt',
      saleItems: '++id, saleId, productId'
    });
  }
}

export const db = new StockLockDB();

// Seeder logic for MVP
export async function seedDatabase() {
  const branchesCount = await db.branches.count();
  if (branchesCount === 0) {
    console.log('Seeding initial data...');
    // Add Branches
    const mainId = await db.branches.add({ name: 'Main Branch (Hub)', type: 'Main', area: 'Naraina', phone: '98100 11111' });
    const branchAId = await db.branches.add({ name: 'Pitampura', type: 'Branch', area: 'Pitampura', phone: '98100 22222' });
    const branchBId = await db.branches.add({ name: 'Rohini', type: 'Branch', area: 'Rohini', phone: '98100 33333' });
    const branchCId = await db.branches.add({ name: 'Dwarka', type: 'Branch', area: 'Dwarka', phone: '98100 44444' });
    const branchDId = await db.branches.add({ name: 'Janakpuri', type: 'Branch', area: 'Janakpuri', phone: '98100 55555' });
    const branchEId = await db.branches.add({ name: 'Model Town', type: 'Branch', area: 'Model Town', phone: '98100 66666' });
    const branchFId = await db.branches.add({ name: 'Lajpat Nagar', type: 'Branch', area: 'Lajpat Nagar', phone: '98100 77777' });

    // Add Users
    await db.users.bulkAdd([
      { username: 'owner', role: 'Owner' },
      { username: 'managerA', role: 'Branch Manager', branchId: branchAId as number },
      { username: 'managerB', role: 'Branch Manager', branchId: branchBId as number },
    ]);

    // Add Categories
    const speakerCatId = await db.categories.add({ name: 'Speaker' });
    const androidCatId = await db.categories.add({ name: 'Android Player' });

    // Add Products
    const prod1Id = await db.products.add({
      name: 'Sony Speaker XS-FB162E',
      categoryId: speakerCatId as number,
      brand: 'Sony',
      model: '6.5 inch',
      compatibleCars: 'Swift, Baleno, Creta',
      purchasePrice: 2400,
      sellingPrice: 3500,
      minimumPrice: 3100,
      stockUnit: 'Piece'
    });
    const prod2Id = await db.products.add({
      name: 'Android Player 9 inch',
      categoryId: androidCatId as number,
      brand: 'Generic',
      model: '9 inch 2GB/32GB',
      compatibleCars: 'Universal',
      purchasePrice: 8000,
      sellingPrice: 12500,
      minimumPrice: 11500,
      stockUnit: 'Piece'
    });

    // Add Initial Stock
    await db.stock.bulkAdd([
      { productId: prod1Id as number, branchId: mainId as number, quantity: 12, minimumRequired: 5 },
      { productId: prod1Id as number, branchId: branchAId as number, quantity: 2, minimumRequired: 3 },
      { productId: prod1Id as number, branchId: branchBId as number, quantity: 0, minimumRequired: 2 },
      { productId: prod1Id as number, branchId: branchCId as number, quantity: 3, minimumRequired: 2 },
      { productId: prod1Id as number, branchId: branchDId as number, quantity: 1, minimumRequired: 2 },
      { productId: prod1Id as number, branchId: branchEId as number, quantity: 5, minimumRequired: 2 },
      { productId: prod1Id as number, branchId: branchFId as number, quantity: 2, minimumRequired: 2 },
      { productId: prod2Id as number, branchId: mainId as number, quantity: 8, minimumRequired: 3 },
      { productId: prod2Id as number, branchId: branchAId as number, quantity: 1, minimumRequired: 2 },
      { productId: prod2Id as number, branchId: branchBId as number, quantity: 4, minimumRequired: 2 },
      { productId: prod2Id as number, branchId: branchCId as number, quantity: 2, minimumRequired: 2 },
      { productId: prod2Id as number, branchId: branchDId as number, quantity: 0, minimumRequired: 1 },
      { productId: prod2Id as number, branchId: branchEId as number, quantity: 3, minimumRequired: 2 },
      { productId: prod2Id as number, branchId: branchFId as number, quantity: 1, minimumRequired: 1 },
    ]);

    console.log('Database seeded successfully.');
  }
}
