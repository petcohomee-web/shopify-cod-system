"use client";

import { useState } from "react";

export default function Page() {
  const [showUpsellBanner, setShowUpsellBanner] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [guideOpen, setGuideOpen] = useState(true);
  const [language, setLanguage] = useState("tr");

  return (
    <main style={page}>
      <h1 style={title}>Kontrol Paneli</h1>

      <section style={cardRow}>
        <div>
          <span style={icon}>⚙️</span>
          <b>Tema Uygulama Gömülmesi</b>
          <span style={badge}>ON</span>
        </div>
        <button
          style={btn}
          onClick={() => window.open("/?preview_theme_id=current", "_blank")}
        >
          Temayı Aç
        </button>
      </section>

      {showUpsellBanner && (
        <section style={blueBanner}>
          <div>
            <b>ℹ️ Sipariş başına daha fazla satış için Satış Artırıcı bölümünü kullanın</b>
            <p style={p}>
              Ürün paketleri, miktar teklifleri, ek ürünler ve upsell teklifleri buradan yönetilecek.
            </p>
            <button style={smallBtn} onClick={() => (window.location.href = "/upsell")}>
              Satış Artırıcıya Git
            </button>
          </div>
          <button style={xBtn} onClick={() => setShowUpsellBanner(false)}>×</button>
        </section>
      )}

      <h3 style={sectionTitle}>📊 Son 7 gün:</h3>

      <section style={stats}>
        <Stat value="0" label="Form açılışları" />
        <Stat value="0" label="Siparişler" />
        <Stat value="0 TL" label="Gelir" />
        <Stat value="0%" label="Form dönüşüm oranı" />
      </section>

      <section style={card}>
        <div style={cardHead}>
          <h2 style={h2}>Yenilikler</h2>
          <button style={plainBtn}>•••</button>
        </div>

        <div style={newsBox}>
          <div style={newsImage}>REAL COD</div>
          <div style={{ flex: 1 }}>
            <div style={rowBetween}>
              <div>
                <h3 style={{ margin: 0 }}>Real COD Form başlatıldı</h3>
                <p style={muted}>2026-04-29 tarihinde yayınlandı</p>
              </div>
              <span style={newBadge}>v1.0</span>
            </div>

            <ul style={list}>
              <li>Canlı önizlemeli form tasarımcısı hazırlandı</li>
              <li>Kapıda ödeme ücreti ve toplam fiyat mantığı eklendi</li>
              <li>SMS, fraud, upsell ve analitik bölümleri için altyapı hazırlanıyor</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={card}>
        <div style={cardHead}>
          <div>
            <h2 style={h2}>Kurulum Kılavuzu</h2>
            <p style={muted}>Uygulamanızı çalışır duruma getirmek için bu adımları takip edin.</p>
          </div>
          <button style={plainBtn} onClick={() => setGuideOpen(!guideOpen)}>
            {guideOpen ? "⌃" : "⌄"}
          </button>
        </div>

        <div style={progressInfo}>
          <span>1 / 4 Tamamlandı</span>
          <div style={progressBg}>
            <div style={progressFill}></div>
          </div>
        </div>

        {guideOpen && (
          <div style={guideList}>
            <Guide done title="Mağazanızda uygulamayı etkinleştirin" />
            <Guide title="Formu kullanıcı tanımlı hale getirin" link="/form-designer" />
            <Guide title="Kapıda ödeme formunu ürün sayfasında test edin" />
            <Guide title="Satış artırıcı ve güvenlik özelliklerini yapılandırın" link="/upsell" />
          </div>
        )}
      </section>

      {showWelcome && (
        <section style={blueBanner}>
          <div>
            <b>ℹ️ Real COD FORM’a Hoş Geldiniz!</b>
            <p style={p}>
              COD siparişlerinizi tek sayfalık hızlı form ile toplayın, fraud riskini azaltın ve upsell ile geliri artırın.
            </p>
          </div>
          <button style={xBtn} onClick={() => setShowWelcome(false)}>×</button>
        </section>
      )}

      <section style={twoCol}>
        <div style={card}>
          <h2 style={h2}>Planınız</h2>
          <h3>Premium</h3>
          <p style={muted}>Bu ayki sipariş kullanımınız:</p>
          <b style={{ fontSize: 20 }}>0 / 420</b>
          <div style={progressBgBig}>
            <div style={{ ...progressFillBig, width: "0%" }}></div>
          </div>
          <p style={muted}>Limit dolmadan önce otomatik uyarı sistemi eklenecek.</p>
          <button style={btn}>Planı Yönet</button>
        </div>

        <div style={card}>
          <h2 style={h2}>SMS / Bakiye</h2>
          <p style={muted}>SMS OTP ve Google adres doğrulama bakiyesi burada görünecek.</p>
          <div style={balance}>$0.0000</div>
          <div style={infoBox}>Bakiyeniz SMS mesajları ve doğrulama servisleri için kullanılacaktır.</div>
          <button style={btn}>SMS Ayarları</button>
        </div>
      </section>

      <section style={twoCol}>
        <div style={card}>
          <h2 style={h2}>Dilin</h2>
          <label style={label}>Uygulama dilini değiştirin</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={input}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="ar">العربية</option>
          </select>
        </div>

        <div style={card}>
          <h2 style={h2}>3 dakikada öğrenin</h2>
          <p style={muted}>Form, sipariş ve ayarların nasıl çalıştığını hızlıca öğrenin.</p>
          <button style={btn}>▶ Öğreticiyi İzle</button>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={statCard}>
      <b style={statValue}>{value}</b>
      <span style={muted}>{label}</span>
    </div>
  );
}

