export interface Customer {
  id: string;
  organizationId: string;
  name: string;
  phone: string;
  email?: string;
  vehicleNumber: string;
  vehicleModel: string;
  address?: string;
  tags: string[];
  totalSpend: number;
  lastVisitAt: string;
  creditLimit: number;
  outstandingBalance: number;
  createdAt: string;
}
