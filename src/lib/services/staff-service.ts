import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getStaffAvailability() {
  return demoDb.staffStatuses;
}

export function getAvailableStaffBySkill(skill: string) {
  return demoDb.staffStatuses.filter((staff) => staff.skill === skill && staff.status === 'FREE');
}

export function getOpenStaffRequests() {
  return demoDb.staffRequests.filter((request) => request.status === 'OPEN');
}
