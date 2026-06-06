import { demoDb, getBranchName, getProductName } from '@/lib/mock-data/stocklock-demo-data';
import { StockRequest } from '@/lib/types/inventory';

export function getStockRequests() {
  return demoDb.stockRequests;
}

export function getRequestTimeline(requestId: string) {
  const request = demoDb.stockRequests.find((item) => item.id === requestId);
  const responses = demoDb.stockRequestResponses.filter((item) => item.requestId === requestId);
  return [
    request ? `${getBranchName(request.requestingBranchId)} requested ${request.requestedQty} x ${getProductName(request.productId)}` : 'Request opened',
    ...responses.map((response) => `${getBranchName(response.respondingBranchId)} responded ${response.availabilityStatus} (${response.availableQty})`),
  ];
}

export function createStockRequest(input: Omit<StockRequest, 'id' | 'organizationId' | 'createdAt' | 'expiresAt' | 'status'>): StockRequest {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
  return {
    ...input,
    id: `req_${Date.now()}`,
    organizationId: demoDb.organization.id,
    status: 'OPEN',
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}
