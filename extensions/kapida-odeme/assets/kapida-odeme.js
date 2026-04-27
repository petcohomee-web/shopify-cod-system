/* kapida-odeme.js — Theme App Extension asset
   Bağımlılık yok, vanilla JS.
   window.KO_BACKEND_URL → App Embed schema'dan gelir.
*/
(function () {
  'use strict';

  const BACKEND = (window.KO_BACKEND_URL || '').replace(/\/$/, '');

  /* ── DOM refs ────────────────────────────────────────────── */
  const overlay    = document.getElementById('ko-modal-overlay');
  const closeBtn   = document.getElementById('ko-close');
  const step1El    = document.getElementById('ko-step-1');
  const step2El    = document.getElementById('ko-step-2');
  const step3El    = document.getElementById('ko-step-3');
  const loadingEl  = document.getElementById('ko-loading');

  if (!overlay) return; // App Embed devre dışıysa çık

  /* ── State ───────────────────────────────────────────────── */
  let verifiedPhone  = '';
  let activeVariant  = {};

  /* ── Helpers ─────────────────────────────────────────────── */
  function setStep(n) {
    [step1El, step2El, step3El].forEach((el, i) => {
      if (el) el.hidden = i + 1 !== n;
    });
  }

  function setLoading(on) {
    if (loadingEl) loadingEl.hidden = !on;
    document.querySelectorAll('.ko-btn-primary').forEach(b => { b.disabled = on; });
  }

  function setError(step, msg) {
    const el = document.getElementById('ko-step' + step + '-error');
    if (el) el.textContent = msg;
  }

  function normalizePhone(raw) {
    const t = raw.trim();
    if (t.startsWith('+')) return t;
    if (t.startsWith('0'))  return '+90' + t.slice(1);
    return '+90' + t;
  }

  function openModal(triggerBtn) {
    activeVariant = {
      id:    triggerBtn.dataset.variantId,
      title: triggerBtn.dataset.productTitle,
      price: triggerBtn.dataset.price,
    };
    setStep(1);
    setLoading(false);
    setError(1, '');
    setError(2, '');
    overlay.classList.add('ko-open');
    document.body.style.overflow = 'hidden';
    document.getElementById('ko-fullname').focus();
  }

  function closeModal() {
    overlay.classList.remove('ko-open');
    document.body.style.overflow = '';
  }

  /* ── Variant change (Shopify theme event) ────────────────── */
  document.addEventListener('variant:changed', function (e) {
    const v = e.detail?.variant;
    if (!v) return;
    document.querySelectorAll('.ko-trigger-btn').forEach(btn => {
      btn.dataset.variantId = v.id;
      btn.dataset.price     = (v.price / 100).toFixed(2);
    });
  });

  /* ── Trigger buttons (delegated — works after dynamic render) */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.ko-trigger-btn');
    if (btn) { openModal(btn); return; }

    if (e.target === overlay) closeModal();
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('ko-open')) closeModal();
  });

  /* ── Step 1 → send OTP ───────────────────────────────────── */
  const sendBtn = document.getElementById('ko-send-otp-btn');
  if (sendBtn) sendBtn.addEventListener('click', sendOtp);

  const resendBtn = document.getElementById('ko-resend-btn');
  if (resendBtn) resendBtn.addEventListener('click', sendOtp);

  async function sendOtp() {
    const fullname = document.getElementById('ko-fullname').value.trim();
    const phone    = document.getElementById('ko-phone').value.trim();
    const city     = document.getElementById('ko-city').value.trim();
    const district = document.getElementById('ko-district').value.trim();
    const address  = document.getElementById('ko-address').value.trim();
    const qty      = document.getElementById('ko-qty').value;

    if (!fullname || !phone || !city || !district || !address || !qty) {
      setError(1, 'Lütfen tüm alanları doldurun.'); return;
    }
    if (!/^[0-9\s\+\-]{10,13}$/.test(phone)) {
      setError(1, 'Geçerli bir telefon numarası girin.'); return;
    }

    setError(1, '');
    setLoading(true);

    try {
      const res  = await fetch(BACKEND + '/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) { setError(1, data.error || 'SMS gönderilemedi.'); return; }

      verifiedPhone = data.phone;
      document.getElementById('ko-phone-display').textContent = verifiedPhone;
      document.getElementById('ko-otp').value = '';
      setStep(2);
    } catch {
      setLoading(false);
      setError(1, 'Sunucuya bağlanılamadı, tekrar deneyin.');
    }
  }

  /* ── Step 2 → verify + create order ─────────────────────── */
  const verifyBtn = document.getElementById('ko-verify-btn');
  if (verifyBtn) verifyBtn.addEventListener('click', verifyAndOrder);

  async function verifyAndOrder() {
    const code = document.getElementById('ko-otp').value.trim();
    if (code.length !== 6) { setError(2, '6 haneli kodu girin.'); return; }

    setError(2, '');
    setLoading(true);

    try {
      /* 1 — verify */
      const vRes  = await fetch(BACKEND + '/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: verifiedPhone, code }),
      });
      const vData = await vRes.json();

      if (!vRes.ok) {
        setLoading(false);
        setError(2, vData.error || 'Kod hatalı.');
        return;
      }

      /* 2 — order */
      const oRes  = await fetch(BACKEND + '/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:     document.getElementById('ko-fullname').value.trim(),
          phone:        verifiedPhone,
          city:         document.getElementById('ko-city').value.trim(),
          district:     document.getElementById('ko-district').value.trim(),
          address:      document.getElementById('ko-address').value.trim(),
          quantity:     Number(document.getElementById('ko-qty').value),
          variantId:    activeVariant.id,
          productTitle: activeVariant.title,
          price:        activeVariant.price,
        }),
      });
      const oData = await oRes.json();
      setLoading(false);

      if (!oRes.ok) { setError(2, oData.error || 'Sipariş oluşturulamadı.'); return; }

      /* Pixel event */
      if (window.KO_PIXEL_ID && window.fbq) {
        fbq('track', 'Purchase', { value: activeVariant.price, currency: 'TRY' });
      }

      document.getElementById('ko-order-info').textContent =
        'Sipariş No: ' + oData.orderName + ' — Kapıda ödeme ile teslimatta ödersiniz.';
      setStep(3);
    } catch {
      setLoading(false);
      setError(2, 'Sunucuya bağlanılamadı, tekrar deneyin.');
    }
  }

  /* ── Step 3 → close ──────────────────────────────────────── */
  const doneBtn = document.getElementById('ko-done-btn');
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

})();
