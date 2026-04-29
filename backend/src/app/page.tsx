"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch("/api/form-config")
      .then(res => res.json())
      .then(data => {
        setConfig(data.data);
      });
  }, []);

  if (!config) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Kapıda Ödeme Formu</h2>

      {config.fields.map((field: any, i: number) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <label>{field.label}</label>
          <input
            type={field.type}
            required={field.required}
            style={{ display: "block", width: "100%", padding: 8 }}
          />
        </div>
      ))}

      <button style={{ padding: 10, marginTop: 20 }}>
        {config.design.buttonText}
      </button>
    </div>
  );
}