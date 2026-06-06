import { demoDb, getBranchName, getProductName } from '@/lib/mock-data/stocklock-demo-data';

export function getTransfers() {
  return demoDb.stockTransfers;
}

export function getPendingDispatchTransfers() {
  return demoDb.stockTransfers.filter((transfer) => transfer.status === 'READY');
}

export function getPendingReceiveTransfers() {
  return demoDb.stockTransfers.filter((transfer) => transfer.status === 'DISPATCHED');
}

export function getTransferTimeline(transferId: string) {
  const transfer = demoDb.stockTransfers.find((item) => item.id === transferId);
  const items = demoDb.stockTransferItems.filter((item) => item.transferId === transferId);
  if (!transfer) return [];
  return [
    `Created from ${getBranchName(transfer.sourceBranchId)} to ${getBranchName(transfer.destinationBranchId)}`,
    ...items.map((item) => `${item.qty} x ${getProductName(item.productId)} reserved for movement`),
    transfer.dispatchedAt ? `Dispatched at ${transfer.dispatchedAt}` : 'Dispatch pending',
    transfer.receivedAt ? `Received at ${transfer.receivedAt}` : 'Receive pending',
  ];
}
