# GPT Handoff For StockLock OS

Use this file when sharing the project with ChatGPT, a Custom GPT, or another coding assistant.

## Copy This Prompt To GPT

I am working on a project named StockLock OS. It is a Next.js app for a multi-branch car accessories business. Please help me understand, improve, debug, and extend this project without restarting it from scratch.

Important context:

- Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS.
- Local app folder: `stocklock-os`.
- Main dashboard URL: `http://127.0.0.1:3005/dashboard`.
- Windows launcher files:
  - `RUN-STOCKLOCK.bat`
  - `START-STOCKLOCK.bat`
- Local scripts:
  - `npm.cmd run lint`
  - `npm.cmd run build`
  - `npm.cmd run start:local`
  - `npm.cmd run dev:local`
- The app currently uses typed demo data, not a real backend.
- Do not delete or rewrite the existing codebase. Work from the current implementation.

Main implemented modules:

- Dashboard
- Branches
- Inventory
- Products
- Stock Requests
- Transfers
- POS Billing
- Bills
- Payments
- Returns and Credit Notes
- Purchases
- Vendors
- Customers
- Staff
- Service Jobs
- Warranty
- EOD Closing
- Approvals
- Alerts
- Audit Log
- Reports
- Settings

Important project files:

- `src/app/(dashboard)/layout.tsx` - main app shell and sidebar.
- `src/app/(dashboard)/dashboard/page.tsx` - owner dashboard.
- `src/app/(dashboard)/[...slug]/page.tsx` - dynamic module route mapping.
- `src/components/stocklock/module-page.tsx` - module page renderer.
- `src/components/stocklock/ui.tsx` - shared UI components.
- `src/components/stocklock/theme-toggle.tsx` - light/dark mode toggle.
- `src/app/globals.css` - global and dark mode styling.
- `src/lib/mock-data/stocklock-demo-data.ts` - demo business data.
- `src/lib/guards/billing-guard.ts` - Billing Guard rules.
- `src/lib/eod/eod-lock.ts` - EOD Lock rules.
- `src/lib/services` - business service functions.
- `src/lib/types` - TypeScript domain models.
- `src/lib/db/schema.sql` - backend schema blueprint.
- `README.md` - project overview and commands.

Current limitations:

- No production database is connected yet.
- Login/auth is represented as a demo owner shell.
- Mutating actions are mostly UI/service scaffolds and are not persisted.
- More integration tests are needed for Billing Guard, EOD Lock, transfers, stock movements, and payment settlement.

Recommended next tasks:

1. Connect a real database and authentication layer.
2. Add persisted create/update flows for billing, stock transfers, inventory adjustments, EOD close, returns, and approvals.
3. Add automated tests for business rules.
4. Improve mobile layout for the sidebar and dashboard controls.
5. Add export/download behavior for reports.

When helping me, please:

- Read the existing code before suggesting changes.
- Keep changes small and consistent with the current structure.
- Do not replace the project with a new template.
- Always run or ask me to run `npm.cmd run lint` and `npm.cmd run build` after code changes.
- Explain exactly which files changed and why.

## How To Upload This Project To GPT

Best option:

1. Create a zip of the project without heavy generated folders.
2. Upload the zip to GPT.
3. Paste the prompt above.

Do not include these folders in the zip:

- `node_modules`
- `.next`
- `.git`

Include these files/folders:

- `src`
- `public`
- `README.md`
- `GPT-HANDOFF.md`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `postcss.config.mjs`
- `.env.example`
- `RUN-STOCKLOCK.bat`
- `START-STOCKLOCK.bat`

## How To Run Locally

Build first:

```powershell
cd C:\Users\User\Downloads\stocklock-os-main\stocklock-os
npm.cmd run build
```

Start the app:

```powershell
npm.cmd run start:local
```

Open:

```text
http://127.0.0.1:3005/dashboard
```

In PowerShell, local batch files must be run with `.\`:

```powershell
.\START-STOCKLOCK.bat
```

