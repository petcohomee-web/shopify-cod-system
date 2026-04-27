# Shopify Kapida Odeme Sistemi

Shopify App Store kullanmadan, kendi maganizda kapida odeme imkani sunar.
SMS dogrulama (Twilio) + Shopify Admin API ile siparis olusturur.

---

## Proje Yapisi

```
shopify-iin-sms-dorulamal/
├── backend/                        ← Next.js API sunucusu
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── api/
│   │   │       ├── health/route.ts
│   │   │       ├── send-otp/route.ts     ← SMS gonder
│   │   │       ├── verify-otp/route.ts   ← OTP dogrula
│   │   │       └── create-order/route.ts ← Shopify siparisi olustur
│   │   └── lib/
│   │       └── otpStore.ts               ← In-memory OTP cache
│   ├── .env.local          ← BURAYA kendi bilgilerinizi girin
│   ├── .env.example
│   ├── next.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── shopify-theme/
    └── snippets/
        └── kapida-odeme.liquid  ← Tema'ya eklenecek snippet
```

---

## ADIM 1 — Backend Kurulumu

```bash
cd backend
npm install
```

### .env.local Dosyasini Doldurun

`backend/.env.local` dosyasini acin ve su degerleri girin:

| Degisken | Nereden Alinir |
|---|---|
| `TWILIO_ACCOUNT_SID` | https://console.twilio.com → Account Info |
| `TWILIO_AUTH_TOKEN` | Ayni sayfa |
| `TWILIO_PHONE_NUMBER` | Twilio'dan aldiginiz numara (+1... veya +90...) |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` (https:// olmadan) |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Shopify Admin → Settings → Apps → Develop apps → API credentials → Admin API access token (kapsam: `write_orders, read_products`) |
| `ALLOWED_ORIGIN` | `https://your-store.myshopify.com` |

### Calistirma

```bash
# Gelistirme modu (localhost:3001)
npm run dev

# Production build
npm run build
npm start
```

Calistiktan sonra tarayicida http://localhost:3001/api/health adresine gidin.
`{"status":"ok"}` goruyorsaniz backend calisiyor demektir.

---

## ADIM 2 — Backend'i Internete Acma

Shopify maganizin JavaScript'i tarayicidan backend'e istek atar.
Bu nedenle backend'in HTTPS ile erisebilir olmasi gerekir.

**Secenekler:**

### A) ngrok ile hizli test (ucretsiz)
```bash
ngrok http 3001
# Size https://xxxx.ngrok.io gibi bir URL verir
```

### B) Vercel ile deploy (onerilir)
```bash
npm i -g vercel
cd backend
vercel --prod
# Ortam degiskenlerini Vercel dashboard'dan ekleyin
```

---

## ADIM 3 — Shopify Tema Entegrasyonu

### 3.1 Snippet'i yukleyin
`shopify-theme/snippets/kapida-odeme.liquid` dosyasini Shopify Admin'e yukleyin:

**Shopify Admin → Online Store → Themes → Edit Code → snippets/**
→ "Add a new snippet" → isim: `kapida-odeme` → icerigi yapistirin → Kaydet

### 3.2 Backend URL'ini guncelleyin
Snippet'in ilk satirinda:
```liquid
{% assign backend_url = 'https://BACKEND-SUNUCUNUZ.com' %}
```
Buraya gercek backend URL'inizi yazin (ngrok URL veya deploy URL'i).

### 3.3 Urun sayfasina snippet'i ekleyin
`sections/main-product.liquid` dosyasini acin,
"Sepete Ekle" butonunun altina su satiri ekleyin:

```liquid
{% render 'kapida-odeme', product: product, variant: product.selected_or_first_available_variant %}
```

---

## Shopify Admin API Kapsamlari

Erisim tokeni olusturuken su izinleri verin:
- `write_orders` — siparis yaratmak icin
- `read_products` — urun bilgisi okumak icin

---

## Akis

```
Kullanici butona tiklar → Popup acilir → Form doldurulur
        ↓
POST /api/send-otp → Twilio → 6 haneli SMS kodu
        ↓
Kullanici kodu girer → POST /api/verify-otp
        ↓
Kod dogru → POST /api/create-order → Shopify siparis olusturulur
        ↓
Basari mesaji gosterilir
```