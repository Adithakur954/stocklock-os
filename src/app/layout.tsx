import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppInitializer } from '@/components/layout/AppInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StockLock OS',
  description: 'Car Accessories Multi-Branch System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppInitializer>
          {children}
        </AppInitializer>
      </body>
    </html>
  );
}
