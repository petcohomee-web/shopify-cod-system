import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        
        {/* TOP MENU */}
        <div style={{
          padding: "15px 25px",
          borderBottom: "1px solid #eee",
          display: "flex",
          gap: "20px",
          fontWeight: 600
        }}>
          <Link href="/">Kontrol Paneli</Link>
          <Link href="/form-designer">Form Tasarımcısı</Link>
          <Link href="/fraud">Dolandırıcılık Önleme</Link>
          <Link href="/upsell">Satış Artırıcı</Link>
          <Link href="/analytics">Analitik</Link>
          <Link href="/settings">Ayarlar</Link>
          <Link href="/billing">Fatura Planları</Link>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: 20 }}>
          {children}
        </div>

      </body>
    </html>
  );
}