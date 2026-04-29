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
  const [buttonText, setButtonText] = useState("Siparişi Tamamla");
  const [fields, setFields] = useState<Field[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setLanguage(data.data.language || "tr");
          setFields(data.data.fields || []);
          setButtonText(data.data.design?.buttonText || "Siparişi Tamamla");
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

  async function saveForm() {
    setStatus("Kaydediliyor...");

    const res = await fetch("/api/form-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        fields,
        design: { buttonText },
      }),
    });

    const data = await res.json();
    setStatus(data.success ? "✅ Form kaydedildi" : "❌ Hata oluştu");
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial", maxWidth: 900 }}>
      <h1>Form Builder</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Dil</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Buton Yazısı</label>
        <input value={buttonText} onChange={(e) => setButtonText(e.target.value)} style={{ marginLeft: 10, padding: 8 }} />
      </div>

      <button onClick={addField} style={{ padding: 10, marginBottom: 20 }}>
        + Alan Ekle
      </button>

      {fields.map((field, i) => (
        <div key={i} style={{ border: "1px solid #ddd", padding: 15, marginBottom: 12, borderRadius: 10 }}>
          <input
            value={field.label}
            onChange={(e) => updateField(i, "label", e.target.value)}
            placeholder="Alan adı"
            style={{ padding: 8, marginRight: 8 }}
          />

          <select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)} style={{ padding: 8, marginRight: 8 }}>
            <option value="text">Text</option>
            <option value="tel">Telefon</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
          </select>

          <label style={{ marginRight: 10 }}>
            <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, "required", e.target.checked)} />
            Zorunlu
          </label>

          <label style={{ marginRight: 10 }}>
            <input type="checkbox" checked={field.hidden || false} onChange={(e) => updateField(i, "hidden", e.target.checked)} />
            Gizle
          </label>

          <button onClick={() => deleteField(i)}>Sil</button>
        </div>
      ))}

      <button onClick={saveForm} style={{ padding: 12, background: "black", color: "white", borderRadius: 8 }}>
        Kaydet
      </button>

      <p>{status}</p>

      <hr style={{ margin: "30px 0" }} />

      <h2>Canlı Önizleme</h2>

      {fields.filter(f => !f.hidden).map((field, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <label>{field.label}{field.required ? " *" : ""}</label>
          <input type={field.type} required={field.required} style={{ display: "block", width: "100%", padding: 10 }} />
        </div>
      ))}

      <button style={{ padding: 12, background: "#00a86b", color: "white", border: 0, borderRadius: 8 }}>
        {buttonText}
      </button>
    </div>
  );
}