import { demoDb } from '@/lib/mock-data/stocklock-demo-data';

export function getAlerts() {
  return demoDb.alerts;
}

export function getOpenAlerts() {
  return demoDb.alerts.filter((alert) => alert.status === 'OPEN' || alert.status === 'ACKNOWLEDGED');
}

export function getCriticalAlerts() {
  return demoDb.alerts.filter((alert) => alert.severity === 'CRITICAL' || alert.severity === 'BLOCKER');
}
