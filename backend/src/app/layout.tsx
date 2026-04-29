export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0 }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* SOL MENÜ */}
          <div style={{
            width: "250px",
            borderRight: "1px solid #eee",
            padding: "20px",
            background: "#fff"
          }}>
            <h2>REAL COD FORM</h2>

            <a href="/" style={link}>Kontrol Paneli</a>
            <a href="/form-designer" style={link}>Form Tasarımcısı</a>
            <a href="/fraud" style={link}>Dolandırıcılık Önleme</a>
            <a href="/delivery" style={link}>Teslimat Başarısı</a>
            <a href="/upsell" style={link}>Satış Artırıcı</a>
            <a href="/analytics" style={link}>Analitik</a>
            <a href="/settings" style={link}>Ayarlar</a>
            <a href="/billing" style={link}>Fatura Planları</a>
          </div>

          {/* SAĞ İÇERİK */}
          <div style={{ flex: 1, padding: "30px" }}>
            {children}
          </div>

        </div>
      </body>
    </html>
  );
}

const link = {
  display: "block",
  padding: "10px 0",
  textDecoration: "none",
  color: "#111",
};