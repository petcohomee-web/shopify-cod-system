"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Field = {
  id: string;
  label: string;
  type: "text" | "tel" | "textarea";
  active: boolean;
  required: boolean;
};

export default function FormDesignerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("Kapıda Ödeme");
  const [buttonText, setButtonText] = useState("Siparişi Tamamla");
  const [codFee, setCodFee] = useState("0");
  const [fields, setFields] = useState<Field[]>([
    { id: "fullName", label: "Ad Soyad", type: "text", active: true, required: true },
    { id: "phone", label: "Telefon", type: "tel", active: true, required: true },
    { id: "city", label: "İl", type: "text", active: true, required: true },
    { id: "district", label: "İlçe", type: "text", active: true, required: true },
    { id: "address", label: "Açık Adres", type: "textarea", active: true, required: true },
  ]);

  useEffect(() => {
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.fields) setFields(data.fields);
        if (data?.design?.title) setTitle(data.design.title);
        if (data?.design?.buttonText) setButtonText(data.design.buttonText);
        if (data?.design?.codFee !== undefined) setCodFee(String(data.design.codFee));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function addField() {
    const label = prompt("Alan adı gir:");
    if (!label) return;

    setFields([
      ...fields,
      {
        id: `field_${Date.now()}`,
        label,
        type: "text",
        active: true,
        required: false,
      },
    ]);
  }

  function updateField(id: string, patch: Partial<Field>) {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  }

  function deleteField(id: string) {
    setFields(fields.filter((field) => field.id !== id));
  }

  async function saveConfig() {
    setSaving(true);

    await fetch("/api/form-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        design: {
          title,
          buttonText,
          codFee,
        },
        language: "tr",
      }),
    });

    setSaving(false);
    alert("Kaydedildi");
  }

  if (loading) {
    return <main style={page}>Yükleniyor...</main>;
  }

  return (
    <main style={page}>
      <div style={top}>
        <div>
          <h1 style={h1}>Form Tasarımcısı</h1>
          <p style={muted}>Kapıda ödeme form alanlarını, ücretleri ve görünümü buradan yönet.</p>
        </div>

        <button style={saveButton} onClick={saveConfig} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      <div style={grid}>
        <section style={card}>
          <h2 style={h2}>Genel Ayarlar</h2>

          <label style={label}>Form Başlığı</label>
          <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />

          <label style={label}>Buton Yazısı</label>
          <input style={input} value={buttonText} onChange={(e) => setButtonText(e.target.value)} />

          <label style={label}>Kapıda Ödeme Ücreti</label>
          <input style={input} value={codFee} onChange={(e) => setCodFee(e.target.value)} />
        </section>

        <section style={card}>
          <h2 style={h2}>Form Alanları</h2>

          {fields.map((field) => (
            <div key={field.id} style={fieldRow}>
              <input
                style={fieldName}
                value={field.label}
                onChange={(e) => updateField(field.id, { label: e.target.value })}
              />

              <select
                style={select}
                value={field.type}
                onChange={(e) => updateField(field.id, { type: e.target.value as Field["type"] })}
              >
                <option value="text">Text</option>
                <option value="tel">Telefon</option>
                <option value="textarea">Textarea</option>
              </select>

              <button
                style={smallButton}
                onClick={() => updateField(field.id, { active: !field.active })}
              >
                {field.active ? "Aktif" : "Pasif"}
              </button>

              <button
                style={smallButton}
                onClick={() => updateField(field.id, { required: !field.required })}
              >
                {field.required ? "Zorunlu" : "Opsiyonel"}
              </button>

              <button style={dangerButton} onClick={() => deleteField(field.id)}>
                Sil
              </button>
            </div>
          ))}

          <button style={addButton} onClick={addField}>
            + Alan Ekle
          </button>
        </section>

        <section style={previewCard}>
          <h2 style={h2}>Canlı Önizleme</h2>

          <div style={preview}>
            <h3 style={previewTitle}>{title}</h3>

            {fields
              .filter((field) => field.active)
              .map((field) =>
                field.type === "textarea" ? (
                  <textarea
                    key={field.id}
                    placeholder={field.label}
                    required={field.required}
                    style={{ ...previewInput, height: 90 }}
                  />
                ) : (
                  <input
                    key={field.id}
                    type={field.type}
                    placeholder={field.label}
                    required={field.required}
                    style={previewInput}
                  />
                )
              )}

            <div style={totalBox}>
              <span>Kapıda ödeme ücreti</span>
              <strong>{codFee} TL</strong>
            </div>

            <button style={previewButton}>{buttonText}</button>
          </div>
        </section>
      </div>
    </main>
  );
}

const page: CSSProperties = {
  padding: 32,
  fontFamily: "Arial, sans-serif",
  background: "#f6f6f7",
  minHeight: "100vh",
};

const top: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
};

const h1: CSSProperties = {
  fontSize: 30,
  margin: 0,
};

const h2: CSSProperties = {
  marginTop: 0,
  fontSize: 20,
};

const muted: CSSProperties = {
  color: "#6b7280",
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1.4fr",
  gap: 20,
  alignItems: "start",
};

const card: CSSProperties = {
  background: "#fff",
  border: "1px solid #ddd",
  borderRadius: 16,
  padding: 20,
};

const previewCard: CSSProperties = {
  ...card,
  gridColumn: "2",
  gridRow: "1 / span 2",
};

const label: CSSProperties = {
  display: "block",
  fontWeight: 700,
  marginTop: 12,
  marginBottom: 6,
};

const input: CSSProperties = {
  width: "100%",
  padding: 12,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  boxSizing: "border-box",
};

const fieldRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 110px 80px 95px 55px",
  gap: 8,
  alignItems: "center",
  borderBottom: "1px solid #eee",
  padding: "10px 0",
};

const fieldName: CSSProperties = {
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const select: CSSProperties = {
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 8,
};

const smallButton: CSSProperties = {
  padding: "9px 8px",
  border: "1px solid #ddd",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
};

const dangerButton: CSSProperties = {
  ...smallButton,
  color: "#b91c1c",
};

const addButton: CSSProperties = {
  marginTop: 16,
  padding: "12px 16px",
  background: "#111827",
  color: "#fff",
  border: 0,
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const saveButton: CSSProperties = {
  padding: "12px 18px",
  background: "#008060",
  color: "#fff",
  border: 0,
  borderRadius: 10,
  fontWeight: 800,
  cursor: "pointer",
};

const preview: CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 22,
  maxWidth: 520,
};

const previewTitle: CSSProperties = {
  fontSize: 22,
  marginTop: 0,
};

const previewInput: CSSProperties = {
  width: "100%",
  padding: 13,
  marginBottom: 10,
  border: "1px solid #d1d5db",
  borderRadius: 10,
  boxSizing: "border-box",
};

const totalBox: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  background: "#f3f4f6",
  padding: 13,
  borderRadius: 10,
  marginBottom: 12,
};

const previewButton: CSSProperties = {
  width: "100%",
  padding: 15,
  background: "#111827",
  color: "#fff",
  border: 0,
  borderRadius: 12,
  fontWeight: 800,
};