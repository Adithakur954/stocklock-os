import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { GuardResult } from '@/lib/types/core';
import { InventoryBalance, MovementType, StockLedger } from '@/lib/types/inventory';

function guard(allowed: boolean, reasons: string[], requiresApproval = false): GuardResult {
  return {
    allowed,
    requiresApproval,
    reasons,
    severity: !allowed ? 'BLOCKER' : requiresApproval ? 'CRITICAL' : reasons.length ? 'WARNING' : 'INFO',
  };
}

export function getBranchStock(branchId: string) {
  return demoDb.inventoryBalances.filter((balance) => balance.branchId === branchId);
}

export function getAvailableStock(branchId: string, productId: string) {
  return demoDb.inventoryBalances.find((balance) => balance.branchId === branchId && balance.productId === productId)?.quantityAvailable || 0;
}

export function canReduceStock(branchId: string, productId: string, qty: number, allowNegativeStock = false): GuardResult {
  const available = getAvailableStock(branchId, productId);
  if (available - qty < 0 && !allowNegativeStock) return guard(false, ['Negative stock blocked. Owner approval required for override.'], true);
  return guard(true, []);
}

export function preventNegativeStock(branchId: string, productId: string, qty: number) {
  return canReduceStock(branchId, productId, qty, false);
}

export function createStockLedgerEntry(params: {
  balance: InventoryBalance;
  movementType: MovementType;
  quantityChange: number;
  referenceType: string;
  referenceId: string;
  reason: string;
  createdByUserId: string;
}): StockLedger {
  if (!params.reason.trim()) {
    throw new Error('Manual stock movement requires a reason.');
  }

  return {
    id: `led_${Date.now()}`,
    organizationId: params.balance.organizationId,
    branchId: params.balance.branchId,
    productId: params.balance.productId,
    movementType: params.movementType,
    quantityChange: params.quantityChange,
    quantityBefore: params.balance.quantityOnHand,
    quantityAfter: params.balance.quantityOnHand + params.quantityChange,
    referenceType: params.referenceType,
    referenceId: params.referenceId,
    reason: params.reason,
    createdByUserId: params.createdByUserId,
    createdAt: new Date().toISOString(),
  };
}

export function adjustStock(balance: InventoryBalance, quantityChange: number, reason: string, userId: string) {
  const ledger = createStockLedgerEntry({
    balance,
    movementType: 'MANUAL_ADJUSTMENT',
    quantityChange,
    referenceType: 'ADJUSTMENT',
    referenceId: `adj_${Date.now()}`,
    reason,
    createdByUserId: userId,
  });

  return {
    balance: {
      ...balance,
      quantityOnHand: ledger.quantityAfter,
      quantityAvailable: ledger.quantityAfter - balance.quantityReserved,
      lastUpdatedAt: ledger.createdAt,
    },
    ledger,
  };
}

export function reserveStock(balance: InventoryBalance, qty: number) {
  return { ...balance, quantityReserved: balance.quantityReserved + qty, quantityAvailable: balance.quantityAvailable - qty };
}

export function releaseReservedStock(balance: InventoryBalance, qty: number) {
  return { ...balance, quantityReserved: Math.max(0, balance.quantityReserved - qty), quantityAvailable: balance.quantityAvailable + qty };
}

export function transferStockOut(source: InventoryBalance, qty: number, userId: string, transferId: string) {
  return createStockLedgerEntry({
    balance: source,
    movementType: 'TRANSFER_OUT',
    quantityChange: -qty,
    referenceType: 'TRANSFER',
    referenceId: transferId,
    reason: 'Transfer dispatched',
    createdByUserId: userId,
  });
}

export function receiveStockTransfer(destination: InventoryBalance, qty: number, userId: string, transferId: string) {
  return createStockLedgerEntry({
    balance: destination,
    movementType: 'TRANSFER_IN',
    quantityChange: qty,
    referenceType: 'TRANSFER',
    referenceId: transferId,
    reason: 'Transfer received',
    createdByUserId: userId,
  });
}

export function detectLowStock() {
  return demoDb.inventoryBalances.filter((balance) => {
    const product = demoDb.products.find((item) => item.id === balance.productId);
    return product ? balance.quantityAvailable <= product.reorderLevel : false;
  });
}

export function detectDeadStock(days = 90) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return demoDb.products.filter((product) => product.lastSoldAt && new Date(product.lastSoldAt).getTime() < cutoff);
}
