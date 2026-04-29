export default function FormDesignerPage() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((data) => {
        console.log("CONFIG:", data);
        setConfig(data);
      });
  }, []);

  if (!config) {
    return <div style={{ padding: 30 }}>Yükleniyor...</div>;
  }

  return (
    <main style={{ padding: 32, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Form Tasarımcısı</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Kapıda ödeme form alanlarını, ücretleri ve görünümü buradan yöneteceksin.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr .8fr", gap: 24 }}>
        <section style={card}>
          <h2>Form Alanları</h2>

          {["Ad Soyad", "Telefon", "İl", "İlçe", "Açık Adres"].map((field) => (
            <div key={field} style={fieldRow}>
              <strong>{field}</strong>
              <span style={{ color: "#16a34a" }}>Aktif</span>
            </div>
          ))}

          <button style={button}>+ Alan Ekle</button>
        </section>

        <section style={card}>
          <h2>Canlı Önizleme</h2>

          <div style={preview}>
            <h3>Kapıda Ödeme</h3>
            <input placeholder="Ad Soyad" style={input} />
            <input placeholder="Telefon" style={input} />
            <input placeholder="İl" style={input} />
            <input placeholder="İlçe" style={input} />
            <textarea placeholder="Açık Adres" style={{ ...input, height: 80 }} />
            <button style={{ ...button, width: "100%" }}>Siparişi Tamamla</button>
          </div>
        </section>
      </div>
    </main>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 14,
  padding: 20,
};

const fieldRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 0",
  borderBottom: "1px solid #eee",
};

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 10,
  border: "1px solid #ddd",
  borderRadius: 10,
};

const button = {
  marginTop: 14,
  padding: "12px 16px",
  background: "#111827",
  color: "#fff",
  border: 0,
  borderRadius: 10,
  fontWeight: 700,
};

const preview = {
  border: "1px solid #eee",
  borderRadius: 14,
  padding: 18,
};