export type StaffSkill = 'Sales' | 'Fitter' | 'Wiring Expert' | 'Audio Installer' | 'Seat Cover Installer' | 'Helper' | 'Driver' | 'Accountant';
export type StaffAvailabilityStatus = 'FREE' | 'BUSY' | 'ON_TRANSFER' | 'ON_LEAVE' | 'OFF_DUTY';
export type StaffRequestStatus = 'OPEN' | 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface StaffStatus {
  id: string;
  organizationId: string;
  branchId: string;
  userId: string;
  skill: StaffSkill;
  status: StaffAvailabilityStatus;
  currentTask?: string;
  lastUpdatedAt: string;
}

export interface StaffRequest {
  id: string;
  organizationId: string;
  requestingBranchId: string;
  requestedSkill: StaffSkill;
  requestedByUserId: string;
  urgency: 'NORMAL' | 'URGENT' | 'CUSTOMER_WAITING';
  reason: string;
  status: StaffRequestStatus;
  assignedUserId?: string;
  acceptedByBranchId?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ServiceJob {
  id: string;
  organizationId: string;
  branchId: string;
  customerId: string;
  vehicleNumber: string;
  vehicleModel: string;
  assignedStaffId?: string;
  status: 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_PART' | 'COMPLETED' | 'BILLED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CUSTOMER_WAITING';
  issueDescription: string;
  workDescription: string;
  estimatedAmount: number;
  finalAmount?: number;
  linkedBillId?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}
