export default function Page() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Movika COD App Panel</h1>

      <div style={{ marginTop: "20px" }}>
        <label>Kapıda Ödeme Ücreti (TL)</label>
        <input type="number" placeholder="0" style={{ display: "block", marginTop: "5px" }} />
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>Upsell Aktif</label>
        <select style={{ display: "block", marginTop: "5px" }}>
          <option>Evet</option>
          <option>Hayır</option>
        </select>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>SMS Doğrulama</label>
        <select style={{ display: "block", marginTop: "5px" }}>
          <option>Kapalı</option>
          <option>Açık</option>
        </select>
      </div>

      <button
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
    </div>
  );
}