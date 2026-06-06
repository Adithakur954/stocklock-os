import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 p-6 text-white">
      <div className="max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
          <ShieldCheck size={30} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">StockLock OS</h1>
        <p className="mt-4 text-lg text-gray-300">
          Inventory, billing, staff, service, EOD lock, and audit-control OS for multi-branch Indian retail/service businesses.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500">
            Open dashboard
            <ArrowRight size={16} />
          </Link>
          <Link href="/stocklock-os-level4.html" className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            View original HTML demo
          </Link>
        </div>
      </div>
    </main>
  );
}
