"use client";

import { useEffect, useState } from "react";

type Field = {
  type: string;
  label: string;
  required: boolean;
  hidden?: boolean;
};

const menuItems = [
  "Kontrol Paneli",
  "Form Tasarımcısı",
  "Dolandırıcılık Önleme",
  "Teslimat Başarısı",
  "Satış Artırıcı",
  "Analitik",
  "Ayarlar & Entegrasyonlar",
  "Fatura Planları",
];

export default function Page() {
  const [activePage, setActivePage] = useState("Kontrol Paneli");
  const [language, setLanguage] = useState("tr");
  const [fields, setFields] = useState<Field[]>([]);
  const [status, setStatus] = useState("");

  const [design, setDesign] = useState({
    title: "Kapıda Ödeme",
    subtitle: "Bilgilerinizi girin, siparişinizi hemen oluşturalım.",
    buttonText: "Siparişi Tamamla",
    buttonColor: "#111111",
    buttonTextColor: "#ffffff",
    backgroundColor: "#ffffff",
    textColor: "#111111",
    borderRadius: "18",
    codFee: "70",
    trustText: "🔒 Güvenli sipariş • 📦 Kapıda ödeme • ✅ Hızlı teslimat",
  });

  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setLanguage(data.data.language || "tr");
          setFields(data.data.fields || []);
          setDesign((prev) => ({ ...prev, ...(data.data.design || {}) }));
        }
      });
  }, []);

  function addField() {
    setFields([...fields, { type: "text", label: "Yeni Alan", required: false, hidden: false }]);
  }

  function updateField(index: number, key: keyof Field, value: any) {
    const copy = [...fields];
    copy[index] = { ...copy[index], [key]: value };
    setFields(copy);
  }

  function deleteField(index: number) {
    setFields(fields.filter((_, i) => i !== index));
  }

  function updateDesign(key: string, value: string) {
    setDesign({ ...design, [key]: value });
  }

  async function saveForm() {
    setStatus("Kaydediliyor...");

    const res = await fetch("/api/form-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, fields, design }),
    });

    const data = await res.json();
    setStatus(data.success ? "✅ Kaydedildi" : "❌ Hata oluştu");
  }

  return (
    <div style={app}>
      <aside style={sidebar}>
        <h2 style={{ marginBottom: 24 }}>Real COD FORM</h2>

        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActivePage(item)}
            style={{
              ...navButton,
              background: activePage === item ? "#111" : "transparent",
              color: activePage === item ? "#fff" : "#222",
            }}
          >
            {item}
          </button>
        ))}
      </aside>

      <main style={main}>
        {activePage === "Kontrol Paneli" && <Dashboard />}
        {activePage === "Form Tasarımcısı" && (
          <FormDesigner
            language={language}
            setLanguage={setLanguage}
            fields={fields}
            addField={addField}
            updateField={updateField}
            deleteField={deleteField}
            design={design}
            updateDesign={updateDesign}
            saveForm={saveForm}
            status={status}
          />
        )}
        {activePage !== "Kontrol Paneli" && activePage !== "Form Tasarımcısı" && (
          <Placeholder title={activePage} />
        )}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h1>Kontrol Paneli</h1>

      <div style={grid4}>
        <Card title="Form Açılışları" value="0" />
        <Card title="Siparişler" value="0" />
        <Card title="Gelir" value="0 TL" />
        <Card title="Dönüşüm Oranı" value="0%" />
      </div>

      <div style={card}>
        <h2>Tema App Embed</h2>
        <p style={{ color: "#00a86b", fontWeight: 800 }}>Aktif / Hazır</p>
        <p>Formu ürün sayfasında göstermek için tema tarafındaki COD form bağlantısı kullanılacak.</p>
      </div>

      <div style={card}>
        <h2>Kurulum Rehberi</h2>
        <p>1. Form Tasarımcısı bölümünden formu ayarla.</p>
        <p>2. Kapıda ödeme ücreti ve tasarımı belirle.</p>
        <p>3. Ürün sayfasında formu test et.</p>
      </div>

      <div style={card}>
        <h2>Sonraki Özellikler</h2>
        <p>Fraud prevention, upsell, analitik, SMS/WhatsApp OTP ve entegrasyonlar eklenecek.</p>
      </div>
    </div>
  );
}

