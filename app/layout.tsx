import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinSight',
  description: 'Personal finance document analysis'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="theme-light">{children}</body>
    </html>
  );
}
