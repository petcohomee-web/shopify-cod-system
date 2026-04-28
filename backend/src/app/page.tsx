"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [codFee, setCodFee] = useState("0");
  const [upsell, setUpsell] = useState("Evet");
  const [sms, setSms] = useState("Kapalı");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setCodFee(localStorage.getItem("codFee") || "0");
    setUpsell(localStorage.getItem("upsell") || "Evet");
    setSms(localStorage.getItem("sms") || "Kapalı");
  }, []);

  function saveSettings() {
    localStorage.setItem("codFee", codFee);
    localStorage.setItem("upsell", upsell);
    localStorage.setItem("sms", sms);
    setSaved("✅ Ayarlar kaydedildi");
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Movika COD App Panel</h1>

      <div style={{ marginTop: "20px" }}>
        <label>Kapıda Ödeme Ücreti (TL)</label>
        <input
          type="number"
          value={codFee}
          onChange={(e) => setCodFee(e.target.value)}
          style={{ display: "block", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Upsell Aktif</label>
        <select
          value={upsell}
          onChange={(e) => setUpsell(e.target.value)}
          style={{ display: "block", marginTop: "5px" }}
        >
          <option>Evet</option>
          <option>Hayır</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>SMS Doğrulama</label>
        <select
          value={sms}
          onChange={(e) => setSms(e.target.value)}
          style={{ display: "block", marginTop: "5px" }}
        >
          <option>Kapalı</option>
          <option>Açık</option>
        </select>
      </div>

      <button
        onClick={saveSettings}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
        }}
      >
        Kaydet
      </button>

      <p>{saved}</p>
    </div>
  );
}