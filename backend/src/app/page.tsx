"use client";

import { useEffect, useState } from "react";

type Field = {
  type: string;
  label: string;
  required: boolean;
  hidden?: boolean;
};

export default function Page() {
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
          setDesign((prev) => ({
            ...prev,
            ...(data.data.design || {}),
          }));
        }
      });
  }, []);

  function addField() {
    setFields([
      ...fields,
      { type: "text", label: "Yeni Alan", required: false, hidden: false },
    ]);
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
      body: JSON.stringify({
        language,
        fields,
        design,
      }),
    });

    const data = await res.json();
    setStatus(data.success ? "✅ Kaydedildi" : "❌ Hata oluştu");
  }

  return (
    <div style={{ padding: 30, fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Real COD FORM</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 16 }}>
          <h2>Form Tasarımcısı</h2>

          <label>Dil</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 12 }}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>

          <label>Başlık</label>
          <input value={design.title} onChange={(e) => updateDesign("title", e.target.value)} style={inputStyle} />

          <label>Alt Yazı</label>
          <input value={design.subtitle} onChange={(e) => updateDesign("subtitle", e.target.value)} style={inputStyle} />

          <label>Buton Yazısı</label>
          <input value={design.buttonText} onChange={(e) => updateDesign("buttonText", e.target.value)} style={inputStyle} />

          <label>Kapıda Ödeme Ücreti</label>
          <input value={design.codFee} onChange={(e) => updateDesign("codFee", e.target.value)} style={inputStyle} />

          <label>Güven Yazısı</label>
          <input value={design.trustText} onChange={(e) => updateDesign("trustText", e.target.value)} style={inputStyle} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label>Buton Rengi</label>
              <input type="color" value={design.buttonColor} onChange={(e) => updateDesign("buttonColor", e.target.value)} style={colorStyle} />
            </div>

            <div>
              <label>Buton Yazı Rengi</label>
              <input type="color" value={design.buttonTextColor} onChange={(e) => updateDesign("buttonTextColor", e.target.value)} style={colorStyle} />
            </div>

            <div>
              <label>Arka Plan</label>
              <input type="color" value={design.backgroundColor} onChange={(e) => updateDesign("backgroundColor", e.target.value)} style={colorStyle} />
            </div>

            <div>
              <label>Yazı Rengi</label>
              <input type="color" value={design.textColor} onChange={(e) => updateDesign("textColor", e.target.value)} style={colorStyle} />
            </div>
          </div>

          <label>Köşe Yuvarlaklığı</label>
          <input type="number" value={design.borderRadius} onChange={(e) => updateDesign("borderRadius", e.target.value)} style={inputStyle} />

          <hr />

          <h3>Alanlar</h3>

          <button onClick={addField} style={smallButton}>+ Alan Ekle</button>

          {fields.map((field, i) => (
            <div key={i} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12, marginTop: 10 }}>
              <input value={field.label} onChange={(e) => updateField(i, "label", e.target.value)} style={inputStyle} />

              <select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)} style={inputStyle}>
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

        <div style={{ background: "#fff", padding: 24, borderRadius: 16 }}>
          <h2>Canlı Önizleme</h2>

          <div
            style={{
              background: design.backgroundColor,
              color: design.textColor,
              padding: 24,
              borderRadius: Number(design.borderRadius),
              border: "1px solid #eee",
              maxWidth: 460,
            }}
          >
            <h2>{design.title}</h2>
            <p style={{ opacity: 0.75 }}>{design.subtitle}</p>

            <div style={{ padding: 14, border: "1px solid #eee", borderRadius: 14, marginBottom: 14 }}>
              <strong>Movika™ Göz Kalemi</strong>
              <div>999.99TL</div>
            </div>

            {fields.filter((f) => !f.hidden).map((field, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label>{field.label}{field.required ? " *" : ""}</label>
                <input type={field.type} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd" }} />
              </div>
            ))}

            <div style={{ background: "#f7f7f7", padding: 14, borderRadius: 14, marginTop: 12 }}>
              <div style={rowStyle}><span>Ürün Toplamı</span><strong>999.99TL</strong></div>
              <div style={rowStyle}><span>Kapıda Ödeme</span><strong>{design.codFee}TL</strong></div>
              <div style={rowStyle}><span>Toplam</span><strong>{999.99 + Number(design.codFee || 0)}TL</strong></div>
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

const inputStyle = {
  width: "100%",
  padding: 10,
  margin: "6px 0 12px",
  border: "1px solid #ddd",
  borderRadius: 10,
};

const colorStyle = {
  width: "100%",
  height: 42,
  margin: "6px 0 12px",
};

const smallButton = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const saveButton = {
  marginTop: 18,
  padding: "12px 18px",
  borderRadius: 12,
  border: 0,
  background: "#111",
  color: "#fff",
  fontWeight: 900,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 8,
};