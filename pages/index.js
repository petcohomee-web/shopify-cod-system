import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    fullName: '', phone: '', city: '', district: '',
    address: '', variantId: '', quantity: '1',
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          price: '0.00',
          productTitle: 'Test Ürün',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(`Sipariş oluşturuldu: ${data.orderName} (ID: ${data.orderId})`);
      } else {
        setStatus('error');
        setMessage(data.error || 'Bilinmeyen hata.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Sunucuya bağlanılamadı: ' + err.message);
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1.5px solid #d1d5db',
    borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box',
    outline: 'none',
  };

  const fields = [
    { label: 'Ad Soyad',    name: 'fullName',  type: 'text',   placeholder: 'Ahmet Yılmaz' },
    { label: 'Telefon',     name: 'phone',     type: 'tel',    placeholder: '05xx xxx xx xx' },
    { label: 'İl',          name: 'city',      type: 'text',   placeholder: 'İstanbul' },
    { label: 'İlçe',        name: 'district',  type: 'text',   placeholder: 'Kadıköy' },
    { label: 'Açık Adres',  name: 'address',   type: 'text',   placeholder: 'Mahalle, sokak, bina no...' },
    { label: 'Variant ID',  name: 'variantId', type: 'text',   placeholder: 'Shopify variant ID (sayı)' },
    { label: 'Adet',        name: 'quantity',  type: 'number', placeholder: '1' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '32px 28px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 700, color: '#111' }}>Kapıda Ödeme — Test Formu</h1>
        <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#6b7280' }}>
          <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>POST /api/order</code> endpoint'ini test eder.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {fields.map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px', color: '#374151' }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                min={name === 'quantity' ? 1 : undefined}
                style={inputStyle}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              marginTop: '4px', width: '100%', padding: '11px',
              background: status === 'loading' ? '#86efac' : '#16a34a',
              color: '#fff', border: 'none', borderRadius: '7px',
              fontSize: '15px', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              transition: 'background .2s',
            }}
          >
            {status === 'loading' ? 'Gönderiliyor...' : 'Sipariş Oluştur'}
          </button>
        </form>

        {status === 'success' && (
          <div style={{ marginTop: '16px', padding: '12px 14px', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '7px', color: '#15803d', fontSize: '14px' }}>
            ✓ {message}
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: '16px', padding: '12px 14px', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '7px', color: '#b91c1c', fontSize: '14px' }}>
            ✗ {message}
          </div>
        )}
      </div>
    </div>
  );
}
