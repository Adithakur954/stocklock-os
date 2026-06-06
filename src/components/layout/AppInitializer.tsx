'use client';

import { useEffect, useState } from 'react';
import { seedDatabase } from '@/lib/db';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await seedDatabase();
      } catch (error) {
        console.error('Failed to initialize database', error);
      } finally {
        setIsReady(true);
      }
    }
    init();
  }, []);

  if (!isReady) {
    return <div className="flex h-screen items-center justify-center">Loading StockLock OS...</div>;
  }

  return <>{children}</>;
}
