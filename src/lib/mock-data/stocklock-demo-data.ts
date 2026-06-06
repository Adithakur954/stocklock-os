import { Alert } from '@/lib/types/alerts';
import { Approval, AuditLog } from '@/lib/types/audit';
import { Bill, BillItem, CreditNote, Payment, ReturnItem, ReturnRecord } from '@/lib/types/billing';
import { Branch, Organization, User } from '@/lib/types/core';
import { Customer } from '@/lib/types/customer';
import { EodSession } from '@/lib/types/eod';
import {
  Brand,
  Category,
  InventoryBalance,
  Product,
  StockLedger,
  StockRequest,
  StockRequestResponse,
  StockTransfer,
  StockTransferItem,
} from '@/lib/types/inventory';
import { PurchaseBill, PurchaseItem, PurchaseOrder, Vendor } from '@/lib/types/purchase';
import { ServiceJob, StaffRequest, StaffStatus } from '@/lib/types/staff';
import { BusinessSettings } from '@/lib/types/settings';
import { SerialNumber, WarrantyClaim } from '@/lib/types/warranty';

export interface DemoDatabase {
  organization: Organization;
  branches: Branch[];
  users: User[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  inventoryBalances: InventoryBalance[];
  stockLedger: StockLedger[];
  stockRequests: StockRequest[];
  stockRequestResponses: StockRequestResponse[];
  stockTransfers: StockTransfer[];
  stockTransferItems: StockTransferItem[];
  customers: Customer[];
  bills: Bill[];
  billItems: BillItem[];
  payments: Payment[];
  returns: ReturnRecord[];
  returnItems: ReturnItem[];
  creditNotes: CreditNote[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  purchaseBills: PurchaseBill[];
  purchaseItems: PurchaseItem[];
  staffStatuses: StaffStatus[];
  staffRequests: StaffRequest[];
  serviceJobs: ServiceJob[];
  serialNumbers: SerialNumber[];
  warrantyClaims: WarrantyClaim[];
  approvals: Approval[];
  eodSessions: EodSession[];
  auditLogs: AuditLog[];
  alerts: Alert[];
  settings: BusinessSettings;
}

const orgId = 'org_kalra';
const today = '2026-06-06';

export const demoOrganization: Organization = {
  id: orgId,
  name: 'Kalra Car Accessories',
  businessType: 'Car accessories retail and installation',
  gstNumber: '07AABCK1234M1Z5',
  ownerName: 'Raj Kalra',
  phone: '9810011111',
  email: 'owner@kalracars.example',
  address: 'Main Market, Naraina, New Delhi',
  createdAt: '2024-01-01T09:00:00.000Z',
  status: 'ACTIVE',
};

export const demoBranches: Branch[] = [
  {
    id: 'br_main',
    organizationId: orgId,
    name: 'Main Branch',
    code: 'MAIN',
    phone: '9810011111',
    address: 'A-12 Main Market, Naraina',
    city: 'New Delhi',
    managerUserId: 'usr_amit',
    isMainBranch: true,
    status: 'ACTIVE',
  },
  {
    id: 'br_city',
    organizationId: orgId,
    name: 'City Branch',
    code: 'CITY',
    phone: '9810022222',
    address: 'C-4 Karol Bagh',
    city: 'New Delhi',
    managerUserId: 'usr_karan',
    isMainBranch: false,
    status: 'ACTIVE',
  },
  {
    id: 'br_workshop',
    organizationId: orgId,
    name: 'Workshop Branch',
    code: 'WORK',
    phone: '9810033333',
    address: 'Plot 18 Industrial Area',
    city: 'Gurugram',
    managerUserId: 'usr_pawan',
    isMainBranch: false,
    status: 'ACTIVE',
  },
  {
    id: 'br_airport',
    organizationId: orgId,
    name: 'Airport Road Branch',
    code: 'AIR',
    phone: '9810044444',
    address: 'Airport Road Market',
    city: 'Gurugram',
    managerUserId: 'usr_ramesh',
    isMainBranch: false,
    status: 'ACTIVE',
  },
];

export const demoUsers: User[] = [
  { id: 'usr_raj', organizationId: orgId, branchId: 'br_main', name: 'Raj Kalra', phone: '9810000001', email: 'raj@kalracars.example', role: 'OWNER', status: 'ACTIVE', createdAt: '2024-01-01T09:00:00.000Z' },
  { id: 'usr_amit', organizationId: orgId, branchId: 'br_main', name: 'Amit Sharma', phone: '9810000002', email: 'amit@kalracars.example', role: 'BRANCH_MANAGER', status: 'ACTIVE', createdAt: '2024-01-02T09:00:00.000Z' },
  { id: 'usr_neha', organizationId: orgId, branchId: 'br_main', name: 'Neha Jain', phone: '9810000003', email: 'neha@kalracars.example', role: 'ACCOUNTANT', status: 'ACTIVE', createdAt: '2024-01-03T09:00:00.000Z' },
  { id: 'usr_imran', organizationId: orgId, branchId: 'br_city', name: 'Imran Khan', phone: '9810000004', email: 'imran@kalracars.example', role: 'SALES_STAFF', status: 'ACTIVE', createdAt: '2024-01-04T09:00:00.000Z' },
  { id: 'usr_pawan', organizationId: orgId, branchId: 'br_workshop', name: 'Pawan Meena', phone: '9810000005', email: 'pawan@kalracars.example', role: 'FITTER', status: 'ACTIVE', createdAt: '2024-01-05T09:00:00.000Z' },
  { id: 'usr_suresh', organizationId: orgId, branchId: 'br_workshop', name: 'Suresh Gurjar', phone: '9810000006', email: 'suresh@kalracars.example', role: 'INSTALLER', status: 'ACTIVE', createdAt: '2024-01-06T09:00:00.000Z' },
  { id: 'usr_ramesh', organizationId: orgId, branchId: 'br_airport', name: 'Ramesh', phone: '9810000007', email: 'ramesh@kalracars.example', role: 'STOCK_STAFF', status: 'ACTIVE', createdAt: '2024-01-07T09:00:00.000Z' },
  { id: 'usr_karan', organizationId: orgId, branchId: 'br_city', name: 'Karan', phone: '9810000008', email: 'karan@kalracars.example', role: 'BRANCH_MANAGER', status: 'ACTIVE', createdAt: '2024-01-08T09:00:00.000Z' },
];

export const demoCategories: Category[] = [
  'Audio',
  'Lighting',
  'Seat Covers',
  'Alloy Wheels',
  'Cameras',
  'Wiring',
  'Perfume',
  'Security',
  'General Accessories',
  'Installation Services',
].map((name, index) => ({ id: `cat_${index + 1}`, organizationId: orgId, name }));

export const demoBrands: Brand[] = ['Pioneer', 'Sony', 'Blaupunkt', 'Generic', 'AutoGold', 'Philips', 'Uno Minda', 'JBL'].map((name, index) => ({
  id: `brand_${index + 1}`,
  organizationId: orgId,
  name,
}));

const productSeed: Array<[string, string, string, string, number, number, number, number, number, boolean, boolean, string[]]> = [
  ['Android Stereo 9 inch', 'ST-AND-09', 'cat_1', 'brand_1', 8200, 12500, 14999, 3, 5, true, true, ['Swift', 'Baleno', 'Creta']],
  ['Android Stereo 10 inch', 'ST-AND-10', 'cat_1', 'brand_3', 10400, 15800, 18999, 2, 4, true, true, ['Fortuner', 'Thar', 'Scorpio']],
  ['Sony Speaker Set', 'AUD-SONY-SPK', 'cat_1', 'brand_2', 2400, 3500, 4499, 4, 8, false, true, ['Universal']],
  ['JBL Bass Tube', 'AUD-JBL-BASS', 'cat_1', 'brand_8', 6200, 9500, 11999, 2, 3, true, true, ['Universal']],
  ['Alloy Wheel Set 16 inch', 'WHE-ALLOY-16', 'cat_4', 'brand_5', 18200, 26500, 31999, 1, 2, false, false, ['Creta', 'Seltos', 'City']],
  ['LED Headlight H4', 'LGT-H4-LED', 'cat_2', 'brand_6', 900, 1600, 1999, 5, 12, false, true, ['Alto', 'WagonR', 'Swift']],
  ['LED Fog Lamp', 'LGT-FOG-LED', 'cat_2', 'brand_7', 1150, 2200, 2799, 4, 10, false, true, ['Universal']],
  ['Reverse Camera', 'CAM-REV-HD', 'cat_5', 'brand_4', 750, 1500, 1999, 6, 15, false, true, ['Universal']],
  ['Dash Camera', 'CAM-DASH-2K', 'cat_5', 'brand_3', 2700, 5200, 6999, 3, 6, true, true, ['Universal']],
  ['Seat Cover Premium', 'SEAT-PREM', 'cat_3', 'brand_5', 4200, 7600, 9999, 2, 4, false, false, ['Swift', 'Baleno', 'Creta']],
  ['Floor Mat 7D', 'MAT-7D', 'cat_9', 'brand_4', 1100, 2400, 2999, 4, 10, false, false, ['Universal']],
  ['Car Perfume', 'GEN-PERFUME', 'cat_7', 'brand_4', 85, 250, 399, 20, 40, false, false, ['Universal']],
  ['Wiring Kit', 'WIRE-KIT', 'cat_6', 'brand_7', 350, 850, 999, 10, 20, false, false, ['Universal']],
  ['Central Locking Kit', 'SEC-CLOCK', 'cat_8', 'brand_7', 1450, 2900, 3499, 3, 8, false, true, ['Universal']],
  ['Parking Sensor', 'SEC-PARK-SENSOR', 'cat_8', 'brand_4', 1200, 2500, 2999, 4, 8, false, true, ['Universal']],
  ['Car Charger', 'GEN-CHARGER', 'cat_9', 'brand_4', 180, 450, 699, 8, 18, false, false, ['Universal']],
  ['Roof Light', 'LGT-ROOF', 'cat_2', 'brand_6', 650, 1400, 1899, 2, 5, false, true, ['Thar', 'Scorpio']],
  ['Steering Cover', 'GEN-STEER-COVER', 'cat_9', 'brand_5', 240, 650, 999, 6, 12, false, false, ['Universal']],
  ['Number Plate Frame', 'GEN-NPF', 'cat_9', 'brand_4', 90, 250, 399, 15, 30, false, false, ['Universal']],
  ['Installation Service', 'SVC-INSTALL', 'cat_10', 'brand_4', 0, 900, 1200, 0, 0, false, false, ['Universal']],
];

export const demoProducts: Product[] = productSeed.map((item, index) => ({
  id: `prd_${index + 1}`,
  organizationId: orgId,
  name: item[0],
  sku: item[1],
  barcode: `89011110${String(index + 1).padStart(3, '0')}`,
  categoryId: item[2],
  brandId: item[3],
  imageUrl: `/next.svg`,
  description: `${item[0]} for fast retail billing and fitment workflows.`,
  compatibleVehicles: item[11],
  unit: index === 19 ? 'Service' : 'Piece',
  taxRate: 18,
  purchaseCost: item[4],
  sellingPrice: item[5],
  mrp: item[6],
  minStock: item[7],
  reorderLevel: item[8],
  isSerialized: item[9],
  hasWarranty: item[10],
  warrantyMonths: item[10] ? 12 : 0,
  status: 'ACTIVE',
  createdAt: '2026-05-01T09:00:00.000Z',
  updatedAt: '2026-06-06T09:00:00.000Z',
  lastSoldAt: index === 4 ? '2026-02-01T09:00:00.000Z' : '2026-06-05T16:00:00.000Z',
}));

const branchStockMatrix: Record<string, number[]> = {
  br_main: [7, 4, 16, 3, 1, 22, 9, 30, 6, 4, 18, 80, 35, 9, 12, 24, 3, 15, 50, 0],
  br_city: [1, 0, 4, 1, 0, 5, 2, 3, 1, 2, 5, 12, 6, 1, 4, 6, 0, 4, 12, 0],
  br_workshop: [2, 1, 8, 0, 1, 3, 5, 8, 2, 1, 6, 10, 25, 2, 2, 3, 1, 5, 9, 0],
  br_airport: [0, 1, 3, 2, 0, 4, 1, 5, 1, 0, 3, 8, 4, 0, 1, 5, 0, 2, 8, 0],
};

export const demoInventoryBalances: InventoryBalance[] = Object.entries(branchStockMatrix).flatMap(([branchId, quantities]) =>
  quantities.map((quantityOnHand, index) => ({
    id: `inv_${branchId}_${index + 1}`,
    organizationId: orgId,
    branchId,
    productId: `prd_${index + 1}`,
    quantityOnHand,
    quantityReserved: index === 0 && branchId === 'br_city' ? 1 : 0,
    quantityAvailable: quantityOnHand - (index === 0 && branchId === 'br_city' ? 1 : 0),
    lastUpdatedAt: '2026-06-06T10:00:00.000Z',
  }))
);

export const demoStockLedger: StockLedger[] = [
  { id: 'led_1', organizationId: orgId, branchId: 'br_main', productId: 'prd_1', movementType: 'OPENING_STOCK', quantityChange: 8, quantityBefore: 0, quantityAfter: 8, referenceType: 'OPENING', referenceId: 'open_1', reason: 'Opening stock import', createdByUserId: 'usr_amit', createdAt: '2026-06-01T09:00:00.000Z' },
  { id: 'led_2', organizationId: orgId, branchId: 'br_city', productId: 'prd_1', movementType: 'SALE_OUTWARD', quantityChange: -1, quantityBefore: 2, quantityAfter: 1, referenceType: 'BILL', referenceId: 'bill_1', reason: 'Bill finalized', createdByUserId: 'usr_imran', createdAt: '2026-06-06T11:30:00.000Z' },
  { id: 'led_3', organizationId: orgId, branchId: 'br_main', productId: 'prd_8', movementType: 'TRANSFER_OUT', quantityChange: -2, quantityBefore: 32, quantityAfter: 30, referenceType: 'TRANSFER', referenceId: 'tr_2', reason: 'Transfer dispatched to City Branch', createdByUserId: 'usr_ramesh', createdAt: '2026-06-06T12:10:00.000Z' },
  { id: 'led_4', organizationId: orgId, branchId: 'br_workshop', productId: 'prd_13', movementType: 'SERVICE_CONSUMPTION', quantityChange: -2, quantityBefore: 27, quantityAfter: 25, referenceType: 'SERVICE_JOB', referenceId: 'job_1', reason: 'Used in wiring job', createdByUserId: 'usr_suresh', createdAt: '2026-06-06T13:40:00.000Z' },
  { id: 'led_5', organizationId: orgId, branchId: 'br_airport', productId: 'prd_14', movementType: 'MANUAL_ADJUSTMENT', quantityChange: -1, quantityBefore: 1, quantityAfter: 0, referenceType: 'ADJUSTMENT', referenceId: 'adj_1', reason: 'Damaged kit found during shelf audit', createdByUserId: 'usr_ramesh', createdAt: '2026-06-06T14:00:00.000Z', approvalId: 'appr_4' },
];

export const demoStockRequests: StockRequest[] = [
  { id: 'req_1', organizationId: orgId, requestingBranchId: 'br_city', requestedByUserId: 'usr_imran', productId: 'prd_1', requestedQty: 1, urgency: 'CUSTOMER_WAITING', note: 'Customer waiting for Creta 9 inch stereo', status: 'RESPONSE_RECEIVED', createdAt: '2026-06-06T12:00:00.000Z', expiresAt: '2026-06-06T18:00:00.000Z' },
  { id: 'req_2', organizationId: orgId, requestingBranchId: 'br_airport', requestedByUserId: 'usr_ramesh', productId: 'prd_14', requestedQty: 2, urgency: 'URGENT', note: 'Central locking kit low at Airport Road', status: 'OPEN', createdAt: '2026-06-06T10:30:00.000Z', expiresAt: '2026-06-07T10:30:00.000Z' },
];

export const demoStockRequestResponses: StockRequestResponse[] = [
  { id: 'res_1', requestId: 'req_1', respondingBranchId: 'br_main', respondedByUserId: 'usr_amit', availabilityStatus: 'AVAILABLE', availableQty: 7, note: 'Can dispatch in 20 minutes', priceNote: 'Standard transfer', conditionNote: 'Fresh piece sealed', createdAt: '2026-06-06T12:05:00.000Z' },
  { id: 'res_2', requestId: 'req_1', respondingBranchId: 'br_workshop', respondedByUserId: 'usr_suresh', availabilityStatus: 'PARTIAL_AVAILABLE', availableQty: 1, note: 'Last piece transfer. Replacement required for source branch.', conditionNote: 'Display piece', createdAt: '2026-06-06T12:08:00.000Z' },
];

export const demoStockTransfers: StockTransfer[] = [
  { id: 'tr_1', organizationId: orgId, sourceBranchId: 'br_main', destinationBranchId: 'br_airport', requestedByUserId: 'usr_ramesh', status: 'READY', dispatchNote: 'Packing pending', createdAt: '2026-06-06T10:45:00.000Z' },
  { id: 'tr_2', organizationId: orgId, sourceBranchId: 'br_main', destinationBranchId: 'br_city', requestedByUserId: 'usr_imran', dispatchedByUserId: 'usr_ramesh', status: 'DISPATCHED', dispatchNote: 'Sent with driver Mahesh', createdAt: '2026-06-06T12:00:00.000Z', dispatchedAt: '2026-06-06T12:10:00.000Z' },
  { id: 'tr_3', organizationId: orgId, sourceBranchId: 'br_workshop', destinationBranchId: 'br_main', requestedByUserId: 'usr_amit', dispatchedByUserId: 'usr_suresh', receivedByUserId: 'usr_amit', status: 'RECEIVED', dispatchNote: 'Workshop extra stock', receiveNote: 'Received in good condition', createdAt: '2026-06-05T17:00:00.000Z', dispatchedAt: '2026-06-05T17:20:00.000Z', receivedAt: '2026-06-05T18:15:00.000Z' },
];

export const demoStockTransferItems: StockTransferItem[] = [
  { id: 'tri_1', transferId: 'tr_1', productId: 'prd_14', qty: 2, sourceQtyBefore: 9, sourceQtyAfter: 7, destinationQtyBefore: 0, destinationQtyAfter: 2 },
  { id: 'tri_2', transferId: 'tr_2', productId: 'prd_8', qty: 2, sourceQtyBefore: 32, sourceQtyAfter: 30, destinationQtyBefore: 3, destinationQtyAfter: 5 },
  { id: 'tri_3', transferId: 'tr_3', productId: 'prd_13', qty: 5, sourceQtyBefore: 30, sourceQtyAfter: 25, destinationQtyBefore: 30, destinationQtyAfter: 35 },
];

export const demoCustomers: Customer[] = [
  { id: 'cust_1', organizationId: orgId, name: 'Vikram Malhotra', phone: '9990011111', email: 'vikram@example.com', vehicleNumber: 'DL8C AX 9090', vehicleModel: 'Hyundai Creta', address: 'Pitampura', tags: ['VIP'], totalSpend: 86500, lastVisitAt: '2026-06-06T11:00:00.000Z', creditLimit: 25000, outstandingBalance: 11800, createdAt: '2025-11-01T09:00:00.000Z' },
  { id: 'cust_2', organizationId: orgId, name: 'Anjali Kapoor', phone: '9990022222', vehicleNumber: 'HR26 DK 1234', vehicleModel: 'Kia Seltos', tags: ['Fleet'], totalSpend: 42500, lastVisitAt: '2026-06-05T15:00:00.000Z', creditLimit: 0, outstandingBalance: 0, createdAt: '2026-01-12T09:00:00.000Z' },
  { id: 'cust_3', organizationId: orgId, name: 'Rohit Bansal', phone: '9990033333', vehicleNumber: 'DL3C BE 4000', vehicleModel: 'Maruti Swift', tags: [], totalSpend: 13200, lastVisitAt: '2026-06-04T13:20:00.000Z', creditLimit: 10000, outstandingBalance: 3200, createdAt: '2026-03-05T09:00:00.000Z' },
];

export const demoBills: Bill[] = [
  { id: 'bill_1', organizationId: orgId, branchId: 'br_city', billNumber: 'KCA-CITY-0001', customerId: 'cust_1', businessDate: today, billType: 'MIXED', status: 'PRINTED', subtotal: 11800, discountTotal: 500, taxTotal: 2034, grandTotal: 13334, paidAmount: 0, dueAmount: 13334, paymentStatus: 'UNPAID', createdByUserId: 'usr_imran', printedAt: '2026-06-06T11:35:00.000Z', createdAt: '2026-06-06T11:20:00.000Z', updatedAt: '2026-06-06T11:35:00.000Z', lockedByBillingGuard: true },
  { id: 'bill_2', organizationId: orgId, branchId: 'br_main', billNumber: 'KCA-MAIN-0002', customerId: 'cust_2', businessDate: today, billType: 'SALE', status: 'PAID', subtotal: 25200, discountTotal: 1200, taxTotal: 4320, grandTotal: 28320, paidAmount: 28320, dueAmount: 0, paymentStatus: 'PAID', createdByUserId: 'usr_amit', printedAt: '2026-06-06T10:15:00.000Z', finalizedAt: '2026-06-06T10:20:00.000Z', createdAt: '2026-06-06T10:00:00.000Z', updatedAt: '2026-06-06T10:20:00.000Z', lockedByBillingGuard: true },
  { id: 'bill_3', organizationId: orgId, branchId: 'br_airport', billNumber: 'KCA-AIR-0003', customerId: 'cust_3', businessDate: today, billType: 'SALE', status: 'DRAFT', subtotal: 3200, discountTotal: 0, taxTotal: 576, grandTotal: 3776, paidAmount: 0, dueAmount: 3776, paymentStatus: 'UNPAID', createdByUserId: 'usr_ramesh', createdAt: '2026-06-06T09:00:00.000Z', updatedAt: '2026-06-06T09:00:00.000Z', lockedByBillingGuard: false },
  { id: 'bill_4', organizationId: orgId, branchId: 'br_workshop', billNumber: 'KCA-WORK-0004', customerId: 'cust_1', businessDate: today, billType: 'SERVICE', status: 'PART_PAID', subtotal: 9000, discountTotal: 0, taxTotal: 1620, grandTotal: 10620, paidAmount: 7000, dueAmount: 3620, paymentStatus: 'PART_PAID', createdByUserId: 'usr_pawan', printedAt: '2026-06-06T13:15:00.000Z', finalizedAt: '2026-06-06T13:20:00.000Z', createdAt: '2026-06-06T12:40:00.000Z', updatedAt: '2026-06-06T13:20:00.000Z', lockedByBillingGuard: true },
];

export const demoBillItems: BillItem[] = [
  { id: 'bi_1', billId: 'bill_1', productId: 'prd_1', description: 'Android Stereo 9 inch', quantity: 1, unitPrice: 12500, discount: 500, taxRate: 18, taxAmount: 2160, lineTotal: 14160, itemType: 'PRODUCT', serialNumber: 'AND9-7788', warrantyMonths: 12 },
  { id: 'bi_2', billId: 'bill_2', productId: 'prd_5', description: 'Alloy Wheel Set 16 inch', quantity: 1, unitPrice: 26500, discount: 1200, taxRate: 18, taxAmount: 4554, lineTotal: 29854, itemType: 'PRODUCT' },
  { id: 'bi_3', billId: 'bill_3', productId: 'prd_15', description: 'Parking Sensor', quantity: 1, unitPrice: 2500, discount: 0, taxRate: 18, taxAmount: 450, lineTotal: 2950, itemType: 'PRODUCT' },
  { id: 'bi_4', billId: 'bill_4', productId: 'prd_20', description: 'Installation Service', quantity: 1, unitPrice: 900, discount: 0, taxRate: 18, taxAmount: 162, lineTotal: 1062, itemType: 'SERVICE' },
];

export const demoPayments: Payment[] = [
  { id: 'pay_1', billId: 'bill_2', mode: 'UPI', amount: 18000, referenceNumber: 'upi_88291', receivedByUserId: 'usr_neha', receivedAt: '2026-06-06T10:20:00.000Z', status: 'RECORDED' },
  { id: 'pay_2', billId: 'bill_2', mode: 'CARD', amount: 10320, referenceNumber: 'card_1029', receivedByUserId: 'usr_neha', receivedAt: '2026-06-06T10:21:00.000Z', status: 'RECORDED' },
  { id: 'pay_3', billId: 'bill_4', mode: 'CASH', amount: 7000, receivedByUserId: 'usr_pawan', receivedAt: '2026-06-06T13:20:00.000Z', status: 'RECORDED' },
];

export const demoReturns: ReturnRecord[] = [
  { id: 'ret_1', organizationId: orgId, branchId: 'br_main', originalBillId: 'bill_2', status: 'REQUESTED', reason: 'Customer changed alloy wheel shade', refundMode: 'CREDIT', createdByUserId: 'usr_amit', createdAt: '2026-06-06T15:00:00.000Z' },
];

export const demoReturnItems: ReturnItem[] = [
  { id: 'reti_1', returnId: 'ret_1', productId: 'prd_5', qty: 1, condition: 'GOOD', restock: true },
];

export const demoCreditNotes: CreditNote[] = [
  { id: 'cn_1', organizationId: orgId, branchId: 'br_main', originalBillId: 'bill_2', creditNoteNumber: 'CN-MAIN-0001', customerId: 'cust_2', reason: 'Approved shade exchange', amount: 5000, status: 'DRAFT', createdByUserId: 'usr_amit', createdAt: '2026-06-06T15:05:00.000Z' },
];

export const demoVendors: Vendor[] = [
  { id: 'ven_1', organizationId: orgId, name: 'Delhi Car Audio Distributors', phone: '9810099001', gstNumber: '07AADCD1111A1Z1', address: 'Kashmere Gate', contactPerson: 'Mukesh', paymentTerms: '15 days', status: 'ACTIVE', dueAmount: 128000 },
  { id: 'ven_2', organizationId: orgId, name: 'AutoLight Wholesale', phone: '9810099002', gstNumber: '07AADCA2222A1Z1', address: 'Karol Bagh', contactPerson: 'Ritika', paymentTerms: '7 days', status: 'ACTIVE', dueAmount: 34200 },
];

export const demoPurchaseOrders: PurchaseOrder[] = [
  { id: 'po_1', organizationId: orgId, branchId: 'br_main', vendorId: 'ven_1', poNumber: 'PO-0001', status: 'ORDERED', expectedDate: '2026-06-08', createdByUserId: 'usr_amit', createdAt: '2026-06-06T09:30:00.000Z' },
];

export const demoPurchaseBills: PurchaseBill[] = [
  { id: 'pb_1', organizationId: orgId, branchId: 'br_main', vendorId: 'ven_1', invoiceNumber: 'DCA-5581', status: 'RECEIVED', subtotal: 100000, taxTotal: 18000, grandTotal: 118000, paidAmount: 0, dueAmount: 118000, createdAt: '2026-06-05T16:00:00.000Z' },
];

export const demoPurchaseItems: PurchaseItem[] = [
  { id: 'pi_1', purchaseBillId: 'pb_1', productId: 'prd_1', qty: 10, costPrice: 8200, taxRate: 18, lineTotal: 96760 },
  { id: 'pi_2', purchaseBillId: 'pb_1', productId: 'prd_8', qty: 20, costPrice: 750, taxRate: 18, lineTotal: 17700 },
];

export const demoStaffStatuses: StaffStatus[] = [
  { id: 'ss_1', organizationId: orgId, branchId: 'br_main', userId: 'usr_amit', skill: 'Sales', status: 'FREE', currentTask: 'Counter supervision', lastUpdatedAt: '2026-06-06T14:30:00.000Z' },
  { id: 'ss_2', organizationId: orgId, branchId: 'br_city', userId: 'usr_imran', skill: 'Sales', status: 'BUSY', currentTask: 'Stereo billing', lastUpdatedAt: '2026-06-06T14:20:00.000Z' },
  { id: 'ss_3', organizationId: orgId, branchId: 'br_workshop', userId: 'usr_pawan', skill: 'Fitter', status: 'BUSY', currentTask: 'Creta installation', lastUpdatedAt: '2026-06-06T14:10:00.000Z' },
  { id: 'ss_4', organizationId: orgId, branchId: 'br_workshop', userId: 'usr_suresh', skill: 'Wiring Expert', status: 'FREE', currentTask: 'Available for transfer', lastUpdatedAt: '2026-06-06T14:25:00.000Z' },
  { id: 'ss_5', organizationId: orgId, branchId: 'br_airport', userId: 'usr_ramesh', skill: 'Helper', status: 'ON_TRANSFER', currentTask: 'Collecting transfer from Main', lastUpdatedAt: '2026-06-06T14:35:00.000Z' },
];

export const demoStaffRequests: StaffRequest[] = [
  { id: 'sr_1', organizationId: orgId, requestingBranchId: 'br_city', requestedSkill: 'Wiring Expert', requestedByUserId: 'usr_karan', urgency: 'CUSTOMER_WAITING', reason: 'Customer waiting for central lock wiring', status: 'OPEN', createdAt: '2026-06-06T13:50:00.000Z' },
];

export const demoServiceJobs: ServiceJob[] = [
  { id: 'job_1', organizationId: orgId, branchId: 'br_workshop', customerId: 'cust_1', vehicleNumber: 'DL8C AX 9090', vehicleModel: 'Hyundai Creta', assignedStaffId: 'usr_pawan', status: 'IN_PROGRESS', priority: 'CUSTOMER_WAITING', issueDescription: 'Android stereo and camera fitment', workDescription: 'Dashboard panel open, wiring in progress', estimatedAmount: 10620, finalAmount: 10620, linkedBillId: 'bill_4', createdAt: '2026-06-06T12:30:00.000Z', startedAt: '2026-06-06T12:45:00.000Z' },
  { id: 'job_2', organizationId: orgId, branchId: 'br_city', customerId: 'cust_3', vehicleNumber: 'DL3C BE 4000', vehicleModel: 'Maruti Swift', status: 'WAITING_PART', priority: 'HIGH', issueDescription: 'Parking sensor install', workDescription: 'Waiting for sensor kit transfer', estimatedAmount: 3776, createdAt: '2026-06-06T09:00:00.000Z' },
];

export const demoSerialNumbers: SerialNumber[] = [
  { id: 'sn_1', organizationId: orgId, productId: 'prd_1', serialNumber: 'AND9-7788', branchId: 'br_city', status: 'SOLD', saleBillId: 'bill_1', customerId: 'cust_1', warrantyStartDate: '2026-06-06', warrantyEndDate: '2027-06-06' },
  { id: 'sn_2', organizationId: orgId, productId: 'prd_9', serialNumber: 'DASH-2222', branchId: 'br_main', status: 'IN_STOCK', purchaseBillId: 'pb_1' },
];

export const demoWarrantyClaims: WarrantyClaim[] = [
  { id: 'wc_1', organizationId: orgId, branchId: 'br_city', customerId: 'cust_1', productId: 'prd_1', serialNumber: 'AND9-7788', issue: 'Display flicker during reverse camera mode', status: 'OPEN', createdAt: '2026-06-06T15:10:00.000Z' },
];

export const demoApprovals: Approval[] = [
  { id: 'appr_1', organizationId: orgId, branchId: 'br_city', requestedByUserId: 'usr_imran', module: 'BILLING_GUARD', action: 'High discount override', reason: 'VIP customer negotiated 18 percent discount', status: 'PENDING', metadata: { billId: 'bill_1', discountPercent: 18 }, createdAt: '2026-06-06T11:30:00.000Z' },
  { id: 'appr_2', organizationId: orgId, branchId: 'br_main', requestedByUserId: 'usr_neha', module: 'EOD_LOCK', action: 'Cash variance close approval', reason: 'Drawer short by Rs 1450 after recount', status: 'PENDING', metadata: { variance: -1450 }, createdAt: '2026-06-06T17:00:00.000Z' },
  { id: 'appr_3', organizationId: orgId, branchId: 'br_airport', requestedByUserId: 'usr_ramesh', module: 'INVENTORY', action: 'Negative stock attempt', reason: 'Attempted sale of central locking kit with zero available', status: 'PENDING', metadata: { productId: 'prd_14' }, createdAt: '2026-06-06T12:50:00.000Z' },
  { id: 'appr_4', organizationId: orgId, branchId: 'br_airport', requestedByUserId: 'usr_ramesh', module: 'INVENTORY', action: 'Manual stock adjustment', reason: 'Damaged kit found during shelf audit', status: 'APPROVED', metadata: { productId: 'prd_14', qty: -1 }, createdAt: '2026-06-06T13:50:00.000Z', approvedByUserId: 'usr_raj', approvedAt: '2026-06-06T13:58:00.000Z' },
];

export const demoEodSessions: EodSession[] = [
  { id: 'eod_1', organizationId: orgId, branchId: 'br_city', businessDate: today, status: 'BLOCKED', openingCash: 12000, expectedCash: 12000, countedCash: 10550, cashVariance: -1450, expectedUpi: 18000, expectedCard: 0, expectedCredit: 13334, totalSales: 13334, totalReturns: 0, totalExpenses: 0, pendingPrintedBills: 1, oldDraftBills: 0, pendingTransfers: 1, stockAdjustments: 0, closingNote: 'Blocked until printed unpaid bill is settled.', createdAt: '2026-06-06T09:00:00.000Z' },
  { id: 'eod_2', organizationId: orgId, branchId: 'br_main', businessDate: today, status: 'READY_TO_CLOSE', openingCash: 20000, expectedCash: 27000, countedCash: 27000, cashVariance: 0, expectedUpi: 18000, expectedCard: 10320, expectedCredit: 0, totalSales: 28320, totalReturns: 0, totalExpenses: 0, pendingPrintedBills: 0, oldDraftBills: 0, pendingTransfers: 0, stockAdjustments: 1, createdAt: '2026-06-06T09:00:00.000Z' },
];

export const demoAuditLogs: AuditLog[] = [
  { id: 'aud_1', organizationId: orgId, branchId: 'br_city', userId: 'usr_imran', module: 'BILLING_GUARD', action: 'Printed unpaid bill locked', entityType: 'Bill', entityId: 'bill_1', reason: 'Bill printed before payment', createdAt: '2026-06-06T11:35:00.000Z' },
  { id: 'aud_2', organizationId: orgId, branchId: 'br_main', userId: 'usr_ramesh', module: 'STOCK_TRANSFER', action: 'Transfer dispatched', entityType: 'StockTransfer', entityId: 'tr_2', beforeValue: 'READY', afterValue: 'DISPATCHED', createdAt: '2026-06-06T12:10:00.000Z' },
  { id: 'aud_3', organizationId: orgId, branchId: 'br_airport', userId: 'usr_ramesh', module: 'INVENTORY', action: 'Negative stock attempt blocked', entityType: 'Product', entityId: 'prd_14', reason: 'Owner approval required', createdAt: '2026-06-06T12:50:00.000Z' },
  { id: 'aud_4', organizationId: orgId, branchId: 'br_city', userId: 'usr_karan', module: 'STAFF', action: 'Staff request opened', entityType: 'StaffRequest', entityId: 'sr_1', reason: 'Customer waiting wiring support', createdAt: '2026-06-06T13:50:00.000Z' },
  { id: 'aud_5', organizationId: orgId, branchId: 'br_city', userId: 'usr_neha', module: 'EOD_LOCK', action: 'EOD blocked', entityType: 'EodSession', entityId: 'eod_1', reason: 'Printed unpaid bill and cash variance', createdAt: '2026-06-06T17:00:00.000Z' },
];

export const demoAlerts: Alert[] = [
  { id: 'al_1', organizationId: orgId, branchId: 'br_city', severity: 'BLOCKER', module: 'BILLING_GUARD', title: 'Printed unpaid bill pending', message: 'KCA-CITY-0001 was printed but not paid. EOD is blocked.', status: 'OPEN', actionUrl: '/bills', createdAt: '2026-06-06T11:36:00.000Z' },
  { id: 'al_2', organizationId: orgId, branchId: 'br_airport', severity: 'CRITICAL', module: 'INVENTORY', title: 'Negative stock attempt', message: 'Central Locking Kit sale attempted with zero stock.', status: 'OPEN', actionUrl: '/approvals', createdAt: '2026-06-06T12:50:00.000Z' },
  { id: 'al_3', organizationId: orgId, branchId: 'br_city', severity: 'WARNING', module: 'STOCK_REQUEST', title: 'Customer waiting request', message: 'City Branch needs Android Stereo 9 inch urgently.', status: 'ACKNOWLEDGED', actionUrl: '/stock-requests', createdAt: '2026-06-06T12:00:00.000Z' },
  { id: 'al_4', organizationId: orgId, branchId: 'br_city', severity: 'BLOCKER', module: 'EOD_LOCK', title: 'EOD blocked', message: 'Cash variance and printed unpaid bill need owner action.', status: 'OPEN', actionUrl: '/eod', createdAt: '2026-06-06T17:00:00.000Z' },
  { id: 'al_5', organizationId: orgId, branchId: 'br_main', severity: 'WARNING', module: 'PURCHASE', title: 'Vendor payment due', message: 'Delhi Car Audio Distributors has Rs 128000 outstanding.', status: 'OPEN', actionUrl: '/vendors', createdAt: '2026-06-06T09:20:00.000Z' },
  { id: 'al_6', organizationId: orgId, branchId: 'br_city', severity: 'WARNING', module: 'WARRANTY', title: 'Warranty claim open', message: 'Display flicker claim opened for Android Stereo 9 inch.', status: 'OPEN', actionUrl: '/warranty', createdAt: '2026-06-06T15:10:00.000Z' },
];

export const demoSettings: BusinessSettings = {
  organizationId: orgId,
  billPrefix: 'KCA',
  nextBillSequence: 5,
  allowNegativeStock: false,
  ownerOverrideForNegativeStock: true,
  maxDiscountPercentWithoutApproval: 10,
  draftBillExpiryMinutes: 60,
  eodCashVarianceThreshold: 500,
  transferReceiveRequiredBeforeEod: true,
  stockAdjustmentApprovalRequired: true,
  purchasePriceUpdatesCost: true,
  warrantyDefaultMonths: 12,
  businessDateCloseTime: '22:00',
  currency: 'INR',
  taxRate: 18,
  printFooter: 'Thank you for choosing Kalra Car Accessories.',
};

export const demoDb: DemoDatabase = {
  organization: demoOrganization,
  branches: demoBranches,
  users: demoUsers,
  categories: demoCategories,
  brands: demoBrands,
  products: demoProducts,
  inventoryBalances: demoInventoryBalances,
  stockLedger: demoStockLedger,
  stockRequests: demoStockRequests,
  stockRequestResponses: demoStockRequestResponses,
  stockTransfers: demoStockTransfers,
  stockTransferItems: demoStockTransferItems,
  customers: demoCustomers,
  bills: demoBills,
  billItems: demoBillItems,
  payments: demoPayments,
  returns: demoReturns,
  returnItems: demoReturnItems,
  creditNotes: demoCreditNotes,
  vendors: demoVendors,
  purchaseOrders: demoPurchaseOrders,
  purchaseBills: demoPurchaseBills,
  purchaseItems: demoPurchaseItems,
  staffStatuses: demoStaffStatuses,
  staffRequests: demoStaffRequests,
  serviceJobs: demoServiceJobs,
  serialNumbers: demoSerialNumbers,
  warrantyClaims: demoWarrantyClaims,
  approvals: demoApprovals,
  eodSessions: demoEodSessions,
  auditLogs: demoAuditLogs,
  alerts: demoAlerts,
  settings: demoSettings,
};

export function getBranchName(branchId?: string) {
  if (!branchId) return 'All branches';
  return demoBranches.find((branch) => branch.id === branchId)?.name || branchId;
}

export function getProductName(productId?: string) {
  if (!productId) return 'Unknown product';
  return demoProducts.find((product) => product.id === productId)?.name || productId;
}

export function getUserName(userId?: string) {
  if (!userId) return 'System';
  return demoUsers.find((user) => user.id === userId)?.name || userId;
}
