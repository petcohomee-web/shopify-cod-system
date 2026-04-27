import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Kapida Odeme Backend' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