function Guide({ title, done, link }: { title: string; done?: boolean; link?: string }) {
  return (
    <div style={guideItem} onClick={() => link && (window.location.href = link)}>
      <span style={done ? doneCircle : emptyCircle}>{done ? "✓" : ""}</span>
      <span>{title}</span>
    </div>
  );
}

const page = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "32px 22px",
  fontFamily: "Arial, sans-serif",
};

const title = { fontSize: 26, marginBottom: 18 };
const h2 = { margin: 0, fontSize: 20 };
const p = { marginBottom: 10 };
const muted = { color: "#6b7280", fontSize: 14 };
const sectionTitle = { margin: "18px 0 10px" };

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
  marginBottom: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,.04)",
};

const cardRow = {
  ...card,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
};

const badge = {
  marginLeft: 10,
  background: "#b7f7c8",
  color: "#087a25",
  padding: "3px 8px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const newBadge = {
  background: "#d1fae5",
  color: "#047857",
  padding: "4px 9px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const blueBanner = {
  background: "#dff3ff",
  border: "1px solid #9bd7ff",
  borderRadius: 14,
  padding: 16,
  marginBottom: 16,
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
};

const stats = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 14,
  marginBottom: 16,
};

const statCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 18,
  textAlign: "center" as const,
};

const statValue = {
  display: "block",
  fontSize: 22,
  marginBottom: 5,
};

const newsBox = {
  display: "flex",
  gap: 18,
  background: "#f8fafc",
  padding: 16,
  borderRadius: 12,
};

const newsImage = {
  width: 180,
  height: 115,
  borderRadius: 12,
  background: "linear-gradient(135deg,#3b82f6,#f472b6)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  flexShrink: 0,
};

const rowBetween = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
};

const list = {
  marginTop: 12,
  lineHeight: 1.8,
};

const progressInfo = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  margin: "12px 0",
  fontSize: 14,
};

const progressBg = {
  width: 110,
  height: 8,
  background: "#e5e7eb",
  borderRadius: 999,
};

const progressFill = {
  width: "25%",
  height: "100%",
  background: "#111827",
  borderRadius: 999,
};

const progressBgBig = {
  width: "100%",
  height: 10,
  background: "#e5e7eb",
  borderRadius: 999,
  margin: "14px 0",
};

const progressFillBig = {
  height: "100%",
  background: "#22c55e",
  borderRadius: 999,
};

const guideList = {
  borderTop: "1px solid #eee",
  paddingTop: 10,
};

const guideItem = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "11px 4px",
  cursor: "pointer",
};

const doneCircle = {
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#111827",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 13,
};

const emptyCircle = {
  width: 22,
  height: 22,
  borderRadius: "50%",
  border: "2px solid #9ca3af",
  display: "inline-flex",
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
};

const balance = {
  fontSize: 30,
  fontWeight: 900,
  margin: "12px 0",
};

const infoBox = {
  background: "#eef6ff",
  padding: 12,
  borderRadius: 10,
  color: "#1f2937",
  marginBottom: 14,
};

const btn = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: "8px 13px",
  cursor: "pointer",
  fontWeight: 700,
};

const smallBtn = {
  ...btn,
  padding: "7px 11px",
};

const xBtn = {
  border: 0,
  background: "transparent",
  fontSize: 22,
  cursor: "pointer",
};

const plainBtn = {
  border: 0,
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
};

const input = {
  width: "100%",
  padding: 11,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  marginTop: 8,
};

const label = {
  display: "block",
  color: "#374151",
  marginTop: 12,
};

const icon = { marginRight: 8 };