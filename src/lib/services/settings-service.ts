import { demoDb } from '@/lib/mock-data/stocklock-demo-data';
import { BusinessSettings } from '@/lib/types/settings';

export function getSettings() {
  return demoDb.settings;
}

export function validateSettings(settings: BusinessSettings) {
  const errors: string[] = [];
  if (settings.maxDiscountPercentWithoutApproval < 0) errors.push('Discount limit cannot be negative.');
  if (settings.eodCashVarianceThreshold < 0) errors.push('Cash variance threshold cannot be negative.');
  if (!settings.billPrefix.trim()) errors.push('Bill prefix is required.');
  return errors;
}

export function updateSettings(current: BusinessSettings, patch: Partial<BusinessSettings>) {
  return { ...current, ...patch };
}

export function createSettingsAuditLog(reason: string) {
  return { module: 'SETTINGS' as const, action: 'Settings updated', reason };
}
