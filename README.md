# StockLock OS

StockLock OS is a Next.js inventory, billing, and branch-control system for a car accessories business. It models a multi-shop owner workflow with branch stock, POS billing, transfers, staff availability, fitting jobs, warranty tracking, approvals, audit history, alerts, reports, Billing Guard, and EOD Lock.

The current implementation runs in demo mode from typed local data in `src/lib/mock-data/stocklock-demo-data.ts`. It does not need a backend to open, inspect, or build the UI.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

Open `http://localhost:3000/dashboard` for the main owner dashboard.

## Environment

Copy `.env.example` when environment-specific values are needed:

```bash
NEXT_PUBLIC_APP_NAME="StockLock OS"
NEXT_PUBLIC_APP_MODE="demo"
NEXT_PUBLIC_DEFAULT_BRANCH_ID="branch-main"
NEXT_PUBLIC_DEFAULT_BUSINESS_DATE="2026-06-06"
```

## Main Modules

- Dashboard with owner KPIs, branch health, low stock, EOD status, alerts, approvals, and audit history.
- Branches with multi-shop branch listing, manager assignment, status, and owner-wide visibility.
- Inventory with branch-wise balances, stock ledger, low stock, dead stock, and stock movement history.
- Products with SKU, barcode, category, brand, compatible vehicles, price rules, reorder level, and warranty fields.
- Stock Requests for inter-branch product demand and response tracking.
- Transfers with dispatch/receive states and EOD-blocking visibility.
- POS Billing, Bills, Payments, Returns, and Credit Notes.
- Purchases and Vendors with PO, inward bill, due amount, and vendor terms.
- Customers with phone, vehicle details, spend, tags, and credit due.
- Staff and Service Jobs for fitter/helper availability, requests, assignment, and job cards.
- Warranty with serial numbers and warranty claim workflow.
- EOD Closing with cash summary, variance checks, printed-unpaid checks, pending transfer checks, and owner approval hooks.
- Approvals, Alerts, Audit Log, Reports, and Settings.

## Billing Guard

Billing Guard is implemented as pure business logic in `src/lib/guards/billing-guard.ts`.

It prevents risky bill changes after print/payment/finalization, checks old drafts, blocks finalized/cancelled edits, validates bill numbering, detects owner-approval scenarios, and produces audit-event payloads for protected actions.

Important functions:

- `canEditBill`
- `canCancelBill`
- `canPrintBill`
- `canFinalizeBill`
- `canAcceptPayment`
- `canApplyDiscount`
- `canCreateReturn`
- `getBillingGuardViolations`
- `lockBillAfterPrint`
- `lockBillAfterPayment`

## EOD Lock

EOD Lock is implemented as pure business logic in `src/lib/eod/eod-lock.ts`.

It calculates expected cash and payment summaries, detects pending printed bills, old drafts, unreceived transfers, unapproved stock adjustments, cash variance, backdated transaction rules, and close-day audit payloads.

Important functions:

- `calculateExpectedCash`
- `calculatePaymentSummary`
- `getEodBlockingReasons`
- `canCloseDay`
- `requiresOwnerApprovalForEod`
- `closeBusinessDate`
- `lockBusinessDate`
- `canCreateBackdatedTransaction`

## Data And Services

Typed domain models live in `src/lib/types`. Demo data lives in `src/lib/mock-data`. Service modules live in `src/lib/services`, with separate files for inventory, billing, reports, alerts, approvals, customers, transfers, purchases, staff, service jobs, warranty, and settings.

A backend schema blueprint is included at `src/lib/db/schema.sql`.

Business-rule examples are included at `src/lib/tests/business-rules.examples.ts`.

## Routes

The owner shell lives under `src/app/(dashboard)/layout.tsx`. Static routes such as `/dashboard`, `/branches`, `/products`, `/stock`, and `/sales` are present. The remaining module pages are mapped by `src/app/(dashboard)/[...slug]/page.tsx`, including:

- `/inventory`
- `/inventory/ledger`
- `/inventory/low-stock`
- `/inventory/dead-stock`
- `/stock-requests`
- `/transfers`
- `/billing`
- `/bills`
- `/payments`
- `/returns`
- `/purchases`
- `/vendors`
- `/customers`
- `/staff`
- `/service-jobs`
- `/warranty`
- `/eod`
- `/approvals`
- `/alerts`
- `/audit`
- `/reports`
- `/reports/sales`
- `/reports/inventory`
- `/reports/billing-guard`
- `/reports/eod`
- `/reports/transfers`
- `/reports/staff`
- `/settings`

## Known Limitations

- The app is currently a front-end demo with typed in-memory data, not a connected production database.
- Mutating workflows such as bill creation, transfer dispatch, return approval, and EOD close are represented in UI/service logic but are not persisted to a backend.
- Authentication is represented as owner-demo shell behavior; production login, branch scoping, and server-side authorization still need backend integration.
- CSV export is scaffolded as a utility function and wired into report actions visually; browser download behavior can be added when persistence is introduced.

## Recommended Next Step

Connect the typed services to a real database and authentication layer, then add integration tests around Billing Guard, EOD Lock, stock movement, transfers, and payment settlement.