function FormDesigner(props: any) {
  const {
    language,
    setLanguage,
    fields,
    addField,
    updateField,
    deleteField,
    design,
    updateDesign,
    saveForm,
    status,
  } = props;

  return (
    <div>
      <h1>Form Tasarımcısı</h1>

      <div style={twoCol}>
        <div style={card}>
          <h2>Ayarlar</h2>

          <label>Dil</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={input}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>

          <label>Başlık</label>
          <input value={design.title} onChange={(e) => updateDesign("title", e.target.value)} style={input} />

          <label>Alt Yazı</label>
          <input value={design.subtitle} onChange={(e) => updateDesign("subtitle", e.target.value)} style={input} />

          <label>Buton Yazısı</label>
          <input value={design.buttonText} onChange={(e) => updateDesign("buttonText", e.target.value)} style={input} />

          <label>Kapıda Ödeme Ücreti</label>
          <input value={design.codFee} onChange={(e) => updateDesign("codFee", e.target.value)} style={input} />

          <label>Güven Yazısı</label>
          <input value={design.trustText} onChange={(e) => updateDesign("trustText", e.target.value)} style={input} />

          <div style={twoColSmall}>
            <Color label="Buton Rengi" value={design.buttonColor} onChange={(v: string) => updateDesign("buttonColor", v)} />
            <Color label="Buton Yazı Rengi" value={design.buttonTextColor} onChange={(v: string) => updateDesign("buttonTextColor", v)} />
            <Color label="Arka Plan" value={design.backgroundColor} onChange={(v: string) => updateDesign("backgroundColor", v)} />
            <Color label="Yazı Rengi" value={design.textColor} onChange={(v: string) => updateDesign("textColor", v)} />
          </div>

          <label>Köşe Yuvarlaklığı</label>
          <input type="number" value={design.borderRadius} onChange={(e) => updateDesign("borderRadius", e.target.value)} style={input} />

          <h3>Alanlar</h3>
          <button onClick={addField} style={lightButton}>+ Alan Ekle</button>

          {fields.map((field: Field, i: number) => (
            <div key={i} style={fieldBox}>
              <input value={field.label} onChange={(e) => updateField(i, "label", e.target.value)} style={input} />

              <select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)} style={input}>
                <option value="text">Text</option>
                <option value="tel">Telefon</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>

              <label>
                <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, "required", e.target.checked)} />
                Zorunlu
              </label>

              <label style={{ marginLeft: 12 }}>
                <input type="checkbox" checked={field.hidden || false} onChange={(e) => updateField(i, "hidden", e.target.checked)} />
                Gizle
              </label>

              <button onClick={() => deleteField(i)} style={{ marginLeft: 12 }}>Sil</button>
            </div>
          ))}

          <button onClick={saveForm} style={saveButton}>Kaydet</button>
          <p>{status}</p>
        </div>

        <div style={card}>
          <h2>Canlı Önizleme</h2>

          <div
            style={{
              background: design.backgroundColor,
              color: design.textColor,
              padding: 24,
              borderRadius: Number(design.borderRadius),
              border: "1px solid #eee",
            }}
          >
            <h2>{design.title}</h2>
            <p style={{ opacity: 0.75 }}>{design.subtitle}</p>

            <div style={productBox}>
              <strong>Movika™ Göz Kalemi</strong>
              <div>999.99 TL</div>
            </div>

            {fields.filter((f: Field) => !f.hidden).map((field: Field, i: number) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{field.label}{field.required ? " *" : ""}</label>
                <input type={field.type} style={input} />
              </div>
            ))}

            <div style={summary}>
              <div style={row}><span>Ürün Toplamı</span><strong>999.99 TL</strong></div>
              <div style={row}><span>Kapıda Ödeme</span><strong>{design.codFee} TL</strong></div>
              <div style={row}><span>Toplam</span><strong>{999.99 + Number(design.codFee || 0)} TL</strong></div>
            </div>

            <p style={{ textAlign: "center", fontSize: 13 }}>{design.trustText}</p>

            <button
              style={{
                width: "100%",
                padding: 15,
                border: 0,
                borderRadius: 14,
                background: design.buttonColor,
                color: design.buttonTextColor,
                fontWeight: 900,
              }}
            >
              {design.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <div style={card}>
        <h2>Yakında</h2>
        <p>Bu bölüm sonraki aşamada doldurulacak.</p>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <p style={{ color: "#666", margin: 0 }}>{title}</p>
      <h2 style={{ marginBottom: 0 }}>{value}</h2>
    </div>
  );
}

function Color({ label, value, onChange }: any) {
  return (
    <div>
      <label>{label}</label>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", height: 42 }} />
    </div>
  );
}

const app = { display: "flex", minHeight: "100vh", fontFamily: "Arial", background: "#f5f5f5" };
const sidebar = { width: 260, background: "#fff", padding: 22, borderRight: "1px solid #ddd" };
const main = { flex: 1, padding: 28 };
const navButton = { width: "100%", textAlign: "left" as const, padding: "12px 14px", border: 0, borderRadius: 10, marginBottom: 8, cursor: "pointer", fontWeight: 700 };
const card = { background: "#fff", padding: 22, borderRadius: 16, marginBottom: 18, border: "1px solid #eee" };
const grid4 = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 };
const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 };
const twoColSmall = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const input = { width: "100%", padding: 10, margin: "6px 0 12px", border: "1px solid #ddd", borderRadius: 10 };
const lightButton = { padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" };
const saveButton = { marginTop: 18, padding: "12px 18px", borderRadius: 12, border: 0, background: "#111", color: "#fff", fontWeight: 900 };
const fieldBox = { border: "1px solid #ddd", padding: 12, borderRadius: 12, marginTop: 10 };
const productBox = { padding: 14, border: "1px solid #eee", borderRadius: 14, marginBottom: 14 };
const summary = { background: "#f7f7f7", padding: 14, borderRadius: 14, marginTop: 12 };
const row = { display: "flex", justifyContent: "space-between", marginBottom: 8 };