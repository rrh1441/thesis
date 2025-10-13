import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { Header } from '@/components/header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Thesis — Paper Trade Your Belief',
  description:
    'Turn any “I think…” into investable implications, AI research, and paper trades without touching real capital.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#050505] text-zinc-100 antialiased`}
      >
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,200,83,0.15),transparent_60%)]" />
          <Header />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="relative z-10 border-t border-zinc-900/80 bg-black/40">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Thesis. Paper trading only — not financial advice.</p>
              <p className="text-xs text-zinc-600">
                Built for exploration. Upgrade to live trading when you&apos;re ready.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
