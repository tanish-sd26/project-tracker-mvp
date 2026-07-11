import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Project Tracker - Codefancy Lab',
  description: 'Internal project tracking application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pt-16">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
