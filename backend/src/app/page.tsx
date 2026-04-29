export default function Page() {
  return (
    <main style={page}>
      <h1 style={title}>Kontrol Paneli</h1>

      <section style={embedCard}>
        <div>
          <strong>⚙️ Tema Uygulama Gömülmesi</strong>
          <span style={onBadge}>ON</span>
        </div>
        <button style={lightBtn}>Temayı Aç</button>
      </section>

      <section style={blueBox}>
        <strong>ℹ️ Sipariş başına daha fazla satış için Satış Artırıcı bölümünü kullanın</strong>
        <p>
          Ürün paketleri, miktar teklifleri, ek ürünler ve upsell teklifleri buradan yönetilecek.
        </p>
      </section>

      <h3>📊 Son 7 gün:</h3>

      <section style={statsGrid}>
        <Stat value="0" label="Form açılışları" />
        <Stat value="0" label="Siparişler" />
        <Stat value="0 TL" label="Gelir" />
        <Stat value="0%" label="Form dönüşüm oranı" />
      </section>

      <section style={card}>
        <h2>Yenilikler</h2>
        <div style={newsBox}>
          <div style={newsImage}>REAL COD</div>
          <div>
            <h3>Real COD Form başlatıldı</h3>
            <p>
              Form tasarımcısı, kapıda ödeme ücreti, müşteri formu ve sipariş sistemi geliştiriliyor.
            </p>
          </div>
        </div>
      </section>

      <section style={card}>
        <h2>Kurulum Kılavuzu</h2>
        <p>Uygulamanızı çalışır duruma getirmek için adımları takip edin.</p>

        <div style={step}>✅ Mağazanızda uygulamayı etkinleştirin</div>
        <div style={step}>⬜ Formu kullanıcı tanımlı hale getirin</div>
        <div style={step}>⬜ Kapıda ödeme formunu ürün sayfasında test edin</div>
        <div style={step}>⬜ Satış artırıcı ve güvenlik özelliklerini yapılandırın</div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={statCard}>
      <strong style={statValue}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

const page = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "32px 24px",
  fontFamily: "Arial, sans-serif",
};

const title = {
  fontSize: 28,
  marginBottom: 22,
};

const embedCard = {
  background: "#fff",
  border: "1px solid #e5e5e5",
  borderRadius: 14,
  padding: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
};

const onBadge = {
  marginLeft: 10,
  background: "#b7f5c4",
  color: "#087a25",
  padding: "3px 9px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const lightBtn = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 10,
  padding: "8px 12px",
  cursor: "pointer",
};

const blueBox = {
  background: "#d9f0ff",
  border: "1px solid #9bd3ff",
  borderRadius: 14,
  padding: 16,
  marginBottom: 20,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 14,
  marginBottom: 22,
};

const statCard = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
  textAlign: "center" as const,
};

const statValue = {
  display: "block",
  fontSize: 24,
  marginBottom: 4,
};

const card = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 20,
  marginBottom: 18,
};

const newsBox = {
  display: "flex",
  gap: 18,
  alignItems: "center",
};

const newsImage = {
  width: 180,
  height: 100,
  borderRadius: 12,
  background: "linear-gradient(135deg,#3b82f6,#f472b6)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
};

const step = {
  padding: "10px 0",
  borderTop: "1px solid #eee",
};